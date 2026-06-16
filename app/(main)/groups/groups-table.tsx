'use client';

import {
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  Table
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Group } from './groups-row';

const cmp = (a: any, b: any) => {
  // 将 null 和 undefined 统一视为空字符串
  const strA = (a.groupid == null) ? '' : String(a.groupid);
  const strB = (b.groupid == null) ? '' : String(b.groupid);

  // 空字符串永远排在最后
  if (strA === '' && strB === '') return 0;
  if (strA === '') return 1;   // a 为空，a 放到 b 后面
  if (strB === '') return -1;  // b 为空，b 放到 a 后面

  if (strA.length !== strB.length) {
    // 长度较短的字符串排在前面
    return strA.length - strB.length;
  }

  // 字典序比较
  return strA.localeCompare(strB);
}


export function GroupsTable({ groups, desc }: { groups: any[]; desc: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>群组</CardTitle>
        <CardDescription>{desc}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto -mx-6 px-6 sm:mx-0 sm:px-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[120px] sm:max-w-none">群名称</TableHead>
                <TableHead className="min-w-[100px]">群号</TableHead>
                <TableHead className="hidden md:table-cell min-w-[80px]">负责人</TableHead>
                <TableHead className="hidden lg:table-cell">描述</TableHead>
                <TableHead className="hidden xl:table-cell">备注</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {groups.sort(cmp).map((group) => (
                <Group key={group.name} group={group} />
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
