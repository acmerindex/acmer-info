'use client';

import { useCallback, useState, useMemo } from 'react';
import { useTheme } from 'next-themes';
import { Sparkles, X, Check, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import type { Contest } from './contests-row';

type PreviewEntry = {
  school?: string;
  team_name?: string;
  team_rating?: number;
  type?: string;
  name1?: string;
  name2?: string;
  name3?: string;
  rating1?: number;
  rating2?: number;
  rating3?: number;
  rating1_color?: string;
  rating2_color?: string;
  rating3_color?: string;
  team_rating_color?: string;
  冠军?: number;
  亚军?: number;
  季军?: number;
  金牌?: number;
  银牌?: number;
  铜牌?: number;
};

const normalizeHexColor = (value?: string) => {
  if (!value) return undefined;
  const trimmed = value.trim().replace(/^#/, '');
  if (!trimmed) return undefined;
  return `#${trimmed}`;
};

const colorize = (color?: string, isDark?: boolean) => {
  const normalized = normalizeHexColor(color);
  if (!normalized || !isDark) return normalized;
  const lowerColor = normalized.toLowerCase();
  if (lowerColor === '#000000' || lowerColor === '#000') {
    return '#ffffff';
  }
  return normalized;
};

const formatRating = (value?: number) => {
  if (typeof value !== 'number' || Number.isNaN(value)) return '—';
  return Math.round(value).toString();
};

const sortPreviewData = (list: PreviewEntry[], sortBy: string) => {
  const medalKeys: Array<'冠军' | '亚军' | '季军' | '金牌' | '银牌' | '铜牌'> =
    ['冠军', '亚军', '季军', '金牌', '银牌', '铜牌'];

  return [...list].sort((a, b) => {
    if (sortBy === 'rating') {
      const ratingDiff = (b.team_rating ?? 0) - (a.team_rating ?? 0);
      if (ratingDiff !== 0) return ratingDiff;
      return (a.team_name ?? '').localeCompare(b.team_name ?? '');
    }

    if (sortBy === 'school') {
      return (a.school ?? '').localeCompare(b.school ?? '');
    }

    // 默认按奖牌排序
    for (const key of medalKeys) {
      const diff = (b[key] ?? 0) - (a[key] ?? 0);
      if (diff !== 0) return diff;
    }

    const ratingDiff = (b.team_rating ?? 0) - (a.team_rating ?? 0);
    if (ratingDiff !== 0) return ratingDiff;

    return (a.team_name ?? '').localeCompare(b.team_name ?? '');
  });
};

// 列的 flex 比例配置
// 桌面端：排名、学校、队伍、Rating、队员、冠军-铜牌
const COLUMN_FLEX = {
  desktop: [0.5, 2, 4, 0.65, 1, 0.4, 0.4, 0.4, 0.4, 0.4, 0.4],
  // 移动端：队伍、Rating、队员
  mobile: [2, 0.65, 1]
};

// 获取桌面端列的 flex 值
const getDesktopFlex = (colIndex: number) => COLUMN_FLEX.desktop[colIndex];

export function PreviewBoardButton({ contest }: { contest: Contest }) {
  const previewId = contest.preview_board!;
  const { theme, systemTheme } = useTheme();
  const isDark =
    theme === 'dark' || (theme === 'system' && systemTheme === 'dark');
  const [open, setOpen] = useState(false);
  const [rows, setRows] = useState<PreviewEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 筛选和排序状态
  const [showOfficial, setShowOfficial] = useState(true);
  const [showStar, setShowStar] = useState(true);
  const [selectedSchools, setSelectedSchools] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('medals');
  const [schoolSearchOpen, setSchoolSearchOpen] = useState(false);
  const [schoolSearchText, setSchoolSearchText] = useState('');
  const [teamSearchOpen, setTeamSearchOpen] = useState(false);
  const [teamSearchText, setTeamSearchText] = useState('');
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const [showMoreSchools, setShowMoreSchools] = useState(false);
  const [showMoreTeams, setShowMoreTeams] = useState(false);
  const [showMedalLines, setShowMedalLines] = useState(false);

  const VISIBLE_BADGES_LIMIT = 9;

  // 获取所有学校列表
  const allSchools = useMemo(() => {
    const schools = new Set<string>();
    rows.forEach((row) => {
      if (row.school) schools.add(row.school);
    });
    return Array.from(schools).sort();
  }, [rows]);

  // 过滤后的学校列表(用于搜索框显示)
  const filteredSchools = useMemo(() => {
    if (!schoolSearchText.trim()) return allSchools;
    const search = schoolSearchText.trim().toLowerCase();
    return allSchools.filter((school) => school.toLowerCase().includes(search));
  }, [allSchools, schoolSearchText]);

  // 根据搜索文本过滤队伍
  const filteredTeams = useMemo(() => {
    if (!teamSearchText.trim()) return [];
    const search = teamSearchText.trim().toLowerCase();
    return rows.filter((row) => {
      // 搜索队伍名称
      if (row.team_name?.toLowerCase().includes(search)) return true;
      // 搜索队员名字
      if (row.name1?.toLowerCase().includes(search)) return true;
      if (row.name2?.toLowerCase().includes(search)) return true;
      if (row.name3?.toLowerCase().includes(search)) return true;
      return false;
    });
  }, [rows, teamSearchText]);

  // 应用筛选和排序
  const filteredRows = useMemo(() => {
    let filtered = rows;

    // 按队伍类型筛选
    if (!showOfficial || !showStar) {
      filtered = filtered.filter((row) => {
        if (row.type === '正式' && !showOfficial) return false;
        if (row.type === '打星' && !showStar) return false;
        return true;
      });
    }

    // 按学校和队伍筛选（或关系）
    if (selectedSchools.length > 0 || selectedTeams.length > 0) {
      filtered = filtered.filter((row) => {
        const teamKey = `${row.school || ''}|${row.team_name || ''}`;

        // 如果学校被选中
        if (
          selectedSchools.length > 0 &&
          row.school &&
          selectedSchools.includes(row.school)
        ) {
          return true;
        }

        // 如果队伍被选中
        if (selectedTeams.length > 0 && selectedTeams.includes(teamKey)) {
          return true;
        }

        return false;
      });
    }

    // 排序
    return sortPreviewData(filtered, sortBy);
  }, [rows, showOfficial, showStar, selectedSchools, selectedTeams, sortBy]);

  // 计算原始排名（基于所有数据的排序）
  const originalRanks = useMemo(() => {
    const sorted = sortPreviewData(rows, sortBy);
    const rankMap = new Map<string, number>();
    sorted.forEach((row, idx) => {
      const key = `${row.school || ''}|${row.team_name || ''}`;
      rankMap.set(key, idx + 1);
    });
    return rankMap;
  }, [rows, sortBy]);

  // 计算奖牌线位置和rating（仅基于正式队伍）
  const medalLineInfo = useMemo(() => {
    if (!showMedalLines) return null;

    // 获取所有正式队伍
    const officialTeams = rows.filter((row) => row.type === '正式');
    const totalOfficial = officialTeams.length;

    if (totalOfficial === 0) return null;

    // 计算奖牌线位置（向上取整）
    const goldLine = Math.ceil(totalOfficial * 0.1);
    const silverLine = Math.ceil(totalOfficial * 0.2);
    const bronzeLine = Math.ceil(totalOfficial * 0.3);

    // 根据当前排序方式对正式队伍排序
    const sortedOfficial = sortPreviewData(officialTeams, sortBy);

    // 获取奖牌线上的队伍rating和颜色（索引是从0开始的）
    const goldTeam =
      goldLine > 0 && goldLine <= sortedOfficial.length
        ? sortedOfficial[goldLine - 1]
        : undefined;
    const silverTeam =
      silverLine > 0 && silverLine <= sortedOfficial.length
        ? sortedOfficial[silverLine - 1]
        : undefined;
    const bronzeTeam =
      bronzeLine > 0 && bronzeLine <= sortedOfficial.length
        ? sortedOfficial[bronzeLine - 1]
        : undefined;

    return {
      goldLine,
      silverLine,
      bronzeLine,
      goldRating: goldTeam?.team_rating,
      silverRating: silverTeam?.team_rating,
      bronzeRating: bronzeTeam?.team_rating,
      goldColor: goldTeam?.team_rating_color,
      silverColor: silverTeam?.team_rating_color,
      bronzeColor: bronzeTeam?.team_rating_color
    };
  }, [rows, sortBy, showMedalLines]);

  const loadPreview = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(`/contests/${previewId}.json`, {
        cache: 'no-store'
      });
      const payload = await res.json().catch(() => null);

      if (!res.ok || !payload) {
        throw new Error('加载失败');
      }

      const data = Array.isArray(payload)
        ? payload
        : Array.isArray((payload as any)?.data)
          ? (payload as any).data
          : [];

      setRows(data);
    } catch (err) {
      setRows([]);
      setError(err instanceof Error ? err.message : '加载失败');
    } finally {
      setIsLoading(false);
    }
  }, [previewId]);

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (nextOpen && rows.length === 0 && !isLoading) {
      loadPreview();
    }
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1">
          <Sparkles className="h-4 w-4" />
          前瞻
        </Button>
      </SheetTrigger>

      <SheetContent side="bottom" className="h-[90vh] flex flex-col inset-x-0">
        <SheetHeader className="border-b pb-2">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <SheetTitle>前瞻榜单</SheetTitle>
              <SheetDescription>
                预览 {contest.name} 的榜单表现
              </SheetDescription>
            </div>
            {/* 预测牌线信息 - 显示在标题右侧 */}
            {medalLineInfo &&
              sortBy === 'rating' &&
              filteredRows.length > 0 && (
                <div className="flex flex-col gap-1 mr-8">
                  <div className="text-xs text-muted-foreground">
                    预测牌线（正式队伍）
                  </div>
                  <div className="flex flex-wrap gap-3 text-xs items-center">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-sm bg-yellow-500"></div>
                      <span className="font-medium">金:</span>
                      <span
                        className="font-bold"
                        style={{
                          color: colorize(medalLineInfo.goldColor, isDark)
                        }}
                      >
                        {medalLineInfo.goldRating !== undefined
                          ? formatRating(medalLineInfo.goldRating)
                          : '—'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-sm bg-gray-400"></div>
                      <span className="font-medium">银:</span>
                      <span
                        className="font-bold"
                        style={{
                          color: colorize(medalLineInfo.silverColor, isDark)
                        }}
                      >
                        {medalLineInfo.silverRating !== undefined
                          ? formatRating(medalLineInfo.silverRating)
                          : '—'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-sm bg-amber-600"></div>
                      <span className="font-medium">铜:</span>
                      <span
                        className="font-bold"
                        style={{
                          color: colorize(medalLineInfo.bronzeColor, isDark)
                        }}
                      >
                        {medalLineInfo.bronzeRating !== undefined
                          ? formatRating(medalLineInfo.bronzeRating)
                          : '—'}
                      </span>
                    </div>
                  </div>
                </div>
              )}
          </div>
        </SheetHeader>

        {/* 筛选和排序功能区 */}
        <div className="border-b px-4 py-2 space-y-2">
          <div className="flex flex-wrap items-center gap-4">
            {/* 队伍类型筛选 */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-medium text-muted-foreground">
                队伍类型:
              </span>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="show-official"
                  checked={showOfficial}
                  onCheckedChange={(checked: boolean) =>
                    setShowOfficial(checked)
                  }
                />
                <label
                  htmlFor="show-official"
                  className="text-xs cursor-pointer"
                >
                  正式
                </label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="show-star"
                  checked={showStar}
                  onCheckedChange={(checked: boolean) => setShowStar(checked)}
                />
                <label htmlFor="show-star" className="text-xs cursor-pointer">
                  打星
                </label>
              </div>
            </div>

            {/* 学校筛选 */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-muted-foreground">
                学校:
              </span>
              <Popover
                open={schoolSearchOpen}
                onOpenChange={setSchoolSearchOpen}
              >
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="h-7 text-xs">
                    {selectedSchools.length > 0
                      ? `已选 ${selectedSchools.length} 所`
                      : '全部学校'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-0 z-[60]" align="start">
                  <div className="flex flex-col max-h-80">
                    {/* 搜索框和全选按钮 */}
                    <div className="p-2 border-b space-y-2">
                      <input
                        type="text"
                        placeholder="搜索学校..."
                        value={schoolSearchText}
                        onChange={(e) => setSchoolSearchText(e.target.value)}
                        className="w-full h-8 px-2 text-xs border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                      {filteredSchools.length > 0 && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full h-7 text-xs"
                          onClick={() => {
                            // 全选当前搜索到的学校
                            setSelectedSchools((prev) => {
                              const newSet = new Set(prev);
                              filteredSchools.forEach((school) =>
                                newSet.add(school)
                              );
                              return Array.from(newSet);
                            });
                          }}
                        >
                          <Check className="h-3 w-3 mr-1" />
                          全选搜索结果 ({filteredSchools.length})
                        </Button>
                      )}
                    </div>
                    {/* 学校列表 */}
                    <div
                      onWheel={(e) => e.stopPropagation()}
                      onTouchMove={(e) => e.stopPropagation()}
                      className="overflow-y-auto max-h-60 overscroll-contain scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent hover:scrollbar-thumb-muted-foreground/40"
                    >
                      {filteredSchools.length === 0 ? (
                        <div className="py-6 text-center text-sm text-muted-foreground">
                          未找到学校
                        </div>
                      ) : (
                        <div className="p-1">
                          {filteredSchools.map((school) => (
                            <div
                              key={school}
                              className="flex items-center gap-2 px-2 py-1.5 text-sm cursor-pointer rounded-sm hover:bg-accent hover:text-accent-foreground"
                              onClick={() => {
                                setSelectedSchools((prev) =>
                                  prev.includes(school)
                                    ? prev.filter((s) => s !== school)
                                    : [...prev, school]
                                );
                              }}
                            >
                              {/* ... 保持内部内容不变 ... */}
                              <div
                                className={`w-4 h-4 border rounded-sm flex items-center justify-center flex-shrink-0 ${
                                  selectedSchools.includes(school)
                                    ? 'bg-primary border-primary'
                                    : ''
                                }`}
                              >
                                {selectedSchools.includes(school) && (
                                  <Check className="h-3 w-3 text-primary-foreground" />
                                )}
                              </div>
                              <span className="text-xs flex-1">{school}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
              {selectedSchools.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-xs"
                  onClick={() => setSelectedSchools([])}
                >
                  清除
                </Button>
              )}
            </div>

            {/* 队伍筛选 */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-muted-foreground">
                队伍:
              </span>
              <Popover open={teamSearchOpen} onOpenChange={setTeamSearchOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="h-7 text-xs">
                    {selectedTeams.length > 0
                      ? `已选 ${selectedTeams.length} 支`
                      : '搜索队伍'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-96 p-0 z-[60]" align="start">
                  <div className="flex flex-col max-h-96">
                    {/* 搜索框 */}
                    <div className="p-2 border-b">
                      <input
                        type="text"
                        placeholder="队伍名称或队员姓名..."
                        value={teamSearchText}
                        onChange={(e) => setTeamSearchText(e.target.value)}
                        className="w-full h-8 px-2 text-xs border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                      />
                    </div>
                    {/* 队伍列表 */}
                    <div
                      onWheel={(e) => e.stopPropagation()}
                      onTouchMove={(e) => e.stopPropagation()}
                      className="overflow-y-auto max-h-80 overscroll-contain scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent hover:scrollbar-thumb-muted-foreground/40"
                    >
                      {teamSearchText.trim() === '' ? (
                        <div className="py-6 text-center text-sm text-muted-foreground">
                          请输入队伍名称或队员姓名进行搜索
                        </div>
                      ) : filteredTeams.length === 0 ? (
                        <div className="py-6 text-center text-sm text-muted-foreground">
                          未找到匹配的队伍
                        </div>
                      ) : (
                        <div className="p-1">
                          {filteredTeams.map((team, idx) => {
                            // ... 保持内部逻辑不变 ...
                            const teamKey = `${team.school || ''}|${team.team_name || ''}`;
                            const isSelected = selectedTeams.includes(teamKey);
                            return (
                              <div
                                key={`${teamKey}-${idx}`}
                                className="flex items-start gap-2 px-2 py-2 cursor-pointer rounded-sm hover:bg-accent hover:text-accent-foreground border-b last:border-b-0"
                                onClick={() => {
                                  setSelectedTeams((prev) =>
                                    prev.includes(teamKey)
                                      ? prev.filter((t) => t !== teamKey)
                                      : [...prev, teamKey]
                                  );
                                }}
                              >
                                {/* ... 保持内部内容不变 ... */}
                                <div
                                  className={`w-4 h-4 mt-0.5 border rounded-sm flex items-center justify-center flex-shrink-0 ${
                                    isSelected
                                      ? 'bg-primary border-primary'
                                      : ''
                                  }`}
                                >
                                  {isSelected && (
                                    <Check className="h-3 w-3 text-primary-foreground" />
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="text-xs font-medium truncate">
                                    {team.team_name || '未填写'}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {team.school || '未填写'} ·{' '}
                                    {team.type || '未知'}
                                  </div>
                                  <div className="text-xs text-muted-foreground mt-0.5">
                                    {[team.name1, team.name2, team.name3]
                                      .filter(Boolean)
                                      .join(', ') || '无队员信息'}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
              {selectedTeams.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-xs"
                  onClick={() => setSelectedTeams([])}
                >
                  清除
                </Button>
              )}
            </div>

            {/* 排序方式 */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-muted-foreground">
                排序:
              </span>
              <Select 
                value={sortBy} 
                onValueChange={(value) => {
                  setSortBy(value);
                  // 如果切换到按学校排序，关闭预测牌线
                  if (value === 'school' && showMedalLines) {
                    setShowMedalLines(false);
                  }
                }}
              >
                <SelectTrigger className="h-7 w-32 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="medals">奖牌优先</SelectItem>
                  <SelectItem value="rating">Rating优先</SelectItem>
                  <SelectItem value="school">按学校名称</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 显示预测牌线 - 放在最右侧 */}
            <div className="flex items-center gap-2 ml-auto">
              <Checkbox
                id="show-medal-lines"
                checked={showMedalLines}
                onCheckedChange={(checked: boolean) =>
                  setShowMedalLines(checked)
                }
                disabled={sortBy === 'school'}
              />
              <label
                htmlFor="show-medal-lines"
                className={`text-xs cursor-pointer ${sortBy === 'school' ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                显示预测牌线
              </label>
            </div>
          </div>

          {/* 已选学校标签 */}
          {selectedSchools.length > 0 && (
            <div className="flex flex-wrap gap-1 items-center">
              {selectedSchools.slice(0, VISIBLE_BADGES_LIMIT).map((school) => (
                <Badge key={school} variant="secondary" className="text-xs">
                  {school}
                  <X
                    className="ml-1 h-3 w-3 cursor-pointer"
                    onClick={() =>
                      setSelectedSchools((prev) =>
                        prev.filter((s) => s !== school)
                      )
                    }
                  />
                </Badge>
              ))}
              {selectedSchools.length > VISIBLE_BADGES_LIMIT && (
                <DropdownMenu
                  open={showMoreSchools}
                  onOpenChange={setShowMoreSchools}
                >
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-6 px-2 text-xs"
                    >
                      <MoreVertical className="h-3 w-3" />
                      {selectedSchools.length - VISIBLE_BADGES_LIMIT} 更多
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="start"
                    className="max-h-64 overflow-y-auto"
                  >
                    {selectedSchools
                      .slice(VISIBLE_BADGES_LIMIT)
                      .map((school) => (
                        <DropdownMenuItem
                          key={school}
                          onClick={() =>
                            setSelectedSchools((prev) =>
                              prev.filter((s) => s !== school)
                            )
                          }
                        >
                          <X className="h-3 w-3 mr-2" />
                          {school}
                        </DropdownMenuItem>
                      ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          )}

          {/* 已选队伍标签 */}
          {selectedTeams.length > 0 && (
            <div className="flex flex-wrap gap-1 items-center">
              {selectedTeams.slice(0, VISIBLE_BADGES_LIMIT).map((teamKey) => {
                const [school, teamName] = teamKey.split('|');
                return (
                  <Badge key={teamKey} variant="outline" className="text-xs">
                    {teamName} ({school})
                    <X
                      className="ml-1 h-3 w-3 cursor-pointer"
                      onClick={() =>
                        setSelectedTeams((prev) =>
                          prev.filter((t) => t !== teamKey)
                        )
                      }
                    />
                  </Badge>
                );
              })}
              {selectedTeams.length > VISIBLE_BADGES_LIMIT && (
                <DropdownMenu
                  open={showMoreTeams}
                  onOpenChange={setShowMoreTeams}
                >
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-6 px-2 text-xs"
                    >
                      <MoreVertical className="h-3 w-3" />
                      {selectedTeams.length - VISIBLE_BADGES_LIMIT} 更多
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="start"
                    className="max-h-64 overflow-y-auto"
                  >
                    {selectedTeams
                      .slice(VISIBLE_BADGES_LIMIT)
                      .map((teamKey) => {
                        const [school, teamName] = teamKey.split('|');
                        return (
                          <DropdownMenuItem
                            key={teamKey}
                            onClick={() =>
                              setSelectedTeams((prev) =>
                                prev.filter((t) => t !== teamKey)
                              )
                            }
                          >
                            <X className="h-3 w-3 mr-2" />
                            {teamName} ({school})
                          </DropdownMenuItem>
                        );
                      })}
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          )}
        </div>

        <div className="flex-1 overflow-hidden flex flex-col">
          {isLoading && (
            <div className="p-4 text-sm text-muted-foreground">加载中...</div>
          )}

          {error && (
            <div className="p-4 text-sm text-destructive">
              加载失败：{error}
            </div>
          )}

          {!isLoading && !error && filteredRows.length === 0 && (
            <div className="p-4 text-sm text-muted-foreground">
              {rows.length === 0 ? '暂无数据' : '没有符合筛选条件的队伍'}
            </div>
          )}

          {filteredRows.length > 0 && (
            <div className="flex-1 overflow-auto flex flex-col relative border-t scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent hover:scrollbar-thumb-muted-foreground/40">
              {/* 修改点 1: h-14 -> h-16 (增加高度到 64px)
                  修改点 2: bg-muted (使用实色背景，更接近图1效果)
                  修改点 3: text-sm (增大字号)
              */}
              <div className="sticky top-0 z-20 flex bg-muted border-b h-16 min-w-full min-h-[4.5rem] shadow-sm text-sm font-medium">
                <div
                  style={{ flex: getDesktopFlex(0) }}
                  className="hidden md:flex px-2 text-center items-center justify-center border-r"
                >
                  排名
                </div>
                <div
                  style={{ flex: getDesktopFlex(1) }}
                  className="hidden md:flex px-2 items-center justify-center border-r"
                >
                  学校
                </div>
                <div
                  style={{ flex: getDesktopFlex(2) }}
                  className="px-2 flex items-center justify-center border-r"
                >
                  队伍
                </div>
                <div
                  style={{ flex: getDesktopFlex(3) }}
                  className="px-2 text-center flex items-center justify-center border-r"
                >
                  Rating
                </div>
                <div
                  style={{ flex: getDesktopFlex(4) }}
                  className="px-2 flex items-center justify-center border-r"
                >
                  队员
                </div>
                {/* 奖牌列 */}
                <div
                  style={{ flex: getDesktopFlex(5) }}
                  className="hidden md:flex px-2 text-center items-center justify-center border-r"
                >
                  冠军
                </div>
                <div
                  style={{ flex: getDesktopFlex(6) }}
                  className="hidden md:flex px-2 text-center items-center justify-center border-r"
                >
                  亚军
                </div>
                <div
                  style={{ flex: getDesktopFlex(7) }}
                  className="hidden md:flex px-2 text-center items-center justify-center border-r"
                >
                  季军
                </div>
                <div
                  style={{ flex: getDesktopFlex(8) }}
                  className="hidden md:flex px-2 text-center items-center justify-center border-r"
                >
                  金牌
                </div>
                <div
                  style={{ flex: getDesktopFlex(9) }}
                  className="hidden md:flex px-2 text-center items-center justify-center border-r"
                >
                  银牌
                </div>
                <div
                  style={{ flex: getDesktopFlex(10) }}
                  className="hidden md:flex px-2 text-center items-center justify-center"
                >
                  铜牌
                </div>
              </div>

              {/* 表体内容 */}
              <div className="min-w-full bg-background">
                {filteredRows.map((row, idx) => {
                  const teamKey = `${row.school || ''}|${row.team_name || ''}`;
                  const originalRank = originalRanks.get(teamKey);
                  const hasFilter =
                    selectedSchools.length > 0 ||
                    selectedTeams.length > 0 ||
                    !showOfficial ||
                    !showStar;

                  // 计算该队伍在正式队伍中的排名（用于奖牌线标记）
                  let officialRank: number | undefined;
                  let medalColor: string | undefined;

                  if (showMedalLines && row.type === '正式') {
                    // 获取所有正式队伍并排序
                    const officialTeams = rows.filter((r) => r.type === '正式');
                    const sortedOfficial = sortPreviewData(
                      officialTeams,
                      sortBy
                    );

                    // 找到当前队伍在正式队伍中的排名
                    officialRank =
                      sortedOfficial.findIndex((r) => {
                        const rKey = `${r.school || ''}|${r.team_name || ''}`;
                        return rKey === teamKey;
                      }) + 1;

                    // 根据排名确定奖牌颜色
                    if (medalLineInfo && officialRank) {
                      if (officialRank <= medalLineInfo.goldLine) {
                        medalColor = '#FFD700'; // 金色
                      } else if (officialRank <= medalLineInfo.silverLine) {
                        medalColor = '#C0C0C0'; // 银色
                      } else if (officialRank <= medalLineInfo.bronzeLine) {
                        medalColor = '#CD7F32'; // 铜色
                      }
                    }
                  }

                  return (
                    <div
                      key={`${row.school}-${row.team_name}-${idx}`}
                      className="flex border-b last:border-b-0 hover:bg-muted/50 transition-colors min-h-[4.5rem]"
                    >
                      <div
                        style={{
                          flex: getDesktopFlex(0),
                          backgroundColor: medalColor,
                          color: medalColor ? '#000' : undefined
                        }}
                        className="hidden md:flex px-2 text-sm text-muted-foreground text-center items-center justify-center border-r"
                      >
                        {idx + 1}
                        {hasFilter &&
                          originalRank &&
                          originalRank !== idx + 1 && (
                            <span className="text-[10px] ml-0.5 opacity-70">
                              ({originalRank})
                            </span>
                          )}
                      </div>

                      <div
                        style={{ flex: getDesktopFlex(1) }}
                        className="hidden md:flex px-2 py-2 text-sm flex-col items-center justify-center border-r"
                      >
                        <div className="font-medium truncate leading-tight">
                          {row.school || '未填写'}
                        </div>
                        {row.type && (
                          <div className="text-xs text-muted-foreground mt-0.5">
                            {row.type}
                          </div>
                        )}
                      </div>

                      <div
                        style={{ flex: getDesktopFlex(2) }}
                        className="px-2 py-2 text-sm font-medium truncate flex items-center justify-center border-r"
                      >
                        {row.team_name || '未填写'}
                      </div>

                      <div
                        style={{ flex: getDesktopFlex(3) }}
                        className="px-2 py-2 text-sm text-center font-bold flex items-center justify-center border-r"
                      >
                        <span
                          style={{
                            color: colorize(row.team_rating_color, isDark)
                          }}
                        >
                          {formatRating(row.team_rating)}
                        </span>
                      </div>

                      <div
                        style={{ flex: getDesktopFlex(4) }}
                        className="px-2 py-2 text-xs border-r flex flex-col justify-center items-center text-center"
                      >
                        <div className="space-y-1">
                          {row.name1 && (
                            <div className="flex items-end gap-1.5 justify-center">
                              <span className="text-sm">{row.name1}</span>
                              {row.rating1 !== undefined && (
                                <span
                                  style={{
                                    color: colorize(row.rating1_color, isDark)
                                  }}
                                  className="font-semibold opacity-90"
                                >
                                  {formatRating(row.rating1)}
                                </span>
                              )}
                            </div>
                          )}
                          {row.name2 && (
                            <div className="flex items-end gap-1.5 justify-center">
                              <span className="text-sm">{row.name2}</span>
                              {row.rating2 !== undefined && (
                                <span
                                  style={{
                                    color: colorize(row.rating2_color, isDark)
                                  }}
                                  className="font-semibold opacity-90"
                                >
                                  {formatRating(row.rating2)}
                                </span>
                              )}
                            </div>
                          )}
                          {row.name3 && (
                            <div className="flex items-end gap-1.5 justify-center">
                              <span className="text-sm">{row.name3}</span>
                              {row.rating3 !== undefined && (
                                <span
                                  style={{
                                    color: colorize(row.rating3_color, isDark)
                                  }}
                                  className="font-semibold opacity-90"
                                >
                                  {formatRating(row.rating3)}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {[
                        { key: '冠军', idx: 5 },
                        { key: '亚军', idx: 6 },
                        { key: '季军', idx: 7 },
                        { key: '金牌', idx: 8 },
                        { key: '银牌', idx: 9 },
                        { key: '铜牌', idx: 10 }
                      ].map(({ key, idx: colIdx }) => (
                        <div
                          key={key}
                          style={{ flex: getDesktopFlex(colIdx) }}
                          className={`hidden md:flex px-2 py-2 text-sm text-center font-bold items-center justify-center ${colIdx < 10 ? 'border-r' : ''}`}
                        >
                          <span
                            className={
                              (row as any)[key] > 0
                                ? ''
                                : 'text-muted-foreground/20 font-normal'
                            }
                          >
                            {(row as any)[key] ?? 0}
                          </span>
                        </div>
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
