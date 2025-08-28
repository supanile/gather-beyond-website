import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

interface CreditSpending {
  id: string;
  userId: string;
  email: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'diamond';
  creditsSpent: number;
  totalPurchases: number;
  lastPurchaseDate: string;
}

interface CreditSpendingChartProps {
  creditSpending: CreditSpending[];
  isLoading?: boolean;
}

const TIER_COLORS = {
  bronze: '#CD7F32',
  silver: '#C0C0C0',
  gold: '#FFD700',
  platinum: '#E5E4E2',
  diamond: '#B9F2FF',
};

const TIER_LABELS = {
  bronze: 'Bronze',
  silver: 'Silver',
  gold: 'Gold',
  platinum: 'Platinum',
  diamond: 'Diamond',
};

export const CreditSpendingChart: React.FC<CreditSpendingChartProps> = ({
  creditSpending = [],
  isLoading = false
}) => {
  const [viewType, setViewType] = useState<'bar' | 'pie'>('bar');
  const [timeFilter, setTimeFilter] = useState<'all' | '30' | '90' | '365'>('all');

  const filterDataByTime = (data: CreditSpending[]) => {
    if (timeFilter === 'all') return data;
    
    const now = new Date();
    const daysAgo = parseInt(timeFilter);
    const cutoffDate = new Date(now.getTime() - (daysAgo * 24 * 60 * 60 * 1000));
    
    return data.filter(item => new Date(item.lastPurchaseDate) >= cutoffDate);
  };

  const filteredData = filterDataByTime(creditSpending);

  // Aggregate data by tier
  const tierData = Object.entries(TIER_LABELS).map(([tierKey, tierLabel]) => {
    const tierUsers = filteredData.filter(user => user.tier === tierKey);
    const totalSpent = tierUsers.reduce((sum, user) => sum + user.creditsSpent, 0);
    const totalUsers = tierUsers.length;
    const avgSpent = totalUsers > 0 ? totalSpent / totalUsers : 0;

    return {
      tier: tierLabel,
      totalSpent,
      totalUsers,
      avgSpent: Math.round(avgSpent),
      color: TIER_COLORS[tierKey as keyof typeof TIER_COLORS],
    };
  });

  // Top spenders
  const topSpenders = [...filteredData]
    .sort((a, b) => b.creditsSpent - a.creditsSpent)
    .slice(0, 5);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Credits Spending by Tier</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80 bg-muted animate-pulse rounded-lg" />
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Main Chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Credits Spending by Tier</CardTitle>
            <div className="flex items-center space-x-2">
              <Select value={timeFilter} onValueChange={(value: any) => setTimeFilter(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="30">Last 30 Days</SelectItem>
                  <SelectItem value="90">Last 90 Days</SelectItem>
                  <SelectItem value="365">Last Year</SelectItem>
                </SelectContent>
              </Select>
              <Select value={viewType} onValueChange={(value: any) => setViewType(value)}>
                <SelectTrigger className="w-24">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bar">Bar</SelectItem>
                  <SelectItem value="pie">Pie</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              {viewType === 'bar' ? (
                <BarChart data={tierData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="tier" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value: any, name: string) => [
                      name === 'totalSpent' ? `${value.toLocaleString()} Credits` : 
                      name === 'totalUsers' ? `${value} Users` : 
                      `${value} Credits`,
                      name === 'totalSpent' ? 'Total Spent' :
                      name === 'totalUsers' ? 'Total Users' : 'Avg per User'
                    ]}
                  />
                  <Bar dataKey="totalSpent" fill="#8884d8" name="totalSpent" />
                  <Bar dataKey="totalUsers" fill="#82ca9d" name="totalUsers" />
                </BarChart>
              ) : (
                <PieChart>
                  <Pie
                    data={tierData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ tier, totalSpent }) => `${tier}: ${totalSpent.toLocaleString()}`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="totalSpent"
                  >
                    {tierData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: any) => [`${value.toLocaleString()} Credits`, 'Total Spent']} />
                </PieChart>
              )}
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Top Spenders */}
      <Card>
        <CardHeader>
          <CardTitle>Top Spenders</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topSpenders.map((spender, index) => (
              <div key={spender.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-full">
                    <span className="text-sm font-bold text-primary">#{index + 1}</span>
                  </div>
                  <div>
                    <p className="font-medium">{spender.email}</p>
                    <p className="text-sm text-muted-foreground">{spender.totalPurchases} purchases</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg">{spender.creditsSpent.toLocaleString()}</p>
                  <Badge variant="outline" style={{ color: TIER_COLORS[spender.tier] }}>
                    {TIER_LABELS[spender.tier]}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};