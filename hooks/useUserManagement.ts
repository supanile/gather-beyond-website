import { useState, useEffect, useMemo } from "react";
import {
  UserWithAgent,
  SortConfig,
  FilterConfig,
  PaginationConfig,
} from "@/types/admin/userManagement";

interface UseUserManagementProps {
  users: UserWithAgent[];
}

export const useUserManagement = ({ users }: UseUserManagementProps) => {
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    field: "email",
    direction: "asc",
  });

  const [filterConfig, setFilterConfig] = useState<FilterConfig>({
    search: "",
    mood: [],
    healthRange: [0, 100],
    levelRange: [1, 100],
    interests: [],
  });

  const [pagination, setPagination] = useState<PaginationConfig>({
    page: 1,
    pageSize: 10,
    total: 0,
  });

  // Helper function to get nested value
  const getNestedValue = (obj: any, path: string): any => {
    return path.split(".").reduce((current, key) => current?.[key], obj);
  };

  // Filter users based on filter config
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      // Search filter - now includes Discord ID
      if (filterConfig.search) {
        const searchTerm = filterConfig.search.toLowerCase();
        const searchableFields = [
          user.email,
          user.interests,
          user.twitter_handle,
          user.telegram_handle,
          user.discord_id,
        ].filter(Boolean);

        const matchesSearch = searchableFields.some((field) =>
          field.toLowerCase().includes(searchTerm)
        );

        if (!matchesSearch) return false;
      }

      // Mood filter
      if (filterConfig.mood.length > 0 && user.agent) {
        if (!filterConfig.mood.includes(user.agent.mood)) return false;
      }

      // Health range filter
      if (user.agent) {
        if (
          user.agent.health < filterConfig.healthRange[0] ||
          user.agent.health > filterConfig.healthRange[1]
        )
          return false;
      }

      // Level range filter
      if (user.agent) {
        if (
          user.agent.level < filterConfig.levelRange[0] ||
          user.agent.level > filterConfig.levelRange[1]
        )
          return false;
      }

      // Interests filter
      if (filterConfig.interests.length > 0) {
        const userInterests = user.interests
          .toLowerCase()
          .split(",")
          .map((i) => i.trim());
        const hasMatchingInterest = filterConfig.interests.some((interest) =>
          userInterests.some((userInterest) =>
            userInterest.includes(interest.toLowerCase())
          )
        );
        if (!hasMatchingInterest) return false;
      }

      return true;
    });
  }, [users, filterConfig]);

  // Sort filtered users
  const sortedUsers = useMemo(() => {
    const sorted = [...filteredUsers].sort((a, b) => {
      let aValue = getNestedValue(a, sortConfig.field);
      let bValue = getNestedValue(b, sortConfig.field);

      // Handle null/undefined values
      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return 1;
      if (bValue == null) return -1;

      // Handle string sorting
      if (typeof aValue === "string" && typeof bValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
        return sortConfig.direction === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      // Handle number sorting
      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortConfig.direction === "asc"
          ? aValue - bValue
          : bValue - aValue;
      }

      return 0;
    });

    return sorted;
  }, [filteredUsers, sortConfig]);

  // Paginated users
  const paginatedUsers = useMemo(() => {
    const startIndex = (pagination.page - 1) * pagination.pageSize;
    const endIndex = startIndex + pagination.pageSize;
    return sortedUsers.slice(startIndex, endIndex);
  }, [sortedUsers, pagination.page, pagination.pageSize]);

  // Update total when filtered users change
  useEffect(() => {
    setPagination((prev) => ({
      ...prev,
      total: filteredUsers.length,
      page: 1, // Reset to first page when filters change
    }));
  }, [filteredUsers.length]);

  const handleSort = (field: SortConfig["field"]) => {
    setSortConfig((prev) => ({
      field,
      direction:
        prev.field === field && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleFilter = (newFilter: Partial<FilterConfig>) => {
    setFilterConfig((prev) => ({ ...prev, ...newFilter }));
  };

  const handlePagination = (newPagination: Partial<PaginationConfig>) => {
    setPagination((prev) => ({ ...prev, ...newPagination }));
  };

  const resetFilters = () => {
    setFilterConfig({
      search: "",
      mood: [],
      healthRange: [0, 100],
      levelRange: [1, 100],
      interests: [],
    });
  };

  // Get unique values for filter options
  const filterOptions = useMemo(() => {
    const moods = Array.from(
      new Set(users.map((u) => u.agent?.mood).filter(Boolean))
    );
    const interests = Array.from(
      new Set(
        users.flatMap((u) => u.interests?.split(",").map((i) => i.trim()) || [])
      )
    ).filter(Boolean);

    return {
      moods,
      interests,
    };
  }, [users]);

  return {
    sortConfig,
    filterConfig,
    pagination,
    paginatedUsers,
    filteredUsers,
    sortedUsers,
    filterOptions,
    handleSort,
    handleFilter,
    handlePagination,
    resetFilters,
    totalPages: Math.ceil(pagination.total / pagination.pageSize),
  };
};