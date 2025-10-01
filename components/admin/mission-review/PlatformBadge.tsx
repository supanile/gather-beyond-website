import { Smartphone, HelpCircle } from "lucide-react";

interface PlatformBadgeProps {
  platform: string | null | undefined;
}

export function PlatformBadge({ platform }: PlatformBadgeProps) {
  const getPlatformConfig = (platform: string | null | undefined) => {
    if (!platform) {
      return {
        icon: <HelpCircle className="w-3.5 h-3.5" />,
        label: "Not Specified",
        gradient: "from-slate-50 to-gray-50 dark:from-slate-900/30 dark:to-gray-900/30",
        border: "border-slate-200 dark:border-slate-700",
        iconColor: "text-slate-500 dark:text-slate-400",
        textColor: "text-slate-600 dark:text-slate-300",
      };
    }

    switch (platform.toLowerCase()) {
      case "ios":
        return {
          icon: <Smartphone className="w-3.5 h-3.5" />,
          label: "iOS",
          gradient: "from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30",
          border: "border-blue-200 dark:border-blue-700",
          iconColor: "text-blue-600 dark:text-blue-400",
          textColor: "text-blue-700 dark:text-blue-300",
        };
      case "android":
        return {
          icon: <Smartphone className="w-3.5 h-3.5" />,
          label: "Android",
          gradient: "from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30",
          border: "border-green-200 dark:border-green-700",
          iconColor: "text-green-600 dark:text-green-400",
          textColor: "text-green-700 dark:text-green-300",
        };
      default:
        return {
          icon: <HelpCircle className="w-3.5 h-3.5" />,
          label: "Not Specified",
          gradient: "from-slate-50 to-gray-50 dark:from-slate-900/30 dark:to-gray-900/30",
          border: "border-slate-200 dark:border-slate-700",
          iconColor: "text-slate-500 dark:text-slate-400",
          textColor: "text-slate-600 dark:text-slate-300",
        };
    }
  };

  const config = getPlatformConfig(platform);

  return (
    <div 
      className={`flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r ${config.gradient} rounded-full border ${config.border} transition-all duration-200 hover:scale-105 hover:shadow-sm`}
    >
      <div className={config.iconColor}>
        {config.icon}
      </div>
      <span className={`text-xs font-semibold ${config.textColor}`}>
        {config.label}
      </span>
    </div>
  );
}
