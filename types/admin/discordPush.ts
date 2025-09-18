// Add these to your existing discordPush types file

export interface Button {
  id: string;
  label: string;
  style: "primary" | "secondary" | "success" | "danger" | "link";
  url?: string;
}

// Update your existing MessageComposerForm interface
export interface MessageComposerForm {
  title: string;
  description: string;
  color: string;
  largeImageUrl?: string;
  thumbnailUrl?: string;
  targetUsers: string[];
  scheduledAt?: Date;
  buttons?: Button[]; // Add this line
}

// Update your existing DiscordMessage interface if it doesn't already have buttons
export interface DiscordMessage {
  id: string;
  title: string;
  description: string;
  color: string;
  largeImageUrl?: string;
  thumbnailUrl?: string;
  createdAt: string;
  scheduledAt?: string;
  status: "sent" | "scheduled" | "draft" | "failed";
  targetUsers: string[];
  buttons?: Button[]; // Add this line
  deliveryStats?: {
    totalSent: number;
    delivered: number;
    failed: number;
    opened: number;
    clickThrough: number;
    deliveryRate: number;
    openRate: number;
    clickThroughRate: number;
  };
}

// export interface DiscordMessage {
//   id: string;
//   title: string;
//   description: string;
//   color: string;
//   largeImageUrl?: string;
//   thumbnailUrl?: string;
//   createdAt: string;
//   scheduledAt?: string;
//   status: "draft" | "scheduled" | "sent" | "failed";
//   targetUsers: string[];
//   deliveryStats?: MessageDeliveryStats;
// }

export interface MessageDeliveryStats {
  totalSent: number;
  delivered: number;
  failed: number;
  opened: number;
  clickThrough: number;
  deliveryRate: number;
  openRate: number;
  clickThroughRate: number;
}

export interface DiscordUser {
  id: string;
  username: string;
  discriminator: string;
  avatar?: string;
  isOnline: boolean;
  joinedAt: string;
  roles: string[];
}

// export interface MessageComposerForm {
//   title: string;
//   description: string;
//   color: string;
//   largeImageUrl: string;
//   thumbnailUrl: string;
//   targetUsers: string[];
//   scheduledAt?: Date;
// }

export interface MediaUpload {
  file: File;
  url: string;
  type: "image" | "video" | "document";
  size: number;
}

export interface AnalyticsData {
  totalMessages: number;
  totalDelivered: number;
  totalFailed: number;
  averageDeliveryRate: number;
  averageOpenRate: number;
  averageClickThroughRate: number;
  recentMessages: DiscordMessage[];
  deliveryTrends: {
    date: string;
    sent: number;
    delivered: number;
    failed: number;
  }[];
  userEngagement: {
    userId: string;
    username: string;
    messagesReceived: number;
    messagesOpened: number;
    engagementRate: number;
  }[];
}

export interface MessagePreviewProps {
  message: Partial<MessageComposerForm>;
  isPreview?: boolean;
}

export interface UserSelectorProps {
  selectedUsers: string[];
  onSelectionChange: (users: string[]) => void;
  availableUsers: DiscordUser[];
}

export interface ScheduleSelectorProps {
  scheduledAt?: Date;
  onScheduleChange: (date?: Date) => void;
}

export interface MediaUploaderProps {
  onImageUpload: (url: string, type: "large" | "thumbnail") => void;
  largeImageUrl?: string;
  thumbnailUrl?: string;
}