/**
 * Script de semilla para Sorteos Pro (PostgreSQL).
 *
 * Uso:
 *   npx tsx scripts/db-seed.ts
 *
 * Requiere `DATABASE_URL`. Se insertan datos demostración idempotente
 * (superadmin, CMS y feature flags) para que la app arranque listo.
 */
import { scryptSync } from 'crypto';
import { Pool } from 'pg';

function now(): string {
  return new Date().toISOString();
}

function main(): Promise<void> {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    throw new Error('[sorteos] DATABASE_URL no definido.');
  }

  const tenant = process.env.SORTEOS_SEED_TENANT || 'sorteos-demo';
  const pool = new Pool({
    connectionString: dbUrl,
    max: 5,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 5_000,
  });

  const adminId = 'usr_superadmin_seed';
  const adminEmail = 'admin@sorteos.pro';
  const salt = process.env.SORTEOS_ADMIN_SALT || 'seed-admin-salt-01';
  const passwordHash = scryptSync('Admin1234!', salt, 64).toString('hex');
  const adminNow = now();
  const seedNow = adminNow;

  const flagRows = [
    ['ff-multi-post', 'Publicación múltiple por red', 'Permite manejar cuentas en varias redes (RFC-022)', 'false', 'true', 'true', 'true', 'true'],
    ['ff-custom-branding', 'Branding personalizado', 'Logo, color y texto personalizados en certificados (RFC-022)', 'false', 'true', 'true', 'true', 'true'],
    ['ff-scheduled-draws', 'Sorteos programados', 'Gestiona sorteos con fecha/hora programadas (RFC-020)', 'false', 'false', 'true', 'true', 'true'],
    ['ff-advanced-filters', 'Filtros avanzados', 'Filtros de elegibilidad y palabras clave (RFC-022)', 'false', 'true', 'true', 'true', 'true'],
    ['ff-email-notifications', 'Notificaciones por email', 'Confirma awards y cambios de estado (RFC-036)', 'false', 'true', 'true', 'true', 'true'],
  ];

  const steps = [
    pool.query(
      `INSERT INTO sorteos_users (id, tenant_id, name, email, password_hash, password_salt, role, status, plan, language, avatar_url, created_at, updated_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
       ON CONFLICT (id) DO NOTHING`,
      [
        adminId,
        tenant,
        'Super Admin',
        adminEmail,
        passwordHash,
        salt,
        'super-admin',
        'active',
        'enterprise',
        'es',
        'https://cdn.sorteos.pro/avatars/admin.png',
        adminNow,
        adminNow,
      ]
    ),
    pool.query(
      `INSERT INTO sorteos_cms_posts (id, tenant_id, slug, title, excerpt, body, category, status, created_at, updated_at, published_at)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
       ON CONFLICT (id) DO NOTHING`,
      [
        'cms-1',
        tenant,
        'guia-sorteo-instagram-2026',
        'Cómo hacer un sorteo en Instagram legal y transparente',
        'Normas de promoción de Meta y certificación de ganadores.',
        '# Guía Instagram\n\nContenido editorial gestionado sin desplegar código (RF-035).',
        'Instagram & Meta',
        'published',
        seedNow,
        seedNow,
        seedNow,
      ]
    ),
    ...flagRows.map(([id, name, description, free, pro, business, enterprise, enabled]) =>
      pool.query(
        `INSERT INTO sorteos_feature_flags (id, tenant_id, name, description, free, pro, business, enterprise, enabled, created_at, updated_at)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
         ON CONFLICT (id) DO NOTHING`,
        [id, tenant, name, description, free === 'true', pro === 'true', business === 'true', enterprise === 'true', enabled === 'true', seedNow, seedNow]
      )
    ),
  ];

  return Promise.all(steps)
    .then(() => {
      console.log('[sorteos] db-seed: superadmin, cms y feature flags listos.');
    })
    .catch((err) => {
      console.error('[sorteos] db-seed error:', err);
      process.exit(1);
    })
    .finally(() => pool.end());
}

main();
