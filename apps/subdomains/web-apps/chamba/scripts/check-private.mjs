import fs from 'fs';

async function checkPrivate() {
  for (const url of [
    'https://www.convocatoriasdetrabajo.com/empleos-BANCO-INTERBANK-PERU-376.html',
    'https://www.convocatoriasdetrabajo.com/empleos-ALICORP-S-A-368.html'
  ]) {
    const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const html = await res.text();
    const regex = /<img[^>]+src=["']([^"']+)["']/gi;
    let m;
    const imgs = [];
    while ((m = regex.exec(html)) !== null) {
      if (!m[1].includes('logo-convocatorias')) imgs.push(m[1]);
    }
    console.log(url, imgs);
  }
}

checkPrivate().catch(console.error);
