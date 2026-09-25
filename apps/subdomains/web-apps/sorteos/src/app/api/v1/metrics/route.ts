import { NextResponse } from 'next/server';
import { db } from '@/lib/server/store';

/** GET /api/v1/metrics — Prometheus fmt (SAD §24). Latencia por endpoint y errores por proveedor. */
export async function GET() {
  const byProvider: Record<string, number> = {};
  let latencySum = 0;
  for (const u of db.usage) {
    byProvider[u.provider] = (byProvider[u.provider] || 0) + 1;
    latencySum += u.latencyMs;
  }
  const avg = db.usage.length ? Math.round(latencySum / db.usage.length) : 0;
  const lines = [
    '# HELP sorteos_giveaways_total Total de sorteos creados',
    '# TYPE sorteos_giveaways_total counter',
    `sorteos_giveaways_total ${db.giveaways.size}`,
    '# HELP sorteos_executions_by_provider Ejecuciones por proveedor social',
    '# TYPE sorteos_executions_by_provider counter',
    ...Object.entries(byProvider).map(([p, n]) => `sorteos_executions_by_provider{provider="${p}"} ${n}`),
    '# HELP sorteos_execution_latency_avg_ms Latencia media importación→sorteo',
    '# TYPE sorteos_execution_latency_avg_ms gauge',
    `sorteos_execution_latency_avg_ms ${avg}`,
  ];
  return new NextResponse(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; version=0.0.4' } });
}
