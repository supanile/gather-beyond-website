import React from "react";
import { ChevronRight, Filter } from "lucide-react";
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
    className={`${bgColor} rounded-2xl p-6 shadow-lg border border-border/50 backdrop-blur-sm
      hover:shadow-xl hover:scale-[1.02] transition-all duration-300 cursor-pointer group
      ${
        isSelected
          ? "ring-2 ring-blue-500 dark:ring-blue-400 shadow-blue-500/20 dark:shadow-blue-400/20"
          : "hover:border-primary/30 dark:hover:border-primary/50"
      }
      relative overflow-hidden`}
    onClick={onClick}
  >
    {/* Background gradient overlay */}
    <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent dark:from-white/5 dark:to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

    {/* Main content */}
    <div className="relative z-10">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Icon with enhanced styling */}
          <div
            className={`p-4 rounded-xl ${color} shadow-lg backdrop-blur-sm border border-white/20 dark:border-white/10
            group-hover:scale-110 transition-transform duration-300`}
          >
            <Icon className="w-8 h-8 drop-shadow-sm" />
          </div>

          {/* Text content */}
          <div className="ml-3 space-y-2">
            <p className="font-semibold text-muted-foreground/80 capitalize tracking-wide">
              {status}
            </p>
            <p className="text-4xl font-bold text-foreground drop-shadow-sm">
              {count}
            </p>
          </div>
        </div>

        {/* Filter indicator section */}
        <div className="flex flex-col items-center justify-center space-y-2 min-w-0">
          {/* Filter icon with animation */}
          <div
            className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10 backdrop-blur-sm
            group-hover:bg-white/20 dark:group-hover:bg-white/10 group-hover:scale-110 transition-all duration-300"
          >
            <Filter
              className={`w-4 h-4 ${
                isSelected ? "text-blue-400 dark:text-blue-300" : "text-muted-foreground/70"
              } 
              group-hover:text-foreground transition-colors duration-300`}
            />
          </div>

          {/* Click to filter text */}
          <div className="flex items-center space-x-1 opacity-60 group-hover:opacity-100 transition-opacity duration-300">
            <span className="text-xs text-muted-foreground/70 group-hover:text-foreground font-medium">
              Click to filter
            </span>
            <ChevronRight
              className={`w-3 h-3 ${
                isSelected ? "text-blue-400 dark:text-blue-300" : "text-muted-foreground/70"
              } 
              group-hover:text-foreground group-hover:translate-x-1 transition-all duration-300`}
            />
          </div>

          {/* Selected indicator dot */}
          {isSelected && (
            <div className="w-2 h-2 rounded-full bg-blue-500 dark:bg-blue-400 shadow-lg animate-pulse" />
          )}
        </div>
      </div>

      {/* Bottom subtle line indicator */}
      <div className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent
        opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${isSelected ? 'opacity-100 via-blue-400/50' : ''}`} />
    </div>
  </div>
);
