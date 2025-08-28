export interface SuperStoreClaimer {
  id: string;
  userId: string;
  email: string;
  discordId: string;
  joinDate: string;
  level: number;
  totalXp: number;
  mood: string;
  rank: number;
  avatar?: string;
}

export interface CreditSpending {
  id: string;
  userId: string;
  email: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  creditsSpent: number;
  totalPurchases: number;
  lastPurchaseDate: string;
}

export interface Winner {
  id: string;
  userId: string;
  email: string;
  discordId: string;
  prizeTitle: string;
  prizeDescription: string;
  prizeValue: number;
  winDate: string;
  status: 'pending' | 'claimed' | 'delivered';
  category: 'raffle' | 'contest' | 'milestone' | 'special';
}

export interface SuperStoreStats {
  totalClaimers: number;
  totalCreditsSpent: number;
  totalWinners: number;
  averageCreditsPerUser: number;
  topTierUsers: number;
}