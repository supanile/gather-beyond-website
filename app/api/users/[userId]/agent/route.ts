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
    const userAgent = await grist.fetchTable("User_agents", { user_id: [userId] });
    
    if (!userAgent || userAgent.length === 0) {
      return NextResponse.json({ error: "User agent not found" }, { status: 404 });
    }
    
    return NextResponse.json(userAgent[0], { status: 200 });
  } catch (error) {
    console.error("Failed to fetch user agent:", error);
    return NextResponse.json({ error: "Failed to fetch user agent" }, { status: 500 });
  }
}
