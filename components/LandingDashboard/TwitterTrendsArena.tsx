import React, { useState } from "react";
import { useTrends } from "@/hooks/useTrends";
import {
  TimeRange,
  LocationFilter as LocationFilterType,
  LanguageFilter,
} from "@/types/trends";
import TrendTreemap from "./trends/TrendTreemap";
import TrendsList from "./trends/TrendsList";
import TimeRangeSelector from "./trends/TimeRangeSelector";
import LocationFilter from "./trends/LocationFilter";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, Globe } from "lucide-react";
import XIcon from "../ui/icons/XIcon";

interface TwitterTrendsArenaProps {
  className?: string;
}

const TwitterTrendsArena: React.FC<TwitterTrendsArenaProps> = ({
  className = "",
}) => {
  const [timeRange, setTimeRange] = useState<TimeRange>("24H");
  const [location, setLocation] = useState<LocationFilterType>("worldwide");
  const [language] = useState<LanguageFilter>("all");

  const { data, metrics, loading, error, refetch } = useTrends({
    timeRange,
    location,
    language,
    useMockData: true,
  });

  const lastUpdated = data?.as_of
    ? new Date(data.as_of).toLocaleString()
    : "Unknown";
  const totalTrends = data?.trends.length || 0;
  const totalVolume = metrics?.total_volume || 0;

  const formatVolume = (volume: number) => {
    if (volume >= 1000000) return `${(volume / 1000000).toFixed(1)}M`;
    if (volume >= 1000) return `${(volume / 1000).toFixed(1)}K`;
    return volume.toString();
  };

  return (
    <section className={`py-8 sm:py-12 lg:py-16 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="mb-6 sm:mb-8">
          <h2 className="flex items-center text-2xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-900 to-slate-800 dark:from-gray-100 dark:to-slate-200 bg-clip-text">
            <XIcon className="w-7 h-7 mr-2" />
            Trends
          </h2>
        </div>

        <div className="space-y-4">
          {/* Controls Card */}
          <Card className="bg-background/60 backdrop-blur-xl border border-border/50 shadow-lg">
            <CardHeader className="pb-1">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-3 lg:space-y-0">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20">
                    <XIcon className="w-4 h-4 text-blue-500" />
                  </div>
                  <div>
                    <CardTitle className="text-sm font-semibold text-foreground">
                      Live Dashboard
                    </CardTitle>
                  </div>
                </div>{" "}
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
                  <TimeRangeSelector
                    selectedRange={timeRange}
                    onRangeChange={setTimeRange}
                  />
                  <LocationFilter
                    selectedLocation={location}
                    onLocationChange={setLocation}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={refetch}
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
                </div>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-3 pt-3 border-t border-border/30">
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
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-muted-foreground">
                    Total trends:
                  </span>
                  <Badge
                    variant="outline"
                    className="text-[10px] border-border/30 text-foreground"
                  >
                    {totalTrends}
                  </Badge>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-muted-foreground">
                    Total volume:
                  </span>
                  <Badge
                    variant="outline"
                    className="text-[10px] border-border/30 text-foreground"
                  >
                    {formatVolume(totalVolume)} tweets
                  </Badge>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Trending Up Section - Horizontal Layout */}
          <TrendsList
            title="Trending Up"
            trends={metrics?.trending_up || []}
            type="trending_up"
            className="horizontal-layout"
          />

          {/* Main Content */}
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            {/* Treemap - Takes up 3 columns on xl screens */}
            <div className="xl:col-span-3">
              <TrendTreemap
                trends={
                  data?.trends.map((trend, index) => ({
                    ...trend,
                    id: `trend-${index}`,
                    volume_change_24h: Math.random() * 100 - 50, // Mock data
                    volume_change_7d: Math.random() * 200 - 100,
                    volume_change_30d: Math.random() * 300 - 150,
                    momentum_score: Math.random() * 100 - 50,
                    rank: index + 1,
                    percentage:
                      totalVolume > 0
                        ? ((trend.tweet_volume || 0) / totalVolume) * 100
                        : 0,
                    category:
                      (trend.tweet_volume || 0) > 100000
                        ? ("high" as const)
                        : (trend.tweet_volume || 0) > 50000
                        ? ("medium" as const)
                        : (trend.tweet_volume || 0) > 0
                        ? ("low" as const)
                        : ("null" as const),
                    historical_data: [], // Will be populated by mock data
                  })) || []
                }
                loading={loading}
                error={error}
              />
            </div>

            {/* Sidebar - Takes up 1 column on xl screens */}
            <div className="xl:col-span-1 space-y-4">
              {/* Rising Trends */}
              <TrendsList
                title="Rising Trends"
                trends={metrics?.top_gainers || []}
                type="gainers"
              />

              {/* Falling Trends */}
              <TrendsList
                title="Falling Trends"
                trends={metrics?.top_losers || []}
                type="losers"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TwitterTrendsArena;
