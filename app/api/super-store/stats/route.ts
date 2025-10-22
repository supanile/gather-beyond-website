import { NextResponse } from "next/server";
import { grist } from "@/lib/grist";

export async function GET() {
  try {
    // Fetch User_agents data
    const userAgentsData = await grist.fetchTable("User_agents");
    const userAgents = userAgentsData;

    // Fetch GachaResults data สำหรับนับผู้ชนะ
    const gachaResults = await grist.fetchTable("GachaResults");

    // Fetch History_log data สำหรับนับเครดิตที่ใช้
    const historyLogs = await grist.fetchTable("History_log");

    // คำนวณสถิติ
    const total_claimers = userAgents.length;

    // นับเครดิตที่ใช้ไปทั้งหมด
    const total_credits_spent = historyLogs.reduce(
      (sum: number, record: Record<string, unknown>) => sum + (Number(record.spend) || 0),
      0
    );

    // นับผู้ชนะ (คนที่ is_win = 1)
    const total_winners = gachaResults.filter(
      (record: Record<string, unknown>) => record.is_win === 1
    ).length;

    // คำนวณเลเวลเฉลี่ย
    const totalLevel = userAgents.reduce(
      (sum: number, record: Record<string, unknown>) => sum + (Number(record.level) || 0),
      0
    );
    const average_level =
      total_claimers > 0 ? totalLevel / total_claimers : 0;

    // หาอารมณ์ที่พบบ่อยที่สุด
    const moodCount: { [key: string]: number } = {};
    userAgents.forEach((record: Record<string, unknown>) => {
      const mood = record.mood;
      if (mood) {
        moodCount[String(mood)] = (moodCount[String(mood)] || 0) + 1;
      }
    });

    const most_active_mood =
      Object.entries(moodCount).sort((a, b) => b[1] - a[1])[0]?.[0] || "neutral";

    // การกระจายตัวของ tier
    const tierDistribution: { [key: string]: number } = {
      bronze: 0,
      silver: 0,
      gold: 0,
      platinum: 0,
      diamond: 0,
    };

    userAgents.forEach((record: Record<string, unknown>) => {
      const trustScore = Number(record.trust_score) || 0;

      // Map tier based on trust_score
      if (trustScore < 1.0) {
        // Unranked - นับเป็น bronze
        tierDistribution.bronze++;
      } else if (trustScore < 2.5) {
        tierDistribution.bronze++; // Tier I = Bronze
      } else if (trustScore < 3.5) {
        tierDistribution.silver++; // Tier II = Silver
      } else if (trustScore < 4.5) {
        tierDistribution.gold++; // Tier III = Gold
      } else if (trustScore < 4.8) {
        tierDistribution.platinum++; // Tier IV high = Platinum
      } else {
        tierDistribution.diamond++; // Tier IV max = Diamond
      }
    });

    const stats = {
      total_claimers,
      total_credits_spent: Math.round(total_credits_spent),
      total_winners,
      average_level: Math.round(average_level * 100) / 100,
      most_active_mood,
      top_tier_distribution: tierDistribution,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching super store stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch super store stats" },
      { status: 500 }
    );
  }
}
