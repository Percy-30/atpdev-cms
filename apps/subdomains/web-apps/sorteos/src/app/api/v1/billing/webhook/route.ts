import { NextRequest } from 'next/server';
import { db } from '@/lib/server/store';
import { audit, fail, logEvent, ok } from '@/lib/server/http';
import { cleanStr } from '@/lib/server/validators';

/**
 * POST /api/v1/billing/webhook — RF-028 (eventos Stripe).
 * Con STRIPE_WEBHOOK_SECRET: verifica firma HMAC (tolerancia 5 min) sobre el
 * cuerpo crudo y aplica checkout.session.completed con metadata real.
 * Sin secreto: acepta { type:'checkout.session.completed', userId, planId }
 * en modo mock-verified para cerrar el ciclo en desarrollo.
 */
export async function POST(req: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const raw = await req.text().catch(() => '');
  let body: Record<string, unknown> = {};
  if (webhookSecret) {
    const sig = req.headers.get('stripe-signature') || '';
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { createHmac, timingSafeEqual } = require('node:crypto') as typeof import('node:crypto');
    const m = sig.match(/t=(\d+),.*v1=([a-f0-9]+)/);
    if (!m) return fail('Firma Stripe inválida.', 400);
    const [, ts, v1] = m;
    if (Math.abs(Date.now() / 1000 - Number(ts)) > 300) return fail('Firma Stripe expirada.', 400);
    const expected = createHmac('sha256', webhookSecret).update(`${ts}.${raw}`).digest('hex');
    const a = Buffer.from(v1);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return fail('Firma Stripe inválida.', 400);
    try {
      body = JSON.parse(raw) as Record<string, unknown>;
    } catch {
      return fail('Cuerpo JSON inválido.', 400);
    }
    const type = String((body as { type?: unknown }).type || '');
    if (type === 'checkout.session.completed') {
      const obj = ((body as { data?: { object?: Record<string, unknown> } }).data?.object || {}) as Record<string, unknown>;
      const meta = (obj.metadata || {}) as Record<string, unknown>;
      const userId = String(meta.userId || obj.client_reference_id || '');
      const planId = String(meta.planId || '').toLowerCase();
      const user = db.users.get(userId);
      if (!user) return fail('Usuario del evento no existe.', 404);
      if (!['free', 'pro', 'business', 'enterprise'].includes(planId)) return fail('Plan inválido.', 400);
      user.plan = planId as 'free' | 'pro' | 'business' | 'enterprise';
      user.updatedAt = new Date().toISOString();
      audit(userId, 'billing.subscription', 'subscription', userId, { plan: planId, event: type, live: true });
      logEvent('billing.webhook', { userId, plan: planId, type, mode: 'live' });
      return ok({ received: true, applied: { userId, plan: planId } });
    }
    logEvent('billing.webhook_ignored', { type });
    return ok({ received: true, ignored: type });
  }
  try {
    body = raw ? (JSON.parse(raw) as Record<string, unknown>) : {};
  } catch {
    return fail('Cuerpo JSON inválido.', 400);
  }
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
