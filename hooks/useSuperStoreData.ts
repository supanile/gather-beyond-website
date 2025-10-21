import { useState, useEffect } from "react";
import { 
  SuperStoreData, 
  Claimer, 
  CreditSpending, 
  Winner,
  Campaign,
  LeaderboardFilters,
  CreditSpendingFilters,
  WinnerFilters,
  CampaignFilters
} from "@/types/admin/superStoreTypes";
import { mockSuperStoreData } from "@/data/admin/superStoreMockData";

export function useSuperStoreData() {
  const [data, setData] = useState<SuperStoreData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate API call
    const fetchData = async () => {
      try {
        setIsLoading(true);
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setData(mockSuperStoreData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch super store data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return {
    data,
    isLoading,
    error,
    refetch: () => {
      setIsLoading(true);
      setTimeout(() => {
        setData(mockSuperStoreData);
        setIsLoading(false);
      }, 500);
    }
  };
}

export function useLeaderboard(filters?: LeaderboardFilters) {
  const { data, isLoading, error } = useSuperStoreData();
  const [filteredClaimers, setFilteredClaimers] = useState<Claimer[]>([]);

  useEffect(() => {
    if (!data?.claimers) {
      setFilteredClaimers([]);
      return;
    }

    let filtered = [...data.claimers];

    // Apply filters
    if (filters) {
      // Mood filter
      if (filters.moodFilter && filters.moodFilter.length > 0) {
        filtered = filtered.filter(claimer => 
          filters.moodFilter.includes(claimer.mood)
        );
      }

      // Status filter
      if (filters.statusFilter && filters.statusFilter.length > 0) {
        filtered = filtered.filter(claimer => 
          filters.statusFilter.includes(claimer.status)
        );
      }

      // Level range filter
      if (filters.levelRange) {
        filtered = filtered.filter(claimer => 
          claimer.level >= filters.levelRange.min && 
          claimer.level <= filters.levelRange.max
        );
      }

      // Sorting
      filtered.sort((a, b) => {
        let aValue: number, bValue: number;

        switch (filters.sortBy) {
          case "rank":
            aValue = a.rank;
            bValue = b.rank;
            break;
          case "level":
            aValue = a.level;
            bValue = b.level;
            break;
          case "total_xp":
            aValue = a.total_xp;
            bValue = b.total_xp;
            break;
          case "join_date":
            aValue = new Date(a.join_date).getTime();
            bValue = new Date(b.join_date).getTime();
            break;
          default:
            return 0;
        }

        if (filters.sortDirection === "asc") {
          return aValue - bValue;
        } else {
          return bValue - aValue;
        }
      });
    }

    setFilteredClaimers(filtered);
  }, [data, filters]);

  return {
    claimers: filteredClaimers,
    totalClaimers: data?.claimers.length || 0,
    isLoading,
    error
  };
}

export function useCreditSpending(filters?: CreditSpendingFilters) {
  const { data, isLoading, error } = useSuperStoreData();
  const [filteredSpending, setFilteredSpending] = useState<CreditSpending[]>([]);

  useEffect(() => {
    if (!data?.creditSpending) {
      setFilteredSpending([]);
      return;
    }

    let filtered = [...data.creditSpending];

    // Apply filters
    if (filters) {
      // Tier filter
      if (filters.tierFilter && filters.tierFilter.length > 0) {
        filtered = filtered.filter(spending => 
          filters.tierFilter.includes(spending.tier)
        );
      }

      // Date range filter
      if (filters.dateRange && filters.dateRange.start && filters.dateRange.end) {
        const startDate = new Date(filters.dateRange.start).getTime();
        const endDate = new Date(filters.dateRange.end).getTime();
        
        filtered = filtered.filter(spending => {
          const purchaseDate = new Date(spending.last_purchase_date).getTime();
          return purchaseDate >= startDate && purchaseDate <= endDate;
        });
      }

      // Sorting
      filtered.sort((a, b) => {
        let aValue: number, bValue: number;

        switch (filters.sortBy) {
          case "total_credits_spent":
            aValue = a.total_credits_spent;
            bValue = b.total_credits_spent;
            break;
          case "tier_level":
            aValue = a.tier_level;
            bValue = b.tier_level;
            break;
          case "purchases_count":
            aValue = a.purchases_count;
            bValue = b.purchases_count;
            break;
          case "last_purchase_date":
            aValue = new Date(a.last_purchase_date).getTime();
            bValue = new Date(b.last_purchase_date).getTime();
            break;
          default:
            return 0;
        }

        if (filters.sortDirection === "asc") {
          return aValue - bValue;
        } else {
          return bValue - aValue;
        }
      });
    }

    setFilteredSpending(filtered);
  }, [data, filters]);

  return {
    creditSpending: filteredSpending,
    totalSpenders: data?.creditSpending.length || 0,
    isLoading,
    error
  };
}

export function useWinners(filters?: WinnerFilters) {
  const { data, isLoading, error } = useSuperStoreData();
  const [filteredWinners, setFilteredWinners] = useState<Winner[]>([]);

  useEffect(() => {
    if (!data?.winners) {
      setFilteredWinners([]);
      return;
    }

    let filtered = [...data.winners];

    // Apply filters
    if (filters) {
      // Competition type filter
      if (filters.competitionType && filters.competitionType.length > 0) {
        filtered = filtered.filter(winner => 
          filters.competitionType.includes(winner.competition_type)
        );
      }

      // Date range filter
      if (filters.dateRange && filters.dateRange.start && filters.dateRange.end) {
        const startDate = new Date(filters.dateRange.start).getTime();
        const endDate = new Date(filters.dateRange.end).getTime();
        
        filtered = filtered.filter(winner => {
          const wonDate = new Date(winner.won_date).getTime();
          return wonDate >= startDate && wonDate <= endDate;
        });
      }

      // Sorting
      filtered.sort((a, b) => {
        let aValue: number, bValue: number;

        switch (filters.sortBy) {
          case "won_date":
            aValue = new Date(a.won_date).getTime();
            bValue = new Date(b.won_date).getTime();
            break;
          case "prize_value":
            aValue = a.prize_value;
            bValue = b.prize_value;
            break;
          case "rank_achieved":
            aValue = a.rank_achieved;
            bValue = b.rank_achieved;
            break;
          case "xp_earned":
            aValue = a.xp_earned;
            bValue = b.xp_earned;
            break;
          default:
            return 0;
        }

        if (filters.sortDirection === "asc") {
          return aValue - bValue;
        } else {
          return bValue - aValue;
        }
      });
    }

    setFilteredWinners(filtered);
  }, [data, filters]);

  return {
    winners: filteredWinners,
    totalWinners: data?.winners.length || 0,
    isLoading,
    error
  };
}

// Hook for campaigns data
export function useCampaigns(filters: CampaignFilters) {
  const { data, isLoading, error } = useSuperStoreData();
  const [filteredCampaigns, setFilteredCampaigns] = useState<Campaign[]>([]);

  useEffect(() => {
    if (!data) {
      setFilteredCampaigns([]);
      return;
    }

    let filtered = [...data.campaigns];

    // Apply status filter
    if (filters.status.length > 0) {
      filtered = filtered.filter(campaign => 
        filters.status.includes(campaign.status)
      );
    }

    // Apply campaign type filter
    if (filters.campaignType.length > 0) {
      filtered = filtered.filter(campaign => 
        filters.campaignType.includes(campaign.campaign_type)
      );
    }

    // Apply date range filter
    if (filters.dateRange.start || filters.dateRange.end) {
      filtered = filtered.filter(campaign => {
        const campaignStartDate = new Date(campaign.start_date);
        const campaignEndDate = new Date(campaign.end_date);
        
        let matchesStart = true;
        let matchesEnd = true;

        if (filters.dateRange.start) {
          const filterStart = new Date(filters.dateRange.start);
          matchesStart = campaignStartDate >= filterStart || campaignEndDate >= filterStart;
        }

        if (filters.dateRange.end) {
          const filterEnd = new Date(filters.dateRange.end);
          matchesEnd = campaignStartDate <= filterEnd || campaignEndDate <= filterEnd;
        }

        return matchesStart && matchesEnd;
      });
    }

    // Apply sorting
    if (filters.sortBy) {
      filtered.sort((a, b) => {
        let aValue: string | number;
        let bValue: string | number;

        switch (filters.sortBy) {
          case "start_date":
            aValue = new Date(a.start_date).getTime();
            bValue = new Date(b.start_date).getTime();
            break;
          case "end_date":
            aValue = new Date(a.end_date).getTime();
            bValue = new Date(b.end_date).getTime();
            break;
          case "total_participants":
            aValue = a.total_participants;
            bValue = b.total_participants;
            break;
          case "total_credits_spent":
            aValue = a.total_credits_spent;
            bValue = b.total_credits_spent;
            break;
          case "total_prize_value":
            aValue = a.total_prize_value;
            bValue = b.total_prize_value;
            break;
          default:
            return 0;
        }

        if (filters.sortDirection === "asc") {
          return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
        } else {
          return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
        }
      });
    }

    setFilteredCampaigns(filtered);
  }, [data, filters]);

  return {
    campaigns: filteredCampaigns,
    totalCampaigns: data?.campaigns.length || 0,
    isLoading,
    error
  };
}
