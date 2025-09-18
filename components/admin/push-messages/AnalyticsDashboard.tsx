"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts";
import { TrendingUp, TrendingDown, MessageSquare, Users, Eye, MousePointer } from "lucide-react";
import { mockAnalyticsData } from "@/data/admin/discordPushMockData";

export function AnalyticsDashboard() {
  const {
    totalMessages,
    totalRecipients,
    deliveryRate,
    openRate,
    clickThroughRate,
    recentActivity
  } = mockAnalyticsData;

  const engagementData = [
    { name: "Delivery Rate", value: deliveryRate, color: "#3B82F6" },
    { name: "Open Rate", value: openRate, color: "#8B5CF6" },
    { name: "Click Rate", value: clickThroughRate, color: "#F59E0B" }
  ];

  const StatCard = ({ 
    title, 
    value, 
    subtitle, 
    icon: Icon, 
    trend, 
    trendValue 
  }: {
    title: string;
    value: string | number;
    subtitle: string;
    icon: React.ElementType;
    trend?: "up" | "down";
    trendValue?: string;
  }) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <Icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                {title}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {value}
              </p>
            </div>
          </div>
          {trend && trendValue && (
            <div className={`flex items-center space-x-1 ${
              trend === "up" 
                ? "text-green-600 dark:text-green-400" 
                : "text-red-600 dark:text-red-400"
            }`}>
              {trend === "up" ? (
                <TrendingUp className="w-4 h-4" />
              ) : (
                <TrendingDown className="w-4 h-4" />
              )}
              <span className="text-sm font-medium">{trendValue}</span>
            </div>
          )}
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
          {subtitle}
        </p>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Analytics Dashboard
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Monitor your Discord message performance and engagement
          </p>
        </div>
        <Badge variant="outline" className="px-3 py-1">
          Last 7 days
        </Badge>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Messages"
          value={totalMessages}
          subtitle="Messages sent this period"
          icon={MessageSquare}
          trend="up"
          trendValue="+12%"
        />
        <StatCard
          title="Total Recipients"
          value={totalRecipients}
          subtitle="Unique users reached"
          icon={Users}
          trend="up"
          trendValue="+8%"
        />
        <StatCard
          title="Delivery Rate"
          value={`${deliveryRate}%`}
          subtitle="Successfully delivered"
          icon={TrendingUp}
          trend="up"
          trendValue="+2.1%"
        />
        <StatCard
          title="Engagement Rate"
          value={`${openRate}%`}
          subtitle="Messages opened"
          icon={Eye}
          trend="down"
          trendValue="-1.5%"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Activity Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Message Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={recentActivity}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                  contentStyle={{
                    backgroundColor: 'var(--background)',
                    border: '1px solid var(--border)',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="sent" fill="#3B82F6" name="Sent" radius={[4, 4, 0, 0]} />
                <Bar dataKey="delivered" fill="#22C55E" name="Delivered" radius={[4, 4, 0, 0]} />
                <Bar dataKey="opened" fill="#8B5CF6" name="Opened" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Engagement Metrics */}
        <Card>
          <CardHeader>
            <CardTitle>Engagement Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {engagementData.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{item.name}</span>
                    <span className="text-sm font-bold">{item.value}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${item.value}%`,
                        backgroundColor: item.color
                      }}
                    />
                  </div>
                </div>
              ))}
              
              <div className="pt-4 mt-6 border-t">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-lg font-bold text-green-600 dark:text-green-400">
                      {clickThroughRate}%
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Click Rate
                    </div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                      2.3x
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Industry Avg
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Trend */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Trend</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={recentActivity}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="date"
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip 
                labelFormatter={(value) => new Date(value).toLocaleDateString()}
                contentStyle={{
                  backgroundColor: 'var(--background)',
                  border: '1px solid var(--border)',
                  borderRadius: '8px'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="sent" 
                stroke="#3B82F6" 
                strokeWidth={3}
                dot={{ fill: "#3B82F6", strokeWidth: 2, r: 4 }}
                name="Messages Sent"
              />
              <Line 
                type="monotone" 
                dataKey="opened" 
                stroke="#8B5CF6" 
                strokeWidth={3}
                dot={{ fill: "#8B5CF6", strokeWidth: 2, r: 4 }}
                name="Messages Opened"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6 text-center">
            <MousePointer className="w-8 h-8 mx-auto mb-3 text-orange-500" />
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {clickThroughRate}%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Average Click Rate
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <TrendingUp className="w-8 h-8 mx-auto mb-3 text-green-500" />
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              +15.2%
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Growth vs Last Week
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <Users className="w-8 h-8 mx-auto mb-3 text-blue-500" />
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              45
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              Active Recipients
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
