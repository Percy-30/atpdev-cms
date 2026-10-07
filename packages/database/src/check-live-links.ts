/**
 * Verificador REAL de enlaces (hace peticiones HTTP).
 * A diferencia de test-verify-all-jobs.ts (que solo compara patrones),
 * este script abre cada URL y clasifica el resultado.
 *
 * Uso: npx tsx src/check-live-links.ts [--out=ruta.json] [--concurrency=16]
 */
import { getJobPostings } from './jobs';

type LinkStatus = 'ok' | 'broken' | 'blocked' | 'timeout' | 'error';
type LinkKind = 'pdf' | 'specific' | 'generic-portal' | 'self-reference';

interface LinkResult {
  url: string;
  status: LinkStatus;
  httpCode?: number;
  finalUrl?: string;
  kind: LinkKind;
  error?: string;
  jobs: string[];
}

const args = Object.fromEntries(
  process.argv.slice(2).map((a) => {
    const [k, v] = a.replace(/^--/, '').split('=');
    return [k, v ?? 'true'];
  })
);
const CONCURRENCY = Number(args.concurrency || 16);
const TIMEOUT_MS = Number(args.timeout || 15000);
const OUT = args.out as string | undefined;

const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36';

/** Clasifica si el enlace lleva a la convocatoria concreta o solo a una portada genérica. */
function classify(url: string): LinkKind {
  let u: URL;
  try {
    u = new URL(url);
  } catch {
    return 'generic-portal';
  }
  const host = u.hostname.replace(/^www\./, '');
  const path = u.pathname.replace(/\/+$/, '');
  if (host.endsWith('atpdev.dev') || host.endsWith('atpdev.pe')) return 'self-reference';
  if (/\.pdf($|\?)/i.test(u.pathname) || host.includes('drive.google.com') || host.includes('docs.google.com')) {
    return 'pdf';
  }
  // gob.pe/<entidad> sin más ruta = portada institucional
  if (host === 'gob.pe') {
    const segs = path.split('/').filter(Boolean);
    if (segs.length <= 1) return 'generic-portal';
    if (segs[0] === 'institucion' && segs.length <= 2) return 'generic-portal';
  }
  // Raíz de un dominio sin parámetros = portada
  if ((path === '' || path === '/') && !u.search) return 'generic-portal';
  return 'specific';
}

async function probe(url: string): Promise<Omit<LinkResult, 'jobs' | 'kind'>> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TIMEOUT_MS);
  try {
    // GET (muchos portales del Estado rechazan HEAD)
    const res = await fetch(url, {
      method: 'GET',
      redirect: 'follow',
      signal: ctrl.signal,
      headers: { 'User-Agent': UA, Accept: 'text/html,application/pdf,*/*;q=0.8', 'Accept-Language': 'es-PE,es;q=0.9' },
    });
    // No descargamos el cuerpo completo
    try {
      await res.body?.cancel();
    } catch {}
    const code = res.status;
    let status: LinkStatus = 'ok';
    if (code === 404 || code === 410 || code >= 500) status = 'broken';
    else if (code === 401 || code === 403 || code === 429) status = 'blocked';
    else if (code >= 400) status = 'broken';
    return { url, status, httpCode: code, finalUrl: res.url !== url ? res.url : undefined };
  } catch (e: any) {
    const msg = String(e?.cause?.code || e?.name || e?.message || e);
    return { url, status: msg.includes('Abort') ? 'timeout' : 'error', error: msg };
  } finally {
    clearTimeout(timer);
  }
}

async function main() {
  const jobs = await getJobPostings();
  const map = new Map<string, Set<string>>();
  const add = (u: string | undefined, slug: string) => {
    if (!u || !/^https?:\/\//i.test(u)) return;
    if (!map.has(u)) map.set(u, new Set());
    map.get(u)!.add(slug);
  };
  for (const j of jobs) {
    add(j.apply_url, j.slug);
    add(j.bases_pdf_url, j.slug);
  }

  const urls = [...map.keys()];
  console.log(`Convocatorias: ${jobs.length} | URLs únicas a verificar: ${urls.length} | concurrencia ${CONCURRENCY}`);

  const results: LinkResult[] = [];
  let idx = 0;
  let done = 0;
  async function worker() {
    while (idx < urls.length) {
      const url = urls[idx++];
      const r = await probe(url);
      results.push({ ...r, kind: classify(url), jobs: [...map.get(url)!] });
      done++;
      if (done % 50 === 0) console.log(`  ${done}/${urls.length}...`);
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, worker));

  // Resumen por convocatoria: ¿el enlace principal (bases || postulación) funciona y es específico?
  const byUrl = new Map(results.map((r) => [r.url, r]));
  let jobOkSpecific = 0, jobOkGeneric = 0, jobBroken = 0, jobUnknown = 0;
  for (const j of jobs) {
    const main = j.bases_pdf_url || j.apply_url;
    const r = main ? byUrl.get(main) : undefined;
    if (!r) { jobBroken++; continue; }
    if (r.status === 'broken') jobBroken++;
    else if (r.status !== 'ok') jobUnknown++;
    else if (r.kind === 'pdf' || r.kind === 'specific') jobOkSpecific++;
    else jobOkGeneric++;
  }

  const count = (pred: (r: LinkResult) => boolean) => results.filter(pred).length;
  console.log('\n================ RESULTADO REAL (HTTP) ================');
  console.log(`URLs OK:              ${count((r) => r.status === 'ok')}`);
  console.log(`URLs rotas (404/5xx): ${count((r) => r.status === 'broken')}`);
  console.log(`Bloqueadas (403/429): ${count((r) => r.status === 'blocked')}`);
  console.log(`Timeout:              ${count((r) => r.status === 'timeout')}`);
  console.log(`Error DNS/TLS/red:    ${count((r) => r.status === 'error')}`);
  console.log('-- Tipo de enlace --');
  console.log(`PDF/Drive directo:    ${count((r) => r.kind === 'pdf')}`);
  console.log(`Página específica:    ${count((r) => r.kind === 'specific')}`);
  console.log(`Portada genérica:     ${count((r) => r.kind === 'generic-portal')}`);
  console.log(`Auto-referencia:      ${count((r) => r.kind === 'self-reference')}`);
  console.log('-- Por convocatoria (enlace principal) --');
  console.log(`Funciona y lleva a la convocatoria: ${jobOkSpecific}`);
  console.log(`Funciona pero es portada genérica:  ${jobOkGeneric}`);
  console.log(`Roto:                               ${jobBroken}`);
  console.log(`No verificable (bloqueo/timeout):   ${jobUnknown}`);

  const topBroken = results
    .filter((r) => r.status === 'broken' || r.status === 'error')
    .sort((a, b) => b.jobs.length - a.jobs.length)
    .slice(0, 25);
  if (topBroken.length) {
    console.log('\nPeores enlaces (por nº de convocatorias afectadas):');
    for (const r of topBroken) console.log(`  [${r.httpCode ?? r.error}] x${r.jobs.length} ${r.url}`);
  }

  if (OUT) {
    const fs = await import('node:fs');
    fs.writeFileSync(OUT, JSON.stringify({ generatedAt: new Date().toISOString(), results }, null, 2));
    console.log(`\nReporte completo: ${OUT}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
