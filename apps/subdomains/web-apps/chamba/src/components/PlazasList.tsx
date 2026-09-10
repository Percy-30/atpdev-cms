'use client';

import React, { useState, useMemo } from 'react';
import { JobPlaza } from '@atpdev/database';
import { FileText, ExternalLink, Search, GraduationCap, Briefcase, Banknote, ShieldCheck, Eye } from 'lucide-react';

interface PlazasListProps {
  plazas: JobPlaza[];
  entityName: string;
  defaultApplyUrl: string;
  globalBasesPdfUrl?: string;
  anexosUrl?: string;
}

export function PlazasList({ plazas, entityName, defaultApplyUrl, globalBasesPdfUrl, anexosUrl }: PlazasListProps) {
  const [filter, setFilter] = useState('');

  const filteredPlazas = useMemo(() => {
    if (!filter.trim()) return plazas;
    const q = filter.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    return plazas.filter((p) => {
      const matchTitle = p.title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(q);
      const matchCas = p.cas_code?.toLowerCase().includes(q);
      const matchEdu = p.education?.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(q);
      const matchExp = p.experience?.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(q);
      const matchSal = p.salary?.toLowerCase().includes(q);
      return matchTitle || matchCas || matchEdu || matchExp || matchSal;
    });
  }, [plazas, filter]);

  if (!plazas || plazas.length === 0) return null;

  return (
    <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-6 border border-emerald-500/30">
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
            Cada plaza cuenta con su perfil específico, requisitos mínimos y acceso directo al documento oficial de bases en PDF.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3.5 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-mono text-xs font-bold whitespace-nowrap">
            {plazas.length} Plazas Registradas
          </span>
        </div>
      </div>

      {/* Quick Access Official Document Banner */}
      {(globalBasesPdfUrl || anexosUrl) && (
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-xs">
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-emerald-400 shrink-0" />
            <span className="text-slate-200 font-medium">
              Documentos oficiales publicados por <b className="text-white">{entityName}</b>:
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {globalBasesPdfUrl && (
              <a
                href={globalBasesPdfUrl}
                target="_blank"
                rel="nofollow noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition-all shadow-[0_0_10px_rgba(16,185,129,0.3)] cursor-pointer"
              >
                <FileText size={13} />
                <span>Bases Oficiales (PDF Directo)</span>
                <ExternalLink size={11} />
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
      )}

      {/* Filter Input if more than 3 plazas */}
      {plazas.length > 3 && (
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
            const isDoc = (
              pdfUrl.includes('.pdf') ||
              pdfUrl.includes('drive.google.com') ||
              pdfUrl.includes('docs.google.com') ||
              pdfUrl.includes('archivos.mpfn.gob.pe') ||
              pdfUrl.includes('/anexo-archivo/') ||
              pdfUrl.includes('Descargar_Tdr')
            );

            return (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-slate-950/70 border border-white/10 hover:border-emerald-500/40 transition-all space-y-4 shadow-sm"
              >
                {/* Plaza Header */}
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      {plaza.cas_code && (
                        <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono text-xs font-black">
                          {plaza.cas_code}
                        </span>
                      )}
                      <span className="text-white font-extrabold text-sm sm:text-base font-display">
                        {plaza.title}
                      </span>
                    </div>
                  </div>

                  {/* Remuneración & Vacantes Tags */}
                  <div className="flex items-center gap-2">
                    {plaza.vacancies && plaza.vacancies > 1 && (
                      <span className="px-2.5 py-1 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 font-mono text-xs font-bold whitespace-nowrap">
                        👥 {plaza.vacancies} vacantes
                      </span>
                    )}
                    {plaza.salary && (
                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-xs font-bold whitespace-nowrap">
                        <Banknote size={14} />
                        <span>{plaza.salary}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Requirements details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  {plaza.education && (
                    <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
                      <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[10px] uppercase font-bold">
                        <GraduationCap size={13} className="text-cyan-400" />
                        <span>Formación Académica</span>
                      </div>
                      <p className="text-slate-200 font-medium leading-relaxed">
                        {plaza.education}
                      </p>
                    </div>
                  )}

                  {plaza.experience && (
                    <div className="p-3 rounded-xl bg-slate-900/60 border border-white/5 space-y-1">
                      <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[10px] uppercase font-bold">
                        <Briefcase size={13} className="text-amber-400" />
                        <span>Experiencia Laboral</span>
                      </div>
                      <p className="text-slate-200 font-medium leading-relaxed">
                        {plaza.experience}
                      </p>
                    </div>
                  )}
                </div>

                {/* Direct Action Link for Official PDF bases */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-white/5">
                  <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                    <ShieldCheck size={14} className="text-emerald-400" />
                    <span>Bases Oficiales emitidas por {entityName}</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {globalBasesPdfUrl && (
                      <a
                        href={globalBasesPdfUrl}
                        target="_blank"
                        rel="nofollow noopener noreferrer"
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black font-display transition-all shadow-[0_0_12px_rgba(16,185,129,0.3)] flex items-center gap-1.5 cursor-pointer"
                      >
                        <FileText size={14} />
                        <span>[ BASES OFICIALES (PDF) ]</span>
                        <ExternalLink size={12} />
                      </a>
                    )}
                    {pdfUrl && pdfUrl !== globalBasesPdfUrl && (
                      <a
                        href={pdfUrl}
                        target="_blank"
                        rel="nofollow noopener noreferrer"
                        className="px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 border border-white/10 text-slate-200 text-xs font-bold font-display transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <b id="verdetalles">[ VER DETALLES DE PLAZA ]</b>
                        <ExternalLink size={12} />
                      </a>
                    )}
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
