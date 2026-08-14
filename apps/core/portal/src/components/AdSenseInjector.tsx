"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";

export default function AdSenseInjector({ adsenseId }: { adsenseId: string | null }) {
  const pathname = usePathname();

  if (!adsenseId) return null;

  // Evitar mostrar anuncios en la página principal o rutas base de idioma.
  // Ejemplos que coinciden: "/", "/es", "/en", "/es/", "/en/"
  const isLandingPage = pathname === "/" || /^\/[a-z]{2}\/?$/.test(pathname);

  if (isLandingPage) {
    return null; // No inyectar AdSense en la landing page principal
  }

  return (
    <Script
      id="adsense-script"
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseId}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}
