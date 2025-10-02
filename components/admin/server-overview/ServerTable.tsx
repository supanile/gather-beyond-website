import React, { useState } from "react";
import { ServerTableProps } from "@/types/admin/serverTypes";
import {
  Search,
  Server,
  Users,
  Crown,
  Zap,
  Coins,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Filter,
  CheckIcon,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

type SortField =
  | "name"
  | "member_count"
  | "sc_user_count"
  | "total_credits"
  | "total_xp"
  | "created_at";
type SortDirection = "asc" | "desc";

interface SortConfig {
  field: SortField;
  direction: SortDirection;
  label: string;
}

const ServerTable: React.FC<ServerTableProps> = ({ servers }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedServers, setExpandedServers] = useState<Set<string>>(
    new Set()
  );
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    field: "sc_user_count",
    direction: "desc",
    label: "Most SC Users",
  });

  const sortOptions: SortConfig[] = [
    { field: "name", direction: "asc", label: "Server Name A-Z" },
    { field: "name", direction: "desc", label: "Server Name Z-A" },
    { field: "member_count", direction: "desc", label: "Most Members" },
    { field: "member_count", direction: "asc", label: "Least Members" },
    { field: "sc_user_count", direction: "desc", label: "Most SC Users" },
    { field: "sc_user_count", direction: "asc", label: "Least SC Users" },
    { field: "total_credits", direction: "desc", label: "Most Credits" },
    { field: "total_credits", direction: "asc", label: "Least Credits" },
    { field: "total_xp", direction: "desc", label: "Most XP" },
    { field: "total_xp", direction: "asc", label: "Least XP" },
    { field: "created_at", direction: "desc", label: "Newest First" },
    { field: "created_at", direction: "asc", label: "Oldest First" },
  ];

  // const getServerTypeColor = (type: string) => {
  //   switch (type) {
  //     case "premium":
  //       return "bg-yellow-100 text-yellow-800 border-yellow-200";
  //     case "standard":
  //       return "bg-blue-100 text-blue-800 border-blue-200";
  //     case "basic":
  //       return "bg-gray-100 text-gray-800 border-gray-200";
  //     default:
  //       return "bg-gray-100 text-gray-800 border-gray-200";
  //   }
  // };

  const toggleExpanded = (serverId: string) => {
    const newExpanded = new Set(expandedServers);
    if (newExpanded.has(serverId)) {
      newExpanded.delete(serverId);
    } else {
      newExpanded.add(serverId);
    }
    setExpandedServers(newExpanded);
  };

  const handleSortChange = (option: SortConfig) => {
    setSortConfig(option);
  };

  const handleClearSort = () => {
    setSortConfig({
      field: "member_count",
      direction: "desc",
      label: "Most Members",
    });
  };

  const getSortIcon = () => {
    return sortConfig.direction === "asc" ? (
      <ArrowUp className="h-3 w-3" />
    ) : (
      <ArrowDown className="h-3 w-3" />
    );
  };

  // Filter and sort servers
  const filteredAndSortedServers = servers
    .filter(
      (server) =>
        server.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        // server.owner_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        server.categories.some((category) =>
          category.toLowerCase().includes(searchTerm.toLowerCase())
        )
    )
    .sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortConfig.field) {
        case "name":
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case "member_count":
          aValue = a.member_count;
          bValue = b.member_count;
          break;
        case "sc_user_count":
          aValue = a.sc_user_count;
          bValue = b.sc_user_count;
          break;
        case "total_credits":
          aValue = a.total_credits;
          bValue = b.total_credits;
          break;
        case "total_xp":
          aValue = a.total_xp;
          bValue = b.total_xp;
          break;
        case "created_at":
          aValue = new Date(a.created_at).getTime();
          bValue = new Date(b.created_at).getTime();
          break;
        default:
          return 0;
      }

      if (typeof aValue === "string" && typeof bValue === "string") {
        const comparison = aValue.localeCompare(bValue);
        return sortConfig.direction === "asc" ? comparison : -comparison;
      } else if (typeof aValue === "number" && typeof bValue === "number") {
        return sortConfig.direction === "asc"
          ? aValue - bValue
          : bValue - aValue;
      }

      return 0;
    });

  return (
    <div className="space-y-6">
      {/* Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center
sm:justify-between gap-4">
        <div className="flex items-center gap-2">
          {/* Sort Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-8 cursor-pointer"
              >
                <Filter className="h-4 w-4 mr-1" />
                {getSortIcon()}
                <span className="ml-1">{sortConfig.label}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-56">
              <DropdownMenuLabel>Sort by</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {sortOptions.map((option, index) => (
                <DropdownMenuItem
                  key={index}
                  onClick={() => handleSortChange(option)}
                  className="flex items-center justify-between"
                >
                  <span>{option.label}</span>
                  {sortConfig.field === option.field &&
                    sortConfig.direction === option.direction && (
                      <CheckIcon className="h-4 w-4 text-green-500" />
                    )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Clear Sort Button - แสดงเฉพาะเมื่อไม่ใช่ค่าเริ่มต้น */}
          {!(sortConfig.field === "sc_user_count" &&
            sortConfig.direction === "desc") && (
            <Button
              variant="destructive"
              size="sm"
              className="h-8"
              onClick={handleClearSort}
            >
              Clear Filter
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {filteredAndSortedServers.length} server
            {filteredAndSortedServers.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search servers by name, owner, or categories..."
          className="w-full pl-10 pr-4 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Server List */}
      <div className="space-y-4">
        {filteredAndSortedServers.length > 0 ? (
          filteredAndSortedServers.map((server) => (
            <Collapsible key={server.id}>
              <div className="bg-background rounded-lg border border-border overflow-hidden hover:shadow-md transition-all duration-300">
                {/* Server Header */}
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      {/* Server Avatar */}
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={server.image_url} alt={server.name} />
                        <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                          {server.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>

                      {/* Server Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-foreground truncate">
                            {server.name}
                          </h3>
                          {/* <Badge 
                            variant="outline" 
                            className={`text-xs ${getServerTypeColor(server.server_type)}`}
                          >
                            {server.server_type.toUpperCase()}
                          </Badge> */}
                          {!server.is_active && (
                            <Badge variant="destructive" className="text-xs">
                              INACTIVE
                            </Badge>
                          )}
                        </div>
                        {/* <p className="text-sm text-muted-foreground">
                          Owner: {server.owner_name}
                        </p> */}
                      </div>

                      {/* Quick Stats */}
                      <div className="hidden md:flex items-center gap-6 text-sm">
                        <div className="text-center">
                          <p className="font-semibold text-foreground">
                            {server.member_count.toLocaleString()}
                          </p>
                          <p className="text-muted-foreground">Members</p>
                        </div>
                        <div className="text-center">
                          <p className="font-semibold text-foreground">
                            {server.sc_user_count.toLocaleString()}
                          </p>
                          <p className="text-muted-foreground">SC Users</p>
                        </div>
                        <div className="text-center">
                          <p className="font-semibold text-foreground">
                            {server.total_credits.toLocaleString()}
                          </p>
                          <p className="text-muted-foreground">Credits</p>
                        </div>
                        <div className="text-center">
                          <p className="font-semibold text-foreground">
                            {server.total_xp.toLocaleString()}
                          </p>
                          <p className="text-muted-foreground">XP</p>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                      <CollapsibleTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => toggleExpanded(server.id)}
                        >
                          {expandedServers.has(server.id) ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                      </CollapsibleTrigger>
                    </div>
                  </div>

                  {/* Mobile Stats */}
                  <div className="md:hidden mt-4 grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {server.member_count.toLocaleString()} Members
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Crown className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {server.sc_user_count.toLocaleString()} SC Users
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Coins className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {server.total_credits.toLocaleString()} Credits
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-muted-foreground" />
                      <span>{server.total_xp.toLocaleString()} XP</span>
                    </div>
                  </div>
                </div>

                {/* Expandable Content */}
                <CollapsibleContent>
                  <div className="border-t border-border bg-muted/30 p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Server Details */}
                      <div className="bg-background rounded-lg border border-border p-4 space-y-4">
                        <h4 className="font-semibold text-foreground flex items-center gap-2 pb-2 border-b border-border">
                          <Server className="h-4 w-4 text-primary" />
                          Server Information
                        </h4>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50 transition-colors">
                            <span className="text-sm text-muted-foreground flex items-center gap-2">
                              <div className="h-1.5 w-1.5 rounded-full bg-blue-500"></div>
                              Created
                            </span>
                            <span className="text-sm font-medium text-foreground">
                              {new Date(server.created_at).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                }
                              )}
                            </span>
                          </div>
                          <div className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50 transition-colors">
                            <span className="text-sm text-muted-foreground flex items-center gap-2">
                              <div className="h-1.5 w-1.5 rounded-full bg-purple-500"></div>
                              Joined
                            </span>
                            <span className="text-sm font-medium text-foreground">
                              {new Date(server.joined_at).toLocaleDateString(
                                "en-US",
                                {
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                }
                              )}
                            </span>
                          </div>
                          <div className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50 transition-colors">
                            <span className="text-sm text-muted-foreground flex items-center gap-2">
                              <div
                                className={`h-1.5 w-1.5 rounded-full ${
                                  server.is_active
                                    ? "bg-green-500"
                                    : "bg-red-500"
                                }`}
                              ></div>
                              Status
                            </span>
                            <Badge
                              variant={
                              server.is_active ? "default" : "destructive"
                              }
                              className={`text-xs font-semibold ${
                              server.is_active
                                ? "bg-green-100 text-green-800 border-green-200"
                                : ""
                              }`}
                            >
                              {server.is_active ? "● Active" : "● Inactive"}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {/* Server Categories */}
                      <div className="bg-background rounded-lg border border-border p-4 space-y-4">
                        <h4 className="font-semibold text-foreground flex items-center gap-2 pb-2 border-b border-border">
                          <Filter className="h-4 w-4 text-primary" />
                          Categories
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {server.categories.length > 0 ? (
                            server.categories.map((category, index) => (
                              <Badge
                                key={index}
                                variant="secondary"
                                className="text-xs font-medium px-3 py-1 hover:bg-secondary/80 transition-colors"
                              >
                                {category}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-sm text-muted-foreground italic">
                              No categories assigned
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CollapsibleContent>
              </div>
            </Collapsible>
          ))
        ) : (
          <div className="text-center py-8">
            <Server className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              No servers found matching your search.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServerTable;
