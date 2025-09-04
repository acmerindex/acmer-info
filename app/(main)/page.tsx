import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GroupsTable } from './groups-table';
import groups from '@/data/groups.json';

const TAB_CONFIGS = [
  { value: 'contest', label: '赛事', desc: '官方赛事群' },
  { value: 'algo', label: '算法', desc: '' },
  { value: 'algo_comp', label: '企业', desc: '企业势算法竞赛交流群' },
  { value: 'algo_indie', label: '个人', desc: '个人势算法竞赛交流群（个人粉丝群）' },
  { value: 'game', label: '游戏', desc: '' },
  { value: 'job', label: '找工', desc: '' },
  { value: 'tech', label: '技术', desc: '' },
  { value: 'company', label: '行业', desc: '' },
  { value: 'city', label: '同城', desc: '' },
  { value: 'excited', label: '玩乐', desc: '吃喝玩乐' },
  { value: 'nsfw', label: 'NSFW', desc: 'NSFW' },
  { value: 'others', label: '其他', desc: '' }
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
      {TAB_CONFIGS.map(({ value, desc }) => (
        <TabsContent key={value} value={value}>
          <GroupsTable groups={groups[value as keyof typeof groups] || []} desc={desc} />
        </TabsContent>
      ))}
    </Tabs>
  );
}