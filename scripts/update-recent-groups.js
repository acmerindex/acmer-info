#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const GROUPS_JSON_PATH = path.join(process.cwd(), 'data', 'groups.json');

/**
 * 获取最后三个跟添加群组有关的commit
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
 * 获取两个版本之间的差异，找出新增的群组
 */
function getAddedGroups(oldData, newData) {
  if (!oldData || !newData) return [];

  // 处理旧版本可能有 recent 字段，新版本的结构
  const oldCategories = ['algo', 'contest', 'game', 'job', 'tech', 'company', 'city', 'excited', 'nsfw', 'others', 'recent'];
  const newCategories = ['algo', 'contest', 'game', 'job', 'tech', 'company', 'city', 'excited', 'nsfw', 'others', 'pinned', 'recent'];

  const oldGroupIds = new Set();
  oldCategories.forEach(cat => {
    if (oldData[cat] && Array.isArray(oldData[cat])) {
      oldData[cat].forEach(g => {
        if (g && g.groupid) {
          oldGroupIds.add(g.groupid);
        }
      });
    }
  });

  const allNewGroups = [];
  newCategories.forEach(cat => {
    if (newData[cat] && Array.isArray(newData[cat])) {
      allNewGroups.push(...newData[cat]);
    }
  });

  return allNewGroups.filter(g => g && g.groupid && !oldGroupIds.has(g.groupid));
}

/**
 * 从所有类别中收集群组
 */
function getAllGroupsFromData(data) {
  const categories = ['algo', 'contest', 'game', 'job', 'tech', 'company', 'city', 'excited', 'nsfw', 'others'];
  const allGroups = [];
  
  categories.forEach(cat => {
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

  // 收集所有新增的群组
  const addedGroupIds = new Set();
  const addedGroups = [];

  for (let i = 0; i < commits.length; i++) {
    const currentCommit = commits[i];
    const previousCommit = commits[i + 1];

    const currentVersionData = getGroupsAtCommit(currentCommit.hash);
    const previousVersionData = previousCommit
      ? getGroupsAtCommit(previousCommit.hash)
      : {};

    if (!currentVersionData) continue;

    const newGroups = getAddedGroups(previousVersionData, currentVersionData);
    newGroups.forEach(group => {
      if (!addedGroupIds.has(group.groupid)) {
        addedGroupIds.add(group.groupid);
        addedGroups.push(group);
      }
    });
  }

  console.log(`\nFound ${addedGroups.length} groups added in the last 3 commits`);

  // 获取所有当前群组用于查找完整信息
  const allCurrentGroups = getAllGroupsFromData(currentData);
  const allCurrentGroupsMap = new Map();
  allCurrentGroups.forEach(g => {
    allCurrentGroupsMap.set(g.groupid, g);
  });

  // 保留 pinned 的群组
  const pinnedGroups = (currentData.pinned || []);

  // 限制 recent 为最多 5 个
  // 策略：优先保留最新 commit 的群组，然后向前遍历
  // 如果加入下一个 commit 的群组会超过 5 个，对剩余候选群组按名称排序取前面的
  
  let recentGroups = addedGroups.map(group => {
    const fullInfo = allCurrentGroupsMap.get(group.groupid) || group;
    const { pinned, ...groupWithoutPinned } = fullInfo;
    return groupWithoutPinned;
  });

  if (recentGroups.length > 5) {
    console.log(`\n⚠️  Too many groups (${recentGroups.length} > 5)`);
    
    const selectedGroups = [];
    const groupsByCommit = [];
    const processedGroupIds = new Set(); // 添加去重
    
    // 按 commit 顺序分组
    for (let i = 0; i < commits.length; i++) {
      const currentCommit = commits[i];
      const previousCommit = commits[i + 1];

      const currentVersionData = getGroupsAtCommit(currentCommit.hash);
      const previousVersionData = previousCommit
        ? getGroupsAtCommit(previousCommit.hash)
        : {};

      if (!currentVersionData) continue;

      const newGroupsAtThisCommit = getAddedGroups(previousVersionData, currentVersionData);
      
      // 去重：只保留未处理过的群组
      const uniqueGroups = newGroupsAtThisCommit.filter(group => {
        if (processedGroupIds.has(group.groupid)) {
          return false;
        }
        processedGroupIds.add(group.groupid);
        return true;
      });
      
      const groupsWithInfo = uniqueGroups.map(group => {
        const fullInfo = allCurrentGroupsMap.get(group.groupid) || group;
        const { pinned, ...groupWithoutPinned } = fullInfo;
        return groupWithoutPinned;
      });

      groupsByCommit.push({
        commitIndex: i,
        groups: groupsWithInfo
      });
    }

    // 从最新的 commit 开始，逐个加入群组
    let exceeded = false;
    for (const { commitIndex, groups } of groupsByCommit) {
      const remainingSlots = 5 - selectedGroups.length;
      
      if (groups.length <= remainingSlots) {
        // 这个 commit 的所有群组都能加入
        selectedGroups.push(...groups);
        console.log(`  Commit ${commitIndex}: added ${groups.length} groups (total: ${selectedGroups.length})`);
      } else {
        // 这个 commit 的群组会超过限制
        if (commitIndex === 0) {
          // 最新 commit 的群组：如果超过 5 个，按名称排序取前 5 个
          console.log(`  Commit ${commitIndex}: ${groups.length} groups in newest commit, sorting by name to select top 5`);
          const sorted = groups.sort((a, b) => a.name.localeCompare(b.name, 'zh'));
          selectedGroups.push(...sorted.slice(0, 5));
        } else {
          // 非最新 commit：只从当前 commit 选择足够填满 5 个的群组
          console.log(`  Commit ${commitIndex}: ${groups.length} groups would exceed limit, sorting this commit's groups by name`);
          const sorted = groups.sort((a, b) => a.name.localeCompare(b.name, 'zh'));
          const toAdd = Math.min(sorted.length, remainingSlots);
          selectedGroups.push(...sorted.slice(0, toAdd));
        }
        exceeded = true;
        break;
      }

      if (selectedGroups.length >= 5) {
        break;
      }
    }

    // 使用 selectedGroups 作为最终结果
    recentGroups = selectedGroups;
    
    console.log(`  Final selection: ${recentGroups.length} groups`);
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
