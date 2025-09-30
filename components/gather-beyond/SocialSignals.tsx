import { SocialSignals } from '@/types/gatherDashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Minus, Chrome, MessageCircle, Send } from 'lucide-react';
import { cn } from '@/lib/utils';
import XIcon from '../ui/icons/XIcon';

interface SocialSignalsProps {
  signals: SocialSignals;
  className?: string;
}

export function SocialSignalsComponent({ signals, className }: SocialSignalsProps) {
  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-3 w-3 text-green-500" />;
      case 'down': return <TrendingDown className="h-3 w-3 text-red-500" />;
      default: return <Minus className="h-3 w-3 text-gray-500" />;
    }
  };

  const getTrendColor = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
      case 'up': return 'text-green-600';
      case 'down': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-lg">
          <span>Social & Sentiment Signals</span>
          <Badge variant="outline" className="text-xs">7d trends</Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {/* Compact Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Twitter */}
          <div className="flex items-center justify-between p-3 bg-gray-50 rounded border border-gray-100">
            <div className="flex items-center gap-2">
              <XIcon className="h-4 w-4 text-black" />
              <div>
                <p className="text-sm font-medium text-gray-900">Twitter</p>
                <p className="text-xs text-gray-600">{formatNumber(signals.twitter.value)} mentions</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {getTrendIcon(signals.twitter.trend)}
              <span className={cn("text-xs font-semibold", getTrendColor(signals.twitter.trend))}>
                {signals.twitter.trend === 'stable' ? 'Stable' : `${signals.twitter.percentage}%`}
              </span>
            </div>
          </div>

          {/* Google Trends */}
          <div className="flex items-center justify-between p-3 bg-orange-50 rounded border border-orange-100">
            <div className="flex items-center gap-2">
              <Chrome className="h-4 w-4 text-orange-500" />
              <div>
                <p className="text-sm font-medium text-gray-900">Google</p>
                <p className="text-xs text-gray-600">Score: {signals.google.value}/100</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {getTrendIcon(signals.google.trend)}
              <span className={cn("text-xs font-semibold", getTrendColor(signals.google.trend))}>
                {signals.google.trend === 'stable' ? 'Stable' : `${signals.google.percentage}%`}
              </span>
            </div>
          </div>

          {/* Discord */}
          <div className="flex items-center justify-between p-3 bg-indigo-50 rounded border border-indigo-100">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4 text-indigo-500" />
              <div>
                <p className="text-sm font-medium text-gray-900">Discord</p>
                <p className="text-xs text-gray-600">{formatNumber(signals.discord.members)} members</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span className="text-xs font-semibold text-green-600">+{signals.discord.growth}%</span>
            </div>
          </div>

          {/* Telegram */}
          <div className="flex items-center justify-between p-3 bg-cyan-50 rounded border border-cyan-100">
            <div className="flex items-center gap-2">
              <Send className="h-4 w-4 text-cyan-500" />
              <div>
                <p className="text-sm font-medium text-gray-900">Telegram</p>
                <p className="text-xs text-gray-600">{formatNumber(signals.telegram.members)} members</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-green-500" />
              <span className="text-xs font-semibold text-green-600">+{signals.telegram.growth}%</span>
            </div>
          </div>
        </div>

        {/* Engagement Summary - Inline */}
        {/* <div className="flex items-center justify-between p-2 bg-gray-50 rounded text-xs">
          <span className="text-gray-600">Engagement:</span>
          <div className="flex gap-4">
            <span className="text-gray-900">Discord: <strong>{signals.discord.engagement}%</strong></span>
            <span className="text-gray-900">Telegram: <strong>{signals.telegram.engagement}%</strong></span>
          </div>
        </div> */}

        {/* Update Time */}
        <div className="text-xs text-gray-500 text-center pt-1 border-t border-gray-100">
          Updated: {new Date().toLocaleTimeString()}
        </div>
      </CardContent>
    </Card>
  );
}