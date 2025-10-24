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
                // Live Dashboard props
                timeRange={timeRange}
                location={location}
                lastUpdated={lastUpdated}
                totalTrends={totalTrends}
                totalVolume={totalVolume}
                onRefetch={refetch}
                TimeRangeSelector={TimeRangeSelector}
                LocationFilter={LocationFilter}
                formatVolume={formatVolume}
                onTimeRangeChange={setTimeRange}
                onLocationChange={setLocation}
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
