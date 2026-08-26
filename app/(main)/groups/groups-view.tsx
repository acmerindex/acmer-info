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
  { value: 'recent', label: '动态', desc: '置顶群聊与近期更新', hasSections: true },
  { value: 'contest', label: '赛事', desc: '官方赛事群' },
  { value: 'algo', label: '算法', desc: '' },
  { value: 'algo_comp', label: '企业', desc: '企业势算法竞赛交流群' },
  { value: 'algo_indie', label: '个人', desc: '个人势算法竞赛交流群（个人粉丝群）' },
  { value: 'tech', label: '技术', desc: '' },
  { value: 'game', label: '游戏', desc: '' },
  { value: 'job', label: '找工', desc: '' },
  { value: 'edu', label: '升学', desc: '志愿/考研/保研/留学' },
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

      {safeQuery && (() => {
        // 计算当前标签的搜索结果总数
        const currentTabConfig = TAB_CONFIGS.find(tab => tab.value === activeTab);
        let totalCount = 0;
        
        if (currentTabConfig?.hasSections && activeTab === 'recent') {
          totalCount = filterGroups(groupsData.pinned || []).length + filterGroups(groupsData.recent || []).length;
        } else {
          totalCount = filterGroups(groupsData[activeTab] || []).length;
        }
        
        return (
          <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 p-2 rounded-md">
            <Info className="h-4 w-4" />
            正在显示 "{query}" 的搜索结果 ({totalCount} 条)
          </div>
        );
      })()}

      {TAB_CONFIGS.map(({ value, desc, hasSections }) => {
        const originalGroups = groupsData[value] || [];
        const filteredGroups = filterGroups(originalGroups);

        // 特殊处理 recent 标签：分离 pinned 和 recent
        if (hasSections && value === 'recent') {
          const pinnedGroups = filterGroups(groupsData.pinned || []);
          const recentGroups = filterGroups(groupsData.recent || []);

          return (
            <TabsContent key={value} value={value} className="m-0 space-y-6">
              {pinnedGroups.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <span className="text-red-500">📌</span> 置顶群组
                  </h3>
                  <GroupsTable groups={pinnedGroups} desc="精选重要群组" />
                </div>
              )}
              {recentGroups.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <span>✨</span> 最近添加
                  </h3>
                  <GroupsTable groups={recentGroups} desc="自动收集最新群组" />
                </div>
              )}
              {pinnedGroups.length === 0 && recentGroups.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  暂无群组数据
                </div>
              )}
            </TabsContent>
          );
        }

        return (
          <TabsContent key={value} value={value} className="m-0">
            {filteredGroups.length > 0 ? (
              <GroupsTable groups={filteredGroups} desc={desc} />
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                暂无群组数据
              </div>
            )}
          </TabsContent>
        );
      })}
    </Tabs>
  );
}
