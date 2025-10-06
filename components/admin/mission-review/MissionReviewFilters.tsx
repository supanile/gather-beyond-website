"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { MissionReviewFilters } from "@/types/admin/missionReview";
import { Search, Filter, X } from "lucide-react";

interface MissionReviewFiltersProps {
  filters: MissionReviewFilters;
  onFiltersChange: (filters: MissionReviewFilters) => void;
  onClearFilters: () => void;
}

export function MissionReviewFiltersComponent({
  filters,
  onFiltersChange,
  onClearFilters,
}: MissionReviewFiltersProps) {
  const updateFilter = (key: keyof MissionReviewFilters, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const hasActiveFilters =
    filters.status !== "all" ||
    filters.searchQuery !== "";

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Status Filter */}
          <div className="flex-1 min-w-48">
            <Select
              value={filters.status}
              onValueChange={(value) => updateFilter("status", value)}
            >
              <SelectTrigger className="w-full">
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-gray-500" />
                  <SelectValue placeholder="Filter by status" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="accepted">Accepted</SelectItem>
                <SelectItem value="submitted">Submitted</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Universal Search */}
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
              <Input
                type="text"
                placeholder="Search by Username, User ID, Mission Name, Status, or Link/Email..."
                value={filters.searchQuery}
                onChange={(e) => updateFilter("searchQuery", e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Clear Search Button */}
          {hasActiveFilters && (
            <Button
              onClick={onClearFilters}
              className="flex items-center gap-2 whitespace-nowrap bg-red-600 hover:bg-red-700 focus-visible:ring-2 focus-visible:ring-red-400 text-white"
            >
              <X className="w-4 h-4 text-white" />
              Clear Search
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
