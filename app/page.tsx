"use client";

import React, { useState } from "react";
import Header from "@/components/LandingDashboard/Header/Header";
import HeroSection from "@/components/LandingDashboard/HeroSection";
import { FeaturedProjects } from "@/components/LandingDashboard/FeaturedProjects";
import LiveInsightsPanel from "@/components/LandingDashboard/LiveInsightsPanel";
import MediaFeed from "@/components/LandingDashboard/MediaFeed";
import ProjectsTable from "@/components/LandingDashboard/ProjectsTable";
import { allProjects as projects, featuredProjects, Project } from "@/data/admin/projectMockData";

const Dashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedFilter, setSelectedFilter] = useState<string>("");

  // Filter projects based on search and filter
  const filteredProjects: Project[] = projects.filter((project: Project) => {
    const matchesSearch = searchTerm === "" || 
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.tags.some((tag: string) => tag.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesFilter = selectedFilter === "" || 
      (selectedFilter === "Trending Now" && project.mindshareScore >= 70) ||
      (selectedFilter === "Highest Trust" && project.trustScore >= 80) ||
      (selectedFilter === "Most Active Communities" && project.mindshareScore >= 75) ||
      (selectedFilter === "New Projects" && project.trustScore < 60);

    return matchesSearch && matchesFilter;
  });

  const handleSearch = (term: string): void => {
    setSearchTerm(term);
    setSelectedFilter(""); // Clear filter when searching
  };

  const handleFilterSelect = (filter: string): void => {
    setSelectedFilter(filter);
    if (filter !== "") {
      setSearchTerm(""); // Clear search when selecting a filter
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection 
        onSearch={handleSearch}
        onFilterSelect={handleFilterSelect}
        selectedFilter={selectedFilter}
      />
      <FeaturedProjects 
        projects={searchTerm || selectedFilter ? filteredProjects.slice(0, 6) : featuredProjects}
      />
      <LiveInsightsPanel />
      <MediaFeed />
      <ProjectsTable 
        projects={searchTerm || selectedFilter ? filteredProjects : projects}
      />
    </div>
  );
};

export default Dashboard;