"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, CreditCard, Crown, TrendingUp } from "lucide-react";
import { useSuperStoreData } from "@/hooks/useSuperStoreData";
import AdminStatCard from "@/components/admin/AdminStatCard";
import { Skeleton } from "@/components/ui/skeleton";
import LeaderboardTable from "@/components/admin/super-store/LeaderboardTable";
import CreditSpendingTable from "@/components/admin/super-store/CreditSpendingTable";
import WinnersTable from "@/components/admin/super-store/WinnersTable";

const SuperStoreOverview = () => {
  const { data, isLoading, error } = useSuperStoreData();

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Stats Cards Loading */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="bg-card rounded-2xl shadow-sm border border-border p-6"
            >
              <div className="flex items-center justify-between">
                <div>
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-8 w-16" />
                </div>
                <Skeleton className="h-8 w-8 rounded" />
              </div>
            </div>
          ))}
        </div>

        {/* Tabs Loading */}
        <div className="space-y-6">
          <div className="grid w-full grid-cols-3 h-16 bg-muted rounded-lg p-1 mb-6">
            <Skeleton className="h-full rounded-md" />
            <Skeleton className="h-full rounded-md" />
            <Skeleton className="h-full rounded-md" />
          </div>
          <Skeleton className="h-96 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-destructive">Error loading super store data: {error}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">No data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AdminStatCard
          title="Total Claimers"
          value={data.stats.total_claimers.toLocaleString()}
          icon={Trophy}
        />
        <AdminStatCard
          title="Total Credits Spent"
          value={`${data.stats.total_credits_spent.toLocaleString()}`}
          icon={CreditCard}
        />
        <AdminStatCard
          title="Total Winners"
          value={data.stats.total_winners.toLocaleString()}
          icon={Crown}
        />
        <AdminStatCard
          title="Average Level"
          value={data.stats.average_level.toFixed(1)}
          icon={TrendingUp}
        />
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="leaderboard" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 h-12 sm:h-14 md:h-16">
          <TabsTrigger
            value="leaderboard"
            className="flex items-center gap-2 sm:gap-3 text-sm sm:text-base md:text-lg py-2 sm:py-3 cursor-pointer"
          >
            <Trophy className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8" />
            <span className="truncate">Claimers</span>
          </TabsTrigger>
          <TabsTrigger
            value="credit-spending"
            className="flex items-center gap-2 sm:gap-3 text-sm sm:text-base md:text-lg py-2 sm:py-3 cursor-pointer"
          >
            <CreditCard className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8" />
            <span className="truncate">Credits Spent</span>
          </TabsTrigger>
          <TabsTrigger
            value="winners"
            className="flex items-center gap-2 sm:gap-3 text-sm sm:text-base md:text-lg py-2 sm:py-3 cursor-pointer"
          >
            <Crown className="h-5 w-5 sm:h-6 sm:w-6 md:h-8 md:w-8" />
            <span className="truncate">Winners</span>
          </TabsTrigger>
        </TabsList>

        {/* Leaderboard Tab */}
        <TabsContent value="leaderboard">
          <div className="bg-card rounded-2xl shadow-sm border border-border p-6">
            <LeaderboardTable />
          </div>
        </TabsContent>

        {/* Credit Spending Tab */}
        <TabsContent value="credit-spending">
          <div className="bg-card rounded-2xl shadow-sm border border-border p-6">
            <CreditSpendingTable />
          </div>
        </TabsContent>

        {/* Winners Tab */}
        <TabsContent value="winners">
          <div className="bg-card rounded-2xl shadow-sm border border-border p-6">
            <WinnersTable />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SuperStoreOverview;
