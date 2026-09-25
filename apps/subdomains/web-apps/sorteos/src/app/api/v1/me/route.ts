import { NextRequest } from 'next/server';
import { db } from '@/lib/server/store';
import { audit, fail, getAuth, ok } from '@/lib/server/http';
import { cleanStr } from '@/lib/server/validators';

/** GET /api/v1/me — RF-004 (perfil). PATCH /api/v1/me (actualizar nombre/avatar/idioma). */
export async function GET(req: NextRequest) {
  const auth = getAuth(req);
  if (!auth) return fail('No autenticado.', 401);
  const user = db.users.get(auth.userId);
  if (!user) return fail('Usuario no encontrado.', 404);
  const { passwordHash: _p, salt: _s, ...pub } = user;
  return ok({ user: pub });
}

export async function PATCH(req: NextRequest) {
  const auth = getAuth(req);
  if (!auth) return fail('No autenticado.', 401);
  const user = db.users.get(auth.userId);
  if (!user) return fail('Usuario no encontrado.', 404);
  const body = await req.json().catch(() => ({} as Record<string, unknown>));
  if (body.name !== undefined) user.name = cleanStr(body.name, 120) || user.name;
  if (body.avatarUrl !== undefined) user.avatarUrl = cleanStr(body.avatarUrl, 500) || undefined;
  if (body.language !== undefined) {
    const lang = cleanStr(body.language, 8);
    if (['es', 'en', 'pt'].includes(lang)) user.language = lang;
  }
  user.updatedAt = new Date().toISOString();
  audit(user.id, 'user.update_profile', 'user', user.id);
  const { passwordHash: _p, salt: _s, ...pub } = user;
  return ok({ user: pub });
}
