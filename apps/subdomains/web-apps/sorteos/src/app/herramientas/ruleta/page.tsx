"use client";

import React, { useState } from 'react';
import { Disc, Sparkles, Plus, Trash2, Trophy, RotateCcw, Share2, Tv } from 'lucide-react';
import { RouletteCanvas } from '@/components/RouletteCanvas';
import { ConfettiEffect } from '@/components/ConfettiEffect';
import { ToolSwitcher } from '@/components/ToolSwitcher';
import { LiveStreamStage } from '@/components/LiveStreamStage';
import { WinnerExportModal } from '@/components/WinnerExportModal';
import { playWinnerFanfare } from '@/lib/soundEffects';

export default function RuletaPage() {
  const [options, setOptions] = useState<string[]>([
    'Premio Mayor 🎁',
    'Descuento 20% 🏷️',
    'Intenta de nuevo 🔄',
    'Camiseta Oficial 👕',
    'Envío Gratis 🚚',
    'Tarjeta Regalo 💳',
    'Sigue participando ⭐',
    'Cena Doble 🍕'
  ]);
  const [newOption, setNewOption] = useState<string>('');
  const [winner, setWinner] = useState<string | null>(null);
  const [isSpinning, setIsSpinning] = useState<boolean>(false);
  const [showLiveStream, setShowLiveStream] = useState<boolean>(false);
  const [showExportModal, setShowExportModal] = useState<boolean>(false);

  const handleAddOption = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newOption.trim()) return;
    setOptions([...options, newOption.trim()]);
    setNewOption('');
  };

  const handleRemoveOption = (index: number) => {
    if (options.length <= 2) {
      alert('La ruleta debe tener al menos 2 opciones');
      return;
    }
    setOptions(options.filter((_, i) => i !== index));
  };

  const setPreset = (preset: string[]) => {
    if (isSpinning) return;
    setOptions(preset);
    setWinner(null);
  };

  const handleWinnerSelected = (selected: string) => {
    setWinner(selected);
    playWinnerFanfare();
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <ToolSwitcher />
      <ConfettiEffect active={winner !== null && !isSpinning} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-center sm:text-left space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full purple-gradient-badge text-xs font-mono font-bold uppercase tracking-wider">
            <Disc className="w-3.5 h-3.5 text-pink-400" />
            <span>Ruleta Interactiva en Vivo</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black font-display text-white tracking-tight">
            Ruleta Aleatoria Digital
          </h1>
          <p className="text-sm sm:text-base text-zinc-400 max-w-xl">
            Personaliza los premios o nombres, gira la ruleta y toma decisiones emocionantes e imparciales en vivo.
          </p>
        </div>

        {/* Live Presentation Button */}
        {winner && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowLiveStream(true)}
              className="btn-pro-secondary py-3 px-5 rounded-xl text-sm flex items-center gap-2"
            >
              <Tv className="w-4 h-4 text-purple-400" />
              <span>Modo En Vivo</span>
            </button>
            <button
              type="button"
              onClick={() => setShowExportModal(true)}
              className="btn-pro-primary py-3 px-5 rounded-xl text-sm flex items-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              <span>Exportar Tarjeta</span>
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Roulette Wheel Canvas */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center p-6 sm:p-10 glass-card rounded-3xl border border-white/10 relative">
          {winner && (
            <div className="w-full mb-6 p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 via-pink-500/20 to-violet-500/20 border border-amber-400/40 text-center space-y-2 animate-bounce">
              <span className="text-[11px] font-mono font-bold uppercase text-amber-300 tracking-wider flex items-center justify-center gap-1">
                <Trophy className="w-3.5 h-3.5" /> ¡Opción Ganadora!
              </span>
              <p className="text-2xl sm:text-4xl font-black text-white font-display title-neon-glow">
                {winner}
              </p>
              <div className="flex items-center justify-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowExportModal(true)}
                  className="text-xs font-mono font-bold text-amber-300 hover:text-white underline flex items-center gap-1"
                >
                  <Share2 className="w-3 h-3" /> Descargar Story / Post
                </button>
              </div>
            </div>
          )}

          <RouletteCanvas
            options={options}
            onWinnerSelected={handleWinnerSelected}
            isSpinning={isSpinning}
            setIsSpinning={setIsSpinning}
          />
        </div>

        {/* Right: Options Manager & Presets */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-card rounded-3xl p-6 sm:p-8 space-y-5 border border-white/10">
            <h2 className="text-lg font-bold font-display text-white">Configurar Opciones</h2>

            {/* Presets */}
            <div className="space-y-1.5">
              <span className="text-xs font-mono text-zinc-400">Plantillas rápidas:</span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => setPreset(['Sí ✅', 'No ❌', 'Tal vez 🤔'])}
                  className="text-xs px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 transition-colors"
                >
                  Sí / No
                </button>
                <button
                  type="button"
                  onClick={() => setPreset(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'])}
                  className="text-xs px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 transition-colors"
                >
                  Números 1-10
                </button>
                <button
                  type="button"
                  onClick={() => setPreset(['Pizza 🍕', 'Hamburguesa 🍔', 'Sushi 🍣', 'Tacos 🌮', 'Ensalada 🥗'])}
                  className="text-xs px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 transition-colors"
                >
                  Comida
                </button>
              </div>
            </div>

            {/* Add Option Form */}
            <form onSubmit={handleAddOption} className="flex gap-2">
              <label htmlFor="new-option-input" className="sr-only">
                Escribe una nueva opción para la ruleta
              </label>
              <input
                id="new-option-input"
                name="newOption"
                type="text"
                value={newOption}
                onChange={(e) => setNewOption(e.target.value)}
                placeholder="Escribe una nueva opción..."
                aria-label="Escribe una nueva opción para la ruleta"
                className="flex-1 rounded-xl bg-black/40 border border-white/10 px-3.5 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-violet-500"
              />
              <button
                type="submit"
                disabled={!newOption.trim() || isSpinning}
                aria-label="Agregar opción a la ruleta"
                className="p-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white font-bold transition-colors"
              >
                <Plus className="w-5 h-5" aria-hidden="true" />
              </button>
            </form>

            {/* Options List */}
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
              {options.map((opt, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/5 text-sm text-zinc-200"
                >
                  <span className="font-medium truncate pr-2">{opt}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveOption(idx)}
                    disabled={isSpinning}
                    aria-label={`Eliminar opción ${opt}`}
                    className="text-zinc-500 hover:text-red-400 transition-colors p-1"
                  >
                    <Trash2 className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs text-zinc-500 font-mono">
              <span>{options.length} opciones en ruleta</span>
              <button
                type="button"
                onClick={() => setWinner(null)}
                className="hover:text-zinc-300 flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reiniciar Ganador</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Live Stream Stage Modal */}
      {winner && (
        <LiveStreamStage
          isOpen={showLiveStream}
          onClose={() => setShowLiveStream(false)}
          title="Ruleta de la Suerte Digital"
          winner={winner}
          platform="Ruleta Sorteos Pro"
        />
      )}

      {/* Story / Post Export Modal */}
      {winner && (
        <WinnerExportModal
          isOpen={showExportModal}
          onClose={() => setShowExportModal(false)}
          winnerName={winner}
          drawTitle="Ruleta de la Suerte"
          platform="Ruleta Digital"
        />
      )}
    </div>
  );
}
