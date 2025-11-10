import { NextRequest, NextResponse } from 'next/server';
import { generateMockTrendsData } from '@/lib/utils/mockData';
import { TimeRange, LocationFilter, LanguageFilter } from '@/types/trends';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const timeRange = (searchParams.get('timeRange') as TimeRange) || '24H';
    const location = (searchParams.get('location') as LocationFilter) || 'worldwide';
    const language = (searchParams.get('language') as LanguageFilter) || 'all';

    // For now, return mock data
    // In production, this would connect to Twitter API with these parameters
    const trendsData = generateMockTrendsData();

    // Log parameters for debugging
    console.log(`Fetching trends for: ${timeRange}, ${location}, ${language}`);

    return NextResponse.json(trendsData, {
      headers: {
        'Cache-Control': 's-maxage=300, stale-while-revalidate', // Cache for 5 minutes
      },
    });
  } catch (error) {
    console.error('Error fetching trends:', error);
    return NextResponse.json(
      { error: 'Failed to fetch trends data' },
      { status: 500 }
    );
  }
}
