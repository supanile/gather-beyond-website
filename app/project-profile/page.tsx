"use client";

import React from "react";
import { useSearchParams } from "next/navigation";
import ProjectTabs from "@/components/ProjectProfile/Tabs/ProjectTabs";
import Header from "@/components/LandingDashboard/Header/Header";
import ProjectHeader from "@/components/ProjectProfile/ProjectHeader";
import SidePanel from "@/components/ProjectProfile/Sidepanel";
import { allProjects, Project } from "@/data/admin/projectMockData";

// Function to get project data based on ID with fallback to mock data structure
const getProjectData = (projectId: number) => {
  const project = allProjects.find(p => p.id === projectId);
  if (!project) {
    // Return first project as fallback
    return createProjectData(allProjects[0]);
  }
  return createProjectData(project);
};

// Function to create project data with extended structure for profile page  
const createProjectData = (project: Project) => {
  const { reviews: projectReviews, reviewCount, ...projectData } = project;
  
  return {
    ...projectData,
    logo: project.logo || "🔗",
    description: project.description || `${project.category} project`,
    chain: project.chain || "Ethereum",
    narrative: project.narrative || project.category,
    badges: project.badges || ["Verified"],
    verified: project.verified !== undefined ? project.verified : true,
    
    // Token specific data (mock for now, can be replaced with real API data)
    tokenData: {
      address: project.id === 1 ? "0xc797fc5ca8ef5502aaa0307b9bfc45e877d6caf5" : 
               project.id === 2 ? "8BMzMi2XxZn9afRaMx5Z6fauk9foHXqV5cLTCYWRcVje" :
               "0x" + Math.random().toString(16).slice(2, 42),
      symbol: project.id === 1 ? "SUPER" : 
              project.id === 2 ? "STIK" : 
              project.name.slice(0, 4).toUpperCase(),
      decimals: project.id === 2 ? 9 : 18,
      coingeckoId: project.name.toLowerCase().replace(/\s+/g, '-'),
      imageUrl: project.image_url || "",
      holders: {
        count: project.id === 1 ? 6526 : 
               project.id === 2 ? 27758 : 
               Math.floor(Math.random() * 10000) + 1000,
        distribution: {
          top_10: project.id === 1 ? "85.22%" : "81.80%",
          top_30: project.id === 1 ? "6.41%" : "9.47%",
          top_50: project.id === 1 ? "2.88%" : "4.44%",
          rest: project.id === 1 ? "5.49%" : "4.29%",
        },
      },
      gtScore: project.trustScore,
      gtScoreDetails: {
        pool: Math.min(100, project.trustScore + 10),
        transaction: Math.floor(Math.random() * 50),
        creation: project.verified ? 100 : 50,
        info: 100,
        holders: Math.min(100, project.mindshareScore + 15),
      },
      isHoneypot: false,
      categories: [project.category],
    },

    // Overview data
    overview: {
      about: project.description || `${project.name} is a ${project.category.toLowerCase()} project focused on building innovative blockchain solutions.`,
      verifiedWallets: [
        {
          address: project.id === 1 ? "0xc797fc5ca8ef5502aaa0307b9bfc45e877d6caf5" : 
                   project.id === 2 ? "8BMzMi2XxZn9afRaMx5Z6fauk9foHXqV5cLTCYWRcVje" :
                   "0x" + Math.random().toString(16).slice(2, 42),
          type: "Token Contract",
          verified: true,
        },
        {
          address: "0x" + Math.random().toString(16).slice(2, 42),
          type: "Treasury",
          verified: true,
        },
        {
          address: "0x" + Math.random().toString(16).slice(2, 42),
          type: "Operations",
          verified: true,
        },
      ],
      audits: [
        {
          company: project.trustScore > 80 ? "CertiK" : "GoPlus Security",
          date: "2024-08-15",
          status: "Passed",
          score: project.trustScore,
        },
        {
          company: "Token Security Analysis",
          date: "2024-07-20",
          status: "Passed",
          score: Math.max(50, project.trustScore - 10),
        },
      ],
      communityLinks: {
        discord: undefined,
        telegram: undefined,
        twitter: project.id === 1 ? "https://twitter.com/superconnector_" :
                 project.id === 2 ? "https://twitter.com/staika_official" :
                 `https://twitter.com/${project.name.toLowerCase().replace(/\s+/g, '')}`,
        github: undefined,
        website: project.id === 1 ? "https://superconnectoragent.com" :
                 project.id === 2 ? "https://staika.io" :
                 `https://${project.name.toLowerCase().replace(/\s+/g, '')}.com`,
      },
    },

    // Scores breakdown
    scores: {
      trustBreakdown: {
        communityHealth: Math.min(100, project.mindshareScore + 5),
        campaignSuccess: Math.min(100, project.trustScore + 10),
        onchainBehavior: project.trustScore,
      },
      mindshareHistory: [
        { date: "2024-07-01", value: Math.max(20, project.mindshareScore - 30) },
        { date: "2024-07-15", value: Math.max(25, project.mindshareScore - 25) },
        { date: "2024-08-01", value: Math.max(30, project.mindshareScore - 20) },
        { date: "2024-08-15", value: Math.max(35, project.mindshareScore - 15) },
        { date: "2024-09-01", value: Math.max(40, project.mindshareScore - 10) },
        { date: "2024-09-15", value: Math.max(45, project.mindshareScore - 5) },
        { date: "2024-09-19", value: project.mindshareScore },
      ],
      sentiment: {
        positive: project.trustScore > 70 ? 70 : 60,
        neutral: 25,
        negative: project.trustScore > 70 ? 5 : 15,
      },
      topInfluencers: [
        { name: `@${project.name.toLowerCase().replace(/\s+/g, '')}`, mentions: reviewCount || 50, followers: "1.2K" },
        { name: "@cryptoexpert", mentions: Math.floor((reviewCount || 50) * 0.5), followers: "15K" },
        { name: "@web3builder", mentions: Math.floor((reviewCount || 50) * 0.3), followers: "8.5K" },
        { name: "@defianalyst", mentions: Math.floor((reviewCount || 50) * 0.2), followers: "45K" },
      ],
    },

    // Campaigns
    campaigns: [
      {
        id: 1,
        name: `${project.name} Community Launch`,
        successRate: Math.min(95, project.trustScore + 15),
        avgXP: 150 + Math.floor(project.mindshareScore / 2),
        completionTime: "2 days",
        participants: Math.floor((reviewCount || 50) * 10),
      },
      {
        id: 2,
        name: `${project.category} Integration Campaign`,
        successRate: Math.min(95, project.trustScore + 10),
        avgXP: 125 + Math.floor(project.mindshareScore / 3),
        completionTime: "4 days",
        participants: Math.floor((reviewCount || 50) * 8),
      },
      {
        id: 3,
        name: `Trust Building Initiative`,
        successRate: Math.min(95, project.trustScore + 5),
        avgXP: 100 + Math.floor(project.mindshareScore / 4),
        completionTime: "3 days",
        participants: Math.floor((reviewCount || 50) * 12),
      },
    ],

    // Reviews - rename to avoid conflict with project.reviews
    reviews: {
      averageRating: projectReviews || 3.5,
      totalReviews: reviewCount || 50,
      breakdown: { 
        5: Math.floor((reviewCount || 50) * 0.4), 
        4: Math.floor((reviewCount || 50) * 0.3), 
        3: Math.floor((reviewCount || 50) * 0.2), 
        2: Math.floor((reviewCount || 50) * 0.07), 
        1: Math.floor((reviewCount || 50) * 0.03) 
      },
      recent: [
        {
          id: 1,
          rating: 5,
          comment: `Great project! ${project.name} has solid fundamentals and good community engagement.`,
          author: "CommunityMember",
          type: "Verified User",
          date: "1 day ago",
          verified: true,
        },
        {
          id: 2,
          rating: 4,
          comment: `${project.name} shows promise in the ${project.category.toLowerCase()} space. Good development activity.`,
          author: "Anonymous",
          type: "Token Holder",
          date: "3 days ago",
          verified: true,
        },
        {
          id: 3,
          rating: Math.floor(projectReviews || 3),
          comment: `Solid project with good trust metrics. The ${project.category.toLowerCase()} use case is compelling.`,
          author: "Analyst",
          type: "Community Leader",
          date: "5 days ago",
          verified: false,
        },
      ],
    },
  };
};

const ProjectProfilePage = () => {
  const searchParams = useSearchParams();
  const projectId = parseInt(searchParams?.get('id') || '1');
  
  // Get project data based on URL parameter
  const projectData = getProjectData(projectId);
  
  // Get related projects (exclude current project) - map to proper format
  const relatedProjects = allProjects
    .filter(p => p.id !== projectId && p.category === projectData.category)
    .slice(0, 3)
    .map(p => ({
      id: p.id,
      name: p.name,
      logo: p.logo || "🔗",
      trustScore: p.trustScore,
      category: p.category,
      verified: p.verified,
      description: p.description || `${p.category} project with trust score of ${p.trustScore}`,
    }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50/30 to-slate-50/30 dark:from-gray-950/30 dark:to-slate-950/30">
      <Header />
      
      <div className="pt-16">
        <ProjectHeader project={{
        id: projectData.id,
        name: projectData.name,
        logo: projectData.logo,
        description: projectData.description,
        trustScore: projectData.trustScore,
        mindshareScore: projectData.mindshareScore,
        category: projectData.category,
        chain: projectData.chain,
        narrative: projectData.narrative,
        badges: projectData.badges,
        tags: projectData.tags,
        tokenData: projectData.tokenData,
      }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content - Tabs */}
          <div className="lg:col-span-3">
            <ProjectTabs project={projectData} />
          </div>

          {/* Side Panel */}
          <div className="lg:col-span-1">
            <SidePanel
              projectId={projectData.id}
              relatedProjects={relatedProjects}
            />
          </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default ProjectProfilePage;
