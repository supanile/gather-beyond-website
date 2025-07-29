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
  });

  // Fetch missions data
  const fetchMissions = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/missions");
      if (response.ok) {
        const data = await response.json();
        setMissions(data);
        toast.success("Missions loaded successfully");
      } else {
        const errorData = await response.json();
        console.error("Failed to fetch missions:", errorData);
        toast.error("Failed to load missions");
        setMissions([]);
      }
    } catch (error) {
      console.error("Error fetching missions:", error);
      toast.error("Error loading missions");
      setMissions([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMissions();
  }, []);

  // Reset to first page when filters change
  useEffect(() => {
    setPagination((prev) => ({ ...prev, currentPage: 1 }));
  }, [filters.selectedStatus, pagination.itemsPerPage]);

  // Filtered missions
  const filteredMissions = useMemo(() => {
    return filters.selectedStatus
      ? missions.filter((mission) => mission.status === filters.selectedStatus)
      : missions;
  }, [missions, filters.selectedStatus]);

  // Sorted missions
  const sortedMissions = useMemo(() => {
    if (!sortState.field) return filteredMissions;

    return [...filteredMissions].sort((a, b) => {
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

  // Status statistics
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
        "status",
        "partner",
      ];
      for (const field of requiredFields) {
        if (!newMission[field as keyof NewMissionForm]) {
          toast.error(`Please fill in the ${field} field`);
          return;
        }
      }

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
        startDate: newMission.startDate || new Date().toISOString(),
        endDate: newMission.endDate || null,
        regex: newMission.regex || "",
        partner: newMission.partner,
        duration:
          newMission.duration ||
          JSON.stringify({
            start: new Date().toISOString(),
            end: null,
          }),
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
        const result = await response.json();
        toast.success("Mission added successfully!");
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
        });

        await fetchMissions();
      } else {
        const errorData = await response.json();
        console.error("API Error Response:", errorData);
        toast.error(`Failed to add mission: ${errorData.error}`);
        if (errorData.details) {
          console.error("Error details:", errorData.details);
        }
      }
    } catch (error) {
      console.error("Error adding mission:", error);
      toast.error("Failed to add mission. Please try again.");
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
        startDate: updateData.startDate || new Date().toISOString(),
        endDate: updateData.endDate || null,
        regex: updateData.regex || "",
        partner: updateData.partner, // Use partnerName
        duration:
          updateData.duration ||
          JSON.stringify({
            start: new Date().toISOString(),
            end: null,
          }),
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
        toast.success("Mission updated successfully!");
        await fetchMissions();
        return true;
      } else {
        const errorData = await response.json();
        console.error("Update API Error Response:", errorData);
        toast.error(`Failed to update mission: ${errorData.error}`);
        return false;
      }
    } catch (error) {
      console.error("Error updating mission:", error);
      toast.error("Failed to update mission. Please try again.");
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
        } catch (parseError) {
          console.warn("Success response is not JSON, treating as success");
          result = { message: "Mission deleted successfully" };
        }

        toast.success("Mission deleted successfully!");

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

        toast.error(`Failed to delete mission: ${errorMessage}`);
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

      toast.error(`Network error: ${errorMessage}`);
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
    setIsAddModalOpen,
    setIsViewModalOpen,
    fetchMissions,
  };
};
