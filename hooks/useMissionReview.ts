"use client";

import { useState, useEffect, useMemo } from "react";
import { useUser } from "@clerk/nextjs";
import {
  UserMission,
  MissionReviewFilters,
  MissionReviewStats,
  MissionReviewPaginationState,
  MissionReviewSortState,
} from "@/types/admin/missionReview";
import { User } from "@/types/admin/userManagement";

// Interface for raw mission data from API
interface RawMissionData {
  _id: number;
  id2?: number; // The actual mission ID used in API calls
  mission_id: number;
  mission_name: string;
  user_id: string;
  status: "accepted" | "submitted" | "completed" | "rejected";
  accepted_at: number | null;
  submitted_at: number | null;
  completed_at: number | null;
  rejected_at?: number | null;
  submission_link: string;
  notes: string;
  verified_by?: string;
  reward?: {
    xp: number;
    credits: number;
    health: number;
  } | null;
}

export function useMissionReview() {
  const [missions, setMissions] = useState<UserMission[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();
  const [filters, setFilters] = useState<MissionReviewFilters>({
    status: "all",
    searchQuery: "",
    dateRange: {
      from: null,
      to: null,
    },
  });

  // Sort state - เริ่มต้นด้วย _id desc เพื่อแสดงล่าสุดก่อน
  const [sortState, setSortState] = useState<MissionReviewSortState>({
    field: "_id",
    direction: "desc",
  });

  // Pagination state
  const [pagination, setPagination] = useState<MissionReviewPaginationState>({
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 0,
    totalPages: 0,
  });

  // // Load initial data
  // useEffect(() => {
  //   const loadMissions = async () => {
  //     setLoading(true);
  //     try {
  //       const response = await fetch("/api/user-missions");
  //       if (!response.ok) {
  //         throw new Error("Failed to fetch missions");
  //       }
  //       const data = await response.json();
  //       setMissions(data);
  //     } catch (error) {
  //       console.error("Error loading missions:", error);
  //       setMissions([]);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   loadMissions();
  // }, []);
  // Load initial data
useEffect(() => {
  const loadMissions = async () => {
    setLoading(true);
    try {
      // Fetch missions และ users แยกกัน
      const [missionsResponse, usersResponse] = await Promise.all([
        fetch("/api/user-missions"),
        fetch("/api/users")
      ]);
      
      if (!missionsResponse.ok || !usersResponse.ok) {
        throw new Error("Failed to fetch data");
      }
      
      const missions = await missionsResponse.json();
      const users = await usersResponse.json();
      
      // Join missions กับ users data
      const missionsWithUsers = missions.map((mission: RawMissionData) => {
        const user = users.find((u: User) => u.discord_id === mission.user_id);
        return {
          ...mission,
          user: user
        };
      });
      
      setMissions(missionsWithUsers);
    } catch (error) {
      console.error("Error loading missions:", error);
      setMissions([]);
    } finally {
      setLoading(false);
    }
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

        // Search in username from Users table
        const usernameMatch = mission.user?.username
          ? mission.user.username.toLowerCase().includes(searchTerm)
          : false;

        // Return true if any field matches
        if (
          !missionNameMatch &&
          !userIdMatch &&
          !statusMatch &&
          !linkMatch &&
          !missionIdMatch &&
          !usernameMatch
        ) {
          return false;
        }
      }

      return true;
    });
  }, [missions, filters]);

  // Sort missions ก่อน pagination
  const sortedMissions = useMemo(() => {
    return [...filteredMissions].sort((a, b) => {
      const { field, direction } = sortState;
      let aValue = a[field];
      let bValue = b[field];

      // Handle null/undefined values
      if (
        (aValue === null || aValue === undefined) &&
        (bValue === null || bValue === undefined)
      )
        return 0;
      if (aValue === null || aValue === undefined)
        return direction === "asc" ? -1 : 1;
      if (bValue === null || bValue === undefined)
        return direction === "asc" ? 1 : -1;

      // Special handling for _id field to ensure numeric sorting
      if (field === "_id") {
        const numA = Number(aValue);
        const numB = Number(bValue);
        return direction === "asc" ? numA - numB : numB - numA;
      }

      // Special handling for numeric fields
      if (
        field === "mission_id" ||
        field === "submitted_at" ||
        field === "completed_at" ||
        field === "accepted_at"
      ) {
        const numA = Number(aValue) || 0;
        const numB = Number(bValue) || 0;
        return direction === "asc" ? numA - numB : numB - numA;
      }

      if (typeof aValue === "string" && typeof bValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) return direction === "asc" ? -1 : 1;
      if (aValue > bValue) return direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredMissions, sortState]);

  // Reset to first page when filters change
  useEffect(() => {
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  }, [filters.status, filters.searchQuery]);

  // Reset to first page when sort changes
  useEffect(() => {
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  }, [sortState]);

  // Paginated missions - ใช้ sortedMissions แทน filteredMissions
  const paginatedMissions = useMemo(() => {
    const totalItems = sortedMissions.length;
    const totalPages = Math.ceil(totalItems / pagination.itemsPerPage);
    const startIndex = (pagination.currentPage - 1) * pagination.itemsPerPage;
    const endIndex = startIndex + pagination.itemsPerPage;
    const currentMissions = sortedMissions.slice(startIndex, endIndex);

    // Update pagination state
    setPagination((prev) => ({
      ...prev,
      totalItems,
      totalPages,
    }));

    return currentMissions;
  }, [sortedMissions, pagination.currentPage, pagination.itemsPerPage]);

  // Calculate stats based on filtered missions
  const stats: MissionReviewStats = useMemo(() => {
    const total = filteredMissions.length;
    const accepted = filteredMissions.filter(
      (m) => m.status === "accepted"
    ).length;
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
      accepted,
      submitted,
      completed,
      rejected,
    };
  }, [filteredMissions]);

  // Actions
  const approveMission = async (missionId: number) => {
    try {
      // Find the mission to get user_id
      const mission = missions.find((m) => m._id === missionId);
      if (!mission) {
        throw new Error("Mission not found");
      }

      console.log(`Attempting to approve mission ${missionId}:`, {
        missionId,
        currentStatus: mission.status,
        id2: mission.id2,
        apiMissionId: mission.id2 || missionId
      });

      // Get the current admin's username
      const verifiedBy = user?.username || user?.firstName || "Admin";

      // Use id2 for the API call instead of _id
      const apiMissionId = mission.id2 || missionId;
      const apiUrl = `/api/user-missions/${apiMissionId}/approve`;
      
      console.log("🚀 About to call approve API:", {
        originalMissionId: missionId,
        apiMissionId,
        apiUrl,
        mission
      });

      // Send update to the correct API endpoint
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          approvedBy: verifiedBy
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to approve mission");
      }

      const result = await response.json();
      console.log(`Approved mission ${missionId}:`, result);

      // Update the UI with the response data
      setMissions((prev) =>
        prev.map((mission) =>
          mission._id === missionId
            ? {
                ...mission,
                status: "completed" as const,
                completed_at: Math.floor(Date.now() / 1000),
                verified_by: verifiedBy,
              }
            : mission
        )
      );
    } catch (error) {
      console.error("Failed to approve mission:", error);
      // Refresh missions to get the latest state
      refreshMissions();
      throw error;
    }
  };

  const rejectMission = async (missionId: number, rejectionReason?: string) => {
    try {
      // Find the mission to get user_id
      const mission = missions.find((m) => m._id === missionId);
      if (!mission) {
        throw new Error("Mission not found");
      }

      console.log(`Attempting to reject mission ${missionId}:`, {
        missionId,
        currentStatus: mission.status,
        id2: mission.id2,
        rejectionReason,
        apiMissionId: mission.id2 || missionId
      });

      // Get the current admin's username
      const verifiedBy = user?.username || user?.firstName || "Admin";

      // Use id2 for the API call instead of _id
      const apiMissionId = mission.id2 || missionId;
      const apiUrl = `/api/user-missions/${apiMissionId}/reject`;
      
      console.log("🚀 About to call reject API:", {
        originalMissionId: missionId,
        apiMissionId,
        apiUrl,
        mission,
        rejectionReason
      });

      // Send update to the correct API endpoint
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rejectionReason: rejectionReason,
          rejectedBy: verifiedBy,
        }),
      });

      console.log(`Response status: ${response.status}`);

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error from API:", errorData);
        throw new Error(errorData.error || "Failed to reject mission");
      }

      const result = await response.json();
      console.log(`Successfully rejected mission ${missionId}:`, result);

      // Update the UI with the response data
      setMissions((prev) =>
        prev.map((mission) =>
          mission._id === missionId
            ? {
                ...mission,
                status: "rejected" as const,
                completed_at: Math.floor(Date.now() / 1000),
                verified_by: verifiedBy,
              }
            : mission
        )
      );
    } catch (error) {
      console.error("Failed to reject mission:", error);
      // Refresh missions to get the latest state
      refreshMissions();
      throw error;
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

  // Pagination handlers
  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
  };

  const handleItemsPerPageChange = (itemsPerPage: number) => {
    setPagination((prev) => ({
      ...prev,
      itemsPerPage,
      currentPage: 1, // Reset to first page when changing items per page
    }));
  };

  // Sort handler
  const handleSort = (field: keyof UserMission) => {
    setSortState((prev) => ({
      field,
      direction:
        prev.field === field && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  // const refreshMissions = async () => {
  //   setLoading(true);
  //   try {
  //     const response = await fetch("/api/user-missions");
  //     if (!response.ok) {
  //       throw new Error("Failed to refresh missions");
  //     }
  //     const data = await response.json();
  //     setMissions(data);
  //   } catch (error) {
  //     console.error("Error refreshing missions:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const refreshMissions = async () => {
  setLoading(true);
  try {
    const [missionsResponse, usersResponse] = await Promise.all([
      fetch("/api/user-missions"),
      fetch("/api/users")
    ]);
    
    if (!missionsResponse.ok || !usersResponse.ok) {
      throw new Error("Failed to refresh data");
    }
    
    const missions = await missionsResponse.json();
    const users = await usersResponse.json();
    
    const missionsWithUsers = missions.map((mission: RawMissionData) => {
      const user = users.find((u: User) => u.discord_id === mission.user_id);
      return {
        ...mission,
        user: user
      };
    });
    
    setMissions(missionsWithUsers);
  } catch (error) {
    console.error("Error refreshing missions:", error);
  } finally {
    setLoading(false);
  }
};

  return {
    missions: paginatedMissions,
    allMissions: missions,
    filteredMissions,
    stats,
    filters,
    pagination,
    loading,
    sortState,
    setFilters,
    clearFilters,
    approveMission,
    rejectMission,
    refreshMissions,
    handlePageChange,
    handleItemsPerPageChange,
    handleSort,
  };
}
