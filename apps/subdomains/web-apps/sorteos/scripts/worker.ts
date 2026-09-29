/**
 * Entrada del worker BullMQ para Sorteos Pro.
 *
 * Uso:
 *   QUEUE_WORKER=1 npx tsx scripts/worker.ts
 *
 * El worker consume la cola `giveaway:execute` y realiza la importación,
 * el sorteo, la persistencia y la auditoría de cada job.
 */
import { Job } from 'bull';
import { createGiveawayWorker, type GiveawayExecutePayload } from '@/lib/server/queue';
import { logEvent } from '@/lib/server/http';

function main(): Promise<void> {
  const mode = process.env.QUEUE_WORKER ?? '1';

  logEvent('worker.start', { mode });
  console.log(`[sorteos] worker iniciando en modo ${mode} (concurrencia: ${process.env.WORKER_CONCURRENCY ?? 1})...`);

  let worker: ReturnType<typeof createGiveawayWorker>;
  try {
    worker = createGiveawayWorker({ concurrency: Number(process.env.WORKER_CONCURRENCY ?? 1) });
  } catch (err) {
    console.error('[sorteos] worker: no se pudo conectar a Redis. Asegúrate de configurar REDIS_URL o iniciar Redis local.');
    return Promise.resolve();
  }

  worker.on('completed', (job: Job<GiveawayExecutePayload>) => {
    logEvent('queue.job.completed', { queue: 'giveaway:execute', giveawayId: job.data?.giveawayId });
  });

  worker.on('error', (err: Error) => {
    logEvent('queue.worker.error', { error: String(err) });
    console.warn(`[sorteos] worker advertencia: ${err.message}.`);
  });

  return new Promise((resolve) => {
    worker.on('closed', () => {
      logEvent('worker.closed');
      resolve();
    });

    const gracefullyShutdown = () => {
      console.log('[sorteos] worker: recibiendo SIGTERM / SIGINT, cerrando...');
      worker.close(() => {
        console.log('[sorteos] worker cerrado.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', gracefullyShutdown);
    process.on('SIGINT', gracefullyShutdown);

    console.log('[sorteos] worker: escuchando `giveaway:execute`.');
  });
}

main();
