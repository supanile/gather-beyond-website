"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { UserWithAgent } from "@/types/admin/userManagement";
import { UserAgent } from "@/types/admin/userTableTypes";
import { Badge } from "@/components/ui/badge";
import { UserAvatar } from "@/components/admin/mission-review/UserAvatar";
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
  Server as ServerIcon,
  Users as UsersIcon,
} from "lucide-react";

interface UserProfileHeaderProps {
  user: UserWithAgent;
  userAgent: UserAgent;
  totalMissions: number;
}

interface DiscordGuild {
  name: string;
  serverId: string;
  icon: string | null;
  memberCount: number;
}

interface DiscordGuildsData {
  success: boolean;
  guilds: DiscordGuild[];
  totalGuilds: number;
}

// Mock data for Discord guilds (to be replaced with actual API call later)
const mockDiscordGuilds: DiscordGuildsData = {
  success: true,
  guilds: [
    {
      name: "Fłøeт¢ıвøυ's server",
      serverId: "710813849808273478",
      icon: "https://cdn.discordapp.com/icons/710813849808273478/d4de87dd25641d07affd890ed98786bd.png",
      memberCount: 5
    },
    {
      name: "Harold's server",
      serverId: "749954850430910534",
      icon: null,
      memberCount: 5
    },
    {
      name: "Super Connector",
      serverId: "908568690033844246",
      icon: "https://cdn.discordapp.com/icons/908568690033844246/35d6d7aba59bef7102940cc0288c507d.png",
      memberCount: 2658
    },
    {
      name: "aki server",
      serverId: "989296048356851712",
      icon: null,
      memberCount: 9
    },
    {
      name: "스타이카 Staika",
      serverId: "1037957827899179009",
      icon: "https://cdn.discordapp.com/icons/1037957827899179009/aa3fc8ff36347e19ba0f160e582da9a6.png",
      memberCount: 30396
    }
  ],
  totalGuilds: 5
};

const UserProfileHeader: React.FC<UserProfileHeaderProps> = ({
  user,
  userAgent,
  totalMissions,
}) => {
  const [discordGuilds, setDiscordGuilds] = useState<DiscordGuildsData | null>(null);
  const [isLoadingGuilds, setIsLoadingGuilds] = useState(false);

  useEffect(() => {
    async function fetchDiscordGuilds() {
      if (!user.discord_id) return;

      setIsLoadingGuilds(true);
      try {
        // TODO: Replace with actual API call
        // const response = await fetch(`/api/discord/${user.discord_id}/guilds`);
        // const data = await response.json();
        
        // Using mock data for now
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
        setDiscordGuilds(mockDiscordGuilds);
      } catch (error) {
        console.error(error);
        setDiscordGuilds(null);
      } finally {
        setIsLoadingGuilds(false);
      }
    }

    fetchDiscordGuilds();
  }, [user.discord_id]);

  return (
    <div className="p-6 -my-6 -ml-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 sm:gap-4">
        <div className="flex items-center space-x-3 sm:space-x-4">
          <UserAvatar
            discordId={user.discord_id}
            username={user.username}
            size="lg"
            className="shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            clickable={true}
          />
          <div className="min-w-0 flex-1">
            <p className="text-sm sm:text-base md:text-lg font-semibold text-foreground truncate">
              {user.username || user.email}
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
              {user.credit || 0}
            </span>
            <span className="text-sm sm:text-base md:text-lg text-muted-foreground">
              {(user.credit || 0) === 1 ? "credit" : "credits"}
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
                {userAgent.created_at
                  ? formatDate(userAgent.created_at)
                  : "Unknown"}
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

      {/* Discord Servers Section */}
      <div className="mt-3 sm:mt-4 md:mt-6 pt-3 sm:pt-4 border-t border-border">
        <div className="flex items-center space-x-2 mb-3">
          <ServerIcon className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-500 dark:text-indigo-400 flex-shrink-0" />
          <span className="text-sm sm:text-base md:text-lg text-foreground font-medium">
            Discord Servers
          </span>
          {discordGuilds && (
            <Badge variant="secondary" className="text-xs">
              {discordGuilds.totalGuilds} servers
            </Badge>
          )}
        </div>
        
        {isLoadingGuilds ? (
          <div className="flex flex-wrap gap-2">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-8 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse"
                style={{ width: `${80 + Math.random() * 60}px` }}
              ></div>
            ))}
          </div>
        ) : discordGuilds?.success && discordGuilds.guilds.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {discordGuilds.guilds.map((guild) => (
              <Badge
                key={guild.serverId}
                variant="outline"
                className="text-xs bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center space-x-1">
                  {guild.icon ? (
                    <div className="relative w-4 h-4 rounded-full overflow-hidden flex-shrink-0">
                      <Image
                        src={guild.icon}
                        alt={`${guild.name} icon`}
                        fill
                        className="object-cover"
                        sizes="16px"
                      />
                    </div>
                  ) : (
                    <ServerIcon className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                  )}
                  <span className="truncate max-w-[120px]">{guild.name}</span>
                  <div className="flex items-center space-x-1 text-muted-foreground">
                    <UsersIcon className="w-3 h-3" />
                    <span className="text-xs">{guild.memberCount}</span>
                  </div>
                </div>
              </Badge>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            No Discord servers found
          </p>
        )}
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