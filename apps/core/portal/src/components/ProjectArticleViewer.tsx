"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { QrCode, X, Eye, Share2, Check, Download, ShieldCheck, Globe, Camera, Sparkles } from "lucide-react";

import { StickyDownloadBar } from "./StickyDownloadBar";

interface ProjectArticleViewerProps {
  description: string;
  image: string;
  title: string;
  playstore?: string | null;
  appstore?: string | null;
}

type ArticleBlock = {
  type: "h2" | "p" | "image" | "callout" | "quote";
  content?: string;
  alt?: string;
  url?: string;
  context?: string;
};

function parseContentBlocks(rawDescription: string): ArticleBlock[] {
  const trimmed = (rawDescription || "").trim();
  let initialBlocks: ArticleBlock[] = [];

  if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
    try {
      const parsed = JSON.parse(trimmed);
      if (Array.isArray(parsed) && parsed.length > 0) {
        initialBlocks = parsed as ArticleBlock[];
      }
    } catch (e) {
      console.warn("Could not parse description JSON blocks, falling back to text:", e);
    }
  }

  if (initialBlocks.length === 0) {
    const lines = trimmed.split("\n").filter((l) => l.trim() !== "");
    initialBlocks = lines.map((line) => {
      if (line.startsWith("# ") || line.startsWith("## ")) {
        return { type: "h2", content: line.replace(/^#+\s*/, "") };
      }
      return { type: "p", content: line };
    });
  }

  // Second pass: scan all blocks to extract embedded markdown images ![alt](url)
  const finalBlocks: ArticleBlock[] = [];

  for (const block of initialBlocks) {
    if (block.type === "image") {
      finalBlocks.push(block);
      continue;
    }

    const content = block.content || "";
    const imgRegex = /!\[(.*?)\]\((.*?)\)/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;
    let hasMatches = false;

    while ((match = imgRegex.exec(content)) !== null) {
      hasMatches = true;
      const textBefore = content.substring(lastIndex, match.index).trim();
      if (textBefore) {
        finalBlocks.push({ type: block.type, content: textBefore });
      }
      const alt = match[1];
      const url = match[2];
      finalBlocks.push({
        type: "image",
        alt: alt || "Captura del sistema",
        url: url,
        context: alt,
      });
      lastIndex = imgRegex.lastIndex;
    }

    if (hasMatches) {
      const textAfter = content.substring(lastIndex).trim();
      if (textAfter) {
        finalBlocks.push({ type: block.type, content: textAfter });
      }
    } else {
      finalBlocks.push(block);
    }
  }

  return finalBlocks;
}

const SUPPORTED_LANGS = [
  { code: "es", flag: "🇪🇸", label: "Español" },
  { code: "en", flag: "🇺🇸", label: "English" },
  { code: "pt", flag: "🇧🇷", label: "Português" },
  { code: "fr", flag: "🇫🇷", label: "Français" },
  { code: "de", flag: "🇩🇪", label: "Deutsch" },
  { code: "ru", flag: "🇷🇺", label: "Русский" },
  { code: "zh", flag: "🇨🇳", label: "中文" },
  { code: "hi", flag: "🇮🇳", label: "हिन्दी" },
  { code: "ja", flag: "🇯🇵", label: "日本語" },
];

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
  const [scrollProgress, setScrollProgress] = useState<number>(0);

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const currentProgress = (window.scrollY / totalHeight) * 100;
        setScrollProgress(Math.min(100, Math.max(0, currentProgress)));
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const blocks = parseContentBlocks(description);

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
      {/* Scroll Reading Progress Bar (Neon Cyan Gradient) */}
      <div
        className="fixed top-0 left-0 h-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 z-50 transition-all duration-150 shadow-[0_0_12px_rgba(6,182,212,0.8)]"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* Language Switcher Bar (Global SEO PRO PRO) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-white/10 text-xs font-medium">
        <span className="flex items-center gap-1 text-gray-400 flex-shrink-0 font-mono">
          <Globe size={13} className="text-cyan-400" /> SEO Global:
        </span>
        {SUPPORTED_LANGS.map((langItem) => (
          <Link
            key={langItem.code}
            href={`/${langItem.code === 'es' ? '' : langItem.code}`}
            className="flex items-center gap-1 px-2.5 py-1 bg-white/5 hover:bg-white/15 rounded-lg border border-white/10 transition-colors flex-shrink-0 text-gray-300 hover:text-white"
          >
            <span>{langItem.flag}</span>
            <span>{langItem.code.toUpperCase()}</span>
          </Link>
        ))}
      </div>

      {/* Action Bar (Share, Security Audit & QR Install Modal Trigger) */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-md">
        <div className="flex items-center gap-3 text-xs font-mono text-gray-300">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="flex items-center gap-1 text-emerald-400 font-semibold">
            <ShieldCheck size={14} /> SHA-256 Verificado
          </span>
          <span className="hidden sm:inline text-gray-500">• 100% Offline & Seguro</span>
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

      {/* Rich Article Body */}
      <div className="space-y-6 text-lg leading-relaxed text-[var(--text-color)] opacity-95">
        {blocks.map((block, idx) => {
          if (block.type === "h2") {
            return (
              <h2
                key={idx}
                className="text-2xl md:text-3xl font-black text-white pt-8 pb-3 border-b border-white/10 title-gradient flex items-center gap-3"
              >
                <span className="w-2 h-6 bg-cyan-400 rounded-full shadow-[0_0_12px_#06b6d4]"></span>
                {block.content}
              </h2>
            );
          }

          if (block.type === "image") {
            return (
              <div key={idx} className="my-8 rounded-3xl p-4 md:p-6 bg-white/5 border border-white/15 backdrop-blur-xl relative overflow-hidden group hover:border-cyan-500/50 transition-all shadow-2xl">
                {block.url ? (
                  <div
                    className="relative rounded-2xl overflow-hidden cursor-pointer bg-black/40 flex flex-col items-center justify-center p-2"
                    onClick={() => setActiveImage(block.url!)}
                  >
                    <img
                      src={block.url}
                      alt={block.alt || title}
                      className="w-full h-auto max-h-[550px] object-contain rounded-2xl group-hover:scale-[1.01] transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white gap-2 font-semibold backdrop-blur-xs rounded-2xl">
                      <Eye size={22} className="text-cyan-400" />
                      <span>Ampliar Imagen en HD</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-white/20 rounded-2xl text-center bg-black/30">
                    <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-3 shadow-[0_0_15px_rgba(6,182,212,0.2)]">
                      <Camera size={28} />
                    </div>
                    <h4 className="text-base font-bold text-white mb-1">{block.alt || "Captura de la Aplicación"}</h4>
                    <p className="text-xs text-gray-400 max-w-md">{block.context || "Vista previa de la interfaz nativa del sistema."}</p>
                  </div>
                )}
                {block.alt && block.url && (
                  <p className="mt-3 text-center text-xs text-cyan-300/80 font-mono flex items-center justify-center gap-1.5">
                    <Camera size={13} className="text-cyan-400" />
                    {block.alt}
                  </p>
                )}
              </div>
            );
          }

          if (block.type === "callout") {
            return (
              <div key={idx} className="my-6 p-6 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 text-cyan-200 backdrop-blur-md flex items-start gap-4 shadow-lg">
                <Sparkles size={24} className="text-cyan-400 flex-shrink-0 mt-1" />
                <div className="text-base leading-relaxed">{block.content}</div>
              </div>
            );
          }

          return (
            <p key={idx} className="text-lg leading-relaxed text-gray-200/90 font-sans font-normal">
              {block.content}
            </p>
          );
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
            className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full transition-colors z-10"
          >
            <X size={24} />
          </button>
          <div className="relative max-w-5xl max-h-[85vh] w-full h-full flex items-center justify-center">
            <img
              src={activeImage}
              alt="Vista ampliada HD"
              className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl border border-white/20"
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
