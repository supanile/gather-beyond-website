export interface Mission {
  _id: string;
  user_id: string;
  mission_id: number;
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
}

export interface User {
  id: number;
  discord_id: string;
  twitter_handle: string;
  wallet_address: string;
  interests: string;
  total_points: number;
  level: number;
  email: string;
  telegram_handle: string;
  telegram_id: string | null;
  missions_completed: number;
}

export interface UserWithAgent extends User {
  agent?: UserAgent;
  userMissions?: Mission[]; // เพิ่มบรรทัดนี้
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
    | "agent.health"
    | "agent.mood"
    | "agent.last_active"
    | "agent.created_at";
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
