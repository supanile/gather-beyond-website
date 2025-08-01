import { grist } from "@/lib/grist";
import { NextResponse } from "next/server";

interface Params {
  params: Promise<{
    userId: string;
  }>;
}

export async function GET(request: Request, { params }: Params) {
  const { userId } = await params;
  
  try {
    const userMissions = await grist.fetchTable("User_missions", { user_id: [userId] });

    if (!userMissions || userMissions.length === 0) {
      return NextResponse.json([], { status: 200 });
    }
    
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
      submission_link: mission.submission_link || "",
      notes: mission.notes || ""
    }));
    
    return NextResponse.json(transformedMissions, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch user missions:", error);
    return NextResponse.json({ error: "Failed to fetch user missions" }, { status: 500 });
  }
}
