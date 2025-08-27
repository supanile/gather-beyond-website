import { grist } from "@/lib/grist";
import { NextRequest, NextResponse } from "next/server";

interface ServerInfo {
  name: string;
  serverId: string;
  icon: string | null;
  memberCount: number;
}

interface UserServerResponse {
  discordId: string;
  server: Array<{
    serverId: string;
    serverName: string;
  }>;
}

interface Params {
  params: Promise<{
    discordId: string;
  }>;
}

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const { discordId } = await params;

    if (!discordId) {
      return NextResponse.json(
        { error: "Discord ID parameter is required" }, 
        { status: 400 }
      );
    }

    // ดึงข้อมูล users จาก Grist
    const users = await grist.fetchTable("Users");
    
    if (!users || users.length === 0) {
      return NextResponse.json({ error: "No users found in database" }, { status: 404 });
    }

    // หา user ที่ต้องการ
    const targetUser = users.find((user: any) => String(user.discord_id) === discordId);

    if (!targetUser) {
      return NextResponse.json(
        { error: "User not found in database" }, 
        { status: 404 }
      );
    }

    // ดึงข้อมูล Discord servers จาก /api/discord/getserver
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `${request.nextUrl.protocol}//${request.nextUrl.host}`;
    let botServers: ServerInfo[] = [];
    
    try {
      const serverResponse = await fetch(`${baseUrl}/api/discord/getserver`);

      // getserver now returns 200 even on error, check success field instead
      const serverData = await serverResponse.json();
      
      if (!serverResponse.ok || !serverData.success || !serverData.guilds) {
        console.error(`Failed to fetch servers: ${serverResponse.status}`, serverData.error);
        // Return empty servers list instead of throwing error
        return NextResponse.json({
          discordId: String(targetUser.discord_id || ''),
          server: [],
        });
      }

      botServers = serverData.guilds;
    } catch (error) {
      console.error('Error fetching Discord servers:', error);
      // Return empty servers list instead of throwing error
      return NextResponse.json({
        discordId: String(targetUser.discord_id || ''),
        server: [],
      });
    }

    // เช็คว่า user อยู่ในแต่ละ server หรือไม่ และเก็บเฉพาะ server ที่ user อยู่
    const userServers = [];
    
    // If no bot servers available, return empty result
    if (botServers.length === 0) {
      return NextResponse.json({
        discordId: String(targetUser.discord_id || ''),
        server: [],
      });
    }
    
    for (const server of botServers) {
      try {
        // เช็คว่า user อยู่ใน server นี้หรือไม่
        const memberResponse = await fetch(
          `https://discord.com/api/v10/guilds/${server.serverId}/members/${String(targetUser.discord_id)}`,
          {
            headers: {
              'Authorization': `Bot ${process.env.DISCORD_BOT_TOKEN}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (memberResponse.ok) {
          // ถ้า user อยู่ใน server นี้ ให้เพิ่มเข้าไปใน array
          userServers.push({
            serverId: server.serverId,
            serverName: server.name,
          });
        }

      } catch (error) {
        // ถ้า error ให้ข้ามไป
        console.log(`Error checking user in guild ${server.serverId}:`, error);
        continue;
      }
    }

    const result: UserServerResponse = {
      discordId: String(targetUser.discord_id || ''),
      server: userServers,
    };

    return NextResponse.json(result);

  } catch (error) {
    console.error('Error checking user servers:', error);
    return NextResponse.json(
      { 
        error: "Failed to check user servers",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}
