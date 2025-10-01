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
} from "recharts";
import { Globe } from "lucide-react";
import { UserWithAgent } from "@/types/admin/userManagement";

interface CountryBarChartCardProps {
  users: UserWithAgent[];
  title?: string;
}

// Define colors for the bar chart - optimized for dark theme
const COLORS = [
  "#3B82F6", // Blue
  "#10B981", // Emerald
  "#F59E0B", // Amber
  "#EF4444", // Red
  "#8B5CF6", // Violet
  "#06B6D4", // Cyan
  "#F97316", // Orange
  "#EC4899", // Pink
  "#84CC16", // Lime
  "#6366F1", // Indigo
];

const CountryBarChartCard: React.FC<CountryBarChartCardProps> = ({
  users,
  title = "Country Distribution",
}) => {
  // Normalize country names
  const normalizeCountry = (country: string): string => {
    const normalized = country.trim();
    if (!normalized) return "Unknown";

    // Capitalize first letter of each word
    return normalized
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  // Process country data
  const processCountryData = () => {
    const countryCounts: Record<string, number> = {};

    users.forEach((user) => {
      if (user.country && user.country.trim()) {
        const country = normalizeCountry(user.country);
        countryCounts[country] = (countryCounts[country] || 0) + 1;
      } else {
        countryCounts["Unknown"] = (countryCounts["Unknown"] || 0) + 1;
      }
    });

    // Convert to array format for recharts and sort by count
    const data = Object.entries(countryCounts)
      .map(([name, value], index) => ({
        name,
        value,
        percentage: ((value / users.length) * 100).toFixed(1),
        color: COLORS[index % COLORS.length],
      }))
      .sort((a, b) => b.value - a.value);

    // Limit to top 10 countries
    return data.slice(0, 10);
  };

  const data = processCountryData();
  const totalUsers = users.length;
  const usersWithCountry = users.filter(
    (user) => user.country && user.country.trim()
  ).length;

  // Custom tooltip
  const CustomTooltip = ({
    active,
    payload,
    label,
  }: {
    active?: boolean;
    payload?: Array<{
      payload: { percentage: string; value: number };
    }>;
    label?: string;
  }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-popover border border-border rounded-lg shadow-lg p-3">
          <p className="font-medium text-popover-foreground">{label}</p>
          <p className="text-sm text-muted-foreground">
            Users: {data.value} ({data.percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-card rounded-2xl p-6 shadow-sm border border-border transition-shadow duration-300 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground">
            {usersWithCountry} of {totalUsers} users have country information
          </p>
        </div>
        <div className="p-3 rounded-full bg-gray-200 dark:bg-white">
          <Globe className="w-6 h-6 text-gray-700 dark:text-gray-900" />
        </div>
      </div>

      {data.length > 0 ? (
        <div className="flex-1 min-h-0">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                layout="vertical"
                margin={{
                  top: 20,
                  right: 70,
                  left: 10,
                  bottom: 5,
                }}
              >
                <defs>
                  {data.map((entry, index) => (
                    <linearGradient
                      key={`gradient-${index}`}
                      id={`colorGradient${index}`}
                      x1="0"
                      y1="0"
                      x2="1"
                      y2="0"
                    >
                      <stop
                        offset="0%"
                        stopColor={entry.color}
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor={entry.color}
                        stopOpacity={1}
                      />
                    </linearGradient>
                  ))}
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="currentColor"
                  opacity={0.08}
                  horizontal={true}
                  vertical={false}
                />
                <XAxis
                  type="number"
                  stroke="currentColor"
                  fontSize={11}
                  tickLine={false}
                  axisLine={{ stroke: "currentColor", opacity: 0.2 }}
                />
                <YAxis
                  dataKey="name"
                  type="category"
                  stroke="currentColor"
                  fontSize={12}
                  width={110}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: "currentColor", fontWeight: 500 }}
                />
                <Tooltip
                  content={<CustomTooltip />}
                  cursor={{
                    fill: "currentColor",
                    opacity: 0.05,
                    radius: 4,
                  }}
                  allowEscapeViewBox={{ x: false, y: false }}
                />
                <Bar
                  dataKey="value"
                  radius={[0, 8, 8, 0]}
                  maxBarSize={32}
                  animationDuration={800}
                  animationBegin={0}
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={`url(#colorGradient${index})`}
                      style={{
                        filter: "drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.1))",
                      }}
                    />
                  ))}
                  <LabelList
                    dataKey="value"
                    position="right"
                    offset={12}
                    fontSize={12}
                    fontWeight={700}
                    fill="currentColor"
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Globe className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground">No country data available</p>
            <p className="text-sm text-muted-foreground mt-1">
              Users haven&apos;t specified their countries yet
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
              <p className="text-xs text-muted-foreground">Countries</p>
            </div>
            <div>
              <p
                className="text-lg font-semibold text-foreground truncate"
                style={{ color: data[0]?.color }}
                title={data[0]?.name}
              >
                {data[0]?.name || "N/A"}
              </p>
              <p className="text-xs text-muted-foreground">Most Popular</p>
            </div>
            <div>
              <p className="text-lg font-semibold text-foreground">
                {data[0]?.value || 0}
              </p>
              <p className="text-xs text-muted-foreground">Top Country Users</p>
            </div>
            <div>
              <p className="text-lg font-semibold text-foreground">
                {((usersWithCountry / totalUsers) * 100).toFixed(1)}%
              </p>
              <p className="text-xs text-muted-foreground">Coverage Rate</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CountryBarChartCard;
