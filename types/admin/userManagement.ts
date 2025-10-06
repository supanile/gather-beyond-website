export interface Mission {
  _id: string;
  user_id: string;
  mission_id: number;
  mission_name: string;
  status: "accepted" | "submitted" | "completed" | "rejected";
  accepted_at: string;
  submitted_at: string;
  completed_at: string | null;
  submission_link: string | null;
}

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
  credits: number;
  // Mockup fields for Credits Used and Credit Expense Note
  credits_used_lifetime?: number;
  credits_used_30d?: number;
  last_expense_reason?: string;
  last_expense_date?: number;
  last_expense_type?: "mystery_box" | "upgrade" | "purchase" | "other";
}

export interface User {
  id: number;
  discord_id: string;
  twitter_handle: string;
  wallet_address: string;
  interests: string;
  total_points: number; // Keep for backward compatibility
  credit: number; // New credit field
  level: number;
  email: string;
  telegram_handle: string;
  telegram_id: string | null;
  missions_completed: number;
  username?: string;
  country?: string;
}

export interface UserWithAgent extends User {
  agent?: UserAgent;
  userMissions?: Mission[];
}

export interface UserTableColumn {
  id: string;
  label: string;
  sortable: boolean;
  align?: "left" | "center" | "right";
}

export interface SortConfig {
  field:
    | keyof UserWithAgent
    | "agent.xp"
    | "agent.level"
    | "agent.credits"
    | "agent.health"
    | "agent.mood"
    | "agent.last_active"
    | "agent.created_at"
    | "agent.credits_used_lifetime"
    | "agent.credits_used_30d"
    | "username";
  direction: "asc" | "desc";
}

export interface FilterConfig {
  search: string;
  mood: string[];
  healthRange: [number, number];
  levelRange: [number, number];
  interests: string[];
}

export interface PaginationConfig {
  page: number;
  pageSize: number;
  total: number;
}
