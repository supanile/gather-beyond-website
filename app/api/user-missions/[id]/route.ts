import { grist } from "@/lib/grist";
import { NextRequest, NextResponse } from "next/server";
import type { DiscordUserData } from "@/types/admin/missionReview";

interface GristMissionRecord {
  id: number;
  mission_id?: number;
  mission_name?: string;
  user_id?: string;
  status?: string;
  accepted_at?: number;
  submitted_at?: number;
  completed_at?: number;
  rejected_at?: number;
  submission_link?: string;
  notes?: string;
  verified_by?: string;
  discord_username?: string;
  discord_avatar_url?: string;
}

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

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const missionId = parseInt(id);
    
    if (isNaN(missionId)) {
      return NextResponse.json(
        { error: "Invalid mission ID" },
        { status: 400 }
      );
    }

    // Fetch the mission from Grist
    const missions = await grist.fetchTable("User_missions") as unknown as GristMissionRecord[];

    const mission = missions.find((m) => m.id === missionId);

    if (!mission) {
      return NextResponse.json(
        { error: "Mission not found" },
        { status: 404 }
      );
    }

    // Fetch Discord user data dynamically
    const discordData = mission.user_id ? await fetchDiscordUserData(mission.user_id) : null;

    // Transform the mission data to match the UserMission interface
    const transformedMission = {
      _id: mission.id,
      mission_id: mission.mission_id || 1,
      mission_name: mission.mission_name || "Unknown Mission",
      user_id: mission.user_id || "unknown",
      status: mission.status || "submitted",
      accepted_at: mission.accepted_at || null,
      submitted_at: mission.submitted_at || null,
      completed_at: mission.completed_at || null,
      rejected_at: mission.rejected_at || null,
      submission_link: mission.submission_link || "",
      notes: mission.notes || "",
      verified_by: mission.verified_by || null,
      discord_user: discordData
    };

    return NextResponse.json(transformedMission);
  } catch (error) {
    console.error("Failed to fetch mission:", error);
    return NextResponse.json(
      { error: "Failed to fetch mission" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const missionId = parseInt(id);
    
    if (isNaN(missionId)) {
      return NextResponse.json(
        { error: "Invalid mission ID" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const { status, completed_at } = body;

    // Validate status
    if (!["submitted", "completed", "rejected"].includes(status)) {
      return NextResponse.json(
        { error: "Invalid status" },
        { status: 400 }
      );
    }

    // Prepare update data
    const updateData: Record<string, string | number> = { status };
    if (completed_at) {
      updateData.completed_at = completed_at;
    }

    // Update the mission in Grist using the correct format
    await grist.updateRecords("User_missions", [
      { id: missionId, ...updateData }
    ]);

    return NextResponse.json(
      { message: "Mission updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to update mission:", error);
    return NextResponse.json(
      { error: "Failed to update mission" },
      { status: 500 }
    );
  }
}
