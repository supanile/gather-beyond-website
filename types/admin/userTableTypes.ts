import { Mission } from "./adminTypes";

export interface UserAgent {
  id: number;
  user_id: string;
  xp: number;
  level: number;
  health: number;
  mood: string;
  last_active: number;
  created_at: number;
  last_health_decay: number;
  total_xp: number;
  current_level_progress: number;
  xp_required: number;
}

export interface ColumnVisibility {
  missionId: boolean;
  userEmail: boolean;
  missionName: boolean;
  status: boolean;
  acceptedAt: boolean;
  submittedAt: boolean;
  completedAt: boolean;
  submissionLink: boolean;
}

export interface StatusStats {
  accepted: number;
  submitted: number;
  completed: number;
  rejected: number;
}

export interface StatusCardProps {
  status: string;
  count: number;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  isSelected: boolean;
  onClick: (status: string) => void;
  totalMissions: number;
}

export interface SortConfig {
  field: keyof Mission | 'user.email' | 'agent.last_active' | null;
  direction: "asc" | "desc";
}

export interface PaginationConfig {
  currentPage: number;
  pageSize: number;
  totalItems: number;
}