import { grist } from "@/lib/grist";

// Interface definitions
export interface Mission {
  id: number;
  title: string;
  description: string;
  reward: {
    amount: number;
    token: string;
  };
}

export interface UserMission {
  id: number;
  user_id: string;
  mission_id: number;
  status: 'submitted' | 'completed' | 'rejected';
  platform?: string;
  completed_at?: string;
}

export interface UserAgent {
  id: number;
  user_id: string;
  xp: number;
  level: number;
  health: number;
  mood: 'happy' | 'neutral' | 'sad';
  total_xp: number;
  current_level_progress: number;
  xp_required: number;
  last_active: string;
  last_health_decay: string;
  created_at: string;
}

export interface User {
  id: number;
  discord_id: string;
  // missions_completed: number;
  total_points: number;
  credit: number; // Changed from credits to credit
}

// Level up data configuration
export const LEVEL_UP_DATA: Record<number, { message: string; unlock: string }> = {
  5: { message: "You're getting the hang of this!", unlock: "Access to intermediate missions" },
  10: { message: "Amazing progress!", unlock: "Special weekly challenges" },
  15: { message: "You're becoming a pro!", unlock: "Advanced mission types" },
  20: { message: "Elite status achieved!", unlock: "Exclusive community access" },
  25: { message: "You're unstoppable!", unlock: "Premium rewards tier" },
  50: { message: "Legendary status!", unlock: "Ultimate rewards and recognition" }
};

// Helper functions for type conversion
export function ensureNumber(value: unknown): number {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') return parseInt(value, 10) || 0;
  return 0;
}

export function ensureString(value: unknown): string {
  if (typeof value === 'string') return value;
  return String(value || '');
}

// Helper function to get mission by ID
export async function getMissionById(missionId: number): Promise<Mission | null> {
  try {
    const missions = await grist.fetchTable("Missions");
    const mission = missions.find(m => ensureNumber(m.id) === missionId);
    
    if (!mission) return null;

    const rewardValue = mission.reward;
    let reward;
    try {
      reward = typeof rewardValue === 'string' ? JSON.parse(rewardValue) : rewardValue;
    } catch {
      reward = { amount: 50, token: 'XP' }; // Default reward
    }

    return {
      id: ensureNumber(mission.id),
      title: ensureString(mission.title),
      description: ensureString(mission.description),
      reward
    };
  } catch (error) {
    console.error('Error fetching mission:', error);
    return null;
  }
}

// Helper function to get user mission
export async function getUserMission(userId: string, missionId: number): Promise<UserMission | null> {
  try {
    const userMissions = await grist.fetchTable("User_missions", { user_id: [userId], mission_id: [missionId]});
    
    const userMission = userMissions.find(um => 
      um.status === 'submitted'
    );

    console.log(userMission);
    
    if (!userMission) return null;
    
    return {
      id: ensureNumber(userMission.id),
      user_id: ensureString(userMission.user_id),
      mission_id: ensureNumber(userMission.mission_id),
      status: ensureString(userMission.status) as 'submitted' | 'completed' | 'rejected',
      completed_at: userMission.completed_at ? ensureString(userMission.completed_at) : undefined
    };
  } catch (error) {
    console.error('Error fetching user mission:', error);
    return null;
  }
}

// Function to calculate level progress
export function calculateLevelProgress(totalXP: number) {
  let level = 1;
  let xpForCurrentLevel = 0;
  
  // Simple level calculation: every 100 XP = 1 level
  level = Math.floor(totalXP / 100) + 1;
  xpForCurrentLevel = totalXP % 100;
  const xpRequired = 100 - xpForCurrentLevel;
  
  return {
    level,
    total_xp: totalXP,
    current_level_progress: xpForCurrentLevel,
    xp_required: xpRequired
  };
}

// Function to calculate mood based on health
export function calculateMood(health: number): 'happy' | 'neutral' | 'sad' {
  if (health >= 70) return 'happy';
  if (health >= 30) return 'neutral';
  return 'sad';
}

// Function to get level up messages
export function getLevelUpMessages(oldLevel: number, newLevel: number) {
  const messages = [];
  for (let level = oldLevel + 1; level <= newLevel; level++) {
    if (LEVEL_UP_DATA[level]) {
      messages.push({
        level,
        message: LEVEL_UP_DATA[level].message,
        unlock: LEVEL_UP_DATA[level].unlock
      });
    }
  }
  return messages;
}

// Function to get level up emoji
export function getLevelUpEmoji(level: number): string {
  if (level >= 50) return '👑';
  if (level >= 25) return '⭐';
  if (level >= 20) return '🏆';
  if (level >= 15) return '🎖️';
  if (level >= 10) return '🥇';
  if (level >= 5) return '🏅';
  return '🎉';
}

// Create or get user agent
export async function createOrGetUserAgent(userId: string): Promise<UserAgent | null> {
  try {
    // Check if agent exists
    const userAgents = await grist.fetchTable("User_agents");
    const agent = userAgents.find(a => ensureString(a.user_id) === userId);

    if (!agent) {
      // Create new agent
      const newAgent = {
        user_id: userId,
        xp: 0,
        level: 1,
        health: 100,
        mood: 'happy' as const,
        total_xp: 0,
        current_level_progress: 0,
        xp_required: 100,
        last_active: new Date().toISOString(),
        last_health_decay: new Date().toISOString(),
        created_at: new Date().toISOString()
      };

      const result = await grist.addRecords("User_agents", [newAgent]);
      if (result && result.length > 0) {
        return { id: ensureNumber(result[0]), ...newAgent };
      }
      return null;
    }

    return {
      id: ensureNumber(agent.id),
      user_id: ensureString(agent.user_id),
      xp: ensureNumber(agent.xp),
      level: ensureNumber(agent.level),
      health: ensureNumber(agent.health),
      mood: ensureString(agent.mood) as 'happy' | 'neutral' | 'sad',
      total_xp: ensureNumber(agent.total_xp),
      current_level_progress: ensureNumber(agent.current_level_progress),
      xp_required: ensureNumber(agent.xp_required),
      last_active: ensureString(agent.last_active),
      last_health_decay: ensureString(agent.last_health_decay),
      created_at: ensureString(agent.created_at)
    };
  } catch (error) {
    console.error('Error creating/getting user agent:', error);
    return null;
  }
}

// Add XP to user
export async function addXPToUser(userId: string, xpAmount: number) {
  try {
    console.log(`Adding XP to user ${userId}: +${xpAmount}`);
    
    const agent = await createOrGetUserAgent(userId);
    if (!agent) {
      console.log('Agent not found, cannot add XP');
      return { success: false, error: 'Agent not found' };
    }

    console.log(`Current agent:`, agent);

    const oldTotalXP = agent.total_xp || 0;
    const newTotalXP = oldTotalXP + xpAmount;

    // Calculate old and new level data
    const oldLevelData = calculateLevelProgress(oldTotalXP);
    const newLevelData = calculateLevelProgress(newTotalXP);

    console.log(`XP update: ${oldTotalXP} -> ${newTotalXP}, Level: ${oldLevelData.level} -> ${newLevelData.level}`);

    // Update user agent with new XP data
    await grist.updateRecords("User_agents", [{
      id: agent.id,
      total_xp: newLevelData.total_xp,
      level: newLevelData.level,
      current_level_progress: newLevelData.current_level_progress,
      xp_required: newLevelData.xp_required,
      xp: newLevelData.total_xp // Keep legacy xp field in sync
    }]);

    console.log(`Successfully updated XP for ${userId}`);

    return {
      success: true,
      oldLevel: oldLevelData.level,
      newLevel: newLevelData.level,
      leveledUp: newLevelData.level > oldLevelData.level,
      xpGained: xpAmount,
      totalXP: newLevelData.total_xp,
      levelData: newLevelData
    };
  } catch (error) {
    console.error('Error adding XP to user:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}

// Update agent health
export async function updateAgentHealth(userId: string, healthChange: number) {
  try {
    console.log(`Updating agent health for ${userId}: +${healthChange}`);
    
    const agent = await createOrGetUserAgent(userId);
    if (!agent) {
      console.log('Agent not found, cannot update health');
      return { success: false, message: 'Agent not found' };
    }

    console.log(`Current agent:`, agent);

    const newHealth = Math.max(0, Math.min(100, agent.health + healthChange));
    const oldMood = calculateMood(agent.health);
    const newMood = calculateMood(newHealth);

    console.log(`Health update: ${agent.health} -> ${newHealth}, Mood: ${oldMood} -> ${newMood}`);

    await grist.updateRecords("User_agents", [{
      id: agent.id,
      health: newHealth,
      // mood: newMood,
      last_active: new Date().toISOString()
    }]);

    console.log(`Successfully updated agent health for ${userId}`);

    return {
      success: true,
      oldHealth: agent.health,
      newHealth: newHealth,
      oldMood: oldMood,
      newMood: newMood,
      healthChange: healthChange
    };
  } catch (error) {
    console.error('Error updating agent health:', error);
    return { success: false, message: 'Database error' };
  }
}

// Update user stats
export async function updateUserStats(userId: string, xpGain: number, creditsGain: number) {
  try {
    console.log(`Updating user stats for ${userId}: +${xpGain} XP, +${creditsGain} credits`);
    
    const users = await grist.fetchTable("Users");
    const user = users.find(u => ensureString(u.discord_id) === userId);

    if (user) {
      console.log(`Found user:`, user);
      
      const currentMissions = ensureNumber(user.missions_completed);
      const currentPoints = ensureNumber(user.total_points);
      const currentCredit = ensureNumber(user.credit); // Changed from credits to credit
      
      console.log(`Current stats - Missions: ${currentMissions}, Points: ${currentPoints}, Credits: ${currentCredit}`);
      console.log(`Adding - Missions: +1, Points: +${xpGain}, Credits: +${creditsGain}`);

      await grist.updateRecords("Users", [{
        id: ensureNumber(user.id),
        // missions_completed: currentMissions + 1,
        total_points: currentPoints + xpGain,
        credit: currentCredit + creditsGain // Changed from credits to credit
      }]);
      
      console.log(`Successfully updated user stats for ${userId}`);
      return { success: true };
    }
    
    console.log(`User not found for discord_id: ${userId}`);
    return { success: false, message: 'User not found' };
  } catch (error) {
    console.error('Error updating user stats:', error);
    return { success: false, message: 'Database error' };
  }
}

// Complete mission function
export async function completeMission(userId: string, missionId: number, verifiedBy?: string) {
  try {
    const userMission = await getUserMission(userId, missionId);
    if (!userMission) {
      return { success: false, message: 'Mission not found!' };
    }

    if (userMission.status !== 'submitted') {
      return { 
        success: false, 
        message: `Cannot approve mission with status "${userMission.status}". Only missions with status "submitted" can be approved.`,
        currentStatus: userMission.status,
        allowedStatus: 'submitted'
      };
    }

    const mission = await getMissionById(missionId);
    if (!mission) {
      return { success: false, message: 'Mission details not found!' };
    }

    // Update mission status to completed with verification info
    const updateData: {
      id: number;
      status: string;
      completed_at: string;
      verified_by?: string;
    } = {
      id: userMission.id,
      status: 'completed',
      completed_at: new Date().toISOString()
    };

    // Add verification information if provided
    if (verifiedBy) {
      updateData.verified_by = verifiedBy;
    }

    await grist.updateRecords("User_missions", [updateData]);

    // Parse reward
    const reward = mission.reward;
    
    // Give XP and Health rewards
    const xpGain = reward.amount || 50; // Default 50 XP if no amount specified
    const creditsGain = xpGain;
    const healthGain = 10; // Fixed +10 health per completed mission

    // Update agent XP using new progressive system
    const xpResult = await addXPToUser(userId, xpGain);
    console.log('XP update result:', xpResult);

    // Update agent health
    const healthResult = await updateAgentHealth(userId, healthGain);
    console.log('Health update result:', healthResult);

    // Update user's total missions completed and points
    const statsResult = await updateUserStats(userId, xpGain, creditsGain);
    console.log('Stats update result:', statsResult);

    return {
      success: true,
      message: 'Mission completed successfully!',
      rewards: {
        xp: xpGain,
        health: healthGain,
        credits: creditsGain,
        levelUp: xpResult ? xpResult.leveledUp : false,
        newLevel: xpResult ? xpResult.newLevel : null
      },
      xpResult,
      healthResult
    };
  } catch (error) {
    console.error('Error completing mission:', error);
    return { success: false, message: 'An error occurred while completing the mission.' };
  }
}
