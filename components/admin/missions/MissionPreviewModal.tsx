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
                bot={false}
                timestamp="Today at 11:20"
                roleColor="#5865f2"
              >
                <DiscordEmbed
                  slot="embeds"
                  color="#5865f2"
                  embedTitle="🗺️ Available Missions"
                >
                  <div slot="description" className="text-base leading-relaxed">
                    <div className="text-lg font-bold text-white mb-3">
                      🎯 Mission 1: {mission.title || "Untitled Mission"}
                    </div>
                    
                    <div className="text-sm text-gray-400 mb-3 flex items-center gap-2">
                      <span>⭐ Level {mission.level_required || 1}</span>
                      <span>|</span>
                      <span>🕐 Ends in {timeRemaining}</span>
                    </div>
                    
                    <div className="text-[15px] text-gray-300 leading-normal">
                      {mission.description || "No description provided."}
                    </div>
                  </div>

                  <DiscordEmbedFields slot="fields">
                    <DiscordEmbedField fieldTitle="💰 Reward:" inline>
                      <span className="text-sm font-medium text-white">
                        {parseReward(mission.reward || "")}
                      </span>
                    </DiscordEmbedField>
                    
                    <DiscordEmbedField fieldTitle="🎯 Status:" inline>
                      <span className="text-sm font-medium text-green-400">
                        Available to accept
                      </span>
                    </DiscordEmbedField>
                    
                    <DiscordEmbedField fieldTitle="📋 Format:" inline>
                      <span className="text-sm font-medium text-white">
                        {mission.format || "Not specified"}
                      </span>
                    </DiscordEmbedField>
                    
                    <DiscordEmbedField fieldTitle="❗ Action to submit:">
                      <span className="text-sm font-medium text-white">
                        {mission.action_request || "Not specified"}
                      </span>
                    </DiscordEmbedField>

                    {mission.requirements && (
                      <DiscordEmbedField fieldTitle="⚠️ Requirements:">
                        <span className="text-sm font-medium text-white">
                          {mission.requirements}
                        </span>
                      </DiscordEmbedField>
                    )}

                    {mission.useful_link && (
                      <DiscordEmbedField fieldTitle="🔗 Useful Resource:">
                        <a
                          href={mission.useful_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 text-sm font-medium underline hover:text-blue-300 transition-colors"
                        >
                          {mission.useful_link}
                        </a>
                      </DiscordEmbedField>
                    )}
                  </DiscordEmbedFields>

                  <div slot="footer" className="text-xs text-gray-500 font-normal">
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