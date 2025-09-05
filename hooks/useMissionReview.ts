"use client";

import { useState, useEffect, useMemo } from "react";
import {
  UserMission,
  MissionReviewFilters,
  MissionReviewStats,
} from "@/types/admin/missionReview";
import { mockUserMissions } from "@/data/admin/missionReviewMockData";

export function useMissionReview() {
  const [missions, setMissions] = useState<UserMission[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<MissionReviewFilters>({
    status: "all",
    searchQuery: "",
    dateRange: {
      from: null,
      to: null,
    },
  });

  // Load initial data
  useEffect(() => {
    const loadMissions = () => {
      setLoading(true);
      // Simulate API call
      setTimeout(() => {
        setMissions(mockUserMissions);
        setLoading(false);
      }, 1000);
    };

    loadMissions();
  }, []);

  // Filter missions based on current filters
  const filteredMissions = useMemo(() => {
    return missions.filter((mission) => {
      // Status filter
      if (filters.status !== "all" && mission.status !== filters.status) {
        return false;
      }

      // Universal search filter
      if (filters.searchQuery.trim()) {
        const searchTerm = filters.searchQuery.toLowerCase().trim();

        // Search in mission name
        const missionNameMatch = mission.mission_name
          .toLowerCase()
          .includes(searchTerm);

        // Search in user ID (exact match or starts with)
        const userIdMatch =
          mission.user_id.toLowerCase().includes(searchTerm) ||
          mission.user_id.toLowerCase().startsWith(searchTerm);

        // Search in status (exact match)
        const statusMatch = mission.status.toLowerCase() === searchTerm;

        // Search in submission link/email
        const linkMatch = mission.submission_link
          .toLowerCase()
          .includes(searchTerm);

        // Search in mission ID (exact match or starts with)
        const missionIdMatch =
          mission.mission_id.toString().includes(searchTerm) ||
          mission.mission_id.toString().startsWith(searchTerm);

        // Return true if any field matches
        if (
          !missionNameMatch &&
          !userIdMatch &&
          !statusMatch &&
          !linkMatch &&
          !missionIdMatch
        ) {
          return false;
        }
      }

      return true;
    });
  }, [missions, filters]);

  // Calculate stats based on filtered missions
  const stats: MissionReviewStats = useMemo(() => {
    const total = filteredMissions.length;
    const submitted = filteredMissions.filter(
      (m) => m.status === "submitted"
    ).length;
    const completed = filteredMissions.filter(
      (m) => m.status === "completed"
    ).length;
    const rejected = filteredMissions.filter(
      (m) => m.status === "rejected"
    ).length;

    return {
      total,
      submitted,
      completed,
      rejected,
    };
  }, [filteredMissions]);

  // Actions
  const approveMission = async (missionId: number) => {
    try {
      setMissions((prev) =>
        prev.map((mission) =>
          mission._id === missionId
            ? {
                ...mission,
                status: "completed" as const,
                completed_at: Math.floor(Date.now() / 1000),
              }
            : mission
        )
      );

      // TODO: Replace with actual API call
      console.log(`Approved mission ${missionId}`);
    } catch (error) {
      console.error("Failed to approve mission:", error);
    }
  };

  const rejectMission = async (missionId: number) => {
    try {
      setMissions((prev) =>
        prev.map((mission) =>
          mission._id === missionId
            ? {
                ...mission,
                status: "rejected" as const,
              }
            : mission
        )
      );

      // TODO: Replace with actual API call
      console.log(`Rejected mission ${missionId}`);
    } catch (error) {
      console.error("Failed to reject mission:", error);
    }
  };

  const clearFilters = () => {
    setFilters({
      status: "all",
      searchQuery: "",
      dateRange: {
        from: null,
        to: null,
      },
    });
  };

  const refreshMissions = () => {
    setLoading(true);
    // Simulate API refresh
    setTimeout(() => {
      setMissions([...mockUserMissions]);
      setLoading(false);
    }, 500);
  };

  return {
    missions: filteredMissions,
    allMissions: missions,
    stats,
    filters,
    loading,
    setFilters,
    clearFilters,
    approveMission,
    rejectMission,
    refreshMissions,
  };
}
