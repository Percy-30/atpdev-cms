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
  const mode = process.env.QUEUE_WORKER ?? '';
  if (!mode) {
    console.warn('[sorteos] worker: no QUEUE_WORKER=1. Se sale sin hacer nada.');
    return Promise.resolve();
  }

  logEvent('worker.start', { mode });

  const worker = createGiveawayWorker({ concurrency: Number(process.env.WORKER_CONCURRENCY ?? 1) });

  worker.on('completed', (job: Job<GiveawayExecutePayload>) => {
    logEvent('queue.job.completed', { queue: 'giveaway:execute', giveawayId: job.data?.giveawayId });
  });

  worker.on('error', (err: Error) => {
    logEvent('queue.worker.error', { error: String(err) });
  });

  return new Promise((resolve, reject) => {
    worker.on('closed', () => {
      logEvent('worker.closed');
      resolve();
    });
    worker.on('error', reject);

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
