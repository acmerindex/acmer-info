'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { MaterialsTable } from './materials-table'; // 注意引用路径
import { Info } from 'lucide-react';
import { useSearch } from '../search-context';

const TAB_CONFIGS = [
  { value: 'learning', label: '学习', desc: '教程、博客与知识库' },
  { value: 'tools', label: '工具', desc: '图论画板、数列查询等实用工具' },
  { value: 'oj', label: '测评', desc: '各大在线测评系统 (Online Judges)' }
];

export function MaterialsView({ materialsData }: { materialsData: any }) {
  const { query } = useSearch(); // 从 Context 获取搜索词
  const safeQuery = query.toLowerCase(); // 确保安全转换
  const filterMaterials = (list: any[]) => {
    if (!safeQuery) return list;
    return list.filter((material) => {
      const searchContent = [
        material.name,
        material.maintainer,
        material.desc,
        material.note
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return searchContent.includes(safeQuery);
    });
  };

  return (
    <Tabs defaultValue="learning" className="space-y-4">
      <div className="flex items-center justify-between">
        <TabsList className="h-auto flex-wrap justify-start gap-1 bg-transparent p-0">
          {TAB_CONFIGS.map(({ value, label }) => (
            <TabsTrigger
              key={value}
              value={value}
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              {label}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      {safeQuery && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 p-2 rounded-md">
          <Info className="h-4 w-4" />
          正在显示 "{query}" 的搜索结果
        </div>
      )}

      {TAB_CONFIGS.map(({ value, desc }) => {
        const originalMaterials = materialsData[value] || [];
        const filteredMaterials = filterMaterials(originalMaterials);

        return (
          <TabsContent key={value} value={value} className="m-0">
            <MaterialsTable materials={filteredMaterials} desc={desc} />
          </TabsContent>
        );
      })}
    </Tabs>
  );
}
