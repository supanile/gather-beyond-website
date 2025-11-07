export type SocialPlatform = 'google' | 'tiktok' | 'x' | 'reddit' | 'gather';

export interface BaseTrend {
  id: string;
  name: string;
  url?: string;
  volume: number;
  rank: number;
  percentage: number;
  volume_change_24h?: number;
  volume_change_7d?: number;
  volume_change_30d?: number;
  momentum_score: number;
  category: 'high' | 'medium' | 'low' | 'null';
  historical_data: Array<{
    timestamp: string;
    volume: number;
  }>;
}

export interface GoogleTrend extends BaseTrend {
  platform: 'google';
  query: string;
  promoted_content: string | null;
  tweet_volume: number | null;
}

export interface TikTokTrend extends BaseTrend {
  platform: 'tiktok';
  hashtag_id: string;
  hashtag_name: string;
  hashtag?: string; // Keep for backward compatibility
  industry_info: {
    id: number;
    value: string;
    label: string;
  };
  is_promoted: boolean;
  publish_cnt: number;
  video_views: number;
  rank_diff_type: number;
  views?: number; // Keep for backward compatibility
  likes?: number;
  shares?: number;
  creator_count?: number;
}

export interface XTrend extends BaseTrend {
  platform: 'x';
  topic: string;
  tweet_volume: string | number;
  last_updated: string;
  retweets?: number;
  likes?: number;
  replies?: number;
}

export interface GatherTrend extends BaseTrend {
  platform: 'gather';
  room_count: number;
  participants: number;
  activity_score: number;
  events_count: number;
}

export interface RedditTrend extends BaseTrend {
  platform: 'reddit';
  title: string;
  postUrl: string;
  upvotes: number;
  comments: number;
  subreddit: string;
  subredditUrl: string;
  subredditType: string;
  author: string;
  authorProfile: string;
  postTime: string;
}

export type SocialTrend = GoogleTrend | TikTokTrend | XTrend | GatherTrend | RedditTrend;

export interface SocialTrendsData {
  platform: SocialPlatform;
  trends: SocialTrend[];
  as_of: string;
  total_volume: number;
  metrics: {
    top_gainers: SocialTrend[];
    top_losers: SocialTrend[];
    trending_up: SocialTrend[];
    trending_down: SocialTrend[];
  };
}

export interface SocialTrendsState {
  google: SocialTrendsData | null;
  tiktok: SocialTrendsData | null;
  x: SocialTrendsData | null;
  gather: SocialTrendsData | null;
  reddit: SocialTrendsData | null;
  loading: boolean;
  error: string | null;
}
