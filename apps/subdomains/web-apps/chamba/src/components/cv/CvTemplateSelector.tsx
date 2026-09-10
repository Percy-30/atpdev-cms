'use client';

import React from 'react';
import { Landmark, Briefcase, FileText, Code2, CheckCircle2 } from 'lucide-react';
import { CvTemplateId } from './types';
import { TEMPLATES_META } from './sampleData';

interface Props {
  selectedId: CvTemplateId;
  onSelect: (id: CvTemplateId) => void;
}

const TEMPLATE_ICONS: Record<CvTemplateId, React.ReactNode> = {
  'servir-cas': <Landmark size={18} className="text-emerald-400" />,
  'modern-executive': <Briefcase size={18} className="text-blue-400" />,
  'minimal-ats': <FileText size={18} className="text-slate-300" />,
  'tech-creative': <Code2 size={18} className="text-teal-400" />,
};

export function CvTemplateSelector({ selectedId, onSelect }: Props) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs">
        <span className="font-mono text-slate-300 font-bold uppercase tracking-wider flex items-center gap-1.5 text-[11px]">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>Plantilla de CV Seleccionada:</span>
        </span>
        <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
          4 modelos profesionales calibrados
        </span>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-2.5">
        {TEMPLATES_META.map((t) => {
          const isSelected = selectedId === t.id;

          return (
            <button
              key={t.id}
              type="button"
              onClick={() => onSelect(t.id)}
              className={`p-2.5 sm:p-3 rounded-2xl text-left transition-all duration-200 relative flex items-center justify-between gap-2.5 border cursor-pointer group ${
                isSelected
                  ? 'bg-slate-800/95 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.25)] ring-1 ring-emerald-500/50 scale-[1.01]'
                  : 'bg-slate-900/60 border-white/10 hover:border-white/25 hover:bg-slate-800/70'
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className={`p-2 rounded-xl border shrink-0 transition-colors ${
                  isSelected ? 'bg-emerald-500/20 border-emerald-500/40' : 'bg-slate-950/80 border-white/10 group-hover:border-white/20'
                }`}>
                  {TEMPLATE_ICONS[t.id]}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-bold text-xs sm:text-sm text-white font-display truncate">
                      {t.name}
                    </h4>
                  </div>
                  <span className={`text-[9.5px] font-mono font-semibold truncate block ${
                    isSelected ? 'text-emerald-400' : 'text-slate-400'
                  }`}>
                    {t.tag}
                  </span>
                </div>
              </div>

              {isSelected ? (
                <div className="shrink-0 p-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                  <CheckCircle2 size={15} />
                </div>
              ) : (
                <div className="w-4 h-4 rounded-full border border-white/20 shrink-0 group-hover:border-white/40" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
