import { useState, useEffect } from 'react';
import { User, Mission } from '@/types/admin/adminTypes';
import { UserWithAgent, UserAgent } from '@/types/admin/userManagement';

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

        // Combine data
        const usersWithAgents: UserWithAgent[] = usersData.map(user => {
          const agent = agentsData.find(agent => agent.user_id === user.discord_id);
          const userMissions = transformedMissions.filter(mission => mission.user_id === user.discord_id);

          return {
            // Map _id (string) to id (number if possible, else fallback to 0)
            id: typeof user._id === 'string' && !isNaN(Number(user._id)) ? Number(user._id) : 0,
            ...user,
            // Ensure level is present (from agent)
            level: agent?.level ?? 0,
            agent,
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