// Import functions to use in this file
import { generateMockTrendsData as generateTwitterMockTrendsData } from "./twitterMockData";
import { processTrendsData as processTwitterTrendsData } from "./twitterMockData";
import { TimeRange, LocationFilter } from "@/types/trends";
import { 
  generateGoogleTrendsData
} from "./googleTrendsMockData";
import type { GoogleTrendsData } from "@/types/googleTrends";
import type { TrendsData } from "@/types/trends";

// Export Google Trends mock data functions as main exports
export {
  generateGoogleTrendsData,
  formatSearchVolume,
  formatTimeAgo,
  getTrendingIcon,
  getCategoryColor,
} from "./googleTrendsMockData";

// Export Twitter mock data functions with explicit names
export {
  generateMockTrendsData as generateTwitterTrendsData,
  formatTweetVolume,
  formatPercentageChange,
} from "./twitterMockData";

// Export types
export type { TwitterTrend, TrendsData, TrendWithStats, TrendsMetrics } from "@/types/trends";
export type { 
  GoogleTrendItem, 
  GoogleTrendsData, 
  GoogleTrendWithStats, 
  GoogleTrendsMetrics,
  GoogleTrendsInsights 
} from "@/types/googleTrends";

// Data source configuration
export const DATA_SOURCES = {
  TWITTER: "twitter",
  GOOGLE_TRENDS: "google_trends",
} as const;

export type DataSource = typeof DATA_SOURCES[keyof typeof DATA_SOURCES];

// Configuration interface for switching between data sources
export interface TrendsConfig {
  dataSource: DataSource;
  timeframe?: "4H" | "24H" | "48H" | "7D";
  location?: string;
  refreshInterval?: number; // milliseconds
}

// Default configuration
export const DEFAULT_TRENDS_CONFIG: TrendsConfig = {
  dataSource: DATA_SOURCES.GOOGLE_TRENDS,
  timeframe: "24H",
  location: "Thailand",
  refreshInterval: 300000, // 5 minutes
};

// Helper function to get appropriate mock data based on config
export const getMockTrendsData = (config: TrendsConfig = DEFAULT_TRENDS_CONFIG) => {
  switch (config.dataSource) {
    case DATA_SOURCES.TWITTER:
      return {
        type: "twitter" as const,
        data: generateTwitterMockTrendsData(),
      };
    case DATA_SOURCES.GOOGLE_TRENDS:
      return {
        type: "google_trends" as const,
        data: generateGoogleTrendsData(config.timeframe || "24H"),
      };
    default:
      return {
        type: "google_trends" as const,
        data: generateGoogleTrendsData("24H"),
      };
  }
};

// Adapter function to convert Google Trends data to Twitter Trends format for compatibility
const adaptGoogleTrendsToTwitterFormat = (googleTrends: GoogleTrendsData): TrendsData => {
  // Parse search volume to get numeric value
  const parseSearchVolume = (volume: string): number => {
    const cleanVolume = volume.replace(/[+,]/g, "");
    const multiplier = cleanVolume.slice(-1).toLowerCase();
    const number = parseFloat(cleanVolume.slice(0, -1));

    switch (multiplier) {
      case "k":
        return number * 1000;
      case "m":
        return number * 1000000;
      default:
        return parseInt(cleanVolume) || 0;
    }
  };

  const twitterFormat: TrendsData = {
    trends: googleTrends.trends.map((trend) => ({
      name: trend.term,
      url: trend.exploreLink,
      promoted_content: null,
      query: encodeURIComponent(trend.term),
      tweet_volume: parseSearchVolume(trend.searchVolume),
    })),
    as_of: googleTrends.lastUpdated,
    created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    locations: [{ name: googleTrends.location || "Thailand", woeid: 1 }],
  };
  return twitterFormat;
};

// Main export function that returns Google Trends data in Twitter format for compatibility
export const generateMockTrendsData = (timeRange: TimeRange = "24H", location: LocationFilter = 'thailand') => {
  // Only use supported timeframes for Google Trends data
  const supportedTimeframe = ["4H", "24H", "48H", "7D"].includes(timeRange) ? timeRange as "4H" | "24H" | "48H" | "7D" : "24H";
  const googleData = generateGoogleTrendsData(supportedTimeframe, location);
  return adaptGoogleTrendsToTwitterFormat(googleData);
};

// Create processTrendsData that works with the adapted data
export const processTrendsData = (data: TrendsData) => {
  // Use the original processTrendsData from twitterMockData
  return processTwitterTrendsData(data);
};