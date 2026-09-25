import { NextRequest } from 'next/server';
import { db, uid } from '@/lib/server/store';
import { audit, fail, getAuthOrDemo, ok } from '@/lib/server/http';
import { cleanStr } from '@/lib/server/validators';

/**
 * POST /api/v1/certificates — RF-025/026 (emitir + personalizar por plan).
 * (El detalle público vive en /api/v1/certificates/:id.)
 */

export async function POST(req: NextRequest) {
  const auth = getAuthOrDemo(req);
  const body = await req.json().catch(() => ({} as Record<string, unknown>));
  const giveawayId = cleanStr(body.giveawayId, 80);
  const g = db.giveaways.get(giveawayId);
  if (!g || g.userId !== auth.userId) return fail('Sorteo no encontrado.', 404);
  if (!g.verificationHash) return fail('Ejecuta el sorteo antes de emitir el certificado.', 409);

  const user = db.users.get(auth.userId);
  const canBrand = user?.plan === 'business' || user?.plan === 'enterprise' || user?.plan === 'pro';
  const logoUrl = cleanStr(body.logoUrl, 500);
  const brandColor = cleanStr(body.brandColor, 20);
  const customText = cleanStr(body.customText, 500);
  if ((logoUrl || brandColor || customText) && !canBrand) {
    return fail('La personalización requiere plan Pro o superior (RF-026).', 402);
  }
  const id = g.certificateId || `CERT-SP-${uid('').replace(/^_/, '').slice(-8).toUpperCase()}`;
  const cert = {
    id, giveawayId, userId: auth.userId, title: g.title,
    winnerUsername: g.winners[0]?.participant.username || '',
    verificationHash: g.verificationHash,
    logoUrl: logoUrl || undefined, brandColor: brandColor || undefined, customText: customText || undefined,
    issuedAt: new Date().toISOString(),
  };
  db.certificates.set(id, cert);
  g.certificateId = id;
  audit(auth.userId, 'certificate.issue', 'certificate', id, { giveawayId });
  return ok({ certificate: cert }, 201);
}
