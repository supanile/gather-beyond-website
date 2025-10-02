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

      {/* Most Active Server Highlight */}
      {stats?.mostActiveServer && (
        <div className="relative overflow-hidden bg-gradient-to-br from-amber-500/20 via-yellow-500/20 to-orange-500/20 rounded-2xl border-2 border-amber-400/40 p-6 shadow-lg">
          {/* Glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-yellow-500/10 blur-xl"></div>

          <div className="relative flex items-center gap-4">
            <div className="h-20 w-20 rounded-xl flex items-center justify-center shadow-lg p-3">
              <img
              src={stats.mostActiveServer.image_url}
              alt={stats.mostActiveServer.name}
              className="h-full w-full object-cover rounded-lg"
              onError={(e) => {
                e.currentTarget.src =
                'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M2 20a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8l-7 5V8l-7 5V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z"/><path d="M17 18h1"/><path d="M12 18h1"/><path d="M7 18h1"/></svg>';
              }}
              />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-bold text-amber-600 dark:text-amber-400">
                  👑 Most Active SC Server
                </h3>
              </div>
              <p className="text-2xl font-bold bg-gradient-to-r from-amber-600 to-yellow-600 dark:from-amber-400 dark:to-yellow-400 bg-clip-text text-transparent mb-1">
                {stats.mostActiveServer.name}
              </p>
              <p className="text-sm font-medium text-amber-700 dark:text-amber-300">
                {stats.mostActiveServer.member_count.toLocaleString()} members •{" "}
                {stats.mostActiveServer.sc_user_count.toLocaleString()} SC users
              </p>
            </div>
          </div>
        </div>
      )}

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
