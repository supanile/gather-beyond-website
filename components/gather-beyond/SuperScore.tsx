import { SuperScore } from '@/types/gatherDashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Target, Trophy, TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SuperScoreProps {
  superScore: SuperScore;
  className?: string;
}

export function SuperScoreComponent({ superScore, className }: SuperScoreProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Improvement';
  };

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-lg">
          <span>Super Score</span>
          <Badge variant="outline" className="text-xs">Community Driven</Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Main Score Section - Horizontal Layout */}
        <div className="flex items-center gap-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded border border-purple-100">
          <div className="flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full flex-shrink-0">
            <Trophy className="h-8 w-8 text-purple-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-gray-900 mb-1">{superScore.average}</h3>
            <p className="text-sm text-gray-600">Average Super Score</p>
            <Badge 
              variant="outline" 
              className={cn("text-xs font-semibold mt-1", getScoreColor(superScore.average))}
            >
              {getScoreLabel(superScore.average)}
            </Badge>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="text-center p-3 bg-blue-50 rounded border border-blue-100">
            <Users className="h-4 w-4 text-blue-500 mx-auto mb-1" />
            <p className="text-lg font-bold text-blue-600">{superScore.totalUsersFormatted}</p>
            <p className="text-xs text-gray-600">Users</p>
          </div>

          <div className="text-center p-3 bg-green-50 rounded border border-green-100">
            <Target className="h-4 w-4 text-green-500 mx-auto mb-1" />
            <p className="text-lg font-bold text-green-600">{superScore.missionsCompletedFormatted}</p>
            <p className="text-xs text-gray-600">Missions</p>
          </div>

          <div className="text-center p-3 bg-yellow-50 rounded border border-yellow-100">
            <TrendingUp className="h-4 w-4 text-yellow-500 mx-auto mb-1" />
            <p className="text-lg font-bold text-yellow-600">{superScore.aggregateRate}%</p>
            <p className="text-xs text-gray-600">Success</p>
          </div>

          <div className="text-center p-3 bg-indigo-50 rounded border border-indigo-100">
            <div className="text-lg font-bold text-indigo-600">
              {Math.round(superScore.missionsCompleted / superScore.totalUsers)}
            </div>
            <p className="text-xs text-gray-600">Avg/User</p>
          </div>
        </div>

        {/* Redemption Rate Progress Bar */}
        <div className="p-3 bg-yellow-50 rounded border border-yellow-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-900">Aggregate Rate</span>
            <span className="text-sm font-bold text-yellow-600">{superScore.aggregateRate}</span>
          </div>
          <div className="h-2 bg-yellow-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-yellow-500 transition-all duration-500"
              style={{ width: `${superScore.aggregateRate}%` }}
            />
          </div>
        </div>

        {/* Trust Actions - Compact */}
        {/* <div className="space-y-2">
          <h4 className="font-semibold text-gray-900 text-sm">Top Trust Actions</h4>
          <div className="grid gap-1">
            {superScore.trustActions.slice(0, 3).map((action, index) => (
              <div 
                key={index}
                className="flex items-center justify-between p-2 bg-gray-50 rounded border border-gray-200"
              >
                <span className="text-xs font-medium text-gray-700 truncate">{action}</span>
                <Badge variant="secondary" className="text-xs ml-2 flex-shrink-0">
                  #{index + 1}
                </Badge>
              </div>
            ))}
          </div>
        </div> */}

        {/* Info Note */}
        {/* <div className="p-2 bg-purple-50 rounded border border-purple-200">
          <p className="text-xs text-purple-700">
            <strong>Super Score:</strong> Community-driven trust metric based on user missions, 
            engagement patterns, and redemption success rates.
          </p>
        </div> */}
      </CardContent>
    </Card>
  );
}