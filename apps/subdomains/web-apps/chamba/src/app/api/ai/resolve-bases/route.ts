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
    .replace(/\s*-\s*Informes\s+y\s+publicaciones.*$/i, '')
    .replace(/\s*-\s*Gob\.pe$/i, '')
    .replace(/\s*-\s*Plataforma\s+del\s+Estado\s+Peruano$/i, '')
    .replace(/\s*-\s*Presidencia\s+de\s+la\s+República.*/i, '')
    .replace(/\s*-\s*Ministerio\s+de\s+Educación.*/i, '')
    .trim();
}

function isAcademicOrIrrelevantUrl(url: string): boolean {
  const low = url.toLowerCase();
  // Excepción legítima: Repositorio del Sistema PSEP del Poder Judicial
  if (low.includes('aplicativo.pj.gob.pe/repositoriopsep')) return false;

  const badUrlTokens = [
    'repositorio.', 'tesis.', 'cybertesis', 'bitstream', 'bitstreams',
    '/handle/', 'dspace', 'scielo', 'dialnet', 'redalyc', 'alicia.concytec',
    'pei-', 'poi-', 'rof-', 'mof-', 'tupa-', 'silabo', 'malla-curricular',
    'pedagogico', 'instituto-pedagogico', 'balotario', 'materia', 'curso',
    'investigacion', 'revista.', 'revistas.', 'articulos', 'academic'
  ];
  return badUrlTokens.some(token => low.includes(token));
}

function isAcademicOrIrrelevantTitle(title: string): boolean {
  const low = title.toLowerCase();
  const badTitleWords = [
    'tesis', 'grado académico', 'grado academico', 'para optar el grado',
    'maestro en', 'maestría en', 'maestria en', 'doctor en', 'doctorado',
    'licenciatura en', 'licenciado en', 'proyecto educativo institucional',
    'plan estratégico', 'plan estrategico', 'plan operativo institucional',
    'reglamento de organización', 'reglamento de organizacion', 'manual de organización',
    'manual de organizacion', 'tupa', 'texto único de procedimientos',
    'texto unico de procedimientos', 'memoria anual', 'rendición de cuentas',
    'rendicion de cuentas', 'silabo', 'malla curricular', 'examen de admisión',
    'examen de admision', 'balotario', 'instituto de educación superior pedagógico'
  ];
  return badTitleWords.some(w => low.includes(w));
}

function hasHiringSignal(title: string, url: string): boolean {
  const low = (title + ' ' + url).toLowerCase();
  const hiringKeywords = [
    'convocatoria', 'bases', 'cas', 'proceso', 'seleccion', 'selección',
    'contratacion', 'contratación', 'anexo', 'cronograma', 'perfil',
    'tdr', 'plaza', 'comunicado', 'evaluacion', 'evaluación', 'apto',
    'merito', 'mérito', 'postulacion', 'postulación', 'inscripcion',
    'inscripción', 'hoja de vida', 'formato', 'puesto', 'vacante', '276', '728', 'dl'
  ];
  return hiringKeywords.some(k => low.includes(k));
}

function categorizeDocument(title: string, url: string): string {
  const low = (title + ' ' + url).toLowerCase();
  if (low.includes('anexo') || low.includes('formato') || low.includes('declaracion') || low.includes('declaración')) {
    return 'Anexos y Formatos';
  }
  if (low.includes('solicitud') || low.includes('inscripcion') || low.includes('inscripción')) {
    return 'Inscripción y Registro';
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

    // Detectar si la entidad es una universidad o una entidad del gobierno general
    const entUpper = (entity_name || '').toUpperCase();
    const isEntityUniversity = Boolean(
      entUpper.includes('UNIVERSIDAD') ||
      /\b(UNI|UNMSM|UNAJMA|UNAAT|UNCP|UNAS|UNALM|UNT|UNSA|UNSAAC|UNSCH|UNP|UNAP|UNC|UNAC|UNSM)\b/.test(entUpper)
    );

    // Extraer palabras clave representativas del puesto (ej: "Especialista en Procedimientos")
    const cleanJobRole = (title || '')
      .replace(/^convocatoria\s+/i, '')
      .replace(/^proceso\s+cas\s+n[ºo°]?\s*\d+\s*-?\s*\d*\s*/i, '')
      .replace(/^cas\s+n[ºo°]?\s*\d+\s*-?\s*\d*\s*/i, '')
      .replace(/\s*-\s*202[456]/g, '')
      .replace(/\s*-\s*Convocatoria.*/i, '')
      .slice(0, 50)
      .trim();

    if (apiKey) {
      try {
        // Query blindada: entidades públicas buscan SOLO en site:gob.pe
        // Universidades buscan en site:edu.pe o site:gob.pe excluyendo repositorios de tesis
        const domainFilter = isEntityUniversity
          ? '(site:gob.pe OR site:edu.pe)'
          : 'site:gob.pe';

        const primaryQuery = `${domainFilter} "${entity_name || ''}" "${cleanJobRole}" (bases OR convocatoria OR CAS OR concurso) filetype:pdf -tesis -repositorio -bitstream -cybertesis -PEI -POI -TUPA -silabo -scielo -dialnet`;

        const firecrawlRes = await fetch('https://api.firecrawl.dev/v1/search', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            query: primaryQuery,
            limit: 6
          })
        });

        if (firecrawlRes.ok) {
          const firecrawlData: any = await firecrawlRes.json();
          const items: any[] = firecrawlData?.data || [];

          for (const item of items) {
            const itemUrl = (item.url || '').trim();
            const itemTitle = cleanTitle(item.title || 'Documento Oficial');

            if (!itemUrl || isCompetitorUrl(itemUrl)) continue;

            // Filtro 1: Descartar tesis y repositorios académicos
            if (isAcademicOrIrrelevantUrl(itemUrl)) continue;
            if (isAcademicOrIrrelevantTitle(itemTitle)) continue;

            const lowUrl = itemUrl.toLowerCase();

            // Filtro 2: Entidades de gobierno (UGEL, Municipalidades, Ministerios, GORE) NO publican en repositorios universitarios .edu.pe
            if (!isEntityUniversity && lowUrl.includes('.edu.pe')) continue;

            // Filtro 3: Exigir señal positiva de contratación / convocatoria
            if (!hasHiringSignal(itemTitle, itemUrl)) continue;

            const isPdf = lowUrl.includes('.pdf') || lowUrl.includes('drive.google.com') || lowUrl.includes('docs.google.com');
            const isGov = lowUrl.includes('.gob.pe') || (isEntityUniversity && lowUrl.includes('.edu.pe')) || lowUrl.includes('.mil.pe');

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
