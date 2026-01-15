#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const GROUPS_JSON_PATH = path.join(process.cwd(), 'data', 'groups.json');
const EXCLUDED_CATEGORIES = ['recent', 'pinned'];

/**
 * 获取最后三个跟添加群组有关的commit（排除自动更新的 commit）
 */
function getRecentGroupCommits() {
  try {
    // 获取修改 groups.json 的所有 commit
    const output = execSync(
      'git log --oneline --follow -- data/groups.json',
      { encoding: 'utf8' }
    );

    const commits = output
      .trim()
      .split('\n')
      .filter(line => line.length > 0)
      .map(line => {
        const [hash, ...rest] = line.split(' ');
        return {
          hash: hash,
          message: rest.join(' ')
        };
      })
      // 过滤掉自动更新的 commit
      .filter(commit => {
        const msg = commit.message.toLowerCase();
        return !msg.includes('auto update recent') && 
               !msg.includes('chore: auto update') &&
               !msg.includes('[bot]');
      });

    // 返回最后三个 commit
    return commits.slice(0, 3);
  } catch (error) {
    console.error('Error getting git commits:', error.message);
    return [];
  }
}

/**
 * 获取指定commit中groups.json的内容
 */
function getGroupsAtCommit(commitHash) {
  try {
    const content = execSync(
      `git show ${commitHash}:data/groups.json`,
      { encoding: 'utf8' }
    );
    return JSON.parse(content);
  } catch (error) {
    console.error(`Error getting groups at commit ${commitHash}:`, error.message);
    return null;
  }
}

/**
 * 获取两个版本之间的差异
 * - 所有 tab 的新增群组
 * - 比赛 tab 中已有群号的内容变更
 * - 忽略 recent，避免脚本自更新造成循环
 */
function stableGroupSnapshot(group) {
  const cloned = { ...group };
  delete cloned.pinned;

  const ordered = {};
  Object.keys(cloned).sort().forEach(key => {
    ordered[key] = cloned[key];
  });

  return JSON.stringify(ordered);
}

function hasGroupChanged(oldGroup, newGroup) {
  return stableGroupSnapshot(oldGroup) !== stableGroupSnapshot(newGroup);
}

function getParentHashes(commitHash) {
  try {
    const parents = execSync(`git show -s --pretty=%P ${commitHash}`, { encoding: 'utf8' })
      .trim()
      .split(' ')
      .filter(Boolean);
    return parents;
  } catch (error) {
    return [];
  }
}

function getBaseData(commitHash, parentHashes) {
  if (!parentHashes || parentHashes.length === 0) return null;

  if (parentHashes.length === 1) {
    return getGroupsAtCommit(parentHashes[0]);
  }

  try {
    const base = execSync(`git merge-base ${parentHashes.join(' ')}`, { encoding: 'utf8' }).trim();
    if (base) {
      return getGroupsAtCommit(base);
    }
  } catch (error) {
    // fall through
  }

  // fallback: first parent snapshot
  return getGroupsAtCommit(parentHashes[0]);
}

function collectCategories(datasets) {
  const cats = new Set();
  datasets.filter(Boolean).forEach(data => {
    Object.keys(data).forEach(key => {
      if (EXCLUDED_CATEGORIES.includes(key)) return;
      if (Array.isArray(data[key])) {
        cats.add(key);
      }
    });
  });
  return Array.from(cats);
}

function getUpdatedGroups(baseData, newData, parentDatas) {
  if (!newData) return [];
  const parents = Array.isArray(parentDatas) ? parentDatas.filter(Boolean) : [];
  const base = baseData || parents[0];
  if (!base) return [];

  const updates = [];

  const categories = collectCategories([newData, base, ...parents]);

  categories.forEach(cat => {

    const parentMaps = parents.map(parentData => {
      const parentList = Array.isArray(parentData[cat]) ? parentData[cat] : [];
      const map = new Map();
      parentList.forEach(group => {
        if (group && group.groupid) {
          map.set(String(group.groupid), group);
        }
      });
      return map;
    });

    const baseMap = (() => {
      const baseList = Array.isArray(base[cat]) ? base[cat] : [];
      const map = new Map();
      baseList.forEach(group => {
        if (group && group.groupid) {
          map.set(String(group.groupid), group);
        }
      });
      return map;
    })();

    const newList = Array.isArray(newData[cat]) ? newData[cat] : [];

    newList.forEach(group => {
      if (!group || !group.groupid) return;
      if (group.pinned) return; // pinned 不进入 recent

      const id = String(group.groupid);

      const existsInBase = baseMap.has(id);
      if (!existsInBase) {
        updates.push(group);
        return;
      }

      if (cat === 'contest') {
        const basePrev = baseMap.get(id);
        if (basePrev && hasGroupChanged(basePrev, group)) {
          updates.push(group);
          return;
        }

        const changedInAnyParent = parentMaps.some(map => {
          const prev = map.get(id);
          return prev && hasGroupChanged(prev, group);
        });
        if (changedInAnyParent) {
          updates.push(group);
        }
      }
    });
  });

  return updates;
}

/**
 * 从所有类别中收集群组
 */
function getAllGroupsFromData(data) {
  const allGroups = [];

  Object.keys(data || {}).forEach(cat => {
    if (EXCLUDED_CATEGORIES.includes(cat)) return;
    if (data[cat] && Array.isArray(data[cat])) {
      allGroups.push(...data[cat]);
    }
  });

  return allGroups;
}

/**
 * 主函数
 */
function main() {
  // 读取当前的 groups.json
  const currentContent = fs.readFileSync(GROUPS_JSON_PATH, 'utf8');
  const currentData = JSON.parse(currentContent);

  // 获取最后三个 commit
  const commits = getRecentGroupCommits();

  if (commits.length === 0) {
    console.log('No commits found for groups.json');
    return { changed: false, groups: null };
  }

  console.log(`Found ${commits.length} recent commits:`);
  commits.forEach((commit, index) => {
    console.log(`  ${index + 1}. ${commit.hash} - ${commit.message}`);
  });

  const compareGroupsByName = (a, b) => {
    const nameA = a.name || '';
    const nameB = b.name || '';
    const nameDiff = nameA.localeCompare(nameB, 'zh');
    if (nameDiff !== 0) return nameDiff;
    return String(a.groupid || '').localeCompare(String(b.groupid || ''), 'zh');
  };

  const allCurrentGroups = getAllGroupsFromData(currentData);
  const allCurrentGroupsMap = new Map();
  allCurrentGroups.forEach(g => {
    allCurrentGroupsMap.set(String(g.groupid), g);
  });

  const updatesByCommit = [];
  const processedIds = new Set();

  for (let i = 0; i < commits.length; i++) {
    const currentCommit = commits[i];

    const currentVersionData = getGroupsAtCommit(currentCommit.hash);
    const parentHashes = getParentHashes(currentCommit.hash);
    const parentDatas = parentHashes.map(getGroupsAtCommit).filter(Boolean);
    const baseData = getBaseData(currentCommit.hash, parentHashes);

    if (!currentVersionData) continue;

    const updatedGroups = getUpdatedGroups(baseData, currentVersionData, parentDatas);

    const uniqueGroups = updatedGroups.filter(group => {
      if (processedIds.has(group.groupid)) {
        return false;
      }
      processedIds.add(group.groupid);
      return true;
    }).map(group => {
      const fullInfo = allCurrentGroupsMap.get(group.groupid) || group;
      const { pinned, ...groupWithoutPinned } = fullInfo;
      if (pinned) {
        return null; // pinned 不进入 recent
      }
      return groupWithoutPinned;
    }).filter(Boolean);

    if (uniqueGroups.length > 0) {
      updatesByCommit.push({ commitIndex: i, groups: uniqueGroups });
    }
  }

  console.log(`\nFound ${updatesByCommit.reduce((sum, item) => sum + item.groups.length, 0)} candidate groups in the last ${commits.length} commits`);

  const pinnedGroups = (currentData.pinned || []);
  const recentGroups = [];

  for (const { commitIndex, groups } of updatesByCommit) {
    if (recentGroups.length >= 5) break;

    const remainingSlots = 5 - recentGroups.length;

    if (groups.length <= remainingSlots) {
      recentGroups.push(...groups);
      console.log(`  Commit ${commitIndex}: added ${groups.length} groups (total: ${recentGroups.length})`);
    } else {
      console.log(`  Commit ${commitIndex}: ${groups.length} groups would exceed limit, sorting by name and trimming`);
      const sorted = [...groups].sort(compareGroupsByName);
      recentGroups.push(...sorted.slice(0, remainingSlots));
      break;
    }
  }

  // 更新 JSON 数据
  currentData.pinned = pinnedGroups;
  currentData.recent = recentGroups;

  // 保存更新后的文件
  fs.writeFileSync(
    GROUPS_JSON_PATH,
    JSON.stringify(currentData, null, 2) + '\n'
  );

  console.log(`\nSuccessfully updated groups.json`);
  console.log(`  - pinned groups: ${pinnedGroups.length}`);
  console.log(`  - recent groups: ${recentGroups.length}`);

  // 返回是否有变化
  const hasChanges = recentGroups.length > 0;
  return { changed: hasChanges, groups: recentGroups };
}

const result = main();
