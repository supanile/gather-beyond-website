"use client";

import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  MoreHorizontal,
  Search,
  Filter,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  ChevronUp,
  ChevronDown,
  EyeOff,
} from "lucide-react";
import { UserWithAgent, SortConfig } from "@/types/admin/userManagement";
import { useUserManagement } from "@/hooks/useUserManagement";

interface UserDataTableProps {
  users: UserWithAgent[];
}

interface ColumnVisibility {
  email: boolean;
  xp: boolean;
  level: boolean;
  mood: boolean;
  health: boolean;
  interests: boolean;
  lastActive: boolean;
  joinedDate: boolean;
}

export const UserDataTable = ({ users }: UserDataTableProps) => {
  const {
    sortConfig,
    filterConfig,
    pagination,
    paginatedUsers,
    filterOptions,
    handleSort,
    handleFilter,
    handlePagination,
    resetFilters,
    totalPages,
  } = useUserManagement({ users });

  const [showFilters, setShowFilters] = useState(false);
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibility>({
    email: true,
    xp: true,
    level: true,
    mood: true,
    health: true,
    interests: true,
    lastActive: true,
    joinedDate: true,
  });

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatLastActive = (timestamp: number) => {
    const now = Date.now();
    const lastActive = timestamp * 1000;
    const diffMs = now - lastActive;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) {
      return `${diffDays}d ago`;
    } else if (diffHours > 0) {
      return `${diffHours}h ago`;
    } else {
      return "Just now";
    }
  };

  const getMoodEmoji = (mood: string) => {
    switch (mood.toLowerCase()) {
      case "happy":
        return "😊";
      case "neutral":
        return "😐";
      case "sad":
        return "😢";
      case "excited":
        return "🤩";
      case "angry":
        return "😠";
      case "love":
        return "😍";
      case "tired":
        return "😴";
      case "surprised":
        return "😲";
      default:
        return "😐";
    }
  };

  const getMoodColor = (mood: string) => {
    switch (mood.toLowerCase()) {
      case "happy":
        return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800";
      case "neutral":
        return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600";
      case "sad":
        return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800";
      case "excited":
        return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800";
      case "angry":
        return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800";
      case "love":
        return "bg-pink-100 text-pink-800 border-pink-200 dark:bg-pink-900/20 dark:text-pink-400 dark:border-pink-800";
      case "tired":
        return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800";
      case "surprised":
        return "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600";
    }
  };

  const getHealthColor = (health: number) => {
    if (health >= 80) return "text-green-600 dark:text-green-400";
    if (health >= 60) return "text-yellow-600 dark:text-yellow-400";
    if (health >= 40) return "text-orange-600 dark:text-orange-400";
    return "text-red-600 dark:text-red-400";
  };

  const getHealthBarColor = (health: number) => {
    if (health >= 80) return "bg-green-600 dark:bg-green-500";
    if (health >= 60) return "bg-yellow-600 dark:bg-yellow-500";
    if (health >= 40) return "bg-orange-600 dark:bg-orange-500";
    return "bg-red-600 dark:bg-red-500";
  };

  // ฟังก์ชันสำหรับกำหนดสี badge level
  const getLevelBadgeColor = (level: number, allUsers: UserWithAgent[]) => {
    const levels = allUsers.map((user) => user.agent?.level || 1);
    const minLevel = Math.min(...levels);
    const maxLevel = Math.max(...levels);

    if (level === minLevel && level === maxLevel) {
      // กรณีที่มี level เดียวกันทั้งหมด
      return "bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-600";
    } else if (level === minLevel) {
      // Level ต่ำสุด - สีม่วงอ่อน
      return "bg-violet-100 text-violet-800 border-violet-200 dark:bg-violet-900/20 dark:text-violet-400 dark:border-violet-800";
    } else if (level === maxLevel) {
      // Level สูงสุด - สีทอง/เหลืองทอง
      return "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800";
    } else {
      // Level อื่นๆ - สีปกติ
      return "bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-600";
    }
  };

  // ฟังก์ชันสำหรับกำหนดสี badge XP
  const getXPBadgeColor = (xp: number, allUsers: UserWithAgent[]) => {
    const xpValues = allUsers.map((user) => user.agent?.xp || 0);
    const minXP = Math.min(...xpValues);
    const maxXP = Math.max(...xpValues);

    if (xp === minXP && xp === maxXP) {
      // กรณีที่มี XP เดียวกันทั้งหมด
      return "bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-600";
    } else if (xp === minXP) {
      // XP ต่ำสุด - สีฟ้าอ่อน
      return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800";
    } else if (xp === maxXP) {
      // XP สูงสุด - สีเขียวทอง
      return "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800";
    } else {
      // XP อื่นๆ - สีปกติ
      return "bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-600";
    }
  };

  const getSortIcon = (field: SortConfig["field"]) => {
    if (sortConfig.field !== field) {
      return <ChevronsUpDown className="h-3 w-3" />;
    }
    return sortConfig.direction === "asc" ? (
      <ChevronUp className="h-3 w-3" />
    ) : (
      <ChevronDown className="h-3 w-3" />
    );
  };

  const onToggleColumnVisibility = (column: keyof ColumnVisibility) => {
    setColumnVisibility((prev) => ({
      ...prev,
      [column]: !prev[column],
    }));
  };

  const getTotalVisibleColumns = () => {
    return Object.values(columnVisibility).filter(Boolean).length + 1; // +1 for Actions column
  };

  const hasActiveFilters = () => {
    return (
      filterConfig.search !== "" ||
      filterConfig.mood.length > 0 ||
      filterConfig.interests.length > 0 ||
      filterConfig.healthRange[0] !== 0 ||
      filterConfig.healthRange[1] !== 100 ||
      filterConfig.levelRange[0] !== 1 ||
      filterConfig.levelRange[1] !== 100
    );
  };

  return (
    <div className="space-y-4">
      {/* Header Controls */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">User Management</h3>
            {hasActiveFilters() && (
              <Badge variant="secondary" className="text-xs">
                {pagination.total} filtered
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className={showFilters ? "bg-muted" : ""}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
            {hasActiveFilters() && (
              <Button variant="ghost" size="sm" onClick={resetFilters}>
                <X className="h-4 w-4 mr-2" />
                Clear
              </Button>
            )}
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search by email, interests, or social handles..."
            value={filterConfig.search}
            onChange={(e) => handleFilter({ search: e.target.value })}
            className="pl-10"
          />
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-muted/50 rounded-lg border dark:border-gray-700">
            <div>
              <label className="text-sm font-medium mb-2 block">Mood</label>
              <Select
                value={filterConfig.mood[0] || ""}
                onValueChange={(value) =>
                  handleFilter({ mood: value ? [value] : [] })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All moods" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All moods</SelectItem>
                  {filterOptions.moods.map((mood) => (
                    <SelectItem key={mood} value={mood}>
                      {getMoodEmoji(mood)}{" "}
                      {mood.charAt(0).toUpperCase() + mood.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Min Health
              </label>
              <Select
                value={filterConfig.healthRange[0].toString()}
                onValueChange={(value) =>
                  handleFilter({
                    healthRange: [parseInt(value), filterConfig.healthRange[1]],
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">0</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="75">75</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Min Level
              </label>
              <Select
                value={filterConfig.levelRange[0].toString()}
                onValueChange={(value) =>
                  handleFilter({
                    levelRange: [parseInt(value), filterConfig.levelRange[1]],
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Interest</label>
              <Select
                value={filterConfig.interests[0] || ""}
                onValueChange={(value) =>
                  handleFilter({ interests: value ? [value] : [] })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="All interests" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All interests</SelectItem>
                  {filterOptions.interests.slice(0, 20).map((interest) => (
                    <SelectItem key={interest} value={interest}>
                      {interest}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </div>

      {/* Data Table */}
      <div className="rounded-md border dark:border-gray-700">
        <Table>
          <TableHeader>
            <TableRow className="dark:border-gray-700">
              {columnVisibility.email && (
                <TableHead className="w-[250px]">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="h-auto px-0 py-2 font-medium text-foreground hover:text-foreground justify-start text-xs"
                      >
                        User Email
                        {getSortIcon("email")}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      <DropdownMenuItem onClick={() => handleSort("email")}>
                        <div className="flex items-center">
                          <ChevronUp className="w-4 h-4 mr-2" />
                          Asc
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleSort("email")}>
                        <div className="flex items-center">
                          <ChevronDown className="w-4 h-4 mr-2" />
                          Desc
                        </div>
                      </DropdownMenuItem>
                      <div className="bg-border -mx-1 my-1 h-px"></div>
                      <DropdownMenuItem
                        onClick={() => onToggleColumnVisibility("email")}
                      >
                        <div className="flex items-center">
                          <EyeOff className="w-4 h-4 mr-2" />
                          Hide
                        </div>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableHead>
              )}
              {columnVisibility.xp && (
                <TableHead>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="h-auto px-0 py-2 font-medium text-foreground hover:text-foreground justify-start text-xs"
                      >
                        XP
                        {getSortIcon("agent.xp")}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      <DropdownMenuItem onClick={() => handleSort("agent.xp")}>
                        <div className="flex items-center">
                          <ChevronUp className="w-4 h-4 mr-2" />
                          Asc
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleSort("agent.xp")}>
                        <div className="flex items-center">
                          <ChevronDown className="w-4 h-4 mr-2" />
                          Desc
                        </div>
                      </DropdownMenuItem>
                      <div className="bg-border -mx-1 my-1 h-px"></div>
                      <DropdownMenuItem
                        onClick={() => onToggleColumnVisibility("xp")}
                      >
                        <div className="flex items-center">
                          <EyeOff className="w-4 h-4 mr-2" />
                          Hide
                        </div>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableHead>
              )}
              {columnVisibility.level && (
                <TableHead>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="h-auto px-0 py-2 font-medium text-foreground hover:text-foreground justify-start text-xs"
                      >
                        Level
                        {getSortIcon("agent.level")}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      <DropdownMenuItem
                        onClick={() => handleSort("agent.level")}
                      >
                        <div className="flex items-center">
                          <ChevronUp className="w-4 h-4 mr-2" />
                          Asc
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleSort("agent.level")}
                      >
                        <div className="flex items-center">
                          <ChevronDown className="w-4 h-4 mr-2" />
                          Desc
                        </div>
                      </DropdownMenuItem>
                      <div className="bg-border -mx-1 my-1 h-px"></div>
                      <DropdownMenuItem
                        onClick={() => onToggleColumnVisibility("level")}
                      >
                        <div className="flex items-center">
                          <EyeOff className="w-4 h-4 mr-2" />
                          Hide
                        </div>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableHead>
              )}
              {columnVisibility.mood && (
                <TableHead>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="h-auto px-0 py-2 font-medium text-foreground hover:text-foreground justify-start text-xs"
                      >
                        Mood
                        {getSortIcon("agent.mood")}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      <DropdownMenuItem
                        onClick={() => handleSort("agent.mood")}
                      >
                        <div className="flex items-center">
                          <ChevronUp className="w-4 h-4 mr-2" />
                          Asc
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleSort("agent.mood")}
                      >
                        <div className="flex items-center">
                          <ChevronDown className="w-4 h-4 mr-2" />
                          Desc
                        </div>
                      </DropdownMenuItem>
                      <div className="bg-border -mx-1 my-1 h-px"></div>
                      <DropdownMenuItem
                        onClick={() => onToggleColumnVisibility("mood")}
                      >
                        <div className="flex items-center">
                          <EyeOff className="w-4 h-4 mr-2" />
                          Hide
                        </div>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableHead>
              )}
              {columnVisibility.health && (
                <TableHead>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="h-auto px-0 py-2 font-medium text-foreground hover:text-foreground justify-start text-xs"
                      >
                        Health
                        {getSortIcon("agent.health")}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      <DropdownMenuItem
                        onClick={() => handleSort("agent.health")}
                      >
                        <div className="flex items-center">
                          <ChevronUp className="w-4 h-4 mr-2" />
                          Asc
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleSort("agent.health")}
                      >
                        <div className="flex items-center">
                          <ChevronDown className="w-4 h-4 mr-2" />
                          Desc
                        </div>
                      </DropdownMenuItem>
                      <div className="bg-border -mx-1 my-1 h-px"></div>
                      <DropdownMenuItem
                        onClick={() => onToggleColumnVisibility("health")}
                      >
                        <div className="flex items-center">
                          <EyeOff className="w-4 h-4 mr-2" />
                          Hide
                        </div>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableHead>
              )}
              {columnVisibility.interests && (
                <TableHead className="w-[200px]">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="h-auto px-0 py-2 font-medium text-foreground hover:text-foreground justify-start text-xs"
                      >
                        Interests
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      <DropdownMenuItem
                        onClick={() => onToggleColumnVisibility("interests")}
                      >
                        <div className="flex items-center">
                          <EyeOff className="w-4 h-4 mr-2" />
                          Hide
                        </div>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableHead>
              )}
              {columnVisibility.lastActive && (
                <TableHead>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="h-auto px-0 py-2 font-medium text-foreground hover:text-foreground justify-start text-xs"
                      >
                        Last Active
                        {getSortIcon("agent.last_active")}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      <DropdownMenuItem
                        onClick={() => handleSort("agent.last_active")}
                      >
                        <div className="flex items-center">
                          <ChevronUp className="w-4 h-4 mr-2" />
                          Asc
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleSort("agent.last_active")}
                      >
                        <div className="flex items-center">
                          <ChevronDown className="w-4 h-4 mr-2" />
                          Desc
                        </div>
                      </DropdownMenuItem>
                      <div className="bg-border -mx-1 my-1 h-px"></div>
                      <DropdownMenuItem
                        onClick={() => onToggleColumnVisibility("lastActive")}
                      >
                        <div className="flex items-center">
                          <EyeOff className="w-4 h-4 mr-2" />
                          Hide
                        </div>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableHead>
              )}
              {columnVisibility.joinedDate && (
                <TableHead>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="h-auto px-0 py-2 font-medium text-foreground hover:text-foreground justify-start text-xs"
                      >
                        Joined Date
                        {getSortIcon("agent.created_at")}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start">
                      <DropdownMenuItem
                        onClick={() => handleSort("agent.created_at")}
                      >
                        <div className="flex items-center">
                          <ChevronUp className="w-4 h-4 mr-2" />
                          Asc
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleSort("agent.created_at")}
                      >
                        <div className="flex items-center">
                          <ChevronDown className="w-4 h-4 mr-2" />
                          Desc
                        </div>
                      </DropdownMenuItem>
                      <div className="bg-border -mx-1 my-1 h-px"></div>
                      <DropdownMenuItem
                        onClick={() => onToggleColumnVisibility("joinedDate")}
                      >
                        <div className="flex items-center">
                          <EyeOff className="w-4 h-4 mr-2" />
                          Hide
                        </div>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableHead>
              )}
              <TableHead className="w-[70px] text-xs">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedUsers.length > 0 ? (
              paginatedUsers.map((user) => (
                <TableRow
                  key={user.discord_id}
                  className="dark:border-gray-700"
                >
                  {columnVisibility.email && (
                    <TableCell className="font-medium">
                      <div>
                        <div className="font-medium">{user.email}</div>
                        <div className="text-sm text-muted-foreground">
                          {user.twitter_handle && (
                            <span className="mr-2">{user.twitter_handle}</span>
                          )}
                          {user.telegram_handle && (
                            <span>{user.telegram_handle}</span>
                          )}
                        </div>
                      </div>
                    </TableCell>
                  )}
                  {columnVisibility.xp && (
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={getXPBadgeColor(user.agent?.xp || 0, users)}
                      >
                        {user.agent?.xp?.toLocaleString() || "0"} XP
                      </Badge>
                    </TableCell>
                  )}
                  {columnVisibility.level && (
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={getLevelBadgeColor(
                          user.agent?.level || 1,
                          users
                        )}
                      >
                        Level {user.agent?.level || 1}
                      </Badge>
                    </TableCell>
                  )}
                  {columnVisibility.mood && (
                    <TableCell>
                      {user.agent?.mood ? (
                        <Badge
                          variant="outline"
                          className={getMoodColor(user.agent.mood)}
                        >
                          <span className="mr-1">
                            {getMoodEmoji(user.agent.mood)}
                          </span>
                          {user.agent.mood.charAt(0).toUpperCase() +
                            user.agent.mood.slice(1)}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                  )}
                  {columnVisibility.health && (
                    <TableCell>
                      {user.agent?.health !== undefined ? (
                        <div className="flex items-center gap-2">
                          <div
                            className={`font-medium ${getHealthColor(
                              user.agent.health
                            )}`}
                          >
                            {user.agent.health}/100
                          </div>
                          <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full ${getHealthBarColor(
                                user.agent.health
                              )}`}
                              style={{ width: `${user.agent.health}%` }}
                            />
                          </div>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                  )}
                  {columnVisibility.interests && (
                    <TableCell>
                      <div className="max-w-[200px]">
                        {user.interests ? (
                          <div className="flex flex-wrap gap-1">
                            {user.interests
                              .split(",")
                              .slice(0, 2)
                              .map((interest, idx) => (
                                <Badge
                                  key={idx}
                                  variant="secondary"
                                  className="text-xs"
                                >
                                  {interest.trim()}
                                </Badge>
                              ))}
                            {user.interests.split(",").length > 2 && (
                              <Badge variant="secondary" className="text-xs">
                                +{user.interests.split(",").length - 2} more
                              </Badge>
                            )}
                          </div>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </div>
                    </TableCell>
                  )}
                  {columnVisibility.lastActive && (
                    <TableCell>
                      {user.agent?.last_active ? (
                        <div className="text-sm">
                          {formatLastActive(user.agent.last_active)}
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                  )}
                  {columnVisibility.joinedDate && (
                    <TableCell>
                      {user.agent?.created_at ? (
                        formatDate(user.agent.created_at)
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                  )}
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow className="dark:border-gray-700">
                <TableCell
                  colSpan={getTotalVisibleColumns()}
                  className="h-24 text-center"
                >
                  <div className="text-muted-foreground">
                    {filterConfig.search || hasActiveFilters()
                      ? "No users found matching your filters."
                      : "No users found."}
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {(pagination.page - 1) * pagination.pageSize + 1} to{" "}
            {Math.min(pagination.page * pagination.pageSize, pagination.total)}{" "}
            of {pagination.total} results
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <span className="text-sm">Rows per page:</span>
              <Select
                value={pagination.pageSize.toString()}
                onValueChange={(value) =>
                  handlePagination({ pageSize: parseInt(value), page: 1 })
                }
              >
                <SelectTrigger className="w-16 h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePagination({ page: pagination.page - 1 })}
                disabled={pagination.page === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <div className="flex items-center gap-1">
                <span className="text-sm">
                  Page {pagination.page} of {totalPages}
                </span>
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePagination({ page: pagination.page + 1 })}
                disabled={pagination.page === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
