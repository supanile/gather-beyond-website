"use client";

import React from "react";
import { Shield, Activity, ExternalLink, Copy, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Project {
  id: number;
  name: string;
  logo: string;
  description: string;
  trustScore: number;
  mindshareScore: number;
  category: string;
  chain: string;
  narrative: string;
  badges: string[];
  tags: string[];
}

interface ProjectHeaderProps {
  project: Project;
}

const ProjectHeader: React.FC<ProjectHeaderProps> = ({ project }) => {
  const [copiedAddress, setCopiedAddress] = React.useState(false);

  const projectAddress = "0x742d35Cc6634C0532925a3b8D322C3b1e0c39e9f";

  const handleCopyAddress = async () => {
    try {
      await navigator.clipboard.writeText(projectAddress);
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 2000);
    } catch (err) {
      console.error("Failed to copy address:", err);
    }
  };

  const getScoreColor = (score: number, type: "trust" | "mindshare") => {
    if (type === "trust") {
      return score >= 80
        ? "from-green-500 to-green-600"
        : score >= 60
        ? "from-yellow-500 to-yellow-600"
        : "from-red-500 to-red-600";
    } else {
      return "from-blue-500 to-purple-600";
    }
  };

  const getScoreTextColor = (score: number, type: "trust" | "mindshare") => {
    if (type === "trust") {
      return score >= 80
        ? "text-green-600 dark:text-green-400"
        : score >= 60
        ? "text-yellow-600 dark:text-yellow-400"
        : "text-red-600 dark:text-red-400";
    }
    return "text-blue-600 dark:text-blue-400";
  };

  const getBadgeColor = (badge: string) => {
    const colors: { [key: string]: string } = {
      Verified:
        "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
      Audited:
        "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
      "Gold Tier":
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
      "Silver Tier":
        "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
      Featured:
        "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
    };
    return (
      colors[badge] ||
      "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
    );
  };

  return (
    <section className="bg-gradient-to-br from-gray-50/30 to-slate-50/30 dark:from-gray-950/30 dark:to-slate-950/30 border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left Column - Project Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Project Title & Logo */}
            <div className="flex items-start space-x-4">
              <div className="w-20 h-20 bg-gradient-to-r from-gray-100 to-slate-100 dark:from-gray-800 dark:to-slate-800 rounded-2xl flex items-center justify-center text-4xl flex-shrink-0">
                {project.logo}
              </div>
              <div className="flex-1 min-w-0 space-y-2">
                <div className="flex items-center space-x-3 flex-wrap">
                  <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-gray-900 to-slate-800 dark:from-gray-100 dark:to-slate-200 bg-clip-text text-transparent">
                    {project.name}
                  </h1>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <span>
                      {projectAddress.slice(0, 6)}...{projectAddress.slice(-4)}
                    </span>
                    <button
                      onClick={handleCopyAddress}
                      className="p-1 hover:bg-accent rounded-md transition-colors"
                    >
                      {copiedAddress ? (
                        <Check className="w-4 h-4 text-green-500" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <p className="text-muted-foreground leading-relaxed">
                  {project.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 pt-2">
                  <Badge
                    variant="outline"
                    className="bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-300"
                  >
                    {project.chain}
                  </Badge>
                  <Badge
                    variant="outline"
                    className="bg-purple-50 text-purple-700 dark:bg-purple-950/50 dark:text-purple-300"
                  >
                    {project.category}
                  </Badge>
                  <Badge
                    variant="outline"
                    className="bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300"
                  >
                    {project.narrative}
                  </Badge>
                  {project.badges.map((badge) => (
                    <Badge key={badge} className={getBadgeColor(badge)}>
                      {badge}
                    </Badge>
                  ))}
                </div>

                {/* Additional Tags */}
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-gray-100/50 dark:bg-gray-800/50 text-gray-700 dark:text-gray-300 text-sm rounded-lg border border-gray-200/30 dark:border-gray-700/30"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Scores */}
          <div className="space-y-4">
            {/* Trust Score Card */}
            <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Trust Score
                  </span>
                  <span
                    className={`text-2xl font-bold ${getScoreTextColor(
                      project.trustScore,
                      "trust"
                    )}`}
                  >
                    {project.trustScore}
                  </span>
                </div>
                <div className="w-full bg-gray-200/50 dark:bg-gray-700/50 rounded-full h-3">
                  <div
                    className={`bg-gradient-to-r ${getScoreColor(
                      project.trustScore,
                      "trust"
                    )} h-3 rounded-full transition-all duration-500`}
                    style={{ width: `${project.trustScore}%` }}
                  ></div>
                </div>
                <button className="w-full text-sm text-muted-foreground hover:text-primary transition-colors flex items-center justify-center gap-1">
                  View Breakdown
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Mindshare Score Card */}
            <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-6">
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    Mindshare Score
                  </span>
                  <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {project.mindshareScore}
                  </span>
                </div>
                <div className="w-full bg-gray-200/50 dark:bg-gray-700/50 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${project.mindshareScore}%` }}
                  ></div>
                </div>
                <button className="w-full text-sm text-muted-foreground hover:text-primary transition-colors flex items-center justify-center gap-1">
                  View Graph
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProjectHeader;