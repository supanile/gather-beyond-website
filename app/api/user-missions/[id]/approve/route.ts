import { NextRequest, NextResponse } from "next/server";
import { completeMission, getMissionById, ensureString, ensureNumber } from "@/lib/missions/missionUtils";
import { grist } from "@/lib/grist";

export async function POST(
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

    // Get the mission record to find user_id
    const userMissions = await grist.fetchTable("User_missions");
    const userMission = userMissions.find(um => ensureNumber(um.id) === missionId);

    if (!userMission) {
      return NextResponse.json(
        { error: "Mission not found" },
        { status: 404 }
      );
    }

    if (ensureString(userMission.status) !== 'submitted') {
      const currentStatus = ensureString(userMission.status);
      return NextResponse.json(
        { 
          error: `Cannot approve mission with status "${currentStatus}". Only missions with status "submitted" can be approved.`,
          currentStatus: currentStatus,
          allowedStatus: 'submitted'
        },
        { status: 400 }
      );
    }

    const userId = ensureString(userMission.user_id);
    const actualMissionId = ensureNumber(userMission.mission_id);

    // Approve mission and give rewards using the existing logic
    const result = await completeMission(userId, actualMissionId);

    if (!result.success) {
      return NextResponse.json(
        { error: `Unable to approve: ${result.message}` },
        { status: 400 }
      );
    }

    // Get mission details for response
    const mission = await getMissionById(actualMissionId);

    // Fetch updated mission data
    const updatedMissionResponse = await fetch(`${process.env.PUBLIC_URL || 'http://localhost:3000'}/api/user-missions/${missionId}`);
    const updatedMission = await updatedMissionResponse.json();

    return NextResponse.json({
      success: true,
      message: "Mission approved successfully!",
      data: {
        userId,
        missionId: actualMissionId,
        mission: mission,
        rewards: result.rewards,
        approvalTime: new Date().toISOString()
      },
      mission: updatedMission
    });

  } catch (error) {
    console.error("Failed to approve mission:", error);
    return NextResponse.json(
      { error: "Failed to approve mission" },
      { status: 500 }
    );
  }
}
