import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { GoogleTrend } from '@/types/social-trends';
import { TrendingUp, TrendingDown, ExternalLink, Search } from 'lucide-react';

interface GoogleTrendsTabProps {
  trends: GoogleTrend[];
  loading?: boolean;
  error?: string | null;
}

const GoogleTrendsTab: React.FC<GoogleTrendsTabProps> = ({
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
    if (change === undefined) return 'N/A';
    const sign = change >= 0 ? '+' : '';
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
          <p className="text-red-600">Error loading Google Trends: {error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        {trends.map((trend) => (
          <Card key={trend.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium text-gray-500">#{trend.rank}</span>
                    <h3 className="font-semibold text-lg">{trend.name}</h3>
                    {trend.url && (
                      <a
                        href={trend.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                    <span className="flex items-center gap-1">
                      <Search className="w-4 h-4" />
                      {formatVolume(trend.volume)} searches
                    </span>
                    <span>{trend.percentage.toFixed(1)}% of total</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Badge variant={trend.category === 'high' ? 'default' : trend.category === 'medium' ? 'secondary' : 'outline'}>
                      {trend.category}
                    </Badge>
                    
                    {trend.volume_change_24h !== undefined && (
                      <span className={`text-sm flex items-center gap-1 ${
                        trend.volume_change_24h >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
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

                <div className="text-right">
                  <div className="text-sm text-gray-500 mb-1">Momentum</div>
                  <div className={`text-lg font-bold ${
                    trend.momentum_score >= 80 ? 'text-green-600' : 
                    trend.momentum_score >= 60 ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {trend.momentum_score.toFixed(0)}
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
            <p className="text-gray-500">No Google Trends data available</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default GoogleTrendsTab;
