import { HelpCircle } from "lucide-react";

interface PlatformBadgeProps {
  platform: string | null | undefined;
}

// iOS Logo Component
const AppleIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
  </svg>
);

// Android Logo Component
const AndroidIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.6 9.48l1.84-3.18c.16-.31.04-.69-.26-.85-.29-.15-.65-.06-.83.22l-1.88 3.24c-2.86-1.21-6.08-1.21-8.94 0L5.65 5.67c-.19-.28-.54-.37-.83-.22-.3.16-.42.54-.26.85l1.84 3.18C4.08 11.18 2.5 14.02 2.5 17h19c0-2.98-1.58-5.82-3.9-7.52zM7 15.25c-.69 0-1.25-.56-1.25-1.25s.56-1.25 1.25-1.25 1.25.56 1.25 1.25-.56 1.25-1.25 1.25zm10 0c-.69 0-1.25-.56-1.25-1.25s.56-1.25 1.25-1.25 1.25.56 1.25 1.25-.56 1.25-1.25 1.25z"/>
  </svg>
);

export function PlatformBadge({ platform }: PlatformBadgeProps) {
  const getPlatformConfig = (platform: string | null | undefined) => {
    if (!platform) {
      return {
        icon: <HelpCircle className="w-5 h-5" />,
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
          icon: <AppleIcon className="w-5 h-5" />,
          label: "iOS",
          gradient: "from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30",
          border: "border-blue-200 dark:border-blue-700",
          iconColor: "text-blue-600 dark:text-blue-400",
          textColor: "text-blue-700 dark:text-blue-300",
        };
      case "android":
        return {
          icon: <AndroidIcon className="w-5 h-5" />,
          label: "Android",
          gradient: "from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30",
          border: "border-green-200 dark:border-green-700",
          iconColor: "text-green-600 dark:text-green-400",
          textColor: "text-green-700 dark:text-green-300",
        };
      default:
        return {
          icon: <HelpCircle className="w-5 h-5" />,
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