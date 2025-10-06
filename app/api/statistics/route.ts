import { grist } from "@/lib/grist";
import { NextResponse } from "next/server";
import { UserAgent } from "@/types/statistics";

/**
 * Calculate the number of active users within a specific time period
 * @param userAgents - Array of user agents from Grist
 * @param days - Number of days to look back
 * @returns Number of active users in the specified period
 */
function getActiveUsers(userAgents: UserAgent[], days: number): number {
  const now = new Date();
  const cutoffDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

  return userAgents.filter((user) => {
    if (!user.last_active) return false;

    // Parse the last_active date
    const lastActiveDate = new Date(Number(user.last_active) * 1000);

    // Check if the user was active within the specified period
    return lastActiveDate >= cutoffDate;
  }).length;
}

export async function GET() {
  try {
    const [users, missions, userMissions, discordData, userAgents] = await Promise.all([
      grist.fetchTable("Users"),
      grist.fetchTable("Missions"),
      grist.fetchTable("User_missions"),
      fetch("https://discord.com/api/v9/invites/Y3TrR6Y86f?with_counts=true")
        .then(res => res.json())
        .catch(error => {
          console.error("Failed to fetch Discord data:", error);
          return { approximate_member_count: 0 };
        }),
      grist.fetchTable("User_agents")
    ]);

    const totalXP = userAgents?.reduce((sum: number, user: UserAgent) => {
      return sum + (user.xp || 0);
    }, 0) || 0;

    // Calculate active users for different time periods
    const activeUsers = {
      last7Days: getActiveUsers(userAgents || [], 7),
      last14Days: getActiveUsers(userAgents || [], 14),
      last30Days: getActiveUsers(userAgents || [], 30),
      last60Days: getActiveUsers(userAgents || [], 60),
    };

    const stats = {
      totaluser: users?.length || 0,
      totalmissions: missions?.length || 0,
      totalmissionsubmitted: userMissions?.length || 0,
      totalcommunity: discordData?.approximate_member_count || 0,
      totalXP: totalXP,
      activeUsers: activeUsers,
    };

    return NextResponse.json(stats, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch stats:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}

