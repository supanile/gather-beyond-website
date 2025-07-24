import { useState, useEffect } from 'react';
import { User, Mission } from '@/types/admin/adminTypes';

interface UserAgent {
  id: number;
  user_id: string;
  xp: number;
  level: number;
  health: number;
  mood: string;
  last_active: number;
  created_at: number;
  last_health_decay: number;
  total_xp: number;
  current_level_progress: number;
  xp_required: number;
}

interface UserWithAgent extends User {
  agent?: UserAgent;
  userMissions?: Mission[];
}

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
            ...user,
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
