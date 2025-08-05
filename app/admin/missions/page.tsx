"use client";

import React, { Suspense } from "react";
import dynamic from "next/dynamic";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Dynamic import AdminMissionsTable with loading
const AdminMissionsTable = dynamic(
  () => import("@/components/admin/AdminMissionsTable"),
  {
    loading: () => <MissionsTableSkeleton />,
    ssr: false,
  }
);

// Skeleton component for status cards
const StatusCardsSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    {Array.from({ length: 4 }).map((_, index) => (
      <div
        key={index}
        className="bg-card rounded-2xl p-6 shadow-sm border border-border animate-pulse"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-muted">
              <Skeleton className="w-6 h-6" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-8 w-12" />
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

// Skeleton component for table controls
const TableControlsSkeleton = () => (
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-pulse">
    <div className="flex items-center gap-2">
      <Skeleton className="h-9 w-32" /> {/* Add Mission Button */}
    </div>
    <div className="flex items-center gap-2">
      <Skeleton className="h-5 w-48" /> {/* Showing text */}
      <Skeleton className="h-8 w-16" /> {/* Items per page select */}
      <Skeleton className="h-8 w-20" /> {/* View button */}
    </div>
  </div>
);

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

// Column configurations matching the real table
const columnConfigs = [
  { key: "id", width: "w-16", label: "ID" },
  { key: "title", width: "w-48", label: "Title" },
  { key: "type", width: "w-20", label: "Type" },
  { key: "platform", width: "w-20", label: "Platform" },
  { key: "status", width: "w-20", label: "Status" },
  { key: "reward", width: "w-20", label: "Reward" },
  { key: "partner", width: "w-28", label: "Partner" },
  { key: "startDate", width: "w-32", label: "Start Date" },
  { key: "endDate", width: "w-32", label: "End Date" },
  { key: "actions", width: "w-28", label: "Actions", alwaysVisible: true },
];

// Skeleton component for table header
const TableHeaderSkeleton = ({ columnVisibility = defaultColumnVisibility }) => (
  <TableHeader>
    <TableRow>
      {columnConfigs.map((column) => {
        const isVisible = column.alwaysVisible || columnVisibility[column.key as keyof typeof columnVisibility];
        
        if (!isVisible) return null;
        
        return (
          <TableHead key={column.key} className={`${column.width} px-0`}>
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

// Skeleton component for table rows
const TableRowsSkeleton = ({ columnVisibility = defaultColumnVisibility, rowCount = 10 }) => (
  <TableBody>
    {Array.from({ length: rowCount }).map((_, rowIndex) => (
      <TableRow key={rowIndex} className="hover:bg-muted/50 animate-pulse">
        {columnConfigs.map((column) => {
          const isVisible = column.alwaysVisible || columnVisibility[column.key as keyof typeof columnVisibility];
          
          if (!isVisible) return null;
          
          return (
            <TableCell key={column.key} className={`${column.width}`}>
              {column.key === "id" && (
                <Skeleton className="h-4 w-8" />
              )}
              {column.key === "title" && (
                <div className="space-y-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              )}
              {column.key === "type" && (
                <Skeleton className="h-6 w-16 rounded-full" />
              )}
              {column.key === "platform" && (
                <Skeleton className="h-4 w-12" />
              )}
              {column.key === "status" && (
                <Skeleton className="h-6 w-16 rounded-full" />
              )}
              {column.key === "reward" && (
                <Skeleton className="h-4 w-16" />
              )}
              {column.key === "partner" && (
                <Skeleton className="h-4 w-20" />
              )}
              {(column.key === "startDate" || column.key === "endDate") && (
                <Skeleton className="h-4 w-24" />
              )}
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

// Skeleton component for pagination
const PaginationSkeleton = () => (
  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t border-border animate-pulse">
    <Skeleton className="h-5 w-32" /> {/* Page info */}
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
  tableRowCount = 10 
}) => (
  <div className="space-y-6">
    {/* Status Overview Skeleton */}
    {showStatusCards && <StatusCardsSkeleton />}

    {/* Table Controls Skeleton */}
    {showControls && <TableControlsSkeleton />}

    {/* Table Skeleton */}
    <div className="overflow-x-auto">
      <div className="rounded-md border border-border bg-card">
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

// Alternative simple skeleton (lighter version) - ปรับปรุงให้ตรงกับโครงสร้างจริง
export const SimpleMissionsTableSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    {/* Status Cards */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i} className="rounded-2xl">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-muted">
                <Skeleton className="w-6 h-6" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-8 w-8" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>

    {/* Controls */}
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <Skeleton className="h-10 w-32" />
      <div className="flex items-center gap-2">
        <Skeleton className="h-5 w-48" />
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-8 w-20" />
      </div>
    </div>

    {/* Table */}
    <Card className="rounded-md">
      <div className="overflow-x-auto">
        <Table className="table-fixed w-full">
          <TableHeader>
            <TableRow>
              {columnConfigs.map((column) => (
                <TableHead key={column.key} className={column.width}>
                  <Skeleton className="h-4 w-12" />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 8 }).map((_, i) => (
              <TableRow key={i}>
                {columnConfigs.map((column) => (
                  <TableCell key={column.key} className={column.width}>
                    {column.key === "title" ? (
                      <div className="space-y-1">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-3 w-16" />
                      </div>
                    ) : column.key === "actions" ? (
                      <div className="flex gap-1">
                        <Skeleton className="h-6 w-6" />
                        <Skeleton className="h-6 w-6" />
                        <Skeleton className="h-6 w-6" />
                      </div>
                    ) : (
                      <Skeleton className="h-4 w-16" />
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="p-4 border-t">
        <div className="flex justify-between items-center">
          <Skeleton className="h-5 w-32" />
          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-8" />
            ))}
          </div>
        </div>
      </div>
    </Card>
  </div>
);

// Enhanced skeleton with customization options
export const CustomMissionsTableSkeleton = ({
  showStatusCards = true,
  showControls = true,
  tableRowCount = 10,
  visibleColumns = defaultColumnVisibility,
  className = ""
}) => (
  <div className={`space-y-6 ${className}`}>
    <MissionsTableSkeleton
      columnVisibility={visibleColumns}
      showStatusCards={showStatusCards}
      showControls={showControls}
      tableRowCount={tableRowCount}
    />
  </div>
);

// Main page component
const MissionsPage = () => {
  return (
    <AdminLayout>
      <Suspense fallback={<MissionsTableSkeleton />}>
        <AdminMissionsTable />
      </Suspense>
    </AdminLayout>
  );
};

export default MissionsPage;