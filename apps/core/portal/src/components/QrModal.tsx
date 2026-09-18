"use client";

import React, { useState } from "react";
import { 
  X, Copy, Check, QrCode, Smartphone, Download, Share2, 
  Loader2, Palette, Sparkles, Sliders, CopyCheck, Layers, Eye 
} from "lucide-react";
import { AnimatedDownloadButton } from "./AnimatedDownloadButton";

export interface QrTheme {
  id: string;
  name: string;
  qrColorHex: string;     // sin '#' para api.qrserver.com
  qrBgHex: string;        // sin '#' para api.qrserver.com
  accentColor: string;    // con '#' para css y canvas
  borderClass: string;
  glowClass: string;
  containerBg: string;
  canvasCardBg: string;
  canvasBorder: string;
  textColor: string;
  subtextColor: string;
  isLight?: boolean;
}

export const QR_THEMES: QrTheme[] = [
  {
    id: "emerald",
    name: "ATP Cyber",
    qrColorHex: "10b981",
    qrBgHex: "090d16",
    accentColor: "#10b981",
    borderClass: "border-emerald-500/40 hover:border-emerald-400",
    glowClass: "shadow-[0_0_25px_rgba(16,185,129,0.35)]",
    containerBg: "#090d16",
    canvasCardBg: "#090d16",
    canvasBorder: "rgba(16, 185, 129, 0.4)",
    textColor: "#ffffff",
    subtextColor: "#10b981",
  },
  {
    id: "azure",
    name: "Tech Blue",
    qrColorHex: "38bdf8",
    qrBgHex: "070d1a",
    accentColor: "#38bdf8",
    borderClass: "border-sky-500/40 hover:border-sky-400",
    glowClass: "shadow-[0_0_25px_rgba(56,189,248,0.35)]",
    containerBg: "#070d1a",
    canvasCardBg: "#070d1a",
    canvasBorder: "rgba(56, 189, 248, 0.4)",
    textColor: "#ffffff",
    subtextColor: "#38bdf8",
  },
  {
    id: "purple",
    name: "Synthwave",
    qrColorHex: "c084fc",
    qrBgHex: "120924",
    accentColor: "#c084fc",
    borderClass: "border-purple-500/40 hover:border-purple-400",
    glowClass: "shadow-[0_0_25px_rgba(192,132,252,0.35)]",
    containerBg: "#120924",
    canvasCardBg: "#120924",
    canvasBorder: "rgba(192, 132, 252, 0.4)",
    textColor: "#ffffff",
    subtextColor: "#c084fc",
  },
  {
    id: "amber",
    name: "Gold Amber",
    qrColorHex: "fbbf24",
    qrBgHex: "180e04",
    accentColor: "#fbbf24",
    borderClass: "border-amber-500/40 hover:border-amber-400",
    glowClass: "shadow-[0_0_25px_rgba(251,191,36,0.35)]",
    containerBg: "#180e04",
    canvasCardBg: "#180e04",
    canvasBorder: "rgba(251, 191, 36, 0.4)",
    textColor: "#ffffff",
    subtextColor: "#fbbf24",
  },
  {
    id: "minimal",
    name: "Monocromo",
    qrColorHex: "ffffff",
    qrBgHex: "0a0a0c",
    accentColor: "#ffffff",
    borderClass: "border-white/30 hover:border-white/50",
    glowClass: "shadow-[0_0_25px_rgba(255,255,255,0.15)]",
    containerBg: "#0a0a0c",
    canvasCardBg: "#0a0a0c",
    canvasBorder: "rgba(255, 255, 255, 0.25)",
    textColor: "#ffffff",
    subtextColor: "#60a5fa",
  },
  {
    id: "print",
    name: "Impresión / Stickers",
    qrColorHex: "000000",
    qrBgHex: "ffffff",
    accentColor: "#0f172a",
    borderClass: "border-slate-300 hover:border-slate-400",
    glowClass: "shadow-lg shadow-black/20",
    containerBg: "#ffffff",
    canvasCardBg: "#ffffff",
    canvasBorder: "#cbd5e1",
    textColor: "#0f172a",
    subtextColor: "#2563eb",
    isLight: true,
  },
];

export type BadgeType = "app" | "atp" | "none";
export type BadgeStyle = "white" | "transparent" | "accent" | "dark";
export type CardBackground = "dark" | "light" | "transparent";
export type ExportQuality = "1x" | "2x";

interface QrModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  url: string;
  appImage?: string;
  defaultThemeId?: string;
  defaultBadgeStyle?: BadgeStyle;
  defaultCardBg?: CardBackground;
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
function drawAtpBrandBadge(
  ctx: CanvasRenderingContext2D, 
  centerX: number, 
  centerY: number,
  badgeStyle: BadgeStyle = "white",
  isLight: boolean = false
) {
  const badgeW = 148;
  const badgeH = 64;
  const badgeX = centerX - badgeW / 2;
  const badgeY = centerY - badgeH / 2;

  const isWhite = badgeStyle === "white" || isLight;

  ctx.fillStyle = isWhite ? "#ffffff" : "#0b0c10";
  ctx.beginPath();
  drawRoundedRect(ctx, badgeX, badgeY, badgeW, badgeH, 18);
  ctx.fill();

  ctx.strokeStyle = isWhite ? "#2563eb" : "#3b82f6";
  ctx.lineWidth = 3.5;
  ctx.beginPath();
  drawRoundedRect(ctx, badgeX, badgeY, badgeW, badgeH, 18);
  ctx.stroke();

  ctx.textAlign = "left";
  ctx.font = "bold 30px monospace";
  ctx.fillStyle = isWhite ? "#2563eb" : "#3b82f6";
  ctx.fillText(">_", badgeX + 20, badgeY + 43);

  ctx.font = "900 24px 'Space Grotesk', system-ui, sans-serif";
  ctx.fillStyle = isWhite ? "#0f172a" : "#ffffff";
  ctx.fillText("ATP", badgeX + 70, badgeY + 41);
}

// Dibuja el ícono personalizado del aplicativo con marco configurable (Blanco, Transparente, Neón u Oscuro)
function drawAppIconBadge(
  ctx: CanvasRenderingContext2D,
  appImg: HTMLImageElement,
  centerX: number,
  centerY: number,
  accentColor: string,
  badgeStyle: BadgeStyle = "white",
  isLight: boolean = false
) {
  const containerSize = 104;
  const half = containerSize / 2;
  const containerX = centerX - half;
  const containerY = centerY - half;

  if (badgeStyle === "white") {
    // Halo Blanco Nítido (Alto Contraste)
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    drawRoundedRect(ctx, containerX, containerY, containerSize, containerSize, 22);
    ctx.fill();

    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 4;
    ctx.beginPath();
    drawRoundedRect(ctx, containerX, containerY, containerSize, containerSize, 22);
    ctx.stroke();
  } else if (badgeStyle === "transparent") {
    // Transparente (sin relleno de fondo)
    ctx.strokeStyle = isLight ? "#0f172a" : accentColor;
    ctx.lineWidth = 3;
    ctx.beginPath();
    drawRoundedRect(ctx, containerX, containerY, containerSize, containerSize, 22);
    ctx.stroke();
  } else if (badgeStyle === "accent") {
    // Neón con color temático
    ctx.fillStyle = isLight ? "#ffffff" : "#0b0c10";
    ctx.beginPath();
    drawRoundedRect(ctx, containerX, containerY, containerSize, containerSize, 22);
    ctx.fill();

    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 4;
    ctx.beginPath();
    drawRoundedRect(ctx, containerX, containerY, containerSize, containerSize, 22);
    ctx.stroke();
  } else {
    // Dark Glass
    ctx.fillStyle = "#0b0c10";
    ctx.beginPath();
    drawRoundedRect(ctx, containerX, containerY, containerSize, containerSize, 22);
    ctx.fill();

    ctx.strokeStyle = isLight ? "#cbd5e1" : "rgba(255, 255, 255, 0.25)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    drawRoundedRect(ctx, containerX, containerY, containerSize, containerSize, 22);
    ctx.stroke();
  }

  // Recorte redondeado para la imagen de la app
  const imgSize = 90;
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

  const isWhiteBadge = badgeStyle === "white";
  ctx.fillStyle = isWhiteBadge ? "#ffffff" : (isLight ? "#f8fafc" : "#07090e");
  ctx.beginPath();
  drawRoundedRect(ctx, pillX, pillY, pillW, pillH, 11);
  ctx.fill();

  ctx.strokeStyle = isWhiteBadge ? "#2563eb" : (isLight ? "#2563eb" : "#3b82f6");
  ctx.lineWidth = 2;
  ctx.beginPath();
  drawRoundedRect(ctx, pillX, pillY, pillW, pillH, 11);
  ctx.stroke();

  ctx.textAlign = "center";
  ctx.font = "bold 11px monospace";
  ctx.fillStyle = isWhiteBadge ? "#2563eb" : (isLight ? "#2563eb" : "#60a5fa");
  ctx.fillText(">_ ATP", centerX, pillY + 15);
}

export function QrModal({ 
  isOpen, 
  onClose, 
  title, 
  url, 
  appImage,
  defaultThemeId,
  defaultBadgeStyle = "white",
  defaultCardBg = "dark"
}: QrModalProps) {
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [copiedImage, setCopiedImage] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [isDownloadingImage, setIsDownloadingImage] = useState(false);
  const [isCopyingImage, setIsCopyingImage] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  // Estados del Estudio de Personalización con valores por defecto inteligentes
  const initialTheme = QR_THEMES.find(t => t.id === defaultThemeId) || QR_THEMES[0];
  const [activeTheme, setActiveTheme] = useState<QrTheme>(initialTheme);
  const [badgeType, setBadgeType] = useState<BadgeType>("app");
  const [badgeStyle, setBadgeStyle] = useState<BadgeStyle>(defaultBadgeStyle);
  const [cardBg, setCardBg] = useState<CardBackground>(defaultCardBg);
  const [exportQuality, setExportQuality] = useState<ExportQuality>("1x");
  const [showCustomizer, setShowCustomizer] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  // ecc=H (High Error Correction: tolera hasta 30% de oclusión central sin perder lectura)
  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=480x480&data=${encodeURIComponent(url)}&ecc=H&color=${activeTheme.qrColorHex}&bgcolor=${activeTheme.qrBgHex}`;

  // Renderiza el canvas con el QR, el estilo de color, el halo/borde del logo y fondo transparente o sólido
  const generateQrCanvas = async (overrideQuality?: ExportQuality): Promise<HTMLCanvasElement | null> => {
    const quality = overrideQuality || exportQuality;
    const scale = quality === "2x" ? 2 : 1;
    const baseW = 640;
    const baseH = 760;

    const canvas = document.createElement("canvas");
    canvas.width = baseW * scale;
    canvas.height = baseH * scale;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    if (scale !== 1) {
      ctx.scale(scale, scale);
    }

    const isTransparent = cardBg === "transparent";
    const isLight = cardBg === "light" || (!isTransparent && !!activeTheme.isLight);

    // 1. Fondo de la tarjeta (si no es transparente)
    if (!isTransparent) {
      ctx.fillStyle = cardBg === "light" ? "#ffffff" : activeTheme.canvasCardBg;
      ctx.fillRect(0, 0, baseW, baseH);

      // Borde exterior
      ctx.strokeStyle = cardBg === "light" ? "#cbd5e1" : activeTheme.canvasBorder;
      ctx.lineWidth = cardBg === "light" ? 2 : 4;
      ctx.beginPath();
      drawRoundedRect(ctx, 16, 16, baseW - 32, baseH - 32, 28);
      ctx.stroke();
    }

    // 2. Cargar y dibujar el código QR
    try {
      const qrImg = await loadImage(qrImageUrl, 6000);
      ctx.drawImage(qrImg, 70, 65, 500, 500);
    } catch (err) {
      console.error("Error cargando QR para canvas:", err);
      return null;
    }

    // 3. Insignia central según badgeType y badgeStyle
    if (badgeType === "app" && appImage && !imgError) {
      try {
        const appImg = await loadImage(appImage, 3500);
        drawAppIconBadge(ctx, appImg, 320, 315, activeTheme.accentColor, badgeStyle, isLight);
      } catch (err) {
        console.warn("Fallo carga de imagen app para canvas, usando marca ATP:", err);
        drawAtpBrandBadge(ctx, 320, 315, badgeStyle, isLight);
      }
    } else if (badgeType === "atp" || (badgeType === "app" && (!appImage || imgError))) {
      drawAtpBrandBadge(ctx, 320, 315, badgeStyle, isLight);
    }

    // 4. Encabezado y Pie de página descriptivo
    ctx.textAlign = "center";
    ctx.fillStyle = isLight ? "#0f172a" : activeTheme.textColor;
    ctx.font = "bold 24px system-ui, -apple-system, sans-serif";
    
    const displayTitle = title.length > 34 ? title.substring(0, 32) + "..." : title;
    ctx.fillText(displayTitle, 320, 625);

    ctx.fillStyle = isLight ? "#2563eb" : activeTheme.subtextColor;
    ctx.font = "bold 15px monospace";
    ctx.fillText("⚡ Desarrollado por ATP DEV • atpdev.dev", 320, 660);

    ctx.fillStyle = isLight ? "#64748b" : "#94a3b8";
    ctx.font = "500 13px system-ui, -apple-system, sans-serif";
    ctx.fillText("Escanea con la cámara de tu móvil para instalar", 320, 690);

    return canvas;
  };

  // Descargar imagen PNG del QR
  const handleDownloadQrImage = async () => {
    setIsDownloadingImage(true);
    try {
      const canvas = await generateQrCanvas();
      if (!canvas) return;
      const dataUrl = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      const cleanTitle = title.replace(/[^a-zA-Z0-9_-]/g, "_");
      const bgTag = cardBg === "transparent" ? "_transparent" : "";
      a.download = `QR_${cleanTitle}_${activeTheme.id}_${badgeStyle}${bgTag}_${exportQuality}.png`;
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

  // Copiar imagen PNG directamente al portapapeles
  const handleCopyImage = async () => {
    setIsCopyingImage(true);
    try {
      const canvas = await generateQrCanvas("1x");
      if (!canvas) return;
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        try {
          if (navigator.clipboard && typeof window !== "undefined" && (window as any).ClipboardItem) {
            await navigator.clipboard.write([
              new (window as any).ClipboardItem({ "image/png": blob })
            ]);
            setCopiedImage(true);
            setTimeout(() => setCopiedImage(false), 2000);
          } else {
            handleCopyUrl();
          }
        } catch (err) {
          console.warn("Fallo al escribir imagen en el portapapeles:", err);
          handleCopyUrl();
        }
      }, "image/png");
    } catch (e) {
      console.error("Error al copiar imagen:", e);
    } finally {
      setIsCopyingImage(false);
    }
  };

  // Compartir QR directamente mediante Web Share API
  const handleShareQr = async () => {
    setIsSharing(true);
    try {
      if (typeof navigator !== "undefined" && navigator.share) {
        try {
          const canvas = await generateQrCanvas("1x");
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
              await navigator.share({
                title: `Descargar ${title} - ATP DEV`,
                text: `Instala ${title} desde este enlace oficial:`,
                url: url
              });
            }, "image/png");
            return;
          }
        } catch (e) {
          await navigator.share({
            title: `Descargar ${title} - ATP DEV`,
            text: `Instala ${title} desde este enlace:`,
            url: url
          });
          return;
        }
      }
      handleCopyUrl();
    } catch (e) {
      console.error("Error al compartir:", e);
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 overflow-y-auto"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-md bg-[#0e1017] border border-emerald-500/30 rounded-3xl p-6 shadow-2xl shadow-emerald-950/50 relative overflow-hidden neon-border my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Glow Accents */}
        <div 
          className="absolute -top-24 -left-24 w-48 h-48 rounded-full blur-3xl pointer-events-none transition-colors duration-500"
          style={{ backgroundColor: `${activeTheme.accentColor}33` }} 
        />
        <div 
          className="absolute -bottom-24 -right-24 w-48 h-48 rounded-full blur-3xl pointer-events-none transition-colors duration-500" 
          style={{ backgroundColor: `${activeTheme.accentColor}22` }}
        />

        {/* Modal Header con logo de app y toggle de personalización */}
        <div className="flex items-center justify-between mb-4 pb-3.5 border-b border-white/10">
          <div className="flex items-center gap-3">
            {appImage && !imgError ? (
              <img 
                src={appImage} 
                alt={title} 
                className="w-10 h-10 rounded-xl object-cover border border-white/20 shadow-sm" 
              />
            ) : (
              <div 
                className="p-2 rounded-xl border transition-colors"
                style={{ 
                  backgroundColor: `${activeTheme.accentColor}1a`, 
                  borderColor: `${activeTheme.accentColor}4d`,
                  color: activeTheme.accentColor 
                }}
              >
                <QrCode size={20} />
              </div>
            )}
            <div>
              <h3 className="font-bold text-white text-base leading-snug">Escanear para Descargar</h3>
              <p className="text-xs text-gray-400 truncate max-w-[190px]">{title}</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setShowCustomizer(!showCustomizer)}
              className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
                showCustomizer 
                  ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-300 shadow-md shadow-emerald-500/20" 
                  : "bg-white/5 border-white/10 text-gray-300 hover:text-white hover:bg-white/10"
              }`}
              title="Personalizar estilo de color, borde del logo y fondo de descarga"
            >
              <Palette size={15} />
              <span className="hidden sm:inline">Personalizar</span>
            </button>
            <button 
              onClick={onClose}
              className="p-2 rounded-full bg-white/5 hover:bg-white/15 text-gray-400 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Panel de Personalización Interactivo Expandible */}
        {showCustomizer && (
          <div className="mb-4 p-3.5 bg-[#080b12] border border-white/15 rounded-2xl space-y-3.5 animate-in fade-in slide-in-from-top-2 duration-200">
            {/* 1. Selector de Temas / Colores */}
            <div>
              <div className="flex items-center justify-between text-xs font-semibold text-gray-300 mb-2">
                <span className="flex items-center gap-1.5">
                  <Palette size={13} className="text-emerald-400" />
                  Tema de Color:
                </span>
                <span className="text-[11px] text-emerald-400 font-mono font-bold">{activeTheme.name}</span>
              </div>
              <div className="grid grid-cols-6 gap-1.5">
                {QR_THEMES.map((theme) => {
                  const isSelected = activeTheme.id === theme.id;
                  return (
                    <button
                      key={theme.id}
                      onClick={() => setActiveTheme(theme)}
                      className={`relative flex flex-col items-center justify-center p-2 rounded-xl border transition-all text-center ${
                        isSelected 
                          ? "border-emerald-400 bg-white/10 scale-105 shadow-md shadow-emerald-500/20" 
                          : "border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20"
                      }`}
                      title={theme.name}
                    >
                      <span 
                        className="w-4 h-4 rounded-full border border-white/30 shadow-inner"
                        style={{ backgroundColor: theme.accentColor }} 
                      />
                      {isSelected && (
                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 rounded-full ring-2 ring-[#080b12]" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Selector de Borde / Fondo del Logo Central */}
            {badgeType === "app" && (
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-gray-300 mb-2">
                  <span className="flex items-center gap-1.5">
                    <Layers size={13} className="text-sky-400" />
                    Borde / Halo del Logo:
                  </span>
                  <span className="text-[10px] text-gray-400">
                    {badgeStyle === "white" ? "⚪ Halo Blanco (Recomendado)" : badgeStyle === "transparent" ? "🏁 Transparente" : badgeStyle === "accent" ? "🟢 Neón" : "⚫ Oscuro"}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-1.5">
                  <button
                    onClick={() => setBadgeStyle("white")}
                    className={`py-1.5 px-2 rounded-xl border text-[11px] font-bold transition-all truncate flex items-center justify-center gap-1 ${
                      badgeStyle === "white"
                        ? "bg-white/25 border-white text-white shadow-sm"
                        : "bg-white/5 border-white/10 text-gray-400 hover:text-white"
                    }`}
                    title="Halo blanco nítido para máximo contraste sobre el QR"
                  >
                    ⚪ Blanco
                  </button>
                  <button
                    onClick={() => setBadgeStyle("transparent")}
                    className={`py-1.5 px-2 rounded-xl border text-[11px] font-bold transition-all truncate flex items-center justify-center gap-1 ${
                      badgeStyle === "transparent"
                        ? "bg-sky-500/20 border-sky-400 text-sky-300 shadow-sm"
                        : "bg-white/5 border-white/10 text-gray-400 hover:text-white"
                    }`}
                    title="Sin fondo sólido, deja flotar el icono con recorte limpio"
                  >
                    🏁 Transparente
                  </button>
                  <button
                    onClick={() => setBadgeStyle("accent")}
                    className={`py-1.5 px-2 rounded-xl border text-[11px] font-bold transition-all truncate flex items-center justify-center gap-1 ${
                      badgeStyle === "accent"
                        ? "bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-sm"
                        : "bg-white/5 border-white/10 text-gray-400 hover:text-white"
                    }`}
                    title="Borde brillante con el color del tema actual"
                  >
                    🟢 Neón
                  </button>
                  <button
                    onClick={() => setBadgeStyle("dark")}
                    className={`py-1.5 px-2 rounded-xl border text-[11px] font-bold transition-all truncate flex items-center justify-center gap-1 ${
                      badgeStyle === "dark"
                        ? "bg-slate-700/50 border-slate-400 text-slate-200 shadow-sm"
                        : "bg-white/5 border-white/10 text-gray-400 hover:text-white"
                    }`}
                    title="Cápsula oscura con borde sutil"
                  >
                    ⚫ Oscuro
                  </button>
                </div>
              </div>
            )}

            {/* 3. Selector de Insignia Central */}
            <div>
              <span className="block text-xs font-semibold text-gray-300 mb-2">
                Insignia Central:
              </span>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  onClick={() => setBadgeType("app")}
                  className={`py-1.5 px-2 rounded-xl border text-[11px] font-bold transition-all truncate flex items-center justify-center gap-1 ${
                    badgeType === "app"
                      ? "bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-sm"
                      : "bg-white/5 border-white/10 text-gray-400 hover:text-white"
                  }`}
                >
                  📱 Ícono App
                </button>
                <button
                  onClick={() => setBadgeType("atp")}
                  className={`py-1.5 px-2 rounded-xl border text-[11px] font-bold transition-all truncate flex items-center justify-center gap-1 ${
                    badgeType === "atp"
                      ? "bg-blue-500/20 border-blue-400 text-blue-300 shadow-sm"
                      : "bg-white/5 border-white/10 text-gray-400 hover:text-white"
                  }`}
                >
                  ⚡ ATP DEV
                </button>
                <button
                  onClick={() => setBadgeType("none")}
                  className={`py-1.5 px-2 rounded-xl border text-[11px] font-bold transition-all truncate flex items-center justify-center gap-1 ${
                    badgeType === "none"
                      ? "bg-white/20 border-white text-white shadow-sm"
                      : "bg-white/5 border-white/10 text-gray-400 hover:text-white"
                  }`}
                >
                  ⬛ Sin Logo
                </button>
              </div>
            </div>

            {/* 4. Selector de Fondo al Descargar & Calidad */}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/10">
              {/* Fondo de Descarga */}
              <div>
                <span className="text-[11px] font-semibold text-gray-300 block mb-1.5">
                  Fondo de Descarga:
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setCardBg("dark")}
                    className={`flex-1 py-1 px-1.5 rounded-lg border text-[10px] font-bold transition-all text-center ${
                      cardBg === "dark"
                        ? "bg-emerald-500/20 border-emerald-400 text-emerald-300"
                        : "bg-white/5 border-white/10 text-gray-400 hover:text-white"
                    }`}
                    title="Tarjeta oscura estándar"
                  >
                    ⚫ Dark
                  </button>
                  <button
                    onClick={() => setCardBg("light")}
                    className={`flex-1 py-1 px-1.5 rounded-lg border text-[10px] font-bold transition-all text-center ${
                      cardBg === "light"
                        ? "bg-white/20 border-white text-white"
                        : "bg-white/5 border-white/10 text-gray-400 hover:text-white"
                    }`}
                    title="Tarjeta blanca para imprimir en papel"
                  >
                    ⚪ Blanca
                  </button>
                  <button
                    onClick={() => setCardBg("transparent")}
                    className={`flex-1 py-1 px-1.5 rounded-lg border text-[10px] font-bold transition-all text-center ${
                      cardBg === "transparent"
                        ? "bg-purple-500/20 border-purple-400 text-purple-300"
                        : "bg-white/5 border-white/10 text-gray-400 hover:text-white"
                    }`}
                    title="PNG transparente sin fondo negro, ideal para flyers"
                  >
                    🏁 Transp.
                  </button>
                </div>
              </div>

              {/* Calidad de Descarga */}
              <div>
                <span className="text-[11px] font-semibold text-gray-300 block mb-1.5">
                  Resolución PNG:
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setExportQuality("1x")}
                    className={`flex-1 py-1 px-1.5 rounded-lg border text-[10px] font-bold transition-all text-center ${
                      exportQuality === "1x"
                        ? "bg-emerald-500/20 border-emerald-400 text-emerald-300"
                        : "bg-white/5 border-white/10 text-gray-400 hover:text-white"
                    }`}
                  >
                    HD
                  </button>
                  <button
                    onClick={() => setExportQuality("2x")}
                    className={`flex-1 py-1 px-1.5 rounded-lg border text-[10px] font-bold transition-all flex items-center justify-center gap-0.5 ${
                      exportQuality === "2x"
                        ? "bg-gradient-to-r from-blue-500/20 to-purple-500/20 border-sky-400 text-sky-300"
                        : "bg-white/5 border-white/10 text-gray-400 hover:text-white"
                    }`}
                    title="Ultra HD 2X (1280x1520 px) para imprenta"
                  >
                    <Sparkles size={10} className="text-amber-400" />
                    Ultra HD
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* QR Code Container con Live Theming y Halo Configurable */}
        <div className="flex flex-col items-center justify-center my-2">
          <div 
            className="p-4 rounded-3xl border shadow-inner relative group transition-all duration-300"
            style={{ 
              backgroundColor: cardBg === "transparent" ? "rgba(255,255,255,0.03)" : activeTheme.containerBg,
              borderColor: activeTheme.accentColor + "4d"
            }}
          >
            <div className="relative overflow-hidden rounded-2xl">
              <img 
                src={qrImageUrl} 
                alt={`QR Code para ${title}`}
                width={240}
                height={240}
                className="rounded-2xl transition-transform duration-300 group-hover:scale-[1.02]"
              />

              {/* Insignia Central Dinámica con Halo Blanco / Transparente / Neón */}
              {badgeType !== "none" && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  {badgeType === "app" && appImage && !imgError ? (
                    <div className="relative flex flex-col items-center justify-center">
                      <div 
                        className={`p-1 rounded-2xl border-2 flex items-center justify-center backdrop-blur-md transition-all duration-200 ${
                          badgeStyle === "white" 
                            ? "bg-white border-white shadow-[0_0_20px_rgba(255,255,255,0.5)]" 
                            : badgeStyle === "transparent"
                            ? "bg-black/30 border-white/60 shadow-md backdrop-blur-md"
                            : badgeStyle === "accent"
                            ? "border-2 shadow-lg"
                            : "bg-[#0b0c10] border-white/20 shadow-md"
                        }`}
                        style={
                          badgeStyle === "accent" 
                            ? { 
                                backgroundColor: activeTheme.isLight ? "#ffffff" : "#0b0c10",
                                borderColor: activeTheme.accentColor,
                                boxShadow: `0 0 20px ${activeTheme.accentColor}80`
                              }
                            : {}
                        }
                      >
                        <img 
                          src={appImage} 
                          alt={title}
                          width={48}
                          height={48}
                          className="w-12 h-12 rounded-xl object-cover shadow-inner"
                          onError={() => setImgError(true)}
                        />
                      </div>

                      {/* Micro-sello de marca ATP DEV */}
                      <div 
                        className={`absolute -bottom-2 border px-2 py-0.5 rounded-full flex items-center gap-1 shadow-md transition-all ${
                          badgeStyle === "white"
                            ? "bg-white border-blue-600 text-slate-900"
                            : "bg-[#080b12] border-blue-500/80 text-white"
                        }`}
                      >
                        <span className={`font-mono text-[9px] font-black ${badgeStyle === "white" ? "text-blue-600" : "text-blue-400"}`}>&gt;_</span>
                        <span className={`text-[8px] font-black tracking-wider ${badgeStyle === "white" ? "text-slate-900" : "text-white"}`}>ATP</span>
                      </div>
                    </div>
                  ) : (
                    <div 
                      className={`px-3.5 py-1.5 rounded-xl border-2 flex items-center gap-1.5 backdrop-blur-md shadow-lg ${
                        badgeStyle === "white"
                          ? "bg-white border-blue-600 text-slate-900"
                          : "bg-[#0b0c10] border-blue-500/80 text-white"
                      }`}
                    >
                      <span className="font-mono text-sm font-black text-blue-600">&gt;_</span>
                      <span className={`text-xs font-black tracking-widest ${badgeStyle === "white" ? "text-slate-900" : "text-white"}`}>ATP</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div 
              className="absolute inset-0 rounded-3xl border-2 pointer-events-none transition-colors" 
              style={{ borderColor: `${activeTheme.accentColor}33` }}
            />
          </div>

          <p className="text-xs text-gray-400 mt-2.5 text-center flex items-center gap-1.5">
            <Smartphone size={14} style={{ color: activeTheme.accentColor }} />
            Apunta con la cámara de tu teléfono para instalar la App
          </p>

          {/* Botones de Acción: Descargar PNG, Copiar Imagen y Compartir */}
          <div className="grid grid-cols-3 gap-2 mt-3.5 w-full">
            <button
              onClick={handleDownloadQrImage}
              disabled={isDownloadingImage}
              className="flex items-center justify-center gap-1 py-2.5 px-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-all border border-white/15 hover:border-emerald-500/50 active:scale-95 shadow-sm"
              title={`Descargar PNG con fondo ${cardBg} en ${exportQuality.toUpperCase()}`}
            >
              {isDownloadingImage ? (
                <Loader2 size={13} className="animate-spin text-emerald-400" />
              ) : (
                <Download size={13} className="text-emerald-400" />
              )}
              <span className="truncate">
                {isDownloadingImage ? "..." : `Descargar ${exportQuality.toUpperCase()}`}
              </span>
            </button>

            <button
              onClick={handleCopyImage}
              disabled={isCopyingImage}
              className="flex items-center justify-center gap-1 py-2.5 px-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold transition-all border border-white/15 hover:border-sky-500/50 active:scale-95 shadow-sm"
              title="Copiar imagen PNG al portapapeles para pegar en WhatsApp o Canva"
            >
              {isCopyingImage ? (
                <Loader2 size={13} className="animate-spin text-sky-400" />
              ) : copiedImage ? (
                <Check size={13} className="text-emerald-400" />
              ) : (
                <CopyCheck size={13} className="text-sky-400" />
              )}
              <span className="truncate">
                {copiedImage ? "¡Copiada!" : "Copiar PNG"}
              </span>
            </button>

            <button
              onClick={handleShareQr}
              disabled={isSharing}
              className="flex items-center justify-center gap-1 py-2.5 px-2 bg-gradient-to-r from-blue-600/80 to-indigo-600/80 hover:from-blue-600 hover:to-indigo-600 text-white rounded-xl text-xs font-bold transition-all border border-blue-400/30 active:scale-95 shadow-md shadow-blue-600/20"
              title="Compartir imagen y enlace en WhatsApp o redes sociales"
            >
              {isSharing ? (
                <Loader2 size={13} className="animate-spin text-white" />
              ) : (
                <Share2 size={13} className="text-white" />
              )}
              <span className="truncate">Compartir</span>
            </button>
          </div>
        </div>

        {/* Enlace Directo y Botón de Descarga del Dispositivo */}
        <div className="mt-3.5 pt-3.5 border-t border-white/10 space-y-2.5">
          <div className="flex items-center gap-2 p-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-gray-300">
            <span className="truncate flex-1 font-mono text-[11px]">{url}</span>
            <button
              onClick={handleCopyUrl}
              className="flex items-center gap-1 px-2.5 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg font-bold transition-all flex-shrink-0 text-xs"
              title="Copiar URL directa de descarga"
            >
              {copiedUrl ? (
                <><Check size={12} className="text-emerald-400" /> Copiado</>
              ) : (
                <><Copy size={12} /> Copiar</>
              )}
            </button>
          </div>

          {(url.includes(".apk") || url.includes("/apks/") || url.includes(".ipa") || url.includes("/ipas/")) && (
            <AnimatedDownloadButton
              url={url}
              defaultLabel={url.includes(".apk") || url.includes("/apks/") ? "Descargar APK en este dispositivo" : "Descargar IPA en este dispositivo"}
              className="!py-2.5 !text-xs !rounded-xl"
              iconSize={15}
            />
          )}
        </div>
      </div>
    </div>
  );
}
