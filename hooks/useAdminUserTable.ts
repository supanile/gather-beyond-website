import { useState, useEffect, useMemo } from "react";
import { Mission } from "@/types/admin/adminTypes";
import { 
  UserAgent, 
  ColumnVisibility, 
  SortConfig, 
  PaginationConfig 
} from "@/types/admin/userTableTypes";
import { 
  calculateStatusStats, 
  sortMissions, 
  filterMissionsByStatus, 
  paginateMissions,
  getDefaultUserAgent
} from "@/lib/admin/user/userTableUtils";

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
  const [sortConfig, setSortConfig] = useState<SortConfig>({
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
    status: true,
    acceptedAt: true,
    submittedAt: true,
    completedAt: true,
    submissionLink: true,
  });

  const handleSort = (field: keyof Mission) => {
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
  sortConfig: SortConfig,
  pagination: PaginationConfig
) => {
  const processedData = useMemo(() => {
    // Filter by status
    const filteredMissions = filterMissionsByStatus(missions, selectedStatus);
    
    // Sort missions
    const sortedMissions = sortMissions(filteredMissions, sortConfig);
    
    // Calculate total pages
    const totalPages = Math.ceil(sortedMissions.length / pagination.pageSize);
    
    // Paginate missions
    const paginatedMissions = paginateMissions(
      sortedMissions, 
      pagination.currentPage, 
      pagination.pageSize
    );
    
    // Calculate status stats
    const statusStats = calculateStatusStats(missions);
    
    return {
      filteredMissions,
      sortedMissions,
      paginatedMissions,
      statusStats,
      totalPages,
      totalMissions: missions.length
    };
  }, [missions, selectedStatus, sortConfig, pagination]);

  return processedData;
};

export const useUserAgent = (userAgent?: UserAgent, userId?: string): UserAgent => {
  return useMemo(() => {
    return userAgent || getDefaultUserAgent(userId || "");
  }, [userAgent, userId]);
};