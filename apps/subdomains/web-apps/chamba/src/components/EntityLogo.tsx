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

  // Superintendencias y Reguladores
  { keywords: ['SUNAT', 'TRIBUTARIA', 'ADUANAS'], file: '/logos/sunat.jpg' },
  { keywords: ['SUNAFIL', 'FISCALIZACIÓN LABORAL', 'FISCALIZACION LABORAL'], file: '/logos/sunafil.jpg' },
  { keywords: ['OSIPTEL', 'TELECOMUNICACIONES'], file: '/logos/osiptel.jpg' },
  { keywords: ['OSINERGMIN', 'ENERGÍA Y MINERÍA'], file: '/logos/osinergmin.jpg' },
  { keywords: ['OSITRAN', 'INFRAESTRUCTURA DE TRANSPORTE'], file: '/logos/ositran.jpg' },
  { keywords: ['SUNARP', 'REGISTROS PÚBLICOS', 'REGISTROS PUBLICOS'], file: '/logos/sunarp.jpg' },
  { keywords: ['SBS', 'SUPERINTENDENCIA DE BANCA'], file: '/logos/sbs.jpg' },
  { keywords: ['INDECOPI', 'COMPETENCIA Y DE LA PROTECCION'], file: '/logos/indecopi.jpg' },
  { keywords: ['ANIN', 'AUTORIDAD NACIONAL DE INFRAESTRUCTURA', 'INFRAESTRUCTURA'], file: '/logos/anin.jpg' },
  { keywords: ['SENASA', 'SANIDAD AGRARIA'], file: '/logos/senasa.jpg' },

  // Banca, Finanzas y Desarrollo
  { keywords: ['BCRP', 'BANCO CENTRAL DE RESERVA', 'RESERVA DEL PERÚ'], file: '/logos/bcrp.jpg' },
  { keywords: ['BANCO DE LA NACIÓN', 'BANCO DE LA NACION'], file: '/logos/banco-de-la-nacion.svg' },
  { keywords: ['AGROBANCO', 'BANCO AGROPECUARIO'], file: '/logos/agrobanco.jpg' },
  { keywords: ['COFIDE', 'FINANCIERA DE DESARROLLO'], file: '/logos/cofide.jpg' },
  { keywords: ['INTERBANK', 'BANCO INTERNACIONAL DEL PERÚ'], file: '/logos/interbank.svg' },
  { keywords: ['ALICORP'], file: '/logos/alicorp.svg' },
  { keywords: ['SAT LIMA', 'ADMINISTRACIÓN TRIBUTARIA DE LIMA', 'ADMINISTRACION TRIBUTARIA DE LIMA', 'SAT'], file: '/logos/sat-lima.jpg' },
  { keywords: ['ELECTROPERU', 'ELECTROPERÚ'], file: '/logos/electroperu.jpg' },

  // Salud y Seguridad Social
  { keywords: ['RED DE SALUD VALLE DEL MANTARO', 'MANTARO'], file: '/logos/red-salud-mantaro.jpg' },
  { keywords: ['ESSALUD', 'SEGURO SOCIAL DE SALUD'], file: '/logos/essalud.jpg' },
  { keywords: ['MINSA', 'MINISTERIO DE SALUD', 'DIRESA', 'SALUD'], file: '/logos/minsa.jpg' },

  // Ministerios del Estado
  { keywords: ['MINEDU', 'MINISTERIO DE EDUCACIÓN', 'MINISTERIO DE EDUCACION', 'UGEL'], file: '/logos/minedu.jpg' },
  { keywords: ['MEF', 'MINISTERIO DE ECONOMÍA', 'MINISTERIO DE ECONOMIA'], file: '/logos/mef.jpg' },
  { keywords: ['MIDIS', 'PAIS', 'PROGRAMA NACIONAL PAIS', 'INCLUSIÓN SOCIAL'], file: '/logos/midis.jpg' },
  { keywords: ['MINAM', 'MINISTERIO DEL AMBIENTE'], file: '/logos/minam.jpg' },
  { keywords: ['MINEM', 'MINISTERIO DE ENERGÍA Y MINAS', 'MINISTERIO DE ENERGIA Y MINAS'], file: '/logos/minem.jpg' },
  { keywords: ['MINDEF', 'MINISTERIO DE DEFENSA'], file: '/logos/mindef.jpg' },
  { keywords: ['MINCETUR', 'COMERCIO EXTERIOR Y TURISMO'], file: '/logos/mincetur.jpg' },
  { keywords: ['PRODUCE', 'MINISTERIO DE LA PRODUCCIÓN', 'MINISTERIO DE LA PRODUCCION'], file: '/logos/produce.jpg' },
  { keywords: ['RREE', 'RELACIONES EXTERIORES', 'CANCILLERÍA', 'CANCILLERIA'], file: '/logos/rree.jpg' },
  { keywords: ['MTPE', 'TRABAJO Y PROMOCIÓN DEL EMPLEO', 'TRABAJO Y PROMOCION DEL EMPLEO'], file: '/logos/mtpe.jpg' },
  { keywords: ['VIVIENDA', 'MINISTERIO DE VIVIENDA', 'CONSTRUCCIÓN Y SANEAMIENTO'], file: '/logos/vivienda.jpg' },
  { keywords: ['MININTER', 'MINISTERIO DEL INTERIOR', 'POLICÍA NACIONAL', 'POLICIA NACIONAL'], file: '/logos/mininter.jpg' },
  { keywords: ['CUNA MÁS', 'CUNAMAS', 'PROGRAMA NACIONAL CUNA MAS'], file: '/logos/cunamas.jpg' },
  { keywords: ['PROVIAS', 'PROVÍAS'], file: '/logos/provias.jpg' },
  { keywords: ['INDECI', 'DEFENSA CIVIL'], file: '/logos/indeci.jpg' },
  { keywords: ['DEVIDA', 'VIDA SIN DROGAS'], file: '/logos/devida.jpg' },
  { keywords: ['IPD', 'INSTITUTO PERUANO DEL DEPORTE'], file: '/logos/ipd.jpg' },
  { keywords: ['INABIF', 'BIENESTAR FAMILIAR'], file: '/logos/inabif.jpg' },
  { keywords: ['INEI', 'ESTADÍSTICA E INFORMÁTICA', 'ESTADISTICA'], file: '/logos/inei.jpg' },
  { keywords: ['PRONABEC', 'BECAS Y CRÉDITO'], file: '/logos/pronabec.jpg' },
  { keywords: ['SENCICO', 'INDUSTRIA DE LA CONSTRUCCIÓN'], file: '/logos/sencico.jpg' },
  { keywords: ['SINEACE'], file: '/logos/sineace.jpg' },
  { keywords: ['IGP', 'INSTITUTO GEOFÍSICO'], file: '/logos/igp.jpg' },
  { keywords: ['INGEMMET'], file: '/logos/ingemmet.jpg' },
  { keywords: ['MARINA DE GUERRA', 'MARINA'], file: '/logos/marina.jpg' },
  { keywords: ['ZOFRATACNA'], file: '/logos/zofratacna.jpg' },

  // Municipalidades Principales
  { keywords: ['SAN MARTÍN DE PORRES', 'SAN MARTIN DE PORRES', 'SMP'], file: '/logos/san-martin-de-porres.png' },
  { keywords: ['MUNICIPALIDAD PROVINCIAL DEL CUSCO', 'MUNICIPALIDAD DEL CUSCO'], file: '/logos/cusco.jpg' },
  { keywords: ['MUNICIPALIDAD METROPOLITANA DE LIMA', 'MUNILIMA'], file: '/logos/lima.jpg' },
  { keywords: ['SANTIAGO DE SURCO', 'SURCO'], file: '/logos/surco.jpg' },
  { keywords: ['JESÚS MARÍA', 'JESUS MARIA'], file: '/logos/jesus-maria.jpg' },
  { keywords: ['LA VICTORIA'], file: '/logos/la-victoria.jpg' },
  { keywords: ['SURQUILLO'], file: '/logos/surquillo.jpg' },
  { keywords: ['LA MOLINA'], file: '/logos/la-molina.jpg' },
  { keywords: ['SAN MIGUEL'], file: '/logos/san-miguel.jpg' },
  { keywords: ['UNIVERSIDAD NACIONAL FEDERICO VILLARREAL', 'UNFV'], file: '/logos/unfv.jpg' },
  { keywords: ['JOSÉ FAUSTINO SÁNCHEZ CARRIÓN', 'JOSE FAUSTINO SANCHEZ CARRION', 'UNJFSC'], file: '/logos/sanchez-carrion.jpg' },

  // Gobiernos Regionales
  { keywords: ['GOBIERNO REGIONAL CUSCO', 'GORE CUSCO'], file: '/logos/gore-cusco.jpg' },
  { keywords: ['GOBIERNO REGIONAL DE AREQUIPA', 'GORE AREQUIPA', 'AREQUIPA'], file: '/logos/gore-arequipa.jpg' },
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

  // 1. Direct and curated logos from LOCAL_LOGO_MAP (SVGs and high-priority brands)
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

    // Match distinctive geographical or entity name (e.g. "USQUIL", "SABANDIA", "YURA", "MARAS")
    const words = orgNorm.split(' ').filter(w => w.length >= 4 && !['MUNICIPALIDAD', 'DISTRITAL', 'PROVINCIAL', 'GOBIERNO', 'REGIONAL', 'NACIONAL', 'PARA', 'LIMA', 'PERU'].includes(w));
    if (words.length > 0 && words.every(w => upper.includes(w))) {
      return org.file;
    }
  }

  // 3. Sector matching for regional directorates and public networks
  if (upper.includes('HOSPITAL') || upper.includes('SALUD') || upper.includes('DIRESA')) {
    return '/logos/minsa.jpg';
  }
  if (upper.includes('UGEL') || upper.includes('DRE') || upper.includes('EDUCACION') || upper.includes('PEDAGOGICA')) {
    return '/logos/minedu.jpg';
  }
  if (upper.includes('AGRICULTURA') || upper.includes('DRA') || upper.includes('AGRARIA')) {
    return '/logos/senasa.jpg';
  }
  if (upper.includes('CALLAO')) {
    return '/logos/callao.jpg';
  }
  if (upper.includes('LIMA') || upper.includes('CATASTRAL')) {
    return '/logos/lima.jpg';
  }

  return null;
}

export function EntityLogo({ entityName, logoUrl }: EntityLogoProps) {
  const [imgErr, setImgErr] = useState(false);

  // Priority 1: Use locally downloaded real logo from /public/logos/
  const localLogo = findLocalLogo(entityName);
  
  // Priority 2: Use scraped logoUrl from live feed
  // Priority 3: Fallback to local logo or default emblem
  const imageSrc = !imgErr
    ? (localLogo || (logoUrl && (logoUrl.startsWith('http') || logoUrl.startsWith('/')) ? logoUrl : null))
    : null;

  if (imageSrc) {
    return (
      <div className="w-full h-36 rounded-2xl bg-white p-4 flex items-center justify-center shadow-md border border-slate-200 relative overflow-hidden group-hover:border-emerald-500 transition-all">
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-600 via-white to-red-600" />
        <img
          src={imageSrc}
          alt={entityName}
          className="max-h-28 max-w-[90%] object-contain drop-shadow"
          onError={() => setImgErr(true)}
        />
      </div>
    );
  }

  // Fallback: Escudo Oficial del Perú con Estilo Institucional Premium
  const isMuni = /MUNICIPALIDAD/i.test(entityName);
  const isGore = /GOBIERNO REGIONAL|GORE/i.test(entityName);

  return (
    <div className="w-full h-36 rounded-2xl bg-white p-4 flex items-center justify-center shadow-md border border-slate-200 relative overflow-hidden group-hover:border-emerald-500 transition-all">
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-600 via-white to-red-600" />
      <div className="absolute top-2 left-3 bg-red-700 text-white font-extrabold font-mono text-[9px] px-2 py-0.5 rounded shadow">
        {isMuni ? 'GOBIERNO LOCAL' : isGore ? 'GOBIERNO REGIONAL' : 'ESTADO PERUANO'}
      </div>
      
      <div className="flex items-center gap-4 max-w-full px-2 mt-2">
        {/* Escudo Nacional del Perú Oficial Vector */}
        <div className="w-14 h-14 shrink-0 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center p-1.5 shadow-inner">
          <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow">
            {/* Escudo Exterior */}
            <path d="M50 8 L82 22 V55 C82 75, 50 92, 50 92 C 50 92, 18 75, 18 55 V22 Z" fill="#DC2626" stroke="#991B1B" strokeWidth="3" />
            <path d="M50 14 L76 26 V52 C76 70, 50 84, 50 84 C 50 84, 24 70, 24 52 V26 Z" fill="#FFFFFF" />
            {/* Cuadrantes: Vicuña (Celeste), Árbol de la Quina (Blanco), Cornucopia (Rojo) */}
            <rect x="25" y="26" width="25" height="26" fill="#38BDF8" />
            <rect x="50" y="26" width="26" height="26" fill="#F8FAFC" />
            <path d="M25 52 H76 V70 C76 74, 50 84, 50 84 C 50 84, 25 74, 25 70 Z" fill="#DC2626" />
            {/* Corona Cívica y Laureles dorados */}
            <circle cx="50" cy="14" r="6" fill="#F59E0B" stroke="#B45309" strokeWidth="1" />
            <path d="M35 38 C35 32, 45 32, 45 38 C45 42, 35 44, 35 48" stroke="#B45309" strokeWidth="2" fill="none" />
            <path d="M60 32 C60 30, 68 30, 68 38 C68 44, 58 46, 60 52" stroke="#047857" strokeWidth="2" fill="none" />
            <circle cx="50" cy="65" r="7" fill="#FBBF24" />
          </svg>
        </div>

        <div className="min-w-0">
          <span className="text-xs font-black font-display text-slate-900 block leading-snug uppercase line-clamp-2">
            {entityName}
          </span>
          <span className="text-[10px] font-mono font-bold text-emerald-700 uppercase tracking-tight block mt-0.5">
            CONVOCATORIA OFICIAL VERIFICADA
          </span>
        </div>
      </div>
    </div>
  );
}
