import React, { useState } from 'react';
import { Gift, Clock, CheckCircle, Truck, Filter, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Winner {
  id: string;
  userId: string;
  email: string;
  discordId: string;
  prizeTitle: string;
  prizeDescription: string;
  prizeValue: number;
  winDate: string;
  status: 'pending' | 'claimed' | 'delivered';
  category: 'raffle' | 'contest' | 'milestone' | 'special';
}

interface WinnersListProps {
  winners: Winner[];
  isLoading?: boolean;
}

const STATUS_CONFIG = {
  pending: { color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300', icon: Clock },
  claimed: { color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300', icon: CheckCircle },
  delivered: { color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300', icon: Truck },
};

const CATEGORY_CONFIG = {
  raffle: { color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300', label: 'Raffle' },
  contest: { color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300', label: 'Contest' },
  milestone: { color: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300', label: 'Milestone' },
  special: { color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300', label: 'Special' },
};

export const WinnersList: React.FC<WinnersListProps> = ({
  winners = [],
  isLoading = false
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter winners based on search and filters
  const filteredWinners = winners.filter(winner => {
    const matchesSearch = winner.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         winner.prizeTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         winner.discordId.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || winner.status === statusFilter;
    const matchesCategory = categoryFilter === 'all' || winner.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const totalPages = Math.ceil(filteredWinners.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedWinners = filteredWinners.slice(startIndex, startIndex + itemsPerPage);

  // Calculate statistics
  const stats = {
    totalWinners: winners.length,
    totalValue: winners.reduce((sum, winner) => sum + winner.prizeValue, 0),
    pending: winners.filter(w => w.status === 'pending').length,
    claimed: winners.filter(w => w.status === 'claimed').length,
    delivered: winners.filter(w => w.status === 'delivered').length,
  };

  const resetFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setCategoryFilter('all');
    setCurrentPage(1);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Winners List</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-4 p-4 border border-border rounded-lg animate-pulse">
                <div className="w-12 h-12 bg-muted rounded-lg" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </div>
                <div className="space-y-2">
                  <div className="h-6 bg-muted rounded w-20" />
                  <div className="h-4 bg-muted rounded w-16" />
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
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Gift className="w-5 h-5" />
              Winners List
            </CardTitle>
            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
              <span>Total: {stats.totalWinners}</span>
              <span>Value: ${stats.totalValue.toLocaleString()}</span>
              <span>Pending: {stats.pending}</span>
            </div>
          </div>
          
          {/* Filters */}
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search winners..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 w-64"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="claimed">Claimed</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="raffle">Raffle</SelectItem>
                <SelectItem value="contest">Contest</SelectItem>
                <SelectItem value="milestone">Milestone</SelectItem>
                <SelectItem value="special">Special</SelectItem>
              </SelectContent>
            </Select>
            
            {(searchQuery || statusFilter !== 'all' || categoryFilter !== 'all') && (
              <Button variant="outline" size="sm" onClick={resetFilters}>
                Reset
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-3 p-6">
          {paginatedWinners.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Gift className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No winners found matching your criteria.</p>
            </div>
          ) : (
            paginatedWinners.map((winner) => {
              const StatusIcon = STATUS_CONFIG[winner.status].icon;
              return (
                <div key={winner.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:shadow-md transition-all duration-200">
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg text-white">
                      <Gift className="w-6 h-6" />
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-semibold text-foreground">{winner.prizeTitle}</h4>
                        <Badge variant="outline" className={CATEGORY_CONFIG[winner.category].color}>
                          {CATEGORY_CONFIG[winner.category].label}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">{winner.prizeDescription}</p>
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>{winner.email}</span>
                        <span>•</span>
                        <span>ID: {winner.discordId}</span>
                        <span>•</span>
                        <span>{new Date(winner.winDate).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className={STATUS_CONFIG[winner.status].color}>
                        <StatusIcon className="w-3 h-3 mr-1" />
                        {winner.status.charAt(0).toUpperCase() + winner.status.slice(1)}
                      </Badge>
                    </div>
                    <p className="font-bold text-lg text-primary">${winner.prizeValue.toLocaleString()}</p>
                  </div>
                </div>
              );
            })
          )}
        </div>
        
        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-border">
            <div className="text-sm text-muted-foreground">
              Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredWinners.length)} of {filteredWinners.length} winners
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
              <span className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </span>
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