import React from "react";
import { StatusCardProps } from "@/types/admin/missions/missionTypes";

export const StatusCard: React.FC<StatusCardProps> = ({
  status,
  count,
  icon: Icon,
  color,
  bgColor,
  onClick,
  isSelected = false,
}) => (
  <div
    className={`${bgColor} rounded-2xl p-6 shadow-sm border border-border hover:shadow-md transition-all duration-300 hover:border-primary/20 cursor-pointer ${
      isSelected ? "ring-2 ring-blue-500" : ""
    }`}
    onClick={onClick}
  >
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className={`p-2 rounded-lg ${color}`}>
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground capitalize">
            {status}
          </p>
          <p className="text-2xl font-bold text-foreground">{count}</p>
        </div>
      </div>
    </div>
  </div>
);