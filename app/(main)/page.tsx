import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Megaphone, Wrench } from 'lucide-react';
import Link from 'next/link';
import maintainers from '@/data/maintainers.json';
import announcements from '@/data/announcements.json';

export default function HomePage() {
  return (
    <div className="container max-w-4xl py-6 lg:py-10 space-y-8">
      <div className="flex flex-col items-start gap-4 md:flex-row md:justify-between md:gap-8">
        <div className="flex-1 space-y-4">
          <h1 className="inline-block font-heading text-4xl tracking-tight lg:text-5xl">
            欢迎访问 ACMer.info
          </h1>
          <p className="text-xl text-muted-foreground">
            一个致力于服务算法竞赛选手的导航站。
          </p>
        </div>
      </div>

      <hr className="my-4" />

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>简介</CardTitle>
          </CardHeader>
          <CardContent>
            <p>
              ACMer.info
              致力于整理和分享算法竞赛相关的群组、博客、比赛平台等资源。
              <br />
              本站在 Github 开源，地址为
              https://github.com/acmerindex/acmer-info。
              <br />
              欢迎各位直接通过 Pull Reuqest
              或者通过贡献页面提供的贡献方式参与内容建设。
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-primary/20 bg-primary/5">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Megaphone className="h-5 w-5 text-primary" />
            最新公告
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
            {announcements.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="flex items-center gap-2 text-2xl font-bold tracking-tight">
          <Wrench className="h-6 w-6" />
          ACMer Index Team
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {maintainers.map((maintainer) => (
            <Link
              href={maintainer.github}
              key={maintainer.github}
              target="_blank"
              rel="noopener noreferrer"
              className="group"
            >
              <Card className="flex flex-col items-center justify-center p-4 h-full hover:bg-muted/50 transition-colors">
                <Avatar className="h-20 w-20 mb-3 border-2 border-muted group-hover:border-primary transition-colors">
                  <AvatarImage
                    src={`${maintainer.github}.png`}
                    alt={maintainer.name}
                  />
                  <AvatarFallback>
                    {maintainer.name[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="font-medium text-center truncate w-full">
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
