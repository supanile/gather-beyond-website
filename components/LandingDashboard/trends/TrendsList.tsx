import React from 'react';
import { TrendWithStats } from '@/types/trends';
import { formatTweetVolume, formatPercentageChange } from '@/lib/utils/mockData';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, ExternalLink } from 'lucide-react';

interface TrendsListProps {
  title: string;
  trends: TrendWithStats[];
  type: 'gainers' | 'losers' | 'trending_up' | 'trending_down';
  className?: string;
}

const TrendsList: React.FC<TrendsListProps> = ({
  title,
  trends,
  type,
  className = ''
}) => {
  const isHorizontal = className.includes('horizontal-layout');
  
  const getIcon = () => {
    switch (type) {
      case 'gainers':
      case 'trending_up':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'losers':
      case 'trending_down':
        return <TrendingDown className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getChangeValue = (trend: TrendWithStats) => {
    switch (type) {
      case 'gainers':
      case 'losers':
        return trend.volume_change_24h;
      case 'trending_up':
      case 'trending_down':
        return trend.momentum_score;
      default:
        return 0;
    }
  };

  const getChangeColor = (value: number | undefined) => {
    if (value === undefined) return 'text-muted-foreground';
    return value > 0 ? 'text-green-500' : value < 0 ? 'text-red-500' : 'text-muted-foreground';
  };

  const handleTrendClick = (trend: TrendWithStats) => {
    window.open(trend.url, '_blank', 'noopener,noreferrer');
  };

  return (
    <Card className={`bg-background/60 backdrop-blur-xl border border-border/50 shadow-lg ${className}`}>
      <CardHeader className="-mb-4 px-3 pt-0">
        <CardTitle className="flex items-center space-x-2 text-foreground text-sm font-semibold">
          {getIcon()}
          <span>{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className={`px-3 pb-1 ${isHorizontal ? 'space-y-0' : 'space-y-2'}`}>
        {trends.length === 0 ? (
          <div className="text-center text-muted-foreground py-3">
            <p className="text-xs">No trends available</p>
          </div>
        ) : (
          <div className={isHorizontal ? 'flex gap-2 overflow-x-auto pb-2' : 'space-y-2'}>
            {trends.slice(0, isHorizontal ? 12 : 8).map((trend, index) => {
              const changeValue = getChangeValue(trend);
              return (
                <div
                  key={trend.id}
                  className={`flex items-center justify-between p-2 rounded-lg bg-accent/15 hover:bg-accent/30 transition-all duration-200 cursor-pointer group border border-border/10 hover:border-border/30 shadow-sm backdrop-blur-sm ${
                    isHorizontal ? 'min-w-[200px] flex-shrink-0' : ''
                  }`}
                  onClick={() => handleTrendClick(trend)}
                >
                  <div className="flex items-center space-x-2 flex-1 min-w-0">
                    <Badge variant="outline" className="text-[10px] border-border/30 text-muted-foreground bg-background/50 px-1 py-0">
                      #{index + 1}
                    </Badge>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-foreground font-medium truncate group-hover:text-primary transition-colors text-xs leading-tight">
                        {trend.name}
                      </h4>
                      <div className="flex items-center space-x-1 text-[10px] text-muted-foreground mt-0.5">
                        <span>{formatTweetVolume(trend.tweet_volume)}</span>
                        <span>•</span>
                        <span>#{trend.rank}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-1">
                    <div className="text-right">
                      <div className={`text-xs font-medium ${getChangeColor(changeValue)}`}>
                        {changeValue !== undefined ? (
                          type === 'gainers' || type === 'losers' ? 
                            formatPercentageChange(changeValue) :
                            `${changeValue.toFixed(1)}%`
                        ) : 'N/A'}
                      </div>
                      {type === 'gainers' || type === 'losers' ? (
                        <div className="text-[9px] text-muted-foreground/60">24h</div>
                      ) : (
                        <div className="text-[9px] text-muted-foreground/60">momentum</div>
                      )}
                    </div>
                    <ExternalLink className="w-2.5 h-2.5 text-muted-foreground group-hover:text-foreground transition-colors opacity-60" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TrendsList;
