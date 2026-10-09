'use client';

import React, { useState } from 'react';
import { FileText, Copy, Check, Download, ShieldCheck } from 'lucide-react';
import { AdBannerSlot } from '@/components/AdBannerSlot';

export interface PlantillaItem {
  id: string;
  title: string;
  category: string;
  description: string;
  content: string;
}

export default function PlantillasClient({ plantillas }: { plantillas: PlantillaItem[] }) {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleDownload = (id: string, title: string, text: string) => {
    const element = document.createElement('a');
    const file = new Blob([text], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `${id.toUpperCase()}_OFICIAL_PERU.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-8">
      {plantillas.map((plantilla, idx) => (
        <React.Fragment key={plantilla.id}>
          <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-4 border border-white/15 bg-gradient-to-b from-slate-900 to-[#0b0f19]">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold">
                  <FileText size={20} />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-amber-400 font-bold block">
                    {plantilla.category}
                  </span>
                  <h2 className="text-base sm:text-lg font-bold font-display text-white">
                    {plantilla.title}
                  </h2>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopy(plantilla.id, plantilla.content)}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-white/10 text-xs font-mono font-semibold text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedId === plantilla.id ? (
                    <>
                      <Check size={14} className="text-emerald-400" />
                      <span className="text-emerald-400">¡Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={14} />
                      <span>Copiar Texto</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => handleDownload(plantilla.id, plantilla.title, plantilla.content)}
                  className="px-3.5 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-xs font-mono font-bold text-amber-400 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Download size={14} />
                  <span>Descargar TXT</span>
                </button>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              {plantilla.description}
            </p>

            {/* Formatted Code / Text Preview */}
            <div className="relative">
              <pre className="p-4 sm:p-6 rounded-2xl bg-slate-950/90 border border-white/10 text-xs font-mono text-slate-300 overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-80 overflow-y-auto">
                {plantilla.content}
              </pre>
            </div>
          </div>

          {/* In-feed ad banner between templates */}
          {idx === 1 && <AdBannerSlot type="in-feed" className="my-6" />}
        </React.Fragment>
      ))}
    </div>
  );
}
