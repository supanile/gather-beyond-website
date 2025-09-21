import React from "react";
import { TrendingUp, AlertTriangle, Shield } from "lucide-react";
import { allProjects as projects, Project } from "@/data/admin/projectMockData";

interface GainerItem {
  name: string;
  gain: string;
  project: Project;
}

interface RiskItem {
  name: string;
  risk: "High" | "Medium" | "Low";
  project: Project;
}

interface VerifiedCommunity {
  name: string;
  verifiedDate: string;
  category: string;
  project: Project;
}

interface LiveInsightsPanelProps {
  topGainers?: GainerItem[];
  riskWatchlist?: RiskItem[];
  recentlyVerified?: VerifiedCommunity[];
}

// Generate dynamic data from projects
const generateTopGainers = (): GainerItem[] => {
  // Ensure Super Connector is first in top gainers
  const superConnector = projects.find((p: Project) => p.id === 1);
  const otherProjects = projects
    .filter((p: Project) => p.id !== 1 && p.mindshareScore >= 70)
    .sort((a: Project, b: Project) => b.mindshareScore - a.mindshareScore)
    .slice(0, 3);
  
  const topProjects = superConnector ? [superConnector, ...otherProjects] : otherProjects.slice(0, 4);
  
  return topProjects.map((project: Project) => ({
    name: project.name,
    gain: project.id === 1 ? "+45%" : `+${Math.floor(Math.random() * 20 + 25)}%`,
    project
  }));
};

const generateRiskWatchlist = (): RiskItem[] => {
  const riskProjects = projects
    .filter((p: Project) => p.trustScore < 60)
    .slice(0, 4);
  
  return riskProjects.map((project: Project) => ({
    name: project.name,
    risk: project.trustScore < 30 ? "High" as const : 
          project.trustScore < 50 ? "Medium" as const : "Low" as const,
    project
  }));
};

const generateRecentlyVerified = (): VerifiedCommunity[] => {
  const verifiedProjects = projects
    .filter((p: Project) => p.trustScore >= 80)
    .slice(0, 4);
  
  const timeframes = ["2 hours ago", "5 hours ago", "1 day ago", "2 days ago"];
  
  return verifiedProjects.map((project: Project, index: number) => ({
    name: project.name,
    verifiedDate: timeframes[index] || `${index + 1} days ago`,
    category: project.category,
    project
  }));
};

const LiveInsightsPanel: React.FC<LiveInsightsPanelProps> = ({
  topGainers = generateTopGainers(),
  riskWatchlist = generateRiskWatchlist(),
  recentlyVerified = generateRecentlyVerified(),
}) => {
  const getRiskBadgeStyle = (risk: string): string => {
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

  const getCategoryBadgeStyle = (category: string): string => {
    const colors: { [key: string]: string } = {
      DAO: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
      DeFi: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
      AI: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
      Gaming: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
      NFT: "bg-pink-100 text-pink-800 dark:bg-pink-900/30 dark:text-pink-400",
      Infrastructure: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400",
      Social: "bg-teal-100 text-teal-800 dark:bg-teal-900/30 dark:text-teal-400",
      Metaverse: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
      Wallet: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-400",
    };
    return (
      colors[category] ||
      "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
    );
  };

  const handleItemClick = (project: Project): void => {
    // Navigate to project profile
    window.location.href = `/project-profile?id=${project.id}`;
  };

  return (
    <section className="py-8 sm:py-12 lg:py-16 bg-gradient-to-br from-gray-50/30 to-slate-50/30 dark:from-gray-950/30 dark:to-slate-950/30">
      <div className="max-w-full sm:max-w-4xl lg:max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 bg-gradient-to-r from-gray-900 to-slate-800 dark:from-gray-100 dark:to-slate-200 bg-clip-text text-transparent">
          Live Insights Panel
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
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
              {topGainers.map((item: GainerItem, index: number) => (
                <div
                  key={index}
                  onClick={() => handleItemClick(item.project)}
                  className="flex justify-between items-center p-3 rounded-xl bg-accent/30 hover:bg-accent/50 transition-all duration-200 cursor-pointer transform hover:scale-105"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-gray-100 to-slate-100 dark:from-gray-800 dark:to-slate-800 rounded-lg flex items-center justify-center text-lg flex-shrink-0 overflow-hidden">
                      {item.project.image_url ? (
                        <img
                          src={item.project.image_url}
                          alt={`${item.name} logo`}
                          className="w-full h-full object-cover rounded-lg"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = "none";
                            const sibling = target.nextElementSibling as HTMLElement;
                            if (sibling) sibling.style.display = "block";
                          }}
                        />
                      ) : null}
                      <span 
                        className="text-lg"
                        style={{ display: item.project.image_url ? "none" : "block" }}
                      >
                        {item.project.logo}
                      </span>
                    </div>
                    <span className="font-medium text-foreground text-sm sm:text-base">
                      {item.name}
                    </span>
                  </div>
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
              {riskWatchlist.map((item: RiskItem, index: number) => (
                <div
                  key={index}
                  onClick={() => handleItemClick(item.project)}
                  className="flex justify-between items-center p-3 rounded-xl bg-accent/30 hover:bg-accent/50 transition-all duration-200 cursor-pointer transform hover:scale-105"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-gray-100 to-slate-100 dark:from-gray-800 dark:to-slate-800 rounded-lg flex items-center justify-center text-lg flex-shrink-0 overflow-hidden">
                      {item.project.image_url ? (
                        <img
                          src={item.project.image_url}
                          alt={`${item.name} logo`}
                          className="w-full h-full object-cover rounded-lg"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = "none";
                            const sibling = target.nextElementSibling as HTMLElement;
                            if (sibling) sibling.style.display = "block";
                          }}
                        />
                      ) : null}
                      <span 
                        className="text-lg"
                        style={{ display: item.project.image_url ? "none" : "block" }}
                      >
                        {item.project.logo}
                      </span>
                    </div>
                    <span className="font-medium text-foreground text-sm sm:text-base">
                      {item.name}
                    </span>
                  </div>
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
              {recentlyVerified.map((item: VerifiedCommunity, index: number) => (
                <div
                  key={index}
                  onClick={() => handleItemClick(item.project)}
                  className="p-3 rounded-xl bg-accent/30 hover:bg-accent/50 transition-all duration-200 cursor-pointer transform hover:scale-105"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-gray-100 to-slate-100 dark:from-gray-800 dark:to-slate-800 rounded-lg flex items-center justify-center text-lg flex-shrink-0 overflow-hidden">
                        {item.project.image_url ? (
                          <img
                            src={item.project.image_url}
                            alt={`${item.name} logo`}
                            className="w-full h-full object-cover rounded-lg"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = "none";
                              const sibling = target.nextElementSibling as HTMLElement;
                              if (sibling) sibling.style.display = "block";
                            }}
                          />
                        ) : null}
                        <span 
                          className="text-lg"
                          style={{ display: item.project.image_url ? "none" : "block" }}
                        >
                          {item.project.logo}
                        </span>
                      </div>
                      <span className="font-medium text-foreground text-sm sm:text-base">
                        {item.name}
                      </span>
                    </div>
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