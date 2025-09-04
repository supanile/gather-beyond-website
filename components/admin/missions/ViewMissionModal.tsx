import React, { useState, useEffect } from "react";
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
import { AlertCircle } from "lucide-react";

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
  useEffect(() => {
    if (isOpen && mission) {
      const fetchDiscordServers = async () => {
        setIsLoadingServers(true);
        setServerFetchError(null);
        try {
          const response = await fetch("/api/discord/getserver");
          
          if (response.ok) {
            const data = await response.json();
            
            if (data.success && data.guilds) {
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
              setDiscordServers(transformedServers);
            } else {
              setServerFetchError("API response format error");
              setDiscordServers([]);
            }
          } else {
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

      fetchDiscordServers();
    }
  }, [isOpen, mission]);

  if (!mission) return null;

  const reward = parseReward(mission.reward);

  // Parse mission targeting data if it exists
  const missionTargeting = mission.missionTargeting ? 
    (typeof mission.missionTargeting === 'string' ? 
      JSON.parse(mission.missionTargeting) : mission.missionTargeting) : null;

  // Get selected Discord servers from mission targeting or serverId
  let selectedServerIds: string[] = [];
  
  // Priority 1: Try to get from missionTargeting.discordFilters.servers
  if (missionTargeting?.discordFilters?.servers && missionTargeting.discordFilters.servers.length > 0) {
    selectedServerIds = missionTargeting.discordFilters.servers;
  }
  // Priority 2: Try to get from serverId (comma-separated string)
  else if (mission.serverId && mission.serverId.trim() !== '') {
    selectedServerIds = mission.serverId.split(',').map(id => id.trim()).filter(id => id !== '');
  }

  const selectedServers = discordServers.filter(server => 
    selectedServerIds.includes(server.serverId)
  );

  // Debug: Log the server IDs to console
  console.log('Mission:', mission.title);
  console.log('ServerId:', mission.serverId);
  console.log('MissionTargeting:', missionTargeting);
  console.log('Selected Server IDs:', selectedServerIds);
  console.log('Discord Servers:', discordServers);
  console.log('Selected Servers:', selectedServers);

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
                </div>

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
                {/* Audience Type */}
                <div>
                  <Label className="text-xs sm:text-sm font-medium text-muted-foreground">
                    Audience Type
                  </Label>
                  <p className="text-xs sm:text-sm mt-1">
                    {missionTargeting?.audienceType || "Not specified"}
                  </p>
                </div>

                {/* Selected Discord Servers */}
                {selectedServerIds.length > 0 && (
                  <div className="space-y-3">
                    <Label className="text-xs sm:text-sm font-medium text-muted-foreground">
                      Target Servers ({selectedServerIds.length})
                    </Label>
                    
                    {/* Total Discord Reach */}
                    <div className="text-center p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border">
                      <div className="text-2xl font-bold text-blue-600">
                        {selectedServers
                          .reduce((total, server) => total + server.memberCount, 0)
                          .toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Discord members
                      </div>
                    </div>

                    {/* Server List */}
                    <div className="space-y-2">
                      {isLoadingServers ? (
                        <div className="text-center py-4 text-muted-foreground">
                          <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-500 border-t-transparent mx-auto mb-2"></div>
                          <p className="text-xs">Loading servers...</p>
                        </div>
                      ) : serverFetchError ? (
                        <div className="text-center py-4 text-red-600 dark:text-red-400">
                          <AlertCircle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                          <p className="text-xs font-medium">Failed to load server details</p>
                          <p className="text-xs text-muted-foreground">{serverFetchError}</p>
                        </div>
                      ) : selectedServers.length > 0 ? (
                        selectedServers.map((server) => (
                          <div
                            key={server.serverId}
                            className="p-3 rounded-lg border-2 border-blue-500 bg-blue-50 dark:bg-blue-950 ring-2 ring-blue-200 dark:ring-blue-800"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                {server.icon ? (
                                  <img
                                    src={server.icon}
                                    alt={server.name}
                                    className="w-6 h-6 rounded"
                                  />
                                ) : (
                                  <span className="text-lg">🌐</span>
                                )}
                                <div>
                                  <div className="font-semibold text-sm">
                                    {server.name}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {server.serverId}
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <Badge variant="default" className="text-xs">
                                  {server.memberCount.toLocaleString()} members
                                </Badge>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        // Show server IDs even if we can't fetch details
                        selectedServerIds.map((serverId) => (
                          <div
                            key={serverId}
                            className="p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-lg">🌐</span>
                                <div>
                                  <div className="font-semibold text-sm">
                                    Server {serverId}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {serverId}
                                  </div>
                                </div>
                              </div>
                              <Badge variant="outline" className="text-xs">
                                Selected
                              </Badge>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {/* Show message if no servers selected */}
                {selectedServerIds.length === 0 && (
                  <div className="text-center py-6 text-muted-foreground">
                    <div className="text-xs">No Discord servers targeted</div>
                  </div>
                )}

                {/* Additional Targeting Info */}
                {missionTargeting && (
                  <div className="space-y-3 pt-3 border-t">
                    <Label className="text-xs sm:text-sm font-medium text-muted-foreground">
                      Additional Targeting
                    </Label>
                    
                    {/* Delivery Options */}
                    {missionTargeting.deliveryOptions && (
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-muted-foreground">Channel:</span>
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
                      </div>
                    )}

                    {/* Active Behavior Filters */}
                    {missionTargeting.behaviorFilters && (
                      <div className="space-y-2">
                        {Object.entries(missionTargeting.behaviorFilters)
                          .filter(([, filter]) => (filter as any)?.enabled)
                          .map(([key, filter]) => {
                            const filterValue = filter as any;
                            return (
                            <div key={key} className="flex justify-between items-center text-xs">
                              <span className="text-muted-foreground capitalize">
                                {key.replace(/([A-Z])/g, ' $1').toLowerCase()}:
                              </span>
                              <Badge variant="outline" className="text-xs">
                                {typeof filterValue.value === 'boolean' 
                                  ? (filterValue.value ? 'Yes' : 'No')
                                  : Array.isArray(filterValue.value)
                                  ? filterValue.value.join(', ')
                                  : String(filterValue.value)}
                              </Badge>
                            </div>
                          )})}
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