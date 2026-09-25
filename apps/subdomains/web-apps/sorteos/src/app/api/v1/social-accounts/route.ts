import { NextRequest } from 'next/server';
import { db, uid } from '@/lib/server/store';
import { encryptToken } from '@/lib/server/crypto';
import { audit, fail, getAuthOrDemo, logEvent, ok } from '@/lib/server/http';
import { oauthConnectUrl } from '@/lib/server/socialProviders';
import { cleanStr } from '@/lib/server/validators';

/**
 * GET /api/v1/social-accounts — lista del tenant (RF-005..007).
 * POST /api/v1/social-accounts { platform } — inicia OAuth (retorna authorizeUrl)
 *   o conecta en modo mock-verified con oauthCode de pruebas.
 */
export async function GET(req: NextRequest) {
  const auth = getAuthOrDemo(req);
  const data = [...db.socialAccounts.values()]
    .filter((a) => a.userId === auth.userId)
    .map(({ encryptedToken: _t, ...pub }) => ({
      ...pub,
      handle: pub.handle,
      status: pub.status,
    }));
  // Semilla demo por tenant nuevo (para que el dashboard muestre algo útil)
  if (data.length === 0) {
    const now = Date.now();
    const seed: Array<[string, 'instagram' | 'facebook' | 'youtube', string, string]> = [
      ['acc_ig', 'instagram', 'Cuenta Instagram Business', '@mi_marca'],
      ['acc_fb', 'facebook', 'Página de Facebook', 'facebook.com/mi_marca'],
      ['acc_yt', 'youtube', 'Canal de YouTube', '@MiMarca'],
    ];
    for (const [pfx, platform, name, handle] of seed) {
      const id = `${pfx}_${auth.userId.slice(-6)}`;
      db.socialAccounts.set(id, {
        id, userId: auth.userId, platform, name, handle,
        encryptedToken: encryptToken(`demo-token-${platform}`),
        status: 'connected',
        scopes: platform === 'youtube' ? ['youtube.force-ssl'] : ['pages_show_list'],
        connectedAt: new Date().toISOString(),
        expiresAt: new Date(now + 55 * 24 * 3600 * 1000).toISOString(),
      });
    }
    return GET(req);
  }
  return ok({ data });
}

export async function POST(req: NextRequest) {
  const auth = getAuthOrDemo(req);
  const body = await req.json().catch(() => ({} as Record<string, unknown>));
  const platform = cleanStr(body.platform, 20).toLowerCase();
  if (!['instagram', 'facebook', 'youtube'].includes(platform)) {
    return fail('platform debe ser instagram, facebook o youtube.', 400);
  }
  const oauthCode = cleanStr(body.oauthCode, 200);

  // Sin código: paso 1 del flujo OAuth → devolver URL oficial
  if (!oauthCode) {
    const authorizeUrl = oauthConnectUrl(platform);
    logEvent('social.oauth_start', { userId: auth.userId, platform });
    return ok({
      message: `Inicia OAuth oficial de ${platform}.`,
      authorizeUrl,
      next: `Completa el login y el callback llamará a /api/v1/social-accounts/callback/${platform}?code=…`,
    });
  }

  // Con código (o mock): conecta la cuenta con token cifrado (RF-005..007, RF-009 base)
  const id = uid('acc');
  const now = new Date().toISOString();
  db.socialAccounts.set(id, {
    id,
    userId: auth.userId,
    platform: platform as 'instagram' | 'facebook' | 'youtube',
    name: cleanStr(body.name, 120) || `Cuenta ${platform}`,
    handle: cleanStr(body.handle, 120) || '@mi_cuenta',
    encryptedToken: encryptToken(`oauth-token-${platform}-${oauthCode}-${Date.now()}`),
    status: 'connected',
    scopes: [],
    connectedAt: now,
    expiresAt: new Date(Date.now() + 60 * 24 * 3600 * 1000).toISOString(),
  });
  audit(auth.userId, 'social.connect', 'social_account', id, { platform });
  const { encryptedToken: _t, ...pub } = db.socialAccounts.get(id)!;
  return ok({ message: `Cuenta de ${platform} conectada vía OAuth 2.0.`, account: pub });
}
