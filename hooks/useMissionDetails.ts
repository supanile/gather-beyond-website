"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { UserMission } from "@/types/admin/missionReview";

export function useMissionDetails(missionId: string) {
  const [mission, setMission] = useState<UserMission | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useUser();

  useEffect(() => {
    const fetchMissionDetails = async () => {
      if (!missionId) return;

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/user-missions/${missionId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch mission details");
        }
        const data = await response.json();
        setMission(data);
      } catch (err) {
        console.error("Error fetching mission details:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchMissionDetails();
  }, [missionId]);

  const approveMission = async (missionId: number) => { // eslint-disable-line @typescript-eslint/no-unused-vars
    try {
      if (!mission) {
        throw new Error("Mission not found");
      }

      // Get the current admin's username
      const verifiedBy = user?.username || user?.firstName || "Admin";

      const response = await fetch(`/api/missions/review`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "approve",
          userId: mission.user_id,
          missionId: mission.mission_id,
          approvedBy: verifiedBy
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to approve mission");
      }

      const responseData = await response.json();
      
      // Update the local mission state
      setMission(prev => prev ? {
        ...prev,
        status: "completed" as const,
        completed_at: Math.floor(Date.now() / 1000),
        verified_by: verifiedBy,
      } : null);
      
      return responseData;
    } catch (error) {
      console.error("Error approving mission:", error);
      throw error;
    }
  };

  const rejectMission = async (missionId: number) => { // eslint-disable-line @typescript-eslint/no-unused-vars
    try {
      if (!mission) {
        throw new Error("Mission not found");
      }

      // Get the current admin's username
      const verifiedBy = user?.username || user?.firstName || "Admin";

      const response = await fetch(`/api/missions/review`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "reject",
          userId: mission.user_id,
          missionId: mission.mission_id,
          approvedBy: verifiedBy
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to reject mission");
      }

      const responseData = await response.json();
      
      // Update the local mission state
      setMission(prev => prev ? {
        ...prev,
        status: "rejected" as const,
        completed_at: Math.floor(Date.now() / 1000),
        verified_by: verifiedBy,
      } : null);
      
      return responseData;
    } catch (error) {
      console.error("Error rejecting mission:", error);
      throw error;
    }
  };

  return {
    mission,
    loading,
    error,
    approveMission,
    rejectMission,
    refetch: () => {
      if (missionId) {
        const fetchMissionDetails = async () => {
          setLoading(true);
          setError(null);

          try {
            const response = await fetch(`/api/user-missions/${missionId}`);
            if (!response.ok) {
              throw new Error("Failed to fetch mission details");
            }
            const data = await response.json();
            setMission(data);
          } catch (err) {
            console.error("Error fetching mission details:", err);
            setError(err instanceof Error ? err.message : "An error occurred");
          } finally {
            setLoading(false);
          }
        };
        fetchMissionDetails();
      }
    },
  };
}
