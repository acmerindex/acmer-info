'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// 引入 Loader2 图标用于制作加载动画
import { Newspaper, Calendar, Loader2, ExternalLink } from 'lucide-react';

interface NewsItem {
  title: string;
  time: string;
  url: string;
}

export function NewsSection() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        // 添加时间戳参数防止缓存
        const res = await fetch(
          `https://pub-a8152ae99211488da6eb3d2d18ae59ee.r2.dev/acmerinfo-news.json?t=${new Date().getTime()}`
        );

        if (!res.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await res.json();
        const newsArray = Array.isArray(data) ? data : [data];
        setNews(newsArray);
      } catch (err) {
        console.error('Failed to fetch news:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  // 1. 修改加载状态：使用简单的文字和图标，不再依赖 Skeleton
  if (loading) {
    return (
      <Card className="mb-6 border-l-4 border-l-muted">
        <CardContent className="py-6 flex items-center justify-center text-muted-foreground text-sm">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          正在获取最新动态...
        </CardContent>
      </Card>
    );
  }

  // 2. 错误或无数据状态
  if (error || news.length === 0) {
    return (
      <Card className="mb-6 border-l-4 border-l-muted">
        <CardContent className="py-4 flex items-center gap-2 text-muted-foreground text-sm">
          <Newspaper className="h-4 w-4" />
          <span>暂无新闻</span>
        </CardContent>
      </Card>
    );
  }

  // 3. 正常渲染
  return (
    <Card className="mb-6 border-l-4 border-l-blue-500 shadow-sm transition-all hover:shadow-md">
      <CardHeader className="pb-3 pt-4 px-4 sm:px-6">
        <CardTitle className="text-lg flex items-center gap-2">
          <Newspaper className="h-5 w-5 text-blue-500" />
          新闻
        </CardTitle>
      </CardHeader>
      <CardContent className="grid gap-1 px-2 sm:px-6 pb-4">
        <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
          {news.map((item, index) => (
            <li
              key={index}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-4 p-2 rounded-md hover:bg-muted/50 transition-colors"
            >
              <Link
                href={item.url}
                target="_blank"
                className="hover:underline flex items-center gap-1 truncate"
                title={item.title}
              >
                {item.title}
                <ExternalLink className="h-3 w-3 opacity-50 shrink-0" />
              </Link>
              <div className="flex items-center text-xs text-muted-foreground shrink-0">
                <Calendar className="mr-1 h-3 w-3" />
                {item.time}
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
