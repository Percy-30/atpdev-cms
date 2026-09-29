"use client";

import React, { useState, useEffect } from 'react';
import { 
  Users, Sparkles, Shuffle, Copy, Check, UserPlus, ShieldAlert, 
  Trophy, ShieldCheck, Volume2, VolumeX, Maximize2, Minimize2, Share2, Tv 
} from 'lucide-react';
import { divideIntoTeams, generateSha256Hash } from '@/lib/randomEngine';
import ConfettiEffect from '@/components/ConfettiEffect';
import { ToolSwitcher } from '@/components/ToolSwitcher';
import { Countdown3DOverlay } from '@/components/Countdown3DOverlay';
import { LiveStreamStage } from '@/components/LiveStreamStage';
import { WinnerExportModal } from '@/components/WinnerExportModal';
import { 
  playCardFlip, playWinnerFanfare, isAudioMuted, toggleAudioMute 
} from '@/lib/soundEffects';

const TEAM_NAMES_PRESETS = [
  ['🔴 Titanes Rojos', '🔵 Centinelas Azules', '🟢 Dragones Verdes', '🟡 Fénix Dorados', '🟣 Halcones Violetas', '⚪ Lobos Blancos'],
  ['⚡ Relámpago', '🌪️ Tormenta', '🔥 Fuego', '🌊 Tsunami', '🌋 Volcán', '☄️ Meteoro'],
  ['Equipo Alfa', 'Equipo Beta', 'Equipo Gamma', 'Equipo Delta', 'Equipo Épsilon', 'Equipo Omega']
];

export default function EquiposPage() {
  const [inputText, setInputText] = useState<string>(
    "Alejandro\nBeatriz\nCarlos\nDaniela\nEduardo\nFernanda\nGabriel\nHelena\nIgnacio\nJimena\nKevin\nLaura"
  );
  const [teamCount, setTeamCount] = useState<number>(2);
  const [namingStyle, setNamingStyle] = useState<number>(0);
  const [teams, setTeams] = useState<{ teamNumber: number; name: string; members: string[] }[]>([]);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [showCountdown, setShowCountdown] = useState<boolean>(false);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [copiedTeam, setCopiedTeam] = useState<number | null>(null);
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

  const participantsList = inputText
    .split('\n')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  const handleStartDraw = () => {
    setError('');
    if (participantsList.length < 2) {
      setError('Ingresa al menos 2 participantes para poder armar equipos.');
      return;
    }
    if (teamCount < 2) {
      setError('Debes crear al menos 2 equipos.');
      return;
    }
    if (teamCount > participantsList.length) {
      setError(`No puedes crear ${teamCount} equipos con solo ${participantsList.length} participantes.`);
      return;
    }

    setShowCountdown(true);
  };

  const executeGeneration = async () => {
    setShowCountdown(false);
    setIsGenerating(true);
    setShowConfetti(false);

    try {
      const rawTeams = divideIntoTeams(participantsList, teamCount);
      const presetNames = TEAM_NAMES_PRESETS[namingStyle] || [];
      const formatted = rawTeams.map((t, idx) => ({
        teamNumber: t.teamNumber,
        name: presetNames[idx] || `Equipo ${t.teamNumber}`,
        members: t.members
      }));

      setTeams(formatted);
      const hash = await generateSha256Hash(`teams-${Date.now()}-${participantsList.join(',')}`);
      setAuditHash(hash);
      setShowConfetti(true);
      playCardFlip();
      playWinnerFanfare();
    } catch (err: any) {
      setError(err.message || 'Error al armar equipos');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyTeam = (idx: number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTeam(idx);
    setTimeout(() => setCopiedTeam(null), 2000);
  };

  const handleCopyAll = () => {
    const text = teams.map((t) => `${t.name}:\n` + t.members.map((m) => `- ${m}`).join('\n')).join('\n\n');
    navigator.clipboard.writeText(text);
    setCopiedTeam(999);
    setTimeout(() => setCopiedTeam(null), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <ToolSwitcher />
      {showConfetti && <ConfettiEffect />}

      {/* 3D Countdown Modal */}
      <Countdown3DOverlay
        active={showCountdown}
        seconds={3}
        title="Barajando y Formando Equipos"
        onComplete={executeGeneration}
      />

      {/* Hero Header Estilo AppSorteos */}
      <div className="text-center pt-2 sm:pt-4">
        {/* Pastel Icon Badge */}
        <div className="w-14 h-14 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center mx-auto mb-4 shadow-xs">
          <Users className="w-7 h-7" />
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight mb-2 font-display">
          Generador de Equipos al Azar
        </h1>
        
        <p className="text-base sm:text-lg text-slate-500 max-w-xl mx-auto">
          Divide listas de participantes en grupos o equipos equilibrados de manera equitativa e imparcial
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
          {teams.length > 0 && (
            <>
              <button
                type="button"
                onClick={() => setShowExportModal(true)}
                className="py-1.5 px-3 rounded-lg bg-pink-50 hover:bg-pink-100 text-pink-700 text-xs font-semibold flex items-center gap-1 transition-colors"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Exportar</span>
              </button>
              <button
                type="button"
                onClick={() => setShowLiveStream(true)}
                className="py-1.5 px-3 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-semibold flex items-center gap-1 transition-colors"
              >
                <Tv className="w-3.5 h-3.5" />
                <span>En Vivo</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Form */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Participants Textarea */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="equipos-textarea" className="text-xs font-semibold text-slate-700">
                Participantes ({participantsList.length}):
              </label>
              <button
                type="button"
                onClick={() => setInputText('')}
                className="text-xs text-slate-400 hover:text-red-500 transition-colors font-medium cursor-pointer"
              >
                Vaciar lista
              </button>
            </div>
            <textarea
              id="equipos-textarea"
              name="equiposTextarea"
              rows={8}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ingresa un nombre por línea..."
              aria-label="Lista de participantes para dividir en equipos, un nombre por línea"
              className="w-full p-4 rounded-xl bg-white border border-slate-200 text-slate-900 text-sm focus:outline-none focus:border-[#d91a7a] focus:ring-2 focus:ring-pink-50 resize-none transition-colors shadow-xs leading-relaxed"
            />
          </div>

          {/* Configuration Controls */}
          <div className="space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              {/* Number of Teams */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Cantidad de Equipos a Formar:
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {[2, 3, 4, 5, 6].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setTeamCount(num)}
                      className={`py-2.5 rounded-xl font-bold font-mono text-sm transition-all cursor-pointer ${
                        teamCount === num
                          ? 'bg-[#d91a7a] text-white shadow-xs'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              {/* Naming Style */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Estilo de Nombres para los Equipos:
                </label>
                <select
                  value={namingStyle}
                  onChange={(e) => setNamingStyle(parseInt(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-slate-200 text-slate-900 font-medium text-sm focus:outline-none focus:border-[#d91a7a] shadow-xs"
                >
                  <option value={0}>🛡️ Épico / Colores (Titanes, Fénix...)</option>
                  <option value={1}>⚡ Elementos (Fuego, Relámpago...)</option>
                  <option value={2}>🔤 Alfabeto Griego (Alfa, Beta...)</option>
                </select>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600 font-medium">
                {error}
              </div>
            )}

            {/* Action Button */}
            <button
              type="button"
              disabled={isGenerating}
              onClick={handleStartDraw}
              className="w-full py-3.5 text-base sm:text-lg bg-[#d91a7a] hover:bg-[#c2186b] active:scale-95 disabled:opacity-50 text-white font-bold rounded-xl shadow-md hover:shadow-lg shadow-pink-500/20 flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              <Shuffle className={`w-5 h-5 ${isGenerating ? 'animate-spin' : ''}`} />
              <span>{isGenerating ? 'Formando equipos...' : 'Comenzar Reparto'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Teams Results Display */}
      {teams.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <h2 className="text-xl font-bold font-display text-slate-900 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              <span>Equipos Conformados ({teams.length})</span>
            </h2>

            <button
              type="button"
              onClick={handleCopyAll}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-semibold text-slate-700 transition-colors flex items-center gap-2 cursor-pointer"
            >
              {copiedTeam === 999 ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copiedTeam === 999 ? '¡Todos Copiados!' : 'Copiar Todos los Equipos'}</span>
            </button>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teams.map((t, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4 hover:border-pink-300 transition-all"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <span className="font-bold text-base text-slate-900 font-display flex items-center gap-2">
                    {t.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopyTeam(idx, `${t.name}:\n` + t.members.join('\n'))}
                    className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                    title="Copiar este equipo"
                  >
                    {copiedTeam === idx ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* Members list */}
                <div className="space-y-2">
                  {t.members.map((member, mIdx) => (
                    <div
                      key={mIdx}
                      className="flex items-center gap-2.5 text-xs text-slate-800 bg-slate-50 p-2.5 rounded-lg"
                    >
                      <span className="w-5 h-5 rounded-full bg-pink-100 text-pink-700 font-bold flex items-center justify-center text-[10px]">
                        {mIdx + 1}
                      </span>
                      <span className="font-semibold truncate">{member}</span>
                    </div>
                  ))}
                </div>

                <div className="text-[11px] text-slate-400 text-right pt-1 font-medium">
                  {t.members.length} integrantes
                </div>
              </div>
            ))}
          </div>

          {/* Verification Hash */}
          {auditHash && (
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between flex-wrap gap-2 text-xs font-mono">
              <div className="flex items-center gap-2 text-slate-600">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span className="font-semibold">Hash Criptográfico SHA-256:</span>
              </div>
              <span className="text-slate-500 break-all">{auditHash}</span>
            </div>
          )}
        </div>
      )}

      {/* Live Stream Stage */}
      {teams.length > 0 && (
        <LiveStreamStage
          isOpen={showLiveStream}
          onClose={() => setShowLiveStream(false)}
          title="División de Equipos"
          winner={`Formados: ${teams.map((t) => t.name).join(', ')}`}
          auditHash={auditHash}
          platform="Generador de Equipos"
          onReroll={handleStartDraw}
        />
      )}

      {/* Winner Export Modal */}
      {teams.length > 0 && (
        <WinnerExportModal
          isOpen={showExportModal}
          onClose={() => setShowExportModal(false)}
          winnerName={`Equipos: ${teams.map((t) => `${t.name} (${t.members.length})`).join(' vs ')}`}
          drawTitle="División de Equipos"
          auditHash={auditHash}
          platform="Equipos Equilibrados"
        />
      )}
    </div>
  );
}
