import { DiscordServer, ServerStats } from "@/types/admin/serverTypes";

// Mock Discord servers data
export const mockDiscordServers: DiscordServer[] = [
  {
    id: "1",
    name: "Super Connector",
    image_url: "https://cdn.discordapp.com/icons/908568690033844246/35d6d7aba59bef7102940cc0288c507d.png",
    // owner_id: "123456789",
    // owner_name: "Admin pond",
    member_count: 15420,
    sc_user_count: 22847,
    total_credits: 145672,
    total_xp: 892450,
    missions_completed: 3247,
    created_at: "2023-01-15T10:30:00Z",
    joined_at: "2023-01-15T10:30:00Z",
    is_active: true,
    // server_type: "premium",
    categories: ["GAMING", "WEB3", "TRADING", "EDUCATION"]
  },
  {
    id: "2", 
    name: "스타이카 Staika",
    image_url: "https://coin-images.coingecko.com/coins/images/29063/large/STIK.png?1696528030",
    // owner_id: "987654321",
    // owner_name: "CryptoBuilder",
    member_count: 28934,
    sc_user_count: 3562,
    total_credits: 78950,
    total_xp: 456780,
    missions_completed: 1876,
    created_at: "2023-03-22T14:15:00Z",
    joined_at: "2023-03-22T14:20:00Z",
    is_active: true,
    // server_type: "standard",
    categories: ["DEVELOPMENT", "WEB3", "BLOCKCHAIN"]
  },
  {
    id: "3",
    name: "DeFi Enthusiasts",
    image_url: "https://via.placeholder.com/64x64/f04747/ffffff?text=DE",
    // owner_id: "456789123",
    // owner_name: "DeFiGuru",
    member_count: 12567,
    sc_user_count: 2103,
    total_credits: 96340,
    total_xp: 623490,
    missions_completed: 1432,
    created_at: "2023-02-08T09:45:00Z",
    joined_at: "2023-02-08T10:00:00Z",
    is_active: true,
    // server_type: "premium",
    categories: ["DEFI", "TRADING", "FINANCE", "EDUCATION"]
  },
  {
    id: "4",
    name: "NFT Creators Guild",
    image_url: "https://via.placeholder.com/64x64/9b59b6/ffffff?text=NC",
    // owner_id: "789123456",
    // owner_name: "ArtistPro",
    member_count: 6789,
    sc_user_count: 987,
    total_credits: 45230,
    total_xp: 234560,
    missions_completed: 567,
    created_at: "2023-04-12T16:20:00Z",
    joined_at: "2023-04-12T16:25:00Z",
    is_active: true,
    // server_type: "standard",
    categories: ["NFT", "ART", "CREATIVITY"]
  },
  {
    id: "5",
    name: "Blockchain Gaming",
    image_url: "https://via.placeholder.com/64x64/e67e22/ffffff?text=BG",
    // owner_id: "321654987",
    // owner_name: "GameMaster",
    member_count: 9876,
    sc_user_count: 1654,
    total_credits: 67890,
    total_xp: 398720,
    missions_completed: 892,
    created_at: "2023-05-30T11:10:00Z",
    joined_at: "2023-05-30T11:15:00Z",
    is_active: true,
    // server_type: "premium",
    categories: ["GAMING", "BLOCKCHAIN", "WEB3", "ENTERTAINMENT"]
  },
  {
    id: "6",
    name: "Crypto Traders",
    image_url: "https://via.placeholder.com/64x64/27ae60/ffffff?text=CT",
    // owner_id: "654321987",
    // owner_name: "TradeExpert",
    member_count: 4532,
    sc_user_count: 756,
    total_credits: 32450,
    total_xp: 178920,
    missions_completed: 234,
    created_at: "2023-06-18T13:30:00Z",
    joined_at: "2023-06-18T13:35:00Z",
    is_active: true,
    // server_type: "basic",
    categories: ["TRADING", "FINANCE"]
  },
  {
    id: "7",
    name: "Metaverse Explorers",
    image_url: "https://via.placeholder.com/64x64/3498db/ffffff?text=ME",
    // owner_id: "147258369",
    // owner_name: "MetaExplorer",
    member_count: 7234,
    sc_user_count: 1245,
    total_credits: 56780,
    total_xp: 289450,
    missions_completed: 456,
    created_at: "2023-07-05T08:45:00Z",
    joined_at: "2023-07-05T08:50:00Z",
    is_active: false,
    // server_type: "standard",
    categories: ["METAVERSE", "VR", "GAMING", "TECHNOLOGY"]
  },
  {
    id: "8",
    name: "Smart Contract Devs",
    image_url: "https://via.placeholder.com/64x64/e74c3c/ffffff?text=SC",
    // owner_id: "963852741",
    // owner_name: "DevLead",
    member_count: 3456,
    sc_user_count: 892,
    total_credits: 43210,
    total_xp: 234780,
    missions_completed: 723,
    created_at: "2023-08-20T15:25:00Z",
    joined_at: "2023-08-20T15:30:00Z",
    is_active: true,
    // server_type: "premium",
    categories: ["DEVELOPMENT", "BLOCKCHAIN", "SMART_CONTRACTS", "EDUCATION"]
  }
];

// Calculate server statistics
export const calculateServerStats = (servers: DiscordServer[]): ServerStats => {
  const activeServers = servers.filter(server => server.is_active);
  
  const totalMembers = activeServers.reduce((sum, server) => sum + server.member_count, 0);
  const totalSCUsers = activeServers.reduce((sum, server) => sum + server.sc_user_count, 0);
  const totalCredits = activeServers.reduce((sum, server) => sum + server.total_credits, 0);
  const totalXP = activeServers.reduce((sum, server) => sum + server.total_xp, 0);
  const totalMissionsCompleted = activeServers.reduce((sum, server) => sum + server.missions_completed, 0);
  
  const mostActiveServer = activeServers.length > 0 
    ? activeServers.reduce((max, server) => 
        server.sc_user_count > max.sc_user_count ? server : max
      )
    : null;

  return {
    totalServers: activeServers.length,
    totalMembers,
    totalSCUsers,
    totalCredits,
    totalXP,
    totalMissionsCompleted,
    averageMembersPerServer: activeServers.length > 0 ? Math.round(totalMembers / activeServers.length) : 0,
    mostActiveServer
  };
};

export const mockServerStats = calculateServerStats(mockDiscordServers);
