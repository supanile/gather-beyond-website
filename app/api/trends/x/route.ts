import { gristTrend } from "@/lib/grist";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const period = searchParams.get("period");

  // If period is specified, return only that specific period
  if (period) {
    const tableName = `X_trending_TH_${period}`;
    try {
      const data = await gristTrend.fetchTable(tableName);
      return NextResponse.json({ [period]: data });
    } catch (error) {
      console.error(error);
      return NextResponse.json(
        {
          error: `Invalid period: ${period}. Available periods: 4h, 1d, 2d, 7d`,
        },
        { status: 400 },
      );
    }
  }

  // If no period specified, return all periods
  const x_trend_1d = await gristTrend.fetchTable("X_trending_TH_1d");
  const x_trend_7d = await gristTrend.fetchTable("X_trending_TH_7d");
  const x_trend_2d = await gristTrend.fetchTable("X_trending_TH_2d");
  const x_trend_4h = await gristTrend.fetchTable("X_trending_TH_4h");

  return NextResponse.json({
    x_trend_4h,
    x_trend_1d,
    x_trend_2d,
    x_trend_7d,
  });
}