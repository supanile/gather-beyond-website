import { grist } from "@/lib/grist";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: Promise<{ missionId: string }> }) {
  const { missionId } = await params;

  try {
    const missions = await grist.fetchTable("Missions", { id: [parseInt(missionId)] });

    if (!missions || missions.length === 0) {
      return NextResponse.json({ error: "No missions found" }, { status: 404 });
    }

    const mission = missions[0];
    const rewardData = JSON.parse(mission.reward?.toString() || '{}');

    const response = {
      ...mission,
      reward: {
        xp: rewardData.amount,
        credits: rewardData.amount,
        health: 10
      }
    };

    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch mission" }, { status: 500 });
  }
}