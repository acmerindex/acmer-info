'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Link from 'next/link';
import { Info, ExternalLink } from 'lucide-react';
import { useSearch } from '../search-context';

interface Blog {
  name: string;
  url: string;
  notes?: string;
  avatar?: string;
}

export function BlogsView({ blogs }: { blogs: Blog[] }) {
  const { query } = useSearch(); // 使用 Context
  const safeQuery = query.toLowerCase();
  // 过滤逻辑：匹配 名字 或 Notes
  const filteredBlogs = safeQuery
    ? blogs.filter((blog) => {
        const searchContent = [
          blog.name,
          blog.notes,
        ]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        return searchContent.includes(safeQuery);
      })
    : blogs;

  return (
    <div className="grid gap-6">
      {safeQuery && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 p-2 rounded-md">
          <Info className="h-4 w-4" />
          正在显示 "{query}" 的搜索结果 ({filteredBlogs.length} 条)
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>选手博客</CardTitle>
          <p className="text-sm text-muted-foreground">
            收录活跃的 ACMer/OIer 博客
          </p>
        </CardHeader>
        <CardContent>
          {filteredBlogs.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredBlogs.map((blog, index) => (
                <Link
                  href={blog.url}
                  key={`${blog.url}-${index}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block h-full"
                >
                  <Card className="h-full hover:bg-muted/50 transition-colors flex flex-col">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start gap-2">
                         <div className="flex items-center gap-3 overflow-hidden">
                            <Avatar className="h-10 w-10 border border-muted shrink-0">
                                {blog.avatar && <AvatarImage src={blog.avatar} alt={blog.name} />}
                                <AvatarImage 
                                    src={`${process.env.NEXT_PUBLIC_IMAGE_API || ''}/getFavicon?domain=${new URL(blog.url).hostname}&size=128`} 
                                    alt={blog.name} 
                                />
                                <AvatarFallback>{blog.name[0]}</AvatarFallback>
                            </Avatar>
                            <CardTitle
                            className="text-base font-medium leading-none truncate"
                            title={blog.name}
                            >
                            {blog.name}
                            </CardTitle>
                        </div>
                        <ExternalLink className="h-4 w-4 text-muted-foreground shrink-0" />
                      </div>
                    </CardHeader>
                    <CardContent className="flex-1 flex flex-col gap-3">
                      {/* Notes: 简介描述 */}
                      {blog.notes && (
                        <p
                          className="text-sm text-muted-foreground line-clamp-2"
                          title={blog.notes}
                        >
                          {blog.notes}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center text-muted-foreground">
              没有找到匹配的博客
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
