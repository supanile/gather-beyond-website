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
  Gift,
  Calendar,
  Zap,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import { useWinners } from "@/hooks/useSuperStoreData";
import { WinnerFilters } from "@/types/admin/superStoreTypes";

const WinnersTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filters, setFilters] = useState<WinnerFilters>({
    competitionType: [],
    sortBy: "won_date",
    sortDirection: "desc",
    dateRange: { start: "", end: "" }
  });

  const { winners, totalWinners, isLoading, error } = useWinners(filters);

  // Filter by search term
  const filteredWinners = winners.filter(
    (winner) =>
      winner.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      winner.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      winner.competition_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      winner.prize_title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate pagination
  const totalItems = filteredWinners.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentWinners = filteredWinners.slice(startIndex, endIndex);

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

  const handleSortChange = (sortBy: WinnerFilters["sortBy"], direction: "asc" | "desc") => {
    setFilters(prev => ({
      ...prev,
      sortBy,
      sortDirection: direction
    }));
  };

  // Check if any filters are applied (not default values)
  const hasActiveFilters = () => {
    return (
      filters.competitionType.length > 0 ||
      filters.dateRange.start !== "" ||
      filters.dateRange.end !== "" ||
      filters.sortBy !== "won_date" ||
      filters.sortDirection !== "desc"
    );
  };

  // Clear all filters to default values
  const clearAllFilters = () => {
    setFilters({
      competitionType: [],
      sortBy: "won_date",
      sortDirection: "desc",
      dateRange: { start: "", end: "" }
    });
    setSearchTerm("");
    setCurrentPage(1);
  };

  // const getCompetitionTypeBadgeColor = (type: string) => {
  //   switch (type) {
  //     case "monthly":
  //       return "bg-purple-100 text-purple-800 border-purple-200";
  //     case "weekly":
  //       return "bg-blue-100 text-blue-800 border-blue-200";
  //     case "seasonal":
  //       return "bg-green-100 text-green-800 border-green-200";
  //     case "special":
  //       return "bg-orange-100 text-orange-800 border-orange-200";
  //     default:
  //       return "bg-gray-100 text-gray-800 border-gray-200";
  //   }
  // };

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
      let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
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
          <div key={index} className="skeleton h-20 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-32">
        <p className="text-destructive">Error loading winners data: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Competition Winners</h3>
        <p className="text-sm text-muted-foreground">
          Total: {totalWinners.toLocaleString()} winners
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div className="flex items-center gap-2">
          {/* Sort Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8 cursor-pointer">
                <Filter className="h-4 w-4 mr-1" />
                {getSortIcon()}
                <span className="sm:inline ml-1">
                  Sort by {filters.sortBy === "won_date" ? "Date Won" : 
                           filters.sortBy === "prize_value" ? "Prize Value" : 
                           filters.sortBy === "rank_achieved" ? "Rank" :
                           "XP Earned"}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-54">
              <DropdownMenuLabel>Sort by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => handleSortChange("won_date", "desc")}
                className="flex items-center justify-between"
              >
                <span>Date Won (Recent)</span>
                {filters.sortBy === "won_date" && filters.sortDirection === "desc" && (
                  <CheckIcon className="h-4 w-4 text-green-500" />
                )}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleSortChange("prize_value", "desc")}
                className="flex items-center justify-between"
              >
                <span>Prize Value (High to Low)</span>
                {filters.sortBy === "prize_value" && filters.sortDirection === "desc" && (
                  <CheckIcon className="h-4 w-4 text-green-500" />
                )}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleSortChange("rank_achieved", "asc")}
                className="flex items-center justify-between"
              >
                <span>Rank (Best to Worst)</span>
                {filters.sortBy === "rank_achieved" && filters.sortDirection === "asc" && (
                  <CheckIcon className="h-4 w-4 text-green-500" />
                )}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleSortChange("xp_earned", "desc")}
                className="flex items-center justify-between"
              >
                <span>XP Earned (High to Low)</span>
                {filters.sortBy === "xp_earned" && filters.sortDirection === "desc" && (
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
              Showing {startIndex + 1}-{Math.min(endIndex, totalItems)} of {totalItems} winners
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground whitespace-nowrap">Show:</span>
            <Select value={itemsPerPage.toString()} onValueChange={handleItemsPerPageChange}>
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
          placeholder="Search winners by username, email, competition, or prize..."
          className="w-full pl-10 pr-4 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent text-foreground placeholder:text-muted-foreground"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Winners List */}
      <div className="space-y-4 mb-6">
        {currentWinners.length > 0 ? (
          currentWinners.map((winner) => (
            <div
              key={winner._id}
              className="bg-background rounded-lg border border-border p-4 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex flex-col gap-4">
                {/* Header Row */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    {/* Rank */}
                    <div className="flex items-center gap-2 min-w-[60px]">
                      <span className="text-2xl pl-4">
                        {getRankIcon(winner.rank_achieved)}
                      </span>
                    </div>

                    {/* User Info */}
                    <div className="flex items-center gap-3 flex-1">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback>
                          {winner.username.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-foreground truncate">
                            {winner.username}
                          </h4>
                          {/* <Badge className={getCompetitionTypeBadgeColor(winner.competition_type)}>
                            {winner.competition_type.toUpperCase()}
                          </Badge> */}
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                          {winner.email}
                        </p>
                      </div>
                    </div>

                    {/* Date and Basic Stats */}
                    <div className="hidden md:flex items-center gap-6">
                      <div className="text-center">
                        <div className="flex items-center gap-1 text-sm font-medium">
                          <Calendar className="h-4 w-4 text-gray-500" />
                          {new Date(winner.won_date).toLocaleDateString()}
                        </div>
                        <p className="text-xs text-muted-foreground">Date Won</p>
                      </div>

                      <div className="text-center">
                        <div className="flex items-center gap-1 text-sm font-medium">
                          <Gift className="h-4 w-4 text-green-500" />
                          {winner.prize_value.toLocaleString()}
                        </div>
                        <p className="text-xs text-muted-foreground">Prize Value</p>
                      </div>

                      <div className="text-center">
                        <div className="flex items-center gap-1 text-sm font-medium">
                          <Zap className="h-4 w-4 text-blue-500" />
                          {winner.xp_earned.toLocaleString()}
                        </div>
                        <p className="text-xs text-muted-foreground">XP Earned</p>
                      </div>
                    </div>
                  </div>

                  {/* Mobile Stats */}
                  <div className="md:hidden flex flex-col items-end gap-1">
                    <div className="flex items-center gap-1 text-sm font-medium">
                      <Gift className="h-4 w-4 text-green-500" />
                      {winner.prize_value.toLocaleString()}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Zap className="h-3 w-3 text-blue-500" />
                      {winner.xp_earned} XP
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(winner.won_date).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                {/* Competition Details */}
                <div className="pl-16 md:pl-20">
                  <div className="bg-muted/30 rounded-lg p-3">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="flex-1">
                        <h5 className="font-medium text-foreground mb-1">
                          {winner.competition_name}
                        </h5>
                        <p className="text-sm text-muted-foreground mb-2">
                          {winner.prize_title}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {winner.prize_description}
                        </p>
                      </div>

                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4 text-gray-500" />
                          <span>{winner.total_participants.toLocaleString()} participants</span>
                        </div>
                        {winner.badge_earned && (
                          <Badge variant="secondary">
                            🏆 {winner.badge_earned}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No winners found matching your search.</p>
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

export default WinnersTable;
