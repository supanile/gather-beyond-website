"use client";

import { useState, useEffect } from "react";
import {
  Search,
  Filter,
  ArrowUp,
  ArrowDown,
  CheckIcon,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Medal,
  Zap,
  Calendar,
  ArrowBigUpDash,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { useLeaderboard } from "@/hooks/useSuperStoreData";
import { LeaderboardFilters } from "@/types/admin/superStoreTypes";

const LeaderboardTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filters, setFilters] = useState<LeaderboardFilters>({
    sortBy: "rank",
    sortDirection: "asc",
    moodFilter: [],
    statusFilter: [],
    levelRange: { min: 0, max: 100 },
  });

  const { claimers, totalClaimers, isLoading, error } = useLeaderboard(filters);

  // Filter by search term
  const filteredClaimers = claimers.filter(
    (claimer) =>
      claimer.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claimer.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate pagination
  const totalItems = filteredClaimers.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentClaimers = filteredClaimers.slice(startIndex, endIndex);

  // Reset to first page when search or items per page changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, itemsPerPage, filters]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(parseInt(value));
  };

  const handleSortChange = (
    sortBy: LeaderboardFilters["sortBy"],
    direction: "asc" | "desc"
  ) => {
    setFilters((prev) => ({
      ...prev,
      sortBy,
      sortDirection: direction,
    }));
  };

  // Check if any filters are applied (not default values)
  const hasActiveFilters = () => {
    return (
      filters.moodFilter.length > 0 ||
      filters.statusFilter.length > 0 ||
      filters.levelRange.min !== 0 ||
      filters.levelRange.max !== 100 ||
      filters.sortBy !== "rank" ||
      filters.sortDirection !== "asc"
    );
  };

  // Clear all filters to default values
  const clearAllFilters = () => {
    setFilters({
      sortBy: "rank",
      sortDirection: "asc",
      moodFilter: [],
      statusFilter: [],
      levelRange: { min: 0, max: 100 },
    });
    setSearchTerm("");
    setCurrentPage(1);
  };

  const getMoodBadgeColor = (mood: string) => {
    switch (mood) {
      case "happy":
        return "bg-green-100 text-green-800 border-green-200";
      case "neutral":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "sad":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getMoodWithEmoji = (mood: string) => {
    switch (mood) {
      case "happy":
        return "😊 Happy";
      case "neutral":
        return "😐 Neutral";
      case "sad":
        return "😢 Sad";
      default:
        return mood;
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      case "inactive":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "banned":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return `${rank}`;
  };

  const getSortIcon = () => {
    if (filters.sortDirection === "asc") {
      return <ArrowUp className="h-3 w-3" />;
    } else {
      return <ArrowDown className="h-3 w-3" />;
    }
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

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <div className="skeleton h-8 w-32" />
          <div className="skeleton h-8 w-24" />
        </div>
        <div className="skeleton h-10 w-full" />
        {Array.from({ length: 5 }).map((_, index) => (
          <div key={index} className="skeleton h-16 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-32">
        <p className="text-destructive">Error loading leaderboard: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Claimers Leaderboard</h3>
        <p className="text-sm text-muted-foreground">
          Total: {totalClaimers.toLocaleString()} claimers
        </p>
      </div>

      {/* Controls */}
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
                  Sort by{" "}
                  {filters.sortBy === "join_date"
                    ? "Join Date"
                    : filters.sortBy === "total_xp"
                    ? "Total XP"
                    : filters.sortBy.charAt(0).toUpperCase() +
                      filters.sortBy.slice(1)}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuLabel>Sort by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => handleSortChange("rank", "asc")}
                className="flex items-center justify-between"
              >
                <span>Rank (Best to Worst)</span>
                {filters.sortBy === "rank" &&
                  filters.sortDirection === "asc" && (
                    <CheckIcon className="h-4 w-4 text-green-500" />
                  )}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleSortChange("level", "desc")}
                className="flex items-center justify-between"
              >
                <span>Level (High to Low)</span>
                {filters.sortBy === "level" &&
                  filters.sortDirection === "desc" && (
                    <CheckIcon className="h-4 w-4 text-green-500" />
                  )}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleSortChange("total_xp", "desc")}
                className="flex items-center justify-between"
              >
                <span>Total XP (High to Low)</span>
                {filters.sortBy === "total_xp" &&
                  filters.sortDirection === "desc" && (
                    <CheckIcon className="h-4 w-4 text-green-500" />
                  )}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleSortChange("join_date", "asc")}
                className="flex items-center justify-between"
              >
                <span>Join Date (Oldest)</span>
                {filters.sortBy === "join_date" &&
                  filters.sortDirection === "asc" && (
                    <CheckIcon className="h-4 w-4 text-green-500" />
                  )}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleSortChange("join_date", "desc")}
                className="flex items-center justify-between"
              >
                <span>Join Date (Newest)</span>
                {filters.sortBy === "join_date" &&
                  filters.sortDirection === "desc" && (
                    <CheckIcon className="h-4 w-4 text-green-500" />
                  )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Clear Filter Button - แสดงเฉพาะเมื่อไม่ใช่ค่าเริ่มต้น */}
          {hasActiveFilters() && (
            <Button
              variant="destructive"
              size="sm"
              className="h-8"
              onClick={clearAllFilters}
            >
              Clear Filter
            </Button>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground whitespace-nowrap">
              Showing {startIndex + 1}-{Math.min(endIndex, totalItems)} of{" "}
              {totalItems} claimers
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground whitespace-nowrap">
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
          placeholder="Search claimers by username or email..."
          className="w-full pl-10 pr-4 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent text-foreground placeholder:text-muted-foreground"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Claimers List */}
      <div className="space-y-4 mb-6">
        {currentClaimers.length > 0 ? (
          currentClaimers.map((claimer) => (
            <div
              key={claimer._id}
              className="bg-background rounded-lg border border-border p-4 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-0 flex-1">
                  {/* Rank */}
                  <div className="flex items-center gap-2 min-w-[60px]">
                    <span className="text-2xl font-bold">
                      {getRankIcon(claimer.rank)}
                    </span>
                  </div>

                  {/* Avatar and User Info */}
                  <div className="flex items-center gap-3 flex-1">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={claimer.avatar_url} />
                      <AvatarFallback>
                        {claimer.username.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-foreground truncate">
                          {claimer.username}
                        </h4>
                        <Badge className={getStatusBadgeColor(claimer.status)}>
                          {claimer.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {claimer.email}
                      </p>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="hidden lg:flex items-center gap-6">
                    <div className="text-center">
                      <div className="flex items-center gap-1 text-sm font-medium">
                        <ArrowBigUpDash className="h-4 w-4 text-yellow-500" />
                        Level {claimer.level}
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="flex items-center gap-1 text-sm font-medium">
                        <Zap className="h-4 w-4 text-blue-500" />
                        {claimer.total_xp.toLocaleString()} XP
                      </div>
                    </div>

                    <div className="text-center">
                      <div className="flex items-center gap-1 text-sm font-medium">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        {new Date(typeof claimer.join_date === 'number' ? claimer.join_date * 1000 : claimer.join_date).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="text-center">
                      <Badge className={getMoodBadgeColor(claimer.mood)}>
                        {getMoodWithEmoji(claimer.mood)}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Mobile Stats */}
                <div className="lg:hidden flex flex-col items-end gap-1">
                  <div className="flex items-center gap-1 text-sm font-medium">
                    <Medal className="h-4 w-4 text-yellow-500" />
                    Lv.{claimer.level}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Zap className="h-3 w-3 text-blue-500" />
                    {claimer.total_xp.toLocaleString()}
                  </div>
                  <Badge className={getMoodBadgeColor(claimer.mood)}>
                    {getMoodWithEmoji(claimer.mood)}
                  </Badge>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              No claimers found matching your search.
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
  );
};

export default LeaderboardTable;
