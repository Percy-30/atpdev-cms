import { NextResponse } from 'next/server';
import { resolveEntityCanonicalPortal, isCompetitorUrl } from '@atpdev/database';

export const dynamic = 'force-dynamic';

interface OfficialDoc {
  title: string;
  url: string;
  category: string;
}

function cleanTitle(raw: string): string {
  return raw
    .replace(/^\[PDF\]\s*/i, '')
    .replace(/\.pdf$/i, '')
    .replace(/ - Gob\.pe$/i, '')
    .replace(/ - Portal del Estado Peruano$/i, '')
    .replace(/ - Presidencia de la República.*/i, '')
    .trim();
}

function categorizeDocument(title: string, url: string): string {
  const low = (title + ' ' + url).toLowerCase();
  if (low.includes('anexo') || low.includes('formato') || low.includes('declaracion') || low.includes('declaración')) {
    return 'Anexos y Formatos';
  }
  if (low.includes('cronograma') || low.includes('etapa')) {
    return 'Cronograma';
  }
  if (low.includes('resultado') || low.includes('evaluacion') || low.includes('evaluación') || low.includes('apto') || low.includes('merito')) {
    return 'Resultados';
  }
  if (low.includes('comunicado') || low.includes('fe de errata')) {
    return 'Comunicados';
  }
  return 'Bases Oficiales (PDF)';
}

export async function POST(req: Request) {
  try {
    const { title, entity_name } = await req.json();

    if (!entity_name && !title) {
      return NextResponse.json({ error: 'Faltan parámetros de búsqueda (título o entidad)' }, { status: 400 });
    }

    const canonicalPortal = resolveEntityCanonicalPortal(entity_name || '');
    const apiKey = process.env.FIRECRAWL_API_KEY;

    const officialDocuments: OfficialDoc[] = [];
    let directBasesUrl: string | undefined = undefined;

    // Extraer palabras clave representativas del puesto (ej: "Conductor", "Especialista en Finanzas")
    const cleanJobRole = (title || '')
      .replace(/^convocatoria\s+/i, '')
      .replace(/^proceso\s+cas\s+n[ºo°]?\s*\d+\s*-?\s*\d*\s*/i, '')
      .replace(/^cas\s+n[ºo°]?\s*\d+\s*-?\s*\d*\s*/i, '')
      .replace(/\s*-\s*202[456]/g, '')
      .slice(0, 50)
      .trim();

    if (apiKey) {
      try {
        // Query de alta precisión dirigida a servidores del Estado (.gob.pe y .edu.pe)
        const primaryQuery = `site:gob.pe OR site:edu.pe "${entity_name || ''}" "${cleanJobRole}" bases filetype:pdf`;

        const firecrawlRes = await fetch('https://api.firecrawl.dev/v1/search', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            query: primaryQuery,
            limit: 5
          })
        });

        if (firecrawlRes.ok) {
          const firecrawlData: any = await firecrawlRes.json();
          const items: any[] = firecrawlData?.data || [];

          for (const item of items) {
            const itemUrl = item.url || '';
            const itemTitle = cleanTitle(item.title || 'Documento Oficial');

            if (!itemUrl || isCompetitorUrl(itemUrl)) continue;

            const isPdf = itemUrl.toLowerCase().includes('.pdf') || itemUrl.includes('drive.google.com') || itemUrl.includes('docs.google.com');
            const isGov = itemUrl.includes('.gob.pe') || itemUrl.includes('.edu.pe') || itemUrl.includes('.pe');

            if (isGov || isPdf) {
              const category = categorizeDocument(itemTitle, itemUrl);
              officialDocuments.push({
                title: itemTitle,
                url: itemUrl,
                category
              });

              if (!directBasesUrl && isPdf) {
                directBasesUrl = itemUrl;
              }
            }
          }
        }
      } catch (searchErr) {
        console.warn('Firecrawl AI search error:', searchErr);
      }
    }

    // Si no se encontraron PDFs directos pero la entidad tiene portal canónico, agregarlo como documento oficial
    if (officialDocuments.length === 0 && canonicalPortal.isSpecific) {
      officialDocuments.push({
        title: `Portal Oficial de Convocatorias - ${canonicalPortal.portalName}`,
        url: canonicalPortal.url,
        category: 'Portal Oficial'
      });
    }

    return NextResponse.json({
      success: true,
      found: officialDocuments.length > 0,
      official_documents: officialDocuments,
      directBasesUrl: directBasesUrl || canonicalPortal.url,
      portalName: canonicalPortal.portalName,
      portalUrl: canonicalPortal.url,
      isSpecific: canonicalPortal.isSpecific,
      message: officialDocuments.length > 0
        ? `Se localizaron ${officialDocuments.length} documentos oficiales con Inteligencia Artificial.`
        : `Redirección oficial verificada a ${canonicalPortal.portalName}.`
    });
  } catch (err: any) {
    console.error('Error in /api/ai/resolve-bases:', err);
    return NextResponse.json(
      { error: err?.message || 'Error al resolver bases oficiales con IA' },
      { status: 500 }
    );
  }
}
