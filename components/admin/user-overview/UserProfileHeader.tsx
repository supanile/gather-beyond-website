"use client"

import React, { useEffect, useState } from "react";
import { UserWithAgent } from "@/types/admin/userManagement";
import { UserAgent } from "@/types/admin/userTableTypes";
import { Badge } from "@/components/ui/badge";
import XIcon from "@/components/ui/icons/XIcon";
import { formatDate } from "@/lib/admin/user/userTableUtils";
import {
  Award,
  Calendar,
  Send,
  Wallet,
  TrendingUp,
  User as UserIcon,
  Smile as SmileIcon,
  Heart as HeartIcon,
  Clock as ClockIcon,
  Info as InfoIcon,
  CreditCard,
} from "lucide-react";

interface UserProfileHeaderProps {
  user: UserWithAgent;
  userAgent: UserAgent;
  totalMissions: number;
}

interface DiscordData {
  username: string;
  avatarUrl: string;
}

const UserProfileHeader: React.FC<UserProfileHeaderProps> = ({
  user,
  userAgent,
  totalMissions,
}) => {
  const [discordData, setDiscordData] = useState<DiscordData | null>(null);
  const [isLoadingDiscord, setIsLoadingDiscord] = useState(false);

  useEffect(() => {
    async function fetchDiscordData() {
      if (!user.discord_id) return;
      
      setIsLoadingDiscord(true);
      try {
        const response = await fetch(`/api/discord/${user.discord_id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch Discord data");
        }
        const data = await response.json();
        setDiscordData(data);
      } catch (error) {
        console.error(error);
        setDiscordData(null);
      } finally {
        setIsLoadingDiscord(false);
      }
    }

    fetchDiscordData();
  }, [user.discord_id]);

  return (
    <div className="p-6 -my-6 -ml-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 sm:gap-4">
        <div className="flex items-center space-x-3 sm:space-x-4">
          {isLoadingDiscord ? (
            <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-gray-300 dark:bg-gray-600 rounded-full animate-pulse"></div>
          ) : discordData?.avatarUrl ? (
            <img
              src={discordData.avatarUrl}
              alt={`${discordData.username}'s avatar`}
              className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full shadow-lg"
            />
          ) : (
            <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 bg-purple-600 dark:bg-purple-500 rounded-full flex items-center justify-center text-white font-medium text-lg sm:text-xl md:text-2xl shadow-lg shadow-purple-500/25">
              {user.email.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <p className="text-sm sm:text-base md:text-lg font-semibold text-foreground truncate">
              {user.email}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              ID: {user.discord_id}
            </p>
          </div>
        </div>
        <Badge
          variant="outline"
          className="bg-gradient-to-r from-purple-50 to-blue-50 text-purple-700 dark:from-purple-900/20 dark:to-blue-900/20 dark:text-purple-300 self-start md:self-center"
        >
          <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 mr-1 my-1 sm:my-2" />
          <span className="text-xs sm:text-sm">
            {totalMissions} Total Missions
          </span>
        </Badge>
      </div>

      {/* User Details in Two Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 mt-3 sm:mt-4 md:mt-6">
        {/* Column 1 */}
        <div className="space-y-2 sm:space-y-3">
          <div className="flex items-center space-x-2">
            <Award className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 dark:text-blue-400 flex-shrink-0" />
            <span className="text-sm sm:text-base md:text-lg text-foreground font-medium">
              {user.missions_completed || 0}
            </span>
            <span className="text-sm sm:text-base md:text-lg text-muted-foreground">
              missions completed
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <CreditCard className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 dark:text-green-400 flex-shrink-0" />
            <span className="text-sm sm:text-base md:text-lg text-foreground font-medium">
              {user.total_points || 0}
            </span>
            <span className="text-sm sm:text-base md:text-lg text-muted-foreground">
              {(user.total_points || 0) === 1 ? 'credit' : 'credits'}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <InfoIcon className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500 dark:text-purple-400 flex-shrink-0" />
            <span className="text-sm sm:text-base md:text-lg text-muted-foreground">
              Interests:
            </span>
            <span className="text-sm sm:text-base md:text-lg text-foreground font-medium break-words">
              {user.interests || "Not specified"}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500 dark:text-orange-400 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <span className="text-sm sm:text-base md:text-lg text-muted-foreground">
                Joined:
              </span>
              <span className="text-sm sm:text-base md:text-lg text-foreground font-medium ml-1 break-words">
                {userAgent.created_at ? formatDate(userAgent.created_at) : "Unknown"}
              </span>
            </div>
          </div>
        </div>

        {/* Column 2 */}
        <div className="space-y-2 sm:space-y-3">
          <div className="flex items-center space-x-2">
            <UserIcon className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-500 dark:text-indigo-400 flex-shrink-0" />
            <span className="text-sm sm:text-base md:text-lg text-muted-foreground">
              Agent Level:
            </span>
            <span className="text-sm sm:text-base md:text-lg text-foreground font-medium">
              {userAgent.level}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <SmileIcon className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500 dark:text-yellow-400 flex-shrink-0" />
            <span className="text-sm sm:text-base md:text-lg text-muted-foreground">
              Agent Mood:
            </span>
            <span className="text-sm sm:text-base md:text-lg text-foreground font-medium capitalize">
              {userAgent.mood}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <HeartIcon className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 dark:text-red-400 flex-shrink-0" />
            <span className="text-sm sm:text-base md:text-lg text-muted-foreground">
              Agent Health:
            </span>
            <span className="text-sm sm:text-base md:text-lg text-foreground font-medium">
              {userAgent.health}/100
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <ClockIcon className="w-4 h-4 sm:w-5 sm:h-5 text-teal-500 dark:text-teal-400 flex-shrink-0" />
            <div className="min-w-0 flex-1">
              <span className="text-sm sm:text-base md:text-lg text-muted-foreground">
                Last Active:
              </span>
              <span className="text-sm sm:text-base md:text-lg text-foreground font-medium ml-1 break-words">
                {formatDate(userAgent.last_active)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Social Links */}
      <div className="flex flex-wrap items-center gap-3 sm:gap-4 md:gap-6 mt-3 sm:mt-4 md:mt-6 pt-3 sm:pt-4 border-t border-border">
        {user.telegram_handle && (
          <div className="flex items-center space-x-2">
            <Send className="w-4 h-4 text-blue-500 dark:text-blue-400 flex-shrink-0" />
            <span className="text-sm text-muted-foreground break-all">
              {user.telegram_handle}
            </span>
          </div>
        )}
        {user.twitter_handle && (
          <div className="flex items-center space-x-2">
            <XIcon className="w-4 h-4 text-foreground flex-shrink-0" />
            <span className="text-sm text-muted-foreground break-all">
              {user.twitter_handle}
            </span>
          </div>
        )}
        {user.wallet_address && (
          <div className="flex items-center space-x-2">
            <Wallet className="w-4 h-4 text-green-500 dark:text-green-400 flex-shrink-0" />
            <span className="text-sm text-muted-foreground break-all">
              {user.wallet_address}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfileHeader;