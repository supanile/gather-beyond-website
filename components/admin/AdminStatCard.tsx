import { StatCardProps } from "@/types/admin/adminTypes";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

const AdminStatCard = ({
  title,
  value,
  icon: Icon,
  growth,
  isPositive = true,
}: StatCardProps) => (
  <div className="bg-card rounded-2xl p-6 shadow-sm border border-border hover:shadow-md transition-all duration-300 hover:border-primary/20">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-foreground mb-1">{title}</p>
        <p className="text-2xl font-bold text-foreground">{value}</p>
        {growth && (
          <div
            className={`flex items-center mt-2 text-sm font-medium ${
              isPositive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
            }`}
          >
            {isPositive ? (
              <ArrowUpRight className="w-4 h-4 mr-1" />
            ) : (
              <ArrowDownRight className="w-4 h-4 mr-1" />
            )}
            {growth}%
          </div>
        )}
      </div>
      <div
        className={`p-3 rounded-full ${
          isPositive ? "bg-primary/10 dark:bg-primary/20" : "bg-destructive/10 dark:bg-destructive/20"
        }`}
      >
        <Icon
          className={`w-6 h-6 ${isPositive ? "text-primary dark:text-primary" : "text-destructive dark:text-destructive"}`}
        />
      </div>
    </div>
  </div>
);

export default AdminStatCard;