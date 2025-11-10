import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GatherTrend } from "@/types/social-trends";
import {
  TrendingUp,
  TrendingDown,
  ExternalLink,
  Users,
  Activity,
  Calendar,
} from "lucide-react";

interface GatherTrendsTabProps {
  trends: GatherTrend[];
  loading?: boolean;
  error?: string | null;
}

const GatherTrendsTab: React.FC<GatherTrendsTabProps> = ({
  trends,
  loading = false,
  error = null,
}) => {
  const formatVolume = (volume: number) => {
    if (volume >= 1000000) return `${(volume / 1000000).toFixed(1)}M`;
    if (volume >= 1000) return `${(volume / 1000).toFixed(1)}K`;
    return volume.toString();
  };

  const formatPercentageChange = (change: number | undefined) => {
    if (change === undefined) return "N/A";
    const sign = change >= 0 ? "+" : "";
    return `${sign}${change.toFixed(1)}%`;
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-4">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200">
        <CardContent className="p-6 text-center">
          <p className="text-red-600">Error loading Gather Trends: {error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        {trends.map((trend) => (
          <Card
            key={trend.id}
            className="hover:shadow-md transition-shadow border-purple-100"
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium text-gray-500">
                      #{trend.rank}
                    </span>
                    <h3 className="font-semibold text-lg text-purple-600">
                      {trend.name}
                    </h3>
                    {trend.url && (
                      <a
                        href={trend.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-500 hover:text-purple-700"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-2">
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4 text-blue-500" />
                      {formatVolume(trend.participants)} users
                    </span>
                    <span className="flex items-center gap-1">
                      <Activity className="w-4 h-4 text-green-500" />
                      {trend.activity_score.toFixed(1)} activity
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4 text-orange-500" />
                      {trend.events_count} events
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        trend.category === "high"
                          ? "default"
                          : trend.category === "medium"
                          ? "secondary"
                          : "outline"
                      }
                      className="bg-purple-100 text-purple-800 border-purple-200"
                    >
                      {trend.category}
                    </Badge>

                    <span className="text-sm text-gray-500">
                      {trend.percentage.toFixed(1)}% of total
                    </span>

                    {trend.volume_change_24h !== undefined && (
                      <span
                        className={`text-sm flex items-center gap-1 ${
                          trend.volume_change_24h >= 0
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {trend.volume_change_24h >= 0 ? (
                          <TrendingUp className="w-3 h-3" />
                        ) : (
                          <TrendingDown className="w-3 h-3" />
                        )}
                        {formatPercentageChange(trend.volume_change_24h)} (24h)
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {trends.length === 0 && (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-gray-500">No Gather Trends data available</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GatherTrendsTab;
