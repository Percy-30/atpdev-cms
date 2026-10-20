import { NextResponse } from 'next/server';
import { resolveEntityCanonicalPortal, isCompetitorUrl, sanitizeOfficialUrl } from '@atpdev/database';

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

function extractCleanJobRole(title: string, entityName?: string): string {
  let role = (title || '').trim();

  // 1. Quitar menciones del nombre de la entidad o sus partes clave
  if (entityName) {
    const rawClean = entityName.replace(/\(.*?\)/g, ' ').replace(/\s+/g, ' ').trim();
    const words = rawClean.split(/\s+/).filter(w => w.length > 3);
    for (const w of words) {
      role = role.replace(new RegExp(`\\b${w}\\b`, 'gi'), '');
    }
    role = role.replace(/\([A-Z0-9\s-]+\)/gi, '');
  }

  // Quitar cualquier prefijo antes de ":"
  role = role.replace(/^[^:]+:\s*/, '');

  // 2. Quitar verbos y palabras típicas de scrapers / agregadores
  role = role
    .replace(/^(?:solicita|busca|requiere|necesita|convoca|contratara|contratará)\s+/i, '')
    .replace(/^convocatoria\s+(?:de\s+trabajo\s+|cas\s+|publica\s+|pública\s+)?/i, '')
    .replace(/^proceso\s+cas\s+n[ºo°]?\s*\d+\s*-?\s*\d*\s*(?::\s*)?/i, '')
    .replace(/^cas\s+n[ºo°]?\s*\d+\s*(?:[-–]\s*\d+)?\s*(?::\s*)?/i, '')
    .replace(/\(\d+\)\s*/g, ''); // Quitar número de vacantes ej "(30) "

  // 3. Quitar sufijos de fecha y concurso al final
  role = role
    .replace(/\s*[-–]\s*convocatoria\s+.*$/i, '')
    .replace(/\s*[-–]\s*bases.*$/i, '')
    .replace(/\s*[-–]\s*(?:enero|febrero|marzo|abril|mayo|junio|julio|agosto|setiembre|septiembre|octubre|noviembre|diciembre).*$/i, '')
    .replace(/\s*[-–]\s*202[456].*$/i, '')
    .replace(/^[:\s-]+|[:\s-]+$/g, '')
    .trim();

  return role.slice(0, 60).trim();
}

function extractCleanEntitySearch(entityName: string, searchPattern?: string): string {
  if (searchPattern) {
    return `(${searchPattern})`;
  }
  const clean = (entityName || '').replace(/\([^)]*\)/g, ' ').replace(/\s+/g, ' ').trim();
  return `"${clean}"`;
}

export async function POST(req: Request) {
  try {
    const { title, entity_name } = await req.json();

    if (!entity_name && !title) {
      return NextResponse.json({ error: 'Faltan parámetros de búsqueda (título o entidad)' }, { status: 400 });
    }

    const canonicalPortal = resolveEntityCanonicalPortal(entity_name || '');
    const safePortalUrl = sanitizeOfficialUrl(canonicalPortal.url, undefined, entity_name);
    const apiKey = process.env.FIRECRAWL_API_KEY;

    const officialDocuments: OfficialDoc[] = [];
    let directBasesUrl: string | undefined = undefined;

    // Detectar si la entidad es una universidad o una entidad del gobierno general
    const entUpper = (entity_name || '').toUpperCase();
    const isEntityUniversity = Boolean(
      entUpper.includes('UNIVERSIDAD') ||
      /\b(UNI|UNMSM|UNAJMA|UNAAT|UNCP|UNAS|UNALM|UNT|UNSA|UNSAAC|UNSCH|UNP|UNAP|UNC|UNAC|UNSM)\b/.test(entUpper)
    );

    // Extraer rol del puesto y términos de búsqueda institucional
    const cleanJobRole = extractCleanJobRole(title || '', entity_name);
    const entityTerms = extractCleanEntitySearch(entity_name || '', canonicalPortal.searchPattern);

    if (apiKey) {
      try {
        const domainFilter = isEntityUniversity
          ? '(site:gob.pe OR site:edu.pe)'
          : 'site:gob.pe';

        const roleQuery = cleanJobRole ? `"${cleanJobRole}"` : '';
        const primaryQuery = `${domainFilter} ${entityTerms} ${roleQuery} (bases OR convocatoria OR CAS OR concurso) filetype:pdf -tesis -repositorio -bitstream -cybertesis -PEI -POI -TUPA -silabo -scielo -dialnet`;

        // AbortController con timeout de 9 segundos para evitar bloqueos del servidor
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 9000);

        let firecrawlRes = await fetch('https://api.firecrawl.dev/v1/search', {
          method: 'POST',
          signal: controller.signal,
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            query: primaryQuery,
            limit: 6
          })
        }).catch(err => {
          console.warn('Firecrawl search timeout or aborted:', err.message);
          return null;
        });

        clearTimeout(timeoutId);

        let items: any[] = [];
        if (firecrawlRes && firecrawlRes.ok) {
          const firecrawlData: any = await firecrawlRes.json().catch(() => null);
          items = firecrawlData?.data || [];
        }

        // Si la búsqueda estricta no arrojó resultados y tenemos rol limpio, hacer un pase flexible
        if (items.length === 0 && cleanJobRole && cleanJobRole.length > 3) {
          const fallbackQuery = `${entityTerms} "${cleanJobRole}" (bases OR convocatoria OR CAS) filetype:pdf -tesis -repositorio`;
          const controller2 = new AbortController();
          const timeoutId2 = setTimeout(() => controller2.abort(), 7000);

          const fallbackRes = await fetch('https://api.firecrawl.dev/v1/search', {
            method: 'POST',
            signal: controller2.signal,
            headers: {
              'Authorization': `Bearer ${apiKey}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              query: fallbackQuery,
              limit: 5
            })
          }).catch(() => null);

          clearTimeout(timeoutId2);

          if (fallbackRes && fallbackRes.ok) {
            const fbData: any = await fallbackRes.json().catch(() => null);
            items = fbData?.data || [];
          }
        }

        const seenUrls = new Set<string>();

        for (const item of items) {
          const itemUrl = (item.url || '').trim();
          const itemTitle = cleanTitle(item.title || 'Documento Oficial');

          if (!itemUrl || isCompetitorUrl(itemUrl)) continue;
          if (seenUrls.has(itemUrl.toLowerCase())) continue;
          seenUrls.add(itemUrl.toLowerCase());

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
      } catch (searchErr) {
        console.warn('Firecrawl AI search error:', searchErr);
      }
    }

    // Incluir siempre el portal oficial institucional verificado
    if (safePortalUrl && !isCompetitorUrl(safePortalUrl)) {
      const alreadyHasPortal = officialDocuments.some(d => d.url.toLowerCase() === safePortalUrl.toLowerCase());
      if (!alreadyHasPortal) {
        officialDocuments.push({
          title: `Portal Oficial de Convocatorias - ${canonicalPortal.portalName || entity_name}`,
          url: safePortalUrl,
          category: 'Portal Oficial'
        });
      }
    }

    return NextResponse.json({
      success: true,
      found: officialDocuments.length > 0,
      official_documents: officialDocuments,
      directBasesUrl: directBasesUrl || safePortalUrl,
      portalName: canonicalPortal.portalName,
      portalUrl: safePortalUrl,
      isSpecific: canonicalPortal.isSpecific,
      message: directBasesUrl
        ? `Se localizaron ${officialDocuments.length} documentos y bases oficiales con Inteligencia Artificial.`
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
