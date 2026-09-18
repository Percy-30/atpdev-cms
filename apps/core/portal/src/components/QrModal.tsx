"use client";

import React, { useState } from "react";
import { X, Copy, Check, QrCode, Smartphone, Download, Share2, Loader2 } from "lucide-react";
import { AnimatedDownloadButton } from "./AnimatedDownloadButton";

interface QrModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  url: string;
  appImage?: string;
}

// Dibuja rectángulos redondeados con compatibilidad hacia atrás
function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  if (typeof ctx.roundRect === "function") {
    ctx.roundRect(x, y, w, h, r);
  } else {
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
  }
}

// Carga asíncrona de imágenes para Canvas con timeout de seguridad
function loadImage(src: string, timeoutMs: number = 4000): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    let timer: ReturnType<typeof setTimeout> | null = null;
    if (timeoutMs > 0) {
      timer = setTimeout(() => {
        reject(new Error("Image load timeout"));
      }, timeoutMs);
    }
    img.onload = () => {
      if (timer) clearTimeout(timer);
      resolve(img);
    };
    img.onerror = (e) => {
      if (timer) clearTimeout(timer);
      reject(e);
    };
    img.src = src;
  });
}

// Dibuja la insignia central de la marca ATP DEV
function drawAtpBrandBadge(ctx: CanvasRenderingContext2D, centerX: number, centerY: number) {
  const badgeW = 148;
  const badgeH = 64;
  const badgeX = centerX - badgeW / 2;
  const badgeY = centerY - badgeH / 2;

  ctx.fillStyle = "#0b0c10";
  ctx.beginPath();
  drawRoundedRect(ctx, badgeX, badgeY, badgeW, badgeH, 18);
  ctx.fill();

  ctx.strokeStyle = "#3b82f6";
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  drawRoundedRect(ctx, badgeX, badgeY, badgeW, badgeH, 18);
  ctx.stroke();

  ctx.textAlign = "left";
  ctx.font = "bold 30px monospace";
  ctx.fillStyle = "#3b82f6";
  ctx.fillText(">_", badgeX + 20, badgeY + 43);

  ctx.font = "900 24px 'Space Grotesk', system-ui, -apple-system, sans-serif";
  ctx.fillStyle = "#ffffff";
  ctx.fillText("ATP", badgeX + 70, badgeY + 41);
}

// Dibuja el ícono personalizado del aplicativo con marco neón y micro-sello ATP
function drawAppIconBadge(
  ctx: CanvasRenderingContext2D,
  appImg: HTMLImageElement,
  centerX: number,
  centerY: number
) {
  const containerSize = 100;
  const half = containerSize / 2;
  const containerX = centerX - half;
  const containerY = centerY - half;

  // Fondo contenedor con sombra sutil
  ctx.fillStyle = "#0b0c10";
  ctx.beginPath();
  drawRoundedRect(ctx, containerX, containerY, containerSize, containerSize, 22);
  ctx.fill();

  // Borde esmeralda neón
  ctx.strokeStyle = "#10b981";
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  drawRoundedRect(ctx, containerX, containerY, containerSize, containerSize, 22);
  ctx.stroke();

  // Recorte redondeado para la imagen de la app
  const imgSize = 88;
  const imgHalf = imgSize / 2;
  const imgX = centerX - imgHalf;
  const imgY = centerY - imgHalf;

  ctx.save();
  ctx.beginPath();
  drawRoundedRect(ctx, imgX, imgY, imgSize, imgSize, 18);
  ctx.clip();
  ctx.drawImage(appImg, imgX, imgY, imgSize, imgSize);
  ctx.restore();

  // Micro-sello ATP DEV en el borde inferior del ícono
  const pillW = 62;
  const pillH = 22;
  const pillX = centerX - pillW / 2;
  const pillY = containerY + containerSize - 11;

  ctx.fillStyle = "#07090e";
  ctx.beginPath();
  drawRoundedRect(ctx, pillX, pillY, pillW, pillH, 11);
  ctx.fill();

  ctx.strokeStyle = "#3b82f6";
  ctx.lineWidth = 2;
  ctx.beginPath();
  drawRoundedRect(ctx, pillX, pillY, pillW, pillH, 11);
  ctx.stroke();

  ctx.textAlign = "center";
  ctx.font = "bold 11px monospace";
  ctx.fillStyle = "#60a5fa";
  ctx.fillText(">_ ATP", centerX, pillY + 15);
}

export function QrModal({ isOpen, onClose, title, url, appImage }: QrModalProps) {
  const [copied, setCopied] = useState(false);
  const [imgError, setImgError] = useState(false);
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

  // Renderiza el canvas con el QR, el ícono personalizado del app y branding oficial ATP DEV
  const generateQrCanvas = async (): Promise<HTMLCanvasElement | null> => {
    const canvas = document.createElement("canvas");
    canvas.width = 640;
    canvas.height = 760;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    // 1. Fondo elegante Glassmorphic oscuro
    ctx.fillStyle = "#0a0d14";
    ctx.fillRect(0, 0, 640, 760);

    // Borde Neón exterior esmeralda
    ctx.strokeStyle = "rgba(16, 185, 129, 0.35)";
    ctx.lineWidth = 4;
    ctx.beginPath();
    drawRoundedRect(ctx, 16, 16, 608, 728, 28);
    ctx.stroke();

    // 2. Cargar y dibujar el código QR
    try {
      const qrImg = await loadImage(qrImageUrl, 6000);
      ctx.drawImage(qrImg, 70, 65, 500, 500);
    } catch (err) {
      console.error("Error cargando QR para canvas:", err);
      return null;
    }

    // 3. Insignia central: Icono personalizado de la app o marca ATP DEV
    let appIconDrawn = false;
    if (appImage && !imgError) {
      try {
        const appImg = await loadImage(appImage, 3500);
        drawAppIconBadge(ctx, appImg, 320, 315);
        appIconDrawn = true;
      } catch (err) {
        console.warn("No se pudo cargar la imagen de la app para el QR en canvas, usando marca ATP:", err);
      }
    }

    if (!appIconDrawn) {
      drawAtpBrandBadge(ctx, 320, 315);
    }

    // 4. Encabezado y Pie de página descriptivo
    ctx.textAlign = "center";
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 24px system-ui, -apple-system, sans-serif";
    
    // Truncar título si es muy largo
    const displayTitle = title.length > 34 ? title.substring(0, 32) + "..." : title;
    ctx.fillText(displayTitle, 320, 625);

    ctx.fillStyle = "#10b981";
    ctx.font = "bold 15px monospace";
    ctx.fillText("⚡ Desarrollado por ATP DEV • atpdev.dev", 320, 660);

    ctx.fillStyle = "#94a3b8";
    ctx.font = "500 13px system-ui, -apple-system, sans-serif";
    ctx.fillText("Escanea con la cámara de tu móvil para instalar", 320, 690);

    return canvas;
  };

  // Descargar imagen PNG del QR en alta resolución
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

        {/* Modal Header con logo del aplicativo si está disponible */}
        <div className="flex items-center justify-between mb-5 pb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            {appImage && !imgError ? (
              <img 
                src={appImage} 
                alt={title} 
                className="w-10 h-10 rounded-xl object-cover border border-emerald-500/40 shadow-sm" 
              />
            ) : (
              <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
                <QrCode size={20} />
              </div>
            )}
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

        {/* QR Code Container con Insignia Central Personalizada */}
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

              {/* Insignia Central: Ícono del App + Micro-sello ATP (Con tolerancia ecc=H) */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                {appImage && !imgError ? (
                  <div className="relative flex flex-col items-center justify-center">
                    <div className="bg-[#0b0c10] p-1 rounded-2xl border-2 border-emerald-500/80 shadow-[0_0_20px_rgba(16,185,129,0.5)] flex items-center justify-center backdrop-blur-md">
                      <img 
                        src={appImage} 
                        alt={title}
                        width={48}
                        height={48}
                        className="w-12 h-12 rounded-xl object-cover shadow-inner"
                        onError={() => setImgError(true)}
                      />
                    </div>
                    {/* Micro-sello de marca ATP DEV integrado al ícono del aplicativo */}
                    <div className="absolute -bottom-2 bg-[#090b10] border border-blue-500/80 px-2 py-0.5 rounded-full flex items-center gap-1 shadow-md shadow-blue-500/20">
                      <span className="font-mono text-[9px] font-black text-blue-400">&gt;_</span>
                      <span className="text-[8px] font-black tracking-wider text-white">ATP</span>
                    </div>
                  </div>
                ) : (
                  <div className="bg-[#0b0c10] px-3.5 py-1.5 rounded-xl border-2 border-blue-500/80 shadow-[0_0_20px_rgba(59,130,246,0.6)] flex items-center gap-1.5 backdrop-blur-md">
                    <span className="font-mono text-sm font-black text-blue-400">&gt;_</span>
                    <span className="text-xs font-black tracking-widest text-white">ATP</span>
                  </div>
                )}
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
              title="Descargar imagen PNG del QR en alta resolución con el ícono y marca ATP"
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


