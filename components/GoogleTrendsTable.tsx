import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useGoogleTrends } from "@/hooks/useGoogleTrends";
import {
  formatSearchVolume,
  formatTimeAgo,
  getTrendingIcon,
  getCategoryColor,
} from "@/lib/utils/googleTrendsMockData";
import { GoogleTrendWithStats } from "@/types/googleTrends";

interface GoogleTrendsTableProps {
  limit?: number;
  showMetrics?: boolean;
}

const GoogleTrendsTable: React.FC<GoogleTrendsTableProps> = ({
  limit = 10,
  showMetrics = true,
}) => {
  const {
    data,
    metrics,
    insights,
    loading,
    error,
    timeframe,
    lastUpdated,
    refresh,
    setTimeframe,
  } = useGoogleTrends();

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>กำลังโหลด Google Trends...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-red-600">เกิดข้อผิดพลาด</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500 mb-4">{error}</p>
          <Button onClick={refresh}>ลองอีกครั้ง</Button>
        </CardContent>
      </Card>
    );
  }

  if (!data) return null;

  const processedTrends = data.trends.map((trend, index) => {
    const volumeNumeric = parseFloat(trend.searchVolume.replace(/[+,KM]/g, "")) * 
      (trend.searchVolume.includes("K") ? 1000 : trend.searchVolume.includes("M") ? 1000000 : 1);
    
    return {
      ...trend,
      id: `trend-${index}`,
      rank: index + 1,
      category: volumeNumeric >= 1000000 ? "viral" : 
                volumeNumeric >= 100000 ? "high" : 
                volumeNumeric >= 10000 ? "medium" : "low",
      volumeNumeric,
      relatedTermsArray: trend.relatedTerms.split(",").map(t => t.trim()),
      searchVelocity: volumeNumeric / 24,
      momentum: volumeNumeric > 50000 ? "rising" : volumeNumeric > 5000 ? "stable" : "declining",
      timeActive: Math.random() * 48 + 1,
    } as GoogleTrendWithStats;
  }).slice(0, limit);

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle className="text-2xl">Google Trends Thailand</CardTitle>
              <p className="text-sm text-gray-500 mt-1">
                อัปเดตล่าสุด: {lastUpdated ? lastUpdated.toLocaleString("th-TH") : "ไม่ทราบ"}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {(["4H", "24H", "48H", "7D"] as const).map((tf) => (
                <Button
                  key={tf}
                  variant={timeframe === tf ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTimeframe(tf)}
                  className="text-xs"
                >
                  {tf}
                </Button>
              ))}
              <Button variant="outline" size="sm" onClick={refresh}>
                รีเฟรช
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Metrics Summary */}
      {showMetrics && metrics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-red-500">
                {metrics.viralTrends.length}
              </div>
              <div className="text-sm text-gray-500">Viral Trends</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-500">
                {metrics.risingTrends.length}
              </div>
              <div className="text-sm text-gray-500">Rising Trends</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-blue-500">
                {metrics.peakTrends.length}
              </div>
              <div className="text-sm text-gray-500">Peak Trends</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-purple-500">
                {metrics.newTrends.length}
              </div>
              <div className="text-sm text-gray-500">New Trends</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-orange-500">
                {metrics.sustainedTrends.length}
              </div>
              <div className="text-sm text-gray-500">Sustained</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Trends Table */}
      <Card>
        <CardHeader>
          <CardTitle>Trending Topics ({timeframe})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {processedTrends.map((trend) => (
              <div
                key={trend.id}
                className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm font-mono text-gray-500">
                        #{trend.rank}
                      </span>
                      <h3 className="font-semibold text-lg">{trend.term}</h3>
                      <span className="text-lg">
                        {getTrendingIcon(trend.momentum)}
                      </span>
                      <Badge
                        style={{ backgroundColor: getCategoryColor(trend.category) }}
                        className="text-white"
                      >
                        {trend.category.toUpperCase()}
                      </Badge>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                      <span className="font-semibold">
                        ปริมาณการค้นหา: {trend.searchVolume}
                      </span>
                      <span>
                        เริ่มต้น: {formatTimeAgo(trend.startTime)}
                      </span>
                      {trend.endTime && (
                        <span>สิ้นสุด: {formatTimeAgo(trend.endTime)}</span>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-1 mb-3">
                      {trend.relatedTermsArray.slice(0, 8).map((term, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {term}
                        </Badge>
                      ))}
                      {trend.relatedTermsArray.length > 8 && (
                        <Badge variant="outline" className="text-xs">
                          +{trend.relatedTermsArray.length - 8} อื่นๆ
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>Velocity: {formatSearchVolume(Math.floor(trend.searchVelocity))}/hr</span>
                      <span>Active: {Math.floor(trend.timeActive)}h</span>
                      <span>Momentum: {trend.momentum}</span>
                    </div>
                  </div>

                  <div className="ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(trend.exploreLink, "_blank")}
                    >
                      ดูใน Google Trends
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Insights */}
      {insights && (
        <Card>
          <CardHeader>
            <CardTitle>Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Top Categories</h4>
                <div className="space-y-2">
                  {insights.topCategories.map((cat, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="capitalize">{cat.category}</span>
                      <span>{cat.percentage.toFixed(1)}%</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Geographic Spread</h4>
                <div className="space-y-2">
                  {insights.geographicSpread.map((geo, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span>{geo.region}</span>
                      <span>{geo.intensity}%</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Statistics</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Average Lifespan</span>
                    <span>{insights.averageLifespan.toFixed(1)}h</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Peak Hour</span>
                    <span>{insights.peakHour}:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Trends</span>
                    <span>{data.trends.length}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GoogleTrendsTable;
