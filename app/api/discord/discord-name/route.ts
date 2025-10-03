import { grist } from "@/lib/grist";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const discordNames = await grist.fetchTable("Discord_name");

    if (!discordNames || discordNames.length === 0) {
      return NextResponse.json([], { status: 200 });
    }

    // Transform the data to match the expected format
    const transformedData = discordNames.map((item) => ({
      discord_id: item.discord_id,
      username: item.username,
      avatarUrl: item.avatarUrl
    }));

    return NextResponse.json(transformedData, { status: 200 });
  } catch (error) {
    console.error("Failed to fetch Discord names:", error);
    return NextResponse.json(
      { error: "Failed to fetch Discord names" },
      { status: 500 }
    );
  }
}

// GET specific discord user by discord_id
export async function POST(request: Request) {
  try {
    const { discord_id } = await request.json();

    if (!discord_id) {
      return NextResponse.json(
        { error: "discord_id is required" },
        { status: 400 }
      );
    }

    const discordNames = await grist.fetchTable("Discord_name");
    
    if (!discordNames || discordNames.length === 0) {
      return NextResponse.json(
        { error: "No Discord names found" },
        { status: 404 }
      );
    }

    // Find the specific discord user
    const discordUser = discordNames.find(item => item.discord_id === discord_id);

    if (!discordUser) {
      return NextResponse.json(
        { error: "Discord user not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      discord_id: discordUser.discord_id,
      username: discordUser.username,
      avatarUrl: discordUser.avatarUrl
    }, { status: 200 });

  } catch (error) {
    console.error("Failed to fetch Discord user:", error);
    return NextResponse.json(
      { error: "Failed to fetch Discord user" },
      { status: 500 }
    );
  }
}
