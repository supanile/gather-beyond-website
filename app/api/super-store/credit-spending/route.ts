import { NextResponse } from "next/server";
import { grist } from "@/lib/grist";

interface CreditSpending {
  user_id: string;
  username: string;
  avatar_url?: string;
  email: string;
  total_credits_spent: number;
  tier: "bronze" | "silver" | "gold" | "platinum" | "diamond";
  tier_level: number;
  last_purchase_date: string;
  purchases_count: number;
  avg_purchase_amount: number;
}

export async function GET() {
  try {
    // Fetch History_log data
    const historyLogs = await grist.fetchTable("History_log");

    // Fetch User_agents data สำหรับ tier
    const userAgents = await grist.fetchTable("User_agents");

    // Fetch Discord_name data
    const discordUsers = await grist.fetchTable("Discord_name");

    // สร้าง map สำหรับข้อมูลผู้ใช้
    const userAgentMap = new Map<
      string,
      { trust_score: number; email: string }
    >(
      userAgents.map((record: Record<string, unknown>) => [
        String(record.user_id || ""),
        {
          trust_score: Number(record.trust_score) || 0,
          email: String(record.email || ""),
        },
      ]),
    );

    const discordMap = new Map<
      string,
      { username: string; avatar_url?: string }
    >(
      discordUsers.map((record: Record<string, unknown>) => [
        String(record.discord_id || ""),
        {
          username: String(record.username || ""),
          avatar_url: record.avatarUrl ? String(record.avatarUrl) : undefined,
        },
      ]),
    );

    // จัดกลุ่มข้อมูลการซื้อตาม user_id
    const userSpending = new Map<
      string,
      {
        total_spent: number;
        purchases: { amount: number; date: string }[];
      }
    >();

    historyLogs.forEach((record: Record<string, unknown>) => {
      const userId = String(record.discord_id || "");
      const spend = Number(record.spend) || 0;
      const boughtAt = String(record.bought_at || "");

      if (!userSpending.has(userId)) {
        userSpending.set(userId, { total_spent: 0, purchases: [] });
      }

      const userData = userSpending.get(userId)!;
      userData.total_spent += spend;
      userData.purchases.push({ amount: spend, date: boughtAt });
    });

    // แปลง trust_score เป็น tier
    const getTierFromTrustScore = (
      trustScore: number,
    ): {
      tier: "bronze" | "silver" | "gold" | "platinum" | "diamond";
      tier_level: number;
    } => {
      if (trustScore < 1.0) {
        return { tier: "bronze", tier_level: 1 };
      } else if (trustScore < 2.5) {
        const level = Math.ceil(((trustScore - 0) / 1.5) * 3); // 1-3
        return { tier: "bronze", tier_level: Math.min(level, 5) };
      } else if (trustScore < 3.5) {
        const level = Math.ceil(((trustScore - 2.5) / 1.0) * 3) + 1; // 2-4
        return { tier: "silver", tier_level: Math.min(level, 5) };
      } else if (trustScore < 4.5) {
        const level = Math.ceil(((trustScore - 3.5) / 1.0) * 3) + 1; // 2-4
        return { tier: "gold", tier_level: Math.min(level, 5) };
      } else if (trustScore < 4.8) {
        const level = Math.ceil(((trustScore - 4.5) / 0.3) * 2) + 2; // 3-4
        return { tier: "platinum", tier_level: Math.min(level, 5) };
      } else {
        const level = Math.ceil(((trustScore - 4.8) / 0.2) * 2) + 3; // 4-5
        return { tier: "diamond", tier_level: Math.min(level, 5) };
      }
    };

    // สร้าง CreditSpending objects
    const creditSpendingList: CreditSpending[] = Array.from(
      userSpending.entries(),
    ).map(([userId, data]) => {
      const userAgent = userAgentMap.get(userId);
      const discordUser = discordMap.get(userId);
      const username = discordUser?.username || "Unknown";
      const avatar_url = discordUser?.avatar_url;
      const trustScore = userAgent?.trust_score || 0;
      const { tier, tier_level } = getTierFromTrustScore(trustScore);

      // เรียงวันที่และหาวันซื้อล่าสุด
      const sortedPurchases = data.purchases.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      );

      return {
        user_id: userId,
        username,
        avatar_url,
        email: userAgent?.email || "",
        total_credits_spent: Math.round(data.total_spent),
        tier,
        tier_level,
        last_purchase_date: sortedPurchases[0]?.date || "",
        purchases_count: data.purchases.length,
        avg_purchase_amount:
          data.purchases.length > 0
            ? Math.round(data.total_spent / data.purchases.length)
            : 0,
      };
    });

    // เรียงตาม total_credits_spent จากมากไปน้อย
    creditSpendingList.sort(
      (a, b) => b.total_credits_spent - a.total_credits_spent,
    );

    return NextResponse.json(creditSpendingList);
  } catch (error) {
    console.error("Error fetching credit spending:", error);
    return NextResponse.json(
      { error: "Failed to fetch credit spending data" },
      { status: 500 },
    );
  }
}
