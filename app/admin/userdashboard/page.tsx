"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Users,
  Crosshair,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Send,
  ArrowUp,
  ArrowDown,
  Filter,
  CheckIcon,
  Zap,
  UserCog,
  Server,
  ShieldUser,
  Activity,
  ShoppingBasket,
} from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import AdminStatCard from "@/components/admin/AdminStatCard";
import ActiveUsersCard from "@/components/admin/ActiveUsersCard";
import AdminUserTable from "@/components/admin/AdminUserTable";
import { UserDataTable } from "@/components/admin/user-management/UserDataTable";
import { useStatistics } from "@/hooks/useStatistics";
import { useAdminData } from "@/hooks/useAdminData";
import { mockUsers } from "@/data/admin/mockActiveUsers";
import { config, logMockData } from "@/config/mockConfig";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import InterestsPieChartCard from "@/components/admin/user-management/InterestsPieChartCard";
import MoodBarChartCard from "@/components/admin/user-management/MoodBarChartCard";
import DailySubmissionLineChartCard from "@/components/admin/user-management/DailySubmissionLineChartCard";
import ServerOverview from "@/components/admin/server-overview/ServerOverview";
import { useDiscordServers } from "@/hooks/useDiscordServers";
import CountryBarChartCard from "@/components/admin/user-management/CountryBarChartCard";
import SuperStoreOverview from "@/components/admin/super-store/SuperStoreOverview";

type SortOption = {
  field:
    | "user.username"
    | "agent.highest_level"
    | "agent.lowest_level"
    | "agent.last_active";
  direction: "asc" | "desc";
  label: string;
};

const DashboardPage = () => {
  const [, setCurrentTime] = useState<Date>(new Date());
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortConfig, setSortConfig] = useState<SortOption>({
    field: "user.username",
    direction: "asc",
    label: "Username A-Z",
  });

  const { totalGuilds } = useDiscordServers();
  const {
    stats,
    isLoading: isLoadingStats,
    error: statsError,
  } = useStatistics();
  const {
    users,
    missions,
    isLoading: isLoadingData,
    error: dataError,
  } = useAdminData();

  // Calculate active users within the last 7 days
  const getActiveUsersLast7Days = () => {
    const sevenDaysAgo = Date.now() - (7 * 24 * 60 * 60 * 1000); // 7 days in milliseconds
    return users.filter(user => {
      const lastActive = user.agent?.last_active;
      return lastActive && lastActive > sevenDaysAgo;
    }).length;
  };

  // Sort options - added last_active options
  const sortOptions: SortOption[] = [
    // Username sorting
    { field: "user.username", direction: "asc", label: "Username A-Z" },
    { field: "user.username", direction: "desc", label: "Username Z-A" },
    // Performance sorting
    {
      field: "agent.highest_level",
      direction: "desc",
      label: "Agent Highest Level",
    },
    {
      field: "agent.lowest_level",
      direction: "asc",
      label: "Agent Lowest Level",
    },
    // Activity sorting
    {
      field: "agent.last_active",
      direction: "desc",
      label: "Most Recently Active",
    },
    {
      field: "agent.last_active",
      direction: "asc",
      label: "Least Recently Active",
    },
  ];

  // Filter and sort users
  const filteredAndSortedUsers = users
    .filter(
      (user) =>
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.username || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (user.interests || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (user.twitter_handle || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (user.discord_id || "").toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      let aValue: string | number | null | undefined;
      let bValue: string | number | null | undefined;

      switch (sortConfig.field) {
        case "user.username":
          // Get Discord username or fallback to email
          aValue = a.username?.toLowerCase() || a.email?.toLowerCase() || "";
          bValue = b.username?.toLowerCase() || b.email?.toLowerCase() || "";
          break;

        case "agent.highest_level":
        case "agent.lowest_level":
          aValue = a.agent?.level || 0;
          bValue = b.agent?.level || 0;
          break;

        case "agent.last_active":
          aValue = a.agent?.last_active || 0;
          bValue = b.agent?.last_active || 0;
          break;

        default:
          return 0;
      }

      // Handle null/undefined values - put them at the end ALWAYS
      if ((aValue == null || aValue === 0) && (bValue == null || bValue === 0))
        return 0;
      if (aValue == null || aValue === 0) return 1; // null values go to end
      if (bValue == null || bValue === 0) return -1; // null values go to end

      // Handle username sorting (case-insensitive)
      if (sortConfig.field === "user.username") {
        const comparison = (aValue as string).localeCompare(bValue as string);
        return sortConfig.direction === "asc" ? comparison : -comparison;
      }

      // Handle numeric sorting (agent levels and last_active)
      if (
        sortConfig.field === "agent.highest_level" ||
        sortConfig.field === "agent.lowest_level" ||
        sortConfig.field === "agent.last_active"
      ) {
        const numA = Number(aValue);
        const numB = Number(bValue);
        return sortConfig.direction === "asc" ? numA - numB : numB - numA;
      }

      return 0;
    });

  // Calculate pagination
  const totalItems = filteredAndSortedUsers.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentUsers = filteredAndSortedUsers.slice(startIndex, endIndex);

  // Reset to first page when search, sort, or items per page changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, itemsPerPage, sortConfig]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(parseInt(value));
  };

  const handleSortChange = (option: SortOption) => {
    setSortConfig(option);
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      let startPage = Math.max(
        1,
        currentPage - Math.floor(maxVisiblePages / 2)
      );
      const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

      if (endPage - startPage < maxVisiblePages - 1) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  const getSortIcon = () => {
    if (sortConfig.direction === "asc") {
      return <ArrowUp className="h-3 w-3" />;
    } else {
      return <ArrowDown className="h-3 w-3" />;
    }
  };

  if (isLoadingData) {
    return (
      <AdminLayout>
        <div className="space-y-6">
          {/* Stats Cards Loading */}
          <div className="space-y-6">
            {/* Regular Stats Cards - 3 columns layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <div
                  key={index}
                  className="bg-card rounded-2xl shadow-sm border border-border p-6"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <Skeleton className="h-4 w-20 mb-2" />
                      <Skeleton className="h-8 w-16" />
                    </div>
                    <Skeleton className="h-8 w-8 rounded" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chart Cards Loading */}
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            <Skeleton className="h-96 rounded-2xl" />
            <Skeleton className="h-96 rounded-2xl" />
            <Skeleton className="h-96 rounded-2xl" />
          </div>

          {/* Daily Submission Line Chart */}
          <div className="grid grid-cols-1 gap-6">
            <Skeleton className="h-96 rounded-2xl" />
          </div>

          {/* Main Content Tabs Loading */}
          <div className="space-y-6">
            {/* Tabs Loading */}
            <div className="grid w-full grid-cols-2 h-16 bg-muted rounded-lg p-1 mb-6">
              <Skeleton className="h-full rounded-md" />
              <Skeleton className="h-full rounded-md" />
            </div>

            {/* User Dashboard Loading */}
            <div className="bg-card rounded-2xl shadow-sm border border-border p-6">
              {/* Controls Section */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
                <div className="flex items-center gap-2">
                  {/* Sort Dropdown Skeleton */}
                  <Skeleton className="h-8 w-24" />
                </div>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                  <div className="flex items-center space-x-2">
                    <Skeleton className="h-4 w-40" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-8 w-20" />
                  </div>
                </div>
              </div>

              {/* Search Input Loading */}
              <div className="relative mb-6">
                <Skeleton className="w-full h-10 rounded-lg" />
              </div>

              {/* User List Loading - Detailed user cards matching AdminUserTable */}
              <div className="space-y-4 mb-6">
                {Array.from({ length: 5 }).map((_, index) => (
                  <div
                    key={index}
                    className="bg-background rounded-lg border border-border p-4 hover:shadow-lg transition-all duration-300"
                  >
                    {/* User Header - Matching UserProfileHeader */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Skeleton className="h-5 w-48" /> {/* Email */}
                          <Skeleton className="h-5 w-16 rounded-full" />{" "}
                          {/* Status Badge */}
                        </div>
                        <div className="flex items-center gap-4 text-sm">
                          <Skeleton className="h-4 w-24" /> {/* Agent info */}
                          <Skeleton className="h-4 w-20" /> {/* Level */}
                          <Skeleton className="h-4 w-32" /> {/* Last active */}
                        </div>
                      </div>
                    </div>

                    {/* Mission Status Overview */}
                    <div className="mb-6 -my-4">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-2">
                        <Skeleton className="h-5 w-48" /> {/* Title */}
                        <Skeleton className="h-4 w-24" /> {/* Total missions */}
                      </div>
                      {/* Status Cards Grid - 4 columns like real StatusCard */}
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
                        {Array.from({ length: 4 }).map((_, statusIndex) => (
                          <div
                            key={statusIndex}
                            className="p-3 rounded-lg bg-muted/50"
                          >
                            <div className="flex items-center justify-between">
                              <Skeleton className="h-4 w-4 rounded" />
                              <Skeleton className="h-6 w-8" />
                            </div>
                            <Skeleton className="h-3 w-16 mt-1" />
                            <Skeleton className="h-2 w-20 mt-1" />{" "}
                            {/* Progress bar */}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Missions DataTable */}
                    <div className="mb-4">
                      {/* Table Header */}
                      <div className="flex items-center justify-between mb-3">
                        <Skeleton className="h-4 w-32" />{" "}
                        {/* Mission Details title */}
                        <div className="flex gap-2">
                          <Skeleton className="h-6 w-16" /> {/* View button */}
                          <Skeleton className="h-6 w-16" />{" "}
                          {/* Column toggle */}
                        </div>
                      </div>

                      {/* Table Content */}
                      <div className="space-y-2">
                        {Array.from({ length: 3 }).map((_, missionIndex) => (
                          <div
                            key={missionIndex}
                            className="flex items-center gap-4 p-3 bg-muted/30 rounded-lg"
                          >
                            <Skeleton className="h-4 w-16" /> {/* Mission ID */}
                            <Skeleton className="h-5 w-20 rounded-full" />{" "}
                            {/* Status badge */}
                            <Skeleton className="h-4 w-24" /> {/* Date */}
                            <Skeleton className="h-4 w-32" /> {/* Link */}
                            <Skeleton className="h-6 w-6 rounded" />{" "}
                            {/* Actions */}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Pagination */}
                    <div className="flex justify-between items-center pt-3 border-t border-border">
                      <Skeleton className="h-4 w-24" /> {/* Page info */}
                      <div className="flex gap-1">
                        <Skeleton className="h-8 w-8" /> {/* Previous */}
                        <Skeleton className="h-8 w-8" /> {/* Page 1 */}
                        <Skeleton className="h-8 w-8" /> {/* Page 2 */}
                        <Skeleton className="h-8 w-8" /> {/* Next */}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Main Pagination Loading */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-border">
                <Skeleton className="h-4 w-24" />
                <div className="flex items-center space-x-1">
                  <Skeleton className="h-8 w-8" />
                  <Skeleton className="h-8 w-8" />
                  <Skeleton className="h-8 w-8" />
                  <Skeleton className="h-8 w-8" />
                  <Skeleton className="h-8 w-8" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (dataError) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-destructive">Error loading data: {dataError}</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="space-y-6">
          {/* Regular Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoadingStats ? (
              <>
                {Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className="bg-card rounded-2xl shadow-sm border border-border p-6"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <Skeleton className="h-4 w-20 mb-2" />
                        <Skeleton className="h-8 w-16" />
                      </div>
                      <Skeleton className="h-8 w-8 rounded" />
                    </div>
                  </div>
                ))}
              </>
            ) : statsError ? (
              <p className="text-destructive">
                Error loading stats: {statsError}
              </p>
            ) : (
              <>
                <AdminStatCard
                  title="Total SC Users"
                  value={users.length.toLocaleString()}
                  icon={ShieldUser}
                />
                <ActiveUsersCard 
                  activeUsers={stats?.activeUsers}
                  totalUsers={stats?.totaluser}
                  isLoading={isLoadingStats}
                />
                <AdminStatCard
                  title="Active Users (7d)"
                  value={getActiveUsersLast7Days().toLocaleString()}
                  icon={Activity}
                />
                <AdminStatCard
                  title="Active Users (7d)"
                  value={getActiveUsersLast7Days().toLocaleString()}
                  icon={Activity}
                />
                <AdminStatCard
                  title="Total Servers"
                  value={totalGuilds.toLocaleString()}
                  icon={Server}
                />
                <AdminStatCard
                  title="Total Missions"
                  value={stats?.totalmissions?.toLocaleString() ?? "0"}
                  icon={Crosshair}
                />
                <AdminStatCard
                  title="Mission Submitted"
                  value={stats?.totalmissionsubmitted?.toLocaleString() ?? "0"}
                  icon={Send}
                />
                <AdminStatCard
                  title="Total XP"
                  value={stats?.totalXP?.toLocaleString() ?? "0"}
                  icon={Zap}
                />
              </>
            )}
          </div>

          {/* Chart Cards - 3 columns */}
          {!isLoadingStats && !statsError && (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              <div className="h-full">
                <InterestsPieChartCard users={users} />
              </div>
              <div className="h-full">
                <MoodBarChartCard users={users} />
              </div>
              <div className="h-full">
                <CountryBarChartCard users={users} />
              </div>
            </div>
          )}

          {/* Daily Submission Line Chart */}
          {!isLoadingStats && !statsError && (
            <div className="grid grid-cols-1 gap-6">
              <div className="h-full">
                <DailySubmissionLineChartCard />
              </div>
            </div>
          )}
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="user-management" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 h-12 sm:h-14 md:h-16">
            <TabsTrigger
              value="user-management"
              className="flex items-center gap-2 sm:gap-3 text-sm sm:text-base md:text-lg py-2 sm:py-3 cursor-pointer"
            >
              <UserCog className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8" />
              <span className="truncate">User Management</span>
            </TabsTrigger>
            <TabsTrigger
              value="overview"
              className="flex items-center gap-2 sm:gap-3 text-sm sm:text-base md:text-lg py-2 sm:py-3 cursor-pointer"
            >
              <Users className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8" />
              <span className="truncate">User Overview</span>
            </TabsTrigger>
            <TabsTrigger
              value="server-overview"
              className="flex items-center gap-2 sm:gap-3 text-sm sm:text-base md:text-lg py-2 sm:py-3 cursor-pointer"
            >
              <Server className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8" />
              <span className="truncate">Server Overview</span>
            </TabsTrigger>
            <TabsTrigger
              value="super-store"
              className="flex items-center gap-2 sm:gap-3 text-sm sm:text-base md:text-lg py-2 sm:py-3 cursor-pointer"
            >
              <ShoppingBasket className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8" />
              <span className="truncate">Super Store Data</span>
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview">
            <div className="bg-card rounded-2xl shadow-sm border border-border p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
                <div className="flex items-center gap-2">
                  {/* Sort Dropdown */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 cursor-pointer"
                      >
                        <Filter className="h-4 w-4 mr-1" />
                        {getSortIcon()}
                        <span className="sm:inline ml-1">
                          {sortConfig.label}
                        </span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-54">
                      <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      {/* Username Sorting */}
                      <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">
                        Username
                      </DropdownMenuLabel>
                      <DropdownMenuItem
                        onClick={() => handleSortChange(sortOptions[0])}
                        className="flex items-center justify-between"
                      >
                        <span>Username A-Z</span>
                        {sortConfig.field === "user.username" &&
                          sortConfig.direction === "asc" && (
                            <CheckIcon
                              className="h-4 w-4 text-green-500"
                              aria-label="Active"
                            />
                          )}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleSortChange(sortOptions[1])}
                        className="flex items-center justify-between"
                      >
                        <span>Username Z-A</span>
                        {sortConfig.field === "user.username" &&
                          sortConfig.direction === "desc" && (
                            <CheckIcon
                              className="h-4 w-4 text-green-500"
                              aria-label="Active"
                            />
                          )}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {/* Performance Sorting */}
                      <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">
                        Performance
                      </DropdownMenuLabel>
                      <DropdownMenuItem
                        onClick={() => handleSortChange(sortOptions[2])}
                        className="flex items-center justify-between"
                      >
                        <span>Agent Highest Level</span>
                        {sortConfig.field === "agent.highest_level" &&
                          sortConfig.direction === "desc" && (
                            <CheckIcon
                              className="h-4 w-4 text-green-500"
                              aria-label="Active"
                            />
                          )}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleSortChange(sortOptions[3])}
                        className="flex items-center justify-between"
                      >
                        <span>Agent Lowest Level</span>
                        {sortConfig.field === "agent.lowest_level" &&
                          sortConfig.direction === "asc" && (
                            <CheckIcon
                              className="h-4 w-4 text-green-500"
                              aria-label="Active"
                            />
                          )}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {/* Activity Sorting */}
                      <DropdownMenuLabel className="text-xs font-medium text-muted-foreground">
                        Activity
                      </DropdownMenuLabel>
                      <DropdownMenuItem
                        onClick={() => handleSortChange(sortOptions[4])}
                        className="flex items-center justify-between"
                      >
                        <span>Most Recently Active</span>
                        {sortConfig.field === "agent.last_active" &&
                          sortConfig.direction === "desc" && (
                            <CheckIcon
                              className="h-4 w-4 text-green-500"
                              aria-label="Active"
                            />
                          )}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleSortChange(sortOptions[5])}
                        className="flex items-center justify-between"
                      >
                        <span>Least Recently Active</span>
                        {sortConfig.field === "agent.last_active" &&
                          sortConfig.direction === "asc" && (
                            <CheckIcon
                              className="h-4 w-4 text-green-500"
                              aria-label="Active"
                            />
                          )}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground whitespace-nowrap">
                      Showing {startIndex + 1}-{Math.min(endIndex, totalItems)}{" "}
                      of {totalItems} users
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground whitespace-nowrap ">
                      Show:
                    </span>
                    <Select
                      value={itemsPerPage.toString()}
                      onValueChange={handleItemsPerPageChange}
                    >
                      <SelectTrigger className="w-20 h-8 cursor-pointer">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">5</SelectItem>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="20">20</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Search Input */}
              <div className="relative mb-6">
                <Search className="w-5 h-5 text-muted-foreground absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search users by Discord Username, Email, Interests, or X handle..."
                  className="w-full pl-10 pr-4 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent text-foreground placeholder:text-xs sm:placeholder:text-sm md:placeholder:text-base placeholder:text-muted-foreground"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* User List */}
              <div className="space-y-4 mb-6">
                {currentUsers.length > 0 ? (
                  currentUsers.map((user) => (
                    <AdminUserTable
                      key={user.discord_id}
                      user={user}
                      missions={missions.filter(
                        (m) => m.user_id === user.discord_id
                      )}
                      userAgent={user.agent}
                    />
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      No users found matching your search.
                    </p>
                  </div>
                )}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-border">
                  <div className="text-sm text-muted-foreground">
                    Page {currentPage} of {totalPages}
                  </div>

                  <div className="flex items-center space-x-1">
                    {/* First Page */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(1)}
                      disabled={currentPage === 1}
                      className="h-8 w-8 p-0"
                    >
                      <ChevronsLeft className="h-4 w-4" />
                    </Button>

                    {/* Previous Page */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="h-8 w-8 p-0"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>

                    {/* Page Numbers */}
                    {getPageNumbers().map((page) => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(page)}
                        className="h-8 w-8 p-0"
                      >
                        {page}
                      </Button>
                    ))}

                    {/* Next Page */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="h-8 w-8 p-0"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>

                    {/* Last Page */}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handlePageChange(totalPages)}
                      disabled={currentPage === totalPages}
                      className="h-8 w-8 p-0"
                    >
                      <ChevronsRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Server Overview Tab */}
          <TabsContent value="server-overview">
            <ServerOverview />
          </TabsContent>

          {/* User Management Tab */}
          <TabsContent value="user-management">
            <div className="bg-card rounded-2xl shadow-sm border border-border p-6">
              <UserDataTable users={users} />
            </div>
          </TabsContent>

          {/* Super Store Data Tab */}
          <TabsContent value="super-store">
            <SuperStoreOverview />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default DashboardPage;