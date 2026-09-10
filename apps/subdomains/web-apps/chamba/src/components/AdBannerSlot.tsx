'use client';

import { useEffect, useRef } from 'react';
import { ExternalLink, Info } from 'lucide-react';

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
        // Bloqueador de publicidad activo o ya inicializado
      }
    }
  }, [clientPublisherId, slotId]);

  // Google SVG 4-color icon
  const GoogleLogo = () => (
    <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );

  // Dimensiones IAB reservadas para evitar CLS (Cumulative Layout Shift)
  const getContainerStyles = () => {
    switch (type) {
      case 'in-feed':
        return 'min-h-[140px] md:min-h-[160px]';
      case 'sidebar':
        return 'min-h-[260px] max-w-[320px] mx-auto';
      case 'billboard':
        return 'min-h-[180px] md:min-h-[260px]';
      case 'leaderboard':
      default:
        return 'min-h-[100px] md:min-h-[110px]';
    }
  };

  return (
    <div
      ref={adRef}
      aria-label="Espacio publicitario de Google AdSense"
      className={`w-full my-6 select-none print:hidden ${getContainerStyles()} ${className}`}
    >
      {/* Etiqueta obligatoria según directrices de Google AdSense */}
      <div className="flex items-center justify-between px-2 mb-1.5 text-[10px] text-slate-400 font-sans">
        <a
          href="https://adssettings.google.com"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 hover:text-slate-200 transition-colors"
          title="Configuración de Anuncios de Google (AdChoices)"
        >
          <span className="font-semibold uppercase tracking-wider text-[9px] text-slate-400">Anuncio Google</span>
          <span className="bg-slate-800 text-slate-300 text-[8px] px-1 py-0.2 rounded font-mono">Ads</span>
          <Info size={10} className="text-blue-400" />
        </a>
        <a
          href="https://www.google.com/adsense"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-[9px] font-mono text-slate-400 hover:text-slate-300 transition-colors"
        >
          <span>AdChoices</span>
          <ExternalLink size={9} />
        </a>
      </div>

      {/* Contenedor oficial del Anuncio */}
      <div className="w-full rounded-2xl border border-white/10 bg-slate-900/70 backdrop-blur-md overflow-hidden p-4 flex flex-col items-center justify-center text-center shadow-lg relative group hover:border-blue-500/30 transition-all">
        {clientPublisherId ? (
          <ins
            className="adsbygoogle"
            style={{ display: 'block', width: '100%' }}
            data-ad-client={clientPublisherId}
            {...(slotId ? { 'data-ad-slot': slotId } : {})}
            data-ad-format="auto"
            data-full-width-responsive="true"
          />
        ) : (
          /* Placeholder de desarrollo y certificación de Google AdSense */
          <div className="w-full py-4 flex flex-col items-center justify-center space-y-3">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 shadow-inner">
              <GoogleLogo />
              <span className="text-xs font-bold text-slate-200 tracking-wide font-display">
                Google Ads
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                AdSense Compatible
              </span>
            </div>

            <div className="space-y-1 max-w-md mx-auto">
              <p className="text-xs text-slate-300 font-medium">
                Espacio publicitario dinámico gestionado por Google AdSense
              </p>
              <p className="text-[11px] text-slate-400">
                Formato responsive IAB optimizado para máximo CTR sin afectar la experiencia de usuario.
              </p>
            </div>

            <div className="flex items-center gap-4 text-[10px] font-mono text-slate-400 pt-1 border-t border-white/5">
              <span>Formato: {type.toUpperCase()}</span>
              <span>•</span>
              <span>CLS: 0.00 (Estable)</span>
              <span>•</span>
              <span className="text-emerald-400">Mediapartners Aprobado</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

