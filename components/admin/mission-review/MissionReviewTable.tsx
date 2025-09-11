"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Eye,
  ChevronsUpDown,
  ChevronUp,
  ChevronDown,
  EyeOff,
  Check,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  UserMission,
  MissionReviewColumnVisibility,
  MissionReviewTableProps,
} from "@/types/admin/missionReview";
import { MissionStatusBadge } from "./MissionStatusBadge";
import { MissionActionConfirmDialog } from "./MissionActionConfirmDialog";
import { UserAvatar } from "./UserAvatar";

export const MissionReviewTable: React.FC<MissionReviewTableProps> = ({
  missions,
  sortState,
  columnVisibility,
  onSort,
  onToggleColumnVisibility,
  onApprove,
  onReject,
  totalVisibleColumns,
  emptyMessage = "No mission reviews found.",
}) => {
  const router = useRouter();
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    action: "approve" | "reject";
    missionId: number;
    missionName: string;
  }>({
    isOpen: false,
    action: "approve",
    missionId: 0,
    missionName: "",
  });
  const [isActionLoading, setIsActionLoading] = useState(false);

  const handleViewDetails = (mission: UserMission) => {
    router.push(`/admin/mission-review/${mission.user_id}/${mission._id}`);
  };

  const handleApproveClick = (mission: UserMission) => {
    setConfirmDialog({
      isOpen: true,
      action: "approve",
      missionId: mission._id,
      missionName: mission.mission_name,
    });
  };

  const handleRejectClick = (mission: UserMission) => {
    setConfirmDialog({
      isOpen: true,
      action: "reject",
      missionId: mission._id,
      missionName: mission.mission_name,
    });
  };

  const handleConfirmAction = async () => {
    setIsActionLoading(true);
    try {
      if (confirmDialog.action === "approve") {
        await onApprove(confirmDialog.missionId);
      } else {
        await onReject(confirmDialog.missionId);
      }
    } finally {
      setIsActionLoading(false);
      setConfirmDialog({
        isOpen: false,
        action: "approve",
        missionId: 0,
        missionName: "",
      });
    }
  };

  const handleCloseDialog = () => {
    if (!isActionLoading) {
      setConfirmDialog({
        isOpen: false,
        action: "approve",
        missionId: 0,
        missionName: "",
      });
    }
  };

  const truncateText = (text: string, maxLength: number = 40) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const getSortIcon = (field: keyof UserMission) => {
    if (sortState.field !== field) {
      return <ChevronsUpDown className="h-3 w-3" />;
    }
    return sortState.direction === "asc" ? (
      <ChevronUp className="h-3 w-3" />
    ) : (
      <ChevronDown className="h-3 w-3" />
    );
  };

  const handleSort = (field: keyof UserMission, direction: "asc" | "desc") => {
    if (sortState.field === field && sortState.direction === direction) {
      return;
    }
    onSort(field);
  };

  const EmptyRow = () => (
    <TableRow>
      <TableCell
        colSpan={totalVisibleColumns}
        className="h-24 text-center text-muted-foreground"
      >
        {emptyMessage}
      </TableCell>
    </TableRow>
  );

  const createColumnHeader = (
    field: keyof UserMission,
    label: string,
    className: string
  ) => (
    <TableHead className={className}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-auto px-0 py-2 font-medium text-foreground hover:text-foreground justify-start text-xs"
          >
            {label}
            {getSortIcon(field)}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => handleSort(field, "asc")}>
            <div className="flex items-center">
              <ChevronUp className="w-4 h-4 mr-2" />
              Asc
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleSort(field, "desc")}>
            <div className="flex items-center">
              <ChevronDown className="w-4 h-4 mr-2" />
              Desc
            </div>
          </DropdownMenuItem>
          <div className="bg-border -mx-1 my-1 h-px"></div>
          <DropdownMenuItem
            onClick={() =>
              onToggleColumnVisibility(
                field as keyof MissionReviewColumnVisibility
              )
            }
          >
            <div className="flex items-center">
              <EyeOff className="w-4 h-4 mr-2" />
              Hide
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </TableHead>
  );

  // Create non-sortable header for Avatar column
  const createNonSortableHeader = (
    label: string,
    className: string,
    column: keyof MissionReviewColumnVisibility
  ) => (
    <TableHead className={className}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-auto px-0 py-2 font-medium text-foreground hover:text-foreground justify-start text-xs"
          >
            {label}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => onToggleColumnVisibility(column)}>
            <div className="flex items-center">
              <EyeOff className="w-4 h-4 mr-2" />
              Hide
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </TableHead>
  );

  return (
    <>
      <Table className="table-fixed w-full">
        <TableHeader>
          <TableRow>
            {columnVisibility.id &&
              createColumnHeader("_id", "No", "w-10 px-1")}
            {columnVisibility.user_avatar &&
              createNonSortableHeader("User", "w-36 px-3", "user_avatar")}
            {columnVisibility.user_id &&
              createColumnHeader("user_id", "User ID", "w-26 px-0")}
            {columnVisibility.mission_name &&
              createColumnHeader("mission_name", "Mission", "w-48 px-0")}
            {columnVisibility.status &&
              createColumnHeader("status", "Status", "w-24 px-2")}
            {columnVisibility.submission_link &&
              createColumnHeader(
                "submission_link",
                "Submission Link",
                "w-48 px-0"
              )}
            <TableHead className="w-28 px-0 text-xs">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {missions.length === 0 ? (
            <EmptyRow />
          ) : (
            missions.map((mission) => (
              <TableRow key={mission._id} className="hover:bg-muted/50">
                {columnVisibility.id && (
                  <TableCell className="font-medium px-4 text-xs">
                    {mission._id}
                  </TableCell>
                )}
                {columnVisibility.user_avatar && (
                  <TableCell className="px-3">
                    <div className="flex items-center gap-2">
                      <UserAvatar
                        discordId={mission.user_id}
                        username={mission.discord_user?.username}
                        avatarUrl={mission.discord_user?.avatarUrl}
                        size="md"
                        className="flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-xs text-slate-900 dark:text-slate-100 truncate">
                          {mission.discord_user?.username || "Unknown User"}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                )}
                {columnVisibility.user_id && (
                  <TableCell className="px-3">
                    <div
                      className="text-xs w-full break-all"
                      title={mission.user_id}
                    >
                      {truncateText(mission.user_id)}
                    </div>
                  </TableCell>
                )}
                {columnVisibility.mission_name && (
                  <TableCell className="px-3">
                    <div className="w-full">
                      <div
                        className="truncate font-medium text-xs"
                        title={mission.mission_name}
                      >
                        {truncateText(mission.mission_name)}
                      </div>
                    </div>
                  </TableCell>
                )}
                {columnVisibility.status && (
                  <TableCell className="px-5">
                    <MissionStatusBadge status={mission.status} />
                  </TableCell>
                )}
                {columnVisibility.submission_link && (
                  <TableCell className="px-3">
                    {mission.submission_link ? (
                      <a
                        href={mission.submission_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 dark:text-blue-400 w-full break-all"
                        title={mission.submission_link}
                      >
                        {truncateText(mission.submission_link)}
                      </a>
                    ) : (
                      <span className="text-xs text-gray-400 italic">
                        No link
                      </span>
                    )}
                  </TableCell>
                )}
                {/* Actions column - always visible */}
                <TableCell className="px-0">
                  <div className="flex items-center space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewDetails(mission)}
                      className="h-7 w-7 p-0 cursor-pointer"
                      title="View Details"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    {/* Show Approve and Reject buttons only for Submitted status */}
                    {mission.status === "submitted" && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleApproveClick(mission)}
                          className="h-7 w-7 p-0 border-green-500 text-green-600 hover:text-green-700 hover:bg-green-50 cursor-pointer"
                          title="Approve Mission"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRejectClick(mission)}
                          className="h-7 w-7 p-0 border-red-500 text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer"
                          title="Reject Mission"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      <MissionActionConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={handleCloseDialog}
        onConfirm={handleConfirmAction}
        action={confirmDialog.action}
        missionName={confirmDialog.missionName}
        isLoading={isActionLoading}
      />
    </>
  );
};
