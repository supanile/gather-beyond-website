import React, { useMemo, useState } from "react";
import { TrendWithStats, TimeRange, LocationFilter as LocationFilterType } from "@/types/trends";
import TrendCard from "./TrendCard";
import TreemapLayoutComponent, { TreemapRect } from "./TreemapLayout";
import TrendDetailsDialog from "./TrendDetailsDialog";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, RefreshCw, Globe } from "lucide-react";

interface TrendTreemapProps {
  trends: TrendWithStats[];
  loading?: boolean;
  error?: string | null;
  className?: string;
  onTrendClick?: (trend: TrendWithStats) => void;
  // Live Dashboard controls
  timeRange?: TimeRange;
  location?: LocationFilterType;
  lastUpdated?: string;
  totalTrends?: number;
  totalVolume?: number;
  onRefetch?: () => void;
  TimeRangeSelector?: React.ComponentType<{
    selectedRange: TimeRange;
    onRangeChange: (range: TimeRange) => void;
  }>;
  LocationFilter?: React.ComponentType<{
    selectedLocation: LocationFilterType;
    onLocationChange: (location: LocationFilterType) => void;
  }>;
  formatVolume?: (volume: number) => string;
  onTimeRangeChange?: (range: TimeRange) => void;
  onLocationChange?: (location: LocationFilterType) => void;
}

type TrendRange = "top20" | "top21-50" | "top51-100";

const trendRanges: {
  [key in TrendRange]: { label: string; start: number; end: number };
} = {
  top20: { label: "Top 1-20", start: 0, end: 20 },
  "top21-50": { label: "Top 21-50", start: 20, end: 50 },
  "top51-100": { label: "Top 51-100", start: 50, end: 100 },
};

const TrendTreemap: React.FC<TrendTreemapProps> = ({
  trends,
  loading = false,
  error = null,
  className = "",
  onTrendClick,
  timeRange,
  location,
  lastUpdated,
  totalTrends,
  totalVolume,
  onRefetch,
  TimeRangeSelector,
  LocationFilter,
  formatVolume,
  onTimeRangeChange,
  onLocationChange,
}) => {
  const [currentRange, setCurrentRange] = useState<TrendRange>("top20");
  const [selectedTrend, setSelectedTrend] = useState<TrendWithStats | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleTimeRangeChange = (range: TimeRange) => {
    if (onTimeRangeChange) {
      onTimeRangeChange(range);
    } else {
      console.log("Time range changed to:", range);
    }
  };

  const handleLocationChange = (location: LocationFilterType) => {
    if (onLocationChange) {
      onLocationChange(location);
    } else {
      console.log("Location changed to:", location);
    }
  };

  // Filter trends based on current range (exclude "others")
  const filteredTrends = useMemo(() => {
    const range = trendRanges[currentRange];
    
    const limitedTrends = trends.slice(0, 100);
    const rangedTrends = limitedTrends.slice(range.start, range.end);
    
    // Filter out "others" and null/zero volume trends
    const validTrends = rangedTrends.filter(
      (trend) => 
        trend.id !== 'others' && 
        trend.tweet_volume !== null && 
        trend.tweet_volume > 0
    );

    // Update category based on volume change
    const updatedTrends = validTrends.map((trend) => {
      const change = trend.volume_change_24h || 0;
      let category: "high" | "medium" | "low" | "null";

      if (change > 10) category = "high";
      else if (change > 1) category = "medium";
      else if (change >= -10) category = "low";
      else category = "null";

      return {
        ...trend,
        category: category as "high" | "medium" | "low" | "null",
      };
    });

    return updatedTrends;
  }, [trends, currentRange]);

  // Calculate Top 3 rankings from ALL 100 trends
  const top3Rankings = useMemo(() => {
    const allValidTrends = trends
      .slice(0, 100)
      .filter((trend) => trend.id !== "others" && trend.tweet_volume !== null);
    
    const sortedByVolume = [...allValidTrends].sort(
      (a, b) => (b.tweet_volume || 0) - (a.tweet_volume || 0)
    );

    const rankings = new Map<string, number>();
    sortedByVolume.slice(0, 3).forEach((trend, index) => {
      rankings.set(trend.id, index + 1);
    });

    return rankings;
  }, [trends]);

  // Filter out trends with zero volume and "others"
  const validTrends = useMemo(() => {
    return trends
      .slice(0, 100)
      .filter(
        (trend) => 
          trend.id !== 'others' &&
          trend.tweet_volume !== null && 
          trend.tweet_volume > 0
      );
  }, [trends]);

  // Handle trend click
  const handleTrendClick = (trend: TrendWithStats) => {
    console.log("handleTrendClick called:", trend.name, trend.id);
    
    console.log("Opening dialog for:", trend.name);
    setSelectedTrend(trend);
    setIsDialogOpen(true);
    
    if (onTrendClick) {
      onTrendClick(trend);
    }
  };

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
    <>
      <Card
        className={`bg-background/60 backdrop-blur-xl border border-border/50 shadow-2xl overflow-hidden ${className}`}
      >
        {/* Header Section with Controls */}
        <div className="p-2 sm:p-3 space-y-3 border-b border-border/20">
          {/* Live Dashboard Controls */}
          {(TimeRangeSelector || LocationFilter || onRefetch) && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
              {TimeRangeSelector && timeRange && (
                <TimeRangeSelector
                  selectedRange={timeRange}
                  onRangeChange={handleTimeRangeChange}
                />
              )}
              {LocationFilter && location && (
                <LocationFilter
                  selectedLocation={location}
                  onLocationChange={handleLocationChange}
                />
              )}
              {onRefetch && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onRefetch}
                  disabled={loading}
                  className="border-border/50 bg-background/60 backdrop-blur-xl text-foreground hover:bg-accent/50 hover:border-border shadow-lg hover:shadow-xl transition-all duration-300 text-xs"
                >
                  <RefreshCw
                    className={`w-3 h-3 mr-1 ${
                      loading ? "animate-spin" : ""
                    }`}
                  />
                  Refresh
                </Button>
              )}
            </div>
          )}

          {/* Range Navigation Buttons */}
          <div className="flex flex-wrap gap-1 sm:gap-2">
            {Object.entries(trendRanges).map(([key, range]) => {
              const rangeData = trends
                .slice(0, 100)
                .slice(range.start, range.end)
                .filter((t) => t.id !== 'others' && t.tweet_volume !== null && t.tweet_volume > 0);
              
              const trendCount = rangeData.length;
              const isDisabled = trendCount === 0;

              return (
                <Button
                  key={key}
                  variant={currentRange === key ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentRange(key as TrendRange)}
                  disabled={isDisabled}
                  className="transition-all duration-200 text-xs px-2 py-1"
                >
                  <Badge
                    variant={currentRange === key ? "secondary" : "outline"}
                    className="mr-1 text-[10px] px-1"
                  >
                    {range.start + 1}-{range.end}
                  </Badge>
                  <span className="hidden sm:inline text-xs">
                    {range.label}
                    {trendCount > 0 && ` (${trendCount})`}
                  </span>
                  <span className="sm:hidden text-xs">
                    #{range.start + 1}-{range.end}
                    {trendCount > 0 && ` (${trendCount})`}
                  </span>
                </Button>
              );
            })}
          </div>

          {/* Range Statistics */}
          <div className="p-2 rounded-lg bg-accent/5 border border-border/30">
            <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
              {lastUpdated && (
                <div className="flex items-center space-x-2">
                  <Globe className="w-3 h-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    Last updated:
                  </span>
                  <Badge
                    variant="secondary"
                    className="text-[10px] bg-accent/50 text-foreground border-border/30"
                  >
                    {lastUpdated}
                  </Badge>
                </div>
              )}
              {totalTrends && (
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-muted-foreground">
                    Total trends:
                  </span>
                  <Badge
                    variant="outline"
                    className="text-[10px] border-border/30 text-foreground"
                  >
                    {Math.min(totalTrends, 100)} {totalTrends > 100 && "(limited)"}
                  </Badge>
                </div>
              )}
              {totalVolume && formatVolume && (
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-muted-foreground">
                    Total volume:
                  </span>
                  <Badge
                    variant="outline"
                    className="text-[10px] border-border/30 text-foreground"
                  >
                    {formatVolume(totalVolume)} searches
                  </Badge>
                </div>
              )}
              {filteredTrends.length > 0 && (
                <div className="flex items-center space-x-1">
                  <span className="font-medium hidden sm:inline">
                    Showing:
                  </span>
                  <Badge
                    variant="outline"
                    className="text-[10px] px-1"
                  >
                    {filteredTrends.length} trends
                  </Badge>
                  <span className="text-xs">|</span>
                  <Badge
                    variant="outline"
                    className="text-[10px] px-1"
                  >
                    {filteredTrends
                      .reduce((sum, trend) => sum + (trend.tweet_volume || 0), 0)
                      .toLocaleString()}{" "}
                    searches
                  </Badge>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Treemap Section - Full Width */}
        <div className="relative w-full h-64 sm:h-80 md:h-96 lg:h-[600px] bg-gradient-to-br from-accent/10 to-accent/5 p-1">
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
              width={0}
              height={0}
            >
              {(rects: TreemapRect[]) =>
                rects.map((rect: TreemapRect, index: number) => {
                  const top3Rank = top3Rankings.get(rect.data.trend.id);
                  const isTop3ByVolume = top3Rank !== undefined;

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
                      onTrendClick={handleTrendClick}
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

      {/* Dialog Component */}
      <TrendDetailsDialog
        trend={selectedTrend}
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setSelectedTrend(null);
        }}
      />
    </>
  );
};

export default TrendTreemap;