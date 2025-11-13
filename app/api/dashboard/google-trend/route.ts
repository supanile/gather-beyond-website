import { gristTrend } from '@/lib/grist';
import { NextResponse } from 'next/server';

export async function GET() {
  const gg_trend_1d = await gristTrend.fetchTable("Gg_trending_TH_1d");
  const gg_trend_7d = await gristTrend.fetchTable("Gg_trending_TH_7d");
  const gg_trend_2d = await gristTrend.fetchTable("Gg_trending_TH_2d");
  const gg_trend_4h = await gristTrend.fetchTable("Gg_trending_TH_4h");
  
  return NextResponse.json({
    gg_trend_4h,
    gg_trend_1d,
    gg_trend_2d,
    gg_trend_7d,
  });
}