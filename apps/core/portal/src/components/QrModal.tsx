"use client";

import React, { useState } from "react";
import { X, Copy, Check, QrCode, Smartphone, Download, Share2, Loader2 } from "lucide-react";
import { AnimatedDownloadButton } from "./AnimatedDownloadButton";

interface QrModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  url: string;
}

export function QrModal({ isOpen, onClose, title, url }: QrModalProps) {
  const [copied, setCopied] = useState(false);
  const [isDownloadingImage, setIsDownloadingImage] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ecc=H (High Error Correction: tolera hasta 30% de oclusión central sin perder lectura)
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=480x480&data=${encodeURIComponent(url)}&ecc=H&color=ffffff&bgcolor=0e1017`;

  // Renderiza el canvas con el QR y el badge central de ATP DEV para descargar como PNG en alta resolución
  const generateQrCanvas = async (): Promise<HTMLCanvasElement | null> => {
    const canvas = document.createElement("canvas");
    canvas.width = 640;
    canvas.height = 740;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    // 1. Fondo elegante Glassmorphic oscuro
    ctx.fillStyle = "#0a0d14";
    ctx.fillRect(0, 0, 640, 740);

    // Borde Neón exterior
    ctx.strokeStyle = "rgba(16, 185, 129, 0.3)";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.roundRect(16, 16, 608, 708, 28);
    ctx.stroke();

    // 2. Cargar y dibujar el código QR
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = qrImageUrl;
    });
    ctx.drawImage(img, 70, 70, 500, 500);

    // 3. Insignia / Marca Central de ATP DEV en el QR
    const badgeW = 148;
    const badgeH = 64;
    const badgeX = (640 - badgeW) / 2;
    const badgeY = 70 + (500 - badgeH) / 2;

    // Fondo del badge con esquinas redondeadas
    ctx.fillStyle = "#0b0c10";
    ctx.beginPath();
    ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 18);
    ctx.fill();

    // Borde Neón azul de la marca
    ctx.strokeStyle = "#3b82f6";
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 18);
    ctx.stroke();

    // Símbolo de terminal >_
    ctx.font = "bold 30px monospace";
    ctx.fillStyle = "#3b82f6";
    ctx.fillText(">_", badgeX + 20, badgeY + 43);

    // Texto de marca ATP
    ctx.font = "900 24px 'Space Grotesk', system-ui, sans-serif";
    ctx.fillStyle = "#ffffff";
    ctx.fillText("ATP", badgeX + 70, badgeY + 41);

    // 4. Encabezado y Pie de página descriptivo
    ctx.textAlign = "center";
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 22px system-ui, sans-serif";
    ctx.fillText(title, 320, 620);

    ctx.fillStyle = "#10b981";
    ctx.font = "600 15px monospace";
    ctx.fillText("⚡ Escanea para Instalar • atpdev.dev", 320, 655);

    return canvas;
  };

  // Descargar imagen PNG del QR con la marca
  const handleDownloadQrImage = async () => {
    setIsDownloadingImage(true);
    try {
      const canvas = await generateQrCanvas();
      if (!canvas) return;
      const dataUrl = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      const cleanTitle = title.replace(/[^a-zA-Z0-9_-]/g, "_");
      a.download = `QR_${cleanTitle}_ATPDEV.png`;
      a.href = dataUrl;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (e) {
      console.error("Error al descargar QR:", e);
    } finally {
      setIsDownloadingImage(false);
    }
  };

  // Compartir QR directamente mediante Web Share API
  const handleShareQr = async () => {
    setIsSharing(true);
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        try {
          const canvas = await generateQrCanvas();
          if (canvas) {
            canvas.toBlob(async (blob) => {
              if (blob) {
                const file = new File([blob], `QR_${title.replace(/[^a-zA-Z0-9_-]/g, "_")}.png`, { type: "image/png" });
                if (navigator.canShare && navigator.canShare({ files: [file] })) {
                  await navigator.share({
                    title: `Descargar ${title} - ATP DEV`,
                    text: `Escanea o descarga ${title} desde ATP DEV:`,
                    url: url,
                    files: [file]
                  });
                  return;
                }
              }
              // Si no puede adjuntar archivo, comparte link con título
              await navigator.share({
                title: `Descargar ${title} - ATP DEV`,
                text: `Instala ${title} desde este enlace oficial:`,
                url: url
              });
            }, "image/png");
            return;
          }
        } catch (e) {
          // Fallback a share de texto
          await navigator.share({
            title: `Descargar ${title} - ATP DEV`,
            text: `Instala ${title} desde este enlace:`,
            url: url
          });
          return;
        }
      }
      // Si el navegador no soporta Web Share API, copiamos el link
      handleCopy();
    } catch (e) {
      console.error("Error al compartir:", e);
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-md bg-[#0e1017] border border-emerald-500/30 rounded-3xl p-6 shadow-2xl shadow-emerald-950/50 relative overflow-hidden neon-border"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Glow Accents */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-sky-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Modal Header */}
        <div className="flex items-center justify-between mb-5 pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <QrCode size={20} />
            </div>
            <div>
              <h3 className="font-bold text-white text-base leading-snug">Escanear para Descargar</h3>
              <p className="text-xs text-gray-400 truncate max-w-[200px]">{title}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full bg-white/5 hover:bg-white/15 text-gray-400 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* QR Code Container con Insignia Central ATP DEV */}
        <div className="flex flex-col items-center justify-center my-3">
          <div className="p-4 bg-[#141824] border border-white/15 rounded-3xl shadow-inner relative group">
            <div className="relative overflow-hidden rounded-2xl">
              <img 
                src={qrImageUrl} 
                alt={`QR Code para ${title}`}
                width={240}
                height={240}
                className="rounded-2xl transition-transform duration-300 group-hover:scale-[1.02]"
              />

              {/* Insignia Central ATP DEV (Con tolerancia de corrección de error ecc=H) */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="bg-[#0b0c10] px-3.5 py-1.5 rounded-xl border-2 border-blue-500/80 shadow-[0_0_20px_rgba(59,130,246,0.6)] flex items-center gap-1.5 backdrop-blur-md">
                  <span className="font-mono text-sm font-black text-blue-400">&gt;_</span>
                  <span className="text-xs font-black tracking-widest text-white">ATP</span>
                </div>
              </div>
            </div>

            <div className="absolute inset-0 rounded-3xl border-2 border-emerald-500/20 pointer-events-none" />
          </div>

          <p className="text-xs text-gray-400 mt-3 text-center flex items-center gap-1.5">
            <Smartphone size={14} className="text-emerald-400" />
            Apunta con la cámara de tu teléfono para instalar la App
          </p>

          {/* Botones Rápidos de Acción: Descargar Imagen QR y Compartir QR */}
          <div className="flex items-center gap-2.5 mt-4 w-full">
            <button
              onClick={handleDownloadQrImage}
              disabled={isDownloadingImage}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-all border border-white/15 hover:border-emerald-500/50 hover:text-emerald-300 active:scale-95 shadow-sm"
              title="Descargar imagen PNG del QR en alta resolución con la marca ATP"
            >
              {isDownloadingImage ? (
                <Loader2 size={14} className="animate-spin text-emerald-400" />
              ) : (
                <Download size={14} className="text-emerald-400" />
              )}
              <span>{isDownloadingImage ? "Generando..." : "Descargar QR"}</span>
            </button>

            <button
              onClick={handleShareQr}
              disabled={isSharing}
              className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 bg-gradient-to-r from-blue-600/80 to-indigo-600/80 hover:from-blue-600 hover:to-indigo-600 text-white rounded-xl text-xs font-bold transition-all border border-blue-400/30 active:scale-95 shadow-md shadow-blue-600/20"
              title="Compartir imagen y enlace del QR en WhatsApp, redes o contactos"
            >
              {isSharing ? (
                <Loader2 size={14} className="animate-spin text-white" />
              ) : (
                <Share2 size={14} className="text-white" />
              )}
              <span>{isSharing ? "Compartiendo..." : "Compartir QR"}</span>
            </button>
          </div>
        </div>

        {/* Enlace y Descarga Directa */}
        <div className="mt-4 pt-4 border-t border-white/10 space-y-3">
          <div className="flex items-center gap-2 p-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-gray-300">
            <span className="truncate flex-1 font-mono text-[11px]">{url}</span>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg font-bold transition-all flex-shrink-0 text-xs"
            >
              {copied ? (
                <><Check size={13} className="text-emerald-400" /> Copiado</>
              ) : (
                <><Copy size={13} /> Copiar</>
              )}
            </button>
          </div>

          {(url.includes(".apk") || url.includes("/apks/") || url.includes(".ipa") || url.includes("/ipas/")) && (
            <AnimatedDownloadButton
              url={url}
              defaultLabel={url.includes(".apk") || url.includes("/apks/") ? "Descargar APK en este dispositivo" : "Descargar IPA en este dispositivo"}
              className="!py-3 !text-xs !rounded-xl"
              iconSize={16}
            />
          )}
        </div>
      </div>
    </div>
  );
}

