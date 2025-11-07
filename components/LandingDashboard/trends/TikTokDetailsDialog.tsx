import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  TrendingUp,
  TrendingDown,
  ExternalLink,
  Eye,
  Globe,
  Calendar,
  Hash,
  Play,
} from "lucide-react";
import { TrendWithStats } from "@/types/trends";
import { formatTweetVolume } from "@/lib/utils/mockData";
import {
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Area,
  AreaChart,
} from "recharts";

interface TikTokDetailsDialogProps {
  trend: TrendWithStats | null;
  isOpen: boolean;
  onClose: () => void;
}

const TikTokDetailsDialog: React.FC<TikTokDetailsDialogProps> = ({
  trend,
  isOpen,
  onClose,
}) => {
  if (!trend || trend.id === "others") return null;

  // Mock data for TikTok style chart (video views over time)
  const generateTrendsData = () => {
    const days = [];
    const baseVolume = trend.tweet_volume || 1000000;

    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);

      const dayOfWeek = date.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      
      let trendMultiplier = 1;
      if (i < 7) trendMultiplier = 1.3; // Recent spike for viral content
      if (isWeekend) trendMultiplier *= 1.2; // Higher on weekends for TikTok
      
      const noise = (Math.random() - 0.5) * 0.4;
      const seasonality = Math.sin((i / 30) * Math.PI * 2) * 0.2;
      
      const normalizedValue = Math.max(0, Math.min(100, 
        50 + (seasonality + noise) * 30 + (trendMultiplier - 1) * 20
      ));

      days.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        fullDate: date.toISOString().split('T')[0],
        value: Math.round(normalizedValue),
        views: Math.round(baseVolume * (normalizedValue / 100)),
      });
    }
    return days;
  };

  const trendsData = generateTrendsData();
  const maxValue = Math.max(...trendsData.map(d => d.value));
  const avgValue = trendsData.reduce((sum, d) => sum + d.value, 0) / trendsData.length;

  const getTrendDirection = () => {
    const recent = trendsData.slice(-7).reduce((sum, d) => sum + d.value, 0) / 7;
    const previous = trendsData.slice(-14, -7).reduce((sum, d) => sum + d.value, 0) / 7;
    return recent - previous;
  };

  const trendDirection = getTrendDirection();

  interface TikTokTooltipProps {
    active?: boolean;
    payload?: Array<{ value: number; payload: { fullDate: string; value: number; views: number } }>;
    label?: string;
  }

  const TikTokTooltip = ({ active, payload }: TikTokTooltipProps) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg px-4 py-3 shadow-lg">
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-1">{data.fullDate}</p>
          <p className="text-gray-900 dark:text-white font-semibold">
            View Interest: {data.value}
          </p>
          <p className="text-gray-600 dark:text-gray-400 text-xs">
            ~{formatTweetVolume(data.views)} views
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] h-[90vh] max-w-md bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 p-0 rounded-lg md:w-[90vw] md:h-[85vh] md:max-w-5xl md:border md:border-gray-200 dark:md:border-gray-800 overflow-hidden flex flex-col">
        {/* TikTok Style Header */}
        <DialogHeader className="px-3 py-2 md:px-5 md:py-3 border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-pink-50 to-cyan-50 dark:from-pink-900/20 dark:to-cyan-900/20 flex-shrink-0">
          <DialogTitle className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1.5 sm:gap-2">
            <div className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-3">
              <div className="flex items-center gap-1.5">
                <Hash className="w-4 h-4 md:w-5 md:h-5 text-pink-600 flex-shrink-0" />
                <span className="text-sm md:text-xl font-normal text-gray-900 dark:text-white break-words line-clamp-2">
                  {trend.name}
                </span>
              </div>
              <Badge className="bg-pink-100 dark:bg-pink-900/30 text-pink-800 dark:text-pink-300 border-pink-200 dark:border-pink-800 w-fit text-xs">
                Trending #{trend.rank}
              </Badge>
            </div>
          </DialogTitle>
        </DialogHeader>

        {/* Main Content - Scrollable */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-3 md:px-5 md:py-4 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
          <div className="max-w-full mx-auto space-y-3 md:space-y-5 pb-4 md:pb-6">
              
              {/* Views Chart */}
              <div className="space-y-2 md:space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-2">
                  <h2 className="text-sm md:text-lg font-medium text-gray-900 dark:text-white">
                    Video Views Over Time
                  </h2>
                  <div className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400">
                    <Calendar className="w-3 h-3" />
                    Last 30 days
                  </div>
                </div>
                
                <Card className="border-gray-200 dark:border-gray-800">
                  <CardContent className="p-2 md:p-4">
                    <div className="h-32 md:h-48 w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={trendsData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                          <defs>
                            <linearGradient id="tiktokGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#EC4899" stopOpacity={0.3}/>
                              <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.1}/>
                            </linearGradient>
                          </defs>
                          <XAxis 
                            dataKey="date" 
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#6B7280', fontSize: 8 }}
                            interval="preserveStartEnd"
                          />
                          <YAxis 
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#6B7280', fontSize: 8 }}
                            domain={[0, 100]}
                            width={22}
                          />
                          <Tooltip content={<TikTokTooltip />} />
                          <Area
                            type="monotone"
                            dataKey="value"
                            stroke="#EC4899"
                            strokeWidth={2}
                            fill="url(#tiktokGradient)"
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="mt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs text-gray-600 dark:text-gray-400">
                      <span className="text-left line-clamp-2">Numbers represent view interest relative to the highest point.</span>
                      <span className="text-left sm:text-right font-medium whitespace-nowrap">Peak: {maxValue}</span>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Insights Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 md:gap-4">
                {/* Video Views */}
                <Card className="border-gray-200 dark:border-gray-800">
                  <CardHeader className="pb-1.5 md:pb-2">
                    <CardTitle className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300 text-xs md:text-sm font-medium">
                      <Eye className="w-3.5 h-3.5 md:w-4 md:h-4 text-pink-600" />
                      Video Views
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1">
                      <div className="text-lg md:text-2xl font-bold text-gray-900 dark:text-white">
                        {formatTweetVolume(trend.tweet_volume)}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        Total hashtag views
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                        <div 
                          className="bg-gradient-to-r from-pink-500 to-cyan-500 h-1.5 rounded-full transition-all duration-500"
                          style={{ width: `${(avgValue / 100) * 100}%` }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Trend Direction */}
                <Card className="border-gray-200 dark:border-gray-800">
                  <CardHeader className="pb-1.5 md:pb-2">
                    <CardTitle className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300 text-xs md:text-sm font-medium">
                      {trendDirection > 0 ? (
                        <TrendingUp className="w-3.5 h-3.5 md:w-4 md:h-4 text-green-600" />
                      ) : (
                        <TrendingDown className="w-3.5 h-3.5 md:w-4 md:h-4 text-red-600" />
                      )}
                      Trend Direction
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1">
                      <div className={`text-lg md:text-2xl font-bold ${
                        trendDirection > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {trendDirection > 0 ? '+' : ''}{trendDirection.toFixed(1)}
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        7-day change in views
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <span className={`px-1.5 py-0.5 rounded text-xs ${
                          trendDirection > 0 
                            ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                            : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                        }`}>
                          {trendDirection > 0 ? 'Going Viral' : 'Declining'}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Global Reach */}
                <Card className="border-gray-200 dark:border-gray-800 sm:col-span-2 lg:col-span-1">
                  <CardHeader className="pb-1.5 md:pb-2">
                    <CardTitle className="flex items-center gap-1.5 text-gray-700 dark:text-gray-300 text-xs md:text-sm font-medium">
                      <Globe className="w-3.5 h-3.5 md:w-4 md:h-4 text-purple-600" />
                      Global Reach
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-1">
                      <div className="text-lg md:text-2xl font-bold text-gray-900 dark:text-white">
                        {trend.percentage.toFixed(1)}%
                      </div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">
                        Of total trending views
                      </div>
                      <div className="flex items-center gap-1.5 text-xs">
                        <Play className="w-3 h-3 text-gray-400" />
                        <span className="text-gray-600 dark:text-gray-400">
                          Worldwide trending
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Related Information */}
              <Card className="border-gray-200 dark:border-gray-800">
                <CardHeader className="pb-1.5 md:pb-2">
                  <CardTitle className="text-xs md:text-base text-gray-900 dark:text-white">
                    Hashtag Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 md:space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 md:gap-4">
                    <div className="space-y-1.5 md:space-y-2">
                      <h4 className="font-medium text-xs text-gray-700 dark:text-gray-300">View Details</h4>
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between gap-2">
                          <span className="text-gray-600 dark:text-gray-400">Peak Interest:</span>
                          <span className="text-gray-900 dark:text-white font-medium">{maxValue}/100</span>
                        </div>
                        <div className="flex justify-between gap-2">
                          <span className="text-gray-600 dark:text-gray-400">Average Interest:</span>
                          <span className="text-gray-900 dark:text-white font-medium">{avgValue.toFixed(1)}/100</span>
                        </div>
                        <div className="flex justify-between gap-2">
                          <span className="text-gray-600 dark:text-gray-400">Trend Rank:</span>
                          <span className="text-gray-900 dark:text-white font-medium">#{trend.rank}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-1.5 md:space-y-2">
                      <h4 className="font-medium text-xs text-gray-700 dark:text-gray-300">Data Source</h4>
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between gap-2">
                          <span className="text-gray-600 dark:text-gray-400">Last Updated:</span>
                          <span className="text-gray-900 dark:text-white text-right">{new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        <div className="flex justify-between gap-2">
                          <span className="text-gray-600 dark:text-gray-400">Region:</span>
                          <span className="text-gray-900 dark:text-white">Worldwide</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-2.5 md:pt-3 border-t border-gray-200 dark:border-gray-700">
                    <a
                      href={trend.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-gradient-to-r from-pink-600 to-cyan-600 hover:from-pink-700 hover:to-cyan-700 text-white rounded-lg transition-colors font-medium text-xs w-full sm:w-auto"
                    >
                      <span>Explore on TikTok</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
      </DialogContent>
    </Dialog>
  );
};

export default TikTokDetailsDialog;
