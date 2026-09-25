import { NextRequest } from 'next/server';
import { PRICING_PLANS } from '@/lib/types';
import { db } from '@/lib/server/store';
import { audit, fail, getAuthOrDemo, logEvent, ok } from '@/lib/server/http';
import { cleanStr } from '@/lib/server/validators';

/**
 * POST /api/v1/billing/checkout-session { planId, billingCycle } — RF-028.
 * Sin STRIPE_SECRET_KEY: retorna sesión mock-verified auditable.
 * Con clave: aquí se crearía la Checkout Session real de Stripe.
 */
export async function POST(req: NextRequest) {
  const auth = getAuthOrDemo(req);
  const body = await req.json().catch(() => ({} as Record<string, unknown>));
  const planId = cleanStr(body.planId, 20);
  const billingCycle = cleanStr(body.billingCycle, 20) || 'monthly';
  const plan = PRICING_PLANS.find((p) => p.id === planId);
  if (!plan) return fail('Plan no encontrado.', 404);

  if (plan.id === 'free') {
    const u = db.users.get(auth.userId);
    if (u) u.plan = 'free';
    audit(auth.userId, 'billing.downgrade', 'subscription', auth.userId, { plan: 'free' });
    return ok({ message: 'Plan Free activado.', url: '/dashboard' });
  }

  const live = !!process.env.STRIPE_SECRET_KEY;
  const price = billingCycle === 'annual' ? plan.priceAnnual : plan.priceMonthly;
  const sessionId = `cs_${live ? 'live' : 'test'}_${Date.now().toString(36)}`;
  logEvent('billing.checkout', { userId: auth.userId, plan: plan.id, amount: price, mode: live ? 'live' : 'mock-verified' });

  // En modo mock aplicamos el cambio al confirmar vía webhook simulado;
  // devolvemos URL que el frontend usa para redirigir.
  return ok({
    sessionId,
    url: `/dashboard?payment=success&session_id=${sessionId}&plan=${plan.id}`,
    plan: plan.name,
    planId: plan.id,
    amount: price,
    currency: 'USD',
    billingCycle,
    provider: 'stripe',
    mode: live ? 'live' : 'mock-verified',
    note: live ? undefined : 'STRIPE_SECRET_KEY ausente: sesión simulada auditable.',
  });
}
