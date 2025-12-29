import { TableCell, TableRow } from '@/components/ui/table';
import { ExternalLink, Pin } from 'lucide-react';
import Link from 'next/link';

export interface Material {
  name: string;
  url: string;
  maintainer?: string;
  desc?: string;
  note?: string;
  pinned?: boolean;
}

export function MaterialRow({ item }: { item: Material }) {
  return (
    <TableRow>
      <TableCell className="font-medium">
        <div className="flex items-center gap-1 min-w-0">
          {item.pinned && (
            <Pin className="h-4 w-4 text-orange-500 fill-orange-500/20 shrink-0 rotate-45" />
          )}
          <Link
            href={item.url}
            target="_blank"
            className="hover:underline flex items-center gap-1 min-w-0"
            title={item.name}
          >
            <span className="truncate">{item.name}</span>
            <ExternalLink className="h-3 w-3 opacity-50 shrink-0" />
          </Link>
        </div>
      </TableCell>
      <TableCell className="hidden md:table-cell">{item.maintainer || '-'}</TableCell>
      <TableCell className="max-w-[200px] md:max-w-none">
        <div className="line-clamp-2 md:line-clamp-none">{item.desc || '-'}</div>
      </TableCell>
      <TableCell className="hidden lg:table-cell text-muted-foreground">
        {item.note || '-'}
      </TableCell>
    </TableRow>
  );
}
