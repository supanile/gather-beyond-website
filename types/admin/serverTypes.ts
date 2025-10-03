export interface DiscordServer {
  id: string;
  name: string;
  image_url?: string;
  // owner_id: string;
  // owner_name: string;
  member_count: number;
  sc_user_count: number; // Super Connector users
  total_credits: number;
  total_xp: number;
  created_at: string;
  joined_at: string;
  is_active: boolean;
  // server_type: "premium" | "standard" | "basic";
  categories: string[];
}

export interface ServerStats {
  totalServers: number;
  totalMembers: number;
  totalSCUsers: number;
  totalCredits: number;
  totalXP: number;
  averageMembersPerServer: number;
  mostActiveServer: DiscordServer | null;
}

export interface ServerStatCardProps {
  title: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  growth?: number;
  isPositive?: boolean;
  subtitle?: string;
}

export interface ServerTableProps {
  servers: DiscordServer[];
}

export interface ServerRowProps {
  server: DiscordServer;
}
