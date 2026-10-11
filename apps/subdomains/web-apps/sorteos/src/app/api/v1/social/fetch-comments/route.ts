import { NextRequest } from 'next/server';
import { db } from '@/lib/server/store';
import { getAuth, getAuthOrDemo, ok, fail, logEvent } from '@/lib/server/http';
import { getAdapter } from '@/lib/server/socialProviders';
import { cleanStr } from '@/lib/server/validators';

/**
 * POST /api/v1/social/fetch-comments
 * Extrae comentarios reales del post o video especificado.
 * Detecta automáticamente si el usuario tiene vinculada la cuenta de la red seleccionada.
 */
export async function POST(req: NextRequest) {
  const auth = getAuth(req) || getAuthOrDemo(req);
  const body = await req.json().catch(() => ({} as Record<string, unknown>));

  const platform = cleanStr(body.platform, 20).toLowerCase();
  let postUrl = cleanStr(body.postUrl, 500).trim();

  if (!['instagram', 'facebook', 'youtube', 'tiktok', 'x', 'threads'].includes(platform)) {
    return fail('Plataforma no soportada. Debe ser instagram, facebook, youtube, tiktok, x o threads.', 400);
  }

  if (!postUrl) {
    return fail('Debes ingresar una URL de la publicación o el @usuario / cuenta.', 400);
  }

  // Normalizar si el usuario solo pegó la cuenta (ej. @mrbeast o nombre_cuenta)
  if (!postUrl.startsWith('http://') && !postUrl.startsWith('https://')) {
    const cleanHandle = postUrl.replace(/^@/, '').trim();
    if (platform === 'youtube') {
      postUrl = `https://www.youtube.com/@${cleanHandle}`;
    } else if (platform === 'tiktok') {
      postUrl = `https://www.tiktok.com/@${cleanHandle}`;
    } else if (platform === 'instagram') {
      postUrl = `https://www.instagram.com/${cleanHandle}/`;
    } else if (platform === 'facebook') {
      postUrl = `https://www.facebook.com/${cleanHandle}`;
    } else if (platform === 'x') {
      postUrl = `https://x.com/${cleanHandle}`;
    } else if (platform === 'threads') {
      postUrl = `https://www.threads.net/@${cleanHandle}`;
    }
  }

  // Detectar cuenta vinculada del usuario actual para esta plataforma
  const connected = db.socialAccounts.list().find(
    (a) => a.userId === auth.userId && a.platform === platform && a.status === 'connected'
  );

  let decryptedToken: string | undefined = undefined;
  if (connected?.encryptedToken) {
    try {
      const { decryptToken } = await import('@/lib/server/crypto');
      decryptedToken = decryptToken(connected.encryptedToken);
    } catch {
      // noop
    }
  }

  const adapter = getAdapter(platform);
  const result = await adapter.fetchComments(postUrl, decryptedToken);

  logEvent('social.fetch_comments_api', {
    userId: auth.userId,
    platform,
    postUrl,
    mode: result.mode,
    count: result.comments.length,
  });

  return ok({
    success: true,
    platform,
    postUrl,
    mode: result.mode,
    latencyMs: result.latencyMs,
    count: result.comments.length,
    comments: result.comments,
    meta: result.meta || null,
    connectedAccount: connected
      ? {
          id: connected.id,
          name: connected.name,
          handle: connected.handle,
          platform: connected.platform,
        }
      : null,
  });
}
