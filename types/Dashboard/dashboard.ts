// Dashboard Types
export interface Project {
  id: number;
  name: string;
  logo: string;
  tags: string[];
  trustScore: number;
  mindshareScore: number;
  category: string;
  verified?: boolean;
  description?: string;
  website?: string;
  walletAddress?: string;
}

export interface ProjectData extends Project {
  reviews: number;
  reviewCount: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Article {
  id: number;
  title: string;
  subtitle: string;
  category: string;
  readTime: string;
  author?: string;
  publishedAt?: string;
  imageUrl?: string;
  content?: string;
  slug?: string;
}

export interface GainerItem {
  name: string;
  gain: string;
  percentage?: number;
  projectId?: number;
}

export interface RiskItem {
  name: string;
  risk: "High" | "Medium" | "Low";
  description?: string;
  projectId?: number;
  reportedAt?: Date;
}

export interface CommunityData {
  id: number;
  name: string;
  logo: string;
  memberCount: number;
  engagement: "High" | "Medium" | "Low";
  verifiedCampaigns: number;
  sentimentTrend: "Positive" | "Neutral" | "Negative";
  agentReady: boolean;
  region?: string;
  language?: string;
  tags?: string[];
}

export interface Campaign {
  id: number;
  name: string;
  projectId: number;
  successRate: number;
  avgXpPerUser: number;
  completionTime: string;
  participantCount: number;
  status: "Active" | "Completed" | "Failed" | "Pending";
  startDate: Date;
  endDate?: Date;
}

export interface TrustMetrics {
  communityHealth: number;
  campaignSuccess: number;
  onchainBehavior: number;
  overall: number;
}

export interface MindshareMetrics {
  sentiment: "Positive" | "Neutral" | "Negative";
  mentionCount: number;
  influencerScore: number;
  narrativeAlignment: string[];
  trendData: {
    period: "7d" | "30d" | "90d";
    change: number;
  }[];
}

export interface SearchFilters {
  query?: string;
  category?: string;
  trustScoreMin?: number;
  trustScoreMax?: number;
  mindshareScoreMin?: number;
  mindshareScoreMax?: number;
  verified?: boolean;
  tags?: string[];
}

export interface SortOptions {
  field: "name" | "trustScore" | "mindshareScore" | "reviews" | "createdAt";
  direction: "asc" | "desc";
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
  timestamp: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Component Props Types
export interface DashboardProps {
  initialData?: {
    projects?: Project[];
    articles?: Article[];
    insights?: {
      topGainers: GainerItem[];
      riskWatchlist: RiskItem[];
    };
  };
}

export interface FilterChipProps {
  label: string;
  active?: boolean;
  onClick?: () => void;
}

export interface ScoreBarProps {
  score: number;
  type: "trust" | "mindshare";
  showLabel?: boolean;
  size?: "sm" | "md" | "lg";
}

export interface ProjectCardProps {
  project: Project;
  onViewProfile?: (projectId: number) => void;
  className?: string;
}

// Form Types
export interface ProjectSubmissionForm {
  name: string;
  category: string;
  website: string;
  contractAddress?: string;
  description: string;
  tags: string[];
  logo?: File;
}

export interface CommunitySubmissionForm {
  name: string;
  discordLink?: string;
  telegramLink?: string;
  language: string;
  timezone: string;
  interests: string[];
  description: string;
  memberCount: number;
}

// Navigation Types
export interface NavItem {
  label: string;
  href: string;
  icon?: React.ComponentType;
  children?: NavItem[];
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}
