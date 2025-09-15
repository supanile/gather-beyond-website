"use client";

import { useState, useEffect } from "react";

interface DiscordUsernameProps {
  discordId: string;
  fallback?: string;
  className?: string;
}

interface DiscordUserData {
  username: string;
  avatarUrl: string;
}

export const DiscordUsername: React.FC<DiscordUsernameProps> = ({
  discordId,
  fallback = "Unknown User",
  className = "",
}) => {
  const [username, setUsername] = useState<string>(fallback);

  useEffect(() => {
    async function fetchDiscordUsername() {
      if (!discordId) {
        setUsername(fallback);
        return;
      }

      try {
        const response = await fetch(`/api/discord/${discordId}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch Discord user: ${response.statusText}`);
        }

        const data: DiscordUserData = await response.json();
        setUsername(data.username || "Unknown User");
      } catch (error) {
        console.error("Error fetching Discord username:", error);
        setUsername("Unknown User");
      }
    }

    fetchDiscordUsername();
  }, [discordId, fallback]);

  return <span className={className}>{username}</span>;
};
