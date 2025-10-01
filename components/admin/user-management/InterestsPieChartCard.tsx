import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { PieChartIcon, Info } from "lucide-react";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

// Mock type for demonstration
interface UserWithAgent {
  interests?: string;
}

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

  const totalUsers = users.length;
  const usersWithInterests = users.filter(
    (user) => user.interests && user.interests.trim()
  ).length;

  // Process interests data
  const processInterestsData = () => {
    const interestCounts: Record<string, number> = {};

    // Count unique users for each interest
    users.forEach((user) => {
      if (user.interests && user.interests.trim()) {
        // Split interests by comma, semicolon, or "and", and clean up
        const userInterests = user.interests
          .split(/[,;]| and /) // Split by comma, semicolon, or "and"
          .map((interest) => interest.trim())
          .filter((interest) => interest.length > 0 && !/^\d+$/.test(interest)) // Remove empty and numeric-only strings
          .map(normalizeInterest); // Normalize interests

        // Remove duplicates for this user (in case they have the same interest multiple times)
        const uniqueUserInterests = [...new Set(userInterests)];

        uniqueUserInterests.forEach((interest) => {
          interestCounts[interest] = (interestCounts[interest] || 0) + 1;
        });
      }
    });

    // Convert to array format for recharts (don't sort yet)
    const data = Object.entries(interestCounts).map(([name, value], index) => ({
      name,
      value,
      percentage:
        usersWithInterests > 0 ? (value / usersWithInterests) * 100 : 0,
      color: COLORS[index % COLORS.length], // Add color property
      otherItems: [] as string[], // Track what's included in Others
    }));

    // Group small interests into "Others" if they represent less than 5% of users with interests
    const threshold = Math.max(1, usersWithInterests * 0.05); // At least 1 user or 5% threshold
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
          percentage:
            usersWithInterests > 0 ? (othersSum / usersWithInterests) * 100 : 0,
          color: COLORS[mainInterests.length % COLORS.length],
          otherItems: otherInterests.map(
            (item) =>
              `${item.name} (${item.value} user${item.value !== 1 ? "s" : ""})`
          ),
        });
      }
    }

    // Now sort by value (after grouping Others)
    const sortedData = mainInterests.sort((a, b) => b.value - a.value);

    // Reassign colors after sorting to maintain consistent color mapping
    const finalData = sortedData.map((item, index) => ({
      ...item,
      color: COLORS[index % COLORS.length],
    }));

    // Limit to top 10 interests (including Others if present)
    return finalData.slice(0, 10);
  };

  const data = processInterestsData();

  // Custom tooltip with dark theme support
  const CustomTooltip = ({
    active,
    payload,
  }: {
    active?: boolean;
    payload?: Array<{
      payload: {
        name: string;
        value: number;
        percentage: number;
        otherItems?: string[];
      };
    }>;
  }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-popover border border-border rounded-lg shadow-lg p-3 max-w-xs">
          <p className="font-medium text-popover-foreground">{data.name}</p>
          <p className="text-sm text-muted-foreground">
            {data.value} user{data.value !== 1 ? "s" : ""} (
            {data.percentage.toFixed(1)}% of users with interests)
          </p>
          {data.name === "Others" &&
            data.otherItems &&
            data.otherItems.length > 0 && (
              <div className="mt-2 pt-2 border-t border-border">
                <p className="text-xs font-medium text-popover-foreground mb-1">
                  Includes:
                </p>
                <div className="text-xs text-muted-foreground space-y-0.5 max-h-32 overflow-y-auto">
                  {data.otherItems.map((item, index) => (
                    <div key={index}>{item}</div>
                  ))}
                </div>
              </div>
            )}
        </div>
      );
    }
    return null;
  };

  // Custom label function with 8% threshold for displaying percentage
  const renderLabel = (entry: {
    cx: number;
    cy: number;
    midAngle: number;
    innerRadius: number;
    outerRadius: number;
    percentage: number;
    color: string;
  }) => {
    const RADIAN = Math.PI / 180;
    const radius = entry.outerRadius + 25;
    const x = entry.cx + radius * Math.cos(-entry.midAngle * RADIAN);
    const y = entry.cy + radius * Math.sin(-entry.midAngle * RADIAN);

    if (entry.percentage < 8) return null;

    return (
      <text
        x={x}
        y={y}
        fill={entry.color}
        textAnchor={x > entry.cx ? "start" : "end"}
        dominantBaseline="central"
        fontSize={16}
        fontWeight={700}
      >
        {`${entry.percentage.toFixed(1)}%`}
      </text>
    );
  };

  return (
    <div className="bg-card rounded-2xl p-4 sm:p-6 shadow-sm border border-border transition-shadow duration-300 h-full flex flex-col">
      <div className="flex items-center justify-between mb-4 gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-foreground truncate">
              {title}
            </h3>
            <HoverCard>
                <HoverCardTrigger asChild>
                <button className="relative inline-flex items-center justify-center rounded-full hover:bg-yellow-50 dark:hover:bg-yellow-950/30 transition-colors p-1 group">
                  <Info className="w-4 h-4 text-yellow-600 dark:text-yellow-400 hover:text-yellow-700 dark:hover:text-yellow-300 transition-colors relative z-10" />
                  {/* Animated ping effect */}
                  <span className="absolute inline-flex h-full w-full rounded-full bg-yellow-500 opacity-75 animate-ping group-hover:opacity-0 transition-opacity"></span>
                  {/* Pulsing background */}
                  <span className="absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-40 animate-pulse group-hover:opacity-0 transition-opacity"></span>
                </button>
                </HoverCardTrigger>
                <HoverCardContent className="w-80 bg-gradient-to-br from-white to-gray-100 dark:from-gray-900 dark:to-black border-gray-300 dark:border-gray-700" side="top" align="start">
                <div className="space-y-2">
                  <h4 className="text-sm font-semibold text-black dark:text-white flex items-center gap-2">
                  <span className="inline-block w-1 h-4 bg-gradient-to-b from-gray-500 to-black rounded-full"></span>
                  How to read this chart
                  </h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                  Each segment shows how many users have that interest. Since
                  users can have multiple interests, the total percentage may
                  exceed 100%. For example, if <span className="font-semibold text-gray-900 dark:text-gray-100">80% like NFTs</span> and <span className="font-semibold text-gray-900 dark:text-gray-100">60% like Gaming</span>,
                  some users likely enjoy both.
                  </p>
                </div>
                </HoverCardContent>
            </HoverCard>
          </div>
          <p className="text-sm text-muted-foreground truncate">
            {usersWithInterests} of {totalUsers} users have interests listed
          </p>
          <p className="text-xs text-amber-600 dark:text-amber-400 mt-1">
            Note: Percentages may exceed 100% as users can have multiple
            interests
          </p>
        </div>
        <div className="p-3 rounded-full bg-gray-200 dark:bg-white shrink-0">
          <PieChartIcon className="w-6 h-6 text-gray-700 dark:text-gray-900" />
        </div>
      </div>

      {data.length > 0 ? (
        <div className="flex-1 min-h-0">
          <div className="h-64 sm:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <defs>
                  {data.map((entry, index) => (
                    <linearGradient
                      key={`gradient-${index}`}
                      id={`interestGradient${index}`}
                      x1="0"
                      y1="0"
                      x2="1"
                      y2="1"
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
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={{
                    stroke: "currentColor",
                    strokeWidth: 1,
                    opacity: 0.5,
                  }}
                  label={renderLabel}
                  outerRadius="70%"
                  dataKey="value"
                  stroke="hsl(var(--border))"
                  strokeWidth={2}
                  animationDuration={800}
                  animationBegin={0}
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={`url(#interestGradient${index})`}
                      style={{
                        filter: "drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.1))",
                      }}
                    />
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