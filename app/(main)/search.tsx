'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useSearch } from './search-context';

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export function SearchInput() {
  const pathname = usePathname();
  const { setQuery } = useSearch();
  const [term, setTerm] = useState('');
  const debouncedTerm = useDebounce(term, 300);
  useEffect(() => {
    setQuery(debouncedTerm);
  }, [debouncedTerm, setQuery]);

  if (pathname === '/' || pathname === '/contribute') {
    return null;
  }

  return (
    <div className="relative ml-auto flex-1 md:grow-0">
      <Search className="absolute left-2.5 top-[.75rem] h-4 w-4 text-muted-foreground" />
      <Input
        name="q"
        type="search"
        placeholder="搜索当前页面..."
        value={term}
        onChange={(e) => setTerm(e.target.value)}
        className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
      />
    </div>
  );
}
