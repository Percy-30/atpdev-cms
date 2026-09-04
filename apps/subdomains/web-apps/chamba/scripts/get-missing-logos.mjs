import fs from 'fs';

async function testHome() {
  const res = await fetch('https://www.convocatoriasdetrabajo.com/', {
    headers: { 'User-Agent': 'Mozilla/5.0' }
  });
  const html = await res.text();
  const links = [...html.matchAll(/href=["']([^"']+)["']/gi)].map(m => m[1]);
  console.log('Total links on home:', links.length);

  const keywords = ['sunat', 'sunafil', 'essalud', 'reniec', 'osiptel', 'interbank', 'alicorp', 'porres', 'anin', 'arequipa'];
  for (const k of keywords) {
    const matched = links.filter(l => l.toLowerCase().includes(k));
    console.log(`LINKS FOR ${k}:`, matched.slice(0, 3));
  }
}

testHome().catch(console.error);
