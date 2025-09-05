"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { MissionDetailsModalProps } from "@/types/admin/missionReview";
import { MissionStatusBadge } from "./MissionStatusBadge";
import { UserAvatar } from "./UserAvatar";
import {
  Target,
  Link as LinkIcon,
  FileText,
  Clock,
  CheckCircle,
  Send,
  ExternalLink,
  X
} from "lucide-react";

export function MissionDetailsModal({
  mission,
  isOpen,
  onClose,
  onApprove,
  onReject,
}: MissionDetailsModalProps) {
  if (!mission) return null;

  const formatTimestamp = (timestamp: number | null) => {
    if (!timestamp) return "Not available";
    return new Date(timestamp * 1000).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const canApprove = mission.status === "submitted";
  const canReject = mission.status === "submitted"

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <DialogTitle className="text-xl font-bold text-gray-900 dark:text-gray-100">
                {mission.mission_name}
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Mission ID: {mission.mission_id} • Submission ID: {mission._id}
              </DialogDescription>
            </div>
            <MissionStatusBadge status={mission.status} />
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <UserAvatar 
                  discordId={mission.user_id}
                  username={mission.discord_username}
                  avatarUrl={mission.discord_avatar_url}
                  size="sm"
                />
                <div className="flex flex-col">
                  <span className="font-medium text-gray-900 dark:text-gray-100">User</span>
                  <span className="text-gray-600 dark:text-gray-400 font-mono text-xs">
                    ID: {mission.user_id}
                  </span>
                </div>
              </div>
              
              <div className="flex items-center gap-2 text-sm">
                <Target className="w-4 h-4 text-gray-500" />
                <span className="font-medium">Mission ID:</span>
                <Badge variant="outline" className="text-xs">
                  {mission.mission_id}
                </Badge>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <FileText className="w-4 h-4 text-gray-500" />
                <span className="font-medium">Submission ID:</span>
                <Badge variant="outline" className="text-xs">
                  {mission._id}
                </Badge>
              </div>
            </div>
          </div>

          <Separator />

          {/* Timeline */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Timeline
            </h3>
            
            <div className="space-y-3">
              {mission.accepted_at && (
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="font-medium">Accepted:</span>
                  <span className="text-gray-600 dark:text-gray-400">
                    {formatTimestamp(mission.accepted_at)}
                  </span>
                </div>
              )}
              
              {mission.submitted_at && (
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <span className="font-medium">Submitted:</span>
                  <span className="text-gray-600 dark:text-gray-400">
                    {formatTimestamp(mission.submitted_at)}
                  </span>
                </div>
              )}
              
              {mission.completed_at && (
                <div className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="font-medium">Completed:</span>
                  <span className="text-gray-600 dark:text-gray-400">
                    {formatTimestamp(mission.completed_at)}
                  </span>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Submission Details */}
          <div className="space-y-4">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
              <Send className="w-4 h-4" />
              Submission Details
            </h3>
            
            {mission.submission_link ? (
              <div className="space-y-2">
                <span className="text-sm font-medium">Submission Link:</span>
                <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <LinkIcon className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400 break-all flex-1">
                    {mission.submission_link}
                  </span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => window.open(mission.submission_link, '_blank')}
                    className="h-8 w-8 p-0"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-sm text-gray-500 italic">
                No submission link provided
              </div>
            )}

            {mission.notes ? (
              <div className="space-y-2">
                <span className="text-sm font-medium">Notes:</span>
                <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded-lg">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {mission.notes}
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-sm text-gray-500 italic">
                No notes available
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full sm:w-auto"
          >
            Close
          </Button>
          
          <div className="flex gap-2 w-full sm:w-auto">
            {canReject && onReject && (
              <Button
                variant="destructive"
                onClick={() => {
                  onReject(mission._id);
                  onClose();
                }}
                className="flex-1 sm:flex-initial"
              >
                <X className="w-4 h-4 mr-2" />
                Reject
              </Button>
            )}
            
            {canApprove && onApprove && (
              <Button
                onClick={() => {
                  onApprove(mission._id);
                  onClose();
                }}
                className="flex-1 sm:flex-initial"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Approve
              </Button>
            )}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
