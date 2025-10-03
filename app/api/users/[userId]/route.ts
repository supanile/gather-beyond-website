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
    // Fetch user data
    const users = await grist.fetchTable("Users", { discord_id: [userId] });
    
    if (!users || users.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const user = users[0];
    
    // Fetch username from Discord_name table
    const discordNames = await grist.fetchTable("Discord_name");
    const discordUser = discordNames.find(discord => discord.discord_id === user.discord_id);
    
    // Return user with credit field
    const userWithCredit = {
      ...user,
      username: discordUser?.username || null,
      credit: user.credit || user.total_points || 0
    };
    
    return NextResponse.json(userWithCredit, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch user:", error);
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
  }
}
