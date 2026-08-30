"use client";

import React, { useState, useEffect } from "react";
import { Download, QrCode, ArrowUp } from "lucide-react";

interface StickyDownloadBarProps {
  title: string;
  playstore?: string | null;
  appstore?: string | null;
  onOpenQr: () => void;
}

const GooglePlay2022Icon = ({ size = 16 }: { size?: number }) => (
  <svg viewBox="0 0 512 512" width={size} height={size} fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
    <path fill="#00D2FF" d="M51.5 5.3C41.8 13.9 36 27.6 36 44.8v422.4c0 17.2 5.8 30.9 15.5 39.5L268 256 51.5 5.3z"/>
    <path fill="#00E676" d="M344.2 374.2 268 298l-216.5 210c8.2 8.7 20.3 12.5 32.8 5.3l260-139.1z"/>
    <path fill="#FF3D00" d="M344.2 137.8 84.3 0c-12.5-7.2-24.6-3.4-32.8 5.3L268 215.3l76.2-77.5z"/>
    <path fill="#FFC107" d="M466 230.2 344.2 137.8 268 256l76.2 118.2L466 281.8c14.6-8.4 14.6-43.2 0-51.6z"/>
  </svg>
);

const AppleIcon = ({ size = 14 }: { size?: number }) => (
  <svg viewBox="0 0 384 512" width={size} height={size} fill="currentColor" className="flex-shrink-0 mb-0.5">
    <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
  </svg>
);

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
            {playstore.toLowerCase().includes('.apk') || playstore.includes('/apks/') ? (
              <><Download size={14} /> Android APK</>
            ) : (
              <><GooglePlay2022Icon size={16} /> Play Store</>
            )}
          </a>
        )}

        {appstore && (
          <a
            href={appstore}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-full text-xs font-bold transition-all shadow-md shadow-sky-600/20 magnetic-element"
          >
            {appstore.toLowerCase().includes('.ipa') || appstore.includes('/ipas/') ? (
              <><AppleIcon size={14} /> iOS IPA</>
            ) : (
              <><AppleIcon size={14} /> App Store</>
            )}
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
