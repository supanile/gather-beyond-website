import { Mission } from "@/types/admin/adminTypes";
import { UserAgent } from "@/types/admin/userTableTypes";

export interface SortConfig {
  field:
    | "user.email"
    | "agent.highest_level"
    | "agent.lowest_level"
    | "agent.last_active"
    | null;
  direction: "asc" | "desc";
}

export const formatDate = (timestamp: number | string | null | undefined) => {
  if (!timestamp || timestamp === "NULL") return "N/A";
  const date =
    typeof timestamp === "number"
      ? new Date(timestamp * 1000)
      : new Date(timestamp);
  if (isNaN(date.getTime())) return "N/A";
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const getStatusVariant = (status: string) => {
  switch (status) {
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

export const getStatusColor = (status: string) => {
  switch (status) {
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
  if (url.includes("x.com")) return "X";
  if (url.includes("discord.com")) return "Discord";
  if (url.includes("github.com")) return "GitHub";
  if (url.includes("youtube.com") || url.includes("youtu.be")) return "YouTube";
  if (url.includes("medium.com")) return "Medium";
  return "External Link";
};

export const calculateStatusStats = (missions: Mission[]): StatusStats => {
  return {
    accepted: missions.filter((m) => m.status === "accepted").length,
    submitted: missions.filter((m) => m.status === "submitted").length,
    completed: missions.filter((m) => m.status === "completed").length,
    rejected: missions.filter((m) => m.status === "rejected").length,
  };
};

// Updated sortMissions function with last_active sorting
export const sortMissions = (
  missions: Mission[],
  sortConfig: SortConfig
): Mission[] => {
  if (!sortConfig.field) return missions;

  return [...missions].sort((a, b) => {
    let aValue: any;
    let bValue: any;

    switch (sortConfig.field) {
      case "user.email":
        aValue = (a as any).user?.email || "";
        bValue = (b as any).user?.email || "";
        break;

      case "agent.highest_level":
      case "agent.lowest_level":
        aValue =
          (a as any).user?.userAgent?.level ||
          (a as any).user?.agent?.level ||
          0;
        bValue =
          (b as any).user?.userAgent?.level ||
          (b as any).user?.agent?.level ||
          0;
        break;

      case "agent.last_active":
        aValue =
          (a as any).user?.userAgent?.last_active ||
          (a as any).user?.agent?.last_active ||
          0;
        bValue =
          (b as any).user?.userAgent?.last_active ||
          (b as any).user?.agent?.last_active ||
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
        aValue === 0) &&
      (bValue === null ||
        bValue === undefined ||
        bValue === "NULL" ||
        bValue === 0)
    )
      return 0;

    if (
      aValue === null ||
      aValue === undefined ||
      aValue === "NULL" ||
      aValue === 0
    )
      return 1;
    if (
      bValue === null ||
      bValue === undefined ||
      bValue === "NULL" ||
      bValue === 0
    )
      return -1;

    // Handle email sorting (case-insensitive)
    if (sortConfig.field === "user.email") {
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
  return selectedStatus
    ? missions.filter((mission) => mission.status === selectedStatus)
    : missions;
};

export const paginateMissions = (
  missions: Mission[],
  currentPage: number,
  pageSize: number
): Mission[] => {
  return missions.slice((currentPage - 1) * pageSize, currentPage * pageSize);
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
    case "user.email":
      return "Email";
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
    email: [{ field: "user.email" as const, label: "Email" }],
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