import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const orgsDir = path.resolve(__dirname, '../public/logos/orgs');
const files = fs.readdirSync(orgsDir);

console.log(`Found ${files.length} logo files in /logos/orgs`);

// Each file name looks like:
// th-imagen-SUPERINTENDENCIA-NACIONAL-DE-ADUANAS-Y-DE-ADMINISTRACION-TRIBUTARIA.jpg
// th-imagen-MUNICIPALIDAD-PROVINCIAL-DE-HUAMANGA.jpg
// th-imagen-HOSPITAL-REZOLA-CANETE.jpg

const map = [];

for (const file of files) {
  // Strip prefix "th-imagen-" or "th-" and extension ".jpg"
  const rawClean = file
    .replace(/^th-imagen-/, '')
    .replace(/^th-/, '')
    .replace(/\.(jpg|jpeg|png)$/i, '');

  // Words separated by '-'
  const words = rawClean.split('-').filter(w => w.length > 0);
  const fullName = words.join(' ');

  map.push({
    file: `/logos/orgs/${file}`,
    name: fullName,
    keywords: [fullName, rawClean]
  });
}

const outputPath = path.resolve(__dirname, '../src/components/org-logos.json');
fs.writeFileSync(outputPath, JSON.stringify(map, null, 2), 'utf8');

console.log(`Saved ${map.length} mappings to ${outputPath}`);
