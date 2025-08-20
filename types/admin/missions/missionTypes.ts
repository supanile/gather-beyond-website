export interface Mission {
  id: number;
  manualSort: number;
  id2: number;
  title: string;
  description: string;
  type: string;
  platform: string;
  requirements: string | null;
  reward: string;
  duration: string;
  level_required: number;
  partner: number;
  repeatable: number;
  startDate: number;
  endDate: number;
  action_request: string;
  regex: string;
  format: string;
  useful_link: string;
  partnerName: string;
  partnerId: string;
  status: string;
  gristHelper_Display2: string;
}

export interface ColumnVisibility {
  id: boolean;
  title: boolean;
  type: boolean;
  platform: boolean;
  status: boolean;
  reward: boolean;
  partner: boolean;
  startDate: boolean;
  endDate: boolean;
}

// StatusStats interface
export interface StatusStats {
  active: number;
  upcoming: number;
  completed: number;
  ended: number;
}

export interface NewMissionForm {
  title: string;
  description: string;
  type: string;
  platform: string;
  reward: string;
  action_request: string;
  format: string;
  useful_link: string;
  partner: string;
  requirements?: string;
  repeatable?: number;
  startDate?: string;
  endDate?: string;
  regex?: string;
  duration?: string;
  level_required?: number;
  missionTargeting?: MissionTargetingData | null; // Add targeting data
}

// Add MissionTargetingData interface
export interface MissionTargetingData {
  audienceType: "global" | "custom";
  behaviorFilters: {
    xpLevel: { enabled: boolean; min: number; max: number };
    missionStreak: { enabled: boolean; value: number };
    lastActive: { enabled: boolean; value: string };
    failedMissions: { enabled: boolean; value: number };
    trustScore: { enabled: boolean; value: number[] };
    connectedWallet: { enabled: boolean; value: boolean };
    joinedViaPartner: { enabled: boolean; value: string };
    referredUsers: { enabled: boolean; value: number };
    agentHealth: { enabled: boolean; value: number[] };
    memoryProofSubmitted: { enabled: boolean; value: boolean };
    taggedInterests: { enabled: boolean; value: string[] };
  };
  demographicFilters: {
    location: string[];
    language: string[];
    ageRange: string;
    gender: string;
  };
  deliveryOptions: {
    channel: string;
    scope: string;
    schedule: string;
    scheduledDate: string;
  };
}

// Partner options constant
export const PARTNER_OPTIONS = [
  "Super Connector",
  "Staika", 
  "Bread.gg",
  "BTC Rush",
  "Deepbrew",
  "Dessistant",
  "Maneki AI",
  "TAMA TAMA"
] as const;

export type PartnerOption = typeof PARTNER_OPTIONS[number];

// Type options with proper mapping
export const TYPE_OPTIONS = [
  { value: "Social", label: "Social" },
  { value: "Trading", label: "Trading" },
  { value: "Community", label: "Community" },
  { value: "Referral", label: "Referral" },
  { value: "Engagement", label: "Engagement" }
] as const;

export type TypeOption = typeof TYPE_OPTIONS[number];

// Platform options with proper mapping
export const PLATFORM_OPTIONS = [
  { value: "Telegram", label: "Telegram" },
  { value: "X", label: "X" },
  { value: "Discord", label: "Discord" },
  { value: "Website", label: "Website" },
  { value: "Mobile", label: "Mobile" }
] as const;

export type PlatformOption = typeof PLATFORM_OPTIONS[number];

// Status options
export const STATUS_OPTIONS = [
  "upcoming",
  "active", 
  "completed",
  "ended"
] as const;

export type StatusOption = typeof STATUS_OPTIONS[number];

// Format options
export const FORMAT_OPTIONS = [
  { value: "Link", label: "Link" },
  { value: "Message", label: "Message" }, 
  { value: "Image", label: "Image" }
] as const;

export type FormatOption = typeof FORMAT_OPTIONS[number];

export interface PaginationState {
  currentPage: number;
  itemsPerPage: number;
  totalItems: number;
  totalPages: number;
}

export interface SortState {
  field: keyof Mission | null;
  direction: "asc" | "desc";
}

export interface MissionTableFilters {
  selectedStatus: string | null;
  searchTerm?: string;
}

export interface StatusCardProps {
  status: string;
  count: number;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  onClick?: () => void;
  isSelected?: boolean;
  isDisabled?: boolean;
}