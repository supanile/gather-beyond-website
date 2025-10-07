import { useState, useEffect } from 'react';

interface Statistics {
  totaluser: number;
  totalmissions: number;
  totalcommunity: number;
  totalmissionsubmitted: number;
  totalXP: number;
  activeUsers: {
    last7Days: number;
    last14Days: number;
    last30Days: number;
    last60Days: number;
  };
}

export const useStatistics = () => {
  const [stats, setStats] = useState<Statistics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/statistics');
        if (!response.ok) {
          throw new Error('Failed to fetch statistics');
        }
        const data = await response.json();
        setStats(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { stats, isLoading, error };
};
