"use client";

import { Card, CardContent } from "@/components/ui/card";
import { MissionReviewStats } from "@/types/admin/missionReview";
import { 
  FileText, 
  Clock, 
  CheckCircle, 
  XCircle,
  TrendingUp
} from "lucide-react";

interface MissionReviewStatsProps {
  stats: MissionReviewStats;
}

export function MissionReviewStatsComponent({ stats }: MissionReviewStatsProps) {
  const completionRate = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;

  const statItems = [
    {
      title: "Total Reviews",
      value: stats.total,
      icon: FileText,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-100 dark:bg-blue-900/20",
    },
    {
      title: "Summited",
      value: stats.submitted,
      icon: Clock,
      color: "text-yellow-600 dark:text-yellow-400",
      bgColor: "bg-yellow-100 dark:bg-yellow-900/20",
    },
    {
      title: "Completed",
      value: stats.completed,
      icon: CheckCircle,
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-100 dark:bg-green-900/20",
    },
    {
      title: "Rejected",
      value: stats.rejected,
      icon: XCircle,
      color: "text-red-600 dark:text-red-400",
      bgColor: "bg-red-100 dark:bg-red-900/20",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {statItems.map((item) => (
        <Card key={item.title} className="transition-all hover:shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${item.bgColor}`}>
                <item.icon className={`w-5 h-5 ${item.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 truncate">
                  {item.title}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {item.value.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Completion Rate Card */}
      <Card className="transition-all hover:shadow-lg">
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/20">
              <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 truncate">
                Completion Rate
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {completionRate.toFixed(1)}%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
