import fs from 'fs';
import { scrapeLiveConvocatoriasFeed } from '../../../../../packages/database/src/scraper';

async function test() {
  const jobs = await scrapeLiveConvocatoriasFeed();
  console.log(`Fetched ${jobs.length} live jobs`);

  const entityLogoContent = fs.readFileSync('apps/subdomains/web-apps/chamba/src/components/EntityLogo.tsx', 'utf8');
  const eqIdx = entityLogoContent.indexOf('= [');
  const endIdx = entityLogoContent.indexOf('];', eqIdx);
  const LOCAL_LOGO_MAP = eval(entityLogoContent.slice(eqIdx + 2, endIdx + 1));

  const orgLogos = JSON.parse(
    fs.readFileSync('apps/subdomains/web-apps/chamba/src/components/org-logos.json', 'utf8')
  );

  function normalize(str: string): string {
    return str
      .toUpperCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^A-Z0-9\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function findLogo(entityName: string) {
    const upper = normalize(entityName);

    // 1. Check LOCAL_LOGO_MAP
    for (const entry of LOCAL_LOGO_MAP) {
      if (entry.keywords.some((k: string) => upper.includes(normalize(k)))) {
        return { file: entry.file, source: 'LOCAL_LOGO_MAP' };
      }
    }

    // 2. Check orgLogos (292 downloaded logos)
    for (const org of orgLogos) {
      const orgNorm = normalize(org.name);
      if (upper.includes(orgNorm) || orgNorm.includes(upper)) {
        return { file: org.file, source: 'ORG_LOGOS' };
      }

      const words = orgNorm.split(' ').filter(w => w.length >= 4 && !['MUNICIPALIDAD', 'DISTRITAL', 'PROVINCIAL', 'GOBIERNO', 'REGIONAL', 'NACIONAL', 'PARA', 'LIMA', 'PERU'].includes(w));
      if (words.length > 0 && words.every(w => upper.includes(w))) {
        return { file: org.file, source: 'ORG_WORDS' };
      }
    }

    // Sector fallback by keyword
    if (upper.includes('HOSPITAL') || upper.includes('SALUD') || upper.includes('DIRESA')) {
      return { file: '/logos/minsa.jpg', source: 'SECTOR_SALUD' };
    }
    if (upper.includes('UGEL') || upper.includes('DRE') || upper.includes('EDUCACION') || upper.includes('PEDAGOGICA')) {
      return { file: '/logos/minedu.jpg', source: 'SECTOR_EDUCACION' };
    }
    if (upper.includes('AGRICULTURA') || upper.includes('DRA') || upper.includes('AGRARIA')) {
      return { file: '/logos/senasa.jpg', source: 'SECTOR_AGRICULTURA' };
    }
    if (upper.includes('CALLAO')) {
      return { file: '/logos/callao.jpg', source: 'SECTOR_CALLAO' };
    }
    if (upper.includes('LIMA') || upper.includes('CATASTRAL')) {
      return { file: '/logos/lima.jpg', source: 'SECTOR_LIMA' };
    }

    return null;
  }

  let matched = 0;
  const unmatched: string[] = [];
  const matches: any[] = [];

  for (const job of jobs) {
    const result = findLogo(job.entity_name);
    if (result) {
      matched++;
      matches.push({ entity: job.entity_name, logo: result.file, source: result.source });
    } else {
      unmatched.push(job.entity_name);
    }
  }

  console.log(`\n========================================================`);
  console.log(`LIVE FEED MATCH RATE: ${matched} / ${jobs.length} (${((matched / jobs.length) * 100).toFixed(1)}%)`);
  console.log(`========================================================\n`);

  for (const m of matches) {
    console.log(`✅ "${m.entity}" -> ${m.logo} (${m.source})`);
  }

  if (unmatched.length > 0) {
    console.log('\nUnmatched:', [...new Set(unmatched)]);
  }
}

test().catch(console.error);
