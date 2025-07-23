import sys
category = sys.argv[1]
name = sys.argv[2]
groupid = sys.argv[3]
notes = sys.argv[4]
with open('content/groups.md', 'r', encoding='utf-8') as f:
    lines = f.readlines()
new_line = f"| {category} | {name} | {groupid} | {notes} |\n"
lines.insert(35, new_line)
del lines[38]
with open('content/groups.md', 'w', encoding='utf-8') as f:
    f.writelines(lines)