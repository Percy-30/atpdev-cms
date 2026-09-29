"use client";

import React, { useState } from 'react';
import { 
  Disc, 
  RotateCcw, 
  Share2, 
  Trophy, 
  Plus, 
  Trash2, 
  Tv 
} from 'lucide-react';
import { RouletteCanvas } from '@/components/RouletteCanvas';
import { ToolSwitcher } from '@/components/ToolSwitcher';
import ConfettiEffect from '@/components/ConfettiEffect';
import { LiveStreamStage } from '@/components/LiveStreamStage';
import { WinnerExportModal } from '@/components/WinnerExportModal';
import { playWinnerFanfare } from '@/lib/soundEffects';

const DEFAULT_OPTIONS = [
  'Premio Mayor 🎁',
  'Descuento 20% 🏷️',
  'Intenta de nuevo 🔄',
  'Camiseta Oficial 👕',
  'Envío Gratis 📦',
  'Tarjeta Regalo 💳',
  'Sigue participando ✨',
  'Cena Doble 🍕',
];

export default function RuletaPage() {
  const [options, setOptions] = useState<string[]>(DEFAULT_OPTIONS);
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
      alert('La ruleta necesita al menos 2 opciones para girar.');
      return;
    }
    setOptions(options.filter((_, i) => i !== index));
  };

  const setPreset = (presetOptions: string[]) => {
    setOptions(presetOptions);
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

      {/* Hero Header Estilo AppSorteos */}
      <div className="text-center pt-2 sm:pt-4">
        {/* Pastel Icon Badge */}
        <div className="w-14 h-14 rounded-2xl bg-pink-100 dark:bg-pink-500/10 text-pink-600 dark:text-pink-400 flex items-center justify-center mx-auto mb-4 shadow-xs">
          <Disc className="w-7 h-7" />
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2 font-display">
          Ruleta Aleatoria Digital
        </h1>
        
        <p className="text-base sm:text-lg text-slate-600 dark:text-zinc-400 max-w-xl mx-auto">
          Personaliza los premios o nombres y gira la ruleta interactiva para elegir ganadores al azar
        </p>

        {/* Live Presentation Button if winner exists */}
        {winner && (
          <div className="flex items-center justify-center gap-2 mt-4">
            <button
              type="button"
              onClick={() => setShowExportModal(true)}
              className="py-2.5 px-4 rounded-xl bg-[#d91a7a] hover:bg-[#c2186b] text-white font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
            >
              <Share2 className="w-4 h-4" />
              <span>Exportar Tarjeta</span>
            </button>
            <button
              type="button"
              onClick={() => setShowLiveStream(true)}
              className="py-2.5 px-4 rounded-xl bg-pink-50 hover:bg-pink-100 dark:bg-purple-900/30 dark:hover:bg-purple-900/50 text-pink-700 dark:text-purple-300 border border-pink-200 dark:border-purple-500/30 font-semibold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Tv className="w-4 h-4" />
              <span>Modo En Vivo</span>
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Roulette Wheel Canvas */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center p-6 sm:p-10 bg-white dark:bg-[#0f172a] rounded-2xl border border-slate-200 dark:border-white/10 shadow-sm relative">
          {winner && (
            <div className="w-full mb-6 p-4 rounded-xl bg-pink-50 dark:bg-pink-500/10 border border-pink-200 dark:border-pink-500/30 text-center space-y-1 animate-in fade-in duration-200">
              <span className="text-xs font-bold uppercase text-pink-600 dark:text-pink-400 tracking-wider flex items-center justify-center gap-1">
                <Trophy className="w-4 h-4 text-amber-500" /> ¡Opción Ganadora!
              </span>
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display">
                {winner}
              </p>
              <div className="flex items-center justify-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowExportModal(true)}
                  className="text-xs font-semibold text-pink-600 dark:text-pink-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" /> Descargar Story / Post
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
          <div className="bg-white dark:bg-[#0f172a] rounded-2xl p-6 sm:p-8 space-y-5 border border-slate-200 dark:border-white/10 shadow-sm">
            <h2 className="text-lg font-bold font-display text-slate-900 dark:text-white">Configurar Opciones</h2>

            {/* Presets */}
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400">Plantillas rápidas:</span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => setPreset(['Sí ✅', 'No ❌', 'Tal vez 🤔'])}
                  className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-pink-50 hover:text-pink-600 text-slate-700 dark:bg-white/5 dark:hover:bg-white/10 dark:text-zinc-300 dark:hover:text-pink-400 border border-slate-200 dark:border-white/10 transition-colors font-medium cursor-pointer"
                >
                  Sí / No
                </button>
                <button
                  type="button"
                  onClick={() => setPreset(['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'])}
                  className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-pink-50 hover:text-pink-600 text-slate-700 dark:bg-white/5 dark:hover:bg-white/10 dark:text-zinc-300 dark:hover:text-pink-400 border border-slate-200 dark:border-white/10 transition-colors font-medium cursor-pointer"
                >
                  Números 1-10
                </button>
                <button
                  type="button"
                  onClick={() => setPreset(['Pizza 🍕', 'Hamburguesa 🍔', 'Sushi 🍣', 'Tacos 🌮', 'Ensalada 🥗'])}
                  className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-pink-50 hover:text-pink-600 text-slate-700 dark:bg-white/5 dark:hover:bg-white/10 dark:text-zinc-300 dark:hover:text-pink-400 border border-slate-200 dark:border-white/10 transition-colors font-medium cursor-pointer"
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
                placeholder="Escribe una opción..."
                aria-label="Escribe una nueva opción para la ruleta"
                className="flex-1 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 focus:outline-none focus:border-[#d91a7a] dark:focus:border-purple-500 focus:ring-2 focus:ring-pink-50 dark:focus:ring-purple-900/30"
              />
              <button
                type="submit"
                disabled={!newOption.trim() || isSpinning}
                aria-label="Agregar opción a la ruleta"
                className="p-2.5 rounded-xl bg-[#d91a7a] hover:bg-[#c2186b] disabled:opacity-50 text-white font-bold transition-colors cursor-pointer shadow-xs"
              >
                <Plus className="w-5 h-5" aria-hidden="true" />
              </button>
            </form>

            {/* Options List */}
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
              {options.map((opt, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-sm text-slate-800 dark:text-zinc-200"
                >
                  <span className="font-semibold truncate pr-2">{opt}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveOption(idx)}
                    disabled={isSpinning}
                    aria-label={`Eliminar opción ${opt}`}
                    className="text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors p-1 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-xs text-slate-500 dark:text-zinc-400 font-medium">
              <span>{options.length} opciones en ruleta</span>
              <button
                type="button"
                onClick={() => setWinner(null)}
                className="hover:text-slate-800 dark:hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
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
