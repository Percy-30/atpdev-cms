import { NextRequest } from 'next/server';
import { db } from '@/lib/server/store';
import { hashPassword } from '@/lib/server/crypto';
import { fail, ok } from '@/lib/server/http';
import { isStrongPassword } from '@/lib/server/validators';

/** POST /api/v1/auth/reset — RF-003 (aplicar nueva contraseña con token). */
export async function POST(req: NextRequest) {
  const { token, password } = await req.json().catch(() => ({} as Record<string, unknown>));
  const rec = db.passwordResets.get(String(token || ''));
  if (!rec || rec.expiresAt < Date.now()) return fail('Token inválido o expirado.', 400);
  if (!isStrongPassword(password)) return fail('La contraseña debe tener al menos 8 caracteres.', 400);
  const user = db.users.get(rec.userId);
  if (!user) return fail('Usuario no encontrado.', 404);
  const { hash, salt } = hashPassword(String(password));
  user.passwordHash = hash;
  user.salt = salt;
  user.updatedAt = new Date().toISOString();
  db.passwordResets.delete(String(token));
  return ok({ message: 'Contraseña actualizada. Ya puedes iniciar sesión.' });
}
