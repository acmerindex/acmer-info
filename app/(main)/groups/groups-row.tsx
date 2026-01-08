import { TableCell, TableRow } from '@/components/ui/table';
import { Pin } from 'lucide-react';
export function Group({ group }: { group: any }) {
  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-1 min-w-0">
          {group.pinned && (
            <Pin
              className="h-4 w-4 text-red-500 fill-orange-500/20 shrink-0 rotate-45"
              aria-label="置顶"
            />
          )}
          <span className="whitespace-normal break-words sm:truncate">{group.name}</span>
        </div>
      </TableCell>
      <TableCell className="whitespace-nowrap">{group.groupid}</TableCell>
      <TableCell className="hidden md:table-cell">{group.owner}</TableCell>
      <TableCell className="hidden lg:table-cell">
        <div className="line-clamp-2">{group.notes}</div>
      </TableCell>
      <TableCell className="hidden xl:table-cell">{group.comments}</TableCell>
    </TableRow>
  );
}
