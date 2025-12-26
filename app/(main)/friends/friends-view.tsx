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

export interface Friend {
  name: string;
  url: string;
  desc?: string;
  avatar?: string; // 可选：如果手动填写了则优先使用
  maintainer?: string; // 新增：维护人字段
}

interface FriendsViewProps {
  friends: Friend[];
}

// 辅助函数：获取 Favicon
const getFaviconUrl = (url: string) => {
  try {
    const hostname = new URL(url).hostname;
    return `https://favicons.fuzqing.workers.dev/api/getFavicon?url=${hostname}&size=128`;
  } catch (e) {
    return '';
  }
};

export function FriendsView({ friends }: FriendsViewProps) {
  const { query } = useSearch();

  const filteredFriends = friends.filter((friend) => {
    const searchText = query.toLowerCase();
    return (
      friend.name.toLowerCase().includes(searchText) ||
      (friend.desc && friend.desc.toLowerCase().includes(searchText)) ||
      (friend.maintainer &&
        friend.maintainer.toLowerCase().includes(searchText))
    );
  });

  if (filteredFriends.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        没有找到相关友链
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {filteredFriends.map((friend) => {
        // 逻辑：如果数据里有 avatar 就用 data 里的，否则自动获取
        const avatarSrc = friend.avatar || getFaviconUrl(friend.url);

        return (
          <Link
            key={friend.url}
            href={friend.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block h-full"
          >
            <Card className="h-full transition-all hover:shadow-md hover:bg-accent/50 group">
              <CardHeader className="flex flex-row items-start gap-4 space-y-0 p-4">
                {/* 左侧头像 */}
                <Avatar className="h-10 w-10 border bg-background mt-1 shrink-0">
                  <AvatarImage src={avatarSrc} alt={friend.name} />
                  <AvatarFallback>
                    {friend.name.substring(0, 1).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                {/* 右侧内容 */}
                <div className="flex-1 min-w-0">
                  {' '}
                  {/* min-w-0 修复 flex 子项 truncate 失效问题 */}
                  <CardTitle className="text-base flex items-center gap-2 mb-1">
                    <span className="truncate">{friend.name}</span>
                    <ExternalLink className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-50 shrink-0" />
                  </CardTitle>
                  {friend.desc && (
                    <CardDescription className="line-clamp-2 text-xs mb-2">
                      {friend.desc}
                    </CardDescription>
                  )}
                  {/* 新增：维护人信息 */}
                  {friend.maintainer && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground/80 mt-auto">
                      <User className="h-3 w-3" />
                      <span>{friend.maintainer}</span>
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
