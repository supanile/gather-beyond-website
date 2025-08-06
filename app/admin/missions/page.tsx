"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Dynamic import AdminMissionsTable with loading
const AdminMissionsTable = dynamic(
  () => import("@/components/admin/AdminMissionsTable"),
  {
    loading: () => <MissionsTableSkeleton />,
    ssr: false,
  }
);

// Skeleton component for status cards - matches real status cards exactly
const StatusCardsSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    {Array.from({ length: 4 }).map((_, index) => (
      <div
        key={index}
        className="bg-card rounded-2xl p-6 shadow-sm border border-border animate-pulse hover:shadow-md transition-all duration-300"
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
);

// Skeleton component for table controls - matches real controls
const TableControlsSkeleton = () => (
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
);

// Column configurations matching the real missions table exactly
const columnConfigs = [
  { key: "id", width: "w-16", label: "ID", className: "px-1" },
  { key: "title", width: "w-48", label: "Title", className: "px-0" },
  { key: "type", width: "w-20", label: "Type", className: "px-0" },
  { key: "platform", width: "w-20", label: "Platform", className: "px-3" },
  { key: "status", width: "w-20", label: "Status", className: "px-2" },
  { key: "reward", width: "w-20", label: "Reward", className: "px-0" },
  { key: "partner", width: "w-28", label: "Partner", className: "px-0" },
  { key: "startDate", width: "w-32", label: "Start Date", className: "px-0" },
  { key: "endDate", width: "w-32", label: "End Date", className: "px-0" },
  {
    key: "actions",
    width: "w-28",
    label: "Actions",
    className: "px-0",
    alwaysVisible: true,
  },
];

// Default column visibility (matching the real table)
const defaultColumnVisibility = {
  id: true,
  title: true,
  type: true,
  platform: true,
  status: true,
  reward: true,
  partner: true,
  startDate: true,
  endDate: true,
};

// Skeleton component for table header - matches real header exactly
const TableHeaderSkeleton = ({
  columnVisibility = defaultColumnVisibility,
}) => (
  <TableHeader>
    <TableRow>
      {columnConfigs.map((column) => {
        const isVisible =
          column.alwaysVisible ||
          columnVisibility[column.key as keyof typeof columnVisibility];

        if (!isVisible) return null;

        return (
          <TableHead
            key={column.key}
            className={`${column.width} ${column.className}`}
          >
            <div className="flex items-center gap-1 px-2">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-3 w-3" /> {/* Sort icon */}
            </div>
          </TableHead>
        );
      })}
    </TableRow>
  </TableHeader>
);

// Skeleton component for table rows - matches real table structure
const TableRowsSkeleton = ({
  columnVisibility = defaultColumnVisibility,
  rowCount = 10,
}) => (
  <TableBody>
    {Array.from({ length: rowCount }).map((_, rowIndex) => (
      <TableRow key={rowIndex} className="hover:bg-muted/50">
        {columnConfigs.map((column) => {
          const isVisible =
            column.alwaysVisible ||
            columnVisibility[column.key as keyof typeof columnVisibility];

          if (!isVisible) return null;

          return (
            <TableCell
              key={column.key}
              className={`${column.width} ${column.className}`}
            >
              {/* ID Column */}
              {column.key === "id" && <Skeleton className="h-4 w-8" />}

              {/* Title Column - matches real structure with title + description */}
              {column.key === "title" && (
                <div className="w-full space-y-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24 mt-1" />
                </div>
              )}

              {/* Type Column - badge style */}
              {column.key === "type" && (
                <Skeleton className="h-6 w-16 rounded-full" />
              )}

              {/* Platform Column */}
              {column.key === "platform" && <Skeleton className="h-4 w-12" />}

              {/* Status Column - badge style */}
              {column.key === "status" && (
                <Skeleton className="h-6 w-16 rounded-full" />
              )}

              {/* Reward Column */}
              {column.key === "reward" && (
                <div className="space-y-1">
                  <Skeleton className="h-4 w-12" />
                </div>
              )}

              {/* Partner Column */}
              {column.key === "partner" && <Skeleton className="h-4 w-20" />}

              {/* Date Columns - matches formatDateWithTime structure */}
              {(column.key === "startDate" || column.key === "endDate") && (
                <div className="flex flex-col space-y-1">
                  <Skeleton className="h-4 w-24" />
                </div>
              )}

              {/* Actions Column - 3 buttons */}
              {column.key === "actions" && (
                <div className="flex items-center space-x-1">
                  <Skeleton className="h-6 w-6 rounded" />
                  <Skeleton className="h-6 w-6 rounded" />
                  <Skeleton className="h-6 w-6 rounded" />
                </div>
              )}
            </TableCell>
          );
        })}
      </TableRow>
    ))}
  </TableBody>
);

// Skeleton component for pagination - matches real pagination
const PaginationSkeleton = () => (
  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t border-border">
    <div className="text-sm text-muted-foreground">
      <Skeleton className="h-5 w-32" /> {/* Page info */}
    </div>
    <div className="flex items-center space-x-1">
      {Array.from({ length: 7 }).map((_, index) => (
        <Skeleton key={index} className="h-8 w-8 rounded" />
      ))}
    </div>
  </div>
);

// Main skeleton component for the entire missions table
const MissionsTableSkeleton = ({
  columnVisibility = defaultColumnVisibility,
  showStatusCards = true,
  showControls = true,
  tableRowCount = 10,
}) => (
  <div className="space-y-6">
    {/* Status Overview Skeleton */}
    {showStatusCards && <StatusCardsSkeleton />}

    {/* Table Controls Skeleton */}
    {showControls && <TableControlsSkeleton />}

    {/* Table Skeleton */}
    <div className="overflow-x-auto">
      <div className="rounded-md border border-border">
        <Table className="table-fixed w-full">
          <TableHeaderSkeleton columnVisibility={columnVisibility} />
          <TableRowsSkeleton
            columnVisibility={columnVisibility}
            rowCount={tableRowCount}
          />
        </Table>
        <PaginationSkeleton />
      </div>
    </div>
  </div>
);

// Main page component with loading states - following DashboardPage pattern exactly
const MissionsPage = () => {
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [hasLoaded, setHasLoaded] = useState(false);

  useEffect(() => {
    // Only show page loading once, exactly like DashboardPage
    if (!hasLoaded) {
      const timer = setTimeout(() => {
        setIsPageLoading(false);
        setHasLoaded(true);
      }, 1500); // Match DashboardPage timing

      return () => clearTimeout(timer);
    } else {
      setIsPageLoading(false);
    }
  }, [hasLoaded]);

  // Show skeleton when page is loading or hasn't loaded yet
  if (isPageLoading || !hasLoaded) {
    return (
      <AdminLayout>
        <MissionsTableSkeleton />
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
