export interface UserAgent {
  id?: number;
  id2?: number;
  user_id?: string;
  xp?: number;
  level?: number;
  health?: number;
  last_active?: string;
  created_at?: string;
  last_health_decay?: string;
  total_xp?: number;
  current_level_progress?: number;
  xp_required?: number;
}

export interface ActiveUserStats {
  period: string;
  days: number;
  count: number;
  users: ActiveUser[];
}

export interface ActiveUser {
  id: number;
  level: number;
  xp: number;
  health: number;
  last_active: string;
}

export interface ActiveUsersPeriods {
  last7Days: ActiveUserStats;
  last14Days: ActiveUserStats;
  last30Days: ActiveUserStats;
  last60Days: ActiveUserStats;
}

export interface StatisticsResponse {
  totaluser: number;
  totalmissions: number;
  totalmissionsubmitted: number;
  totalcommunity: number;
  totalXP: number;
  activeUsers: {
    last7Days: number;
    last14Days: number;
    last30Days: number;
    last60Days: number;
  };
}
