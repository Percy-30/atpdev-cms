import { NextRequest } from 'next/server';
import { fail, ok } from '@/lib/server/http';
import { oauthConnectUrl } from '@/lib/server/socialProviders';

/**
 * GET /api/v1/auth/oauth/:provider — RF-002.
 * Retorna la URL oficial de autorización OAuth para todas las redes soportadas.
 */
export async function GET(req: NextRequest, { params }: { params: Promise<{ provider: string }> }) {
  const { provider } = await params;
  const validProviders = ['google', 'facebook', 'x', 'twitter', 'tiktok', 'instagram', 'threads', 'youtube'];
  if (!validProviders.includes(provider.toLowerCase())) {
    return fail('Proveedor no soportado. Usa google, facebook, x, tiktok, instagram, threads o youtube.', 400);
  }

  const returnTo = req.nextUrl.searchParams.get('returnTo') || '';
  const authorizeUrl = oauthConnectUrl(provider.toLowerCase(), returnTo);

  return ok({ 
    provider, 
    authorizeUrl, 
    configured: true,
    note: 'OAuth oficial listo' 
  });
}
