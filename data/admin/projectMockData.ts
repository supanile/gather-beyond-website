export interface Project {
  id: number;
  name: string;
  logo?: string; // Made optional for Super Connector
  image_url?: string; // Added for Super Connector
  description?: string;
  trustScore: number;
  mindshareScore: number;
  category: string;
  chain?: string;
  narrative?: string;
  badges?: string[];
  tags: string[];
  verified?: boolean;
  reviews?: number;
  reviewCount?: number;
}

// ข้อมูลโปรเจค 10 อันหลักจาก FeaturedProjects
export const allProjects: Project[] = [
  // {
  //   id: 1,
  //   name: "DecentraDAO",
  //   logo: "🏛️",
  //   description: "A decentralized autonomous organization focused on community-driven governance and blockchain gaming infrastructure.",
  //   trustScore: 85,
  //   mindshareScore: 72,
  //   category: "DAO",
  //   chain: "Ethereum",
  //   narrative: "Gaming DeFi",
  //   badges: ["Verified", "Audited", "Gold Tier"],
  //   tags: ["Gaming", "DePIN", "Governance", "Community"],
  //   verified: true,
  //   reviews: 4.3,
  //   reviewCount: 127,
  // },
  {
    id: 1,
    name: "Super Connector",
    image_url:
      "https://coin-images.coingecko.com/coins/images/55873/large/23678_Super_Connector_5ba88a91b1.png?1747554890",
    description:
      "Super Connector is the AI-native trust layer powering the Agent Economy. Built as an Agent-as-a-Service (AaaS), it coordinates growth between communities and projects using missions, memory, and behavior—not ads. $SUPER fuels this autonomous engine, enabling mission-based distribution, campaign matching, and trust scoring across networks. Plug in, activate, and let the agent work autopilot. It’s coordination, upgraded.",
    trustScore: 67, // Using gt_score from API
    mindshareScore: 75,
    category: "Virtuals Protocol",
    chain: "Base",
    narrative: "Agent Economy",
    badges: ["Verified", "AI-Native", "Base Network"],
    tags: ["AI", "Agent Economy", "Trust Layer", "AaaS", "Automation"],
    verified: true,
    reviews: 4.1,
    reviewCount: 89,
  },
  {
    id: 2,
    name: "Staika",
    image_url:
      "https://coin-images.coingecko.com/coins/images/29063/large/STIK.png?1696528030",
    description:
      "The Staika token is the governance token of the Staika project and the ticker is marked as STIK. STIK can be obtained by purchasing from a designated exchange or by swapping from a DEX(decentralized exchange) or Staika Wallet. The use cases of the Staika are as follows: - Means to receive benefits and rewards within the Staika platform - Payment methods avaiable within the various services provided by the Staika platform - Exchange (swap) means for other altcoins - Payment and exchange methods(swap) for Staika-based Altcoin",
    trustScore: Math.round(37.61467889908257), // 38 - Using gt_score from API
    mindshareScore: 65, // Derived from holder count and platform features
    category: "Platform", // Based on multi-use platform description
    chain: "Solana", // From the API ID solana_8BMz...
    narrative: "Platform Governance",
    badges: ["Governance Token", "Multi-Service"],
    tags: ["Governance", "Payments", "Platform", "DeFi", "Exchange"],
    verified: true, // Platform has good holder distribution
    reviews: 3.8, // Moderate score based on gt_score
    reviewCount: 156,
  },
  // {
  //   id: 2,
  //   name: "AiAgent Protocol",
  //   logo: "🤖",
  //   image_url:
  //     "https://coin-images.coingecko.com/coins/images/55873/large/23678_Super_Connector_5ba88a91b1.png?1747554890",
  //   description:
  //     "Advanced AI agent infrastructure for decentralized autonomous systems and community governance.",
  //   trustScore: 20,
  //   mindshareScore: 28,
  //   category: "AI",
  //   chain: "Polygon",
  //   narrative: "AI Infrastructure",
  //   badges: ["New"],
  //   tags: ["AI", "Infrastructure", "Automation"],
  //   verified: false,
  //   reviews: 2.8,
  //   reviewCount: 45,
  // },
  {
    id: 3,
    name: "CryptoGuild",
    logo: "⚔️",
    description:
      "Gaming-focused blockchain guild providing players with tools and community for Web3 gaming.",
    trustScore: 78,
    mindshareScore: 65,
    category: "Gaming",
    chain: "Ethereum",
    narrative: "GameFi",
    badges: ["Verified", "Community Choice"],
    tags: ["Gaming", "NFT", "Guild", "P2E"],
    verified: true,
    reviews: 4.1,
    reviewCount: 89,
  },
  {
    id: 4,
    name: "Web3Social",
    logo: "🌐",
    description:
      "Decentralized social networking platform built on blockchain technology for authentic community engagement.",
    trustScore: 92,
    mindshareScore: 88,
    category: "Social",
    chain: "Solana",
    narrative: "Social DeFi",
    badges: ["Verified", "Audited", "Platinum Tier"],
    tags: ["Social", "DeFi", "Community", "SocialFi"],
    verified: true,
    reviews: 4.7,
    reviewCount: 203,
  },
  {
    id: 5,
    name: "MetaVerse Hub",
    logo: "🚀",
    description:
      "Virtual world platform connecting multiple metaverse experiences through unified identity and assets.",
    trustScore: 67,
    mindshareScore: 54,
    category: "Metaverse",
    chain: "Ethereum",
    narrative: "Metaverse",
    badges: ["Verified"],
    tags: ["Metaverse", "VR", "Gaming", "Virtual Worlds"],
    verified: true,
    reviews: 3.9,
    reviewCount: 156,
  },
  {
    id: 6,
    name: "BlockChain Games",
    logo: "🎮",
    description:
      "Next-generation blockchain gaming platform with play-to-earn mechanics and NFT integration.",
    trustScore: 73,
    mindshareScore: 61,
    category: "Gaming",
    chain: "Polygon",
    narrative: "GameFi",
    badges: ["Verified", "Gaming Leader"],
    tags: ["Gaming", "Blockchain", "P2E", "NFT"],
    verified: true,
    reviews: 4.0,
    reviewCount: 134,
  },
  {
    id: 7,
    name: "DeFi Protocol",
    logo: "💰",
    description:
      "Innovative decentralized finance protocol offering advanced yield farming and liquidity solutions.",
    trustScore: 88,
    mindshareScore: 79,
    category: "DeFi",
    chain: "Ethereum",
    narrative: "DeFi Innovation",
    badges: ["Verified", "Audited", "Gold Tier"],
    tags: ["DeFi", "Finance", "Yield", "Liquidity"],
    verified: true,
    reviews: 4.5,
    reviewCount: 298,
  },
  {
    id: 8,
    name: "NFT Marketplace",
    logo: "🎨",
    description:
      "Premier NFT marketplace for digital art and collectibles with creator-focused features.",
    trustScore: 81,
    mindshareScore: 68,
    category: "NFT",
    chain: "Ethereum",
    narrative: "Digital Art",
    badges: ["Verified", "Artist Friendly"],
    tags: ["NFT", "Art", "Marketplace", "Collectibles"],
    verified: true,
    reviews: 4.2,
    reviewCount: 176,
  },
  {
    id: 9,
    name: "Smart Contracts",
    logo: "📋",
    description:
      "Enterprise-grade smart contract platform with advanced security features and audit tools.",
    trustScore: 95,
    mindshareScore: 85,
    category: "Infrastructure",
    chain: "Ethereum",
    narrative: "Enterprise Blockchain",
    badges: ["Verified", "Audited", "Enterprise", "Platinum Tier"],
    tags: ["Smart Contract", "Security", "Enterprise", "Infrastructure"],
    verified: true,
    reviews: 4.8,
    reviewCount: 312,
  },
  {
    id: 10,
    name: "Crypto Wallet",
    logo: "💳",
    description:
      "Secure multi-chain wallet with advanced DeFi integration and community governance features.",
    trustScore: 90,
    mindshareScore: 82,
    category: "Wallet",
    chain: "Multi-chain",
    narrative: "Web3 Infrastructure",
    badges: ["Verified", "Audited", "Security Leader"],
    tags: ["Wallet", "Security", "Multi-chain", "DeFi"],
    verified: true,
    reviews: 4.6,
    reviewCount: 267,
  },
];

// ข้อมูลสำหรับ ProjectProfilePage (DecentraDAO - id: 1)
export const getProjectDetails = (projectId: number) => {
  const project = allProjects.find((p) => p.id === projectId);
  if (!project) return null;

  return {
    ...project,
    // Overview data
    overview: {
      about:
        project.description ||
        `${project.name} is a leading ${project.category} project in the Web3 space.`,
      verifiedWallets: [
        {
          address: "0x742d35Cc6634C0532925a3b8D322C3b1e0c39e9f",
          type: "Treasury",
          verified: true,
        },
        {
          address: "0x742d35Cc6634C0532925a3b8D322C3b1e0c39e8a",
          type: "Operations",
          verified: true,
        },
        {
          address: "0x742d35Cc6634C0532925a3b8D322C3b1e0c39e7b",
          type: "Dev Fund",
          verified: project.verified || false,
        },
      ],
      audits: [
        {
          company: "CertiK",
          date: "2024-01-15",
          status: "Passed",
          score: Math.min(95, project.trustScore + 10),
        },
        {
          company: "ConsenSys",
          date: "2023-11-20",
          status: project.trustScore > 70 ? "Passed" : "Failed",
          score: project.trustScore,
        },
      ],
      communityLinks: {
        discord: `https://discord.gg/${project.name
          .toLowerCase()
          .replace(/\s+/g, "")}`,
        telegram: `https://t.me/${project.name
          .toLowerCase()
          .replace(/\s+/g, "")}`,
        twitter: `https://twitter.com/${project.name
          .toLowerCase()
          .replace(/\s+/g, "")}`,
        github: `https://github.com/${project.name
          .toLowerCase()
          .replace(/\s+/g, "")}`,
        website: `https://${project.name
          .toLowerCase()
          .replace(/\s+/g, "")}.org`,
      },
    },

    // Scores breakdown
    scores: {
      trustBreakdown: {
        communityHealth: Math.min(100, project.trustScore + 3),
        campaignSuccess: Math.max(0, project.trustScore - 3),
        onchainBehavior: project.trustScore,
      },
      mindshareHistory: [
        { date: "2024-01-01", value: Math.max(0, project.mindshareScore - 7) },
        { date: "2024-01-08", value: Math.max(0, project.mindshareScore - 4) },
        { date: "2024-01-15", value: Math.max(0, project.mindshareScore - 2) },
        { date: "2024-01-22", value: project.mindshareScore },
        {
          date: "2024-01-29",
          value: Math.min(100, project.mindshareScore + 2),
        },
        { date: "2024-02-05", value: project.mindshareScore },
        {
          date: "2024-02-12",
          value: Math.min(100, project.mindshareScore + 3),
        },
      ],
      sentiment: {
        positive: Math.max(40, Math.min(80, project.trustScore - 20)),
        neutral: 25,
        negative: Math.max(5, Math.min(35, 95 - project.trustScore)),
      },
      topInfluencers: [
        { name: "@cryptowhale", mentions: 45, followers: "2.5M" },
        { name: "@daoexpert", mentions: 32, followers: "890K" },
        { name: "@web3builder", mentions: 28, followers: "1.2M" },
      ],
    },

    // Campaign history based on trust score
    campaigns: [
      {
        id: 1,
        name: "Genesis Governance Vote",
        successRate: Math.min(100, project.trustScore + 9),
        avgXP: 150,
        completionTime: "3 days",
        participants: 2450,
      },
      {
        id: 2,
        name: "Community Treasury Decision",
        successRate: Math.min(100, project.trustScore + 2),
        avgXP: 200,
        completionTime: "5 days",
        participants: 1890,
      },
      {
        id: 3,
        name: "Protocol Upgrade Proposal",
        successRate: Math.min(100, project.trustScore + 6),
        avgXP: 175,
        completionTime: "7 days",
        participants: 3200,
      },
      {
        id: 4,
        name: "Partnership Vote",
        successRate: Math.max(60, project.trustScore - 9),
        avgXP: 125,
        completionTime: "2 days",
        participants: 1650,
      },
    ],

    // Reviews based on project data
    reviews: {
      averageRating: project.reviews || 4.0,
      totalReviews: project.reviewCount || 100,
      breakdown: {
        5: Math.floor((project.reviewCount || 100) * 0.35),
        4: Math.floor((project.reviewCount || 100) * 0.3),
        3: Math.floor((project.reviewCount || 100) * 0.2),
        2: Math.floor((project.reviewCount || 100) * 0.1),
        1: Math.floor((project.reviewCount || 100) * 0.05),
      },
      recent: [
        {
          id: 1,
          rating: 5,
          comment: `Excellent ${project.category.toLowerCase()} platform with outstanding community engagement. The transparency is remarkable.`,
          author: "CommunityLeader",
          type: "Community Leader",
          date: "2 days ago",
          verified: true,
        },
        {
          id: 2,
          rating: 4,
          comment: `Great project with solid fundamentals. Could improve on documentation for ${project.category} features.`,
          author: "Anonymous",
          type: "Verified Agent",
          date: "5 days ago",
          verified: true,
        },
        {
          id: 3,
          rating: project.trustScore > 70 ? 5 : 3,
          comment:
            project.trustScore > 70
              ? `Best ${project.category} platform I've used. The rewards system is fair and the community is helpful.`
              : `Decent ${project.category} project but needs improvement in trust and community building.`,
          author: "TokenHolder",
          type: "Anonymous",
          date: "1 week ago",
          verified: false,
        },
      ],
    },
  };
};

// Related projects (สุ่มเลือก 3 โปรเจคที่ไม่ใช่โปรเจคหลัก)
export const getRelatedProjects = (
  currentProjectId: number,
  limit: number = 3
): Project[] => {
  return allProjects
    .filter((p) => p.id !== currentProjectId)
    .sort(() => Math.random() - 0.5)
    .slice(0, limit);
};

// Live Insights Panel Data
export const liveInsightsData = {
  topGainers: [
    { name: "Web3Social", gain: "+45%" },
    { name: "Smart Contracts", gain: "+38%" },
    { name: "DeFi Protocol", gain: "+32%" },
    { name: "Crypto Wallet", gain: "+28%" },
  ],
  riskWatchlist: [
    { name: "AiAgent Protocol", risk: "High" as const },
    { name: "MetaVerse Hub", risk: "Medium" as const },
    { name: "Failed Campaign #1", risk: "High" as const },
    { name: "Low Activity DAO", risk: "Low" as const },
  ],
  recentlyVerified: [
    {
      name: "Smart Contracts",
      verifiedDate: "2 hours ago",
      category: "Infrastructure",
    },
    { name: "Web3Social", verifiedDate: "5 hours ago", category: "Social" },
    { name: "DeFi Protocol", verifiedDate: "1 day ago", category: "DeFi" },
    { name: "CryptoGuild", verifiedDate: "2 days ago", category: "Gaming" },
  ],
};

// Media Feed Articles
export const mediaFeedArticles = [
  {
    id: 1,
    title: "The Rise of AI Agents in Web3 Communities",
    subtitle:
      "How artificial intelligence is transforming decentralized communities and creating new trust paradigms",
    category: "Technology",
    readTime: "5 min read",
    author: "Sarah Chen",
    publishedAt: "2 hours ago",
    type: "editorial" as const,
    featured: true,
  },
  {
    id: 2,
    title: "Trust Metrics That Matter: New Verification Standards",
    subtitle:
      "Understanding the evolving paradigms of community verification and reputation systems",
    category: "Research",
    readTime: "8 min read",
    author: "Michael Rodriguez",
    publishedAt: "6 hours ago",
    type: "editorial" as const,
  },
  {
    id: 3,
    title: "Badge Announcement: Smart Contracts Achieves Platinum Trust Rating",
    subtitle:
      "Enterprise blockchain platform reaches highest verification level with perfect security score",
    category: "Badge",
    readTime: "3 min read",
    publishedAt: "8 hours ago",
    type: "badge" as const,
  },
  {
    id: 4,
    title: "Security Audit: Web3Social Protocol Review Complete",
    subtitle:
      "Comprehensive audit reveals exceptional security practices and community governance standards",
    category: "Audit",
    readTime: "6 min read",
    author: "Security Team",
    publishedAt: "1 day ago",
    type: "audit" as const,
  },
  {
    id: 5,
    title: "Protocol News: New Trust Layer Integration",
    subtitle:
      "Latest updates on cross-chain community verification and reputation scoring",
    category: "Protocol",
    readTime: "4 min read",
    publishedAt: "1 day ago",
    type: "protocol" as const,
  },
  {
    id: 6,
    title: "DeFi Protocol Success: Revolutionary Yield Farming Results",
    subtitle:
      "Analyzing breakthrough yield farming strategies and their impact on community trust building",
    category: "Case Study",
    readTime: "7 min read",
    author: "Emma Thompson",
    publishedAt: "2 days ago",
    type: "editorial" as const,
  },
];

// Helper functions
export const getProjectById = (id: number): Project | undefined => {
  return allProjects.find((p) => p.id === id);
};

export const getProjectsByCategory = (category: string): Project[] => {
  if (category === "All") return allProjects;
  return allProjects.filter((p) => p.category === category);
};

export const searchProjects = (searchTerm: string): Project[] => {
  const term = searchTerm.toLowerCase();
  return allProjects.filter(
    (p) =>
      p.name.toLowerCase().includes(term) ||
      p.category.toLowerCase().includes(term) ||
      p.tags.some((tag) => tag.toLowerCase().includes(term))
  );
};

// สำหรับ FeaturedProjects - ใช้ข้อมูลเดิม
export const featuredProjects = allProjects;

// สำหรับ ProjectsTable - แปลงข้อมูลให้ตรงกับ interface
export const projectsTableData = allProjects.map((project) => ({
  id: project.id,
  name: project.name,
  category: project.category,
  trustScore: project.trustScore,
  mindshareScore: project.mindshareScore,
  reviews: project.reviews || 4.0,
  reviewCount: project.reviewCount || 100,
  logo: project.logo,
  verified: project.verified || false,
}));

// สำหรับ ProjectProfilePage - ใช้ DecentraDAO เป็นเดฟอลต์
export const mockProjectData = getProjectDetails(1); // DecentraDAO

// สำหรับ SidePanel related projects
export const relatedProjectsData = getRelatedProjects(1, 3);

// Export ทั้งหมดสำหรับใช้งาน
export default {
  allProjects,
  getProjectDetails,
  getRelatedProjects,
  liveInsightsData,
  mediaFeedArticles,
  featuredProjects,
  projectsTableData,
  mockProjectData,
  relatedProjectsData,
  // Helper functions
  getProjectById,
  getProjectsByCategory,
  searchProjects,
};
