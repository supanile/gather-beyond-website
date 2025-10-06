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
  Trophy,
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
import { useCampaigns } from "@/hooks/useSuperStoreData";
import { CampaignFilters } from "@/types/admin/superStoreTypes";

const WinnersTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filters, setFilters] = useState<CampaignFilters>({
    campaignType: [],
    sortBy: "start_date",
    sortDirection: "desc",
    status: [],
    dateRange: { start: "", end: "" }
  });

  const { campaigns, totalCampaigns, isLoading, error } = useCampaigns(filters);

  // Filter by search term
  const filteredCampaigns = campaigns.filter(
    (campaign) =>
      campaign.campaign_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campaign.campaign_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campaign.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
      campaign.winners.some(winner => 
        winner.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        winner.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        winner.prize_title.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  // Calculate pagination
  const totalItems = filteredCampaigns.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCampaigns = filteredCampaigns.slice(startIndex, endIndex);

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

  const handleSortChange = (sortBy: CampaignFilters["sortBy"], direction: "asc" | "desc") => {
    setFilters(prev => ({
      ...prev,
      sortBy,
      sortDirection: direction
    }));
  };

  // Check if any filters are applied (not default values)
  const hasActiveFilters = () => {
    return (
      filters.campaignType.length > 0 ||
      filters.status.length > 0 ||
      filters.dateRange.start !== "" ||
      filters.dateRange.end !== "" ||
      filters.sortBy !== "start_date" ||
      filters.sortDirection !== "desc"
    );
  };

  // Clear all filters to default values
  const clearAllFilters = () => {
    setFilters({
      campaignType: [],
      sortBy: "start_date",
      sortDirection: "desc",
      status: [],
      dateRange: { start: "", end: "" }
    });
    setSearchTerm("");
    setCurrentPage(1);
  };

  const getCampaignTypeBadgeColor = (type: string) => {
    switch (type) {
      case "monthly":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "weekly":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "seasonal":
        return "bg-green-100 text-green-800 border-green-200";
      case "special":
        return "bg-orange-100 text-orange-800 border-orange-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      case "completed":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "upcoming":
        return "bg-blue-100 text-blue-800 border-blue-200";
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
          <div key={index} className="skeleton h-32 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-32">
        <p className="text-destructive">Error loading campaigns data: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Campaign Winners</h3>
        <p className="text-sm text-muted-foreground">
          Total: {totalCampaigns.toLocaleString()} campaigns
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
                  Sort by {filters.sortBy === "start_date" ? "Start Date" : 
                           filters.sortBy === "end_date" ? "End Date" : 
                           filters.sortBy === "total_participants" ? "Participants" :
                           filters.sortBy === "total_credits_spent" ? "Credits Spent" :
                           "Prize Value"}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-54">
              <DropdownMenuLabel>Sort by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => handleSortChange("start_date", "desc")}
                className="flex items-center justify-between"
              >
                <span>Start Date (Recent)</span>
                {filters.sortBy === "start_date" && filters.sortDirection === "desc" && (
                  <CheckIcon className="h-4 w-4 text-green-500" />
                )}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleSortChange("end_date", "desc")}
                className="flex items-center justify-between"
              >
                <span>End Date (Recent)</span>
                {filters.sortBy === "end_date" && filters.sortDirection === "desc" && (
                  <CheckIcon className="h-4 w-4 text-green-500" />
                )}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleSortChange("total_participants", "desc")}
                className="flex items-center justify-between"
              >
                <span>Participants (High to Low)</span>
                {filters.sortBy === "total_participants" && filters.sortDirection === "desc" && (
                  <CheckIcon className="h-4 w-4 text-green-500" />
                )}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleSortChange("total_credits_spent", "desc")}
                className="flex items-center justify-between"
              >
                <span>Credits Spent (High to Low)</span>
                {filters.sortBy === "total_credits_spent" && filters.sortDirection === "desc" && (
                  <CheckIcon className="h-4 w-4 text-green-500" />
                )}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleSortChange("total_prize_value", "desc")}
                className="flex items-center justify-between"
              >
                <span>Prize Value (High to Low)</span>
                {filters.sortBy === "total_prize_value" && filters.sortDirection === "desc" && (
                  <CheckIcon className="h-4 w-4 text-green-500" />
                )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Clear Filter Button */}
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
              Showing {startIndex + 1}-{Math.min(endIndex, totalItems)} of {totalItems} campaigns
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
          placeholder="Search campaigns by name, type, status, or winners..."
          className="w-full pl-10 pr-4 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent text-foreground placeholder:text-muted-foreground"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Campaigns List */}
      <div className="space-y-6 mb-6">
        {currentCampaigns.length > 0 ? (
          currentCampaigns.map((campaign) => (
            <div
              key={campaign._id}
              className="bg-background rounded-lg border border-border p-6 hover:shadow-lg transition-all duration-300"
            >
              {/* Campaign Header */}
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h4 className="text-xl font-bold text-foreground">
                      {campaign.campaign_name}
                    </h4>
                    <Badge className={getCampaignTypeBadgeColor(campaign.campaign_type)}>
                      {campaign.campaign_type.toUpperCase()}
                    </Badge>
                    <Badge className={getStatusBadgeColor(campaign.status)}>
                      {campaign.status.toUpperCase()}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {new Date(campaign.start_date).toLocaleDateString()} - {new Date(campaign.end_date).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Campaign Stats */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-muted/30 rounded-lg p-4 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Users className="h-5 w-5 text-blue-500" />
                    <span className="text-lg font-semibold">{campaign.total_participants.toLocaleString()}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Participants</p>
                </div>

                <div className="bg-muted/30 rounded-lg p-4 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Zap className="h-5 w-5 text-purple-500" />
                    <span className="text-lg font-semibold">{campaign.total_credits_spent.toLocaleString()}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Credits Spent</p>
                </div>

                <div className="bg-muted/30 rounded-lg p-4 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Gift className="h-5 w-5 text-green-500" />
                    <span className="text-lg font-semibold">{campaign.total_prize_value.toLocaleString()}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Prize Value</p>
                </div>

                <div className="bg-muted/30 rounded-lg p-4 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Trophy className="h-5 w-5 text-yellow-500" />
                    <span className="text-lg font-semibold">{campaign.winners.length}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Winners</p>
                </div>
              </div>

              {/* Winners List */}
              {campaign.winners.length > 0 ? (
                <div>
                  <h5 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Trophy className="h-5 w-5 text-yellow-500" />
                    List of Winners:
                  </h5>
                  <div className="space-y-3">
                    {campaign.winners.map((winner) => (
                      <div
                        key={winner._id}
                        className="bg-muted/20 rounded-lg p-4 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-4 flex-1">
                          {/* Rank */}
                          <div className="flex items-center gap-2 min-w-[40px]">
                            <span className="text-xl">
                              {getRankIcon(winner.rank_achieved)}
                            </span>
                          </div>

                          {/* Winner Info */}
                          <div className="flex items-center gap-3 flex-1">
                            <Avatar className="h-10 w-10">
                              <AvatarFallback>
                                {winner.username.slice(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            
                            <div className="flex-1 min-w-0">
                              <h6 className="font-medium text-foreground truncate">
                                {winner.username}
                              </h6>
                              <p className="text-sm text-muted-foreground truncate">
                                {winner.email}
                              </p>
                            </div>
                          </div>

                          {/* Prize Info */}
                          <div className="hidden md:flex flex-col items-end">
                            <div className="flex items-center gap-1 text-sm font-medium">
                              <Gift className="h-4 w-4 text-green-500" />
                              {winner.prize_title}
                            </div>
                            <p className="text-xs text-muted-foreground">
                              Value: {winner.prize_value.toLocaleString()}
                            </p>
                          </div>

                          {/* Date Won */}
                          <div className="text-right">
                            <div className="flex items-center gap-1 text-sm font-medium">
                              <Calendar className="h-4 w-4 text-gray-500" />
                              {new Date(winner.won_date).toLocaleDateString()}
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {winner.xp_earned} XP earned
                            </p>
                          </div>
                        </div>

                        {/* Mobile Prize Info */}
                        <div className="md:hidden flex flex-col items-end gap-1">
                          <div className="flex items-center gap-1 text-sm font-medium">
                            <Gift className="h-4 w-4 text-green-500" />
                            {winner.prize_value.toLocaleString()}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {winner.xp_earned} XP
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 bg-muted/20 rounded-lg">
                  <Trophy className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                  <p className="text-muted-foreground">No winners yet for this campaign</p>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No campaigns found matching your search.</p>
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
