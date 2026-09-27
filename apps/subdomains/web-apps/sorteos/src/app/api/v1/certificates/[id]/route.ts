import { NextRequest } from 'next/server';
import { db } from '@/lib/server/store';
import { fail, ok } from '@/lib/server/http';

/** GET /api/v1/certificates/:id — detalle público con cache 1h (SAD §19). */
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const cert = db.certificates.get(id);
  if (!cert) {
    const g = db.giveaways.list().find((x) => String(x.certificateId) === id);
    if (!g) return fail('Certificado no encontrado.', 404);
    return ok(
      { certificate: { id, giveawayId: g.id, title: g.title, verificationHash: g.verificationHash, issuedAt: g.executedAt } },
      { status: 200, headers: { 'Cache-Control': 'public, s-maxage=3600' } }
    );
  }
  return ok({ certificate: cert }, { status: 200, headers: { 'Cache-Control': 'public, s-maxage=3600' } });
}
