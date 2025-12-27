import { Suspense } from 'react';
import blogsData from '@/data/blogs.json';
import { BlogsView } from './blogs-view';

export const metadata = {
  title: '选手博客 | ACMer.info'
};

export default function BlogsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">加载博客列表...</div>}>
      <BlogsView blogs={blogsData} />
    </Suspense>
  );
}
