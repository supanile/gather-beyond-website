import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Send } from "lucide-react";
import { UserWithAgent } from "@/types/admin/userManagement";
import { DiscordUsername } from "./DiscordUsername";
import XIcon from "@/components/ui/icons/XIcon";

interface ViewUserModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  user: UserWithAgent | null;
  allUsers?: UserWithAgent[]; // Add this prop to get proper XP/Level coloring
}

export const ViewUserModal: React.FC<ViewUserModalProps> = ({
  isOpen,
  onOpenChange,
  user,
  allUsers = [],
}) => {
  if (!user) return null;

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatLastActive = (timestamp: number) => {
    const now = Date.now();
    const lastActive = timestamp * 1000;
    const diffMs = now - lastActive;
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) {
      return `${diffDays}d ago`;
    } else if (diffHours > 0) {
      return `${diffHours}h ago`;
    } else {
      return "Just now";
    }
  };

  const getMoodEmoji = (mood: string) => {
    switch (mood.toLowerCase()) {
      case "happy":
        return "😊";
      case "neutral":
        return "😐";
      case "sad":
        return "😢";
      case "excited":
        return "🤩";
      case "angry":
        return "😠";
      case "love":
        return "😍";
      case "tired":
        return "😴";
      case "surprised":
        return "😲";
      default:
        return "😐";
    }
  };

  const getMoodColor = (mood: string) => {
    switch (mood.toLowerCase()) {
      case "happy":
        return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800";
      case "neutral":
        return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600";
      case "sad":
        return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800";
      case "excited":
        return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800";
      case "angry":
        return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800";
      case "love":
        return "bg-pink-100 text-pink-800 border-pink-200 dark:bg-pink-900/20 dark:text-pink-400 dark:border-pink-800";
      case "tired":
        return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800";
      case "surprised":
        return "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600";
    }
  };

  const getHealthColor = (health: number) => {
    if (health >= 80) return "text-green-600 dark:text-green-300";
    if (health >= 60) return "text-yellow-600 dark:text-yellow-300";
    if (health >= 40) return "text-orange-600 dark:text-orange-300";
    return "text-red-600 dark:text-red-300";
  };

  const getHealthBarColor = (health: number) => {
    if (health >= 80) return "bg-green-600 dark:bg-green-400";
    if (health >= 60) return "bg-yellow-600 dark:bg-yellow-400";
    if (health >= 40) return "bg-orange-600 dark:bg-orange-400";
    return "bg-red-600 dark:bg-red-400";
  };

  const getXPBadgeColor = (xp: number, allUsers: UserWithAgent[]) => {
    if (allUsers.length === 0) {
      return "bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-600";
    }
    const xpValues = allUsers.map((user) => user.agent?.xp || 0);
    const minXP = Math.min(...xpValues);
    const maxXP = Math.max(...xpValues);

    if (xp === minXP && xp === maxXP) {
      return "bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-600";
    } else if (xp === minXP) {
      return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800";
    } else if (xp === maxXP) {
      return "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800";
    } else {
      return "bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-600";
    }
  };

  const getLevelBadgeColor = (level: number, allUsers: UserWithAgent[]) => {
    if (allUsers.length === 0) {
      return "bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-600";
    }
    const levels = allUsers.map((user) => user.agent?.level || 1);
    const minLevel = Math.min(...levels);
    const maxLevel = Math.max(...levels);

    if (level === minLevel && level === maxLevel) {
      return "bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-600";
    } else if (level === minLevel) {
      return "bg-violet-100 text-violet-800 border-violet-200 dark:bg-violet-900/20 dark:text-violet-400 dark:border-violet-800";
    } else if (level === maxLevel) {
      return "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800";
    } else {
      return "bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-600";
    }
  };

  const getCreditsBadgeColor = (credits: number, allUsers: UserWithAgent[]) => {
    if (allUsers.length === 0) {
      return "bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-600";
    }

    const creditsValues = allUsers.map((user) => user.agent?.credits || 0);
    const minCredits = Math.min(...creditsValues);
    const maxCredits = Math.max(...creditsValues);

    if (credits === minCredits && credits === maxCredits) {
      return "bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-600";
    } else if (credits === minCredits) {
      return "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800";
    } else if (credits === maxCredits) {
      return "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800";
    } else {
      return "bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-600";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xs sm:max-w-2xl mx-2 sm:mx-auto">
        <DialogHeader>
          <DialogTitle className="text-sm sm:text-lg">User Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 sm:space-y-4">
          <Card>
            <CardHeader className="p-3 sm:p-6 -mb-2 sm:-mb-2">
              <CardTitle className="flex flex-col gap-2">
                <span className="text-sm sm:text-lg break-words font-medium">
                  <DiscordUsername discordId={user.discord_id} fallback={user.discord_id} />
                </span>
                <div className="text-sm text-muted-foreground">
                  {user.twitter_handle && (
                    <span className="mr-2 flex items-center gap-1">
                      <XIcon className="h-3 w-3" />
                      {user.twitter_handle}
                    </span>
                  )}
                  {user.telegram_handle && (
                    <span className="flex items-center gap-1">
                      <Send className="h-3 w-3" />
                      {user.telegram_handle}
                    </span>
                  )}
                  {!user.twitter_handle && !user.telegram_handle && (
                    <span>No social handles</span>
                  )}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 p-3 sm:p-6 pt-2">
              {/* XP and Level - Same styling as table */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <Label className="text-xs sm:text-sm font-medium text-muted-foreground mb-2 block">
                    XP
                  </Label>
                  <div className="flex justify-start">
                    <Badge
                      variant="outline"
                      className={getXPBadgeColor(user.agent?.xp || 0, allUsers)}
                    >
                      {user.agent?.xp?.toLocaleString() || "0"} XP
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-xs sm:text-sm font-medium text-muted-foreground mb-2 block">
                    Level
                  </Label>
                  <div className="flex justify-start">
                    <Badge
                      variant="outline"
                      className={getLevelBadgeColor(
                        user.agent?.level || 1,
                        allUsers
                      )}
                    >
                      Level {user.agent?.level || 1}
                    </Badge>
                  </div>
                </div>
                <div>
                  <Label className="text-xs sm:text-sm font-medium text-muted-foreground mb-2 block">
                    Credits
                  </Label>
                  <div className="flex justify-start">
                    <Badge
                      variant="outline"
                      className={getCreditsBadgeColor(
                        user.agent?.credits || 0,
                        allUsers
                      )}
                    >
                      {user.agent?.credits?.toLocaleString() || "0"} Credits
                    </Badge>
                  </div>
                </div>
              </div>
              {/* Mood and Health - Same styling as table */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs sm:text-sm font-medium text-muted-foreground mb-2 block">
                    Mood
                  </Label>
                  {user.agent?.mood ? (
                    <div className="flex justify-start">
                      <Badge
                        variant="outline"
                        className={getMoodColor(user.agent.mood)}
                      >
                        <span className="mr-1">
                          {getMoodEmoji(user.agent.mood)}
                        </span>
                        {user.agent.mood.charAt(0).toUpperCase() +
                          user.agent.mood.slice(1)}
                      </Badge>
                    </div>
                  ) : (
                    <div className="flex justify-start">
                      <span className="text-muted-foreground text-xs sm:text-sm">
                        -
                      </span>
                    </div>
                  )}
                </div>
                <div>
                  <Label className="text-xs sm:text-sm font-medium text-muted-foreground mb-2 block">
                    Health
                  </Label>
                  {user.agent?.health !== undefined ? (
                    <div className="flex items-center gap-2">
                      <div
                        className={`font-medium text-xs sm:text-sm ${getHealthColor(
                          user.agent.health
                        )}`}
                      >
                        {user.agent.health}/100
                      </div>
                      <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${getHealthBarColor(
                            user.agent.health
                          )}`}
                          style={{ width: `${user.agent.health}%` }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-start">
                      <span className="text-muted-foreground text-xs sm:text-sm">
                        -
                      </span>
                    </div>
                  )}
                </div>
              </div>
              {/* Interests - Display ALL interests with full text (no truncation) */}
              <div>
                <Label className="text-xs sm:text-sm font-medium text-muted-foreground mb-2 block">
                  Interests
                </Label>
                <div className="w-full">
                  {user.interests ? (
                    <div className="flex flex-wrap gap-1">
                      {user.interests.split(",").map((interest, idx) => (
                        <Badge
                          key={idx}
                          variant="secondary"
                          className="text-xs break-words whitespace-normal"
                          title={interest.trim()}
                        >
                          {interest.trim()}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <div className="flex justify-start">
                      <span className="text-xs sm:text-sm text-muted-foreground">
                        -
                      </span>
                    </div>
                  )}
                </div>
              </div>
              {/* Last Active and Joined Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-xs sm:text-sm font-medium text-muted-foreground mb-2 block">
                    Last Active
                  </Label>
                  <div className="text-xs sm:text-sm">
                    {user.agent?.last_active
                      ? formatLastActive(user.agent.last_active)
                      : "-"}
                  </div>
                </div>
                <div>
                  <Label className="text-xs sm:text-sm font-medium text-muted-foreground mb-2 block">
                    Joined Date
                  </Label>
                  <div className="text-xs sm:text-sm">
                    {user.agent?.created_at
                      ? formatDate(user.agent.created_at)
                      : "-"}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};
