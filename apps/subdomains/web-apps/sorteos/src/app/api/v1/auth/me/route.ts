import { NextRequest } from 'next/server';
import { db } from '@/lib/server/store';
import { fail, getAuth, ok } from '@/lib/server/http';
import { syncRealSorteosUser, getSorteosUserByEmail } from '@atpdev/database';

/**
 * GET /api/v1/auth/me
 * Retorna los datos del usuario autenticado y sincroniza con el panel de administración central.
 */
export async function GET(req: NextRequest) {
  const auth = getAuth(req);
  if (!auth) {
    return fail('No autenticado. Inicia sesión con tu cuenta oficial.', 401);
  }
  let user = db.users.get(auth.userId);
  if (!user && auth.email) {
    const id = db.usersByEmail.get(auth.email);
    if (id) user = db.users.get(id);
  }

  // Si no está en memoria (reinicio o token persistente), buscar en @atpdev/database
  if (!user && auth.email) {
    const centralUser = await getSorteosUserByEmail(auth.email);
    if (centralUser) {
      user = {
        id: centralUser.id,
        name: centralUser.name,
        email: centralUser.email,
        passwordHash: 'oauth',
        salt: 'oauth',
        role: 'user',
        status: centralUser.status,
        plan: centralUser.plan,
        language: 'es',
        createdAt: centralUser.joinedAt,
        updatedAt: new Date().toISOString(),
      };
      db.users.set(user);
      db.usersByEmail.set(user.email, user.id);
    }
  }

  if (!user) {
    return fail('Usuario no encontrado.', 404);
  }

  // Evitar identidades demo heredadas
  if (user.name === 'Creador Demo' || user.email.includes('@demo.sorteos.local')) {
    return fail('Sesión demo obsoleta. Por favor inicia sesión con tu cuenta oficial.', 401);
  }

  // Sincronizar siempre con el panel de administración central (@atpdev/database)
  try {
    const synced = await syncRealSorteosUser({
      id: user.id,
      name: user.name,
      email: user.email,
      plan: user.plan,
      status: user.status === 'suspended' ? 'suspended' : 'active',
    });
    // Si el administrador cambió el plan desde el panel de admin, reflejarlo inmediatamente
    if (synced?.plan && synced.plan !== user.plan) {
      user.plan = synced.plan;
    }
  } catch (err) {
    console.error('Error syncing user with database:', err);
  }

  return ok({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      plan: user.plan,
      language: user.language,
      avatarUrl: user.avatarUrl,
      createdAt: user.createdAt,
    },
  });
}
