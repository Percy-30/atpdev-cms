import { NextRequest } from 'next/server';
import { db } from '@/lib/server/store';
import { audit, fail, getAuth, ok } from '@/lib/server/http';

/**
 * GET /api/v1/admin/flags — RF-034.
 * PATCH /api/v1/admin/flags { flagId, plan, enabled } — activa/desactiva por plan.
 */
export async function GET(req: NextRequest) {
  const auth = getAuth(req);
  const u = auth ? db.users.get(auth.userId) : undefined;
  if (!u || (u.role !== 'super-admin' && u.role !== 'admin')) return fail('Requiere rol super-admin.', 403);
  return ok({ flags: db.flags });
}

export async function PATCH(req: NextRequest) {
  const auth = getAuth(req);
  const u = auth ? db.users.get(auth.userId) : undefined;
  if (!u || (u.role !== 'super-admin' && u.role !== 'admin')) return fail('Requiere rol super-admin.', 403);
  const body = await req.json().catch(() => ({} as Record<string, unknown>));
  const flagId = String(body.flagId || '');
  const plan = String(body.plan || '');
  if (!db.flags[flagId] || !['free', 'pro', 'business', 'enterprise'].includes(plan)) {
    return fail('flagId o plan inválido.', 400);
  }
  db.flags[flagId][plan as 'free'] = Boolean(body.enabled);
  audit(u.id, 'admin.flag', 'feature_flag', flagId, { plan, enabled: Boolean(body.enabled) });
  return ok({ flags: db.flags });
}
