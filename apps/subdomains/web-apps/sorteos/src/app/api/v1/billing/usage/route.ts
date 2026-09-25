import { NextRequest } from 'next/server';
import { getAuthOrDemo, ok } from '@/lib/server/http';
import { usageThisMonth } from '@/lib/server/billing';

/** GET /api/v1/billing/usage — RF-029/RF-030 (cuota + alerta 80%). */
export async function GET(req: NextRequest) {
  const auth = getAuthOrDemo(req);
  const u = usageThisMonth(auth.userId);
  return ok({
    ...u,
    warn80: u.percent >= 80,
    blocked: u.used >= u.limit,
    message:
      u.percent >= 100
        ? 'Límite alcanzado: sube de plan para seguir sorteando.'
        : u.percent >= 80
          ? `Has consumido el ${u.percent}% de tu cuota mensual (${u.used}/${u.limit}).`
          : `Consumo saludable: ${u.percent}%.`,
  });
}
