import { NextRequest } from 'next/server';
import { db } from '@/lib/server/store';
import { fail, ok } from '@/lib/server/http';

/** GET /api/v1/certificates/:id — detalle público del certificado con auditoría criptográfica. */
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const cert = db.certificates.get(id);

  // Buscar giveaway asociado
  const g = db.giveaways.list().find((x) => String(x.certificateId) === id || x.id === id);

  if (!cert && !g) {
    return fail('Certificado no encontrado.', 404);
  }

  const winner = g?.winners?.[0]?.participant;
  const certificateData = {
    id: cert?.id || id,
    giveawayId: g?.id || cert?.giveawayId || '',
    title: g?.title || cert?.title || 'Sorteo Oficial Verificado',
    giveawayTitle: g?.title || cert?.title || 'Sorteo Oficial Verificado',
    network: g?.network || g?.platform || 'youtube',
    platform: g?.platform || g?.network || 'youtube',
    winnerUsername: winner?.username || cert?.winnerUsername || '',
    winnerComment: winner?.commentText || '',
    winners: g?.winners || [],
    substitutes: g?.substitutes || [],
    winnersCount: g?.winners?.length || 1,
    substitutesCount: g?.substitutes?.length || 0,
    totalParticipants: g?.totalCommentsCount || 0,
    verificationHash: cert?.verificationHash || g?.verificationHash || '',
    issuedAt: cert?.issuedAt || g?.executedAt || g?.createdAt || new Date().toISOString(),
  };

  return ok({ certificate: certificateData }, { status: 200, headers: { 'Cache-Control': 'public, s-maxage=3600' } });
}
