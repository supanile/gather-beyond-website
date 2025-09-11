"use client";

import { useState } from "react";
import { MissionReviewTable } from "./MissionReviewTable";
import { MissionReviewFiltersComponent } from "./MissionReviewFilters";
import { MissionReviewStatsComponent } from "./MissionReviewStats";
import { MissionReviewPagination } from "./MissionReviewPagination";
import { Button } from "@/components/ui/button";
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
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMissionReview } from "@/hooks/useMissionReview";
import {
  MissionReviewColumnVisibility,
} from "@/types/admin/missionReview";
import { Settings2 } from "lucide-react";
import { MissionReviewPageSkeleton } from "./MissionReviewSkeleton";

export function MissionReviewPage() {
  const {
    missions,
    stats,
    filters,
    pagination,
    loading,
    sortState,
    setFilters,
    clearFilters,
    approveMission,
    rejectMission,
    handlePageChange,
    handleItemsPerPageChange,
    handleSort,
  } = useMissionReview();

  // Column visibility state - Updated to include user_avatar
  const [columnVisibility, setColumnVisibility] =
    useState<MissionReviewColumnVisibility>({
      id: true,
      user_avatar: true,
      mission_name: true,
      mission_id: true,
      user_id: true,
      status: true,
      submitted_at: true,
      submission_link: true,
    });

  const handleApprove = async (missionId: number) => {
    await approveMission(missionId);
  };

  const handleReject = async (missionId: number) => {
    await rejectMission(missionId);
  };

  const handleToggleColumnVisibility = (
    column: keyof MissionReviewColumnVisibility
  ) => {
    setColumnVisibility((prev) => ({
      ...prev,
      [column]: !prev[column],
    }));
  };

  // Determine empty message based on filters
  const getEmptyMessage = () => {
    if (filters.searchQuery.trim()) {
      return "No results found for your search.";
    }
    if (filters.status !== "all") {
      return `No ${filters.status} missions found.`;
    }
    return "No mission reviews found.";
  };

  // Calculate total visible columns for table layout
  const totalVisibleColumns =
    Object.values(columnVisibility).filter(Boolean).length + 1; // +1 for actions column

  // Helper function to format column labels
  const getColumnLabel = (key: string): string => {
    const labelMap: Record<string, string> = {
      id: "ID",
      user_avatar: "User",
      mission_name: "Mission",
      mission_id: "Mission ID",
      user_id: "User ID",
      status: "Status",
      submitted_at: "Submitted",
      submission_link: "Submission Link",
    };

    return labelMap[key] || key.charAt(0).toUpperCase() + key.slice(1);
  };

  if (loading) {
    return <MissionReviewPageSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <MissionReviewStatsComponent stats={stats} />

      {/* Filters */}
      <MissionReviewFiltersComponent
        filters={filters}
        onFiltersChange={setFilters}
        onClearFilters={clearFilters}
      />

      {/* Table */}
      <div className="space-y-4">
        {/* Table Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Left side - Showing info */}
          <div className="text-xs sm:text-sm text-muted-foreground">
            <span>
              Showing{" "}
              {missions.length > 0
                ? `${(pagination.currentPage - 1) * pagination.itemsPerPage + 1}-${Math.min(
                    pagination.currentPage * pagination.itemsPerPage,
                    pagination.totalItems
                  )} of ${pagination.totalItems}`
                : "0"}{" "}
              missions
            </span>
          </div>
          
          {/* Right side - Controls */}
          <div className="flex items-center gap-2">
            {/* Items per page selector */}
            <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
              Show:
            </span>
            <Select
              value={pagination.itemsPerPage.toString()}
              onValueChange={(value) => handleItemsPerPageChange(parseInt(value))}
            >
              <SelectTrigger className="w-16 sm:w-20 h-7 sm:h-8 text-xs sm:text-sm cursor-pointer">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10" className="text-xs sm:text-sm">
                  10
                </SelectItem>
                <SelectItem value="20" className="text-xs sm:text-sm">
                  20
                </SelectItem>
                <SelectItem value="50" className="text-xs sm:text-sm">
                  50
                </SelectItem>
                <SelectItem value="100" className="text-xs sm:text-sm">
                  100
                </SelectItem>
              </SelectContent>
            </Select>
            
            {/* Column Visibility Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs sm:text-sm h-7 sm:h-8"
                >
                  <Settings2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  View
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-[160px] sm:w-[180px]"
              >
                <DropdownMenuLabel className="text-xs sm:text-sm">
                  Toggle columns
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                {Object.entries(columnVisibility).map(([key, value]) => (
                  <DropdownMenuCheckboxItem
                    key={key}
                    checked={value}
                    onCheckedChange={() =>
                      handleToggleColumnVisibility(
                        key as keyof MissionReviewColumnVisibility
                      )
                    }
                    className="text-xs sm:text-sm"
                  >
                    {getColumnLabel(key)}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Table with border */}
        <div className="overflow-x-auto">
          <div className="rounded-md border border-border">
            <MissionReviewTable
              missions={missions}
              sortState={sortState}
              columnVisibility={columnVisibility}
              onSort={handleSort}
              onToggleColumnVisibility={handleToggleColumnVisibility}
              onApprove={handleApprove}
              onReject={handleReject}
              isLoading={loading}
              totalVisibleColumns={totalVisibleColumns}
              emptyMessage={getEmptyMessage()}
            />
            
            {/* Pagination at bottom of table */}
            <MissionReviewPagination
              pagination={pagination}
              onPageChange={handlePageChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
