import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GroupsTable } from './groups-table';
import groupsData from '@/data/groups.json'

export default async function MainPage() {
  const allGroups = [] as any;
  for(let i in groupsData) {
    allGroups.push(...groupsData[i])
  }
  console.log(allGroups)
  return (
    <Tabs defaultValue="all">
      <div className="flex items-center">
        <TabsList>
          <TabsTrigger value="all">所有</TabsTrigger>
          <TabsTrigger value="contest">赛站</TabsTrigger>
          <TabsTrigger value="algo">算法</TabsTrigger>
          <TabsTrigger value="tech">技术</TabsTrigger>
          <TabsTrigger value="job">找工</TabsTrigger>
          <TabsTrigger value="water">闲聊</TabsTrigger>
          <TabsTrigger value="company">公司</TabsTrigger>
          <TabsTrigger value="city">同城</TabsTrigger>
          <TabsTrigger value="game">游戏</TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value="all">
        <GroupsTable
          groups={allGroups}
        />
      </TabsContent>
    </Tabs>
  );
}
