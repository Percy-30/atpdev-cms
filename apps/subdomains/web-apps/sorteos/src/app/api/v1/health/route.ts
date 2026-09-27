import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { getAuthOrDemo } from '@/lib/server/http';
import { db } from '@/lib/server/store';

/** GET /api/v1/health — liveness + dependencias externas declaradas (SAD §4). */
export async function GET(req: NextRequest) {
  const auth = getAuthOrDemo(req);
  return NextResponse.json({
    success: true,
    service: 'sorteos-pro',
    version: '1.0.0',
    uptime: process.uptime(),
    deps: {
      meta: process.env.META_APP_ID ? 'configured' : 'pending-app-review',
      google: process.env.GOOGLE_CLIENT_ID ? 'configured' : 'pending-app-review',
      stripe: process.env.STRIPE_SECRET_KEY ? 'live' : 'mock-verified',
    },
    counts: {
      users: db.users.count(),
      giveaways: db.giveaways.countByUser(auth.userId),
      usageEvents: db.usage.total(),
    },
  });
}
