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
import { Send } from "lucide-react";
import { DailySubmissionData } from "@/types/admin/user-missions";
import { CustomTooltip } from "./CustomTooltip";

interface MissionChartProps {
  chartData: DailySubmissionData[];
  totalSubmissions: number;
  totalAccepted: number;
}

export const MissionChart = ({ chartData, totalSubmissions, totalAccepted }: MissionChartProps) => {
  if (chartData.length > 0 && (totalSubmissions > 0 || totalAccepted > 0)) {
    return (
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
            <YAxis
              stroke="currentColor"
              fontSize={10}
              tick={{ fontSize: 10 }}
            />
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
            <Line
              type="monotone"
              dataKey="uniqueUsers"
              stroke="hsl(270, 70%, 50%)"
              strokeWidth={2}
              dot={{ fill: "hsl(270, 70%, 50%)", strokeWidth: 2, r: 3 }}
              name="Unique Users"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }

  return (
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
  );
};
