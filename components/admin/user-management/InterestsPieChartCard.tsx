import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { ChartPie } from "lucide-react";
import { UserWithAgent } from "@/types/admin/userManagement";

interface InterestsPieChartCardProps {
  users: UserWithAgent[];
  title?: string;
}

// Define colors for the pie chart - optimized for dark theme
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
  "#6B7280", // Gray for Others
];

const InterestsPieChartCard: React.FC<InterestsPieChartCardProps> = ({
  users,
  title = "User Interests Distribution",
}) => {
  // Normalize interest strings (e.g., "NFT", "Nfts" → "NFTs")
  const normalizeInterest = (interest: string): string => {
    const lower = interest.toLowerCase().trim();
    if (lower.includes("nft")) return "NFTs";
    if (lower.includes("game") || lower.includes("gaming")) return "Gaming";
    if (lower.includes("ai") || lower.includes("artificial intelligence"))
      return "AI";
    if (
      lower.includes("crypto") ||
      lower.includes("cryptocurrencies") ||
      lower.includes("altcoins")
    )
      return "Crypto";
    if (
      lower.includes("community") ||
      lower.includes("communities") ||
      lower.includes("moderator")
    )
      return "Community";
    if (lower.includes("airdrop")) return "Airdrops";
    if (lower.includes("web3")) return "Web3";
    if (lower.includes("degen")) return "Degen";
    if (lower.includes("trading")) return "Trading";
    if (lower.includes("socialfi") || lower.includes("socials"))
      return "SocialFi";
    return lower.charAt(0).toUpperCase() + lower.slice(1); // Capitalize others
  };

  // Process interests data
  const processInterestsData = () => {
    const interestCounts: Record<string, number> = {};

    users.forEach((user) => {
      if (user.interests && user.interests.trim()) {
        // Split interests by comma, semicolon, or "and", and clean up
        const userInterests = user.interests
          .split(/[,;]| and /) // Split by comma, semicolon, or "and"
          .map((interest) => interest.trim())
          .filter((interest) => interest.length > 0 && !/^\d+$/.test(interest)) // Remove empty and numeric-only strings
          .map(normalizeInterest); // Normalize interests

        userInterests.forEach((interest) => {
          interestCounts[interest] = (interestCounts[interest] || 0) + 1;
        });
      }
    });

    // Convert to array format for recharts
    let data = Object.entries(interestCounts)
      .map(([name, value], index) => ({
        name,
        value,
        percentage: ((value / users.length) * 100).toFixed(1),
        color: COLORS[index % COLORS.length], // Add color property
      }))
      .sort((a, b) => b.value - a.value);

    // Reassign colors after sorting to maintain consistent color mapping
    data = data.map((item, index) => ({
      ...item,
      color: COLORS[index % COLORS.length],
    }));

    // Group small interests into "Others" if they are less than 2% of total users
    const threshold = users.length * 0.02; // 2% threshold
    const mainInterests = data.filter((item) => item.value >= threshold);
    const otherInterests = data.filter((item) => item.value < threshold);

    if (otherInterests.length > 0) {
      const othersSum = otherInterests.reduce(
        (sum, item) => sum + item.value,
        0
      );
      if (othersSum > 0) {
        mainInterests.push({
          name: "Others",
          value: othersSum,
          percentage: ((othersSum / users.length) * 100).toFixed(1),
          color: COLORS[mainInterests.length % COLORS.length],
        });
      }
    }

    // Limit to top 10 interests (including Others if present)
    return mainInterests.slice(0, 10);
  };

  const data = processInterestsData();
  const totalUsers = users.length;
  const usersWithInterests = users.filter(
    (user) => user.interests && user.interests.trim()
  ).length;

  // Custom tooltip with dark theme support
  const CustomTooltip = ({
    active,
    payload,
  }: {
    active?: boolean;
    payload?: Array<{
      payload: { name: string; value: number; percentage: string };
    }>;
  }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-popover border border-border rounded-lg shadow-lg p-3">
          <p className="font-medium text-popover-foreground">{data.name}</p>
          <p className="text-sm text-muted-foreground">
            Users: {data.value} ({data.percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  // Custom label function with 10% threshold for displaying percentage
  const renderLabel = (entry: {
    name: string;
    value: number;
    percentage: string;
    color: string;
  }) => {
    const percentage = parseFloat(entry.percentage);
    return percentage >= 10 ? `${entry.percentage}%` : "";
  };

  return (
    <div className="bg-card rounded-2xl p-4 sm:p-6 shadow-sm border border-border hover:shadow-md transition-all duration-300 hover:border-primary/20 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4 gap-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-foreground truncate">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground truncate">
            {usersWithInterests} of {totalUsers} users have interests listed
          </p>
        </div>
        <div className="p-3 rounded-full bg-primary/10 shrink-0">
          <ChartPie className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
        </div>
      </div>

      {data.length > 0 ? (
        <div className="flex-1 min-h-0">
          <div className="h-64 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderLabel}
                  outerRadius="80%"
                  fill="#8884d8"
                  dataKey="value"
                  stroke="hsl(var(--border))"
                  strokeWidth={1}
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  wrapperStyle={{
                    paddingTop: "20px",
                    paddingBottom: "40px",
                    fontSize: "12px",
                    color: "hsl(var(--foreground))",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground">No interests data available</p>
            <p className="text-sm text-muted-foreground mt-1">
              Users haven&apos;t specified their interests yet
            </p>
          </div>
        </div>
      )}

      {/* Summary Stats */}
      {data.length > 0 && (
        <div className="mt-4 pt-4 border-t border-border flex-shrink-0">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 text-center">
            <div>
              <p className="text-base sm:text-lg font-semibold text-foreground">
                {data.length}
              </p>
              <p className="text-xs text-muted-foreground">Unique Interests</p>
            </div>
            <div>
              <p
                className="text-base sm:text-lg font-semibold text-foreground truncate"
                style={{ color: data[0]?.color }}
                title={data[0]?.name}
              >
                {data[0]?.name || "N/A"}
              </p>
              <p className="text-xs text-muted-foreground">Most Popular</p>
            </div>
            <div>
              <p className="text-base sm:text-lg font-semibold text-foreground">
                {data[0]?.value || 0}
              </p>
              <p className="text-xs text-muted-foreground">
                Top Interest Users
              </p>
            </div>
            <div>
              <p className="text-base sm:text-lg font-semibold text-foreground">
                {((usersWithInterests / totalUsers) * 100).toFixed(1)}%
              </p>
              <p className="text-xs text-muted-foreground">Coverage Rate</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterestsPieChartCard;
