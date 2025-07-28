import React from "react";
import { Mission } from "@/types/admin/adminTypes";
import {
  Eye,
  ExternalLink,
  MoreHorizontal,
  Settings2,
  ChevronsUpDown,
  ChevronUp,
  ChevronDown,
  EyeOff,
} from "lucide-react";
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
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  formatDate, 
  getStatusVariant, 
  getStatusColor, 
  getLinkType 
} from "@/lib/admin/user/userTableUtils";

interface ColumnVisibility {
  missionId: boolean;
  status: boolean;
  acceptedAt: boolean;
  submittedAt: boolean;
  completedAt: boolean;
  submissionLink: boolean;
}

interface UserMissionsTableProps {
  paginatedMissions: Mission[];
  isLoading: boolean;
  columnVisibility: ColumnVisibility;
  sortConfig: {
    field: string | null;
    direction: "asc" | "desc";
  };
  onSort: (field: keyof Mission) => void;
  onToggleColumnVisibility: (column: keyof ColumnVisibility) => void;
  onOpenModal: (mission: Mission) => void;
}

const UserMissionsTable: React.FC<UserMissionsTableProps> = ({
  paginatedMissions,
  isLoading,
  columnVisibility,
  sortConfig,
  onSort,
  onToggleColumnVisibility,
  onOpenModal,
}) => {
  return (
    <div className="mt-4 sm:mt-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 sm:mb-3 gap-2">
        <h4 className="text-sm sm:text-md font-semibold text-foreground">
          Mission Details
        </h4>

        {/* Column Visibility Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="text-xs sm:text-sm">
              <Settings2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              View
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[160px] sm:w-[180px]">
            <DropdownMenuLabel className="text-xs sm:text-sm">Toggle columns</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem
              checked={columnVisibility.missionId}
              onCheckedChange={() => onToggleColumnVisibility("missionId")}
              className="text-xs sm:text-sm"
            >
              Mission ID
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={columnVisibility.status}
              onCheckedChange={() => onToggleColumnVisibility("status")}
              className="text-xs sm:text-sm"
            >
              Status
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={columnVisibility.acceptedAt}
              onCheckedChange={() => onToggleColumnVisibility("acceptedAt")}
              className="text-xs sm:text-sm"
            >
              Accepted At
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={columnVisibility.submittedAt}
              onCheckedChange={() => onToggleColumnVisibility("submittedAt")}
              className="text-xs sm:text-sm"
            >
              Submitted At
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={columnVisibility.completedAt}
              onCheckedChange={() => onToggleColumnVisibility("completedAt")}
              className="text-xs sm:text-sm"
            >
              Completed At
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={columnVisibility.submissionLink}
              onCheckedChange={() => onToggleColumnVisibility("submissionLink")}
              className="text-xs sm:text-sm"
            >
              Submission Link
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Responsive Data Table */}
      <div className="overflow-x-auto">
        <div className="rounded-md border border-border">
          <Table>
            <TableHeader>
              <TableRow>
                {columnVisibility.missionId && (
                  <TableHead className="w-[80px] sm:w-[100px] min-w-[80px] sm:min-w-[100px]">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-auto p-1 sm:p-2 font-medium text-foreground hover:text-foreground text-xs sm:text-sm"
                        >
                          <span className="hidden sm:inline">Mission ID</span>
                          <span className="sm:hidden">ID</span>
                          {sortConfig.field === "mission_id" ? (
                            sortConfig.direction === "asc" ? (
                              <ChevronUp className="h-2 w-2 sm:h-3 sm:w-3" />
                            ) : (
                              <ChevronDown className="h-2 w-2 sm:h-3 sm:w-3" />
                            )
                          ) : (
                            <ChevronsUpDown className="h-2 w-2 sm:h-3 sm:w-3" />
                          )}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start">
                        <DropdownMenuItem
                          onClick={() => onSort("mission_id")}
                          className="text-xs sm:text-sm"
                        >
                          <div className="flex items-center">
                            <ChevronUp className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                            Asc
                          </div>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onSort("mission_id")}
                          className="text-xs sm:text-sm"
                        >
                          <div className="flex items-center">
                            <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                            Desc
                          </div>
                        </DropdownMenuItem>
                        <div className="bg-border -mx-1 my-1 h-px"></div>
                        <DropdownMenuItem
                          onClick={() => onToggleColumnVisibility("missionId")}
                          className="text-xs sm:text-sm"
                        >
                          <div className="flex items-center">
                            <EyeOff className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                            Hide
                          </div>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableHead>
                )}
                {columnVisibility.status && (
                  <TableHead className="w-[80px] sm:w-[100px] min-w-[80px] sm:min-w-[100px]">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-auto p-1 sm:p-2 font-medium text-foreground hover:text-foreground text-xs sm:text-sm"
                        >
                          Status
                          {sortConfig.field === "status" ? (
                            sortConfig.direction === "asc" ? (
                              <ChevronUp className="h-2 w-2 sm:h-3 sm:w-3" />
                            ) : (
                              <ChevronDown className="h-2 w-2 sm:h-3 sm:w-3" />
                            )
                          ) : (
                            <ChevronsUpDown className="h-2 w-2 sm:h-3 sm:w-3" />
                          )}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start">
                        <DropdownMenuItem
                          onClick={() => onSort("status")}
                          className="text-xs sm:text-sm"
                        >
                          <div className="flex items-center">
                            <ChevronUp className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                            Asc
                          </div>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onSort("status")}
                          className="text-xs sm:text-sm"
                        >
                          <div className="flex items-center">
                            <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                            Desc
                          </div>
                        </DropdownMenuItem>
                        <div className="bg-border -mx-1 my-1 h-px"></div>
                        <DropdownMenuItem
                          onClick={() => onToggleColumnVisibility("status")}
                          className="text-xs sm:text-sm"
                        >
                          <div className="flex items-center">
                            <EyeOff className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                            Hide
                          </div>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableHead>
                )}
                {columnVisibility.acceptedAt && (
                  <TableHead className="w-[100px] sm:w-[140px] min-w-[100px] sm:min-w-[140px]">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-auto p-1 sm:p-2 font-medium text-foreground hover:text-foreground text-xs sm:text-sm"
                        >
                          <span className="hidden sm:inline">Accepted At</span>
                          <span className="sm:hidden">Accepted</span>
                          {sortConfig.field === "accepted_at" ? (
                            sortConfig.direction === "asc" ? (
                              <ChevronUp className="h-2 w-2 sm:h-3 sm:w-3" />
                            ) : (
                              <ChevronDown className="h-2 w-2 sm:h-3 sm:w-3" />
                            )
                          ) : (
                            <ChevronsUpDown className="h-2 w-2 sm:h-3 sm:w-3" />
                          )}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start">
                        <DropdownMenuItem
                          onClick={() => onSort("accepted_at")}
                          className="text-xs sm:text-sm"
                        >
                          <div className="flex items-center">
                            <ChevronUp className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                            Asc
                          </div>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onSort("accepted_at")}
                          className="text-xs sm:text-sm"
                        >
                          <div className="flex items-center">
                            <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                            Desc
                          </div>
                        </DropdownMenuItem>
                        <div className="bg-border -mx-1 my-1 h-px"></div>
                        <DropdownMenuItem
                          onClick={() => onToggleColumnVisibility("acceptedAt")}
                          className="text-xs sm:text-sm"
                        >
                          <div className="flex items-center">
                            <EyeOff className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                            Hide
                          </div>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableHead>
                )}
                {columnVisibility.submittedAt && (
                  <TableHead className="w-[100px] sm:w-[140px] min-w-[100px] sm:min-w-[140px]">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-auto p-1 sm:p-2 font-medium text-foreground hover:text-foreground text-xs sm:text-sm"
                        >
                          <span className="hidden sm:inline">Submitted At</span>
                          <span className="sm:hidden">Submitted</span>
                          {sortConfig.field === "submitted_at" ? (
                            sortConfig.direction === "asc" ? (
                              <ChevronUp className="h-2 w-2 sm:h-3 sm:w-3" />
                            ) : (
                              <ChevronDown className="h-2 w-2 sm:h-3 sm:w-3" />
                            )
                          ) : (
                            <ChevronsUpDown className="h-2 w-2 sm:h-3 sm:w-3" />
                          )}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start">
                        <DropdownMenuItem
                          onClick={() => onSort("submitted_at")}
                          className="text-xs sm:text-sm"
                        >
                          <div className="flex items-center">
                            <ChevronUp className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                            Asc
                          </div>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onSort("submitted_at")}
                          className="text-xs sm:text-sm"
                        >
                          <div className="flex items-center">
                            <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                            Desc
                          </div>
                        </DropdownMenuItem>
                        <div className="bg-border -mx-1 my-1 h-px"></div>
                        <DropdownMenuItem
                          onClick={() => onToggleColumnVisibility("submittedAt")}
                          className="text-xs sm:text-sm"
                        >
                          <div className="flex items-center">
                            <EyeOff className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                            Hide
                          </div>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableHead>
                )}
                {columnVisibility.completedAt && (
                  <TableHead className="w-[100px] sm:w-[140px] min-w-[100px] sm:min-w-[140px]">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-auto p-1 sm:p-2 font-medium text-foreground hover:text-foreground text-xs sm:text-sm"
                        >
                          <span className="hidden sm:inline">Completed At</span>
                          <span className="sm:hidden">Completed</span>
                          {sortConfig.field === "completed_at" ? (
                            sortConfig.direction === "asc" ? (
                              <ChevronUp className="h-2 w-2 sm:h-3 sm:w-3" />
                            ) : (
                              <ChevronDown className="h-2 w-2 sm:h-3 sm:w-3" />
                            )
                          ) : (
                            <ChevronsUpDown className="h-2 w-2 sm:h-3 sm:w-3" />
                          )}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start">
                        <DropdownMenuItem
                          onClick={() => onSort("completed_at")}
                          className="text-xs sm:text-sm"
                        >
                          <div className="flex items-center">
                            <ChevronUp className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                            Asc
                          </div>
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onSort("completed_at")}
                          className="text-xs sm:text-sm"
                        >
                          <div className="flex items-center">
                            <ChevronDown className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                            Desc
                          </div>
                        </DropdownMenuItem>
                        <div className="bg-border -mx-1 my-1 h-px"></div>
                        <DropdownMenuItem
                          onClick={() => onToggleColumnVisibility("completedAt")}
                          className="text-xs sm:text-sm"
                        >
                          <div className="flex items-center">
                            <EyeOff className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                            Hide
                          </div>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableHead>
                )}
                {columnVisibility.submissionLink && (
                  <TableHead className="w-[80px] sm:w-[120px] min-w-[80px] sm:min-w-[120px] text-foreground text-xs sm:text-sm">
                    <span className="hidden sm:inline">Submission Link</span>
                    <span className="sm:hidden">Link</span>
                  </TableHead>
                )}
                <TableHead className="w-[40px] sm:w-[60px] min-w-[40px] sm:min-w-[60px]">
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                [...Array(3)].map((_, i) => (
                  <TableRow key={i}>
                    {Object.values(columnVisibility).filter(Boolean).length > 0 && (
                      <>
                        {columnVisibility.missionId && (
                          <TableCell className="py-2 sm:py-3">
                            <div className="h-3 sm:h-4 bg-muted rounded animate-pulse"></div>
                          </TableCell>
                        )}
                        {columnVisibility.status && (
                          <TableCell className="py-2 sm:py-3">
                            <div className="h-4 sm:h-6 bg-muted rounded animate-pulse w-12 sm:w-16"></div>
                          </TableCell>
                        )}
                        {columnVisibility.acceptedAt && (
                          <TableCell className="py-2 sm:py-3">
                            <div className="h-3 sm:h-4 bg-muted rounded animate-pulse"></div>
                          </TableCell>
                        )}
                        {columnVisibility.submittedAt && (
                          <TableCell className="py-2 sm:py-3">
                            <div className="h-3 sm:h-4 bg-muted rounded animate-pulse"></div>
                          </TableCell>
                        )}
                        {columnVisibility.completedAt && (
                          <TableCell className="py-2 sm:py-3">
                            <div className="h-3 sm:h-4 bg-muted rounded animate-pulse"></div>
                          </TableCell>
                        )}
                        {columnVisibility.submissionLink && (
                          <TableCell className="py-2 sm:py-3">
                            <div className="h-3 sm:h-4 bg-muted rounded animate-pulse w-16 sm:w-20"></div>
                          </TableCell>
                        )}
                        <TableCell className="py-2 sm:py-3">
                          <div className="h-4 w-4 sm:h-6 sm:w-6 bg-muted rounded animate-pulse"></div>
                        </TableCell>
                      </>
                    )}
                  </TableRow>
                ))
              ) : paginatedMissions.length > 0 ? (
                paginatedMissions.map((mission) => (
                  <TableRow key={mission._id}>
                    {columnVisibility.missionId && (
                      <TableCell className="font-medium text-xs sm:text-sm text-foreground py-2 sm:py-3">
                        {mission.mission_id}
                      </TableCell>
                    )}
                    {columnVisibility.status && (
                      <TableCell className="py-2 sm:py-3">
                        <Badge
                          variant={getStatusVariant(mission.status)}
                          className={`${getStatusColor(mission.status)} text-[10px] sm:text-xs px-1 py-0.5 sm:px-2 sm:py-1`}
                        >
                          {mission.status}
                        </Badge>
                      </TableCell>
                    )}
                    {columnVisibility.acceptedAt && (
                      <TableCell className="text-[10px] sm:text-xs text-muted-foreground py-2 sm:py-3">
                        {!mission.accepted_at || mission.accepted_at === "NULL"
                          ? "N/A"
                          : formatDate(mission.accepted_at)}
                      </TableCell>
                    )}
                    {columnVisibility.submittedAt && (
                      <TableCell className="text-[10px] sm:text-xs text-muted-foreground py-2 sm:py-3">
                        {!mission.submitted_at || mission.submitted_at === "NULL"
                          ? "N/A"
                          : formatDate(mission.submitted_at)}
                      </TableCell>
                    )}
                    {columnVisibility.completedAt && (
                      <TableCell className="text-[10px] sm:text-xs text-muted-foreground py-2 sm:py-3">
                        {!mission.completed_at || mission.completed_at === "NULL"
                          ? "N/A"
                          : formatDate(mission.completed_at)}
                      </TableCell>
                    )}
                    {columnVisibility.submissionLink && (
                      <TableCell className="py-2 sm:py-3">
                        {!mission.submission_link || 
                         mission.submission_link === "NULL" || 
                         mission.submission_link === "" ? (
                          <span className="text-muted-foreground text-[10px] sm:text-xs">N/A</span>
                        ) : (
                          <Badge variant="outline" className="text-[10px] sm:text-xs px-1 py-0.5 sm:px-2 sm:py-1">
                            {getLinkType(mission.submission_link)}
                          </Badge>
                        )}
                      </TableCell>
                    )}
                    <TableCell className="py-2 sm:py-3">
                      {mission.submission_link &&
                        mission.submission_link !== "NULL" &&
                        mission.submission_link !== "" && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-4 w-4 sm:h-6 sm:w-6 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-2 w-2 sm:h-3 sm:w-3" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => onOpenModal(mission)} className="text-xs sm:text-sm">
                                <Eye className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <a
                                  href={mission.submission_link}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center text-xs sm:text-sm"
                                >
                                  <ExternalLink className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                                  Open Link
                                </a>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={Object.values(columnVisibility).filter(Boolean).length + 1}
                    className="h-16 sm:h-24 text-center text-muted-foreground text-xs sm:text-sm"
                  >
                    No missions found for this user
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
};

export default UserMissionsTable;