// app/admin/superstore/page.tsx (Replace your existing SuperStorePage)
"use client";

import React from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { SuperStoreStatCard } from '@/components/admin/superstore/SuperStoreStatCard';
import { ClaimersRankingTable } from '@/components/admin/superstore/ClaimersRankingTable';
import { CreditSpendingChart } from '@/components/admin/superstore/CreditSpendingChart';
import { WinnersList } from '@/components/admin/superstore/WinnersList';
import { useSuperStore } from '@/hooks/useSuperStore';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Users, 
  CreditCard, 
  Trophy, 
  TrendingUp, 
  Crown, 
  AlertCircle 
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Loading skeleton component
const SuperStorePageSkeleton = () => (
  <div className="space-y-6">
    {/* Stats Cards Loading */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="bg-card rounded-2xl shadow-sm border border-border p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-3 w-20" />
            </div>
            <Skeleton className="h-12 w-12 rounded-2xl" />
          </div>
        </div>
      ))}
    </div>

    {/* Content Grid Loading */}
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
      {/* Left Column - Claimers Table */}
      <div className="space-y-6">
        <Skeleton className="h-96 rounded-2xl" />
      </div>
      
      {/* Right Column - Credit Spending */}
      <div className="space-y-6">
        <Skeleton className="h-96 rounded-2xl" />
        <Skeleton className="h-64 rounded-2xl" />
      </div>
    </div>

    {/* Winners List Loading */}
    <Skeleton className="h-96 rounded-2xl" />
  </div>
);

const SuperStorePage = () => {
  const { claimers, creditSpending, winners, stats, isLoading, error } = useSuperStore();

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SuperStorePageSkeleton />
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="container mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Error loading Super Store data: {error}
            </AlertDescription>
          </Alert>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <SuperStoreStatCard
            title="Total Claimers"
            value={stats?.totalClaimers?.toLocaleString() || '0'}
            icon={Users}
            description="Active users in store"
          />
          <SuperStoreStatCard
            title="Credits Spent"
            value={stats?.totalCreditsSpent?.toLocaleString() || '0'}
            icon={CreditCard}
            description="Total credits used"
            trend={{ value: 12, isPositive: true }}
          />
          <SuperStoreStatCard
            title="Total Winners"
            value={stats?.totalWinners?.toLocaleString() || '0'}
            icon={Trophy}
            description="Prize recipients"
          />
          <SuperStoreStatCard
            title="Avg. Credits/User"
            value={stats?.averageCreditsPerUser?.toLocaleString() || '0'}
            icon={TrendingUp}
            description="Per user spending"
            trend={{ value: 8, isPositive: true }}
          />
          <SuperStoreStatCard
            title="Top Tier Users"
            value={stats?.topTierUsers?.toLocaleString() || '0'}
            icon={Crown}
            description="Platinum & Diamond"
            trend={{ value: 5, isPositive: true }}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Left Column - Claimers Ranking */}
          <div className="space-y-6">
            <ClaimersRankingTable claimers={claimers} isLoading={isLoading} />
          </div>
          
          {/* Right Column - Credit Spending Analytics */}
          <div className="space-y-6">
            <CreditSpendingChart creditSpending={creditSpending} isLoading={isLoading} />
          </div>
        </div>

        {/* Winners List - Full Width */}
        <div className="w-full">
          <WinnersList winners={winners} isLoading={isLoading} />
        </div>
      </div>
    </AdminLayout>
  );
};

export default SuperStorePage;