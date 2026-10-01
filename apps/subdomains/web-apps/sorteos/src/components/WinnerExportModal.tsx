"use client";

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Download, Copy, Check, X, Sparkles, Trophy, Share2, Camera } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export interface WinnerExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  winnerName: string;
  drawTitle?: string;
  auditHash?: string;
  platform?: string;
}

export const WinnerExportModal: React.FC<WinnerExportModalProps> = ({
  isOpen,
  onClose,
  winnerName,
  drawTitle = 'Sorteo Oficial',
  auditHash = 'a1b2c3d4e5f67890123456789abcdef0',
  platform = 'Sorteos Pro'
}) => {
  const { t } = useLanguage();
  const [format, setFormat] = useState<'story' | 'post'>('story');
  const [copied, setCopied] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const drawCard = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Dimensions
    const width = format === 'story' ? 1080 : 1080;
    const height = format === 'story' ? 1920 : 1080;
    canvas.width = width;
    canvas.height = height;

    // Background: Dark luxury galaxy gradient
    const bgGrad = ctx.createLinearGradient(0, 0, width, height);
    bgGrad.addColorStop(0, '#070a12');
    bgGrad.addColorStop(0.3, '#160d2b');
    bgGrad.addColorStop(0.7, '#0d1326');
    bgGrad.addColorStop(1, '#05070d');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, width, height);

    // Decorative radial glow in the center
    const radial = ctx.createRadialGradient(width / 2, height / 2 - (format === 'story' ? 100 : 0), 50, width / 2, height / 2, width * 0.7);
    radial.addColorStop(0, 'rgba(139, 92, 246, 0.28)');
    radial.addColorStop(0.5, 'rgba(236, 72, 153, 0.12)');
    radial.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = radial;
    ctx.fillRect(0, 0, width, height);

    // Decorative stars / sparkles
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    const seed = 42;
    for (let i = 0; i < 60; i++) {
      const sx = ((i * 197 + seed) % width);
      const sy = ((i * 311 + seed) % height);
      const sr = (i % 3) + 1;
      ctx.beginPath();
      ctx.arc(sx, sy, sr, 0, Math.PI * 2);
      ctx.fill();
    }

    // Outer luxury gold/purple border frame
    const pad = 48;
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
    ctx.lineWidth = 3;
    ctx.strokeRect(pad, pad, width - pad * 2, height - pad * 2);

    ctx.strokeStyle = 'rgba(139, 92, 246, 0.5)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(pad + 12, pad + 12, width - (pad + 12) * 2, height - (pad + 12) * 2);

    // Header Badge: "SORTEOS PRO • CERTIFICADO OFICIAL"
    const topY = format === 'story' ? 240 : 160;
    ctx.save();
    ctx.textAlign = 'center';
    ctx.font = 'bold 28px sans-serif';
    ctx.fillStyle = '#fbbf24';
    ctx.shadowColor = 'rgba(245, 158, 11, 0.6)';
    ctx.shadowBlur = 14;
    ctx.fillText('✨ SORTEOS PRO • VERIFICADO 100% ✨', width / 2, topY);
    ctx.restore();

    // Draw Title / Platform
    ctx.textAlign = 'center';
    ctx.font = 'bold 36px sans-serif';
    ctx.fillStyle = '#cbd5e1';
    ctx.fillText(drawTitle.toUpperCase(), width / 2, topY + 60);

    // Subtitle
    ctx.font = '24px sans-serif';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText(`Plataforma: ${platform}`, width / 2, topY + 105);

    // Center Card for Winner
    const cardW = width - 200;
    const cardH = format === 'story' ? 700 : 440;
    const cardY = format === 'story' ? topY + 220 : topY + 160;
    const cardX = (width - cardW) / 2;

    // Card background
    ctx.save();
    ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
    ctx.shadowColor = 'rgba(139, 92, 246, 0.5)';
    ctx.shadowBlur = 35;
    ctx.beginPath();
    ctx.roundRect(cardX, cardY, cardW, cardH, 36);
    ctx.fill();
    ctx.strokeStyle = 'rgba(251, 191, 36, 0.6)';
    ctx.lineWidth = 3;
    ctx.stroke();
    ctx.restore();

    // Trophy icon / crown text
    const centerY = cardY + (format === 'story' ? 140 : 100);
    ctx.font = format === 'story' ? '80px sans-serif' : '64px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('🏆', width / 2, centerY);

    // "GANADOR OFICIAL" label
    ctx.font = 'bold 28px sans-serif';
    ctx.fillStyle = '#fbbf24';
    ctx.fillText('¡FELICIDADES AL GANADOR!', width / 2, centerY + 65);

    // Winner Name (Large & Glowing)
    ctx.save();
    ctx.textAlign = 'center';
    ctx.font = `900 ${format === 'story' ? '68px' : '56px'} sans-serif`;
    ctx.fillStyle = '#ffffff';
    ctx.shadowColor = '#ec4899';
    ctx.shadowBlur = 25;
    const maxLen = 22;
    const displayName = winnerName.length > maxLen ? winnerName.substring(0, maxLen) + '...' : winnerName;
    ctx.fillText(displayName, width / 2, centerY + (format === 'story' ? 170 : 145));
    ctx.restore();

    // Verified Stamp in card
    ctx.font = 'bold 24px sans-serif';
    ctx.fillStyle = '#34d399';
    ctx.fillText('✓ Selección Aleatoria Auditada Inmutable', width / 2, centerY + (format === 'story' ? 240 : 205));

    // Footer info
    const footerY = format === 'story' ? height - 320 : height - 170;
    ctx.textAlign = 'center';
    ctx.font = 'bold 22px monospace';
    ctx.fillStyle = '#94a3b8';
    ctx.fillText(`AUDIT HASH: ${auditHash.slice(0, 36)}...`, width / 2, footerY);

    ctx.font = '20px sans-serif';
    ctx.fillStyle = '#64748b';
    ctx.fillText(`Certificado expedido el ${new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}`, width / 2, footerY + 40);

    ctx.font = 'bold 26px sans-serif';
    ctx.fillStyle = '#a855f7';
    ctx.fillText('sorteospro.com', width / 2, footerY + 95);
  }, [format, winnerName, drawTitle, auditHash, platform]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(drawCard, 50);
    }
  }, [isOpen, format, drawCard]);

  if (!isOpen) return null;

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setIsGenerating(true);
    const link = document.createElement('a');
    link.download = `ganador-sorteo-${winnerName.replace(/\s+/g, '-').toLowerCase()}-${format}.png`;
    link.href = canvas.toDataURL('image/png', 1.0);
    link.click();
    setIsGenerating(false);
  };

  const handleCopy = async () => {
    const canvas = canvasRef.current;
    if (!canvas || !navigator.clipboard) return;
    try {
      setIsGenerating(true);
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        try {
          await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': blob })
          ]);
          setCopied(true);
          setTimeout(() => setCopied(false), 2500);
        } catch {
          alert('No se pudo copiar directo. Utiliza el botón de Descargar.');
        } finally {
          setIsGenerating(false);
        }
      });
    } catch {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="glass-card rounded-3xl max-w-2xl w-full border border-white/20 p-6 sm:p-8 space-y-6 max-h-[95vh] overflow-y-auto relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
          aria-label="Cerrar modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full gold-gradient-badge text-xs font-mono font-bold uppercase">
            <Camera className="w-3.5 h-3.5" />
            <span>Compartir en Redes Sociales</span>
          </div>
          <h2 className="text-2xl font-bold font-display text-white">
            Tarjeta Oficial del Ganador
          </h2>
          <p className="text-sm text-zinc-400">
            Descarga una imagen de alta resolución lista para publicar en tus historias o feed.
          </p>
        </div>

        {/* Format Selector */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setFormat('story')}
            className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
              format === 'story'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30 border border-purple-400/50'
                : 'bg-white/5 text-zinc-400 hover:bg-white/10'
            }`}
          >
            <span>📱 Formato Story (9:16)</span>
          </button>
          <button
            type="button"
            onClick={() => setFormat('post')}
            className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
              format === 'post'
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30 border border-purple-400/50'
                : 'bg-white/5 text-zinc-400 hover:bg-white/10'
            }`}
          >
            <span>🖼️ Formato Post (1:1)</span>
          </button>
        </div>

        {/* Canvas Preview Area */}
        <div className="flex justify-center items-center bg-black/40 rounded-2xl p-4 border border-white/5 overflow-hidden">
          <canvas
            ref={canvasRef}
            className={`rounded-xl shadow-2xl transition-all border border-white/10 max-h-[380px] w-auto object-contain ${
              format === 'story' ? 'aspect-[9/16]' : 'aspect-square'
            }`}
          />
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="button"
            disabled={isGenerating}
            onClick={handleDownload}
            className="btn-pro-primary flex-1 py-3.5 rounded-xl text-base flex items-center justify-center gap-2"
          >
            <Download className="w-5 h-5" />
            <span>{t('btn_export')}</span>
          </button>

          <button
            type="button"
            disabled={isGenerating}
            onClick={handleCopy}
            className="btn-pro-secondary py-3.5 px-6 rounded-xl text-base flex items-center justify-center gap-2"
          >
            {copied ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
            <span>{copied ? t('btn_copied') : t('btn_copy')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
