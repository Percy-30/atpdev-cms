"use client";

import React, { useState, useEffect } from 'react';
import { 
  Hash, Sparkles, Copy, Check, RefreshCw, Sliders, ShieldCheck, 
  Download, Volume2, VolumeX, Maximize2, Minimize2, Share2, Tv 
} from 'lucide-react';
import { generateNumbers, generateSha256Hash } from '@/lib/randomEngine';
import ConfettiEffect from '@/components/ConfettiEffect';
import { ToolSwitcher } from '@/components/ToolSwitcher';
import { Countdown3DOverlay } from '@/components/Countdown3DOverlay';
import { LiveStreamStage } from '@/components/LiveStreamStage';
import { WinnerExportModal } from '@/components/WinnerExportModal';
import { 
  playBallBounce, playWinnerFanfare, isAudioMuted, toggleAudioMute 
} from '@/lib/soundEffects';

const BALL_GRADIENTS = [
  'from-amber-400 via-yellow-500 to-amber-700 text-amber-950 shadow-amber-500/40',
  'from-purple-400 via-violet-500 to-indigo-700 text-white shadow-purple-500/40',
  'from-pink-400 via-rose-500 to-pink-700 text-white shadow-pink-500/40',
  'from-cyan-400 via-sky-500 to-blue-700 text-slate-950 shadow-cyan-500/40',
  'from-emerald-400 via-teal-500 to-emerald-700 text-emerald-950 shadow-emerald-500/40',
  'from-orange-400 via-amber-500 to-red-600 text-white shadow-orange-500/40',
];

export default function NumerosPage() {
  const [min, setMin] = useState<number>(1);
  const [max, setMax] = useState<number>(100);
  const [quantity, setQuantity] = useState<number>(5);
  const [allowDuplicates, setAllowDuplicates] = useState<boolean>(false);
  const [sortOrder, setSortOrder] = useState<'none' | 'asc' | 'desc'>('none');
  const [results, setResults] = useState<number[]>([7, 23, 42, 68, 91]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [showCountdown, setShowCountdown] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [auditHash, setAuditHash] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [muted, setMuted] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showLiveStream, setShowLiveStream] = useState<boolean>(false);
  const [showExportModal, setShowExportModal] = useState<boolean>(false);

  useEffect(() => {
    setMuted(isAudioMuted());
  }, []);

  const handleToggleSound = () => {
    setMuted(toggleAudioMute());
  };

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const handleStartDraw = () => {
    setError('');
    if (min >= max) {
      setError('El valor mínimo debe ser estrictamente menor que el valor máximo.');
      return;
    }
    if (!allowDuplicates && quantity > max - min + 1) {
      setError(`No es posible generar ${quantity} números únicos en un rango de ${max - min + 1} valores.`);
      return;
    }

    setShowCountdown(true);
  };

  const executeGeneration = async () => {
    setShowCountdown(false);
    setIsGenerating(true);
    setShowConfetti(false);

    try {
      let nums = generateNumbers(min, max, quantity, allowDuplicates);
      if (sortOrder === 'asc') nums.sort((a, b) => a - b);
      if (sortOrder === 'desc') nums.sort((a, b) => b - a);

      setResults(nums);
      const hash = await generateSha256Hash(`numbers-${min}-${max}-${quantity}-${nums.join(',')}-${Date.now()}`);
      setAuditHash(hash);
      setShowConfetti(true);
      playBallBounce();
      playWinnerFanfare();
    } catch (err: any) {
      setError(err.message || 'Error al generar números');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(results.join(', '));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadCsv = () => {
    const csvContent = "data:text/csv;charset=utf-8," + results.map((n, i) => `${i + 1},${n}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `sorteos_pro_numeros_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const applyPreset = (pMin: number, pMax: number, pQty: number, pUniq: boolean) => {
    setMin(pMin);
    setMax(pMax);
    setQuantity(pQty);
    setAllowDuplicates(!pUniq);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <ToolSwitcher />
      {showConfetti && <ConfettiEffect />}

      {/* 3D Countdown Modal */}
      <Countdown3DOverlay
        active={showCountdown}
        seconds={3}
        title="Extrayendo Bolas Aleatorias 3D"
        onComplete={executeGeneration}
      />

      {/* Header con controles */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-center sm:text-left space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full gold-gradient-badge text-xs font-mono font-bold uppercase tracking-wider">
            <Hash className="w-3.5 h-3.5" />
            <span>Generador CSPRNG con Bolas 3D</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black font-display text-white tracking-tight">
            Generador de Números 3D
          </h1>
          <p className="text-sm sm:text-base text-zinc-400 max-w-xl">
            Genera números aleatorios únicos o repetidos para rifas, loterías o bingos con esferas 3D e inmutabilidad SHA-256.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleToggleSound}
            aria-label={muted ? 'Activar sonido' : 'Silenciar sonido'}
            title={muted ? 'Activar sonido' : 'Silenciar sonido'}
            className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            {muted ? <VolumeX className="w-5 h-5 text-zinc-500" /> : <Volume2 className="w-5 h-5 text-amber-400" />}
          </button>
          <button
            type="button"
            onClick={handleToggleFullscreen}
            aria-label={isFullscreen ? 'Salir de pantalla completa' : 'Pantalla completa'}
            className="p-2.5 rounded-xl bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            {isFullscreen ? <Minimize2 className="w-5 h-5 text-purple-400" /> : <Maximize2 className="w-5 h-5" />}
          </button>
          {results.length > 0 && (
            <>
              <button
                type="button"
                onClick={() => setShowLiveStream(true)}
                className="btn-pro-secondary py-2.5 px-4 rounded-xl text-xs flex items-center gap-1.5"
              >
                <Tv className="w-4 h-4 text-purple-400" />
                <span>Modo En Vivo</span>
              </button>
              <button
                type="button"
                onClick={() => setShowExportModal(true)}
                className="btn-pro-primary py-2.5 px-4 rounded-xl text-xs flex items-center gap-1.5"
              >
                <Share2 className="w-4 h-4" />
                <span>Exportar</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Config Card */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-4">
          <div className="flex items-center gap-2 text-sm font-bold text-white">
            <Sliders className="w-4 h-4 text-purple-400" />
            <span>Configuración del Sorteo</span>
          </div>

          {/* Quick presets */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono text-zinc-500">Plantillas:</span>
            <button
              type="button"
              onClick={() => applyPreset(1, 100, 1, true)}
              className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-zinc-300 font-mono transition-colors"
            >
              1 al 100 (1 ganador)
            </button>
            <button
              type="button"
              onClick={() => applyPreset(1, 50, 6, true)}
              className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-zinc-300 font-mono transition-colors"
            >
              Lotería (6/50)
            </button>
            <button
              type="button"
              onClick={() => applyPreset(1, 75, 5, true)}
              className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-zinc-300 font-mono transition-colors"
            >
              Bingo (75)
            </button>
          </div>
        </div>

        {/* Form Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor="numero-minimo" className="block text-xs font-mono text-zinc-400 mb-2">Valor Mínimo:</label>
            <input
              id="numero-minimo"
              name="numeroMinimo"
              type="number"
              value={min}
              onChange={(e) => setMin(parseInt(e.target.value) || 0)}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-mono font-bold focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>
          <div>
            <label htmlFor="numero-maximo" className="block text-xs font-mono text-zinc-400 mb-2">Valor Máximo:</label>
            <input
              id="numero-maximo"
              name="numeroMaximo"
              type="number"
              value={max}
              onChange={(e) => setMax(parseInt(e.target.value) || 0)}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-mono font-bold focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>
          <div>
            <label htmlFor="numero-cantidad" className="block text-xs font-mono text-zinc-400 mb-2">Cantidad de Números:</label>
            <input
              id="numero-cantidad"
              name="numeroCantidad"
              type="number"
              min={1}
              max={1000}
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-mono font-bold focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>
        </div>

        {/* Options Toggles */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={!allowDuplicates}
              onChange={(e) => setAllowDuplicates(!e.target.checked)}
              className="w-4 h-4 rounded text-purple-600 bg-zinc-900 border-zinc-700 focus:ring-purple-500"
            />
            <span className="text-xs text-zinc-300">Sin duplicados (Números únicos)</span>
          </label>

          <div className="flex items-center gap-2">
            <span className="text-xs text-zinc-400 font-mono">Ordenar:</span>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as any)}
              className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-purple-500"
            >
              <option value="none" className="bg-zinc-900">Al azar (orden de extracción)</option>
              <option value="asc" className="bg-zinc-900">Menor a Mayor (Ascendente)</option>
              <option value="desc" className="bg-zinc-900">Mayor a Menor (Descendente)</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-300">
            {error}
          </div>
        )}

        {/* Generate Button */}
        <div className="pt-2">
          <button
            type="button"
            disabled={isGenerating}
            onClick={handleStartDraw}
            className={`w-full py-4 text-base sm:text-lg btn-pro-primary rounded-2xl ${
              isGenerating ? '!bg-zinc-800 !text-zinc-500 !cursor-not-allowed !shadow-none !transform-none opacity-60' : ''
            }`}
          >
            <RefreshCw className={`w-5 h-5 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>{isGenerating ? 'Extrayendo esferas 3D...' : '✨ ¡Sortear Números con Cuenta Regresiva!'}</span>
          </button>
        </div>
      </div>

      {/* Results Display with 3D Spheres */}
      {results.length > 0 && (
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <h2 className="text-base font-bold text-white font-display">
                Esferas Extraídas ({results.length})
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopy}
                className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-zinc-300 transition-colors flex items-center gap-1.5"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? '¡Copiado!' : 'Copiar'}</span>
              </button>
              <button
                type="button"
                onClick={handleDownloadCsv}
                className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-zinc-300 transition-colors flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>CSV</span>
              </button>
            </div>
          </div>

          {/* 3D Spheres Ball Stage */}
          <div className="flex flex-wrap gap-4 sm:gap-6 justify-center py-8">
            {results.map((num, idx) => {
              const gradient = BALL_GRADIENTS[idx % BALL_GRADIENTS.length];
              return (
                <div
                  key={idx}
                  className="group relative flex flex-col items-center justify-center animate-in zoom-in-75 duration-300"
                  style={{ animationDelay: `${idx * 80}ms` }}
                >
                  {/* 3D Ball Sphere */}
                  <div
                    className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-tr ${gradient} shadow-2xl flex items-center justify-center relative p-1 border-2 border-white/50 transform group-hover:scale-110 group-hover:-translate-y-1 transition-all select-none`}
                  >
                    {/* Specular 3D Reflection Highlight */}
                    <div className="absolute top-1.5 left-3 w-6 h-3 rounded-full bg-white/60 blur-[1px] rotate-[-20deg]" />

                    {/* Inner White Ring Center */}
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white/95 shadow-inner border border-black/10 flex items-center justify-center">
                      <span className="text-2xl sm:text-3xl font-black font-display text-zinc-950 font-mono-num tracking-tight">
                        {num}
                      </span>
                    </div>
                  </div>

                  <span className="text-[11px] font-mono font-bold text-zinc-400 mt-2">
                    Bola #{idx + 1}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Verification Hash */}
          {auditHash && (
            <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between flex-wrap gap-2 text-xs font-mono">
              <div className="flex items-center gap-2 text-zinc-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Hash Criptográfico SHA-256:</span>
              </div>
              <span className="text-emerald-400/90 break-all">{auditHash}</span>
            </div>
          )}
        </div>
      )}

      {/* Live Stream Stage */}
      {results.length > 0 && (
        <LiveStreamStage
          isOpen={showLiveStream}
          onClose={() => setShowLiveStream(false)}
          title="Extracción de Números de Lotería"
          winner={`Números: ${results.slice(0, 5).join(' - ')}${results.length > 5 ? '...' : ''}`}
          auditHash={auditHash}
          platform="Números Criptográficos"
          onReroll={handleStartDraw}
        />
      )}

      {/* Winner Export Modal */}
      {results.length > 0 && (
        <WinnerExportModal
          isOpen={showExportModal}
          onClose={() => setShowExportModal(false)}
          winnerName={`Números: ${results.join(' - ')}`}
          drawTitle="Sorteo de Números"
          auditHash={auditHash}
          platform="Lotería de Números"
        />
      )}
    </div>
  );
}
