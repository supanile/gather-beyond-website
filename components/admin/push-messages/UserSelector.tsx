"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DiscordUser } from "@/types/admin/discordPush";
import { Users, Search, Filter, UserCheck, UserX } from "lucide-react";
import { mockDiscordUsers } from "@/data/admin/discordPushMockData";

interface UserSelectorProps {
  selectedUsers: string[];
  onSelectionChange: (userIds: string[]) => void;
  availableUsers?: DiscordUser[];
}

export function UserSelector({ selectedUsers, onSelectionChange, availableUsers }: UserSelectorProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOnline, setFilterOnline] = useState(false);
  const [users] = useState<DiscordUser[]>(availableUsers || mockDiscordUsers);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.id.includes(searchQuery);
    const matchesOnlineFilter = !filterOnline || user.isOnline;
    return matchesSearch && matchesOnlineFilter;
  });

  const handleUserToggle = (userId: string) => {
    const newSelection = selectedUsers.includes(userId)
      ? selectedUsers.filter(id => id !== userId)
      : [...selectedUsers, userId];
    onSelectionChange(newSelection);
  };

  const handleSelectAll = () => {
    const allFilteredUserIds = filteredUsers.map(user => user.id);
    onSelectionChange([...new Set([...selectedUsers, ...allFilteredUserIds])]);
  };

  const handleDeselectAll = () => {
    const filteredUserIds = new Set(filteredUsers.map(user => user.id));
    onSelectionChange(selectedUsers.filter(id => !filteredUserIds.has(id)));
  };

  const selectedCount = selectedUsers.length;
  const totalUsers = users.length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Users className="w-5 h-5" />
            <span>Select Recipients</span>
            <Badge variant="secondary">
              {selectedCount}/{totalUsers} selected
            </Badge>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleSelectAll}
              disabled={filteredUsers.length === 0}
            >
              <UserCheck className="w-4 h-4 mr-1" />
              Select All
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDeselectAll}
              disabled={selectedCount === 0}
            >
              <UserX className="w-4 h-4 mr-1" />
              Deselect All
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search and Filters */}
        <div className="flex items-center space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search users by username or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="online-filter"
              checked={filterOnline}
              onCheckedChange={(checked) => setFilterOnline(checked as boolean)}
            />
            <label
              htmlFor="online-filter"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Online only
            </label>
            <Filter className="w-4 h-4 text-gray-400" />
          </div>
        </div>

        {/* User List */}
        <div className="max-h-80 overflow-y-auto space-y-2">{/* ลดจาก max-h-96 */}
          {filteredUsers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {users.length === 0 ? "No users found" : "No users match your search criteria"}
            </div>
          ) : (
            filteredUsers.map((user) => {
              const isSelected = selectedUsers.includes(user.id);
              return (
                <div
                  key={user.id}
                  className={`
                    flex items-center space-x-3 p-2 rounded-lg border cursor-pointer transition-all
                    ${isSelected 
                      ? "bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-800" 
                      : "bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750"
                    }
                  `}
                  onClick={() => handleUserToggle(user.id)}
                >
                  <Checkbox
                    checked={isSelected}
                    onChange={() => handleUserToggle(user.id)}
                  />
                  
                  <Avatar className="w-7 h-7">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>
                      {user.username.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="font-medium truncate text-sm">
                        {user.username}
                      </span>
                      <span className="text-xs text-gray-500">
                        #{user.discriminator}
                      </span>
                      <div
                        className={`w-2 h-2 rounded-full ${
                          user.isOnline 
                            ? "bg-green-500" 
                            : "bg-gray-400"
                        }`}
                      />
                    </div>
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <span>ID: {user.id}</span>
                      <span>•</span>
                      <span>Joined: {new Date(user.joinedAt).toLocaleDateString()}</span>
                    </div>
                    {user.roles.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {user.roles.slice(0, 3).map((role) => (
                          <Badge key={role} variant="outline" className="text-xs">
                            {role}
                          </Badge>
                        ))}
                        {user.roles.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{user.roles.length - 3} more
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Selection Summary */}
        {selectedCount > 0 && (
          <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
            <div className="text-sm font-medium text-blue-900 dark:text-blue-100">
              {selectedCount} user{selectedCount !== 1 ? "s" : ""} selected
            </div>
            <div className="text-xs text-blue-700 dark:text-blue-300 mt-1">
              Your message will be sent to these recipients
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
