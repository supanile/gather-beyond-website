import React from "react";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, BarChart3, MessageSquare } from "lucide-react";
import { TrendWithStats } from "@/types/trends";

interface RedditTrendCardProps {
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
  onTrendClick?: (trend: TrendWithStats) => void;
}

const formatTweetVolume = (volume: number | null): string => {
  if (volume === null) return "N/A";
  if (volume >= 1000000) return `${(volume / 1000000).toFixed(1)}M`;
  if (volume >= 1000) return `${(volume / 1000).toFixed(1)}K`;
  return volume.toString();
};

const RedditTrendCard: React.FC<RedditTrendCardProps> = ({
  trend,
  size,
  onClick,
  isTop3 = false,
  top3Rank,
  onTrendClick,
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
    console.log("RedditTrendCard clicked:", trend.name, trend.id);

    if (trend.id === "others") {
      if (onClick) {
        onClick();
      }
    } else {
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

  // Extract Reddit-specific data
  const subreddit = (trend as TrendWithStats & { subreddit?: string }).subreddit || '';
  const comments = (trend as TrendWithStats & { comments?: number }).comments || 0;

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
          : `${trend.name} - ${subreddit} - Rank #${trend.rank} - ${formatTweetVolume(
              trend.tweet_volume
            )} upvotes${
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
              <div className="flex items-center gap-1 mb-0.5">
                {getTrendIcon()}
                {!isXSmall && subreddit && (
                  <span
                    className="text-white/80 font-medium truncate"
                    style={{ fontSize: `${fontSize * 0.5}px` }}
                  >
                    {subreddit}
                  </span>
                )}
              </div>
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
              <div className="text-center">
                <p
                  className="text-white/90 font-bold leading-tight"
                  style={{ fontSize: `${fontSize * 1.2}px` }}
                >
                  +{trend.tweet_volume || 0}
                </p>
                <p
                  className="text-white/70 leading-tight mt-1"
                  style={{ fontSize: `${fontSize * 0.8}px` }}
                >
                  More Trends
                </p>
              </div>
            ) : (
              <>
                <h3
                  className="text-white font-bold leading-tight line-clamp-2 group-hover:line-clamp-none transition-all"
                  style={{ fontSize: `${fontSize}px` }}
                >
                  {trend.name}
                </h3>
                {!isXSmall && (
                  <div className="flex items-center gap-2 mt-1">
                    <p
                      className="text-white/90 font-semibold"
                      style={{ fontSize: `${fontSize * 0.7}px` }}
                    >
                      ↑ {formatTweetVolume(trend.tweet_volume)}
                    </p>
                    {comments > 0 && (
                      <div className="flex items-center gap-0.5 text-white/70">
                        <MessageSquare
                          className="w-2.5 h-2.5"
                          style={{ fontSize: `${fontSize * 0.6}px` }}
                        />
                        <span style={{ fontSize: `${fontSize * 0.6}px` }}>
                          {formatTweetVolume(comments)}
                        </span>
                      </div>
                    )}
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
                className={`inline-flex items-center gap-0.5 px-1 py-0.5 rounded ${
                  trend.volume_change_24h > 0
                    ? "bg-green-500/30 text-green-100"
                    : trend.volume_change_24h < 0
                    ? "bg-red-500/30 text-red-100"
                    : "bg-gray-500/30 text-gray-100"
                } backdrop-blur-sm`}
                style={{ fontSize: `${fontSize * 0.65}px` }}
              >
                {trend.volume_change_24h > 0 ? (
                  <TrendingUp className="w-2 h-2" />
                ) : trend.volume_change_24h < 0 ? (
                  <TrendingDown className="w-2 h-2" />
                ) : (
                  <BarChart3 className="w-2 h-2" />
                )}
                <span className="font-bold">
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

export default RedditTrendCard;
