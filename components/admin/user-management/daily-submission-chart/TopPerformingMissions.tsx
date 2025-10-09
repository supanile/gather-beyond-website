import {
  Trophy,
  CheckCircle,
  Clock,
  UserPlus,
  XCircle,
} from "lucide-react";
import { UserMission, MissionPerformance } from "@/types/admin/user-missions";
import { RankIcon } from "./RankIcon";

interface TopPerformingMissionsProps {
  topMissions: MissionPerformance[];
  userMissions: UserMission[];
}

export const TopPerformingMissions = ({ topMissions, userMissions }: TopPerformingMissionsProps) => {
  if (topMissions.length === 0) {
    return (
      <div className="text-center py-8">
        <Trophy className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground mx-auto mb-2" />
        <p className="text-sm text-muted-foreground">
          No missions found for the selected time range
        </p>
      </div>
    );
  }

  return (
    <div className="mt-6 pt-6 border-t border-border flex-shrink-0">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-500" />
        <h4 className="text-sm sm:text-base font-semibold text-foreground">
          Top Performing Missions
        </h4>
        <span className="text-xs sm:text-sm text-muted-foreground">
          (Most Submissions)
        </span>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="flex flex-col">
          <div className="max-h-96 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent">
            {topMissions.map((mission, index) => {
              const submittedCount = userMissions.filter(
                (m) =>
                  m.mission_id === mission.mission_id &&
                  m.status === "submitted"
              ).length;
              const acceptedCount = userMissions.filter(
                (m) =>
                  m.mission_id === mission.mission_id &&
                  m.status === "accepted"
              ).length;
              const rejectedCount = userMissions.filter(
                (m) =>
                  m.mission_id === mission.mission_id &&
                  m.status === "rejected"
              ).length;

              return (
                <div
                  key={mission.mission_id}
                  className="bg-gradient-to-r from-card to-card/50 border border-border/50 rounded-xl hover:shadow-lg hover:border-primary/30 transition-all duration-300 p-4 sm:p-5"
                >
                  {/* Mission Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg">
                        <RankIcon index={index} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-foreground truncate text-sm sm:text-base">
                          {mission.mission_name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          ID: {mission.mission_id} • {mission.uniqueUsers} Users
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm sm:text-base font-bold text-foreground">
                          {mission.totalSubmissions}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          submissions
                        </span>
                      </div>
                      <div
                        className={`text-xs font-medium px-2 py-1 rounded-full ${
                          mission.completionRate >= 80
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300"
                            : mission.completionRate >= 60
                            ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300"
                            : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300"
                        }`}
                      >
                        {mission.completionRate}%
                      </div>
                    </div>
                  </div>

                  {/* Status Overview Grid */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 border border-green-200/50 dark:border-green-800/50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                          <span className="text-xs font-medium text-green-700 dark:text-green-300">
                            Completed
                          </span>
                        </div>
                        <span className="text-sm font-bold text-green-800 dark:text-green-200">
                          {mission.completedSubmissions}
                        </span>
                      </div>
                    </div>

                    <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-3 border border-orange-200/50 dark:border-orange-800/50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                          <span className="text-xs font-medium text-orange-700 dark:text-orange-300">
                            Submitted
                          </span>
                        </div>
                        <span className="text-sm font-bold text-orange-800 dark:text-orange-200">
                          {submittedCount}
                        </span>
                      </div>
                    </div>

                    <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-3 border border-yellow-200/50 dark:border-yellow-800/50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <UserPlus className="w-4 h-4 text-yellow-600 dark:text-yellow-400" />
                          <span className="text-xs font-medium text-yellow-700 dark:text-yellow-300">
                            Accepted
                          </span>
                        </div>
                        <span className="text-sm font-bold text-yellow-800 dark:text-yellow-200">
                          {acceptedCount}
                        </span>
                      </div>
                    </div>

                    <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3 border border-red-200/50 dark:border-red-800/50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <XCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                          <span className="text-xs font-medium text-red-700 dark:text-red-300">
                            Rejected
                          </span>
                        </div>
                        <span className="text-sm font-bold text-red-800 dark:text-red-200">
                          {rejectedCount}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
