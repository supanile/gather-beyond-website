import { NextRequest, NextResponse } from "next/server";
import { completeMission, getMissionById, ensureString, ensureNumber } from "@/lib/missions/missionUtils";
import { grist } from "@/lib/grist";
import { sendMissionApprovalDM, sendMissionRejectionDM } from "@/lib/discord/missionReviewHandlers";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, userId, missionId, approvedBy } = body;

    // Validate required fields
    if (!action || !userId || !missionId) {
      return NextResponse.json(
        { error: "Missing required fields: action, userId, missionId" },
        { status: 400 }
      );
    }

    if (!["approve", "reject"].includes(action)) {
      return NextResponse.json(
        { error: "Invalid action. Must be 'approve' or 'reject'" },
        { status: 400 }
      );
    }

    const missionIdNum = parseInt(missionId);
    if (isNaN(missionIdNum)) {
      return NextResponse.json(
        { error: "Invalid mission ID" },
        { status: 400 }
      );
    }

    if (action === "approve") {
      // Approve mission and give rewards
      const result = await completeMission(userId, missionIdNum, approvedBy);

      if (!result.success) {
        return NextResponse.json(
          { error: `Unable to approve: ${result.message}` },
          { status: 400 }
        );
      }

      // Get mission details for response
      const mission = await getMissionById(missionIdNum);

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
          missionId: missionIdNum,
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
        }
      } catch (dmError) {
        console.error('Error sending Discord approval DM:', dmError);
      }

      return NextResponse.json({
        success: true,
        message: "Mission approved successfully!",
        data: {
          userId,
          missionId: missionIdNum,
          mission: mission,
          rewards: result.rewards,
          approvedBy,
          approvalTime: new Date().toISOString()
        }
      });

    } else if (action === "reject") {
      // Update mission status to rejected
      const userMissions = await grist.fetchTable("User_missions");
      const userMission = userMissions.find(um => 
        ensureString(um.user_id) === userId && ensureNumber(um.mission_id) === missionIdNum
      );

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

      // Update mission with rejection info and verification data
      const updateData: {
        id: number;
        status: string;
        completed_at?: string;
        verified_by?: string;
      } = {
        id: ensureNumber(userMission.id),
        status: 'rejected'
      };

      // Add rejection timestamp and verification info to completed_at field
      updateData.completed_at = new Date().toISOString();
      if (approvedBy) {
        updateData.verified_by = approvedBy;
      }

      await grist.updateRecords("User_missions", [updateData]);

      // Get mission details for response
      const mission = await getMissionById(missionIdNum);

      // Send Discord DM notification to user for rejection
      try {
        const dmResult = await sendMissionRejectionDM(userId, mission?.title || 'Unknown Mission');

        if (!dmResult.success) {
          console.warn('Failed to send Discord rejection DM:', dmResult.error);
        }
      } catch (dmError) {
        console.error('Error sending Discord rejection DM:', dmError);
      }

      return NextResponse.json({
        success: true,
        message: "Mission rejected successfully",
        data: {
          userId,
          missionId: missionIdNum,
          mission: mission,
          rejectedBy: approvedBy,
          rejectionTime: new Date().toISOString()
        }
      });
    }

  } catch (error) {
    console.error("Error in mission review:", error);
    return NextResponse.json(
      { error: "An error occurred while processing the mission review" },
      { status: 500 }
    );
  }
}

