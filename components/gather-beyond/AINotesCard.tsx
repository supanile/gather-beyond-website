import { AIRiskAssessment } from '@/types/gatherDashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Brain, AlertTriangle, CheckCircle, Info, ChevronDown, ChevronUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface AINotesCardProps {
  assessment: AIRiskAssessment;
  className?: string;
}

export function AINotesCard({ assessment, className }: AINotesCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getRiskConfig = (level: string) => {
    switch (level) {
      case 'low':
        return {
          color: 'text-green-600 bg-green-50 border-green-200',
          icon: <CheckCircle className="h-3 w-3" />,
          label: 'Low Risk'
        };
      case 'medium':
        return {
          color: 'text-yellow-600 bg-yellow-50 border-yellow-200',
          icon: <Info className="h-3 w-3" />,
          label: 'Medium Risk'
        };
      case 'high':
        return {
          color: 'text-orange-600 bg-orange-50 border-orange-200',
          icon: <AlertTriangle className="h-3 w-3" />,
          label: 'High Risk'
        };
      case 'critical':
        return {
          color: 'text-red-600 bg-red-50 border-red-200',
          icon: <AlertTriangle className="h-3 w-3" />,
          label: 'Critical Risk'
        };
      default:
        return {
          color: 'text-gray-600 bg-gray-50 border-gray-200',
          icon: <Info className="h-3 w-3" />,
          label: 'Unknown'
        };
    }
  };

  const riskConfig = getRiskConfig(assessment.riskLevel);

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="pb-0">
        <CardTitle className="flex items-center justify-between text-lg">
          <div className="flex items-center gap-2">
            <Brain className="h-4 w-4 text-purple-600" />
            <span>AI Risk Assessment</span>
          </div>
          <Badge 
            variant="outline" 
            className={cn("text-xs font-semibold border flex items-center gap-1", riskConfig.color)}
          >
            {riskConfig.icon}
            {riskConfig.label}
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {/* AI Summary - More Compact */}
        <div className="p-3 bg-purple-50 rounded border border-purple-100">
          <div className="flex items-start gap-2">
            <Brain className="h-4 w-4 text-purple-500 mt-0.5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-700 leading-relaxed">{assessment.summary}</p>
            </div>
          </div>
        </div>

        {/* Risk Flags - Compact */}
        {assessment.flags.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-semibold text-gray-900 text-sm">Risk Flags</h4>
            <div className="grid gap-1">
              {assessment.flags.slice(0, 2).map((flag, index) => (
                <div 
                  key={index}
                  className={cn(
                    "flex items-center gap-2 p-2 rounded text-xs",
                    assessment.riskLevel === 'critical' || assessment.riskLevel === 'high'
                      ? 'bg-red-50 border border-red-200 text-red-700'
                      : 'bg-yellow-50 border border-yellow-200 text-yellow-700'
                  )}
                >
                  <AlertTriangle className="h-3 w-3 flex-shrink-0" />
                  <span className="truncate">{flag}</span>
                </div>
              ))}
              {assessment.flags.length > 2 && (
                <p className="text-xs text-gray-500">+{assessment.flags.length - 2} more flags</p>
              )}
            </div>
          </div>
        )}

        {/* Recommendations - Collapsible */}
        {/* <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-gray-900 text-sm">AI Recommendations</h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-xs text-gray-500 hover:text-gray-700 h-6"
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="h-3 w-3 mr-1" />
                  Less
                </>
              ) : (
                <>
                  <ChevronDown className="h-3 w-3 mr-1" />
                  {assessment.recommendations.length} Tips
                </>
              )}
            </Button>
          </div>
          
          <div className="grid gap-1">
            {assessment.recommendations
              .slice(0, isExpanded ? undefined : 1)
              .map((recommendation, index) => (
                <div 
                  key={index}
                  className="flex items-start gap-2 p-2 bg-blue-50 rounded border border-blue-100 text-xs"
                >
                  <CheckCircle className="h-3 w-3 text-blue-500 flex-shrink-0 mt-0.5" />
                  <span className="text-blue-700">{recommendation}</span>
                </div>
              ))}
          </div>
        </div> */}

        {/* Risk Score Breakdown - Inline */}
        {/* <div className="flex items-center justify-between p-2 bg-gray-50 rounded text-xs">
          <span className="text-gray-600">Risk Assessment:</span>
          <div className="flex gap-3">
            <span className="text-gray-900">
              Trust: <strong>
                {assessment.riskLevel === 'low' ? 'Strong' :
                 assessment.riskLevel === 'medium' ? 'Moderate' :
                 assessment.riskLevel === 'high' ? 'Weak' : 'Critical'}
              </strong>
            </span>
            <span className="text-gray-900">
              Tech: <strong>
                {assessment.riskLevel === 'low' ? 'Low' :
                 assessment.riskLevel === 'medium' ? 'Medium' :
                 assessment.riskLevel === 'high' ? 'High' : 'Critical'}
              </strong>
            </span>
          </div>
        </div> */}

        {/* AI Disclaimer */}
        {/* <div className="p-2 bg-gray-50 rounded border border-gray-200">
          <p className="text-xs text-gray-600">
            <strong>AI Disclaimer:</strong> This assessment is generated by AI based on available data 
            and should not be considered as financial advice. Always conduct your own research.
          </p>
        </div> */}
      </CardContent>
    </Card>
  );
}