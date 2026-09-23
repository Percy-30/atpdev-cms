"use client";

import React, { useState } from 'react';
import { 
  ListOrdered, Trophy, Sparkles, RefreshCw, Trash2, 
  Copy, Check, Share2, Award, UserCheck, Shuffle
} from 'lucide-react';
import { ConfettiEffect } from '@/components/ConfettiEffect';
import { shuffleArray, getSecureRandomInt, generateSha256Hash } from '@/lib/randomEngine';

export default function ListaPage() {
  const [rawText, setRawText] = useState<string>(
    "María García\nCarlos López\nAna Torres\nJuan Pérez\nSofía Mendoza\nDiego Fernández\nValentina Ríos\nMateo Silva\nLucía Morales\nGabriel Castro"
  );
  const [winnersCount, setWinnersCount] = useState<number>(1);
  const [substitutesCount, setSubstitutesCount] = useState<number>(1);
  const [removeDuplicates, setRemoveDuplicates] = useState<boolean>(true);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [winners, setWinners] = useState<string[]>([]);
  const [substitutes, setSubstitutes] = useState<string[]>([]);
  const [auditHash, setAuditHash] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const getParticipants = (): string[] => {
    const list = rawText
      .split(/[\n,]+/)
      .map((item) => item.trim())
      .filter((item) => item.length > 0);

    return removeDuplicates ? Array.from(new Set(list)) : list;
  };

  const participants = getParticipants();

  const handleStartDraw = () => {
    if (participants.length === 0 || isDrawing) return;

    setIsDrawing(true);
    setWinners([]);
    setSubstitutes([]);
    setCountdown(3);

    // Animación de cuenta regresiva emocionante
    let count = 3;
    const timer = setInterval(() => {
      count--;
      if (count > 0) {
        setCountdown(count);
      } else {
        clearInterval(timer);
        setCountdown(null);
        finalizeDraw();
      }
    }, 800);
  };

  const finalizeDraw = async () => {
    const shuffled = shuffleArray(participants);
    const selectedWinners = shuffled.slice(0, Math.min(winnersCount, shuffled.length));
    const remaining = shuffled.slice(selectedWinners.length);
    const selectedSubstitutes = remaining.slice(0, Math.min(substitutesCount, remaining.length));

    const timestamp = new Date().toISOString();
    const hash = await generateSha256Hash(`${timestamp}|WINNERS:${selectedWinners.join(',')}|TOTAL:${participants.length}`);

    setWinners(selectedWinners);
    setSubstitutes(selectedSubstitutes);
    setAuditHash(hash);
    setIsDrawing(false);
  };

  const handleCopyWinners = () => {
    const text = `🏆 Ganadores del Sorteo:\n${winners.map((w, i) => `${i + 1}. ${w}`).join('\n')}\n\n👥 Suplentes:\n${substitutes.map((s, i) => `${i + 1}. ${s}`).join('\n')}\n\nVerificado con Sorteos Pro`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      <ConfettiEffect active={winners.length > 0 && !isDrawing} />

      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full purple-gradient-badge text-xs font-mono font-bold uppercase tracking-wider">
          <ListOrdered className="w-3.5 h-3.5" />
          <span>Herramienta Gratuita</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black font-display text-white tracking-tight">
          Sorteo por Lista de Nombres
        </h1>
        <p className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto">
          Pega los nombres de tus participantes, ajusta el número de ganadores y realiza un sorteo 100% aleatorio y sin trampas.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Form & Inputs */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-card rounded-3xl p-6 sm:p-8 space-y-5 border border-white/10">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-white font-display flex items-center gap-2">
                <span>Lista de Participantes</span>
                <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 font-normal">
                  {participants.length} nombres válidos
                </span>
              </label>
              <button
                type="button"
                onClick={() => setRawText('')}
                className="text-xs text-zinc-400 hover:text-red-400 flex items-center gap-1 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Limpiar</span>
              </button>
            </div>

            <textarea
              rows={9}
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder="Pega aquí los nombres (uno por línea o separados por comas)..."
              className="w-full rounded-2xl bg-black/40 border border-white/10 p-4 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 font-mono"
            />

            {/* Config Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-white/10">
              <div className="space-y-1.5">
                <label className="text-xs font-mono text-zinc-300">Número de Ganadores:</label>
                <input
                  type="number"
                  min={1}
                  max={Math.max(1, participants.length)}
                  value={winnersCount}
                  onChange={(e) => setWinnersCount(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono text-zinc-300">Número de Suplentes:</label>
                <input
                  type="number"
                  min={0}
                  max={10}
                  value={substitutesCount}
                  onChange={(e) => setSubstitutesCount(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full rounded-xl bg-white/5 border border-white/10 px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-violet-500"
                />
              </div>
            </div>

            <label className="flex items-center gap-3 pt-1 cursor-pointer text-xs text-zinc-300 select-none">
              <input
                type="checkbox"
                checked={removeDuplicates}
                onChange={(e) => setRemoveDuplicates(e.target.checked)}
                className="w-4 h-4 rounded text-violet-600 bg-white/5 border-white/20 focus:ring-0"
              />
              <span>Eliminar nombres repetidos automáticamente (1 voto por persona)</span>
            </label>

            {/* Draw Button */}
            <button
              type="button"
              disabled={participants.length === 0 || isDrawing}
              onClick={handleStartDraw}
              className={`w-full py-4 rounded-2xl font-bold font-display text-base transition-all flex items-center justify-center gap-2 shadow-xl ${
                participants.length === 0 || isDrawing
                  ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-violet-600 via-pink-500 to-amber-400 text-white hover:scale-[1.02] shadow-violet-500/25 active:scale-95'
              }`}
            >
              {isDrawing ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Sorteando ganadores...</span>
                </>
              ) : (
                <>
                  <Trophy className="w-5 h-5 text-amber-300" />
                  <span>¡Realizar Sorteo Ahora!</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Countdown or Results */}
        <div className="lg:col-span-5 flex flex-col justify-center">
          {countdown !== null ? (
            <div className="glass-card rounded-3xl p-12 text-center space-y-4 border border-violet-500/40 shadow-2xl flex flex-col items-center justify-center min-h-[380px]">
              <span className="text-xs font-mono uppercase tracking-widest text-pink-400">Eligiendo al azar</span>
              <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-violet-600 to-pink-500 flex items-center justify-center text-5xl font-black text-white font-display animate-bounce shadow-2xl shadow-pink-500/50">
                {countdown}
              </div>
              <p className="text-xs text-zinc-400 font-mono animate-pulse">Mezclando participantes...</p>
            </div>
          ) : winners.length > 0 ? (
            <div className="glass-card rounded-3xl p-6 sm:p-8 space-y-6 border border-amber-500/30 shadow-2xl shadow-amber-500/10 animate-fade-in">
              <div className="text-center space-y-1">
                <div className="inline-flex p-3 rounded-2xl bg-amber-500/10 text-amber-400 mb-2">
                  <Award className="w-8 h-8" />
                </div>
                <h2 className="text-2xl font-black font-display text-white">¡Ganadores Seleccionados!</h2>
                <p className="text-xs text-zinc-400 font-mono">Sorteo completado con éxito</p>
              </div>

              {/* Winners List */}
              <div className="space-y-2">
                <span className="text-[11px] font-mono uppercase tracking-wider text-amber-400 font-bold">
                  🏆 Ganador(es) Titular(es):
                </span>
                <div className="space-y-2">
                  {winners.map((winner, index) => (
                    <div
                      key={index}
                      className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/15 to-transparent border border-amber-500/30 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-amber-400 text-black text-xs font-black flex items-center justify-center">
                          {index + 1}
                        </span>
                        <span className="text-base font-bold text-white font-display">{winner}</span>
                      </div>
                      <Trophy className="w-4 h-4 text-amber-400" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Substitutes List */}
              {substitutes.length > 0 && (
                <div className="space-y-2 pt-2 border-t border-white/10">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400 font-bold">
                    👥 Suplentes de Reserva:
                  </span>
                  <div className="space-y-1.5">
                    {substitutes.map((sub, index) => (
                      <div
                        key={index}
                        className="p-2.5 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between text-xs"
                      >
                        <span className="text-zinc-300 font-medium">#{index + 1} {sub}</span>
                        <span className="text-[10px] font-mono text-zinc-500">Suplente</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Audit Hash */}
              {auditHash && (
                <div className="p-3 rounded-xl bg-black/40 border border-white/5 text-[10px] font-mono text-zinc-400 break-all">
                  <span className="text-zinc-500 block mb-0.5">Hash de Auditoría Criptográfica:</span>
                  {auditHash}
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleCopyWinners}
                  className="flex-1 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors border border-white/10"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? '¡Copiado!' : 'Copiar Resultados'}</span>
                </button>
                <button
                  type="button"
                  onClick={handleStartDraw}
                  className="px-4 py-3 rounded-xl bg-violet-600/30 hover:bg-violet-600/50 text-violet-300 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Shuffle className="w-4 h-4" />
                  <span>Volver a Sortear</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="glass-card rounded-3xl p-8 text-center space-y-3 border border-white/5 text-zinc-500 flex flex-col items-center justify-center min-h-[380px]">
              <Trophy className="w-12 h-12 opacity-30 text-zinc-400" />
              <p className="text-sm font-medium text-zinc-400">Los ganadores aparecerán aquí</p>
              <p className="text-xs text-zinc-600 max-w-xs">
                Añade participantes en el formulario de la izquierda y presiona el botón para iniciar el sorteo aleatorio.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
