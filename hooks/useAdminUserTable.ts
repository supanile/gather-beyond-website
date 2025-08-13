import { useState, useEffect, useMemo } from "react";
import { Mission } from "@/types/admin/adminTypes";
import { 
  UserAgent, 
  ColumnVisibility, 
  PaginationConfig 
} from "@/types/admin/userTableTypes";
import { 
  calculateStatusStats, 
  filterMissionsByStatus, 
  paginateMissions,
  getDefaultUserAgent, // import getDefaultUserAgent
} from "@/lib/admin/user/userTableUtils";

// Extended Mission type to match what UserMissionsTable expects
interface ExtendedMission extends Mission {
  user?: { email: string };
  userMissions?: Mission[];
}

// Mission-specific sort config for UserMissionsTable
interface MissionSortConfig {
  field: keyof ExtendedMission | "user.email" | null;
  direction: "asc" | "desc";
}

// Mission-specific sort function
const sortMissionsByField = (
  missions: Mission[],
  sortConfig: MissionSortConfig
): Mission[] => {
  if (!sortConfig.field) return missions;

  return [...missions].sort((a, b) => {
    let aValue: string | number | null | undefined;
    let bValue: string | number | null | undefined;

    switch (sortConfig.field) {
      case "mission_id":
        aValue = a.mission_id;
        bValue = b.mission_id;
        break;
      case "status":
        aValue = a.status;
        bValue = b.status;
        break;
      case "accepted_at":
        aValue = a.accepted_at;
        bValue = b.accepted_at;
        break;
      case "submitted_at":
        aValue = a.submitted_at;
        bValue = b.submitted_at;
        break;
      case "completed_at":
        aValue = a.completed_at;
        bValue = b.completed_at;
        break;
      case "user":
      case "user.email":
        aValue = (a as Mission & { user?: { email: string } }).user?.email || "";
        bValue = (b as Mission & { user?: { email: string } }).user?.email || "";
        break;
      default:
        const field = sortConfig.field as keyof ExtendedMission;
        const extendedA = a as ExtendedMission;
        const extendedB = b as ExtendedMission;
        aValue = extendedA[field] as string | number | null | undefined;
        bValue = extendedB[field] as string | number | null | undefined;
        break;
    }

    // Handle null/undefined/empty values
    if (aValue === null || aValue === undefined || aValue === "NULL") {
      if (bValue === null || bValue === undefined || bValue === "NULL") return 0;
      return 1; // nulls go to end
    }
    if (bValue === null || bValue === undefined || bValue === "NULL") return -1;

    // String comparison for text fields
    if (typeof aValue === "string" && typeof bValue === "string") {
      const comparison = aValue.toLowerCase().localeCompare(bValue.toLowerCase());
      return sortConfig.direction === "asc" ? comparison : -comparison;
    }

    // Numeric comparison
    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortConfig.direction === "asc" ? aValue - bValue : bValue - aValue;
    }

    // Fallback to string comparison
    const comparison = String(aValue).localeCompare(String(bValue));
    return sortConfig.direction === "asc" ? comparison : -comparison;
  });
};

export const useUserMissions = (userId: string) => {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserMissions = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/users/${userId}/missions`);
        if (response.ok) {
          const data = await response.json();
          setMissions(data);
        } else {
          console.error("Failed to fetch missions");
          setMissions([]);
        }
      } catch (error) {
        console.error("Error fetching missions:", error);
        setMissions([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserMissions();
  }, [userId]);

  return { missions, isLoading };
};

export const useUserTableState = () => {
  const [selectedSubmission, setSelectedSubmission] = useState<Mission | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<MissionSortConfig>({
    field: null,
    direction: "asc"
  });
  const [pagination, setPagination] = useState<PaginationConfig>({
    currentPage: 1,
    pageSize: 5,
    totalItems: 0
  });
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibility>({
    missionId: true,
    userEmail: true,
    missionName: true,
    status: true,
    acceptedAt: true,
    submittedAt: true,
    completedAt: true,
    submissionLink: true,
  });

  const handleSort = (field: MissionSortConfig['field']) => {
    setSortConfig(prev => ({
      field,
      direction: prev.field === field && prev.direction === "asc" ? "desc" : "asc"
    }));
  };

  const toggleColumnVisibility = (column: keyof ColumnVisibility) => {
    setColumnVisibility(prev => ({
      ...prev,
      [column]: !prev[column],
    }));
  };

  const openModal = (mission: Mission) => {
    setSelectedSubmission(mission);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedSubmission(null);
  };

  const setCurrentPage = (page: number) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
  };

  return {
    selectedSubmission,
    isModalOpen,
    selectedStatus,
    setSelectedStatus,
    sortConfig,
    pagination,
    columnVisibility,
    handleSort,
    toggleColumnVisibility,
    openModal,
    closeModal,
    setCurrentPage,
    setPagination
  };
};

export const useProcessedMissions = (
  missions: Mission[], 
  selectedStatus: string | null, 
  sortConfig: MissionSortConfig,
  pagination: PaginationConfig
) => {
  const processedData = useMemo(() => {
    console.log('useProcessedMissions - Input missions:', missions);
    
    // Ensure missions is an array
    const validMissions = Array.isArray(missions) ? missions : [];
    
    // Filter by status
    const filteredMissions = filterMissionsByStatus(validMissions, selectedStatus);
    console.log('useProcessedMissions - Filtered missions:', filteredMissions);
    
    // Sort missions
    const sortedMissions = sortMissionsByField(filteredMissions, sortConfig);
    
    // Calculate total pages
    const totalPages = Math.ceil(sortedMissions.length / pagination.pageSize);
    
    // Paginate missions
    const paginatedMissions = paginateMissions(
      sortedMissions, 
      pagination.currentPage, 
      pagination.pageSize
    );
    
    // Calculate status stats
    const statusStats = calculateStatusStats(validMissions);
    console.log('useProcessedMissions - Status stats:', statusStats);
    
    return {
      filteredMissions,
      sortedMissions,
      paginatedMissions,
      statusStats,
      totalPages,
      totalMissions: validMissions.length
    };
  }, [missions, selectedStatus, sortConfig, pagination]);

  return processedData;
};

// useUserAgent function - exported for use in other components
export const useUserAgent = (userAgent?: UserAgent, userId?: string): UserAgent => {
  return useMemo(() => {
    return userAgent || getDefaultUserAgent(userId || "");
  }, [userAgent, userId]);
};