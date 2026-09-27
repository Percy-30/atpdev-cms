'use client';

import { useState, useEffect } from 'react';

interface AdLateralRailProps {
  leftSlotId?: string;
  rightSlotId?: string;
}

export function AdLateralRail({ leftSlotId, rightSlotId }: AdLateralRailProps) {
  const [show, setShow] = useState(false);
  const clientPublisherId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || 'ca-pub-5414009811868137';

  useEffect(() => {
    // Solo mostrar el carril lateral si existen slots configurados explícitamente
    if (clientPublisherId && (leftSlotId || rightSlotId) && typeof window !== 'undefined') {
      setShow(true);
      try {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      } catch (err) {
        // Ignorar bloqueadores de anuncios
      }
    }
  }, [clientPublisherId, leftSlotId, rightSlotId]);

  if (!show || (!leftSlotId && !rightSlotId)) {
    return null;
  }

  return (
    <>
      {leftSlotId && (
        <aside
          aria-label="Anuncio lateral izquierdo"
          className="fixed left-2 top-28 z-30 hidden min-[1440px]:block w-[120px] print:hidden"
        >
          <ins
            className="adsbygoogle"
            style={{ display: 'inline-block', width: '120px', height: '600px' }}
            data-ad-client={clientPublisherId}
            data-ad-slot={leftSlotId}
          />
        </aside>
      )}

      {rightSlotId && (
        <aside
          aria-label="Anuncio lateral derecho"
          className="fixed right-2 top-28 z-30 hidden min-[1440px]:block w-[120px] print:hidden"
        >
          <ins
            className="adsbygoogle"
            style={{ display: 'inline-block', width: '120px', height: '600px' }}
            data-ad-client={clientPublisherId}
            data-ad-slot={rightSlotId}
          />
        </aside>
      )}
    </>
  );
}
