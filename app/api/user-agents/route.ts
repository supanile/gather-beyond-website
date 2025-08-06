import { grist } from "@/lib/grist";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const userAgents = await grist.fetchTable("User_agents");

    if (!userAgents || userAgents.length === 0) {
      return NextResponse.json([], { status: 200 });
    }

    return NextResponse.json(userAgents, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch user agents:", error);
    return NextResponse.json({ error: "Failed to fetch user agents" }, { status: 500 });
  }
}