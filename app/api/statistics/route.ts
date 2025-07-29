import { grist } from "@/lib/grist";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const [users, missions, discordData] = await Promise.all([
      grist.fetchTable("Users"),
      grist.fetchTable("Missions"),
      fetch("https://discord.com/api/v9/invites/Y3TrR6Y86f?with_counts=true")
        .then(res => res.json())
        .catch(error => {
          console.error("Failed to fetch Discord data:", error);
          return { approximate_member_count: 0 };
        })
    ]);

    const stats = {
      totaluser: users?.length || 0,
      totalmissions: missions?.length || 0,
      totalcommunity: discordData?.approximate_member_count || 0
    };

    return NextResponse.json(stats, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch stats:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
