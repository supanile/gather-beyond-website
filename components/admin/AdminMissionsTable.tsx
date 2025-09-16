"use client";

import React, { useRef, useCallback } from "react";
import {
  Calendar,
  Clock,
  Activity,
  TriangleAlert,
  Settings2,
  Search,
  X,
} from "lucide-react";
import { useMissionsTable } from "@/hooks/useMissionsTable";
import { getStatusCardConfig } from "@/lib/admin/missions/missionTableUtils";
import { convertToDatetimeLocal, getUserTimezone } from "@/lib/admin/missions/timezoneUtils";
import { StatusCard } from "@/components/admin/missions/StatusCard";
import { AddMissionModal } from "@/components/admin/missions/AddMissionModal";
import { ViewMissionModal } from "@/components/admin/missions/ViewMissionModal";
import { Pagination } from "@/components/admin/missions/Pagination";
import { TimezoneSelect } from "@/components/admin/missions/TimezoneSelect";
import { MissionsTable } from "./missions/MissionsTable";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Mission,
  NewMissionForm,
  PARTNER_OPTIONS,
  PartnerOption,
} from "@/types/admin/missions/missionTypes";
import { toast } from "sonner";

const AdminMissionsTable = () => {
  const {
    // Data
    missions,
    isSubmitting,
    statusStats,

    // State
    sortState,
    filters,
    pagination,
    columnVisibility,
    newMission,
    selectedMission,
    isAddModalOpen,
    isViewModalOpen,
    searchQuery,
    startDateFilter,
    endDateFilter,

    // Handlers
    handleSort,
    toggleColumnVisibility,
    handleAddMission,
    handleUpdateMission,
    handleDeleteMission,
    openViewModal,
    handlePageChange,
    handleItemsPerPageChange,
    setSelectedStatus,
    setNewMission,
    setSelectedMission,
    setIsAddModalOpen,
    setIsViewModalOpen,
    handleSearchChange,
    setStartDateFilter,
    setEndDateFilter,
  } = useMissionsTable();

  // Edit and Delete state
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
  const [missionToEdit, setMissionToEdit] =
    React.useState<NewMissionForm | null>(null);
  const [missionToDelete, setMissionToDelete] = React.useState<Mission | null>(
    null
  );
  const [confirmDeleteInput, setConfirmDeleteInput] = React.useState("");
  const [hasConfirmedWarning, setHasConfirmedWarning] = React.useState(false);
  
  // Use ref to store latest mission data to avoid state timing issues
  const latestMissionDataRef = useRef<NewMissionForm | null>(null);

  // State to track the latest mission data from AddMissionModal
  const [latestMissionData, setLatestMissionData] = React.useState<NewMissionForm | null>(null);

  // Memoized callback for new mission changes
  const handleNewMissionChange = useCallback((mission: NewMissionForm | ((prev: NewMissionForm) => NewMissionForm)) => {
    console.log("🔄 AdminMissionsTable onMissionChange called");
    console.log("🔄 Mission data:", mission);
    console.log("🔄 Mission has missionTargeting:", typeof mission === 'object' && mission && 'missionTargeting' in mission ? !!mission.missionTargeting : 'N/A');
    console.log("🔄 Mission serverId:", typeof mission === 'object' && mission && 'serverId' in mission ? mission.serverId : 'N/A');
    
    if (typeof mission === "function") {
      setNewMission(prevMission => {
        const updated = mission(prevMission);
        console.log("🔄 Function result:", updated);
        setLatestMissionData(updated);
        return updated;
      });
    } else {
      console.log("🔄 Direct mission:", mission);
      setNewMission(mission);
      setLatestMissionData(mission);
    }
  }, [setNewMission]); // Remove newMission from dependency array

  // Memoized callback for edit mission changes
  const handleEditMissionChange = useCallback((mission: NewMissionForm | ((prev: NewMissionForm) => NewMissionForm)) => {
    if (typeof mission === "function") {
      setMissionToEdit((prev) => {
        const currentMission = prev || {
          title: "",
          description: "",
          type: "",
          platform: "",
          reward: "",
          level_required: 1,
          action_request: "",
          format: "",
          useful_link: "",
          status: "upcoming",
          partner: "Super Connector",
          serverId: "",
        };
        const updated = mission(currentMission);
        console.log("🔄 AdminMissionsTable onMissionChange (function):", updated);
        console.log("🔄 missionTargeting in updated:", updated.missionTargeting);
        console.log("🔄 serverId in updated:", updated.serverId);
        // Also store in ref for immediate access
        latestMissionDataRef.current = updated;
        return updated;
      });
    } else {
      console.log("🔄 AdminMissionsTable onMissionChange (direct):", mission);
      console.log("🔄 missionTargeting in mission:", mission.missionTargeting);
      console.log("🔄 serverId in mission:", mission.serverId);
      setMissionToEdit(mission);
      // Store in ref for immediate access
      latestMissionDataRef.current = mission;
    }
  }, []);

  // Wrapper function to handle mission submission with complete data
  const handleAddMissionSubmit = async () => {
    try {
      // Use the most complete data available - prioritize the one with missionTargeting
      const missionDataToSubmit = (latestMissionData?.missionTargeting || latestMissionData?.serverId) 
        ? latestMissionData 
        : newMission;
      
      if (missionDataToSubmit && (missionDataToSubmit.missionTargeting || missionDataToSubmit.serverId)) {
        // Update the hook's state with complete mission data
        setNewMission(missionDataToSubmit);
        
        // Wait for state update
        await new Promise(resolve => setTimeout(resolve, 100));
        
        await handleAddMission();
      } else {
        await handleAddMission();
      }
    } catch (error) {
      throw error;
    }
  };

  // Reset all filters handler
  const handleResetAllFilters = () => {
    setSelectedStatus(null);
    handleSearchChange("");
    handlePageChange(1);
  };

  // Column visibility labels mapping
  const columnLabels = {
    id: "ID",
    title: "Title",
    type: "Type",
    platform: "Platform",
    status: "Status",
    reward: "Reward",
    partner: "Partner",
    startDate: "Start Date",
    endDate: "End Date",
  };

  // use exact values
  const handleEditMission = (mission: Mission) => {
    // Use partnerName directly and check if it is in PARTNER_OPTIONS.
    const partnerName = PARTNER_OPTIONS.includes(
      mission.partnerName as PartnerOption
    )
      ? mission.partnerName
      : "Super Connector";

    // Use the type and platform that are stored in the database.
    const missionType = mission.type || "";
    const missionPlatform = mission.platform || "";

    // แปลงวันที่อย่างถูกต้องสำหรับ edit form โดยใช้ timezone ที่ user เลือก
    const userTimezone = getUserTimezone();

    // Since targeting properties don't exist in Mission type, set to null for now
    const missionTargeting = null;

    // Convert Mission to NewMissionForm for editing
    const missionForm: NewMissionForm = {
      title: mission.title || "",
      description: mission.description || "",
      type: missionType,
      platform: missionPlatform,
      reward: mission.reward || "",
      level_required: mission.level_required || 1,
      action_request: mission.action_request || "",
      format: mission.format || "",
      useful_link: mission.useful_link || "",
      partner: partnerName,
      requirements: mission.requirements || "",
      repeatable: mission.repeatable || 0,
      startDate: convertToDatetimeLocal(mission.startDate, userTimezone),
      endDate: convertToDatetimeLocal(mission.endDate, userTimezone),
      regex: mission.regex || "",
      duration: mission.duration || "",
      missionTargeting: missionTargeting,
      serverId: mission.serverId || "",
    };

    setMissionToEdit(missionForm);
    setSelectedMission(mission);
    setIsEditModalOpen(true);
  };

  // Delete Mission Handler
  const handleDeleteMissionClick = (mission: Mission) => {
    setMissionToDelete(mission);
    setIsDeleteDialogOpen(true);
    setConfirmDeleteInput("");
    setHasConfirmedWarning(false);
  };

  // Start countdown after warning confirmation
  const handleConfirmWarning = () => {
    setHasConfirmedWarning(true);
  };

  // Confirm Delete Handler with API integration
  const confirmDelete = async () => {
    if (missionToDelete && confirmDeleteInput === missionToDelete.title) {
      const success = await handleDeleteMission(missionToDelete.id);

      if (success) {
        // Close the dialog and reset the state
        setIsDeleteDialogOpen(false);
        setMissionToDelete(null);
        setConfirmDeleteInput("");
        setHasConfirmedWarning(false);
      } else {
        // Not close the dialog if deletion fails to allow the user to try again
      }
    } else {
      toast.error("Please type the exact mission title to confirm deletion");
    }
  };

  // Update pagination info to reflect filtered results
  const displayedMissions = missions; // missions from hook are already filtered and paginated
  const paginationInfo = {
    ...pagination,
    totalItems: displayedMissions.length,
  };

  // Status card configurations
  const statusCardConfigs = [
    {
      status: "active",
      count: statusStats.active,
      icon: Activity,
      ...getStatusCardConfig("active"),
    },
    {
      status: "upcoming",
      count: statusStats.upcoming,
      icon: Calendar,
      ...getStatusCardConfig("upcoming"),
    },
    {
      status: "ended",
      count: statusStats.ended,
      icon: Clock,
      ...getStatusCardConfig("ended"),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {statusCardConfigs.map(({ status, count, icon, color, bgColor }) => (
          <StatusCard
            key={status}
            status={status}
            count={count}
            icon={icon}
            color={color}
            bgColor={bgColor}
            onClick={() => setSelectedStatus(status)}
            isSelected={filters.selectedStatus === status}
          />
        ))}
      </div>

      {/* Controls Layout - 3 Rows */}
      <div className="space-y-4">
        {/* Row 1: Timezone Selector */}
        <div className="flex justify-end">
          <TimezoneSelect onTimezoneChange={() => {
            // Page will reload automatically to apply timezone changes
          }} />
        </div>

        {/* Row 2: Add Mission Button Only */}
        <div className="flex justify-start">
          <AddMissionModal
            isOpen={isAddModalOpen}
            onOpenChange={setIsAddModalOpen}
            newMission={newMission}
            onMissionChange={handleNewMissionChange}
            onSubmit={handleAddMissionSubmit}
          />
        </div>

        {/* Row 3: Search + Filters + Controls */}
        <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
          {/* Left Side: Search + Active Filters + Reset */}
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            {/* Improved Search Input with better width */}
            <div className="relative flex-1 max-w-xl lg:max-w-3xl xl:max-w-3xl">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-3 w-3 sm:h-4 sm:w-4" />
              <Input
                placeholder="Search Missions by Title, Description, Partner, Type, Platform, Status..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-9 pr-9 w-full text-xs sm:text-sm placeholder:text-xs sm:placeholder:text-sm"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleSearchChange("")}
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-5 w-5 sm:h-6 sm:w-6 p-0 hover:bg-muted"
                  aria-label="Clear search"
                >
                  <X className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              )}
            </div>

            {/* Active Filters + Reset Button */}
            <div className="flex items-center gap-2 flex-wrap">
              {filters.selectedStatus && (
                <div
                  className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs ${
                    getStatusCardConfig(filters.selectedStatus).bgColor
                  }`}
                >
                  <span
                    className={
                      getStatusCardConfig(filters.selectedStatus).color
                    }
                  >
                    Status: {filters.selectedStatus}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedStatus(null)}
                    className="h-4 w-4 p-0 hover:bg-background"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              )}
              {filters.selectedStatus && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleResetAllFilters}
                  className="text-xs sm:text-sm whitespace-nowrap cursor-pointer"
                >
                  Reset All Filters
                </Button>
              )}
            </div>
          </div>

          {/* Right Side: Pagination Info + Controls + View */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center space-x-2">
              <span className="text-xs sm:text-sm text-muted-foreground mr-2 sm:mr-4 whitespace-nowrap">
                Showing{" "}
                {(paginationInfo.currentPage - 1) *
                  paginationInfo.itemsPerPage +
                  1}
                -
                {Math.min(
                  (paginationInfo.currentPage - 1) *
                    paginationInfo.itemsPerPage +
                    paginationInfo.itemsPerPage,
                  paginationInfo.totalItems
                )}{" "}
                of {paginationInfo.totalItems} missions
                {searchQuery && (
                  <span className="text-blue-600 ml-1">(filtered)</span>
                )}
              </span>
              <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
                Show:
              </span>
              <Select
                value={pagination.itemsPerPage.toString()}
                onValueChange={handleItemsPerPageChange}
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
            </div>

            {/* Column Visibility Dropdown with proper labels */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs sm:text-sm h-7 sm:h-8 cursor-pointer"
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
                      toggleColumnVisibility(
                        key as keyof typeof columnVisibility
                      )
                    }
                    className="text-xs sm:text-sm"
                  >
                    {columnLabels[key as keyof typeof columnLabels]}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Missions Table */}
      <div className="overflow-x-auto">
        <div className="rounded-md border border-border">
          {/* Pass filtered missions to table */}
          <MissionsTable
            missions={displayedMissions}
            sortState={sortState}
            columnVisibility={columnVisibility}
            onSort={handleSort}
            onToggleColumnVisibility={toggleColumnVisibility}
            onViewMission={openViewModal}
            onEditMission={handleEditMission}
            onDeleteMission={handleDeleteMissionClick}
            totalVisibleColumns={
              Object.values(columnVisibility).filter(Boolean).length + 1 // +1 for Actions column
            }
            startDateFilter={startDateFilter}
            endDateFilter={endDateFilter}
            onStartDateFilterChange={setStartDateFilter}
            onEndDateFilterChange={setEndDateFilter}
          />

          {/* Use updated pagination info */}
          <Pagination
            pagination={paginationInfo}
            onPageChange={handlePageChange}
          />
        </div>
      </div>

      {/* No Results Message */}
      {searchQuery && displayedMissions.length === 0 && (
        <div className="text-center py-8 bg-muted/20 rounded-lg border border-dashed">
          <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium text-muted-foreground mb-2">
            No missions found
          </h3>
          <p className="text-sm text-muted-foreground mb-4">
            No missions match your search criteria: &quot;{searchQuery}&quot;
          </p>
          <Button
            variant="outline"
            onClick={() => handleSearchChange("")}
            size="sm"
          >
            Clear search
          </Button>
        </div>
      )}

      {/* View Mission Details Modal */}
      <ViewMissionModal
        isOpen={isViewModalOpen}
        onOpenChange={setIsViewModalOpen}
        mission={selectedMission}
      />

      {/* Edit Mission Modal */}
      <AddMissionModal
        isOpen={isEditModalOpen}
        onOpenChange={(open) => {
          setIsEditModalOpen(open);
          if (!open) {
            setMissionToEdit(null);
            latestMissionDataRef.current = null; // Clear ref when modal closes
          }
        }}
        newMission={
          missionToEdit || {
            title: "",
            description: "",
            type: "",
            platform: "",
            reward: "",
            level_required: 1,
            action_request: "",
            format: "",
            useful_link: "",
            partner: "Super Connector",
            serverId: "",
          }
        }
        onMissionChange={handleEditMissionChange}
        onSubmit={async () => {
          // Use ref to get the latest mission data
          const latestMission = latestMissionDataRef.current || missionToEdit;
          if (latestMission) {
            console.log("🚀 AdminMissionsTable onSubmit using latest mission:", latestMission);
            console.log("🚀 Latest mission has missionTargeting:", !!latestMission.missionTargeting);
            console.log("🚀 Latest mission serverId:", latestMission.serverId);
            console.log("🚀 Latest mission missionTargeting details:", latestMission.missionTargeting);
            
            // Use the latest mission data directly, not missionToEdit state
            const success = await handleUpdateMission(
              selectedMission!.id,
              latestMission  // Use latestMission instead of missionToEdit
            );
            if (success) {
              setIsEditModalOpen(false);
              setMissionToEdit(null);
              setSelectedMission(null);
              latestMissionDataRef.current = null; // Clear ref
            }
          }
          return Promise.resolve();
        }}
        isEditMode={true}
        title="Edit Mission"
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={isDeleteDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsDeleteDialogOpen(false);
            setConfirmDeleteInput("");
            setHasConfirmedWarning(false);
          }
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader className="text-center">
            <DialogTitle className="flex items-center justify-center gap-2 text-red-600">
              ⚠️ DANGER ZONE ⚠️
            </DialogTitle>
            <DialogDescription className="text-red-600 font-medium text-center">
              You are about to permanently delete this mission!
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 px-6 py-4">
            {/* Mission Info */}
            <div className="bg-red-50 dark:bg-red-950/20 p-3 rounded-lg border border-red-200 dark:border-red-800">
              <p className="text-sm font-medium text-red-800 dark:text-red-200">
                Mission:
              </p>
              <p className="text-red-900 dark:text-red-100 font-semibold">
                {missionToDelete?.title}
              </p>
              <p className="text-xs text-red-700 dark:text-red-300 mt-1">
                ID: {missionToDelete?.id}
              </p>
            </div>

            {/* Warning Message */}
            <div className="bg-yellow-50 dark:bg-yellow-950/20 p-3 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                <strong>⚠️ WARNING:</strong> This action will:
              </p>
              <ul className="text-xs text-yellow-700 dark:text-yellow-300 mt-2 space-y-1 ml-4">
                <li>• Permanently delete this mission</li>
                <li>• Remove all associated data</li>
                <li>• Cannot be undone or recovered</li>
                <li>• May affect user progress</li>
              </ul>
            </div>

            {/* Step 1: Confirm Warning */}
            {!hasConfirmedWarning && (
              <div className="space-y-3">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Step 1: Acknowledge the risk
                </p>
                <Button
                  onClick={handleConfirmWarning}
                  variant="outline"
                  className="w-full border-red-300 text-red-700 hover:bg-red-50 dark:border-red-600 dark:text-red-300 dark:hover:bg-red-950/20"
                  disabled={isSubmitting}
                >
                  I understand the risks, continue →
                </Button>
              </div>
            )}

            {/* Step 2: Type Mission Name */}
            {hasConfirmedWarning && (
              <div className="space-y-3">
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Step 2: Type the exact mission name to confirm
                </p>
                <div className="space-y-2">
                  <Label
                    htmlFor="confirm-delete"
                    className="text-sm font-medium text-red-600"
                  >
                    Type &quot;<strong>{missionToDelete?.title}</strong>&quot;
                    exactly:
                  </Label>
                  <Input
                    id="confirm-delete"
                    value={confirmDeleteInput}
                    onChange={(e) => setConfirmDeleteInput(e.target.value)}
                    placeholder={missionToDelete?.title}
                    className="border-red-300 focus:border-red-500 focus:ring-red-500"
                    autoComplete="off"
                    disabled={isSubmitting}
                  />
                  {confirmDeleteInput &&
                    confirmDeleteInput !== missionToDelete?.title && (
                      <p className="text-xs text-red-500">
                        ❌ Mission name doesn&apos;t match exactly
                      </p>
                    )}
                  {confirmDeleteInput === missionToDelete?.title && (
                    <p className="text-xs text-green-600">
                      Mission name confirmed
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              className="border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800 cursor-pointer"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={
                isSubmitting ||
                !hasConfirmedWarning ||
                confirmDeleteInput !== missionToDelete?.title
              }
              className="bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <TriangleAlert className="h-4 w-4 mr-2" />
              {isSubmitting ? "Deleting..." : "Delete Mission"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminMissionsTable;
