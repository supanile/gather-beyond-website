import React from "react";
import { Users } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { NewMissionForm } from "@/types/admin/missions/missionTypes";
import {
  DiscordMessages,
  DiscordMessage,
  DiscordEmbed,
  DiscordEmbedField,
  DiscordEmbedFields,
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

  // Format date for display
  const formatDate = (dateStr: string) => {
    try {
      if (dateStr) {
        return format(new Date(dateStr), "PPP 'at' HH:mm");
      }
    } catch {
      return "Invalid date";
    }
    return "Not set";
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
                avatar="https://cdn.discordapp.com/embed/avatars/0.png"
                bot={true}
                timestamp="Today at 11:20"
              >
                <DiscordEmbed
                  slot="embeds"
                  color="#5865f2"
                  embedTitle="🗺️ Available Missions"
                >
                  {/* Mission header */}
                  <div slot="description">
                    <div className="mb-4">
                      <h3 className="text-white font-semibold text-lg mb-2 flex items-center gap-2">
                        🎯 Mission 1: {mission.title || "Untitled Mission"}
                      </h3>
                      
                      <div className="flex items-center gap-4 text-sm mb-3">
                        <div className="flex items-center gap-1">
                          ⭐ Level {mission.level_required || 1}
                        </div>
                        <div className="flex items-center gap-1">
                          🗓️ Ends in {timeRemaining}
                        </div>
                      </div>
                    </div>

                    {/* Mission description */}
                    <div className="mb-4">
                      <p className="text-sm leading-relaxed">
                        {mission.description || "No description provided."}
                      </p>
                    </div>

                    {/* Mission details */}
                    <div className="space-y-2 text-sm">
                      <div className="flex items-start gap-2">
                        <span>💰</span>
                        <span className="font-medium">Reward:</span>
                        <span>{parseReward(mission.reward || "")}</span>
                      </div>

                      <div className="flex items-start gap-2">
                        <span>🎯</span>
                        <span className="font-medium">Status:</span>
                        <span className="text-green-400">Available to accept</span>
                      </div>

                      <div className="flex items-start gap-2">
                        <span>📝</span>
                        <span className="font-medium">Format:</span>
                        <span>{mission.format || "Not specified"}</span>
                      </div>

                      <div className="flex items-start gap-2">
                        <span>❓</span>
                        <span className="font-medium">Action to submit:</span>
                        <span>{mission.action_request || "Not specified"}</span>
                      </div>
                    </div>

                    {/* Additional info if available */}
                    {mission.requirements && (
                      <div className="mt-4 p-3 bg-yellow-900/20 rounded border-l-4 border-yellow-400">
                        <div className="flex items-center gap-2 mb-1">
                          <span>⚠️</span>
                          <span className="font-medium text-sm">Requirements:</span>
                        </div>
                        <p className="text-xs leading-relaxed opacity-90">
                          {mission.requirements}
                        </p>
                      </div>
                    )}

                    {/* Useful link if provided */}
                    {mission.useful_link && (
                      <div className="mt-4">
                        <a
                          href={mission.useful_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-blue-400 hover:underline text-sm"
                        >
                          🔗 Useful Resource
                        </a>
                      </div>
                    )}
                  </div>

                  <div slot="footer">
                    6 available missions | Use /my_missions to view your accepted missions
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