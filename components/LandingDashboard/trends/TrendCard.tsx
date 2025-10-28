import React from "react";
import { TrendWithStats } from "@/types/trends";
import { formatTweetVolume } from "@/lib/utils/mockData";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, BarChart3 } from "lucide-react";

interface TrendCardProps {
  trend: TrendWithStats;
  size: {
    width: number;
    height: number;
    x: number;
    y: number;
  };
  onClick?: () => void;
  isTop3?: boolean;
  top3Rank?: number;
  onTrendClick?: (trend: TrendWithStats) => void; // เพิ่ม prop นี้
}

const TrendCard: React.FC<TrendCardProps> = ({
  trend,
  size,
  onClick,
  isTop3 = false,
  top3Rank,
  onTrendClick, // รับ prop
}) => {
  const getColorByCategory = (
    category: string,
    volume: number | null,
    volumeChange?: number
  ) => {
    if (volume === null) return "bg-muted/60 backdrop-blur-sm";

    if (trend.id === "others") {
      return "bg-gradient-to-br from-gray-800/90 to-gray-900/90 backdrop-blur-sm";
    }

    const change = volumeChange || 0;

    if (change > 10) {
      return "bg-gradient-to-br from-green-600/90 to-green-700/95 backdrop-blur-sm";
    } else if (change > 1) {
      return "bg-gradient-to-br from-green-400/85 to-green-500/90 backdrop-blur-sm";
    } else if (change >= -10) {
      return "bg-gradient-to-br from-red-400/85 to-red-500/90 backdrop-blur-sm";
    } else {
      return "bg-gradient-to-br from-red-600/90 to-red-700/95 backdrop-blur-sm";
    }
  };

  const getTrendIcon = () => {
    if (trend.volume_change_24h === undefined)
      return <BarChart3 className="w-3 h-3 text-white/70" />;
    if (trend.volume_change_24h > 0)
      return <TrendingUp className="w-3 h-3 text-green-300" />;
    if (trend.volume_change_24h < 0)
      return <TrendingDown className="w-3 h-3 text-red-300" />;
    return <BarChart3 className="w-3 h-3 text-white/70" />;
  };

  const handleClick = () => {
    console.log("TrendCard clicked:", trend.name, trend.id);

    if (trend.id === "others") {
      // ให้ onClick จัดการกับ "others" card
      if (onClick) {
        onClick();
      }
    } else {
      // สำหรับ trend ปกติ เรียก onTrendClick
      if (onTrendClick) {
        console.log("Calling onTrendClick for:", trend.name);
        onTrendClick(trend);
      }
    }
  };

  const avgDimension = (size.width + size.height) / 2;
  const baseFontSize = Math.max(8, Math.min(20, avgDimension / 8));

  let rankScale = 1;
  if (trend.rank <= 5) {
    rankScale = 1.1;
  } else if (trend.rank <= 15) {
    rankScale = 1.0;
  } else if (trend.rank <= 35) {
    rankScale = 0.95;
  } else if (trend.rank <= 60) {
    rankScale = 0.9;
  } else {
    rankScale = 0.85;
  }

  const fontSize = baseFontSize * rankScale;
  const padding = Math.max(3, Math.min(12, avgDimension / 20));
  const isXSmall = size.width < 60 || size.height < 40;
  const isSmall = size.width < 100 || size.height < 60;
  const isMedium = size.width < 140 || size.height < 80;

  return (
    <div
      className={`absolute cursor-pointer transition-all duration-200 group overflow-hidden rounded-sm ${getColorByCategory(
        trend.category,
        trend.tweet_volume,
        trend.volume_change_24h
      )}`}
      style={{
        left: size.x + 1,
        top: size.y + 1,
        width: size.width - 2,
        height: size.height - 2,
        fontSize: `${fontSize}px`,
        padding: `${padding}px`,
        zIndex: isTop3 ? 10 : 1,
        minWidth: "40px",
        minHeight: "30px",
        opacity: 0.8,
        outline: isTop3 ? "2px solid #FDE047" : "2px solid transparent",
        outlineOffset: "1px",
        boxShadow: isTop3 ? "0 0 15px rgba(253, 224, 71, 0.4)" : "none",
      }}
      onClick={handleClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.zIndex = "50";
        e.currentTarget.style.opacity = "1";
        if (!isTop3) {
          e.currentTarget.style.outline = "2px solid #FDE69F";
          e.currentTarget.style.outlineOffset = "1px";
        } else {
          e.currentTarget.style.boxShadow = "0 0 20px rgba(253, 224, 71, 0.6)";
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.zIndex = isTop3 ? "10" : "1";
        e.currentTarget.style.opacity = "0.8";
        if (!isTop3) {
          e.currentTarget.style.outline = "2px solid transparent";
          e.currentTarget.style.outlineOffset = "1px";
        } else {
          e.currentTarget.style.boxShadow = "0 0 15px rgba(253, 224, 71, 0.4)";
        }
      }}
      title={
        trend.id === "others"
          ? "Click to view more trends"
          : `${trend.name} - Rank #${trend.rank} - ${formatTweetVolume(
              trend.tweet_volume
            )} searches${
              trend.volume_change_24h !== undefined
                ? ` (${
                    trend.volume_change_24h > 0 ? "+" : ""
                  }${trend.volume_change_24h.toFixed(1)}%)`
                : ""
            }`
      }
    >
      <div className="flex flex-col h-full justify-between relative">
        {isTop3 && top3Rank && (
          <div className="absolute top-1 right-1 z-20">
            <div
              className={`flex items-center justify-center font-black rounded-full shadow-lg border-2 ${
                top3Rank === 1
                  ? "bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 text-yellow-900 border-yellow-300"
                  : top3Rank === 2
                  ? "bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500 text-gray-800 border-gray-200"
                  : "bg-gradient-to-br from-orange-400 via-orange-500 to-orange-600 text-orange-900 border-orange-300"
              }`}
              style={{
                width: `${Math.max(20, fontSize * 1.4)}px`,
                height: `${Math.max(20, fontSize * 1.4)}px`,
                fontSize: `${Math.max(10, fontSize * 0.8)}px`,
                boxShadow:
                  top3Rank === 1
                    ? "0 0 15px rgba(251, 191, 36, 0.7), inset 0 1px 3px rgba(255, 255, 255, 0.4)"
                    : top3Rank === 2
                    ? "0 0 12px rgba(156, 163, 175, 0.6), inset 0 1px 3px rgba(255, 255, 255, 0.3)"
                    : "0 0 12px rgba(251, 146, 60, 0.6), inset 0 1px 3px rgba(255, 255, 255, 0.3)",
                textShadow: "0 1px 1px rgba(0, 0, 0, 0.3)",
                transform: top3Rank === 1 ? "scale(1.1)" : "scale(1)",
              }}
            >
              {top3Rank}
            </div>
          </div>
        )}

        <div className="flex items-start justify-between relative z-10 min-h-0">
          {trend.id !== "others" && (
            <div className="flex-1 min-w-0 overflow-hidden">
              <h3
                className={`font-bold text-white leading-tight group-hover:text-yellow-200 transition-colors flex-1`}
                style={{
                  display: "-webkit-box",
                  WebkitLineClamp: isXSmall ? 1 : isMedium ? 2 : 3,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  textShadow: "0 1px 2px rgba(0,0,0,0.5)",
                  fontSize: `${fontSize * 1}px`,
                }}
              >
                {(() => {
                  // คำนวณจำนวนตัวอักษรที่แสดงได้ตามขนาดพื้นที่
                  let maxChars = 6; // ค่าเริ่มต้น
                  
                  if (!isXSmall && !isSmall) {
                    // พื้นที่ใหญ่ - แสดงได้มากขึ้น
                    maxChars = Math.min(9, Math.floor(size.width / (fontSize * 0.6)));
                  } else if (!isXSmall) {
                    // พื้นที่ปานกลาง
                    maxChars = Math.min(6, Math.floor(size.width / (fontSize * 0.7)));
                  } else {
                    // พื้นที่เล็ก - ใช้ค่าเริ่มต้น
                    maxChars = 6;
                  }
                  
                  return trend.name.length > maxChars
                    ? `${trend.name.substring(0, maxChars)}...`
                    : trend.name;
                })()}
              </h3>
            </div>
          )}
        </div>

        {trend.id !== "others" && (
          <div
            className={`absolute ${
              isTop3 ? "top-8 right-1" : "-top-1 right-1"
            } z-15`}
          >
            <Badge
              variant="secondary"
              className={
                isTop3
                  ? "bg-yellow-400/90 text-yellow-900 border-yellow-500 font-bold leading-none backdrop-blur-sm"
                  : "bg-white/20 text-white border-white/30 font-bold leading-none backdrop-blur-sm"
              }
              style={{
                fontSize: `${fontSize * 0.5}px`,
                padding: `${Math.max(1, fontSize * 0.06)}px ${Math.max(
                  2,
                  fontSize * 0.1
                )}px`,
                height: "auto",
                boxShadow: isTop3 ? "0 0 8px rgba(251, 191, 36, 0.5)" : "none",
              }}
            >
              #{trend.rank}
            </Badge>
          </div>
        )}

        <div className="flex-1 flex flex-col justify-center relative z-10 min-h-0">
          <div className={`${isXSmall ? "space-y-0" : "space-y-0.5"}`}>
            {trend.id === "others" ? (
              <div className="text-center flex items-center justify-center h-full">
                <div
                  className="font-bold text-white leading-tight"
                  style={{
                    textShadow: "0 1px 2px rgba(0,0,0,0.5)",
                    fontSize: `${fontSize}px`,
                  }}
                >
                  Others
                </div>
              </div>
            ) : (
              <>
                <div
                  className="font-bold text-white leading-tight"
                  style={{
                    textShadow: "0 1px 2px rgba(0,0,0,0.5)",
                    fontSize: `${fontSize * 0.9}px`,
                  }}
                >
                  {formatTweetVolume(trend.tweet_volume)}
                </div>

                {!isXSmall && (
                  <div
                    className="text-white/70 leading-tight"
                    style={{
                      fontSize: `${fontSize * 0.65}px`,
                    }}
                  >
                    searches
                  </div>
                )}

                {!isSmall && trend.percentage > 0 && (
                  <div
                    className="text-white/60 font-medium leading-tight"
                    style={{
                      fontSize: `${fontSize * 0.6}px`,
                    }}
                  >
                    {trend.percentage.toFixed(1)}%
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {!isXSmall &&
          trend.volume_change_24h !== undefined &&
          trend.id !== "others" && (
            <div className="relative z-10">
              <div
                className={`font-bold flex items-center leading-tight ${
                  trend.volume_change_24h > 0
                    ? "text-green-300"
                    : trend.volume_change_24h < 0
                    ? "text-red-300"
                    : "text-white/70"
                }`}
                style={{
                  textShadow: "0 1px 2px rgba(0,0,0,0.5)",
                  fontSize: `${fontSize * 0.7}px`,
                }}
              >
                {!isSmall && <span className="mr-0.5">{getTrendIcon()}</span>}
                <span>
                  {trend.volume_change_24h > 0 ? "+" : ""}
                  {trend.volume_change_24h.toFixed(1)}%
                </span>
              </div>
            </div>
          )}
      </div>
    </div>
  );
};

export default TrendCard;
