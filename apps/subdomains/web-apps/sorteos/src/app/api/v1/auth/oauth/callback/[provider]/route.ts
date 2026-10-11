import { NextRequest, NextResponse } from 'next/server';
import { db, uid } from '@/lib/server/store';
import { hashPassword, signJwt } from '@/lib/server/crypto';
import { audit, fail, logEvent, ok } from '@/lib/server/http';

/**
 * GET /api/v1/auth/oauth/callback/:provider?code=… — RF-002.
 * Con GOOGLE_CLIENT_SECRET/META_APP_SECRET: intercambia el code en server-side
 * y vincula el email real. Sin secretos: modo mock-verified con auditoría completa.
 */
export async function GET(req: NextRequest, { params }: { params: Promise<{ provider: string }> }) {
  const { provider } = await params;
  if (!['google', 'facebook'].includes(provider)) return fail('Proveedor no soportado.', 400);
  const code = new URL(req.url).searchParams.get('code');
  if (!code) return fail('Código OAuth ausente.', 400);

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3006';
  const redirectUri = `${appUrl}/api/v1/auth/oauth/callback/${provider}`;
  const { exchangeOAuthCode } = await import('@/lib/server/socialProviders');
  const live = await exchangeOAuthCode(provider === 'google' ? 'google' : 'meta', code, redirectUri);
  const mode = live ? 'live' : 'mock-verified';

  const providerName = provider === 'google' ? 'Google' : 'Facebook';
  const fallbackEmail = `usuario.${provider}@sorteos.pro`;
  const email = (live?.email || fallbackEmail).toLowerCase();
  let id = db.usersByEmail.get(email);
  if (!id) {
    id = uid('usr');
    const { hash, salt } = hashPassword(`oauth-${provider}-${code}-${Date.now()}`);
    const now = new Date().toISOString();
    db.users.set({ id, name: live?.name || `Usuario ${providerName}`, email, passwordHash: hash, salt,
      role: 'user', status: 'active', plan: 'pro', language: 'es',
      createdAt: now, updatedAt: now,
    });
    db.usersByEmail.set(email, id);
  }
  const user = db.users.get(id)!;
  if (live?.name && (user.name.startsWith('Usuario ') || user.name === 'Creador Demo')) {
    user.name = live.name;
  }

  // Sincronizar inmediatamente con @atpdev/database para reflejo en panel de administración
  try {
    const { syncRealSorteosUser } = await import('@atpdev/database');
    await syncRealSorteosUser({
      id: user.id,
      name: user.name,
      email: user.email,
      plan: user.plan as any,
      status: user.status as any,
    });
  } catch {
    // noop
  }

  // Vincular la red social oficial correspondiente al usuario real
  const socialPlatform = provider === 'google' ? 'youtube' : 'facebook';
  const existingAcc = db.socialAccounts.list().find((a) => a.userId === id && a.platform === socialPlatform);
  if (!existingAcc) {
    const accId = uid('acc');
    const now = new Date().toISOString();
    const handle = `@${email.split('@')[0]}`;
    const accName = live?.name ? `${live.name} (${socialPlatform === 'youtube' ? 'YouTube' : 'Facebook'})` : `Cuenta ${socialPlatform}`;
    const { encryptToken } = await import('@/lib/server/crypto');
    db.socialAccounts.set({
      id: accId,
      userId: id,
      platform: socialPlatform,
      name: accName,
      handle,
      encryptedToken: encryptToken(live?.accessToken || `oauth-${socialPlatform}-${code}`),
      status: 'connected',
      scopes: ['public_profile', 'comments_read'],
      connectedAt: now,
      expiresAt: new Date(Date.now() + 60 * 24 * 3600 * 1000).toISOString(),
    });
  }

  audit(id, 'user.oauth_login', 'user', id, { provider, mode });
  logEvent('auth.oauth', { provider, userId: id, mode });

  const token = signJwt(user.id, user.email, user.role);
  // Redirige al dashboard con sesión (el cliente la guarda en localStorage)
  return NextResponse.redirect(`${appUrl}/dashboard?oauth=${provider}&token=${token}`);
}
