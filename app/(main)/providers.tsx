'use client';

import { ThemeProvider } from 'next-themes';
import { TooltipProvider } from '@/components/ui/tooltip';
import { SearchProvider } from './search-context';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <SearchProvider>
        <TooltipProvider>{children}</TooltipProvider>
      </SearchProvider>
    </ThemeProvider>
  );
}
