"use client";

import { useState, useEffect } from "react";
import { UserAvatar } from "@/components/admin/mission-review/UserAvatar";

interface DiscordUserDisplayProps {
  discordId: string;
  size?: "sm" | "md" | "lg";
  showFullId?: boolean;
}

export const DiscordUserDisplay = ({
  discordId,
  size = "sm",
  showFullId = false,
}: DiscordUserDisplayProps) => {
  const [discordData, setDiscordData] = useState<{
    username: string;
    avatarUrl: string;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (discordId) {
      setLoading(true);
      fetch("/api/discord/discord-name", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ discord_id: discordId }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.username || data.avatarUrl) {
            setDiscordData({
              username: data.username || "Unknown User",
              avatarUrl: data.avatarUrl,
            });
          }
        })
        .catch(() => {
          // Handle error silently
        })
        .finally(() => setLoading(false));
    }
  }, [discordId]);

  if (loading) {
    return (
      <div className="flex items-center gap-2">
        <UserAvatar
          discordId={discordId}
          size={size}
          className={size === "sm" ? "w-4 h-4" : "w-6 h-6"}
          clickable={false}
        />
        <span className="text-xs text-muted-foreground animate-pulse">
          Loading...
        </span>
      </div>
    );
  }

  const displayName =
    discordData?.username ||
    (showFullId ? discordId : `User ${discordId.slice(0, 8)}...`);

  return (
    <div className="flex items-center gap-2">
      <UserAvatar
        discordId={discordId}
        username={discordData?.username}
        avatarUrl={discordData?.avatarUrl}
        size={size}
        className={size === "sm" ? "w-4 h-4" : "w-6 h-6"}
        clickable={false}
      />
      <span className="text-xs font-medium text-foreground truncate">
        {displayName}
      </span>
    </div>
  );
};
