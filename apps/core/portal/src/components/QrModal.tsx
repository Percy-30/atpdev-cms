"use client";

import React, { useState } from "react";
import { X, Copy, Check, QrCode, ExternalLink, Smartphone } from "lucide-react";
import Image from "next/image";

interface QrModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  url: string;
}

export function QrModal({ isOpen, onClose, title, url }: QrModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=${encodeURIComponent(url)}&color=ffffff&bgcolor=0e1017`;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-md bg-[#0e1017] border border-emerald-500/30 rounded-3xl p-6 shadow-2xl shadow-emerald-950/50 relative overflow-hidden neon-border"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Glow Accent */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-sky-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
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

        <div className="flex flex-col items-center justify-center my-4">
          <div className="p-4 bg-[#141824] border border-white/15 rounded-2xl shadow-inner relative group">
            <img 
              src={qrImageUrl} 
              alt={`QR Code para ${title}`}
              width={220}
              height={220}
              className="rounded-xl transition-transform duration-300 group-hover:scale-[1.02]"
            />
            <div className="absolute inset-0 rounded-2xl border-2 border-emerald-500/20 pointer-events-none" />
          </div>
          <p className="text-xs text-gray-400 mt-4 text-center flex items-center gap-1.5">
            <Smartphone size={14} className="text-emerald-400" />
            Apunta con la cámara de tu teléfono para instalar la App
          </p>
        </div>

        <div className="mt-6 pt-4 border-t border-white/10 space-y-3">
          <div className="flex items-center gap-2 p-2.5 bg-white/5 border border-white/10 rounded-xl text-xs text-gray-300">
            <span className="truncate flex-1 font-mono">{url}</span>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold transition-all flex-shrink-0"
            >
              {copied ? (
                <><Check size={14} /> Copiado</>
              ) : (
                <><Copy size={14} /> Copiar</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
