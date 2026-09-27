import { NextRequest } from 'next/server';
import { db, monthKey, uid } from '@/lib/server/store';
import { audit, clientKey, fail, getAuthOrDemo, logEvent, ok, rateLimit } from '@/lib/server/http';
import { executeDrawServer, filterParticipantsServer } from '@/lib/server/draw';
import { getAdapter } from '@/lib/server/socialProviders';
import { quotaCheck } from '@/lib/server/billing';
import type { Participant } from '@/lib/types';

/**
 * POST /api/v1/giveaways/:id/execute — RF-020..022 + RF-029 (cuota) + token check.
 * Body opcional: { participants?: [...] } (si se omite, importa de la fuente social).
 * Flujo: valida estado → valida token social → importa (adapter) → cuota →
 *        filtra → sorteo CSPRNG → persiste + usage_event + auditoría.
 */
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = getAuthOrDemo(req);
  if (!rateLimit(`execute:${auth.userId}`, 10, 60_000)) {
    return fail('Límite de ejecuciones alcanzado. Espera un minuto.', 429);
  }
  const { id } = await params;
  const g = db.giveaways.get(id);
  if (!g || g.userId !== auth.userId) return fail('Sorteo no encontrado.', 404);
  if (['finished', 'completed'].includes(g.status)) {
    return fail('El sorteo ya fue ejecutado. Usa re-sorteo ante descalificación (RF-024).', 409);
  }
  if (g.status === 'cancelled') return fail('El sorteo está cancelado.', 409);

  const body = await req.json().catch(() => ({} as Record<string, unknown>));
  const t0 = Date.now();
  let raw: Participant[] = Array.isArray(body.participants) ? (body.participants as Participant[]) : [];
  let providerMode = 'manual';
  let providerLatency = 0;

  // RF-020: importación desde fuente conectada
  if (raw.length === 0) {
    const platform = String(g.platform || g.network || 'instagram');
    if (['instagram', 'facebook', 'youtube'].includes(platform)) {
      const connected = db.socialAccounts.list().find(
        (a) => a.userId === auth.userId && a.platform === platform && a.status === 'connected'
      );
      if (!connected) {
        return fail(`Conecta tu cuenta de ${platform} antes de ejecutar (token ausente/revocado).`, 422, {
          code: 'SOCIAL_TOKEN_REQUIRED',
        });
      }
      if (new Date(connected.expiresAt).getTime() < Date.now()) {
        connected.status = 'expired';
        return fail(`El token de ${platform} expiró. Renuévalo en Cuentas Conectadas (RF-009).`, 422, {
          code: 'SOCIAL_TOKEN_EXPIRED',
        });
      }
      const adapter = getAdapter(platform);
      const res = await adapter.fetchComments(g.postUrl || platform);
      raw = res.comments;
      providerMode = res.provider;
      providerLatency = res.latencyMs;
    } else {
      return fail('Aporta `participants` para sorteos standalone (lista/ruleta).', 400);
    }
  }

  // RF-029: cuota por volumen antes de procesar
  const quota = quotaCheck(auth.userId, raw.length);
  if (!quota.allowed) {
    logEvent('quota.blocked', { userId: auth.userId, giveawayId: id, used: quota.used, limit: quota.limit });
    return fail(quota.message!, 402, { code: 'PLAN_LIMIT', used: quota.used, limit: quota.limit });
  }

  const winnersCount = Number(body.winnersCount ?? g.rules.winnersCount ?? 1);
  const substitutesCount = Number(body.substitutesCount ?? g.rules.substitutesCount ?? 1);
  if (winnersCount < 1) return fail('winnersCount debe ser ≥ 1.', 400);

  const { eligible, excluded } = filterParticipantsServer(raw, g.rules);
  if (eligible.length === 0) return fail('Ningún comentario supera los filtros (RF-021). Ajusta las reglas.', 422);
  if (eligible.length < winnersCount) {
    return fail(`Solo ${eligible.length} elegibles para ${winnersCount} ganadores. Reduce ganadores o relaja filtros.`, 422);
  }

  const draw = executeDrawServer(eligible, winnersCount, substitutesCount);
  g.participants = eligible.map((p) => ({ ...p }));
  g.winners = draw.winners;
  g.substitutes = draw.substitutes;
  g.verificationHash = draw.verificationHash;
  g.executedAt = draw.timestamp;
  g.totalCommentsCount = raw.length;
  g.status = 'finished';
  g.certificateId = `CERT-SP-${draw.verificationHash.slice(0, 8).toUpperCase()}`;
  g.updatedAt = new Date().toISOString();
  g.auditLog.push(`${draw.timestamp} ejecutado: ${eligible.length} elegibles, hash ${draw.verificationHash.slice(0, 12)}…`);

  db.usage.push({
    id: uid('use'),
    userId: auth.userId,
    giveawayId: id,
    commentsProcessed: raw.length,
    provider: providerMode,
    latencyMs: providerLatency || Date.now() - t0,
    createdAt: new Date().toISOString(),
    monthKey: monthKey(),
  });
  db.certificates.set({
    id: g.certificateId,
    giveawayId: id,
    userId: auth.userId,
    title: g.title,
    winnerUsername: draw.winners[0]?.participant.username || '',
    verificationHash: draw.verificationHash,
    issuedAt: draw.timestamp,
  });

  audit(auth.userId, 'giveaway.execute', 'giveaway', id, {
    eligible: eligible.length, excluded: excluded.length, provider: providerMode,
  });
  logEvent('giveaway.execute', {
    userId: auth.userId, giveawayId: id, eligible: eligible.length,
    latencyMs: Date.now() - t0, provider: providerMode,
  });

  return ok({
    giveawayId: id,
    winners: draw.winners,
    substitutes: draw.substitutes,
    verificationHash: draw.verificationHash,
    certificateId: g.certificateId,
    timestamp: draw.timestamp,
    totalEligible: eligible.length,
    totalExcluded: excluded.length,
    quota: { used: quota.used + raw.length, limit: quota.limit, warn80: quota.warn80 },
  });
}
