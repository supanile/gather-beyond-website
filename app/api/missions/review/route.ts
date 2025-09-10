import { NextRequest, NextResponse } from "next/server";
import { completeMission, getMissionById, ensureString, ensureNumber } from "@/lib/missions/missionUtils";
import { grist } from "@/lib/grist";

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
      const result = await completeMission(userId, missionIdNum);

      if (!result.success) {
        return NextResponse.json(
          { error: `Unable to approve: ${result.message}` },
          { status: 400 }
        );
      }

      // Get mission details for response
      const mission = await getMissionById(missionIdNum);

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
        return NextResponse.json(
          { error: "Mission must be submitted to be rejected" },
          { status: 400 }
        );
      }

      await grist.updateRecords("User_missions", [{
        id: ensureNumber(userMission.id),
        status: 'rejected'
      }]);

      // Get mission details for response
      const mission = await getMissionById(missionIdNum);

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
