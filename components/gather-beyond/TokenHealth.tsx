import { TokenHealth } from "@/types/gatherDashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Clock, Users, Coins, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

interface TokenHealthProps {
  tokenHealth: TokenHealth;
  className?: string;
}

export function TokenHealthComponent({
  tokenHealth,
  className,
}: TokenHealthProps) {
  const getRiskLevel = (percentage: number) => {
    if (percentage >= 50)
      return {
        level: "High Risk",
        color: "text-red-600 bg-red-50 border-red-200",
      };
    if (percentage >= 30)
      return {
        level: "Medium Risk",
        color: "text-yellow-600 bg-yellow-50 border-yellow-200",
      };
    return {
      level: "Low Risk",
      color: "text-green-600 bg-green-50 border-green-200",
    };
  };

  const riskLevel = getRiskLevel(tokenHealth.topHoldersPercentage);

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-lg">
          <span>Token Health</span>
          <Badge
            variant="outline"
            className={cn("text-xs font-semibold border", riskLevel.color)}
          >
            {riskLevel.level}
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Top Section - Risk + Key Metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-1 gap-3">
          {/* Top Wallet Control */}
          {/* <div className={cn("p-3 rounded border", 
            tokenHealth.topHoldersPercentage >= 50 ? 'bg-red-50 border-red-200' :
            tokenHealth.topHoldersPercentage >= 30 ? 'bg-yellow-50 border-yellow-200' :
            'bg-green-50 border-green-200'
          )}>
            <div className="flex items-center gap-2 mb-1">
              <AlertTriangle className={cn("h-4 w-4",
                tokenHealth.topHoldersPercentage >= 50 ? 'text-red-500' :
                tokenHealth.topHoldersPercentage >= 30 ? 'text-yellow-500' : 'text-green-500'
              )} />
              <span className="font-medium text-gray-900 text-sm">Top Wallet Control</span>
            </div>
            <p className="text-lg font-bold text-gray-900">{tokenHealth.topHoldersPercentage}%</p>
            <p className="text-xs text-gray-600">
              {tokenHealth.topHoldersPercentage >= 50 ? 'High concentration risk' :
               tokenHealth.topHoldersPercentage >= 30 ? 'Moderate concentration' : 'Well distributed'}
            </p>
          </div> */}

          {/* Key Metrics Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded border border-blue-100">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium text-gray-900">
                  Holders
                </span>
              </div>
              <span className="text-lg font-bold text-blue-600">
                {formatNumber(tokenHealth.totalHolders)}
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-purple-50 rounded border border-purple-100">
              <div className="flex items-center gap-2">
                <Coins className="h-4 w-4 text-purple-500" />
                <span className="text-sm font-medium text-gray-900">
                  Liquidity
                </span>
              </div>
              <span className="text-lg font-bold text-purple-600">
                {tokenHealth.liquidityFormatted}
              </span>
            </div>
          </div>

          {/* Contract Age */}
          <div className="p-3 bg-gray-50 rounded border border-gray-200">
            <div className="flex items-center gap-2 mb-1">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="font-medium text-gray-900 text-sm">
                Contract Age
              </span>
            </div>
            <p className="text-lg font-bold text-gray-900">
              {tokenHealth.contractAgeFormatted}
            </p>
            <p className="text-xs text-gray-600">
              Deployed {tokenHealth.contractAge} days ago
            </p>
          </div>
        </div>

        {/* Next Unlock - Inline */}
        <div className="p-3 bg-orange-50 rounded border border-orange-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-orange-500" />
              <span className="text-sm font-medium text-gray-900">
                Next Unlock
              </span>
            </div>
            <div className="flex items-center gap-4 text-right">
              <div>
                <p className="text-xs text-gray-600">Amount</p>
                <p className="text-sm font-semibold text-orange-600">
                  {tokenHealth.nextUnlock.amount}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-600">In Days</p>
                <p className="text-sm font-semibold text-orange-600">
                  {tokenHealth.nextUnlock.daysUntil}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Risk Assessment */}
        {/* <div className="p-2 bg-blue-50 rounded border border-blue-200">
          <p className="text-xs text-blue-700">
            <strong>Risk Assessment:</strong> Based on token distribution, liquidity depth, unlock schedules, 
            and contract maturity. Higher wallet concentration indicates increased price manipulation risk.
          </p>
        </div> */}
      </CardContent>
    </Card>
  );
}
