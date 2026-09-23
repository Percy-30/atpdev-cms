import { NextResponse } from 'next/server';
import { PRICING_PLANS } from '@/lib/types';

export async function GET() {
  return NextResponse.json({
    success: true,
    data: PRICING_PLANS
  });
}
