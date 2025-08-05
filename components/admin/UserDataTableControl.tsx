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

interface ColumnVisibility {
  email: boolean;
  xp: boolean;
  level: boolean;
  mood: boolean;
  health: boolean;
  interests: boolean;
  lastActive: boolean;
  joinedDate: boolean;
}

interface UserDataPaginationState {
  page: number;
  pageSize: number;
  total: number;
}

interface UserDataTableControlsProps {
  pagination: UserDataPaginationState;
  onPageSizeChange: (pageSize: number) => void;
  columnVisibility: ColumnVisibility;
  onToggleColumnVisibility: (column: keyof ColumnVisibility) => void;
}

export const UserDataTableControls: React.FC<UserDataTableControlsProps> = ({
  pagination,
  onPageSizeChange,
  columnVisibility,
  onToggleColumnVisibility,
}) => {
  const startIndex = (pagination.page - 1) * pagination.pageSize;
  const endIndex = Math.min(startIndex + pagination.pageSize, pagination.total);

  // Helper function to format column labels
  const getColumnLabel = (key: string): string => {
    const labelMap: Record<string, string> = {
      email: "User Email",
      xp: "XP",
      level: "Level",
      mood: "Mood",
      health: "Health",
      interests: "Interests",
      lastActive: "Last Active",
      joinedDate: "Joined Date",
    };
    
    return labelMap[key] || key.charAt(0).toUpperCase() + key.slice(1);
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="flex items-center gap-2">
        {/* Empty space for consistency - can add filters here later */}
      </div>

      <div className="flex items-center gap-2">
        <div className="flex items-center space-x-2">
          <span className="text-xs sm:text-sm text-muted-foreground mr-2 sm:mr-4 whitespace-nowrap">
            Showing {startIndex + 1}-{endIndex} of {pagination.total} users
          </span>
          <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
            Show:
          </span>
          <Select
            value={pagination.pageSize.toString()}
            onValueChange={(value) => onPageSizeChange(parseInt(value))}
          >
            <SelectTrigger className="w-16 sm:w-20 h-7 sm:h-8 text-xs sm:text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10" className="text-xs sm:text-sm">10</SelectItem>
              <SelectItem value="25" className="text-xs sm:text-sm">25</SelectItem>
              <SelectItem value="50" className="text-xs sm:text-sm">50</SelectItem>
              <SelectItem value="100" className="text-xs sm:text-sm">100</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Column Visibility Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs sm:text-sm h-7 sm:h-8"
            >
              <Settings2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              View
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[160px] sm:w-[180px]">
            <DropdownMenuLabel className="text-xs sm:text-sm">
              Toggle columns
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {Object.entries(columnVisibility).map(([key, value]) => (
              <DropdownMenuCheckboxItem
                key={key}
                checked={value}
                onCheckedChange={() =>
                  onToggleColumnVisibility(key as keyof ColumnVisibility)
                }
                className="text-xs sm:text-sm"
              >
                {getColumnLabel(key)}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};