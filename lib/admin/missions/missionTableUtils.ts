import { Mission } from "@/types/admin/missions/missionTypes";

// Date formatting utilities
export const formatDate = (timestamp: number) => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

// Status styling utilities 
export const getStatusColor = (status: string | null | undefined) => {
  if (!status || typeof status !== 'string' || status.trim() === '') {
    return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
  }
  
  switch (status.toLowerCase()) {
    case "active":
      return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300";
    case "completed":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300";
    case "ended":
      return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300";
    case "upcoming":
      return "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
  }
};

// Pagination utilities
export const getPageNumbers = (currentPage: number, totalPages: number) => {
  const pages = [];
  const maxVisiblePages = 5;

  if (totalPages <= maxVisiblePages) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
  }

  return pages;
};

// Reward parsing utilities
export const parseReward = (reward: string | null | undefined) => {
  if (!reward) {
    return {
      amount: "N/A",
      token: "",
    };
  }
  
  try {
    const parsed = JSON.parse(reward);
    return {
      amount: parsed.amount || "N/A",
      token: parsed.token || "",
    };
  } catch {
    return {
      amount: "N/A",
      token: "",
    };
  }
};

// Search and filter utilities - Updated to include completed
export const filterMissionsByStatus = (missions: Mission[], status: string | null) => {
  if (!status) return missions;
  
  if (status === "upcoming") {
    return missions.filter((mission) => mission.status === "upcoming");
  }
  
  return missions.filter((mission) => mission.status === status);
};

// Sorting utilities
export const sortMissions = (
  missions: Mission[],
  field: keyof Mission | null,
  direction: "asc" | "desc"
) => {
  if (!field) return missions;

  return [...missions].sort((a, b) => {
    const aValue = a[field];
    const bValue = b[field];

    if (aValue === null || aValue === undefined) return 1;
    if (bValue === null || bValue === undefined) return -1;

    if (aValue < bValue) return direction === "asc" ? -1 : 1;
    if (aValue > bValue) return direction === "asc" ? 1 : -1;
    return 0;
  });
};

// Status card configuration
export const getStatusCardConfig = (status: string | null | undefined) => {
  if (!status || typeof status !== 'string' || status.trim() === '') {
    return {
      color: "text-gray-600 dark:text-gray-400",
      bgColor: "bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-900/10 dark:to-slate-900/10",
    };
  }
  
  switch (status.toLowerCase()) {
    case "active":
      return {
        color: "text-green-600 dark:text-green-400",
        bgColor: "bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10",
      };
    case "upcoming":
      return {
        color: "text-orange-600 dark:text-orange-400",
        bgColor: "bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/10 dark:to-amber-900/10",
      };
    case "completed":
      return {
        color: "text-blue-600 dark:text-blue-400",
        bgColor: "bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/10 dark:to-cyan-900/10",
      };
    case "ended":
      return {
        color: "text-red-600 dark:text-red-400",
        bgColor: "bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/10 dark:to-rose-900/10",
      };
    default:
      return {
        color: "text-gray-600 dark:text-gray-400",
        bgColor: "bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-900/10 dark:to-slate-900/10",
      };
  }
};