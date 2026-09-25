import { NextRequest } from 'next/server';
import { db } from '@/lib/server/store';
import { encryptToken } from '@/lib/server/crypto';
import { audit, fail, getAuthOrDemo, ok } from '@/lib/server/http';

/** POST /api/v1/social-accounts/:id/refresh — RF-009 */
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = getAuthOrDemo(req);
  const { id } = await params;
  const acc = db.socialAccounts.get(id);
  if (!acc || acc.userId !== auth.userId) return fail('Cuenta no encontrada.', 404);
  acc.encryptedToken = encryptToken(`refreshed-${acc.platform}-${Date.now()}`);
  acc.status = 'connected';
  acc.refreshedAt = new Date().toISOString();
  acc.expiresAt = new Date(Date.now() + 60 * 24 * 3600 * 1000).toISOString();
  audit(auth.userId, 'social.refresh', 'social_account', id, { platform: acc.platform });
  const { encryptedToken: _t, ...pub } = acc;
  return ok({ message: 'Token renovado automáticamente (RF-009).', account: pub });
}
