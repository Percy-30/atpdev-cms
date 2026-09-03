'use client';

import React, { useState } from 'react';

interface EntityLogoProps {
  entityName: string;
  logoUrl?: string;
  size?: 'sm' | 'md' | 'lg' | 'banner';
}

// Map entity name keywords to locally downloaded logo files in /public/logos/
const LOCAL_LOGO_MAP: { keywords: string[]; file: string }[] = [
  { keywords: ['ONPE', 'PROCESOS ELECTORALES'], file: '/logos/onpe.jpg' },
  { keywords: ['MINISTERIO PÚBLICO', 'FISCALÍA', 'MPFN'], file: '/logos/ministerio-publico.jpg' },
  { keywords: ['PODER JUDICIAL'], file: '/logos/poder-judicial.jpg' },
  { keywords: ['JNE', 'JURADO NACIONAL'], file: '/logos/jne.jpg' },
  { keywords: ['INEI', 'ESTADÍSTICA'], file: '/logos/inei.jpg' },
  { keywords: ['RED DE SALUD VALLE DEL MANTARO', 'MANTARO'], file: '/logos/red-salud-mantaro.jpg' },
  { keywords: ['SUNARP', 'REGISTROS PÚBLICOS'], file: '/logos/sunarp.jpg' },
  { keywords: ['MINEDU', 'MINISTERIO DE EDUCACIÓN', 'UGEL'], file: '/logos/minedu.jpg' },
  { keywords: ['MEF', 'MINISTERIO DE ECONOMÍA', 'ECONOMÍA Y FINANZAS'], file: '/logos/mef.jpg' },
  { keywords: ['MINSA', 'MINISTERIO DE SALUD', 'DIRESA', 'RED DE SALUD', 'SALUD'], file: '/logos/minsa.jpg' },
  { keywords: ['MIDIS', 'PAIS', 'INCLUSIÓN SOCIAL', 'PROGRAMA NACIONAL'], file: '/logos/midis.jpg' },
  { keywords: ['SBS', 'SUPERINTENDENCIA DE BANCA'], file: '/logos/sbs.jpg' },
  { keywords: ['AGROBANCO', 'BANCO AGROPECUARIO'], file: '/logos/agrobanco.jpg' },
  { keywords: ['OSINERGMIN'], file: '/logos/osinergmin.jpg' },
  { keywords: ['DEVIDA', 'VIDA SIN DROGAS'], file: '/logos/devida.jpg' },
  { keywords: ['IPD', 'INSTITUTO PERUANO DEL DEPORTE'], file: '/logos/ipd.jpg' },
  { keywords: ['INABIF', 'BIENESTAR FAMILIAR'], file: '/logos/inabif.jpg' },
  { keywords: ['MINAM', 'MINISTERIO DEL AMBIENTE', 'AMBIENTE'], file: '/logos/minam.jpg' },
  { keywords: ['MINEM', 'MINISTERIO DE ENERGÍA', 'ENERGÍA Y MINAS'], file: '/logos/minem.jpg' },
  { keywords: ['MINDEF', 'MINISTERIO DE DEFENSA'], file: '/logos/mindef.jpg' },
  { keywords: ['MUNICIPALIDAD METROPOLITANA DE LIMA'], file: '/logos/lima.jpg' },
  { keywords: ['SANTIAGO DE SURCO', 'SURCO'], file: '/logos/surco.jpg' },
  { keywords: ['UNIVERSIDAD NACIONAL FEDERICO VILLARREAL', 'UNFV'], file: '/logos/unfv.jpg' },
  { keywords: ['SENCICO'], file: '/logos/sencico.jpg' },
  { keywords: ['PRONABEC', 'BECAS'], file: '/logos/pronabec.jpg' },
  { keywords: ['SINEACE'], file: '/logos/sineace.jpg' },
  { keywords: ['COFIDE'], file: '/logos/cofide.jpg' },
  { keywords: ['CALLAO', 'GOBIERNO REGIONAL DEL CALLAO'], file: '/logos/callao.jpg' },
  { keywords: ['AYACUCHO', 'GOBIERNO REGIONAL DE AYACUCHO'], file: '/logos/ayacucho.jpg' },
  { keywords: ['MOQUEGUA', 'GOBIERNO REGIONAL MOQUEGUA'], file: '/logos/moquegua.jpg' },
  { keywords: ['MARINA DE GUERRA', 'MARINA'], file: '/logos/marina.jpg' },
  { keywords: ['ZOFRATACNA', 'ZONA FRANCA'], file: '/logos/zofratacna.jpg' },
  { keywords: ['IGP', 'INSTITUTO GEOFÍSICO'], file: '/logos/igp.jpg' },
  { keywords: ['INGEMMET', 'GEOLÓGICO MINERO'], file: '/logos/ingemmet.jpg' },
  { keywords: ['ESSALUD'], file: '/logos/minsa.jpg' }, // EsSalud uses health sector logo
  { keywords: ['PROVIAS', 'MTC', 'TRANSPORTES'], file: '/logos/mef.jpg' }, // fallback
  { keywords: ['SUNAT', 'ADUANAS', 'TRIBUTOS'], file: '/logos/mef.jpg' }, // fallback
  { keywords: ['BCRP', 'BANCO CENTRAL'], file: '/logos/mef.jpg' }, // fallback
  { keywords: ['RENIEC'], file: '/logos/jne.jpg' }, // electoral sector
  { keywords: ['CONTIGO'], file: '/logos/midis.jpg' }, // MIDIS program
  { keywords: ['QALI WARMA', 'CUNA MÁS', 'CUNAMAS'], file: '/logos/midis.jpg' },
];

function findLocalLogo(entityName: string): string | null {
  const upper = entityName.toUpperCase();
  for (const entry of LOCAL_LOGO_MAP) {
    if (entry.keywords.some(k => upper.includes(k))) {
      return entry.file;
    }
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
    ? (localLogo || (logoUrl && logoUrl.startsWith('http') ? logoUrl : null))
    : null;

  if (imageSrc) {
    return (
      <div className="w-full h-36 rounded-2xl bg-white p-4 flex items-center justify-center shadow-md border border-slate-200 relative overflow-hidden group-hover:border-emerald-500 transition-all">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 via-white to-red-600" />
        <img
          src={imageSrc}
          alt={entityName}
          className="max-h-28 max-w-[90%] object-contain drop-shadow"
          onError={() => setImgErr(true)}
        />
      </div>
    );
  }

  // Fallback: Clean institutional text banner (when no logo file exists at all)
  return (
    <div className="w-full h-36 rounded-2xl bg-white p-4 flex flex-col items-center justify-center shadow-md border border-slate-200 relative overflow-hidden group-hover:border-red-600 transition-all">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-600 via-white to-red-600" />
      <div className="absolute top-2 left-3 bg-red-700 text-white font-extrabold font-mono text-[9px] px-2 py-0.5 rounded shadow">
        PERÚ
      </div>
      <div className="flex items-center gap-3 mt-2">
        <svg className="w-10 h-10 flex-shrink-0" viewBox="0 0 100 100" fill="none">
          <rect width="100" height="100" rx="18" fill="#991B1B" />
          <path d="M50 15L80 35V65L50 85L20 65V35L50 15Z" stroke="#FFFFFF" strokeWidth="6" />
          <path d="M50 30L65 45H35L50 30Z" fill="#FACC15" />
        </svg>
        <div className="text-left">
          <span className="text-sm font-black font-display text-red-900 block leading-tight uppercase line-clamp-2">
            {entityName}
          </span>
          <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-tight block">
            CONVOCATORIA PÚBLICA
          </span>
        </div>
      </div>
    </div>
  );
}
