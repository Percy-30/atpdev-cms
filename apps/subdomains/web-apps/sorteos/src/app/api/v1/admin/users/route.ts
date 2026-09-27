import { NextRequest } from 'next/server';
import { db } from '@/lib/server/store';
import { audit, fail, getAuth, ok } from '@/lib/server/http';
import { cleanStr } from '@/lib/server/validators';

function requireSuper(req: NextRequest) {
  const auth = getAuth(req);
  if (!auth) return { error: fail('No autenticado.', 401) as never };
  const u = db.users.get(auth.userId);
  if (!u || (u.role !== 'super-admin' && u.role !== 'admin')) {
    return { error: fail('Requiere rol super-admin.', 403) as never };
  }
  return { auth };
}

/**
 * GET /api/v1/admin/users — RF-033 (métricas por cliente).
 * PATCH /api/v1/admin/users { userId, plan?, status? } — RF-031/RF-032.
 */
export async function GET(req: NextRequest) {
  const chk = requireSuper(req);
  if ('error' in chk) return chk.error;
  const users = db.users.list().map((u) => {
    const { passwordHash: _p, salt: _s, ...pub } = u;
    const consumed = db.usage.byUser(u.id).reduce((a, b) => a + b.commentsProcessed, 0);
    const giveaways = db.giveaways.getByUser(u.id)?.length ?? 0;
    return { ...pub, commentsConsumed: consumed, giveawaysCount: giveaways };
  });
  const mrr = users.reduce((a, u) => a + ({ free: 0, pro: 9.99, business: 24.99, enterprise: 79.99 } as Record<string, number>)[u.plan], 0);
  return ok({ users, metrics: { mrr: Math.round(mrr * 100) / 100, totalUsers: users.length } });
}

export async function PATCH(req: NextRequest) {
  const chk = requireSuper(req);
  if ('error' in chk) return chk.error;
  const body = await req.json().catch(() => ({} as Record<string, unknown>));
  const userId = cleanStr(body.userId, 60);
  const u = db.users.get(userId);
  if (!u) return fail('Usuario no encontrado.', 404);
  if (body.plan !== undefined) {
    const plan = cleanStr(body.plan, 20);
    if (!['free', 'pro', 'business', 'enterprise'].includes(plan)) return fail('Plan inválido.', 400);
    u.plan = plan as 'free' | 'pro' | 'business' | 'enterprise';
    audit(chk.auth!.userId, 'admin.change_plan', 'user', userId, { plan });
  }
  if (body.status !== undefined) {
    const st = cleanStr(body.status, 20);
    if (!['active', 'suspended', 'deleted'].includes(st)) return fail('Estado inválido.', 400);
    u.status = st as 'active' | 'suspended' | 'deleted';
    audit(chk.auth!.userId, st === 'active' ? 'admin.reactivate' : 'admin.suspend', 'user', userId);
  }
  u.updatedAt = new Date().toISOString();
  const { passwordHash: _p, salt: _s, ...pub } = u;
  return ok({ user: pub });
}
