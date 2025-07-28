import { Mission } from "@/types/admin/adminTypes";
import { UserAgent, StatusStats, SortConfig } from "@/types/admin/userTableTypes";

export const formatDate = (timestamp: number | string) => {
  const date = typeof timestamp === "number" ? new Date(timestamp * 1000) : new Date(timestamp);
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

export const sortMissions = (missions: Mission[], sortConfig: SortConfig): Mission[] => {
  if (!sortConfig.field) return missions;

  return [...missions].sort((a, b) => {
    const aValue = a[sortConfig.field!];
    const bValue = b[sortConfig.field!];

    if (aValue === null || aValue === undefined || aValue === "NULL") return 1;
    if (bValue === null || bValue === undefined || bValue === "NULL") return -1;

    if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });
};

export const filterMissionsByStatus = (missions: Mission[], selectedStatus: string | null): Mission[] => {
  return selectedStatus 
    ? missions.filter((mission) => mission.status === selectedStatus)
    : missions;
};

export const paginateMissions = (missions: Mission[], currentPage: number, pageSize: number): Mission[] => {
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