import { grist } from "@/lib/grist";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { UserAgent, ActiveUserStats } from "@/types/statistics";

/**
 * Get detailed active user information for a specific time period
 * @param userAgents - Array of user agents from Grist
 * @param days - Number of days to look back
 * @returns Detailed active user statistics
 */
function getActiveUsersDetailed(
  userAgents: UserAgent[],
  days: number,
  periodName: string
): ActiveUserStats {
  const now = new Date();
  const cutoffDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);

  const activeUsers = userAgents.filter((user) => {
    if (!user.last_active) return false;
    const lastActiveDate = new Date(Number(user.last_active) * 1000);
    return lastActiveDate >= cutoffDate;
  });

  return {
    period: periodName,
    days: days,
    count: activeUsers.length,
    users: activeUsers.map((user) => ({
      id: user.id || 0,
      level: user.level || 0,
      xp: user.xp || 0,
      health: user.health || 0,
      user_id: user.user_id || "",
      last_active: user.last_active || "",
    })),
  };
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const period = searchParams.get("period"); // e.g., "7", "14", "30", "60", or "all"

    const userAgents = await grist.fetchTable("User_agents");

    // If a specific period is requested
    if (period && period !== "all") {
      const days = parseInt(period);
      if (isNaN(days) || days <= 0) {
        return NextResponse.json(
          { error: "Invalid period parameter. Use 7, 14, 30, 60, or all" },
          { status: 400 }
        );
      }

      const periodName = `last${days}Days`;
      const stats = getActiveUsersDetailed(userAgents || [], days, periodName);

      return NextResponse.json(stats, { status: 200 });
    }

    // Return all periods
    const allPeriods = {
      last7Days: getActiveUsersDetailed(userAgents || [], 7, "last7Days"),
      last14Days: getActiveUsersDetailed(userAgents || [], 14, "last14Days"),
      last30Days: getActiveUsersDetailed(userAgents || [], 30, "last30Days"),
      last60Days: getActiveUsersDetailed(userAgents || [], 60, "last60Days"),
    };

    return NextResponse.json(allPeriods, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch active users:", error);
    return NextResponse.json(
      { error: "Failed to fetch active users" },
      { status: 500 }
    );
  }
}
