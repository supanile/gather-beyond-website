"use client";

import { useState, useEffect } from "react";
import { Search, Menu, Users, Globe, Target } from "lucide-react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminStatCard from "@/components/admin/AdminStatCard";
import AdminUserRow from "@/components/admin/AdminUserRow";
import { calculateStats } from "@/lib/admin/adminUtils";
import { mockUsers, mockMissions } from "@/data/admin/adminMockData";

const AdminPage = () => {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [stats, setStats] = useState<any>(null);
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
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100"
              >
                <Menu className="w-6 h-6 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-sm text-gray-500">
                  {currentTime.toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>

            {/* Search and Notification area */}
            {/* <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-lg relative">
                <Bell className="w-6 h-6 text-gray-600" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
              </button>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-medium">
                  A
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-900">
                    Admin User
                  </p>
                  <p className="text-xs text-gray-500">admin@example.com</p>
                </div>
              </div> 
            </div>*/}
          </div>
        </header>
        <main className="flex-1 overflow-auto p-6">
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoadingStats ? (
                <p>Loading stats...</p>
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
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  User Dashboard
                </h3>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">
                    {filteredUsers.length} users
                  </span>
                </div>
              </div>
              <div className="relative mb-6">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search users by email, interests, or Twitter..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
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
        </main>
      </div>
    </div>
  );
};

export default AdminPage;
