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
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>群名称</TableHead>
              <TableHead>群号</TableHead>
              <TableHead>负责人</TableHead>
              <TableHead>描述</TableHead>
              <TableHead>备注</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {groups.map((group) => (
              <Group key={group.name} group={group} />
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
