import fs from 'fs';

async function fetchOrgLogos() {
  const pages = [
    { key: 'sunat', url: 'https://www.convocatoriasdetrabajo.com/empleos-SUPERINTENDENCIA-NACIONAL-DE-ADUANAS-Y-DE-ADMINISTRACION-TRIBUTARIA-SUNAT-4.html' },
    { key: 'sunafil', url: 'https://www.convocatoriasdetrabajo.com/empleos-SUPERINTENDENCIA-NACIONAL-DE-FISCALIZACION-LABORAL-SUNAFIL-72.html' },
    { key: 'essalud', url: 'https://www.convocatoriasdetrabajo.com/empleos-SEGURO-SOCIAL-DE-SALUD-DEL-PERU-ESSALUD-11.html' },
    { key: 'reniec', url: 'https://www.convocatoriasdetrabajo.com/empleos-REGISTRO-NACIONAL-DE-IDENTIFICACION-Y-ESTADO-CIVIL-RENIEC-2.html' },
    { key: 'osiptel', url: 'https://www.convocatoriasdetrabajo.com/empleos-ORGANISMO-SUPERVISOR-DE-INVERSION-PRIVADA-EN-TELECOMUNICACIONES-OSIPTEL-32.html' },
    { key: 'interbank', url: 'https://www.convocatoriasdetrabajo.com/empleos-BANCO-INTERBANK-PERU-376.html' },
    { key: 'alicorp', url: 'https://www.convocatoriasdetrabajo.com/empleos-ALICORP-S-A-368.html' },
    { key: 'anin', url: 'https://www.convocatoriasdetrabajo.com/empleos-AUTORIDAD-NACIONAL-DE-INFRAESTRUCTURA-ANIN-1579.html' },
    { key: 'bcrp', url: 'https://www.convocatoriasdetrabajo.com/imagenes/organizaciones/th-imagen-BANCO-CENTRAL-DE-RESERVA-DEL-PERU.jpg' },
    { key: 'cusco', url: 'https://www.convocatoriasdetrabajo.com/imagenes/organizaciones/th-imagen-MUNICIPALIDAD-PROVINCIAL-DEL-CUSCO.jpg' },
    { key: 'gore-cusco', url: 'https://www.convocatoriasdetrabajo.com/imagenes/organizaciones/th-imagen-GOBIERNO-REGIONAL-CUSCO.jpg' },
    { key: 'sat-lima', url: 'https://www.convocatoriasdetrabajo.com/imagenes/organizaciones/th-imagen-SERVICIO-DE-ADMINISTRACION-TRIBUTARIA-DE-LIMA.jpg' },
    { key: 'indecopi', url: 'https://www.convocatoriasdetrabajo.com/imagenes/organizaciones/th-imagen-INSTITUTO-NACIONAL-DE-DEFENSA-DE-LA-COMPETENCIA-Y-DE-LA-PROTECCION-DE-LA-PROPIEDAD-INTELECTUAL.jpg' },
    { key: 'ositran', url: 'https://www.convocatoriasdetrabajo.com/imagenes/organizaciones/th-imagen-ORGANISMO-SUPERVISOR-DE-LA-INVERSION-EN-INFRAESTRUCTURA-DE-TRANSPORTE-DE-USO-PUBLICO.jpg' },
    { key: 'senasa', url: 'https://www.convocatoriasdetrabajo.com/imagenes/organizaciones/th-imagen-SERVICIO-NACIONAL-DE-SANIDAD-AGRARIA.jpg' },
    { key: 'electroperu', url: 'https://www.convocatoriasdetrabajo.com/imagenes/organizaciones/th-imagen-ELECTROPERU-SA.jpg' },
  ];

  for (const p of pages) {
    if (p.url.includes('/imagenes/organizaciones/')) {
      console.log(`DIRECT [${p.key}]: ${p.url}`);
      continue;
    }
    try {
      const res = await fetch(p.url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
      const html = await res.text();
      const m = html.match(/src=["'](https:\/\/www\.convocatoriasdetrabajo\.com\/imagenes\/organizaciones\/[^"']+)["']/i)
             || html.match(/src=["'](imagenes\/organizaciones\/[^"']+)["']/i);
      if (m) {
        const fullUrl = m[1].startsWith('http') ? m[1] : `https://www.convocatoriasdetrabajo.com/${m[1]}`;
        console.log(`SUCCESS [${p.key}]: ${fullUrl}`);
      } else {
        console.log(`NO MATCH [${p.key}]`);
      }
    } catch (err) {
      console.log(`ERROR [${p.key}]:`, err.message);
    }
  }
}

fetchOrgLogos().catch(console.error);
