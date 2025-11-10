import React, { useState } from "react";
import { useTrends } from "@/hooks/useTrends";
import { useSocialTrends } from "@/hooks/use-social-trends";
import {
  TimeRange,
  LocationFilter as LocationFilterType,
  LanguageFilter,
} from "@/types/trends";
import { SocialPlatform, TikTokTrend, XTrend } from "@/types/social-trends";
import { DEFAULT_LOCATION } from "@/config/locations";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TrendTreemap from "./trends/TrendTreemap";
import TrendsList from "./trends/TrendsList";
import TimeRangeSelector from "./trends/TimeRangeSelector";
import LocationFilter from "./trends/LocationFilter";
import GatherTrendsTab from "@/components/social-trends/gather-trends-tab";
import TikTokTreemap from "./trends/TikTokTreemap";
import XTreemap from "./trends/XTreemap";
import RedditTreemap from "./trends/RedditTreemap";
import {
  GoogleTrendsIcon,
  TikTokIcon,
  XIcon,
  RedditIcon,
  GatherIcon,
} from "@/components/icons/BrandIcons";

interface SocialMediaTrendsProps {
  className?: string;
}

const SocialMediaTrends: React.FC<SocialMediaTrendsProps> = ({
  className = "",
}) => {
  const [timeRange, setTimeRange] = useState<TimeRange>("4H");
  const [location, setLocation] =
    useState<LocationFilterType>(DEFAULT_LOCATION);
  const [language] = useState<LanguageFilter>("all");
  const [activeTab, setActiveTab] = useState<SocialPlatform>("google");

  // Keep existing Google Trends hook for treemap
  const { data, metrics, loading, error, refetch } = useTrends({
    timeRange,
    location,
    language,
    useMockData: true,
  });

  // New social trends hook for tabs
  const {
    tiktok,
    x,
    gather,
    reddit,
    loading: socialLoading,
    error: socialError,
  } = useSocialTrends({ useMockData: true });

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
    <section className={`py-6 sm:py-8 lg:py-12 xl:py-16 ${className}`}>
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
        {/* Section Title */}
        <div className="mb-4 sm:mb-6 lg:mb-8">
          <h2 className="flex items-center text-xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-900 to-slate-800 dark:from-gray-100 dark:to-slate-200 bg-clip-text">
            Social Media Trends
          </h2>
        </div>

        {/* Tabs Navigation */}
        <Tabs
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as SocialPlatform)}
          className="w-full"
        >
          <TabsList className="flex flex-wrap sm:grid sm:grid-cols-3 md:grid-cols-5 w-full mb-6 sm:mb-8 h-auto bg-white dark:bg-gray-800 p-1 sm:p-1.5 rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 gap-1 sm:gap-2">
            <TabsTrigger
              value="google"
              className="flex flex-row items-center justify-center gap-1.5 sm:gap-2.5 cursor-pointer px-2 sm:px-4 py-2 sm:py-3.5 rounded-lg sm:rounded-xl transition-all duration-300 data-[state=active]:bg-gradient-to-br data-[state=active]:from-blue-50 data-[state=active]:to-indigo-50 dark:data-[state=active]:from-blue-900/30 dark:data-[state=active]:to-indigo-900/30 data-[state=active]:shadow-md data-[state=active]:ring-2 data-[state=active]:ring-blue-500/20 hover:bg-gray-50 dark:hover:bg-gray-700/50 group"
            >
              <GoogleTrendsIcon className="w-4 h-4 sm:w-4 sm:h-4 flex-shrink-0 transition-transform group-data-[state=active]:scale-110" />
              <div className="flex flex-col items-start min-w-0">
                <span className="text-[11px] sm:text-sm font-semibold text-gray-700 dark:text-gray-300 group-data-[state=active]:text-blue-700 dark:group-data-[state=active]:text-blue-300 truncate">
                  Google
                </span>
                <span className="text-[9px] sm:text-xs text-gray-500 dark:text-gray-400 group-data-[state=active]:text-blue-600 dark:group-data-[state=active]:text-blue-400 truncate">
                  Trends
                </span>
              </div>
            </TabsTrigger>
            <TabsTrigger
              value="tiktok"
              className="flex flex-row items-center justify-center gap-1.5 sm:gap-2.5 cursor-pointer px-2 sm:px-4 py-2 sm:py-3.5 rounded-lg sm:rounded-xl transition-all duration-300 data-[state=active]:bg-gradient-to-br data-[state=active]:from-pink-50 data-[state=active]:to-cyan-50 dark:data-[state=active]:from-pink-900/30 dark:data-[state=active]:to-cyan-900/30 data-[state=active]:shadow-md data-[state=active]:ring-2 data-[state=active]:ring-pink-500/20 hover:bg-gray-50 dark:hover:bg-gray-700/50 group"
            >
              <TikTokIcon className="w-4 h-4 sm:w-6 sm:h-6 flex-shrink-0 transition-transform group-data-[state=active]:scale-110" />
              <div className="flex flex-col items-start min-w-0">
                <span className="text-[11px] sm:text-sm font-semibold text-gray-700 dark:text-gray-300 group-data-[state=active]:text-pink-700 dark:group-data-[state=active]:text-pink-300 truncate">
                  TikTok
                </span>
                <span className="text-[9px] sm:text-xs text-gray-500 dark:text-gray-400 group-data-[state=active]:text-pink-600 dark:group-data-[state=active]:text-pink-400 truncate">
                  Trends
                </span>
              </div>
            </TabsTrigger>
            <TabsTrigger
              value="x"
              className="flex flex-row items-center justify-center gap-1.5 sm:gap-2.5 cursor-pointer px-2 sm:px-4 py-2 sm:py-3.5 rounded-lg sm:rounded-xl transition-all duration-300 data-[state=active]:bg-gradient-to-br data-[state=active]:from-gray-50 data-[state=active]:to-slate-50 dark:data-[state=active]:from-gray-700/50 dark:data-[state=active]:to-slate-700/50 data-[state=active]:shadow-md data-[state=active]:ring-2 data-[state=active]:ring-gray-500/20 hover:bg-gray-50 dark:hover:bg-gray-700/50 group"
            >
              <XIcon className="w-4 h-4 sm:w-6 sm:h-6 flex-shrink-0 transition-transform group-data-[state=active]:scale-110" />
              <div className="flex flex-col items-start min-w-0">
                <span className="text-[11px] sm:text-sm font-semibold text-gray-700 dark:text-gray-300 group-data-[state=active]:text-gray-900 dark:group-data-[state=active]:text-white truncate">
                  X
                </span>
                <span className="text-[9px] sm:text-xs text-gray-500 dark:text-gray-400 group-data-[state=active]:text-gray-700 dark:group-data-[state=active]:text-gray-300 truncate">
                  Trends
                </span>
              </div>
            </TabsTrigger>
            <TabsTrigger
              value="reddit"
              className="flex flex-row items-center justify-center gap-1.5 sm:gap-2.5 cursor-pointer px-2 sm:px-4 py-2 sm:py-3.5 rounded-lg sm:rounded-xl transition-all duration-300 data-[state=active]:bg-gradient-to-br data-[state=active]:from-orange-50 data-[state=active]:to-red-50 dark:data-[state=active]:from-orange-900/30 dark:data-[state=active]:to-red-900/30 data-[state=active]:shadow-md data-[state=active]:ring-2 data-[state=active]:ring-orange-500/20 hover:bg-gray-50 dark:hover:bg-gray-700/50 group"
            >
              <RedditIcon className="w-4 h-4 sm:w-6 sm:h-6 flex-shrink-0 transition-transform group-data-[state=active]:scale-110" />
              <div className="flex flex-col items-start min-w-0">
                <span className="text-[11px] sm:text-sm font-semibold text-gray-700 dark:text-gray-300 group-data-[state=active]:text-orange-700 dark:group-data-[state=active]:text-orange-300 truncate">
                  Reddit
                </span>
                <span className="text-[9px] sm:text-xs text-gray-500 dark:text-gray-400 group-data-[state=active]:text-orange-600 dark:group-data-[state=active]:text-orange-400 truncate">
                  Trends
                </span>
              </div>
            </TabsTrigger>
            <TabsTrigger
              value="gather"
              className="flex flex-row items-center justify-center gap-1.5 sm:gap-2.5 cursor-pointer px-2 sm:px-4 py-2 sm:py-3.5 rounded-lg sm:rounded-xl transition-all duration-300 data-[state=active]:bg-gradient-to-br data-[state=active]:from-purple-50 data-[state=active]:to-violet-50 dark:data-[state=active]:from-purple-900/30 dark:data-[state=active]:to-violet-900/30 data-[state=active]:shadow-md data-[state=active]:ring-2 data-[state=active]:ring-purple-500/20 hover:bg-gray-50 dark:hover:bg-gray-700/50 group"
            >
              <GatherIcon className="w-4 h-4 sm:w-6 sm:h-6 flex-shrink-0 transition-transform group-data-[state=active]:scale-110" />
              <div className="flex flex-col items-start min-w-0">
                <span className="text-[11px] sm:text-sm font-semibold text-gray-700 dark:text-gray-300 group-data-[state=active]:text-purple-700 dark:group-data-[state=active]:text-purple-300 truncate">
                  Gather
                </span>
                <span className="text-[9px] sm:text-xs text-gray-500 dark:text-gray-400 group-data-[state=active]:text-purple-600 dark:group-data-[state=active]:text-purple-400 truncate">
                  Trends
                </span>
              </div>
            </TabsTrigger>
          </TabsList>

          {/* Google Trends Tab Content */}
          <TabsContent value="google" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              <div className="lg:col-span-2 xl:col-span-3">
                <TrendTreemap
                  trends={
                    data?.trends.map((trend, index) => ({
                      ...trend,
                      id: `trend-${index}`,
                      volume_change_24h: Math.random() * 100 - 50,
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
                      historical_data: [],
                    })) || []
                  }
                  loading={loading}
                  error={error}
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

              <div className="lg:col-span-1 xl:col-span-1 space-y-4">
                <TrendsList
                  title="Rising Trends"
                  trends={metrics?.top_gainers || []}
                  type="gainers"
                />
                <TrendsList
                  title="Falling Trends"
                  trends={metrics?.top_losers || []}
                  type="losers"
                />
              </div>
            </div>
          </TabsContent>

          {/* TikTok Trends Tab */}
          <TabsContent value="tiktok" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              <div className="lg:col-span-2 xl:col-span-3">
                <TikTokTreemap
                  trends={
                    (tiktok?.trends?.filter(
                      (t) => t.platform === "tiktok"
                    ) as TikTokTrend[]) || []
                  }
                  loading={socialLoading}
                  error={socialError}
                  timeRange={timeRange}
                  location={location}
                  lastUpdated={tiktok?.as_of}
                  totalTrends={tiktok?.trends?.length}
                  totalVolume={tiktok?.total_volume}
                  onRefetch={refetch}
                  TimeRangeSelector={TimeRangeSelector}
                  LocationFilter={LocationFilter}
                  onTimeRangeChange={setTimeRange}
                  onLocationChange={setLocation}
                />
              </div>

              <div className="lg:col-span-1 xl:col-span-1 space-y-4">
                <TrendsList
                  title="Rising Trends"
                  trends={
                    tiktok?.metrics?.top_gainers
                      ?.filter((t) => t.platform === "tiktok")
                      .map((trend, index) => {
                        const tiktokTrend = trend as TikTokTrend;
                        return {
                          ...trend,
                          id: `tiktok-gainer-${index}`,
                          name: tiktokTrend.hashtag_name || trend.name,
                          url:
                            trend.url ||
                            `https://tiktok.com/tag/${tiktokTrend.hashtag_name}`,
                          query: tiktokTrend.hashtag_name || trend.name,
                          promoted_content: null,
                          tweet_volume: trend.volume,
                        };
                      }) || []
                  }
                  type="gainers"
                />
                <TrendsList
                  title="Falling Trends"
                  trends={
                    tiktok?.metrics?.top_losers
                      ?.filter((t) => t.platform === "tiktok")
                      .map((trend, index) => {
                        const tiktokTrend = trend as TikTokTrend;
                        return {
                          ...trend,
                          id: `tiktok-loser-${index}`,
                          name: tiktokTrend.hashtag_name || trend.name,
                          url:
                            trend.url ||
                            `https://tiktok.com/tag/${tiktokTrend.hashtag_name}`,
                          query: tiktokTrend.hashtag_name || trend.name,
                          promoted_content: null,
                          tweet_volume: trend.volume,
                        };
                      }) || []
                  }
                  type="losers"
                />
              </div>
            </div>
          </TabsContent>

          {/* X Trends Tab */}
          <TabsContent value="x" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              <div className="lg:col-span-2 xl:col-span-3">
                <XTreemap
                  trends={
                    (x?.trends?.filter(
                      (t) => t.platform === "x"
                    ) as XTrend[]) || []
                  }
                  loading={socialLoading}
                  error={socialError}
                  timeRange={timeRange}
                  location={location}
                  lastUpdated={x?.as_of}
                  totalTrends={x?.trends?.length}
                  totalVolume={x?.total_volume}
                  onRefetch={refetch}
                  TimeRangeSelector={TimeRangeSelector}
                  LocationFilter={LocationFilter}
                  onTimeRangeChange={setTimeRange}
                  onLocationChange={setLocation}
                />
              </div>

              <div className="lg:col-span-1 xl:col-span-1 space-y-4">
                <TrendsList
                  title="Rising Trends"
                  trends={
                    x?.metrics?.top_gainers
                      ?.filter((t) => t.platform === "x")
                      .map((trend, index) => {
                        const xTrend = trend as XTrend;
                        return {
                          ...trend,
                          id: `x-gainer-${index}`,
                          name: xTrend.topic || trend.name,
                          url:
                            trend.url ||
                            `https://x.com/search?q=${encodeURIComponent(
                              xTrend.topic || trend.name
                            )}`,
                          query: xTrend.topic || trend.name,
                          promoted_content: null,
                          tweet_volume: trend.volume,
                        };
                      }) || []
                  }
                  type="gainers"
                />
                <TrendsList
                  title="Falling Trends"
                  trends={
                    x?.metrics?.top_losers
                      ?.filter((t) => t.platform === "x")
                      .map((trend, index) => {
                        const xTrend = trend as XTrend;
                        return {
                          ...trend,
                          id: `x-loser-${index}`,
                          name: xTrend.topic || trend.name,
                          url:
                            trend.url ||
                            `https://x.com/search?q=${encodeURIComponent(
                              xTrend.topic || trend.name
                            )}`,
                          query: xTrend.topic || trend.name,
                          promoted_content: null,
                          tweet_volume: trend.volume,
                        };
                      }) || []
                  }
                  type="losers"
                />
              </div>
            </div>
          </TabsContent>

          {/* Reddit Trends Tab */}
          <TabsContent value="reddit" className="mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              <div className="lg:col-span-2 xl:col-span-3">
                <RedditTreemap
                  trends={
                    reddit?.trends?.filter((t) => t.platform === "reddit") || []
                  }
                  loading={socialLoading}
                  error={socialError}
                  timeRange={timeRange}
                  location={location}
                  lastUpdated={reddit?.as_of}
                  totalTrends={reddit?.trends?.length}
                  totalVolume={reddit?.total_volume}
                  onRefetch={refetch}
                  TimeRangeSelector={TimeRangeSelector}
                  LocationFilter={LocationFilter}
                  onTimeRangeChange={setTimeRange}
                  onLocationChange={setLocation}
                />
              </div>

              <div className="lg:col-span-1 xl:col-span-1 space-y-4">
                <TrendsList
                  title="Rising Trends"
                  trends={
                    reddit?.metrics?.top_gainers
                      ?.filter((t) => t.platform === "reddit")
                      .map((trend, index) => ({
                        ...trend,
                        id: `reddit-gainer-${index}`,
                        name: trend.name,
                        url: trend.url || `https://reddit.com`,
                        query: trend.name,
                        promoted_content: null,
                        tweet_volume: trend.volume,
                      })) || []
                  }
                  type="gainers"
                />
                <TrendsList
                  title="Falling Trends"
                  trends={
                    reddit?.metrics?.top_losers
                      ?.filter((t) => t.platform === "reddit")
                      .map((trend, index) => ({
                        ...trend,
                        id: `reddit-loser-${index}`,
                        name: trend.name,
                        url: trend.url || `https://reddit.com`,
                        query: trend.name,
                        promoted_content: null,
                        tweet_volume: trend.volume,
                      })) || []
                  }
                  type="losers"
                />
              </div>
            </div>
          </TabsContent>

          {/* Gather Trends Tab */}
          <TabsContent value="gather" className="mt-0">
            <GatherTrendsTab
              trends={
                gather?.trends?.filter((t) => t.platform === "gather") || []
              }
              loading={socialLoading}
              error={socialError}
            />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default SocialMediaTrends;
