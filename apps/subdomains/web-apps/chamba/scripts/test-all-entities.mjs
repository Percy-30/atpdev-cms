import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Read EntityLogo.tsx
const entityLogoPath = path.resolve(__dirname, '../src/components/EntityLogo.tsx');
const entityLogoContent = fs.readFileSync(entityLogoPath, 'utf8');

// Read jobs.ts
const jobsPath = path.resolve(process.cwd(), 'packages/database/src/jobs.ts');
const jobsContent = fs.readFileSync(jobsPath, 'utf8');

// Extract all entity_name in jobs.ts
const matches = [...jobsContent.matchAll(/entity_name:\s*["']([^"']+)["']/g)];
const entities = [...new Set(matches.map(m => m[1]))];

console.log(`Found ${entities.length} unique entity names in INITIAL_JOBS:\n`);

// Parse LOCAL_LOGO_MAP from EntityLogo.tsx
const eqIdx = entityLogoContent.indexOf('= [');
const endIdx = entityLogoContent.indexOf('];', eqIdx);
const arrayStr = entityLogoContent.slice(eqIdx + 2, endIdx + 1);

// Safely evaluate array
const LOCAL_LOGO_MAP = eval(arrayStr);

function findLocalLogo(entityName) {
  const upper = entityName.toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  for (const entry of LOCAL_LOGO_MAP) {
    if (entry.keywords.some(k => {
      const normK = k.toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      return upper.includes(normK);
    })) {
      return entry.file;
    }
  }
  return null;
}

const publicDir = path.resolve(__dirname, '../public');

let matchedCount = 0;
const missing = [];

for (const entity of entities) {
  const logo = findLocalLogo(entity);
  if (logo) {
    const fullPath = path.join(publicDir, logo);
    if (fs.existsSync(fullPath)) {
      console.log(`✅ [OK] "${entity}" -> ${logo}`);
      matchedCount++;
    } else {
      console.log(`⚠️ [MISSING FILE] "${entity}" -> ${logo} (File doesn't exist!)`);
      missing.push({ entity, logo, status: 'missing_file' });
    }
  } else {
    console.log(`❌ [NO MATCH] "${entity}"`);
    missing.push({ entity, status: 'no_match' });
  }
}

console.log(`\n==================================================`);
console.log(`RESULT: ${matchedCount} / ${entities.length} (${((matchedCount/entities.length)*100).toFixed(1)}%) with official logos`);
console.log(`==================================================\n`);

if (missing.length > 0) {
  console.log('Unmatched entities:');
  console.log(JSON.stringify(missing, null, 2));
}
