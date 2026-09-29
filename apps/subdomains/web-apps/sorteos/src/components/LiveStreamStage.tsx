"use client";

import React, { useState, useEffect } from 'react';
import { Trophy, Sparkles, X, Volume2, VolumeX, Share2, RotateCcw, CheckCircle2, Maximize, Minimize } from 'lucide-react';
import { ConfettiEffect } from './ConfettiEffect';
import { WinnerExportModal } from './WinnerExportModal';
import { playCountdownTick, playWinnerFanfare, isAudioMuted, toggleAudioMute } from '@/lib/soundEffects';

export interface LiveStreamStageProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  winner: string | null;
  substitutes?: string[];
  auditHash?: string;
  onReroll?: () => void;
  platform?: string;
}

export const LiveStreamStage: React.FC<LiveStreamStageProps> = ({
  isOpen,
  onClose,
  title,
  winner,
  substitutes = [],
  auditHash = '',
  onReroll,
  platform = 'Sorteos Pro'
}) => {
  const [countdown, setCountdown] = useState<number | null>(null);
  const [revealed, setRevealed] = useState<boolean>(false);
  const [showExportModal, setShowExportModal] = useState<boolean>(false);
  const [muted, setMuted] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  useEffect(() => {
    setMuted(isAudioMuted());
  }, []);

  // Iniciar cuenta regresiva al abrir
  useEffect(() => {
    if (isOpen) {
      setRevealed(false);
      setCountdown(3);

      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev === null) return null;
          if (prev > 1) {
            playCountdownTick(false);
            return prev - 1;
          }
          if (prev === 1) {
            playCountdownTick(true);
            setTimeout(() => {
              setRevealed(true);
              playWinnerFanfare();
            }, 600);
            return 0;
          }
          return 0;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isOpen, winner]);

  if (!isOpen) return null;

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const handleToggleMute = () => {
    setMuted(toggleAudioMute());
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-between p-6 sm:p-12 presentation-backdrop select-none overflow-hidden animate-in fade-in duration-300">
      <ConfettiEffect active={revealed} />

      {/* Top Bar for Streamers */}
      <div className="w-full max-w-6xl flex items-center justify-between gap-4 z-10">
        <div className="flex items-center gap-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/20 border border-red-500/40 text-red-400 text-xs font-mono font-bold uppercase tracking-wider animate-pulse">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
            <span>MODO EN VIVO / STREAMING</span>
          </div>
          <span className="text-zinc-400 text-sm hidden sm:inline">• {title}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleToggleMute}
            aria-label="Silenciar / Activar Sonido"
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            {muted ? <VolumeX className="w-5 h-5 text-zinc-400" /> : <Volume2 className="w-5 h-5 text-amber-400" />}
          </button>
          <button
            type="button"
            onClick={handleToggleFullscreen}
            aria-label="Pantalla Completa"
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            {isFullscreen ? <Minimize className="w-5 h-5 text-purple-400" /> : <Maximize className="w-5 h-5" />}
          </button>
          <button
            type="button"
            onClick={onClose}
            aria-label="Salir del modo en vivo"
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Center Stage */}
      <div className="flex-1 flex flex-col items-center justify-center text-center max-w-4xl w-full z-10 py-8">
        {!revealed ? (
          /* Dramatic Countdown */
          <div className="space-y-6 flex flex-col items-center">
            <span className="text-sm sm:text-base font-mono uppercase tracking-widest text-amber-400 font-bold animate-pulse">
              Revelando al ganador en...
            </span>
            <div className="w-40 h-40 sm:w-56 sm:h-56 rounded-full flex items-center justify-center border-4 border-amber-400/40 bg-white/5 backdrop-blur-xl shadow-[0_0_50px_rgba(245,158,11,0.3)] animate-ping-once">
              <span className="text-7xl sm:text-9xl font-black font-display text-white drop-shadow-[0_0_25px_rgba(255,255,255,0.8)]">
                {countdown && countdown > 0 ? countdown : '🎉'}
              </span>
            </div>
            <p className="text-sm font-mono text-zinc-400">
              Verificación criptográfica en curso...
            </p>
          </div>
        ) : (
          /* Grand Reveal */
          <div className="space-y-8 animate-in zoom-in-95 duration-500 w-full">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full gold-gradient-badge text-sm font-mono font-bold uppercase tracking-wider">
              <Trophy className="w-4 h-4 text-amber-300" />
              <span>¡Ganador Seleccionado con Éxito!</span>
            </div>

            {/* Glowing Winner Banner */}
            <div className="p-8 sm:p-14 rounded-3xl glass-card border-2 border-amber-400/60 shadow-[0_0_80px_rgba(245,158,11,0.25)] space-y-4 relative overflow-hidden">
              <div className="text-6xl sm:text-8xl">👑</div>
              <h2 className="text-4xl sm:text-7xl font-black font-display text-white tracking-tight drop-shadow-[0_0_35px_rgba(255,255,255,0.7)] break-words">
                {winner || 'Participante'}
              </h2>
              <div className="inline-flex items-center gap-2 text-sm sm:text-base font-mono text-emerald-400 font-bold">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                <span>Resultado Transparente y 100% Inmutable</span>
              </div>
            </div>

            {/* Substitutes if available */}
            {substitutes.length > 0 && (
              <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                <span className="text-xs font-mono text-zinc-400 uppercase">Suplentes:</span>
                {substitutes.map((sub, i) => (
                  <span key={i} className="px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-xs font-mono text-zinc-300">
                    #{i + 1} {sub}
                  </span>
                ))}
              </div>
            )}

            {/* Audit Hash */}
            {auditHash && (
              <div className="text-xs font-mono text-zinc-400 flex items-center justify-center gap-2">
                <span className="text-zinc-500">Hash de auditoría:</span>
                <span className="text-amber-400/80 font-bold">{auditHash.slice(0, 32)}...</span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Controls */}
      <div className="w-full max-w-2xl flex flex-wrap items-center justify-center gap-4 z-10">
        {revealed && (
          <>
            <button
              type="button"
              onClick={() => setShowExportModal(true)}
              className="btn-pro-primary py-3.5 px-6 rounded-2xl text-base flex items-center gap-2"
            >
              <Share2 className="w-5 h-5" />
              <span>📸 Exportar Tarjeta para Redes</span>
            </button>

            {onReroll && (
              <button
                type="button"
                onClick={() => {
                  setRevealed(false);
                  setCountdown(3);
                  onReroll();
                }}
                className="btn-pro-secondary py-3.5 px-6 rounded-2xl text-base flex items-center gap-2"
              >
                <RotateCcw className="w-5 h-5" />
                <span>Volver a Sortear</span>
              </button>
            )}
          </>
        )}
      </div>

      {/* Export to Social Media Modal */}
      {winner && (
        <WinnerExportModal
          isOpen={showExportModal}
          onClose={() => setShowExportModal(false)}
          winnerName={winner}
          drawTitle={title}
          auditHash={auditHash}
          platform={platform}
        />
      )}
    </div>
  );
};
