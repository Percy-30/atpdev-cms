import { NextRequest } from 'next/server';
import { db, uid } from '@/lib/server/store';
import { audit, fail, getAuthOrDemo, ok } from '@/lib/server/http';

/** POST /api/v1/giveaways/:id/duplicate — RF-018 (plantilla sin ganadores). */
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = getAuthOrDemo(req);
  const { id } = await params;
  const g = db.giveaways.get(id);
  if (!g || g.userId !== auth.userId) return fail('Sorteo no encontrado.', 404);
  const now = new Date().toISOString();
  const copyId = `sorteo_${uid('').replace(/^_/, '')}`;
  const copy = {
    ...g,
    id: copyId,
    title: `${g.title} (Copia)`,
    status: 'draft' as const,
    winners: [],
    substitutes: [],
    participants: [],
    verificationHash: undefined,
    certificateId: undefined,
    executedAt: undefined,
    scheduledAt: undefined,
    createdAt: now,
    updatedAt: now,
    auditLog: [...g.auditLog, `${now} duplicado desde ${id}`],
  };
  db.giveaways.set(copyId, copy);
  audit(auth.userId, 'giveaway.duplicate', 'giveaway', copyId, { from: id });
  return ok({ message: 'Sorteo duplicado como plantilla (RF-018).', giveaway: copy }, 201);
}
