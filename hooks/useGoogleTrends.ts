import { useState, useEffect, useCallback } from "react";
import {
  GoogleTrendsData,
  GoogleTrendsMetrics,
  GoogleTrendsInsights,
} from "@/types/googleTrends";
import {
  generateGoogleTrendsData,
  processGoogleTrendsMetrics,
  generateGoogleTrendsInsights,
} from "@/lib/utils/googleTrendsMockData";

export interface UseGoogleTrendsOptions {
  timeframe?: "4H" | "24H" | "48H" | "7D";
  autoRefresh?: boolean;
  refreshInterval?: number; // milliseconds
}

export interface UseGoogleTrendsReturn {
  data: GoogleTrendsData | null;
  metrics: GoogleTrendsMetrics | null;
  insights: GoogleTrendsInsights | null;
  loading: boolean;
  error: string | null;
  timeframe: "4H" | "24H" | "48H" | "7D";
  lastUpdated: Date | null;
  refresh: () => void;
  setTimeframe: (timeframe: "4H" | "24H" | "48H" | "7D") => void;
}

export const useGoogleTrends = (
  options: UseGoogleTrendsOptions = {}
): UseGoogleTrendsReturn => {
  const {
    timeframe: initialTimeframe = "24H",
    autoRefresh = true,
    refreshInterval = 300000, // 5 minutes
  } = options;

  const [data, setData] = useState<GoogleTrendsData | null>(null);
  const [metrics, setMetrics] = useState<GoogleTrendsMetrics | null>(null);
  const [insights, setInsights] = useState<GoogleTrendsInsights | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeframe, setTimeframe] = useState<"4H" | "24H" | "48H" | "7D">(initialTimeframe);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));

      const trendsData = generateGoogleTrendsData(timeframe);
      const trendsMetrics = processGoogleTrendsMetrics(trendsData);
      const trendsInsights = generateGoogleTrendsInsights(trendsData);

      setData(trendsData);
      setMetrics(trendsMetrics);
      setInsights(trendsInsights);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch Google Trends data");
      console.error("Error fetching Google Trends:", err);
    } finally {
      setLoading(false);
    }
  }, [timeframe]);

  const refresh = useCallback(() => {
    fetchData();
  }, [fetchData]);

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Auto-refresh setup
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(fetchData, refreshInterval);
    return () => clearInterval(interval);
  }, [fetchData, autoRefresh, refreshInterval]);

  return {
    data,
    metrics,
    insights,
    loading,
    error,
    timeframe,
    lastUpdated,
    refresh,
    setTimeframe,
  };
};
