import { TableCell, TableRow } from '@/components/ui/table';

export function Group({ group }: { group: any }) {
  return (
    <TableRow>
      <TableCell>{group.name}</TableCell>
      <TableCell>{group.groupid}</TableCell>
      <TableCell>{group.owner}</TableCell>
      <TableCell>{group.notes}</TableCell>
      <TableCell>{group.commnets}</TableCell>
    </TableRow>
  );
}
