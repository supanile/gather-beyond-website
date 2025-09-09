// "use client";

// import { Button } from "@/components/ui/button";
// import { 
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import { MissionActionProps } from "@/types/admin/missionReview";
// import { 
//   Check, 
//   X, 
//   Eye, 
//   MoreHorizontal,
//   ExternalLink
// } from "lucide-react";

// export function MissionActions({ 
//   mission, 
//   onApprove, 
//   onReject, 
//   onViewDetails 
// }: MissionActionProps) {
//   const canApprove = mission.status === "submitted";
//   const canReject = mission.status === "submitted"

//   return (
//     <div className="flex items-center gap-2">
//       {/* Quick Action Buttons */}
//       {canApprove && (
//         <Button
//           size="sm"
//           variant="outline"
//           onClick={() => onApprove(mission._id)}
//           className="h-8 px-2 text-green-600 hover:text-green-700 hover:bg-green-50 border-green-200 dark:text-green-400 dark:hover:bg-green-900/20 dark:border-green-800"
//         >
//           <Check className="w-4 h-4" />
//         </Button>
//       )}

//       {canReject && (
//         <Button
//           size="sm"
//           variant="outline"
//           onClick={() => onReject(mission._id)}
//           className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 dark:text-red-400 dark:hover:bg-red-900/20 dark:border-red-800"
//         >
//           <X className="w-4 h-4" />
//         </Button>
//       )}

//       {/* More Actions Dropdown */}
//       <DropdownMenu>
//         <DropdownMenuTrigger asChild>
//           <Button
//             size="sm"
//             variant="ghost"
//             className="h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800"
//           >
//             <MoreHorizontal className="w-4 h-4" />
//           </Button>
//         </DropdownMenuTrigger>
//         <DropdownMenuContent align="end" className="w-48">
//           <DropdownMenuItem
//             onClick={() => onViewDetails(mission)}
//             className="flex items-center gap-2 cursor-pointer"
//           >
//             <Eye className="w-4 h-4" />
//             View Details
//           </DropdownMenuItem>
          
//           {mission.submission_link && (
//             <>
//               <DropdownMenuSeparator />
//               <DropdownMenuItem
//                 onClick={() => window.open(mission.submission_link, '_blank')}
//                 className="flex items-center gap-2 cursor-pointer"
//               >
//                 <ExternalLink className="w-4 h-4" />
//                 Open Submission Link
//               </DropdownMenuItem>
//             </>
//           )}

//           {mission.status === "submitted" && (
//             <>
//               <DropdownMenuSeparator />
//               <DropdownMenuItem
//                 onClick={() => onApprove(mission._id)}
//                 className="flex items-center gap-2 cursor-pointer text-green-600 focus:text-green-600 dark:text-green-400"
//               >
//                 <Check className="w-4 h-4" />
//                 Approve Mission
//               </DropdownMenuItem>
//               <DropdownMenuItem
//                 onClick={() => onReject(mission._id)}
//                 className="flex items-center gap-2 cursor-pointer text-red-600 focus:text-red-600 dark:text-red-400"
//               >
//                 <X className="w-4 h-4" />
//                 Reject Mission
//               </DropdownMenuItem>
//             </>
//           )}
//         </DropdownMenuContent>
//       </DropdownMenu>
//     </div>
//   );
// }
