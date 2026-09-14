'use client';

import React, { useState, useMemo } from 'react';
import { JobPlaza, isCompetitorUrl } from '@atpdev/database';
import { FileText, ExternalLink, Search, GraduationCap, Briefcase, Banknote, ShieldCheck, Eye } from 'lucide-react';

interface PlazasListProps {
  plazas: JobPlaza[];
  entityName: string;
  defaultApplyUrl: string;
  globalBasesPdfUrl?: string;
  anexosUrl?: string;
}

// Helper text cleaners to guarantee 100% clean typography and prevent design overflow
function sanitizePlazaSalary(salary?: string): string {
  if (!salary) return '';
  let s = salary.replace(/[\r\n\t]+/g, ' ').trim();
  const match = s.match(/^(S\/\.?\s*[\d,]+(?:\.\s*\d+)?)/i);
  if (match) {
    let numPart = match[1].replace(/\s+/g, '');
    return numPart.replace(/S\/\.?/i, 'S/. ');
  }
  s = s.replace(/\s*[«<\[].*$/i, '');
  s = s.replace(/\s*DETALLES DE POSTULACI[OÓ]N.*$/i, '');
  s = s.replace(/\s*PUBLICACI[OÓ]N DE LA CONVOCATORIA.*$/i, '');
  s = s.replace(/\s*\[\s*VER M[AÁ]S.*$/i, '');
  s = s.replace(/\s*Plazo de Contrato.*$/i, '');
  return s.trim();
}

function sanitizePlazaTitle(title?: string): string {
  if (!title) return '';
  return title.replace(/[\r\n\t]+/g, ' ').replace(/\s+/g, ' ').trim();
}

function sanitizePlazaText(text?: string): string {
  if (!text) return '';
  let s = text.replace(/\\r\\n|\\n|\\r/g, ' ').replace(/[\r\n\t]+/g, ' ').replace(/\s+/g, ' ').trim();
  s = s.replace(/\s*[«<\[]\s*\d+.*$/i, '');
  s = s.replace(/\s*\[\s*VER M[AÁ]S.*$/i, '');
  s = s.replace(/\s*Plazo de Contrato.*$/i, '');
  s = s.replace(/\s*DETALLES DE POSTULACI[OÓ]N.*$/i, '');
  s = s.replace(/\s*PUBLICACI[OÓ]N DE LA CONVOCATORIA.*$/i, '');
  if (s.length > 1 && s[0] >= 'a' && s[0] <= 'z') {
    s = s[0].toUpperCase() + s.slice(1);
  }
  return s.trim();
}

export function PlazasList({ plazas, entityName, defaultApplyUrl, globalBasesPdfUrl, anexosUrl }: PlazasListProps) {
  const [filter, setFilter] = useState('');

  const cleanedPlazas = useMemo(() => {
    return (plazas || []).map(p => ({
      ...p,
      title: sanitizePlazaTitle(p.title),
      education: sanitizePlazaText(p.education),
      experience: sanitizePlazaText(p.experience),
      salary: sanitizePlazaSalary(p.salary)
    }));
  }, [plazas]);

  const filteredPlazas = useMemo(() => {
    if (!filter.trim()) return cleanedPlazas;
    const q = filter.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    return cleanedPlazas.filter((p) => {
      const matchTitle = p.title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(q);
      const matchCas = p.cas_code?.toLowerCase().includes(q);
      const matchEdu = p.education?.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(q);
      const matchExp = p.experience?.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(q);
      const matchSal = p.salary?.toLowerCase().includes(q);
      return matchTitle || matchCas || matchEdu || matchExp || matchSal;
    });
  }, [cleanedPlazas, filter]);

  if (!plazas || plazas.length === 0) return null;

  return (
    <div id="plazas-convocadas" className="glass-card p-6 sm:p-8 rounded-3xl space-y-6 border border-emerald-500/30 scroll-mt-24 overflow-hidden">
      {/* Header with Title and Counter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_#10b981]" />
            <h2 className="text-xl sm:text-2xl font-bold font-display text-white">
              Plazas Convocadas y Bases Oficiales Individuales
            </h2>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Cada puesto cuenta con requisitos mínimos, remuneración y descarga directa e individual de sus bases oficiales en PDF.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3.5 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-mono text-xs font-bold whitespace-nowrap">
            {cleanedPlazas.length} Plazas Registradas
          </span>
        </div>
      </div>

      {/* Quick Access Official Document Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-xs">
        <div className="flex items-center gap-2">
          <ShieldCheck size={16} className="text-emerald-400 shrink-0" />
          <span className="text-slate-200 font-medium">
            {globalBasesPdfUrl ? (
              <>Documentos oficiales publicados por <b className="text-white">{entityName}</b>:</>
            ) : (
              <>Bases independientes por especialidad emitidas por <b className="text-white">{entityName}</b>. Cada puesto tiene su PDF específico abajo:</>
            )}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {globalBasesPdfUrl && (
            <a
              href={globalBasesPdfUrl}
              target="_blank"
              rel="nofollow noopener noreferrer"
              className="btn-brand-gradient inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-white font-bold transition-all shadow-md cursor-pointer"
            >
              <FileText size={13} className="text-white drop-shadow-sm" />
              <span className="text-white drop-shadow-sm">Bases Oficiales (PDF Directo)</span>
              <ExternalLink size={11} className="text-white drop-shadow-sm" />
            </a>
          )}
          {anexosUrl && (
            <a
              href={anexosUrl}
              target="_blank"
              rel="nofollow noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 font-bold transition-colors cursor-pointer"
            >
              <span>📝 Descargar Anexos (Word)</span>
              <ExternalLink size={11} />
            </a>
          )}
        </div>
      </div>

      {/* Filter Input if more than 3 plazas */}
      {cleanedPlazas.length > 3 && (
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            placeholder="Filtrar por puesto, carrera (Derecho, Administración, Contabilidad) o código CAS..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/80 border border-white/15 text-slate-100 placeholder-slate-400 text-xs focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
          />
          {filter && (
            <button
              onClick={() => setFilter('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
            >
              Limpiar
            </button>
          )}
        </div>
      )}

      {/* Plazas Cards Grid */}
      <div className="space-y-4">
        {filteredPlazas.length === 0 ? (
          <div className="p-6 text-center text-slate-400 text-xs rounded-2xl bg-slate-950/40 border border-white/5">
            No se encontraron plazas con el filtro especificado.
          </div>
        ) : (
          filteredPlazas.map((plaza, idx) => {
            const pdfUrl = plaza.bases_url || defaultApplyUrl;
            const lowPlazaUrl = (pdfUrl || '').toLowerCase();
            const isPlazaDoc = (
              lowPlazaUrl.includes('.pdf') ||
              lowPlazaUrl.includes('drive.google.com') ||
              lowPlazaUrl.includes('docs.google.com') ||
              lowPlazaUrl.includes('archivos.mpfn.gob.pe') ||
              lowPlazaUrl.includes('/anexo-archivo/') ||
              lowPlazaUrl.includes('descargar_tdr') ||
              lowPlazaUrl.includes('descargar_bases') ||
              lowPlazaUrl.includes('download') ||
              lowPlazaUrl.includes('.docx') ||
              lowPlazaUrl.includes('.doc')
            );

            return (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-slate-950/70 border border-white/10 hover:border-emerald-500/40 transition-all space-y-4 shadow-sm overflow-hidden break-words"
              >
                {/* Plaza Header */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      {plaza.cas_code && (
                        <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono text-xs font-black shrink-0">
                          {plaza.cas_code}
                        </span>
                      )}
                      <h4 className="text-white font-bold text-sm sm:text-base leading-snug break-words tracking-tight">
                        {plaza.title}
                      </h4>
                    </div>
                  </div>

                  {/* Remuneración & Vacantes Tags */}
                  <div className="flex items-center gap-2 shrink-0 flex-wrap">
                    {plaza.vacancies && plaza.vacancies > 1 && (
                      <span className="px-2.5 py-1 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 font-mono text-xs font-bold shrink-0">
                        👥 {plaza.vacancies} vacantes
                      </span>
                    )}
                    {plaza.salary && (
                      <div className="salary-pill flex items-center gap-1.5 px-3 py-1 rounded-xl font-mono text-xs font-bold max-w-full truncate shadow-sm shrink-0">
                        <Banknote size={14} className="shrink-0" />
                        <span className="truncate">{plaza.salary}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Requirements details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  {plaza.education && (
                    <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 space-y-1.5">
                      <div className="flex items-center gap-1.5 text-cyan-400 font-mono text-[11px] uppercase font-bold tracking-wider">
                        <GraduationCap size={14} className="text-cyan-400 shrink-0" />
                        <span>Formación Académica</span>
                      </div>
                      <p className="text-slate-200 font-normal leading-relaxed text-xs sm:text-[13px] break-words">
                        {plaza.education}
                      </p>
                    </div>
                  )}

                  {plaza.experience && (
                    <div className="p-3.5 rounded-xl bg-slate-900/60 border border-white/5 space-y-1.5">
                      <div className="flex items-center gap-1.5 text-amber-400 font-mono text-[11px] uppercase font-bold tracking-wider">
                        <Briefcase size={14} className="text-amber-400 shrink-0" />
                        <span>Experiencia Laboral</span>
                      </div>
                      <p className="text-slate-200 font-normal leading-relaxed text-xs sm:text-[13px] break-words">
                        {plaza.experience}
                      </p>
                    </div>
                  )}
                </div>

                {/* Direct Action Link for Official PDF bases */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/5">
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                    <ShieldCheck size={14} className="text-emerald-400 shrink-0" />
                    <span>Bases Oficiales emitidas por {entityName}</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {/* Botón de bases específico de ESTA plaza */}
                    {pdfUrl && !isCompetitorUrl(pdfUrl) && (
                      <a
                        href={
                          pdfUrl.includes('drive.google.com/file/d/')
                            ? pdfUrl.replace(/drive\.google\.com\/file\/d\/([^\/?#]+).*/, 'https://drive.google.com/file/d/$1/preview')
                            : pdfUrl
                        }
                        target="_blank"
                        download
                        rel="nofollow noopener noreferrer"
                        className="btn-brand-gradient px-3.5 py-1.5 rounded-xl text-white text-xs font-black font-display transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                      >
                        {isPlazaDoc ? <FileText size={14} className="text-white drop-shadow-sm" /> : <ExternalLink size={14} className="text-white drop-shadow-sm" />}
                        <span className="text-white drop-shadow-sm">{isPlazaDoc ? '📄 Descargar Bases (PDF)' : 'Ver en Portal Oficial'}</span>
                        <ExternalLink size={12} className="text-white drop-shadow-sm" />
                      </a>
                    )}

                    {/* Botón TDR específico para convocatorias MINEDU */}
                    {pdfUrl && pdfUrl.includes('postulacioncas.minedu.gob.pe') && pdfUrl.includes('idReq=') && (
                      <a
                        href={pdfUrl.replace(/Descargar_Bases/i, 'Descargar_Tdr')}
                        target="_blank"
                        rel="nofollow noopener noreferrer"
                        className="px-3 py-1.5 rounded-xl bg-cyan-950/80 hover:bg-cyan-900/80 border border-cyan-500/40 text-cyan-300 text-xs font-bold font-display transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <FileText size={13} className="text-cyan-400" />
                        <span>Ver TDR (PDF)</span>
                        <ExternalLink size={11} />
                      </a>
                    )}

                    {/* Botón para postular en el portal oficial de la entidad o convocatoria específica */}
                    {(() => {
                      const mineduIdMatch = pdfUrl?.match(/idReq=(\d+)/i);
                      const targetPortalUrl = mineduIdMatch
                        ? `https://postulacioncas.minedu.gob.pe/PostulacionCas/Home/Convocatoria/${mineduIdMatch[1]}`
                        : (defaultApplyUrl && defaultApplyUrl !== pdfUrl ? defaultApplyUrl : undefined);

                      if (!targetPortalUrl) return null;

                      return (
                        <a
                          href={targetPortalUrl}
                          target="_blank"
                          rel="nofollow noopener noreferrer"
                          className="px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 border border-white/10 text-slate-200 text-xs font-bold font-display transition-all flex items-center gap-1.5 cursor-pointer hover:border-emerald-500/30"
                        >
                          <span>{mineduIdMatch ? '🌐 Convocatoria Oficial' : 'Postular en Portal'}</span>
                          <ExternalLink size={12} />
                        </a>
                      );
                    })()}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
