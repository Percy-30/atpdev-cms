"use client";

import React, { useState, useEffect } from 'react';
import { playCountdownTick, playDrumRoll } from '@/lib/soundEffects';

export interface Countdown3DOverlayProps {
  active: boolean;
  seconds?: number;
  onComplete: () => void;
  title?: string;
}

export const Countdown3DOverlay: React.FC<Countdown3DOverlayProps> = ({
  active,
  seconds = 3,
  onComplete,
  title = 'Sorteando al azar...'
}) => {
  const [currentCount, setCurrentCount] = useState<number>(seconds);
  const [isFlipping, setIsFlipping] = useState<boolean>(false);

  useEffect(() => {
    if (!active) {
      setCurrentCount(seconds);
      return;
    }

    setCurrentCount(seconds);
    setIsFlipping(true);
    playCountdownTick(false);
    playDrumRoll(seconds);

    let count = seconds;
    const interval = setInterval(() => {
      count--;
      if (count > 0) {
        setCurrentCount(count);
        setIsFlipping(false);
        setTimeout(() => setIsFlipping(true), 20);
        playCountdownTick(count === 1);
      } else {
        clearInterval(interval);
        setCurrentCount(0);
        setTimeout(() => {
          onComplete();
        }, 400);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [active, seconds, onComplete]);

  if (!active) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 bg-black/85 backdrop-blur-md select-none animate-in fade-in duration-200">
      {/* Ambient glow */}
      <div className="absolute w-96 h-96 bg-purple-600/25 rounded-full blur-[100px] pointer-events-none animate-pulse" />
      <div className="absolute w-80 h-80 bg-amber-500/20 rounded-full blur-[90px] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center space-y-6 text-center">
        {/* Title badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full gold-gradient-badge text-xs font-mono font-bold uppercase tracking-widest animate-pulse">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          <span>{title}</span>
        </div>

        {/* 3D Rotating Countdown Number Box */}
        <div className="perspective-1000 py-4">
          <div
            className={`w-40 h-40 sm:w-52 sm:h-52 rounded-3xl glass-card border-2 border-amber-400/80 shadow-[0_0_60px_rgba(245,158,11,0.35)] flex items-center justify-center transition-all duration-500 ${
              isFlipping
                ? 'scale-105 rotate-x-0 opacity-100'
                : 'scale-90 rotate-x-90 opacity-0'
            }`}
            style={{
              transformStyle: 'preserve-3d',
              WebkitTransformStyle: 'preserve-3d'
            }}
          >
            <span className="text-7xl sm:text-9xl font-black font-display text-white title-neon-glow drop-shadow-[0_0_30px_rgba(255,255,255,0.9)]">
              {currentCount > 0 ? currentCount : '🎉'}
            </span>
          </div>
        </div>

        <p className="text-xs sm:text-sm font-mono text-zinc-400 animate-pulse tracking-wide">
          Algoritmo CSPRNG calculando resultado inmutable...
        </p>

        {/* Skip button for user control */}
        <button
          type="button"
          onClick={onComplete}
          className="text-xs text-zinc-500 hover:text-zinc-300 font-mono underline transition-colors pt-4"
        >
          Omitir cuenta regresiva ⚡
        </button>
      </div>
    </div>
  );
};
