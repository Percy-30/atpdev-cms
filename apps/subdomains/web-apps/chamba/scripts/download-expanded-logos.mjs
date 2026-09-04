import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LOGOS_DIR = path.resolve(__dirname, '../public/logos');

const EXPANDED_LOGOS = [
  { name: 'sunat', url: 'https://www.convocatoriasdetrabajo.com/imagenes/organizaciones/th-imagen-SUPERINTENDENCIA-NACIONAL-DE-ADUANAS-Y-DE-ADMINISTRACION-TRIBUTARIA.jpg' },
  { name: 'sunafil', url: 'https://www.convocatoriasdetrabajo.com/imagenes/organizaciones/th-imagen-SUPERINTENDENCIA-NACIONAL-DE-FISCALIZACION-LABORAL.jpg' },
  { name: 'essalud', url: 'https://www.convocatoriasdetrabajo.com/imagenes/organizaciones/th-imagen-SEGURO-SOCIAL-DE-SALUD-DEL-PERU.jpg' },
  { name: 'reniec', url: 'https://www.convocatoriasdetrabajo.com/imagenes/organizaciones/th-imagen-REGISTRO-NACIONAL-DE-IDENTIFICACION-Y-ESTADO-CIVIL.jpg' },
  { name: 'osiptel', url: 'https://www.convocatoriasdetrabajo.com/imagenes/organizaciones/th-imagen-ORGANISMO-SUPERVISOR-DE-INVERSION-PRIVADA-EN-TELECOMUNICACIONES.jpg' },
  { name: 'anin', url: 'https://www.convocatoriasdetrabajo.com/imagenes/organizaciones/th-imagen-AUTORIDAD-NACIONAL-DE-INFRAESTRUCTURA-ANIN.jpg' },
  { name: 'bcrp', url: 'https://www.convocatoriasdetrabajo.com/imagenes/organizaciones/th-imagen-BANCO-CENTRAL-DE-RESERVA-DEL-PERU.jpg' },
  { name: 'cusco', url: 'https://www.convocatoriasdetrabajo.com/imagenes/organizaciones/th-imagen-MUNICIPALIDAD-PROVINCIAL-DEL-CUSCO.jpg' },
  { name: 'sat-lima', url: 'https://www.convocatoriasdetrabajo.com/imagenes/organizaciones/th-imagen-SERVICIO-DE-ADMINISTRACION-TRIBUTARIA-DE-LIMA.jpg' },
  { name: 'indecopi', url: 'https://www.convocatoriasdetrabajo.com/imagenes/organizaciones/th-imagen-INSTITUTO-NACIONAL-DE-DEFENSA-DE-LA-COMPETENCIA-Y-DE-LA-PROTECCION-DE-LA-PROPIEDAD-INTELECTUAL.jpg' },
  { name: 'ositran', url: 'https://www.convocatoriasdetrabajo.com/imagenes/organizaciones/th-imagen-ORGANISMO-SUPERVISOR-DE-LA-INVERSION-EN-INFRAESTRUCTURA-DE-TRANSPORTE-DE-USO-PUBLICO.jpg' },
  { name: 'senasa', url: 'https://www.convocatoriasdetrabajo.com/imagenes/organizaciones/th-imagen-SERVICIO-NACIONAL-DE-SANIDAD-AGRARIA.jpg' },
  { name: 'electroperu', url: 'https://www.convocatoriasdetrabajo.com/imagenes/organizaciones/th-imagen-ELECTROPERU-SA.jpg' },
  { name: 'gore-cusco', url: 'https://www.convocatoriasdetrabajo.com/imagenes/organizaciones/th-imagen-GOBIERNO-REGIONAL-CUSCO.jpg' },
  { name: 'gore-arequipa', url: 'https://www.convocatoriasdetrabajo.com/imagenes/organizaciones/th-imagen-GERENCIA-REGIONAL-DE-TRABAJO-Y-PROMOCION-DEL-EMPLEO-AREQUIPA.jpg' },
];

async function downloadLogo(entry) {
  const destPath = path.join(LOGOS_DIR, `${entry.name}.jpg`);
  try {
    const res = await fetch(entry.url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'https://www.convocatoriasdetrabajo.com/organizaciones',
      },
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) {
      console.log(`❌ FAIL ${entry.name}.jpg — HTTP ${res.status}`);
      return false;
    }
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length < 200) {
      console.log(`❌ FAIL ${entry.name}.jpg — too small (${buf.length} bytes)`);
      return false;
    }
    fs.writeFileSync(destPath, buf);
    console.log(`✅ OK   ${entry.name}.jpg — ${(buf.length / 1024).toFixed(1)} KB`);
    return true;
  } catch (err) {
    console.log(`❌ FAIL ${entry.name}.jpg — ${err.message}`);
    return false;
  }
}

async function main() {
  console.log('Downloading expanded official logos...');
  for (const e of EXPANDED_LOGOS) {
    await downloadLogo(e);
  }
}

main().catch(console.error);
