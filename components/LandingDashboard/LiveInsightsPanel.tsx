import React from "react";
import { TrendingUp, AlertTriangle, Shield } from "lucide-react";

interface GainerItem {
  name: string;
  gain: string;
}

interface RiskItem {
  name: string;
  risk: "High" | "Medium" | "Low";
}

interface VerifiedCommunity {
  name: string;
  verifiedDate: string;
  category: string;
}

interface LiveInsightsPanelProps {
  topGainers?: GainerItem[];
  riskWatchlist?: RiskItem[];
  recentlyVerified?: VerifiedCommunity[];
}

const defaultTopGainers: GainerItem[] = [
  { name: "MetaVerse DAO", gain: "+45%" },
  { name: "DeFi Protocol X", gain: "+38%" },
  { name: "GameFi Alliance", gain: "+32%" },
  { name: "AI Collective", gain: "+28%" },
];

const defaultRiskWatchlist: RiskItem[] = [
  { name: "Failed Campaign #1", risk: "High" },
  { name: "Disputed Protocol", risk: "Medium" },
  { name: "Unverified Project", risk: "High" },
  { name: "Low Activity DAO", risk: "Low" },
];

const defaultRecentlyVerified: VerifiedCommunity[] = [
  { name: "CommunityX DAO", verifiedDate: "2 hours ago", category: "DAO" },
  { name: "BlockchainGuild", verifiedDate: "5 hours ago", category: "DeFi" },
  { name: "AIAgents Network", verifiedDate: "1 day ago", category: "AI" },
  { name: "GameFi Collective", verifiedDate: "2 days ago", category: "Gaming" },
];

const LiveInsightsPanel: React.FC<LiveInsightsPanelProps> = ({
  topGainers = defaultTopGainers,
  riskWatchlist = defaultRiskWatchlist,
  recentlyVerified = defaultRecentlyVerified,
}) => {
  const getRiskBadgeStyle = (risk: string) => {
    switch (risk) {
      case "High":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      case "Medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
      case "Low":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400";
    }
  };

  const getCategoryBadgeStyle = (category: string) => {
    const colors: { [key: string]: string } = {
      DAO: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
      DeFi: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
      AI: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
      Gaming:
        "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    };
    return (
      colors[category] ||
      "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
    );
  };

  return (
    <section className="py-8 sm:py-12 lg:py-16 bg-gradient-to-br from-gray-50/30 to-slate-50/30 dark:from-gray-950/30 dark:to-slate-950/30">
      {/* Adjusted padding for smaller screens */}
      <div className="max-w-full sm:max-w-4xl lg:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Responsive max-width for better content scaling */}
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 bg-gradient-to-r from-gray-900 to-slate-800 dark:from-gray-100 dark:to-slate-200 bg-clip-text text-transparent">
          Live Insights Panel
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {/* Responsive grid: 1 column on mobile, 2 on tablet, 3 on desktop */}
          {/* Top Gainers */}
          <div className="bg-background/60 backdrop-blur-xl border border-border/50 rounded-2xl p-4 sm:p-6 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center space-x-3 mb-4 sm:mb-6">
              <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6 text-green-500" />
              <h3 className="text-lg sm:text-xl font-semibold text-foreground">
                Top Gainers
              </h3>
              <span className="text-xs sm:text-sm text-muted-foreground">
                (Mindshare)
              </span>
            </div>

            <div className="space-y-3 sm:space-y-4">
              {topGainers.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-3 rounded-xl bg-accent/30 hover:bg-accent/50 transition-all duration-200 cursor-pointer transform hover:scale-105"
                >
                  <span className="font-medium text-foreground text-sm sm:text-base">
                    {item.name}
                  </span>
                  <span className="text-green-600 dark:text-green-400 font-semibold text-sm sm:text-base">
                    {item.gain}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Risk Watchlist */}
          <div className="bg-background/60 backdrop-blur-xl border border-border/50 rounded-2xl p-4 sm:p-6 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center space-x-3 mb-4 sm:mb-6">
              <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-red-500" />
              <h3 className="text-lg sm:text-xl font-semibold text-foreground">
                Risk Watchlist
              </h3>
            </div>

            <div className="space-y-3 sm:space-y-4">
              {riskWatchlist.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-3 rounded-xl bg-accent/30 hover:bg-accent/50 transition-all duration-200 cursor-pointer transform hover:scale-105"
                >
                  <span className="font-medium text-foreground text-sm sm:text-base">
                    {item.name}
                  </span>
                  <span
                    className={`px-2 sm:px-3 py-1 rounded-lg text-xs sm:text-sm font-semibold ${getRiskBadgeStyle(
                      item.risk
                    )}`}
                  >
                    {item.risk}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recently Verified Communities */}
          <div className="bg-background/60 backdrop-blur-xl border border-border/50 rounded-2xl p-4 sm:p-6 hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center space-x-3 mb-4 sm:mb-6">
              <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-blue-500" />
              <h3 className="text-lg sm:text-xl font-semibold text-foreground">
                Recently Verified
              </h3>
            </div>

            <div className="space-y-3 sm:space-y-4">
              {recentlyVerified.map((item, index) => (
                <div
                  key={index}
                  className="p-3 rounded-xl bg-accent/30 hover:bg-accent/50 transition-all duration-200 cursor-pointer transform hover:scale-105"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-medium text-foreground text-sm sm:text-base">
                      {item.name}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-lg text-xs sm:text-sm font-medium ${getCategoryBadgeStyle(
                        item.category
                      )}`}
                    >
                      {item.category}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-xs sm:text-sm text-muted-foreground">
                      Verified {item.verifiedDate}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LiveInsightsPanel;