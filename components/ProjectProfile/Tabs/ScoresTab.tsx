"use client";

import React from "react";
import {
  Shield,
  Activity,
  TrendingUp,
  Users,
  ExternalLink,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface TrustBreakdown {
  communityHealth: number;
  campaignSuccess: number;
  onchainBehavior: number;
}

interface MindshareDataPoint {
  date: string;
  value: number;
}

interface Sentiment {
  positive: number;
  neutral: number;
  negative: number;
}

interface Influencer {
  name: string;
  mentions: number;
  followers: string;
}

interface Scores {
  trustBreakdown: TrustBreakdown;
  mindshareHistory: MindshareDataPoint[];
  sentiment: Sentiment;
  topInfluencers: Influencer[];
}

interface ScoresTabProps {
  scores: Scores;
}

const ScoresTab = ({ scores }: ScoresTabProps) => {
  const [selectedPeriod, setSelectedPeriod] = React.useState("7d");

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 dark:text-green-400";
    if (score >= 60) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  const getScoreBarColor = (score: number) => {
    if (score >= 80) return "from-green-500 to-green-600";
    if (score >= 60) return "from-yellow-500 to-yellow-600";
    return "from-red-500 to-red-600";
  };

  const periods = ["7d", "30d", "90d"];

  // Prepare data for pie chart
  const sentimentData = [
    {
      name: "Positive",
      value: scores.sentiment.positive,
      fill: "#10b981", // green-500
    },
    {
      name: "Neutral", 
      value: scores.sentiment.neutral,
      fill: "#6b7280", // gray-500
    },
    {
      name: "Negative",
      value: scores.sentiment.negative,
      fill: "#ef4444", // red-500
    },
  ];

  const chartConfig = {
    positive: {
      label: "Positive",
      color: "#10b981",
    },
    neutral: {
      label: "Neutral",
      color: "#6b7280",
    },
    negative: {
      label: "Negative", 
      color: "#ef4444",
    },
  };

  return (
    <div className="space-y-8">
      {/* Trust Score Breakdown */}
      <section>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Trust Score Breakdown
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-50/50 dark:bg-gray-800/50 border border-gray-200/30 dark:border-gray-700/30 rounded-xl p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Community Health
                </span>
                <span
                  className={`text-lg font-bold ${getScoreColor(
                    scores.trustBreakdown.communityHealth
                  )}`}
                >
                  {scores.trustBreakdown.communityHealth}
                </span>
              </div>
              <div className="w-full bg-gray-200/50 dark:bg-gray-700/50 rounded-full h-2">
                <div
                  className={`bg-gradient-to-r ${getScoreBarColor(
                    scores.trustBreakdown.communityHealth
                  )} h-2 rounded-full transition-all duration-500`}
                  style={{ width: `${scores.trustBreakdown.communityHealth}%` }}
                ></div>
              </div>
              <p className="text-xs text-muted-foreground">
                Based on community engagement, governance participation, and
                member retention
              </p>
            </div>
          </div>

          <div className="bg-gray-50/50 dark:bg-gray-800/50 border border-gray-200/30 dark:border-gray-700/30 rounded-xl p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Campaign Success
                </span>
                <span
                  className={`text-lg font-bold ${getScoreColor(
                    scores.trustBreakdown.campaignSuccess
                  )}`}
                >
                  {scores.trustBreakdown.campaignSuccess}
                </span>
              </div>
              <div className="w-full bg-gray-200/50 dark:bg-gray-700/50 rounded-full h-2">
                <div
                  className={`bg-gradient-to-r ${getScoreBarColor(
                    scores.trustBreakdown.campaignSuccess
                  )} h-2 rounded-full transition-all duration-500`}
                  style={{ width: `${scores.trustBreakdown.campaignSuccess}%` }}
                ></div>
              </div>
              <p className="text-xs text-muted-foreground">
                Measured by campaign completion rates and user satisfaction
              </p>
            </div>
          </div>

          <div className="bg-gray-50/50 dark:bg-gray-800/50 border border-gray-200/30 dark:border-gray-700/30 rounded-xl p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Onchain Behavior
                </span>
                <span
                  className={`text-lg font-bold ${getScoreColor(
                    scores.trustBreakdown.onchainBehavior
                  )}`}
                >
                  {scores.trustBreakdown.onchainBehavior}
                </span>
              </div>
              <div className="w-full bg-gray-200/50 dark:bg-gray-700/50 rounded-full h-2">
                <div
                  className={`bg-gradient-to-r ${getScoreBarColor(
                    scores.trustBreakdown.onchainBehavior
                  )} h-2 rounded-full transition-all duration-500`}
                  style={{ width: `${scores.trustBreakdown.onchainBehavior}%` }}
                ></div>
              </div>
              <p className="text-xs text-muted-foreground">
                Analysis of transaction patterns, wallet security, and protocol
                compliance
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mindshare Overview (without chart) */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Mindshare Overview
          </h3>
          <div className="flex items-center space-x-2">
            {periods.map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-3 py-1 rounded-lg text-sm font-medium transition-all duration-200 ${
                  selectedPeriod === period
                    ? "bg-primary text-primary-foreground"
                    : "bg-gray-100 dark:bg-gray-800 text-muted-foreground hover:text-primary"
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-gray-50/50 dark:bg-gray-800/50 border border-gray-200/30 dark:border-gray-700/30 rounded-xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                {scores.mindshareHistory[scores.mindshareHistory.length - 1]
                  ?.value || 0}
              </div>
              <div className="text-sm text-muted-foreground">Current Score</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                +5.2%
              </div>
              <div className="text-sm text-muted-foreground">7-day Change</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                #15
              </div>
              <div className="text-sm text-muted-foreground">Category Rank</div>
            </div>
          </div>
        </div>
      </section>

      {/* Sentiment Analysis & Top Influencers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sentiment Analysis with Pie Chart */}
        <section>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Sentiment Analysis
          </h3>

          <div className="bg-gray-50/50 dark:bg-gray-800/50 border border-gray-200/30 dark:border-gray-700/30 rounded-xl p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Pie Chart */}
              <div className="flex items-center justify-center">
                <ChartContainer
                  config={chartConfig}
                  className="mx-auto aspect-square max-h-[250px] w-full"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent hideLabel />}
                      />
                      <Pie
                        data={sentimentData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        innerRadius={40}
                        dataKey="value"
                        nameKey="name"
                        strokeWidth={2}
                      >
                        {sentimentData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </div>

              {/* Legend and Values */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-sm font-medium">Positive</span>
                  </span>
                  <span className="font-bold text-green-600 dark:text-green-400">
                    {scores.sentiment.positive}%
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-gray-500"></div>
                    <span className="text-sm font-medium">Neutral</span>
                  </span>
                  <span className="font-bold text-gray-600 dark:text-gray-400">
                    {scores.sentiment.neutral}%
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <span className="text-sm font-medium">Negative</span>
                  </span>
                  <span className="font-bold text-red-600 dark:text-red-400">
                    {scores.sentiment.negative}%
                  </span>
                </div>

                {/* Summary */}
                <div className="mt-6 p-4 bg-white/50 dark:bg-gray-700/50 rounded-lg border border-gray-200/20 dark:border-gray-600/20">
                  <div className="text-sm text-muted-foreground mb-2">
                    Overall Sentiment
                  </div>
                  <div className="text-lg font-bold text-green-600 dark:text-green-400">
                    {scores.sentiment.positive > Math.max(scores.sentiment.neutral, scores.sentiment.negative) 
                      ? "Positive" 
                      : scores.sentiment.neutral > scores.sentiment.negative 
                      ? "Neutral" 
                      : "Negative"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Top Influencers */}
        <section>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
            <Users className="w-5 h-5" />
            Top Influencers
          </h3>

          <div className="bg-gray-50/50 dark:bg-gray-800/50 border border-gray-200/30 dark:border-gray-700/30 rounded-xl p-6">
            <div className="space-y-4">
              {scores.topInfluencers.map((influencer, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-white/50 dark:bg-gray-700/50 rounded-lg border border-gray-200/20 dark:border-gray-600/20"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-gray-100">
                        {influencer.name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {influencer.followers} followers
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-primary">
                      {influencer.mentions}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      mentions
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button className="w-full mt-4 text-sm text-muted-foreground hover:text-primary transition-colors flex items-center justify-center gap-1 py-2">
              View All Influencers
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </section>
      </div>

      {/* Narrative Alignment Tags */}
      <section>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Narrative Alignment Tags
        </h3>

        <div className="bg-gray-50/50 dark:bg-gray-800/50 border border-gray-200/30 dark:border-gray-700/30 rounded-xl p-6">
          <div className="flex flex-wrap gap-3">
            {[
              "DeFi Innovation",
              "Community Governance",
              "Web3 Gaming",
              "Decentralized Infrastructure",
              "Token Economics",
              "Cross-chain Interoperability",
            ].map((tag, index) => (
              <Badge
                key={index}
                variant="outline"
                className="px-4 py-2 bg-white/50 dark:bg-gray-700/50 hover:bg-primary/10 hover:border-primary/50 transition-all duration-200 cursor-pointer"
              >
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ScoresTab;