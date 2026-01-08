'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Info,
  Users,
  LineChart,
  PanelLeft,
  Settings,
  BookOpen,
  GitPullRequest,
  Link2,
  FolderOpen,
  Trophy
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip';
import { Analytics } from '@vercel/analytics/react';
import Providers from './providers';
import { NavItem } from './nav-item';
import { SearchInput } from './search';
import { ModeToggle } from '@/components/mode-toggle';
import { cn } from '@/lib/utils';
import { isNavLinkActive } from '@/lib/navigation-utils';

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <main className="flex min-h-screen w-full flex-col bg-muted/40">
        <DesktopNav />
        <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
          <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
            <MobileNav />
            <div className="flex flex-1 items-center justify-end gap-2">
              <SearchInput />
              <ModeToggle />
            </div>
          </header>
          <main className="grid flex-1 items-start gap-2 p-4 sm:px-6 sm:py-0 md:gap-4">
            {children}
          </main>
        </div>
        <Analytics />
      </main>
    </Providers>
  );
}

function DesktopNav() {
  return (
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
      <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
        <NavItem href="/" label="关于">
          <Info className="h-5 w-5" />
        </NavItem>

        <NavItem href="/groups" label="群组">
          <Users className="h-5 w-5" />
        </NavItem>

        <NavItem href="/blogs" label="博客">
          <BookOpen className="h-5 w-5" />
        </NavItem>
        <NavItem href="/materials" label="资料">
          <FolderOpen className="h-5 w-5" />
        </NavItem>
        <NavItem href="/contests" label="比赛">
          <Trophy className="h-5 w-5" />
        </NavItem>
      </nav>
      <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
        <NavItem href="/portal" label="传送门">
          <Link2 className="h-5 w-5" />
        </NavItem>
        <NavItem href="/contribute" label="贡献">
          <GitPullRequest className="h-5 w-5" />
        </NavItem>
        {/* <Tooltip>
          <TooltipTrigger asChild>
            <Link
              href="#"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
            >
              <Settings className="h-5 w-5" />
              <span className="sr-only">Settings</span>
            </Link>
          </TooltipTrigger>
          <TooltipContent side="right">Settings</TooltipContent>
        </Tooltip> */}
      </nav>
    </aside>
  );
}

function MobileNav() {
  const pathname = usePathname();
  
  const navItems = [
    { href: '/', label: '关于', icon: Info },
    { href: '/groups', label: '群组', icon: Users },
    { href: '/blogs', label: '博客', icon: BookOpen },
    { href: '/materials', label: '资料', icon: FolderOpen },
    { href: '/contests', label: '比赛', icon: Trophy },
    { href: '/portal', label: '传送门', icon: Link2 },
    { href: '/contribute', label: '贡献', icon: GitPullRequest }
  ];

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size="icon" variant="outline" className="sm:hidden">
          <PanelLeft className="h-5 w-5" />
          <span className="sr-only">Toggle Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="sm:max-w-xs">
        <nav className="grid gap-6 text-lg font-medium">
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive = isNavLinkActive(pathname, href);
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex items-center gap-4 px-2.5 min-h-[44px] transition-colors',
                  isActive
                    ? 'text-foreground font-semibold'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                <Icon className="h-5 w-5" />
                {label}
              </Link>
            );
          })}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
