import { NextResponse } from "next/server";
import { grist } from "@/lib/grist";

interface Winner {
  _id: string;
  user_id: string;
  username: string;
  email: string;
  competition_name: string;
  competition_type: string;
  prize_title: string;
  prize_value: number;
  prize_description: string;
  won_date: string;
  xp_earned: number;
  badge_earned?: string;
  rank_achieved: number;
  total_participants: number;
}

interface Campaign {
  _id: string;
  campaign_name: string;
  campaign_type: "weekly" | "monthly" | "seasonal" | "special";
  start_date: string;
  end_date: string;
  total_participants: number;
  total_credits_spent: number;
  total_prize_value: number;
  status: "active" | "completed" | "upcoming";
  winners: Winner[];
}

export async function GET() {
  try {
    // Fetch GachaResults data สำหรับข้อมูลผู้ชนะ
    const gachaResults = await grist.fetchTable("GachaResults");

    // Fetch History_log data สำหรับข้อมูลการใช้เครดิต
    const historyLogs = await grist.fetchTable("History_log");

    // Fetch User_agents data สำหรับข้อมูล XP
    const userAgents = await grist.fetchTable("User_agents");

    // Fetch Discord_name data
    const discordUsers = await grist.fetchTable("Discord_name");

    // สร้าง maps
    const userAgentMap = new Map<string, { xp: number; email: string }>(
      userAgents.map((record: Record<string, unknown>) => [
        String(record.user_id || ""),
        {
          xp: Number(record.xp) || 0,
          email: String(record.email || ""),
        },
      ])
    );

    const discordMap = new Map<string, string>(
      discordUsers.map((record: Record<string, unknown>) => [
        String(record.discord_id || ""),
        String(record.username || ""),
      ])
    );

    // จัดกลุ่มข้อมูลตามเดือน (ใช้เป็น campaign)
    const campaignsMap = new Map<
      string,
      {
        participants: Set<string>;
        credits_spent: number;
        winners: Winner[];
        start_date: Date;
        end_date: Date;
      }
    >();

    // ประมวลผล History_log
    historyLogs.forEach((record: Record<string, unknown>) => {
      const boughtAt = record.bought_at;
      if (!boughtAt) return;

      const date = new Date(String(boughtAt));
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

      if (!campaignsMap.has(monthKey)) {
        // สร้าง start และ end date ของเดือน
        const startDate = new Date(date.getFullYear(), date.getMonth(), 1);
        const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59);

        campaignsMap.set(monthKey, {
          participants: new Set(),
          credits_spent: 0,
          winners: [],
          start_date: startDate,
          end_date: endDate,
        });
      }

      const campaign = campaignsMap.get(monthKey)!;
      campaign.participants.add(String(record.discord_id || ""));
      campaign.credits_spent += Number(record.spend) || 0;
    });

    // ประมวลผลผู้ชนะจาก GachaResults
    const winnersData = gachaResults
      .filter((record: Record<string, unknown>) => record.is_win === 1)
      .map((record: Record<string, unknown>) => {
        const rollTime = record.roll_time;
        const date = rollTime ? new Date(String(rollTime)) : new Date();
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

        const userId = String(record.discord_id || "");
        const userAgent = userAgentMap.get(userId);
        const username = discordMap.get(userId) || "Unknown";

        return {
          monthKey,
          winner: {
            _id: String(record.id || ""),
            user_id: userId,
            username,
            email: userAgent?.email || "",
            competition_name: `Super Store Summary ${monthKey}`,
            competition_type: "monthly",
            prize_title: String(record.won_prize || "Mystery Prize"),
            prize_value: Number(record.price_paid) || 0,
            prize_description: `Won ${record.won_prize} from gacha`,
            won_date: String(rollTime || ""),
            xp_earned: Math.floor((Number(record.price_paid) || 0) * 0.1),
            badge_earned: undefined,
            rank_achieved: 1,
            total_participants: 0,
          },
        };
      });

    // เพิ่มผู้ชนะเข้า campaigns
    winnersData.forEach(
      ({ monthKey, winner }) => {
        if (campaignsMap.has(monthKey)) {
          campaignsMap.get(monthKey)!.winners.push(winner);
        }
      }
    );

    // สร้าง Campaign objects
    const campaigns: Campaign[] = Array.from(campaignsMap.entries()).map(
      ([monthKey, data]) => {
        const now = new Date();
        let status: "active" | "completed" | "upcoming" = "completed";

        if (data.start_date > now) {
          status = "upcoming";
        } else if (data.end_date >= now && data.start_date <= now) {
          status = "active";
        }

        // อัพเดท total_participants ในผู้ชนะ
        const totalParticipants = data.participants.size;
        data.winners.forEach((winner) => {
          winner.total_participants = totalParticipants;
        });

        // คำนวณมูลค่ารางวัลรวม
        const totalPrizeValue = data.winners.reduce(
          (sum, winner) => sum + winner.prize_value,
          0
        );

        // กำหนดประเภท campaign
        const month = parseInt(monthKey.split("-")[1]);
        let campaignType: "weekly" | "monthly" | "seasonal" | "special" = "monthly";

        if ([3, 6, 9, 12].includes(month)) {
          campaignType = "seasonal";
        }

        return {
          _id: `campaign-${monthKey}`,
          campaign_name: `Super Store Summary ${monthKey}`,
          campaign_type: campaignType,
          start_date: data.start_date.toISOString(),
          end_date: data.end_date.toISOString(),
          total_participants: totalParticipants,
          total_credits_spent: Math.round(data.credits_spent),
          total_prize_value: Math.round(totalPrizeValue),
          status,
          winners: data.winners,
        };
      }
    );

    // เรียงตามวันที่ล่าสุดก่อน
    campaigns.sort(
      (a, b) =>
        new Date(b.start_date).getTime() - new Date(a.start_date).getTime()
    );

    return NextResponse.json(campaigns);
  } catch (error) {
    console.error("Error fetching campaigns:", error);
    return NextResponse.json(
      { error: "Failed to fetch campaigns data" },
      { status: 500 }
    );
  }
}
