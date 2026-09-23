"use client";

import React, { useState } from 'react';
import { Hash, Sparkles, Copy, Check, RefreshCw, Sliders, ShieldCheck, Download } from 'lucide-react';
import { generateNumbers, generateSha256Hash } from '@/lib/randomEngine';
import ConfettiEffect from '@/components/ConfettiEffect';

export default function NumerosPage() {
  const [min, setMin] = useState<number>(1);
  const [max, setMax] = useState<number>(100);
  const [quantity, setQuantity] = useState<number>(5);
  const [allowDuplicates, setAllowDuplicates] = useState<boolean>(false);
  const [sortOrder, setSortOrder] = useState<'none' | 'asc' | 'desc'>('none');
  const [results, setResults] = useState<number[]>([7, 23, 42, 68, 91]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [auditHash, setAuditHash] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleGenerate = async () => {
    setError('');
    if (min >= max) {
      setError('El valor mínimo debe ser estrictamente menor que el valor máximo.');
      return;
    }
    if (!allowDuplicates && quantity > max - min + 1) {
      setError(`No es posible generar ${quantity} números únicos en un rango de ${max - min + 1} valores.`);
      return;
    }

    setIsGenerating(true);
    setShowConfetti(false);

    setTimeout(async () => {
      try {
        let nums = generateNumbers(min, max, quantity, allowDuplicates);
        if (sortOrder === 'asc') nums.sort((a, b) => a - b);
        if (sortOrder === 'desc') nums.sort((a, b) => b - a);

        setResults(nums);
        const hash = await generateSha256Hash(`numbers-${min}-${max}-${quantity}-${nums.join(',')}-${Date.now()}`);
        setAuditHash(hash);
        setShowConfetti(true);
      } catch (err: any) {
        setError(err.message || 'Error al generar números');
      } finally {
        setIsGenerating(false);
      }
    }, 500);
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {showConfetti && <ConfettiEffect />}

      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full gold-gradient-badge text-xs font-mono font-bold uppercase tracking-wider">
          <Hash className="w-3.5 h-3.5" />
          <span>Generador CSPRNG</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black font-display text-white tracking-tight">
          Generador de Números Aleatorios
        </h1>
        <p className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto">
          Genera números aleatorios únicos o repetidos para rifas, bingos, loterías o sorteos con certificado verificable.
        </p>
      </div>

      {/* Config Card */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/5 pb-4">
          <div className="flex items-center gap-2 text-sm font-bold text-white">
            <Sliders className="w-4 h-4 text-purple-400" />
            <span>Configuración del Rango</span>
          </div>

          {/* Presets */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-zinc-500 font-mono">Plantillas:</span>
            <button
              onClick={() => applyPreset(1, 100, 5, true)}
              className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 transition-colors"
            >
              1 - 100
            </button>
            <button
              onClick={() => applyPreset(1, 75, 1, true)}
              className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 transition-colors"
            >
              Bingo (1-75)
            </button>
            <button
              onClick={() => applyPreset(1, 1000, 10, true)}
              className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 transition-colors"
            >
              Rifa (1-1000)
            </button>
            <button
              onClick={() => applyPreset(1, 20, 1, true)}
              className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 transition-colors"
            >
              D20 (1-20)
            </button>
          </div>
        </div>

        {/* Inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-mono text-zinc-400 mb-2">Desde (Mínimo):</label>
            <input
              type="number"
              value={min}
              onChange={(e) => setMin(parseInt(e.target.value) || 0)}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-mono font-bold focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-mono text-zinc-400 mb-2">Hasta (Máximo):</label>
            <input
              type="number"
              value={max}
              onChange={(e) => setMax(parseInt(e.target.value) || 0)}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-mono font-bold focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs font-mono text-zinc-400 mb-2">Cantidad de Números:</label>
            <input
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
            onClick={handleGenerate}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 text-white font-bold font-display text-base shadow-xl shadow-purple-600/25 hover:opacity-95 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
          >
            <RefreshCw className={`w-5 h-5 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>{isGenerating ? 'Generando con Web Crypto...' : '✨ ¡Generar Números Aleatorios!'}</span>
          </button>
        </div>
      </div>

      {/* Results Display */}
      {results.length > 0 && (
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <h2 className="text-base font-bold text-white font-display">
                Resultados Extraídos ({results.length})
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

          {/* Numbers Grid */}
          <div className="flex flex-wrap gap-3 justify-center py-6">
            {results.map((num, idx) => (
              <div
                key={idx}
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/15 flex flex-col items-center justify-center shadow-lg hover:border-amber-400/50 hover:scale-105 transition-all"
              >
                <span className="text-[10px] font-mono text-zinc-500">#{idx + 1}</span>
                <span className="text-xl sm:text-2xl font-black font-display text-white font-mono-num">
                  {num}
                </span>
              </div>
            ))}
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
    </div>
  );
}
