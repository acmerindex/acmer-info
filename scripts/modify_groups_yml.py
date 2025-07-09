import yaml
import sys

category = sys.argv[1]
name = sys.argv[2]
groupid = sys.argv[3]
owner = sys.argv[4]
notes = sys.argv[5]

category_to_section = {
    '赛站群': 'contest',
    '算竞交流类': 'algo',
    '企业势算竞交流类': 'algo_comp',
    '个人势算竞交流类': 'algo_indie',
    '游戏类': 'game',
    '工作相关群': 'job',
    '知识学习相关群': 'study',
    '公司群': 'company',
    '地区群': 'city',
    '奇怪の群': 'others'
}

section = category_to_section.get(category)
if not section:
    print(f"Unknown category: {category}")
    sys.exit(1)

with open('data/groups.yml', 'r', encoding='utf-8') as f:
    data = yaml.safe_load(f)

if section in data:
    data[section].append({
        'name': name,
        'groupid': groupid,
        'owner': owner,
        'notes': notes
    })
else:
    print(f"Section {section} not found in groups.yml")
    sys.exit(1)

with open('data/groups.yml', 'w', encoding='utf-8') as f:
    yaml.dump(data, f, allow_unicode=True)