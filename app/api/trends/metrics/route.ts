import { NextRequest, NextResponse } from 'next/server';
import { generateMockTrendsData, processTrendsData } from '@/lib/utils/mockData';
import { TimeRange, LocationFilter } from '@/types/trends';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const timeRange = (searchParams.get('timeRange') as TimeRange) || '24H';
    const location = (searchParams.get('location') as LocationFilter) || 'worldwide';

    // Generate mock data and process metrics
    const trendsData = generateMockTrendsData();
    const metrics = processTrendsData(trendsData);

    console.log(`Fetching metrics for: ${timeRange}, ${location}`);

    return NextResponse.json(metrics, {
      headers: {
        'Cache-Control': 's-maxage=300, stale-while-revalidate',
      },
    });
  } catch (error) {
    console.error('Error fetching trends metrics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch trends metrics' },
      { status: 500 }
    );
  }
}
