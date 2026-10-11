"use client";

import { useEffect } from "react";

interface GoogleAdSenseProps {
  clientId?: string;
}

/**
 * Google AdSense Script Loader
 * 
 * Injects Google AdSense client script in useEffect without the `data-nscript` attribute
 * that Next.js `<Script>` injects, preventing the Google AdSense warning:
 * "AdSense head tag doesn't support data-nscript attribute."
 * Also ensures 0 SSR hydration mismatches.
 */
export function GoogleAdSense({ clientId }: GoogleAdSenseProps) {
  useEffect(() => {
    if (!clientId || typeof window === "undefined") return;

    const cleanClientId = clientId.startsWith("ca-") ? clientId : `ca-${clientId}`;

    // Prevent duplicate script injection
    const existing = document.querySelector('script[src*="pagead2.googlesyndication.com"]');
    if (existing) return;

    try {
      const script = document.createElement("script");
      script.id = "google-adsense-script";
      script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${cleanClientId}`;
      script.async = true;
      script.crossOrigin = "anonymous";
      document.head.appendChild(script);
    } catch {
      // Ignore if document is unavailable or blocked by adblockers
    }
  }, [clientId]);

  return null;
}
