"use client";

import { useState } from "react";
import { MissionReviewTable } from "./MissionReviewTable";
import { MissionReviewFiltersComponent } from "./MissionReviewFilters";
import { MissionReviewStatsComponent } from "./MissionReviewStats";
import { MissionDetailsModal } from "./MissionDetailsModal";
import { Button } from "@/components/ui/button";
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
  UserMission,
  MissionReviewSortState,
  MissionReviewColumnVisibility,
} from "@/types/admin/missionReview";
import { Settings2 } from "lucide-react";

export function MissionReviewPage() {
  const {
    missions,
    stats,
    filters,
    loading,
    setFilters,
    clearFilters,
    approveMission,
    rejectMission,
  } = useMissionReview();

  const [selectedMission, setSelectedMission] = useState<UserMission | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Sort state
  const [sortState, setSortState] = useState<MissionReviewSortState>({
    field: "_id",
    direction: "desc",
  });

  // Column visibility state - Updated to include user_avatar
  const [columnVisibility, setColumnVisibility] =
    useState<MissionReviewColumnVisibility>({
      id: true,
      mission_name: true,
      mission_id: true,
      user_id: true,
      status: true,
      submitted_at: true,
      submission_link: true,
    });

  const handleViewDetails = (mission: UserMission) => {
    setSelectedMission(mission);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedMission(null);
  };

  const handleApprove = async (missionId: number) => {
    await approveMission(missionId);
  };

  const handleReject = async (missionId: number) => {
    await rejectMission(missionId);
  };

  const handleSort = (field: keyof UserMission) => {
    setSortState((prev) => ({
      field,
      direction:
        prev.field === field && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleToggleColumnVisibility = (
    column: keyof MissionReviewColumnVisibility
  ) => {
    setColumnVisibility((prev) => ({
      ...prev,
      [column]: !prev[column],
    }));
  };

  // Sort missions
  const sortedMissions = [...missions].sort((a, b) => {
    const { field, direction } = sortState;
    let aValue = a[field];
    let bValue = b[field];

    // Handle null/undefined values
    if ((aValue === null || aValue === undefined) && (bValue === null || bValue === undefined)) return 0;
    if (aValue === null || aValue === undefined) return direction === "asc" ? -1 : 1;
    if (bValue === null || bValue === undefined) return direction === "asc" ? 1 : -1;

    if (typeof aValue === "string" && typeof bValue === "string") {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    if (aValue < bValue) return direction === "asc" ? -1 : 1;
    if (aValue > bValue) return direction === "asc" ? 1 : -1;
    return 0;
  });

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
      user_avatar: "Avatar",
      mission_name: "Mission",
      mission_id: "Mission ID",
      user_id: "User ID",
      status: "Status",
      submitted_at: "Submitted",
      submission_link: "Submission Link",
    };

    return labelMap[key] || key.charAt(0).toUpperCase() + key.slice(1);
  };

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
          <div></div> {/* Empty div for spacing */}
          <div className="flex items-center gap-2">
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
              missions={sortedMissions}
              sortState={sortState}
              columnVisibility={columnVisibility}
              onSort={handleSort}
              onToggleColumnVisibility={handleToggleColumnVisibility}
              onApprove={handleApprove}
              onReject={handleReject}
              onViewDetails={handleViewDetails}
              isLoading={loading}
              totalVisibleColumns={totalVisibleColumns}
              emptyMessage={getEmptyMessage()}
            />
          </div>
        </div>
      </div>

      {/* Details Modal */}
      <MissionDetailsModal
        mission={selectedMission}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  );
}