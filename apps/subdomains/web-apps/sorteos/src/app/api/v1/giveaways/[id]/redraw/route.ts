import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/server/store';
import { audit, fail, getAuthOrDemo, ok } from '@/lib/server/http';
import { sha256Server } from '@/lib/server/draw';
import type { Winner } from '@/lib/types';

/**
 * POST /api/v1/giveaways/:id/redraw { disqualifiedWinnerId } — RF-024.
 * Promueve al primer suplente y re-audita el hash.
 */
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = getAuthOrDemo(req);
  const { id } = await params;
  const g = db.giveaways.get(id);
  if (!g || g.userId !== auth.userId) return fail('Sorteo no encontrado.', 404);

  const body = await req.json().catch(() => ({} as Record<string, unknown>));
  const disqualifiedWinnerId = String(body.disqualifiedWinnerId || '');
  if (!disqualifiedWinnerId) return fail('disqualifiedWinnerId es obligatorio.', 400);

  const idx = g.winners.findIndex((w) => w.id === disqualifiedWinnerId);
  if (idx === -1) return fail('Ganador no pertenece a este sorteo.', 404);
  if (!g.substitutes || g.substitutes.length === 0) {
    return fail('Sin suplentes en el pool de reserva.', 422);
  }
  const [next, ...rest] = g.substitutes;
  const promoted: Winner = {
    id: `win_redraw_${Date.now().toString(36)}`,
    participant: next.participant,
    type: 'winner',
    position: g.winners[idx].position,
    selectedAt: new Date().toISOString(),
  };
  const removed = g.winners[idx];
  g.winners[idx] = promoted;
  g.substitutes = rest;
  g.verificationHash = sha256Server(`redraw-${id}-${removed.id}-${promoted.participant.username}-${Date.now()}`);
  g.updatedAt = new Date().toISOString();
  g.auditLog.push(`${promoted.selectedAt} re-sorteo: @${removed.participant.username} descalificado → @${promoted.participant.username}`);
  audit(auth.userId, 'giveaway.redraw', 'giveaway', id, { removed: removed.participant.username, promoted: promoted.participant.username });

  return ok({
    message: `El suplente @${promoted.participant.username} fue promovido a ganador (RF-024).`,
    newWinner: promoted,
    removedWinner: removed,
    remainingSubstitutes: rest,
    auditHash: g.verificationHash,
  });
}
