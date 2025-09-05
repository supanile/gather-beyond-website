"use client";

import { Badge } from "@/components/ui/badge";
import { MissionStatusBadgeProps } from "@/types/admin/missionReview";
import { Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";

export function MissionStatusBadge({ status }: MissionStatusBadgeProps) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case "completed":
        return {
          variant: "default" as const,
          className:
            "bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/20 dark:text-green-400 border-green-200 dark:border-green-800",
          icon: CheckCircle,
          label: "Completed",
        };
      case "submitted":
        return {
          variant: "secondary" as const,
          className:
            "bg-orange-100 text-orange-800 hover:bg-orange-100 dark:bg-orange-900/20 dark:text-orange-400 border-orange-200 dark:border-orange-800",
          icon: Clock,
          label: "Submitted",
        };
      case "rejected":
        return {
          variant: "destructive" as const,
          className:
            "bg-red-100 text-red-800 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400 border-red-200 dark:border-red-800",
          icon: XCircle,
          label: "Rejected",
        };
      default:
        return {
          variant: "outline" as const,
          className:
            "bg-gray-100 text-gray-800 hover:bg-gray-100 dark:bg-gray-900/20 dark:text-gray-400 border-gray-200 dark:border-gray-700",
          icon: AlertCircle,
          label: "Unknown",
        };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <Badge
      variant={config.variant}
      className={`flex items-center gap-1 px-2 py-1 text-xs font-medium ${config.className}`}
    >
      <Icon className="w-3 h-3" />
      {config.label}
    </Badge>
  );
}
