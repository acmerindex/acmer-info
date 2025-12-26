'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GroupsTable } from './groups-table'; // 注意引用路径
import { Info, ChevronDown } from 'lucide-react';
import { useSearch } from '../search-context';
import { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

const TAB_CONFIGS = [
  { value: 'recent', label: '动态', desc: '置顶群聊与近期更新' },
  { value: 'contest', label: '赛事', desc: '官方赛事群' },
  { value: 'algo', label: '算法', desc: '' },
  { value: 'algo_comp', label: '企业', desc: '企业势算法竞赛交流群' },
  {
    value: 'algo_indie',
    label: '个人',
    desc: '个人势算法竞赛交流群（个人粉丝群）'
  },
  { value: 'game', label: '游戏', desc: '' },
  { value: 'job', label: '找工', desc: '' },
  { value: 'tech', label: '技术', desc: '' },
  { value: 'company', label: '行业', desc: '' },
  { value: 'city', label: '同城', desc: '' },
  { value: 'excited', label: '玩乐', desc: '吃喝玩乐' },
  { value: 'nsfw', label: 'NSFW', desc: 'NSFW' },
  { value: 'others', label: '其他', desc: '' }
];

export function GroupsView({ groupsData }: { groupsData: any }) {
  const { query } = useSearch(); // 从 Context 获取搜索词
  const safeQuery = query.toLowerCase(); // 确保安全转换
  const [activeTab, setActiveTab] = useState('recent');
  const filterGroups = (list: any[]) => {
    if (!safeQuery) return list;
    return list.filter((group) => {
      const searchContent = [
        group.name,
        group.owner,
        group.notes,
        group.groupid
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return searchContent.includes(safeQuery);
    });
  };

  const currentTabLabel = TAB_CONFIGS.find(tab => tab.value === activeTab)?.label || '动态';

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
      <div className="flex items-center justify-between">
        {/* Desktop tabs */}
        <div className="hidden md:block overflow-x-auto -mx-4 px-4 md:mx-0 md:px-0">
          <TabsList className="inline-flex h-auto bg-transparent p-0 gap-1">
            {TAB_CONFIGS.map(({ value, label }) => (
              <TabsTrigger
                key={value}
                value={value}
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground whitespace-nowrap"
              >
                {label}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        {/* Mobile dropdown */}
        <div className="md:hidden">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                {currentTabLabel}
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              {TAB_CONFIGS.map(({ value, label }) => (
                <DropdownMenuItem
                  key={value}
                  onClick={() => setActiveTab(value)}
                  className={activeTab === value ? "bg-accent" : ""}
                >
                  {label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {safeQuery && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 p-2 rounded-md">
          <Info className="h-4 w-4" />
          正在显示 "{query}" 的搜索结果 ({filterGroups.length} 条)
        </div>
      )}

      {TAB_CONFIGS.map(({ value, desc }) => {
        const originalGroups = groupsData[value] || [];
        const filteredGroups = filterGroups(originalGroups);

        return (
          <TabsContent key={value} value={value} className="m-0">
            <GroupsTable groups={filteredGroups} desc={desc} />
          </TabsContent>
        );
      })}
    </Tabs>
  );
}
