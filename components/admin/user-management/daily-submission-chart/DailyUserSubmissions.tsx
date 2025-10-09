import { useState } from "react";
import { Activity, Users, ChevronDown, ChevronRight } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { DailySubmissionData } from "@/types/admin/user-missions";
import { getStatusConfig } from "@/lib/admin/mission-utils";
import { DiscordUserDisplay } from "./DiscordUserDisplay";

interface DailyUserSubmissionsProps {
  chartData: DailySubmissionData[];
  timeRange: string;
  filterType: string;
}

// Helper function to format date with full month name and year
const formatFullDate = (dateString: string): string => {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    month: "long",
    day: "numeric",
    year: "numeric",
  };
  return date.toLocaleDateString("en-US", options);
};

export const DailyUserSubmissions = ({
  chartData,
  timeRange,
  filterType,
}: DailyUserSubmissionsProps) => {
  const [openDay, setOpenDay] = useState<string | null>(null);

  const toggleDay = (date: string) => {
    setOpenDay(openDay === date ? null : date);
  };

  const filteredData = chartData.filter((day) => day.userDetails.length > 0);

  // Determine if scrollable container should be used
  const shouldUseScrollable = () => {
    if (filterType === "days") {
      return parseInt(timeRange) >= 14;
    } else if (filterType === "months") {
      return parseInt(timeRange) >= 1;
    }
    return false;
  };

  const isScrollable = shouldUseScrollable();

  // Helper function to get time range display text
  const getTimeRangeDisplay = () => {
    const timeValue = parseInt(timeRange);
    if (filterType === "days") {
      return `${timeValue} ${timeValue === 1 ? "Day" : "Days"}`;
    } else if (filterType === "months") {
      return `${timeValue} ${timeValue === 1 ? "Month" : "Months"}`;
    }
    return "";
  };

  if (filteredData.length === 0) {
    return (
      <div className="text-center py-8">
        <Activity className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground mx-auto mb-2" />
        <p className="text-sm text-muted-foreground">
          No user activity found for the selected time range
        </p>
      </div>
    );
  }

  return (
    <div className="mt-6 pt-6 border-t border-border flex-shrink-0">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
          <h4 className="text-sm sm:text-base font-semibold text-foreground">
            Daily User Submissions
          </h4>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs sm:text-sm text-muted-foreground">
            Showing last
          </span>
            <span className="text-xs sm:text-sm font-semibold text-indigo-700 dark:text-indigo-200 bg-gradient-to-r from-indigo-50 to-sky-50 dark:from-slate-800/30 dark:to-indigo-900/30 px-2 py-1 rounded-md border border-indigo-200/40 dark:border-indigo-700/40 shadow-sm ring-1 ring-indigo-100/40 dark:ring-indigo-900/20 backdrop-blur-sm transition-transform hover:scale-105">
              {getTimeRangeDisplay()}
            </span>
        </div>
      </div>

      <div className={`${isScrollable ? 'max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent' : ''} space-y-3`}>
        {filteredData.map((day) => {
          const isOpen = openDay === day.date;
          const fullDateLabel = formatFullDate(day.date);

          return (
            <Collapsible
              key={day.date}
              open={isOpen}
              onOpenChange={() => toggleDay(day.date)}
            >
              <CollapsibleTrigger className="w-full">
                <div className="bg-gradient-to-br from-card to-card/50 border border-border/50 rounded-lg p-4 hover:shadow-md transition-all duration-300 cursor-pointer hover:bg-muted/30">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full transition-colors duration-200">
                        <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-medium text-foreground">
                          {fullDateLabel}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {day.uniqueUsers} users • {day.totalSubmissions}{" "}
                          submissions
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <p className="text-sm font-bold text-foreground">
                          {day.userDetails.length}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          active users
                        </p>
                      </div>
                      <div className="transition-transform duration-300 ease-in-out">
                        {isOpen ? (
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </CollapsibleTrigger>

              <CollapsibleContent className="overflow-hidden transition-all duration-500 ease-in-out data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-top-1 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-top-1">
                <div className="mt-3 animate-in fade-in-0 slide-in-from-top-2 duration-300">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 ml-4">
                    <div className="col-span-full">
                      <div className="space-y-2 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
                        {day.userDetails.map((user, userIndex) => (
                          <div
                            key={user.user_id}
                            className="bg-muted/30 rounded-md p-3 space-y-3 animate-in fade-in-0 slide-in-from-bottom-2 duration-300"
                            style={{
                              animationDelay: `${userIndex * 50}ms`,
                            }}
                          >
                            {/* User Header */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-semibold text-muted-foreground bg-muted/50 px-2 py-1 rounded">
                                  #{userIndex + 1}
                                </span>
                                <DiscordUserDisplay
                                  discordId={user.user_id}
                                  size="sm"
                                />
                              </div>
                              <div className="flex items-center gap-1">
                                <span className="text-xs font-bold text-foreground">
                                  {user.submissions}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {user.submissions === 1
                                    ? "mission"
                                    : "missions"}
                                </span>
                              </div>
                            </div>

                            {/* Mission Details */}
                            <div className="space-y-2">
                              {user.missions.map((mission, idx) => {
                                const statusConfig = getStatusConfig(
                                  mission.status
                                );
                                const StatusIcon = statusConfig.icon;

                                return (
                                  <div
                                    key={`${mission.mission_id}-${idx}`}
                                    className="flex items-center justify-between bg-background/50 rounded-sm p-2 text-xs"
                                  >
                                    <div className="flex items-center gap-2 flex-1 min-w-0">
                                      <div
                                        className={`p-1 rounded-full ${statusConfig.bgColor}`}
                                      >
                                        <StatusIcon
                                          className={`h-3 w-3 ${statusConfig.color}`}
                                        />
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                          <p className="font-medium text-foreground truncate">
                                            {mission.mission_name}
                                          </p>
                                          <span
                                            className={`px-1.5 py-0.5 rounded text-xs font-medium ${statusConfig.bgColor} ${statusConfig.color}`}
                                          >
                                            {statusConfig.label}
                                          </span>
                                          {mission.platform && (
                                            <span className="text-xs text-muted-foreground">
                                              • {mission.platform}
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          );
        })}
      </div>
    </div>
  );
};
