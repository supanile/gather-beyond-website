import { TrendingUp } from "lucide-react";

interface CompletionRateHighlightProps {
  completionRate: number;
}

export const CompletionRateHighlight = ({ completionRate }: CompletionRateHighlightProps) => {
  return (
    <div className="bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/10 dark:to-green-800/10 rounded-lg p-3 sm:p-4 mb-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs sm:text-sm text-green-700 dark:text-green-400 font-medium">
            Completion Rate
          </p>
          <p className="text-xl sm:text-2xl font-bold text-green-800 dark:text-green-300">
            {completionRate}%
          </p>
          <p className="text-xs text-green-600 dark:text-green-500">
            Based on submitted missions in selected period
          </p>
        </div>
        <div className="p-2 sm:p-3 bg-green-200 dark:bg-green-800/30 rounded-full">
          <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-green-700 dark:text-green-400" />
        </div>
      </div>
    </div>
  );
};
