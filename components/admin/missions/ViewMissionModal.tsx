import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Mission } from "@/types/admin/missions/missionTypes";
import {
  getStatusColor,
  parseReward,
} from "@/lib/admin/missions/missionTableUtils";
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ViewMissionModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  mission: Mission | null;
}

interface DiscordServer {
  name: string;
  serverId: string;
  icon: string | null;
  memberCount: number;
}

// Function to display date and time (same as in MissionsTable)
const formatDateWithTime = (
  dateValue: string | number | null | undefined
): string => {
  if (!dateValue) return "N/A";

  try {
    let date: Date;

    // ตรวจสอบว่าเป็น Unix timestamp (number) or ISO string
    if (typeof dateValue === "number") {
      // Unix timestamp - แปลงเป็น milliseconds
      date = new Date(dateValue * 1000);
    } else if (typeof dateValue === "string") {
      // ISO string or date string
      date = new Date(dateValue);
    } else {
      return "N/A";
    }

    if (isNaN(date.getTime())) return "N/A";

    // ใช้ local timezone (Bangkok) โดยตรง
    const options: Intl.DateTimeFormatOptions = {
      timeZone: "Asia/Bangkok",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    };

    const formatter = new Intl.DateTimeFormat("en-GB", options);
    return formatter.format(date);
  } catch (error) {
    console.error("Error formatting date with time:", error);
    return "N/A";
  }
};

export const ViewMissionModal: React.FC<ViewMissionModalProps> = ({
  isOpen,
  onOpenChange,
  mission,
}) => {
  const [discordServers, setDiscordServers] = useState<DiscordServer[]>([]);
  const [isLoadingServers, setIsLoadingServers] = useState(false);
  const [serverFetchError, setServerFetchError] = useState<string | null>(null);

  // Fetch Discord servers when modal opens
  const fetchDiscordServers = async () => {
    setIsLoadingServers(true);
    setServerFetchError(null);
    try {
      console.log("Fetching Discord servers for ViewMissionModal...");
      const response = await fetch("/api/discord/getserver");

      if (response.ok) {
        const data = await response.json();
        console.log("API Response data:", data);

        if (data.success && data.guilds && Array.isArray(data.guilds)) {
          const transformedServers: DiscordServer[] = data.guilds.map(
            (guild: {
              name: string;
              serverId: string;
              icon: string | null;
              memberCount: number;
            }) => ({
              name: guild.name,
              serverId: guild.serverId,
              icon: guild.icon,
              memberCount: guild.memberCount,
            })
          );
          console.log("Transformed servers:", transformedServers);
          setDiscordServers(transformedServers);
        } else {
          console.error("API response missing success or guilds:", data);
          setServerFetchError("API response format error");
          setDiscordServers([]);
        }
      } else {
        const errorText = await response.text();
        console.error("API request failed:", response.status, errorText);
        setServerFetchError(`Failed to fetch servers (${response.status})`);
        setDiscordServers([]);
      }
    } catch (error) {
      console.error("Error fetching Discord servers:", error);
      setServerFetchError("Network error occurred");
      setDiscordServers([]);
    } finally {
      setIsLoadingServers(false);
    }
  };

  useEffect(() => {
    if (isOpen && mission) {
      fetchDiscordServers();
    }
  }, [isOpen, mission]);

  if (!mission) return null;

  const reward = parseReward(mission.reward);

  // Parse mission targeting data if it exists
  const missionTargeting = mission.missionTargeting
    ? typeof mission.missionTargeting === "string"
      ? JSON.parse(mission.missionTargeting)
      : mission.missionTargeting
    : null;

  // Get selected Discord servers from mission targeting or serverId
  let selectedServerIds: string[] = [];

  // Priority 1: Try to get from missionTargeting.discordFilters.servers
  if (
    missionTargeting?.discordFilters?.servers &&
    Array.isArray(missionTargeting.discordFilters.servers) &&
    missionTargeting.discordFilters.servers.length > 0
  ) {
    selectedServerIds = missionTargeting.discordFilters.servers;
    console.log("Server IDs from missionTargeting:", selectedServerIds);
  }
  // Priority 2: Try to get from serverId
  else if (
    mission.serverId &&
    mission.serverId.trim() !== "" &&
    mission.serverId !== "0"
  ) {
    try {
      // Check if serverId is a JSON string array
      if (mission.serverId.startsWith("[") && mission.serverId.endsWith("]")) {
        // Parse as JSON array
        const parsedIds = JSON.parse(mission.serverId);
        if (Array.isArray(parsedIds)) {
          selectedServerIds = parsedIds.filter((id) => id && id !== "0");
        }
      } else {
        // Parse as comma-separated string
        selectedServerIds = mission.serverId
          .split(",")
          .map((id) => id.trim().replace(/^["']|["']$/g, "")) // Remove quotes
          .filter((id) => id !== "" && id !== "0");
      }
      console.log("Server IDs from mission.serverId:", selectedServerIds);
    } catch (error) {
      console.error("Error parsing serverId:", error);
      // Fallback to comma-separated parsing
      selectedServerIds = mission.serverId
        .split(",")
        .map((id) => id.trim().replace(/^["']|["']$/g, ""))
        .filter((id) => id !== "" && id !== "0");
      console.log(
        "Fallback Server IDs from mission.serverId:",
        selectedServerIds
      );
    }
  }

  const selectedServers = discordServers.filter((server) =>
    selectedServerIds.includes(server.serverId)
  );

  // Debug: Log the server IDs to console
  console.log("=== ViewMissionModal Debug ===");
  console.log("Mission Title:", mission.title);
  console.log("Raw ServerId:", mission.serverId);
  console.log("Raw MissionTargeting:", mission.missionTargeting);
  console.log("Parsed MissionTargeting:", missionTargeting);
  console.log("Selected Server IDs:", selectedServerIds);
  console.log("All Discord Servers Count:", discordServers.length);
  console.log(
    "All Discord Servers:",
    discordServers.map((s) => ({ id: s.serverId, name: s.name }))
  );
  console.log("Matched Selected Servers:", selectedServers);
  console.log("IsLoadingServers:", isLoadingServers);
  console.log("ServerFetchError:", serverFetchError);

  // Additional debug - check exact server ID format
  console.log("Server ID comparisons:");
  selectedServerIds.forEach((selectedId, index) => {
    const match = discordServers.find((s) => s.serverId === selectedId);
    console.log(
      `${index + 1}. Selected: "${selectedId}" | Match: ${
        match ? `"${match.name}"` : "NOT FOUND"
      }`
    );
    if (!match) {
      // Show similar IDs for debugging
      const similar = discordServers.filter((s) =>
        s.serverId.includes(selectedId.slice(-6))
      );
      console.log(
        `   Similar IDs: ${similar.map((s) => s.serverId).join(", ")}`
      );
    }
  });
  console.log("==============================");

  // Calculate total member count from available data
  const totalMembers = selectedServerIds.reduce((total, serverId) => {
    const server = discordServers.find((s) => s.serverId === serverId);
    return total + (server?.memberCount || 0);
  }, 0);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xs sm:max-w-4xl mx-2 sm:mx-auto">
        <DialogHeader>
          <DialogTitle className="text-sm sm:text-lg">
            Mission Details
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-3 sm:space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Left Column - Basic Mission Info */}
            <Card>
              <CardHeader className="p-3 sm:p-6 -mb-4 sm:pb-2">
                <CardTitle className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <span className="text-sm sm:text-lg break-words">
                    {mission.title}
                  </span>
                  <Badge
                    className={`${getStatusColor(
                      mission.status
                    )} text-xs self-start sm:self-auto`}
                  >
                    {mission.status}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4 p-3 sm:p-6 pt-0">
                <div>
                  <Label className="text-xs sm:text-sm font-medium text-muted-foreground">
                    Description
                  </Label>
                  <p className="text-xs sm:text-sm mt-1 break-words">
                    {mission.description}
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <Label className="text-xs sm:text-sm font-medium text-muted-foreground">
                      Type
                    </Label>
                    <p className="text-xs sm:text-sm mt-1 break-words">
                      {mission.type}
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs sm:text-sm font-medium text-muted-foreground">
                      Platform
                    </Label>
                    <p className="text-xs sm:text-sm mt-1 break-words">
                      {mission.platform}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <Label className="text-xs sm:text-sm font-medium text-muted-foreground">
                      Level Required
                    </Label>
                    <p className="text-xs sm:text-sm mt-1">
                      {mission.level_required}
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs sm:text-sm font-medium text-muted-foreground">
                      Reward
                    </Label>
                    <p className="text-xs sm:text-sm mt-1">
                      {reward.amount} {reward.token}
                    </p>
                  </div>
                </div>{" "}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <Label className="text-xs sm:text-sm font-medium text-muted-foreground">
                      Start Date
                    </Label>
                    <p className="text-xs sm:text-sm mt-1">
                      {formatDateWithTime(mission.startDate)}
                    </p>
                  </div>
                  <div>
                    <Label className="text-xs sm:text-sm font-medium text-muted-foreground">
                      End Date
                    </Label>
                    <p className="text-xs sm:text-sm mt-1">
                      {formatDateWithTime(mission.endDate)}
                    </p>
                  </div>
                </div>
                <div>
                  <Label className="text-xs sm:text-sm font-medium text-muted-foreground">
                    Action Request
                  </Label>
                  <p className="text-xs sm:text-sm mt-1 break-words">
                    {mission.action_request}
                  </p>
                </div>
                <div>
                  <Label className="text-xs sm:text-sm font-medium text-muted-foreground">
                    Partner
                  </Label>
                  <p className="text-xs sm:text-sm mt-1 break-words">
                    {mission.partnerName || "N/A"}
                  </p>
                </div>
                {mission.useful_link && (
                  <div>
                    <Label className="text-xs sm:text-sm font-medium text-muted-foreground">
                      Useful Link
                    </Label>
                    <p className="text-xs sm:text-sm mt-1 break-all">
                      <a
                        href={mission.useful_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {mission.useful_link}
                      </a>
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Right Column - Discord Targeting Info */}
            <Card>
              <CardHeader className="p-3 sm:p-6 -mb-4 sm:pb-2">
                <CardTitle className="text-sm sm:text-lg flex items-center gap-2">
                  💬 Discord Targeting
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4 p-3 sm:p-6 pt-0">
                {/* Selected Discord Servers */}
                <div className="space-y-4">
                  {/* Header with Refresh Button */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">💬</span>
                      <Label className="text-sm font-medium text-muted-foreground">
                        Discord Reach
                      </Label>
                    </div>
                    {serverFetchError && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={fetchDiscordServers}
                        disabled={isLoadingServers}
                        className="text-xs"
                      >
                        <RefreshCw
                          className={`h-3 w-3 mr-1 ${
                            isLoadingServers ? "animate-spin" : ""
                          }`}
                        />
                        Retry
                      </Button>
                    )}
                  </div>

                  {/* Show servers if any are selected */}
                  {selectedServerIds.length > 0 ? (
                    <>
                      {/* Total Discord Reach */}
                      <div className="bg-gray-100 dark:bg-gray-900 rounded-2xl p-6 text-gray-900 dark:text-white">
                        <div className="text-center space-y-2">
                          <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                            {isLoadingServers
                              ? "Loading..."
                              : totalMembers > 0
                              ? totalMembers.toLocaleString()
                              : selectedServerIds.length > 0
                              ? "Unknown"
                              : "0"}
                          </div>
                          <div className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                            Discord members
                          </div>
                        </div>

                        {/* Server Breakdown Label */}
                        <div className="mt-6 mb-4">
                          <div className="text-gray-900 dark:text-white font-semibold">
                            Server Breakdown:
                          </div>
                        </div>

                        {/* Server List with Scroll */}
                        <div
                          className={`space-y-3 ${
                            selectedServers.length > 5 ||
                            selectedServerIds.length > 5
                              ? "max-h-80 overflow-y-auto pr-2"
                              : ""
                          }`}
                        >
                          {isLoadingServers ? (
                            <div className="text-center py-8">
                              <div className="relative mx-auto w-8 h-8 mb-3">
                                <div className="absolute inset-0 rounded-full border-2 border-gray-400 dark:border-gray-600"></div>
                                <div className="absolute inset-0 rounded-full border-2 border-blue-600 dark:border-blue-400 border-t-transparent animate-spin"></div>
                              </div>
                              <p className="text-sm text-gray-600 dark:text-gray-400">
                                Loading server details...
                              </p>
                            </div>
                          ) : serverFetchError ? (
                            <div className="text-center py-6 space-y-2">
                              <div className="p-3 rounded-full bg-red-100 dark:bg-red-900/20 w-fit mx-auto">
                                <AlertCircle className="h-6 w-6 text-red-600 dark:text-red-400" />
                              </div>
                              <p className="text-sm font-medium text-red-600 dark:text-red-400">
                                Failed to load server details
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">
                                {serverFetchError}
                              </p>
                              {/* Show server IDs when there's an error */}
                              {selectedServerIds.length > 0 && (
                                <div className="mt-4 space-y-2">
                                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                                    Selected Server IDs:
                                  </p>
                                  {selectedServerIds.map((serverId) => {
                                    // Try to find any cached data even during error
                                    const cachedServer = discordServers.find(
                                      (s) => s.serverId === serverId
                                    );

                                    return (
                                      <div
                                        key={serverId}
                                        className="bg-gray-200 dark:bg-gray-800 rounded-lg p-4 flex items-center justify-between"
                                      >
                                        <div className="flex items-center gap-3">
                                          <div className="relative">
                                            {cachedServer?.icon ? (
                                              <Image
                                                src={cachedServer.icon}
                                                alt={
                                                  cachedServer.name ||
                                                  "Discord Server"
                                                }
                                                width={32}
                                                height={32}
                                                className="w-8 h-8 rounded object-cover"
                                              />
                                            ) : (
                                              <div className="w-8 h-8 rounded bg-gray-400 dark:bg-gray-600 flex items-center justify-center">
                                                <span className="text-gray-800 dark:text-white text-sm">
                                                  {cachedServer?.name
                                                    ?.charAt(0)
                                                    ?.toUpperCase() || "🌐"}
                                                </span>
                                              </div>
                                            )}
                                          </div>
                                          <div className="flex-1 min-w-0">
                                            <div className="text-gray-900 dark:text-white font-medium text-sm truncate">
                                              {cachedServer?.name ||
                                                "Discord Server"}
                                            </div>
                                            <div className="text-gray-600 dark:text-gray-400 text-xs font-mono break-all">
                                              ID: {serverId}
                                            </div>
                                          </div>
                                        </div>
                                        <div className="text-right">
                                          {cachedServer?.memberCount ? (
                                            <div>
                                              <div className="text-gray-900 dark:text-white font-semibold">
                                                {cachedServer.memberCount.toLocaleString()}
                                              </div>
                                              <div className="text-gray-600 dark:text-gray-400 text-xs">
                                                members
                                              </div>
                                            </div>
                                          ) : (
                                            <Badge
                                              variant="outline"
                                              className="text-xs border-red-400 text-red-400"
                                            >
                                              Details unavailable
                                            </Badge>
                                          )}
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              )}
                            </div>
                          ) : selectedServers.length > 0 ? (
                            // Show full server details when successfully fetched and matched
                            selectedServers.map((server) => (
                              <div
                                key={server.serverId}
                                className="bg-gray-200 dark:bg-gray-800 rounded-lg p-4 flex items-center justify-between hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors"
                              >
                                <div className="flex items-center gap-3">
                                  <div className="relative">
                                    {server.icon ? (
                                      <Image
                                        src={server.icon}
                                        alt={server.name}
                                        width={32}
                                        height={32}
                                        className="w-8 h-8 rounded object-cover"
                                      />
                                    ) : (
                                      <div className="w-8 h-8 rounded bg-gray-400 dark:bg-gray-600 flex items-center justify-center">
                                        <span className="text-gray-800 dark:text-white text-sm font-bold">
                                          {server.name.charAt(0).toUpperCase()}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="text-gray-900 dark:text-white font-medium text-sm truncate">
                                      {server.name}
                                    </div>
                                    <div className="text-gray-600 dark:text-gray-400 text-xs font-mono break-all">
                                      ID: {server.serverId}
                                    </div>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="text-gray-900 dark:text-white font-semibold">
                                    {server.memberCount.toLocaleString()}
                                  </div>
                                  <div className="text-gray-600 dark:text-gray-400 text-xs">
                                    members
                                  </div>
                                </div>
                              </div>
                            ))
                          ) : selectedServerIds.length > 0 ? (
                            // Show server IDs when we have selected servers but can't match them
                            <div className="space-y-2">
                              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                                Selected servers ({selectedServerIds.length}):
                              </p>
                              {selectedServerIds.map((serverId) => {
                                // Try to find any partial match or cached data
                                const cachedServer = discordServers.find(
                                  (s) => s.serverId === serverId
                                );

                                return (
                                  <div
                                    key={serverId}
                                    className="bg-gray-200 dark:bg-gray-800 rounded-lg p-4 flex items-center justify-between"
                                  >
                                    <div className="flex items-center gap-3">
                                      <div className="relative">
                                        {cachedServer?.icon ? (
                                          <Image
                                            src={cachedServer.icon}
                                            alt={
                                              cachedServer.name ||
                                              "Discord Server"
                                            }
                                            width={32}
                                            height={32}
                                            className="w-8 h-8 rounded object-cover"
                                          />
                                        ) : (
                                          <div className="w-8 h-8 rounded bg-gray-400 dark:bg-gray-600 flex items-center justify-center">
                                            <span className="text-gray-800 dark:text-white text-sm">
                                              {cachedServer?.name
                                                ?.charAt(0)
                                                ?.toUpperCase() || "🌐"}
                                            </span>
                                          </div>
                                        )}
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <div className="text-gray-900 dark:text-white font-medium text-sm truncate">
                                          {cachedServer?.name ||
                                            "Discord Server"}
                                        </div>
                                        <div className="text-gray-600 dark:text-gray-400 text-xs font-mono break-all">
                                          ID: {serverId}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="text-right">
                                      {cachedServer?.memberCount ? (
                                        <div>
                                          <div className="text-gray-900 dark:text-white font-semibold">
                                            {cachedServer.memberCount.toLocaleString()}
                                          </div>
                                          <div className="text-gray-600 dark:text-gray-400 text-xs">
                                            members
                                          </div>
                                        </div>
                                      ) : (
                                        <Badge
                                          variant="outline"
                                          className="text-xs border-yellow-500 dark:border-yellow-400 text-yellow-600 dark:text-yellow-400"
                                        >
                                          {discordServers.length === 0
                                            ? "Loading..."
                                            : "Details unavailable"}
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <div className="text-center py-4 text-gray-600 dark:text-gray-400">
                              <p className="text-sm">
                                No servers found for this mission
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </>
                  ) : (
                    /* Show message if no servers selected */
                    <div className="text-center py-8 text-muted-foreground">
                      <div className="p-4 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
                        <div className="text-4xl mb-2">💬</div>
                        <div className="text-sm font-medium mb-1">
                          No Discord servers targeted
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-500">
                          This mission doesn&apos;t target specific Discord
                          servers
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Additional Targeting Info */}
                {missionTargeting && (
                  <div className="space-y-3 pt-3 border-t">
                    <Label className="text-xs sm:text-sm font-medium text-muted-foreground">
                      Additional Targeting Settings
                    </Label>

                    {/* Audience Type */}
                    {missionTargeting.audienceType && (
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-muted-foreground">
                          Audience Type:
                        </span>
                        <Badge variant="outline" className="text-xs capitalize">
                          {missionTargeting.audienceType.replace("-", " ")}
                        </Badge>
                      </div>
                    )}

                    {/* Delivery Options */}
                    {missionTargeting.deliveryOptions && (
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-muted-foreground">
                            Channel:
                          </span>
                          <span className="ml-1 font-medium capitalize">
                            {missionTargeting.deliveryOptions.channel}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Scope:</span>
                          <span className="ml-1 font-medium capitalize">
                            {missionTargeting.deliveryOptions.scope}
                          </span>
                        </div>
                        {missionTargeting.deliveryOptions.schedule && (
                          <div className="col-span-2">
                            <span className="text-muted-foreground">
                              Schedule:
                            </span>
                            <span className="ml-1 font-medium capitalize">
                              {missionTargeting.deliveryOptions.schedule}
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Active Behavior Filters */}
                    {missionTargeting.behaviorFilters &&
                      Object.entries(missionTargeting.behaviorFilters).some(
                        ([, filter]) => {
                          const filterObj = filter as { enabled?: boolean };
                          return filterObj?.enabled;
                        }
                      ) && (
                        <div className="space-y-2">
                          <div className="text-xs font-medium text-muted-foreground">
                            Active Behavior Filters:
                          </div>
                          {Object.entries(missionTargeting.behaviorFilters)
                            .filter(([, filter]) => {
                              const filterObj = filter as { enabled?: boolean };
                              return filterObj?.enabled;
                            })
                            .map(([key, filter]) => {
                              const filterValue = filter as {
                                enabled?: boolean;
                                value?: boolean | string[] | string | number;
                                min?: number;
                                max?: number;
                              };

                              let displayValue = "";
                              if (
                                key === "xpLevel" &&
                                filterValue.min !== undefined &&
                                filterValue.max !== undefined
                              ) {
                                displayValue = `${filterValue.min}-${filterValue.max}`;
                              } else if (
                                typeof filterValue.value === "boolean"
                              ) {
                                displayValue = filterValue.value ? "Yes" : "No";
                              } else if (Array.isArray(filterValue.value)) {
                                displayValue =
                                  filterValue.value.join(", ") || "None";
                              } else {
                                displayValue = String(
                                  filterValue.value || "N/A"
                                );
                              }

                              return (
                                <div
                                  key={key}
                                  className="flex justify-between items-center text-xs"
                                >
                                  <span className="text-muted-foreground capitalize">
                                    {key
                                      .replace(/([A-Z])/g, " $1")
                                      .toLowerCase()}
                                    :
                                  </span>
                                  <Badge variant="outline" className="text-xs">
                                    {displayValue}
                                  </Badge>
                                </div>
                              );
                            })}
                        </div>
                      )}

                    {/* Active Demographic Filters */}
                    {missionTargeting.demographicFilters &&
                      Object.entries(missionTargeting.demographicFilters).some(
                        ([, value]) => {
                          return Array.isArray(value)
                            ? value.length > 0
                            : value;
                        }
                      ) && (
                        <div className="space-y-2">
                          <div className="text-xs font-medium text-muted-foreground">
                            Demographic Filters:
                          </div>
                          {Object.entries(missionTargeting.demographicFilters)
                            .filter(([, value]) => {
                              return Array.isArray(value)
                                ? value.length > 0
                                : value;
                            })
                            .map(([key, value]) => (
                              <div
                                key={key}
                                className="flex justify-between items-center text-xs"
                              >
                                <span className="text-muted-foreground capitalize">
                                  {key.replace(/([A-Z])/g, " $1").toLowerCase()}
                                  :
                                </span>
                                <Badge variant="outline" className="text-xs">
                                  {Array.isArray(value)
                                    ? value.join(", ") || "None"
                                    : String(value)}
                                </Badge>
                              </div>
                            ))}
                        </div>
                      )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
