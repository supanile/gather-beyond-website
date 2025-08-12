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
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
      <div className="flex items-center gap-2">
        {/* Empty space for consistency - can add filters here later */}
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center">
          <span className="text-xs text-muted-foreground sm:text-sm whitespace-nowrap">
            Showing {startIndex + 1}-{endIndex} of {pagination.total} users
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-xs text-muted-foreground sm:text-sm whitespace-nowrap">
            Show:
          </span>
          <Select
            value={pagination.pageSize.toString()}
            onValueChange={(value) => onPageSizeChange(parseInt(value))}
          >
            <SelectTrigger className="w-18 h-7 text-xs sm:w-20 sm:h-8 sm:text-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10" className="text-xs sm:text-sm">10</SelectItem>
              <SelectItem value="25" className="text-xs sm:text-sm">25</SelectItem>
              <SelectItem value="50" className="text-xs sm:text-sm">50</SelectItem>
              <SelectItem value="100" className="text-xs sm:text-sm">100</SelectItem>
            </SelectContent>
          </Select>
          
          {/* Column Visibility Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs h-7 px-2 sm:text-sm sm:h-8 sm:px-3 cursor-pointer"
              >
                <Settings2 className="h-3 w-3 mr-1 sm:h-4 sm:w-4 sm:mr-2" />
                <span className="hidden xs:inline sm:inline">View</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44 sm:w-48">
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
    </div>
  );
};