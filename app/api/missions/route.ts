import { grist } from "@/lib/grist";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const missions = await grist.fetchTable("Missions");
    
    if (!missions || missions.length === 0) {
      return NextResponse.json({ error: "No missions found" }, { status: 404 });
    }
    
    return NextResponse.json(missions, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch missions:", error);
    return NextResponse.json({ error: "Failed to fetch missions" }, { status: 500 });
  }
}
