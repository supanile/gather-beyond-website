import { Mission, User } from "@/types/admin/adminTypes";
import { UserAgent } from "@/types/admin/userTableTypes";

interface ExtendedMission extends Mission {
  user?: User;
}

interface ExtendedUser extends User {
  userAgent?: UserAgent;
}

// Define available sort fields - added last_active back
export type SortField =
  | "user.email" // Email sorting
  | "agent.high_level" // Performance - Agent High level
  | "agent.low_level" // Performance - Agent Low level
  | "agent.last_active"; // Last Active sorting

export interface SortConfig {
  field: SortField | null;
  direction: "asc" | "desc";
}

/**
 * Gets the value for sorting based on the field
 */
const getSortValue = (
  item: ExtendedMission | ExtendedUser,
  field: SortField
): any => {
  switch (field) {
    case "user.email":
      if ("user" in item && item.user) {
        return item.user.email || "";
      }
      if ("email" in item) {
        return item.email || "";
      }
      return "";

    case "agent.high_level":
      if ("user" in item && item.user?.userAgent) {
        return item.user.userAgent.level || 0;
      }
      if ("userAgent" in item && item.userAgent) {
        return item.userAgent.level || 0;
      }
      return 0;

    case "agent.low_level":
      if ("user" in item && item.user?.userAgent) {
        return item.user.userAgent.health || 0;
      }
      if ("userAgent" in item && item.userAgent) {
        return item.userAgent.health || 0;
      }
      return 0;

    case "agent.last_active":
      if ("user" in item && item.user?.userAgent) {
        return item.user.userAgent.last_active || 0;
      }
      if ("userAgent" in item && item.userAgent) {
        return item.userAgent.last_active || 0;
      }
      return 0;

    default:
      return "";
  }
};

/**
 * Sorts missions based on the provided sort configuration
 */
export const sortMissions = (
  missions: ExtendedMission[],
  sortConfig: SortConfig
): ExtendedMission[] => {
  if (!sortConfig.field) return missions;

  return [...missions].sort((a, b) => {
    const aValue = getSortValue(a, sortConfig.field!);
    const bValue = getSortValue(b, sortConfig.field!);

    // Handle null/undefined values - always put them at the end
    if (aValue == null && bValue == null) return 0;
    if (aValue == null || aValue === 0) return 1; // null values go to end
    if (bValue == null || bValue === 0) return -1; // null values go to end

    // Handle email sorting
    if (sortConfig.field === "user.email") {
      const comparison = String(aValue)
        .toLowerCase()
        .localeCompare(String(bValue).toLowerCase());
      return sortConfig.direction === "asc" ? comparison : -comparison;
    }

    // Handle performance sorting (agent levels) and last_active
    if (
      sortConfig.field === "agent.high_level" ||
      sortConfig.field === "agent.low_level" ||
      sortConfig.field === "agent.last_active"
    ) {
      const numA = Number(aValue) || 0;
      const numB = Number(bValue) || 0;
      return sortConfig.direction === "asc" ? numA - numB : numB - numA;
    }

    // Fallback to string comparison
    const aStr = String(aValue).toLowerCase();
    const bStr = String(bValue).toLowerCase();
    const comparison = aStr.localeCompare(bStr);
    return sortConfig.direction === "asc" ? comparison : -comparison;
  });
};

/**
 * Sorts users based on the provided sort configuration
 */
export const sortUsers = (
  users: ExtendedUser[],
  sortConfig: SortConfig
): ExtendedUser[] => {
  if (!sortConfig.field) return users;

  return [...users].sort((a, b) => {
    const aValue = getSortValue(a, sortConfig.field!);
    const bValue = getSortValue(b, sortConfig.field!);

    // Handle null/undefined values - always put them at the end
    if (aValue == null && bValue == null) return 0;
    if (aValue == null || aValue === 0) return 1; // null values go to end
    if (bValue == null || bValue === 0) return -1; // null values go to end

    // Handle email sorting
    if (sortConfig.field === "user.email") {
      const comparison = String(aValue)
        .toLowerCase()
        .localeCompare(String(bValue).toLowerCase());
      return sortConfig.direction === "asc" ? comparison : -comparison;
    }

    // Handle performance sorting and last_active
    if (
      sortConfig.field === "agent.high_level" ||
      sortConfig.field === "agent.low_level" ||
      sortConfig.field === "agent.last_active"
    ) {
      const numA = Number(aValue) || 0;
      const numB = Number(bValue) || 0;
      return sortConfig.direction === "asc" ? numA - numB : numB - numA;
    }

    return 0;
  });
};

/**
 * Creates a sort handler function for use in components
 */
export const createSortHandler = (
  currentSortConfig: SortConfig,
  setSortConfig: (config: SortConfig) => void
) => {
  return (field: SortField) => {
    const newDirection =
      currentSortConfig.field === field && currentSortConfig.direction === "asc"
        ? "desc"
        : "asc";

    setSortConfig({ field, direction: newDirection });
  };
};

/**
 * Get sort field display name
 */
export const getSortFieldDisplayName = (field: SortField): string => {
  switch (field) {
    case "user.email":
      return "Email";
    case "agent.high_level":
      return "Agent High Level";
    case "agent.low_level":
      return "Agent Low Level";
    case "agent.last_active":
      return "Last Active";
    default:
      return field;
  }
};

/**
 * Get available sort options grouped by category
 */
export const getSortOptions = () => {
  return {
    email: [{ field: "user.email" as SortField, label: "Email" }],
    performance: [
      { field: "agent.high_level" as SortField, label: "Agent High Level" },
      { field: "agent.low_level" as SortField, label: "Agent Low Level" },
    ],
    activity: [
      { field: "agent.last_active" as SortField, label: "Last Active" },
    ],
  };
};

// Keep existing utility functions for backward compatibility
export const filterMissionsByStatus = (
  missions: ExtendedMission[],
  status: string | null
): ExtendedMission[] => {
  if (!status) return missions;
  return missions.filter((mission) => mission.status === status);
};

export const paginateMissions = (
  missions: ExtendedMission[],
  currentPage: number,
  itemsPerPage: number = 10
) => {
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedMissions = missions.slice(startIndex, endIndex);
  const totalPages = Math.ceil(missions.length / itemsPerPage);

  return {
    paginatedMissions,
    totalPages,
    totalItems: missions.length,
    hasNextPage: currentPage < totalPages,
    hasPrevPage: currentPage > 1,
  };
};

export const getStatusStats = (missions: ExtendedMission[]) => {
  const stats = {
    completed: 0,
    submitted: 0,
    accepted: 0,
    rejected: 0,
    total: missions.length,
  };

  missions.forEach((mission) => {
    if (mission.status in stats) {
      stats[mission.status as keyof typeof stats]++;
    }
  });

  return stats;
};