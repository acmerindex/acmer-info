import Link from 'next/link';
import {
  Info,
  Users,
  LineChart,
  PanelLeft,
  Settings,
  BookOpen,
  HeartHandshake,
  Link2,
  FolderOpen
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
      </nav>
      <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
        <NavItem href="/friends" label="友链">
          <Link2 className="h-5 w-5" />
        </NavItem>
        <NavItem href="/contribute" label="贡献">
          <HeartHandshake className="h-5 w-5" />
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
          <Link
            href="/"
            className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
          >
            <Info className="h-5 w-5" />
            关于
          </Link>
          <Link
            href="/groups"
            className="flex items-center gap-4 px-2.5 text-foreground"
          >
            <Users className="h-5 w-5" />
            群组
          </Link>

          <Link
            href="/blogs"
            className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
          >
            <BookOpen className="h-5 w-5" />
            博客
          </Link>
          <Link
            href="/materials"
            className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
          >
            <FolderOpen className="h-5 w-5" />
            资料
          </Link>
          <Link
            href="/friends"
            className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
          >
            <Link2 className="h-5 w-5" />
            友链
          </Link>
          <Link
            href="/contribute"
            className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
          >
            <HeartHandshake className="h-5 w-5" />
            贡献
          </Link>
          {/* <Link
            href="#"
            className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
          >
            <LineChart className="h-5 w-5" />
            Settings
          </Link> */}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
