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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Eye,
  Search,
  ChevronsUpDown,
  ChevronUp,
  ChevronDown,
  EyeOff,
} from "lucide-react";
import { UserWithAgent, SortConfig } from "@/types/admin/userManagement";
import { useUserManagement } from "@/hooks/useUserManagement";
import { ViewUserModal } from "./ViewUserModal";
import UserDataPagination from "./UserDataPagination";
import { UserDataTableControls } from "./UserDataTableControl";

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
    handleSort,
    handleFilter,
    handlePagination,
    totalPages,
  } = useUserManagement({ users });

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
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserWithAgent | null>(null);

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

  const getLevelBadgeColor = (level: number, allUsers: UserWithAgent[]) => {
    const levels = allUsers.map((user) => user.agent?.level || 1);
    const minLevel = Math.min(...levels);
    const maxLevel = Math.max(...levels);

    if (level === minLevel && level === maxLevel) {
      return "bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-600";
    } else if (level === minLevel) {
      return "bg-violet-100 text-violet-800 border-violet-200 dark:bg-violet-900/20 dark:text-violet-400 dark:border-violet-800";
    } else if (level === maxLevel) {
      return "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800";
    } else {
      return "bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-600";
    }
  };

  const getXPBadgeColor = (xp: number, allUsers: UserWithAgent[]) => {
    const xpValues = allUsers.map((user) => user.agent?.xp || 0);
    const minXP = Math.min(...xpValues);
    const maxXP = Math.max(...xpValues);

    if (xp === minXP && xp === maxXP) {
      return "bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-600";
    } else if (xp === minXP) {
      return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800";
    } else if (xp === maxXP) {
      return "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800";
    } else {
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

  const openViewModal = (user: UserWithAgent) => {
    setSelectedUser(user);
    setIsViewModalOpen(true);
  };

  const handlePageChange = (page: number) => {
    handlePagination({ page });
  };

  const handlePageSizeChange = (pageSize: number) => {
    handlePagination({ pageSize, page: 1 });
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

        {/* Table Controls */}
        <UserDataTableControls
          pagination={pagination}
          onPageSizeChange={handlePageSizeChange}
          columnVisibility={columnVisibility}
          onToggleColumnVisibility={onToggleColumnVisibility}
        />
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
                      <DropdownMenuSeparator />
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
                      <DropdownMenuSeparator />
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
                      <DropdownMenuSeparator />
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
                      <DropdownMenuSeparator />
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
                        className="h-auto px-0 py-2 ml-4 font-medium text-foreground hover:text-foreground justify-start text-xs"
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
                      <DropdownMenuSeparator />
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
                <TableHead className="w-[350px]">
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
                      <DropdownMenuSeparator />
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
                      <DropdownMenuSeparator />
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
                      <div className="flex justify-center">
                        <Badge
                          variant="outline"
                          className={getXPBadgeColor(
                            user.agent?.xp || 0,
                            users
                          )}
                        >
                          {user.agent?.xp?.toLocaleString() || "0"} XP
                        </Badge>
                      </div>
                    </TableCell>
                  )}
                  {columnVisibility.level && (
                    <TableCell>
                      <div className="flex justify-center">
                        <Badge
                          variant="outline"
                          className={getLevelBadgeColor(
                            user.agent?.level || 1,
                            users
                          )}
                        >
                          Level {user.agent?.level || 1}
                        </Badge>
                      </div>
                    </TableCell>
                  )}
                  {columnVisibility.mood && (
                    <TableCell>
                      {user.agent?.mood ? (
                        <div className="flex justify-center">
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
                        </div>
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
                      <div className="max-w-[320px] min-w-0">
                        {user.interests ? (
                          <div className="flex flex-wrap gap-1">
                            {user.interests
                              .split(",")
                              .slice(0, 3) // แสดงแค่ 3 ตัวแรก
                              .map((interest, idx) => (
                                <Badge
                                  key={idx}
                                  variant="secondary"
                                  className="text-xs truncate max-w-[500px]"
                                  title={interest.trim()}
                                >
                                  {interest.trim().length > 50
                                    ? `${interest.trim().substring(0, 50)}...`
                                    : interest.trim()}
                                </Badge>
                              ))}
                            {/* แก้ไขเงื่อนไขตรงนี้ - เปลี่ยนจาก length > 4 เป็น length > 3 */}
                            {user.interests.split(",").length > 3 && (
                              <Badge
                                variant="secondary"
                                className="text-xs"
                                title={`${
                                  user.interests.split(",").length - 3
                                } more interests: ${user.interests
                                  .split(",")
                                  .slice(3) // เปลี่ยนจาก slice(4) เป็น slice(3)
                                  .map((interest) => interest.trim())
                                  .join(", ")}`}
                              >
                                +{user.interests.split(",").length - 3} more
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
                    <TableCell className="pl-4">
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
                    <TableCell className="pl-4">
                      {user.agent?.created_at ? (
                        formatDate(user.agent.created_at)
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                  )}
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => openViewModal(user)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
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

        {/* Pagination */}
        {totalPages > 1 && (
          <UserDataPagination
            pagination={pagination}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>

      {/* View User Details Modal */}
      <ViewUserModal
        isOpen={isViewModalOpen}
        onOpenChange={setIsViewModalOpen}
        user={selectedUser}
        allUsers={users}
      />
    </div>
  );
};
