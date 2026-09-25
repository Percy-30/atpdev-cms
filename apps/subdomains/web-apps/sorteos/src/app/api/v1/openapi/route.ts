import { NextResponse } from 'next/server';

/** GET /api/v1/openapi — SAD §8 (REST + OpenAPI, versionado por URL). */
export async function GET() {
  return NextResponse.json({
    openapi: '3.0.3',
    info: { title: 'Sorteos Pro API', version: '1.0.0', description: 'SaaS multi-tenant de sorteos (SRS/SAD V1).' },
    servers: [{ url: '/api/v1' }],
    paths: {
      '/auth/register': { post: { summary: 'RF-001 Registro email/contraseña' } },
      '/auth/login': { post: { summary: 'RF-001 Login' } },
      '/auth/oauth/{provider}': { get: { summary: 'RF-002 OAuth Google/Facebook' } },
      '/auth/recover': { post: { summary: 'RF-003 Recuperación' } },
      '/me': { get: { summary: 'RF-004 Perfil' }, patch: { summary: 'RF-004 Actualizar perfil' } },
      '/social-accounts': { get: { summary: 'RF-005..007 Listar' }, post: { summary: 'RF-005..007 Conectar (OAuth)' } },
      '/social-accounts/{id}': { delete: { summary: 'RF-008 Desconectar' } },
      '/social-accounts/{id}/refresh': { post: { summary: 'RF-009 Refresh token' } },
      '/giveaways': { get: { summary: 'Listar' }, post: { summary: 'RF-010..017 Crear' } },
      '/giveaways/{id}': { get: { summary: 'Detalle / landing ?public=1 (RF-019)' }, patch: { summary: 'Editar/Cancelar' }, delete: { summary: 'Cancelar' } },
      '/giveaways/{id}/execute': { post: { summary: 'RF-020..022 Ejecutar (cuota RF-029)' } },
      '/giveaways/{id}/winners': { get: { summary: 'Ganadores' } },
      '/giveaways/{id}/redraw': { post: { summary: 'RF-024 Re-sorteo' } },
      '/giveaways/{id}/duplicate': { post: { summary: 'RF-018 Duplicar' } },
      '/giveaways/{id}/export': { get: { summary: 'RF-023 CSV' } },
      '/certificates': { post: { summary: 'RF-025/026 Emitir' } },
      '/certificates/{id}': { get: { summary: 'RF-025 Verificar' } },
      '/plans': { get: { summary: 'RF-027 Planes' } },
      '/billing/checkout-session': { post: { summary: 'RF-028 Stripe' } },
      '/billing/usage': { get: { summary: 'RF-029/030 Cuota' } },
      '/billing/webhook': { post: { summary: 'RF-028 Webhook' } },
      '/admin/users': { get: { summary: 'RF-033' }, patch: { summary: 'RF-031/032' } },
      '/admin/flags': { get: { summary: 'RF-034' }, patch: { summary: 'RF-034' } },
      '/cms/posts': { get: { summary: 'RF-035 Leer' }, post: { summary: 'RF-035/036 Publicar' } },
    },
  });
}
