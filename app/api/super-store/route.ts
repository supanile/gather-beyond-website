import { NextResponse } from 'next/server';
import { grist } from '@/lib/grist';

interface HistoryLog {
  id?: number;
  discord_id?: string;
  spend?: number;
  item_id?: number;
  bought_at?: string;
  category?: 'onchain' | 'digital' | 'irl' | 'access' | 'mystery_box' | 'guarantee' | 'raffle';
  item_name?: string;
}

interface CreditUsageStats {
  discord_id: string;
  credits_used_lifetime: number;
  credits_used_30d: number;
  last_expense_reason: string | null;
  last_expense_type: string;
  last_expense_date: string | null;
}

function calculateCreditUsage(historyLogs: HistoryLog[]): CreditUsageStats[] {
  const userStats = new Map<string, {
    totalSpent: number;
    spent30d: number;
    lastExpense: HistoryLog | null;
  }>();

  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  historyLogs.forEach((log) => {
    if (!log.discord_id || !log.spend) return;

    const discordId = log.discord_id;
    const spend = log.spend || 0;
    
    let boughtDate: Date | null = null;
    if (log.bought_at) {
      if (typeof log.bought_at === 'string') {
        boughtDate = new Date(log.bought_at);
      } else if (typeof log.bought_at === 'number') {
        const timestamp = log.bought_at < 10000000000 
          ? log.bought_at * 1000 
          : log.bought_at;
        boughtDate = new Date(timestamp);
      }
    }

    if (!userStats.has(discordId)) {
      userStats.set(discordId, {
        totalSpent: 0,
        spent30d: 0,
        lastExpense: null,
      });
    }

    const stats = userStats.get(discordId)!;
    
    stats.totalSpent += spend;

    if (boughtDate && boughtDate >= thirtyDaysAgo) {
      stats.spent30d += spend;
    }

    if (!stats.lastExpense || 
        (boughtDate && stats.lastExpense.bought_at && 
         boughtDate > new Date(stats.lastExpense.bought_at))) {
      stats.lastExpense = log;
    }
  });

  const results: CreditUsageStats[] = [];
  
  userStats.forEach((stats, discordId) => {
    const lastExpense = stats.lastExpense;
    
    results.push({
      discord_id: discordId,
      credits_used_lifetime: stats.totalSpent,
      credits_used_30d: stats.spent30d,
      last_expense_reason: getExpenseReason(lastExpense),
      last_expense_type: getExpenseType(lastExpense),
      last_expense_date: lastExpense?.bought_at || null,
    });
  });

  return results;
}

function getExpenseReason(log: HistoryLog | null): string | null {
  if (!log) return null;
  
  return log.item_name || 'Unknown Item';
}

function getExpenseType(log: HistoryLog | null): string {
  if (!log) return 'none';
  
  return log.category || 'none';
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const discordId = searchParams.get('discord_id');

    const historyLogs = await grist.fetchTable("History_log") as HistoryLog[];

    let stats = calculateCreditUsage(historyLogs);

    if (discordId) {
      stats = stats.filter(stat => stat.discord_id === discordId);
      
      if (stats.length === 0) {
        return NextResponse.json({
          success: false,
          error: 'User not found or no credit usage data',
          data: null,
        }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        data: stats[0],
      });
    }

    return NextResponse.json({
      success: true,
      count: stats.length,
      data: stats,
    });

  } catch (error) {
    console.error('Error fetching super store credit usage:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch credit usage statistics',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
