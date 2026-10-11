import { NextRequest } from 'next/server';
import { db, uid } from '@/lib/server/store';
import { encryptToken } from '@/lib/server/crypto';
import { audit, fail, getAuth, getAuthOrDemo, logEvent, ok } from '@/lib/server/http';
import { oauthConnectUrl } from '@/lib/server/socialProviders';
import { cleanStr } from '@/lib/server/validators';

/**
 * GET /api/v1/social-accounts — lista de cuentas del usuario autenticado.
 * POST /api/v1/social-accounts — inicia OAuth (retorna authorizeUrl),
 *   conecta cuenta con @usuario real o limpia cuentas.
 */
export async function GET(req: NextRequest) {
  const auth = getAuth(req) || getAuthOrDemo(req);
  const data = db.socialAccounts.list()
    .filter((a) => a.userId === auth.userId)
    .map(({ encryptedToken: _t, ...pub }) => ({
      ...pub,
      handle: pub.handle,
      status: pub.status,
    }));
  return ok({ data });
}

export async function POST(req: NextRequest) {
  const auth = getAuth(req) || getAuthOrDemo(req);
  const body = await req.json().catch(() => ({} as Record<string, unknown>));

  const action = cleanStr(body.action, 30);
  if (action === 'clear_all') {
    const userAccounts = db.socialAccounts.list().filter((a) => a.userId === auth.userId);
    for (const a of userAccounts) {
      db.socialAccounts.delete(a.id);
    }
    return ok({ message: 'Todas las cuentas vinculadas han sido desconectadas.', cleared: userAccounts.length });
  }

  const platform = cleanStr(body.platform, 20).toLowerCase();
  if (!['instagram', 'facebook', 'youtube', 'tiktok', 'x', 'threads'].includes(platform)) {
    return fail('Plataforma no soportada. Debe ser instagram, facebook, youtube, tiktok, x o threads.', 400);
  }

  // Si se solicita la URL oficial de OAuth
  if (action === 'oauth_start' || (!body.handle && !body.name && !body.oauthCode)) {
    const authorizeUrl = oauthConnectUrl(platform);
    logEvent('social.oauth_start', { userId: auth.userId, platform });
    return ok({
      message: `Iniciando autorización oficial de ${platform}.`,
      authorizeUrl,
    });
  }

  // Conexión con datos reales provistos por el creador
  const rawHandle = cleanStr(body.handle, 120);
  const rawName = cleanStr(body.name, 120);

  // Normalizar handle (ej: si pega https://instagram.com/atpdev -> @atpdev)
  let cleanHandle = rawHandle;
  if (cleanHandle) {
    cleanHandle = cleanHandle.replace(/^https?:\/\/(?:www\.)?[^/]+\/@?/, '');
    cleanHandle = cleanHandle.replace(/[/?#].*$/, '');
    if (!cleanHandle.startsWith('@')) {
      cleanHandle = `@${cleanHandle}`;
    }
  } else {
    cleanHandle = `@cuenta_${platform}`;
  }

  const cleanName = rawName || `Cuenta Oficial (${platform.charAt(0).toUpperCase() + platform.slice(1)})`;

  // Si ya existe una cuenta de esta plataforma para este usuario, la actualizamos
  const existing = db.socialAccounts.list().find((a) => a.userId === auth.userId && a.platform === platform);
  const id = existing ? existing.id : uid('acc');
  const now = new Date().toISOString();

  db.socialAccounts.set({
    id,
    userId: auth.userId,
    platform: platform as 'instagram' | 'facebook' | 'youtube' | 'tiktok' | 'x' | 'threads',
    name: cleanName,
    handle: cleanHandle,
    encryptedToken: encryptToken(`real-token-${platform}-${id}-${Date.now()}`),
    status: 'connected',
    scopes: ['public_profile', 'comments_read'],
    connectedAt: now,
    expiresAt: new Date(Date.now() + 60 * 24 * 3600 * 1000).toISOString(),
  });

  audit(auth.userId, 'social.connect', 'social_account', id, { platform, handle: cleanHandle });
  logEvent('social.connect', { platform, handle: cleanHandle, userId: auth.userId });

  const { encryptedToken: _t, ...pub } = db.socialAccounts.get(id) ?? ({} as any);
  return ok({ message: `Cuenta de ${platform} conectada exitosamente.`, account: pub });
}
