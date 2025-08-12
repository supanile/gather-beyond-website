// import React from "react";
// import { Settings2, Search, X } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuCheckboxItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { ColumnVisibility, PaginationState } from "@/types/admin/missions/missionTypes";

// interface MissionTableControlsProps {
//   selectedStatus: string | null;
//   searchQuery: string;
//   onSearchChange: (query: string) => void;
//   onResetFilter: () => void;
//   pagination: PaginationState;
//   onItemsPerPageChange: (value: string) => void;
//   columnVisibility: ColumnVisibility;
//   onToggleColumnVisibility: (column: keyof ColumnVisibility) => void;
// }

// export const MissionTableControls: React.FC<MissionTableControlsProps> = ({
//   selectedStatus,
//   searchQuery,
//   onSearchChange,
//   onResetFilter,
//   pagination,
//   onItemsPerPageChange,
//   columnVisibility,
//   onToggleColumnVisibility,
// }) => {
//   const startIndex = (pagination.currentPage - 1) * pagination.itemsPerPage;
//   const endIndex = Math.min(startIndex + pagination.itemsPerPage, pagination.totalItems);

//   // Helper function to format column labels
//   const getColumnLabel = (key: string): string => {
//     const labelMap: Record<string, string> = {
//       id: "Mission ID",
//       title: "Title",
//       type: "Type",
//       platform: "Platform",
//       partner: "Partner",
//       reward: "Reward",
//       levelRequired: "Level Required",
//       status: "Status",
//       startDate: "Start Date",
//       endDate: "End Date",
//       createdAt: "Created At",
//       updatedAt: "Updated At",
//     };
    
//     return labelMap[key] || key.charAt(0).toUpperCase() + key.slice(1);
//     };

//     return (
//     <div className="flex flex-col gap-4">
//       {/* Search Bar */}
//       <div className="flex flex-col sm:flex-row gap-4">
//       <div className="relative flex-1 max-w-xl">
//         <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
//         <Input
//         placeholder=" by title, description, or partner..."
//         value={searchQuery}
//         onChange={(e) => onSearchChange(e.target.value)}
//         className="pl-9 pr-9 text-sm"
//         />
//         {searchQuery && (
//             <Button
//               variant="ghost"
//               size="sm"
//               onClick={() => onSearchChange("")}
//               className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-muted"
//             >
//               <X className="h-3 w-3" />
//             </Button>
//           )}
//         </div>

//         {/* Filter Reset Button */}
//         {(selectedStatus || searchQuery) && (
//           <Button
//             variant="destructive"
//             size="sm"
//             onClick={onResetFilter}
//             className="text-xs sm:text-sm whitespace-nowrap"
//           >
//             Reset All Filters
//           </Button>
//         )}
//       </div>

//       {/* Controls Row */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//         <div className="flex items-center gap-2">
//           {/* Active Filters Display */}
//           <div className="flex items-center gap-2 flex-wrap">
//             {selectedStatus && (
//               <div className="flex items-center gap-1 bg-muted px-2 py-1 rounded-md text-xs">
//                 <span>Status: {selectedStatus}</span>
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   onClick={() => onResetFilter()}
//                   className="h-4 w-4 p-0 hover:bg-background"
//                 >
//                   <X className="h-3 w-3" />
//                 </Button>
//               </div>
//             )}
//             {searchQuery && (
//               <div className="flex items-center gap-1 bg-muted px-2 py-1 rounded-md text-xs max-w-32">
//                 <span className="truncate">Search: {searchQuery}</span>
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   onClick={() => onSearchChange("")}
//                   className="h-4 w-4 p-0 hover:bg-background"
//                 >
//                   <X className="h-3 w-3" />
//                 </Button>
//               </div>
//             )}
//           </div>
//         </div>

//         <div className="flex items-center gap-2">
//           <div className="flex items-center space-x-2">
//             <span className="text-xs sm:text-sm text-muted-foreground mr-2 sm:mr-4 whitespace-nowrap">
//               Showing {startIndex + 1}-{endIndex} of {pagination.totalItems} missions
//             </span>
//             <span className="text-xs sm:text-sm text-muted-foreground whitespace-nowrap">
//               Show:
//             </span>
//             <Select
//               value={pagination.itemsPerPage.toString()}
//               onValueChange={onItemsPerPageChange}
//             >
//               <SelectTrigger className="w-16 sm:w-20 h-7 sm:h-8 text-xs sm:text-sm">
//                 <SelectValue />
//               </SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="10" className="text-xs sm:text-sm">10</SelectItem>
//                 <SelectItem value="20" className="text-xs sm:text-sm">20</SelectItem>
//                 <SelectItem value="50" className="text-xs sm:text-sm">50</SelectItem>
//                 <SelectItem value="100" className="text-xs sm:text-sm">100</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>

//           {/* Column Visibility Dropdown */}
//           <DropdownMenu>
//             <DropdownMenuTrigger asChild>
//               <Button 
//                 variant="outline" 
//                 size="sm" 
//                 className="text-xs sm:text-sm h-7 sm:h-8"
//               >
//                 <Settings2 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
//                 View
//               </Button>
//             </DropdownMenuTrigger>
//             <DropdownMenuContent align="end" className="w-[160px] sm:w-[180px]">
//               <DropdownMenuLabel className="text-xs sm:text-sm">
//                 Toggle columns
//               </DropdownMenuLabel>
//               <DropdownMenuSeparator />
//               {Object.entries(columnVisibility).map(([key, value]) => (
//                 <DropdownMenuCheckboxItem
//                   key={key}
//                   checked={value}
//                   onCheckedChange={() =>
//                     onToggleColumnVisibility(key as keyof ColumnVisibility)
//                   }
//                   className="text-xs sm:text-sm"
//                 >
//                   {getColumnLabel(key)}
//                 </DropdownMenuCheckboxItem>
//               ))}
//             </DropdownMenuContent>
//           </DropdownMenu>
//         </div>
//       </div>
//     </div>
//   );
// };