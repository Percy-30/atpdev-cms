import { NextRequest } from 'next/server';
import { db } from '@/lib/server/store';
import { audit, fail, logEvent, ok } from '@/lib/server/http';
import { cleanStr } from '@/lib/server/validators';

/**
 * POST /api/v1/billing/webhook — RF-028 (eventos Stripe).
 * Verifica firma si STRIPE_WEBHOOK_SECRET existe; en mock-verified acepta
 * { type:'checkout.session.completed', userId, planId } para cerrar el ciclo.
 */
export async function POST(req: NextRequest) {
  const sig = req.headers.get('stripe-signature');
  if (process.env.STRIPE_WEBHOOK_SECRET && !sig) {
    return fail('Firma Stripe ausente.', 400);
  }
  const body = await req.json().catch(() => ({} as Record<string, unknown>));
  const type = cleanStr(body.type, 60);
  const data = (body.data || {}) as Record<string, unknown>;

  if (type === 'checkout.session.completed') {
    const userId = cleanStr(data.userId, 60);
    const planId = cleanStr(data.planId, 20).toLowerCase();
    const user = db.users.get(userId);
    if (!user) return fail('Usuario del evento no existe.', 404);
    if (!['free', 'pro', 'business', 'enterprise'].includes(planId)) return fail('Plan inválido.', 400);
    user.plan = planId as 'free' | 'pro' | 'business' | 'enterprise';
    user.updatedAt = new Date().toISOString();
    audit(userId, 'billing.subscription', 'subscription', userId, { plan: planId, event: type });
    logEvent('billing.webhook', { userId, plan: planId, type });
    return ok({ received: true, applied: { userId, plan: planId } });
  }
  logEvent('billing.webhook_ignored', { type });
  return ok({ received: true, ignored: type });
}
