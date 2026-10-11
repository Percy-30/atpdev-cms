import { NextRequest } from 'next/server';
import { db } from '@/lib/server/store';
import { encryptToken } from '@/lib/server/crypto';
import { audit, fail, getAuth, getAuthOrDemo, ok } from '@/lib/server/http';

/**
 * DELETE /api/v1/social-accounts/:id — RF-008 (revoca token y marca Revocada).
 * POST   /api/v1/social-accounts/:id/refresh — RF-009 (renueva token próximo a expirar).
 */
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = getAuth(req) || getAuthOrDemo(req);
  const { id } = await params;
  const acc = db.socialAccounts.get(id);
  if (!acc || (auth && acc.userId !== auth.userId)) return fail('Cuenta no encontrada.', 404);
  
  db.socialAccounts.delete(id);
  audit(auth.userId, 'social.disconnect', 'social_account', id, { platform: acc.platform });
  return ok({ message: 'Cuenta social desconectada exitosamente.', account: { id, status: 'revoked' } });
}
