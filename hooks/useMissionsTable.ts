import { useState, useEffect, useMemo } from "react";
import {
  Mission,
  ColumnVisibility,
  StatusStats,
  NewMissionForm,
  PaginationState,
  SortState,
  MissionTableFilters,
} from "@/types/admin/missions/missionTypes";
import { toast } from "sonner";

// Toast styling utility for light/dark mode compatibility with very soft colors
const toastStyles = {
  success: {
    style: {
      background: 'hsl(142 45% 75%)', // very soft green - much lighter
      color: 'hsl(142 40% 20%)', // dark green text for contrast
      border: '1px solid hsl(142 35% 65%)', // subtle green border
      '--tw-shadow': '0 2px 4px -1px rgba(34, 197, 94, 0.1)',
      boxShadow: 'var(--tw-shadow)',
      borderRadius: '8px',
      backdropFilter: 'blur(4px)',
    }
  },
  error: {
    style: {
      background: 'hsl(0 45% 85%)', // very soft pink/red - much lighter
      color: 'hsl(0 60% 30%)', // dark red text for contrast
      border: '1px solid hsl(0 35% 75%)', // subtle red border
      '--tw-shadow': '0 2px 4px -1px rgba(248, 113, 113, 0.1)',
      boxShadow: 'var(--tw-shadow)',
      borderRadius: '8px',
      backdropFilter: 'blur(4px)',
    }
  },
  delete: {
    style: {
      background: 'hsl(15 45% 80%)', // very soft orange-red for delete
      color: 'hsl(15 60% 25%)', // dark orange-red text
      border: '1px solid hsl(15 35% 70%)', // subtle orange-red border
      '--tw-shadow': '0 2px 4px -1px rgba(239, 68, 68, 0.1)',
      boxShadow: 'var(--tw-shadow)',
      borderRadius: '8px',
      backdropFilter: 'blur(4px)',
    }
  }
};

export const useMissionsTable = () => {
  // State management
  const [missions, setMissions] = useState<Mission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sortState, setSortState] = useState<SortState>({
    field: null,
    direction: "asc",
  });
  const [filters, setFilters] = useState<MissionTableFilters>({
    selectedStatus: null,
  });
  
  // Search query state
  const [searchQuery, setSearchQuery] = useState("");
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  // Pagination state
  const [pagination, setPagination] = useState<PaginationState>({
    currentPage: 1,
    itemsPerPage: 10,
    totalItems: 0,
    totalPages: 0,
  });

  // Column visibility state
  const [columnVisibility, setColumnVisibility] = useState<ColumnVisibility>({
    id: true,
    title: true,
    type: true,
    platform: true,
    status: true,
    reward: true,
    partner: true,
    startDate: true,
    endDate: true,
  });

  // New mission form state
  const [newMission, setNewMission] = useState<NewMissionForm>({
    title: "",
    description: "",
    type: "",
    platform: "",
    reward: "",
    level_required: 1,
    action_request: "",
    format: "",
    useful_link: "",
    partner: "Super Connector",
    serverId: "[]",
  });

  // Fetch missions data
  const fetchMissions = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/missions");
      if (response.ok) {
        const data = await response.json();
        
        // Sanitize mission data to ensure status is always a valid string
        const sanitizedData = data.map((mission: Mission) => ({
          ...mission,
          status: mission.status && typeof mission.status === 'string' && mission.status.trim() !== '' 
            ? mission.status.trim().toLowerCase() 
            : 'upcoming' // default status for invalid/empty status
        }));
        
        setMissions(sanitizedData);
        console.log("Missions loaded successfully");
      } else {
        const errorData = await response.json();
        console.error("Failed to fetch missions:", errorData);
        toast.error("Failed to load missions", toastStyles.error);
        setMissions([]);
      }
    } catch (error) {
      console.error("Error fetching missions:", error);
      toast.error("Error loading missions", toastStyles.error);
      setMissions([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMissions();
  }, []);

  // Reset to first page when filters or search change
  useEffect(() => {
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  }, [filters.selectedStatus, searchQuery, pagination.itemsPerPage]);

  // Filtered missions with search functionality
  const filteredMissions = useMemo(() => {
    let filtered = missions;

    // Filter by status
    if (filters.selectedStatus) {
      filtered = filtered.filter((mission) => mission.status === filters.selectedStatus);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter((mission) => {
        const searchableFields = [
          mission.title,
          mission.description,
          mission.partnerName,
          mission.type,
          mission.platform,
          mission.action_request,
          mission.reward, 
          mission.status, 
        ];

        return searchableFields.some(
          (field) => field && field.toString().toLowerCase().includes(query)
        );
      });
    }

    return filtered;
  }, [missions, filters.selectedStatus, searchQuery]);

  // Sorted missions
  const sortedMissions = useMemo(() => {
    return [...filteredMissions].sort((a, b) => {
      // Define status priority: active > upcoming > ended > completed
      const statusPriority = {
        active: 1,
        upcoming: 2,
        completed: 3,
        ended: 4,
      };

      const aPriority = statusPriority[a.status as keyof typeof statusPriority] || 999;
      const bPriority = statusPriority[b.status as keyof typeof statusPriority] || 999;

      // First sort by status priority
      if (aPriority !== bPriority) {
        return aPriority - bPriority;
      }

      // If same status priority, apply regular sorting
      if (!sortState.field) return 0;

      const aValue = a[sortState.field!];
      const bValue = b[sortState.field!];

      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      if (aValue < bValue) return sortState.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortState.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredMissions, sortState]);

  // Paginated missions
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

  // Status statistics (based on all missions, not filtered)
  const statusStats: StatusStats = useMemo(
    () => ({
      active: missions.filter((m) => m.status === "active").length,
      upcoming: missions.filter((m) => m.status === "upcoming").length,
      completed: missions.filter((m) => m.status === "completed").length,
      ended: missions.filter((m) => m.status === "ended").length,
    }),
    [missions]
  );

  // Handlers
  const handleSort = (field: keyof Mission) => {
    setSortState((prev) => ({
      field,
      direction:
        prev.field === field && prev.direction === "asc" ? "desc" : "asc",
    }));
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  const toggleColumnVisibility = (column: keyof ColumnVisibility) => {
    setColumnVisibility((prev) => ({
      ...prev,
      [column]: !prev[column],
    }));
  };

  // Search handlers
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    // Reset to first page when searching
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  };

  // Reset filter function to include search
  const handleResetFilter = () => {
    setFilters((prev) => ({ ...prev, selectedStatus: null }));
    setSearchQuery("");
  };

  // Add Mission Handler
  const handleAddMission = async () => {
    try {
      setIsSubmitting(true);

      // Validate required fields
      const requiredFields = [
        "title",
        "description",
        "type",
        "platform",
        "partner",
      ];
      for (const field of requiredFields) {
        if (!newMission[field as keyof NewMissionForm]) {
          toast.error(`Please fill in the ${field} field`, toastStyles.error);
          return;
        }
      }

      const startDate = newMission.startDate
        ? newMission.startDate // ใช้ค่าที่ส่งมาตรงๆ (รูปแบบ YYYY-MM-DDTHH:mm)
        : new Date().toISOString().slice(0, 16); // current datetime in local format

      const endDate = newMission.endDate
        ? newMission.endDate // ใช้ค่าที่ส่งมาตรงๆ
        : null;

      console.log("Processed dates:", {
        originalStart: newMission.startDate,
        processedStart: startDate,
        originalEnd: newMission.endDate,
        processedEnd: endDate,
      });

      // Prepare mission data
      const missionData = {
        title: newMission.title,
        description: newMission.description,
        type: newMission.type,
        platform: newMission.platform,
        reward: newMission.reward,
        level_required: newMission.level_required,
        action_request: newMission.action_request,
        format: newMission.format,
        useful_link: newMission.useful_link,
        requirements: newMission.requirements || "{}",
        repeatable: newMission.repeatable || 0,
        startDate: startDate,
        endDate: endDate,
        regex: newMission.regex || "",
        partner: newMission.partner,
        duration:
          newMission.duration ||
          JSON.stringify({
            start: startDate,
            end: endDate,
          }),
        serverId: newMission.serverId || "[]",
      };

      console.log("Sending mission data:", missionData);

      const response = await fetch("/api/missions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(missionData),
      });

      if (response.ok) {
        await response.json();
        toast.success("Mission added successfully!", toastStyles.success);
        setIsAddModalOpen(false);

        // Reset form
        setNewMission({
          title: "",
          description: "",
          type: "",
          platform: "",
          reward: "",
          level_required: 1,
          action_request: "",
          format: "",
          useful_link: "",
          partner: "Super Connector",
          serverId: "[]",
        });

        await fetchMissions();
      } else {
        const errorData = await response.json();
        console.error("API Error Response:", errorData);
        toast.error(`Failed to add mission: ${errorData.error}`, toastStyles.error);
        if (errorData.details) {
          console.error("Error details:", errorData.details);
        }
      }
    } catch (error) {
      console.error("Error adding mission:", error);
      toast.error("Failed to add mission. Please try again.", toastStyles.error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Update Mission Handler
  const handleUpdateMission = async (
    missionId: string | number,
    updateData: NewMissionForm
  ) => {
    try {
      setIsSubmitting(true);

      // จัดการวันที่และเวลาแบบถูกต้องสำหรับ update
      const startDate = updateData.startDate
        ? updateData.startDate // ใช้ค่าที่ส่งมาตรงๆ (รูปแบบ YYYY-MM-DDTHH:mm)
        : new Date().toISOString().slice(0, 16); // current datetime in local format

      const endDate = updateData.endDate
        ? updateData.endDate // ใช้ค่าที่ส่งมาตรงๆ
        : null;

      console.log("Update processed dates:", {
        originalStart: updateData.startDate,
        processedStart: startDate,
        originalEnd: updateData.endDate,
        processedEnd: endDate,
      });

      // Prepare update data
      const missionUpdateData = {
        id: missionId,
        title: updateData.title,
        description: updateData.description,
        type: updateData.type,
        platform: updateData.platform,
        reward: updateData.reward,
        level_required: updateData.level_required,
        action_request: updateData.action_request,
        format: updateData.format,
        useful_link: updateData.useful_link,
        requirements: updateData.requirements || "{}",
        repeatable: updateData.repeatable || 0,
        startDate: startDate,
        endDate: endDate,
        regex: updateData.regex || "",
        partner: updateData.partner,
        duration:
          updateData.duration ||
          JSON.stringify({
            start: startDate,
            end: endDate,
          }),
        serverId: updateData.serverId || "[]",
      };

      console.log("Updating mission with data:", missionUpdateData);

      const response = await fetch("/api/missions", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(missionUpdateData),
      });

      if (response.ok) {
        toast.success("Mission updated successfully!", toastStyles.success);
        await fetchMissions();
        return true;
      } else {
        const errorData = await response.json();
        console.error("Update API Error Response:", errorData);
        toast.error(`Failed to update mission: ${errorData.error}`, toastStyles.error);
        return false;
      }
    } catch (error) {
      console.error("Error updating mission:", error);
      toast.error("Failed to update mission. Please try again.", toastStyles.error);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete Mission Handler
  const handleDeleteMission = async (missionId: string | number) => {
    try {
      setIsSubmitting(true);
      console.log("Attempting to delete mission with ID:", missionId);

      // Ensure missionId is a string
      const id = String(missionId);

      const response = await fetch(
        `/api/missions?id=${encodeURIComponent(id)}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          signal: AbortSignal.timeout(30000), // 30 second timeout
        }
      );

      console.log("Delete response status:", response.status);
      console.log("Delete response headers:", response.headers);

      if (response.ok) {
        // อัพเดท state ทันทีเพื่อให้ UI สมจริง
        setMissions((prevMissions) =>
          prevMissions.filter((mission) => mission.id !== missionId)
        );

        let result;
        try {
          result = await response.json();
          console.log("Delete result:", result);
        } catch {
          console.warn("Success response is not JSON, treating as success");
          result = { message: "Mission deleted successfully" };
        }

        toast.success("Mission deleted successfully!", toastStyles.delete);

        // Refresh data from server
        await fetchMissions();
        return true;
      } else {
        // Handle error responses
        const contentType = response.headers.get("content-type");
        console.log("Error response content-type:", contentType);

        let errorData;
        try {
          if (contentType && contentType.includes("application/json")) {
            errorData = await response.json();
          } else {
            const errorText = await response.text();
            console.log("Non-JSON error response:", errorText);
            errorData = {
              error: `HTTP ${response.status} ${response.statusText}`,
              details: errorText || "Server error occurred",
            };
          }
        } catch (parseError) {
          console.error("Failed to parse error response:", parseError);
          errorData = {
            error: `HTTP ${response.status} ${response.statusText}`,
            details: "Failed to parse server response",
          };
        }

        console.error("Delete API Error Response:", errorData);

        let errorMessage = "Failed to delete mission";
        if (response.status === 404) {
          errorMessage = "Mission not found or already deleted";
        } else if (response.status === 403) {
          errorMessage = "You don't have permission to delete this mission";
        } else if (response.status === 500) {
          errorMessage =
            errorData.details || errorData.error || "Server error occurred";
        } else if (response.status === 503) {
          errorMessage =
            "Service temporarily unavailable. Please check your internet connection.";
        } else if (errorData.details) {
          errorMessage = errorData.details;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        }

        toast.error(`Failed to delete mission: ${errorMessage}`, toastStyles.error);
        return false;
      }
    } catch (error) {
      console.error("Error deleting mission:", error);

      let errorMessage = "Failed to delete mission";

      if (error instanceof TypeError && error.message.includes("fetch")) {
        errorMessage =
          "Network connection failed. Please check your internet connection and try again.";
      } else if (error instanceof DOMException && error.name === "AbortError") {
        errorMessage = "Request timed out. Please try again.";
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast.error(`Network error: ${errorMessage}`, toastStyles.error);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const openViewModal = (mission: Mission) => {
    setSelectedMission(mission);
    setIsViewModalOpen(true);
  };

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, currentPage: page }));
  };

  const handleItemsPerPageChange = (value: string) => {
    setPagination((prev) => ({
      ...prev,
      itemsPerPage: parseInt(value),
      currentPage: 1,
    }));
  };

  const setSelectedStatus = (status: string | null) => {
    setFilters((prev) => ({ ...prev, selectedStatus: status }));
  };

  return {
    // Data
    missions: paginatedMissions,
    isLoading,
    isSubmitting,
    statusStats,
    totalMissions: missions.length,

    // State
    sortState,
    filters,
    pagination,
    columnVisibility,
    newMission,
    selectedMission,
    isAddModalOpen,
    isViewModalOpen,
    searchQuery,

    // Handlers
    handleSort,
    toggleColumnVisibility,
    handleAddMission,
    handleUpdateMission,
    handleDeleteMission,
    openViewModal,
    handlePageChange,
    handleItemsPerPageChange,
    setSelectedStatus,
    setNewMission,
    setSelectedMission,
    setIsAddModalOpen,
    setIsViewModalOpen,
    fetchMissions,
    handleSearchChange,
    handleResetFilter, 
  };
};