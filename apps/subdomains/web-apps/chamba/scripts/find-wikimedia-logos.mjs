import fs from 'fs';

async function searchCommons(query) {
  const url = `https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(query)}&srnamespace=6&format=json`;
  const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
  const data = await res.json();
  console.log(`Results for ${query}:`, data?.query?.search?.map(s => s.title));
  
  if (data?.query?.search?.length > 0) {
    const firstTitle = data.query.search[0].title;
    const infoUrl = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(firstTitle)}&prop=imageinfo&iiprop=url&format=json`;
    const infoRes = await fetch(infoUrl, { headers: { 'User-Agent': 'Mozilla/5.0' } });
    const infoData = await infoRes.json();
    const pages = infoData?.query?.pages;
    const pageId = Object.keys(pages)[0];
    const imgUrl = pages[pageId]?.imageinfo?.[0]?.url;
    console.log(`  Direct URL for ${firstTitle}:`, imgUrl);
    return imgUrl;
  }
  return null;
}

async function main() {
  await searchCommons('Interbank logo');
  await searchCommons('Alicorp logo');
  await searchCommons('Banco de la Nacion Peru logo');
  await searchCommons('San Martin de Porres escudo');
  await searchCommons('Escudo de San Martin de Porres');
}

main();
