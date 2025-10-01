"use client";

import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  TrendingUp,
  Users,
  CheckCircle,
  Clock,
  XCircle,
  Send,
  UserPlus,
  Trophy,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface UserMission {
  id: number;
  mission_id: number;
  mission_name: string;
  user_id: string;
  status: "accepted" | "submitted" | "completed" | "rejected";
  accepted_at: number;
  submitted_at: number | null;
  completed_at: number | null;
  submission_link: string;
  notes: string;
}

interface DailySubmissionData {
  date: string;
  dateLabel: string;
  totalSubmissions: number;
  acceptedMissions: number;
  submittedMissions: number;
  completedMissions: number;
  rejectedMissions: number;
}

interface MissionPerformance {
  mission_id: number;
  mission_name: string;
  totalSubmissions: number;
  completedSubmissions: number;
  completionRate: number;
  uniqueUsers: number;
}

const DailySubmissionLineChartCard = () => {
  const [userMissions, setUserMissions] = useState<UserMission[]>([]);
  const [statisticsData, setStatisticsData] = useState<DailySubmissionData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<string>("30");
  const [filterType, setFilterType] = useState<string>("days");
  const [showAllMissions, setShowAllMissions] = useState(false);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch statistics data from the new endpoint
      const statisticsResponse = await fetch("/api/user-missions/statistics");
      if (!statisticsResponse.ok) {
        throw new Error("Failed to fetch statistics data");
      }
      const statisticsResult = await statisticsResponse.json();
      
      if (statisticsResult.success) {
        setStatisticsData(statisticsResult.data);
      } else {
        throw new Error(statisticsResult.error || "Failed to fetch statistics");
      }

      // Still fetch user missions for top missions calculation
      const userMissionsResponse = await fetch("/api/user-missions");
      if (!userMissionsResponse.ok) {
        throw new Error("Failed to fetch user missions");
      }
      const missions = await userMissionsResponse.json();

      setUserMissions(missions);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [timeRange, filterType]);

  const processChartData = (): DailySubmissionData[] => {
    if (!statisticsData.length) return [];

    const endDate = new Date();
    const startDate = new Date();

    if (filterType === "days") {
      const days = parseInt(timeRange);
      startDate.setDate(startDate.getDate() - days);
    } else if (filterType === "months") {
      const months = parseInt(timeRange);
      startDate.setMonth(startDate.getMonth() - months);
    }

    // Filter statistics data based on the selected time range
    const filteredData = statisticsData.filter((item) => {
      const itemDate = new Date(item.date);
      return itemDate >= startDate && itemDate <= endDate;
    });

    // Sort by date
    return filteredData.sort((a, b) => a.date.localeCompare(b.date));
  };

  const processTopMissions = (): MissionPerformance[] => {
    if (!userMissions.length) return [];

    const endDate = new Date();
    const startDate = new Date();

    if (filterType === "days") {
      const days = parseInt(timeRange);
      startDate.setDate(startDate.getDate() - days);
    } else if (filterType === "months") {
      const months = parseInt(timeRange);
      startDate.setMonth(startDate.getMonth() - months);
    }

    // Filter missions based on time range
    const filteredMissions = userMissions.filter((mission) => {
      if (mission.submitted_at && mission.submitted_at > 0) {
        const submittedDate = new Date(mission.submitted_at * 1000);
        return submittedDate >= startDate && submittedDate <= endDate;
      }
      return false;
    });

    // Group by mission_id and calculate stats
    const missionStats: { [key: number]: MissionPerformance } = {};

    filteredMissions.forEach((mission) => {
      if (!missionStats[mission.mission_id]) {
        missionStats[mission.mission_id] = {
          mission_id: mission.mission_id,
          mission_name: mission.mission_name,
          totalSubmissions: 0,
          completedSubmissions: 0,
          completionRate: 0,
          uniqueUsers: 0,
        };
      }

      missionStats[mission.mission_id].totalSubmissions += 1;
      if (mission.status === "completed") {
        missionStats[mission.mission_id].completedSubmissions += 1;
      }
    });

    // Calculate unique users and completion rates
    Object.keys(missionStats).forEach((missionIdStr) => {
      const missionId = parseInt(missionIdStr);
      const uniqueUsers = new Set(
        filteredMissions
          .filter((m) => m.mission_id === missionId)
          .map((m) => m.user_id)
      ).size;
      
      missionStats[missionId].uniqueUsers = uniqueUsers;
      missionStats[missionId].completionRate = 
        missionStats[missionId].totalSubmissions > 0
          ? Math.round((missionStats[missionId].completedSubmissions / missionStats[missionId].totalSubmissions) * 100)
          : 0;
    });

    // Sort by total submissions (descending)
    return Object.values(missionStats)
      .sort((a, b) => b.totalSubmissions - a.totalSubmissions);
  };

  const chartData = processChartData();
  const topMissions = processTopMissions();

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
  const avgDaily =
    chartData.length > 0 ? Math.round(totalSubmissions / chartData.length) : 0;
  const completionRate =
    totalSubmissions > 0
      ? Math.round((totalCompleted / totalSubmissions) * 100)
      : 0;

  const CustomTooltip = ({
    active,
    payload,
    label,
  }: {
    active?: boolean;
    payload?: Array<{
      name: string;
      value: number;
      color: string;
    }>;
    label?: string;
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-popover border border-border rounded-lg shadow-lg p-3">
          <p className="text-sm font-medium mb-2 text-popover-foreground">
            {label}
          </p>
          {payload.map(
            (
              entry: { name: string; value: number; color: string },
              index: number
            ) => (
              <p
                key={index}
                className="text-sm text-muted-foreground"
                style={{ color: entry.color }}
              >
                {entry.name}: {entry.value}
              </p>
            )
          )}
        </div>
      );
    }
    return null;
  };

  const getTimeRangeLabel = () => {
    if (filterType === "days") {
      return `${timeRange} ${timeRange === "1" ? "day" : "days"}`;
    } else {
      return `${timeRange} ${timeRange === "1" ? "month" : "months"}`;
    }
  };

  const getRankIcon = (index: number) => {
    if (index === 0) return <span className="text-xl sm:text-2xl font-bold text-yellow-500">1</span>;
    if (index === 1) return <span className="text-xl sm:text-2xl font-bold text-gray-400">2</span>;
    if (index === 2) return <span className="text-xl sm:text-2xl font-bold text-amber-600">3</span>;
    return <span className="text-base sm:text-lg font-medium text-muted-foreground">{index + 1}</span>;
  };

  if (isLoading) {
    return (
      <div className="bg-card rounded-2xl p-4 sm:p-6 shadow-sm border border-border h-full flex flex-col">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
          <div className="flex-1">
            <div className="h-6 bg-muted rounded animate-pulse mb-2 w-48"></div>
            <div className="h-4 bg-muted rounded animate-pulse w-64"></div>
          </div>
          <div className="flex gap-2 flex-wrap">
            <div className="h-9 bg-muted rounded animate-pulse w-24"></div>
            <div className="h-9 bg-muted rounded animate-pulse w-24"></div>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-4 mb-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center space-x-2">
              <div className="h-6 w-6 sm:h-8 sm:w-8 bg-muted rounded animate-pulse"></div>
              <div className="min-w-0 flex-1">
                <div className="h-3 sm:h-4 bg-muted rounded animate-pulse w-12 sm:w-16 mb-1"></div>
                <div className="h-4 sm:h-6 bg-muted rounded animate-pulse w-8 sm:w-12"></div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex-1 bg-muted rounded animate-pulse"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-card rounded-2xl p-4 sm:p-6 shadow-sm border border-border h-full flex flex-col">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
          <div className="flex-1">
            <h3 className="text-base sm:text-lg font-semibold text-foreground flex items-center gap-3">
              <div className="p-3 rounded-full bg-gray-200 dark:bg-white">
                <Send className="w-6 h-6 text-gray-700 dark:text-gray-900" />
              </div>
              Daily Mission Submissions
            </h3>
          </div>
          <div className="p-3 rounded-full bg-gray-200 dark:bg-white self-start sm:self-center">
            <Send className="w-6 h-6 text-gray-700 dark:text-gray-900" />
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-destructive text-sm">Error loading data: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  const displayedMissions = showAllMissions ? topMissions : topMissions.slice(0, 5);

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
          <div className="flex gap-2 flex-wrap">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-18">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {filterType === "days" ? (
                  <>
                    <SelectItem value="7">7</SelectItem>
                    <SelectItem value="14">14</SelectItem>
                    <SelectItem value="30">30</SelectItem>
                  </>
                ) : (
                  <>
                    <SelectItem value="1">1</SelectItem>
                    <SelectItem value="3">3</SelectItem>
                    <SelectItem value="6">6</SelectItem>
                    <SelectItem value="12">12</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
            <Select
              value={filterType}
              onValueChange={(value) => {
                setFilterType(value);
                if (value === "days") {
                  setTimeRange("30");
                } else {
                  setTimeRange("3");
                }
              }}
            >
              <SelectTrigger className="w-26 sm:w-28">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="days">Days</SelectItem>
                <SelectItem value="months">Months</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="p-3 rounded-full bg-gray-200 dark:bg-white">
            <Send className="w-6 h-6 text-gray-700 dark:text-gray-900" />
          </div>
        </div>
      </div>

      {/* Completion Rate Highlight */}
      <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/10 dark:to-green-800/10 rounded-lg p-3 sm:p-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs sm:text-sm text-green-700 dark:text-green-400 font-medium">
              Completion Rate
            </p>
            <p className="text-xl sm:text-2xl font-bold text-green-800 dark:text-green-300">
              {completionRate}%
            </p>
            <p className="text-xs text-green-600 dark:text-green-500">
              Based on submitted missions in selected period
            </p>
          </div>
          <div className="p-2 sm:p-3 bg-green-200 dark:bg-green-800/30 rounded-full">
            <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-green-700 dark:text-green-400" />
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="flex-1 min-h-0">
        {chartData.length > 0 && (totalSubmissions > 0 || totalAccepted > 0) ? (
          <div className="h-60 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 5, right: 15, left: 10, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="currentColor"
                  opacity={0.1}
                />
                <XAxis
                  dataKey="dateLabel"
                  stroke="currentColor"
                  fontSize={10}
                  tick={{ fontSize: 10 }}
                />
                <YAxis stroke="currentColor" fontSize={10} tick={{ fontSize: 10 }} />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{
                    paddingTop: "20px",
                    fontSize: "10px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="totalSubmissions"
                  stroke="hsl(214, 100%, 59%)"
                  strokeWidth={2}
                  dot={{ fill: "hsl(214, 100%, 59%)", strokeWidth: 2, r: 3 }}
                  name="Total Submissions"
                />
                <Line
                  type="monotone"
                  dataKey="acceptedMissions"
                  stroke="hsl(45, 93%, 47%)"
                  strokeWidth={2}
                  dot={{ fill: "hsl(45, 93%, 47%)", strokeWidth: 2, r: 3 }}
                  name="Accepted"
                />
                <Line
                  type="monotone"
                  dataKey="submittedMissions"
                  stroke="hsl(20, 90%, 55%)"
                  strokeWidth={2}
                  dot={{ fill: "hsl(20, 90%, 55%)", strokeWidth: 2, r: 3 }}
                  name="Submitted"
                />
                <Line
                  type="monotone"
                  dataKey="completedMissions"
                  stroke="hsl(142, 76%, 36%)"
                  strokeWidth={2}
                  dot={{ fill: "hsl(142, 76%, 36%)", strokeWidth: 2, r: 3 }}
                  name="Completed"
                />
                <Line
                  type="monotone"
                  dataKey="rejectedMissions"
                  stroke="hsl(0, 84%, 60%)"
                  strokeWidth={2}
                  dot={{ fill: "hsl(0, 84%, 60%)", strokeWidth: 2, r: 3 }}
                  name="Rejected"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center px-4">
              <Send className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-sm sm:text-base text-muted-foreground">
                No mission data found for the selected time range
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground mt-2">
                Try selecting a different time range or check if there are
                missions with timestamps.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Overall Stats Summary */}
      {(totalSubmissions > 0 || totalAccepted > 0) && (
        <div className="mt-6 pt-6 border-t border-border flex-shrink-0">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-4">
            <div className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3">
              <div className="p-1.5 sm:p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <Send className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-muted-foreground font-medium truncate">
                  Total Submissions
                </p>
                <p className="text-sm sm:text-lg font-bold text-foreground">
                  {totalSubmissions.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3">
              <div className="p-1.5 sm:p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                <UserPlus className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-muted-foreground font-medium truncate">
                  Accepted
                </p>
                <p className="text-sm sm:text-lg font-bold text-foreground">
                  {totalAccepted.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3">
              <div className="p-1.5 sm:p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-muted-foreground font-medium truncate">
                  Submitted
                </p>
                <p className="text-sm sm:text-lg font-bold text-foreground">
                  {totalSubmitted.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3">
              <div className="p-1.5 sm:p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 dark:text-green-400" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-muted-foreground font-medium truncate">
                  Completed
                </p>
                <p className="text-sm sm:text-lg font-bold text-foreground">
                  {totalCompleted.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3">
              <div className="p-1.5 sm:p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
                <XCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-600 dark:text-red-400" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-muted-foreground font-medium truncate">
                  Rejected
                </p>
                <p className="text-sm sm:text-lg font-bold text-foreground">
                  {totalRejected.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3">
              <div className="p-1.5 sm:p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <Users className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs text-muted-foreground font-medium truncate">
                  Daily Average
                </p>
                <p className="text-sm sm:text-lg font-bold text-foreground">{avgDaily}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Top Performing Missions Section */}
      {topMissions.length > 0 && (
        <div className="mt-6 pt-6 border-t border-border flex-shrink-0">
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500" />
            <h4 className="text-sm sm:text-base font-semibold text-foreground">
              Top Performing Missions
            </h4>
            <span className="text-xs sm:text-sm text-muted-foreground">
              (Most Submissions)
            </span>
          </div>

          <div className="space-y-3">
            {displayedMissions.map((mission, index) => (
              <div
                key={mission.mission_id}
                className="flex items-center justify-between p-3 sm:p-4 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
                  <div className="flex items-center justify-center w-6 sm:w-8">
                    {getRankIcon(index)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate text-sm sm:text-base">
                      {mission.mission_name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Mission ID: {mission.mission_id} •{" "}
                      <span className="text-muted-foreground dark:text-white font-semibold">
                        {mission.uniqueUsers} Users
                      </span>
                    </p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3 sm:gap-6">
                  <div className="text-right">
                    <p className="text-xs sm:text-sm font-medium text-foreground">
                      {mission.totalSubmissions} submissions
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {mission.completedSubmissions} completed
                    </p>
                  </div>
                  <div className="text-right">
                    <div className={`text-xs sm:text-sm font-medium ${
                      mission.completionRate >= 80 
                        ? 'text-green-600 dark:text-green-300'
                        : mission.completionRate >= 60
                        ? 'text-yellow-600 dark:text-yellow-300' 
                        : 'text-red-600 dark:text-red-300'
                    }`}>
                      {mission.completionRate}%
                    </div>
                    <p className="text-xs text-muted-foreground">completion</p>
                  </div>
                </div>
              </div>
            ))}
            
            {topMissions.length === 0 && (
              <div className="text-center py-8">
                <Trophy className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">
                  No missions found for the selected time range
                </p>
              </div>
            )}
          </div>

          {/* Show All/Show Less Button */}
          {topMissions.length > 5 && (
            <div className="mt-4">
              <button
                onClick={() => setShowAllMissions(!showAllMissions)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-primary hover:text-primary/80 dark:text-white dark:hover:text-white/80 bg-primary/5 hover:bg-primary/10 dark:bg-white/5 dark:hover:bg-white/10 border border-primary/20 dark:border-white/20 rounded-lg transition-all duration-200 hover:shadow-sm"
              >
                {showAllMissions ? (
                  <>
                    Show Less <ChevronUp className="h-4 w-4" />
                  </>
                ) : (
                  <>
                    Show All ({topMissions.length}) <ChevronDown className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DailySubmissionLineChartCard;