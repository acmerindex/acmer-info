import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GroupsTable } from './groups-table';
import groups from '@/data/groups.json';

const TAB_CONFIGS = [
  { value: 'contest', label: '赛事' },
  { value: 'algo', label: '算法' },
  { value: 'algo_comp', label: '企业' },
  { value: 'algo_indie', label: '个人' },
  { value: 'game', label: '游戏' },
  { value: 'job', label: '找工' },
  { value: 'tech', label: '技术' },
  { value: 'company', label: '公司' },
  { value: 'city', label: '同城' },
  { value: 'excited', label: '玩乐' },
  { value: 'others', label: '其他' }
];

export default async function MainPage() {
  return (
    <Tabs defaultValue="contest">
      <div className="flex items-center">
        <TabsList>
          {TAB_CONFIGS.map(({ value, label }) => (
            <TabsTrigger key={value} value={value}>
              {label}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>
      {TAB_CONFIGS.map(({ value }) => (
        <TabsContent key={value} value={value}>
          <GroupsTable groups={groups[value as keyof typeof groups] || []} />
        </TabsContent>
      ))}
    </Tabs>
  );
}