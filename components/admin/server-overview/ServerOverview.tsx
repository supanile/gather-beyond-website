import React from "react";
import { useServerData } from "@/hooks/useServerData";
import ServerStatCard from "./ServerStatCard";
import ServerTable from "./ServerTable";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Server,
  Users,
  Crown,
  Coins,
  Zap,
  TrendingUp,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const ServerOverview: React.FC = () => {
  const { servers, stats, isLoading, error, refreshData } = useServerData();

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Stats Cards Loading */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="bg-card rounded-2xl shadow-sm border border-border p-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Skeleton className="h-4 w-20 mb-2" />
                  <Skeleton className="h-8 w-16 mb-1" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-12 w-12 rounded-lg" />
              </div>
            </div>
          ))}
        </div>

        {/* Server Table Loading */}
        <div className="bg-card rounded-2xl shadow-sm border border-border p-6">
          <div className="space-y-4">
            {/* Controls Loading */}
            <div className="flex justify-between items-center">
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>

            {/* Search Loading */}
            <Skeleton className="h-10 w-full" />

            {/* Server List Loading */}
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="border border-border rounded-lg p-4">
                <div className="flex items-center gap-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="flex-1">
                    <Skeleton className="h-5 w-48 mb-2" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <div className="hidden md:flex gap-6">
                    {Array.from({ length: 4 }).map((_, statIndex) => (
                      <div key={statIndex} className="text-center">
                        <Skeleton className="h-4 w-12 mb-1" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                    ))}
                  </div>
                  <Skeleton className="h-8 w-8" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-destructive mb-4">
            Error loading server data: {error}
          </p>
          <Button onClick={refreshData} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-end">
        <Button onClick={refreshData} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ServerStatCard
          title="Total Servers"
          value={stats?.totalServers.toLocaleString() ?? "0"}
          subtitle="Active servers"
          icon={Server}
        />
        <ServerStatCard
          title="Total Members"
          value={stats?.totalMembers.toLocaleString() ?? "0"}
          subtitle="Across all servers"
          icon={Users}
        />
        <ServerStatCard
          title="SC Users"
          value={stats?.totalSCUsers.toLocaleString() ?? "0"}
          subtitle="Super Connector users"
          icon={Crown}
        />
        <ServerStatCard
          title="Total Credits"
          value={stats?.totalCredits.toLocaleString() ?? "0"}
          subtitle="Earned credits"
          icon={Coins}
        />
        <ServerStatCard
          title="Total XP"
          value={stats?.totalXP.toLocaleString() ?? "0"}
          subtitle="Experience points"
          icon={Zap}
        />
        <ServerStatCard
          title="Avg Members"
          value={stats?.averageMembersPerServer.toLocaleString() ?? "0"}
          subtitle="Per server"
          icon={TrendingUp}
        />
      </div>

      {/* Server Table */}
      <div className="bg-card rounded-2xl shadow-sm border border-border p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-foreground mb-2">
            Discord Servers
          </h3>
          <p className="text-sm text-muted-foreground">
            Detailed view of all connected Discord servers
          </p>
        </div>
        <ServerTable servers={servers} />
      </div>
    </div>
  );
};

export default ServerOverview;
