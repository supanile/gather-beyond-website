import { useState, useEffect } from "react";
import { DiscordServer, ServerStats } from "@/types/admin/serverTypes";

export const useServerData = () => {
  const [servers, setServers] = useState<DiscordServer[]>([]);
  const [stats, setStats] = useState<ServerStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchServerData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Fetch servers and statistics in parallel
      const [serversResponse, statsResponse] = await Promise.all([
        fetch('/api/server'),
        fetch('/api/server/statistics')
      ]);

      if (!serversResponse.ok) {
        throw new Error('Failed to fetch servers');
      }
      if (!statsResponse.ok) {
        throw new Error('Failed to fetch server statistics');
      }

      const serversData = await serversResponse.json();
      const statsData = await statsResponse.json();
      
      setServers(serversData);
      setStats(statsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch server data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchServerData();
  }, []);

  const refreshData = async () => {
    await fetchServerData();
  };

  return {
    servers,
    stats,
    isLoading,
    error,
    refreshData
  };
};
