// Super Store API utilities
// This file provides functions that will connect to the backend API in the future

import { 
  SuperStoreData, 
  Claimer, 
  CreditSpending, 
  Winner,
  SuperStoreStats,
  LeaderboardFilters,
  CreditSpendingFilters,
  WinnerFilters
} from "@/types/admin/superStoreTypes";

// Base API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

/**
 * Fetch all super store data
 * @returns Promise<SuperStoreData>
 */
export async function fetchSuperStoreData(): Promise<SuperStoreData> {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/super-store/data`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching super store data:", error);
    throw error;
  }
}

/**
 * Fetch leaderboard data with filters
 * @param filters - LeaderboardFilters
 * @returns Promise<Claimer[]>
 */
export async function fetchLeaderboard(filters?: LeaderboardFilters): Promise<Claimer[]> {
  try {
    const queryParams = new URLSearchParams();
    
    if (filters) {
      if (filters.sortBy) queryParams.append("sortBy", filters.sortBy);
      if (filters.sortDirection) queryParams.append("sortDirection", filters.sortDirection);
      if (filters.moodFilter.length > 0) queryParams.append("moodFilter", filters.moodFilter.join(","));
      if (filters.statusFilter.length > 0) queryParams.append("statusFilter", filters.statusFilter.join(","));
      if (filters.levelRange.min) queryParams.append("minLevel", filters.levelRange.min.toString());
      if (filters.levelRange.max) queryParams.append("maxLevel", filters.levelRange.max.toString());
    }

    const response = await fetch(`${API_BASE_URL}/admin/super-store/leaderboard?${queryParams}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    throw error;
  }
}

/**
 * Fetch credit spending data with filters
 * @param filters - CreditSpendingFilters
 * @returns Promise<CreditSpending[]>
 */
export async function fetchCreditSpending(filters?: CreditSpendingFilters): Promise<CreditSpending[]> {
  try {
    const queryParams = new URLSearchParams();
    
    if (filters) {
      if (filters.sortBy) queryParams.append("sortBy", filters.sortBy);
      if (filters.sortDirection) queryParams.append("sortDirection", filters.sortDirection);
      if (filters.tierFilter.length > 0) queryParams.append("tierFilter", filters.tierFilter.join(","));
      if (filters.dateRange.start) queryParams.append("startDate", filters.dateRange.start);
      if (filters.dateRange.end) queryParams.append("endDate", filters.dateRange.end);
    }

    const response = await fetch(`${API_BASE_URL}/admin/super-store/credit-spending?${queryParams}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching credit spending:", error);
    throw error;
  }
}

/**
 * Fetch winners data with filters
 * @param filters - WinnerFilters
 * @returns Promise<Winner[]>
 */
export async function fetchWinners(filters?: WinnerFilters): Promise<Winner[]> {
  try {
    const queryParams = new URLSearchParams();
    
    if (filters) {
      if (filters.sortBy) queryParams.append("sortBy", filters.sortBy);
      if (filters.sortDirection) queryParams.append("sortDirection", filters.sortDirection);
      if (filters.competitionType.length > 0) queryParams.append("competitionType", filters.competitionType.join(","));
      if (filters.dateRange.start) queryParams.append("startDate", filters.dateRange.start);
      if (filters.dateRange.end) queryParams.append("endDate", filters.dateRange.end);
    }

    const response = await fetch(`${API_BASE_URL}/admin/super-store/winners?${queryParams}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching winners:", error);
    throw error;
  }
}

/**
 * Fetch super store statistics
 * @returns Promise<SuperStoreStats>
 */
export async function fetchSuperStoreStats(): Promise<SuperStoreStats> {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/super-store/stats`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching super store stats:", error);
    throw error;
  }
}

/**
 * Update claimer status
 * @param claimerId - string
 * @param status - "active" | "inactive" | "banned"
 * @returns Promise<boolean>
 */
export async function updateClaimerStatus(claimerId: string, status: "active" | "inactive" | "banned"): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/super-store/claimers/${claimerId}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return true;
  } catch (error) {
    console.error("Error updating claimer status:", error);
    throw error;
  }
}

/**
 * Export data to CSV
 * @param dataType - "leaderboard" | "credit-spending" | "winners"
 * @param filters - optional filters
 * @returns Promise<Blob>
 */
export async function exportDataToCsv(
  dataType: "leaderboard" | "credit-spending" | "winners",
  filters?: LeaderboardFilters | CreditSpendingFilters | WinnerFilters
): Promise<Blob> {
  try {
    const queryParams = new URLSearchParams();
    queryParams.append("type", dataType);
    
    if (filters) {
      queryParams.append("filters", JSON.stringify(filters));
    }

    const response = await fetch(`${API_BASE_URL}/admin/super-store/export/csv?${queryParams}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.blob();
  } catch (error) {
    console.error("Error exporting data to CSV:", error);
    throw error;
  }
}

// Helper functions for data formatting and validation
export const superStoreUtils = {
  /**
   * Format currency value
   * @param value - number
   * @returns string
   */
  formatCurrency: (value: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(value);
  },

  /**
   * Format XP value
   * @param value - number
   * @returns string
   */
  formatXP: (value: number): string => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M XP`;
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K XP`;
    }
    return `${value.toLocaleString()} XP`;
  },

  /**
   * Format date relative to now
   * @param date - string | Date
   * @returns string
   */
  formatRelativeDate: (date: string | Date): string => {
    const now = new Date();
    const targetDate = new Date(date);
    const diffInDays = Math.floor((now.getTime() - targetDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
    return `${Math.floor(diffInDays / 365)} years ago`;
  },

  /**
   * Get tier progress to next level
   * @param currentSpent - number
   * @param tier - string
   * @returns { progress: number, nextTierAmount: number, nextTier: string }
   */
  getTierProgress: (currentSpent: number, tier: string) => {
    const tierThresholds = {
      bronze: { min: 0, max: 1000, next: "silver" },
      silver: { min: 1000, max: 2500, next: "gold" },
      gold: { min: 2500, max: 5000, next: "platinum" },
      platinum: { min: 5000, max: 10000, next: "diamond" },
      diamond: { min: 10000, max: Infinity, next: "max" },
    };

    const current = tierThresholds[tier as keyof typeof tierThresholds];
    if (!current || current.next === "max") {
      return { progress: 100, nextTierAmount: 0, nextTier: "Max Tier" };
    }

    const progress = ((currentSpent - current.min) / (current.max - current.min)) * 100;
    const nextTierAmount = current.max - currentSpent;

    return {
      progress: Math.min(progress, 100),
      nextTierAmount: Math.max(nextTierAmount, 0),
      nextTier: current.next.charAt(0).toUpperCase() + current.next.slice(1),
    };
  },
};
