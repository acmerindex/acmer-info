import { Suspense } from 'react';
import groups from '@/data/groups.json';
import { GroupsView } from './groups-view';

export const metadata = {
  title: '群组 | ACMer.info',
};

export default function GroupsPage() {
  return (
    <Suspense fallback={<div className="p-4 text-muted-foreground">加载群组数据...</div>}>
      <GroupsView groupsData={groups} />
    </Suspense>
  );
}