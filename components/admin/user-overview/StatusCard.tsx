import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { StatusCardProps } from "@/types/admin/userTableTypes";

const StatusCard: React.FC<StatusCardProps> = ({
  status,
  count,
  icon: Icon,
  color,
  bgColor,
  isSelected,
  onClick,
  totalMissions,
}) => (
  <Card
    className={`${bgColor} border-opacity-20 dark:border-opacity-40 cursor-pointer hover:scale-105 hover:shadow-lg transition-all duration-200 ${
      isSelected ? "ring-2 ring-blue-500" : ""
    }`}
    onClick={() => onClick(status)}
  >
    <CardContent className="px-3 py-0 -my-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 flex-1">
          <div className={`p-0 sm:p-1.5 rounded-lg ${color}`}>
            <Icon className={`w-4 h-4 sm:w-6 sm:h-6 ${color}`} />
          </div>
          <div className="flex-1">
            <p className="text-xs sm:text-sm font-medium text-muted-foreground capitalize">
              {status}
            </p>
            <div className="flex items-baseline space-x-2">
              <p className="text-lg sm:text-lg font-bold text-foreground">
                {count}
              </p>
              <p className="text-xs sm:hidden text-muted-foreground">
                (
                {totalMissions > 0
                  ? Math.round((count / totalMissions) * 100)
                  : 0}
                %)
              </p>
            </div>
          </div>
        </div>
        <div className="text-right hidden sm:block">
          <p className="text-xs sm:text-sm text-muted-foreground">
            (
            {totalMissions > 0
              ? Math.round((count / totalMissions) * 100)
              : 0}
            %)
          </p>
        </div>
      </div>
    </CardContent>
  </Card>
);

export default StatusCard;