import { useState, useEffect } from "react";
import { DiscordServer, ServerStats } from "@/types/admin/serverTypes";
import { mockDiscordServers, calculateServerStats } from "@/data/admin/serverMockData";

export const useServerData = () => {
  const [servers, setServers] = useState<DiscordServer[]>([]);
  const [stats, setStats] = useState<ServerStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServerData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // In the future, this will be replaced with actual API calls
        // const response = await fetch('/api/admin/servers');
        // const data = await response.json();
        
        setServers(mockDiscordServers);
        setStats(calculateServerStats(mockDiscordServers));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch server data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchServerData();
  }, []);

  const refreshData = async () => {
    setIsLoading(true);
    try {
      // Simulate refresh
      await new Promise(resolve => setTimeout(resolve, 500));
      setServers(mockDiscordServers);
      setStats(calculateServerStats(mockDiscordServers));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh server data');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    servers,
    stats,
    isLoading,
    error,
    refreshData
  };
};
