"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { useDailySubmissionData } from "@/hooks/useDailySubmissionData";
import { StatsSummary } from "./StatsSummary";
import { DailyUserSubmissions } from "./DailyUserSubmissions";
import { TopPerformingMissions } from "./TopPerformingMissions";
import { TimeRangeSelector } from "./TimeRangeSelector";
import { LoadingState, ErrorState } from "./LoadingState";
import { CompletionRateHighlight } from "./CompletionRateHighlight";
import { MissionChart } from "./MissionChart";

const DailySubmissionLineChartCard = () => {
  const [timeRange, setTimeRange] = useState<string>("30");
  const [filterType, setFilterType] = useState<string>("days");
  const [dateRangeMode, setDateRangeMode] = useState<"relative" | "date" | "all">("relative");
  const [customDateRange, setCustomDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({ from: undefined, to: undefined });

  const {
    userMissions,
    isLoading,
    error,
    chartData,
    topMissions,
  } = useDailySubmissionData(timeRange, filterType, dateRangeMode, customDateRange);

  // Calculate summary stats
  const totalSubmissions = chartData.reduce(
    (sum, day) => sum + day.totalSubmissions,
    0
  );
  const totalAccepted = chartData.reduce(
    (sum, day) => sum + day.acceptedMissions,
    0
  );
  const totalSubmitted = chartData.reduce(
    (sum, day) => sum + day.submittedMissions,
    0
  );
  const totalCompleted = chartData.reduce(
    (sum, day) => sum + day.completedMissions,
    0
  );
  const totalRejected = chartData.reduce(
    (sum, day) => sum + day.rejectedMissions,
    0
  );
  
  // Calculate total unique users across all days (without double counting)
  const allUniqueUsers = new Set();
  chartData.forEach((day) => {
    day.userDetails.forEach((user) => {
      allUniqueUsers.add(user.user_id);
    });
  });
  const totalUniqueUsers = allUniqueUsers.size;

  const avgDaily =
    chartData.length > 0 ? Math.round(totalSubmissions / chartData.length) : 0;
  const completionRate =
    totalSubmissions > 0
      ? Math.round((totalCompleted / totalSubmissions) * 100)
      : 0;

  const getTimeRangeLabel = () => {
    if (dateRangeMode === "all") {
      return "all time";
    } else if (dateRangeMode === "date" && customDateRange?.from && customDateRange?.to) {
      const formatDate = (date: Date) => date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      });
      return `${formatDate(customDateRange.from)} - ${formatDate(customDateRange.to)}`;
    } else if (dateRangeMode === "date" && customDateRange?.from) {
      return `from ${customDateRange.from.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      })}`;
    } else if (filterType === "days") {
      return `${timeRange} ${timeRange === "1" ? "day" : "days"}`;
    } else {
      return `${timeRange} ${timeRange === "1" ? "month" : "months"}`;
    }
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  return (
    <div className="bg-card rounded-2xl p-4 sm:p-6 shadow-sm border border-border hover:shadow-md transition-all duration-300 hover:border-primary/20 h-full flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <div className="flex-1">
          <h3 className="text-base sm:text-lg font-semibold text-foreground">
            Daily Mission Submissions
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Mission activity over {getTimeRangeLabel()}
          </p>
        </div>
        <div className="flex items-center gap-3 self-start sm:self-center">
          <TimeRangeSelector
            timeRange={timeRange}
            filterType={filterType}
            onTimeRangeChange={setTimeRange}
            onFilterTypeChange={setFilterType}
            dateRangeMode={dateRangeMode}
            onDateRangeModeChange={setDateRangeMode}
            customDateRange={customDateRange}
            onCustomDateRangeChange={setCustomDateRange}
          />
          <div className="p-3 rounded-full bg-gray-200 dark:bg-white">
            <Send className="w-6 h-6 text-gray-700 dark:text-gray-900" />
          </div>
        </div>
      </div>

      {/* Completion Rate Highlight */}
      <CompletionRateHighlight completionRate={completionRate} />

      {/* Chart */}
      <div className="flex-1 min-h-0">
        <MissionChart
          chartData={chartData}
          totalSubmissions={totalSubmissions}
          totalAccepted={totalAccepted}
        />
      </div>

      {/* Overall Stats Summary */}
      {(totalSubmissions > 0 || totalAccepted > 0) && (
        <StatsSummary
          totalSubmissions={totalSubmissions}
          totalAccepted={totalAccepted}
          totalSubmitted={totalSubmitted}
          totalCompleted={totalCompleted}
          totalRejected={totalRejected}
          avgDaily={avgDaily}
          totalUniqueUsers={totalUniqueUsers}
        />
      )}

      {/* Daily User Details Section */}
      {chartData.length > 0 &&
        chartData.some((day) => day.userDetails.length > 0) && (
          <DailyUserSubmissions 
            chartData={chartData} 
            timeRange={timeRange}
            filterType={filterType}
          />
        )}

      {/* Top Performing Missions Section */}
      {topMissions.length > 0 && (
        <TopPerformingMissions 
          topMissions={topMissions} 
          userMissions={userMissions} 
        />
      )}
    </div>
  );
};

export default DailySubmissionLineChartCard;
