"use client";

import { useEffect } from "react";

export function AdSenseBanner({ adsenseId, slot }: { adsenseId?: string | null; slot?: string }) {
  useEffect(() => {
    try {
      if (typeof window !== "undefined" && adsenseId) {
        ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
      }
    } catch (e) {
      console.error("AdSense banner push error", e);
    }
  }, [adsenseId]);

  if (!adsenseId) return null;

  return (
    <div className="my-8 w-full flex flex-col items-center justify-center min-h-[90px] bg-white/5 border border-white/10 rounded-2xl p-4 overflow-hidden shadow-inner">
      <span className="text-[10px] uppercase font-bold text-gray-500 tracking-widest mb-2">Publicidad</span>
      <ins
        className="adsbygoogle"
        style={{ display: "block", textAlign: "center", width: "100%" }}
        data-ad-client={adsenseId}
        data-ad-slot={slot || "auto"}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
