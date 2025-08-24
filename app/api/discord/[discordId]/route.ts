import { grist } from "@/lib/grist";
import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ discordId: string }> }) {
  const { discordId } = await params;

  if (!discordId) {
    return new Response("Discord ID is required", { status: 400 });
  }

  try {
    const response = await fetch(`https://discord.com/api/v10/users/${discordId}`, {
      headers: {
        Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
      },
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error(`Error fetching Discord user: ${response.statusText}`);
    }

    const member = await response.json();
    
    // Handle avatar URL with proper null checks
    let avatarUrl: string;
    if (member.avatar) {
      // User has a custom avatar
      const extension = member.avatar.startsWith("a_") ? "gif" : "png";
      avatarUrl = `https://cdn.discordapp.com/avatars/${member.id}/${member.avatar}.${extension}`;
    } else {
      // User doesn't have a custom avatar, use default
      // For users without discriminator (new username system), use user ID
      const discriminatorValue = member.discriminator && member.discriminator !== "0" 
        ? parseInt(member.discriminator) 
        : parseInt(member.id.slice(-1));
      avatarUrl = `https://cdn.discordapp.com/embed/avatars/${discriminatorValue % 5}.png`;
    }

    return NextResponse.json({
      username: member.username,
      avatarUrl: avatarUrl,
    });

  } catch (error) {
    console.error("Discord API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch Discord data", details: error instanceof Error ? error.message : "Unknown error" }, 
      { status: 500 }
    );
  }
}