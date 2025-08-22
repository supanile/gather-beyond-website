"use client";

import React from "react";
import { Trophy, Users, Clock, TrendingUp, Eye } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Campaign {
  id: number;
  name: string;
  successRate: number;
  avgXP: number;
  completionTime: string;
  participants: number;
}

interface CampaignHistoryTabProps {
  campaigns: Campaign[];
}

const CampaignHistoryTab: React.FC<CampaignHistoryTabProps> = ({
  campaigns,
}) => {
  const [viewMode, setViewMode] = React.useState<"cards" | "table">("cards");

  const getSuccessRateColor = (rate: number) => {
    if (rate >= 90) return "text-green-600 dark:text-green-400";
    if (rate >= 75) return "text-blue-600 dark:text-blue-400";
    if (rate >= 60) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const getSuccessRateBadgeColor = (rate: number) => {
    if (rate >= 90)
      return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
    if (rate >= 75)
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
    if (rate >= 60)
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400";
    return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
  };

  const handleViewCampaign = (campaignId: number) => {
    console.log(`View campaign details for ${campaignId}`);
    // Add navigation logic here
  };

  return (
    <div className="space-y-6">
      {/* Header with view mode toggle */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Campaign History
          </h3>
          <p className="text-muted-foreground text-sm">
            Track the performance and success rate of all campaigns
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setViewMode("cards")}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              viewMode === "cards"
                ? "bg-primary text-primary-foreground"
                : "bg-gray-100 dark:bg-gray-800 text-muted-foreground hover:text-primary"
            }`}
          >
            Cards
          </button>
          <button
            onClick={() => setViewMode("table")}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              viewMode === "table"
                ? "bg-primary text-primary-foreground"
                : "bg-gray-100 dark:bg-gray-800 text-muted-foreground hover:text-primary"
            }`}
          >
            Table
          </button>
        </div>
      </div>

      {/* Cards View */}
      {viewMode === "cards" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {campaigns.map((campaign, index) => (
            <div
              key={campaign.id}
              className="group bg-gray-50/50 dark:bg-gray-800/50 border border-gray-200/30 dark:border-gray-700/30 rounded-xl p-6 hover:border-primary/50 hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer animate-fade-up"
              style={{ animationDelay: `${index * 150}ms` }}
              onClick={() => handleViewCampaign(campaign.id)}
            >
              <div className="space-y-4">
                {/* Campaign Header */}
                <div className="flex items-start justify-between">
                  <h4 className="font-semibold text-lg text-gray-900 dark:text-gray-100 group-hover:text-primary transition-colors">
                    {campaign.name}
                  </h4>
                  <Badge
                    className={getSuccessRateBadgeColor(campaign.successRate)}
                  >
                    {campaign.successRate}% Success
                  </Badge>
                </div>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Trophy className="w-4 h-4" />
                      Avg XP/User
                    </div>
                    <div className="text-xl font-bold text-gray-900 dark:text-gray-100">
                      {campaign.avgXP}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="w-4 h-4" />
                      Participants
                    </div>
                    <div className="text-xl font-bold text-gray-900 dark:text-gray-100">
                      {campaign.participants.toLocaleString()}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="w-4 h-4" />
                      Duration
                    </div>
                    <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {campaign.completionTime}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <TrendingUp className="w-4 h-4" />
                      Success Rate
                    </div>
                    <div
                      className={`text-lg font-semibold ${getSuccessRateColor(
                        campaign.successRate
                      )}`}
                    >
                      {campaign.successRate}%
                    </div>
                  </div>
                </div>

                {/* View Details Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewCampaign(campaign.id);
                  }}
                  className="w-full mt-4 flex items-center justify-center gap-2 py-2 px-4 bg-white/50 dark:bg-gray-700/50 border border-gray-200/30 dark:border-gray-600/30 rounded-lg hover:bg-primary/10 hover:border-primary/50 transition-all duration-200 text-sm font-medium text-muted-foreground group-hover:text-primary"
                >
                  <Eye className="w-4 h-4" />
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Table View */}
      {viewMode === "table" && (
        <div className="bg-gray-50/50 dark:bg-gray-800/50 border border-gray-200/30 dark:border-gray-700/30 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100/50 dark:bg-gray-700/50 border-b border-gray-200/30 dark:border-gray-600/30">
                <tr>
                  <th className="text-left py-4 px-6 font-medium text-gray-900 dark:text-gray-100">
                    Campaign Name
                  </th>
                  <th className="text-center py-4 px-6 font-medium text-gray-900 dark:text-gray-100">
                    Success Rate
                  </th>
                  <th className="text-center py-4 px-6 font-medium text-gray-900 dark:text-gray-100">
                    Avg XP/User
                  </th>
                  <th className="text-center py-4 px-6 font-medium text-gray-900 dark:text-gray-100">
                    Participants
                  </th>
                  <th className="text-center py-4 px-6 font-medium text-gray-900 dark:text-gray-100">
                    Duration
                  </th>
                  <th className="text-center py-4 px-6 font-medium text-gray-900 dark:text-gray-100">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map((campaign, index) => (
                  <tr
                    key={campaign.id}
                    className="border-b border-gray-200/30 dark:border-gray-600/30 hover:bg-gray-100/30 dark:hover:bg-gray-700/30 transition-colors animate-fade-up"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <td className="py-4 px-6">
                      <div className="font-medium text-gray-900 dark:text-gray-100">
                        {campaign.name}
                      </div>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <Badge
                        className={getSuccessRateBadgeColor(
                          campaign.successRate
                        )}
                      >
                        {campaign.successRate}%
                      </Badge>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className="font-semibold text-gray-900 dark:text-gray-100">
                        {campaign.avgXP}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className="font-semibold text-gray-900 dark:text-gray-100">
                        {campaign.participants.toLocaleString()}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className="text-muted-foreground">
                        {campaign.completionTime}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <button
                        onClick={() => handleViewCampaign(campaign.id)}
                        className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary hover:bg-primary/20 rounded-lg text-sm font-medium transition-colors"
                      >
                        <Eye className="w-3 h-3" />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/50 border border-blue-200/30 dark:border-blue-800/30 rounded-xl p-4">
          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            {campaigns.length}
          </div>
          <div className="text-sm font-medium text-blue-800 dark:text-blue-300">
            Total Campaigns
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-950/50 dark:to-green-900/50 border border-green-200/30 dark:border-green-800/30 rounded-xl p-4">
          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
            {Math.round(
              campaigns.reduce((acc, c) => acc + c.successRate, 0) /
                campaigns.length
            )}
            %
          </div>
          <div className="text-sm font-medium text-green-800 dark:text-green-300">
            Avg Success Rate
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-950/50 dark:to-purple-900/50 border border-purple-200/30 dark:border-purple-800/30 rounded-xl p-4">
          <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
            {Math.round(
              campaigns.reduce((acc, c) => acc + c.avgXP, 0) / campaigns.length
            )}
          </div>
          <div className="text-sm font-medium text-purple-800 dark:text-purple-300">
            Avg XP/User
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-50 to-orange-100 dark:from-orange-950/50 dark:to-orange-900/50 border border-orange-200/30 dark:border-orange-800/30 rounded-xl p-4">
          <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
            {campaigns
              .reduce((acc, c) => acc + c.participants, 0)
              .toLocaleString()}
          </div>
          <div className="text-sm font-medium text-orange-800 dark:text-orange-300">
            Total Participants
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignHistoryTab;