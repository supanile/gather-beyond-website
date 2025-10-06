"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Stats Skeleton Component
export function MissionReviewStatsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="transition-all hover:shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
                <Skeleton className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <Skeleton className="h-4 w-20 mb-2" />
                <Skeleton className="h-6 w-12" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Filters Skeleton Component
export function MissionReviewFiltersSkeleton() {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Status Filter Skeleton */}
          <div className="flex-1 min-w-48">
            <Skeleton className="h-10 w-full" />
          </div>

          {/* Search Input Skeleton */}
          <div className="flex-1 min-w-64">
            <Skeleton className="h-10 w-full" />
          </div>

          {/* Clear Button Skeleton */}
          <Skeleton className="h-10 w-24" />
        </div>
      </CardContent>
    </Card>
  );
}

// Table Controls Skeleton Component
export function MissionReviewTableControlsSkeleton() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div></div> {/* Empty div for spacing */}
      <div className="flex items-center gap-2">
        {/* View Button Skeleton */}
        <Skeleton className="h-7 w-16 sm:h-8 sm:w-16" />
      </div>
    </div>
  );
}

// Table Skeleton Component
export function MissionReviewTableSkeleton() {
  return (
    <div className="rounded-md border border-border">
      <Table className="table-fixed w-full">
        <TableHeader>
          <TableRow>
            <TableHead className="w-10 font-medium px-4 text-xs">
              <Skeleton className="h-4 w-8" />
            </TableHead>
            <TableHead className="w-16 font-medium px-6 text-xs">
              <Skeleton className="h-4 w-8" />
            </TableHead>
            <TableHead className="w-26 font-medium px-3 text-xs">
              <Skeleton className="h-4 w-12" />
            </TableHead>
            <TableHead className="w-48 font-medium px-3 text-xs">
              <Skeleton className="h-4 w-12" />
            </TableHead>
            <TableHead className="w-24 font-medium px-5 text-xs">
              <Skeleton className="h-4 w-10" />
            </TableHead>
            <TableHead className="w-48 font-medium px-3 text-xs">
              <Skeleton className="h-4 w-20" />
            </TableHead>
            <TableHead className="w-28 px-0 text-xs">
              <Skeleton className="h-4 w-12" />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 8 }).map((_, i) => (
            <TableRow key={i}>
              <TableCell className="px-4">
                <Skeleton className="h-4 w-12" />
              </TableCell>
              <TableCell className="px-5">
                <Skeleton className="h-8 w-8 rounded-full" />
              </TableCell>
              <TableCell className="px-3">
                <Skeleton className="h-4 w-20" />
              </TableCell>
              <TableCell className="px-3">
                <div className="space-y-1">
                  <Skeleton className="h-3 w-32" />
                </div>
              </TableCell>
              <TableCell className="px-5">
                <Skeleton className="h-5 w-16 rounded-full" />
              </TableCell>
              <TableCell className="px-3">
                <Skeleton className="h-3 w-28" />
              </TableCell>
              <TableCell className="px-0">
                <div className="flex items-center space-x-1">
                  <Skeleton className="h-7 w-7 rounded" />
                  <Skeleton className="h-7 w-7 rounded" />
                  <Skeleton className="h-7 w-7 rounded" />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

// Complete Page Skeleton Component
export function MissionReviewPageSkeleton() {
  return (
    <div className="space-y-6">
      {/* Stats Skeleton */}
      <MissionReviewStatsSkeleton />

      {/* Filters Skeleton */}
      <MissionReviewFiltersSkeleton />

      {/* Table Section Skeleton */}
      <div className="space-y-4">
        {/* Table Controls Skeleton */}
        <MissionReviewTableControlsSkeleton />

        {/* Table Skeleton */}
        <div className="overflow-x-auto">
          <MissionReviewTableSkeleton />
        </div>
      </div>
    </div>
  );
}