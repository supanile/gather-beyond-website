import { 
  Claimer, 
  CreditSpending, 
  Winner, 
  SuperStoreStats, 
  SuperStoreData 
} from "@/types/admin/superStoreTypes";

// Mock Claimers Data (Leaderboard)
export const mockClaimers: Claimer[] = [
  {
    _id: "claimer_001",
    discord_id: "123456789012345678",
    username: "AlphaGamer",
    email: "alpha.gamer@example.com",
    join_date: "2024-01-15T08:30:00Z",
    level: 45,
    total_xp: 12750,
    mood: "happy",
    rank: 1,
    avatar_url: "https://example.com/avatar1.jpg",
    status: "active"
  },
  {
    _id: "claimer_002",
    discord_id: "234567890123456789",
    username: "BetaStrategist",
    email: "beta.strategist@example.com",
    join_date: "2024-01-20T14:15:00Z",
    level: 42,
    total_xp: 11890,
    mood: "sad",
    rank: 2,
    avatar_url: "https://example.com/avatar2.jpg",
    status: "active"
  },
  {
    _id: "claimer_003",
    discord_id: "345678901234567890",
    username: "GammaTactician",
    email: "gamma.tactician@example.com",
    join_date: "2024-02-01T10:45:00Z",
    level: 38,
    total_xp: 10450,
    mood: "neutral",
    rank: 3,
    avatar_url: "https://example.com/avatar3.jpg",
    status: "active"
  },
  {
    _id: "claimer_004",
    discord_id: "456789012345678901",
    username: "DeltaExplorer",
    email: "delta.explorer@example.com",
    join_date: "2024-02-10T16:20:00Z",
    level: 35,
    total_xp: 9875,
    mood: "happy",
    rank: 4,
    status: "active"
  },
  {
    _id: "claimer_005",
    discord_id: "567890123456789012",
    username: "EpsilonMaster",
    email: "epsilon.master@example.com",
    join_date: "2024-02-15T12:00:00Z",
    level: 33,
    total_xp: 9125,
    mood: "neutral",
    rank: 5,
    status: "active"
  },
  {
    _id: "claimer_006",
    discord_id: "678901234567890123",
    username: "ZetaWarrior",
    email: "zeta.warrior@example.com",
    join_date: "2024-03-01T09:30:00Z",
    level: 30,
    total_xp: 8500,
    mood: "happy",
    rank: 6,
    status: "active"
  },
  {
    _id: "claimer_007",
    discord_id: "789012345678901234",
    username: "EtaChampion",
    email: "eta.champion@example.com",
    join_date: "2024-03-05T15:45:00Z",
    level: 28,
    total_xp: 7950,
    mood: "sad",
    rank: 7,
    status: "active"
  },
  {
    _id: "claimer_008",
    discord_id: "890123456789012345",
    username: "ThetaLegend",
    email: "theta.legend@example.com",
    join_date: "2024-03-10T11:15:00Z",
    level: 26,
    total_xp: 7200,
    mood: "happy",
    rank: 8,
    status: "active"
  },
  {
    _id: "claimer_009",
    discord_id: "901234567890123456",
    username: "IotaAce",
    email: "iota.ace@example.com",
    join_date: "2024-03-20T13:30:00Z",
    level: 24,
    total_xp: 6750,
    mood: "neutral",
    rank: 9,
    status: "active"
  },
  {
    _id: "claimer_010",
    discord_id: "012345678901234567",
    username: "KappaRookie",
    email: "kappa.rookie@example.com",
    join_date: "2024-04-01T08:00:00Z",
    level: 22,
    total_xp: 6100,
    mood: "sad",
    rank: 10,
    status: "active"
  }
];

// Mock Credit Spending Data
export const mockCreditSpending: CreditSpending[] = [
  {
    user_id: "123456789012345678",
    username: "AlphaGamer",
    email: "alpha.gamer@example.com",
    total_credits_spent: 5500,
    tier: "diamond",
    tier_level: 5,
    last_purchase_date: "2024-09-28T14:30:00Z",
    purchases_count: 25,
    avg_purchase_amount: 220
  },
  {
    user_id: "234567890123456789",
    username: "BetaStrategist",
    email: "beta.strategist@example.com",
    total_credits_spent: 4200,
    tier: "platinum",
    tier_level: 4,
    last_purchase_date: "2024-09-25T10:15:00Z",
    purchases_count: 21,
    avg_purchase_amount: 200
  },
  {
    user_id: "345678901234567890",
    username: "GammaTactician",
    email: "gamma.tactician@example.com",
    total_credits_spent: 3100,
    tier: "gold",
    tier_level: 3,
    last_purchase_date: "2024-09-20T16:45:00Z",
    purchases_count: 18,
    avg_purchase_amount: 172
  },
  {
    user_id: "456789012345678901",
    username: "DeltaExplorer",
    email: "delta.explorer@example.com",
    total_credits_spent: 2200,
    tier: "silver",
    tier_level: 2,
    last_purchase_date: "2024-09-18T12:20:00Z",
    purchases_count: 15,
    avg_purchase_amount: 147
  },
  {
    user_id: "567890123456789012",
    username: "EpsilonMaster",
    email: "epsilon.master@example.com",
    total_credits_spent: 1800,
    tier: "silver",
    tier_level: 2,
    last_purchase_date: "2024-09-15T09:30:00Z",
    purchases_count: 12,
    avg_purchase_amount: 150
  },
  {
    user_id: "678901234567890123",
    username: "ZetaWarrior",
    email: "zeta.warrior@example.com",
    total_credits_spent: 950,
    tier: "bronze",
    tier_level: 1,
    last_purchase_date: "2024-09-10T14:00:00Z",
    purchases_count: 8,
    avg_purchase_amount: 119
  },
  {
    user_id: "789012345678901234",
    username: "EtaChampion",
    email: "eta.champion@example.com",
    total_credits_spent: 750,
    tier: "bronze",
    tier_level: 1,
    last_purchase_date: "2024-09-08T11:45:00Z",
    purchases_count: 6,
    avg_purchase_amount: 125
  },
  {
    user_id: "890123456789012345",
    username: "ThetaLegend",
    email: "theta.legend@example.com",
    total_credits_spent: 600,
    tier: "bronze",
    tier_level: 1,
    last_purchase_date: "2024-09-05T15:30:00Z",
    purchases_count: 5,
    avg_purchase_amount: 120
  }
];

// Mock Winners Data
export const mockWinners: Winner[] = [
  {
    _id: "winner_001",
    user_id: "123456789012345678",
    username: "AlphaGamer",
    email: "alpha.gamer@example.com",
    competition_name: "September XP Challenge",
    competition_type: "monthly",
    prize_title: "Ultimate Gaming Setup",
    prize_value: 2500,
    prize_description: "High-end gaming monitor, mechanical keyboard, and gaming mouse",
    won_date: "2024-09-30T18:00:00Z",
    xp_earned: 1000,
    badge_earned: "Monthly Champion",
    rank_achieved: 1,
    total_participants: 1250
  },
  {
    _id: "winner_002",
    user_id: "234567890123456789",
    username: "BetaStrategist",
    email: "beta.strategist@example.com",
    competition_name: "Week 39 Mission Sprint",
    competition_type: "weekly",
    prize_title: "Premium Store Credits",
    prize_value: 500,
    prize_description: "500 premium credits for store purchases",
    won_date: "2024-09-29T20:00:00Z",
    xp_earned: 250,
    badge_earned: "Weekly Winner",
    rank_achieved: 1,
    total_participants: 340
  },
  {
    _id: "winner_003",
    user_id: "345678901234567890",
    username: "GammaTactician",
    email: "gamma.tactician@example.com",
    competition_name: "Summer Season Finale",
    competition_type: "seasonal",
    prize_title: "Exclusive NFT Collection",
    prize_value: 1800,
    prize_description: "Limited edition seasonal NFT with special abilities",
    won_date: "2024-08-31T23:59:00Z",
    xp_earned: 750,
    badge_earned: "Season Master",
    rank_achieved: 2,
    total_participants: 2100
  },
  {
    _id: "winner_004",
    user_id: "456789012345678901",
    username: "DeltaExplorer",
    email: "delta.explorer@example.com",
    competition_name: "Community Choice Awards",
    competition_type: "special",
    prize_title: "Community Recognition Package",
    prize_value: 800,
    prize_description: "Special community badge and exclusive Discord role",
    won_date: "2024-08-15T16:30:00Z",
    xp_earned: 400,
    badge_earned: "Community Hero",
    rank_achieved: 1,
    total_participants: 890
  },
  {
    _id: "winner_005",
    user_id: "567890123456789012",
    username: "EpsilonMaster",
    email: "epsilon.master@example.com",
    competition_name: "August XP Challenge",
    competition_type: "monthly",
    prize_title: "Tech Gadget Bundle",
    prize_value: 1200,
    prize_description: "Smartphone accessories and wireless earbuds",
    won_date: "2024-08-31T18:00:00Z",
    xp_earned: 600,
    badge_earned: "Monthly Champion",
    rank_achieved: 3,
    total_participants: 1150
  },
  {
    _id: "winner_006",
    user_id: "678901234567890123",
    username: "ZetaWarrior",
    email: "zeta.warrior@example.com",
    competition_name: "Week 35 Mission Sprint",
    competition_type: "weekly",
    prize_title: "Store Credit Bonus",
    prize_value: 300,
    prize_description: "300 credits plus bonus XP multiplier",
    won_date: "2024-09-01T20:00:00Z",
    xp_earned: 150,
    badge_earned: "Weekly Winner",
    rank_achieved: 2,
    total_participants: 275
  }
];

// Mock Super Store Stats
export const mockSuperStoreStats: SuperStoreStats = {
  total_claimers: 1847,
  total_credits_spent: 125460,
  total_winners: 342,
  average_level: 28.5,
  most_active_mood: "sad",
  top_tier_distribution: {
    bronze: 45,
    silver: 28,
    gold: 18,
    platinum: 7,
    diamond: 2
  }
};

// Complete Mock Data Export
export const mockSuperStoreData: SuperStoreData = {
  claimers: mockClaimers,
  creditSpending: mockCreditSpending,
  winners: mockWinners,
  stats: mockSuperStoreStats
};
