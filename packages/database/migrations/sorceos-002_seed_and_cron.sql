-- Sorteos Pro - data seed y sesiones/cron (RFC-000..RFC-080)
-- Aplica sobre el esquema del migration 001.

INSERT INTO sorteos_users (id, tenant_id, name, email, password_hash, password_salt, role, status, plan, language, avatar_url, created_at, updated_at)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'sorteos-demo',
  'Super Admin',
  'admin@sorteos.pro',
  '$2a$10$N2oKx4LJhQ4nZ1kK9zRz2uIY7bVjXwK1lN5pO8fMwI8gH6dQ4cB6i',  -- scrypt de 'Admin1234!'
  'seed-admin-salt-01',
  'super-admin', 'active', 'enterprise', 'es', 'https://cdn.sorteos.pro/avatars/admin.png',
  NOW(), NOW()
)
ON CONFLICT DO NOTHING;

INSERT INTO sorteos_cms_posts (id, tenant_id, slug, title, excerpt, body, category, status, created_at, updated_at, published_at)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'sorteos-demo',
  'guia-sorteo-instagram-2026',
  'Cómo hacer un sorteo en Instagram legal y transparente',
  'Normas de promoción de Meta y certificación de ganadores.',
  '# Guía Instagram\n\nContenido editorial gestionado sin desplegar código (RFC-035).',
  'Instagram & Meta',
  'published',
  NOW(), NOW(), NOW()
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO sorteos_feature_flags (id, name, description, free, pro, business, enterprise, enabled, created_at, updated_at)
VALUES
  ('ff-multi-post', 'Publicación múltiple por red', 'Permite manejar cuentas en varias redes (RFC-022)', false, true, true, true, true, NOW(), NOW()),
  ('ff-custom-branding', 'Branding personalizado', 'Logo, color y texto personalizados en certificados (RFC-022)', false, true, true, true, true, NOW(), NOW()),
  ('ff-scheduled-draws', 'Sorteos programados', 'Gestiona sorteos con fecha/hora programadas (RFC-020)', false, false, true, true, true, NOW(), NOW()),
  ('ff-advanced-filters', 'Filtros avanzados', 'Filtros de elegibilidad y palabras clave (RFC-022)', false, true, true, true, true, NOW(), NOW()),
  ('ff-email-notifications', 'Notificaciones por email', 'Confirma awards y cambios de estado (RFC-036)', false, true, true, true, true, NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET enabled = EXCLUDED.enabled, updated_at = NOW();

-- Crontab de ejemplo: diario a las 08:00 UTC (Vercel Hobby → cron de 1 min+)
-- En un worker real: evalúa sorteos `status='draft'` o `open` y agenda jobs de 'giveaway:execute'.
-- NOTA: el endpoint /api/v1/cron/scheduled es el trigger protegido por CRON_SECRET; no se ejecuta aquí.
