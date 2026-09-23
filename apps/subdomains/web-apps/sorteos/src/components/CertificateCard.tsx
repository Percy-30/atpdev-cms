"use client";

import React, { useRef, useState } from 'react';
import { Award, ShieldCheck, CheckCircle2, Download, Share2, Copy, Check } from 'lucide-react';

import { Certificate } from '@/lib/types';

export interface CertificateCardProps {
  title?: string;
  winner?: string;
  platform?: string;
  timestamp?: string;
  hash?: string;
  participantsCount?: number;
  certificate?: Certificate;
}

export const CertificateCard: React.FC<CertificateCardProps> = (props) => {
  const title = props.certificate?.giveawayTitle || props.title || 'Sorteo Verificado';
  const winner = props.winner || 'Ganador Verificado';
  const platform = props.certificate?.network || props.platform || 'Sorteos Pro';
  const timestamp = props.certificate?.issuedAt || props.timestamp || new Date().toISOString();
  const hash = props.certificate?.verificationHash || props.hash || '';
  const participantsCount = props.certificate?.totalParticipants ?? props.participantsCount ?? 0;

  const [copied, setCopied] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const formattedDate = new Date(timestamp).toLocaleDateString('es-ES', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const handleCopyHash = () => {
    navigator.clipboard.writeText(hash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4 max-w-2xl mx-auto">
      {/* Certificado con marco ornamental de lujo */}
      <div 
        ref={cardRef}
        className="relative overflow-hidden rounded-3xl p-8 sm:p-12 border-2 border-amber-500/30 bg-gradient-to-br from-[#0f172a] via-[#0b0f19] to-[#1e1b4b] shadow-2xl shadow-amber-500/10 text-center space-y-6"
      >
        {/* Esquinas ornamentales */}
        <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-amber-400/60 rounded-tl-lg" />
        <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-amber-400/60 rounded-tr-lg" />
        <div className="absolute bottom-3 left-3 w-6 h-6 border-b-2 border-l-2 border-amber-400/60 rounded-bl-lg" />
        <div className="absolute bottom-3 right-3 w-6 h-6 border-b-2 border-r-2 border-amber-400/60 rounded-br-lg" />

        {/* Marca de agua de fondo */}
        <div className="absolute -right-12 -bottom-12 opacity-5 pointer-events-none">
          <Award className="w-80 h-80 text-amber-300" />
        </div>

        {/* Encabezado */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-mono text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>Certificado Oficial de Validez</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-display text-white tracking-tight">
            Sorteos Pro Verification
          </h2>
          <p className="text-xs text-zinc-400 font-mono">
            Acreditación oficial e inmutable de selección aleatoria
          </p>
        </div>

        <div className="h-px w-24 mx-auto bg-gradient-to-r from-transparent via-amber-400 to-transparent" />

        {/* Cuerpo del Certificado */}
        <div className="space-y-3">
          <p className="text-sm text-zinc-300 uppercase tracking-widest font-mono text-[11px]">
            Se certifica que en el sorteo:
          </p>
          <p className="text-lg sm:text-xl font-bold text-white font-display">
            &ldquo;{title}&rdquo;
          </p>
          <p className="text-sm text-zinc-400">
            Realizado a través de <span className="font-semibold text-violet-400 capitalize">{platform}</span> entre <span className="text-white font-bold">{participantsCount}</span> participantes válidos.
          </p>
        </div>

        {/* Ganador Destacado */}
        <div className="py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500/10 via-pink-500/10 to-violet-500/10 border border-amber-500/30 max-w-md mx-auto space-y-1">
          <span className="text-xs font-mono font-bold uppercase text-amber-400 tracking-wider">
            Ganador(a) Oficial
          </span>
          <p className="text-2xl sm:text-3xl font-black text-white tracking-tight title-neon-glow">
            {winner}
          </p>
        </div>

        {/* Metadatos y Hash Criptográfico */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left pt-2 text-xs font-mono">
          <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-0.5">
            <span className="text-zinc-400 text-[10px] block">Fecha y Hora de Emisión:</span>
            <span className="text-white font-semibold" suppressHydrationWarning>{formattedDate}</span>
          </div>
          <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-0.5">
            <span className="text-zinc-400 text-[10px] block">Algoritmo de Selección:</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> CSPRNG Web Crypto API
            </span>
          </div>
        </div>

        {/* Hash inmutable */}
        <div className="p-3 rounded-xl bg-black/40 border border-white/10 text-left font-mono text-[11px] space-y-1">
          <div className="flex items-center justify-between text-zinc-400">
            <span>Hash Criptográfico SHA-256 (Audit Trail):</span>
            <button
              onClick={handleCopyHash}
              className="text-violet-400 hover:text-white flex items-center gap-1 text-[10px]"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'Copiado' : 'Copiar'}</span>
            </button>
          </div>
          <p className="text-zinc-300 break-all select-all font-mono-num">{hash}</p>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="flex flex-wrap items-center justify-center gap-3 print:hidden">
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-sm transition-all border border-white/10 hover:border-white/20"
        >
          <Download className="w-4 h-4 text-amber-400" />
          <span>Descargar / Imprimir Certificado</span>
        </button>
        <button
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: `Certificado de Ganador — ${winner}`,
                text: `¡Felicidades a ${winner}! Ganador oficial del sorteo "${title}". Verificado con Sorteos Pro.`,
                url: window.location.href,
              }).catch(() => {});
            } else {
              handleCopyHash();
            }
          }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-pink-600 text-white font-semibold text-sm transition-all shadow-md hover:scale-105"
        >
          <Share2 className="w-4 h-4" />
          <span>Compartir en Redes</span>
        </button>
      </div>
    </div>
  );
};

export default CertificateCard;
