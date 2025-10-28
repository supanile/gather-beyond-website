import React, { useState, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { XTrend } from '@/types/social-trends';
import { TimeRange, LocationFilter as LocationFilterType } from '@/types/trends';
import { Loader2, TrendingUp, TrendingDown, BarChart3, RefreshCw } from 'lucide-react';
import TrendCard from './TrendCard';
import TreemapLayoutComponent from './TreemapLayout';
import TrendDetailsDialog from './TrendDetailsDialog';

interface XTreemapProps {
  trends: XTrend[];
  loading?: boolean;
  error?: string | null;
  className?: string;
  onTrendClick?: (trend: any) => void;
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
  const [selectedTrend, setSelectedTrend] = useState<any>(null);
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

  const formatVolume = (volume: number | string) => {
    if (typeof volume === 'string') return volume;
    if (volume >= 1000000) return `${(volume / 1000000).toFixed(1)}M`;
    if (volume >= 1000) return `${(volume / 1000).toFixed(1)}K`;
    return volume.toString();
  };

  // Filter trends based on current range
  const filteredTrends = useMemo(() => {
    const range = trendRanges[currentRange];
    const rangedTrends = trends.slice(range.start, range.end);
    
    // Filter out trends with zero volume
    const validTrends = rangedTrends.filter(
      (trend) => trend.volume > 0
    );

    return validTrends;
  }, [trends, currentRange]);

  // Calculate treemap layout using simple grid
  const treemapData = useMemo(() => {
    if (filteredTrends.length === 0) return [];
    
    const data = filteredTrends.map(trend => ({
      ...trend,
      value: trend.volume || 1,
    }));

    // Simple grid layout
    const containerWidth = 800;
    const containerHeight = 600;
    const cols = Math.ceil(Math.sqrt(data.length));
    const rows = Math.ceil(data.length / cols);
    const cellWidth = containerWidth / cols;
    const cellHeight = containerHeight / rows;
    
    return data.map((item, index) => ({
      ...item,
      x: (index % cols) * cellWidth,
      y: Math.floor(index / cols) * cellHeight,
      dx: cellWidth,
      dy: cellHeight,
    }));
  }, [filteredTrends]);

  const getColorByCategory = (trend: XTrend) => {
    const change = trend.volume_change_24h || 0;

    if (change > 10) {
      return "bg-gradient-to-br from-green-600/90 to-green-700/95 backdrop-blur-sm";
    } else if (change > 1) {
      return "bg-gradient-to-br from-green-400/85 to-green-500/90 backdrop-blur-sm";
    } else if (change >= -10) {
      return "bg-gradient-to-br from-red-400/85 to-red-500/90 backdrop-blur-sm";
    } else {
      return "bg-gradient-to-br from-red-600/90 to-red-700/95 backdrop-blur-sm";
    }
  };

  const getTrendIcon = (trend: XTrend) => {
    if (trend.volume_change_24h === undefined)
      return <BarChart3 className="w-3 h-3 text-white/70" />;
    if (trend.volume_change_24h > 0)
      return <TrendingUp className="w-3 h-3 text-green-300" />;
    if (trend.volume_change_24h < 0)
      return <TrendingDown className="w-3 h-3 text-red-300" />;
    return <BarChart3 className="w-3 h-3 text-white/70" />;
  };

  if (loading) {
    return (
      <Card className={`flex items-center justify-center h-96 bg-background/60 backdrop-blur-xl border border-border/50 shadow-2xl ${className}`}>
        <div className="flex items-center space-x-2 text-muted-foreground">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
          <span>Loading X trends...</span>
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className={`flex items-center justify-center h-96 bg-background/60 backdrop-blur-xl border border-border/50 shadow-2xl ${className}`}>
        <div className="text-center text-red-500">
          <p className="text-lg font-semibold">Error loading X trends</p>
          <p className="text-sm text-muted-foreground mt-2">{error}</p>
        </div>
      </Card>
    );
  }

  if (filteredTrends.length === 0) {
    return (
      <Card className={`flex items-center justify-center h-96 bg-background/60 backdrop-blur-xl border border-border/50 shadow-2xl ${className}`}>
        <div className="text-center text-muted-foreground">
          <p className="text-lg font-semibold">No X trends available</p>
          <p className="text-sm mt-2">Check back later for trending topics</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className={`bg-background/60 backdrop-blur-xl border border-border/50 shadow-2xl overflow-hidden ${className}`}>
      {/* Header Section with Controls */}
      <div className="p-2 sm:p-3 space-y-3 border-b border-border/20">
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
            <span>X Trends • {filteredTrends.length} topics</span>
            <span>Total volume: {formatVolume(filteredTrends.reduce((sum, t) => sum + t.volume, 0))}</span>
          </div>
        </div>
      </div>

      {/* Treemap Section */}
      <div className="relative w-full h-64 sm:h-80 md:h-96 lg:h-[600px] bg-gradient-to-br from-gray-50/10 to-slate-50/5 p-1">
        <div className="relative w-full h-full overflow-hidden">
          {treemapData.map((item: XTrend & { x: number; y: number; dx: number; dy: number }, index: number) => {
            const trend = item;
            const width = Math.max(40, trend.dx - 2);
            const height = Math.max(30, trend.dy - 2);
            const fontSize = Math.max(8, Math.min(16, Math.sqrt(width * height) / 8));
            const padding = Math.max(4, Math.min(12, Math.sqrt(width * height) / 20));

            return (
              <div
                key={`${trend.id}-${index}`}
                className={`absolute cursor-pointer transition-all duration-200 group overflow-hidden rounded-sm ${getColorByCategory(trend)}`}
                style={{
                  left: trend.x + 1,
                  top: trend.y + 1,
                  width: width,
                  height: height,
                  fontSize: `${fontSize}px`,
                  padding: `${padding}px`,
                  opacity: 0.9,
                }}
                onClick={() => onTrendClick?.(trend)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.opacity = "1";
                  e.currentTarget.style.zIndex = "50";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.opacity = "0.9";
                  e.currentTarget.style.zIndex = "1";
                }}
                title={`${trend.topic} - ${formatVolume(trend.tweet_volume)} tweets - ${trend.last_updated}`}
              >
                <div className="flex flex-col h-full justify-between relative">
                  <div className="flex items-start justify-between relative z-10 min-h-0">
                    <div className="absolute top-0 right-0 opacity-60">
                      {getTrendIcon(trend)}
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col justify-center relative z-10 min-h-0">
                    <div className="space-y-0.5">
                      <div 
                        className="font-semibold text-white leading-tight break-words hyphens-auto"
                        style={{ 
                          fontSize: `${Math.max(fontSize * 0.9, 10)}px`,
                          lineHeight: '1.1',
                        }}
                      >
                        {trend.topic}
                      </div>
                      {width > 80 && height > 50 && (
                        <>
                          <div 
                            className="text-white/80 leading-tight"
                            style={{ fontSize: `${Math.max(fontSize * 0.6, 8)}px` }}
                          >
                            {formatVolume(trend.tweet_volume)} tweets
                          </div>
                          <div 
                            className="text-white/60 leading-tight truncate"
                            style={{ fontSize: `${Math.max(fontSize * 0.5, 7)}px` }}
                          >
                            {trend.last_updated}
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {width > 60 && height > 40 && trend.volume_change_24h !== undefined && (
                    <div className="relative z-10">
                      <div 
                        className={`text-xs font-medium ${
                          trend.volume_change_24h >= 0 ? 'text-green-200' : 'text-red-200'
                        }`}
                        style={{ fontSize: `${Math.max(fontSize * 0.5, 7)}px` }}
                      >
                        {trend.volume_change_24h >= 0 ? '+' : ''}{trend.volume_change_24h.toFixed(1)}%
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
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
  );
};

export default XTreemap;
