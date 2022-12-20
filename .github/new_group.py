from json import loads
from os import environ

OPTIONS = [['contest', '比赛类'], ['game', '游戏类'], ['job', '工作相关群'], ['study', '知识学习相关群'], ['company', '公司群'], ['city', '地区群'], ['others', '奇怪の群']]

ISSUE_DATA = loads(environ['ISSUE_DATA'])

yaml = []
yaml.append(f'  - name: {ISSUE_DATA["群名"]}\n')
yaml.append(f'    groupid: {ISSUE_DATA["群号"]}\n' if "群号" in ISSUE_DATA else None)
yaml.append(f'    owner: {ISSUE_DATA["负责人"]}\n')
yaml.append(f'    notes: {ISSUE_DATA["描述"]}\n' if "描述" in ISSUE_DATA else None)
yaml = list(filter(None,yaml))
yaml_text = ''
for line in yaml:
  yaml_text += line

if ISSUE_DATA['类别'] == OPTIONS[len(OPTIONS) - 1][1]:
  with open('./data/groups.yaml','a+') as file:
    file.write(f'\n{yaml_text}')
else:
  file = open('./data/groups.yaml')
  s = file.read()
  file.close()
  for i in range(len(OPTIONS)):
    if ISSUE_DATA['类别'] == OPTIONS[i][1]:
      s = s.replace(f'\n{OPTIONS[i + 1][0]}',f'\n{yaml_text}\n{OPTIONS[i + 1][0]}')
      with open('./data/groups.yaml','w') as file:
        file.write(s)