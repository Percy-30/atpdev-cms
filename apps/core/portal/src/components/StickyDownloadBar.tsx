"use client";

import React, { useState, useEffect } from "react";
import { Download, QrCode, ArrowUp } from "lucide-react";

interface StickyDownloadBarProps {
  title: string;
  playstore?: string | null;
  appstore?: string | null;
  onOpenQr: () => void;
}

export function StickyDownloadBar({
  title,
  playstore,
  appstore,
  onOpenQr
}: StickyDownloadBarProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!isVisible || (!playstore && !appstore)) return null;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-2xl bg-[#0e1017]/90 backdrop-blur-xl border border-white/15 p-3 px-6 rounded-full shadow-2xl flex items-center justify-between gap-4 animate-in slide-in-from-bottom-6 duration-300 neon-border">
      <div className="hidden sm:flex items-center gap-3 overflow-hidden">
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping flex-shrink-0" />
        <span className="text-sm font-bold text-white truncate max-w-[200px]">{title}</span>
      </div>

      <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
        {playstore && (
          <a
            href={playstore}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full text-xs font-bold transition-all shadow-md shadow-emerald-600/20 magnetic-element"
          >
            <Download size={14} /> Android APK
          </a>
        )}

        {appstore && (
          <a
            href={appstore}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-full text-xs font-bold transition-all shadow-md shadow-sky-600/20 magnetic-element"
          >
            <Download size={14} /> iOS IPA
          </a>
        )}

        <button
          onClick={onOpenQr}
          className="flex items-center gap-1.5 px-3 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full text-xs font-bold transition-all"
          title="Ver Código QR"
        >
          <QrCode size={14} />
        </button>

        <button
          onClick={scrollToTop}
          className="p-2 bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white rounded-full text-xs transition-all"
          title="Volver Arriba"
        >
          <ArrowUp size={14} />
        </button>
      </div>
    </div>
  );
}
