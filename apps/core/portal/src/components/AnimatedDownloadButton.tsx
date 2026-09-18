"use client";

import React, { useState } from "react";
import { Download, Check, Loader2, ArrowDownCircle } from "lucide-react";

interface AnimatedDownloadButtonProps {
  url: string;
  fileName?: string;
  type?: "apk" | "ipa" | "generic";
  defaultLabel?: string;
  className?: string;
  iconSize?: number;
}

const GooglePlay2022Icon = ({ size = 20 }: { size?: number }) => (
  <svg viewBox="0 0 512 512" width={size} height={size} fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
    <path fill="#00D2FF" d="M51.5 5.3C41.8 13.9 36 27.6 36 44.8v422.4c0 17.2 5.8 30.9 15.5 39.5L268 256 51.5 5.3z"/>
    <path fill="#00E676" d="M344.2 374.2 268 298l-216.5 210c8.2 8.7 20.3 12.5 32.8 5.3l260-139.1z"/>
    <path fill="#FF3D00" d="M344.2 137.8 84.3 0c-12.5-7.2-24.6-3.4-32.8 5.3L268 215.3l76.2-77.5z"/>
    <path fill="#FFC107" d="M466 230.2 344.2 137.8 268 256l76.2 118.2L466 281.8c14.6-8.4 14.6-43.2 0-51.6z"/>
  </svg>
);

const AppleStoreIcon = ({ size = 20 }: { size?: number }) => (
  <svg viewBox="0 0 384 512" width={size} height={size} fill="currentColor" className="flex-shrink-0 mb-0.5">
    <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/>
  </svg>
);

export function AnimatedDownloadButton({
  url,
  fileName,
  type = "apk",
  defaultLabel,
  className,
  iconSize = 22
}: AnimatedDownloadButtonProps) {
  const [downloadState, setDownloadState] = useState<"idle" | "preparing" | "downloading" | "done">("idle");
  const [progress, setProgress] = useState(0);

  const isApk = type === "apk" || url.toLowerCase().includes(".apk") || url.includes("/apks/");
  const isIpa = type === "ipa" || url.toLowerCase().includes(".ipa") || url.includes("/ipas/");

  const handleDownload = (e: React.MouseEvent) => {
    // Si no es archivo directo (es link de store de Google Play o App Store), dejamos la navegación estándar
    if (!isApk && !isIpa && !url.includes(".zip")) {
      return;
    }

    e.preventDefault();
    if (downloadState !== "idle") return;

    setDownloadState("preparing");
    setProgress(15);

    // Simulación progresiva fluida de animación de descarga antes de despachar el archivo
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + Math.floor(Math.random() * 20) + 10;
      });
    }, 180);

    setTimeout(() => {
      setDownloadState("downloading");
    }, 300);

    setTimeout(() => {
      clearInterval(interval);
      setProgress(100);
      setDownloadState("done");

      // Despachar la descarga directa
      const link = document.createElement("a");
      link.href = url;
      const targetName = fileName || url.split("/").pop() || (isApk ? "app-release.apk" : "app-release.ipa");
      link.setAttribute("download", targetName);
      link.setAttribute("target", "_blank");
      link.setAttribute("rel", "noopener noreferrer");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Regresar al estado inactivo después de 4 segundos
      setTimeout(() => {
        setDownloadState("idle");
        setProgress(0);
      }, 4000);
    }, 1400);
  };

  // Estilos y acentos dinámicos por tipo
  const accentBorder = isApk 
    ? "border-emerald-500/40 hover:border-emerald-400 shadow-emerald-950/40" 
    : isIpa 
    ? "border-sky-500/40 hover:border-sky-400 shadow-sky-950/40"
    : "border-indigo-500/40 hover:border-indigo-400 shadow-indigo-950/40";

  const accentBg = isApk
    ? "bg-[#0e1714] hover:bg-[#14231e]"
    : isIpa
    ? "bg-[#121620] hover:bg-[#191f2d]"
    : "bg-[#151324] hover:bg-[#1c1a30]";

  const defaultButtonLabel = defaultLabel || (
    isApk ? "Descargar APK Directo" : isIpa ? "Descargar IPA Directo (iOS)" : "Descargar Archivo"
  );

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleDownload}
      className={`relative overflow-hidden flex flex-col items-center justify-center text-white rounded-2xl font-bold transition-all duration-300 magnetic-element hover:scale-[1.02] shadow-xl group neon-border ${accentBorder} ${accentBg} ${className || "w-full px-6 py-4"}`}
    >
      {/* Barra de progreso de descarga animada dentro del botón */}
      {downloadState !== "idle" && (
        <div 
          className={`absolute inset-0 transition-all duration-200 opacity-25 pointer-events-none ${
            isApk ? "bg-emerald-500" : isIpa ? "bg-sky-500" : "bg-indigo-500"
          }`}
          style={{ width: `${progress}%` }}
        />
      )}

      <div className="flex items-center justify-center gap-3 relative z-10">
        {downloadState === "idle" && (
          <>
            {isApk ? (
              <GooglePlay2022Icon size={iconSize} />
            ) : isIpa ? (
              <AppleStoreIcon size={iconSize} />
            ) : (
              <Download size={iconSize} className="text-white" />
            )}
            <span className="text-base tracking-wide">{defaultButtonLabel}</span>
          </>
        )}

        {downloadState === "preparing" && (
          <>
            <Loader2 size={iconSize} className="animate-spin text-emerald-400" />
            <span className="text-base tracking-wide">Preparando archivo...</span>
          </>
        )}

        {downloadState === "downloading" && (
          <>
            <ArrowDownCircle size={iconSize} className="animate-bounce text-cyan-300" />
            <span className="text-base tracking-wide flex items-center gap-2">
              Descargando... <span className="font-mono text-sm bg-white/10 px-2 py-0.5 rounded-md">{progress}%</span>
            </span>
          </>
        )}

        {downloadState === "done" && (
          <>
            <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-400 flex items-center justify-center text-emerald-400">
              <Check size={15} />
            </div>
            <span className="text-emerald-300 text-sm sm:text-base font-bold">
              ¡Descarga iniciada con éxito!
            </span>
          </>
        )}
      </div>
    </a>
  );
}
