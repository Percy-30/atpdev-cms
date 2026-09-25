import { NextRequest } from 'next/server';
import { db } from '@/lib/server/store';
import { audit, fail, getAuthOrDemo, ok } from '@/lib/server/http';
import { cleanStr, toInt } from '@/lib/server/validators';

/**
 * GET /api/v1/giveaways/:id — detalle (landing pública si ?public=1 o estado finalizado).
 * PATCH /api/v1/giveaways/:id — editar borrador/programado o cancelar.
 * DELETE /api/v1/giveaways/:id — cancelar (Cancelado).
 */
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const g = db.giveaways.get(id);
  if (!g) return fail('Sorteo no encontrado.', 404);
  const isPublic = new URL(req.url).searchParams.get('public') === '1';
  if (!isPublic) {
    const auth = getAuthOrDemo(req);
    if (g.userId !== auth.userId) return fail('No autorizado.', 403);
  }
  // Cache-aside: el cliente/CDN cachea 60s la landing pública (SAD §19)
  return ok(
    { giveaway: g },
    { status: 200, headers: isPublic ? { 'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30' } : {} }
  );
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = getAuthOrDemo(req);
  const { id } = await params;
  const g = db.giveaways.get(id);
  if (!g || g.userId !== auth.userId) return fail('Sorteo no encontrado.', 404);
  if (['finished', 'completed', 'cancelled'].includes(g.status)) {
    return fail('Un sorteo finalizado/cancelado no se puede editar. Duplícalo (RF-018).', 409);
  }
  const body = await req.json().catch(() => ({} as Record<string, unknown>));
  if (body.title !== undefined) {
    const t = cleanStr(body.title, 140);
    if (!t) return fail('Título vacío.', 400);
    g.title = t;
  }
  if (body.description !== undefined) g.description = cleanStr(body.description, 2000) || undefined;
  if (body.scheduledAt !== undefined) {
    const s = cleanStr(body.scheduledAt, 40);
    if (s && Number.isNaN(Date.parse(s))) return fail('scheduledAt inválida.', 400);
    g.scheduledAt = s || undefined;
    g.status = s ? 'scheduled' : 'draft';
  }
  if (body.status === 'cancelled') g.status = 'cancelled';
  if (body.rules !== undefined && typeof body.rules === 'object') {
    const r = body.rules as Record<string, unknown>;
    if (r.winnersCount !== undefined) g.rules.winnersCount = toInt(r.winnersCount, 1, 1, 50);
    if (r.substitutesCount !== undefined) g.rules.substitutesCount = toInt(r.substitutesCount, 0, 0, 50);
    if (r.minMentions !== undefined) g.rules.minMentions = toInt(r.minMentions, 0, 0, 10);
    if (r.excludeDuplicates !== undefined) g.rules.excludeDuplicates = Boolean(r.excludeDuplicates);
    if (r.requiredHashtag !== undefined) g.rules.requiredHashtag = cleanStr(r.requiredHashtag, 60) || undefined;
    if (Array.isArray(r.blockedUsers)) {
      g.rules.blockedUsers = (r.blockedUsers as unknown[]).map((u) => cleanStr(u, 80)).filter(Boolean).slice(0, 100);
    }
  }
  g.updatedAt = new Date().toISOString();
  audit(auth.userId, 'giveaway.update', 'giveaway', id);
  return ok({ giveaway: g });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = getAuthOrDemo(req);
  const { id } = await params;
  const g = db.giveaways.get(id);
  if (!g || g.userId !== auth.userId) return fail('Sorteo no encontrado.', 404);
  g.status = 'cancelled';
  g.updatedAt = new Date().toISOString();
  audit(auth.userId, 'giveaway.cancel', 'giveaway', id);
  return ok({ message: 'Sorteo cancelado.', giveaway: g });
}
