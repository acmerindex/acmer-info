'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ContestsTable } from './contests-table';
import { Info } from 'lucide-react';
import { useSearch } from '../search-context';
import { Contest } from './contests-row';

const TAB_CONFIGS = [
  {
    value: 'running',
    label: '正在进行',
    desc: '当前正在进行的比赛，点击奖杯图标跳转榜单'
  },
  {
    value: 'upcoming',
    label: '即将开始',
    desc: '即将到来的比赛日程，请提前做好准备'
  },
  { value: 'past', label: '往届比赛', desc: '历史比赛记录与榜单归档' }
];

export function ContestsView({ contestsData }: { contestsData: any[] }) {
  const { query } = useSearch();
  const safeQuery = query.toLowerCase();

  const [categorizedContests, setCategorizedContests] = useState<{
    [key: string]: Contest[];
  }>({
    running: [],
    upcoming: [],
    past: []
  });

  useEffect(() => {
    const now = Date.now();
    const contests = contestsData as Contest[];

    const running = contests.filter((c) => {
      const endTime = c.startTime + c.duration * 1000;
      return c.startTime <= now && now < endTime;
    });

    const upcoming = contests.filter((c) => c.startTime > now);

    const past = contests.filter((c) => {
      const endTime = c.startTime + c.duration * 1000;
      return now >= endTime;
    });

    running.sort((a, b) => b.startTime - a.startTime);
    upcoming.sort((a, b) => a.startTime - b.startTime);
    past.sort((a, b) => b.startTime - a.startTime);

    setCategorizedContests({ running, upcoming, past });
  }, [contestsData]);

  const filterContests = (list: Contest[]) => {
    if (!safeQuery) return list;
    return list.filter((item) => {
      const searchContent = [item.name, item.type]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      return searchContent.includes(safeQuery);
    });
  };

  const totalFilteredCount = TAB_CONFIGS.reduce((acc, { value }) => {
    return acc + filterContests(categorizedContests[value] || []).length;
  }, 0);

  return (
    <Tabs defaultValue="upcoming" className="space-y-4">
      <div className="flex items-center justify-between">
        <TabsList className="h-auto flex-wrap justify-start gap-1 bg-transparent p-0">
          {TAB_CONFIGS.map(({ value, label }) => (
            <TabsTrigger
              key={value}
              value={value}
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground gap-2"
            >
              {label}
              {value === 'running' &&
                categorizedContests.running.length > 0 && (
                  <span className="rounded-full bg-red-500 w-2 h-2 animate-pulse" />
                )}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      {safeQuery && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 p-2 rounded-md">
          <Info className="h-4 w-4" />
          正在显示 "{query}" 的搜索结果 ({totalFilteredCount} 条)
        </div>
      )}

      {TAB_CONFIGS.map(({ value, desc }) => {
        const originalList = categorizedContests[value] || [];
        const filteredList = filterContests(originalList);

        return (
          <TabsContent key={value} value={value} className="m-0">
            <ContestsTable contests={filteredList} desc={desc} />
          </TabsContent>
        );
      })}
    </Tabs>
  );
}
