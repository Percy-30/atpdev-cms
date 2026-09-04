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
  'servir-cas': <Landmark size={20} className="text-emerald-400" />,
  'modern-executive': <Briefcase size={20} className="text-blue-400" />,
  'minimal-ats': <FileText size={20} className="text-slate-300" />,
  'tech-creative': <Code2 size={20} className="text-teal-400" />,
};

export function CvTemplateSelector({ selectedId, onSelect }: Props) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-xs font-mono text-slate-300 font-bold uppercase tracking-wider flex items-center gap-1.5">
          <span>Selecciona tu Plantilla de CV:</span>
        </label>
        <span className="text-[11px] text-slate-400 font-mono">
          4 diseños profesionales adaptables
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {TEMPLATES_META.map((t) => {
          const isSelected = selectedId === t.id;

          return (
            <button
              key={t.id}
              type="button"
              onClick={() => onSelect(t.id)}
              className={`p-3.5 rounded-2xl text-left transition-all relative flex flex-col justify-between border cursor-pointer ${
                isSelected
                  ? 'bg-slate-800/90 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.25)] ring-1 ring-emerald-500/50'
                  : 'bg-slate-900/60 border-white/10 hover:border-white/20 hover:bg-slate-900'
              }`}
            >
              {/* Header card */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-xl bg-slate-950/80 border border-white/10">
                    {TEMPLATE_ICONS[t.id]}
                  </div>
                  <span
                    className={`text-[9.5px] font-mono px-2 py-0.5 rounded-full font-bold uppercase ${
                      isSelected
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {t.tag}
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-sm text-white font-display flex items-center gap-1">
                    {t.name}
                  </h4>
                  <p className="text-[11px] text-slate-400 leading-snug mt-0.5">
                    {t.subtitle}
                  </p>
                </div>
              </div>

              {/* Footer recommended use */}
              <div className="pt-3 mt-3 border-t border-white/5 flex items-center justify-between">
                <span className="text-[10px] text-slate-400 font-mono">
                  {t.recommendedFor}
                </span>
                {isSelected && (
                  <CheckCircle2 size={16} className="text-emerald-400 shrink-0 ml-2" />
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
