import fs from 'fs';
import path from 'path';

const jobsPath = path.resolve(process.cwd(), 'packages/database/src/jobs.ts');
let content = fs.readFileSync(jobsPath, 'utf8');

const entityToLogo = {
  "OFICINA NACIONAL DE PROCESOS ELECTORALES - ONPE": "/logos/onpe.jpg",
  "PROGRAMA NACIONAL PAIS - MIDIS": "/logos/midis.jpg",
  "RED DE SALUD VALLE DEL MANTARO - GORE JUNÍN": "/logos/red-salud-mantaro.jpg",
  "MINISTERIO PÚBLICO - FISCALÍA DE LA NACIÓN": "/logos/ministerio-publico.jpg",
  "RENIEC - REGISTRO NACIONAL DE IDENTIFICACIÓN Y ESTADO CIVIL": "/logos/reniec.jpg",
  "SUNAT - SUPERINTENDENCIA NACIONAL DE ADUANAS Y DE ADMINISTRACIÓN TRIBUTARIA": "/logos/sunat.jpg",
  "BANCO CENTRAL DE RESERVA DEL PERÚ - BCRP": "/logos/bcrp.jpg",
  "ESSALUD - SEGURO SOCIAL DE SALUD DEL PERÚ": "/logos/essalud.jpg",
  "PODER JUDICIAL DEL PERÚ - CORTE SUPERIOR DE JUSTICIA": "/logos/poder-judicial.jpg",
  "INSTITUTO NACIONAL DE ESTADÍSTICA E INFORMÁTICA - INEI": "/logos/inei.jpg",
  "JURADO NACIONAL DE ELECCIONES - JNE": "/logos/jne.jpg",
  "MUNICIPALIDAD DISTRITAL DE SAN MARTÍN DE PORRES": "/logos/san-martin-de-porres.svg",
  "MUNICIPALIDAD PROVINCIAL DEL CUSCO": "/logos/cusco.jpg",
  "AUTORIDAD NACIONAL DE INFRAESTRUCTURA - ANIN": "/logos/anin.jpg",
  "MINISTERIO DE EDUCACIÓN - MINEDU": "/logos/minedu.jpg",
  "MINISTERIO DE ECONOMÍA Y FINANZAS - MEF": "/logos/mef.jpg",
  "MINISTERIO DE SALUD - MINSA": "/logos/minsa.jpg",
  "SUPERINTENDENCIA NACIONAL DE FISCALIZACIÓN LABORAL - SUNAFIL": "/logos/sunafil.jpg",
  "ORGANISMO SUPERVISOR DE INVERSIÓN PRIVADA EN TELECOMUNICACIONES - OSIPTEL": "/logos/osiptel.jpg",
  "BANCO INTERNACIONAL DEL PERÚ S.A.A. - INTERBANK": "/logos/interbank.svg",
  "ALICORP S.A.A.": "/logos/alicorp.svg",
  "GOBIERNO REGIONAL DE AREQUIPA": "/logos/gore-arequipa.jpg"
};

let count = 0;
for (const [entity, logo] of Object.entries(entityToLogo)) {
  // Search for entity_name: "..." or entity_name: '...'
  const escapedEntity = entity.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(entity_name:\\s*["']${escapedEntity}["'],\\s*\\n\\s*entity_ruc:[^,\\n]+,\\s*\\n\\s*entity_verified:\\s*true,)`, 'g');
  
  content = content.replace(regex, (match) => {
    count++;
    return `${match}\n    entity_logo: "${logo}",`;
  });
}

fs.writeFileSync(jobsPath, content, 'utf8');
console.log(`Updated ${count} jobs with explicit entity_logo in jobs.ts`);
