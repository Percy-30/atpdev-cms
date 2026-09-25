import { NextRequest } from 'next/server';
import { db, uid } from '@/lib/server/store';
import { fail, logEvent, ok, rateLimit, clientKey } from '@/lib/server/http';
import { cleanStr, isEmail } from '@/lib/server/validators';
import { sendEmail } from '@/lib/server/email';

/**
 * POST /api/v1/auth/recover — RF-003 (solicitar enlace).
 * Envía email transaccional (mock-outbox en dev, Resend/SES en prod).
 */
export async function POST(req: NextRequest) {
  if (!rateLimit(`recover:${clientKey(req)}`, 5, 300_000)) {
    return fail('Demasiados intentos. Espera unos minutos.', 429);
  }
  const body = await req.json().catch(() => ({}));
  const email = cleanStr((body as Record<string, unknown>).email, 254).toLowerCase();
  if (!isEmail(email)) return fail('Email inválido.', 400);

  const id = db.usersByEmail.get(email);
  // Anti-enumeración: respuesta idéntica exista o no
  if (id) {
    const token = uid('rst');
    db.passwordResets.set(token, { userId: id, expiresAt: Date.now() + 60 * 60 * 1000 });
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3006';
    await sendEmail(
      email,
      'Restablece tu contraseña de Sorteos Pro',
      `Solicitaste restablecer tu contraseña. Usa este enlace (válido 1h): ${appUrl}/restablecer-password?token=${token}`,
      'password-recover'
    );
    logEvent('auth.recover_issued', { userId: id });
    const dev = !process.env.RESEND_API_KEY;
    return ok({
      message: 'Si el email existe, recibirás instrucciones de recuperación.',
      ...(dev ? { resetToken: token } : {}),
    });
  }
  return ok({ message: 'Si el email existe, recibirás instrucciones de recuperación.' });
}

export async function GET(req: NextRequest) {
  const token = new URL(req.url).searchParams.get('token') || '';
  const rec = db.passwordResets.get(token);
  if (!rec || rec.expiresAt < Date.now()) return fail('Token inválido o expirado.', 400);
  return ok({ valid: true });
}
