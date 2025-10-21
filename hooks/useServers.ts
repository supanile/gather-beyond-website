import { useState, useEffect } from 'react';
import { DiscordServer, ServerStats } from '@/types/admin/serverTypes';

export function useServers() {
  const [servers, setServers] = useState<DiscordServer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServers = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/server');
        
        if (!response.ok) {
          throw new Error('Failed to fetch servers');
        }
        
        const data = await response.json();
        setServers(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchServers();
  }, []);

  return {
    servers,
    isLoading,
    error,
    refetch: async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/server');
        if (!response.ok) throw new Error('Failed to fetch servers');
        const data = await response.json();
        setServers(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    }
  };
}

export function useServerStatistics() {
  const [statistics, setStatistics] = useState<ServerStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/server/statistics');
        
        if (!response.ok) {
          throw new Error('Failed to fetch server statistics');
        }
        
        const data = await response.json();
        setStatistics(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  return {
    statistics,
    isLoading,
    error,
    refetch: async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch('/api/server/statistics');
        if (!response.ok) throw new Error('Failed to fetch server statistics');
        const data = await response.json();
        setStatistics(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    }
  };
}
