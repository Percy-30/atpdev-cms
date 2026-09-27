import { NextRequest } from 'next/server';
import { db, monthKey, uid } from '@/lib/server/store';
import { audit, fail, logEvent, ok } from '@/lib/server/http';
import { executeDrawServer, filterParticipantsServer } from '@/lib/server/draw';
import { getAdapter } from '@/lib/server/socialProviders';
import { quotaCheck } from '@/lib/server/billing';

/**
 * POST /api/v1/cron/scheduled — RF-017 (ejecución programada).
 * Proteger con CRON_SECRET en producción. Ejecuta sorteos `scheduled`
 * cuya fecha ya venció y tengan token social válido.
 */
export async function POST(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (process.env.NODE_ENV === 'production' && !secret) {
    return fail('CRON_SECRET no configurado.', 503);
  }
  const header = req.headers.get('x-cron-secret');
  const authHeader = req.headers.get('authorization');
  const bearerOk = secret && authHeader === `Bearer ${secret}`;
  if (secret && header !== secret && !bearerOk) {
    return fail('No autorizado.', 401);
  }
  const now = Date.now();
  const due = db.giveaways.list().filter(
    (g) => g.status === 'scheduled' && g.scheduledAt && Date.parse(g.scheduledAt) <= now
  );
  const results: Array<Record<string, unknown>> = [];
  for (const g of due) {
    try {
      const platform = String(g.platform || g.network || 'instagram');
      const adapter = getAdapter(platform);
      const imported = await adapter.fetchComments(g.postUrl || platform);
      const quota = quotaCheck(g.userId, imported.comments.length);
      if (!quota.allowed) {
        results.push({ id: g.id, status: 'blocked', reason: 'PLAN_LIMIT' });
        continue;
      }
      const { eligible } = filterParticipantsServer(imported.comments, g.rules);
      const draw = executeDrawServer(eligible, g.rules.winnersCount, g.rules.substitutesCount);
      g.winners = draw.winners;
      g.substitutes = draw.substitutes;
      g.verificationHash = draw.verificationHash;
      g.executedAt = draw.timestamp;
      g.totalCommentsCount = imported.comments.length;
      g.status = 'finished';
      g.certificateId = `CERT-SP-${draw.verificationHash.slice(0, 8).toUpperCase()}`;
      g.updatedAt = new Date().toISOString();
      db.usage.push({
        id: uid('use'), userId: g.userId, giveawayId: g.id,
        commentsProcessed: imported.comments.length, provider: platform,
        latencyMs: imported.latencyMs, createdAt: new Date().toISOString(), monthKey: monthKey(),
      });
      audit(g.userId, 'giveaway.execute_scheduled', 'giveaway', g.id);
      results.push({ id: g.id, status: 'finished', winners: draw.winners.length });
    } catch (e) {
      logEvent('cron.scheduled_failed', { giveawayId: g.id, error: String(e) });
      results.push({ id: g.id, status: 'failed', error: String(e) });
    }
  }
  return ok({ processed: results.length, results });
}

export async function GET(req: NextRequest) {
  return POST(req);
}
