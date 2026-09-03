'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Cookie, ShieldCheck, Check, X } from 'lucide-react';

export function CookieConsentBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem('chamba_cookie_consent');
      if (!consent) {
        // Mostrar con un leve delay estético para no afectar el First Contentful Paint
        const timer = setTimeout(() => setShow(true), 1200);
        return () => clearTimeout(timer);
      }
    } catch (e) {
      // Ignore localStorage unavailable
    }
  }, []);

  const handleAccept = (type: 'all' | 'essential') => {
    try {
      localStorage.setItem('chamba_cookie_consent', type);
      setShow(false);
    } catch (e) {
      setShow(false);
    }
  };

  if (!show) return null;

  return (
    <aside aria-label="Aviso de Cookies y Privacidad" className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className="rounded-3xl border border-emerald-500/30 bg-[#0b0f19]/95 backdrop-blur-xl p-5 shadow-[0_10px_40px_rgba(0,0,0,0.8)] space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
            <Cookie size={18} />
          </div>
          <div className="space-y-1">
            <h4 className="text-xs font-bold text-white flex items-center gap-1.5 font-display">
              <span>Aviso de Privacidad & Cookies</span>
              <ShieldCheck size={13} className="text-emerald-400" />
            </h4>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Utilizamos cookies técnicas y de publicidad (Google AdSense) para optimizar tu experiencia y mantener la plataforma 100% gratuita. Puedes consultar nuestra{' '}
              <Link href="/politica-de-privacidad" className="text-emerald-400 font-semibold hover:underline">
                Política de Privacidad
              </Link>.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-1">
          <button
            onClick={() => handleAccept('essential')}
            className="px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-[11px] font-semibold text-slate-300 hover:text-white transition-colors"
          >
            Solo esenciales
          </button>
          <button
            onClick={() => handleAccept('all')}
            className="px-4 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-[11px] font-bold transition-all shadow-md shadow-emerald-500/20 flex items-center gap-1"
          >
            <Check size={12} />
            <span>Aceptar todas</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
