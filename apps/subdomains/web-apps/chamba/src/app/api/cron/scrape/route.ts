import { NextResponse } from 'next/server';
import { runFullJobScraper } from '@atpdev/database';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  console.log('⚡ API Cron: Ejecutando scraper de empleos en vivo...');
  const result = await runFullJobScraper();
  return NextResponse.json(result);
}

export async function POST() {
  console.log('⚡ API Cron POST: Ejecutando scraper de empleos en vivo...');
  const result = await runFullJobScraper();
  return NextResponse.json(result);
}
