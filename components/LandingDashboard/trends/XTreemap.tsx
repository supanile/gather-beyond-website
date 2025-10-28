import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { XTrend } from '@/types/social-trends';
import { TimeRange, LocationFilter as LocationFilterType, TrendWithStats } from '@/types/trends';
import { Loader2, RefreshCw } from 'lucide-react';
import TrendCard from './TrendCard';
import TreemapLayoutComponent from './TreemapLayout';
import TrendDetailsDialog from './TrendDetailsDialog';

interface XTreemapProps {
  trends: XTrend[];
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

const XTreemap: React.FC<XTreemapProps> = ({
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

  const defaultFormatVolume = (volume: number) => {
    if (volume >= 1000000) return `${(volume / 1000000).toFixed(1)}M`;
    if (volume >= 1000) return `${(volume / 1000).toFixed(1)}K`;
    return volume.toString();
  };

  // Function to convert tweet_volume string to number for processing
  const convertTweetVolumeToNumber = (tweetVolume: string | number): number => {
    if (typeof tweetVolume === 'number') return tweetVolume;
    
    const volumeStr = tweetVolume.toLowerCase();
    
    // Handle "Under 10k" case
    if (volumeStr.includes('under')) {
      const match = volumeStr.match(/under\s+(\d+(?:\.\d+)?)\s*k/);
      if (match) {
        return Math.floor(Math.random() * (parseFloat(match[1]) * 1000)); // Random number under the limit
      }
      return 5000; // Default for "Under 10k"
    }
    
    // Handle "2.7M", "5.8K", etc.
    const numberMatch = volumeStr.match(/(\d+(?:\.\d+)?)\s*([mk])/);
    if (numberMatch) {
      const number = parseFloat(numberMatch[1]);
      const unit = numberMatch[2];
      if (unit === 'm') return number * 1000000;
      if (unit === 'k') return number * 1000;
    }
    
    // Handle plain numbers like "38.3k"
    const plainMatch = volumeStr.match(/(\d+(?:\.\d+)?)\s*k?/);
    if (plainMatch) {
      const number = parseFloat(plainMatch[1]);
      if (volumeStr.includes('k')) return number * 1000;
      return number;
    }
    
    return 0;
  };

  const handleTimeRangeChange = (range: TimeRange) => {
    if (onTimeRangeChange) {
      onTimeRangeChange(range);
    } else {
      console.log("Time range changed to:", range);
    }
  };

  const handleLocationChange = (loc: LocationFilterType) => {
    if (onLocationChange) {
      onLocationChange(loc);
    } else {
      console.log("Location changed to:", loc);
    }
  };

  // Convert XTrend to TrendWithStats format for compatibility
  const convertedTrends = useMemo(() => {
    return trends.map((trend, index) => ({
      // TrendWithStats required fields
      id: trend.id || `x-trend-${index}`,
      name: trend.topic,
      url: trend.url || `https://twitter.com/search?q=${encodeURIComponent(trend.topic)}`,
      promoted_content: null,
      query: trend.topic,
      tweet_volume: convertTweetVolumeToNumber(trend.tweet_volume),
      volume_change_24h: trend.volume_change_24h,
      momentum_score: trend.momentum_score || 0,
      rank: index + 1,
      percentage: trend.percentage || 0,
      category: "medium" as const,
      historical_data: trend.historical_data || [],
      // Additional X-specific fields
      platform: trend.platform,
      topic: trend.topic,
      last_updated: trend.last_updated,
      volume: trend.volume,
    }));
  }, [trends]);

  // Filter trends based on current range (exclude "others")
  const filteredTrends = useMemo(() => {
    const range = trendRanges[currentRange];
    
    const limitedTrends = convertedTrends.slice(0, 100);
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
  }, [convertedTrends, currentRange]);

  // Calculate Top 3 rankings from ALL 100 trends
  const top3Rankings = useMemo(() => {
    const allValidTrends = convertedTrends
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
  }, [convertedTrends]);

  // Filter out trends with zero volume and "others"
  const validTrends = useMemo(() => {
    return convertedTrends
      .slice(0, 100)
      .filter(
        (trend) => 
          trend.id !== 'others' &&
          trend.tweet_volume !== null && 
          trend.tweet_volume > 0
      );
  }, [convertedTrends]);

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

  const volumeFormatter = formatVolume || defaultFormatVolume;

  if (loading) {
    return (
      <Card
        className={`flex items-center justify-center h-96 bg-background/60 backdrop-blur-xl border border-border/50 shadow-2xl ${className}`}
      >
        <div className="flex items-center space-x-2 text-muted-foreground">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
          <span>Loading X trends...</span>
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
          <p className="text-lg font-semibold">Error loading X trends</p>
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
          <p className="text-lg font-semibold">No X trends available</p>
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
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
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
              </div>
              {onRefetch && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onRefetch}
                  className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
                >
                  <RefreshCw className="w-3 h-3" />
                </Button>
              )}
            </div>
          )}

          {/* Range Selection */}
          <div className="flex flex-wrap gap-1 sm:gap-2">
            {Object.entries(trendRanges).map(([key, range]) => (
              <Button
                key={key}
                variant={currentRange === key ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentRange(key as TrendRange)}
                className="text-xs sm:text-sm h-8 px-2 sm:px-3"
              >
                {range.label}
              </Button>
            ))}
          </div>

          {/* Info Panel */}
          <div className="p-2 rounded-lg bg-accent/5 border border-border/30">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm text-muted-foreground">
              <span>
                X Trends • {filteredTrends.length} topics
                {lastUpdated && ` • Last updated: ${lastUpdated}`}
              </span>
              <span>
                Total volume: {volumeFormatter(totalVolume || 0)}
                {totalTrends && ` • Showing ${totalTrends} trends`}
              </span>
            </div>
          </div>
        </div>

        {/* Treemap Section - Full Width */}
        <div className="relative w-full h-64 sm:h-80 md:h-96 lg:h-[600px] bg-gradient-to-br from-accent/10 to-accent/5 p-1">
          {filteredTrends.length === 0 ? (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              <p>No trends available for the selected range</p>
            </div>
          ) : (
            <TreemapLayoutComponent
              data={filteredTrends}
              width={0}
              height={0}
            >
              {(rects) =>
                rects.map((rect, index) => {
                  const isTop3 = top3Rankings.has(rect.data.trend.id);
                  const top3Rank = top3Rankings.get(rect.data.trend.id);

                  return (
                    <TrendCard
                      key={`${rect.data.trend.id}-${index}`}
                      trend={rect.data.trend}
                      size={{
                        width: rect.width,
                        height: rect.height,
                        x: rect.x,
                        y: rect.y,
                      }}
                      isTop3={isTop3}
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
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-gradient-to-br from-green-600 to-green-700"></div>
                <span>Rising (+10%)</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-gradient-to-br from-green-400 to-green-500"></div>
                <span>Growing (+1%)</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-gradient-to-br from-red-400 to-red-500"></div>
                <span>Declining (-1%)</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 rounded bg-gradient-to-br from-red-600 to-red-700"></div>
                <span>Falling (-10%)</span>
              </div>
            </div>
            <span>Size represents tweet volume</span>
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

export default XTreemap;
