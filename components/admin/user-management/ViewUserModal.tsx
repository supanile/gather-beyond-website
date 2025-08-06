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
import { UserWithAgent } from "@/types/admin/userManagement";

interface ViewUserModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  user: UserWithAgent | null;
}

export const ViewUserModal: React.FC<ViewUserModalProps> = ({
  isOpen,
  onOpenChange,
  user,
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

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xs sm:max-w-2xl mx-2 sm:mx-auto">
        <DialogHeader>
          <DialogTitle className="text-sm sm:text-lg">User Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 sm:space-y-4">
          <Card>
            <CardHeader className="p-3 sm:p-6 -mb-4 sm:pb-2">
              <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <span className="text-sm sm:text-lg break-words">
                  {user.email}
                </span>
                {user.agent?.mood && (
                  <Badge className="text-xs self-start sm:self-auto">
                    {getMoodEmoji(user.agent.mood)}{" "}
                    {user.agent.mood.charAt(0).toUpperCase() +
                      user.agent.mood.slice(1)}
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4 p-3 sm:p-6 pt-0">
              <div>
                <Label className="text-xs sm:text-sm font-medium text-muted-foreground">
                  Social Handles
                </Label>
                <p className="text-xs sm:text-sm mt-1 break-words">
                  {user.twitter_handle && (
                    <span>
                      Twitter: {user.twitter_handle}
                      <br />
                    </span>
                  )}
                  {user.telegram_handle && (
                    <span>Telegram: {user.telegram_handle}</span>
                  )}
                  {!user.twitter_handle && !user.telegram_handle && (
                    <span>-</span>
                  )}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <Label className="text-xs sm:text-sm font-medium text-muted-foreground">
                    XP
                  </Label>
                  <p className="text-xs sm:text-sm mt-1">
                    {user.agent?.xp?.toLocaleString() || "0"} XP
                  </p>
                </div>
                <div>
                  <Label className="text-xs sm:text-sm font-medium text-muted-foreground">
                    Level
                  </Label>
                  <p className="text-xs sm:text-sm mt-1">
                    Level {user.agent?.level || 1}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div>
                  <Label className="text-xs sm:text-sm font-medium text-muted-foreground">
                    Health
                  </Label>
                  <p className="text-xs sm:text-sm mt-1">
                    {user.agent?.health !== undefined
                      ? `${user.agent.health}/100`
                      : "-"}
                  </p>
                </div>
                <div>
                  <Label className="text-xs sm:text-sm font-medium text-muted-foreground">
                    Last Active
                  </Label>
                  <p className="text-xs sm:text-sm mt-1">
                    {user.agent?.last_active
                      ? formatLastActive(user.agent.last_active)
                      : "-"}
                  </p>
                </div>
              </div>

              <div>
                <Label className="text-xs sm:text-sm font-medium text-muted-foreground">
                  Interests
                </Label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {user.interests ? (
                    user.interests.split(",").map((interest, idx) => (
                      <Badge key={idx} variant="secondary" className="text-xs">
                        {interest.trim()}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-xs sm:text-sm text-muted-foreground">
                      -
                    </span>
                  )}
                </div>
              </div>

              <div>
                <Label className="text-xs sm:text-sm font-medium text-muted-foreground">
                  Joined Date
                </Label>
                <p className="text-xs sm:text-sm mt-1">
                  {user.agent?.created_at
                    ? formatDate(user.agent.created_at)
                    : "-"}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};
