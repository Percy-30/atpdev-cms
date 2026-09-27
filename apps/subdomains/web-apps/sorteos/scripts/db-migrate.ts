/**
 * Script de migración para Sorteos Pro (PostgreSQL).
 *
 * Uso:
 *   npx tsx scripts/db-migrate.ts
 *
 * Requiere `DATABASE_URL` apuntando al PostgreSQL de Sorteos Pro.
 * Aplica todos los archivos `.sql` en `packages/database/migrations` al orden
 * alfabético, incluidas las migraciones de Sorteos Pro (`sorceos-*.sql`).
 */
import { Pool } from 'pg';
import { readdirSync, readFileSync, existsSync } from 'fs';
import { join } from 'path';

async function main(): Promise<void> {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    throw new Error('[sorteos] DATABASE_URL no definido. Ejecuta: export DATABASE_URL=postgres://...');
  }

  const pool = new Pool({
    connectionString: dbUrl,
    max: 5,
    idleTimeoutMillis: 30_000,
    connectionTimeoutMillis: 5_000,
  });

  const migrationsDir = join(__dirname, '..', '..', 'packages/database/migrations');
  if (!existsSync(migrationsDir)) {
    throw new Error(`[sorteos] Directorio de migraciones no encontrado: ${migrationsDir}`);
  }

  const files = readdirSync(migrationsDir)
    .filter((f) => f.endsWith('.sql') && !f.endsWith('.example.sql'))
    .sort((a, b) => a.localeCompare(b, 'es'));

  for (const file of files) {
    const filePath = join(migrationsDir, file);
    const sql = readFileSync(filePath, 'utf-8');
    await pool.query(sql);
    console.log(`[sorteos] db-migrate applied ${file}`);
  }

  await pool.end();
  console.log('[sorteos] db-migrate: listo.');
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('[sorteos] db-migrate: error', err);
    process.exit(1);
  });
