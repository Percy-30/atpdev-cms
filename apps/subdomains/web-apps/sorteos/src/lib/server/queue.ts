/**
 * Worker y productor de jobs `giveaway:execute` (ADR-003).
 *
 * Requiere Redis + Postgres (`DATABASE_URL`). El worker consume `giveaway:execute`
 * y reutiliza la lógica de ejecución (importación, cuota, filtros, sorteo, persistencia
 * y auditoría) que también usa la ruta `/api/v1/giveaways/[id]/execute`.
 *
 * Puesta en producción:
 *   npm run db:migrate && npm run db:seed
 *   QUEUE_WORKER=1 npm run worker
 *
 * O en entorno serverless:
 *   POST /api/v1/cron/scheduled  (con CRON_SECRET)
 *   POST /api/v1/giveaways/:id/execute  (empleado normal)
 */

import Bull from 'bull';
import { db, monthKey, uid, type Store } from '@/lib/server/store';
import { executeDrawServer, filterParticipantsServer } from '@/lib/server/draw';
import { quotaCheck } from '@/lib/server/billing';
import { audit, logEvent } from '@/lib/server/http';
import { getAdapter } from '@/lib/server/socialProviders';
import type { Participant, Winner } from '@/lib/types';

export interface GiveawayExecutePayload {
  giveawayId: string;
  userId: string;
  participants?: Participant[];
  winnersCount?: number;
  substitutesCount?: number;
}

export interface ExecuteJobResult {
  giveawayId: string;
  winnersCount: number;
  substitutesCount: number;
  verificationHash: string;
  status: 'finished';
  auditHash: string;
}

const QUEUE = 'giveaway:execute';

function redisConnection(): { url: string } | { host: string; port: number } {
  if (process.env.REDIS_URL) return { url: process.env.REDIS_URL };
  return {
    host: process.env.REDIS_HOST ?? '127.0.0.1',
    port: Number(process.env.REDIS_PORT ?? 6379),
  };
}

export function getQueue(): Bull.Queue<GiveawayExecutePayload> {
  const conn = redisConnection();
  if ('url' in conn) {
    return new Bull<GiveawayExecutePayload>(QUEUE, conn.url);
  }
  return new Bull<GiveawayExecutePayload>(QUEUE, {
    redis: {
      host: conn.host,
      port: conn.port,
    },
  });
}

export async function enqueueExecute(payload: GiveawayExecutePayload, opts?: { jobId?: string }): Promise<string> {
  try {
    if (process.env.QUEUE_DRIVER === 'memory') {
      throw new Error('Forced memory queue');
    }
    const q = getQueue();
    const job = await q.add(payload, {
      jobId: opts?.jobId,
      removeOnComplete: true,
      removeOnFail: true,
    });
    return String(job.id);
  } catch (err) {
    // Graceful fallback para entornos locales sin Redis o serverless
    logEvent('queue.fallback_in_memory', { giveawayId: payload.giveawayId, reason: String(err) });
    const localId = opts?.jobId || uid('job-mem');
    setTimeout(async () => {
      try {
        await processGiveawayExecute(payload, {
          giveaways: db.giveaways,
          usage: db.usage,
          certificates: db.certificates,
          audit: db.audit,
          participants: db.participants,
          winners: db.winners,
          users: db.users,
          socialAccounts: db.socialAccounts,
        });
      } catch (e) {
        logEvent('queue.in_memory.failed', { giveawayId: payload.giveawayId, error: String(e) });
      }
    }, 15);
    return localId;
  }
}

export interface ExecuteJobDeps {
  socialAccounts: Store['socialAccounts'];
  users: Store['users'];
  giveaways: Store['giveaways'];
  certificates: Store['certificates'];
  usage: Store['usage'];
  audit: Store['audit'];
  participants: Store['participants'];
  winners: Store['winners'];
}

function assertRoutes(deps: ExecuteJobDeps): void {
  if (!deps.giveaways.get || !deps.usage.push) {
    throw new Error('[sorteos] worker ejecutándose sin Store Postgres conectado (por defecto, usa Store en memoria).');
  }
}

export async function processGiveawayExecute(
  payload: GiveawayExecutePayload,
  deps: ExecuteJobDeps
): Promise<ExecuteJobResult> {
  assertRoutes(deps);

  const g = deps.giveaways.get(payload.giveawayId);
  if (!g || g.userId !== payload.userId) {
    throw new Error('Sorteo no encontrado o no autorizado.');
  }
  if (g.status === 'finished' || g.status === 'completed') {
    throw new Error('El sorteo ya fue ejecutado.');
  }
  if (g.status === 'cancelled') {
    throw new Error('El sorteo está cancelado.');
  }

  const t0 = Date.now();
  let raw: Participant[] = [];
  if (Array.isArray(payload.participants) && payload.participants.length > 0) {
    raw = payload.participants as Participant[];
  } else {
    const platform = String(g.platform || g.network || 'instagram');
    const connected = deps.socialAccounts.listByUser(payload.userId).find(
      (a) => a.platform === platform && a.status === 'connected'
    );
    if (!connected) {
      throw new Error(`Conecta tu cuenta de ${platform} antes de ejecutar (token ausente/revocado).`);
    }
    if (new Date(connected.expiresAt).getTime() < Date.now()) {
      throw new Error(`El token de ${platform} expiró. Renuévalo en Cuentas Conectadas.`);
    }
    const adapter = getAdapter(platform);
    const res = await adapter.fetchComments(g.postUrl || payload.giveawayId);
    raw = res.comments;
  }

  const quota = quotaCheck(payload.userId, raw.length);
  if (!quota.allowed) {
    throw new Error(quota.message ?? 'Límite del plan superado.');
  }

  const winnersCount = Number(payload.winnersCount ?? g.rules.winnersCount ?? 1);
  const substitutesCount = Number(payload.substitutesCount ?? g.rules.substitutesCount ?? 0);
  if (winnersCount < 1) throw new Error('winnersCount debe ser ≥ 1.');

  const { eligible, excluded } = filterParticipantsServer(raw, g.rules);
  if (eligible.length === 0) throw new Error('Ningún comentario supera los filtros.');

  const draw = executeDrawServer(eligible, winnersCount, substitutesCount);
  g.winners = draw.winners as unknown as Winner[];
  g.substitutes = draw.substitutes as unknown as Winner[];
  g.verificationHash = draw.verificationHash;
  g.executedAt = draw.timestamp;
  g.totalCommentsCount = raw.length;
  g.status = 'finished';
  g.updatedAt = new Date().toISOString();

  const certId = g.certificateId || uid('cert');
  deps.certificates.set({
    id: certId,
    giveawayId: g.id,
    userId: g.userId,
    title: g.title,
    winnerUsername: draw.winners[0]?.participant.username ?? '',
    verificationHash: draw.verificationHash,
    issuedAt: draw.timestamp,
  });
  deps.participants.set({ id: uid('part'), giveawayId: g.id, username: 'cached-workers', status: 'archived' });

  deps.usage.push({
    id: uid('use'),
    userId: g.userId,
    giveawayId: g.id,
    commentsProcessed: raw.length,
    provider: 'worker',
    latencyMs: Date.now() - t0,
    createdAt: new Date().toISOString(),
    monthKey: monthKey(),
  });

  const auditId = uid('aud');
  deps.audit.push({
    id: auditId,
    actorUserId: payload.userId,
    action: 'giveaway.execute_worker',
    entity: 'giveaway',
    entityId: g.id,
    meta: { eligible: eligible.length, excluded: excluded.length, provider: 'worker' },
    createdAt: new Date().toISOString(),
  });

  return {
    giveawayId: g.id,
    winnersCount,
    substitutesCount,
    verificationHash: draw.verificationHash,
    status: 'finished',
    auditHash: auditId,
  };
}

export function createGiveawayWorker(opts?: { concurrency?: number }) {
  const queue = getQueue();
  const concurrency = opts?.concurrency ?? 1;

  queue.process(concurrency, async (job: Bull.Job<GiveawayExecutePayload>) => {
    logEvent('queue.job', { queue: QUEUE, giveawayId: job.data?.giveawayId, mode: 'worker' });
    try {
      return await processGiveawayExecute(job.data, {
        giveaways: db.giveaways,
        usage: db.usage,
        certificates: db.certificates,
        audit: db.audit,
        participants: db.participants,
        winners: db.winners,
        users: db.users,
        socialAccounts: db.socialAccounts,
      });
    } catch (err) {
      logEvent('queue.job.failed', { queue: QUEUE, giveawayId: job.data?.giveawayId, error: String(err) });
      throw err;
    }
  });

  queue.on('failed', (job, err) => {
    logEvent('queue.job.failed', { queue: QUEUE, giveawayId: job?.data?.giveawayId, error: String(err) });
  });

  return queue;
}
