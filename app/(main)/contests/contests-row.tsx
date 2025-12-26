import { TableCell, TableRow } from '@/components/ui/table';
import { ExternalLink, Trophy, Clock, Calendar } from 'lucide-react';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

export interface Contest {
  name: string;
  type: string;
  startTime: number;
  duration: number;
  contest_url?: string;
  board_url?: string;
}

const formatDate = (ts: number) => {
  return new Date(ts).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
};

const formatDuration = (seconds: number) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (m === 0) return `${h}小时`;
  return `${h}小时${m}分`;
};

const getTypeColor = (type: string) => {
  switch (type) {
    case '决赛':
      return 'destructive';
    case '区域赛':
      return 'default';
    case '省赛':
      return 'secondary';
    case '校赛':
      return 'outline';
    default:
      return 'secondary';
  }
};

export function ContestRow({ contest }: { contest: Contest }) {
  return (
    <TableRow>
      <TableCell className="font-medium max-w-[250px]">
        <div className="flex items-center gap-2">
          {contest.contest_url ? (
            <Link
              href={contest.contest_url}
              target="_blank"
              className="hover:underline flex items-center gap-1 truncate text-blue-600 dark:text-blue-400"
              title={`前往比赛：${contest.name}`}
            >
              <span className="truncate">{contest.name}</span>
              <ExternalLink className="h-3 w-3 opacity-50 shrink-0" />
            </Link>
          ) : (
            <span className="truncate" title={contest.name}>
              {contest.name}
            </span>
          )}
        </div>
      </TableCell>

      <TableCell className="w-[100px]">
        {/* @ts-ignore */}
        <Badge
          variant={getTypeColor(contest.type)}
          className="whitespace-nowrap"
        >
          {contest.type}
        </Badge>
      </TableCell>

      <TableCell className="w-[180px]">
        <div className="flex items-center gap-1 text-muted-foreground whitespace-nowrap">
          <Calendar className="h-3 w-3" />
          {formatDate(contest.startTime)}
        </div>
      </TableCell>

      <TableCell className="w-[120px]">
        <div className="flex items-center gap-1 text-muted-foreground whitespace-nowrap">
          <Clock className="h-3 w-3" />
          {formatDuration(contest.duration)}
        </div>
      </TableCell>

      <TableCell className="w-[80px]">
        {contest.board_url ? (
          <Link href={contest.board_url} target="_blank" title="查看榜单">
            <Trophy className="h-4 w-4 text-orange-500 hover:text-orange-600 cursor-pointer transition-colors" />
          </Link>
        ) : (
          <Trophy
            className="h-4 w-4 text-muted-foreground/20"
            aria-disabled="true"
          />
        )}
      </TableCell>
    </TableRow>
  );
}
