import { grist } from "@/lib/grist";
import { NextRequest, NextResponse } from "next/server";

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
