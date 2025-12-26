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
import { ContestRow, Contest } from './contests-row';

export function ContestsTable({
  contests,
  desc
}: {
  contests: Contest[];
  desc: string;
}) {
  if (contests.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>比赛列表</CardTitle>
          <CardDescription>{desc}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="py-8 text-center text-muted-foreground border border-dashed rounded-lg">
            暂无比赛
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>比赛列表</CardTitle>
        <CardDescription>{desc}</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>赛事名称</TableHead>
              <TableHead>类型</TableHead>
              <TableHead>开始时间</TableHead>
              <TableHead>时长</TableHead>
              <TableHead>榜单</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contests.map((item) => (
              <ContestRow
                key={`${item.name}-${item.startTime}`}
                contest={item}
              />
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
