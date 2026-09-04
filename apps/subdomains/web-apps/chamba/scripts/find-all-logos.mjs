import fs from 'fs';

async function main() {
  const res = await fetch('https://www.convocatoriasdetrabajo.com/organizaciones', {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
  });
  const html = await res.text();
  
  const regex = /src=["'](imagenes\/organizaciones\/[^"']+)["']/gi;
  let match;
  const logos = new Set();
  while ((match = regex.exec(html)) !== null) {
    logos.add(match[1]);
  }

  const logoList = Array.from(logos).sort();
  fs.writeFileSync('all-org-logos.json', JSON.stringify(logoList, null, 2));
  console.log('Saved', logoList.length, 'logos to all-org-logos.json');
}

main().catch(console.error);
