export interface GatherProject {
  id: number;
  name: string;
  image_url: string;
  categories: string[];
  chain: string;
  website: string[];
  description: string;
  address: string;
  manualSort: number;
  // Additional fields for enhanced features
  launchDate?: string;
  isVerified?: boolean;
  isAudited?: boolean;
}

export interface GatherScore {
  overall: number;
  trust: number;
  transparency: number;
  sentiment: number;
  community: number;
  technical: number;
  label: ScoreLabel;
}

export interface TokenHealth {
  topHoldersPercentage: number;
  totalHolders: number;
  liquidity: number;
  liquidityFormatted: string;
  nextUnlock: UnlockEvent;
  contractAge: number;
  contractAgeFormatted: string;
}

export interface UnlockEvent {
  date: string;
  amount: string;
  daysUntil: number;
}

export interface SocialSignals {
  twitter: TrendData;
  google: TrendData;
  discord: CommunityData;
  telegram: CommunityData;
}

export interface TrendData {
  value: number;
  trend: 'up' | 'down' | 'stable';
  percentage: number;
  isStable: boolean;
}

export interface CommunityData {
  members: number;
  growth: number;
  engagement: number;
}

export interface SuperScore {
  average: number;
  totalUsers: number;
  totalUsersFormatted: string;
  missionsCompleted: number;
  missionsCompletedFormatted: string;
  aggregateRate: number;
  trustActions: string[];
}

export interface AIRiskAssessment {
  summary: string;
  riskLevel: RiskLevel;
  flags: string[];
  recommendations: string[];
}

export interface ProjectActions {
  canVisit: boolean;
  canJoinCampaign: boolean;
  isBookmarked: boolean;
  canCompare: boolean;
}

export type ScoreLabel = 'Excellent' | 'Good' | 'Moderate' | 'Risky' | 'Dangerous';
export type ProjectCategory = 'Agent Infra' | 'GameFi' | 'DeFi' | 'Tools' | 'Lifestyle' | 'Virtuals Protocol' | 'AI';
export type BlockchainNetwork = 'ethereum' | 'solana' | 'base' | 'arbitrum' | 'polygon';
export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export interface GatherDashboardData {
  project: GatherProject;
  gatherScore: GatherScore;
  tokenHealth: TokenHealth;
  socialSignals: SocialSignals;
  superScore: SuperScore;
  aiAssessment: AIRiskAssessment;
  actions: ProjectActions;
  lastUpdated: string;
}

export interface DashboardFilters {
  chain?: BlockchainNetwork[];
  category?: ProjectCategory[];
  scoreRange?: [number, number];
  searchTerm?: string;
}

export interface DashboardSort {
  field: 'score' | 'name' | 'launchDate' | 'community';
  direction: 'asc' | 'desc';
}
