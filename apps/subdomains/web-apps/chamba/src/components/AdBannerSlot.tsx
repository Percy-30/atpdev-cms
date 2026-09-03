'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

export type AdSlotType = 'leaderboard' | 'in-feed' | 'sidebar' | 'billboard';

interface AdBannerSlotProps {
  type: AdSlotType;
  slotId?: string;
  className?: string;
}

export function AdBannerSlot({ type, slotId, className = '' }: AdBannerSlotProps) {
  const adRef = useRef<HTMLDivElement>(null);
  const clientPublisherId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

  useEffect(() => {
    if (clientPublisherId && slotId && typeof window !== 'undefined') {
      try {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      } catch (err) {
        // Ignore adblocker errors
      }
    }
  }, [clientPublisherId, slotId]);

  // Si no hay Google AdSense configurado, mostramos el banner premium de captación con alto CTR
  if (!clientPublisherId || !slotId) {
    if (type === 'in-feed') {
      return (
        <div className={`relative overflow-hidden rounded-2xl border border-emerald-500/20 bg-gradient-to-r from-emerald-950/30 via-slate-900/60 to-cyan-950/30 p-5 backdrop-blur-md transition-all hover:border-emerald-500/40 shadow-lg ${className}`}>
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 rounded-md bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-400 border border-emerald-500/20">
              <Sparkles size={11} /> ANUNCIO PATROCINADO
            </span>
            <span className="text-[11px] text-slate-400 font-mono">Red de Talentos Perú</span>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h4 className="text-base font-bold text-white mb-1 flex items-center gap-2">
                ¿Tu empresa o institución busca talento calificado?
                <ShieldCheck size={16} className="text-emerald-400 shrink-0" />
              </h4>
              <p className="text-xs text-slate-300">
                Publica convocatorias con verificación RUC instantánea y alcance directo a más de 50,000 profesionales.
              </p>
            </div>
            <Link
              href="https://atpdev.dev"
              target="_blank"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-500 px-4 py-2.5 text-xs font-bold text-slate-950 transition-all hover:bg-emerald-400 hover:shadow-emerald-500/20 shrink-0"
            >
              Publicar Convocatoria
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      );
    }

    if (type === 'sidebar') {
      return (
        <div className={`relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 p-5 text-center backdrop-blur-md shadow-lg ${className}`}>
          <span className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-3">
            Publicidad Oficial
          </span>
          <div className="rounded-xl border border-dashed border-slate-700 bg-slate-950/60 p-4 mb-3">
            <div className="w-10 h-10 mx-auto mb-2 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 border border-emerald-500/20">
              <Sparkles size={20} />
            </div>
            <p className="text-xs font-bold text-slate-200 mb-1">Prepara tu Postulación CAS</p>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Descarga los anexos de SERVIR y evalúa tu CV con nuestra IA antes de postular.
            </p>
          </div>
          <Link
            href="/simulador-entrevista-ia"
            className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition-colors"
          >
            Probar Simulador IA
            <ArrowRight size={13} />
          </Link>
        </div>
      );
    }

    // Leaderboard & Billboard
    return (
      <div className={`w-full my-4 flex flex-col items-center justify-center overflow-hidden rounded-xl border border-slate-800/80 bg-slate-900/40 p-3 backdrop-blur-sm ${className}`}>
        <span className="text-[9px] font-mono tracking-widest text-slate-400 uppercase mb-1">
          Espacio Patrocinado
        </span>
        <div className="flex flex-wrap items-center justify-center gap-3 text-center py-2">
          <p className="text-xs text-slate-300 font-medium">
            🎯 <span className="text-white font-semibold">chamba pro</span> — Más de 15,000 vacantes vigentes en SERVIR, ONPE, SUNAT y Poder Judicial.
          </p>
          <Link
            href="/calculadora-sueldo"
            className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 hover:text-emerald-300 hover:underline"
          >
            Calcular Sueldo Neto CAS <ArrowRight size={12} />
          </Link>
        </div>
      </div>
    );
  }

  // Si Google AdSense está activo, inyectar el código estándar de Google
  return (
    <div ref={adRef} className={`w-full my-4 text-center overflow-hidden ${className}`}>
      <span className="block text-[9px] font-mono tracking-widest text-slate-400 uppercase mb-1">
        Publicidad
      </span>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client={clientPublisherId}
        data-ad-slot={slotId}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
