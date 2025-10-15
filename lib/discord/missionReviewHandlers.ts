// Mission Review Handlers for Discord Bot Integration
// These functions return data that can be used by Discord.js bot

import { grist } from "@/lib/grist";

interface MissionReviewData {
  userId: string;
  missionId: number;
  mission: {
    title: string;
    reward: {
      amount: number;
      token: string;
    };
  };
  rewards?: {
    xp: number;
    health: number;
    credits: number;
    levelUp: boolean;
    newLevel: number | null;
  };
  xpResult?: {
    leveledUp: boolean;
    newLevel: number;
    oldLevel: number;
  };
  healthResult?: {
    newMood: string;
    newHealth: number;
  };
}

interface DiscordEmbedField {
  name: string;
  value: string;
  inline?: boolean;
}

interface DiscordEmbed {
  color: number;
  title: string;
  description: string;
  fields: DiscordEmbedField[];
  timestamp: boolean;
}

interface DiscordButton {
  customId: string;
  label: string;
  style: 'PRIMARY' | 'SECONDARY' | 'SUCCESS' | 'DANGER' | 'LINK';
}

interface LeaderboardUser {
  discord_id: string;
  missions_completed: number;
  total_points: number;
  credits: number;
  level: number;
  total_xp: number;
  current_level_progress: number;
  xp_required: number;
}

interface UserAgent {
  user_id: string;
  level: number;
  total_xp: number;
  current_level_progress: number;
  xp_required: number;
  health: number;
  mood: string;
}

interface GristRecord {
  fields: {
    user_id: string;
    level: number;
    total_xp: number;
    current_level_progress: number;
    xp_required: number;
    health: number;
    mood: string;
  };
}

interface DiscordClient {
  channels: {
    cache: {
      get: (id: string) => DiscordChannel | undefined;
    };
  };
  user: {
    displayAvatarURL: () => string;
  };
}

interface DiscordChannel {
  messages: {
    fetch: (id: string) => Promise<DiscordMessage>;
  };
}

interface DiscordMessage {
  edit: (options: { embeds: DiscordLeaderboardEmbed[] }) => Promise<void>;
}

interface DiscordLeaderboardEmbed {
  color: number;
  title: string;
  description: string;
  thumbnail: {
    url: string;
  };
  timestamp: string;
  footer: {
    text: string;
    icon_url: string;
  };
  fields: Array<{
    name: string;
    value: string;
    inline: boolean;
  }>;
}

// API call to approve/reject mission
export async function handleMissionReviewAction(
  action: 'approve' | 'reject',
  userId: string,
  missionId: number,
  approvedBy: string,
  rejectionReason?: string
) {
  try {
    const apiUrl = action === 'approve' 
      ? `/api/user-missions/${missionId}/approve`
      : `/api/user-missions/${missionId}/reject`;

    console.log(`🚀 Discord handler - About to call ${action} API:`, {
      action,
      userId,
      missionId,
      approvedBy,
      apiUrl,
      rejectionReason
    });

    const body = action === 'approve' 
      ? {} 
      : { rejectionReason: rejectionReason || "No reason provided" };

    const response = await fetch(`${process.env.PUBLIC_URL || 'http://localhost:3000'}${apiUrl}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error(`Error in handleMissionReview${action === 'approve' ? 'Accept' : 'Reject'}:`, error);
    return { success: false, error: 'An error occurred while processing the mission review' };
  }
}

// Generate embed data for approved mission
export function createApprovedMissionEmbed(data: MissionReviewData, approvedBy: string): DiscordEmbed {
  return {
    color: 0x00ff00, // Green
    title: '✅ Mission Approved!',
    description: `Mission submission has been **APPROVED** by <@${approvedBy}>`,
    fields: [
      { name: '👤 Submitter', value: `<@${data.userId}>`, inline: true },
      { name: '📋 Mission', value: data.mission.title, inline: true },
      { name: '💰 Reward Received', value: `${data.mission.reward.amount} ${data.mission.reward.token}`, inline: true },
      { name: '✅ Status', value: 'Approved', inline: true },
      { name: '👨‍💼 Approved By', value: `<@${approvedBy}>`, inline: true },
      { name: '⏰ Approval Time', value: `<t:${Math.floor(Date.now() / 1000)}:R>`, inline: true }
    ],
    timestamp: true
  };
}

// Generate embed data for rejected mission
export function createRejectedMissionEmbed(data: { userId: string; mission: { title: string } }, rejectedBy: string): DiscordEmbed {
  return {
    color: 0xff0000, // Red
    title: '❌ Mission Rejected',
    description: `Mission submission has been **REJECTED** by <@${rejectedBy}>`,
    fields: [
      { name: '👤 Submitter', value: `<@${data.userId}>`, inline: true },
      { name: '📋 Mission', value: data.mission.title, inline: true },
      { name: '❌ Status', value: 'Rejected', inline: true },
      { name: '👨‍💼 Rejected By', value: `<@${rejectedBy}>`, inline: true },
      { name: '⏰ Rejection Time', value: `<t:${Math.floor(Date.now() / 1000)}:R>`, inline: true }
    ],
    timestamp: true
  };
}

// Generate reward notification embed data
export function createRewardNotificationEmbed(data: MissionReviewData): DiscordEmbed {
  const fields: DiscordEmbedField[] = [
    { name: '💰 Reward', value: `${data.mission.reward.amount} ${data.mission.reward.token}`, inline: true },
    { name: '✨ XP Gained', value: `+${data.rewards?.xp || 0} XP`, inline: true },
    { name: '❤️ Health', value: `+${data.rewards?.health || 0} Health`, inline: true },
    { name: '💳 Credits Gained', value: `+${data.rewards?.credits || 0} Credits`, inline: true }
  ];

  // Add level up information if applicable
  if (data.xpResult?.leveledUp) {
    fields.push({
      name: '🎊 Level Up!',
      value: `You reached Level ${data.xpResult.newLevel}!`,
      inline: false
    });
  }

  // Add mood change information if applicable
  if (data.healthResult?.newMood) {
    const moodEmojis = { happy: '😊', neutral: '😐', sad: '😢' };
    fields.push({
      name: '😊 Mood Change',
      value: `Your agent is now ${data.healthResult.newMood} ${moodEmojis[data.healthResult.newMood as keyof typeof moodEmojis]}`,
      inline: false
    });
  }

  return {
    color: 0x00ff00, // Green
    title: '🎉 Mission Completed!',
    description: `Congratulations! You've completed **${data.mission.title}**`,
    fields,
    timestamp: true
  };
}

// Generate rejection notification embed data
export function createRejectionNotificationEmbed(missionTitle: string, reason: string): DiscordEmbed {
  return {
    color: 0xff0000, // Red
    title: '❌ Mission Rejected',
    description: `Your submission for **${missionTitle}** has been rejected.`,
    fields: [
      { name: '📝 Reason', value: reason, inline: false },
      { name: '🔄 Next Steps', value: `Go to \`/my_missions\` to reset your mission so you can submit again.`, inline: false }
    ],
    timestamp: true
  };
}

// Generate mission review buttons data
export function createMissionReviewButtons(userId: string, missionId: number): DiscordButton[] {
  return [
    {
      customId: `approve_mission_${userId}_${missionId}`,
      label: '✅ Approve',
      style: 'SUCCESS'
    },
    {
      customId: `reject_mission_${userId}_${missionId}`,
      label: '❌ Reject',
      style: 'DANGER'
    }
  ];
}

// Send DM notification for mission approval directly via Discord API and update leaderboard
export async function sendMissionApprovalDM(data: MissionReviewData, client?: DiscordClient): Promise<{ success: boolean; error?: string }> {
  try {
    const discordBotToken = process.env.DISCORD_BOT_TOKEN;
    if (!discordBotToken) {
      console.warn('Discord bot token not configured');
      return { success: false, error: 'Discord bot token not configured' };
    }

    // Create the reward notification embed
    const embedData = createRewardNotificationEmbed(data);
    // Convert our embed format to Discord API format
    const discordEmbed = {
      color: embedData.color,
      title: embedData.title,
      description: embedData.description,
      fields: embedData.fields,
      timestamp: new Date().toISOString(),
      thumbnail: {
        url: 'https://media.discordapp.net/attachments/1390495682284228650/1427578130843045888/love.png?ex=68ef5f3d&is=68ee0dbd&hm=4ca3d800c339d6f439772b9ab9a58e25c060f308782d2a77d576512b74dee2e6&=&format=webp&quality=lossless&width=640&height=640'
      },
      footer: {
        text: 'Super Agent • Mission Completed!',
        icon_url: 'https://media.discordapp.net/attachments/1390495682284228650/1427578130843045888/love.png?ex=68ef5f3d&is=68ee0dbd&hm=4ca3d800c339d6f439772b9ab9a58e25c060f308782d2a77d576512b74dee2e6&=&format=webp&quality=lossless&width=640&height=640'
      }
    };

    // Send DM via Discord API
    const response = await fetch(`https://discord.com/api/v10/users/@me/channels`, {
      method: 'POST',
      headers: {
        'Authorization': `Bot ${discordBotToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        recipient_id: data.userId
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to create DM channel: ${response.status}`);
    }

    const dmChannel = await response.json();
    // Send the message to the DM channel
    const messageResponse = await fetch(`https://discord.com/api/v10/channels/${dmChannel.id}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bot ${discordBotToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        embeds: [discordEmbed]
      })
    });

    if (!messageResponse.ok) {
      const errorData = await messageResponse.json();
      throw new Error(`Failed to send DM: ${messageResponse.status} - ${JSON.stringify(errorData)}`);
    }

    // Update leaderboard after successful approval
    if (client) {
      try {
        await updateLeaderboardMessage(client);
        console.log('✅ Leaderboard updated after mission approval');
      } catch (leaderboardError) {
        console.error('Error updating leaderboard after mission approval:', leaderboardError);
        // Don't fail the main operation if leaderboard update fails
      }
    } else {
      // Fallback: trigger leaderboard update via webhook
      try {
        await triggerLeaderboardUpdate();
      } catch (leaderboardError) {
        console.error('Error triggering leaderboard update:', leaderboardError);
      }
    }

    return { success: true };
  } catch (error) {
    console.error('Error sending mission approval DM:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// Send DM notification for mission rejection directly via Discord API
export async function sendMissionRejectionDM(userId: string, missionTitle: string, reason: string): Promise<{ success: boolean; error?: string }> {
  try {
    const discordBotToken = process.env.DISCORD_BOT_TOKEN;
    if (!discordBotToken) {
      console.warn('Discord bot token not configured');
      return { success: false, error: 'Discord bot token not configured' };
    }

    // Create the rejection notification embed
    const embedData = createRejectionNotificationEmbed(missionTitle, reason);

    // Convert our embed format to Discord API format
    const discordEmbed = {
      color: embedData.color,
      title: embedData.title,
      description: embedData.description,
      fields: embedData.fields,
      timestamp: new Date().toISOString(),
      thumbnail: {
        url: 'https://media.discordapp.net/attachments/1390495682284228650/1427728067190853855/surprised.png?ex=68efeae1&is=68ee9961&hm=6b90f56030791689403d09156f1f395891d2c50bb46cf0ecbd11a27ef325826f&=&format=webp&quality=lossless&width=640&height=640'
      },
      footer: {
        text: 'Super Agent • Mission Rejected',
        icon_url: 'https://media.discordapp.net/attachments/1390495682284228650/1427728067190853855/surprised.png?ex=68efeae1&is=68ee9961&hm=6b90f56030791689403d09156f1f395891d2c50bb46cf0ecbd11a27ef325826f&=&format=webp&quality=lossless&width=640&height=640'
      }
    };

    // Send DM via Discord API
    const response = await fetch(`https://discord.com/api/v10/users/@me/channels`, {
      method: 'POST',
      headers: {
        'Authorization': `Bot ${discordBotToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        recipient_id: userId
      })
    });

    if (!response.ok) {
      throw new Error(`Failed to create DM channel: ${response.status}`);
    }

    const dmChannel = await response.json();
    // Send the message to the DM channel
    const messageResponse = await fetch(`https://discord.com/api/v10/channels/${dmChannel.id}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bot ${discordBotToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        embeds: [discordEmbed]
      })
    });

    if (!messageResponse.ok) {
      const errorData = await messageResponse.json();
      throw new Error(`Failed to send DM: ${messageResponse.status} - ${JSON.stringify(errorData)}`);
    }

    // Trigger leaderboard update (in case there were any data changes)
    try {
      await triggerLeaderboardUpdate();
      console.log('✅ Leaderboard update triggered after mission rejection');
    } catch (leaderboardError) {
      console.error('Error triggering leaderboard update after mission rejection:', leaderboardError);
      // Don't fail the main operation if leaderboard update fails
    }

    return { success: true };
  } catch (error) {
    console.error('Error sending mission rejection DM:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// Generate mission review embed data
export function createMissionReviewEmbed(
  userId: string,
  mission: { title: string; reward: { amount: number; token: string } },
  submissionData?: { description?: string; attachments?: string[] }
): DiscordEmbed {
  const fields: DiscordEmbedField[] = [
    { name: '👤 Submitter', value: `<@${userId}>`, inline: true },
    { name: '📋 Mission', value: mission.title, inline: true },
    { name: '💰 Potential Reward', value: `${mission.reward.amount} ${mission.reward.token}`, inline: true },
    { name: '⏰ Submitted', value: `<t:${Math.floor(Date.now() / 1000)}:R>`, inline: true },
    { name: '🔍 Status', value: 'Pending Review', inline: true }
  ];

  if (submissionData?.description) {
    fields.push({ name: '📝 Submission Details', value: submissionData.description, inline: false });
  }

  if (submissionData?.attachments?.length) {
    fields.push({ name: '📎 Attachments', value: submissionData.attachments.join('\n'), inline: false });
  }

  return {
    color: 0xffff00, // Yellow for pending
    title: '📋 Mission Review Required',
    description: `**${mission.title}** has been submitted for review`,
    fields,
    timestamp: true
  };
}

// Leaderboard Functions
export async function getLeaderboard(limit: number = 10): Promise<LeaderboardUser[]> {
  try {
    const response = await fetch(`http://103.245.164.53:8484/api/docs/jRo2uDUxFNwdN9hjY7xTF2/tables/User_agents/records?sort=-level%2C-total_xp&limit=${limit}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.GRIST_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();
    const userAgents: UserAgent[] = data.records ? data.records.map((record: GristRecord) => ({
      user_id: record.fields.user_id,
      level: record.fields.level,
      total_xp: record.fields.total_xp,
      current_level_progress: record.fields.current_level_progress,
      xp_required: record.fields.xp_required,
      health: record.fields.health,
      mood: record.fields.mood
    })) : [];

    // Fetch users data from Grist to get additional info
    const usersData = await grist.fetchTable("Users");

    // Create a map of users for quick lookup
    const usersMap: Record<string, {
      discord_id: string;
      missions_completed?: number;
      total_points?: number;
      credit?: number;
    }> = {};
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    usersData.forEach((user: any) => {
      usersMap[user.discord_id] = user;
    });

    // Combine the data and filter users with meaningful progress
    const leaderboard: LeaderboardUser[] = userAgents
      .filter((agent: UserAgent) => agent.total_xp > 0 || agent.level > 1)
      .map((agent: UserAgent) => {
        const user = usersMap[agent.user_id] || {};
        return {
          discord_id: agent.user_id,
          missions_completed: user.missions_completed || 0,
          total_points: user.total_points || 0,
          credits: user.credit || 0,
          level: agent.level || 1,
          total_xp: agent.total_xp || 0,
          current_level_progress: agent.current_level_progress || 0,
          xp_required: agent.xp_required || 100
        };
      })
      .slice(0, limit);

    return leaderboard;
  } catch (error) {
    console.error('Error getting leaderboard:', error);
    return [];
  }
}

export async function updateLeaderboardMessage(client: DiscordClient): Promise<void> {
  try {
    const LEADERBOARD_CHANNEL_ID = '1384557260159717386';
    const MESSAGE_ID = '1384602684828680335';

    const channel = client.channels.cache.get(LEADERBOARD_CHANNEL_ID);
    if (!channel) {
      console.error('Leaderboard channel not found');
      return;
    }

    const message = await channel.messages.fetch(MESSAGE_ID);
    if (!message) {
      console.error('Leaderboard message not found');
      return;
    }

    const leaderboardData = await getLeaderboard(10);

    // Use Discord.js EmbedBuilder (this would need to be imported in the Discord bot)
    const leaderboardEmbed: DiscordLeaderboardEmbed = {
      color: 0xffd700,
      title: '🏆 Level Leaderboard - Top 10',
      description: 'The most dedicated Super Agents ranked by level and experience!',
      thumbnail: {
        url: client.user.displayAvatarURL()
      },
      timestamp: new Date().toISOString(),
      footer: {
        text: 'Super Agent • Updated automatically',
        icon_url: client.user.displayAvatarURL()
      },
      fields: []
    };

    if (leaderboardData.length === 0) {
      leaderboardEmbed.fields.push({
        name: '📭 No Data Available',
        value: 'No users have earned XP or completed missions yet. Be the first to climb the leaderboard!',
        inline: false
      });
    } else {
      const rankEmojis = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];

      let leaderboardText = '';

      for (let i = 0; i < leaderboardData.length; i++) {
        const user = leaderboardData[i];

        const rankEmoji = rankEmojis[i] || `${i + 1}️⃣`;
        const level = user.level || 1;
        const totalXP = user.total_xp || 0;
        const missions = user.missions_completed || 0;
        const credits = user.credits || 0;

        leaderboardText += `${rankEmoji} <@${user.discord_id}>\n`;
        leaderboardText += `   🎮 **Level ${level}** • ⭐ ${totalXP} XP • 🏆 ${missions} missions • 💎 ${credits} credits\n\n`;
      }

      leaderboardEmbed.fields.push({
        name: '🌟 Top Performers',
        value: leaderboardText,
        inline: false
      });
    }

    await message.edit({
      embeds: [leaderboardEmbed]
    });

    console.log('✅ Leaderboard message updated successfully');

  } catch (error) {
    console.error('Error updating leaderboard message:', error);
  }
}

// Helper function to trigger leaderboard update via Discord API
export async function triggerLeaderboardUpdate(): Promise<void> {
  try {
    const discordBotToken = process.env.DISCORD_BOT_TOKEN;
    if (!discordBotToken) {
      console.warn('Discord bot token not configured for leaderboard update');
      return;
    }

    const LEADERBOARD_CHANNEL_ID = '1384557260159717386';
    const MESSAGE_ID = '1384602684828680335';

    // Get leaderboard data
    const leaderboardData = await getLeaderboard(10);

    // Create leaderboard embed using Discord API format
    const leaderboardEmbed: {
      color: number;
      title: string;
      description: string;
      thumbnail: { url: string };
      timestamp: string;
      footer: { text: string; icon_url: string };
      fields: Array<{ name: string; value: string; inline: boolean }>;
    } = {
      color: 0xffd700,
      title: '🏆 Level Leaderboard - Top 10',
      description: 'The most dedicated Super Agents ranked by level and experience!',
      thumbnail: {
        url: 'https://media.discordapp.net/attachments/1390495682284228650/1427728578363265166/super_token.png?ex=68efeb5a&is=68ee99da&hm=3e331c3db5cdf6b11e4b61aea8f26898db3716aae0f971dc04b96c68f4fce67d&=&format=webp&quality=lossless&width=640&height=640'
      },
      timestamp: new Date().toISOString(),
      footer: {
        text: 'Super Agent • Updated automatically',
        icon_url: 'https://media.discordapp.net/attachments/1390495682284228650/1427728578363265166/super_token.png?ex=68efeb5a&is=68ee99da&hm=3e331c3db5cdf6b11e4b61aea8f26898db3716aae0f971dc04b96c68f4fce67d&=&format=webp&quality=lossless&width=640&height=640'
      },
      fields: []
    };

    if (leaderboardData.length === 0) {
      leaderboardEmbed.fields.push({
        name: '📭 No Data Available',
        value: 'No users have earned XP or completed missions yet. Be the first to climb the leaderboard!',
        inline: false
      });
    } else {
      const rankEmojis = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];

      let leaderboardText = '';

      for (let i = 0; i < leaderboardData.length; i++) {
        const user = leaderboardData[i];

        const rankEmoji = rankEmojis[i] || `${i + 1}️⃣`;
        const level = user.level || 1;
        const totalXP = user.total_xp || 0;
        const missions = user.missions_completed || 0;
        const credits = user.credits || 0;

        leaderboardText += `${rankEmoji} <@${user.discord_id}>\n`;
        leaderboardText += `   🎮 **Level ${level}** • ⭐ ${totalXP} XP • 🏆 ${missions} missions • 💎 ${credits} credits\n\n`;
      }

      leaderboardEmbed.fields.push({
        name: '🌟 Top Performers',
        value: leaderboardText,
        inline: false
      });
    }

    // Update the message via Discord API
    const response = await fetch(`https://discord.com/api/v10/channels/${LEADERBOARD_CHANNEL_ID}/messages/${MESSAGE_ID}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bot ${discordBotToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        embeds: [leaderboardEmbed]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Failed to update leaderboard: ${response.status} - ${JSON.stringify(errorData)}`);
    }

    console.log('✅ Leaderboard message updated successfully via Discord API');
  } catch (error) {
    console.error('Error triggering leaderboard update:', error);
  }
}
