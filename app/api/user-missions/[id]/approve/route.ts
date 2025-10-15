import { NextRequest, NextResponse } from "next/server";
import { completeMission, getMissionById, ensureString, ensureNumber } from "@/lib/missions/missionUtils";
import { grist } from "@/lib/grist";
import { sendMissionApprovalDM } from "@/lib/discord/missionReviewHandlers";

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

    // Parse request body for approvedBy (optional)
    const body = await req.json().catch(() => ({}));
    const approvedBy = body.approvedBy || "system";

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

    // Update verified_by field after successful completion
    try {
      await grist.updateRecords("User_missions", [{
        id: userMission.id, // Use the actual Grist record id
        verified_by: approvedBy,
        completed_at: new Date().toISOString()
      }]);
      console.log(`✅ Updated verified_by field to "${approvedBy}" for mission ${missionId}`);
    } catch (updateError) {
      console.error('Error updating verified_by field:', updateError);
      // Don't fail the main operation if this update fails
    }

    // Get mission details for response
    const mission = await getMissionById(actualMissionId);

    // Send Discord DM notification to user for approval
    try {
      // Prepare xpResult data
      const xpResultData = result.xpResult && result.xpResult.success && result.xpResult.leveledUp ? {
        leveledUp: result.xpResult.leveledUp,
        newLevel: result.xpResult.newLevel,
        oldLevel: result.xpResult.oldLevel
      } : undefined;

      // Prepare healthResult data
      const healthResultData = result.healthResult && result.healthResult.success && result.healthResult.newMood ? {
        newMood: result.healthResult.newMood,
        newHealth: result.healthResult.newHealth
      } : undefined;

      const dmResult = await sendMissionApprovalDM({
        userId,
        missionId: actualMissionId,
        mission: {
          title: mission?.title || 'Unknown Mission',
          reward: {
            amount: mission?.reward?.amount || 0,
            token: mission?.reward?.token || 'TOKENS'
          }
        },
        rewards: {
          xp: result.rewards?.xp || 0,
          health: result.rewards?.health || 0,
          credits: result.rewards?.credits || 0,
          levelUp: result.rewards?.levelUp || false,
          newLevel: result.rewards?.newLevel || null
        },
        xpResult: xpResultData,
        healthResult: healthResultData
      });

      if (!dmResult.success) {
        console.warn('Failed to send Discord approval DM:', dmResult.error);
      } else {
        console.log('✅ Discord approval notification sent successfully');
      }
    } catch (dmError) {
      console.error('Error sending Discord approval DM:', dmError);
    }

    // Fetch updated mission data using the actual record id
    const updatedMissionResponse = await fetch(`${process.env.PUBLIC_URL || 'http://localhost:3000'}/api/user-missions/${userMission.id}`);
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
