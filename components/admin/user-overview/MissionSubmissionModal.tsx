import React from "react";
import { Mission } from "@/types/admin/adminTypes";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ExternalLink,
  Calendar,
  Clock,
  CheckCircle,
  FileText,
} from "lucide-react";
import {
  getStatusVariant,
  getStatusColor,
  getLinkType,
  formatDate,
} from "@/lib/admin/user/userTableUtils";

interface MissionSubmissionModalProps {
  mission: Mission | null;
  isOpen: boolean;
  onClose: () => void;
}

const MissionSubmissionModal: React.FC<MissionSubmissionModalProps> = ({
  mission,
  isOpen,
  onClose,
}) => {
  if (!mission) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-[95vw] sm:w-[90vw] h-fit max-h-[95vh] overflow-y-auto p-0">
        {/* Header Section */}
        <div className="px-4 sm:px-6 py-4 border-b bg-gradient-to-r from-background to-muted/20 sticky top-0 z-10">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg font-semibold text-foreground flex items-center gap-2 sm:gap-3">
              <span className="hidden sm:inline">Mission #{mission.mission_id} - Details Overview</span>
              <span className="sm:hidden">Mission #{mission.mission_id}</span>
            </DialogTitle>
          </DialogHeader>
        </div>

        {/* Content Section */}
        <div className="px-4 sm:px-6 py-4 space-y-4 sm:space-y-6">
          {/* Top Row - Mission Info & Status */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {/* Mission Information */}
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center gap-2 text-foreground font-medium text-sm sm:text-base">
                <FileText className="h-4 w-4 text-primary" />
                Mission Information
              </div>

              <div className="space-y-3 pl-4 sm:pl-6">
                <div className="flex flex-col space-y-1">
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Mission ID
                  </span>
                  <div className="px-3 py-2 bg-muted/50 rounded-md border">
                    <span className="text-sm font-mono text-foreground break-all">
                      {mission.mission_id}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col space-y-1">
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Status
                  </span>
                  <div className="flex items-center">
                    <Badge
                      variant={getStatusVariant(mission.status)}
                      className={`${getStatusColor(
                        mission.status
                      )} text-xs px-3 py-1`}
                    >
                      {mission.status.charAt(0).toUpperCase() +
                        mission.status.slice(1)}
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Mission Name */}
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center gap-2 text-foreground font-medium text-sm sm:text-base">
                <FileText className="h-4 w-4 text-primary" />
                Mission Details
              </div>

              <div className="pl-4 sm:pl-6">
                <div className="flex flex-col space-y-1">
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Mission Name
                  </span>
                  <div className="px-3 py-2 bg-muted/50 rounded-md border min-h-[2.5rem] flex items-center">
                    <p className="text-sm text-foreground leading-relaxed break-words">
                      {mission.mission_name}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Timeline Section */}
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center gap-2 text-foreground font-medium text-sm sm:text-base">
              <Clock className="h-4 w-4 text-primary" />
              Mission Timeline
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 pl-4 sm:pl-6">
              <div className="flex flex-col space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-3 w-3 text-blue-500" />
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Accepted At
                  </span>
                </div>
                <div className="px-3 py-2 bg-blue-50 dark:bg-blue-950/20 rounded-md border border-blue-200 dark:border-blue-800">
                  <p className="text-sm text-foreground break-words">
                    {!mission.accepted_at ||
                    mission.accepted_at === "NULL" ||
                    mission.accepted_at === ""
                      ? "Not available"
                      : formatDate(mission.accepted_at)}
                  </p>
                </div>
              </div>

              <div className="flex flex-col space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-3 w-3 text-orange-500" />
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Submitted At
                  </span>
                </div>
                <div className="px-3 py-2 bg-orange-50 dark:bg-orange-950/20 rounded-md border border-orange-200 dark:border-orange-800">
                  <p className="text-sm text-foreground break-words">
                    {!mission.submitted_at ||
                    mission.submitted_at === "NULL" ||
                    mission.submitted_at === ""
                      ? "Not submitted"
                      : formatDate(mission.submitted_at)}
                  </p>
                </div>
              </div>

              <div className="flex flex-col space-y-2 sm:col-span-2 lg:col-span-1">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-3 w-3 text-green-500" />
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    Completed At
                  </span>
                </div>
                <div className="px-3 py-2 bg-green-50 dark:bg-green-950/20 rounded-md border border-green-200 dark:border-green-800">
                  <p className="text-sm text-foreground break-words">
                    {!mission.completed_at ||
                    mission.completed_at === "NULL" ||
                    mission.completed_at === ""
                      ? "Not completed"
                      : formatDate(mission.completed_at)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Submission Details */}
          {mission.submission_link &&
            mission.submission_link !== "NULL" &&
            mission.submission_link !== "" && (
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center gap-2 text-foreground font-medium text-sm sm:text-base">
                  <ExternalLink className="h-4 w-4 text-primary" />
                  Submission Information
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pl-4 sm:pl-6">
                  <div className="flex flex-col space-y-2">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Link Type
                    </span>
                    <Badge
                      variant="outline"
                      className="w-fit px-3 py-1 text-xs"
                    >
                      {getLinkType(mission.submission_link)}
                    </Badge>
                  </div>

                  <div className="lg:col-span-2 flex flex-col space-y-2">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      Submission Link
                    </span>
                    <div className="px-3 py-2 bg-muted/50 rounded-md border overflow-hidden">
                      <p className="text-xs font-mono text-foreground break-all leading-relaxed">
                        {mission.submission_link}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
        </div>

        {/* Footer Section */}
        <div className="px-4 sm:px-6 py-4 border-t bg-muted/20 sticky bottom-0 z-10">
          <div className="flex flex-col sm:flex-row gap-3">
            {mission.submission_link &&
              mission.submission_link !== "NULL" &&
              mission.submission_link !== "" && (
                <Button asChild className="w-full sm:w-auto sm:flex-none">
                  <a
                    href={mission.submission_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Open Submission Link</span>
                    <span className="sm:hidden">Open Link</span>
                  </a>
                </Button>
              )}
            <Button variant="outline" onClick={onClose} className="w-full sm:w-auto sm:ml-auto cursor-pointer">
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MissionSubmissionModal;