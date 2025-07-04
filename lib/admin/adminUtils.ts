import { User } from "@/types/admin/adminTypes";

const mockGuildsResponse = (discordId: string) => {
  const guildCounts: { [key: string]: number } = {
    "421249349469732874": 5,
    "421249349469732875": 3,
    "421249349469732876": 2,
    "421249349469732877": 7,
    "421249349469732878": 1,
  };
  return Promise.resolve({
    guilds: Array(guildCounts[discordId] || 0).fill({}),
  });
};

export const fetchUserGuilds = async (discordId: string, accessToken: string) => {
  try {
    const response = await mockGuildsResponse(discordId);
    return response.guilds.length;
  } catch (error) {
    console.error(`Error fetching guilds for Discord ID ${discordId}:`, error);
    return 0;
  }
};

export const calculateStats = async (users: User[]) => {
  const totalUsers = users.length;
  const totalMissions = users.reduce(
    (sum, user) => sum + user.missions_completed,
    0
  );
  const totalPoints = users.reduce((sum, user) => sum + user.total_points, 0);

  let totalCommunities = 0;
  for (const user of users) {
    const guildCount = await fetchUserGuilds(
      user.discord_id,
      "mock-access-token"
    );
    totalCommunities += guildCount;
  }

  return {
    totalUsers,
    totalMissions,
    totalPoints,
    totalCommunities,
    usersGrowth: 12.5,
    activeUsersGrowth: 8.3,
    missionsGrowth: 15.7,
    pointsGrowth: 22.1,
    communitiesGrowth: 9.4,
  };
};