"use client";

import React, { useState, useEffect, useRef } from 'react';
import { playCountdownTick, playDrumRoll } from '@/lib/soundEffects';
import { useLanguage } from '@/context/LanguageContext';

export interface Countdown3DOverlayProps {
  active: boolean;
  seconds?: number;
  onComplete: () => void;
  title?: string;
  animationType?: 'countdown' | 'wheel' | 'card' | 'lottery';
  themeColor?: string;
}

export const Countdown3DOverlay: React.FC<Countdown3DOverlayProps> = ({
  active,
  seconds = 3,
  onComplete,
  title,
  animationType = 'countdown',
  themeColor = '#d91a7a'
}) => {
  const { t } = useLanguage();
  const displayTitle = title || t('countdown_drawing_title');
  const [currentCount, setCurrentCount] = useState<number>(seconds);
  const [isFlipping, setIsFlipping] = useState<boolean>(false);
  const [wheelRotation, setWheelRotation] = useState<number>(0);

  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  });

  useEffect(() => {
    if (!active) {
      setCurrentCount(seconds);
      setWheelRotation(0);
      return;
    }

    setCurrentCount(seconds);
    setIsFlipping(true);
    playCountdownTick(false);
    playDrumRoll(seconds);

    // Initial spin burst for wheel or bolillero
    setWheelRotation(1440 + Math.floor(Math.random() * 360));

    let count = seconds;
    let flipTimeout: NodeJS.Timeout | null = null;
    let finishTimeout: NodeJS.Timeout | null = null;

    const interval = setInterval(() => {
      count--;
      if (count > 0) {
        setCurrentCount(count);
        setIsFlipping(false);
        flipTimeout = setTimeout(() => setIsFlipping(true), 20);
        playCountdownTick(count === 1);
      } else {
        clearInterval(interval);
        setCurrentCount(0);
        finishTimeout = setTimeout(() => {
          onCompleteRef.current();
        }, 500);
      }
    }, 1000);

    return () => {
      clearInterval(interval);
      if (flipTimeout) clearTimeout(flipTimeout);
      if (finishTimeout) clearTimeout(finishTimeout);
    };
  }, [active, seconds]);

  if (!active) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center p-4 bg-black/90 backdrop-blur-md select-none animate-in fade-in duration-200">
      {/* Ambient glow */}
      <div 
        className="absolute w-96 h-96 rounded-full blur-[110px] pointer-events-none animate-pulse"
        style={{ backgroundColor: `${themeColor}40` }}
      />
      <div className="absolute w-80 h-80 bg-amber-500/20 rounded-full blur-[90px] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center space-y-6 text-center max-w-lg w-full">
        {/* Title badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full gold-gradient-badge text-xs font-mono font-bold uppercase tracking-widest animate-pulse">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          <span>{displayTitle}</span>
        </div>

        {/* ─── ANIMACIÓN 1: RULETA (WHEEL) ─── */}
        {animationType === 'wheel' && (
          <div className="py-4 relative flex flex-col items-center">
            {/* Top golden ticker needle */}
            <div className="relative z-20 w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[22px] border-t-amber-400 drop-shadow-[0_4px_12px_rgba(245,158,11,0.8)] -mb-3 animate-bounce" />
            
            {/* Spinning Wheel */}
            <div 
              className="w-56 h-56 sm:w-64 sm:h-64 rounded-full border-4 border-amber-300 shadow-[0_0_60px_rgba(245,158,11,0.4)] relative overflow-hidden transition-transform duration-[2800ms] cubic-bezier(0.15, 0.9, 0.25, 1)"
              style={{
                transform: `rotate(${wheelRotation}deg)`,
                background: `conic-gradient(
                  ${themeColor} 0deg 45deg,
                  #f59e0b 45deg 90deg,
                  #8b5cf6 90deg 135deg,
                  #06b6d4 135deg 180deg,
                  ${themeColor} 180deg 225deg,
                  #ec4899 225deg 270deg,
                  #10b981 270deg 315deg,
                  #3b82f6 315deg 360deg
                )`
              }}
            >
              {/* Spokes */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-[2px] bg-white/40" />
                <div className="w-full h-[2px] bg-white/40 rotate-45" />
                <div className="w-full h-[2px] bg-white/40 rotate-90" />
                <div className="w-full h-[2px] bg-white/40 rotate-[135deg]" />
              </div>
            </div>

            {/* Center Chrome Hub */}
            <div 
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 w-16 h-16 rounded-full bg-gradient-to-tr from-amber-200 via-white to-amber-100 shadow-2xl border-4 flex items-center justify-center"
              style={{ borderColor: themeColor }}
            >
              <span className="text-xl font-black text-slate-900 animate-spin-slow">★</span>
            </div>

            <div className="mt-4 text-xs font-mono font-bold uppercase tracking-widest text-amber-300 animate-pulse">
              Girando la Ruleta de la Suerte...
            </div>
          </div>
        )}

        {/* ─── ANIMACIÓN 2: CARTAS (CARD) ─── */}
        {animationType === 'card' && (
          <div className="py-6 flex flex-col items-center">
            <div className="relative w-64 h-52 flex items-center justify-center perspective-1000">
              {/* Card 1 Left */}
              <div 
                className="absolute w-28 h-40 rounded-2xl shadow-2xl border-2 border-white/60 transform -rotate-15 -translate-x-12 transition-all duration-700 flex flex-col items-center justify-center text-white"
                style={{
                  background: `linear-gradient(135deg, #0f172a 0%, ${themeColor} 100%)`,
                }}
              >
                <span className="text-3xl font-black font-display opacity-30">?</span>
              </div>

              {/* Card 3 Right */}
              <div 
                className="absolute w-28 h-40 rounded-2xl shadow-2xl border-2 border-white/60 transform rotate-15 translate-x-12 transition-all duration-700 flex flex-col items-center justify-center text-white"
                style={{
                  background: `linear-gradient(135deg, ${themeColor} 0%, #0f172a 100%)`,
                }}
              >
                <span className="text-3xl font-black font-display opacity-30">?</span>
              </div>

              {/* Card 2 Center Highlight */}
              <div 
                className={`relative z-10 w-32 h-46 rounded-2xl shadow-[0_0_50px_rgba(245,158,11,0.5)] border-2 border-amber-300 flex flex-col items-center justify-between p-3.5 text-white transition-all duration-500 ${
                  currentCount === 0 ? 'scale-110 rotate-y-180' : 'scale-105 animate-pulse'
                }`}
                style={{
                  background: `linear-gradient(135deg, ${themeColor} 0%, #1e1b4b 100%)`,
                }}
              >
                <div className="flex justify-between w-full text-xs font-mono text-amber-300">
                  <span>★</span>
                  <span>★</span>
                </div>
                <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/50 shadow-inner">
                  <span className="text-2xl font-black font-display text-amber-300">
                    {currentCount > 0 ? '?' : '🏆'}
                  </span>
                </div>
                <span className="text-[11px] font-bold font-mono tracking-widest text-amber-300 uppercase">
                  {currentCount > 0 ? 'Barajando' : '¡Ganador!'}
                </span>
              </div>
            </div>

            <div className="mt-4 text-xs font-mono font-bold uppercase tracking-widest text-amber-300 animate-pulse">
              Barajando Cartas Misteriosas...
            </div>
          </div>
        )}

        {/* ─── ANIMACIÓN 3: BOLILLERO (LOTTERY) ─── */}
        {animationType === 'lottery' && (
          <div className="py-4 flex flex-col items-center">
            <div className="relative w-56 h-56 sm:w-64 sm:h-64 flex items-center justify-center">
              {/* Glass Sphere */}
              <div 
                className="w-52 h-52 sm:w-60 sm:h-60 rounded-full border-4 border-amber-300/80 relative overflow-hidden shadow-[0_0_60px_rgba(245,158,11,0.35)] flex items-center justify-center"
                style={{
                  background: `radial-gradient(circle at 35% 35%, rgba(255,255,255,0.4), rgba(20,20,40,0.85) 75%)`,
                }}
              >
                {/* Shiny Reflection */}
                <div className="absolute top-3 left-6 w-16 h-8 bg-white/40 rounded-full transform -rotate-30 blur-[2px]" />

                {/* Bouncing Lottery Balls */}
                <div className="relative w-40 h-40">
                  <div className="absolute top-2 left-4 w-10 h-10 rounded-full bg-gradient-to-tr from-amber-600 to-amber-300 text-slate-950 font-black text-xs flex items-center justify-center shadow-lg animate-bounce">
                    #7
                  </div>
                  <div className="absolute bottom-4 left-6 w-11 h-11 rounded-full bg-gradient-to-tr from-pink-600 to-rose-400 text-white font-black text-xs flex items-center justify-center shadow-lg animate-pulse">
                    #21
                  </div>
                  <div className="absolute top-6 right-4 w-11 h-11 rounded-full bg-gradient-to-tr from-blue-600 to-cyan-400 text-white font-black text-xs flex items-center justify-center shadow-lg animate-bounce" style={{ animationDelay: '0.2s' }}>
                    #58
                  </div>
                  <div className="absolute bottom-5 right-5 w-10 h-10 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-400 text-white font-black text-xs flex items-center justify-center shadow-lg animate-pulse" style={{ animationDelay: '0.35s' }}>
                    #42
                  </div>
                  <div 
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full shadow-2xl text-white font-black text-sm flex items-center justify-center border-2 border-white animate-spin-slow"
                    style={{ backgroundColor: themeColor }}
                  >
                    ★
                  </div>
                </div>
              </div>

              {/* Sphere Base */}
              <div className="absolute -bottom-2 w-28 h-4 bg-gradient-to-r from-amber-600 via-amber-400 to-amber-600 rounded-b-xl shadow-lg" />
            </div>

            <div className="mt-4 text-xs font-mono font-bold uppercase tracking-widest text-amber-300 animate-pulse">
              Extrayendo Bolilla de Lotería...
            </div>
          </div>
        )}

        {/* ─── ANIMACIÓN 4: CUENTA REGRESIVA 3D (COUNTDOWN DEFAULT) ─── */}
        {animationType === 'countdown' && (
          <div className="perspective-1000 py-4">
            <div
              className={`w-40 h-40 sm:w-52 sm:h-52 rounded-3xl glass-card border-2 border-amber-400/80 shadow-[0_0_60px_rgba(245,158,11,0.35)] flex items-center justify-center transition-all duration-500 ${
                isFlipping
                  ? 'scale-105 rotate-x-0 opacity-100'
                  : 'scale-90 rotate-x-90 opacity-0'
              }`}
              style={{
                transformStyle: 'preserve-3d',
                WebkitTransformStyle: 'preserve-3d',
                backgroundColor: `${themeColor}20`
              }}
            >
              <span className="text-7xl sm:text-9xl font-black font-display text-white title-neon-glow drop-shadow-[0_0_30px_rgba(255,255,255,0.9)]">
                {currentCount > 0 ? currentCount : '🎉'}
              </span>
            </div>
            <div className="mt-4 text-xs font-mono font-bold uppercase tracking-widest text-amber-300 animate-pulse">
              Cuenta Regresiva 3D
            </div>
          </div>
        )}

        <p className="text-xs sm:text-sm font-mono text-zinc-400 animate-pulse tracking-wide">
          {t('countdown_csprng_sub')}
        </p>

        {/* Skip button for user control */}
        <button
          type="button"
          onClick={onComplete}
          className="text-xs text-zinc-500 hover:text-zinc-300 font-mono underline transition-colors pt-2 cursor-pointer"
        >
          {t('countdown_skip')}
        </button>
      </div>
    </div>
  );
};
