"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Trophy, 
  ShieldCheck, 
  Calendar, 
  ExternalLink, 
  Share2, 
  Check, 
  Copy, 
  Users, 
  ArrowLeft,
  Sparkles,
  QrCode
} from 'lucide-react';
import { InstagramIcon, FacebookIcon, YoutubeIcon } from '@/components/SocialIcons';
import { Giveaway } from '@/lib/types';
import ConfettiEffect from '@/components/ConfettiEffect';

// Fallback demo giveaway si no existe en localStorage
const DEMO_GIVEAWAY: Giveaway = {
  id: 'sorteo-aniversario-2026',
  title: 'Sorteo Oficial de Aniversario ATP Dev',
  network: 'instagram',
  postUrl: 'https://www.instagram.com/p/DBa_9XYZ123/',
  authorUsername: 'atpdev_oficial',
  totalCommentsCount: 1420,
  rules: {
    excludeDuplicates: true,
    minMentions: 1,
    requiredHashtag: '#sorteopro',
    blockedUsers: [],
    winnersCount: 1,
    substitutesCount: 2
  },
  winners: [
    {
      id: 'win-1',
      participant: {
        id: 'p-1',
        username: 'valeria.gomez',
        commentText: '¡Me encanta este giveaway! Participando con @carlos_m y @sofia.r #sorteopro',
        isEligible: true
      },
      type: 'winner',
      position: 1,
      selectedAt: '2026-09-22T14:30:00.000Z'
    }
  ],
  substitutes: [
    {
      id: 'sub-1',
      participant: {
        id: 'p-2',
        username: 'diego_martinez99',
        commentText: 'Quiero ganar para regalarle a @mariana.paz #sorteopro',
        isEligible: true
      },
      type: 'substitute',
      position: 1,
      selectedAt: '2026-09-22T14:30:00.000Z'
    },
    {
      id: 'sub-2',
      participant: {
        id: 'p-3',
        username: 'camila_rodriguez',
        commentText: 'Participo!! @lucia.v y @andres_b #sorteopro',
        isEligible: true
      },
      type: 'substitute',
      position: 2,
      selectedAt: '2026-09-22T14:30:00.000Z'
    }
  ],
  status: 'finished',
  createdAt: '2026-09-22T14:30:00.000Z',
  certificateId: 'CERT-SP-98A41E8D',
  verificationHash: '98a41e8dc34f6782b3a2e1d0987fa421990c8b23f54316a7e029d5b4129e160a'
};

export default function SorteoPublicoPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = React.use(params);
  const [giveaway, setGiveaway] = useState<Giveaway>(DEMO_GIVEAWAY);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = JSON.parse(localStorage.getItem('sorteos_pro_db') || '{}');
      if (stored[resolvedParams.id]) {
        setGiveaway(stored[resolvedParams.id]);
      }
    }
  }, [resolvedParams.id]);

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const getNetworkIcon = () => {
    switch (giveaway.network) {
      case 'instagram':
        return <InstagramIcon className="w-4 h-4 text-pink-400" />;
      case 'facebook':
        return <FacebookIcon className="w-4 h-4 text-blue-400" />;
      case 'youtube':
        return <YoutubeIcon className="w-4 h-4 text-red-400" />;
      default:
        return <Sparkles className="w-4 h-4 text-purple-400" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <ConfettiEffect />

      {/* Back nav & breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-mono text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Volver al inicio</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyLink}
            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-zinc-300 transition-colors flex items-center gap-1.5"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
            <span>{copied ? '¡Enlace Copiado!' : 'Compartir Sorteo'}</span>
          </button>

          <Link
            href={`/certificados/${giveaway.certificateId || 'CERT-SP-98A41E8D'}`}
            className="px-3.5 py-1.5 rounded-xl gold-gradient-badge text-black text-xs font-bold font-display flex items-center gap-1.5 shadow-md shadow-amber-500/20"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Ver Certificado</span>
          </Link>
        </div>
      </div>

      {/* Public Giveaway Header Card */}
      <div className="glass-card rounded-3xl p-6 sm:p-10 border border-white/10 space-y-6 relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-mono text-zinc-300 flex items-center gap-1.5">
              {getNetworkIcon()}
              <span className="capitalize">{giveaway.network}</span>
            </span>
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-mono text-emerald-400 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Resultado Auditado y Verificado</span>
            </span>
          </div>

          <div className="text-xs font-mono text-zinc-400 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5" />
            <span>{new Date(giveaway.createdAt).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
          </div>
        </div>

        <div>
          <h1 className="text-2xl sm:text-4xl font-black font-display text-white tracking-tight">
            {giveaway.title}
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-2 flex items-center gap-2 flex-wrap">
            <span>Organizado por: <strong className="text-white">@{giveaway.authorUsername || 'anfitrión'}</strong></span>
            {giveaway.postUrl && (
              <>
                <span className="text-zinc-600">•</span>
                <a
                  href={giveaway.postUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-400 hover:text-purple-300 underline underline-offset-4 flex items-center gap-1 font-mono text-xs"
                >
                  <span>Ver post original</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </>
            )}
          </p>
        </div>
      </div>

      {/* Official Winners Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl gold-gradient-badge flex items-center justify-center">
            <Trophy className="w-4 h-4 text-amber-950" />
          </div>
          <h2 className="text-xl font-bold font-display text-white">
            Ganador(es) Oficial(es)
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {giveaway.winners.map((winner, idx) => (
            <div
              key={winner.id}
              className="glass-card rounded-2xl p-6 border border-amber-500/30 bg-gradient-to-r from-amber-500/10 via-white/[0.02] to-transparent space-y-3 relative overflow-hidden"
            >
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-400 text-black font-black font-display text-lg flex items-center justify-center shadow-lg shadow-amber-400/20">
                    #{winner.position}
                  </div>
                  <div>
                    <span className="text-xs font-mono uppercase text-amber-400 font-bold">Ganador Titular</span>
                    <h3 className="text-lg sm:text-xl font-bold font-mono text-white">
                      @{winner.participant.username}
                    </h3>
                  </div>
                </div>

                <div className="px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/20 text-xs font-mono text-amber-300">
                  Verificado ✅
                </div>
              </div>

              {winner.participant.commentText && (
                <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 text-xs text-zinc-300 italic">
                  &ldquo;{winner.participant.commentText}&rdquo;
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Substitutes Section */}
      {giveaway.substitutes && giveaway.substitutes.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-400" />
            <h2 className="text-lg font-bold font-display text-white">
              Suplentes de Reserva ({giveaway.substitutes.length})
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {giveaway.substitutes.map((sub) => (
              <div
                key={sub.id}
                className="glass-card rounded-2xl p-4 border border-white/10 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-zinc-400">Suplente #{sub.position}</span>
                  <span className="text-[10px] font-mono text-zinc-500">Reserva</span>
                </div>
                <div className="font-bold font-mono text-white text-sm">
                  @{sub.participant.username}
                </div>
                {sub.participant.commentText && (
                  <p className="text-zinc-400 italic line-clamp-2">
                    &ldquo;{sub.participant.commentText}&rdquo;
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Audit & Cryptographic Transparency */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2 border-b border-white/5 pb-3">
          <div className="flex items-center gap-2 text-sm font-bold text-white font-display">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Auditoría y Transparencia del Algoritmo</span>
          </div>
          <span className="text-xs font-mono text-zinc-500">
            ID: {giveaway.id}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
            <span className="text-zinc-500 block">Comentarios Analizados:</span>
            <span className="text-white font-bold text-sm">{giveaway.totalCommentsCount}</span>
          </div>
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
            <span className="text-zinc-500 block">Filtro Duplicados:</span>
            <span className="text-white font-bold text-sm">
              {giveaway.rules.excludeDuplicates ? 'Activo (1 por persona)' : 'Inactivo'}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-white/[0.02] border border-white/5">
            <span className="text-zinc-500 block">Menciones Requeridas:</span>
            <span className="text-white font-bold text-sm">{giveaway.rules.minMentions} mención(es)</span>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 text-xs font-mono space-y-1">
          <span className="text-zinc-500 text-[11px] block">Hash Criptográfico SHA-256 Inmutable:</span>
          <span className="text-emerald-400 break-all">{giveaway.verificationHash}</span>
        </div>
      </div>
    </div>
  );
}
