import { Activity, TrendingUp, TrendingDown } from "lucide-react";
import { useState } from "react";

interface User {
  agent?: {
    last_active?: number;
  };
}

interface ActiveUsersCardProps {
  users: User[];
}

interface TimeRangeData {
  label: string;
  days: number;
  shortLabel: string;
}

const timeRanges: TimeRangeData[] = [
  { label: "7 days", days: 7, shortLabel: "7d" },
  { label: "14 days", days: 14, shortLabel: "14d" },
  { label: "30 days", days: 30, shortLabel: "30d" },
  { label: "60 days", days: 60, shortLabel: "60d" },
];

const ActiveUsersCard = ({ users }: ActiveUsersCardProps) => {
  const [selectedRange, setSelectedRange] = useState(0); // Default to 7 days

  const getActiveUsersInDays = (days: number) => {
    const daysAgo = Date.now() - days * 24 * 60 * 60 * 1000;
    return users.filter((user) => {
      const lastActive = user.agent?.last_active;
      return lastActive && lastActive > daysAgo;
    }).length;
  };

  // Mock data for demonstration (สามารถเปลี่ยนค่าได้ตามต้องการ)
  const mockActiveUsers = [180, 140, 20, 20]; // สำหรับ 7d, 14d, 30d, 60d ตามลำดับ
  const useMockData = true; // เปลี่ยนเป็น true เพื่อใช้ mock data

  const currentActiveUsers = useMockData 
    ? mockActiveUsers[selectedRange] 
    : getActiveUsersInDays(timeRanges[selectedRange].days);
  const previousRangeIndex = Math.min(selectedRange + 1, timeRanges.length - 1);
  const previousActiveUsers = useMockData 
    ? mockActiveUsers[previousRangeIndex] 
    : getActiveUsersInDays(timeRanges[previousRangeIndex].days);

  // Calculate growth percentage (comparing with next longer period)
  const growthPercentage =
    previousActiveUsers > 0
      ? Math.round(
          ((currentActiveUsers - previousActiveUsers) / previousActiveUsers) *
            100
        )
      : 0;

  const isPositiveGrowth = growthPercentage >= 0;
  
  // For 60d, show activity rate instead of growth
  const totalUsers = users.length;
  const activeRate = totalUsers > 0 ? Math.round((currentActiveUsers / totalUsers) * 100) : 0;

  return (
    <div className="bg-card rounded-2xl p-6 shadow-sm border border-border hover:shadow-md transition-all duration-300 hover:border-primary/20">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <p className="text-sm font-medium text-foreground">Active Users</p>
            
            {/* Growth indicator with AdminStatCard style */}
            {selectedRange < timeRanges.length - 1 ? (
              <div
                className={`flex items-center text-sm font-medium ${
                  isPositiveGrowth
                    ? "text-green-600 dark:text-green-300"
                    : "text-red-600 dark:text-red-300"
                }`}
              >
                {isPositiveGrowth ? (
                  <TrendingUp className="w-4 h-4 mr-1" />
                ) : (
                  <TrendingDown className="w-4 h-4 mr-1" />
                )}
                {Math.abs(growthPercentage)}% vs {timeRanges[previousRangeIndex].shortLabel}
              </div>
            ) : (
              <div className="flex items-center text-sm font-medium text-blue-600 dark:text-blue-300">
                <Activity className="w-4 h-4 mr-1" />
                {activeRate}% active rate
              </div>
            )}
          </div>
          
          <p className="text-2xl font-bold text-foreground">
            {currentActiveUsers.toLocaleString()}
          </p>
          
          {/* Compact Time Range Selector */}
          <div className="flex items-center gap-1 bg-muted/50 rounded-lg p-1 mt-2 w-fit">
            {timeRanges.map((range, index) => (
              <button
                key={range.days}
                onClick={() => setSelectedRange(index)}
                className={`px-2 py-1 text-xs font-medium rounded-md transition-all duration-200 min-w-[28px] ${
                  selectedRange === index
                    ? "bg-foreground text-background shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-background/80"
                }`}
              >
                {range.shortLabel}
              </button>
            ))}
          </div>
        </div>
        
        {/* Icon in AdminStatCard style */}
        <div className="p-3 rounded-full bg-gray-200 dark:bg-white">
          <Activity className="w-6 h-6 text-gray-700 dark:text-gray-900" />
        </div>
      </div>
    </div>
  );
};

export default ActiveUsersCard;
