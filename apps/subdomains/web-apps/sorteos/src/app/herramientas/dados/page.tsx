"use client";

import React, { useState } from 'react';
import { Dices, RefreshCw, RotateCcw, Trophy, Sparkles } from 'lucide-react';
import { rollDice } from '@/lib/randomEngine';
import { ToolSwitcher } from '@/components/ToolSwitcher';
import { playDiceSound } from '@/lib/soundEffects';

export default function DadosPage() {
  const [diceCount, setDiceCount] = useState<number>(2);
  const [diceValues, setDiceValues] = useState<number[]>([3, 4]);
  const [isRolling, setIsRolling] = useState<boolean>(false);
  const [history, setHistory] = useState<{ values: number[]; total: number }[]>([
    { values: [3, 4], total: 7 }
  ]);

  const handleRoll = () => {
    if (isRolling) return;
    setIsRolling(true);
    playDiceSound();

    // Animación de rotación rápida antes del resultado
    setTimeout(() => {
      const results = rollDice(diceCount);
      setDiceValues(results);
      const total = results.reduce((a, b) => a + b, 0);
      setHistory((prev) => [{ values: results, total }, ...prev.slice(0, 9)]);
      setIsRolling(false);
    }, 600);
  };

  // Renderizador de cara de dado con puntos SVG
  const renderDiceFace = (val: number, idx: number) => {
    return (
      <div
        key={idx}
        role="img"
        aria-label={`Dado mostrando valor ${val}`}
        className={`w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gradient-to-b from-white to-zinc-200 text-zinc-900 shadow-2xl flex items-center justify-center p-3.5 border-2 border-white/60 select-none ${
          isRolling ? 'animate-dice-shake' : 'hover:scale-105 transition-transform'
        }`}
      >
        <div className="w-full h-full grid grid-cols-3 grid-rows-3 gap-1 items-center justify-items-center">
          {/* Puntos según el valor 1..6 */}
          {val === 1 && (
            <div className="col-start-2 row-start-2 w-4 h-4 rounded-full bg-red-600 shadow-inner" />
          )}
          {val === 2 && (
            <>
              <div className="col-start-1 row-start-1 w-3.5 h-3.5 rounded-full bg-zinc-900" />
              <div className="col-start-3 row-start-3 w-3.5 h-3.5 rounded-full bg-zinc-900" />
            </>
          )}
          {val === 3 && (
            <>
              <div className="col-start-1 row-start-1 w-3.5 h-3.5 rounded-full bg-zinc-900" />
              <div className="col-start-2 row-start-2 w-3.5 h-3.5 rounded-full bg-red-600 shadow-inner" />
              <div className="col-start-3 row-start-3 w-3.5 h-3.5 rounded-full bg-zinc-900" />
            </>
          )}
          {val === 4 && (
            <>
              <div className="col-start-1 row-start-1 w-3.5 h-3.5 rounded-full bg-zinc-900" />
              <div className="col-start-3 row-start-1 w-3.5 h-3.5 rounded-full bg-zinc-900" />
              <div className="col-start-1 row-start-3 w-3.5 h-3.5 rounded-full bg-zinc-900" />
              <div className="col-start-3 row-start-3 w-3.5 h-3.5 rounded-full bg-zinc-900" />
            </>
          )}
          {val === 5 && (
            <>
              <div className="col-start-1 row-start-1 w-3.5 h-3.5 rounded-full bg-zinc-900" />
              <div className="col-start-3 row-start-1 w-3.5 h-3.5 rounded-full bg-zinc-900" />
              <div className="col-start-2 row-start-2 w-3.5 h-3.5 rounded-full bg-red-600 shadow-inner" />
              <div className="col-start-1 row-start-3 w-3.5 h-3.5 rounded-full bg-zinc-900" />
              <div className="col-start-3 row-start-3 w-3.5 h-3.5 rounded-full bg-zinc-900" />
            </>
          )}
          {val === 6 && (
            <>
              <div className="col-start-1 row-start-1 w-3 h-3 rounded-full bg-zinc-900" />
              <div className="col-start-3 row-start-1 w-3 h-3 rounded-full bg-zinc-900" />
              <div className="col-start-1 row-start-2 w-3 h-3 rounded-full bg-zinc-900" />
              <div className="col-start-3 row-start-2 w-3 h-3 rounded-full bg-zinc-900" />
              <div className="col-start-1 row-start-3 w-3 h-3 rounded-full bg-zinc-900" />
              <div className="col-start-3 row-start-3 w-3 h-3 rounded-full bg-zinc-900" />
            </>
          )}
        </div>
      </div>
    );
  };

  const totalSum = diceValues.reduce((a, b) => a + b, 0);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <ToolSwitcher />
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full gold-gradient-badge text-xs font-mono font-bold uppercase tracking-wider">
          <Dices className="w-3.5 h-3.5" />
          <span>Tirador de Dados 3D</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black font-display text-white tracking-tight">
          Lanzar Dados Aleatorios
        </h1>
        <p className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto">
          Tira de 1 a 6 dados simultáneos con física visual y cálculo automático de la suma total.
        </p>
      </div>

      {/* Main Board */}
      <div className="glass-card rounded-3xl p-8 sm:p-12 space-y-8 border border-white/10 text-center relative overflow-hidden">
        
        {/* Dice Count Selector */}
        <div className="flex items-center justify-center gap-2">
          <span className="text-xs font-mono text-zinc-400 mr-2">Cantidad de dados:</span>
          {[1, 2, 3, 4, 5, 6].map((num) => (
            <button
              key={num}
              type="button"
              aria-label={`Seleccionar ${num} ${num === 1 ? 'dado' : 'dados'}`}
              onClick={() => {
                setDiceCount(num);
                setDiceValues(Array.from({ length: num }, () => 1));
              }}
              className={`w-9 h-9 rounded-xl font-bold font-mono text-xs transition-all ${
                diceCount === num
                  ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/30'
                  : 'bg-white/5 text-zinc-300 hover:bg-white/10'
              }`}
            >
              {num}
            </button>
          ))}
        </div>

        {/* Dice Display */}
        <div className="flex flex-wrap items-center justify-center gap-4 py-8 min-h-[140px]">
          {diceValues.map((val, idx) => renderDiceFace(val, idx))}
        </div>

        {/* Total Badge */}
        <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-2xl bg-white/5 border border-white/10">
          <span className="text-xs font-mono text-zinc-400 uppercase">Suma Total:</span>
          <span className="text-3xl font-black font-display text-amber-300 font-mono-num">{totalSum}</span>
        </div>

        {/* Roll Action Button */}
        <div>
          <button
            type="button"
            disabled={isRolling}
            onClick={handleRoll}
            className={`btn-pro-gold text-base sm:text-lg py-4 px-12 rounded-2xl ${
              isRolling ? 'opacity-60 cursor-not-allowed !transform-none' : ''
            }`}
          >
            <RefreshCw className={`w-5 h-5 ${isRolling ? 'animate-spin' : ''}`} />
            <span>{isRolling ? 'Lanzando dados...' : '🎲 ¡Tirar Dados!'}</span>
          </button>
        </div>
      </div>

      {/* History Log */}
      {history.length > 0 && (
        <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-3">
          <h2 className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-bold">
            Historial de Tiradas Recientes
          </h2>
          <div className="flex flex-wrap gap-2">
            {history.map((item, idx) => (
              <div
                key={idx}
                className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/5 text-xs font-mono text-zinc-300 flex items-center gap-2"
              >
                <span className="text-amber-400 font-bold">{item.total}</span>
                <span className="text-zinc-500">({item.values.join(', ')})</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
