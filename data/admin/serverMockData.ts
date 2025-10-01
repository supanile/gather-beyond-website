import { DiscordServer, ServerStats } from "@/types/admin/serverTypes";

// Mock Discord servers data
export const mockDiscordServers: DiscordServer[] = [
  {
    id: "1",
    name: "Gather Beyond Official",
    icon: "https://via.placeholder.com/64x64/7289da/ffffff?text=GB",
    owner_id: "123456789",
    owner_name: "GatherBeyond Admin",
    member_count: 15420,
    sc_user_count: 2847,
    total_credits: 145672,
    total_xp: 892450,
    created_at: "2023-01-15T10:30:00Z",
    joined_at: "2023-01-15T10:30:00Z",
    is_active: true,
    server_type: "premium",
    features: ["COMMUNITY", "NEWS", "PARTNERED", "VERIFIED"]
  },
  {
    id: "2", 
    name: "Web3 Builders Hub",
    icon: "https://via.placeholder.com/64x64/00d4aa/ffffff?text=W3",
    owner_id: "987654321",
    owner_name: "CryptoBuilder",
    member_count: 8934,
    sc_user_count: 1562,
    total_credits: 78950,
    total_xp: 456780,
    created_at: "2023-03-22T14:15:00Z",
    joined_at: "2023-03-22T14:20:00Z",
    is_active: true,
    server_type: "standard",
    features: ["COMMUNITY", "THREADS"]
  },
  {
    id: "3",
    name: "DeFi Enthusiasts",
    icon: "https://via.placeholder.com/64x64/f04747/ffffff?text=DE",
    owner_id: "456789123",
    owner_name: "DeFiGuru",
    member_count: 12567,
    sc_user_count: 2103,
    total_credits: 96340,
    total_xp: 623490,
    created_at: "2023-02-08T09:45:00Z",
    joined_at: "2023-02-08T10:00:00Z",
    is_active: true,
    server_type: "premium",
    features: ["COMMUNITY", "NEWS", "EVENTS"]
  },
  {
    id: "4",
    name: "NFT Creators Guild",
    icon: "https://via.placeholder.com/64x64/9b59b6/ffffff?text=NC",
    owner_id: "789123456",
    owner_name: "ArtistPro",
    member_count: 6789,
    sc_user_count: 987,
    total_credits: 45230,
    total_xp: 234560,
    created_at: "2023-04-12T16:20:00Z",
    joined_at: "2023-04-12T16:25:00Z",
    is_active: true,
    server_type: "standard",
    features: ["COMMUNITY", "DISCOVERABLE"]
  },
  {
    id: "5",
    name: "Blockchain Gaming",
    icon: "https://via.placeholder.com/64x64/e67e22/ffffff?text=BG",
    owner_id: "321654987",
    owner_name: "GameMaster",
    member_count: 9876,
    sc_user_count: 1654,
    total_credits: 67890,
    total_xp: 398720,
    created_at: "2023-05-30T11:10:00Z",
    joined_at: "2023-05-30T11:15:00Z",
    is_active: true,
    server_type: "premium",
    features: ["COMMUNITY", "THREADS", "EVENTS"]
  },
  {
    id: "6",
    name: "Crypto Traders",
    icon: "https://via.placeholder.com/64x64/27ae60/ffffff?text=CT",
    owner_id: "654321987",
    owner_name: "TradeExpert",
    member_count: 4532,
    sc_user_count: 756,
    total_credits: 32450,
    total_xp: 178920,
    created_at: "2023-06-18T13:30:00Z",
    joined_at: "2023-06-18T13:35:00Z",
    is_active: true,
    server_type: "basic",
    features: ["COMMUNITY"]
  },
  {
    id: "7",
    name: "Metaverse Explorers",
    icon: "https://via.placeholder.com/64x64/3498db/ffffff?text=ME",
    owner_id: "147258369",
    owner_name: "MetaExplorer",
    member_count: 7234,
    sc_user_count: 1245,
    total_credits: 56780,
    total_xp: 289450,
    created_at: "2023-07-05T08:45:00Z",
    joined_at: "2023-07-05T08:50:00Z",
    is_active: false,
    server_type: "standard",
    features: ["COMMUNITY", "DISCOVERABLE"]
  },
  {
    id: "8",
    name: "Smart Contract Devs",
    icon: "https://via.placeholder.com/64x64/e74c3c/ffffff?text=SC",
    owner_id: "963852741",
    owner_name: "DevLead",
    member_count: 3456,
    sc_user_count: 892,
    total_credits: 43210,
    total_xp: 234780,
    created_at: "2023-08-20T15:25:00Z",
    joined_at: "2023-08-20T15:30:00Z",
    is_active: true,
    server_type: "premium",
    features: ["COMMUNITY", "THREADS", "NEWS"]
  }
];

// Calculate server statistics
export const calculateServerStats = (servers: DiscordServer[]): ServerStats => {
  const activeServers = servers.filter(server => server.is_active);
  
  const totalMembers = activeServers.reduce((sum, server) => sum + server.member_count, 0);
  const totalSCUsers = activeServers.reduce((sum, server) => sum + server.sc_user_count, 0);
  const totalCredits = activeServers.reduce((sum, server) => sum + server.total_credits, 0);
  const totalXP = activeServers.reduce((sum, server) => sum + server.total_xp, 0);
  
  const mostActiveServer = activeServers.length > 0 
    ? activeServers.reduce((max, server) => 
        server.member_count > max.member_count ? server : max
      )
    : null;

  return {
    totalServers: activeServers.length,
    totalMembers,
    totalSCUsers,
    totalCredits,
    totalXP,
    averageMembersPerServer: activeServers.length > 0 ? Math.round(totalMembers / activeServers.length) : 0,
    mostActiveServer
  };
};

export const mockServerStats = calculateServerStats(mockDiscordServers);
