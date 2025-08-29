import { NextResponse } from "next/server";

interface DiscordGuild {
  id: string;
  name: string;
  icon: string | null;
  owner: boolean;
  permissions: string;
  permissions_new: string;
  features: string[];
  approximate_member_count?: number;
  approximate_presence_count?: number;
}

interface ServerInfo {
  name: string;
  serverId: string;
  icon: string | null;
  memberCount: number;
}

export async function GET() {
  try {
    const guildsResponse = await fetch('https://discord.com/api/v10/users/@me/guilds', {
      headers: {
        'Authorization': `Bot ${process.env.DISCORD_BOT_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    if (!guildsResponse.ok) {
      console.error(`Discord API error: ${guildsResponse.status}`);
      
      // Return empty result for rate limit or other API errors instead of throwing
      return NextResponse.json({
        success: false,
        guilds: [],
        totalGuilds: 0,
        error: `Discord API error: ${guildsResponse.status}`,
      });
    }

    const guilds: DiscordGuild[] = await guildsResponse.json();

    const guildDetailsPromises = guilds.map(async (guild): Promise<ServerInfo> => {
      try {
        const guildDetailResponse = await fetch(
          `https://discord.com/api/v10/guilds/${guild.id}?with_counts=true`,
          {
            headers: {
              'Authorization': `Bot ${process.env.DISCORD_BOT_TOKEN}`,
              'Content-Type': 'application/json',
            },
          }
        );

        let memberCount = 0;
        if (guildDetailResponse.ok) {
          const guildDetail = await guildDetailResponse.json();
          memberCount = guildDetail.approximate_member_count || 0;
        }

        let iconUrl: string | null = null;
        if (guild.icon) {
          const extension = guild.icon.startsWith('a_') ? 'gif' : 'png';
          iconUrl = `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.${extension}`;
        }

        return {
          name: guild.name,
          serverId: guild.id,
          icon: iconUrl,
          memberCount: memberCount,
        };

      } catch (error) {
        console.error(`Error fetching details for guild ${guild.id}:`, error);
        
        let iconUrl: string | null = null;
        if (guild.icon) {
          const extension = guild.icon.startsWith('a_') ? 'gif' : 'png';
          iconUrl = `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.${extension}`;
        }

        return {
          name: guild.name,
          serverId: guild.id,
          icon: iconUrl,
          memberCount: 0,
        };
      }
    });

    const guildDetails = await Promise.all(guildDetailsPromises);

    return NextResponse.json({
      success: true,
      guilds: guildDetails,
      totalGuilds: guildDetails.length,
    });

  } catch (error) {
    console.error('Error fetching Discord guilds:', error);
    
    // Return empty result instead of error status for better error handling
    return NextResponse.json({
      success: false,
      guilds: [],
      totalGuilds: 0,
      error: "Failed to fetch Discord servers",
      details: error instanceof Error ? error.message : "Unknown error"
    });
  }
}