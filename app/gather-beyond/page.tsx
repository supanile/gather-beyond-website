"use client";

import { useState } from "react";
import {
  useGatherDashboardData,
  useFilteredProjects,
} from "@/hooks/useGatherDashboardData";
import {
  DashboardFilters,
  DashboardSort,
  BlockchainNetwork,
  ProjectCategory,
} from "@/types/gatherDashboard";
import { generateGatherScore } from "@/data/mockGatherData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, ArrowUpDown, Grid, List } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

export default function GatherBeyondDashboard() {
  const { projects, isLoading, error } = useGatherDashboardData();
  const [filters, setFilters] = useState<DashboardFilters>({});
  const [sort, setSort] = useState<DashboardSort>({
    field: "score",
    direction: "desc",
  });
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProjects = useFilteredProjects(
    projects,
    { ...filters, searchTerm },
    sort
  );

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
  };

  const handleChainFilter = (chain: string) => {
    const currentChains = filters.chain || [];
    const newChains = currentChains.includes(chain as BlockchainNetwork)
      ? currentChains.filter((c) => c !== chain)
      : [...currentChains, chain as BlockchainNetwork];

    setFilters({
      ...filters,
      chain: newChains.length > 0 ? newChains : undefined,
    });
  };

  const handleCategoryFilter = (category: string) => {
    const currentCategories = filters.category || [];
    const newCategories = currentCategories.includes(
      category as ProjectCategory
    )
      ? currentCategories.filter((c) => c !== category)
      : [...currentCategories, category as ProjectCategory];

    setFilters({
      ...filters,
      category: newCategories.length > 0 ? newCategories : undefined,
    });
  };

  const clearFilters = () => {
    setFilters({});
    setSearchTerm("");
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-green-600 bg-green-50";
    if (score >= 70) return "text-blue-600 bg-blue-50";
    if (score >= 55) return "text-yellow-600 bg-yellow-50";
    if (score >= 35) return "text-orange-600 bg-orange-50";
    return "text-red-600 bg-red-50";
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading Gather Beyond Dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error loading projects: {error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Gather Beyond Dashboard
        </h1>
        {/* <p className="text-lg text-gray-600">
          Web3 Project Trust Score Analytics - Discover, analyze, and compare
          crypto projects with comprehensive trust metrics
        </p> */}
      </div>

    
      

      {/* Results Summary */}
      <div className="flex items-center justify-between mb-6">
        <p className="text-gray-600">
          Showing {filteredProjects.length} of {projects.length} projects
        </p>
        {/* <Badge variant="outline" className="text-xs">
          Last updated: {new Date().toLocaleDateString()}
        </Badge> */}
      </div>

      {/* Projects Grid/List */}
      {filteredProjects.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Filter className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No projects found
            </h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search terms or filters
            </p>
            <Button onClick={clearFilters} variant="outline">
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div
          className={cn(
            "grid gap-6",
            viewMode === "grid"
              ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
              : "grid-cols-1"
          )}
        >
          {filteredProjects.map((project) => {
            const gatherScore = generateGatherScore(project.id);

            return (
              <Card
                key={project.id}
                className="hover:shadow-lg transition-shadow cursor-pointer"
              >
                <Link href={`/gather-beyond/${project.id}`}>
                  <CardHeader className="pb-4">
                    <div className="flex items-center gap-4">
                      <div className="relative h-12 w-12 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                        {project.image_url ? (
                          <Image
                            src={project.image_url}
                            alt={`${project.name} logo`}
                            fill
                            className="object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = "none";
                            }}
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                            {project.name.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg truncate">
                          {project.name}
                        </CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {project.chain.charAt(0).toUpperCase() +
                              project.chain.slice(1)}
                          </Badge>
                          <div
                            className={cn(
                              "px-2 py-1 rounded-full text-xs font-semibold",
                              getScoreColor(gatherScore.overall)
                            )}
                          >
                            {gatherScore.overall}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {project.categories.slice(0, 2).map((category, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-xs"
                        >
                          {category}
                        </Badge>
                      ))}
                      {project.categories.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{project.categories.length - 2}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Link>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
