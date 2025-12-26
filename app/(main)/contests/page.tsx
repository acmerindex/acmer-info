import { Suspense } from 'react';
import contests from '@/data/contests.json';
import { ContestsView } from './contests-view';

export const metadata = {
  title: '比赛 | ACMer.info'
};

export default function ContestsPage() {
  return (
    <Suspense
      fallback={
        <div className="p-4 text-muted-foreground">加载比赛数据...</div>
      }
    >
      <ContestsView contestsData={contests} />
    </Suspense>
  );
}
