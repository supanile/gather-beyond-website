import {
  CheckCircle,
  Clock,
  XCircle,
  UserPlus,
  Activity,
} from "lucide-react";
import { StatusConfig } from "@/types/admin/user-missions";

export const getStatusConfig = (status: string): StatusConfig => {
  switch (status) {
    case "accepted":
      return {
        icon: UserPlus,
        color: "text-yellow-600 dark:text-yellow-400",
        bgColor: "bg-yellow-100 dark:bg-yellow-900/30",
        label: "Accepted",
      };
    case "submitted":
      return {
        icon: Clock,
        color: "text-orange-600 dark:text-orange-400",
        bgColor: "bg-orange-100 dark:bg-orange-900/30",
        label: "Submitted",
      };
    case "completed":
      return {
        icon: CheckCircle,
        color: "text-green-600 dark:text-green-400",
        bgColor: "bg-green-100 dark:bg-green-900/30",
        label: "Completed",
      };
    case "rejected":
      return {
        icon: XCircle,
        color: "text-red-600 dark:text-red-400",
        bgColor: "bg-red-100 dark:bg-red-900/30",
        label: "Rejected",
      };
    default:
      return {
        icon: Activity,
        color: "text-gray-600 dark:text-gray-400",
        bgColor: "bg-gray-100 dark:bg-gray-900/30",
        label: "Unknown",
      };
  }
};
