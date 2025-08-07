"use client";

import React from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Skeleton } from "@/components/ui/skeleton";
import AdminMissionsTable from "@/components/admin/AdminMissionsTable";
import { useMissionsTable } from "@/hooks/useMissionsTable";

// Main skeleton component for the entire missions page - matching DashboardPage pattern
const MissionsPageSkeleton = () => (
  <div className="space-y-6">
    {/* Status Overview Skeleton - exactly like DashboardPage stats cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="bg-card rounded-2xl p-6 shadow-sm border border-border hover:shadow-md transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-muted">
                <Skeleton className="w-6 h-6" />
              </div>
              <div>
                <Skeleton className="h-4 w-16 mb-2" />
                <Skeleton className="h-8 w-8" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>

    {/* Table Controls Skeleton */}
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div className="flex items-center gap-2">
        <Skeleton className="h-10 w-32" /> {/* Add Mission Button */}
      </div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
        <div className="flex items-center space-x-2">
          <Skeleton className="h-5 w-48" /> {/* Showing text */}
        </div>
        <div className="flex items-center space-x-2">
          <Skeleton className="h-5 w-12" /> {/* Show text */}
          <Skeleton className="h-8 w-20" /> {/* Items per page select */}
          <Skeleton className="h-8 w-20" /> {/* View button */}
        </div>
      </div>
    </div>

    {/* Table Skeleton */}
    <div className="overflow-x-auto">
      <div className="rounded-md border border-border">
        {/* Table Header */}
        <div className="border-b border-border">
          <div className="flex items-center p-4 gap-4">
            <Skeleton className="h-4 w-8" /> {/* ID */}
            <Skeleton className="h-4 w-32" /> {/* Title */}
            <Skeleton className="h-4 w-16" /> {/* Type */}
            <Skeleton className="h-4 w-20" /> {/* Platform */}
            <Skeleton className="h-4 w-16" /> {/* Status */}
            <Skeleton className="h-4 w-16" /> {/* Reward */}
            <Skeleton className="h-4 w-20" /> {/* Partner */}
            <Skeleton className="h-4 w-24" /> {/* Start Date */}
            <Skeleton className="h-4 w-24" /> {/* End Date */}
            <Skeleton className="h-4 w-16" /> {/* Actions */}
          </div>
        </div>

        {/* Table Rows */}
        <div className="divide-y divide-border">
          {Array.from({ length: 10 }).map((_, rowIndex) => (
            <div key={rowIndex} className="flex items-center p-4 gap-4 hover:bg-muted/50">
              <Skeleton className="h-4 w-8" /> {/* ID */}
              <div className="w-32 space-y-1">
                <Skeleton className="h-4 w-28" /> {/* Title */}
                <Skeleton className="h-3 w-20" /> {/* Description */}
              </div>
              <Skeleton className="h-6 w-16 rounded-full" /> {/* Type badge */}
              <Skeleton className="h-4 w-20" /> {/* Platform */}
              <Skeleton className="h-6 w-16 rounded-full" /> {/* Status badge */}
              <Skeleton className="h-4 w-16" /> {/* Reward */}
              <Skeleton className="h-4 w-20" /> {/* Partner */}
              <Skeleton className="h-4 w-24" /> {/* Start Date */}
              <Skeleton className="h-4 w-24" /> {/* End Date */}
              <div className="flex items-center space-x-1">
                <Skeleton className="h-6 w-6 rounded" />
                <Skeleton className="h-6 w-6 rounded" />
                <Skeleton className="h-6 w-6 rounded" />
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Skeleton */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t border-border">
          <Skeleton className="h-5 w-32" /> {/* Page info */}
          <div className="flex items-center space-x-1">
            {Array.from({ length: 7 }).map((_, index) => (
              <Skeleton key={index} className="h-8 w-8 rounded" />
            ))}
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Main page component - exactly following DashboardPage pattern
const MissionsPage = () => {
  // ✅ ใช้ isLoading จาก useMissionsTable เป็น source of truth เดียว
  const { isLoading } = useMissionsTable();

  // ✅ แสดง skeleton เมื่อ isLoading = true เหมือน DashboardPage
  if (isLoading) {
    return (
      <AdminLayout>
        <MissionsPageSkeleton />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <AdminMissionsTable />
    </AdminLayout>
  );
};

export default MissionsPage;
