import { grist } from "@/lib/grist";
import { NextResponse } from "next/server";
import type { DiscordUserData } from "@/types/admin/missionReview";

async function fetchDiscordUserData(discordId: string): Promise<DiscordUserData | null> {
  try {
    const response = await fetch(`${process.env.PUBLIC_URL}/api/discord/${discordId}`, {
      next: { revalidate: 3600 }
    });
    
    if (!response.ok) {
      console.warn(`Failed to fetch Discord data for user ${discordId}`);
      return null;
    }
    
    const data = await response.json();
    return {
      username: data.username,
      avatarUrl: data.avatarUrl
    };
  } catch (error) {
    console.error(`Error fetching Discord data for user ${discordId}:`, error);
    return null;
  }
}

export async function GET() {
  try {
    const userMissions = await grist.fetchTable("User_missions");

    if (!userMissions || userMissions.length === 0) {
      return NextResponse.json([], { status: 200 });
    }

    // Fetch Discord user data for all unique user IDs
    const uniqueUserIds = [...new Set(userMissions.map(mission => mission.user_id))].filter(Boolean) as string[];
    const discordDataPromises = uniqueUserIds.map(async (userId) => {
      const discordData = await fetchDiscordUserData(userId);
      return { userId, discordData };
    });
    
    const discordResults = await Promise.all(discordDataPromises);
    const discordDataMap = new Map(
      discordResults.map(({ userId, discordData }) => [userId, discordData])
    );

    // Transform the data to match the expected format
    const transformedMissions = userMissions.map((mission) => ({
      _id: mission.id,
      mission_id: mission.mission_id,
      mission_name: mission.mission_name,
      user_id: mission.user_id,
      status: mission.status,
      accepted_at: mission.accepted_at,
      submitted_at: mission.submitted_at,
      completed_at: mission.completed_at,
      rejected_at: mission.rejected_at || null,
      submission_link: mission.submission_link || "",
      notes: mission.notes || "",
      discord_user: mission.user_id ? discordDataMap.get(mission.user_id as string) || null : null,
    }));

    return NextResponse.json(transformedMissions, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch user missions:", error);
    return NextResponse.json(
      { error: "Failed to fetch user missions" },
      { status: 500 }
    );
  }
}
