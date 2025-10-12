import React, { useMemo, useState } from "react";
import { TrendWithStats } from "@/types/trends";
import TrendCard from "./TrendCard";
import TreemapLayoutComponent, { TreemapRect } from "./TreemapLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";

interface TrendTreemapProps {
  trends: TrendWithStats[];
  loading?: boolean;
  error?: string | null;
  className?: string;
  onTrendClick?: (trend: TrendWithStats) => void;
}

// Define trend ranges
type TrendRange = "top20" | "top21-50" | "top51-100";

const trendRanges: {
  [key in TrendRange]: { label: string; start: number; end: number };
} = {
  top20: { label: "Top 20", start: 0, end: 20 },
  "top21-50": { label: "Top 21-50", start: 20, end: 50 },
  "top51-100": { label: "Top 51-100", start: 50, end: 100 },
};

const TrendTreemap: React.FC<TrendTreemapProps> = ({
  trends,
  loading = false,
  error = null,
  className = "",
  onTrendClick,
}) => {
  const [currentRange, setCurrentRange] = useState<TrendRange>("top20");

  // Get next range for "Others" button
  const getNextRange = (): TrendRange | null => {
    switch (currentRange) {
      case "top20":
        return "top21-50";
      case "top21-50":
        return "top51-100";
      case "top51-100":
        return null; // No more ranges
      default:
        return null;
    }
  };

  const nextRange = getNextRange();

  // Filter trends based on current range
  const filteredTrends = useMemo(() => {
    const range = trendRanges[currentRange];
    const rangedTrends = trends.slice(range.start, range.end);
    const validTrends = rangedTrends.filter(
      (trend) => trend.tweet_volume !== null && trend.tweet_volume > 0
    );

    // Update category based on volume change (stock-like colors)
    const updatedTrends = validTrends.map((trend) => {
      const change = trend.volume_change_24h || 0;
      let category: "high" | "medium" | "low" | "null";

      if (change > 10) category = "high"; // Strong Up (Dark Green)
      else if (change > 1) category = "medium"; // Up (Light Green)
      else if (change >= -10) category = "low"; // Down (Light Red)
      else category = "null"; // Strong Down (Dark Red) - will be handled in TrendCard

      return {
        ...trend,
        category: category as "high" | "medium" | "low" | "null",
      };
    });

    // Add "Others" card if there's a next range and we have valid trends and the next range has data
    if (nextRange && updatedTrends.length > 0 && updatedTrends.length < 15) {
      const nextRangeConfig = trendRanges[nextRange];
      const nextRangeTrends = trends.slice(
        nextRangeConfig.start,
        nextRangeConfig.end
      );
      const hasNextRangeData = nextRangeTrends.some(
        (trend) => trend.tweet_volume !== null && trend.tweet_volume > 0
      );

      if (hasNextRangeData) {
        // Calculate a more balanced volume for "Others" card
        const totalVolume = updatedTrends.reduce(
          (sum, t) => sum + (t.tweet_volume || 0),
          0
        );
        const averageVolume = totalVolume / updatedTrends.length;
        const minVolume = Math.min(
          ...updatedTrends.map((t) => t.tweet_volume || 0)
        );

        // Use a volume that's between 15-25% of the average, but not too small
        const othersVolume = Math.max(
          Math.floor(minVolume * 0.8), // At least 80% of smallest volume
          Math.floor(averageVolume * 0.15), // Or 15% of average
          1000 // Minimum baseline
        );

        const othersTrend: TrendWithStats = {
          id: "others",
          name: "Others",
          rank: range.end + 1,
          tweet_volume: othersVolume,
          volume_change_24h: 0,
          percentage: (othersVolume / (totalVolume + othersVolume)) * 100,
          category: "low" as const, // Neutral color for Others
          url: "#",
          promoted_content: null,
          query: "others",
          momentum_score: 0,
          historical_data: [],
        };
        updatedTrends.push(othersTrend);
      }
    }

    return updatedTrends;
  }, [trends, currentRange, nextRange]);

  // Calculate Top 3 based on tweet volume - ONLY for Top 20 range
  const top3VolumeThreshold = useMemo(() => {
    // Only show Top 3 styling for "top20" range
    if (currentRange !== "top20") return 0;
    
    const validTrendsOnly = filteredTrends.filter(
      (trend) => trend.id !== "others" && trend.tweet_volume !== null
    );
    if (validTrendsOnly.length < 3) return 0;

    const sortedByVolume = [...validTrendsOnly].sort(
      (a, b) => (b.tweet_volume || 0) - (a.tweet_volume || 0)
    );
    return sortedByVolume[2]?.tweet_volume || 0; // Third highest volume
  }, [filteredTrends, currentRange]);

  // Calculate Top 3 rankings with their positions - ONLY for Top 20 range
  const top3Rankings = useMemo(() => {
    // Only show Top 3 styling for "top20" range
    if (currentRange !== "top20") return new Map<string, number>();
    
    const validTrendsOnly = filteredTrends.filter(
      (trend) => trend.id !== "others" && trend.tweet_volume !== null
    );
    const sortedByVolume = [...validTrendsOnly].sort(
      (a, b) => (b.tweet_volume || 0) - (a.tweet_volume || 0)
    );

    const rankings = new Map<string, number>();
    sortedByVolume.slice(0, 3).forEach((trend, index) => {
      rankings.set(trend.id, index + 1); // 1, 2, 3
    });

    return rankings;
  }, [filteredTrends, currentRange]);

  // Filter out trends with zero volume for better visualization
  const validTrends = useMemo(() => {
    return trends.filter(
      (trend) => trend.tweet_volume !== null && trend.tweet_volume > 0
    );
  }, [trends]);

  if (loading) {
    return (
      <Card
        className={`flex items-center justify-center h-96 bg-background/60 backdrop-blur-xl border border-border/50 shadow-2xl ${className}`}
      >
        <div className="flex items-center space-x-2 text-muted-foreground">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
          <span>Loading trends...</span>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card
        className={`flex items-center justify-center h-96 bg-background/60 backdrop-blur-xl border border-border/50 shadow-2xl ${className}`}
      >
        <div className="text-center text-red-500">
          <p className="text-lg font-semibold">Error loading trends</p>
          <p className="text-sm text-muted-foreground mt-2">{error}</p>
        </div>
      </Card>
    );
  }

  if (validTrends.length === 0) {
    return (
      <Card
        className={`flex items-center justify-center h-96 bg-background/60 backdrop-blur-xl border border-border/50 shadow-2xl ${className}`}
      >
        <div className="text-center text-muted-foreground">
          <p className="text-lg font-semibold">No trends available</p>
          <p className="text-sm mt-2">Check back later for trending topics</p>
        </div>
      </Card>
    );
  }

  return (
    <Card
      className={`bg-background/60 backdrop-blur-xl border border-border/50 shadow-2xl overflow-hidden ${className}`}
    >
      {/* Header Section with Controls */}
      <div className="p-2 sm:p-3 space-y-2 border-b border-border/20">
        {/* Range Navigation Buttons */}
        <div className="flex flex-wrap gap-1 sm:gap-2">
          {Object.entries(trendRanges).map(([key, range]) => (
            <Button
              key={key}
              variant={currentRange === key ? "default" : "outline"}
              size="sm"
              onClick={() => setCurrentRange(key as TrendRange)}
              className="transition-all duration-200 text-xs px-2 py-1"
            >
              <Badge
                variant={currentRange === key ? "secondary" : "outline"}
                className="mr-1 text-[10px] px-1"
              >
                {range.start + 1}-{range.end}
              </Badge>
              <span className="hidden sm:inline text-xs">{range.label}</span>
              <span className="sm:hidden text-xs">
                {range.label.replace("Top ", "")}
              </span>
            </Button>
          ))}
        </div>

        {/* Range Statistics */}
        <div className="p-2 rounded-lg bg-accent/5 border border-border/30">
          <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
            <div className="flex items-center space-x-1">
              <span className="font-medium">Range:</span>
              <Badge
                variant="outline"
                className="text-[10px] px-1"
              >
                {trendRanges[currentRange].label}
              </Badge>
            </div>
            <div className="flex items-center space-x-1">
              <span className="font-medium">Shown:</span>
              <Badge
                variant="outline"
                className="text-[10px] px-1"
              >
                {filteredTrends.length}/
                {trendRanges[currentRange].end -
                  trendRanges[currentRange].start}
              </Badge>
            </div>
            {filteredTrends.length > 0 && (
              <div className="flex items-center space-x-1">
                <span className="font-medium hidden sm:inline">
                  Total volume:
                </span>
                <span className="font-medium sm:hidden">Vol:</span>
                <Badge
                  variant="outline"
                  className="text-[10px] px-1"
                >
                  {filteredTrends
                    .reduce((sum, trend) => sum + (trend.tweet_volume || 0), 0)
                    .toLocaleString()}{" "}
                  tweets
                </Badge>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Treemap Section - Full Width */}
      <div className="relative w-full h-64 sm:h-80 md:h-96 lg:h-[800px] bg-gradient-to-br from-accent/10 to-accent/5 p-1">
        {filteredTrends.length === 0 ? (
          <div className="flex items-center justify-center h-full p-4">
            <div className="text-center text-muted-foreground">
              <p className="text-sm font-semibold">
                No trends available
              </p>
              <p className="text-xs mt-2">
                No data found for {trendRanges[currentRange].label} range
              </p>
              <p className="text-xs mt-1">Try switching to a different range</p>
            </div>
          </div>
        ) : (
          <TreemapLayoutComponent
            data={filteredTrends}
            width={0} // Will be calculated dynamically
            height={0} // Will be calculated dynamically
          >
            {(rects: TreemapRect[]) =>
              rects.map((rect: TreemapRect, index: number) => {
                // Check if this trend is in Top 3 by tweet volume
                const isTop3ByVolume =
                  rect.data.trend.id !== "others" &&
                  rect.data.trend.tweet_volume !== null &&
                  rect.data.trend.tweet_volume >= top3VolumeThreshold &&
                  top3VolumeThreshold > 0;

                // Get the ranking within Top 3 (1, 2, or 3)
                const top3Rank = top3Rankings.get(rect.data.trend.id);

                return (
                  <TrendCard
                    key={`${rect.data.trend.id}-${index}`}
                    trend={rect.data.trend}
                    size={{
                      x: rect.x,
                      y: rect.y,
                      width: rect.width,
                      height: rect.height,
                    }}
                    isTop3={isTop3ByVolume}
                    top3Rank={top3Rank}
                    onClick={() => {
                      if (rect.data.trend.id === "others" && nextRange) {
                        setCurrentRange(nextRange);
                      } else {
                        onTrendClick?.(rect.data.trend);
                      }
                    }}
                  />
                );
              })
            }
          </TreemapLayoutComponent>
        )}
      </div>

      {/* Legend Section */}
      <div className="p-2 sm:p-3 border-t border-border/20">
        <div className="flex flex-wrap gap-2 text-[10px] text-muted-foreground">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-600/80 border border-green-600 rounded"></div>
            <span className="whitespace-nowrap">Strong Up (&gt;+10%)</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-400/80 border border-green-400 rounded"></div>
            <span className="whitespace-nowrap">Up (+1% to +10%)</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-red-400/80 border border-red-400 rounded"></div>
            <span className="whitespace-nowrap">Down (-1% to -10%)</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-red-600/80 border border-red-600 rounded"></div>
            <span className="whitespace-nowrap">Strong Down (&lt;-10%)</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-muted/30 border border-border/50 rounded"></div>
            <span className="whitespace-nowrap">No Data</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default TrendTreemap;
