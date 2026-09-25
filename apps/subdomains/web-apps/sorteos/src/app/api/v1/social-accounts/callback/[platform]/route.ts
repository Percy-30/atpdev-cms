import { NextRequest, NextResponse } from 'next/server';
import { db, uid } from '@/lib/server/store';
import { encryptToken } from '@/lib/server/crypto';
import { audit, logEvent } from '@/lib/server/http';

/**
 * GET /api/v1/social-accounts/callback/:platform?code=… — RF-005..007.
 * Intercambia el code OAuth (mock-verified hasta App Review) y redirige al dashboard.
 */
export async function GET(req: NextRequest, { params }: { params: Promise<{ platform: string }> }) {
  const { platform } = await params;
  const code = new URL(req.url).searchParams.get('code') || `mock-${Date.now().toString(36)}`;
  const userId = new URL(req.url).searchParams.get('state') || 'demo-default';
  // Nota: en producción el `state` lleva el userId firmado; aquí resolvemos demo por simplicidad.
  const demoEmail = `${userId}@demo.sorteos.local`;
  let ownerId = db.usersByEmail.get(demoEmail);
  if (!ownerId) {
    ownerId = `usr_demo_${userId.replace(/[^a-z0-9]/gi, '').toLowerCase() || 'default'}`;
    if (!db.users.has(ownerId)) {
      const now = new Date().toISOString();
      db.users.set(ownerId, {
        id: ownerId, name: 'Creador Demo', email: demoEmail,
        passwordHash: 'demo', salt: 'demo', role: 'user', status: 'active',
        plan: 'pro', language: 'es', createdAt: now, updatedAt: now,
      });
      db.usersByEmail.set(demoEmail, ownerId);
    }
  }
  const id = uid('acc');
  const now = new Date().toISOString();
  db.socialAccounts.set(id, {
    id,
    userId: ownerId,
    platform: (['instagram', 'facebook', 'youtube'].includes(platform) ? platform : 'instagram') as 'instagram' | 'facebook' | 'youtube',
    name: `Cuenta ${platform}`,
    handle: '@mi_cuenta',
    encryptedToken: encryptToken(`oauth-${platform}-${code}`),
    status: 'connected',
    scopes: [],
    connectedAt: now,
    expiresAt: new Date(Date.now() + 60 * 24 * 3600 * 1000).toISOString(),
  });
  audit(ownerId, 'social.connect', 'social_account', id, { platform, mode: 'oauth-callback' });
  logEvent('social.oauth_callback', { platform, userId: ownerId });
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3006';
  return NextResponse.redirect(`${appUrl}/dashboard?connected=${platform}`);
}
