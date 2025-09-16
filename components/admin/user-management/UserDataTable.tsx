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
  Send,
} from "lucide-react";
import { UserWithAgent, SortConfig } from "@/types/admin/userManagement";
import { useUserManagement } from "@/hooks/useUserManagement";
import { ViewUserModal } from "./ViewUserModal";
import UserDataPagination from "./UserDataPagination";
import { UserDataTableControls } from "./UserDataTableControl";
import { DiscordUsername } from "./DiscordUsername";
import {
  ColumnVisibility,
  getMoodEmoji,
  getMoodColor,
  getHealthColor,
  getHealthBarColor,
  getLevelBadgeColor,
  getXPBadgeColor,
  getCreditsBadgeColor,
  formatUserTableDate,
  formatLastActive,
} from "@/lib/admin/user/userTableUtils";
import XIcon from "@/components/ui/icons/XIcon";

interface UserDataTableProps {
  users: UserWithAgent[];
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
    username: true,
    xp: true,
    level: true,
    mood: true,
    health: true,
    interests: true,
    lastActive: true,
    joinedDate: true,
    credits: true,
  });
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserWithAgent | null>(null);

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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
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
        {/* Single input: keep original placeholder, make it responsive */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            aria-label="Search users"
            placeholder="Search by email, interests, or social handles..."
            value={filterConfig.search}
            onChange={(e) => handleFilter({ search: e.target.value })}
            className="pl-10 w-full min-w-0 truncate placeholder:text-xs sm:placeholder:text-sm"
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

      {/* Data Table - Mobile Card Layout for small screens, Table for large screens */}
      <div className="block lg:hidden">
        {/* Mobile Card Layout */}
        <div className="space-y-3">
          {paginatedUsers.length > 0 ? (
            paginatedUsers.map((user) => (
              <div
                key={user.discord_id}
                className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 space-y-3"
              >
                {/* Username Section */}
                {columnVisibility.username && (
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium text-sm">
                        <DiscordUsername discordId={user.discord_id} fallback="Unknown User" />
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {user.twitter_handle && (
                          <span className="mr-2 flex items-center gap-1">
                            <XIcon className="h-3 w-3" />
                            {user.twitter_handle}
                          </span>
                        )}
                        {user.telegram_handle && (
                          <span className="flex items-center gap-1">
                            <Send className="h-3 w-3" />
                            {user.telegram_handle}
                          </span>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 cursor-pointer"
                      onClick={() => openViewModal(user)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                )}                {/* Stats Row */}
                <div className="flex flex-wrap gap-2">
                  {columnVisibility.xp && (
                    <Badge
                      variant="outline"
                      className={`text-xs ${getXPBadgeColor(
                        user.agent?.xp || 0,
                        users
                      )}`}
                    >
                      {user.agent?.xp?.toLocaleString() || "0"} XP
                    </Badge>
                  )}
                  {columnVisibility.level && (
                    <Badge
                      variant="outline"
                      className={`text-xs ${getLevelBadgeColor(
                        user.agent?.level || 1,
                        users
                      )}`}
                    >
                      Level {user.agent?.level || 1}
                    </Badge>
                  )}
                  {columnVisibility.credits && (
                    <Badge
                      variant="outline"
                      className={`text-xs ${getCreditsBadgeColor(
                        user.agent?.credits || 0,
                        users
                      )}`}
                    >
                      {user.agent?.credits?.toLocaleString() || "0"} Credits
                    </Badge>
                  )}
                  {columnVisibility.mood && user.agent?.mood && (
                    <Badge
                      variant="outline"
                      className={`text-xs ${getMoodColor(user.agent.mood)}`}
                    >
                      <span className="mr-1">
                        {getMoodEmoji(user.agent.mood)}
                      </span>
                      {user.agent.mood.charAt(0).toUpperCase() +
                        user.agent.mood.slice(1)}
                    </Badge>
                  )}
                </div>

                {/* Health Bar */}
                {columnVisibility.health &&
                  user.agent?.health !== undefined && (
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">
                          Health
                        </span>
                        <span
                          className={`text-xs font-medium ${getHealthColor(
                            user.agent.health
                          )}`}
                        >
                          {user.agent.health}/100
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${getHealthBarColor(
                            user.agent.health
                          )}`}
                          style={{ width: `${user.agent.health}%` }}
                        />
                      </div>
                    </div>
                  )}

                {/* Interests */}
                {columnVisibility.interests && user.interests && (
                  <div className="space-y-1">
                    <span className="text-xs text-muted-foreground">
                      Interests
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {user.interests
                        .split(",")
                        .slice(0, 2) // แสดงแค่ 2 ตัวแรกใน mobile
                        .map((interest, idx) => (
                          <Badge
                            key={idx}
                            variant="secondary"
                            className="text-xs truncate max-w-[120px]"
                            title={interest.trim()}
                          >
                            {interest.trim().length > 15
                              ? `${interest.trim().substring(0, 15)}...`
                              : interest.trim()}
                          </Badge>
                        ))}
                      {user.interests.split(",").length > 2 && (
                        <Badge
                          variant="secondary"
                          className="text-xs"
                          title={`${
                            user.interests.split(",").length - 2
                          } more interests`}
                        >
                          +{user.interests.split(",").length - 2} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                {/* Date Info */}
                <div className="flex justify-between text-xs text-muted-foreground pt-2 border-t border-gray-200 dark:border-gray-700">
                  {columnVisibility.lastActive && user.agent?.last_active && (
                    <span>
                      Last: {formatLastActive(user.agent.last_active)}
                    </span>
                  )}
                  {columnVisibility.joinedDate && user.agent?.created_at && (
                    <span>Joined: {formatUserTableDate(user.agent.created_at)}</span>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              {filterConfig.search || hasActiveFilters()
                ? "No users found matching your filters."
                : "No users found."}
            </div>
          )}
        </div>

        {/* Pagination for Mobile */}
        {totalPages > 1 && (
          <UserDataPagination
            pagination={pagination}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>

      {/* Desktop Table Layout */}
      <div className="hidden lg:block rounded-md border dark:border-gray-700">
        <Table>
          <TableHeader>
            <TableRow className="dark:border-gray-700">
              {columnVisibility.username && (
                <TableHead className="w-[250px]">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="h-auto px-0 py-2 font-medium text-foreground hover:text-foreground justify-start text-xs"
                      >
                        Username
                        {getSortIcon("username")}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-auto min-w-0">
                      <DropdownMenuItem onClick={() => handleSort("username")} className="p-2 justify-center">
                        <ChevronUp className="w-4 h-4" />
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleSort("username")} className="p-2 justify-center">
                        <ChevronDown className="w-4 h-4" />
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => onToggleColumnVisibility("username")}
                        className="p-2 justify-center"
                      >
                        <EyeOff className="w-4 h-4" />
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
                    <DropdownMenuContent align="start" className="w-auto min-w-0">
                      <DropdownMenuItem onClick={() => handleSort("agent.xp")} className="p-2 justify-center">
                        <ChevronUp className="w-4 h-4" />
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleSort("agent.xp")} className="p-2 justify-center">
                        <ChevronDown className="w-4 h-4" />
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => onToggleColumnVisibility("xp")}
                        className="p-2 justify-center"
                      >
                        <EyeOff className="w-4 h-4" />
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
                    <DropdownMenuContent align="start" className="w-auto min-w-0">
                      <DropdownMenuItem
                        onClick={() => handleSort("agent.level")}
                        className="p-2 justify-center"
                      >
                        <ChevronUp className="w-4 h-4" />
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleSort("agent.level")}
                        className="p-2 justify-center"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => onToggleColumnVisibility("level")}
                        className="p-2 justify-center"
                      >
                        <EyeOff className="w-4 h-4" />
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableHead>
              )}
              {columnVisibility.credits && (
                <TableHead>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        className="h-auto px-0 py-2 font-medium text-foreground hover:text-foreground justify-start text-xs"
                      >
                        Credits
                        {getSortIcon("agent.credits")}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-auto min-w-0">
                      <DropdownMenuItem
                        onClick={() => handleSort("agent.credits")}
                        className="p-2 justify-center"
                      >
                        <ChevronUp className="w-4 h-4" />
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleSort("agent.credits")}
                        className="p-2 justify-center"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => onToggleColumnVisibility("credits")}
                        className="p-2 justify-center"
                      >
                        <EyeOff className="w-4 h-4" />
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
                    <DropdownMenuContent align="start" className="w-auto min-w-0">
                      <DropdownMenuItem
                        onClick={() => handleSort("agent.mood")}
                        className="p-2 justify-center"
                      >
                        <ChevronUp className="w-4 h-4" />
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleSort("agent.mood")}
                        className="p-2 justify-center"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => onToggleColumnVisibility("mood")}
                        className="p-2 justify-center"
                      >
                        <EyeOff className="w-4 h-4" />
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
                    <DropdownMenuContent align="start" className="w-auto min-w-0">
                      <DropdownMenuItem
                        onClick={() => handleSort("agent.health")}
                        className="p-2 justify-center"
                      >
                        <ChevronUp className="w-4 h-4" />
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleSort("agent.health")}
                        className="p-2 justify-center"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => onToggleColumnVisibility("health")}
                        className="p-2 justify-center"
                      >
                        <EyeOff className="w-4 h-4" />
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
                    <DropdownMenuContent align="start" className="w-auto min-w-0">
                      <DropdownMenuItem
                        onClick={() => onToggleColumnVisibility("interests")}
                        className="p-2 justify-center"
                      >
                        <EyeOff className="w-4 h-4" />
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
                    <DropdownMenuContent align="start" className="w-auto min-w-0">
                      <DropdownMenuItem
                        onClick={() => handleSort("agent.last_active")}
                        className="p-2 justify-center"
                      >
                        <ChevronUp className="w-4 h-4" />
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleSort("agent.last_active")}
                        className="p-2 justify-center"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => onToggleColumnVisibility("lastActive")}
                        className="p-2 justify-center"
                      >
                        <EyeOff className="w-4 h-4" />
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
                    <DropdownMenuContent align="start" className="w-auto min-w-0">
                      <DropdownMenuItem
                        onClick={() => handleSort("agent.created_at")}
                        className="p-2 justify-center"
                      >
                        <ChevronUp className="w-4 h-4" />
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleSort("agent.created_at")}
                        className="p-2 justify-center"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => onToggleColumnVisibility("joinedDate")}
                        className="p-2 justify-center"
                      >
                        <EyeOff className="w-4 h-4" />
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
                  {columnVisibility.username && (
                    <TableCell className="font-medium">
                      <div>
                        <div className="font-medium">
                          <DiscordUsername discordId={user.discord_id} fallback="Unknown User" />
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {user.twitter_handle && (
                            <span className="mr-2 flex items-center gap-1">
                              <XIcon className="h-3 w-3" />
                              {user.twitter_handle}
                            </span>
                          )}
                          {user.telegram_handle && (
                            <span className="flex items-center gap-1">
                              <Send className="h-3 w-3" />
                              {user.telegram_handle}
                            </span>
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
                  {columnVisibility.credits && (
                    <TableCell>
                      <div className="flex justify-center">
                        <Badge
                          variant="outline"
                          className={getCreditsBadgeColor(
                            user.agent?.credits || 0,
                            users
                          )}
                        >
                          {user.agent?.credits?.toLocaleString() || "0"} Credits
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
                            {user.interests.split(",").length > 3 && (
                              <Badge
                                variant="secondary"
                                className="text-xs"
                                title={`${
                                  user.interests.split(",").length - 3
                                } more interests: ${user.interests
                                  .split(",")
                                  .slice(3)
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
                        formatUserTableDate(user.agent.created_at)
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                  )}
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0 cursor-pointer"
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
