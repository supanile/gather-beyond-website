"use client";

import React from "react";
import {
  Calendar,
  Clock,
  Activity,
  TriangleAlert,
  CheckCircle,
} from "lucide-react";
import { useMissionsTable } from "@/hooks/useMissionsTable";
import { getStatusCardConfig } from "@/lib/admin/missions/missionTableUtils";
import { StatusCard } from "@/components/admin/missions/StatusCard";
import { AddMissionModal } from "@/components/admin/missions/AddMissionModal";
import { ViewMissionModal } from "@/components/admin/missions/ViewMissionModal";
import { MissionTableControls } from "@/components/admin/missions/MissionTableControls";
import { Pagination } from "@/components/admin/missions/Pagination";
import { MissionsTable } from "./missions/MissionsTable";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
    setSelectedMission, // ✅ ADD: Include setSelectedMission
    setIsAddModalOpen,
    setIsViewModalOpen,
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

  // แก้ไข Edit Mission Handler - ใช้ exact values
  const handleEditMission = (mission: Mission) => {
    // Use partnerName directly and check if it is in PARTNER_OPTIONS.
    const partnerName = PARTNER_OPTIONS.includes(mission.partnerName as PartnerOption)
      ? mission.partnerName
      : "Super Connector";

    // Use the type and platform that are stored in the database.
    const missionType = mission.type || "";
    const missionPlatform = mission.platform || "";

    // แปลงวันที่อย่างถูกต้องสำหรับ edit form
    const convertToDatetimeLocal = (
      dateValue: string | number | null | undefined
    ): string | undefined => {
      if (!dateValue) return undefined;

      try {
        let date: Date;

        if (typeof dateValue === "number") {
          // Unix timestamp
          date = new Date(dateValue * 1000);
        } else if (typeof dateValue === "string") {
          date = new Date(dateValue);
        } else {
          return undefined;
        }

        if (isNaN(date.getTime())) return undefined;

        // แปลงเป็น format YYYY-MM-DDTHH:mm สำหรับ datetime-local input
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");

        return `${year}-${month}-${day}T${hours}:${minutes}`;
      } catch {
        return undefined;
      }
    };

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
      startDate: convertToDatetimeLocal(mission.startDate),
      endDate: convertToDatetimeLocal(mission.endDate),
      regex: mission.regex || "",
      duration: mission.duration || "",
      missionTargeting: missionTargeting, // ✅ FIXED: Set to null since not available in Mission type
    };

    setMissionToEdit(missionForm);
    setSelectedMission(mission); // ✅ IMPORTANT: Set selected mission for edit modal
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

  // แก้ไข Update Mission Handler
  const handleUpdateMissionSubmit = async (missionForm: NewMissionForm) => {
    if (missionToEdit && selectedMission) {
      // Ensure we have the current form data, not the old missionToEdit
      const currentFormData = missionForm || missionToEdit;
      
      const success = await handleUpdateMission(
        selectedMission.id,
        currentFormData
      );
      if (success) {
        setIsEditModalOpen(false);
        setMissionToEdit(null);
        setSelectedMission(null); // Clear selected mission
      }
    }
  };

  // Updated status card configurations to include completed
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
      status: "completed",
      count: statusStats.completed,
      icon: CheckCircle,
      ...getStatusCardConfig("completed"),
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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

      {/* Filters and Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <AddMissionModal
          isOpen={isAddModalOpen}
          onOpenChange={setIsAddModalOpen}
          newMission={newMission}
          onMissionChange={setNewMission}
          onSubmit={handleAddMission}
        />

        <MissionTableControls
          selectedStatus={filters.selectedStatus}
          onResetFilter={() => setSelectedStatus(null)}
          pagination={pagination}
          onItemsPerPageChange={handleItemsPerPageChange}
          columnVisibility={columnVisibility}
          onToggleColumnVisibility={toggleColumnVisibility}
        />
      </div>

      {/* Missions Table */}
      <div className="overflow-x-auto">
        <div className="rounded-md border border-border">
          <MissionsTable
            missions={missions}
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
          />

          <Pagination pagination={pagination} onPageChange={handlePageChange} />
        </div>
      </div>

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
          }
        }
        onMissionChange={(mission) => {
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
              };
              const updated = mission(currentMission);
              return updated;
            });
          } else {
            setMissionToEdit(mission);
          }
        }}
        onSubmit={async () => {
          if (missionToEdit) {
            // Use the current missionToEdit state which should have the latest form data
            return handleUpdateMissionSubmit(missionToEdit);
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
              className="border-gray-300 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800"
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