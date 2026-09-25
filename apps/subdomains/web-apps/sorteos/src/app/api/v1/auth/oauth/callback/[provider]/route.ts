import { NextRequest, NextResponse } from 'next/server';
import { db, uid } from '@/lib/server/store';
import { hashPassword, signJwt } from '@/lib/server/crypto';
import { audit, fail, logEvent, ok } from '@/lib/server/http';

/**
 * GET /api/v1/auth/oauth/callback/:provider?code=… — RF-002.
 * V1: sin credenciales de App Review, valida el `code` como pendiente y
 * crea/vincula usuario en modo mock-verified con auditoría completa.
 * Con `GOOGLE_CLIENT_ID`/`META_APP_ID` configurados, aquí se intercambia
 * el code por access_token en server-side (no implementado hasta Sprint 0).
 */
export async function GET(req: NextRequest, { params }: { params: Promise<{ provider: string }> }) {
  const { provider } = await params;
  const code = new URL(req.url).searchParams.get('code');
  if (!code) return fail('Código OAuth ausente.', 400);

  const email = `oauth_${provider}_${code.slice(0, 8).toLowerCase()}@oauth.sorteos.local`;
  let id = db.usersByEmail.get(email);
  if (!id) {
    id = uid('usr');
    const { hash, salt } = hashPassword(`oauth-${provider}-${code}-${Date.now()}`);
    const now = new Date().toISOString();
    db.users.set(id, {
      id, name: `Usuario ${provider}`, email, passwordHash: hash, salt,
      role: 'user', status: 'active', plan: 'free', language: 'es',
      createdAt: now, updatedAt: now,
    });
    db.usersByEmail.set(email, id);
  }
  const user = db.users.get(id)!;
  audit(id, 'user.oauth_login', 'user', id, { provider, mode: 'mock-verified' });
  logEvent('auth.oauth', { provider, userId: id });

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3006';
  const token = signJwt(user.id, user.email, user.role);
  // Redirige al dashboard con sesión (el cliente la guarda en localStorage)
  return NextResponse.redirect(`${appUrl}/dashboard?oauth=${provider}&token=${token}`);
}
