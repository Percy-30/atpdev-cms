import fs from 'fs';

function parseTitle(fullTitle) {
  let entityName = '';
  let jobTitle = fullTitle;

  // 1. Check colon pattern: "ENTITY: JOB_TITLE"
  if (fullTitle.includes(':')) {
    const parts = fullTitle.split(':');
    entityName = parts[0].trim();
    jobTitle = parts.slice(1).join(':').trim();
  } 
  // 2. Check "requiere", "busca", "solicita", "convoca"
  else {
    const verbMatch = fullTitle.match(/^(.+?)\s+(?:requiere|busca|solicita|convoca)\s+(.+)$/i);
    if (verbMatch) {
      entityName = verbMatch[1].trim();
      jobTitle = verbMatch[2].trim();
    }
  }

  // 3. Regex entity pattern matcher if still empty
  if (!entityName) {
    const entityPattern = /^(MUNICIPALIDAD\s+(?:DISTRITAL\s+|PROVINCIAL\s+)?(?:DE\s+|DEL\s+)?[A-ZÁÉÍÓÚÑ\s-]+|GOBIERNO\s+REGIONAL\s+(?:DE\s+|DEL\s+)?[A-ZÁÉÍÓÚÑ\s-]+|HOSPITAL\s+[A-ZÁÉÍÓÚÑ\s-]+|RED\s+DE\s+SALUD\s+[A-ZÁÉÍÓÚÑ\s-]+|UNIVERSIDAD\s+(?:NACIONAL\s+)?[A-ZÁÉÍÓÚÑ\s-]+|UGEL\s*[0-9A-ZÁÉÍÓÚÑ\s-]+|MINISTERIO\s+[A-ZÁÉÍÓÚÑ\s-]+|INSTITUTO\s+[A-ZÁÉÍÓÚÑ\s-]+|DIRECCI[OÓ]N\s+REGIONAL\s+[A-ZÁÉÍÓÚÑ\s-]+|GERENCIA\s+[A-ZÁÉÍÓÚÑ\s-]+)/i;
    const match = fullTitle.match(entityPattern);
    if (match) {
      entityName = match[1].trim();
      jobTitle = fullTitle.replace(match[1], '').replace(/^[\s:-]+/, '').trim();
    } else {
      entityName = "ENTIDAD PÚBLICA DE PERÚ";
    }
  }

  return { entityName, jobTitle };
}

async function run() {
  const res = await fetch('https://www.convocatoriasdetrabajo.com/', {
    headers: { 'User-Agent': 'Mozilla/5.0' }
  });
  const html = await res.text();
  const blocks = html.split('oferta-de-empleo-');

  console.log(`Testing title parser on ${blocks.length - 1} live offers:`);
  let extractedCount = 0;

  let jobsCount = 0;

  for (let i = 1; i < blocks.length && jobsCount < 50; i++) {
    const linkMatch = blocks[i].match(/^([^\"]+\.html)/);
    const titleMatch = blocks[i].match(/title=\"([^\"]+)\"/);
    if (linkMatch && titleMatch) {
      jobsCount++;
      const { entityName, jobTitle } = parseTitle(titleMatch[1].trim());
      if (entityName !== 'ENTIDAD PÚBLICA DE PERÚ') {
        extractedCount++;
        console.log(`[${jobsCount}] ✅ ENTITY: "${entityName}" | JOB: "${jobTitle.slice(0, 45)}..."`);
      } else {
        console.log(`[${jobsCount}] ⚠️ FAILED ENTITY: "${titleMatch[1]}"`);
      }
    }
  }

  console.log(`\nSuccessfully extracted entity from ${extractedCount} / 50 offers!`);
}

run();
