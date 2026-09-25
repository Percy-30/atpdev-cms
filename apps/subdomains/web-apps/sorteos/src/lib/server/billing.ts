/**
 * Facturación y cuotas (RF-027 a RF-030, OE-003).
 * Límites sincronizados con `PRICING_PLANS` en `@/lib/types`.
 */
import { PRICING_PLANS } from '@/lib/types';
import { db, monthKey, type PlanId } from './store';

export function planOf(userId: string): PlanId {
  return db.users.get(userId)?.plan || 'free';
}

export function commentLimitOf(plan: PlanId): number {
  return PRICING_PLANS.find((p) => p.id === plan)?.commentLimit ?? 100;
}

export function usageThisMonth(userId: string): { used: number; limit: number; percent: number; month: string } {
  const mk = monthKey();
  const used = db.usage.filter((u) => u.userId === userId && u.monthKey === mk).reduce((a, b) => a + b.commentsProcessed, 0);
  const limit = commentLimitOf(planOf(userId));
  return { used, limit, percent: limit ? Math.round((used / limit) * 100) : 0, month: mk };
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
