'use client';

import { useState, useEffect } from 'react';
import { X, Info, ExternalLink } from 'lucide-react';

interface AdLateralRailProps {
  leftSlotId?: string;
  rightSlotId?: string;
}

export function AdLateralRail({ leftSlotId, rightSlotId }: AdLateralRailProps) {
  const [showLeft, setShowLeft] = useState(true);
  const [showRight, setShowRight] = useState(true);
  const clientPublisherId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

  useEffect(() => {
    if (clientPublisherId && typeof window !== 'undefined') {
      try {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      } catch (err) {
        // Ignorar bloqueadores de anuncios
      }
    }
  }, [clientPublisherId, leftSlotId, rightSlotId]);

  return (
    <>
      {/* Carril Lateral Izquierdo (Skyscraper 120x600) — Pantallas desktop (>= 1420px) */}
      {showLeft && (
        <aside
          aria-label="Anuncio publicitario de Google lateral izquierdo"
          className="fixed left-1.5 2xl:left-3 top-28 z-30 hidden min-[1420px]:flex flex-col w-[116px] 2xl:w-[124px] print:hidden animate-fade-in select-none"
        >
          {/* Header oficial Google AdSense con botón de cierre */}
          <div className="flex items-center justify-between px-1 py-1 text-[9px] font-sans text-slate-400">
            <a
              href="https://adssettings.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-slate-200 transition-colors"
              title="Información de Anuncios de Google (AdChoices)"
            >
              <span>Anuncio</span>
              <span className="text-[8px] bg-slate-800 text-slate-300 px-1 py-0.5 rounded font-mono">Google</span>
              <Info size={9} className="text-blue-400" />
            </a>
            <button
              onClick={() => setShowLeft(false)}
              title="Ocultar anuncio"
              className="text-slate-500 hover:text-slate-300 transition-colors p-0.5 rounded cursor-pointer"
            >
              <X size={11} />
            </button>
          </div>

          {/* Contenedor Oficial del Skyscraper (AdSense 120x600) */}
          <div className="w-[116px] 2xl:w-[124px] min-h-[560px] rounded-2xl border border-white/10 bg-slate-900/90 backdrop-blur-md p-2 flex flex-col justify-between text-center shadow-2xl relative overflow-hidden group hover:border-blue-500/40 transition-all">
            {clientPublisherId ? (
              <ins
                className="adsbygoogle"
                style={{ display: 'inline-block', width: '120px', height: '600px' }}
                data-ad-client={clientPublisherId}
                {...(leftSlotId ? { 'data-ad-slot': leftSlotId } : { 'data-ad-format': 'vertical', 'data-full-width-responsive': 'true' })}
              />
            ) : (
              <div className="flex flex-col justify-between h-full py-3 space-y-4">
                <div className="space-y-3">
                  {/* Google 4-Color Logo SVG */}
                  <div className="w-10 h-10 mx-auto rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shadow-inner">
                    <svg className="w-6 h-6" viewBox="0 0 24 24">
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
                  </div>

                  <div className="space-y-1">
                    <span className="inline-block px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 font-mono text-[9px] font-bold border border-blue-500/20">
                      GOOGLE ADS
                    </span>
                    <h4 className="text-xs font-bold text-white font-display leading-tight">
                      Espacio Publicitario
                    </h4>
                    <p className="text-[10px] text-slate-400 leading-snug">
                      Formato Skyscraper Vertical (120 × 600 px)
                    </p>
                  </div>
                </div>

                <div className="p-2 rounded-xl bg-slate-950/60 border border-white/5 space-y-2">
                  <div className="flex items-center justify-center gap-1 text-[9px] font-mono text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>AdSense Listo</span>
                  </div>
                  <p className="text-[9px] text-slate-400 leading-tight">
                    Anuncio dinámico gestionado por Google
                  </p>
                </div>

                <div className="space-y-1 pt-2 border-t border-white/5">
                  <a
                    href="https://www.google.com/adsense"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[9px] font-mono text-slate-500 hover:text-slate-300 flex items-center justify-center gap-1"
                  >
                    <span>AdChoices</span>
                    <ExternalLink size={8} />
                  </a>
                </div>
              </div>
            )}
          </div>
        </aside>
      )}

      {/* Carril Lateral Derecho (Skyscraper 120x600) — Pantallas desktop (>= 1420px) */}
      {showRight && (
        <aside
          aria-label="Anuncio publicitario de Google lateral derecho"
          className="fixed right-1.5 2xl:right-3 top-28 z-30 hidden min-[1420px]:flex flex-col w-[116px] 2xl:w-[124px] print:hidden animate-fade-in select-none"
        >
          {/* Header oficial Google AdSense con botón de cierre */}
          <div className="flex items-center justify-between px-1 py-1 text-[9px] font-sans text-slate-400">
            <a
              href="https://adssettings.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 hover:text-slate-200 transition-colors"
              title="Información de Anuncios de Google (AdChoices)"
            >
              <span>Anuncio</span>
              <span className="text-[8px] bg-slate-800 text-slate-300 px-1 py-0.5 rounded font-mono">Google</span>
              <Info size={9} className="text-blue-400" />
            </a>
            <button
              onClick={() => setShowRight(false)}
              title="Ocultar anuncio"
              className="text-slate-500 hover:text-slate-300 transition-colors p-0.5 rounded cursor-pointer"
            >
              <X size={11} />
            </button>
          </div>

          {/* Contenedor Oficial del Skyscraper (AdSense 120x600) */}
          <div className="w-[116px] 2xl:w-[124px] min-h-[560px] rounded-2xl border border-white/10 bg-slate-900/90 backdrop-blur-md p-2 flex flex-col justify-between text-center shadow-2xl relative overflow-hidden group hover:border-blue-500/40 transition-all">
            {clientPublisherId ? (
              <ins
                className="adsbygoogle"
                style={{ display: 'inline-block', width: '120px', height: '600px' }}
                data-ad-client={clientPublisherId}
                {...(rightSlotId ? { 'data-ad-slot': rightSlotId } : { 'data-ad-format': 'vertical', 'data-full-width-responsive': 'true' })}
              />
            ) : (
              <div className="flex flex-col justify-between h-full py-3 space-y-4">
                <div className="space-y-3">
                  {/* Google 4-Color Logo SVG */}
                  <div className="w-10 h-10 mx-auto rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shadow-inner">
                    <svg className="w-6 h-6" viewBox="0 0 24 24">
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
                  </div>

                  <div className="space-y-1">
                    <span className="inline-block px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 font-mono text-[9px] font-bold border border-blue-500/20">
                      GOOGLE ADS
                    </span>
                    <h4 className="text-xs font-bold text-white font-display leading-tight">
                      Espacio Publicitario
                    </h4>
                    <p className="text-[10px] text-slate-400 leading-snug">
                      Formato Skyscraper Vertical (120 × 600 px)
                    </p>
                  </div>
                </div>

                <div className="p-2 rounded-xl bg-slate-950/60 border border-white/5 space-y-2">
                  <div className="flex items-center justify-center gap-1 text-[9px] font-mono text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>AdSense Listo</span>
                  </div>
                  <p className="text-[9px] text-slate-400 leading-tight">
                    Anuncio dinámico gestionado por Google
                  </p>
                </div>

                <div className="space-y-1 pt-2 border-t border-white/5">
                  <a
                    href="https://www.google.com/adsense"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[9px] font-mono text-slate-500 hover:text-slate-300 flex items-center justify-center gap-1"
                  >
                    <span>AdChoices</span>
                    <ExternalLink size={8} />
                  </a>
                </div>
              </div>
            )}
          </div>
        </aside>
      )}
    </>
  );
}
