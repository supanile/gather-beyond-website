import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const debugInfo = {
      env: {
        NODE_ENV: process.env.NODE_ENV,
        PUBLIC_URL: process.env.PUBLIC_URL,
        VERCEL_URL: process.env.VERCEL_URL,
        GRIST_DOC_URL: process.env.GRIST_DOC_URL ? 'SET' : 'NOT_SET',
        DISCORD_BOT_TOKEN: process.env.DISCORD_BOT_TOKEN ? 'SET' : 'NOT_SET',
      },
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(debugInfo);
  } catch (error) {
    return NextResponse.json(
      { error: 'Debug info failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
