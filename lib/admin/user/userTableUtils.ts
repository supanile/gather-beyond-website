import { Mission } from "@/types/admin/adminTypes";
import { UserAgent } from "@/types/admin/userTableTypes";

export interface SortConfig {
  field:
    | "user.username"
    | "agent.highest_level"
    | "agent.lowest_level"
    | "agent.last_active"
    | null;
  direction: "asc" | "desc";
}

// Shared interfaces for UserDataTable components
export interface ColumnVisibility {
  username: boolean;
  xp: boolean;
  level: boolean;
  credits: boolean;
  creditsUsed: boolean;
  creditExpenseNote: boolean;
  mood: boolean;
  health: boolean;
  interests: boolean;
  lastActive: boolean;
  joinedDate: boolean;
}

export interface UserDataPaginationState {
  page: number;
  pageSize: number;
  total: number;
}

export const formatDate = (timestamp: number | string | null | undefined) => {
  // Handle null, undefined, empty string, or "NULL" string
  if (!timestamp || timestamp === "NULL" || timestamp === null || timestamp === "" || timestamp === "null") {
    return "N/A";
  }
  
  let date: Date;
  
  try {
    // Handle different timestamp formats
    if (typeof timestamp === "string") {
      // If it's a string, try to parse it as number first
      const parsed = parseInt(timestamp);
      if (isNaN(parsed) || parsed === 0) {
        // If it's not a valid number string or is 0, return N/A
        return "N/A";
      } else {
        // If it's a valid number string, treat as unix timestamp
        date = new Date(parsed * 1000);
      }
    } else if (typeof timestamp === "number") {
      // If it's 0 or negative, return N/A
      if (timestamp <= 0) {
        return "N/A";
      }
      // If it's a number, check if it needs to be multiplied by 1000 (unix timestamp)
      // Unix timestamps are usually 10 digits, JS timestamps are 13 digits
      date = timestamp.toString().length === 10 
        ? new Date(timestamp * 1000) 
        : new Date(timestamp);
    } else {
      return "N/A";
    }
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return "N/A";
    }
    
    // Check if date is reasonable (not too far in past or future)
    const now = new Date();
    const oneYearAgo = new Date(now.getFullYear() - 1, 0, 1);
    const oneYearFromNow = new Date(now.getFullYear() + 1, 11, 31);
    
    if (date < oneYearAgo || date > oneYearFromNow) {
      // Might be the wrong timestamp format, try without multiplying by 1000
      if (typeof timestamp === "number" && timestamp.toString().length === 10) {
        date = new Date(timestamp); // Try without *1000
        if (date < oneYearAgo || date > oneYearFromNow) {
          return "N/A";
        }
      } else {
        return "N/A";
      }
    }
    
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short", 
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (error) {
    console.error("Error formatting date:", error, "for timestamp:", timestamp);
    return "N/A";
  }
};

export const getStatusVariant = (status: string | null | undefined) => {
  if (!status || typeof status !== 'string' || status.trim() === '') {
    return "outline";
  }
  
  switch (status.toLowerCase()) {
    case "accepted":
      return "default";
    case "completed":
      return "default";
    case "rejected":
      return "destructive";
    case "submitted":
      return "secondary";
    default:
      return "outline";
  }
};

export const getStatusColor = (status: string | null | undefined) => {
  if (!status || typeof status !== 'string' || status.trim() === '') {
    return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
  }
  
  switch (status.toLowerCase()) {
    case "accepted":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300";
    case "completed":
      return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300";
    case "rejected":
      return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300";
    case "submitted":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300";
    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
  }
};

export const getLinkType = (url: string) => {
  if (!url || url === "NULL" || url === "") return "N/A";
  
  if (url.includes("x.com") || url.includes("twitter.com")) return "X";
  if (url.includes("discord.com")) return "Discord";
  if (url.includes("github.com")) return "GitHub";
  if (url.includes("youtube.com") || url.includes("youtu.be")) return "YouTube";
  if (url.includes("medium.com")) return "Medium";
  return "Link";
};

export const calculateStatusStats = (missions: Mission[]): StatusStats => {
  if (!Array.isArray(missions)) {
    return {
      accepted: 0,
      submitted: 0,
      completed: 0,
      rejected: 0,
    };
  }

  return {
    accepted: missions.filter((m) => m.status === "accepted").length,
    submitted: missions.filter((m) => m.status === "submitted").length,
    completed: missions.filter((m) => m.status === "completed").length,
    rejected: missions.filter((m) => m.status === "rejected").length,
  };
};

// sortMissions function with last_active sorting
export const sortMissions = (
  missions: Mission[],
  sortConfig: SortConfig
): Mission[] => {
  if (!sortConfig.field || !Array.isArray(missions)) return missions;

  return [...missions].sort((a, b) => {
    let aValue: string | number | null | undefined;
    let bValue: string | number | null | undefined;

    switch (sortConfig.field) {
      case "user.username":
        aValue = (a as Mission & { user?: { username?: string } }).user?.username || "";
        bValue = (b as Mission & { user?: { username?: string } }).user?.username || "";
        break;

      case "agent.highest_level":
      case "agent.lowest_level":
        aValue =
          (a as Mission & { user?: { userAgent?: { level?: number }; agent?: { level?: number } } }).user?.userAgent?.level ||
          (a as Mission & { user?: { userAgent?: { level?: number }; agent?: { level?: number } } }).user?.agent?.level ||
          0;
        bValue =
          (b as Mission & { user?: { userAgent?: { level?: number }; agent?: { level?: number } } }).user?.userAgent?.level ||
          (b as Mission & { user?: { userAgent?: { level?: number }; agent?: { level?: number } } }).user?.agent?.level ||
          0;
        break;

      case "agent.last_active":
        aValue =
          (a as Mission & { user?: { userAgent?: { last_active?: number }; agent?: { last_active?: number } } }).user?.userAgent?.last_active ||
          (a as Mission & { user?: { userAgent?: { last_active?: number }; agent?: { last_active?: number } } }).user?.agent?.last_active ||
          0;
        bValue =
          (b as Mission & { user?: { userAgent?: { last_active?: number }; agent?: { last_active?: number } } }).user?.userAgent?.last_active ||
          (b as Mission & { user?: { userAgent?: { last_active?: number }; agent?: { last_active?: number } } }).user?.agent?.last_active ||
          0;
        break;

      default:
        return 0;
    }

    // Handle null/undefined/empty values - put them at the end always
    if (
      (aValue === null ||
        aValue === undefined ||
        aValue === "NULL" ||
        aValue === "" ||
        aValue === 0) &&
      (bValue === null ||
        bValue === undefined ||
        bValue === "NULL" ||
        bValue === "" ||
        bValue === 0)
    )
      return 0;

    if (
      aValue === null ||
      aValue === undefined ||
      aValue === "NULL" ||
      aValue === "" ||
      aValue === 0
    )
      return 1;
    if (
      bValue === null ||
      bValue === undefined ||
      bValue === "NULL" ||
      bValue === "" ||
      bValue === 0
    )
      return -1;

    // Handle username sorting (case-insensitive)
    if (sortConfig.field === "user.username") {
      const comparison = String(aValue)
        .toLowerCase()
        .localeCompare(String(bValue).toLowerCase());
      return sortConfig.direction === "asc" ? comparison : -comparison;
    }

    // Handle numeric sorting (agent levels and last_active)
    if (
      sortConfig.field === "agent.highest_level" ||
      sortConfig.field === "agent.lowest_level" ||
      sortConfig.field === "agent.last_active"
    ) {
      const numA = Number(aValue);
      const numB = Number(bValue);
      return sortConfig.direction === "asc" ? numA - numB : numB - numA;
    }

    return 0;
  });
};

export const filterMissionsByStatus = (
  missions: Mission[],
  selectedStatus: string | null
): Mission[] => {
  if (!Array.isArray(missions)) return [];
  
  return selectedStatus
    ? missions.filter((mission) => mission.status === selectedStatus)
    : missions;
};

export const paginateMissions = (
  missions: Mission[],
  currentPage: number,
  pageSize: number
): Mission[] => {
  if (!Array.isArray(missions)) return [];
  
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  return missions.slice(startIndex, endIndex);
};

export const getDefaultUserAgent = (userId: string): UserAgent => {
  return {
    id: 0,
    user_id: userId,
    xp: 0,
    level: 1,
    health: 100,
    mood: "neutral",
    last_active: Date.now() / 1000,
    created_at: Date.now() / 1000,
    last_health_decay: Date.now() / 1000,
    total_xp: 0,
    current_level_progress: 0,
    xp_required: 100,
  };
};

// Helper function to get sort field display names
export const getSortFieldDisplayName = (field: SortConfig["field"]): string => {
  switch (field) {
    case "user.username":
      return "Username";
    case "agent.highest_level":
      return "Agent Highest Level";
    case "agent.lowest_level":
      return "Agent Lowest Level";
    case "agent.last_active":
      return "Last Active";
    default:
      return "";
  }
};

// Helper function to get available sort options
export const getSortOptions = () => {
  return {
    username: [{ field: "user.username" as const, label: "Username" }],
    performance: [
      { field: "agent.highest_level" as const, label: "Agent Highest Level" },
      { field: "agent.lowest_level" as const, label: "Agent Lowest Level" },
    ],
    activity: [
      { field: "agent.last_active" as const, label: "Last Active" },
    ],
  };
};

interface StatusStats {
  accepted: number;
  submitted: number;
  completed: number;
  rejected: number;
}

// Shared utility functions for UserDataTable components
// Helper function to format column labels
export const getColumnLabel = (key: string): string => {
  const labelMap: Record<string, string> = {
    username: "Username",
    xp: "XP",
    level: "Level",
    credits: "Credits",
    creditsUsed: "Credits Used",
    creditExpenseNote: "Credit Expense",
    mood: "Mood",
    health: "Health",
    interests: "Interests",
    lastActive: "Last Active",
    joinedDate: "Joined Date",
  };

  return labelMap[key] || key.charAt(0).toUpperCase() + key.slice(1);
};

// Define the order of columns for toggle display
export const getColumnOrder = (): (keyof ColumnVisibility)[] => {
  return [
    "username",
    "xp", 
    "level",
    "credits",
    "creditsUsed",
    "creditExpenseNote",
    "mood",
    "health",
    "interests",
    "lastActive",
    "joinedDate"
  ];
};

// Mood utility functions
export const getMoodEmoji = (mood: string): string => {
  switch (mood.toLowerCase()) {
    case "happy":
      return "😊";
    case "neutral":
      return "😐";
    case "sad":
      return "😢";
    case "excited":
      return "🤩";
    case "angry":
      return "😠";
    case "love":
      return "😍";
    case "tired":
      return "😴";
    case "surprised":
      return "😲";
    default:
      return "😐";
  }
};

export const getMoodColor = (mood: string): string => {
  switch (mood.toLowerCase()) {
    case "happy":
      return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800";
    case "neutral":
      return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600";
    case "sad":
      return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800";
    case "excited":
      return "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800";
    case "angry":
      return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800";
    case "love":
      return "bg-pink-100 text-pink-800 border-pink-200 dark:bg-pink-900/20 dark:text-pink-400 dark:border-pink-800";
    case "tired":
      return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800";
    case "surprised":
      return "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600";
  }
};

// Health utility functions
export const getHealthColor = (health: number): string => {
  if (health >= 80) return "text-green-600 dark:text-green-300";
  if (health >= 60) return "text-yellow-600 dark:text-yellow-300";
  if (health >= 40) return "text-orange-600 dark:text-orange-300";
  return "text-red-600 dark:text-red-300";
};

export const getHealthBarColor = (health: number): string => {
  if (health >= 80) return "bg-green-600 dark:bg-green-400";
  if (health >= 60) return "bg-yellow-600 dark:bg-yellow-400";
  if (health >= 40) return "bg-orange-600 dark:bg-orange-400";
  return "bg-red-600 dark:bg-red-400";
};

// Badge color utility functions
export const getLevelBadgeColor = (level: number, allUsers: { agent?: { level?: number } }[]): string => {
  const levels = allUsers.map((user) => user.agent?.level || 1);
  const minLevel = Math.min(...levels);
  const maxLevel = Math.max(...levels);

  if (level === minLevel && level === maxLevel) {
    return "bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-600";
  } else if (level === minLevel) {
    return "bg-violet-100 text-violet-800 border-violet-200 dark:bg-violet-900/20 dark:text-violet-400 dark:border-violet-800";
  } else if (level === maxLevel) {
    return "bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400 dark:border-amber-800";
  } else {
    return "bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-600";
  }
};

export const getXPBadgeColor = (xp: number, allUsers: { agent?: { xp?: number } }[]): string => {
  const xpValues = allUsers.map((user) => user.agent?.xp || 0);
  const minXP = Math.min(...xpValues);
  const maxXP = Math.max(...xpValues);

  if (xp === minXP && xp === maxXP) {
    return "bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-600";
  } else if (xp === minXP) {
    return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800";
  } else if (xp === maxXP) {
    return "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800";
  } else {
    return "bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-600";
  }
};

export const getCreditsBadgeColor = (credits: number, allUsers: { agent?: { credits?: number } }[]): string => {
  const creditsValues = allUsers.map((user) => user.agent?.credits || 0);
  const minCredits = Math.min(...creditsValues);
  const maxCredits = Math.max(...creditsValues);

  if (credits === minCredits && credits === maxCredits) {
    return "bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-600";
  } else if (credits === minCredits) {
    return "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800";
  } else if (credits === maxCredits) {
    return "bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800";
  } else {
    return "bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-600";
  }
};

// Date formatting utilities for UserDataTable
export const formatUserTableDate = (timestamp: number): string => {
  return new Date(timestamp * 1000).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const formatLastActive = (timestamp: number): string => {
  const now = Date.now();
  const lastActive = timestamp * 1000;
  const diffMs = now - lastActive;
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 0) {
    return `${diffDays}d ago`;
  } else if (diffHours > 0) {
    return `${diffHours}h ago`;
  } else {
    return "Just now";
  }
};

// Credits Used utilities
export const getCreditsUsedBadgeColor = (creditsUsed: number, allUsers: { agent?: { credits_used_lifetime?: number } }[]): string => {
  const creditsUsedValues = allUsers.map((user) => user.agent?.credits_used_lifetime || 0);
  const minCreditsUsed = Math.min(...creditsUsedValues);
  const maxCreditsUsed = Math.max(...creditsUsedValues);

  if (creditsUsed === minCreditsUsed && creditsUsed === maxCreditsUsed) {
    return "bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-600";
  } else if (creditsUsed === minCreditsUsed) {
    return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800";
  } else if (creditsUsed === maxCreditsUsed) {
    return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800";
  } else {
    return "bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-600";
  }
};

// Credit Expense Note utilities
export const getExpenseTypeIcon = (type: string): string => {
  switch (type) {
    case "mystery_box":
      return "🎁";
    case "upgrade":
      return "⬆️";
    case "purchase":
      return "🛒";
    default:
      return "💳";
  }
};

export const getExpenseTypeBadgeColor = (type: string): string => {
  switch (type) {
    case "mystery_box":
      return "bg-purple-100 text-purple-800 border-purple-200 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800";
    case "upgrade":
      return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800";
    case "purchase":
      return "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-400 dark:border-gray-800";
  }
};

export const formatExpenseDate = (timestamp: number): string => {
  const now = Date.now();
  const expenseTime = timestamp * 1000;
  const diffMs = now - expenseTime;
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays > 30) {
    return `${diffDays}d ago (>30d)`;
  } else if (diffDays > 0) {
    return `${diffDays}d ago`;
  } else if (diffHours > 0) {
    return `${diffHours}h ago`;
  } else {
    return "Just now";
  }
};

// Helper function to check if expense is within 30 days
export const isExpenseRecent = (timestamp: number | null | undefined): boolean => {
  if (!timestamp) return false;
  const now = Date.now();
  const expenseTime = timestamp * 1000;
  const diffMs = now - expenseTime;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  return diffDays <= 30;
};