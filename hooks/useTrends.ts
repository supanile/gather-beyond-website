import { useState, useEffect, useCallback } from 'react';
import { TrendsData, TrendsMetrics, TimeRange, LocationFilter, LanguageFilter } from '@/types/trends';
import { trendsAPI } from '@/lib/api/trends';
import { generateMockTrendsData, processTrendsData } from '@/lib/utils/mockData';
import { DEFAULT_LOCATION } from '@/config/locations';

interface UseTrendsOptions {
  timeRange?: TimeRange;
  location?: LocationFilter;
  language?: LanguageFilter;
  useMockData?: boolean;
}

interface UseTrendsReturn {
  data: TrendsData | null;
  metrics: TrendsMetrics | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export const useTrends = ({
  timeRange = '4H',
  location = DEFAULT_LOCATION,
  language = 'all',
  useMockData = true // Set to true for development
}: UseTrendsOptions = {}): UseTrendsReturn => {
  const [data, setData] = useState<TrendsData | null>(null);
  const [metrics, setMetrics] = useState<TrendsMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTrends = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let trendsData: TrendsData;

      if (useMockData) {
        // Use mock data for development - pass location for future extensibility
        trendsData = generateMockTrendsData(timeRange, location);
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
      } else {
        // Use real API
        trendsData = await trendsAPI.getTrends(timeRange, location, language);
      }

      const trendsMetrics = processTrendsData(trendsData);

      setData(trendsData);
      setMetrics(trendsMetrics);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching trends:', err);
    } finally {
      setLoading(false);
    }
  }, [timeRange, location, language, useMockData]);

  const refetch = () => {
    fetchTrends();
  };

  useEffect(() => {
    fetchTrends();
  }, [fetchTrends]);

  return {
    data,
    metrics,
    loading,
    error,
    refetch
  };
};
