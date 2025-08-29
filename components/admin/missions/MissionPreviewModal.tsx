import React from "react";
import { Users } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { NewMissionForm } from "@/types/admin/missions/missionTypes";
import {
  DiscordMessages,
  DiscordMessage,
  DiscordEmbed,
} from "@derockdev/discord-components-react";

interface MissionPreviewModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  mission: NewMissionForm;
}

export const MissionPreviewModal: React.FC<MissionPreviewModalProps> = ({
  isOpen,
  onOpenChange,
  mission,
}) => {
  // Parse reward JSON
  const parseReward = (rewardStr: string) => {
    try {
      if (rewardStr) {
        const parsed = JSON.parse(rewardStr);
        return `${parsed.amount || 0} ${parsed.token || "XP"}`;
      }
    } catch {
      return rewardStr || "No reward";
    }
    return "No reward";
  };

  // Format date for display - ใช้ JavaScript native
  const formatDate = (dateStr: string) => {
    try {
      if (dateStr) {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) {
          return "Invalid date";
        }
        // Format "Wednesday, 27 August BE 2025 at 00:00"
        const options: Intl.DateTimeFormatOptions = {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        };
        const formatted = date.toLocaleDateString("en-US", options);
        // Convert to Buddhist Era (BE) by adding 543 to the year
        const beYear = date.getFullYear() + 543;
        return formatted.replace(date.getFullYear().toString(), `BE ${beYear}`).replace(" at ", " at ");
      }
    } catch {
      return "Invalid date";
    }
    return "Not set";
  };

  // Get current time in HH:MM format
  const getCurrentTime = () => {
    return new Date().toISOString();
  };

  // Format current time for footer display (Today at HH:MM)
  const getCurrentTimeForFooter = () => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `Today at ${hours}:${minutes}`;
  };

  // Calculate time remaining
  const getTimeRemaining = (endDateStr: string) => {
    try {
      if (endDateStr) {
        const endDate = new Date(endDateStr);
        const now = new Date();
        const diff = endDate.getTime() - now.getTime();

        if (diff > 0) {
          const hours = Math.floor(diff / (1000 * 60 * 60));
          const days = Math.floor(hours / 24);

          if (days > 0) {
            return `${days} day${days > 1 ? "s" : ""}`;
          } else {
            return `${hours} hour${hours !== 1 ? "s" : ""}`;
          }
        }
        return "Expired";
      }
    } catch {
      return "Invalid date";
    }
    return "Not set";
  };

  const timeRemaining = mission.endDate
    ? getTimeRemaining(mission.endDate)
    : "Not set";

  const currentTime = getCurrentTime();
  const footerTime = getCurrentTimeForFooter();

  // Format end date for tooltip
  const getEndDateForTooltip = () => {
    if (mission.endDate) {
      return formatDate(mission.endDate);
    }
    return "End date not set";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="text-xl font-semibold">
            Mission Preview
          </DialogTitle>
          <p className="text-sm text-muted-foreground mt-1">
            This is how the mission will appear to users in the app
          </p>
        </DialogHeader>

        <div className="p-6">
          {/* Discord-like preview using the library */}
          <div className="rounded-lg overflow-hidden">
            <DiscordMessages>
                <DiscordMessage
                author="Super Agent"
                avatar="/images/superagent-profile.png"
                bot={true}
                timestamp={currentTime}
                roleColor="gold"
                >
                <DiscordEmbed
                  slot="embeds"
                  color="#047AFE"
                  embedTitle="🗺️ Available Missions"
                >
                  <div slot="description">
                  <div className="text-lg font-bold text-white mb-2">
                    🎯 Mission 1: {mission.title || "Untitled Mission"}
                  </div>

                  <div className="text-base text-white font-bold mb-4 flex items-center gap-2">
                    <span>⭐ Level {mission.level_required || 1}</span>
                    <span>|</span>
                    <span>
                    ⏰ <span className="font-bold">Ends</span>{" "}
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="px-1.5 py-0 bg-gray-500/20 rounded-md font-medium text-gray-100 cursor-help hover:bg-gray-500/30 transition-colors">
                            in {timeRemaining}
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{getEndDateForTooltip()}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    </span>
                  </div>

                  <div className="text-base text-gray-300 leading-normal mb-4">
                    {mission.description || "No description provided."}
                  </div>

                  <div className="mt-4">
                    <div className="text-base">
                    <span className="font-bold">💰 Reward:</span>{" "}
                    <span className="font-medium">
                      {parseReward(mission.reward || "")}
                    </span>
                    </div>

                    <div className="text-base">
                    <span className="font-bold">🎯 Status:</span>{" "}
                    <span className="font-medium">Available to accept</span>
                    </div>

                    <div className="text-base">
                    <span className="font-bold">📋 Format:</span>{" "}
                    <span className="font-medium">
                      {mission.format || "Not specified"}
                    </span>
                    </div>

                    <div className="text-base">
                    <span className="font-bold">⚡ Action to submit:</span>{" "}
                    <span className="font-medium">
                      {mission.action_request || "Not specified"}
                    </span>
                    </div>
                  </div>
                  </div>

                  <div slot="footer">
                  <div className="text-xs text-gray-200 font-medium mt-3">
                    99 available missions | Use /my_missions to view your
                    accepted missions • {footerTime}
                  </div>
                  </div>
                </DiscordEmbed>
                </DiscordMessage>
            </DiscordMessages>
          </div>

          {/* Mission metadata (admin view) */}
          <div className="mt-6 p-4 bg-muted/50 rounded-lg border">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Mission Metadata (Admin View)
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <div>
                <span className="font-medium text-muted-foreground">Type:</span>
                <p className="mt-1">{mission.type || "Not set"}</p>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">
                  Platform:
                </span>
                <p className="mt-1">{mission.platform || "Not set"}</p>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">
                  Partner:
                </span>
                <p className="mt-1">{mission.partner || "Not set"}</p>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">
                  Start Date:
                </span>
                <p className="mt-1">
                  {mission.startDate
                    ? formatDate(mission.startDate)
                    : "Not set"}
                </p>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">
                  End Date:
                </span>
                <p className="mt-1">
                  {mission.endDate ? formatDate(mission.endDate) : "Not set"}
                </p>
              </div>
              <div>
                <span className="font-medium text-muted-foreground">
                  Level Required:
                </span>
                <p className="mt-1">Level {mission.level_required || 1}</p>
              </div>
            </div>
          </div>

          {/* Close button */}
          <div className="flex justify-end mt-6">
            <Button
              onClick={() => onOpenChange(false)}
              variant="outline"
              className="px-6"
            >
              Close Preview
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};