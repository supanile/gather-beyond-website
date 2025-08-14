"use client";

import Header from "@/components/LandingDashboard/Header/Header";
import HeroSection from "@/components/LandingDashboard/HeroSection";
import { FeaturedProjects } from "@/components/LandingDashboard/FeaturedProjects";
import LiveInsightsPanel from "@/components/LandingDashboard/LiveInsightsPanel";
import MediaFeed from "@/components/LandingDashboard/MediaFeed";
import ProjectsTable from "@/components/LandingDashboard/ProjectsTable";

const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <FeaturedProjects />
      <LiveInsightsPanel />
      <MediaFeed />
      <ProjectsTable />
    </div>
  );
};

export default Dashboard;
