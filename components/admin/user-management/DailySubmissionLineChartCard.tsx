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

const DailySubmissionLineChartCard = () => {
  const [userMissions, setUserMissions] = useState<UserMission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<string>("30");
  const [filterType, setFilterType] = useState<string>("days");

  const fetchUserMissions = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const userMissionsResponse = await fetch("/api/user-missions");
      if (!userMissionsResponse.ok) {
        throw new Error("Failed to fetch user missions");
      }
      const missions = await userMissionsResponse.json();

      console.log("Fetched user missions:", missions.length, "missions");

      const statusCounts = missions.reduce(
        (acc: Record<string, number>, mission: UserMission) => {
          acc[mission.status] = (acc[mission.status] || 0) + 1;
          return acc;
        },
        {}
      );
      console.log("Status distribution:", statusCounts);

      const submittedMissions = missions.filter(
        (mission: UserMission) =>
          mission.submitted_at && mission.submitted_at > 0
      );
      console.log("Missions with submitted_at:", submittedMissions.length);

      setUserMissions(missions);
    } catch (err) {
      console.error("Error fetching user missions:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserMissions();
  }, []);

  const processChartData = (): DailySubmissionData[] => {
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

    console.log(`Processing data for ${timeRange} ${filterType}:`, {
      startDate,
      endDate,
    });

    const dailyData: { [key: string]: DailySubmissionData } = {};
    for (
      let d = new Date(startDate);
      d <= endDate;
      d.setDate(d.getDate() + 1)
    ) {
      const dateStr = d.toISOString().split("T")[0];
      const dateLabel = d.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      });

      dailyData[dateStr] = {
        date: dateStr,
        dateLabel,
        totalSubmissions: 0,
        acceptedMissions: 0,
        submittedMissions: 0,
        completedMissions: 0,
        rejectedMissions: 0,
      };
    }

    userMissions.forEach((mission) => {
      if (
        mission.status === "accepted" &&
        mission.accepted_at &&
        mission.accepted_at > 0
      ) {
        const acceptedDate = new Date(mission.accepted_at * 1000);
        if (acceptedDate >= startDate && acceptedDate <= endDate) {
          const dateStr = acceptedDate.toISOString().split("T")[0];
          if (dailyData[dateStr]) {
            dailyData[dateStr].acceptedMissions += 1;
          }
        }
      }

      if (mission.submitted_at && mission.submitted_at > 0) {
        const submittedDate = new Date(mission.submitted_at * 1000);
        if (submittedDate >= startDate && submittedDate <= endDate) {
          const dateStr = submittedDate.toISOString().split("T")[0];
          if (dailyData[dateStr]) {
            dailyData[dateStr].totalSubmissions += 1;

            if (mission.status === "completed") {
              dailyData[dateStr].completedMissions += 1;
            } else if (mission.status === "rejected") {
              dailyData[dateStr].rejectedMissions += 1;
            } else if (mission.status === "submitted") {
              dailyData[dateStr].submittedMissions += 1;
            }
          }
        }
      }
    });

    const result = Object.values(dailyData).sort((a, b) =>
      a.date.localeCompare(b.date)
    );

    console.log("Processed chart data sample:", result.slice(0, 5));
    console.log(
      "Days with submissions:",
      result.filter((day) => day.totalSubmissions > 0).length
    );

    return result;
  };

  const chartData = processChartData();

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

  const CustomTooltip = ({ active, payload, label }: {
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
          {payload.map((entry: { name: string; value: number; color: string }, index: number) => (
            <p
              key={index}
              className="text-sm text-muted-foreground"
              style={{ color: entry.color }}
            >
              {entry.name}: {entry.value}
            </p>
          ))}
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

  if (isLoading) {
    return (
      <div className="bg-card rounded-2xl p-6 shadow-sm border border-border h-full flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="h-6 bg-muted rounded animate-pulse mb-2 w-48"></div>
            <div className="h-4 bg-muted rounded animate-pulse w-64"></div>
          </div>
          <div className="flex gap-2">
            <div className="h-9 bg-muted rounded animate-pulse w-24"></div>
            <div className="h-9 bg-muted rounded animate-pulse w-24"></div>
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-muted rounded animate-pulse"></div>
              <div>
                <div className="h-4 bg-muted rounded animate-pulse w-16 mb-1"></div>
                <div className="h-6 bg-muted rounded animate-pulse w-12"></div>
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
      <div className="bg-card rounded-2xl p-6 shadow-sm border border-border h-full flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Send className="h-5 w-5" />
              Daily Mission Submissions
            </h3>
          </div>
          <div className="p-3 rounded-full bg-primary/10">
            <Send className="w-6 h-6 text-primary" />
          </div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-destructive">Error loading data: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-2xl p-6 shadow-sm border border-border hover:shadow-md transition-all duration-300 hover:border-primary/20 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            Daily Mission Submissions
          </h3>
          <p className="text-sm text-muted-foreground">
            Mission activity over {getTimeRangeLabel()}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex gap-2">
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
              <SelectTrigger className="w-28">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="days">Days</SelectItem>
                <SelectItem value="months">Months</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="p-3 rounded-full bg-primary/10">
            <Send className="w-6 h-6 text-primary" />
          </div>
        </div>
      </div>

      {/* Completion Rate Highlight */}
      <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/10 dark:to-green-800/10 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
        <p className="text-sm text-green-700 dark:text-green-400 font-medium">
          Completion Rate
        </p>
        <p className="text-2xl font-bold text-green-800 dark:text-green-300">
          {completionRate}%
        </p>
        <p className="text-xs text-green-600 dark:text-green-500">
          Based on submitted missions in selected period
        </p>
          </div>
          <div className="p-3 bg-green-200 dark:bg-green-800/30 rounded-full">
        <TrendingUp className="h-6 w-6 text-green-700 dark:text-green-400" />
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="flex-1 min-h-0">
        {chartData.length > 0 && (totalSubmissions > 0 || totalAccepted > 0) ? (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="currentColor"
                  opacity={0.1}
                />
                <XAxis
                  dataKey="dateLabel"
                  stroke="currentColor"
                  fontSize={12}
                />
                <YAxis stroke="currentColor" fontSize={12} />
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  wrapperStyle={{
                    paddingTop: "20px",
                    fontSize: "12px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="totalSubmissions"
                  stroke="hsl(214, 100%, 59%)"
                  strokeWidth={2}
                  dot={{ fill: "hsl(214, 100%, 59%)", strokeWidth: 2, r: 4 }}
                  name="Total Submissions"
                />
                <Line
                  type="monotone"
                  dataKey="acceptedMissions"
                  stroke="hsl(45, 93%, 47%)"
                  strokeWidth={2}
                  dot={{ fill: "hsl(45, 93%, 47%)", strokeWidth: 2, r: 4 }}
                  name="Accepted"
                />
                <Line
                  type="monotone"
                  dataKey="submittedMissions"
                  stroke="hsl(20, 90%, 55%)"
                  strokeWidth={2}
                  dot={{ fill: "hsl(20, 90%, 55%)", strokeWidth: 2, r: 4 }}
                  name="Submitted"
                />
                <Line
                  type="monotone"
                  dataKey="completedMissions"
                  stroke="hsl(142, 76%, 36%)"
                  strokeWidth={2}
                  dot={{ fill: "hsl(142, 76%, 36%)", strokeWidth: 2, r: 4 }}
                  name="Completed"
                />
                <Line
                  type="monotone"
                  dataKey="rejectedMissions"
                  stroke="hsl(0, 84%, 60%)"
                  strokeWidth={2}
                  dot={{ fill: "hsl(0, 84%, 60%)", strokeWidth: 2, r: 4 }}
                  name="Rejected"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <Send className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                No mission data found for the selected time range
              </p>
              <p className="text-sm text-muted-foreground mt-2">
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
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="flex items-center space-x-3 p-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <Send className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium">Total Submissions</p>
                <p className="text-lg font-bold text-foreground">{totalSubmissions.toLocaleString()}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3">
              <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
                <UserPlus className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium">Accepted</p>
                <p className="text-lg font-bold text-foreground">{totalAccepted.toLocaleString()}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                <Clock className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium">Submitted</p>
                <p className="text-lg font-bold text-foreground">{totalSubmitted.toLocaleString()}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium">Completed</p>
                <p className="text-lg font-bold text-foreground">{totalCompleted.toLocaleString()}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3">
              <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
                <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium">Rejected</p>
                <p className="text-lg font-bold text-foreground">{totalRejected.toLocaleString()}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium">Daily Average</p>
                <p className="text-lg font-bold text-foreground">{avgDaily}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DailySubmissionLineChartCard;