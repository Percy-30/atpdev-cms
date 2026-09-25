import { NextResponse } from 'next/server';
import { db } from '@/lib/server/store';

/** GET /api/v1/health — liveness + dependencias externas declaradas (SAD §4). */
export async function GET() {
  return NextResponse.json({
    success: true,
    service: 'sorteos-pro',
    version: '1.0.0',
    uptime: process.uptime(),
    deps: {
      meta: process.env.META_APP_ID ? 'configured' : 'pending-app-review',
      google: process.env.GOOGLE_CLIENT_ID ? 'configured' : 'pending-app-review',
      stripe: process.env.STRIPE_SECRET_KEY ? 'live' : 'mock-verified',
      db: 'in-memory (migrar a PostgreSQL vía Repository, SAD §7)',
    },
    counts: {
      users: db.users.size,
      giveaways: db.giveaways.size,
      usageEvents: db.usage.length,
    },
  });
}
