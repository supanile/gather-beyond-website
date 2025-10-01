import React from "react";
import { ServerStatCardProps } from "@/types/admin/serverTypes";

const ServerStatCard: React.FC<ServerStatCardProps> = ({
  title,
  value,
  icon: Icon,
  growth,
  isPositive,
  subtitle
}) => {
  return (
    <div className="bg-card rounded-2xl shadow-sm border border-border p-6 hover:shadow-md transition-shadow duration-300">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-muted-foreground mb-1">
            {title}
          </p>
          <p className="text-2xl font-bold text-foreground mb-1">
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-muted-foreground">
              {subtitle}
            </p>
          )}
          {growth !== undefined && (
            <div className="flex items-center mt-2">
              <span
                className={`text-xs font-medium ${
                  isPositive ? "text-green-600" : "text-red-600"
                }`}
              >
                {isPositive ? "+" : ""}{growth}%
              </span>
              <span className="text-xs text-muted-foreground ml-1">
                vs last month
              </span>
            </div>
          )}
        </div>
        <div className="flex-shrink-0">
          <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <Icon className="h-6 w-6 text-primary" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServerStatCard;
