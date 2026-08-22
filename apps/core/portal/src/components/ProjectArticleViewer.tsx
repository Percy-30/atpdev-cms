"use client";

import React, { useState } from "react";
import Image from "next/image";
import { QrCode, X, Eye, Share2, Check, Download } from "lucide-react";

import { StickyDownloadBar } from "./StickyDownloadBar";

interface ProjectArticleViewerProps {
  description: string;
  image: string;
  title: string;
  playstore?: string | null;
  appstore?: string | null;
}

export function ProjectArticleViewer({
  description,
  image,
  title,
  playstore,
  appstore
}: ProjectArticleViewerProps) {
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [showQrModal, setShowQrModal] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const paragraphs = description.split("\n").filter((p) => p.trim() !== "");

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const activeDownloadUrl = appstore || playstore || (typeof window !== "undefined" ? window.location.href : "");

  return (
    <div className="space-y-8">
      {/* Action Bar (Share & QR Install Modal Trigger) */}
      <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
        <div className="flex items-center gap-2 text-xs font-mono text-gray-300">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Soporte Nativo Verificado • 100% Offline</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white/10 hover:bg-white/20 rounded-xl transition-all"
          >
            {copied ? <Check size={14} className="text-emerald-400" /> : <Share2 size={14} />}
            {copied ? "¡Enlace Copiado!" : "Compartir"}
          </button>
          {activeDownloadUrl && (
            <button
              onClick={() => setShowQrModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl transition-all shadow-md shadow-blue-500/20"
            >
              <QrCode size={14} /> Escanear QR
            </button>
          )}
        </div>
      </div>

      {/* Article Body */}
      <div className="space-y-6 text-lg leading-relaxed text-[var(--text-color)] opacity-95">
        {paragraphs.map((paragraph, idx) => {
          // Detect H2 style headings or regular paragraphs
          if (paragraph.startsWith("# ") || paragraph.startsWith("## ")) {
            const headingText = paragraph.replace(/^#+\s*/, "");
            return (
              <h2
                key={idx}
                className="text-2xl font-bold text-white pt-4 pb-2 border-b border-white/10 title-gradient"
              >
                {headingText}
              </h2>
            );
          }
          return <p key={idx}>{paragraph}</p>;
        })}
      </div>

      {/* Persistent Floating Bottom Download CTA Bar */}
      <StickyDownloadBar
        title={title}
        playstore={playstore}
        appstore={appstore}
        onOpenQr={() => setShowQrModal(true)}
      />

      {/* Image Lightbox Modal */}
      {activeImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setActiveImage(null)}
        >
          <button
            onClick={() => setActiveImage(null)}
            className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors"
          >
            <X size={24} />
          </button>
          <div className="relative max-w-5xl max-h-[85vh] w-full h-full flex items-center justify-center">
            <Image
              src={activeImage}
              alt="Vista ampliada"
              fill
              className="object-contain rounded-2xl"
            />
          </div>
        </div>
      )}

      {/* QR Code Quick Install Modal */}
      {showQrModal && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setShowQrModal(false)}
        >
          <div
            className="bg-[#12141c] border border-white/15 rounded-3xl p-8 max-w-sm w-full text-center space-y-6 relative neon-border shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowQrModal(false)}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white rounded-full"
            >
              <X size={20} />
            </button>
            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center mx-auto text-blue-400">
              <QrCode size={28} />
            </div>
            <div>
              <h3 className="text-xl font-black text-white">Instalar en Smartphone</h3>
              <p className="text-xs text-gray-400 mt-1">
                Escanea este código QR con la cámara de tu móvil para descargar el instalador directamente.
              </p>
            </div>
            <div className="p-4 bg-white rounded-2xl inline-block mx-auto shadow-inner">
              {/* Dynamic QR Code Image via API */}
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
                  activeDownloadUrl
                )}`}
                alt="Código QR de Instalación"
                width={180}
                height={180}
                className="mx-auto"
              />
            </div>
            <div className="pt-2">
              <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                ✓ Enlace Seguro Directo
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
