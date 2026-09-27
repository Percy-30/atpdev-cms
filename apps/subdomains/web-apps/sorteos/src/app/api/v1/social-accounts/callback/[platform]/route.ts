import { NextRequest, NextResponse } from 'next/server';
import { db, uid } from '@/lib/server/store';
import { encryptToken } from '@/lib/server/crypto';
import { audit, logEvent } from '@/lib/server/http';

/**
 * GET /api/v1/social-accounts/callback/:platform?code=…&state=<userId> — RF-005..007.
 * Con secretos de app: intercambia el code en server-side y guarda el token real
 * cifrado. Sin secretos: modo mock-verified auditable.
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
      db.users.set({
        id: ownerId, name: 'Creador Demo', email: demoEmail,
        passwordHash: 'demo', salt: 'demo', role: 'user', status: 'active',
        plan: 'pro', language: 'es', createdAt: now, updatedAt: now,
      });
      db.usersByEmail.set(demoEmail, ownerId);
    }
  }
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3006';
  const redirectUri = `${appUrl}/api/v1/social-accounts/callback/${platform}`;
  const { exchangeOAuthCode } = await import('@/lib/server/socialProviders');
  const live = await exchangeOAuthCode(platform === 'youtube' ? 'google' : 'meta', code, redirectUri);
  const mode = live ? 'live' : 'mock-verified';
  const id = uid('acc');
  const now = new Date().toISOString();
  db.socialAccounts.set({
    id,
    userId: ownerId,
    platform: (['instagram', 'facebook', 'youtube'].includes(platform) ? platform : 'instagram') as 'instagram' | 'facebook' | 'youtube',
    name: live?.name ? `${live.name} (${platform})` : `Cuenta ${platform}`,
    handle: live?.email || '@mi_cuenta',
    encryptedToken: encryptToken(live?.accessToken || `oauth-${platform}-${code}`),
    status: 'connected',
    scopes: [],
    connectedAt: now,
    expiresAt: new Date(Date.now() + 60 * 24 * 3600 * 1000).toISOString(),
  });
  audit(ownerId, 'social.connect', 'social_account', id, { platform, mode });
  logEvent('social.oauth_callback', { platform, userId: ownerId, mode });
  return NextResponse.redirect(`${appUrl}/dashboard?connected=${platform}`);
}
