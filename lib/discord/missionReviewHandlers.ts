// Mission Review Handlers for Discord Bot Integration
// These functions return data that can be used by Discord.js bot

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

// API call to approve/reject mission
export async function handleMissionReviewAction(
  action: 'approve' | 'reject',
  userId: string, 
  missionId: number, 
  approvedBy: string
) {
  try {
    const response = await fetch(`${process.env.PUBLIC_URL || 'http://localhost:3000'}/api/missions/review`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        action,
        userId,
        missionId,
        approvedBy
      })
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
export function createRejectionNotificationEmbed(missionTitle: string): DiscordEmbed {
  return {
    color: 0xff0000, // Red
    title: '❌ Mission Rejected',
    description: `Your submission for **${missionTitle}** has been rejected.`,
    fields: [
      { name: '📝 What to do next?', value: 'You can resubmit the mission with the required improvements.', inline: false }
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
