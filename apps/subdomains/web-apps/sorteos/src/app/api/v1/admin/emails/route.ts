import { NextRequest } from 'next/server';
import { db } from '@/lib/server/store';
import { fail, getAuth, ok } from '@/lib/server/http';
import { outbox } from '@/lib/server/email';

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
 * GET /api/v1/admin/emails — bandeja de salida transaccional (RF-003).
 * En producción con RESEND_API_KEY los correos salen por Resend;
 * aquí queda la copia auditable con destinatario, asunto y tipo.
 */
export async function GET(req: NextRequest) {
  const chk = requireSuper(req);
  if ('error' in chk) return chk.error;
  const live = !!process.env.RESEND_API_KEY;
  return ok({ mode: live ? 'live-resend' : 'mock-outbox', total: outbox.length, emails: [...outbox].reverse().slice(0, 100) });
}
