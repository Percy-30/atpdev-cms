"use client";

import React, { useState, useEffect } from 'react';
import { Coins, RotateCw, History, Trophy, Sparkles, CheckCircle2, Volume2, VolumeX, Maximize2, Minimize2 } from 'lucide-react';
import { flipCoin, generateSha256Hash } from '@/lib/randomEngine';
import { ToolSwitcher } from '@/components/ToolSwitcher';
import { playCoinFlipSound, playCoinLandSound, isAudioMuted, toggleAudioMute } from '@/lib/soundEffects';

export default function MonedaPage() {
  const [result, setResult] = useState<'cara' | 'cruz'>('cara');
  const [isFlipping, setIsFlipping] = useState<boolean>(false);
  const [rotations, setRotations] = useState<number>(0);
  const [history, setHistory] = useState<('cara' | 'cruz')[]>(['cara']);
  const [lastHash, setLastHash] = useState<string>('');
  const [muted, setMuted] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  useEffect(() => {
    setMuted(isAudioMuted());
  }, []);

  const handleToggleSound = () => {
    const nextMuted = toggleAudioMute();
    setMuted(nextMuted);
  };

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const handleFlip = async () => {
    if (isFlipping) return;
    setIsFlipping(true);

    const outcome = flipCoin();
    const targetOffset = outcome === 'cara' ? 0 : 180;
    const currentTurns = Math.floor(rotations / 360);
    const nextRotations = (currentTurns + 5) * 360 + targetOffset;
    setRotations(nextRotations);

    playCoinFlipSound();

    setTimeout(async () => {
      setResult(outcome);
      setHistory((prev) => [outcome, ...prev.slice(0, 19)]);
      playCoinLandSound(outcome === 'cara');
      const hash = await generateSha256Hash(`coin-${Date.now()}-${outcome}`);
      setLastHash(hash);
      setIsFlipping(false);
    }, 1000);
  };

  const caraCount = history.filter((h) => h === 'cara').length;
  const cruzCount = history.filter((h) => h === 'cruz').length;
  const totalFlips = history.length;
  const caraPercent = totalFlips > 0 ? Math.round((caraCount / totalFlips) * 100) : 50;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <ToolSwitcher />

      {/* Hero Header Estilo AppSorteos */}
      <div className="text-center pt-2 sm:pt-4">
        {/* Pastel Icon Badge */}
        <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 shadow-xs">
          <Coins className="w-7 h-7" />
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight mb-2 font-display">
          Lanzar Moneda (Cara o Cruz)
        </h1>
        
        <p className="text-base sm:text-lg text-slate-500 max-w-xl mx-auto">
          Toma decisiones justas al instante con giro 3D sincronizado y algoritmo criptográfico
        </p>

        {/* Small Audio & Screen Controls */}
        <div className="flex items-center justify-center gap-2 mt-3">
          <button
            type="button"
            onClick={handleToggleSound}
            aria-label={muted ? 'Activar sonido' : 'Silenciar sonido'}
            title={muted ? 'Activar sonido' : 'Silenciar sonido'}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            {muted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-pink-600" />}
          </button>
          <button
            type="button"
            onClick={handleToggleFullscreen}
            aria-label={isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
            title={isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4 text-pink-600" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Board */}
      <div className="bg-white rounded-2xl p-6 sm:p-10 space-y-6 border border-slate-200 shadow-sm text-center relative overflow-hidden">
        {/* 3D Coin Animation Area */}
        <div className="py-6 flex justify-center items-center perspective-1000">
          <div
            role="button"
            tabIndex={0}
            aria-label={`Moneda interactiva 3D. Mostrará ${result}. Haz clic para lanzar.`}
            className="w-44 h-44 sm:w-52 sm:h-52 rounded-full relative cursor-pointer select-none focus:outline-none focus:ring-4 focus:ring-pink-100"
            style={{
              transform: `rotateY(${rotations}deg)`,
              transformStyle: 'preserve-3d',
              WebkitTransformStyle: 'preserve-3d',
              transition: isFlipping ? 'transform 1000ms cubic-bezier(0.15, 0.85, 0.35, 1)' : 'none'
            }}
            onClick={handleFlip}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleFlip();
              }
            }}
          >
            {/* Cara frontal (Cara) - 0 deg */}
            <div
              className="absolute inset-0 rounded-full bg-gradient-to-tr from-amber-600 via-amber-300 to-yellow-100 p-2.5 shadow-xl border-4 border-amber-400 flex flex-col items-center justify-center text-amber-950 font-display font-black backface-hidden"
              style={{
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden'
              }}
            >
              <div className="w-full h-full rounded-full border-2 border-dashed border-amber-800/40 flex flex-col items-center justify-center p-4">
                <Sparkles className="w-9 h-9 text-amber-900 mb-1" />
                <span className="text-3xl font-black uppercase tracking-widest">CARA</span>
                <span className="text-[10px] font-mono font-bold text-amber-900/80 mt-1">SORTEOS PRO</span>
              </div>
            </div>

            {/* Cara dorsal (Cruz) - 180 deg */}
            <div
              className="absolute inset-0 rounded-full bg-gradient-to-tr from-zinc-500 via-zinc-200 to-slate-100 p-2.5 shadow-xl border-4 border-zinc-300 flex flex-col items-center justify-center text-zinc-900 font-display font-black backface-hidden"
              style={{
                transform: 'rotateY(180deg)',
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden'
              }}
            >
              <div className="w-full h-full rounded-full border-2 border-dashed border-zinc-700/40 flex flex-col items-center justify-center p-4">
                <Trophy className="w-9 h-9 text-zinc-800 mb-1" />
                <span className="text-3xl font-black uppercase tracking-widest">CRUZ</span>
                <span className="text-[10px] font-mono font-bold text-zinc-700 mt-1">PRO AUDIT</span>
              </div>
            </div>
          </div>
        </div>

        {/* Current Result Tag */}
        <div>
          <div className="inline-flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-slate-50 border border-slate-200 shadow-xs min-w-[220px] justify-center">
            {isFlipping ? (
              <span className="text-sm font-semibold text-pink-600 animate-pulse flex items-center gap-2">
                <RotateCw className="w-4 h-4 animate-spin text-pink-600" />
                Girando en el aire...
              </span>
            ) : (
              <>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Resultado:</span>
                <span
                  className={`text-2xl font-extrabold uppercase tracking-wider ${
                    result === 'cara' ? 'text-amber-600' : 'text-slate-800'
                  }`}
                >
                  {result}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Action Button */}
        <div>
          <button
            type="button"
            disabled={isFlipping}
            onClick={handleFlip}
            className="bg-[#d91a7a] hover:bg-[#c2186b] active:scale-95 disabled:opacity-50 text-white font-bold text-base sm:text-lg py-3.5 px-12 rounded-xl shadow-md hover:shadow-lg shadow-pink-500/20 transition-all inline-flex items-center gap-2 cursor-pointer"
          >
            <RotateCw className={`w-5 h-5 ${isFlipping ? 'animate-spin' : ''}`} />
            <span>{isFlipping ? 'Lanzando moneda...' : '¡Lanzar Moneda Ahora!'}</span>
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 max-w-lg mx-auto pt-4 border-t border-slate-100">
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-center">
            <div className="text-[11px] font-semibold text-slate-500 uppercase">Caras</div>
            <div className="text-xl font-extrabold text-amber-600 font-mono-num">
              {caraCount} <span className="text-xs text-slate-400 font-normal">({caraPercent}%)</span>
            </div>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-center">
            <div className="text-[11px] font-semibold text-slate-500 uppercase">Cruces</div>
            <div className="text-xl font-extrabold text-slate-700 font-mono-num">
              {cruzCount} <span className="text-xs text-slate-400 font-normal">({100 - caraPercent}%)</span>
            </div>
          </div>
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-center">
            <div className="text-[11px] font-semibold text-slate-500 uppercase">Tiradas</div>
            <div className="text-xl font-extrabold text-purple-600 font-mono-num">{totalFlips}</div>
          </div>
        </div>

        {/* Audit Hash */}
        {lastHash && (
          <div className="text-xs font-mono text-slate-400 flex items-center justify-center gap-1.5 pt-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Audit Hash: {lastHash.slice(0, 24)}...</span>
          </div>
        )}
      </div>

      {/* History Log */}
      {history.length > 0 && (
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-2">
              <History className="w-3.5 h-3.5" />
              <span>Últimos lanzamientos</span>
            </h2>
            <button
              onClick={() => setHistory([])}
              className="text-xs text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            >
              Limpiar
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {history.map((item, idx) => (
              <span
                key={idx}
                className={`px-3 py-1 rounded-xl text-xs font-mono font-bold uppercase ${
                  item === 'cara'
                    ? 'bg-amber-50 text-amber-700 border border-amber-200'
                    : 'bg-slate-100 text-slate-700 border border-slate-200'
                }`}
              >
                #{history.length - idx}: {item}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
