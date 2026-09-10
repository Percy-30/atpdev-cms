'use client';

import React, { useState } from 'react';
import orgLogos from './org-logos.json';

interface EntityLogoProps {
  entityName: string;
  logoUrl?: string;
  size?: 'sm' | 'md' | 'lg' | 'banner';
}

// Map entity name keywords to locally downloaded official logo files in /public/logos/
const LOCAL_LOGO_MAP: { keywords: string[]; file: string }[] = [
  // Organismos Constitucionales y Electorales
  { keywords: ['ONPE', 'PROCESOS ELECTORALES'], file: '/logos/onpe.jpg' },
  { keywords: ['JNE', 'JURADO NACIONAL'], file: '/logos/jne.jpg' },
  { keywords: ['RENIEC', 'IDENTIFICACIÓN Y ESTADO CIVIL', 'IDENTIFICACION Y ESTADO CIVIL'], file: '/logos/reniec.jpg' },
  { keywords: ['MINISTERIO PÚBLICO', 'MINISTERIO PUBLICO', 'FISCALÍA', 'FISCALIA', 'MPFN'], file: '/logos/ministerio-publico.jpg' },
  { keywords: ['PODER JUDICIAL', 'CORTE SUPERIOR'], file: '/logos/poder-judicial.jpg' },
  { keywords: ['DEFENSORIA DEL PUEBLO', 'DEFENSORÍA DEL PUEBLO', 'DEFENSORIA'], file: '/logos/orgs/th-imagen-DEFENSORIA-DEL-PUEBLO.jpg' },

  // Superintendencias y Reguladores
  { keywords: ['SUNAT', 'TRIBUTARIA', 'ADUANAS'], file: '/logos/sunat.jpg' },
  { keywords: ['SUNAFIL', 'FISCALIZACIÓN LABORAL', 'FISCALIZACION LABORAL'], file: '/logos/sunafil.jpg' },
  { keywords: ['SUSALUD', 'SUPERINTENDENCIA NACIONAL DE SALUD'], file: '/logos/orgs/th-imagen-SUPERINTENDENCIA-NACIONAL-DE-SALUD.jpg' },
  { keywords: ['SMV', 'SUPERINTENDENCIA MERCADO VALORES', 'MERCADO DE VALORES'], file: '/logos/orgs/th-imagen-SUPERINTENDENCIA-DEL-MERCADO-DE-VALORES.jpg' },
  { keywords: ['OSIPTEL', 'TELECOMUNICACIONES'], file: '/logos/osiptel.jpg' },
  { keywords: ['OSINERGMIN', 'ENERGÍA Y MINERÍA', 'ENERGIA Y MINERIA'], file: '/logos/osinergmin.jpg' },
  { keywords: ['OSITRAN', 'INFRAESTRUCTURA DE TRANSPORTE'], file: '/logos/ositran.jpg' },
  { keywords: ['SUNARP', 'REGISTROS PÚBLICOS', 'REGISTROS PUBLICOS'], file: '/logos/sunarp.jpg' },
  { keywords: ['SBS', 'SUPERINTENDENCIA DE BANCA'], file: '/logos/sbs.jpg' },
  { keywords: ['INDECOPI', 'COMPETENCIA Y DE LA PROTECCION'], file: '/logos/indecopi.jpg' },
  { keywords: ['ANIN', 'AUTORIDAD NACIONAL DE INFRAESTRUCTURA', 'INFRAESTRUCTURA'], file: '/logos/anin.jpg' },
  { keywords: ['SENASA', 'SANIDAD AGRARIA'], file: '/logos/senasa.jpg' },
  { keywords: ['SUNASS', 'SANEAMIENTO'], file: '/logos/vivienda.jpg' },

  // Banca, Finanzas y Desarrollo
  { keywords: ['BCRP', 'BANCO CENTRAL DE RESERVA', 'RESERVA DEL PERÚ'], file: '/logos/bcrp.jpg' },
  { keywords: ['BANCO DE LA NACIÓN', 'BANCO DE LA NACION'], file: '/logos/banco-de-la-nacion.svg' },
  { keywords: ['AGROBANCO', 'BANCO AGROPECUARIO'], file: '/logos/agrobanco.jpg' },
  { keywords: ['COFIDE', 'FINANCIERA DE DESARROLLO'], file: '/logos/cofide.jpg' },
  { keywords: ['INTERBANK', 'BANCO INTERNACIONAL DEL PERÚ'], file: '/logos/interbank.svg' },
  { keywords: ['ALICORP'], file: '/logos/alicorp.svg' },
  { keywords: ['SAT LIMA', 'ADMINISTRACIÓN TRIBUTARIA DE LIMA', 'ADMINISTRACION TRIBUTARIA DE LIMA', 'SAT CHICLAYO', 'SAT SULLANA', 'SAT HUANCAYO', 'SAT TRUJILLO', 'SAT'], file: '/logos/sat-lima.jpg' },
  { keywords: ['ELECTROPERU', 'ELECTROPERÚ', 'HIDRANDINA', 'ELECTROSUR', 'SEAL', 'ELECTRO'], file: '/logos/electroperu.jpg' },

  // Salud y Seguridad Social
  { keywords: ['RED DE SALUD VALLE DEL MANTARO', 'MANTARO'], file: '/logos/red-salud-mantaro.jpg' },
  { keywords: ['ESSALUD', 'SEGURO SOCIAL DE SALUD'], file: '/logos/essalud.jpg' },
  { keywords: ['MINSA', 'MINISTERIO DE SALUD', 'DIRESA', 'SALUD', 'HOSPITAL', 'RED DE SALUD', 'DIRIS'], file: '/logos/minsa.jpg' },

  // Ministerios y Programas del Estado
  { keywords: ['PRONIED', 'INFRAESTRUCTURA EDUCATIVA'], file: '/logos/orgs/th-imagen-PROGRAMA-NACIONAL-DE-INFRAESTRUCTURA-EDUCATIVA.jpg' },
  { keywords: ['MINEDU', 'MINISTERIO DE EDUCACIÓN', 'MINISTERIO DE EDUCACION', 'UGEL', 'DRE'], file: '/logos/minedu.jpg' },
  { keywords: ['AGROMERCADO'], file: '/logos/orgs/th-imagen-AGROMERCADO.jpg' },
  { keywords: ['MEF', 'MINISTERIO DE ECONOMÍA', 'MINISTERIO DE ECONOMIA'], file: '/logos/mef.jpg' },
  { keywords: ['PROGRAMA NACIONAL PAIS', 'PROGRAMA PAIS', 'PLATAFORMAS DE ACCIÓN PARA LA INCLUSIÓN SOCIAL', 'PAIS'], file: '/logos/programa-pais.jpg' },
  { keywords: ['PROGRAMA NACIONAL DE APOYO DIRECTO A LOS MAS POBRES', 'PROGRAMA JUNTOS', 'JUNTOS', 'PNADP'], file: '/logos/programa-juntos.jpg' },
  { keywords: ['CUNA MÁS', 'CUNAMAS', 'PROGRAMA NACIONAL CUNA MAS', 'PNCM'], file: '/logos/cunamas.jpg' },
  { keywords: ['CONTIGO', 'PROGRAMA NACIONAL CONTIGO'], file: '/logos/orgs/th-imagen-PROGRAMA-NACIONAL-CONTIGO.jpg' },
  { keywords: ['MIDIS', 'DESARROLLO E INCLUSIÓN SOCIAL', 'DESARROLLO E INCLUSION SOCIAL', 'PENSION 65', 'QALI WARMA'], file: '/logos/midis.jpg' },
  { keywords: ['JOVENES PRODUCTIVOS', 'JÓVENES PRODUCTIVOS', 'EMPLEO JUVENIL'], file: '/logos/orgs/th-imagen-PROGRAMA-NACIONAL-DE-EMPLEO-JUVENIL-JOVENES-PRODUCTIVOS.jpg' },
  { keywords: ['IIAP', 'INVESTIGACIONES AMAZONIA', 'AMAZONÍA', 'AMAZONIA', 'MINAM', 'MINISTERIO DEL AMBIENTE', 'OEFA', 'SERNANP'], file: '/logos/minam.jpg' },
  { keywords: ['MINEM', 'MINISTERIO DE ENERGÍA Y MINAS', 'MINISTERIO DE ENERGIA Y MINAS', 'MINAS'], file: '/logos/minem.jpg' },
  { keywords: ['MINDEF', 'MINISTERIO DE DEFENSA', 'EJÉRCITO', 'EJERCITO', 'FUERZA AÉREA'], file: '/logos/mindef.jpg' },
  { keywords: ['MINCETUR', 'COMERCIO EXTERIOR Y TURISMO', 'TURISMO'], file: '/logos/mincetur.jpg' },
  { keywords: ['PRODUCE', 'MINISTERIO DE LA PRODUCCIÓN', 'MINISTERIO DE LA PRODUCCION', 'SANIPES'], file: '/logos/produce.jpg' },
  { keywords: ['RREE', 'RELACIONES EXTERIORES', 'CANCILLERÍA', 'CANCILLERIA'], file: '/logos/rree.jpg' },
  { keywords: ['MTPE', 'TRABAJO Y PROMOCIÓN DEL EMPLEO', 'TRABAJO Y PROMOCION DEL EMPLEO'], file: '/logos/mtpe.jpg' },
  { keywords: ['VIVIENDA', 'MINISTERIO DE VIVIENDA', 'CONSTRUCCIÓN Y SANEAMIENTO', 'VIVIENDA RURAL', 'AGUA TUMBES', 'SEDAPAL', 'OTASS'], file: '/logos/vivienda.jpg' },
  { keywords: ['MININTER', 'MINISTERIO DEL INTERIOR', 'POLICÍA NACIONAL', 'POLICIA NACIONAL', 'BOMBEROS', 'INTENDENCIA NACIONAL DE BOMBEROS', 'MIGRACIONES', 'SUCAMEC'], file: '/logos/mininter.jpg' },
  { keywords: ['CUNA MÁS', 'CUNAMAS', 'PROGRAMA NACIONAL CUNA MAS'], file: '/logos/cunamas.jpg' },
  { keywords: ['PROVIAS', 'PROVÍAS', 'IVP', 'VIAL PROVINCIAL', 'SUTRAN', 'ATU'], file: '/logos/provias.jpg' },
  { keywords: ['INDECI', 'DEFENSA CIVIL', 'CENEPRED'], file: '/logos/indeci.jpg' },
  { keywords: ['DEVIDA', 'VIDA SIN DROGAS'], file: '/logos/devida.jpg' },
  { keywords: ['IPD', 'INSTITUTO PERUANO DEL DEPORTE'], file: '/logos/ipd.jpg' },
  { keywords: ['INABIF', 'BIENESTAR FAMILIAR'], file: '/logos/inabif.jpg' },
  { keywords: ['INEI', 'ESTADÍSTICA E INFORMÁTICA', 'ESTADISTICA'], file: '/logos/inei.jpg' },
  { keywords: ['PRONABEC', 'BECAS Y CRÉDITO', 'BECAS Y CREDITO'], file: '/logos/pronabec.jpg' },
  { keywords: ['SENCICO', 'INDUSTRIA DE LA CONSTRUCCIÓN'], file: '/logos/sencico.jpg' },
  { keywords: ['SINEACE'], file: '/logos/sineace.jpg' },
  { keywords: ['IGP', 'INSTITUTO GEOFÍSICO', 'INSTITUTO GEOFISICO'], file: '/logos/igp.jpg' },
  { keywords: ['INGEMMET'], file: '/logos/ingemmet.jpg' },
  { keywords: ['MARINA DE GUERRA', 'MARINA'], file: '/logos/marina.jpg' },
  { keywords: ['ZOFRATACNA'], file: '/logos/zofratacna.jpg' },
  { keywords: ['CENTRO VACACIONAL HUAMPANI', 'HUAMPANI', 'HUAMPANÍ'], file: '/logos/orgs/th-CENTRO-VACACIONAL-HUAMPANI.jpg' },
  { keywords: ['IMA CUSCO', 'MANEJO DE AGUA Y MEDIO AMBIENTE', 'INSTITUTO DE MANEJO DE AGUA'], file: '/logos/orgs/th-imagen-INSTITUTO-DE-MANEJO-DE-AGUA-Y-MEDIO-AMBIENTE-IMA-CUSCO.jpg' },

  // Universidades Principales
  { keywords: ['UNIVERSIDAD NACIONAL FEDERICO VILLARREAL', 'UNFV', 'DANIEL ALCIDES CARRIÓN', 'DANIEL ALCIDES CARRION', 'AGRARIA DE LA SELVA', 'UNIVERSIDAD NACIONAL'], file: '/logos/unfv.jpg' },
  { keywords: ['JOSÉ FAUSTINO SÁNCHEZ CARRIÓN', 'JOSE FAUSTINO SANCHEZ CARRION', 'UNJFSC'], file: '/logos/sanchez-carrion.jpg' },

  // Municipalidades Principales y Distritales
  { keywords: ['TAMBURCO'], file: '/logos/orgs/th-imagen-MUNICIPALIDAD-DISTRITAL-TAMBURCO.jpg' },
  { keywords: ['YANATILE'], file: '/logos/orgs/th-imagen-MUNICIPALIDAD-DISTRITAL-DE-YANATILE.jpg' },
  { keywords: ['OLLANTAYTAMBO'], file: '/logos/orgs/th-imagen-MUNICIPALIDAD-DISTRITAL-DE-OLLANTAYTAMBO.jpg' },
  { keywords: ['UCHUMAYO'], file: '/logos/orgs/th-imagen-MUNICIPALIDAD-DISTRITAL-DE-UCHUMAYO.jpg' },
  { keywords: ['CHACLACAYO'], file: '/logos/orgs/th-imagen-MUNICIPALIDAD-DE-CHACLACAYO.jpg' },
  { keywords: ['SAN MARTÍN DE PORRES', 'SAN MARTIN DE PORRES', 'SMP'], file: '/logos/san-martin-de-porres.png' },
  { keywords: ['MUNICIPALIDAD PROVINCIAL DEL CUSCO', 'MUNICIPALIDAD DEL CUSCO', 'URUBAMBA'], file: '/logos/cusco.jpg' },
  { keywords: ['MUNICIPALIDAD METROPOLITANA DE LIMA', 'MUNILIMA', 'LIMA'], file: '/logos/lima.jpg' },
  { keywords: ['SANTIAGO DE SURCO', 'SURCO'], file: '/logos/surco.jpg' },
  { keywords: ['JESÚS MARÍA', 'JESUS MARIA'], file: '/logos/jesus-maria.jpg' },
  { keywords: ['LA VICTORIA'], file: '/logos/la-victoria.jpg' },
  { keywords: ['SURQUILLO'], file: '/logos/surquillo.jpg' },
  { keywords: ['LA MOLINA'], file: '/logos/la-molina.jpg' },
  { keywords: ['SAN MIGUEL'], file: '/logos/san-miguel.jpg' },

  // Gobiernos Regionales
  { keywords: ['GOBIERNO REGIONAL CUSCO', 'GORE CUSCO', 'CUSCO'], file: '/logos/gore-cusco.jpg' },
  { keywords: ['GOBIERNO REGIONAL DE AREQUIPA', 'GORE AREQUIPA', 'AREQUIPA', 'UCHUMAYO'], file: '/logos/gore-arequipa.jpg' },
  { keywords: ['GOBIERNO REGIONAL DEL CALLAO', 'CALLAO'], file: '/logos/callao.jpg' },
  { keywords: ['GOBIERNO REGIONAL DE AYACUCHO', 'AYACUCHO'], file: '/logos/ayacucho.jpg' },
  { keywords: ['GOBIERNO REGIONAL MOQUEGUA', 'MOQUEGUA'], file: '/logos/moquegua.jpg' },
];

function normalize(str: string): string {
  return str
    .toUpperCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^A-Z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function findLocalLogo(entityName: string): string | null {
  const upper = normalize(entityName);

  // 1. Direct and curated logos from LOCAL_LOGO_MAP
  for (const entry of LOCAL_LOGO_MAP) {
    if (entry.keywords.some(k => upper.includes(normalize(k)))) {
      return entry.file;
    }
  }

  // 2. Exact or distinctive fuzzy match against all 292 downloaded institutional logos
  for (const org of orgLogos) {
    const orgNorm = normalize(org.name);
    if (upper.includes(orgNorm) || orgNorm.includes(upper)) {
      return org.file;
    }

    // Match distinctive geographical or entity name
    const words = orgNorm.split(' ').filter(w => w.length >= 4 && !['MUNICIPALIDAD', 'DISTRITAL', 'PROVINCIAL', 'GOBIERNO', 'REGIONAL', 'NACIONAL', 'PARA', 'LIMA', 'PERU'].includes(w));
    if (words.length > 0 && words.every(w => upper.includes(w))) {
      return org.file;
    }
  }

  // 3. Sector matching for regional directorates and public networks
  if (upper.includes('HOSPITAL') || upper.includes('SALUD') || upper.includes('DIRESA') || upper.includes('DIRIS')) {
    return '/logos/minsa.jpg';
  }
  if (upper.includes('UGEL') || upper.includes('DRE') || upper.includes('EDUCACION') || upper.includes('PEDAGOGICA') || upper.includes('DOCENTE')) {
    return '/logos/minedu.jpg';
  }
  if (upper.includes('AGRICULTURA') || upper.includes('DRA') || upper.includes('AGRARIA') || upper.includes('AGRO')) {
    return '/logos/senasa.jpg';
  }
  if (upper.includes('MINISTERIO PUBLICO') || upper.includes('FISCALIA')) {
    return '/logos/ministerio-publico.jpg';
  }
  if (upper.includes('JUDICIAL') || upper.includes('CORTE SUPERIOR') || upper.includes('JUZGADO')) {
    return '/logos/poder-judicial.jpg';
  }
  if (upper.includes('POLICIA') || upper.includes('INTERIOR') || upper.includes('MIGRACIONES')) {
    return '/logos/mininter.jpg';
  }
  if (upper.includes('TRIBUTARIA') || upper.includes('ADUANAS') || upper.includes('SAT')) {
    return '/logos/sat-lima.jpg';
  }
  if (upper.includes('MINAS') || upper.includes('ENERGIA') || upper.includes('ELECTRICIDAD') || upper.includes('ELECTRO')) {
    return '/logos/minem.jpg';
  }
  if (upper.includes('AMBIENTE') || upper.includes('FORESTAL') || upper.includes('AMAZONIA')) {
    return '/logos/minam.jpg';
  }
  if (upper.includes('UNIVERSIDAD')) {
    return '/logos/unfv.jpg';
  }
  if (upper.includes('CALLAO')) {
    return '/logos/callao.jpg';
  }
  if (upper.includes('CUSCO')) {
    return '/logos/gore-cusco.jpg';
  }
  if (upper.includes('AREQUIPA')) {
    return '/logos/gore-arequipa.jpg';
  }
  if (upper.includes('AYACUCHO')) {
    return '/logos/ayacucho.jpg';
  }
  if (upper.includes('MOQUEGUA')) {
    return '/logos/moquegua.jpg';
  }
  if (upper.includes('LIMA') || upper.includes('CATASTRAL')) {
    return '/logos/lima.jpg';
  }

  return null;
}

export function EntityLogo({ entityName, logoUrl, size = 'banner' }: EntityLogoProps) {
  const [imgErr, setImgErr] = useState(false);

  // Priority 1: Use locally downloaded real logo from /public/logos/
  const localLogo = findLocalLogo(entityName);
  
  // Priority 2: Use scraped logoUrl from live feed
  // Priority 3: Fallback to local logo or default emblem
  const imageSrc = !imgErr
    ? (localLogo || (logoUrl && (logoUrl.startsWith('http') || logoUrl.startsWith('/')) ? logoUrl : null))
    : null;

  const isBanner = size === 'banner';
  const sizeClasses = {
    sm: 'w-10 h-10 rounded-lg p-1 shrink-0',
    md: 'w-16 h-16 rounded-xl p-1.5 shrink-0',
    lg: 'w-24 h-24 sm:w-28 sm:h-28 rounded-2xl p-2.5 shrink-0',
    banner: 'w-full h-36 rounded-2xl p-4',
  }[size];

  if (imageSrc) {
    return (
      <div className={`${sizeClasses} bg-white flex items-center justify-center shadow-md border border-slate-200 relative overflow-hidden group-hover:border-emerald-500 transition-all`}>
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 via-white to-red-600" />
        <img
          src={imageSrc}
          alt={entityName}
          className={`${isBanner ? 'max-h-28 max-w-[90%]' : 'w-full h-full'} object-contain drop-shadow`}
          onError={() => setImgErr(true)}
        />
      </div>
    );
  }

  // Fallback Institucional de Alta Distinción con Escudo Nacional Oficial del Perú (Vector 220KB)
  const isMuni = /MUNICIPALIDAD/i.test(entityName);
  const isGore = /GOBIERNO REGIONAL|GORE/i.test(entityName);
  const isUniv = /UNIVERSIDAD/i.test(entityName);
  const entityBadge = isMuni ? 'GOBIERNO LOCAL' : isGore ? 'GOBIERNO REGIONAL' : isUniv ? 'UNIVERSIDAD PÚBLICA' : 'ESTADO PERUANO';

  if (!isBanner) {
    return (
      <div className={`${sizeClasses} bg-gradient-to-b from-white to-slate-100 flex items-center justify-center shadow-md border border-slate-200 relative overflow-hidden shrink-0`}>
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 via-white to-red-600" />
        <img
          src="/logos/escudo-nacional-peru.svg"
          alt="Escudo Nacional del Perú"
          className="w-full h-full object-contain p-1 drop-shadow"
        />
      </div>
    );
  }

  return (
    <div className="w-full h-36 rounded-2xl bg-gradient-to-b from-white via-slate-50 to-slate-100 p-4 flex items-center justify-center shadow-md border border-slate-200 relative overflow-hidden group-hover:border-emerald-500 transition-all">
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-600 via-white to-red-600 shadow-sm" />
      <div className="absolute top-2 left-3 bg-red-700 text-white font-extrabold font-mono text-[9px] px-2.5 py-0.5 rounded shadow">
        {entityBadge}
      </div>
      
      <div className="flex items-center gap-3.5 max-w-full px-2 mt-2">
        {/* Escudo Nacional del Perú Oficial en Alta Definición */}
        <div className="w-16 h-16 shrink-0 rounded-2xl bg-white border border-slate-200/90 p-1.5 shadow-sm flex items-center justify-center">
          <img
            src="/logos/escudo-nacional-peru.svg"
            alt="Escudo Nacional del Perú"
            className="w-full h-full object-contain drop-shadow"
          />
        </div>

        <div className="min-w-0">
          <span className="text-xs font-black font-display text-slate-900 block leading-snug uppercase line-clamp-2 tracking-tight">
            {entityName}
          </span>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            <span className="text-[9.5px] font-mono font-bold text-emerald-800 uppercase tracking-tight block">
              CONVOCATORIA OFICIAL VERIFICADA
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
