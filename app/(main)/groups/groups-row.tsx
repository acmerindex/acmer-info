import { TableCell, TableRow } from '@/components/ui/table';
import { Pin } from 'lucide-react';
export function Group({ group }: { group: any }) {
  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-1">
          {group.pinned && (
            <Pin
              className="h-4 w-4 text-red-500 fill-orange-500/20 shrink-0 rotate-45"
              aria-label="置顶"
            />
          )}
          <span className="whitespace-nowrap">{group.name}</span>
        </div>
      </TableCell>
      <TableCell>{group.groupid}</TableCell>
      <TableCell>{group.owner}</TableCell>
      <TableCell>{group.notes}</TableCell>
      <TableCell>{group.comments}</TableCell>
    </TableRow>
  );
}
