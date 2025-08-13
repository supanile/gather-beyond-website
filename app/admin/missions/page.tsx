"use client";

import React from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Skeleton } from "@/components/ui/skeleton";
import AdminMissionsTable from "@/components/admin/AdminMissionsTable";
import { useMissionsTable } from "@/hooks/useMissionsTable";

// Main skeleton component for the entire missions page
const MissionsPageSkeleton = () => (
  <div className="space-y-6">
    {/* Status Overview Skeleton */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 3 }).map((_, index) => (
        <div
          key={index}
          className="bg-card rounded-2xl p-6 shadow-lg border border-border/50 backdrop-blur-sm hover:shadow-xl hover:scale-[1.02] transition-all duration-300 relative overflow-hidden"
        >
          {/* Background gradient overlay skeleton */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0" />

          {/* Main content skeleton */}
          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {/* Icon skeleton with enhanced styling matching StatusCard */}
                <div className="p-4 rounded-xl bg-muted shadow-lg backdrop-blur-sm border border-white/20">
                  <Skeleton className="w-8 h-8" />
                </div>

                {/* Text content skeleton */}
                <div className="ml-3 space-y-2">
                  <Skeleton className="h-4 w-20" /> {/* Status text */}
                  <Skeleton className="h-10 w-12" /> {/* Count number */}
                </div>
              </div>

              {/* Filter indicator section skeleton */}
              <div className="flex flex-col items-center justify-center space-y-2 min-w-0">
                {/* Filter icon skeleton */}
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 border border-white/20 backdrop-blur-sm">
                  <Skeleton className="w-4 h-4" />
                </div>
                
                {/* Click to filter text skeleton */}
                <div className="flex items-center space-x-1 opacity-60">
                  <Skeleton className="h-3 w-16" />
                  <Skeleton className="w-3 h-3" />
                </div>
              </div>
            </div>

            {/* Bottom subtle line indicator skeleton */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0" />
          </div>
        </div>
      ))}
    </div>

    {/* Table Controls Skeleton */}
    <div className="space-y-4">
      {/* Row 1: Add Mission Button */}
      <div className="flex items-center gap-2">
        <Skeleton className="h-10 w-32" /> {/* Add Mission Button */}
      </div>

      {/* Row 2: Search + Filters + Controls */}
      <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
        {/* Left Side: Search + Active Filters */}
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          {/* Search Input Skeleton */}
          <div className="relative flex-1 max-w-xl lg:max-w-3xl xl:max-w-3xl">
            <Skeleton className="h-10 w-full" /> {/* Search Input */}
          </div>

          {/* Active Filters Skeleton */}
          <div className="flex items-center gap-2 flex-wrap">
            <Skeleton className="h-6 w-20 rounded-md" /> {/* Filter badge */}
            <Skeleton className="h-6 w-24 rounded-md" /> {/* Filter badge */}
          </div>
        </div>

        {/* Right Side: Controls */}
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
    </div>

    {/* Table Skeleton */}
    <div className="w-full">
      <div className="rounded-md border border-border">
        <div className="overflow-x-auto">
          <table className="table-fixed w-full">
            {/* Table Header */}
            <thead>
              <tr className="border-b border-border">
                <th className="w-16 px-1 py-3 text-left">
                  <Skeleton className="h-4 w-8" />
                </th>
                <th className="w-48 px-0 py-3 text-left">
                  <Skeleton className="h-4 w-12" />
                </th>
                <th className="w-20 px-0 py-3 text-left">
                  <Skeleton className="h-4 w-10" />
                </th>
                <th className="w-20 px-3 py-3 text-left">
                  <Skeleton className="h-4 w-16" />
                </th>
                <th className="w-20 px-2 py-3 text-left">
                  <Skeleton className="h-4 w-12" />
                </th>
                <th className="w-20 px-0 py-3 text-left">
                  <Skeleton className="h-4 w-14" />
                </th>
                <th className="w-28 px-0 py-3 text-left">
                  <Skeleton className="h-4 w-16" />
                </th>
                <th className="w-32 px-0 py-3 text-left">
                  <Skeleton className="h-4 w-20" />
                </th>
                <th className="w-32 px-0 py-3 text-left">
                  <Skeleton className="h-4 w-18" />
                </th>
                <th className="w-28 px-0 py-3 text-left">
                  <Skeleton className="h-4 w-16" />
                </th>
              </tr>
            </thead>
            
            {/* Table Body */}
            <tbody className="divide-y divide-border">
              {Array.from({ length: 10 }).map((_, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-muted/50">
                  {/* ID */}
                  <td className="font-medium px-4 py-3">
                    <Skeleton className="h-4 w-6" />
                  </td>
                  
                  {/* Title */}
                  <td className="px-3 py-3">
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </td>
                  
                  {/* Type */}
                  <td className="px-3 py-3">
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </td>
                  
                  {/* Platform */}
                  <td className="px-3 py-3">
                    <Skeleton className="h-4 w-16" />
                  </td>
                  
                  {/* Status */}
                  <td className="px-2 py-3">
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </td>
                  
                  {/* Reward */}
                  <td className="px-3 py-3">
                    <Skeleton className="h-4 w-12" />
                  </td>
                  
                  {/* Partner */}
                  <td className="px-3 py-3">
                    <Skeleton className="h-4 w-20" />
                  </td>
                  
                  {/* Start Date */}
                  <td className="px-3 py-3">
                    <div className="space-y-1">
                      <Skeleton className="h-3 w-20" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </td>
                  
                  {/* End Date */}
                  <td className="px-3 py-3">
                    <div className="space-y-1">
                      <Skeleton className="h-3 w-20" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </td>
                  
                  {/* Actions */}
                  <td className="px-3 py-3">
                    <div className="flex items-center space-x-1">
                      <Skeleton className="h-6 w-6 rounded" />
                      <Skeleton className="h-6 w-6 rounded" />
                      <Skeleton className="h-6 w-6 rounded" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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

// Main page component
const MissionsPage = () => {
  // ใช้ isLoading จาก useMissionsTable เป็น source of truth เดียว
  const { isLoading } = useMissionsTable();

  // แสดง skeleton เมื่อ isLoading = true เหมือน DashboardPage
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
