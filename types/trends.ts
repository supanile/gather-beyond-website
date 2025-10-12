export interface TwitterTrend {
  name: string;
  url: string;
  promoted_content: string | null;
  query: string;
  tweet_volume: number | null;
}

export interface TrendsData {
  trends: TwitterTrend[];
  as_of: string;
  created_at: string;
  locations: Array<{
    name: string;
    woeid: number;
  }>;
}

export interface TrendWithStats extends TwitterTrend {
  id: string;
  volume_change_24h?: number;
  volume_change_7d?: number;
  volume_change_30d?: number;
  momentum_score: number;
  rank: number;
  percentage: number;
  category: 'high' | 'medium' | 'low' | 'null';
  historical_data: Array<{
    timestamp: string;
    volume: number;
  }>;
}

export interface TrendsMetrics {
  total_volume: number;
  top_gainers: TrendWithStats[];
  top_losers: TrendWithStats[];
  trending_up: TrendWithStats[];
  trending_down: TrendWithStats[];
}

export type TimeRange = '24H' | '48H' | '7D' | '30D' | '3M' | '6M' | '12M';
export type LocationFilter = 'worldwide' | 'us' | 'uk' | 'brazil' | 'japan';
export type LanguageFilter = 'all' | 'en' | 'es' | 'pt' | 'ja' | 'fr';
