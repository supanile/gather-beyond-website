import { GatherScore } from '@/types/gatherDashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface GatherScoreProps {
  score: GatherScore;
  className?: string;
}

export function GatherScoreComponent({ score, className }: GatherScoreProps) {
  const getScoreColor = (value: number) => {
    if (value >= 85) return 'text-green-600 bg-green-50 border-green-200';
    if (value >= 70) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (value >= 55) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    if (value >= 35) return 'text-orange-600 bg-orange-50 border-orange-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getProgressColor = (value: number) => {
    if (value >= 85) return 'bg-green-500';
    if (value >= 70) return 'bg-blue-500';
    if (value >= 55) return 'bg-yellow-500';
    if (value >= 35) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const categories = [
    { name: 'Trust', value: score.trust, description: 'Community trust & reputation' },
    { name: 'Transparency', value: score.transparency, description: 'Open communication & docs' },
    { name: 'Sentiment', value: score.sentiment, description: 'Market sentiment & perception' },
    { name: 'Community', value: score.community, description: 'Community engagement & growth' },
    { name: 'Technical', value: score.technical, description: 'Technical implementation & security' }
  ];

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-lg">
          <span>Gather Score</span>
          <Badge 
            variant="outline" 
            className={cn("text-xs font-semibold border", getScoreColor(score.overall))}
          >
            {score.label}
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center gap-6">
          {/* Compact Score Circle */}
          <div className="relative w-20 h-20 flex-shrink-0">
            <svg className="w-20 h-20 transform -rotate-90" viewBox="0 0 80 80">
              <circle cx="40" cy="40" r="32" fill="none" stroke="#e5e7eb" strokeWidth="6"/>
              <circle
                cx="40" cy="40" r="32" fill="none" stroke="currentColor" strokeWidth="6"
                strokeLinecap="round" strokeDasharray={`${(score.overall / 100) * 201} 201`}
                className={cn("transition-all duration-500", 
                  score.overall >= 85 ? 'text-green-500' :
                  score.overall >= 70 ? 'text-blue-500' :
                  score.overall >= 55 ? 'text-yellow-500' :
                  score.overall >= 35 ? 'text-orange-500' : 'text-red-500'
                )}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xl font-bold text-gray-900">{score.overall}</span>
              <span className="text-xs text-gray-500">/100</span>
            </div>
          </div>

          {/* Category Grid - More Compact */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2">
            {categories.map((category, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-gray-700 truncate">
                      {category.name}
                    </span>
                    <span className="text-xs font-semibold text-gray-900 ml-2">
                      {category.value}
                    </span>
                  </div>
                  <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={cn("h-full transition-all duration-500 rounded-full", getProgressColor(category.value))}
                      style={{ width: `${category.value}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Compact Info */}
        {/* <div className="p-2 bg-blue-50 rounded border border-blue-200">
          <p className="text-xs text-blue-700">
            <strong>Methodology:</strong> Based on on-chain metrics, social sentiment, community engagement, 
            technical audits, and transparency indicators. Updated every 24 hours.
          </p>
        </div> */}
      </CardContent>
    </Card>
  );
}