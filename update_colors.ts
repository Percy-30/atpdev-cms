import { updateSiteConfig } from './packages/database/src/index.js';
import * as dotenv from 'dotenv';
import path from 'path';

// Cargar env
dotenv.config({ path: path.resolve(process.cwd(), 'apps/portal/.env.local') });
dotenv.config({ path: path.resolve(process.cwd(), 'apps/admin/.env.local') });

async function run() {
  try {
    console.log("Updating site config colors...");
    const result = await updateSiteConfig({
      primary_color: '#0052FF',
      secondary_color: '#1A1A1A'
    });
    console.log("Success:", result);
  } catch (e) {
    console.error("Failed:", e);
  }
}

run();
