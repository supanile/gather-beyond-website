import React from "react";
import { Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ColumnVisibility, PaginationState } from "@/types/admin/missions/missionTypes";

interface MissionTableControlsProps {
  selectedStatus: string | null;
  onResetFilter: () => void;
  pagination: PaginationState;
  onItemsPerPageChange: (value: string) => void;
  columnVisibility: ColumnVisibility;
  onToggleColumnVisibility: (column: keyof ColumnVisibility) => void;
}

export const MissionTableControls: React.FC<MissionTableControlsProps> = ({
  selectedStatus,
  onResetFilter,
  pagination,
  onItemsPerPageChange,
  columnVisibility,
  onToggleColumnVisibility,
}) => {
  const startIndex = (pagination.currentPage - 1) * pagination.itemsPerPage;
  const endIndex = Math.min(startIndex + pagination.itemsPerPage, pagination.totalItems);

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="flex items-center gap-2">
        {selectedStatus && (
          <Button
            variant="destructive"
            size="sm"
            onClick={onResetFilter}
          >
            Reset Filter
          </Button>
        )}
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground mr-4">
            Showing {startIndex + 1}-{endIndex} of {pagination.totalItems} missions
          </span>
          <span className="text-sm text-muted-foreground whitespace-nowrap">
            Show:
          </span>
          <Select
            value={pagination.itemsPerPage.toString()}
            onValueChange={onItemsPerPageChange}
          >
            <SelectTrigger className="w-20 h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Settings2 className="h-4 w-4 mr-2" />
              View
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[180px]">
            <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {Object.entries(columnVisibility).map(([key, value]) => (
              <DropdownMenuCheckboxItem
                key={key}
                checked={value}
                onCheckedChange={() =>
                  onToggleColumnVisibility(key as keyof ColumnVisibility)
                }
              >
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};