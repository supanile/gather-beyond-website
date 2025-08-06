import { useState, useEffect } from 'react';
import { User, Mission } from '@/types/admin/adminTypes';
import { UserWithAgent, UserAgent } from '@/types/admin/userManagement';

// Export interfaces so they can be used by other components
// If you need userMissions, you can define a local type:
// type UserWithAgentAndMissions = UserWithAgent & { userMissions?: Mission[] };

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
        const missionsResponse = await fetch('/api/missions');
        const missionsData: Mission[] = missionsResponse.ok ? await missionsResponse.json() : [];

        // Combine data
        const usersWithAgents: UserWithAgent[] = usersData.map(user => {
          const agent = agentsData.find(agent => agent.user_id === user.discord_id);
          const userMissions = missionsData.filter(mission => mission.user_id === user.discord_id);
          
          return {
            // Map _id (string) to id (number if possible, else fallback to 0)
            id: typeof user._id === 'string' && !isNaN(Number(user._id)) ? Number(user._id) : 0,
            ...user,
            // Ensure level is present (from agent)
            level: agent?.level ?? 0,
            agent,
            userMissions
          };
        });

        setUsers(usersWithAgents);
        setMissions(missionsData);
        setUserAgents(agentsData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error fetching admin data:', err);
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