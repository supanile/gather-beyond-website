"use client";

import { useProjectDetails } from "@/hooks/useGatherDashboardData";
import { ProjectOverview } from "@/components/gather-beyond/ProjectOverview";
import { GatherScoreComponent } from "@/components/gather-beyond/GatherScore";
import { SocialSignalsComponent } from "@/components/gather-beyond/SocialSignals";
import { TokenHealthComponent } from "@/components/gather-beyond/TokenHealth";
import { SuperScoreComponent } from "@/components/gather-beyond/SuperScore";
import { AINotesCard } from "@/components/gather-beyond/AINotesCard";
import { ProjectActionsComponent } from "@/components/gather-beyond/ProjectActions";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface ProjectDetailPageProps {
  params: {
    projectId: string;
  };
}

export default function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { projectData, isLoading, error } = useProjectDetails(params.projectId);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading project details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !projectData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || "Project not found"}</p>
          <Link href="/gather-beyond">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header with Navigation */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Link href="/gather-beyond">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {projectData.project.name}
            </h1>
            {/* <p className="text-gray-600">
              Comprehensive trust analysis and project overview
            </p> */}
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Project Overview */}
          <ProjectOverview
            project={projectData.project}
            isVerified={false}
            // isAudited={Math.random() > 0.5} // Random for demo
            isAudited={false}
          />

          {/* Gather Score */}
          <GatherScoreComponent score={projectData.gatherScore} />

          {/* Social Signals */}
          <SocialSignalsComponent signals={projectData.socialSignals} />

          {/* Token Health */}
          <TokenHealthComponent tokenHealth={projectData.tokenHealth} />

          {/* Super Score */}
          <SuperScoreComponent superScore={projectData.superScore} />
        </div>

        {/* Right Column - Sidebar */}
        <div className="space-y-8">
          {/* AI Risk Assessment */}
          <AINotesCard assessment={projectData.aiAssessment} />

          {/* Project Actions */}
          <ProjectActionsComponent
            project={projectData.project}
            actions={projectData.actions}
          />
        </div>
      </div>
    </div>
  );
}
