import { DiscordUser, DiscordMessage, MessageDeliveryStats } from "@/types/admin/discordPush";

export const mockDiscordUsers: DiscordUser[] = [
  {
    id: "123456789012345678",
    username: "GamerPro2024",
    discriminator: "0001",
    avatar: "https://cdn.discordapp.com/avatars/123456789012345678/avatar1.png",
    isOnline: true,
    joinedAt: "2024-01-15T10:30:00Z",
    roles: ["Admin", "Developer", "VIP"]
  },
  {
    id: "234567890123456789",
    username: "CryptoMaster",
    discriminator: "0002",
    avatar: "https://cdn.discordapp.com/avatars/234567890123456789/avatar2.png",
    isOnline: false,
    joinedAt: "2024-02-20T14:45:00Z",
    roles: ["Moderator", "Community"]
  },
  {
    id: "345678901234567890",
    username: "NFTCollector",
    discriminator: "0003",
    avatar: "https://cdn.discordapp.com/avatars/345678901234567890/avatar3.png",
    isOnline: true,
    joinedAt: "2024-03-10T09:15:00Z",
    roles: ["VIP", "Beta Tester"]
  },
  {
    id: "456789012345678901",
    username: "BlockchainDev",
    discriminator: "0004",
    isOnline: true,
    joinedAt: "2024-01-05T16:20:00Z",
    roles: ["Developer", "Core Team"]
  },
  {
    id: "567890123456789012",
    username: "CommunityManager",
    discriminator: "0005",
    avatar: "https://cdn.discordapp.com/avatars/567890123456789012/avatar5.png",
    isOnline: false,
    joinedAt: "2023-12-01T11:30:00Z",
    roles: ["Staff", "Community Manager"]
  },
  {
    id: "678901234567890123",
    username: "ArtistCreator",
    discriminator: "0006",
    isOnline: true,
    joinedAt: "2024-04-12T13:45:00Z",
    roles: ["Artist", "Creator"]
  },
  {
    id: "789012345678901234",
    username: "InvestorWhale",
    discriminator: "0007",
    avatar: "https://cdn.discordapp.com/avatars/789012345678901234/avatar7.png",
    isOnline: false,
    joinedAt: "2024-02-28T08:10:00Z",
    roles: ["VIP", "Investor"]
  },
  {
    id: "890123456789012345",
    username: "TechSupport",
    discriminator: "0008",
    isOnline: true,
    joinedAt: "2024-01-20T12:00:00Z",
    roles: ["Support", "Technical"]
  },
  {
    id: "901234567890123456",
    username: "EventHost",
    discriminator: "0009",
    avatar: "https://cdn.discordapp.com/avatars/901234567890123456/avatar9.png",
    isOnline: true,
    joinedAt: "2024-03-25T15:30:00Z",
    roles: ["Event Manager", "Community"]
  },
  {
    id: "012345678901234567",
    username: "BugHunter",
    discriminator: "0010",
    isOnline: false,
    joinedAt: "2024-04-01T10:45:00Z",
    roles: ["Beta Tester", "Bug Hunter"]
  }
];

export const mockDeliveryStats: MessageDeliveryStats = {
  totalSent: 10,
  delivered: 9,
  failed: 1,
  opened: 7,
  clickThrough: 3,
  deliveryRate: 90,
  openRate: 70,
  clickThroughRate: 30
};

export const mockDiscordMessages: DiscordMessage[] = [
  {
    id: "msg_001",
    title: "🎄 Our Christmas selection is here!",
    description: "Lots of ideas, discounts and more. Check out our festive collection with amazing deals!",
    color: "#5865F2",
    largeImageUrl: "https://cdn.by.wonderpush.com/upload/01h05jhpx8r0qnqb6vqmewjt4t.jpg",
    thumbnailUrl: "https://cdn.discordapp.com/attachments/123/456/thumbnail.png",
    createdAt: "2024-12-15T10:30:00Z",
    status: "sent",
    targetUsers: ["123456789012345678", "234567890123456789", "345678901234567890"],
    deliveryStats: mockDeliveryStats
  },
  {
    id: "msg_002",
    title: "🚀 New Mission Alert!",
    description: "A new high-reward mission has been added to the platform. Complete it before the deadline!",
    color: "#00FF00",
    createdAt: "2024-12-14T14:20:00Z",
    scheduledAt: "2024-12-16T09:00:00Z",
    status: "scheduled",
    targetUsers: ["456789012345678901", "567890123456789012"],
    deliveryStats: {
      totalSent: 0,
      delivered: 0,
      failed: 0,
      opened: 0,
      clickThrough: 0,
      deliveryRate: 0,
      openRate: 0,
      clickThroughRate: 0
    }
  },
  {
    id: "msg_003",
    title: "📊 Weekly Report",
    description: "Here's your weekly performance summary and upcoming events.",
    color: "#FF5733",
    createdAt: "2024-12-13T16:45:00Z",
    status: "draft",
    targetUsers: ["678901234567890123", "789012345678901234", "890123456789012345"],
    deliveryStats: {
      totalSent: 0,
      delivered: 0,
      failed: 0,
      opened: 0,
      clickThrough: 0,
      deliveryRate: 0,
      openRate: 0,
      clickThroughRate: 0
    }
  }
];

export const mockAnalyticsData = {
  totalMessages: 25,
  totalRecipients: 150,
  deliveryRate: 94.2,
  openRate: 68.5,
  clickThroughRate: 24.3,
  recentActivity: [
    { date: "2024-12-15", sent: 12, delivered: 11, opened: 8 },
    { date: "2024-12-14", sent: 8, delivered: 8, opened: 6 },
    { date: "2024-12-13", sent: 15, delivered: 14, opened: 10 },
    { date: "2024-12-12", sent: 10, delivered: 9, opened: 7 },
    { date: "2024-12-11", sent: 6, delivered: 6, opened: 4 },
    { date: "2024-12-10", sent: 18, delivered: 17, opened: 12 },
    { date: "2024-12-09", sent: 9, delivered: 8, opened: 5 }
  ]
};
