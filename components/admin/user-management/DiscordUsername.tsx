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
  fallback = "Loading...",
  className = "",
}) => {
  const [username, setUsername] = useState<string>(fallback);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchDiscordUsername() {
      if (!discordId) {
        setUsername(fallback);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await fetch(`/api/discord/${discordId}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch Discord user: ${response.statusText}`);
        }

        const data: DiscordUserData = await response.json();
        setUsername(data.username || discordId);
      } catch (error) {
        console.error("Error fetching Discord username:", error);
        setUsername(discordId); // Fallback to discord ID
      } finally {
        setIsLoading(false);
      }
    }

    fetchDiscordUsername();
  }, [discordId, fallback]);

  if (isLoading) {
    return <span className={className}>{fallback}</span>;
  }

  return <span className={className}>{username}</span>;
};
