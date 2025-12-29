import { Suspense } from 'react';
import materials from '@/data/materials.json';
import { MaterialsView } from './materials-view';

export const metadata = {
  title: '资料 | ACMer.info'
};

export default function MaterialsPage() {
  return (
    <Suspense
      fallback={
        <div className="p-4 text-muted-foreground">加载资料数据...</div>
      }
    >
      <MaterialsView materialsData={materials} />
    </Suspense>
  );
}
