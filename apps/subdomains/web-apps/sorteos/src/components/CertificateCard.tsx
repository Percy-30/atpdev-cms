"use client";

import React, { useRef, useState } from 'react';
import { Award, ShieldCheck, CheckCircle2, Download, Share2, Copy, Check, Users, Trophy } from 'lucide-react';
import { InstagramIcon, FacebookIcon, YoutubeIcon, TikTokIcon, XIcon, ThreadsIcon } from '@/components/SocialIcons';
import { Certificate, Winner } from '@/lib/types';

export interface CertificateCardProps {
  title?: string;
  winner?: string;
  winnerComment?: string;
  platform?: string;
  timestamp?: string;
  hash?: string;
  participantsCount?: number;
  certificate?: Certificate;
  winners?: Winner[];
}

const NETWORK_METADATA: Record<string, { label: string; icon: React.ComponentType<{ className?: string }>; color: string; badgeBg: string }> = {
  youtube: {
    label: 'YouTube',
    icon: YoutubeIcon,
    color: 'text-red-500',
    badgeBg: 'bg-red-500/15 border-red-500/30 text-red-400'
  },
  tiktok: {
    label: 'TikTok',
    icon: TikTokIcon,
    color: 'text-cyan-400',
    badgeBg: 'bg-cyan-500/15 border-cyan-500/30 text-cyan-400'
  },
  instagram: {
    label: 'Instagram',
    icon: InstagramIcon,
    color: 'text-pink-500',
    badgeBg: 'bg-pink-500/15 border-pink-500/30 text-pink-400'
  },
  facebook: {
    label: 'Facebook',
    icon: FacebookIcon,
    color: 'text-blue-500',
    badgeBg: 'bg-blue-500/15 border-blue-500/30 text-blue-400'
  },
  x: {
    label: 'X (Twitter)',
    icon: XIcon,
    color: 'text-slate-200',
    badgeBg: 'bg-white/10 border-white/20 text-white'
  },
  threads: {
    label: 'Threads',
    icon: ThreadsIcon,
    color: 'text-purple-400',
    badgeBg: 'bg-purple-500/15 border-purple-500/30 text-purple-400'
  },
};

export const CertificateCard: React.FC<CertificateCardProps> = (props) => {
  const cert = props.certificate;
  const title = cert?.giveawayTitle || props.title || 'Sorteo Verificado';
  const rawPlatform = (cert?.network || cert?.platform || props.platform || 'youtube').toLowerCase();
  const netMeta = NETWORK_METADATA[rawPlatform] || {
    label: rawPlatform.toUpperCase(),
    icon: Trophy,
    color: 'text-amber-400',
    badgeBg: 'bg-amber-500/15 border-amber-500/30 text-amber-400'
  };
  const NetIcon = netMeta.icon;

  const timestamp = cert?.issuedAt || cert?.createdAt || props.timestamp || new Date().toISOString();
  const hash = cert?.verificationHash || props.hash || '';
  const participantsCount = cert?.totalParticipants ?? props.participantsCount ?? 0;

  // Resolver lista de ganadores oficiales
  const winnersList: Array<{ username: string; comment?: string }> = [];
  const certWinners = cert?.winners || props.winners;

  if (certWinners && Array.isArray(certWinners) && certWinners.length > 0) {
    for (const w of certWinners) {
      if (w.participant) {
        const u = w.participant.username;
        winnersList.push({
          username: u.startsWith('@') ? u : `@${u}`,
          comment: w.participant.commentText
        });
      }
    }
  }

  // Fallback si no viene array de ganadores pero viene username
  if (winnersList.length === 0) {
    const singleUser = cert?.winnerUsername || props.winner;
    if (singleUser && singleUser !== 'Ganador Verificado') {
      winnersList.push({
        username: singleUser.startsWith('@') ? singleUser : `@${singleUser}`,
        comment: cert?.winnerComment || props.winnerComment
      });
    } else {
      winnersList.push({
        username: '@Ganador_Verificado',
        comment: cert?.winnerComment || props.winnerComment
      });
    }
  }

  const primaryWinner = winnersList[0];
  const additionalWinners = winnersList.slice(1);

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
            <span>Certificado Oficial de Validez Criptográfica</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black font-display text-white tracking-tight">
            Sorteos Pro Verification
          </h2>

          <div className="flex items-center justify-center gap-2 pt-1">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-mono font-bold ${netMeta.badgeBg}`}>
              <NetIcon className="w-3.5 h-3.5" />
              <span>Red Social Oficial: {netMeta.label}</span>
            </span>
          </div>
        </div>

        <div className="h-px w-24 mx-auto bg-gradient-to-r from-transparent via-amber-400 to-transparent" />

        {/* Cuerpo del Certificado */}
        <div className="space-y-2">
          <p className="text-xs text-zinc-300 uppercase tracking-widest font-mono">
            Se certifica formal e inmutablemente el sorteo:
          </p>
          <p className="text-lg sm:text-2xl font-bold text-white font-display">
            &ldquo;{title}&rdquo;
          </p>
          <p className="text-xs sm:text-sm text-zinc-400">
            Realizado a través de <span className="font-semibold text-white capitalize">{netMeta.label}</span> entre <span className="text-white font-bold">{participantsCount}</span> participantes analizados.
          </p>
        </div>

        {/* Ganador(a) Principal Destacado */}
        <div className="py-5 px-6 rounded-2xl bg-gradient-to-r from-amber-500/15 via-pink-500/10 to-violet-500/15 border-2 border-amber-500/40 max-w-lg mx-auto space-y-2 shadow-xl shadow-amber-500/5">
          <div className="flex items-center justify-center gap-1.5 text-xs font-mono font-bold uppercase text-amber-400 tracking-wider">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>Ganador(a) Oficial Titular</span>
          </div>
          
          <div className="text-2xl sm:text-4xl font-black text-white tracking-tight title-neon-glow font-mono flex items-center justify-center gap-2 flex-wrap">
            <span>{primaryWinner.username}</span>
            <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
          </div>

          {primaryWinner.comment && (
            <p className="text-xs sm:text-sm text-amber-100/90 italic max-w-md mx-auto line-clamp-3 font-sans pt-1">
              &ldquo;{primaryWinner.comment}&rdquo;
            </p>
          )}

          <div className="pt-2 flex items-center justify-center gap-2 text-[11px] font-mono text-zinc-400 flex-wrap">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/10 text-white font-semibold">
              <NetIcon className={`w-3 h-3 ${netMeta.color}`} />
              <span>{netMeta.label}</span>
            </span>
            <span>• Cuenta Auditada y Verificada</span>
          </div>
        </div>

        {/* Ganadores Adicionales (si hubieran más de 1) */}
        {additionalWinners.length > 0 && (
          <div className="space-y-2 max-w-md mx-auto text-left">
            <div className="text-xs font-mono text-amber-400 uppercase tracking-wider font-bold">
              Ganadores Adicionales ({additionalWinners.length}):
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {additionalWinners.map((w, idx) => (
                <div key={idx} className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-mono">
                  <div className="font-bold text-white flex items-center gap-1">
                    <span className="text-amber-400">#{idx + 2}</span>
                    <span>{w.username}</span>
                  </div>
                  {w.comment && (
                    <div className="text-zinc-400 text-[11px] truncate mt-0.5">&ldquo;{w.comment}&rdquo;</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Metadatos y Hash Criptográfico */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-left pt-2 text-xs font-mono">
          <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-0.5">
            <span className="text-zinc-400 text-[10px] block">Red Social:</span>
            <span className="text-white font-semibold flex items-center gap-1.5">
              <NetIcon className={`w-3.5 h-3.5 ${netMeta.color}`} />
              <span>{netMeta.label}</span>
            </span>
          </div>
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
        <div className="p-3.5 rounded-xl bg-black/40 border border-white/10 text-left font-mono text-[11px] space-y-1">
          <div className="flex items-center justify-between text-zinc-400">
            <span>Hash Criptográfico SHA-256 (Audit Trail Inmutable):</span>
            <button
              onClick={handleCopyHash}
              className="text-violet-400 hover:text-white flex items-center gap-1 text-[10px] cursor-pointer"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'Copiado' : 'Copiar'}</span>
            </button>
          </div>
          <p className="text-zinc-300 break-all select-all font-mono-num">{hash}</p>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="flex flex-wrap items-center justify-center gap-4 pt-2 print:hidden">
        <button
          onClick={handlePrint}
          className="btn-pro-gold py-3.5 px-6 text-sm flex items-center gap-2 cursor-pointer"
        >
          <Download className="w-4 h-4 text-amber-950" />
          <span>Descargar / Imprimir Certificado</span>
        </button>
        <button
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: `Certificado de Ganador Oficial — ${primaryWinner.username}`,
                text: `¡Felicidades a ${primaryWinner.username}! Ganador oficial en ${netMeta.label} del sorteo "${title}". Certificado verificable por Sorteos Pro.`,
                url: window.location.href,
              }).catch(() => {});
            } else {
              handleCopyHash();
            }
          }}
          className="btn-pro-primary py-3.5 px-6 text-sm flex items-center gap-2 cursor-pointer"
        >
          <Share2 className="w-4 h-4 text-pink-200" />
          <span>Compartir en Redes</span>
        </button>
      </div>
    </div>
  );
};

export default CertificateCard;
