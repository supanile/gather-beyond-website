// "use client";

// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { MissionDetailsModalProps } from "@/types/admin/missionReview";
// import { MissionStatusBadge } from "./MissionStatusBadge";
// import { UserAvatar } from "./UserAvatar";
// import {
//   Target,
//   Link as LinkIcon,
//   FileText,
//   Clock,
//   CheckCircle,
//   Send,
//   ExternalLink,
//   X,
//   User,
//   Calendar,
//   MessageSquare,
// } from "lucide-react";
// import { MissionActionConfirmDialog } from "./MissionActionConfirmDialog";
// import { useState } from "react";

// export function MissionDetailsModal({
//   mission,
//   isOpen,
//   onClose,
//   onApprove,
//   onReject,
// }: MissionDetailsModalProps) {
//   const [confirmDialog, setConfirmDialog] = useState<{
//     isOpen: boolean;
//     action: "approve" | "reject";
//     missionId: number;
//     missionName: string;
//   }>({
//     isOpen: false,
//     action: "approve",
//     missionId: 0,
//     missionName: "",
//   });
//   const [isActionLoading, setIsActionLoading] = useState(false);

//   if (!mission) return null;

//   const handleApproveClick = () => {
//     setConfirmDialog({
//       isOpen: true,
//       action: "approve",
//       missionId: mission._id,
//       missionName: mission.mission_name,
//     });
//   };

//   const handleRejectClick = () => {
//     setConfirmDialog({
//       isOpen: true,
//       action: "reject",
//       missionId: mission._id,
//       missionName: mission.mission_name,
//     });
//   };

//   const handleConfirmAction = async () => {
//     setIsActionLoading(true);
//     try {
//       if (confirmDialog.action === "approve") {
//         if (onApprove) {
//           await onApprove(confirmDialog.missionId);
//         }
//       } else {
//         if (onReject) {
//           await onReject(confirmDialog.missionId);
//         }
//       }
//       onClose(); // Close modal after successful action
//     } finally {
//       setIsActionLoading(false);
//       setConfirmDialog({
//         isOpen: false,
//         action: "approve",
//         missionId: 0,
//         missionName: "",
//       });
//     }
//   };

//   const handleCloseDialog = () => {
//     if (!isActionLoading) {
//       setConfirmDialog({
//         isOpen: false,
//         action: "approve",
//         missionId: 0,
//         missionName: "",
//       });
//     }
//   };

//   const canApprove = mission.status === "submitted";
//   const canReject = mission.status === "submitted";

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent
//         className="!w-[85vw] !max-w-[85vw] max-h-[90vh] overflow-y-auto bg-gradient-to-br from-white via-slate-50 to-white dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 border-0 shadow-2xl"
//         style={{ width: "85vw", maxWidth: "85vw" }}
//       >
//         {/* Header Section */}
//         <DialogHeader className="pb-4 border-b border-slate-200 dark:border-slate-700">
//           <div className="flex items-start justify-between gap-4">
//             <div className="flex-1 min-w-0">
//               <div className="flex items-center gap-3 mb-2">
//                 <div className="p-2 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg flex-shrink-0">
//                   <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />
//                 </div>
//                 <DialogTitle className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-slate-100 dark:to-slate-300 bg-clip-text text-transparent truncate">
//                   {mission.mission_name}
//                 </DialogTitle>
//               </div>
//               <DialogDescription className="text-xs text-slate-600 dark:text-slate-400 flex flex-wrap items-center gap-3">
//                 <span className="flex items-center gap-1 whitespace-nowrap">
//                   <Target className="w-3 h-3" />
//                   Mission ID: {mission.mission_id}
//                 </span>
//                 <span className="flex items-center gap-1 whitespace-nowrap">
//                   <FileText className="w-3 h-3" />
//                   Submission: {mission._id.toString().slice(-8)}
//                 </span>
//               </DialogDescription>
//             </div>
//           </div>
//         </DialogHeader>

//         {/* Main Content - Horizontal Layout */}
//         <div className="space-y-6 py-4">
//           {/* Top Row - User & Mission Info */}
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
//             {/* User Information - Compact */}
//             <div className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 rounded-lg p-4 border border-slate-200 dark:border-slate-700 shadow-sm">
//               <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
//                 <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
//                 User
//               </h3>
//               <div className="flex items-center gap-3">
//                 <UserAvatar
//                   discordId={mission.user_id}
//                   username={mission.discord_user?.username}
//                   avatarUrl={mission.discord_user?.avatarUrl}
//                   size="lg"
//                 />
//                 <div className="flex-1 min-w-0">
//                   <div className="font-medium text-slate-900 dark:text-slate-100 text-md truncate">
//                     {mission.discord_user?.username || "Unknown User"}
//                   </div>
//                   <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
//                     {mission.user_id}
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Mission Details - Compact */}
//             <div className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 rounded-lg p-4 border border-slate-200 dark:border-slate-700 shadow-sm">
//               <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
//                 <Target className="w-4 h-4 text-green-600 dark:text-green-400" />
//                 Details
//               </h3>
//               <div className="space-y-2">
//                 <div className="flex items-center justify-between gap-2">
//                   <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
//                     Mission ID
//                   </span>
//                   <Badge
//                     variant="outline"
//                     className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs"
//                   >
//                     {mission.mission_id}
//                   </Badge>
//                 </div>
//                 <div className="flex items-center justify-between gap-2">
//                   <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
//                     Status
//                   </span>
//                   <MissionStatusBadge status={mission.status} />
//                 </div>
//               </div>
//             </div>

//             {/* Timeline - Horizontal */}
//             <div className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 rounded-lg p-4 border border-slate-200 dark:border-slate-700 shadow-sm">
//               <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
//                 <Clock className="w-4 h-4 text-orange-600 dark:text-orange-400" />
//                 Timeline
//               </h3>
//               <div className="flex justify-between items-center gap-2">
//                 {/* Accepted */}
//                 <div className="flex-1 text-center">
//                   <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-1">
//                     <Calendar className="w-3 h-3 text-white" />
//                   </div>
//                   <span className="text-xs font-medium text-yellow-700 dark:text-yellow-300 block">
//                     Accepted
//                   </span>
//                   <span className="text-xs text-yellow-600 dark:text-yellow-400">
//                     {mission.accepted_at
//                       ? new Date(
//                           mission.accepted_at * 1000
//                         ).toLocaleString()
//                       : "N/A"}
//                   </span>
//                 </div>

//                 <div className="w-4 h-px bg-slate-400 dark:bg-slate-600"></div>

//                 {/* Submitted */}
//                 <div className="flex-1 text-center">
//                   <div className={`w-6 h-6 rounded-full flex items-center justify-center mx-auto mb-1 ${
//                     mission.submitted_at ? "bg-orange-500" : "bg-slate-300 dark:bg-slate-600"
//                   }`}>
//                     <Send className="w-3 h-3 text-white" />
//                   </div>
//                   <span className={`text-xs font-medium block ${
//                     mission.submitted_at 
//                       ? "text-orange-700 dark:text-orange-300" 
//                       : "text-slate-500 dark:text-slate-400"
//                   }`}>
//                     Submitted
//                   </span>
//                   <span className={`text-xs ${
//                     mission.submitted_at 
//                       ? "text-orange-600 dark:text-orange-400"
//                       : "text-slate-500 dark:text-slate-400"
//                   }`}>
//                     {mission.submitted_at
//                       ? new Date(
//                           mission.submitted_at * 1000
//                         ).toLocaleString()
//                       : "In Progress"}
//                   </span>
//                 </div>

//                 <div className="w-4 h-px bg-slate-400 dark:bg-slate-600"></div>

//                 {/* Final Status - Completed or Rejected */}
//                 <div className="flex-1 text-center">
//                   <div
//                     className={`w-6 h-6 rounded-full flex items-center justify-center mx-auto mb-1 ${
//                       mission.status === "completed"
//                         ? "bg-green-500"
//                         : mission.status === "rejected"
//                         ? "bg-red-500"
//                         : "bg-slate-300 dark:bg-slate-600"
//                     }`}
//                   >
//                     {mission.status === "rejected" ? (
//                       <X className="w-3 h-3 text-white" />
//                     ) : mission.status === "completed" ? (
//                       <CheckCircle className="w-3 h-3 text-white" />
//                     ) : (
//                       <Clock className="w-3 h-3 text-white" />
//                     )}
//                   </div>
//                   <span
//                     className={`text-xs font-medium block ${
//                       mission.status === "completed"
//                         ? "text-green-700 dark:text-green-300"
//                         : mission.status === "rejected"
//                         ? "text-red-700 dark:text-red-300"
//                         : "text-slate-500 dark:text-slate-400"
//                     }`}
//                   >
//                     {mission.status === "completed"
//                       ? "Completed"
//                       : mission.status === "rejected"
//                       ? "Rejected"
//                       : "Review"}
//                   </span>
//                   <span
//                     className={`text-xs ${
//                       mission.status === "completed"
//                         ? "text-green-600 dark:text-green-400"
//                         : mission.status === "rejected"
//                         ? "text-red-600 dark:text-red-400"
//                         : "text-slate-500 dark:text-slate-400"
//                     }`}
//                   >
//                     {mission.status === "completed" && mission.completed_at
//                       ? new Date(
//                           mission.completed_at * 1000
//                         ).toLocaleString()
//                       : mission.status === "rejected"
//                       ? ""
//                       : mission.status === "completed"
//                       ? "Today"
//                       : "In Progress"}
//                   </span>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Bottom Row - Submission Content */}
//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//             {/* Submission Link */}
//             <div className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 rounded-lg p-4 border border-slate-200 dark:border-slate-700 shadow-sm">
//               <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
//                 <LinkIcon className="w-4 h-4 text-purple-600 dark:text-purple-400" />
//                 Submission Link
//               </h3>

//               {mission.submission_link ? (
//                 <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-3 border border-slate-200 dark:border-slate-700">
//                   <div className="flex items-start gap-3">
//                     <LinkIcon className="w-4 h-4 text-slate-500 flex-shrink-0 mt-0.5" />
//                     <div className="flex-1 min-w-0">
//                       <span className="text-sm text-slate-700 dark:text-slate-300 break-all block mb-2">
//                         {mission.submission_link}
//                       </span>
//                       <Button
//                         size="sm"
//                         variant="outline"
//                         onClick={() =>
//                           window.open(mission.submission_link, "_blank")
//                         }
//                         className="w-full bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-900/30"
//                       >
//                         <ExternalLink className="w-4 h-4 mr-2" />
//                         Open Link
//                       </Button>
//                     </div>
//                   </div>
//                 </div>
//               ) : (
//                 <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700 text-center">
//                   <LinkIcon className="w-6 h-6 text-slate-400 mx-auto mb-2" />
//                   <span className="text-sm text-slate-500 italic">
//                     No submission link provided
//                   </span>
//                 </div>
//               )}
//             </div>

//             {/* Notes */}
//             <div className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 rounded-lg p-4 border border-slate-200 dark:border-slate-700 shadow-sm">
//               <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
//                 <MessageSquare className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
//                 Notes
//               </h3>

//               {mission.notes ? (
//                 <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-3 border border-slate-200 dark:border-slate-700 max-h-32 overflow-y-auto">
//                   <span className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
//                     {mission.notes}
//                   </span>
//                 </div>
//               ) : (
//                 <div className="bg-slate-100 dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700 text-center">
//                   <MessageSquare className="w-6 h-6 text-slate-400 mx-auto mb-2" />
//                   <span className="text-sm text-slate-500 italic">
//                     Waiting for verification
//                   </span>
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Footer */}
//         <DialogFooter className="pt-4 border-t border-slate-200 dark:border-slate-700">
//           <div className="flex flex-col-reverse sm:flex-row gap-2 w-full">
//             <Button
//               variant="outline"
//               onClick={onClose}
//               className="flex-1 sm:flex-none sm:min-w-[80px] bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-600 hover:bg-slate-200 dark:hover:bg-slate-700"
//             >
//               Close
//             </Button>

//             <div className="flex gap-2 flex-1 sm:flex-none">
//               {canReject && onReject && (
//                 <Button
//                   variant="destructive"
//                   onClick={handleRejectClick}
//                   className="flex-1 sm:min-w-[100px] bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 shadow-lg"
//                 >
//                   <X className="w-4 h-4 mr-2" />
//                   Reject
//                 </Button>
//               )}

//               {canApprove && onApprove && (
//                 <Button
//                   onClick={handleApproveClick}
//                   className="flex-1 sm:min-w-[100px] bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-lg"
//                 >
//                   <CheckCircle className="w-4 h-4 mr-2" />
//                   Approve
//                 </Button>
//               )}
//             </div>
//           </div>
//         </DialogFooter>
//       </DialogContent>
//       <MissionActionConfirmDialog
//         isOpen={confirmDialog.isOpen}
//         onClose={handleCloseDialog}
//         onConfirm={handleConfirmAction}
//         action={confirmDialog.action}
//         missionName={confirmDialog.missionName}
//         isLoading={isActionLoading}
//       />
//     </Dialog>
//   );
// }
