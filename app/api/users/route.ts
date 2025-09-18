import { grist } from "@/lib/grist";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const users = await grist.fetchTable("Users");
    
    if (!users || users.length === 0) {
      return NextResponse.json({ error: "No users found" }, { status: 404 });
    }

    const discordNames = await grist.fetchTable("Discord_name");
    const usersWithUsernames = users.map(user => {
      const discordUser = discordNames.find(discord => discord.discord_id === user.discord_id);
      return {
        ...user,
        username: discordUser?.username || null
      };
    });

    return NextResponse.json(usersWithUsernames, { status: 200 });
    
  } catch (error) {
    console.error("Failed to fetch users:", error);
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  } 
}