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
import { formatDateWithTime } from "@/lib/admin/missions/timezoneUtils";

interface MissionsTableProps {
  missions: Mission[];
  sortState: SortState;
  columnVisibility: ColumnVisibility;
  onSort: (field: keyof Mission) => void;
  onToggleColumnVisibility: (column: keyof ColumnVisibility) => void;
  onViewMission: (mission: Mission) => void;
  onEditMission: (mission: Mission) => void;
  onDeleteMission: (mission: Mission) => void;
  totalVisibleColumns: number;
}

// Function moved to timezoneUtils.ts for better reusability

export const MissionsTable: React.FC<MissionsTableProps> = ({
  missions,
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

  // ฟังก์ชันสำหรับการ sort แยกแต่ละ direction
  const handleSort = (field: keyof Mission, direction: "asc" | "desc") => {
    // ถ้าเป็น field เดียวกันแต่ direction ต่าง หรือ field ต่าง ให้ส่ง field ไป
    // logic การ toggle จะถูกจัดการใน parent component
    if (sortState.field === field && sortState.direction === direction) {
      return; // ไม่ทำอะไรถ้าเลือกแบบเดียวกัน
    }
    onSort(field);
  };

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

  // ฟังก์ชันสร้าง dropdown สำหรับแต่ละ column
  const createColumnHeader = (
    field: keyof Mission,
    label: string,
    className: string
  ) => (
    <TableHead className={className}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-auto px-0 py-2 font-medium text-foreground hover:text-foreground justify-start text-xs"
          >
            {label}
            {getSortIcon(field)}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => handleSort(field, "asc")}>
            <div className="flex items-center">
              <ChevronUp className="w-4 h-4 mr-2" />
              Asc
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleSort(field, "desc")}>
            <div className="flex items-center">
              <ChevronDown className="w-4 h-4 mr-2" />
              Desc
            </div>
          </DropdownMenuItem>
          <div className="bg-border -mx-1 my-1 h-px"></div>
          <DropdownMenuItem
            onClick={() =>
              onToggleColumnVisibility(field as keyof ColumnVisibility)
            }
          >
            <div className="flex items-center">
              <EyeOff className="w-4 h-4 mr-2" />
              Hide
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </TableHead>
  );

  return (
    <div className="w-full">
      <Table className="table-fixed w-full">
        <TableHeader>
          <TableRow>
            {columnVisibility.id && createColumnHeader("id", "ID", "w-16 px-1")}
            {columnVisibility.title &&
              createColumnHeader("title", "Title", "w-48 px-0")}
            {columnVisibility.type &&
              createColumnHeader("type", "Type", "w-20 px-0")}
            {columnVisibility.platform &&
              createColumnHeader("platform", "Platform", "w-20 px-3")}
            {columnVisibility.status &&
              createColumnHeader("status", "Status", "w-20 px-2")}
            {columnVisibility.reward &&
              createColumnHeader("reward", "Reward", "w-20 px-0")}
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
                    <DropdownMenuItem
                      onClick={() => handleSort("partnerName", "asc")}
                    >
                      <div className="flex items-center">
                        <ChevronUp className="w-4 h-4 mr-2" />
                        Asc
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleSort("partnerName", "desc")}
                    >
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
            {columnVisibility.startDate &&
              createColumnHeader("startDate", "Start Date", "w-32 px-0")}
            {columnVisibility.endDate &&
              createColumnHeader("endDate", "End Date", "w-32 px-0")}
            <TableHead className="w-28 px-0 text-xs">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {missions.length === 0 ? (
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
                      <div
                        className="font-medium text-xs truncate w-full"
                        title={`${reward.amount} ${reward.token}`}
                      >
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
                        className="h-6 w-6 p-0 cursor-pointer"
                        title="View Mission"
                      >
                        <Eye className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEditMission(mission)}
                        className="h-6 w-6 p-0 hover:text-blue-600 cursor-pointer"
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
                        className="h-6 w-6 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer"
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