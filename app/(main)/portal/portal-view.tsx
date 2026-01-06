'use client';

import Link from 'next/link';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useSearch } from '../search-context';
// 1. 引入 User 图标用于显示维护人
import { ExternalLink, User } from 'lucide-react';

export interface Portal {
  name: string;
  url: string;
  desc?: string;
  avatar?: string; // 可选：如果手动填写了则优先使用
  maintainer?: string; // 新增：维护人字段
}

interface PortalViewProps {
  portals: Portal[];
}

// 辅助函数：获取 Favicon
const getFaviconUrl = (url: string) => {
  try {
    const hostname = new URL(url).hostname;
    return `https://api.qwedc001.cc/getFavicon?domain=${hostname}&size=128`;
  } catch (e) {
    return '';
  }
};

export function PortalView({ portals }: PortalViewProps) {
  const { query } = useSearch();

  const filteredPortals = portals.filter((portal) => {
    const searchText = query.toLowerCase();
    return (
      portal.name.toLowerCase().includes(searchText) ||
      (portal.desc && portal.desc.toLowerCase().includes(searchText)) ||
      (portal.maintainer &&
        portal.maintainer.toLowerCase().includes(searchText))
    );
  });

  if (filteredPortals.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        没有找到相关链接
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {filteredPortals.map((portal) => {
        // 逻辑：如果数据里有 avatar 就用 data 里的，否则自动获取
        const avatarSrc = portal.avatar || getFaviconUrl(portal.url);

        return (
          <Link
            key={portal.url}
            href={portal.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block h-full"
          >
            <Card className="h-full transition-all hover:shadow-md hover:bg-accent/50 group">
              <CardHeader className="flex flex-row items-start gap-4 space-y-0 p-4">
                {/* 左侧头像 */}
                <Avatar className="h-10 w-10 border bg-background dark:bg-white p-1 mt-1 shrink-0">
                  <AvatarImage src={avatarSrc} alt={portal.name} />
                  <AvatarFallback>
                    {portal.name.substring(0, 1).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                {/* 右侧内容 */}
                <div className="flex-1 min-w-0">
                  {' '}
                  {/* min-w-0 修复 flex 子项 truncate 失效问题 */}
                  <CardTitle className="text-base flex items-center gap-2 mb-1">
                    <span className="truncate">{portal.name}</span>
                    <ExternalLink className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-50 shrink-0" />
                  </CardTitle>
                  {portal.desc && (
                    <CardDescription className="line-clamp-2 text-xs mb-2">
                      {portal.desc}
                    </CardDescription>
                  )}
                  {/* 新增：维护人信息 */}
                  {portal.maintainer && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground/80 mt-auto">
                      <User className="h-3 w-3" />
                      <span>{portal.maintainer}</span>
                    </div>
                  )}
                </div>
              </CardHeader>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
