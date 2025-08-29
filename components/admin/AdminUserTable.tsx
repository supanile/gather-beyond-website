"use client"

import React from "react";
import { Mission } from "@/types/admin/adminTypes";
import { UserWithAgent } from "@/types/admin/userManagement";
import { UserAgent } from "@/types/admin/userTableTypes";
import {
  CheckCircle,
  Clock,
  XCircle,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  useUserTableState,
  useProcessedMissions,
  useUserAgent,
} from "@/hooks/useAdminUserTable";
import UserProfileHeader from "./user-overview/UserProfileHeader";
import StatusCard from "./user-overview/StatusCardOverview";
import MissionSubmissionModal from "./user-overview/MissionSubmissionModal";
import UserMissionsTable from "./user-overview/UserMissionsTable";
import UserMissionsPagination from "./user-overview/UserMissionsPagination";

const AdminUserTable = ({
  user,
  missions,
  userAgent,
}: {
  user: UserWithAgent;
  missions: Mission[];
  userAgent?: UserAgent;
}) => {
  // Use missions from user.userMissions if available, otherwise use props
  const userMissions = user.userMissions || missions;

  // Custom hooks
  const {
    selectedSubmission,
    isModalOpen,
    selectedStatus,
    setSelectedStatus,
    sortConfig,
    pagination,
    columnVisibility,
    handleSort,
    toggleColumnVisibility,
    openModal,
    closeModal,
    setCurrentPage,
  } = useUserTableState();

  const agentData = useUserAgent(userAgent, user.discord_id);

  const {
    paginatedMissions,
    statusStats,
    totalPages,
    totalMissions
  } = useProcessedMissions(userMissions, selectedStatus, sortConfig, pagination);

  return (
    <>
      <Card className="hover:shadow-lg transition-all duration-300 border-border">
        <CardHeader>
          <UserProfileHeader 
            user={user} 
            userAgent={agentData} 
            totalMissions={totalMissions} 
          />
        </CardHeader>

        <CardContent className="p-6">
          {/* Status Statistics */}
          <div className="mb-6 -my-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-2">
              <h4 className="text-md font-semibold text-foreground">
                Mission Status Overview
              </h4>
              <div className="flex items-center gap-2">
                {selectedStatus && (
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => setSelectedStatus(null)}
                  >
                    Reset Filter
                  </Button>
                )}
                <div className="text-xs text-muted-foreground">
                  Total: {totalMissions} missions
                </div>
              </div>
            </div>
            
            {/* Status cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
              <StatusCard
                status="completed"
                count={statusStats.completed}
                icon={CheckCircle}
                color="text-green-600 dark:text-green-300"
                bgColor="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20"
                isSelected={selectedStatus === "completed"}
                onClick={setSelectedStatus}
                totalMissions={totalMissions}
              />
              <StatusCard
                status="submitted"
                count={statusStats.submitted}
                icon={Upload}
                color="text-yellow-600 dark:text-yellow-300"
                bgColor="bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20"
                isSelected={selectedStatus === "submitted"}
                onClick={setSelectedStatus}
                totalMissions={totalMissions}
              />
              <StatusCard
                status="accepted"
                count={statusStats.accepted}
                icon={Clock}
                color="text-blue-600 dark:text-blue-300"
                bgColor="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20"
                isSelected={selectedStatus === "accepted"}
                onClick={setSelectedStatus}
                totalMissions={totalMissions}
              />
              <StatusCard
                status="rejected"
                count={statusStats.rejected}
                icon={XCircle}
                color="text-red-600 dark:text-red-300"
                bgColor="bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20"
                isSelected={selectedStatus === "rejected"}
                onClick={setSelectedStatus}
                totalMissions={totalMissions}
              />
            </div>
          </div>

          {/* Missions DataTable */}
          <UserMissionsTable
            paginatedMissions={paginatedMissions}
            isLoading={false}
            columnVisibility={columnVisibility}
            sortConfig={sortConfig}
            onSort={handleSort}
            onToggleColumnVisibility={toggleColumnVisibility}
            onOpenModal={openModal}
          />

          {/* Pagination Controls */}
          <UserMissionsPagination
            currentPage={pagination.currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </CardContent>
      </Card>

      <MissionSubmissionModal
        mission={selectedSubmission}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </>
  );
};

export default AdminUserTable;