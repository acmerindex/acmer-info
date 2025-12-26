import { PortalView } from './portal-view'; // 引用上一级目录的组件
import portals from '@/data/portals.json';

export const metadata = {
  title: '传送门 - ACMer.info',
  description: '传送门与社区推荐'
};

export default function PortalPage() {
  return (
    <div className="container max-w-6xl py-6 lg:py-10">
      <div className="flex flex-col items-start gap-4 md:flex-row md:justify-between md:gap-8 mb-8">
        <div className="flex-1 space-y-4">
          <h1 className="inline-block font-heading text-4xl tracking-tight lg:text-5xl">
            传送门
          </h1>
          <p className="text-xl text-muted-foreground">优质站点推荐</p>
        </div>
      </div>

      {/* 复用之前的视图组件 */}
      <PortalView portals={portals} />
    </div>
  );
}
