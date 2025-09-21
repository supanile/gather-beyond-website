export interface Community {
  id: number;
  name: string;
  logo: string;
  image_url?: string;
  description?: string;
  engagementLevel: number; // 0-100
  verifiedCampaigns: number;
  sentimentTrend: "positive" | "neutral" | "negative";
  agentReadiness: boolean;
  region: string;
  language: string;
  averageCampaignXP: number;
  tags: string[];
  memberCount: number;
  trustScore: number;
  mindshareScore: number;
  createdAt: string;
  lastActive: string;
  category: string;
  verified?: boolean;
  reviews?: number;
  reviewCount?: number;
}

export const regions = [
  "All Regions",
  "North America",
  "Europe",
  "Asia Pacific",
  "Latin America",
  "Middle East & Africa",
  "Global",
];

export const languages = [
  "All Languages",
  "English",
  "Spanish",
  "Mandarin",
  "Japanese",
  "Korean",
  "French",
  "German",
  "Portuguese",
  "Russian",
  "Arabic",
];

export const communityTags = [
  "loyalty",
  "NFT",
  "gaming guild",
  "DeFi",
  "governance",
  "social",
  "trading",
  "education",
  "art",
  "music",
  "sports",
  "charity",
  "innovation",
  "developer",
];

export const allCommunities: Community[] = [
  {
    id: 1,
    name: "Super Connector Community",
    logo: "🤖",
    image_url:
      "https://coin-images.coingecko.com/coins/images/55873/large/23678_Super_Connector_5ba88a91b1.png?1747554890",
    description:
      "AI-native community powering the Agent Economy through missions, memory, and autonomous coordination between agents and projects.",
    engagementLevel: 88,
    verifiedCampaigns: 21,
    sentimentTrend: "positive" as const,
    agentReadiness: true,
    region: "Global",
    language: "English",
    averageCampaignXP: 190,
    tags: ["AI", "agent economy", "automation"],
    memberCount: 6526, // Using holder count from API
    trustScore: 67,
    mindshareScore: 75,
    createdAt: "2024-08-15",
    lastActive: "1 hour ago",
    category: "AI Agent",
    verified: true,
    reviews: 4.1,
    reviewCount: 89,
  },
  // {
  //   id: 1,
  //   name: "DecentraDAO Community",
  //   logo: "🏛️",
  //   description:
  //     "Leading decentralized autonomous organization focused on community-driven governance and Web3 innovation.",
  //   engagementLevel: 92,
  //   verifiedCampaigns: 24,
  //   sentimentTrend: "positive",
  //   agentReadiness: true,
  //   region: "Global",
  //   language: "English",
  //   averageCampaignXP: 175,
  //   tags: ["governance", "DeFi", "innovation"],
  //   memberCount: 12500,
  //   trustScore: 85,
  //   mindshareScore: 72,
  //   createdAt: "2023-01-15",
  //   lastActive: "2 hours ago",
  //   category: "DAO",
  //   verified: true,
  //   reviews: 4.3,
  //   reviewCount: 127,
  // },
  {
    id: 2,
    name: "CryptoGuild Alliance",
    logo: "⚔️",
    image_url:
      "https://coin-images.coingecko.com/coins/images/55873/large/23678_Super_Connector_5ba88a91b1.png?1747554890",
    description:
      "Premier gaming guild connecting Web3 gamers across multiple blockchain games and metaverses.",
    engagementLevel: 88,
    verifiedCampaigns: 31,
    sentimentTrend: "positive",
    agentReadiness: true,
    region: "Asia Pacific",
    language: "English",
    averageCampaignXP: 220,
    tags: ["gaming guild", "NFT", "social"],
    memberCount: 8900,
    trustScore: 78,
    mindshareScore: 65,
    createdAt: "2023-02-20",
    lastActive: "1 hour ago",
    category: "Gaming",
    verified: true,
    reviews: 4.1,
    reviewCount: 89,
  },
  {
    id: 3,
    name: "Web3Social Collective",
    logo: "🌐",
    image_url:
      "https://coin-images.coingecko.com/coins/images/55873/large/23678_Super_Connector_5ba88a91b1.png?1747554890",
    description:
      "Vibrant social community building the future of decentralized communication and content creation.",
    engagementLevel: 95,
    verifiedCampaigns: 18,
    sentimentTrend: "positive",
    agentReadiness: true,
    region: "North America",
    language: "English",
    averageCampaignXP: 160,
    tags: ["social", "education", "innovation"],
    memberCount: 15200,
    trustScore: 92,
    mindshareScore: 88,
    createdAt: "2023-03-10",
    lastActive: "30 minutes ago",
    category: "Social",
    verified: true,
    reviews: 4.7,
    reviewCount: 203,
  },
  {
    id: 4,
    name: "DeFi Masters Hub",
    logo: "💰",
    image_url:
      "https://coin-images.coingecko.com/coins/images/55873/large/23678_Super_Connector_5ba88a91b1.png?1747554890",
    description:
      "Advanced DeFi community for yield farming, liquidity provision, and protocol governance participation.",
    engagementLevel: 84,
    verifiedCampaigns: 28,
    sentimentTrend: "positive",
    agentReadiness: true,
    region: "Europe",
    language: "English",
    averageCampaignXP: 190,
    tags: ["DeFi", "trading", "governance"],
    memberCount: 9800,
    trustScore: 88,
    mindshareScore: 79,
    createdAt: "2023-01-30",
    lastActive: "45 minutes ago",
    category: "DeFi",
    verified: true,
    reviews: 4.5,
    reviewCount: 298,
  },
  {
    id: 5,
    name: "NFT Creators Circle",
    logo: "🎨",
    image_url:
      "https://coin-images.coingecko.com/coins/images/55873/large/23678_Super_Connector_5ba88a91b1.png?1747554890",
    description:
      "Creative community supporting digital artists, collectors, and NFT marketplace innovation.",
    engagementLevel: 76,
    verifiedCampaigns: 15,
    sentimentTrend: "positive",
    agentReadiness: true,
    region: "Global",
    language: "English",
    averageCampaignXP: 140,
    tags: ["NFT", "art", "social"],
    memberCount: 6750,
    trustScore: 81,
    mindshareScore: 68,
    createdAt: "2023-04-05",
    lastActive: "3 hours ago",
    category: "NFT",
    verified: true,
    reviews: 4.2,
    reviewCount: 176,
  },
  {
    id: 6,
    name: "MetaVerse Pioneers",
    logo: "🚀",
    image_url:
      "https://coin-images.coingecko.com/coins/images/55873/large/23678_Super_Connector_5ba88a91b1.png?1747554890",
    description:
      "Exploring virtual worlds and building the infrastructure for tomorrow's metaverse experiences.",
    engagementLevel: 69,
    verifiedCampaigns: 12,
    sentimentTrend: "neutral",
    agentReadiness: false,
    region: "North America",
    language: "English",
    averageCampaignXP: 130,
    tags: ["gaming guild", "innovation", "social"],
    memberCount: 4900,
    trustScore: 67,
    mindshareScore: 54,
    createdAt: "2023-05-12",
    lastActive: "6 hours ago",
    category: "Metaverse",
    verified: true,
    reviews: 3.9,
    reviewCount: 156,
  },
  {
    id: 7,
    name: "Blockchain Developers United",
    logo: "🔧",
    image_url:
      "https://coin-images.coingecko.com/coins/images/55873/large/23678_Super_Connector_5ba88a91b1.png?1747554890",
    description:
      "Technical community for blockchain developers, smart contract engineers, and protocol contributors.",
    engagementLevel: 91,
    verifiedCampaigns: 22,
    sentimentTrend: "positive",
    agentReadiness: true,
    region: "Global",
    language: "English",
    averageCampaignXP: 210,
    tags: ["developer", "education", "innovation"],
    memberCount: 7800,
    trustScore: 95,
    mindshareScore: 85,
    createdAt: "2023-02-28",
    lastActive: "1 hour ago",
    category: "Infrastructure",
    verified: true,
    reviews: 4.8,
    reviewCount: 312,
  },
  {
    id: 8,
    name: "Crypto Trading Legion",
    logo: "📈",
    image_url:
      "https://coin-images.coingecko.com/coins/images/55873/large/23678_Super_Connector_5ba88a91b1.png?1747554890",
    description:
      "Professional trading community sharing strategies, market analysis, and risk management techniques.",
    engagementLevel: 82,
    verifiedCampaigns: 26,
    sentimentTrend: "positive",
    agentReadiness: true,
    region: "Asia Pacific",
    language: "English",
    averageCampaignXP: 185,
    tags: ["trading", "education", "DeFi"],
    memberCount: 11200,
    trustScore: 79,
    mindshareScore: 73,
    createdAt: "2023-03-15",
    lastActive: "2 hours ago",
    category: "Trading",
    verified: true,
    reviews: 4.0,
    reviewCount: 245,
  },
  {
    id: 9,
    name: "Green Crypto Collective",
    logo: "🌱",
    description:
      "Sustainability-focused community promoting eco-friendly blockchain solutions and carbon-neutral projects.",
    engagementLevel: 71,
    verifiedCampaigns: 14,
    sentimentTrend: "positive",
    agentReadiness: false,
    region: "Europe",
    language: "English",
    averageCampaignXP: 125,
    tags: ["innovation", "charity", "education"],
    memberCount: 3400,
    trustScore: 74,
    mindshareScore: 59,
    createdAt: "2023-06-01",
    lastActive: "4 hours ago",
    category: "Sustainability",
    verified: false,
    reviews: 3.8,
    reviewCount: 92,
  },
  {
    id: 10,
    name: "Staika Community",
    image_url:
      "https://coin-images.coingecko.com/coins/images/29063/large/STIK.png?1696528030",
    logo: "💎",
    description:
      "Staika platform community focused on governance, multi-service payments, and altcoin exchange. Building the future of comprehensive blockchain services and rewards systems.",
    engagementLevel: 72,
    verifiedCampaigns: 15,
    sentimentTrend: "positive" as const,
    agentReadiness: true,
    region: "Asia Pacific", // Staika appears to be based in Asia
    language: "English",
    averageCampaignXP: 145,
    tags: ["governance", "payments", "platform"],
    memberCount: 27758, // Using holder count from API
    trustScore: 38, // Using gt_score from API
    mindshareScore: 65,
    createdAt: "2022-10-15", // Established platform based on mature holder base
    lastActive: "3 hours ago",
    category: "Platform",
    verified: true,
    reviews: 3.8,
    reviewCount: 156,
  },
  // {
  //   id: 10,
  //   name: "AI Agent Network",
  //   image_url:
  //     "https://coin-images.coingecko.com/coins/images/55873/large/23678_Super_Connector_5ba88a91b1.png?1747554890",
  //   logo: "🤖",
  //   description:
  //     "Cutting-edge community exploring AI integration in Web3, autonomous agents, and machine learning applications.",
  //   engagementLevel: 45,
  //   verifiedCampaigns: 3,
  //   sentimentTrend: "neutral",
  //   agentReadiness: false,
  //   region: "North America",
  //   language: "English",
  //   averageCampaignXP: 80,
  //   tags: ["innovation", "developer", "education"],
  //   memberCount: 1800,
  //   trustScore: 20,
  //   mindshareScore: 28,
  //   createdAt: "2024-01-10",
  //   lastActive: "2 days ago",
  //   category: "AI",
  //   verified: false,
  //   reviews: 2.8,
  //   reviewCount: 45,
  // },
  {
    id: 11,
    name: "Music NFT Collective",
    image_url:
      "https://coin-images.coingecko.com/coins/images/55873/large/23678_Super_Connector_5ba88a91b1.png?1747554890",
    logo: "🎵",
    description:
      "Community of musicians, producers, and fans revolutionizing the music industry through blockchain technology.",
    engagementLevel: 78,
    verifiedCampaigns: 17,
    sentimentTrend: "positive",
    agentReadiness: true,
    region: "Latin America",
    language: "Spanish",
    averageCampaignXP: 155,
    tags: ["music", "NFT", "art"],
    memberCount: 5600,
    trustScore: 75,
    mindshareScore: 62,
    createdAt: "2023-04-20",
    lastActive: "5 hours ago",
    category: "Music",
    verified: true,
    reviews: 4.0,
    reviewCount: 134,
  },
  {
    id: 12,
    name: "Sports DAO Arena",
    logo: "⚽",
    image_url:
      "https://coin-images.coingecko.com/coins/images/55873/large/23678_Super_Connector_5ba88a91b1.png?1747554890",
    description:
      "Sports enthusiasts building fan engagement platforms and athlete tokenization systems.",
    engagementLevel: 65,
    verifiedCampaigns: 11,
    sentimentTrend: "neutral",
    agentReadiness: false,
    region: "Europe",
    language: "French",
    averageCampaignXP: 110,
    tags: ["sports", "social", "loyalty"],
    memberCount: 4200,
    trustScore: 68,
    mindshareScore: 51,
    createdAt: "2023-07-08",
    lastActive: "8 hours ago",
    category: "Sports",
    verified: false,
    reviews: 3.5,
    reviewCount: 78,
  },
];

// Helper functions
export const getCommunityById = (id: number): Community | undefined => {
  return allCommunities.find((c) => c.id === id);
};

export const getCommunitiesByRegion = (region: string): Community[] => {
  if (region === "All Regions") return allCommunities;
  return allCommunities.filter((c) => c.region === region);
};

export const getCommunitiesByLanguage = (language: string): Community[] => {
  if (language === "All Languages") return allCommunities;
  return allCommunities.filter((c) => c.language === language);
};

export const searchCommunities = (searchTerm: string): Community[] => {
  const term = searchTerm.toLowerCase();
  return allCommunities.filter(
    (c) =>
      c.name.toLowerCase().includes(term) ||
      c.description?.toLowerCase().includes(term) ||
      c.tags.some((tag) => tag.toLowerCase().includes(term))
  );
};

export const getCommunitiesByTag = (tag: string): Community[] => {
  return allCommunities.filter((c) => c.tags.includes(tag));
};
