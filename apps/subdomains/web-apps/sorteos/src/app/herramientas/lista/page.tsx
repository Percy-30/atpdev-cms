"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  ListOrdered, Trophy, Sparkles, RefreshCw, Trash2, 
  Copy, Check, Share2, Award, Tv, Upload, Settings,
  Volume2, VolumeX, Maximize2, Minimize2, RotateCcw, FileText
} from 'lucide-react';
import { ConfettiEffect } from '@/components/ConfettiEffect';
import { ToolSwitcher } from '@/components/ToolSwitcher';
import { Countdown3DOverlay } from '@/components/Countdown3DOverlay';
import { LiveStreamStage } from '@/components/LiveStreamStage';
import { WinnerExportModal } from '@/components/WinnerExportModal';
import { shuffleArray, generateSha256Hash } from '@/lib/randomEngine';
import { 
  playWinnerFanfare, isAudioMuted, toggleAudioMute 
} from '@/lib/soundEffects';

export default function ListaPage() {
  const [title, setTitle] = useState<string>('Sorteo por Nombres al Azar');
  const [rawText, setRawText] = useState<string>(
    "María García\nCarlos López\nAna Torres\nJuan Pérez\nSofía Mendoza\nDiego Fernández\nValentina Ríos\nMateo Silva\nLucía Morales\nGabriel Castro"
  );
  const [winnersCount, setWinnersCount] = useState<number>(1);
  const [substitutesCount, setSubstitutesCount] = useState<number>(1);
  const [removeDuplicates, setRemoveDuplicates] = useState<boolean>(true);
  const [useCountdown, setUseCountdown] = useState<boolean>(true);
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [showCountdown, setShowCountdown] = useState<boolean>(false);
  const [winners, setWinners] = useState<string[]>([]);
  const [substitutes, setSubstitutes] = useState<string[]>([]);
  const [auditHash, setAuditHash] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [muted, setMuted] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showLiveStream, setShowLiveStream] = useState<boolean>(false);
  const [showExportModal, setShowExportModal] = useState<boolean>(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  const getParticipants = (): string[] => {
    const list = rawText
      .split(/[\n,]+/)
      .map((item) => item.trim())
      .filter((item) => item.length > 0);

    return removeDuplicates ? Array.from(new Set(list)) : list;
  };

  const participants = getParticipants();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setRawText(content);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleStartDraw = () => {
    if (participants.length === 0 || isDrawing) return;
    if (useCountdown) {
      setShowCountdown(true);
    } else {
      executeDraw();
    }
  };

  const executeDraw = async () => {
    setShowCountdown(false);
    setIsDrawing(true);
    setWinners([]);
    setSubstitutes([]);

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
    playWinnerFanfare();
  };

  const handleCopyWinners = () => {
    const text = `🏆 Ganadores de ${title || 'Sorteo'}:\n${winners.map((w, i) => `${i + 1}. ${w}`).join('\n')}${
      substitutes.length > 0 ? `\n\n👥 Suplentes:\n${substitutes.map((s, i) => `${i + 1}. ${s}`).join('\n')}` : ''
    }\n\nVerificado con Sorteos Pro`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <ToolSwitcher />
      <ConfettiEffect active={winners.length > 0 && !isDrawing} />

      {/* 3D Countdown Modal */}
      <Countdown3DOverlay
        active={showCountdown}
        seconds={3}
        title="Eligiendo Ganadores de la Lista"
        onComplete={executeDraw}
      />

      {/* Hero Header Estilo AppSorteos */}
      <div className="text-center pt-2 sm:pt-4">
        {/* Pastel Icon Badge */}
        <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-4 shadow-xs">
          <ListOrdered className="w-7 h-7" />
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight mb-2 font-display">
          Sorteo por Nombres al Azar
        </h1>
        
        <p className="text-base sm:text-lg text-slate-500 max-w-xl mx-auto">
          Escoge un ganador al azar de una <strong className="font-semibold text-slate-700">lista de nombres</strong> con nuestra App
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

      {/* Main Container */}
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Form Card (Exact AppSorteos Structure) */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
          {/* Título Input */}
          <div className="space-y-1.5">
            <label htmlFor="draw-title" className="block text-sm font-semibold text-slate-700">
              Título
            </label>
            <input
              id="draw-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej. Sorteo de fin de mes..."
              className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#d91a7a] focus:ring-4 focus:ring-pink-50 transition-all text-sm shadow-xs"
            />
          </div>

          {/* Participantes Textarea */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="participants-text" className="block text-sm font-semibold text-slate-700">
                Participantes
              </label>
              {participants.length > 0 && (
                <button
                  type="button"
                  onClick={() => setRawText('')}
                  className="text-xs text-slate-400 hover:text-red-500 transition-colors flex items-center gap-1 font-medium"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Vaciar lista</span>
                </button>
              )}
            </div>

            <div className="relative">
              <textarea
                id="participants-text"
                rows={6}
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                placeholder="Escribe o pega los participantes (un nombre por línea o separados por coma)..."
                className="w-full p-4 pb-8 bg-white border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#d91a7a] focus:ring-4 focus:ring-pink-50 transition-all resize-none text-sm leading-relaxed shadow-xs"
              />
              {/* Bottom right magenta counter matching screenshot */}
              <span className="absolute bottom-3 right-4 text-sm font-semibold text-pink-600 bg-white/95 px-1 rounded select-none pointer-events-none">
                {participants.length}
              </span>
            </div>

            {/* Bottom Actions: Import from file */}
            <div className="flex items-center justify-between pt-1">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-sm font-semibold text-pink-600 hover:text-pink-700 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Upload className="w-4 h-4" />
                <span>Importar desde archivo</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".txt,.csv"
                onChange={handleFileUpload}
                className="hidden"
              />

              <button
                type="button"
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="text-xs font-semibold text-slate-500 hover:text-slate-700 flex items-center gap-1 transition-colors"
              >
                <Settings className="w-3.5 h-3.5" />
                <span>{showAdvanced ? 'Ocultar opciones' : 'Opciones avanzadas'}</span>
              </button>
            </div>
          </div>

          {/* Opciones Avanzadas (Ganadores, Suplentes, Duplicados) */}
          {showAdvanced && (
            <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-1 duration-150">
              <div className="space-y-1.5">
                <label htmlFor="winners-count" className="text-xs font-semibold text-slate-700">
                  Número de Ganadores:
                </label>
                <input
                  id="winners-count"
                  type="number"
                  min={1}
                  max={Math.max(1, participants.length)}
                  value={winnersCount}
                  onChange={(e) => setWinnersCount(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-[#d91a7a] focus:ring-2 focus:ring-pink-50"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="substitutes-count" className="text-xs font-semibold text-slate-700">
                  Número de Suplentes:
                </label>
                <input
                  id="substitutes-count"
                  type="number"
                  min={0}
                  max={Math.max(0, participants.length - winnersCount)}
                  value={substitutesCount}
                  onChange={(e) => setSubstitutesCount(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-[#d91a7a] focus:ring-2 focus:ring-pink-50"
                />
              </div>

              <div className="sm:col-span-2 flex flex-col sm:flex-row gap-4 pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-medium text-slate-700">
                  <input
                    type="checkbox"
                    checked={removeDuplicates}
                    onChange={(e) => setRemoveDuplicates(e.target.checked)}
                    className="rounded border-slate-300 text-pink-600 focus:ring-pink-500"
                  />
                  <span>Eliminar automáticamente nombres duplicados</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer select-none text-xs font-medium text-slate-700">
                  <input
                    type="checkbox"
                    checked={useCountdown}
                    onChange={(e) => setUseCountdown(e.target.checked)}
                    className="rounded border-slate-300 text-pink-600 focus:ring-pink-500"
                  />
                  <span>Cuenta regresiva 3D con audio</span>
                </label>
              </div>
            </div>
          )}

          {/* Centered Large Comenzar Button */}
          <div className="pt-4 text-center">
            <button
              type="button"
              disabled={participants.length === 0 || isDrawing}
              onClick={handleStartDraw}
              className="bg-[#d91a7a] hover:bg-[#c2186b] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-base sm:text-lg py-3.5 px-12 rounded-xl shadow-md hover:shadow-lg shadow-pink-500/25 transition-all duration-200 inline-flex items-center justify-center gap-2 cursor-pointer"
            >
              {isDrawing ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Sorteando...</span>
                </>
              ) : (
                <span>Comenzar</span>
              )}
            </button>
          </div>
        </div>

        {/* Results Card (Clean Light Celebration) */}
        {winners.length > 0 && (
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-pink-200 shadow-lg space-y-6 text-center animate-in fade-in zoom-in-95 duration-200">
            {/* Trophy Squircle */}
            <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto shadow-xs">
              <Trophy className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display">
                ¡Felicidades a los Ganadores!
              </h2>
              <p className="text-xs text-slate-500 font-medium">
                {title} • Sorteo certificado y verificado
              </p>
            </div>

            {/* Winners List */}
            <div className="space-y-2 max-w-md mx-auto text-left">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600 block">
                🏆 Ganador(es) Titular(es):
              </span>
              <div className="space-y-2">
                {winners.map((winner, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-xl bg-pink-50/70 border border-pink-200/80 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-7 h-7 rounded-full bg-pink-600 text-white text-xs font-bold flex items-center justify-center">
                        {index + 1}
                      </span>
                      <span className="text-lg font-bold text-slate-900 font-display">{winner}</span>
                    </div>
                    <Trophy className="w-5 h-5 text-amber-500" />
                  </div>
                ))}
              </div>
            </div>

            {/* Substitutes List */}
            {substitutes.length > 0 && (
              <div className="space-y-2 max-w-md mx-auto text-left pt-2 border-t border-slate-100">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                  👥 Suplentes de Reserva:
                </span>
                <div className="space-y-1.5">
                  {substitutes.map((sub, index) => (
                    <div
                      key={index}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
                    >
                      <span className="text-slate-700 font-semibold">#{index + 1} {sub}</span>
                      <span className="text-[10px] text-slate-400 font-medium">Suplente</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Cryptographic SHA-256 Audit Card */}
            {auditHash && (
              <div className="max-w-md mx-auto p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] font-mono text-slate-500 break-all text-left">
                <span className="font-semibold text-slate-700 block mb-0.5">Hash de Auditoría SHA-256:</span>
                {auditHash}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              <button
                type="button"
                onClick={handleCopyWinners}
                className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs flex items-center gap-1.5 transition-colors"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? '¡Copiado!' : 'Copiar Texto'}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowExportModal(true)}
                className="py-2.5 px-4 rounded-xl bg-[#d91a7a] hover:bg-[#c2186b] text-white font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
              >
                <Share2 className="w-4 h-4" />
                <span>Descargar Tarjeta</span>
              </button>

              <button
                type="button"
                onClick={() => setShowLiveStream(true)}
                className="py-2.5 px-4 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 font-semibold text-xs flex items-center gap-1.5 transition-colors"
              >
                <Tv className="w-4 h-4" />
                <span>Modo Streaming</span>
              </button>

              <button
                type="button"
                onClick={handleStartDraw}
                className="py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs flex items-center gap-1.5 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Re-sortear</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Live Stream Stage */}
      {winners.length > 0 && (
        <LiveStreamStage
          isOpen={showLiveStream}
          onClose={() => setShowLiveStream(false)}
          title={title}
          winner={winners[0]}
          substitutes={substitutes}
          auditHash={auditHash || ''}
          platform="Sorteo por Nombres"
          onReroll={handleStartDraw}
        />
      )}

      {/* Winner Export Modal */}
      {winners.length > 0 && (
        <WinnerExportModal
          isOpen={showExportModal}
          onClose={() => setShowExportModal(false)}
          winnerName={winners[0]}
          drawTitle={title}
          auditHash={auditHash || ''}
          platform="Sorteo por Nombres"
        />
      )}
    </div>
  );
}
