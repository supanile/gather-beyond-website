import { StatCardProps } from "@/types/admin/adminTypes";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";

const AdminStatCard = ({
  title,
  value,
  icon: Icon,
  growth,
  isPositive = true,
}: StatCardProps) => (
  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300 hover:border-blue-200">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        {growth && (
          <div
            className={`flex items-center mt-2 text-sm ${
              isPositive ? "text-green-600" : "text-red-600"
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
          isPositive ? "bg-blue-50" : "bg-red-50"
        }`}
      >
        <Icon
          className={`w-6 h-6 ${isPositive ? "text-blue-600" : "text-red-600"}`}
        />
      </div>
    </div>
  </div>
);

export default AdminStatCard;