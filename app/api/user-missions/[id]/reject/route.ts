import { NextRequest, NextResponse } from "next/server";
import { getMissionById, ensureString, ensureNumber } from "@/lib/missions/missionUtils";
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

    // Parse request body for rejection reason
    const body = await req.json().catch(() => ({}));
    const rejectionReason = body.rejectionReason || "No reason provided";

    // Get the mission record using id2 field
    const userMissions = await grist.fetchTable("User_missions");
    const userMission = userMissions.find(um => ensureNumber(um.id2) === missionId);

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
          error: `Cannot reject mission with status "${currentStatus}". Only missions with status "submitted" can be rejected.`,
          currentStatus: currentStatus,
          allowedStatus: 'submitted'
        },
        { status: 400 }
      );
    }

    const userId = ensureString(userMission.user_id);
    const actualMissionId = ensureNumber(userMission.mission_id);

    // Update mission status to rejected with rejection reason using the actual record id
    await grist.updateRecords("User_missions", [{
      id: userMission.id, // Use the actual Grist record id
      status: 'rejected',
      completed_at: new Date().toISOString(),
      notes: rejectionReason
    }]);

    // Get mission details for response
    const mission = await getMissionById(actualMissionId);

    // Fetch updated mission data using the actual record id
    const updatedMissionResponse = await fetch(`${process.env.PUBLIC_URL || 'http://localhost:3000'}/api/user-missions/${userMission.id}`);
    const updatedMission = await updatedMissionResponse.json();

    return NextResponse.json({
      success: true,
      message: "Mission rejected successfully",
      data: {
        userId,
        missionId: actualMissionId,
        mission: mission,
        rejectionReason: rejectionReason,
        rejectionTime: new Date().toISOString()
      },
      mission: updatedMission
    });

  } catch (error) {
    console.error("Failed to reject mission:", error);
    return NextResponse.json(
      { error: "Failed to reject mission" },
      { status: 500 }
    );
  }
}
