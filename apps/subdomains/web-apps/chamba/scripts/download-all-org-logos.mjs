import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const destDir = path.resolve(__dirname, '../public/logos/orgs');

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

const listPath = path.resolve(__dirname, 'all-org-logos.json');
const allLogos = JSON.parse(fs.readFileSync(listPath, 'utf8'));

console.log(`Starting download of ${allLogos.length} official logos...`);

async function downloadOne(relPath) {
  // relPath is like "imagenes/organizaciones/th-imagen-SUPERINTENDENCIA-...jpg"
  const fileName = path.basename(relPath);
  const destFile = path.join(destDir, fileName);

  if (fs.existsSync(destFile) && fs.statSync(destFile).size > 200) {
    return { status: 'cached', file: fileName };
  }

  const url = `https://www.convocatoriasdetrabajo.com/${relPath}`;
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'https://www.convocatoriasdetrabajo.com/organizaciones'
      },
      signal: AbortSignal.timeout(6000)
    });

    if (!res.ok) {
      return { status: 'http_err', file: fileName, code: res.status };
    }

    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length < 150) {
      return { status: 'too_small', file: fileName };
    }

    fs.writeFileSync(destFile, buf);
    return { status: 'downloaded', file: fileName, size: buf.length };
  } catch (err) {
    return { status: 'error', file: fileName, error: err.message };
  }
}

// Concurrency pool of 10
async function run() {
  const concurrency = 12;
  let idx = 0;
  let successCount = 0;

  async function worker() {
    while (idx < allLogos.length) {
      const current = allLogos[idx++];
      const res = await downloadOne(current);
      if (res.status === 'downloaded' || res.status === 'cached') {
        successCount++;
      }
    }
  }

  const workers = Array.from({ length: concurrency }, () => worker());
  await Promise.all(workers);

  console.log(`Finished: ${successCount} / ${allLogos.length} official logos ready in ${destDir}`);
}

run().catch(console.error);
