import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/server/store';
import { fail, getAuthOrDemo, ok } from '@/lib/server/http';

/** GET /api/v1/giveaways/:id/winners — ganadores y suplentes. */
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const g = db.giveaways.get(id);
  if (!g) return fail('Sorteo no encontrado.', 404);
  const isPublic = new URL(req.url).searchParams.get('public') === '1';
  if (!isPublic) {
    const auth = getAuthOrDemo(req);
    if (g.userId !== auth.userId) return fail('No autorizado.', 403);
  }
  return ok({ giveawayId: id, winners: g.winners, substitutes: g.substitutes, verificationHash: g.verificationHash });
}
