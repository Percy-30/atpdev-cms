/**
 * Script opcional: verificar que la base de datos responda.
 *
 * Uso:
 *   npx tsx scripts/db-up.ts
 */
import { Pool } from 'pg';

async function main(): Promise<void> {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    throw new Error('[sorteos] DATABASE_URL no definido.');
  }

  const pool = new Pool({ connectionString: dbUrl, max: 1 });
  try {
    const res = await pool.query('SELECT current_database() AS db, current_user AS user, version() AS version');
    console.log('[sorteos] db-up OK');
    console.log(`  database : ${res.rows[0]?.db}`);
    console.log(`  user     : ${res.rows[0]?.user}`);
    console.log(`  version  : ${res.rows[0]?.version?.split(' ')[0] ?? ''}`);
  } finally {
    await pool.end();
  }
}

main().then(() => process.exit(0)).catch((err) => {
  console.error('[sorteos] db-up error:', err);
  process.exit(1);
});
