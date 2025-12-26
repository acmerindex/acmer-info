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
              <TableHead className="min-w-[150px]">赛事名称</TableHead>
              <TableHead className="hidden sm:table-cell">类型</TableHead>
              <TableHead className="hidden md:table-cell min-w-[140px]">开始时间</TableHead>
              <TableHead className="hidden lg:table-cell">时长</TableHead>
              <TableHead className="w-[60px]">榜单</TableHead>
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
