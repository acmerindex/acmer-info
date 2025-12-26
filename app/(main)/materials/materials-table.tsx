'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { MaterialRow, Material } from './materials-row';
import { useSearch } from '../search-context';

interface MaterialsTableProps {
  materials: Material[];
  desc: string;
}

export function MaterialsTable({ materials, desc }: MaterialsTableProps) {
  const { query } = useSearch();

  // 搜索过滤逻辑
  const filtered = materials.filter((item) => {
    const searchText = query.toLowerCase();
    return (
      item.name.toLowerCase().includes(searchText) ||
      (item.desc && item.desc.toLowerCase().includes(searchText)) ||
      (item.maintainer && item.maintainer.toLowerCase().includes(searchText))
    );
  });

  if (filtered.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        没有找到相关资料
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>资料列表</CardTitle>
        <CardDescription>{desc}</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">名称</TableHead>
              <TableHead className="w-[150px]">维护者/来源</TableHead>
              <TableHead>描述</TableHead>
              <TableHead className="w-[150px]">备注</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((item) => (
              <MaterialRow key={item.name} item={item} />
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
