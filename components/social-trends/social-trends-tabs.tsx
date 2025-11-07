"use client";

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SocialPlatform } from '@/types/social-trends';
import { useSocialTrends } from '@/hooks/use-social-trends';
import GoogleTrendsTab from './google-trends-tab';
import TikTokTrendsTab from './tiktok-trends-tab';
import XTrendsTab from './x-trends-tab';
import GatherTrendsTab from './gather-trends-tab';
import { Search, Play, MessageSquare, Users } from 'lucide-react';

interface SocialTrendsTabsProps {
  className?: string;
}

const SocialTrendsTabs: React.FC<SocialTrendsTabsProps> = ({
  className = "",
}) => {
  const [activeTab, setActiveTab] = useState<SocialPlatform>('google');
  const { google, tiktok, x, gather, loading, error } = useSocialTrends({ useMockData: true });

  const tabConfig = [
    {
      id: 'google',
      label: 'Google Trends',
      icon: Search,
      component: GoogleTrendsTab,
      data: google?.trends || [],
      color: 'text-blue-600',
    },
    {
      id: 'tiktok',
      label: 'TikTok Trends',
      icon: Play,
      component: TikTokTrendsTab,
      data: tiktok?.trends || [],
      color: 'text-pink-600',
    },
    {
      id: 'x',
      label: 'X Trends',
      icon: MessageSquare,
      component: XTrendsTab,
      data: x?.trends || [],
      color: 'text-black',
    },
    {
      id: 'gather',
      label: 'Gather Trends',
      icon: Users,
      component: GatherTrendsTab,
      data: gather?.trends || [],
      color: 'text-purple-600',
    },
  ];

  return (
    <section className={`py-8 sm:py-12 lg:py-16 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-2xl sm:text-2xl md:text-3xl font-bold bg-gradient-to-r from-gray-900 to-slate-800 dark:from-gray-100 dark:to-slate-200 bg-clip-text">
            Social Media Trends
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Real-time trending topics across major social platforms
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as SocialPlatform)} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            {tabConfig.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <TabsTrigger 
                  key={tab.id} 
                  value={tab.id} 
                  className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
                >
                  <IconComponent className={`w-4 h-4 ${tab.color}`} />
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          <TabsContent value="google" className="mt-0">
            <GoogleTrendsTab
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              trends={google?.trends?.filter(t => t.platform === 'google') as any || []}
              loading={loading}
              error={error}
            />
          </TabsContent>

          <TabsContent value="tiktok" className="mt-0">
            <TikTokTrendsTab
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              trends={tiktok?.trends?.filter(t => t.platform === 'tiktok') as any || []}
              loading={loading}
              error={error}
            />
          </TabsContent>

          <TabsContent value="x" className="mt-0">
            <XTrendsTab
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              trends={x?.trends?.filter(t => t.platform === 'x') as any || []}
              loading={loading}
              error={error}
            />
          </TabsContent>

          <TabsContent value="gather" className="mt-0">
            <GatherTrendsTab
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              trends={gather?.trends?.filter(t => t.platform === 'gather') as any || []}
              loading={loading}
              error={error}
            />
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};

export default SocialTrendsTabs;
