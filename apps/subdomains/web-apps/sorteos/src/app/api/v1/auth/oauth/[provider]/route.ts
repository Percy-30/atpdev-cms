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
  const url =
    provider === 'google'
      ? `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID || 'PENDIENTE'}&redirect_uri=${encodeURIComponent(appUrl + '/api/v1/auth/oauth/callback/google')}&response_type=code&scope=${encodeURIComponent('openid email profile')}`
      : `https://www.facebook.com/v19.0/dialog/oauth?client_id=${process.env.META_APP_ID || 'PENDIENTE'}&redirect_uri=${encodeURIComponent(appUrl + '/api/v1/auth/oauth/callback/facebook')}&scope=${encodeURIComponent('email,public_profile')}&response_type=code`;
  return ok({ provider, authorizeUrl: url, note: 'Completa el App Review de Meta/Google en Sprint 0 (SAD §2.5).' });
}
