import React, { useState } from "react";
import { Mission, User } from "@/types/admin/adminTypes";
import {
  Award,
  DollarSign,
  Calendar,
  Send,
  Wallet,
  Eye,
  ExternalLink,
  CheckCircle,
  Clock,
  XCircle,
  Upload,
  TrendingUp,
  ArrowUpDown,
  MoreHorizontal,
  Settings2,
  User as UserIcon, // Added for Agent Level
  Smile as SmileIcon, // Added for Agent Mood
  Heart as HeartIcon, // Added for Agent Health
  Clock as ClockIcon, // Added for Last Active
  Info as InfoIcon, // Added for Interests
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Custom X (Twitter) Icon Component
const XIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

// Define UserAgent interface
interface UserAgent {
  _id: { $oid: string };
  user_id: string;
  xp: number;
  level: number;
  health: number;
  mood: string;
  last_active: { $date: string };
  created_at: { $date: string };
  last_health_decay: { $date: string };
  total_xp: number;
  current_level_progress: number;
  xp_required: number;
}

const AdminUserRow = ({ user, missions }: { user: User; missions: Mission[] }) => {
  const [selectedSubmission, setSelectedSubmission] = useState<Mission | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [sortField, setSortField] = useState<keyof Mission | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

  // Column visibility state
  const [columnVisibility, setColumnVisibility] = useState<{
    missionId: boolean;
    status: boolean;
    acceptedAt: boolean;
    submittedAt: boolean;
    completedAt: boolean;
    submissionLink: boolean;
  }>({
    missionId: true,
    status: true,
    acceptedAt: true,
    submittedAt: true,
    completedAt: true,
    submissionLink: true,
  });

  // User agent state
  const userAgent: UserAgent = {
    _id: { $oid: "6864667528eed21c25efed6d" },
    user_id: "421249349469732874",
    xp: 0,
    level: 1,
    health: 100,
    mood: "Happy",
    last_active: { $date: "2025-07-01T22:51:33.662Z" },
    created_at: { $date: "2025-07-01T22:51:33.662Z" },
    last_health_decay: { $date: "2025-07-01T22:51:33.662Z" },
    total_xp: 0,
    current_level_progress: 0,
    xp_required: 100,
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "accepted":
        return "default";
      case "completed":
        return "default";
      case "rejected":
        return "destructive";
      case "submitted":
        return "secondary";
      default:
        return "outline";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "accepted":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300";
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300";
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300";
      case "submitted":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
    }
  };

  const openModal = (mission: Mission) => {
    setSelectedSubmission(mission);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedSubmission(null);
  };

  const getLinkType = (url: string) => {
    if (url.includes("twitter.com") || url.includes("x.com")) return "X (Twitter)";
    if (url.includes("discord.com")) return "Discord";
    if (url.includes("github.com")) return "GitHub";
    if (url.includes("youtube.com") || url.includes("youtu.be")) return "YouTube";
    if (url.includes("medium.com")) return "Medium";
    return "External Link";
  };

  // Toggle column visibility
  const toggleColumnVisibility = (column: keyof typeof columnVisibility) => {
    setColumnVisibility((prev) => ({
      ...prev,
      [column]: !prev[column],
    }));
  };

  const userMissions = missions.filter((mission) => mission.user_id === user.discord_id);

  // Sorting functionality
  const handleSort = (field: keyof Mission) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  // Filter missions based on selected status
  const filteredMissions = selectedStatus
    ? userMissions.filter((mission) => mission.status === selectedStatus)
    : userMissions;

  const sortedMissions = [...filteredMissions].sort((a, b) => {
    if (!sortField) return 0;

    const aValue = a[sortField];
    const bValue = b[sortField];

    if (aValue === null || aValue === undefined || aValue === "NULL") return 1;
    if (bValue === null || bValue === undefined || bValue === "NULL") return -1;

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  // Calculate status statistics
  const statusStats = {
    accepted: userMissions.filter((m) => m.status === "accepted").length,
    submitted: userMissions.filter((m) => m.status === "submitted").length,
    completed: userMissions.filter((m) => m.status === "completed").length,
    rejected: userMissions.filter((m) => m.status === "rejected").length,
  };

  const totalMissions = userMissions.length;

  // Status card component with original design
  const StatusCard = ({
    status,
    count,
    icon: Icon,
    color,
    bgColor,
  }: {
    status: string;
    count: number;
    icon: React.ElementType;
    color: string;
    bgColor: string;
  }) => (
    <Card
      className={`${bgColor} border-opacity-20 dark:border-opacity-40 cursor-pointer hover:scale-105 hover:shadow-lg transition-all duration-200 ${
        selectedStatus === status ? 'ring-2 ring-offset-2 ring-blue-500' : ''
      }`}
      onClick={() => setSelectedStatus(status)}
    >
      <CardContent className="px-3 py-0 -my-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className={`p-0 sm:p-1.5 rounded-lg ${color}`}>
              <Icon className={`w-4 h-4 sm:w-6 sm:h-6 ${color}`} />
            </div>
            <div>
              <p className="text-xs sm:text-sm font-medium text-muted-foreground capitalize">
                {status}
              </p>
              <p className="text-lg sm:text-lg font-bold text-foreground">
                {count}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs sm:text-sm text-muted-foreground">
              {totalMissions > 0
                ? Math.round((count / totalMissions) * 100)
                : 0}
              %
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <>
      <Card className="hover:shadow-lg transition-all duration-300 border-border">
        <CardHeader className="p-6 -my-6">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 bg-purple-600 dark:bg-purple-500 rounded-full flex items-center justify-center text-white font-medium text-2xl shadow-lg shadow-purple-500/25">
                {user.email.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-lg font-semibold text-foreground truncate">
                  {user.email}
                </p>
                <p className="text-sm text-muted-foreground">
                  ID: {user.discord_id}
                </p>
              </div>
            </div>
            <Badge
              variant="outline"
              className="bg-gradient-to-r from-purple-50 to-blue-50 text-purple-700 dark:from-purple-900/20 dark:to-blue-900/20 dark:text-purple-300"
            >
              <TrendingUp className="w-4 h-4 mr-1 my-2" />
              {totalMissions} Total Missions
            </Badge>
          </div>

          {/* User Details in Two Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            {/* Column 1 */}
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <Award className="w-5 h-5 text-blue-500 dark:text-blue-400" />
                <span className="text-lg text-foreground">
                  3
                </span>
                <span className="text-base text-muted-foreground">
                  missions completed
                </span>
              </div>
              <div className="flex items-center space-x-3 mb-4">
                <DollarSign className="w-5 h-5 text-green-500 dark:text-green-400" />
                <span className="text-lg text-foreground">
                  180
                </span>
                <span className="text-base text-muted-foreground">
                  points
                </span>
              </div>
              <div className="flex items-start space-x-3 mb-4">
                <InfoIcon className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500 dark:text-purple-400" />
                <span className="text-base text-muted-foreground">Interests:</span>
                <span className="text-lg text-foreground break-words">
                  Web3, Blockchain
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-orange-500 dark:text-orange-400" />
                <span className="text-base text-muted-foreground">
                  Joined:
                </span>
                <span className="text-lg text-foreground break-words">
                Jan 8, 2024, 04:15 PM
                </span>
              </div>
            </div>

            {/* Column 2 */}
            <div>
              <div className="flex items-start space-x-3 mb-4">
                <UserIcon className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-500 dark:text-indigo-400" />
                <span className="text-sm sm:text-base text-muted-foreground">Agent Level:</span>
                <span className="text-sm sm:text-base text-foreground">{userAgent.level}</span>
              </div>
              <div className="flex items-start space-x-3 mb-4">
                <SmileIcon className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500 dark:text-yellow-400" />
                <span className="text-sm sm:text-base text-muted-foreground">Agent Mood:</span>
                <span className="text-sm sm:text-base text-foreground">{userAgent.mood}</span>
              </div>
              <div className="flex items-start space-x-3 mb-4">
                <HeartIcon className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 dark:text-red-400" />
                <span className="text-sm sm:text-base text-muted-foreground">Agent Health:</span>
                <span className="text-sm sm:text-base text-foreground">{userAgent.health}%</span>
              </div>
              <div className="flex items-start space-x-3">
                <ClockIcon className="w-4 h-4 sm:w-5 sm:h-5 text-teal-500 dark:text-teal-400" />
                <span className="text-sm sm:text-base text-muted-foreground">Last Active:</span>
                <span className="text-sm sm:text-base text-foreground">{formatDate(userAgent.last_active.$date)}</span>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex flex-wrap items-center gap-4 mt-6 pt-4 border-t border-border">
            {user.telegram_id && (
              <div className="flex items-center space-x-2">
                <Send className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                <span className="text-sm text-muted-foreground truncate max-w-[150px]">
                  {user.telegram_id}
                </span>
              </div>
            )}
            {user.twitter_handle && (
              <div className="flex items-center space-x-2">
                <XIcon className="w-4 h-4 text-foreground" />
                <span className="text-sm text-muted-foreground truncate max-w-[150px]">
                  {user.twitter_handle}
                </span>
              </div>
            )}
            {user.wallet_address && (
              <div className="flex items-center space-x-2">
                <Wallet className="w-4 h-4 text-green-500 dark:text-green-400" />
                <span className="text-sm text-muted-foreground truncate max-w-[150px]">
                  {user.wallet_address}
                </span>
              </div>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-6">
          {/* Status Statistics */}
          <div className="mb-6 -my-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-2">
              <h4 className="text-md font-semibold text-foreground">
                Mission Status Overview
              </h4>
              <div className="flex items-center gap-2">
                {selectedStatus && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSelectedStatus(null)}
                  >
                    Reset Filter
                  </Button>
                )}
                <div className="text-xs text-muted-foreground">
                  Total: {totalMissions} missions
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <StatusCard
                status="completed"
                count={statusStats.completed}
                icon={CheckCircle}
                color="text-green-600 dark:text-green-400"
                bgColor="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10"
              />
              <StatusCard
                status="submitted"
                count={statusStats.submitted}
                icon={Upload}
                color="text-yellow-600 dark:text-yellow-400"
                bgColor="bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/10 dark:to-amber-900/10"
              />
              <StatusCard
                status="accepted"
                count={statusStats.accepted}
                icon={Clock}
                color="text-blue-600 dark:text-blue-400"
                bgColor="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/10 dark:to-cyan-900/10"
              />
              <StatusCard
                status="rejected"
                count={statusStats.rejected}
                icon={XCircle}
                color="text-red-600 dark:text-red-400"
                bgColor="bg-gradient-to-br from-red-50 to-rose-50 dark:from-red-900/10 dark:to-rose-900/10"
              />
            </div>
          </div>

          {/* Missions DataTable with Column Toggle */}
          <div className="mt-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3 gap-2">
              <h4 className="text-md font-semibold text-foreground">
                Mission Details
              </h4>

              {/* Column Visibility Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Settings2 className="h-4 w-4 mr-2" />
                    View
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[180px]">
                  <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuCheckboxItem
                    checked={columnVisibility.missionId}
                    onCheckedChange={() => toggleColumnVisibility("missionId")}
                  >
                    Mission ID
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={columnVisibility.status}
                    onCheckedChange={() => toggleColumnVisibility("status")}
                  >
                    Status
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={columnVisibility.acceptedAt}
                    onCheckedChange={() => toggleColumnVisibility("acceptedAt")}
                  >
                    Accepted At
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={columnVisibility.submittedAt}
                    onCheckedChange={() => toggleColumnVisibility("submittedAt")}
                  >
                    Submitted At
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={columnVisibility.completedAt}
                    onCheckedChange={() => toggleColumnVisibility("completedAt")}
                  >
                    Completed At
                  </DropdownMenuCheckboxItem>
                  <DropdownMenuCheckboxItem
                    checked={columnVisibility.submissionLink}
                    onCheckedChange={() => toggleColumnVisibility("submissionLink")}
                  >
                    Submission Link
                  </DropdownMenuCheckboxItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Responsive Data Table */}
            <div className="overflow-x-auto">
              <div className="rounded-md border border-border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {columnVisibility.missionId && (
                        <TableHead className="w-[100px] min-w-[100px]">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                className="h-auto p-0 font-medium text-xs text-foreground hover:text-foreground"
                              >
                                Mission ID
                                <ArrowUpDown className="ml-1 h-3 w-3" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start">
                              <DropdownMenuItem
                                onClick={() => handleSort("mission_id")}
                              >
                                <div className="flex items-center">
                                  <svg
                                    className="w-4 h-4 mr-2"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M7 11l5-5m0 0l5 5m-5-5v12"
                                    />
                                  </svg>
                                  Asc
                                </div>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setSortField("mission_id");
                                  setSortDirection("desc");
                                }}
                              >
                                <div className="flex items-center">
                                  <svg
                                    className="w-4 h-4 mr-2"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M17 13l-5 5m0 0l-5-5m5 5V6"
                                    />
                                  </svg>
                                  Desc
                                </div>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => toggleColumnVisibility("missionId")}
                              >
                                <div className="flex items-center">
                                  <svg
                                    className="w-4 h-4 mr-2"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                                    />
                                  </svg>
                                  Hide
                                </div>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableHead>
                      )}
                      {columnVisibility.status && (
                        <TableHead className="w-[100px] min-w-[100px]">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                className="h-auto p-0 font-medium text-xs text-foreground hover:text-foreground"
                              >
                                Status
                                <ArrowUpDown className="ml-1 h-3 w-3" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start">
                              <DropdownMenuItem
                                onClick={() => handleSort("status")}
                              >
                                <div className="flex items-center">
                                  <svg
                                    className="w-4 h-4 mr-2"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M7 11l5-5m0 0l5 5m-5-5v12"
                                    />
                                  </svg>
                                  Asc
                                </div>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setSortField("status");
                                  setSortDirection("desc");
                                }}
                              >
                                <div className="flex items-center">
                                  <svg
                                    className="w-4 h-4 mr-2"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M17 13l-5 5m0 0l-5-5m5 5V6"
                                    />
                                  </svg>
                                  Desc
                                </div>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => toggleColumnVisibility("status")}
                              >
                                <div className="flex items-center">
                                  <svg
                                    className="w-4 h-4 mr-2"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                                    />
                                  </svg>
                                  Hide
                                </div>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableHead>
                      )}
                      {columnVisibility.acceptedAt && (
                        <TableHead className="w-[140px] min-w-[140px]">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                className="h-auto p-0 font-medium text-xs text-foreground hover:text-foreground"
                              >
                                Accepted At
                                <ArrowUpDown className="ml-1 h-3 w-3" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start">
                              <DropdownMenuItem
                                onClick={() => handleSort("accepted_at")}
                              >
                                <div className="flex items-center">
                                  <svg
                                    className="w-4 h-4 mr-2"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M7 11l5-5m0 0l5 5m-5-5v12"
                                    />
                                  </svg>
                                  Asc
                                </div>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setSortField("accepted_at");
                                  setSortDirection("desc");
                                }}
                              >
                                <div className="flex items-center">
                                  <svg
                                    className="w-4 h-4 mr-2"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M17 13l-5 5m0 0l-5-5m5 5V6"
                                    />
                                  </svg>
                                  Desc
                                </div>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => toggleColumnVisibility("acceptedAt")}
                              >
                                <div className="flex items-center">
                                  <svg
                                    className="w-4 h-4 mr-2"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                                    />
                                  </svg>
                                  Hide
                                </div>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableHead>
                      )}
                      {columnVisibility.submittedAt && (
                        <TableHead className="w-[140px] min-w-[140px]">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                className="h-auto p-0 font-medium text-xs text-foreground hover:text-foreground"
                              >
                                Submitted At
                                <ArrowUpDown className="ml-1 h-3 w-3" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start">
                              <DropdownMenuItem
                                onClick={() => handleSort("submitted_at")}
                              >
                                <div className="flex items-center">
                                  <svg
                                    className="w-4 h-4 mr-2"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M7 11l5-5m0 0l5 5m-5-5v12"
                                    />
                                  </svg>
                                  Asc
                                </div>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setSortField("submitted_at");
                                  setSortDirection("desc");
                                }}
                              >
                                <div className="flex items-center">
                                  <svg
                                    className="w-4 h-4 mr-2"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M17 13l-5 5m0 0l-5-5m5 5V6"
                                    />
                                  </svg>
                                  Desc
                                </div>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => toggleColumnVisibility("submittedAt")}
                              >
                                <div className="flex items-center">
                                  <svg
                                    className="w-4 h-4 mr-2"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                                    />
                                  </svg>
                                  Hide
                                </div>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableHead>
                      )}
                      {columnVisibility.completedAt && (
                        <TableHead className="w-[140px] min-w-[140px]">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                className="h-auto p-0 font-medium text-xs text-foreground hover:text-foreground"
                              >
                                Completed At
                                <ArrowUpDown className="ml-1 h-3 w-3" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start">
                              <DropdownMenuItem
                                onClick={() => handleSort("completed_at")}
                              >
                                <div className="flex items-center">
                                  <svg
                                    className="w-4 h-4 mr-2"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M7 11l5-5m0 0l5 5m-5-5v12"
                                    />
                                  </svg>
                                  Asc
                                </div>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setSortField("completed_at");
                                  setSortDirection("desc");
                                }}
                              >
                                <div className="flex items-center">
                                  <svg
                                    className="w-4 h-4 mr-2"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M17 13l-5 5m0 0l-5-5m5 5V6"
                                    />
                                  </svg>
                                  Desc
                                </div>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => toggleColumnVisibility("completedAt")}
                              >
                                <div className="flex items-center">
                                  <svg
                                    className="w-4 h-4 mr-2"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                                    />
                                  </svg>
                                  Hide
                                </div>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableHead>
                      )}
                      {columnVisibility.submissionLink && (
                        <TableHead className="w-[120px] min-w-[120px] text-foreground">
                          Submission Link
                        </TableHead>
                      )}
                      <TableHead className="w-[60px] min-w-[60px]">
                        <span className="sr-only">Actions</span>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedMissions.length > 0 ? (
                      sortedMissions.map((mission) => (
                        <TableRow key={mission._id}>
                          {columnVisibility.missionId && (
                            <TableCell className="font-medium text-sm text-foreground">
                              {mission.mission_id}
                            </TableCell>
                          )}
                          {columnVisibility.status && (
                            <TableCell>
                              <Badge
                                variant={getStatusVariant(mission.status)}
                                className={`${getStatusColor(
                                  mission.status
                                )} text-xs`}
                              >
                                {mission.status}
                              </Badge>
                            </TableCell>
                          )}
                          {columnVisibility.acceptedAt && (
                            <TableCell className="text-xs text-muted-foreground">
                              {mission.accepted_at === "NULL" ||
                              mission.accepted_at === null ||
                              !mission.accepted_at
                                ? "N/A"
                                : formatDate(mission.accepted_at)}
                            </TableCell>
                          )}
                          {columnVisibility.submittedAt && (
                            <TableCell className="text-xs text-muted-foreground">
                              {mission.submitted_at === "NULL" ||
                              mission.submitted_at === null ||
                              !mission.submitted_at
                                ? "N/A"
                                : formatDate(mission.submitted_at)}
                            </TableCell>
                          )}
                          {columnVisibility.completedAt && (
                            <TableCell className="text-xs text-muted-foreground">
                              {mission.completed_at === "NULL" ||
                              mission.completed_at === null ||
                              !mission.completed_at
                                ? "N/A"
                                : formatDate(mission.completed_at)}
                            </TableCell>
                          )}
                          {columnVisibility.submissionLink && (
                            <TableCell>
                              {mission.submission_link === "NULL" ||
                              mission.submission_link === null ||
                              !mission.submission_link ? (
                                <span className="text-muted-foreground text-xs">
                                  N/A
                                </span>
                              ) : (
                                <Badge variant="outline" className="text-xs">
                                  {getLinkType(mission.submission_link)}
                                </Badge>
                              )}
                            </TableCell>
                          )}
                          <TableCell>
                            {mission.submission_link &&
                              mission.submission_link !== "NULL" && (
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      className="h-6 w-6 p-0"
                                    >
                                      <span className="sr-only">Open menu</span>
                                      <MoreHorizontal className="h-3 w-3" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end">
                                    <DropdownMenuItem
                                      onClick={() => openModal(mission)}
                                    >
                                      <Eye className="mr-2 h-4 w-4" />
                                      View Details
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                      <a
                                        href={mission.submission_link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center"
                                      >
                                        <ExternalLink className="mr-2 h-4 w-4" />
                                        Open Link
                                      </a>
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              )}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={7}
                          className="h-24 text-center text-muted-foreground"
                        >
                          No missions found for this user
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modal using shadcn/ui Dialog */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              Mission #{selectedSubmission?.mission_id} Submission
            </DialogTitle>
          </DialogHeader>

          {selectedSubmission && (
            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base text-foreground">
                    Submission Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex flex-col space-y-2">
                    <span className="text-sm font-medium text-muted-foreground">
                      Link:
                    </span>
                    <div>
                      <Badge variant="outline" className="mb-2">
                        {getLinkType(selectedSubmission.submission_link!)}
                      </Badge>
                      <p className="text-sm text-foreground break-all">
                        {selectedSubmission.submission_link}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-muted-foreground">
                      Status:
                    </span>
                    <Badge
                      variant={getStatusVariant(selectedSubmission.status)}
                      className={getStatusColor(selectedSubmission.status)}
                    >
                      {selectedSubmission.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                <Button asChild className="flex-1">
                  <a
                    href={selectedSubmission.submission_link!}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Open Link
                  </a>
                </Button>
                <Button variant="outline" onClick={closeModal}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AdminUserRow;