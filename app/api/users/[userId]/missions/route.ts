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
      return NextResponse.json({ error: "No missions found for this user" }, { status: 404 });
    }
    
    return NextResponse.json(userMissions, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch user missions:", error);
    return NextResponse.json({ error: "Failed to fetch user missions" }, { status: 500 });
  }
}
