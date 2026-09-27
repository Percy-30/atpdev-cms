'use client';

import { useEffect, useRef } from 'react';

export type AdSlotType = 'leaderboard' | 'in-feed' | 'sidebar' | 'billboard';

interface AdBannerSlotProps {
  type: AdSlotType;
  slotId?: string;
  className?: string;
}

export function AdBannerSlot({ type, slotId, className = '' }: AdBannerSlotProps) {
  const adRef = useRef<HTMLDivElement>(null);
  const clientPublisherId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || 'ca-pub-5414009811868137';

  useEffect(() => {
    if (clientPublisherId && typeof window !== 'undefined') {
      try {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      } catch (err) {
        // Bloqueador de publicidad activo o no disponible
      }
    }
  }, [clientPublisherId, slotId]);

  return (
    <div
      ref={adRef}
      className={`w-full my-4 flex justify-center items-center overflow-hidden print:hidden ${className}`}
      aria-label="Espacio de anuncio oficial"
    >
      {/* Contenedor oficial AdSense limpio sin bordes ni textos simulados */}
      <ins
        className="adsbygoogle"
        style={{ display: 'block', width: '100%', minHeight: type === 'billboard' ? '250px' : type === 'leaderboard' ? '90px' : '100px' }}
        data-ad-client={clientPublisherId}
        {...(slotId ? { 'data-ad-slot': slotId } : {})}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
