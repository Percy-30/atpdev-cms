import { NextResponse } from 'next/server';
import { runFullJobScraper } from '@atpdev/database';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

function isAuthorized(request: Request): boolean {
  const cronSecret = process.env.CRON_SECRET;
  // If CRON_SECRET is set, enforce strict bearer token validation
  if (cronSecret) {
    const authHeader = request.headers.get('authorization');
    return authHeader === `Bearer ${cronSecret}`;
  }
  // If CRON_SECRET is not configured, allow only in local development
  return process.env.NODE_ENV !== 'production';
}

export async function GET(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json(
      { error: 'Unauthorized. Valid Bearer CRON_SECRET required.' },
      { status: 401 }
    );
  }

  console.log('⚡ API Cron: Ejecutando scraper de empleos en vivo...');
  const result = await runFullJobScraper();
  return NextResponse.json(result);
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) {
    return NextResponse.json(
      { error: 'Unauthorized. Valid Bearer CRON_SECRET required.' },
      { status: 401 }
    );
  }

  console.log('⚡ API Cron POST: Ejecutando scraper de empleos en vivo...');
  const result = await runFullJobScraper();
  return NextResponse.json(result);
}
