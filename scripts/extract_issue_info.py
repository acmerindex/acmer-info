import re
import sys

issue_body = sys.argv[1]

def extract_field(pattern, body):
    match = re.search(pattern, body, re.DOTALL)
    if match:
        return match.group(1).strip()
    return ""

category = extract_field(r'### 类别\n\n(.+?)(?:\s*\(.+?\))?\n\n', issue_body)
name = extract_field(r'### 群名\n\n(.+?)\n\n', issue_body)
groupid = extract_field(r'### 群号\n\n(.+?)\n\n', issue_body) or "N/A"
owner = extract_field(r'### 负责人\n\n(.+?)\n\n', issue_body)
notes = extract_field(r'### 描述\n\n(.+)', issue_body) or "无描述"

print(f"::set-output name=category::{category}")
print(f"::set-output name=name::{name}")
print(f"::set-output name=groupid::{groupid}")
print(f"::set-output name=owner::{owner}")
print(f"::set-output name=notes::{notes}")