import React from "react";
import ProjectTabs from "@/components/ProjectProfile/Tabs/ProjectTabs";
import Header from "@/components/LandingDashboard/Header/Header";
import ProjectHeader from "@/components/ProjectProfile/ProjectHeader";
import SidePanel from "@/components/ProjectProfile/Sidepanel";

// Mock data - replace with API call later
const mockProjectData = {
  id: 1,
  name: "DecentraDAO",
  logo: "🏛️",
  description:
    "A decentralized autonomous organization focused on community-driven governance and blockchain gaming infrastructure.",
  trustScore: 85,
  mindshareScore: 72,
  category: "DAO",
  chain: "Ethereum",
  narrative: "Gaming DeFi",
  badges: ["Verified", "Audited", "Gold Tier"],
  tags: ["Gaming", "DePIN", "Governance", "Community"],

  // Overview data
  overview: {
    about:
      "DecentraDAO is revolutionizing decentralized governance through innovative community-driven mechanisms. Our platform combines the power of blockchain technology with user-centric design to create sustainable, transparent, and efficient DAOs.",
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
        verified: false,
      },
    ],
    audits: [
      { company: "CertiK", date: "2024-01-15", status: "Passed", score: 95 },
      { company: "ConsenSys", date: "2023-11-20", status: "Failed", score: 88 },
    ],
    communityLinks: {
      discord: "https://discord.gg/decentradao",
      telegram: "https://t.me/decentradao",
      twitter: "https://twitter.com/decentradao",
      github: "https://github.com/decentradao",
      website: "https://decentradao.org",
    },
  },

  // Scores breakdown
  scores: {
    trustBreakdown: {
      communityHealth: 88,
      campaignSuccess: 82,
      onchainBehavior: 85,
    },
    mindshareHistory: [
      { date: "2024-01-01", value: 65 },
      { date: "2024-01-08", value: 68 },
      { date: "2024-01-15", value: 70 },
      { date: "2024-01-22", value: 72 },
      { date: "2024-01-29", value: 74 },
      { date: "2024-02-05", value: 72 },
      { date: "2024-02-12", value: 75 },
    ],
    sentiment: {
      positive: 65,
      neutral: 25,
      negative: 10,
    },
    topInfluencers: [
      { name: "@cryptowhale", mentions: 45, followers: "2.5M" },
      { name: "@daoexpert", mentions: 32, followers: "890K" },
      { name: "@web3builder", mentions: 28, followers: "1.2M" },
    ],
  },

  // Campaign history
  campaigns: [
    {
      id: 1,
      name: "Genesis Governance Vote",
      successRate: 94,
      avgXP: 150,
      completionTime: "3 days",
      participants: 2450,
    },
    {
      id: 2,
      name: "Community Treasury Decision",
      successRate: 87,
      avgXP: 200,
      completionTime: "5 days",
      participants: 1890,
    },
    {
      id: 3,
      name: "Protocol Upgrade Proposal",
      successRate: 91,
      avgXP: 175,
      completionTime: "7 days",
      participants: 3200,
    },
    {
      id: 4,
      name: "Partnership Vote",
      successRate: 76,
      avgXP: 125,
      completionTime: "2 days",
      participants: 1650,
    },
  ],

  // Reviews
  reviews: {
    averageRating: 4.3,
    totalReviews: 127,
    breakdown: { 5: 45, 4: 38, 3: 25, 2: 12, 1: 7 },
    recent: [
      {
        id: 1,
        rating: 5,
        comment:
          "Excellent governance mechanisms and very active community. The transparency is outstanding.",
        author: "CommunityLeader",
        type: "Community Leader",
        date: "2 days ago",
        verified: true,
      },
      {
        id: 2,
        rating: 4,
        comment:
          "Great project with solid fundamentals. Could improve on documentation.",
        author: "Anonymous",
        type: "Verified Agent",
        date: "5 days ago",
        verified: true,
      },
      {
        id: 3,
        rating: 5,
        comment:
          "Best DAO I've participated in. The rewards system is fair and the community is helpful.",
        author: "TokenHolder",
        type: "Anonymous",
        date: "1 week ago",
        verified: false,
      },
    ],
  },
};

const relatedProjects = [
  { id: 2, name: "Web3Social", logo: "🌐", trustScore: 92, category: "Social" },
  {
    id: 3,
    name: "CryptoGuild",
    logo: "⚔️",
    trustScore: 78,
    category: "Gaming",
  },
  {
    id: 4,
    name: "Smart Contracts",
    logo: "📋",
    trustScore: 95,
    category: "Infrastructure",
  },
];

const ProjectProfilePage = () => {
  return (
    <div className="min-h-screen bg-background pt-20">
      <Header />
      {/* Project Header */}
      <ProjectHeader project={mockProjectData} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content - Tabs */}
          <div className="lg:col-span-3">
            <ProjectTabs project={mockProjectData} />
          </div>

          {/* Side Panel */}
          <div className="lg:col-span-1">
            <SidePanel
              projectId={mockProjectData.id}
              relatedProjects={relatedProjects}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectProfilePage;
