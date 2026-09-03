import { NextResponse } from 'next/server';

export const dynamic = 'force-static';

export async function GET() {
  const content = `# chamba pro — Convocatorias y Empleos Oficiales de Perú

> chamba pro (https://empleos.atpdev.dev) es un agregador oficial y verificador de convocatorias laborales en Perú (CAS 1057, D.L. 728, D.L. 276, Locación y Sector Privado).

## Resumen del Servicio
- **Misión:** Transparencia total, cero cobros a postulantes, redirección 100% directa a las fuentes oficiales del Estado (SUNAT, MINEDU, SERVIR, Poder Judicial, BCRP, ONPE, etc.).
- **Verificación:** Validación de RUC institucional en SUNAT antes de indexación.
- **Herramientas de Valor:**
  - Calculadora de Sueldo Neto CAS: https://empleos.atpdev.dev/calculadora-sueldo
  - Comparador de Regímenes Laborales: https://empleos.atpdev.dev/comparador-regimenes
  - Generador de CV Formato SERVIR: https://empleos.atpdev.dev/crear-cv-cas
  - Simulador de Entrevistas Asistido por IA: https://empleos.atpdev.dev/simulador-entrevista-ia
  - Plantillas y Anexos Oficiales: https://empleos.atpdev.dev/plantillas-anexos
  - Preguntas Frecuentes de Entrevistas CAS: https://empleos.atpdev.dev/preguntas-entrevista-cas

## Enlaces Estructurados
- Catálogo de Convocatorias: https://empleos.atpdev.dev/empleos
- Sitemap XML: https://empleos.atpdev.dev/sitemap.xml
- Feed RSS: https://empleos.atpdev.dev/rss.xml
- Contacto y Redacción: https://empleos.atpdev.dev/contacto (contacto@atpdev.dev)
- Política de Privacidad: https://empleos.atpdev.dev/politica-de-privacidad
- Términos y Condiciones: https://empleos.atpdev.dev/terminos-y-condiciones
`;

  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
