import { getJobPostings, JobPosting } from './jobs';

export type OrganizationCategory =
  | 'Todos'
  | 'Ministerios'
  | 'Organismos Autónomos'
  | 'Poder Judicial y Fiscalía'
  | 'Salud y Seguridad Social'
  | 'Reguladores y Fiscalización'
  | 'Gobiernos Regionales'
  | 'Municipalidades'
  | 'Universidades'
  | 'Empresas'
  | 'Otros';

export type OrganizationItem = {
  id: string;
  name: string;
  shortName: string;
  slug: string;
  category: OrganizationCategory;
  logo?: string;
  jobCount: number;
  vacanciesCount: number;
  regions: string[];
  sectors: string[];
  salaryText?: string;
  officialUrl?: string;
  featured: boolean;
};

// Mapa curado de entidades clave del Estado peruano con sus siglas oficiales, categorías y logos
const KNOWN_ORGANIZATIONS_METADATA: Record<string, {
  shortName: string;
  category: OrganizationCategory;
  logo?: string;
  officialUrl?: string;
}> = {
  'OFICINA NACIONAL DE PROCESOS ELECTORALES': {
    shortName: 'ONPE',
    category: 'Organismos Autónomos',
    logo: '/logos/onpe.jpg',
    officialUrl: 'https://reclutamiento.onpe.gob.pe'
  },
  'INSTITUTO NACIONAL DE ESTADÍSTICA E INFORMÁTICA - INEI': {
    shortName: 'INEI',
    category: 'Organismos Autónomos',
    logo: '/logos/inei.jpg',
    officialUrl: 'https://www.inei.gob.pe'
  },
  'JURADO NACIONAL DE ELECCIONES - JNE': {
    shortName: 'JNE',
    category: 'Organismos Autónomos',
    logo: '/logos/jne.jpg',
    officialUrl: 'https://www.jne.gob.pe'
  },
  'SEGURO SOCIAL DE SALUD - ESSALUD': {
    shortName: 'ESSALUD',
    category: 'Salud y Seguridad Social',
    logo: '/logos/essalud.jpg',
    officialUrl: 'https://ww1.essalud.gob.pe'
  },
  'SUPERINTENDENCIA NACIONAL DE ADUANAS Y DE ADMINISTRACIÓN TRIBUTARIA - SUNAT': {
    shortName: 'SUNAT',
    category: 'Reguladores y Fiscalización',
    logo: '/logos/sunat.jpg',
    officialUrl: 'https://unete.sunat.gob.pe'
  },
  'SUPERINTENDENCIA NACIONAL DE ADUANAS Y DE ADMINISTRACION TRIBUTARIA - SUNAT': {
    shortName: 'SUNAT',
    category: 'Reguladores y Fiscalización',
    logo: '/logos/sunat.jpg',
    officialUrl: 'https://unete.sunat.gob.pe'
  },
  'MINISTERIO PUBLICO - FISCALÍA DE LA NACIÓN': {
    shortName: 'FISCALÍA',
    category: 'Poder Judicial y Fiscalía',
    logo: '/logos/ministerio-publico.jpg',
    officialUrl: 'https://www.mpfn.gob.pe'
  },
  'MINISTERIO PUBLICO - FISCALIA DE LA NACIÓN': {
    shortName: 'FISCALÍA',
    category: 'Poder Judicial y Fiscalía',
    logo: '/logos/ministerio-publico.jpg',
    officialUrl: 'https://www.mpfn.gob.pe'
  },
  'MINISTERIO PÚBLICO - FISCALÍA DE LA NACIÓN': {
    shortName: 'FISCALÍA',
    category: 'Poder Judicial y Fiscalía',
    logo: '/logos/ministerio-publico.jpg',
    officialUrl: 'https://www.mpfn.gob.pe'
  },
  'PODER JUDICIAL': {
    shortName: 'PODER JUDICIAL',
    category: 'Poder Judicial y Fiscalía',
    logo: '/logos/poder-judicial.jpg',
    officialUrl: 'https://aplicativo.pj.gob.pe'
  },
  'ORGANISMO DE SUPERVISION DE LOS RECURSOS FORESTALES Y DE FAUNA SILVESTRE - OSINFOR': {
    shortName: 'OSINFOR',
    category: 'Reguladores y Fiscalización',
    logo: '/logos/orgs/th-imagen-ORGANISMO-SUPERVISOR-DE-INVERSION-DE-LOS-RECURSOS-FORESTALES-Y-DE-FAUNA-SILVESTRE.jpg',
    officialUrl: 'https://www.gob.pe/osinfor'
  },
  'MINISTERIO DE EDUCACION': {
    shortName: 'MINEDU',
    category: 'Ministerios',
    logo: '/logos/minedu.jpg',
    officialUrl: 'https://postulacioncas.minedu.gob.pe/PostulacionCas/'
  },
  'MINISTERIO DE EDUCACIÓN': {
    shortName: 'MINEDU',
    category: 'Ministerios',
    logo: '/logos/minedu.jpg',
    officialUrl: 'https://postulacioncas.minedu.gob.pe/PostulacionCas/'
  },
  'MINISTERIO DE SALUD': {
    shortName: 'MINSA',
    category: 'Ministerios',
    logo: '/logos/minsa.jpg',
    officialUrl: 'https://www.gob.pe/minsa'
  },
  'MINISTERIO DE ECONOMIA Y FINANZAS': {
    shortName: 'MEF',
    category: 'Ministerios',
    logo: '/logos/mef.jpg',
    officialUrl: 'https://www.gob.pe/mef'
  },
  'MINISTERIO DE TRABAJO Y PROMOCION DEL EMPLEO': {
    shortName: 'MTPE',
    category: 'Ministerios',
    logo: '/logos/mtpe.jpg',
    officialUrl: 'https://www.gob.pe/mtpe'
  },
  'MINISTERIO DE DESARROLLO E INCLUSION SOCIAL': {
    shortName: 'MIDIS',
    category: 'Ministerios',
    logo: '/logos/midis.jpg',
    officialUrl: 'https://www.gob.pe/midis'
  },
  'UNIVERSIDAD NACIONAL JOSÉ MARÍA ARGUEDAS - UNAJMA': {
    shortName: 'UNAJMA',
    category: 'Universidades',
    logo: '/logos/orgs/th-imagen-UNIVERSIDAD-NACIONAL-JOSE-MARIA-ARGUEDAS.jpg',
    officialUrl: 'https://convocatoria.unajma.edu.pe'
  },
  'UNIVERSIDAD NACIONAL MAYOR DE SAN MARCOS': {
    shortName: 'UNMSM',
    category: 'Universidades',
    logo: '/logos/orgs/th-imagen-UNIVERSIDAD-NACIONAL-MAYOR-DE-SAN-MARCOS.jpg',
    officialUrl: 'https://unmsm.edu.pe'
  },
  'PROGRAMA NACIONAL CUNA MAS': {
    shortName: 'CUNA MÁS',
    category: 'Otros',
    logo: '/logos/cunamas.jpg',
    officialUrl: 'https://www.cunamas.gob.pe'
  },
  'SUPERINTENDENCIA NACIONAL DE LOS REGISTROS PUBLICOS': {
    shortName: 'SUNARP',
    category: 'Reguladores y Fiscalización',
    logo: '/logos/sunarp.jpg',
    officialUrl: 'https://www.sunarp.gob.pe'
  },
  'SUPERINTENDENCIA NACIONAL DE FISCALIZACION LABORAL': {
    shortName: 'SUNAFIL',
    category: 'Reguladores y Fiscalización',
    logo: '/logos/sunafil.jpg',
    officialUrl: 'https://www.gob.pe/sunafil'
  },
  'REGISTRO NACIONAL DE IDENTIFICACION Y ESTADO CIVIL': {
    shortName: 'RENIEC',
    category: 'Organismos Autónomos',
    logo: '/logos/reniec.jpg',
    officialUrl: 'https://www.reniec.gob.pe'
  },
  'INSTITUTO NACIONAL PENITENCIARIO': {
    shortName: 'INPE',
    category: 'Otros',
    logo: '/logos/orgs/th-imagen-INSTITUTO-NACIONAL-PENITENCIARIO.jpg',
    officialUrl: 'https://www.inpe.gob.pe'
  },
  'BANCO DE LA NACION': {
    shortName: 'BANCO DE LA NACIÓN',
    category: 'Empresas',
    logo: '/logos/banco-de-la-nacion.svg',
    officialUrl: 'https://www.bn.com.pe'
  },
  'BANCO CENTRAL DE RESERVA DEL PERU': {
    shortName: 'BCRP',
    category: 'Organismos Autónomos',
    logo: '/logos/bcrp.jpg',
    officialUrl: 'https://www.bcrp.gob.pe'
  },
  'ALICORP': {
    shortName: 'ALICORP',
    category: 'Empresas',
    logo: '/logos/alicorp.svg',
    officialUrl: 'https://alicorp.com.pe'
  }
};

function inferCategory(nameUpper: string): OrganizationCategory {
  if (nameUpper.includes('MINISTERIO DE') || nameUpper.includes('MINISTERIO DEL')) return 'Ministerios';
  if (nameUpper.includes('CORTE SUPERIOR') || nameUpper.includes('PODER JUDICIAL') || nameUpper.includes('FISCAL') || nameUpper.includes('JUZGADO') || nameUpper.includes('JUSTICIA')) return 'Poder Judicial y Fiscalía';
  if (nameUpper.includes('SALUD') || nameUpper.includes('HOSPITAL') || nameUpper.includes('ESSALUD') || nameUpper.includes('DIRESA') || nameUpper.includes('GERESA') || nameUpper.includes('SANIDAD') || nameUpper.includes('NEOPLASICAS')) return 'Salud y Seguridad Social';
  if (nameUpper.includes('SUPERINTENDENCIA') || nameUpper.includes('OSIN') || nameUpper.includes('INDECOPI') || nameUpper.includes('SUTRAN') || nameUpper.includes('OEFA') || nameUpper.includes('SUNAFIL') || nameUpper.includes('SUNARP') || nameUpper.includes('REGULADOR') || nameUpper.includes('SERFOR')) return 'Reguladores y Fiscalización';
  if (nameUpper.includes('ONPE') || nameUpper.includes('JNE') || nameUpper.includes('RENIEC') || nameUpper.includes('CONTRALOR') || nameUpper.includes('DEFENSOR') || nameUpper.includes('INEI') || nameUpper.includes('SBS') || nameUpper.includes('BCRP') || nameUpper.includes('JURADO NACIONAL') || nameUpper.includes('PROCESOS ELECTORALES')) return 'Organismos Autónomos';
  if (nameUpper.includes('GOBIERNO REGIONAL') || nameUpper.includes('GORE ')) return 'Gobiernos Regionales';
  if (nameUpper.includes('MUNICIPALIDAD') || nameUpper.includes('MUNICIPIO') || nameUpper.includes('ALCALD')) return 'Municipalidades';
  if (nameUpper.includes('UNIVERSIDAD') || nameUpper.includes('INSTITUTO DE EDUCACION') || nameUpper.includes('PEDAGOGIC')) return 'Universidades';
  if (nameUpper.includes('EMPRESA') || nameUpper.includes('ELECTRO') || nameUpper.includes('SEDAPAL') || nameUpper.includes('BANCO') || nameUpper.includes('PETRO') || nameUpper.includes('S.A.') || nameUpper.includes('S.A.A.')) return 'Empresas';
  return 'Otros';
}

function inferShortName(fullName: string): string {
  const upper = fullName.toUpperCase();
  // Siglas comunes directas
  if (upper.includes('INEI')) return 'INEI';
  if (upper.includes('ONPE')) return 'ONPE';
  if (upper.includes('JNE')) return 'JNE';
  if (upper.includes('SUNAT')) return 'SUNAT';
  if (upper.includes('ESSALUD')) return 'ESSALUD';
  if (upper.includes('MINEDU')) return 'MINEDU';
  if (upper.includes('MINSA')) return 'MINSA';
  if (upper.includes('MIDIS')) return 'MIDIS';
  if (upper.includes('MEF')) return 'MEF';
  if (upper.includes('MTPE')) return 'MTPE';
  if (upper.includes('OSINFOR')) return 'OSINFOR';
  if (upper.includes('OSINERGMIN')) return 'OSINERGMIN';
  if (upper.includes('OSIPTEL')) return 'OSIPTEL';
  if (upper.includes('OSITRAN')) return 'OSITRAN';
  if (upper.includes('SUNAFIL')) return 'SUNAFIL';
  if (upper.includes('SUNARP')) return 'SUNARP';
  if (upper.includes('RENIEC')) return 'RENIEC';
  if (upper.includes('UNAJMA')) return 'UNAJMA';
  if (upper.includes('UNMSM')) return 'UNMSM';
  if (upper.includes('INPE')) return 'INPE';
  if (upper.includes('SUTRAN')) return 'SUTRAN';
  if (upper.includes('INDECOPI')) return 'INDECOPI';
  if (upper.includes('CONTRALORÍA') || upper.includes('CONTRALORIA')) return 'CONTRALORÍA';
  if (upper.includes('DEFENSORÍA') || upper.includes('DEFENSORIA')) return 'DEFENSORÍA';
  if (upper.includes('PODER JUDICIAL')) return 'PODER JUDICIAL';
  if (upper.includes('FISCALÍA') || upper.includes('FISCALIA') || upper.includes('MINISTERIO PUBLICO')) return 'FISCALÍA';

  if (upper.startsWith('CORTE SUPERIOR DE JUSTICIA')) {
    return upper.replace('CORTE SUPERIOR DE JUSTICIA DE ', 'CSJ ').replace('CORTE SUPERIOR DE JUSTICIA DEL ', 'CSJ ');
  }
  if (upper.startsWith('MUNICIPALIDAD DISTRITAL DE ')) {
    return 'MUNI ' + fullName.slice('MUNICIPALIDAD DISTRITAL DE '.length);
  }
  if (upper.startsWith('MUNICIPALIDAD PROVINCIAL DE ')) {
    return 'MP ' + fullName.slice('MUNICIPALIDAD PROVINCIAL DE '.length);
  }
  if (upper.startsWith('GOBIERNO REGIONAL DE ')) {
    return 'GORE ' + fullName.slice('GOBIERNO REGIONAL DE '.length);
  }

  // Acrónimo corto si es largo
  if (fullName.length > 35) {
    const parts = fullName.split(' - ');
    if (parts.length > 1 && parts[parts.length - 1].length <= 20) {
      return parts[parts.length - 1].trim();
    }
    return fullName.slice(0, 32) + '...';
  }

  return fullName;
}

function makeSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

let cachedOrganizations: OrganizationItem[] | null = null;
let lastCacheTimestamp = 0;

export async function getOrganizations(): Promise<OrganizationItem[]> {
  if (cachedOrganizations && Date.now() - lastCacheTimestamp < 1000 * 60 * 30) {
    return cachedOrganizations;
  }

  const jobs = await getJobPostings();
  const orgsMap = new Map<string, {
    name: string;
    shortName: string;
    logo?: string;
    category: OrganizationCategory;
    officialUrl?: string;
    jobCount: number;
    vacanciesCount: number;
    regions: Set<string>;
    sectors: Set<string>;
    featured: boolean;
  }>();

  for (const job of jobs) {
    const rawName = (job.entity_name || 'Estado Peruano').trim();
    const upperName = rawName.toUpperCase();

    // Normalizar clave para agrupar variantes (ej: "SUNAT" y "SUPERINTENDENCIA NACIONAL...")
    let canonicalKey = rawName;
    if (upperName.includes('SUNAT')) canonicalKey = 'SUPERINTENDENCIA NACIONAL DE ADUANAS Y DE ADMINISTRACIÓN TRIBUTARIA - SUNAT';
    else if (upperName.includes('MINEDU') || upperName === 'MINISTERIO DE EDUCACION') canonicalKey = 'MINISTERIO DE EDUCACIÓN';
    else if (upperName.includes('FISCALÍA') || upperName.includes('MINISTERIO PUBLICO')) canonicalKey = 'MINISTERIO PÚBLICO - FISCALÍA DE LA NACIÓN';
    else if (upperName.includes('ESSALUD')) canonicalKey = 'SEGURO SOCIAL DE SALUD - ESSALUD';
    else if (upperName.includes('INEI')) canonicalKey = 'INSTITUTO NACIONAL DE ESTADÍSTICA E INFORMÁTICA - INEI';
    else if (upperName.includes('ONPE')) canonicalKey = 'OFICINA NACIONAL DE PROCESOS ELECTORALES';
    else if (upperName.includes('JNE')) canonicalKey = 'JURADO NACIONAL DE ELECCIONES - JNE';
    else if (upperName.includes('UNAJMA')) canonicalKey = 'UNIVERSIDAD NACIONAL JOSÉ MARÍA ARGUEDAS - UNAJMA';
    else if (upperName === 'PODER JUDICIAL' || upperName.startsWith('PODER JUDICIAL')) canonicalKey = 'PODER JUDICIAL';

    const existing = orgsMap.get(canonicalKey);
    const meta = KNOWN_ORGANIZATIONS_METADATA[canonicalKey] || KNOWN_ORGANIZATIONS_METADATA[rawName];

    if (!existing) {
      const shortName = meta?.shortName || inferShortName(canonicalKey);
      const category = meta?.category || inferCategory(canonicalKey.toUpperCase());
      const logo = meta?.logo || job.entity_logo;

      orgsMap.set(canonicalKey, {
        name: canonicalKey,
        shortName,
        logo,
        category,
        officialUrl: meta?.officialUrl || job.apply_url,
        jobCount: 1,
        vacanciesCount: job.vacancies_count || 1,
        regions: new Set(job.region ? [job.region] : []),
        sectors: new Set(job.sector_type ? [job.sector_type] : []),
        featured: !!job.featured || ['ONPE', 'INEI', 'JNE', 'ESSALUD', 'SUNAT', 'MINEDU', 'PODER JUDICIAL', 'FISCALÍA'].includes(shortName)
      });
    } else {
      existing.jobCount++;
      existing.vacanciesCount += (job.vacancies_count || 1);
      if (job.region) existing.regions.add(job.region);
      if (job.sector_type) existing.sectors.add(job.sector_type);
      if (!existing.logo && job.entity_logo) existing.logo = job.entity_logo;
      if (job.featured) existing.featured = true;
    }
  }

  const items: OrganizationItem[] = Array.from(orgsMap.values()).map(o => {
    const slug = makeSlug(o.shortName ? `${o.shortName}-${o.name}` : o.name);
    return {
      id: `org-${slug}`,
      name: o.name,
      shortName: o.shortName,
      slug,
      category: o.category,
      logo: o.logo,
      jobCount: o.jobCount,
      vacanciesCount: o.vacanciesCount,
      regions: Array.from(o.regions),
      sectors: Array.from(o.sectors),
      officialUrl: o.officialUrl,
      featured: o.featured
    };
  });

  // Ordenar: primero las destacadas con más convocatorias, luego por vacantes
  items.sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1;
    if (b.jobCount !== a.jobCount) return b.jobCount - a.jobCount;
    return b.vacanciesCount - a.vacanciesCount;
  });

  cachedOrganizations = items;
  lastCacheTimestamp = Date.now();
  return items;
}

export async function getOrganizationBySlug(slug: string): Promise<OrganizationItem | null> {
  const orgs = await getOrganizations();
  const normSlug = slug.toLowerCase().trim();
  const found = orgs.find(o => o.slug === normSlug || o.slug.includes(normSlug) || normSlug.includes(o.slug));
  return found || null;
}
