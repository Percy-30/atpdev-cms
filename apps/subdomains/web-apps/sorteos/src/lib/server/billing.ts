/**
 * Facturación y cuotas (RF-027 a RF-030, OE-003).
 * Límites sincronizados con `PRICING_PLANS` en `@/lib/types`.
 */
import { PRICING_PLANS } from '../types.ts';
import { db, monthKey, type PlanId } from './store.ts';

export function planOf(userId: string): PlanId {
  return db.users.get(userId)?.plan || 'free';
}

export function commentLimitOf(plan: PlanId): number {
  return PRICING_PLANS.find((p) => p.id === plan)?.commentLimit ?? 100;
}

export function usageThisMonth(userId: string): { used: number; limit: number; percent: number; month: string } {
  const mk = monthKey();
  const dbUsed = db.usage.filterUser(userId).reduce((a, b) => a + b.commentsProcessed, 0);
  const user = db.users.get(userId);

  let persistentUsed = 0;
  let persistentLimit = 0;

  if (user?.email) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { readFullSorteosData } = require('@atpdev/database');
      const data = readFullSorteosData?.();
      const match = data?.users?.find(
        (u: any) => u.email.toLowerCase() === user.email.toLowerCase() || u.id === userId
      );
      if (match) {
        persistentUsed = match.commentsConsumed || 0;
        persistentLimit = match.commentsLimit || 0;
      }
    } catch {
      // noop
    }
  }

  const used = Math.max(dbUsed, persistentUsed);
  const plan = user?.plan || 'pro';
  const limit = persistentLimit > 0 ? persistentLimit : commentLimitOf(plan);
  return { used, limit, percent: limit ? Math.min(100, Math.round((used / limit) * 100)) : 0, month: mk };
}

/** RF-029: bloquea ejecución si el lote supera la cuota. RF-030: avisa desde 80%. */
export function quotaCheck(userId: string, incomingComments: number): { allowed: boolean; used: number; limit: number; percent: number; warn80: boolean; message?: string } {
  const { used, limit, percent } = usageThisMonth(userId);
  if (used + incomingComments > limit) {
    return {
      allowed: false, used, limit, percent,
      warn80: true,
      message: `Límite del plan superado: has usado ${used}/${limit} comentarios este mes. Sube de plan para ejecutar este sorteo (+${incomingComments} comentarios).`,
    };
  }
  const after = Math.round(((used + incomingComments) / limit) * 100);
  return { allowed: true, used, limit, percent, warn80: after >= 80 };
}
