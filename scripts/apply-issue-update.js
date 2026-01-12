#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const LABEL_TYPE_MAP = {
  'data:blog': 'blog',
  'data:contest': 'contest',
  'data:group': 'group',
  'data:material': 'material'
};

const GROUP_CATEGORY_MAP = {
  contest: 'contest',
  algo: 'algo',
  algo_comp: 'algo_comp',
  algo_indie: 'algo_indie',
  game: 'game',
  job: 'job',
  tech: 'tech',
  company: 'company',
  city: 'city',
  excited: 'excited',
  nsfw: 'nsfw',
  others: 'others',
  '赛事': 'contest',
  '算法': 'algo',
  '企业': 'algo_comp',
  '个人': 'algo_indie',
  '游戏': 'game',
  '找工': 'job',
  '技术': 'tech',
  '行业': 'company',
  '同城': 'city',
  '玩乐': 'excited',
  'nsfw': 'nsfw',
  'NSFW': 'nsfw',
  '其他': 'others'
};

const MATERIAL_CATEGORIES = new Set(['learning', 'tools', 'oj']);

const DATA_PATHS = {
  blog: path.join(process.cwd(), 'data', 'blogs.json'),
  contest: path.join(process.cwd(), 'data', 'contests.json'),
  group: path.join(process.cwd(), 'data', 'groups.json'),
  material: path.join(process.cwd(), 'data', 'materials.json')
};

function loadEvent() {
  const args = parseArgs();
  const eventPath = process.env.GITHUB_EVENT_PATH;

  if (eventPath && fs.existsSync(eventPath)) {
    const event = JSON.parse(fs.readFileSync(eventPath, 'utf8'));
    return { issue: event.issue || event, typeHint: null };
  }

  if (args.body && args.type) {
    const body = fs.readFileSync(path.resolve(args.body), 'utf8');
    return {
      issue: { body, labels: [], title: args.title || '' },
      typeHint: args.type
    };
  }

  throw new Error('Provide GITHUB_EVENT_PATH or --body <file> --type <blog|contest|group|material>.');
}

function parseArgs() {
  const map = {};
  const argv = process.argv.slice(2);

  for (let i = 0; i < argv.length; i += 2) {
    const key = argv[i];
    const value = argv[i + 1];
    if (!key || !value) break;
    if (key.startsWith('--')) {
      map[key.slice(2)] = value;
    }
  }

  return map;
}

function slugifyHeading(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^\p{L}\p{N}_-]+/gu, '')
    .replace(/^_+|_+$/g, '');
}

function parseIssueBody(body) {
  const fields = {};
  let current = null;

  body.split(/\r?\n/).forEach((rawLine) => {
    const line = rawLine.trimEnd();
    const heading = line.match(/^###\s+(.*)$/);

    if (heading) {
      current = slugifyHeading(heading[1]);
      fields[current] = '';
      return;
    }

    if (!current) return;
    const existing = fields[current];
    fields[current] = existing ? `${existing}\n${line}` : line;
  });

  Object.keys(fields).forEach((key) => {
    const trimmed = fields[key].trim();
    // 将 GitHub issue template 的 "No response" 占位符视为空字符串
    if (trimmed === '_No response_' || trimmed === 'No response') {
      fields[key] = '';
    } else {
      fields[key] = trimmed;
    }
  });

  return fields;
}

function detectDataType(issue, typeHint) {
  if (typeHint) return typeHint;

  const labels = (issue.labels || []).map((label) =>
    typeof label === 'string' ? label : label.name
  );

  for (const label of labels) {
    if (LABEL_TYPE_MAP[label]) return LABEL_TYPE_MAP[label];
  }

  const title = issue.title || '';
  if (/^\[blog\]/i.test(title)) return 'blog';
  if (/^\[contest\]/i.test(title)) return 'contest';
  if (/^\[group\]/i.test(title)) return 'group';
  if (/^\[material\]/i.test(title)) return 'material';

  throw new Error('Cannot detect data type from issue labels or title.');
}

function loadJson(filePath) {
  if (!fs.existsSync(filePath)) {
    throw new Error(`Data file not found: ${filePath}`);
  }
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function saveJson(filePath, data) {
  const content = `${JSON.stringify(data, null, 2)}\n`;
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated ${path.relative(process.cwd(), filePath)}`);
}

function requireField(fields, key, friendly) {
  if (!fields[key]) {
    throw new Error(`Missing field: ${friendly || key}`);
  }
  return fields[key].trim();
}

function upsert(list, matcher, entry, preferPrepend = false) {
  const index = list.findIndex(matcher);
  if (index >= 0) {
    list[index] = entry;
    return;
  }

  if (preferPrepend) {
    list.unshift(entry);
  } else {
    list.push(entry);
  }
}

function parseBoolean(value, defaultValue = false) {
  if (typeof value !== 'string') return defaultValue;
  const normalized = value.trim().toLowerCase();
  if (['yes', 'y', 'true', '1', '是'].includes(normalized)) return true;
  if (['no', 'n', 'false', '0', '否'].includes(normalized)) return false;
  return defaultValue;
}

function parseNumber(value, fieldName) {
  const num = Number(value);
  if (!Number.isFinite(num)) {
    throw new Error(`Invalid number for ${fieldName}`);
  }
  return num;
}

function parseStartTime(value) {
  const ms = Date.parse(value);
  if (Number.isNaN(ms)) {
    throw new Error('Invalid start time, please use ISO 8601, e.g. 2025-11-21T09:00:00+08:00');
  }
  return ms;
}

function isSameGroup(a, b) {
  const nameEqual = a.name?.toLowerCase() === b.name?.toLowerCase();
  const idEqual = a.groupid && b.groupid && String(a.groupid) === String(b.groupid);
  return Boolean(nameEqual || idEqual);
}

function handleBlog(fields) {
  const data = loadJson(DATA_PATHS.blog);

  const entry = {
    name: requireField(fields, slugifyHeading('博客名称'), '博客名称'),
    url: requireField(fields, slugifyHeading('博客链接'), '博客链接'),
    notes: fields[slugifyHeading('简介')] || undefined,
    avatar:
      fields[slugifyHeading('头像链接可选')]
      || fields.avatar
      || fields.avatar_url
      || fields.avatar_url_optional
      || undefined
  };

  const matcher = (item) =>
    item.url === entry.url || item.name.toLowerCase() === entry.name.toLowerCase();

  upsert(data, matcher, entry, true);
  saveJson(DATA_PATHS.blog, data);
}

function handleContest(fields) {
  const data = loadJson(DATA_PATHS.contest);

  const entry = {
    name: requireField(fields, slugifyHeading('比赛名称'), '比赛名称'),
    type: requireField(fields, slugifyHeading('比赛类型'), '比赛类型'),
    startTime: parseStartTime(requireField(fields, slugifyHeading('开始时间（iso_8601）'), '开始时间（ISO 8601）')),
    duration: parseNumber(
      requireField(fields, slugifyHeading('比赛时长（秒）'), '比赛时长（秒）'),
      'duration'
    ),
    contest_url: requireField(fields, slugifyHeading('比赛链接'), '比赛链接'),
    board_url: fields[slugifyHeading('榜单链接')] || undefined
  };

  const matcher = (item) => item.name.toLowerCase() === entry.name.toLowerCase();

  upsert(data, matcher, entry, true);
  data.sort((a, b) => b.startTime - a.startTime);

  saveJson(DATA_PATHS.contest, data);
}

function handleMaterial(fields) {
  const category = requireField(fields, slugifyHeading('类别'), '类别');
  if (!MATERIAL_CATEGORIES.has(category)) {
    throw new Error(`Invalid material category: ${category}`);
  }

  const data = loadJson(DATA_PATHS.material);
  const list = data[category];
  if (!Array.isArray(list)) {
    throw new Error(`materials.json missing category: ${category}`);
  }

  const entry = {
    name: requireField(fields, slugifyHeading('名称'), '名称'),
    url: requireField(fields, slugifyHeading('链接'), '链接'),
    maintainer: fields[slugifyHeading('维护者')] || undefined,
    desc: fields[slugifyHeading('描述')] || fields.description || fields.desc || undefined,
    note: fields[slugifyHeading('备注')] || fields.note || undefined
  };

  const matcher = (item) => item.url === entry.url || item.name.toLowerCase() === entry.name.toLowerCase();

  upsert(list, matcher, entry, true);
  saveJson(DATA_PATHS.material, data);
}

function handleGroup(fields) {
  const rawCategory = requireField(fields, slugifyHeading('群分类'), '群分类');
  const category = GROUP_CATEGORY_MAP[rawCategory];
  if (!category) {
    throw new Error(`Invalid group category: ${rawCategory}`);
  }

  const data = loadJson(DATA_PATHS.group);
  const list = data[category];
  if (!Array.isArray(list)) {
    throw new Error(`groups.json missing category: ${category}`);
  }

  const entry = {
    name: requireField(fields, slugifyHeading('群名称'), '群名称'),
    groupid: fields.group_id || fields.groupid || fields[slugifyHeading('群号')] || '',
    owner: requireField(fields, slugifyHeading('维护人'), '维护人'),
    notes: fields[slugifyHeading('简介')] || undefined,
    comments: fields[slugifyHeading('备注')] || undefined,
    pinned: parseBoolean(fields[slugifyHeading('是否置顶到近期添加')], false)
  };

  upsert(
    list,
    (item) => isSameGroup(item, entry),
    entry,
    true
  );

  data[category] = list;
  updateRecentGroups(data, entry);

  saveJson(DATA_PATHS.group, data);
}

function updateRecentGroups(groupsData, entry) {
  const currentRecent = Array.isArray(groupsData.recent) ? groupsData.recent : [];
  const pinnedEntries = currentRecent.filter((item) => item.pinned);
  const dynamicEntries = currentRecent.filter((item) => !item.pinned);
  const nextDynamic = dynamicEntries.filter((item) => !isSameGroup(item, entry));
  nextDynamic.unshift(entry);
  groupsData.recent = [...pinnedEntries, ...nextDynamic.slice(0, 3)];
  return;
}

function main() {
  const { issue, typeHint } = loadEvent();
  const fields = parseIssueBody(issue.body || '');
  const dataType = detectDataType(issue, typeHint);

  console.log(`Detected data type: ${dataType}`);

  switch (dataType) {
    case 'blog':
      handleBlog(fields);
      break;
    case 'contest':
      handleContest(fields);
      break;
    case 'group':
      handleGroup(fields);
      break;
    case 'material':
      handleMaterial(fields);
      break;
    default:
      throw new Error(`Unhandled data type: ${dataType}`);
  }
}

try {
  main();
} catch (error) {
  console.error(error.message || error);
  process.exitCode = 1;
}
