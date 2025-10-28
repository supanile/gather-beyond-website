import { TrendsData, TrendsMetrics, TimeRange, LocationFilter, LanguageFilter, TrendWithStats } from '@/types/trends';
import { DEFAULT_LOCATION } from '@/config/locations';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

export class TrendsAPIClient {
  private baseURL: string;

  constructor(baseURL = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  async getTrends(
    timeRange: TimeRange = '24H',
    location: LocationFilter = DEFAULT_LOCATION,
    language: LanguageFilter = 'all'
  ): Promise<TrendsData> {
    try {
      const params = new URLSearchParams({
        timeRange,
        location,
        language,
      });

      const response = await fetch(`/api/trends?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching trends data:', error);
      throw error;
    }
  }

  async getTrendsMetrics(
    timeRange: TimeRange = '24H',
    location: LocationFilter = DEFAULT_LOCATION
  ): Promise<TrendsMetrics> {
    try {
      const params = new URLSearchParams({
        timeRange,
        location,
        metrics: 'true'
      });

      const response = await fetch(`/api/trends/metrics?${params}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching trends metrics:', error);
      throw error;
    }
  }

  async getTrendDetails(trendId: string): Promise<TrendWithStats> {
    try {
      const response = await fetch(`/api/trends/${trendId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching trend details:', error);
      throw error;
    }
  }
}

export const trendsAPI = new TrendsAPIClient();
