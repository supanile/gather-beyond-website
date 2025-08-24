import { grist } from "@/lib/grist";
import { NextApiRequest } from "next";
import { NextResponse } from "next/server";

export async function GET(req: NextApiRequest, { params }: { params: { discordId: string } }) {
  const { discordId } = await params;

  if (!discordId) {
    return new Response("Discord ID is required", { status: 400 });
  }
  const foundUser = await grist.fetchTable("Users", { discord_id: [discordId] });
  if (!foundUser || foundUser.length === 0) {
    return new Response("User not found", { status: 404 });
  }

  try {
    const response = await fetch(`https://discord.com/api/v10/guilds/${process.env.DISCORD_GUILD_ID}/members/${foundUser[0]?.discord_id}`, {
      headers: {
        Authorization: `Bot ${process.env.DISCORD_BOT_TOKEN}`,
      },
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      throw new Error(`Error fetching Discord user: ${response.statusText}`);
    }

    const member = await response.json();
    const avatarUrl = member.avatar
      ? `https://cdn.discordapp.com/guilds/${process.env.DISCORD_GUILD_ID}/users/${member.user.id}/avatars/${member.avatar}.${member.avatar.startsWith("a_") ? "gif" : "png"}`
      : member.user.avatar
        ? `https://cdn.discordapp.com/avatars/${member.user.id}/${member.user.avatar}.${member.user.avatar.startsWith("a_") ? "gif" : "png"}`
        : `https://cdn.discordapp.com/embed/avatars/${parseInt(member.user.discriminator) % 5}.png`;

    return NextResponse.json({
      username: member.user.username,
      avatarUrl,
    });

  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch Discord member data" }, { status: 500 });
  }
}