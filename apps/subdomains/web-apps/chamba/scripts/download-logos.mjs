import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LOGOS_DIR = path.resolve(__dirname, '../public/logos');

// EXACT real URLs discovered from convocatoriasdetrabajo.com/organizaciones
const LOGOS = [
  { name: 'onpe', url: 'https://www.convocatoriasdetrabajo.com/imagenes/organizaciones/th-imagen-OFICINA-NACIONAL-DE-PROCESOS-ELECTORALES.jpg' },
  { name: 'ministerio-publico', url: 'https://www.convocatoriasdetrabajo.com/imagenes/organizaciones/th-imagen-MINISTERIO-PUBLICO-FISCALIA-DE-LA-NACION.jpg' },
  { name: 'poder-judicial', url: 'https://www.convocatoriasdetrabajo.com/imagenes/organizaciones/th-imagen-PODER-JUDICIAL-DEL-PERU.jpg' },
  { name: 'jne', url: 'https://www.convocatoriasdetrabajo.com/imagenes/organizaciones/th-imagen-jurado-nacional-de-elecciones.jpg' },
  { name: 'inei', url: 'https://www.convocatoriasdetrabajo.com/imagenes/organizaciones/th-imagen-INSTITUTO-NACIONAL-DE-ESTADISTICA-E-INFORMATICA.jpg' },
  { name: 'red-salud-mantaro', url: 'https://www.convocatoriasdetrabajo.com/imagenes/organizaciones/th-imagen-RED-DE-SALUD-VALLE-DEL-MANTARO.jpg' },
  { name: 'sunarp', url: 'https://www.convocatoriasdetrabajo.com/imagenes/organizaciones/th-imagen-SUPERINTENDENCIA-NACIONAL-DE-LOS-REGISTROS-PUBLICOS.jpg' },
  { name: 'minedu', url: 'https://www.convocatoriasdetrabajo.com/imagenes/organizaciones/th-imagen-MINISTERIO-DE-EDUCACION.jpg' },
  { name: 'mef', url: 'https://www.convocatoriasdetrabajo.com/imagenes/organizaciones/th-imagen-MINISTERIO-DE-ECONOMIA-Y-FINANZAS.jpg' },
  { name: 'minsa', url: 'https://www.convocatoriasdetrabajo.com/imagenes/organizaciones/th-imagen-DIRECCION-REGIONAL-DE-SALUD-SAN-MARTIN.jpg' },
  { name: 'midis', url: 'https://www.convocatoriasdetrabajo.com/imagenes/organizaciones/th-imagen-PROGRAMA-NACIONAL-DE-APOYO-DIRECTO-A-LOS-MAS-POBRES.jpg' },
  { name: 'sbs', url: 'https://www.convocatoriasdetrabajo.com/imagenes/organizaciones/th-imagen-SUPERINTENDENCIA-DE-BANCA-SEGUROS-Y-AFP-SBS.jpg' },
  { name: 'agrobanco', url: 'https://www.convocatoriasdetrabajo.com/imagenes/organizaciones/th-imagen-BANCO-AGROPECUARIO-AGROBANCO.jpg' },
  { name: 'osinergmin', url: 'https://www.convocatoriasdetrabajo.com/imagenes/organizaciones/th-imagen-ORGANISMO-SUPERVISOR-DE-LA-INVERSION-EN-ENERGIA-Y-MINERIA.jpg' },
  { name: 'devida', url: 'https://www.convocatoriasdetrabajo.com/imagenes/organizaciones/th-imagen-COMISION-NACIONAL-PARA-EL-DESARROLLO-Y-VIDA-SIN-DROGAS.jpg' },
  { name: 'ipd', url: 'https://www.convocatoriasdetrabajo.com/imagenes/organizaciones/th-imagen-INSTITUTO-PERUANO-DEL-DEPORTE.jpg' },
  { name: 'inabif', url: 'https://www.convocatoriasdetrabajo.com/imagenes/organizaciones/th-imagen-PROGRAMA-INTEGRAL-NACIONAL-PARA-EL-BIENESTAR-FAMILIAR.jpg' },
  { name: 'minam', url: 'https://www.convocatoriasdetrabajo.com/imagenes/organizaciones/th-imagen-MINISTERIO-DEL-AMBIENTE.jpg' },
  { name: 'minem', url: 'https://www.convocatoriasdetrabajo.com/imagenes/organizaciones/th-imagen-MINISTERIO-DE-ENERGIA-Y-MINAS.jpg' },
  { name: 'mindef', url: 'https://www.convocatoriasdetrabajo.com/imagenes/organizaciones/th-imagen-MINISTERIO-DE-DEFENSA.jpg' },
  { name: 'lima', url: 'https://www.convocatoriasdetrabajo.com/imagenes/organizaciones/th-imagen-MUNICIPALIDAD-METROPOLITANA-DE-LIMA.jpg' },
  { name: 'surco', url: 'https://www.convocatoriasdetrabajo.com/imagenes/organizaciones/th-imagen-MUNICIPALIDAD-DE-SANTIAGO-DE-SURCO.jpg' },
  { name: 'unfv', url: 'https://www.convocatoriasdetrabajo.com/imagenes/organizaciones/th-imagen-UNIVERSIDAD-NACIONAL-FEDERICO-VILLARREAL.jpg' },
  { name: 'sencico', url: 'https://www.convocatoriasdetrabajo.com/imagenes/organizaciones/th-imagen-SERVICIO-NACIONAL-DE-CAPACITACION-PARA-LA-INDUSTRIA-DE-LA-CONSTRUCCION.jpg' },
  { name: 'pronabec', url: 'https://www.convocatoriasdetrabajo.com/imagenes/organizaciones/th-imagen-PROGRAMA-NACIONAL-DE-BECAS-Y-CREDITOS-EDUCATIVO.jpg' },
  { name: 'sineace', url: 'https://www.convocatoriasdetrabajo.com/imagenes/organizaciones/th-imagen-SISTEMA-NACIONAL-DE-EVALUACION-ACREDITACION-Y-CERTIFICACION-DE-LA-CALIDAD-EDUCATIVA.jpg' },
  { name: 'cofide', url: 'https://www.convocatoriasdetrabajo.com/imagenes/organizaciones/th-imagen-CORPORACION-FINANCIERA-DE-DESARROLLO-S-A-COFIDE.jpg' },
  { name: 'callao', url: 'https://www.convocatoriasdetrabajo.com/imagenes/organizaciones/th-imagen-GOBIERNO-REGIONAL-DEL-CALLAO.jpg' },
  { name: 'ayacucho', url: 'https://www.convocatoriasdetrabajo.com/imagenes/organizaciones/th-imagen-GOBIERNO-REGIONAL-DE-AYACUCHO.jpg' },
  { name: 'moquegua', url: 'https://www.convocatoriasdetrabajo.com/imagenes/organizaciones/th-imagen-GOBIERNO-REGIONAL-MOQUEGUA.jpg' },
  { name: 'marina', url: 'https://www.convocatoriasdetrabajo.com/imagenes/organizaciones/th-imagen-MARINA-DE-GERRA-DEL-PERU.jpg' },
  { name: 'zofratacna', url: 'https://www.convocatoriasdetrabajo.com/imagenes/organizaciones/th-imagen-ZONA-FRANCA-DE-TACNA-ZOFRATACNA.jpg' },
  { name: 'igp', url: 'https://www.convocatoriasdetrabajo.com/imagenes/organizaciones/th-imagen-INSTITUTO-GEOFISICO-DEL-PERU.jpg' },
  { name: 'ingemmet', url: 'https://www.convocatoriasdetrabajo.com/imagenes/organizaciones/th-imagen-INSTITUTO-GEOLOGICO-MINERO-Y-METALURGICO.jpg' },
];

if (!fs.existsSync(LOGOS_DIR)) {
  fs.mkdirSync(LOGOS_DIR, { recursive: true });
}

async function downloadLogo(entry) {
  const destPath = path.join(LOGOS_DIR, `${entry.name}.jpg`);
  if (fs.existsSync(destPath) && fs.statSync(destPath).size > 500) {
    console.log(`✅ SKIP ${entry.name}.jpg (exists)`);
    return true;
  }
  try {
    const res = await fetch(entry.url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'https://www.convocatoriasdetrabajo.com/organizaciones',
      },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) { console.log(`❌ FAIL ${entry.name}.jpg — HTTP ${res.status}`); return false; }
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length < 200) { console.log(`❌ FAIL ${entry.name}.jpg — too small`); return false; }
    fs.writeFileSync(destPath, buf);
    console.log(`✅ OK   ${entry.name}.jpg — ${(buf.length/1024).toFixed(1)} KB`);
    return true;
  } catch (err) {
    console.log(`❌ FAIL ${entry.name}.jpg — ${err.message}`);
    return false;
  }
}

async function main() {
  console.log(`\n🏛️  CHAMBA PRO — Real Logo Downloader (from convocatoriasdetrabajo.com)\n`);
  let ok = 0, fail = 0;
  for (const e of LOGOS) { if (await downloadLogo(e)) ok++; else fail++; }
  console.log(`\n📊 ${ok} downloaded, ${fail} failed, ${LOGOS.length} total`);
  const files = fs.readdirSync(LOGOS_DIR);
  console.log(`📁 /public/logos/: ${files.length} files`);
  files.forEach(f => console.log(`   ${f} (${(fs.statSync(path.join(LOGOS_DIR, f)).size/1024).toFixed(1)} KB)`));
}

main().catch(console.error);
