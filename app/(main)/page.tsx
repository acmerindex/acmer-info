import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Info,
  Megaphone,
  Wrench,
  Newspaper,
  Calendar,
  ExternalLink
} from 'lucide-react';
import Link from 'next/link';
import maintainers from '@/data/maintainers.json';
import announcements from '@/data/announcements.json';
import news from '@/data/news.json';

export default function HomePage() {
  return (
    <div className="container max-w-4xl py-6 lg:py-10 space-y-8">
      <div className="flex flex-col items-start gap-4 md:flex-row md:justify-between md:gap-8">
        <div className="flex-1 space-y-4">
          <h1 className="inline-block font-heading text-3xl tracking-tight sm:text-4xl lg:text-5xl">
            欢迎访问 ACMer.info
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground">
            一个致力于服务算法竞赛选手的导航站。
          </p>
        </div>
      </div>

      <hr className="my-4" />

      <div className="grid gap-6">
        <Card className="mb-6 border-l-4 border-l-green-500 shadow-sm transition-all hover:shadow-md">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Info className="h-5 w-5 text-green-500" />
              简介
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc list-inside space-y-1 text-sm sm:text-base text-muted-foreground min-w-0">
              <li>
                ACMer.info
                致力于整理和分享算法竞赛相关的群组、博客、比赛平台等资源。
              </li>
              <li>
                本站在 Github 开源，地址为
                <a href='https://github.com/acmerindex/acmer-info'>https://github.com/acmerindex/acmer-info</a>
              </li>
              <li>
                欢迎各位直接通过 Pull Request
                或者通过贡献页面提供的贡献方式参与内容建设。
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6 border-l-4 border-l-yellow-500 shadow-sm transition-all hover:shadow-md">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Megaphone className="h-5 w-5 text-yellow-500" />
            公告
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-1 text-sm sm:text-base text-muted-foreground min-w-0">
            {announcements.map((item: string, index: number) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card className="mb-6 border-l-4 border-l-blue-500 shadow-sm transition-all hover:shadow-md">
        <CardHeader className="pb-3 pt-4 px-4 sm:px-6">
          <CardTitle className="text-lg flex items-center gap-2">
            <Newspaper className="h-5 w-5 text-blue-500" />
            新闻
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-1 px-2 sm:px-6 pb-4">
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground min-w-0">
            {news.map((item: any, index: number) => (
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

      <div className="space-y-4">
        <h2 className="flex items-center gap-2 text-xl sm:text-2xl font-bold tracking-tight">
          <Wrench className="h-5 w-6 sm:h-6 sm:w-6" />
          ACMer Index Team
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {maintainers.map((maintainer: any) => (
            <Link
              href={maintainer.github}
              key={maintainer.github}
              target="_blank"
              rel="noopener noreferrer"
              className="group"
            >
              <Card className="flex flex-col items-center justify-center p-4 h-full hover:bg-muted/50 transition-colors">
                <Avatar className="h-16 w-16 sm:h-20 sm:w-20 mb-3 border-2 border-muted group-hover:border-primary transition-colors">
                  <AvatarImage
                    src={`https://api.qwedc001.cc/getGithubAvatar?username=${maintainer.github.split('/').pop()}`}
                    alt={maintainer.name}
                  />
                  <AvatarFallback>
                    {maintainer.name[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="font-medium text-center truncate w-full text-sm sm:text-base">
                  {maintainer.name}
                </span>
                <span className="text-xs text-muted-foreground truncate w-full text-center mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  @{maintainer.github.split('/').pop()}
                </span>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
