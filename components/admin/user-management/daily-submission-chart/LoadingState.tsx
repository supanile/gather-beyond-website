import { Send } from "lucide-react";

export const LoadingState = () => {
  return (
    <div className="bg-card rounded-2xl p-4 sm:p-6 shadow-sm border border-border h-full flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
        <div className="flex-1">
          <div className="h-6 bg-muted rounded animate-pulse mb-2 w-48"></div>
          <div className="h-4 bg-muted rounded animate-pulse w-64"></div>
        </div>
        <div className="flex gap-2 flex-wrap">
          <div className="h-9 bg-muted rounded animate-pulse w-24"></div>
          <div className="h-9 bg-muted rounded animate-pulse w-24"></div>
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2 sm:gap-4 mb-6">
        {Array.from({ length: 7 }).map((_, i) => (
          <div key={i} className="flex items-center space-x-2">
            <div className="h-6 w-6 sm:h-8 sm:w-8 bg-muted rounded animate-pulse"></div>
            <div className="min-w-0 flex-1">
              <div className="h-3 sm:h-4 bg-muted rounded animate-pulse w-12 sm:w-16 mb-1"></div>
              <div className="h-4 sm:h-6 bg-muted rounded animate-pulse w-8 sm:w-12"></div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex-1 bg-muted rounded animate-pulse"></div>
    </div>
  );
};

export const ErrorState = ({ error }: { error: string }) => {
  return (
    <div className="bg-card rounded-2xl p-4 sm:p-6 shadow-sm border border-border h-full flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
        <div className="flex-1">
          <h3 className="text-base sm:text-lg font-semibold text-foreground flex items-center gap-3">
            <div className="p-3 rounded-full bg-gray-200 dark:bg-white">
              <Send className="w-6 h-6 text-gray-700 dark:text-gray-900" />
            </div>
            Daily Mission Submissions
          </h3>
        </div>
        <div className="p-3 rounded-full bg-gray-200 dark:bg-white self-start sm:self-center">
          <Send className="w-6 h-6 text-gray-700 dark:text-gray-900" />
        </div>
      </div>
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive text-sm">
            Error loading data: {error}
          </p>
        </div>
      </div>
    </div>
  );
};
