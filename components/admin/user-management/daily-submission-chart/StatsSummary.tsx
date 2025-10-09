import {
  Send,
  UserPlus,
  Clock,
  CheckCircle,
  XCircle,
  Users,
  Activity,
} from "lucide-react";

interface StatsSummaryProps {
  totalSubmissions: number;
  totalAccepted: number;
  totalSubmitted: number;
  totalCompleted: number;
  totalRejected: number;
  avgDaily: number;
  totalUniqueUsers: number;
}

export const StatsSummary = ({
  totalSubmissions,
  totalAccepted,
  totalSubmitted,
  totalCompleted,
  totalRejected,
  avgDaily,
  totalUniqueUsers,
}: StatsSummaryProps) => {
  return (
    <div className="mt-6 pt-6 border-t border-border flex-shrink-0">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2 sm:gap-4">
        <div className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3">
          <div className="p-1.5 sm:p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
            <Send className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs text-muted-foreground font-medium truncate">
              Total Submissions
            </p>
            <p className="text-sm sm:text-lg font-bold text-foreground">
              {totalSubmissions.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3">
          <div className="p-1.5 sm:p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
            <UserPlus className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600 dark:text-yellow-400" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs text-muted-foreground font-medium truncate">
              Accepted
            </p>
            <p className="text-sm sm:text-lg font-bold text-foreground">
              {totalAccepted.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3">
          <div className="p-1.5 sm:p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
            <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600 dark:text-orange-400" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs text-muted-foreground font-medium truncate">
              Submitted
            </p>
            <p className="text-sm sm:text-lg font-bold text-foreground">
              {totalSubmitted.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3">
          <div className="p-1.5 sm:p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
            <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 dark:text-green-400" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs text-muted-foreground font-medium truncate">
              Completed
            </p>
            <p className="text-sm sm:text-lg font-bold text-foreground">
              {totalCompleted.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3">
          <div className="p-1.5 sm:p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
            <XCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-600 dark:text-red-400" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs text-muted-foreground font-medium truncate">
              Rejected
            </p>
            <p className="text-sm sm:text-lg font-bold text-foreground">
              {totalRejected.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3">
          <div className="p-1.5 sm:p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
            <Users className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs text-muted-foreground font-medium truncate">
              Daily Average
            </p>
            <p className="text-sm sm:text-lg font-bold text-foreground">
              {avgDaily}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3">
          <div className="p-1.5 sm:p-2 bg-indigo-100 dark:bg-indigo-900/20 rounded-lg">
            <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs text-muted-foreground font-medium truncate">
              Unique Users
            </p>
            <p className="text-sm sm:text-lg font-bold text-foreground">
              {totalUniqueUsers}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
