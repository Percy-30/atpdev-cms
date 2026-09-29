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
      setError(err.message || 'Error al conformar los equipos.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyTeam = (teamIdx: number, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedTeam(teamIdx);
    setTimeout(() => setCopiedTeam(null), 2000);
  };

  const handleCopyAll = () => {
    const fullSummary = teams
      .map((t) => `${t.name}:\n` + t.members.map((m, i) => `  ${i + 1}. ${m}`).join('\n'))
      .join('\n\n');
    navigator.clipboard.writeText(fullSummary);
    setCopiedTeam(999);
    setTimeout(() => setCopiedTeam(null), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <ToolSwitcher />
      {showConfetti && <ConfettiEffect />}

      {/* 3D Countdown Modal */}
      <Countdown3DOverlay
        active={showCountdown}
        seconds={3}
        title="Barajando y Formando Equipos 3D"
        onComplete={executeGeneration}
      />

      {/* Header con controles */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-center sm:text-left space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full gold-gradient-badge text-xs font-mono font-bold uppercase tracking-wider">
            <Users className="w-3.5 h-3.5" />
            <span>Reparto Equilibrado CSPRNG</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black font-display text-white tracking-tight">
            Generador de Equipos 3D
          </h1>
          <p className="text-sm sm:text-base text-zinc-400 max-w-xl">
            Divide listas de personas en grupos equilibrados y competitivos con animación de tarjetas y verificación.
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
          {teams.length > 0 && (
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

      {/* Main Form */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Participants Textarea */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="equipos-textarea" className="text-xs font-mono text-zinc-400">
                Lista de Nombres ({participantsList.length} detectados):
              </label>
              <button
                type="button"
                onClick={() => setInputText('')}
                className="text-xs text-zinc-500 hover:text-red-400 transition-colors font-mono"
              >
                Limpiar
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
              className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 text-white font-mono text-sm focus:outline-none focus:border-purple-500 resize-none transition-colors"
            />
          </div>

          {/* Configuration Controls */}
          <div className="space-y-4 flex flex-col justify-between">
            <div className="space-y-4">
              {/* Number of Teams */}
              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-2">
                  Cantidad de Equipos a Formar:
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {[2, 3, 4, 5, 6].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setTeamCount(num)}
                      className={`py-2.5 rounded-xl font-bold font-mono text-sm transition-all ${
                        teamCount === num
                          ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                          : 'bg-white/5 text-zinc-400 hover:bg-white/10'
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                </div>
              </div>

              {/* Naming Style */}
              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-2">
                  Estilo de Nombres para los Equipos:
                </label>
                <select
                  value={namingStyle}
                  onChange={(e) => setNamingStyle(parseInt(e.target.value))}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white font-medium text-sm focus:outline-none focus:border-purple-500"
                >
                  <option value={0} className="bg-zinc-900">🛡️ Épico / Colores (Titanes, Fénix...)</option>
                  <option value={1} className="bg-zinc-900">⚡ Elementos (Fuego, Relámpago...)</option>
                  <option value={2} className="bg-zinc-900">🔤 Alfabeto Griego (Alfa, Beta...)</option>
                </select>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-300">
                {error}
              </div>
            )}

            {/* Action Button */}
            <button
              type="button"
              disabled={isGenerating}
              onClick={handleStartDraw}
              className={`w-full py-4 text-base sm:text-lg btn-pro-primary rounded-2xl flex items-center justify-center gap-2 ${
                isGenerating ? '!bg-zinc-800 !text-zinc-500 !cursor-not-allowed !shadow-none !transform-none opacity-60' : ''
              }`}
            >
              <Shuffle className={`w-5 h-5 ${isGenerating ? 'animate-spin' : ''}`} />
              <span>{isGenerating ? 'Formando equipos...' : '🎲 ¡Dividir en Equipos con Conteo!'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Teams Results Display */}
      {teams.length > 0 && (
        <div className="space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <h2 className="text-xl font-bold font-display text-white flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              <span>Equipos Conformados ({teams.length})</span>
            </h2>

            <button
              type="button"
              onClick={handleCopyAll}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-zinc-300 transition-colors flex items-center gap-2"
            >
              {copiedTeam === 999 ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copiedTeam === 999 ? '¡Todos Copiados!' : 'Copiar Todos los Equipos'}</span>
            </button>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teams.map((t, idx) => (
              <div
                key={idx}
                className="glass-card rounded-2xl p-5 border border-white/10 space-y-4 relative overflow-hidden group hover:border-purple-500/40 transition-all hover:scale-[1.02]"
              >
                <div className="flex items-center justify-between border-b border-white/5 pb-3">
                  <span className="font-bold text-base text-white font-display flex items-center gap-2">
                    {t.name}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopyTeam(idx, `${t.name}:\n` + t.members.join('\n'))}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
                    title="Copiar este equipo"
                  >
                    {copiedTeam === idx ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* Members list */}
                <div className="space-y-2">
                  {t.members.map((member, mIdx) => (
                    <div
                      key={mIdx}
                      className="flex items-center gap-2.5 text-xs text-zinc-300 bg-white/[0.02] p-2 rounded-lg"
                    >
                      <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-300 font-mono font-bold flex items-center justify-center text-[10px]">
                        {mIdx + 1}
                      </span>
                      <span className="font-medium truncate">{member}</span>
                    </div>
                  ))}
                </div>

                <div className="text-[10px] font-mono text-zinc-500 text-right pt-1">
                  {t.members.length} integrantes
                </div>
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
