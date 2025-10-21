export interface HistoryLog {
  id?: number;
  discord_id?: string;
  spend?: number;
  item_id?: number;
  bought_at?: string;
  category?: 'onchain' | 'digital' | 'irl' | 'access' | 'mystery_box' | 'guarantee' | 'raffle';
  item_name?: string;
}

export interface GachaResult {
  id?: number;
  discord_id?: string;
  item_id?: number;
  roll_time?: string;
  won_prize?: string;
  won_prize_id?: number;
  is_win?: number;
  claimed?: number;
  claim_id?: string | number | null;
  price_paid?: number;
}

export interface CreditUsageStats {
  discord_id: string;
  credits_used_lifetime: number;
  credits_used_30d: number;
  last_expense_reason: string | null;
  last_expense_type: 'onchain' | 'digital' | 'irl' | 'access' | 'mystery_box' | 'guarantee' | 'raffle' | 'none';
  last_expense_date: string | null;
}

export interface CreditUsageResponse {
  success: boolean;
  count?: number;
  data: CreditUsageStats | CreditUsageStats[] | null;
  error?: string;
  details?: string;
}

export interface StoreItem {
  id?: number;
  id2?: string;
  name?: string;
  description?: string;
  quantity?: number;
  category?: 'gacha' | 'direct' | 'limited' | 'exclusive';
  deliveryMethod?: 'auto' | 'manual' | 'claim';
  deliverData?: string;
  roleRequirement?: string;
  status?: 'active' | 'inactive' | 'soldout';
}

export interface PaymentOption {
  id?: number;
  item_id?: number;
  currency?: 'credits' | 'usd' | 'points';
  amount?: number;
  itemName?: string;
}
