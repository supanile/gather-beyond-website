import { useState, useEffect } from 'react';

// Import types from your types file
import type { SuperStoreClaimer, CreditSpending, Winner, SuperStoreStats } from '@/types/admin/superstore/superStore';

// Mock data generators
const generateMockClaimers = (): SuperStoreClaimer[] => {
  const moods = ['happy', 'excited', 'neutral', 'focused', 'motivated'];
  const domains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'discord.com'];
  
  return Array.from({ length: 50 }, (_, i) => ({
    id: `claimer-${i + 1}`,
    userId: `user-${i + 1}`,
    email: `user${i + 1}@${domains[i % domains.length]}`,
    discordId: `discord_${Math.random().toString(36).substring(7)}`,
    joinDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
    level: Math.floor(Math.random() * 100) + 1,
    totalXp: Math.floor(Math.random() * 50000) + 1000,
    mood: moods[Math.floor(Math.random() * moods.length)],
    rank: i + 1,
  }));
};

const generateMockCreditSpending = (): CreditSpending[] => {
  const tiers: Array<'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond'> = 
    ['bronze', 'silver', 'gold', 'platinum', 'diamond'];
  const domains = ['gmail.com', 'yahoo.com', 'hotmail.com'];
  
  return Array.from({ length: 30 }, (_, i) => ({
    id: `spending-${i + 1}`,
    userId: `user-${i + 1}`,
    email: `spender${i + 1}@${domains[i % domains.length]}`,
    tier: tiers[Math.floor(Math.random() * tiers.length)],
    creditsSpent: Math.floor(Math.random() * 10000) + 100,
    totalPurchases: Math.floor(Math.random() * 50) + 1,
    lastPurchaseDate: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
  }));
};

const generateMockWinners = (): Winner[] => {
  const statuses: Array<'pending' | 'claimed' | 'delivered'> = ['pending', 'claimed', 'delivered'];
  const categories: Array<'raffle' | 'contest' | 'milestone' | 'special'> = 
    ['raffle', 'contest', 'milestone', 'special'];
  const prizes = [
    { title: 'Gaming Headset Pro', description: 'High-quality wireless gaming headset', value: 150 },
    { title: 'Premium Keyboard', description: 'Mechanical RGB gaming keyboard', value: 200 },
    { title: 'Discord Nitro 1 Year', description: 'Annual Discord Nitro subscription', value: 100 },
    { title: 'Steam Gift Card $50', description: 'Digital Steam wallet credit', value: 50 },
    { title: 'Gaming Mouse Elite', description: 'Professional esports gaming mouse', value: 120 },
    { title: 'Webcam 4K', description: 'Ultra HD streaming webcam', value: 180 },
    { title: 'Monitor Stand RGB', description: 'Adjustable RGB monitor stand', value: 80 },
  ];
  
  return Array.from({ length: 25 }, (_, i) => {
    const prize = prizes[Math.floor(Math.random() * prizes.length)];
    return {
      id: `winner-${i + 1}`,
      userId: `user-${i + 1}`,
      email: `winner${i + 1}@example.com`,
      discordId: `winner_${Math.random().toString(36).substring(7)}`,
      prizeTitle: prize.title,
      prizeDescription: prize.description,
      prizeValue: prize.value,
      winDate: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000).toISOString(),
      status: statuses[Math.floor(Math.random() * statuses.length)],
      category: categories[Math.floor(Math.random() * categories.length)],
    };
  });
};

export const useSuperStore = () => {
  const [claimers, setClaimers] = useState<SuperStoreClaimer[]>([]);
  const [creditSpending, setCreditSpending] = useState<CreditSpending[]>([]);
  const [winners, setWinners] = useState<Winner[]>([]);
  const [stats, setStats] = useState<SuperStoreStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSuperStoreData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Generate mock data
        const mockClaimers = generateMockClaimers();
        const mockCreditSpending = generateMockCreditSpending();
        const mockWinners = generateMockWinners();

        // Calculate stats
        const totalCreditsSpent = mockCreditSpending.reduce((sum, user) => sum + user.creditsSpent, 0);
        const averageCreditsPerUser = mockCreditSpending.length > 0 
          ? Math.round(totalCreditsSpent / mockCreditSpending.length) 
          : 0;
        const topTierUsers = mockCreditSpending.filter(
          user => user.tier === 'platinum' || user.tier === 'diamond'
        ).length;

        const calculatedStats: SuperStoreStats = {
          totalClaimers: mockClaimers.length,
          totalCreditsSpent,
          totalWinners: mockWinners.length,
          averageCreditsPerUser,
          topTierUsers,
        };

        // Set data
        setClaimers(mockClaimers);
        setCreditSpending(mockCreditSpending);
        setWinners(mockWinners);
        setStats(calculatedStats);

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load Super Store data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSuperStoreData();
  }, []);

  // Helper functions for data manipulation
  const refreshData = () => {
    setIsLoading(true);
    // Trigger re-fetch
    setTimeout(() => {
      const mockClaimers = generateMockClaimers();
      const mockCreditSpending = generateMockCreditSpending();
      const mockWinners = generateMockWinners();

      const totalCreditsSpent = mockCreditSpending.reduce((sum, user) => sum + user.creditsSpent, 0);
      const averageCreditsPerUser = mockCreditSpending.length > 0 
        ? Math.round(totalCreditsSpent / mockCreditSpending.length) 
        : 0;
      const topTierUsers = mockCreditSpending.filter(
        user => user.tier === 'platinum' || user.tier === 'diamond'
      ).length;

      const calculatedStats: SuperStoreStats = {
        totalClaimers: mockClaimers.length,
        totalCreditsSpent,
        totalWinners: mockWinners.length,
        averageCreditsPerUser,
        topTierUsers,
      };

      setClaimers(mockClaimers);
      setCreditSpending(mockCreditSpending);
      setWinners(mockWinners);
      setStats(calculatedStats);
      setIsLoading(false);
    }, 1000);
  };

  return {
    claimers,
    creditSpending,
    winners,
    stats,
    isLoading,
    error,
    refreshData,
  };
};