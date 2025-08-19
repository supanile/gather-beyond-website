import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OverviewTab from "./OverviewTab";
import ScoresTab from "./ScoresTab";
import CampaignHistoryTab from "./CampaignHistoryTab";
import ReviewsTab from "./ReviewsTab";

interface ProjectTabsProps {
  project: any; // Using any for simplicity, should be properly typed in real implementation
}

const ProjectTabs: React.FC<ProjectTabsProps> = ({ project }) => {
  return (
    <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl overflow-hidden shadow-lg">
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="w-full grid grid-cols-4 bg-gray-50/50 dark:bg-gray-800/50 rounded-none h-14 p-0">
          <TabsTrigger
            value="overview"
            className="
              relative overflow-hidden rounded-none h-full
              font-medium text-gray-600 dark:text-gray-400
              hover:text-gray-900 dark:hover:text-gray-100
              hover:bg-gradient-to-r hover:from-blue-50/80 hover:to-purple-50/80
              dark:hover:from-blue-900/20 dark:hover:to-purple-900/20
              data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400
              data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-50 data-[state=active]:to-purple-50
              dark:data-[state=active]:from-blue-900/30 dark:data-[state=active]:to-purple-900/30
              data-[state=active]:shadow-sm
              transition-all duration-300 ease-in-out
              before:absolute before:bottom-0 before:left-0 before:right-0 before:h-0.5
              before:bg-gradient-to-r before:from-blue-500 before:to-purple-500
              before:scale-x-0 before:transition-transform before:duration-300
              data-[state=active]:before:scale-x-100
              hover:before:scale-x-100 hover:before:opacity-60
            "
          >
            Overview
          </TabsTrigger>
          <TabsTrigger
            value="scores"
            className="
              relative overflow-hidden rounded-none h-full
              font-medium text-gray-600 dark:text-gray-400
              hover:text-gray-900 dark:hover:text-gray-100
              hover:bg-gradient-to-r hover:from-emerald-50/80 hover:to-teal-50/80
              dark:hover:from-emerald-900/20 dark:hover:to-teal-900/20
              data-[state=active]:text-emerald-600 dark:data-[state=active]:text-emerald-400
              data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-50 data-[state=active]:to-teal-50
              dark:data-[state=active]:from-emerald-900/30 dark:data-[state=active]:to-teal-900/30
              data-[state=active]:shadow-sm
              transition-all duration-300 ease-in-out
              before:absolute before:bottom-0 before:left-0 before:right-0 before:h-0.5
              before:bg-gradient-to-r before:from-emerald-500 before:to-teal-500
              before:scale-x-0 before:transition-transform before:duration-300
              data-[state=active]:before:scale-x-100
              hover:before:scale-x-100 hover:before:opacity-60
            "
          >
            Scores
          </TabsTrigger>
          <TabsTrigger
            value="campaigns"
            className="
              relative overflow-hidden rounded-none h-full
              font-medium text-gray-600 dark:text-gray-400
              hover:text-gray-900 dark:hover:text-gray-100
              hover:bg-gradient-to-r hover:from-orange-50/80 hover:to-red-50/80
              dark:hover:from-orange-900/20 dark:hover:to-red-900/20
              data-[state=active]:text-orange-600 dark:data-[state=active]:text-orange-400
              data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-50 data-[state=active]:to-red-50
              dark:data-[state=active]:from-orange-900/30 dark:data-[state=active]:to-red-900/30
              data-[state=active]:shadow-sm
              transition-all duration-300 ease-in-out
              before:absolute before:bottom-0 before:left-0 before:right-0 before:h-0.5
              before:bg-gradient-to-r before:from-orange-500 before:to-red-500
              before:scale-x-0 before:transition-transform before:duration-300
              data-[state=active]:before:scale-x-100
              hover:before:scale-x-100 hover:before:opacity-60
            "
          >
            Campaigns
          </TabsTrigger>
          <TabsTrigger
            value="reviews"
            className="
              relative overflow-hidden rounded-none h-full
              font-medium text-gray-600 dark:text-gray-400
              hover:text-gray-900 dark:hover:text-gray-100
              hover:bg-gradient-to-r hover:from-violet-50/80 hover:to-pink-50/80
              dark:hover:from-violet-900/20 dark:hover:to-pink-900/20
              data-[state=active]:text-violet-600 dark:data-[state=active]:text-violet-400
              data-[state=active]:bg-gradient-to-r data-[state=active]:from-violet-50 data-[state=active]:to-pink-50
              dark:data-[state=active]:from-violet-900/30 dark:data-[state=active]:to-pink-900/30
              data-[state=active]:shadow-sm
              transition-all duration-300 ease-in-out
              before:absolute before:bottom-0 before:left-0 before:right-0 before:h-0.5
              before:bg-gradient-to-r before:from-violet-500 before:to-pink-500
              before:scale-x-0 before:transition-transform before:duration-300
              data-[state=active]:before:scale-x-100
              hover:before:scale-x-100 hover:before:opacity-60
            "
          >
            Reviews
          </TabsTrigger>
        </TabsList>

        <div className="p-6">
          <TabsContent value="overview" className="mt-0 space-y-6">
            <OverviewTab overview={project.overview} />
          </TabsContent>

          <TabsContent value="scores" className="mt-0 space-y-6">
            <ScoresTab scores={project.scores} />
          </TabsContent>

          <TabsContent value="campaigns" className="mt-0 space-y-6">
            <CampaignHistoryTab campaigns={project.campaigns} />
          </TabsContent>

          <TabsContent value="reviews" className="mt-0 space-y-6">
            <ReviewsTab reviews={project.reviews} />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
};

export default ProjectTabs;
