import { NextRequest } from 'next/server';
import { db } from '@/lib/server/store';
import { encryptToken } from '@/lib/server/crypto';
import { audit, fail, getAuthOrDemo, ok } from '@/lib/server/http';

/**
 * DELETE /api/v1/social-accounts/:id — RF-008 (revoca token y marca Revocada).
 * POST   /api/v1/social-accounts/:id/refresh — RF-009 (renueva token próximo a expirar).
 */
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = getAuthOrDemo(req);
  const { id } = await params;
  const acc = db.socialAccounts.get(id);
  if (!acc || acc.userId !== auth.userId) return fail('Cuenta no encontrada.', 404);
  acc.status = 'revoked';
  acc.encryptedToken = encryptToken(`revoked-${Date.now()}`);
  audit(auth.userId, 'social.disconnect', 'social_account', id, { platform: acc.platform });
  return ok({ message: 'Cuenta desconectada y token revocado (RF-008).', account: { id, status: acc.status } });
}
