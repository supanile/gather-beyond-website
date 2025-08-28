import React, { useState } from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown, Crown, Medal, Trophy, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface Claimer {
  id: string;
  userId: string;
  email: string;
  discordId: string;
  joinDate: string;
  level: number;
  totalXp: number;
  mood: string;
  rank: number;
}

type SortField = 'rank' | 'level' | 'totalXp' | 'joinDate';
type SortDirection = 'asc' | 'desc';

interface ClaimersRankingTableProps {
  claimers: Claimer[];
  isLoading?: boolean;
}

export const ClaimersRankingTable: React.FC<ClaimersRankingTableProps> = ({
  claimers = [],
  isLoading = false
}) => {
  const [sortField, setSortField] = useState<SortField>('rank');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    setCurrentPage(1);
  };

  const sortedClaimers = [...claimers].sort((a, b) => {
    let aValue: any = a[sortField];
    let bValue: any = b[sortField];

    if (sortField === 'joinDate') {
      aValue = new Date(aValue).getTime();
      bValue = new Date(bValue).getTime();
    }

    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  const totalPages = Math.ceil(sortedClaimers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedClaimers = sortedClaimers.slice(startIndex, startIndex + itemsPerPage);

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="w-5 h-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-400" />;
    if (rank === 3) return <Trophy className="w-5 h-5 text-amber-600" />;
    return <span className="text-sm font-bold text-muted-foreground">#{rank}</span>;
  };

  const getMoodBadge = (mood: string) => {
    const moodColors = {
      happy: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300',
      excited: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300',
      neutral: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300',
      focused: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300',
      motivated: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300',
    };
    
    return (
      <Badge variant="outline" className={moodColors[mood as keyof typeof moodColors] || moodColors.neutral}>
        {mood}
      </Badge>
    );
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return <ArrowUpDown className="w-4 h-4" />;
    return sortDirection === 'asc' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Top Claimers Ranking</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-4 p-4 border border-border rounded-lg animate-pulse">
                <div className="w-8 h-8 bg-muted rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-16" />
                  <div className="h-3 bg-muted rounded w-12" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Claimers Ranking</CardTitle>
        <p className="text-sm text-muted-foreground">
          Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, sortedClaimers.length)} of {sortedClaimers.length} claimers
        </p>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort('rank')}
                    className="font-medium flex items-center gap-2"
                  >
                    Rank {getSortIcon('rank')}
                  </Button>
                </th>
                <th className="text-left p-4">
                  <span className="font-medium">User</span>
                </th>
                <th className="text-left p-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort('level')}
                    className="font-medium flex items-center gap-2"
                  >
                    Level {getSortIcon('level')}
                  </Button>
                </th>
                <th className="text-left p-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort('totalXp')}
                    className="font-medium flex items-center gap-2"
                  >
                    Total XP {getSortIcon('totalXp')}
                  </Button>
                </th>
                <th className="text-left p-4">
                  <span className="font-medium">Mood</span>
                </th>
                <th className="text-left p-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort('joinDate')}
                    className="font-medium flex items-center gap-2"
                  >
                    Join Date {getSortIcon('joinDate')}
                  </Button>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {paginatedClaimers.map((claimer) => (
                <tr key={claimer.id} className="hover:bg-muted/50 transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {getRankIcon(claimer.rank)}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback>
                          <User className="w-4 h-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">{claimer.email}</p>
                        <p className="text-xs text-muted-foreground">ID: {claimer.discordId}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <Badge variant="outline" className="font-bold">
                      Lv.{claimer.level}
                    </Badge>
                  </td>
                  <td className="p-4">
                    <span className="font-medium text-primary">
                      {claimer.totalXp.toLocaleString()} XP
                    </span>
                  </td>
                  <td className="p-4">
                    {getMoodBadge(claimer.mood)}
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-muted-foreground">
                      {new Date(claimer.joinDate).toLocaleDateString()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-border">
            <div className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};