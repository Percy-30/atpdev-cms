"use client";

import React, { useState } from 'react';
import { Coins, RotateCw, History, Trophy, Sparkles, CheckCircle2 } from 'lucide-react';
import { flipCoin, generateSha256Hash } from '@/lib/randomEngine';

export default function MonedaPage() {
  const [result, setResult] = useState<'cara' | 'cruz' | null>('cara');
  const [isFlipping, setIsFlipping] = useState<boolean>(false);
  const [rotations, setRotations] = useState<number>(0);
  const [history, setHistory] = useState<('cara' | 'cruz')[]>(['cara']);
  const [lastHash, setLastHash] = useState<string>('');

  const handleFlip = async () => {
    if (isFlipping) return;
    setIsFlipping(true);

    // Incrementa rotación 3D para efecto dinámico
    const nextRotations = rotations + 1800 + (Math.random() > 0.5 ? 180 : 0);
    setRotations(nextRotations);

    // Calcular resultado con CSPRNG
    const outcome = flipCoin();

    setTimeout(async () => {
      setResult(outcome);
      setHistory((prev) => [outcome, ...prev.slice(0, 19)]);
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full gold-gradient-badge text-xs font-mono font-bold uppercase tracking-wider">
          <Coins className="w-3.5 h-3.5" />
          <span>Cara o Cruz Criptográfico</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black font-display text-white tracking-tight">
          Lanzar Moneda Online
        </h1>
        <p className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto">
          Decide al azar con un volado justo y no sesgado respaldado por números aleatorios CSPRNG.
        </p>
      </div>

      {/* Main Board */}
      <div className="glass-card rounded-3xl p-8 sm:p-12 space-y-8 border border-white/10 text-center relative overflow-hidden">
        {/* Glow ambient */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* 3D Coin Animation Area */}
        <div className="py-8 flex justify-center items-center perspective-1000">
          <div
            className="w-40 h-40 sm:w-48 sm:h-48 rounded-full relative cursor-pointer select-none transition-transform duration-1000 transform-style-3d shadow-2xl"
            style={{
              transform: `rotateY(${rotations}deg)`
            }}
            onClick={handleFlip}
          >
            {/* Cara frontal (Cara) */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-amber-600 via-amber-300 to-yellow-100 p-2 shadow-inner border-4 border-amber-400/80 flex flex-col items-center justify-center text-amber-950 font-display font-black backface-hidden">
              <div className="w-full h-full rounded-full border-2 border-dashed border-amber-800/40 flex flex-col items-center justify-center p-4">
                <Sparkles className="w-8 h-8 text-amber-900 mb-1" />
                <span className="text-2xl font-black uppercase tracking-widest">CARA</span>
                <span className="text-[10px] font-mono font-bold text-amber-900/80 mt-1">SORTEOS PRO</span>
              </div>
            </div>

            {/* Cara dorsal (Cruz) */}
            <div
              className="absolute inset-0 rounded-full bg-gradient-to-tr from-zinc-500 via-zinc-200 to-zinc-100 p-2 shadow-inner border-4 border-zinc-300/80 flex flex-col items-center justify-center text-zinc-900 font-display font-black backface-hidden"
              style={{ transform: 'rotateY(180deg)' }}
            >
              <div className="w-full h-full rounded-full border-2 border-dashed border-zinc-700/40 flex flex-col items-center justify-center p-4">
                <Trophy className="w-8 h-8 text-zinc-800 mb-1" />
                <span className="text-2xl font-black uppercase tracking-widest">CRUZ</span>
                <span className="text-[10px] font-mono font-bold text-zinc-700 mt-1">PRO AUDIT</span>
              </div>
            </div>
          </div>
        </div>

        {/* Current Result Tag */}
        <div>
          {result && (
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-xs font-mono text-zinc-400 uppercase">Resultado actual:</span>
              <span className={`text-xl font-black uppercase tracking-wider ${result === 'cara' ? 'text-amber-400' : 'text-zinc-200'}`}>
                {result}
              </span>
            </div>
          )}
        </div>

        {/* Action Button */}
        <div>
          <button
            type="button"
            disabled={isFlipping}
            onClick={handleFlip}
            className="px-10 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-zinc-950 font-black font-display text-base shadow-xl shadow-amber-500/25 hover:scale-105 active:scale-95 transition-all inline-flex items-center gap-2"
          >
            <RotateCw className={`w-5 h-5 ${isFlipping ? 'animate-spin' : ''}`} />
            <span>{isFlipping ? 'Lanzando moneda...' : '🪙 ¡Lanzar Moneda!'}</span>
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 max-w-lg mx-auto pt-4 border-t border-white/5">
          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 text-center">
            <div className="text-[11px] font-mono text-zinc-400 uppercase">Caras</div>
            <div className="text-xl font-bold text-amber-400 font-mono-num">{caraCount} <span className="text-xs text-zinc-500">({caraPercent}%)</span></div>
          </div>
          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 text-center">
            <div className="text-[11px] font-mono text-zinc-400 uppercase">Cruces</div>
            <div className="text-xl font-bold text-zinc-300 font-mono-num">{cruzCount} <span className="text-xs text-zinc-500">({100 - caraPercent}%)</span></div>
          </div>
          <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 text-center">
            <div className="text-[11px] font-mono text-zinc-400 uppercase">Tiradas</div>
            <div className="text-xl font-bold text-purple-400 font-mono-num">{totalFlips}</div>
          </div>
        </div>

        {/* Audit Hash */}
        {lastHash && (
          <div className="text-xs font-mono text-zinc-500 flex items-center justify-center gap-1.5 pt-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Audit Hash: {lastHash.slice(0, 24)}...</span>
          </div>
        )}
      </div>

      {/* History Log */}
      {history.length > 0 && (
        <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-bold flex items-center gap-2">
              <History className="w-3.5 h-3.5" />
              <span>Últimos lanzamientos</span>
            </h3>
            <button
              onClick={() => setHistory([])}
              className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
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
                    ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                    : 'bg-zinc-500/10 text-zinc-300 border border-zinc-500/20'
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
