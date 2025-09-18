export interface User {
  _id: string;
  discord_id: string;
  missions_completed: number;
  total_points: number;
  email: string;
  interests: string;
  telegram_id: string;
  telegram_handle: string;
  twitter_handle: string;
  wallet_address: string;
  created_at: string;
  username?: string;
}

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

export interface StatCardProps {
  title: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
  growth?: number;
  isPositive?: boolean;
}

export interface UserRowProps {
  user: User;
  missions: Mission[];
}

export interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export interface MenuItem {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  isActive?: boolean;
  badge?: string | number;
}

export interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
  currentTime?: Date;
}