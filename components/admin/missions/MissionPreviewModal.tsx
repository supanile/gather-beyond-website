import React from "react";
import { X, Target, Calendar, Star, ExternalLink, Users } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { NewMissionForm } from "@/types/admin/missions/missionTypes";
import {
  DiscordMessages,
  DiscordMessage,
  DiscordEmbed,
  DiscordEmbedField,
  DiscordEmbedFields,
  DiscordMention,
  DiscordTime,
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
          {/* Discord Components Preview */}
          <div className="discord-preview">
            <DiscordMessages>
              <DiscordMessage
                author="Super Agent"
                avatar="https://cdn.discordapp.com/avatars/123456789/avatar.png"
                bot
                verified
                timestamp={new Date()}
              >
                <DiscordEmbed
                  slot="embeds"
                  color="#5865f2"
                  authorName="🗺️ Available Missions"
                  authorIcon="https://cdn.discordapp.com/emojis/world_map.png"
                >
                  <div slot="title">
                    🎯 Mission 1: {mission.title || "Untitled Mission"}
                  </div>
                  
                  <div slot="description">
                    <div className="flex items-center gap-4 text-sm mb-3">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400" />
                        <span>Level {mission.level_required || 1}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4 text-red-400" />
                        <span>Ends in {timeRemaining}</span>
                      </div>
                    </div>

                    <p className="mb-4">
                      {mission.description || "No description provided."}
                    </p>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <span>💰</span>
                        <span className="font-medium">Reward:</span>
                        <span>{parseReward(mission.reward || "")}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span>🎯</span>
                        <span className="font-medium">Status:</span>
                        <span className="text-green-400">Available to accept</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span>📝</span>
                        <span className="font-medium">Format:</span>
                        <span>{mission.format || "Not specified"}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span>📍</span>
                        <span className="font-medium">Action to submit:</span>
                        <span>{mission.action_request || "Not specified"}</span>
                      </div>
                    </div>

                    {/* Requirements section */}
                    {mission.requirements && (
                      <div className="mt-4 p-3 bg-yellow-900/20 border-l-2 border-yellow-400 rounded">
                        <div className="flex items-center gap-2 mb-1">
                          <span>⚠️</span>
                          <span className="font-medium text-sm">Requirements:</span>
                        </div>
                        <p className="text-xs leading-relaxed">
                          {mission.requirements}
                        </p>
                      </div>
                    )}

                    {/* Useful link */}
                    {mission.useful_link && (
                      <div className="mt-4">
                        <a
                          href={mission.useful_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-blue-400 hover:underline text-sm"
                        >
                          <ExternalLink className="w-3 h-3" />
                          Useful Resource
                        </a>
                      </div>
                    )}
                  </div>

                  <DiscordEmbedFields slot="fields">
                    <DiscordEmbedField fieldTitle="💰 Reward" inline>
                      {parseReward(mission.reward || "")}
                    </DiscordEmbedField>
                    <DiscordEmbedField fieldTitle="🎯 Status" inline>
                      Available to accept
                    </DiscordEmbedField>
                    <DiscordEmbedField fieldTitle="📝 Format" inline>
                      {mission.format || "Not specified"}
                    </DiscordEmbedField>
                  </DiscordEmbedFields>

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