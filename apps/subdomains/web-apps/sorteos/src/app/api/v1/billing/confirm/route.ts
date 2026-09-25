import { NextRequest } from 'next/server';
import { db } from '@/lib/server/store';
import { audit, fail, getAuthOrDemo, logEvent, ok } from '@/lib/server/http';
import { cleanStr } from '@/lib/server/validators';

/** POST /api/v1/billing/confirm { planId, sessionId } — confirma checkout mock/live para el usuario actual. */
export async function POST(req: NextRequest) {
  const auth = getAuthOrDemo(req);
  const body = await req.json().catch(() => ({} as Record<string, unknown>));
  const planId = cleanStr(body.planId || body.plan, 20).toLowerCase();
  if (!['free', 'pro', 'business', 'enterprise'].includes(planId)) return fail('Plan inválido.', 400);
  const user = db.users.get(auth.userId);
  if (!user) return fail('Usuario no encontrado.', 404);
  user.plan = planId as 'free' | 'pro' | 'business' | 'enterprise';
  user.updatedAt = new Date().toISOString();
  audit(auth.userId, 'billing.confirm', 'subscription', auth.userId, { plan: planId, session: cleanStr(body.sessionId, 80) });
  logEvent('billing.confirm', { userId: auth.userId, plan: planId });
  return ok({ message: `Plan ${planId} activado.`, plan: planId });
}
