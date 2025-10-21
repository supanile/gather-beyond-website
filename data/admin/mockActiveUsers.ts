// Mock data for ActiveUsersCard testing
// สร้างข้อมูลผู้ใช้จำลองที่มี last_active ในช่วงเวลาต่างๆ

export interface MockUser {
  discord_id: string;
  username: string;
  email: string;
  agent?: {
    last_active?: number;
    level?: number;
  };
}

// Helper function to create timestamp for days ago
const daysAgo = (days: number): number => {
  return Date.now() - (days * 24 * 60 * 60 * 1000);
};

// Generate realistic mock users with different activity patterns
export const generateMockUsers = (totalUsers: number = 100): MockUser[] => {
  const users: MockUser[] = [];
  
  // Activity distribution pattern (realistic for most apps)
  const activityPattern = {
    last7Days: 0.15,    // 15% active in last 7 days
    last14Days: 0.10,   // Additional 10% active in 8-14 days
    last30Days: 0.08,   // Additional 8% active in 15-30 days
    last60Days: 0.07,   // Additional 7% active in 31-60 days
    older: 0.60         // 60% inactive for 60+ days
  };

  let userCount = 0;

  // Users active in last 7 days
  for (let i = 0; i < Math.floor(totalUsers * activityPattern.last7Days); i++) {
    users.push({
      discord_id: `user_${userCount++}`,
      username: `ActiveUser${i + 1}`,
      email: `active${i + 1}@example.com`,
      agent: {
        last_active: daysAgo(Math.random() * 7), // Random between 0-7 days ago
        level: Math.floor(Math.random() * 50) + 10 // Level 10-60
      }
    });
  }

  // Users active in 8-14 days
  for (let i = 0; i < Math.floor(totalUsers * activityPattern.last14Days); i++) {
    users.push({
      discord_id: `user_${userCount++}`,
      username: `RecentUser${i + 1}`,
      email: `recent${i + 1}@example.com`,
      agent: {
        last_active: daysAgo(7 + Math.random() * 7), // Between 7-14 days ago
        level: Math.floor(Math.random() * 40) + 5
      }
    });
  }

  // Users active in 15-30 days
  for (let i = 0; i < Math.floor(totalUsers * activityPattern.last30Days); i++) {
    users.push({
      discord_id: `user_${userCount++}`,
      username: `WeeklyUser${i + 1}`,
      email: `weekly${i + 1}@example.com`,
      agent: {
        last_active: daysAgo(14 + Math.random() * 16), // Between 14-30 days ago
        level: Math.floor(Math.random() * 30) + 5
      }
    });
  }

  // Users active in 31-60 days
  for (let i = 0; i < Math.floor(totalUsers * activityPattern.last60Days); i++) {
    users.push({
      discord_id: `user_${userCount++}`,
      username: `MonthlyUser${i + 1}`,
      email: `monthly${i + 1}@example.com`,
      agent: {
        last_active: daysAgo(30 + Math.random() * 30), // Between 30-60 days ago
        level: Math.floor(Math.random() * 25) + 1
      }
    });
  }

  // Inactive users (60+ days or no activity)
  const remainingUsers = totalUsers - users.length;
  for (let i = 0; i < remainingUsers; i++) {
    users.push({
      discord_id: `user_${userCount++}`,
      username: `InactiveUser${i + 1}`,
      email: `inactive${i + 1}@example.com`,
      agent: {
        last_active: Math.random() > 0.5 ? daysAgo(60 + Math.random() * 300) : undefined, // 60+ days ago or never active
        level: Math.floor(Math.random() * 10) + 1
      }
    });
  }

  return users;
};

// Pre-generated mock data for consistent testing
export const mockUsers: MockUser[] = generateMockUsers(150);

// Expected results for the mock data (for testing purposes)
export const expectedActiveUsers = {
  "7d": mockUsers.filter(user => {
    const lastActive = user.agent?.last_active;
    return lastActive && lastActive > daysAgo(7);
  }).length,
  "14d": mockUsers.filter(user => {
    const lastActive = user.agent?.last_active;
    return lastActive && lastActive > daysAgo(14);
  }).length,
  "30d": mockUsers.filter(user => {
    const lastActive = user.agent?.last_active;
    return lastActive && lastActive > daysAgo(30);
  }).length,
  "60d": mockUsers.filter(user => {
    const lastActive = user.agent?.last_active;
    return lastActive && lastActive > daysAgo(60);
  }).length,
};

// Quick test scenarios for different data patterns
export const testScenarios = {
  // Scenario 1: Growing user base
  growingUsers: generateMockUsers(200).map(user => ({
    ...user,
    agent: {
      ...user.agent,
      last_active: user.agent?.last_active ? 
        user.agent.last_active + (Math.random() * 86400000) : // Add some recent activity
        undefined
    }
  })),

  // Scenario 2: Declining user base  
  decliningUsers: generateMockUsers(80).map(user => ({
    ...user,
    agent: {
      ...user.agent,
      last_active: user.agent?.last_active ? 
        user.agent.last_active - (Math.random() * 172800000) : // Reduce recent activity
        undefined
    }
  })),

  // Scenario 3: Stable user base
  stableUsers: mockUsers,

  // Scenario 4: New app (mostly recent users)
  newAppUsers: Array.from({ length: 50 }, (_, i) => ({
    discord_id: `new_user_${i}`,
    username: `NewUser${i + 1}`,
    email: `newuser${i + 1}@example.com`,
    agent: {
      last_active: daysAgo(Math.random() * 14), // Most users active in last 14 days
      level: Math.floor(Math.random() * 10) + 1
    }
  }))
};

// Usage examples
export const usageExamples = {
  // For dashboard page
  defaultUsage: mockUsers,
  
  // For testing growth scenarios
  testGrowth: testScenarios.growingUsers,
  testDecline: testScenarios.decliningUsers,
  
  // For different app stages
  newApp: testScenarios.newAppUsers,
  matureApp: mockUsers,
};
