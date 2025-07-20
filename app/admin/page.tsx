"use client";

import { useState, useEffect } from "react";
import { Search, Users, Globe, Target } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import AdminStatCard from "@/components/admin/AdminStatCard";
import AdminUserRow from "@/components/admin/AdminUserRow";
import { calculateStats } from "@/lib/admin/adminUtils";
import { mockUsers, mockMissions } from "@/data/admin/adminMockData";

interface AdminStats {
  totalUsers: number;
  totalMissions: number;
  totalCommunities: number;
}

const AdminPage = () => {
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState<boolean>(true);

  useEffect(() => {
    const loadStats = async () => {
      setIsLoadingStats(true);
      const calculatedStats = await calculateStats(mockUsers);
      setStats(calculatedStats);
      setIsLoadingStats(false);
    };
    loadStats();
  }, []);

  const filteredUsers = mockUsers.filter(
    (user) =>
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.interests.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.twitter_handle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <AdminLayout currentTime={currentTime}>
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoadingStats ? (
            <p className="text-muted-foreground">Loading stats...</p>
          ) : (
            <>
              <AdminStatCard
                title="Total Users"
                value={stats?.totalUsers.toLocaleString() ?? "0"}
                icon={Users}
              />
              <AdminStatCard
                title="Total Missions"
                value={stats?.totalMissions.toLocaleString() ?? "0"}
                icon={Target}
              />
              <AdminStatCard
                title="Total Communities"
                value={stats?.totalCommunities.toLocaleString() ?? "0"}
                icon={Globe}
              />
            </>
          )}
        </div>

        {/* User Dashboard */}
        <div className="bg-card rounded-2xl shadow-sm border border-border p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-foreground">
              User Dashboard
            </h3>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">
                {filteredUsers.length} users
              </span>
            </div>
          </div>
          
          {/* Search Input */}
          <div className="relative mb-6">
            <Search className="w-5 h-5 text-muted-foreground absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search users by email, interests, or Twitter..."
              className="w-full pl-10 pr-4 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-ring focus:border-transparent text-foreground placeholder:text-muted-foreground"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* User List */}
          <div className="space-y-4">
            {filteredUsers.map((user) => (
              <AdminUserRow
                key={user._id}
                user={user}
                missions={mockMissions}
              />
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminPage;