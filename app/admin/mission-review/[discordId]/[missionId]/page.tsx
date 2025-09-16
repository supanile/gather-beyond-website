"use client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { MissionStatusBadge } from "@/components/admin/mission-review/MissionStatusBadge";
import { UserAvatar } from "@/components/admin/mission-review/UserAvatar";
import { MissionActionConfirmDialog } from "@/components/admin/mission-review/MissionActionConfirmDialog";
import { useMissionDetails } from "@/hooks/useMissionDetails";
import {
  Target,
  Link as LinkIcon,
  Clock,
  CheckCircle,
  Send,
  ExternalLink,
  X,
  User,
  Calendar,
  MessageSquare,
  ArrowLeft,
  Shield,
  Sparkles,
} from "lucide-react";

export default function MissionDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const missionId = params?.missionId as string;

  const { mission, loading, error, approveMission, rejectMission } =
    useMissionDetails(missionId);

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

  const handleApproveClick = () => {
    if (!mission) return;
    setConfirmDialog({
      isOpen: true,
      action: "approve",
      missionId: mission._id,
      missionName: mission.mission_name,
    });
  };

  const handleRejectClick = () => {
    if (!mission) return;
    setConfirmDialog({
      isOpen: true,
      action: "reject",
      missionId: mission._id,
      missionName: mission.mission_name,
    });
  };

  const handleConfirmAction = async (rejectionReason?: string) => {
    console.log("handleConfirmAction called with rejectionReason:", rejectionReason);
    setIsActionLoading(true);
    try {
      if (confirmDialog.action === "approve") {
        await approveMission(confirmDialog.missionId);
      } else {
        console.log("Calling rejectMission with reason:", rejectionReason);
        await rejectMission(confirmDialog.missionId, rejectionReason);
      }
      // Stay on the current page to see the updated status
      // The mission data will be updated automatically by the hooks
    } catch (error) {
      console.error("Action failed:", error);
      // You might want to show an error message to the user here
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

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
          <div className="text-center">
            <div className="relative mx-auto w-16 h-16 mb-6">
              {/* Background circle */}
              <div className="absolute inset-0 w-16 h-16 border-4 border-slate-200 dark:border-slate-700 rounded-full"></div>
              {/* Spinning circle */}
              <div className="absolute inset-0 w-16 h-16 border-4 border-blue-500 dark:border-blue-400 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <div className="space-y-2">
              <p className="text-lg font-medium text-slate-600 dark:text-slate-300">
                Loading mission details...
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Please wait a moment
              </p>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <X className="w-8 h-8 text-red-500 dark:text-red-400" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
              Error Loading Mission
            </h3>
            <p className="text-red-600 dark:text-red-400 mb-6">{error}</p>
            <Button
              onClick={() => router.back()}
              className="bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 dark:from-slate-500 dark:to-slate-600 dark:hover:from-slate-600 dark:hover:to-slate-700"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!mission) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 text-slate-400 dark:text-slate-500" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
              Mission Not Found
            </h3>
            <p className="text-slate-500 dark:text-slate-400 mb-6">
              The mission you&apos;re looking for doesn&apos;t exist or has been
              removed.
            </p>
            <Button
              onClick={() => router.back()}
              className="bg-gradient-to-r from-slate-600 to-slate-700 hover:from-slate-700 hover:to-slate-800 dark:from-slate-500 dark:to-slate-600 dark:hover:from-slate-600 dark:hover:to-slate-700"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const canApprove = mission.status === "submitted";
  const canReject = mission.status === "submitted";

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto space-y-8 p-6">
        {/* Header with enhanced gradient background */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-indigo-50/30 to-purple-50/50 dark:from-blue-950/20 dark:via-indigo-950/10 dark:to-purple-950/20 rounded-2xl"></div>
          <div className="relative p-6">
            <div className="flex items-center gap-4 mb-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.back()}
                className="flex items-center gap-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-slate-200/60 dark:border-slate-700/60 hover:bg-white dark:hover:bg-slate-900 transition-all duration-200"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl blur opacity-20"></div>
                <div className="relative p-3 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 dark:from-blue-400/20 dark:to-indigo-400/20 rounded-xl border border-blue-200/30 dark:border-blue-700/30">
                  <Target className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent">
                  {mission.mission_name}
                </h1>
                <p className="text-slate-600 dark:text-slate-400 mt-1">
                  Mission Review & Details
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        {(canApprove || canReject) && (
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-slate-50/50 to-slate-100/50 dark:from-slate-900/30 dark:to-slate-800/30 rounded-2xl"></div>
            <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/60 dark:border-slate-700/60 shadow-lg shadow-slate-200/20 dark:shadow-slate-900/20">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-1">
                    Review Actions
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Approve or reject this mission submission
                  </p>
                </div>
                <div className="flex gap-3">
                  {canReject && (
                    <Button
                      variant="destructive"
                      onClick={handleRejectClick}
                      className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg shadow-red-500/25 transition-all duration-200"
                    >
                      <X className="w-4 h-4 mr-2" />
                      Reject
                    </Button>
                  )}

                  {canApprove && (
                    <Button
                      onClick={handleApproveClick}
                      className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg shadow-green-500/25 transition-all duration-200"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Left Column - User & Mission Info */}
          <div className="xl:col-span-1 space-y-6">
            {/* User Information Card */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 dark:from-blue-400/10 dark:to-indigo-400/10 rounded-2xl transition-all duration-300 group-hover:from-blue-500/10 group-hover:to-indigo-500/10 dark:group-hover:from-blue-400/20 dark:group-hover:to-indigo-400/20"></div>
              <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/60 dark:border-slate-700/60 shadow-lg shadow-slate-200/20 dark:shadow-slate-900/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-lg">
                    <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                    User Information
                  </h3>
                </div>

                <div className="flex items-center gap-4">
                  <UserAvatar
                    discordId={mission.user_id}
                    username={mission.discord_user?.username}
                    avatarUrl={mission.discord_user?.avatarUrl}
                    size="lg"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-slate-900 dark:text-slate-100 text-lg truncate">
                      {mission.discord_user?.username || "Unknown User"}
                    </div>
                    <div className="text-sm text-slate-500 dark:text-slate-400 truncate">
                      {mission.user_id}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mission Details Card */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 dark:from-green-400/10 dark:to-emerald-400/10 rounded-2xl transition-all duration-300 group-hover:from-green-500/10 group-hover:to-emerald-500/10 dark:group-hover:from-green-400/20 dark:group-hover:to-emerald-400/20"></div>
              <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/60 dark:border-slate-700/60 shadow-lg shadow-slate-200/20 dark:shadow-slate-900/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-gradient-to-br from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-lg">
                    <Shield className="w-4 h-4 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                    Mission Details
                  </h3>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      Status
                    </span>
                    <MissionStatusBadge status={mission.status} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Timeline & Content */}
          <div className="xl:col-span-2 space-y-6">
            {/* Timeline Card */}
            <div className="group relative">
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-amber-500/5 dark:from-orange-400/10 dark:to-amber-400/10 rounded-2xl transition-all duration-300 group-hover:from-orange-500/10 group-hover:to-amber-500/10 dark:group-hover:from-orange-400/20 dark:group-hover:to-amber-400/20"></div>
              <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/60 dark:border-slate-700/60 shadow-lg shadow-slate-200/20 dark:shadow-slate-900/20">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-gradient-to-br from-orange-100 to-amber-100 dark:from-orange-900/30 dark:to-amber-900/30 rounded-lg">
                    <Clock className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                    Mission Timeline
                  </h3>
                </div>

                <div className="flex items-center justify-between relative">
                  {/* Timeline line */}
                  <div className="absolute top-6 left-6 right-6 h-0.5 bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 dark:from-slate-700 dark:via-slate-600 dark:to-slate-700"></div>

                  {/* Accepted */}
                  <div className="flex-1 text-center relative z-10">
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg shadow-yellow-500/25">
                      <Calendar className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-sm font-semibold text-yellow-700 dark:text-yellow-300 block mb-2">
                      Accepted
                    </span>
                    <span className="text-xs text-yellow-600 dark:text-yellow-400 font-medium">
                      {mission.accepted_at
                        ? new Date(mission.accepted_at * 1000).toLocaleString()
                        : "N/A"}
                    </span>
                  </div>

                  {/* Submitted */}
                  <div className="flex-1 text-center relative z-10">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-5 shadow-lg transition-all duration-300 ${
                        mission.submitted_at
                          ? "bg-gradient-to-br from-orange-400 to-red-500 shadow-orange-500/25"
                          : "bg-gradient-to-br from-slate-300 to-slate-400 dark:from-slate-600 dark:to-slate-700 shadow-slate-500/25"
                      }`}
                    >
                      <Send className="w-5 h-5 text-white" />
                    </div>
                    <span
                      className={`text-sm font-semibold block mb-1 ${
                        mission.submitted_at
                          ? "text-orange-700 dark:text-orange-300"
                          : "text-slate-500 dark:text-slate-400"
                      }`}
                    >
                      Submitted
                    </span>
                    <span
                      className={`text-xs font-medium ${
                        mission.submitted_at
                          ? "text-orange-600 dark:text-orange-400"
                          : "text-slate-500 dark:text-slate-400"
                      }`}
                    >
                      {mission.submitted_at
                        ? new Date(mission.submitted_at * 1000).toLocaleString()
                        : "In Progress"}
                    </span>
                  </div>

                  {/* Final Status */}
                  <div className="flex-1 text-center relative z-10">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg transition-all duration-300 ${
                        mission.status === "completed"
                          ? "bg-gradient-to-br from-green-400 to-emerald-500 shadow-green-500/25"
                          : mission.status === "rejected"
                          ? "bg-gradient-to-br from-red-400 to-red-500 shadow-red-500/25"
                          : "bg-gradient-to-br from-slate-300 to-slate-400 dark:from-slate-600 dark:to-slate-700 shadow-slate-500/25"
                      }`}
                    >
                      {mission.status === "rejected" ? (
                        <X className="w-5 h-5 text-white" />
                      ) : mission.status === "completed" ? (
                        <CheckCircle className="w-5 h-5 text-white" />
                      ) : (
                        <Sparkles className="w-5 h-5 text-white" />
                      )}
                    </div>
                    <span
                      className={`text-sm font-semibold block mb-2 ${
                        mission.status === "completed"
                          ? "text-green-700 dark:text-green-300"
                          : mission.status === "rejected"
                          ? "text-red-700 dark:text-red-300"
                          : "text-slate-500 dark:text-slate-400"
                      }`}
                    >
                      {mission.status === "completed"
                        ? "Completed"
                        : mission.status === "rejected"
                        ? "Rejected"
                        : "Review"}
                    </span>
                    <div className="flex flex-col items-center gap-1">
                      <span
                        className={`text-xs font-medium ${
                          mission.status === "completed"
                            ? "text-green-600 dark:text-green-400"
                            : mission.status === "rejected"
                            ? "text-red-600 dark:text-red-400"
                            : "text-slate-500 dark:text-slate-400"
                        }`}
                      >
                        {mission.status === "completed" && mission.completed_at
                          ? new Date(
                              mission.completed_at * 1000
                            ).toLocaleString()
                          : mission.status === "rejected" && mission.rejected_at
                          ? new Date(
                              mission.rejected_at * 1000
                            ).toLocaleString()
                          : mission.status === "completed"
                          ? "Today"
                          : mission.status === "rejected"
                          ? ""
                          : "Pending"}
                      </span>
                      {/* Verified by information */}
                      {mission.verified_by &&
                        (mission.status === "completed" ||
                          mission.status === "rejected") && (
                          <div className="flex items-center justify-center gap-1">
                            <Shield className="w-3 h-3 text-slate-500 dark:text-slate-400" />
                            <span className="text-xs text-slate-600 dark:text-slate-400">
                              by {mission.verified_by}
                            </span>
                          </div>
                        )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Verification Information Card */}
            {mission.verified_by &&
              (mission.status === "completed" ||
                mission.status === "rejected") && (
                <div className="group relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 dark:from-indigo-400/10 dark:to-purple-400/10 rounded-2xl transition-all duration-300 group-hover:from-indigo-500/10 group-hover:to-purple-500/10 dark:group-hover:from-indigo-400/20 dark:group-hover:to-purple-400/20"></div>
                  <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/60 dark:border-slate-700/60 shadow-lg shadow-slate-200/20 dark:shadow-slate-900/20">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 rounded-lg">
                        <Shield className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                        Verification Information
                      </h3>
                    </div>

                    <div className="bg-gradient-to-br from-slate-50 to-slate-100/50 dark:from-slate-800/50 dark:to-slate-900/50 rounded-xl p-4 border border-slate-200/50 dark:border-slate-700/50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-3 h-3 rounded-full ${
                              mission.status === "completed"
                                ? "bg-green-500"
                                : "bg-red-500"
                            }`}
                          ></div>
                          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                            {mission.status === "completed"
                              ? "Approved"
                              : "Rejected"}{" "}
                            by
                          </span>
                          <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                            {mission.verified_by}
                          </span>
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          {(mission.status === "completed" &&
                            mission.completed_at) ||
                          (mission.status === "rejected" && mission.rejected_at)
                            ? new Date(
                                ((mission.status === "completed"
                                  ? mission.completed_at
                                  : mission.rejected_at) || 0) * 1000
                              ).toLocaleString()
                            : "-"}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            {/* Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Submission Link Card */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 dark:from-purple-400/10 dark:to-pink-400/10 rounded-2xl transition-all duration-300 group-hover:from-purple-500/10 group-hover:to-pink-500/10 dark:group-hover:from-purple-400/20 dark:group-hover:to-pink-400/20"></div>
                <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/60 dark:border-slate-700/60 shadow-lg shadow-slate-200/20 dark:shadow-slate-900/20 h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-lg">
                      <LinkIcon className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      Submission Link
                    </h3>
                  </div>

                  {mission.submission_link ? (
                    <div className="space-y-4">
                      <div className="bg-gradient-to-br from-slate-50 to-slate-100/50 dark:from-slate-800/50 dark:to-slate-900/50 rounded-xl p-4 border border-slate-200/50 dark:border-slate-700/50">
                        <div className="flex items-start gap-3">
                          <LinkIcon className="w-4 h-4 text-slate-500 dark:text-slate-400 flex-shrink-0 mt-1" />
                          <div className="flex-1 min-w-0">
                            <span className="text-sm text-slate-700 dark:text-slate-300 break-all">
                              {mission.submission_link}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button
                        size="sm"
                        onClick={() =>
                          window.open(mission.submission_link, "_blank")
                        }
                        className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg shadow-purple-500/25 transition-all duration-200"
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Open Link
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8">
                      <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-full mb-4">
                        <LinkIcon className="w-8 h-8 text-slate-400 dark:text-slate-500" />
                      </div>
                      <span className="text-sm text-slate-500 dark:text-slate-400 italic text-center">
                        No submission link provided
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Notes Card */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 dark:from-emerald-400/10 dark:to-teal-400/10 rounded-2xl transition-all duration-300 group-hover:from-emerald-500/10 group-hover:to-teal-500/10 dark:group-hover:from-emerald-400/20 dark:group-hover:to-teal-400/20"></div>
                <div className="relative bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm rounded-2xl p-6 border border-slate-200/60 dark:border-slate-700/60 shadow-lg shadow-slate-200/20 dark:shadow-slate-900/20 h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 rounded-lg">
                      <MessageSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    </div>
                                        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                      {mission.status === "rejected" ? "Rejection Reason" : "Notes"}
                    </h3>
                  </div>

                  {mission.notes ? (
                    <div className="bg-gradient-to-br from-slate-50 to-slate-100/50 dark:from-slate-800/50 dark:to-slate-900/50 rounded-xl p-4 border border-slate-200/50 dark:border-slate-700/50 max-h-32 overflow-y-auto">
                      <span className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                        {mission.notes}
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8">
                      <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-full mb-4">
                        <MessageSquare className="w-8 h-8 text-slate-400 dark:text-slate-500" />
                      </div>
                      <span className="text-sm text-slate-500 dark:text-slate-400 italic text-center">
                        {mission.status === "rejected" 
                          ? "No rejection reason provided" 
                          : mission.status === "completed"
                          ? "No additional notes"
                          : "Awaiting review"}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <MissionActionConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={handleCloseDialog}
        onConfirm={handleConfirmAction}
        action={confirmDialog.action}
        missionName={confirmDialog.missionName}
        isLoading={isActionLoading}
      />
    </AdminLayout>
  );
}
