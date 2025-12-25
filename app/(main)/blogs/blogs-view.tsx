'use client';

import { useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Info, ExternalLink, User, School } from 'lucide-react';
import { useSearch } from '../search-context';

interface Blog {
  name: string;
  url: string;
  owner: string;
  school?: string;
  tags?: string[];
  notes?: string;
}

export function BlogsView({ blogs }: { blogs: Blog[] }) {
  const { query } = useSearch(); // 使用 Context
  const safeQuery = query.toLowerCase();
  // 过滤逻辑：匹配 名字、Owner、学校、标签 或 Notes
  const filteredBlogs = safeQuery
    ? blogs.filter((blog) => {
        const searchContent = [
          blog.name,
          blog.owner,
          blog.school,
          blog.notes,
          ...(blog.tags || [])
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
                        <CardTitle
                          className="text-base font-medium leading-none truncate"
                          title={blog.name}
                        >
                          {blog.name}
                        </CardTitle>
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

                      {/* 信息行：展示 Owner 和 School */}
                      <div className="mt-auto flex flex-col gap-1.5 pt-2">
                        {blog.owner && (
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <User className="h-3.5 w-3.5" />
                            <span className="truncate">{blog.owner}</span>
                          </div>
                        )}
                        {blog.school && (
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <School className="h-3.5 w-3.5" />
                            <span className="truncate">{blog.school}</span>
                          </div>
                        )}
                      </div>

                      {/* 标签行 */}
                      {blog.tags && blog.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-1">
                          {blog.tags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="text-xs px-1.5 py-0 h-5 font-normal"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
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
