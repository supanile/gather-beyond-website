export interface UserMission {
  _id: number;
  mission_id: number;
  mission_name: string;
  user_id: string;
  status: "accepted" | "submitted" | "completed" | "rejected";
  accepted_at: number | null;
  submitted_at: number | null;
  completed_at: number | null;
  rejected_at?: number | null;
  submission_link: string;
  notes: string;
  discord_user?: DiscordUserData;
}

export interface DiscordUserData {
  username: string;
  avatarUrl: string;
}

export interface MissionReviewSortState {
  field: keyof UserMission;
  direction: "asc" | "desc";
}

export interface MissionReviewColumnVisibility {
  id: boolean;
  user_avatar: boolean;
  mission_name: boolean;
  mission_id: boolean;
  user_id: boolean;
  status: boolean;
  submitted_at: boolean;
  submission_link: boolean;
}

export interface MissionReviewTableProps {
  missions: UserMission[];
  sortState: MissionReviewSortState;
  columnVisibility: MissionReviewColumnVisibility;
  onSort: (field: keyof UserMission) => void;
  onToggleColumnVisibility: (column: keyof MissionReviewColumnVisibility) => void;
  onApprove: (missionId: number) => void;
  onReject: (missionId: number) => void;
  onViewDetails: (mission: UserMission) => void;
  isLoading?: boolean;
  totalVisibleColumns: number;
  emptyMessage?: string;
}

export interface MissionActionProps {
  mission: UserMission;
  onApprove: (missionId: number) => void;
  onReject: (missionId: number) => void;
  onViewDetails: (mission: UserMission) => void;
}

export interface MissionStatusBadgeProps {
  status: UserMission["status"];
}

export interface MissionDetailsModalProps {
  mission: UserMission | null;
  isOpen: boolean;
  onClose: () => void;
  onApprove?: (missionId: number) => void;
  onReject?: (missionId: number) => void;
}

export interface MissionReviewFilters {
  status: UserMission["status"] | "all";
  searchQuery: string;
  dateRange: {
    from: Date | null;
    to: Date | null;
  };
}

export interface MissionReviewStats {
  total: number;
  submitted: number;
  completed: number;
  rejected: number;
}

export interface MissionReviewPaginationState {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
}