import { NextRequest, NextResponse } from 'next/server';
import { db, uid } from '@/lib/server/store';
import { fail, getAuthOrDemo, ok } from '@/lib/server/http';

/**
 * GET /api/v1/auth/oauth/:provider — RF-002 (Google/Facebook login).
 * Retorna la URL oficial de autorización. El intercambio code→token se hace
 * en el callback server-side (pendiente de credenciales de App Review).
 */
export async function GET(_req: NextRequest, { params }: { params: Promise<{ provider: string }> }) {
  const { provider } = await params;
  if (!['google', 'facebook'].includes(provider)) {
    return fail('Proveedor no soportado. Usa google o facebook.', 400);
  }
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3006';
  const clientId = provider === 'google' ? process.env.GOOGLE_CLIENT_ID : process.env.META_APP_ID;
  const clientSecret = provider === 'google' ? process.env.GOOGLE_CLIENT_SECRET : process.env.META_APP_SECRET;
  const isConfigured = Boolean(
    clientId &&
    clientId !== 'PENDIENTE' &&
    clientId.trim() !== '' &&
    clientSecret &&
    clientSecret !== 'PENDIENTE' &&
    clientSecret.trim() !== ''
  );

  const authorizeUrl = isConfigured
    ? (provider === 'google'
        ? `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${encodeURIComponent(appUrl + '/api/v1/auth/oauth/callback/google')}&response_type=code&scope=${encodeURIComponent('openid email profile')}`
        : `https://www.facebook.com/v19.0/dialog/oauth?client_id=${clientId}&redirect_uri=${encodeURIComponent(appUrl + '/api/v1/auth/oauth/callback/facebook')}&scope=${encodeURIComponent('email,public_profile')}&response_type=code`)
    : `${appUrl}/api/v1/auth/oauth/callback/${provider}?code=dev_${provider}_${Date.now()}`;

  return ok({ 
    provider, 
    configured: isConfigured,
    authorizeUrl, 
    note: isConfigured ? 'OAuth en vivo' : 'OAuth verificado en modo desarrollo' 
  });
}
