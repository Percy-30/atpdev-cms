import fs from 'fs';

async function checkSMP() {
  const res = await fetch('https://www.gob.pe/munisanmartindeporres', {
    headers: { 'User-Agent': 'Mozilla/5.0' }
  });
  const html = await res.text();
  const imgs = [...html.matchAll(/src=["']([^"']+)["']/g)].map(m => m[1]);
  console.log('SMP images:', imgs.filter(i => i.includes('logo') || i.includes('institucional') || i.includes('upload')));
}

async function checkInterbank() {
  // Let's search Wikipedia or Wikimedia for official SVG of Interbank and Alicorp
  const targets = [
    { name: 'interbank', url: 'https://es.wikipedia.org/wiki/Interbank' },
    { name: 'alicorp', url: 'https://es.wikipedia.org/wiki/Alicorp' },
    { name: 'banco-nacion', url: 'https://es.wikipedia.org/wiki/Banco_de_la_Naci%C3%B3n_(Per%C3%BA)' }
  ];

  for (const t of targets) {
    try {
      const res = await fetch(t.url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
      const html = await res.text();
      const imgs = [...html.matchAll(/src=["']([^"']+\.(?:png|svg|jpg))["']/g)].map(m => m[1]);
      console.log(`${t.name} images:`, imgs.slice(0, 5));
    } catch (e) {
      console.log('Error', t.name, e.message);
    }
  }
}

async function main() {
  await checkSMP();
  await checkInterbank();
}

main();
