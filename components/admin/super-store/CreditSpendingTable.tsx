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
  CreditCard,
  TrendingUp,
  Calendar,
  ShoppingBag,
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
import { useCreditSpending } from "@/hooks/useSuperStoreData";
import { CreditSpendingFilters } from "@/types/admin/superStoreTypes";

const CreditSpendingTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [filters, setFilters] = useState<CreditSpendingFilters>({
    tierFilter: [],
    sortBy: "total_credits_spent",
    sortDirection: "desc",
    dateRange: { start: "", end: "" }
  });

  const { creditSpending, totalSpenders, isLoading, error } = useCreditSpending(filters);

  // Filter by search term
  const filteredSpending = creditSpending.filter(
    (spending) =>
      spending.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      spending.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate pagination
  const totalItems = filteredSpending.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentSpending = filteredSpending.slice(startIndex, endIndex);

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

  const handleSortChange = (sortBy: CreditSpendingFilters["sortBy"], direction: "asc" | "desc") => {
    setFilters(prev => ({
      ...prev,
      sortBy,
      sortDirection: direction
    }));
  };

  // Check if any filters are applied (not default values)
  const hasActiveFilters = () => {
    return (
      filters.tierFilter.length > 0 ||
      filters.dateRange.start !== "" ||
      filters.dateRange.end !== "" ||
      filters.sortBy !== "total_credits_spent" ||
      filters.sortDirection !== "desc"
    );
  };

  // Clear all filters to default values
  const clearAllFilters = () => {
    setFilters({
      tierFilter: [],
      sortBy: "total_credits_spent",
      sortDirection: "desc",
      dateRange: { start: "", end: "" }
    });
    setSearchTerm("");
    setCurrentPage(1);
  };

  const getTierBadgeColor = (tier: string) => {
    switch (tier) {
      case "diamond":
        return "bg-cyan-100 text-cyan-800 border-cyan-200";
      case "platinum":
        return "bg-slate-100 text-slate-800 border-slate-200";
      case "gold":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "silver":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "bronze":
        return "bg-orange-100 text-orange-800 border-orange-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getTierIcon = (tier: string) => {
    switch (tier) {
      case "diamond":
        return "💎";
      case "platinum":
        return "🏆";
      case "gold":
        return "🥇";
      case "silver":
        return "🥈";
      case "bronze":
        return "🥉";
      default:
        return "🏅";
    }
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
          <div key={index} className="skeleton h-16 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-32">
        <p className="text-destructive">Error loading credit spending data: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-semibold">Credits Spent by Tier</h3>
        <p className="text-sm text-muted-foreground">
          Total: {totalSpenders.toLocaleString()} spenders
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
                  Sort by {filters.sortBy === "total_credits_spent" ? "Credits Spent" : 
                           filters.sortBy === "tier_level" ? "Tier Level" : 
                           filters.sortBy === "purchases_count" ? "Purchases" :
                           "Last Purchase"}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-54">
              <DropdownMenuLabel>Sort by</DropdownMenuLabel>
              <DropdownMenuSeparator />
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
                onClick={() => handleSortChange("tier_level", "desc")}
                className="flex items-center justify-between"
              >
                <span>Tier Level (High to Low)</span>
                {filters.sortBy === "tier_level" && filters.sortDirection === "desc" && (
                  <CheckIcon className="h-4 w-4 text-green-500" />
                )}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleSortChange("purchases_count", "desc")}
                className="flex items-center justify-between"
              >
                <span>Purchase Count (High to Low)</span>
                {filters.sortBy === "purchases_count" && filters.sortDirection === "desc" && (
                  <CheckIcon className="h-4 w-4 text-green-500" />
                )}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleSortChange("last_purchase_date", "desc")}
                className="flex items-center justify-between"
              >
                <span>Last Purchase (Recent)</span>
                {filters.sortBy === "last_purchase_date" && filters.sortDirection === "desc" && (
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
              Showing {startIndex + 1}-{Math.min(endIndex, totalItems)} of {totalItems} spenders
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
          placeholder="Search spenders by username or email..."
          className="w-full pl-10 pr-4 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent text-foreground placeholder:text-muted-foreground"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Credit Spending List */}
      <div className="space-y-4 mb-6">
        {currentSpending.length > 0 ? (
          currentSpending.map((spending, index) => (
            <div
              key={spending.user_id}
              className="bg-background rounded-lg border border-border p-4 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  {/* Ranking */}
                  <div className="flex items-center gap-2 min-w-[60px]">
                    <span className="text-xl font-bold text-muted-foreground">
                      {startIndex + index + 1}
                    </span>
                  </div>

                  {/* User Info */}
                  <div className="flex items-center gap-3 flex-1">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback>
                        {spending.username.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-foreground truncate">
                          {spending.username}
                        </h4>
                        <div className="flex items-center gap-1">
                          <span className="text-lg">{getTierIcon(spending.tier)}</span>
                          <Badge className={getTierBadgeColor(spending.tier)}>
                            {spending.tier.toUpperCase()}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {spending.email}
                      </p>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="hidden lg:flex items-center gap-6">
                    <div className="text-center">
                      <div className="flex items-center gap-1 text-sm font-medium">
                        <CreditCard className="h-4 w-4 text-green-500" />
                        ${spending.total_credits_spent.toLocaleString()}
                      </div>
                      <p className="text-xs text-muted-foreground">Total Spent</p>
                    </div>
                    
                    <div className="text-center">
                      <div className="flex items-center gap-1 text-sm font-medium">
                        <ShoppingBag className="h-4 w-4 text-blue-500" />
                        {spending.purchases_count}
                      </div>
                      <p className="text-xs text-muted-foreground">Purchases</p>
                    </div>

                    <div className="text-center">
                      <div className="flex items-center gap-1 text-sm font-medium">
                        <TrendingUp className="h-4 w-4 text-purple-500" />
                        ${spending.avg_purchase_amount}
                      </div>
                      <p className="text-xs text-muted-foreground">Avg Amount</p>
                    </div>

                    <div className="text-center">
                      <div className="flex items-center gap-1 text-sm font-medium">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        {new Date(spending.last_purchase_date).toLocaleDateString()}
                      </div>
                      <p className="text-xs text-muted-foreground">Last Purchase</p>
                    </div>
                  </div>
                </div>

                {/* Mobile Stats */}
                <div className="lg:hidden flex flex-col items-end gap-1">
                  <div className="flex items-center gap-1 text-sm font-medium">
                    <CreditCard className="h-4 w-4 text-green-500" />
                    ${spending.total_credits_spent.toLocaleString()}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <ShoppingBag className="h-3 w-3 text-blue-500" />
                    {spending.purchases_count} purchases
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Avg: ${spending.avg_purchase_amount}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No spenders found matching your search.</p>
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

export default CreditSpendingTable;
