import { NextRequest, NextResponse } from "next/server";
import { grist } from "@/lib/grist";

interface Claimer {
  _id: string;
  discord_id: string;
  username: string;
  email: string;
  join_date: string;
  level: number;
  total_xp: number;
  mood: "happy" | "neutral" | "sad";
  rank: number;
  avatar_url?: string;
  status: "active" | "inactive" | "banned";
}

export async function GET(req: NextRequest) {
  try {
    // Fetch User_agents data
    const userAgents = await grist.fetchTable("User_agents");

    // Fetch Discord_name data สำหรับ username และ avatar
    const discordUsers = await grist.fetchTable("Discord_name");

    // สร้าง map สำหรับ discord data
    const discordMap = new Map<
      string,
      { username: string; avatar_url?: string }
    >(
      discordUsers.map((record: any) => [
        record.discord_id,
        {
          username: record.username,
          avatar_url: record.avatarUrl,
        },
      ])
    );

    // แปลงข้อมูลเป็น Claimer objects และเรียงตาม total_xp
    const claimers: Claimer[] = userAgents
      .map((record: any) => {
        const discordInfo = discordMap.get(record.user_id) || {
          username: "Unknown",
          avatar_url: undefined,
        };

        // กำหนด status ตาม health และ last_active
        let status: "active" | "inactive" | "banned" = "active";
        if (record.health <= 0) {
          status = "inactive";
        } else if (record.last_active) {
          const lastActive = new Date(record.last_active);
          const now = new Date();
          const daysSinceActive =
            (now.getTime() - lastActive.getTime()) / (1000 * 60 * 60 * 24);
          if (daysSinceActive > 30) {
            status = "inactive";
          }
        }

        return {
          _id: record.id.toString(),
          discord_id: record.user_id || "",
          username: discordInfo.username,
          email: record.email || "",
          join_date: record.created_at || "",
          level: record.level || 0,
          total_xp: record.total_xp || 0,
          mood: record.mood || "neutral",
          rank: 0, // จะคำนวณหลังจากเรียง
          avatar_url: discordInfo.avatar_url,
          status,
        };
      })
      .sort((a: Claimer, b: Claimer) => b.total_xp - a.total_xp); // เรียงจากมากไปน้อย

    // กำหนดอันดับ
    claimers.forEach((claimer, index) => {
      claimer.rank = index + 1;
    });

    return NextResponse.json(claimers);
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return NextResponse.json(
      { error: "Failed to fetch leaderboard" },
      { status: 500 }
    );
  }
}
