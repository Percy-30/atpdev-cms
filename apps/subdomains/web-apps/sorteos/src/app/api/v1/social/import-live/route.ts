import { NextRequest, NextResponse } from 'next/server';
import { db, uid } from '@/lib/server/store';
import { encryptToken } from '@/lib/server/crypto';
import type { Participant } from '@/lib/types';
import fs from 'node:fs';
import path from 'node:path';

// Almacén en memoria para comentarios transferidos en tiempo real desde la pestaña activa del usuario
interface LiveImportRecord {
  postUrl: string;
  tweetId?: string;
  comments: Participant[];
  handle?: string;
  updatedAt: number;
}

// Global para sobrevivir entre recargas de módulos de Next.js en desarrollo
const globalForLive = globalThis as unknown as {
  __liveImports?: Map<string, LiveImportRecord>;
};
const liveImports = globalForLive.__liveImports || new Map<string, LiveImportRecord>();
globalForLive.__liveImports = liveImports;

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-requested-with',
};

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: CORS_HEADERS,
  });
}

function normalizePostUrl(url: string): { normalized: string; tweetId?: string } {
  const clean = url.trim().replace(/[?#].*$/, '').toLowerCase();
  const idMatch = url.match(/(?:status|statuses)\/(\d+)/i) || url.match(/\/(\d{15,})/);
  return {
    normalized: clean,
    tweetId: idMatch ? idMatch[1] : undefined,
  };
}

/**
 * GET /api/v1/social/import-live?postUrl=...
 * Permite a Sorteos Pro consultar en tiempo real si llegaron comentarios desde la pestaña de X
 */
export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const postUrl = url.searchParams.get('postUrl') || '';
  if (!postUrl) {
    return NextResponse.json({ success: false, comments: [], count: 0 }, { headers: CORS_HEADERS });
  }

  const { normalized, tweetId } = normalizePostUrl(postUrl);

  // Buscar por URL normalizada o por ID del tweet
  let match = liveImports.get(normalized);
  if (!match && tweetId) {
    for (const record of liveImports.values()) {
      if (record.tweetId === tweetId) {
        match = record;
        break;
      }
    }
  }

  if (match && match.comments.length > 0) {
    return NextResponse.json(
      {
        success: true,
        count: match.comments.length,
        comments: match.comments,
        handle: match.handle,
        updatedAt: match.updatedAt,
      },
      { headers: CORS_HEADERS }
    );
  }

  return NextResponse.json(
    {
      success: false,
      count: 0,
      comments: [],
    },
    { headers: CORS_HEADERS }
  );
}

/**
 * POST /api/v1/social/import-live
 * Recibe comentarios transferidos en 1 clic desde la pestaña de X donde el usuario ya tiene sesión activa
 */
export async function POST(req: NextRequest) {
  try {
    const body = (await req.json().catch(() => ({}))) as Record<string, any>;
    const rawPostUrl = String(body.postUrl || '').trim();
    const rawComments = Array.isArray(body.comments) ? body.comments : [];
    const cookies = String(body.cookies || body.cookie || '').trim();
    const authToken = String(body.authToken || '').trim();
    const organizerHandle = String(body.handle || '@NACHOAT00').trim();

    if (!rawPostUrl) {
      return NextResponse.json(
        { success: false, error: 'postUrl es requerido' },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    const { normalized, tweetId } = normalizePostUrl(rawPostUrl);

    // Formatear participantes válidos
    const validParticipants: Participant[] = [];
    const seen = new Set<string>();

    for (let i = 0; i < rawComments.length; i++) {
      const c = rawComments[i];
      let username = String(c?.username || c?.user || '').trim().replace(/^@/, '');
      if (!username || username.length < 1 || username.length > 25) continue;
      if (seen.has(username.toLowerCase())) continue;
      seen.add(username.toLowerCase());

      const commentText = String(c?.commentText || c?.text || c?.comment || 'Respuesta en X').trim();
      const timestamp = c?.timestamp ? new Date(c.timestamp).toISOString() : new Date().toISOString();

      validParticipants.push({
        id: `x-live-${tweetId || Date.now()}-${i}`,
        username,
        commentText: commentText.slice(0, 500),
        isEligible: true,
        timestamp,
        network: 'x',
      });
    }

    // Guardar en almacén en vivo
    liveImports.set(normalized, {
      postUrl: rawPostUrl,
      tweetId,
      comments: validParticipants,
      handle: organizerHandle,
      updatedAt: Date.now(),
    });

    // Si se enviaron cookies o auth_token, persistir para futuras consultas automáticas server-side
    let detectedToken = authToken;
    if (!detectedToken && cookies) {
      const match = cookies.match(/auth_token=([^;]+)/);
      if (match) detectedToken = match[1];
    }

    if (detectedToken && detectedToken.length > 20) {
      try {
        // 1. Guardar en db.socialAccounts para el usuario
        const cleanHandle = organizerHandle.startsWith('@') ? organizerHandle : `@${organizerHandle}`;
        const existing = db.socialAccounts.list().find((a) => a.platform === 'x');
        const accId = existing ? existing.id : uid('acc');
        db.socialAccounts.set({
          id: accId,
          userId: 'usr_demo_sorteos_2026',
          platform: 'x',
          name: cleanHandle.replace(/^@/, ''),
          handle: cleanHandle,
          encryptedToken: encryptToken(detectedToken),
          status: 'connected',
          scopes: ['tweet.read', 'users.read', 'comments_read'],
          connectedAt: new Date().toISOString(),
          expiresAt: new Date(Date.now() + 90 * 24 * 3600 * 1000).toISOString(),
        });

        // 2. Persistir en .env.local para que el backend de Node lo reconozca de inmediato
        const envPath = path.join(process.cwd(), '.env.local');
        if (fs.existsSync(envPath)) {
          let envContent = fs.readFileSync(envPath, 'utf8');
          if (envContent.includes('TWITTER_AUTH_TOKEN=')) {
            envContent = envContent.replace(/TWITTER_AUTH_TOKEN=.*/, `TWITTER_AUTH_TOKEN=${detectedToken}`);
          } else {
            envContent += `\n# Token de Sesión Oficial de X (@${cleanHandle.replace(/^@/, '')})\nTWITTER_AUTH_TOKEN=${detectedToken}\n`;
          }
          fs.writeFileSync(envPath, envContent, 'utf8');
        }
        process.env.TWITTER_AUTH_TOKEN = detectedToken;
      } catch {
        // noop
      }
    }

    return NextResponse.json(
      {
        success: true,
        count: validParticipants.length,
        message: `¡${validParticipants.length} comentarios reales sincronizados correctamente!`,
      },
      { headers: CORS_HEADERS }
    );
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err.message || 'Error procesando comentarios en vivo' },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
