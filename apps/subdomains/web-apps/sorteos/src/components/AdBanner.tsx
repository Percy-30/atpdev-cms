"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Sparkles, Shield, ExternalLink } from 'lucide-react';
import { api, getToken } from '@/lib/api';

interface AdBannerProps {
  slot?: string;
  format?: 'horizontal' | 'rectangle' | 'responsive';
  className?: string;
}

export function AdBanner({ slot = '5414009811868137', format = 'horizontal', className = '' }: AdBannerProps) {
  const [isPro, setIsPro] = useState<boolean | null>(null);

  useEffect(() => {
    const checkProStatus = async () => {
      const token = getToken();
      if (!token) {
        setIsPro(false);
        return;
      }
      try {
        const res = await api<{ user: { plan?: string } }>('/api/v1/auth/me');
        const plan = res?.user?.plan || 'free';
        setIsPro(plan !== 'free');
      } catch {
        setIsPro(false);
      }
    };

    checkProStatus();
    window.addEventListener('auth-changed', checkProStatus);
    return () => window.removeEventListener('auth-changed', checkProStatus);
  }, []);

  // Si es usuario PRO, NO SE MUESTRA NINGÚN ANUNCIO (experiencia 100% limpia)
  if (isPro === true) {
    return null;
  }

  // Si aún está cargando la verificación, no mostramos nada para evitar parpadeo
  if (isPro === null) {
    return null;
  }

  // Banner para usuarios FREE o invitados
  return (
    <div className={`w-full my-6 p-4 rounded-2xl bg-gradient-to-r from-slate-100 to-slate-50 dark:from-white/[0.03] dark:to-white/[0.01] border border-slate-200/80 dark:border-white/10 text-center relative overflow-hidden group ${className}`}>
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 dark:text-zinc-500 font-bold">
          Publicidad
        </span>
        <Link
          href="/planes"
          className="inline-flex items-center gap-1 text-[11px] font-mono text-pink-600 dark:text-purple-400 hover:underline font-bold"
        >
          <Sparkles className="w-3 h-3" />
          <span>¿Quitar anuncios? Pásate a Pro</span>
        </Link>
      </div>

      {/* Contenedor del anuncio (AdSense o Banner Promocional) */}
      <div className="py-6 px-4 rounded-xl bg-white dark:bg-[#070a12] border border-dashed border-slate-300 dark:border-white/10 flex flex-col items-center justify-center gap-2">
        <ins
          className="adsbygoogle"
          style={{ display: 'block', minHeight: '90px', width: '100%' }}
          data-ad-client="ca-pub-5414009811868137"
          data-ad-slot={slot}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
        <div className="text-xs text-slate-500 dark:text-zinc-400 font-mono">
          Espacio publicitario para cuentas del Plan Gratuito
        </div>
      </div>
    </div>
  );
}

/**
 * Hook para saber si el usuario actual tiene plan PRO (sin anuncios)
 */
export function useIsPro() {
  const [isPro, setIsPro] = useState(false);

  useEffect(() => {
    const check = async () => {
      const token = getToken();
      if (!token) {
        setIsPro(false);
        return;
      }
      try {
        const res = await api<{ user: { plan?: string } }>('/api/v1/auth/me');
        setIsPro(res?.user?.plan !== 'free');
      } catch {
        setIsPro(false);
      }
    };
    check();
    window.addEventListener('auth-changed', check);
    return () => window.removeEventListener('auth-changed', check);
  }, []);

  return isPro;
}
