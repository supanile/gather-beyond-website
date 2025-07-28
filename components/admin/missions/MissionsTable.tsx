import React from "react";
import {
  Eye,
  Edit,
  Trash2,
  ChevronsUpDown,
  ChevronUp,
  ChevronDown,
  EyeOff,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Mission,
  SortState,
  ColumnVisibility,
} from "@/types/admin/missions/missionTypes";
import {
  getStatusColor,
  parseReward,
} from "@/lib/admin/missions/missionTableUtils";

interface MissionsTableProps {
  missions: Mission[];
  isLoading: boolean;
  sortState: SortState;
  columnVisibility: ColumnVisibility;
  onSort: (field: keyof Mission) => void;
  onToggleColumnVisibility: (column: keyof ColumnVisibility) => void;
  onViewMission: (mission: Mission) => void;
  onEditMission: (mission: Mission) => void;
  onDeleteMission: (mission: Mission) => void;
  totalVisibleColumns: number;
}

// Function to display date and time (uses the same format as formatDate but adds time)
// Modified function to display date and time
const formatDateWithTime = (
  dateValue: string | number | null | undefined
): string => {
  if (!dateValue) return "N/A";

  try {
    let date: Date;

    // ตรวจสอบว่าเป็น Unix timestamp (number) or ISO string
    if (typeof dateValue === "number") {
      // Unix timestamp
      date = new Date(dateValue * 1000);
    } else if (typeof dateValue === "string") {
      // ISO string or date string
      date = new Date(dateValue);
    } else {
      return "N/A";
    }

    if (isNaN(date.getTime())) return "N/A";

    // Change it to Bangkok timezone (UTC+7)
    const bangkokDate = new Date(date.getTime() + 7 * 60 * 60 * 1000);

    // Format DD/MM/YYYY
    const day = bangkokDate.getUTCDate().toString().padStart(2, "0");
    const month = (bangkokDate.getUTCMonth() + 1).toString().padStart(2, "0");
    const year = bangkokDate.getUTCFullYear();

    // Format HH:MM
    const hours = bangkokDate.getUTCHours().toString().padStart(2, "0");
    const minutes = bangkokDate.getUTCMinutes().toString().padStart(2, "0");

    return `${day}/${month}/${year} ${hours}:${minutes}`;
  } catch (error) {
    console.error("Error formatting date with time:", error);
    return "N/A";
  }
};

export const MissionsTable: React.FC<MissionsTableProps> = ({
  missions,
  isLoading,
  sortState,
  columnVisibility,
  onSort,
  onToggleColumnVisibility,
  onViewMission,
  onEditMission,
  onDeleteMission,
  totalVisibleColumns,
}) => {
  const getSortIcon = (field: keyof Mission) => {
    if (sortState.field !== field) {
      return <ChevronsUpDown className="h-3 w-3" />;
    }
    return sortState.direction === "asc" ? (
      <ChevronUp className="h-3 w-3" />
    ) : (
      <ChevronDown className="h-3 w-3" />
    );
  };

  const LoadingRow = () => (
    <TableRow>
      {Array.from({ length: totalVisibleColumns }).map((_, index) => (
        <TableCell key={index}>
          <Skeleton className="h-4 w-full" />
        </TableCell>
      ))}
    </TableRow>
  );

  const EmptyRow = () => (
    <TableRow>
      <TableCell
        colSpan={totalVisibleColumns}
        className="h-24 text-center text-muted-foreground"
      >
        No missions found.
      </TableCell>
    </TableRow>
  );

  return (
    <div className="w-full">
      <Table className="table-fixed w-full">
        <TableHeader>
          <TableRow>
            {columnVisibility.id && (
              <TableHead className="w-16 px-1">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="h-auto px-0 py-2 font-medium text-foreground hover:text-foreground justify-start text-xs"
                    >
                      ID
                      {getSortIcon("id")}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuItem onClick={() => onSort("id")}>
                      <div className="flex items-center">
                        <ChevronUp className="w-4 h-4 mr-2" />
                        Asc
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onSort("id")}>
                      <div className="flex items-center">
                        <ChevronDown className="w-4 h-4 mr-2" />
                        Desc
                      </div>
                    </DropdownMenuItem>
                    <div className="bg-border -mx-1 my-1 h-px"></div>
                    <DropdownMenuItem
                      onClick={() => onToggleColumnVisibility("id")}
                    >
                      <div className="flex items-center">
                        <EyeOff className="w-4 h-4 mr-2" />
                        Hide
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableHead>
            )}
            {columnVisibility.title && (
              <TableHead className="w-48 px-0">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="h-auto px-0 py-2 font-medium text-foreground hover:text-foreground justify-start text-xs"
                    >
                      Title
                      {getSortIcon("title")}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuItem onClick={() => onSort("title")}>
                      <div className="flex items-center">
                        <ChevronUp className="w-4 h-4 mr-2" />
                        Asc
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onSort("title")}>
                      <div className="flex items-center">
                        <ChevronDown className="w-4 h-4 mr-2" />
                        Desc
                      </div>
                    </DropdownMenuItem>
                    <div className="bg-border -mx-1 my-1 h-px"></div>
                    <DropdownMenuItem
                      onClick={() => onToggleColumnVisibility("title")}
                    >
                      <div className="flex items-center">
                        <EyeOff className="w-4 h-4 mr-2" />
                        Hide
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableHead>
            )}
            {columnVisibility.type && (
              <TableHead className="w-20 px-0">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="h-auto px-0 py-2 font-medium text-foreground hover:text-foreground justify-start text-xs"
                    >
                      Type
                      {getSortIcon("type")}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuItem onClick={() => onSort("type")}>
                      <div className="flex items-center">
                        <ChevronUp className="w-4 h-4 mr-2" />
                        Asc
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onSort("type")}>
                      <div className="flex items-center">
                        <ChevronDown className="w-4 h-4 mr-2" />
                        Desc
                      </div>
                    </DropdownMenuItem>
                    <div className="bg-border -mx-1 my-1 h-px"></div>
                    <DropdownMenuItem
                      onClick={() => onToggleColumnVisibility("type")}
                    >
                      <div className="flex items-center">
                        <EyeOff className="w-4 h-4 mr-2" />
                        Hide
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableHead>
            )}
            {columnVisibility.platform && (
              <TableHead className="w-20 px-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="h-auto px-0 py-2 font-medium text-foreground hover:text-foreground justify-start text-xs"
                    >
                      Platform
                      {getSortIcon("platform")}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuItem onClick={() => onSort("platform")}>
                      <div className="flex items-center">
                        <ChevronUp className="w-4 h-4 mr-2" />
                        Asc
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onSort("platform")}>
                      <div className="flex items-center">
                        <ChevronDown className="w-4 h-4 mr-2" />
                        Desc
                      </div>
                    </DropdownMenuItem>
                    <div className="bg-border -mx-1 my-1 h-px"></div>
                    <DropdownMenuItem
                      onClick={() => onToggleColumnVisibility("platform")}
                    >
                      <div className="flex items-center">
                        <EyeOff className="w-4 h-4 mr-2" />
                        Hide
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableHead>
            )}
            {columnVisibility.status && (
              <TableHead className="w-20 px-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="h-auto px-0 py-2 font-medium text-foreground hover:text-foreground justify-start text-xs"
                    >
                      Status
                      {getSortIcon("status")}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuItem onClick={() => onSort("status")}>
                      <div className="flex items-center">
                        <ChevronUp className="w-4 h-4 mr-2" />
                        Asc
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onSort("status")}>
                      <div className="flex items-center">
                        <ChevronDown className="w-4 h-4 mr-2" />
                        Desc
                      </div>
                    </DropdownMenuItem>
                    <div className="bg-border -mx-1 my-1 h-px"></div>
                    <DropdownMenuItem
                      onClick={() => onToggleColumnVisibility("status")}
                    >
                      <div className="flex items-center">
                        <EyeOff className="w-4 h-4 mr-2" />
                        Hide
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableHead>
            )}
            {columnVisibility.reward && (
              <TableHead className="w-20 px-0">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="h-auto px-0 py-2 font-medium text-foreground hover:text-foreground justify-start text-xs"
                    >
                      Reward
                      {getSortIcon("reward")}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuItem onClick={() => onSort("reward")}>
                      <div className="flex items-center">
                        <ChevronUp className="w-4 h-4 mr-2" />
                        Asc
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onSort("reward")}>
                      <div className="flex items-center">
                        <ChevronDown className="w-4 h-4 mr-2" />
                        Desc
                      </div>
                    </DropdownMenuItem>
                    <div className="bg-border -mx-1 my-1 h-px"></div>
                    <DropdownMenuItem
                      onClick={() => onToggleColumnVisibility("reward")}
                    >
                      <div className="flex items-center">
                        <EyeOff className="w-4 h-4 mr-2" />
                        Hide
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableHead>
            )}
            {columnVisibility.partner && (
              <TableHead className="w-28 px-0">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="h-auto px-0 py-2 font-medium text-foreground hover:text-foreground justify-start text-xs"
                    >
                      Partner
                      {getSortIcon("partnerName")}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuItem onClick={() => onSort("partnerName")}>
                      <div className="flex items-center">
                        <ChevronUp className="w-4 h-4 mr-2" />
                        Asc
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onSort("partnerName")}>
                      <div className="flex items-center">
                        <ChevronDown className="w-4 h-4 mr-2" />
                        Desc
                      </div>
                    </DropdownMenuItem>
                    <div className="bg-border -mx-1 my-1 h-px"></div>
                    <DropdownMenuItem
                      onClick={() => onToggleColumnVisibility("partner")}
                    >
                      <div className="flex items-center">
                        <EyeOff className="w-4 h-4 mr-2" />
                        Hide
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableHead>
            )}
            {columnVisibility.startDate && (
              <TableHead className="w-32 px-0">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="h-auto px-0 py-2 font-medium text-foreground hover:text-foreground justify-start text-xs"
                    >
                      Start Date
                      {getSortIcon("startDate")}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuItem onClick={() => onSort("startDate")}>
                      <div className="flex items-center">
                        <ChevronUp className="w-4 h-4 mr-2" />
                        Asc
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onSort("startDate")}>
                      <div className="flex items-center">
                        <ChevronDown className="w-4 h-4 mr-2" />
                        Desc
                      </div>
                    </DropdownMenuItem>
                    <div className="bg-border -mx-1 my-1 h-px"></div>
                    <DropdownMenuItem
                      onClick={() => onToggleColumnVisibility("startDate")}
                    >
                      <div className="flex items-center">
                        <EyeOff className="w-4 h-4 mr-2" />
                        Hide
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableHead>
            )}
            {columnVisibility.endDate && (
              <TableHead className="w-32 px-0">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="h-auto px-0 py-2 font-medium text-foreground hover:text-foreground justify-start text-xs"
                    >
                      End Date
                      {getSortIcon("endDate")}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuItem onClick={() => onSort("endDate")}>
                      <div className="flex items-center">
                        <ChevronUp className="w-4 h-4 mr-2" />
                        Asc
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onSort("endDate")}>
                      <div className="flex items-center">
                        <ChevronDown className="w-4 h-4 mr-2" />
                        Desc
                      </div>
                    </DropdownMenuItem>
                    <div className="bg-border -mx-1 my-1 h-px"></div>
                    <DropdownMenuItem
                      onClick={() => onToggleColumnVisibility("endDate")}
                    >
                      <div className="flex items-center">
                        <EyeOff className="w-4 h-4 mr-2" />
                        Hide
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableHead>
            )}
            <TableHead className="w-28 px-0 text-xs">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 5 }).map((_, index) => (
              <LoadingRow key={index} />
            ))
          ) : missions.length === 0 ? (
            <EmptyRow />
          ) : (
            missions.map((mission) => {
              const reward = parseReward(mission.reward);

              return (
                <TableRow key={mission.id} className="hover:bg-muted/50">
                  {/* Ensure exact same order as header */}
                  {columnVisibility.id && (
                    <TableCell className="font-medium px-4 text-xs">
                      {mission.id}
                    </TableCell>
                  )}
                  {columnVisibility.title && (
                    <TableCell className="px-3">
                      <div className="w-full">
                        <div
                          className="truncate font-medium text-xs"
                          title={mission.title}
                        >
                          {mission.title}
                        </div>
                        {mission.description && (
                          <div
                            className="text-xs text-muted-foreground truncate mt-1"
                            title={mission.description}
                          >
                            {mission.description}
                          </div>
                        )}
                      </div>
                    </TableCell>
                  )}
                  {columnVisibility.type && (
                    <TableCell className="px-3">
                      <Badge variant="secondary" className="capitalize text-xs">
                        {mission.type}
                      </Badge>
                    </TableCell>
                  )}
                  {columnVisibility.platform && (
                    <TableCell className="px-6">
                      <span className="capitalize text-xs">
                        {mission.platform}
                      </span>
                    </TableCell>
                  )}
                  {columnVisibility.status && (
                    <TableCell className="px-5">
                      <Badge
                        className={`${getStatusColor(mission.status)} text-xs`}
                      >
                        {mission.status}
                      </Badge>
                    </TableCell>
                  )}
                  {columnVisibility.reward && (
                    <TableCell className="px-3">
                      <div className="font-medium text-xs">
                        {reward.amount} {reward.token}
                      </div>
                    </TableCell>
                  )}
                  {columnVisibility.partner && (
                    <TableCell className="px-3">
                      <div
                        className="w-full truncate text-xs"
                        title={mission.partnerName}
                      >
                        {mission.partnerName || "N/A"}
                      </div>
                    </TableCell>
                  )}
                  {columnVisibility.startDate && (
                    <TableCell className="px-3 text-xs">
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {formatDateWithTime(mission.startDate)}
                        </span>
                      </div>
                    </TableCell>
                  )}
                  {columnVisibility.endDate && (
                    <TableCell className="px-3 text-xs">
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {formatDateWithTime(mission.endDate)}
                        </span>
                      </div>
                    </TableCell>
                  )}
                  {/* Actions column - always visible */}
                  <TableCell className="px-0">
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewMission(mission)}
                        className="h-6 w-6 p-0"
                        title="View Mission"
                      >
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEditMission(mission)}
                        className="h-6 w-6 p-0 hover:text-blue-600"
                        title="Edit Mission"
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          console.log(
                            "Delete button clicked for mission:",
                            mission.id,
                            mission.title
                          );
                          onDeleteMission(mission);
                        }}
                        className="h-6 w-6 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                        title="Delete Mission"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </div>
  );
};
