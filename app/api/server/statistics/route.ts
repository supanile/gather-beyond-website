import { NextResponse } from 'next/server';
import { grist } from '@/lib/grist';
import { ServerStats, DiscordServer } from '@/types/admin/serverTypes';

interface GristUser {
  id: number;
  discord_id: string;
  credit: number;
  server_id: string;
  missions_completed: number;
}

interface GristUserAgent {
  id: number;
  user_id: string;
  xp: number;
  total_xp: number;
}

export async function GET() {
  try {
    // Fetch Discord server information directly
    console.log('Fetching Discord servers directly...');
    const discordServerMap = new Map<string, { name: string; icon: string | null; memberCount: number }>();
    
    try {
      const guildsResponse = await fetch('https://discord.com/api/v10/users/@me/guilds', {
        headers: {
          'Authorization': `Bot ${process.env.DISCORD_BOT_TOKEN}`,
          'Content-Type': 'application/json',
        },
      });

      if (guildsResponse.ok) {
        const guilds = await guildsResponse.json();
        
        // Fetch detailed info for each guild
        const guildDetailsPromises = guilds.map(async (guild: { id: string; name: string; icon: string | null }) => {
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

            if (guildDetailResponse.ok) {
              const guildDetail = await guildDetailResponse.json();
              return {
                serverId: guild.id,
                name: guildDetail.name,
                icon: guildDetail.icon,
                memberCount: guildDetail.approximate_member_count || 0,
              };
            }
          } catch (error) {
            console.error(`Error fetching guild ${guild.id} details:`, error);
          }
          
          return {
            serverId: guild.id,
            name: guild.name,
            icon: guild.icon,
            memberCount: 0,
          };
        });

        const guildDetails = await Promise.all(guildDetailsPromises);
        
        guildDetails.forEach((guild) => {
          if (guild) {
            discordServerMap.set(guild.serverId, {
              name: guild.name,
              icon: guild.icon,
              memberCount: guild.memberCount,
            });
          }
        });
        
        console.log('Discord servers fetched successfully:', discordServerMap.size);
      } else {
        console.error('Discord API response not ok:', guildsResponse.status, guildsResponse.statusText);
      }
    } catch (discordError) {
      console.error('Error fetching Discord servers:', discordError);
      // Continue without Discord data
    }

    // Fetch users and user_agents from Grist
    console.log('Fetching data from Grist...');
    const usersResponse = await grist.fetchTable('Users');
    const userAgentsResponse = await grist.fetchTable('User_agents');
    console.log('Grist data fetched successfully:', { users: usersResponse.length, userAgents: userAgentsResponse.length });
    
    const users = usersResponse.map((record) => ({
      id: record.id,
      discord_id: record.discord_id,
      credit: record.credit,
      server_id: record.server_id,
      missions_completed: record.missions_completed
    })) as GristUser[];
    
    const userAgents = userAgentsResponse.map((record) => ({
      id: record.id,
      user_id: record.user_id,
      xp: record.xp,
      total_xp: record.total_xp
    })) as GristUserAgent[];

    // Create a map of user XP for quick lookup
    const userXpMap = new Map<string, number>();
    userAgents.forEach((agent: GristUserAgent) => {
      userXpMap.set(agent.user_id, agent.total_xp || 0);
    });

    // Group users by server_id
    const serverMap = new Map<string, {
      users: GristUser[];
      totalCredits: number;
      totalXp: number;
      missionsCompleted: number;
    }>();

    users.forEach((user: GristUser) => {
      const serverId = user.server_id || 'unknown';
      
      if (!serverMap.has(serverId)) {
        serverMap.set(serverId, {
          users: [],
          totalCredits: 0,
          totalXp: 0,
          missionsCompleted: 0
        });
      }

      const serverData = serverMap.get(serverId)!;
      serverData.users.push(user);
      serverData.totalCredits += user.credit || 0;
      serverData.totalXp += userXpMap.get(user.discord_id) || 0;
      serverData.missionsCompleted += user.missions_completed || 0;
    });

    // Transform to DiscordServer format for finding most active
    const servers: DiscordServer[] = Array.from(serverMap.entries()).map(([serverId, data]) => {
      const discordInfo = discordServerMap.get(serverId);
      
      return {
        id: serverId,
        name: discordInfo?.name || `Server ${serverId}`,
        image_url: discordInfo?.icon || undefined,
        member_count: discordInfo?.memberCount || data.users.length,
        sc_user_count: data.users.length,
        total_credits: data.totalCredits,
        total_xp: data.totalXp,
        missions_completed: data.missionsCompleted,
        created_at: new Date().toISOString(),
        joined_at: new Date().toISOString(),
        is_active: true,
        categories: []
      };
    });

    // Calculate statistics
    const totalServers = servers.length;
    const totalMembers = servers.reduce((sum, s) => sum + s.member_count, 0);
    const totalSCUsers = servers.reduce((sum, s) => sum + s.sc_user_count, 0);
    const totalCredits = servers.reduce((sum, s) => sum + s.total_credits, 0);
    const totalXP = servers.reduce((sum, s) => sum + s.total_xp, 0);
    const totalMissionsCompleted = servers.reduce((sum, s) => sum + s.missions_completed, 0);
    const averageMembersPerServer = totalServers > 0 ? totalMembers / totalServers : 0;
    
    // Find most active server (by sc_user_count)
    const mostActiveServer = servers.length > 0
      ? servers.reduce((prev, current) => 
          (prev.sc_user_count > current.sc_user_count) ? prev : current
        )
      : null;

    const statistics: ServerStats = {
      totalServers,
      totalMembers,
      totalSCUsers,
      totalCredits,
      totalXP,
      totalMissionsCompleted,
      averageMembersPerServer: Math.round(averageMembersPerServer * 100) / 100,
      mostActiveServer
    };

    return NextResponse.json(statistics);
  } catch (error) {
    console.error('Error fetching server statistics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch server statistics' },
      { status: 500 }
    );
  }
}
