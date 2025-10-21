import { useState, useEffect } from 'react';
import { User, Mission } from '@/types/admin/adminTypes';
import { UserWithAgent, UserAgent } from '@/types/admin/userManagement';
import { CreditUsageStats } from '@/types/superStore';

export function useAdminData() {
  const [users, setUsers] = useState<UserWithAgent[]>([]);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [userAgents, setUserAgents] = useState<UserAgent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch all users
        const usersResponse = await fetch('/api/users');
        if (!usersResponse.ok) throw new Error('Failed to fetch users');
        const usersData: User[] = await usersResponse.json();

        // Fetch all user agents
        const agentsResponse = await fetch('/api/user-agents');
        const agentsData: UserAgent[] = agentsResponse.ok ? await agentsResponse.json() : [];

        // Fetch all missions
        const missionsResponse = await fetch('/api/user-missions');
        const missionsData: Mission[] = missionsResponse.ok ? await missionsResponse.json() : [];

        // Fetch credit usage data
        const creditUsageResponse = await fetch('/api/super-store');
        let creditUsageData: CreditUsageStats[] = [];
        if (creditUsageResponse.ok) {
          const creditResponse = await creditUsageResponse.json();
          creditUsageData = creditResponse.data || [];
        }

        // Create a map of credit usage by discord_id
        const creditUsageMap = new Map<string, CreditUsageStats>();
        creditUsageData.forEach(usage => {
          creditUsageMap.set(usage.discord_id, usage);
        });

        // Transform missions data to ensure proper format
        const transformedMissions = missionsData.map(mission => {
          // Convert accepted_at, submitted_at, completed_at properly
          const transformedMission: Mission = {
            _id: mission._id?.toString() || mission.mission_id?.toString() || '',
            user_id: mission.user_id,
            mission_id: mission.mission_id,
            mission_name: mission.mission_name,
            status: mission.status as "accepted" | "submitted" | "completed" | "rejected",
            // Keep the original values - they should be Unix timestamps or null
            accepted_at: mission.accepted_at?.toString() || '',
            submitted_at: mission.submitted_at?.toString() || '',
            completed_at: mission.completed_at ? mission.completed_at.toString() : null,
            submission_link: mission.submission_link || null,
          };

          return transformedMission;
        });

        // Combine data with credit usage
        const usersWithAgents: UserWithAgent[] = usersData.map(user => {
          const agent = agentsData.find(agent => agent.user_id === user.discord_id);
          const userMissions = transformedMissions.filter(mission => mission.user_id === user.discord_id);
          const creditUsage = creditUsageMap.get(user.discord_id);

          // Merge credit usage data into agent
          const agentWithCredits: UserAgent | undefined = agent ? {
            ...agent,
            credits_used_lifetime: creditUsage?.credits_used_lifetime || 0,
            credits_used_30d: creditUsage?.credits_used_30d || 0,
            last_expense_reason: creditUsage?.last_expense_reason || undefined,
            last_expense_date: creditUsage?.last_expense_date || undefined,
            last_expense_type: creditUsage?.last_expense_type as UserAgent['last_expense_type'] || undefined,
          } : undefined;

          return {
            // Map _id (string) to id (number if possible, else fallback to 0)
            id: typeof user._id === 'string' && !isNaN(Number(user._id)) ? Number(user._id) : 0,
            ...user,
            // Ensure level is present (from agent)
            level: agent?.level ?? 0,
            agent: agentWithCredits,
            userMissions // Add userMissions to the user object
          };
        });

        setUsers(usersWithAgents);
        setMissions(transformedMissions);
        setUserAgents(agentsData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, []);

  return {
    users,
    missions,
    userAgents,
    isLoading,
    error,
    refetch: () => {
      setIsLoading(true);
      setError(null);
      // Re-run the fetch
    }
  };
}