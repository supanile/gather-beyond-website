export interface Claimer {
  _id: string;
  discord_id: string;
  username: string;
  email: string;
  join_date: string;
  level: number;
  total_xp: number;
  mood: "happy" | "neutral" | "sad";
  rank: number;
  avatar_url?: string;
  status: "active" | "inactive" | "banned";
}

export interface CreditSpending {
  user_id: string;
  username: string;
  email: string;
  total_credits_spent: number;
  tier: "bronze" | "silver" | "gold" | "platinum" | "diamond";
  tier_level: number;
  last_purchase_date: string;
  purchases_count: number;
  avg_purchase_amount: number;
}

export interface Winner {
  _id: string;
  user_id: string;
  username: string;
  email: string;
  competition_name: string;
  competition_type: "weekly" | "monthly" | "seasonal" | "special";
  prize_title: string;
  prize_value: number;
  prize_description: string;
  won_date: string;
  xp_earned: number;
  badge_earned?: string;
  rank_achieved: number;
  total_participants: number;
}

export interface Campaign {
  _id: string;
  campaign_name: string;
  campaign_type: "weekly" | "monthly" | "seasonal" | "special";
  start_date: string;
  end_date: string;
  total_participants: number;
  total_credits_spent: number;
  total_prize_value: number;
  status: "active" | "completed" | "upcoming";
  winners: Winner[];
}

export interface SuperStoreStats {
  total_claimers: number;
  total_credits_spent: number;
  total_winners: number;
  average_level: number;
  most_active_mood: string;
  top_tier_distribution: {
    bronze: number;
    silver: number;
    gold: number;
    platinum: number;
    diamond: number;
  };
}

export interface SuperStoreData {
  claimers: Claimer[];
  creditSpending: CreditSpending[];
  winners: Winner[];
  campaigns: Campaign[];
  stats: SuperStoreStats;
}

export interface LeaderboardFilters {
  sortBy: "rank" | "level" | "total_xp" | "join_date";
  sortDirection: "asc" | "desc";
  moodFilter: string[];
  statusFilter: string[];
  levelRange: {
    min: number;
    max: number;
  };
}

export interface CreditSpendingFilters {
  tierFilter: string[];
  sortBy: "total_credits_spent" | "tier_level" | "purchases_count" | "last_purchase_date";
  sortDirection: "asc" | "desc";
  dateRange: {
    start: string;
    end: string;
  };
}

export interface WinnerFilters {
  competitionType: string[];
  sortBy: "won_date" | "prize_value" | "rank_achieved" | "xp_earned" | "campaign_name";
  sortDirection: "asc" | "desc";
  dateRange: {
    start: string;
    end: string;
  };
}

export interface CampaignFilters {
  campaignType: string[];
  sortBy: "start_date" | "end_date" | "total_participants" | "total_credits_spent" | "total_prize_value";
  sortDirection: "asc" | "desc";
  status: string[];
  dateRange: {
    start: string;
    end: string;
  };
}
