import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LabelList,
  Legend,
} from "recharts";
import { Smile } from "lucide-react";
import { UserWithAgent } from "@/types/admin/userManagement";

interface MoodBarChartCardProps {
  users: UserWithAgent[];
  title?: string;
}

const MOOD_COLORS = {
  happy: "#22C55E", // Green
  neutral: "#6B7280", // Gray
  sad: "#EF4444", // Red
};

// Emoji mapping for different moods
const MOOD_EMOJIS = {
  happy: "😊",
  neutral: "😐",
  sad: "😢",
};

const MoodBarChartCard: React.FC<MoodBarChartCardProps> = ({
  users,
  title = "User Mood Distribution",
}) => {
  // Process mood data
  const processMoodData = () => {
    const moodCounts: Record<string, number> = {};

    users.forEach((user) => {
      if (user.agent?.mood && user.agent.mood.trim()) {
        const mood = user.agent.mood.toLowerCase().trim();
        moodCounts[mood] = (moodCounts[mood] || 0) + 1;
      }
    });

    // Convert to array format for recharts and sort by count
    const data = Object.entries(moodCounts)
      .map(([name, value]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1), // Capitalize first letter
        value,
        percentage: ((value / users.length) * 100).toFixed(1),
        fill:
          MOOD_COLORS[name.toLowerCase() as keyof typeof MOOD_COLORS] ||
          "#6B7280",
        color:
          MOOD_COLORS[name.toLowerCase() as keyof typeof MOOD_COLORS] ||
          "#6B7280",
        emoji:
          MOOD_EMOJIS[name.toLowerCase() as keyof typeof MOOD_EMOJIS] || "😊",
      }))
      .sort((a, b) => b.value - a.value);

    return data;
  };

  const data = processMoodData();
  const totalUsers = users.length;
  const usersWithMood = users.filter(
    (user) => user.agent?.mood && user.agent.mood.trim()
  ).length;

  // Custom tooltip
  const CustomTooltip = ({
    active,
    payload,
    label,
  }: {
    active?: boolean;
    payload?: Array<{
      payload: { emoji: string; percentage: string; value: number };
    }>;
    label?: string;
  }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-popover border border-border rounded-lg shadow-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-lg">{data.emoji}</span>
            <p className="font-medium text-popover-foreground">{label}</p>
          </div>
          <p className="text-sm text-muted-foreground">
            Users: {data.value} ({data.percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom legend content
  const CustomLegend = (props: {
    payload?: Array<{ value: string; color: string }>;
  }) => {
    const { payload } = props;
    if (!payload || payload.length === 0) return null;

    return (
      <div className="flex flex-wrap justify-center gap-4 mb-4">
        {data.map((entry, index) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-xs text-foreground">{entry.name}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-card rounded-2xl p-6 shadow-sm border border-border transition-shadow duration-300 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground">
            {usersWithMood} of {totalUsers} users have mood data
          </p>
        </div>
        <div className="p-3 rounded-full bg-primary/10">
          <Smile className="w-6 h-6 text-primary" />
        </div>
      </div>

      {data.length > 0 ? (
        <div className="flex-1 min-h-0">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                margin={{
                  top: 60, // เพิ่ม top margin สำหรับ emoji และ percentage
                  right: 30,
                  left: 20,
                  bottom: -15,
                }}
                barCategoryGap="40%"
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="currentColor"
                  opacity={0.1}
                />
                <XAxis
                  dataKey="name"
                  stroke="currentColor"
                  fontSize={12}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                  interval={0}
                />
                <YAxis stroke="currentColor" fontSize={12} />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={false}
                  allowEscapeViewBox={{ x: false, y: false }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  wrapperStyle={{
                    paddingBottom: "20px",
                    fontSize: "12px",
                  }}
                  content={<CustomLegend />}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={40}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                  <LabelList
                    dataKey="emoji"
                    position="top"
                    offset={30}
                    fontSize={20}
                  />
                  <LabelList
                    dataKey="percentage"
                    position="top"
                    offset={10}
                    fontSize={12}
                    fontWeight={600}
                    formatter={(value: string) => `${value}%`}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Smile className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No mood data available</p>
            <p className="text-sm text-muted-foreground mt-1">
              User agents haven&apos;t reported their moods yet
            </p>
          </div>
        </div>
      )}

      {/* Summary Stats */}
      {data.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border flex-shrink-0">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-lg font-semibold text-foreground">
                {data.length}
              </p>
              <p className="text-xs text-muted-foreground">Moods</p>
            </div>
            <div>
              <div className="flex items-center justify-center gap-1">
                <span className="text-lg">{data[0]?.emoji || "😊"}</span>
                <p
                  className="text-lg font-semibold text-foreground"
                  style={{ color: data[0]?.color }}
                >
                  {data[0]?.name || "N/A"}
                </p>
              </div>
              <p className="text-xs text-muted-foreground">Most Common</p>
            </div>
            <div>
              <p className="text-lg font-semibold text-foreground">
                {data[0]?.value || 0}
              </p>
              <p className="text-xs text-muted-foreground">Top Mood Count</p>
            </div>
            <div>
              <p className="text-lg font-semibold text-foreground">
                {((usersWithMood / totalUsers) * 100).toFixed(1)}%
              </p>
              <p className="text-xs text-muted-foreground">Coverage Rate</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MoodBarChartCard;