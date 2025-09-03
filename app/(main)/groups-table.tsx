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
import { Group } from './groups';

export function GroupsTable({
  groups,
}: {
  groups: any[];
}) {

  return (
    <Card>
      <CardHeader>
        <CardTitle>群组</CardTitle>
        <CardDescription>
          我也不知道写点啥，反正先写点副标题
        </CardDescription>
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
