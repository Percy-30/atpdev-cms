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

  const email = (live?.email || `oauth_${provider}_${code.slice(0, 8).toLowerCase()}@oauth.sorteos.local`).toLowerCase();
  let id = db.usersByEmail.get(email);
  if (!id) {
    id = uid('usr');
    const { hash, salt } = hashPassword(`oauth-${provider}-${code}-${Date.now()}`);
    const now = new Date().toISOString();
    db.users.set({ id, name: `Usuario ${provider}`, email, passwordHash: hash, salt,
      role: 'user', status: 'active', plan: 'free', language: 'es',
      createdAt: now, updatedAt: now,
    });
    db.usersByEmail.set(email, id);
  }
  const user = db.users.get(id)!;
  if (live?.name && user.name.startsWith('Usuario ')) user.name = live.name;
  audit(id, 'user.oauth_login', 'user', id, { provider, mode });
  logEvent('auth.oauth', { provider, userId: id, mode });

  const token = signJwt(user.id, user.email, user.role);
  // Redirige al dashboard con sesión (el cliente la guarda en localStorage)
  return NextResponse.redirect(`${appUrl}/dashboard?oauth=${provider}&token=${token}`);
}
