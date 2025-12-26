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
                <TableHead className="min-w-[120px]">群名称</TableHead>
                <TableHead className="min-w-[100px]">群号</TableHead>
                <TableHead className="hidden md:table-cell min-w-[80px]">负责人</TableHead>
                <TableHead className="hidden lg:table-cell">描述</TableHead>
                <TableHead className="hidden xl:table-cell">备注</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {groups.map((group) => (
                <Group key={group.name} group={group} />
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
