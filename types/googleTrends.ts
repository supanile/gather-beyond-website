export interface GoogleTrendItem {
  term: string; // มาแรง
  searchVolume: string; // ปริมาณการค้นหา (e.g., "200K+", "1M+")
  startTime: string; // เริ่มต้น
  endTime?: string; // สิ้นสุดแล้ว (optional)
  relatedTerms: string; // รายละเอียดเทรนด์
  exploreLink: string; // ลิงก์สำรวจ
}

export interface GoogleTrendsData {
  timeframe: "4H" | "24H" | "48H" | "7D";
  location: string;
  lastUpdated: string;
  trends: GoogleTrendItem[];
}

export interface GoogleTrendWithStats extends GoogleTrendItem {
  id: string;
  rank: number;
  category: "viral" | "high" | "medium" | "low";
  volumeNumeric: number; // Converted from searchVolume string
  relatedTermsArray: string[]; // Parsed from relatedTerms
  searchVelocity: number; // Rate of growth/decline
  momentum: "rising" | "stable" | "declining";
  timeActive: number; // Hours since start
}

export interface GoogleTrendsMetrics {
  totalTrends: number;
  viralTrends: GoogleTrendWithStats[]; // >1M searches
  risingTrends: GoogleTrendWithStats[]; // Fastest growing
  peakTrends: GoogleTrendWithStats[]; // Highest volume
  newTrends: GoogleTrendWithStats[]; // Started in last 4 hours
  sustainedTrends: GoogleTrendWithStats[]; // Active for >24 hours
}

export interface GoogleTrendsInsights {
  topCategories: Array<{
    category: string;
    count: number;
    percentage: number;
  }>;
  averageLifespan: number; // Hours
  peakHour: number; // 0-23
  geographicSpread: Array<{
    region: string;
    intensity: number;
  }>;
  languageDistribution: Array<{
    language: string;
    percentage: number;
  }>;
}
