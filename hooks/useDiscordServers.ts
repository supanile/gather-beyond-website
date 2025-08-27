import { useState, useEffect } from "react";

interface ServerInfo {
  name: string;
  serverId: string;
  icon: string | null;
  memberCount: number;
}

interface DiscordServersResponse {
  success: boolean;
  guilds: ServerInfo[];
  totalGuilds: number;
}

export const useDiscordServers = () => {
  const [data, setData] = useState<DiscordServersResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServers = async () => {
      try {
        setIsLoading(true);
        const response = await fetch("/api/discord/getserver");
        if (!response.ok) {
          throw new Error("Failed to fetch Discord servers");
        }
        const serverData = await response.json();
        setData(serverData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchServers();
  }, []);

  return {
    servers: data?.guilds || [],
    totalGuilds: data?.totalGuilds || 0,
    isLoading,
    error,
  };
};