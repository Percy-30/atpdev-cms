import { NextRequest } from 'next/server';
import { db } from '@/lib/server/store';
import { signJwt, verifyPassword } from '@/lib/server/crypto';
import { audit, clientKey, fail, logEvent, ok, rateLimit } from '@/lib/server/http';
import { cleanStr, isEmail } from '@/lib/server/validators';

/** POST /api/v1/auth/login — RF-001/RF-002 (password + stub OAuth tratado en /oauth/) */
export async function POST(req: NextRequest) {
  if (!rateLimit(`login:${clientKey(req)}`, 15, 60_000)) {
    return fail('Demasiados intentos. Espera un minuto.', 429);
  }
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return fail('Cuerpo JSON inválido.', 400);
  }
  const email = cleanStr(body.email, 254).toLowerCase();
  const password = String(body.password ?? '');
  if (!isEmail(email) || !password) return fail('Credenciales incompletas.', 400);

  const id = db.usersByEmail.get(email);
  const user = id ? db.users.get(id) : undefined;
  if (!user || user.passwordHash === 'demo' || !verifyPassword(password, user.salt, user.passwordHash)) {
    logEvent('auth.login_failed', { email });
    return fail('Email o contraseña incorrectos.', 401);
  }
  if (user.status !== 'active') return fail('Cuenta suspendida. Contacta soporte.', 403);

  audit(user.id, 'user.login', 'user', user.id);
  return ok({
    message: 'Inicio de sesión exitoso.',
    user: { id: user.id, name: user.name, email: user.email, plan: user.plan, status: user.status, role: user.role },
    token: signJwt(user.id, user.email, user.role),
  });
}
