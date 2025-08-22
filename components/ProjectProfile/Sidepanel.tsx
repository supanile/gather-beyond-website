"use client";

import React from "react";
import { ExternalLink, Shield, TrendingUp, Plus, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface RelatedProject {
  id: number;
  name: string;
  logo: string;
  trustScore: number;
  category: string;
}

interface SidePanelProps {
  projectId: number;
  relatedProjects: RelatedProject[];
}

const SidePanel: React.FC<SidePanelProps> = ({
  projectId,
  relatedProjects,
}) => {
  const [selectedCompareProject, setSelectedCompareProject] =
    React.useState<RelatedProject | null>(null);

  const handleCompareWith = (project: RelatedProject) => {
    setSelectedCompareProject(project);
    console.log(`Compare project ${projectId} with ${project.id}`);
    // Add comparison logic here
  };

  const handleApplyAudit = () => {
    console.log(`Apply for audit for project ${projectId}`);
    // Add audit application logic here
  };

  const handleUpgradeRequest = () => {
    console.log(`Request upgrade for project ${projectId}`);
    // Add upgrade request logic here
  };

  const handleViewProject = (id: number) => {
    console.log(`Navigate to project ${id}`);
    // Add navigation logic here
  };

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

  return (
    <div className="space-y-6">
      {/* Compare With Widget */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Compare With
        </h3>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-between bg-gray-50/50 dark:bg-gray-800/50 border-gray-200/30 dark:border-gray-700/30 hover:border-primary/50"
            >
              <span className="text-muted-foreground">
                {selectedCompareProject
                  ? selectedCompareProject.name
                  : "Select project to compare"}
              </span>
              <TrendingUp className="w-4 h-4 opacity-50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] max-h-[200px] overflow-y-auto"
            align="start"
          >
            {relatedProjects.map((project) => (
              <DropdownMenuItem
                key={project.id}
                onClick={() => handleCompareWith(project)}
                className="flex items-center space-x-3 p-3 cursor-pointer"
              >
                <span className="text-2xl">{project.logo}</span>
                <div className="flex-1 min-w-0">
                  <div className="font-medium text-gray-900 dark:text-gray-100 truncate">
                    {project.name}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {project.category}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div
                    className={`text-sm font-semibold ${getScoreColor(
                      project.trustScore
                    )}`}
                  >
                    {project.trustScore}
                  </div>
                  {selectedCompareProject?.id === project.id && (
                    <Check className="w-4 h-4 text-primary" />
                  )}
                </div>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {selectedCompareProject && (
          <Button className="w-full mt-4 bg-gradient-to-r from-gray-800 to-slate-700 dark:from-gray-200 dark:to-slate-300 text-white dark:text-black hover:from-gray-900 hover:to-slate-800 dark:hover:from-gray-100 dark:hover:to-slate-200 shadow-lg">
            Compare Now
          </Button>
        )}
      </div>

      {/* Related Projects Widget */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Related Projects
          </h3>
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-primary h-auto p-0"
          >
            View all
            <ExternalLink className="w-3 h-3 ml-1" />
          </Button>
        </div>

        <div className="space-y-4">
          {relatedProjects.map((project, index) => (
            <div
              key={project.id}
              className="group flex items-center space-x-3 p-3 bg-gray-50/50 dark:bg-gray-800/50 border border-gray-200/30 dark:border-gray-700/30 rounded-xl hover:border-primary/50 hover:shadow-lg transition-all duration-300 transform hover:scale-105 cursor-pointer animate-fade-up"
              style={{ animationDelay: `${index * 150}ms` }}
              onClick={() => handleViewProject(project.id)}
            >
              <div className="w-10 h-10 bg-gradient-to-r from-gray-100 to-slate-100 dark:from-gray-700 dark:to-slate-700 rounded-xl flex items-center justify-center text-lg flex-shrink-0">
                {project.logo}
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-gray-900 dark:text-gray-100 group-hover:text-primary transition-colors truncate">
                  {project.name}
                </h4>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {project.category}
                  </span>
                  <div className="flex items-center space-x-2">
                    <div
                      className={`text-sm font-semibold ${getScoreColor(
                        project.trustScore
                      )}`}
                    >
                      {project.trustScore}
                    </div>
                    <div className="w-12 bg-gray-200/50 dark:bg-gray-700/50 rounded-full h-1">
                      <div
                        className={`bg-gradient-to-r ${getScoreBarColor(
                          project.trustScore
                        )} h-1 rounded-full transition-all duration-500`}
                        style={{ width: `${project.trustScore}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Button
          variant="outline"
          className="w-full mt-4 border-border/50 hover:bg-accent/30"
        >
          <Plus className="w-4 h-4 mr-2" />
          Explore More Projects
        </Button>
      </div>

      {/* Actions Widget */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Quick Actions
        </h3>

        <div className="space-y-3">
          <Button
            onClick={handleApplyAudit}
            variant="outline"
            className="w-full bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 border-blue-200/30 dark:border-blue-800/30 hover:bg-blue-100 dark:hover:bg-blue-950/50"
          >
            <Shield className="w-4 h-4 mr-2" />
            Apply for Audit
          </Button>

          <Button
            onClick={handleUpgradeRequest}
            variant="outline"
            className="w-full bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-400 border-purple-200/30 dark:border-purple-800/30 hover:bg-purple-100 dark:hover:bg-purple-950/50"
          >
            <TrendingUp className="w-4 h-4 mr-2" />
            Request Upgrade
          </Button>
        </div>
      </div>

      {/* Trust Score Widget */}
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-200/50 dark:border-gray-700/50 rounded-2xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Trust Insights
        </h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Trust Ranking</span>
            <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
              Top 15%
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Category Rank</span>
            <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
              #3 in DAOs
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Trend</span>
            <div className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-green-500" />
              <span className="text-sm text-green-600 dark:text-green-400">
                +5.2%
              </span>
            </div>
          </div>
        </div>

        <Button
          variant="ghost"
          className="w-full mt-4 text-muted-foreground hover:text-primary h-auto p-2"
        >
          View Detailed Analysis
          <ExternalLink className="w-3 h-3 ml-1" />
        </Button>
      </div>
    </div>
  );
};

export default SidePanel;
