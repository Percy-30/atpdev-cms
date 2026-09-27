"use client";

import React, { useState } from 'react';
import { Users, Sparkles, Shuffle, Copy, Check, UserPlus, ShieldAlert, Trophy, ShieldCheck } from 'lucide-react';
import { divideIntoTeams, generateSha256Hash } from '@/lib/randomEngine';
import ConfettiEffect from '@/components/ConfettiEffect';
import { ToolSwitcher } from '@/components/ToolSwitcher';

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
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [copiedTeam, setCopiedTeam] = useState<number | null>(null);
  const [auditHash, setAuditHash] = useState<string>('');
  const [error, setError] = useState<string>('');

  const participantsList = inputText
    .split('\n')
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  const handleGenerate = async () => {
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

    setIsGenerating(true);
    setShowConfetti(false);

    setTimeout(async () => {
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
      } catch (err: any) {
        setError(err.message || 'Error al conformar los equipos.');
      } finally {
        setIsGenerating(false);
      }
    }, 500);
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

      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full gold-gradient-badge text-xs font-mono font-bold uppercase tracking-wider">
          <Users className="w-3.5 h-3.5" />
          <span>Equipos Equilibrados</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black font-display text-white tracking-tight">
          Generador de Equipos Aleatorios
        </h1>
        <p className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto">
          Arma grupos de trabajo, torneos deportivos o partidas de juego balanceadas al instante sin sesgos.
        </p>
      </div>

      {/* Configuration Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Input Textarea */}
        <div className="lg:col-span-7 glass-card rounded-3xl p-6 border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-mono uppercase text-zinc-400 font-bold flex items-center gap-2">
              <UserPlus className="w-3.5 h-3.5 text-purple-400" />
              <span>Lista de Participantes ({participantsList.length})</span>
            </label>
            <button
              onClick={() =>
                setInputText(
                  "Alex\nBrenda\nCarlos\nDiana\nEsteban\nFatima\nGonzalo\nHilda\nIván\nJulia\nKevin\nLorena"
                )
              }
              className="text-xs text-purple-400 hover:text-purple-300 font-mono transition-colors"
            >
              Cargar ejemplo
            </button>
          </div>

          <textarea
            rows={10}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Escribe o pega los nombres (uno por línea)..."
            className="w-full px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white font-mono text-sm placeholder:text-zinc-600 focus:outline-none focus:border-purple-500 transition-colors resize-none leading-relaxed"
          />

          <div className="text-xs text-zinc-500 font-mono flex items-center justify-between">
            <span>Un nombre por línea</span>
            <span>Total: {participantsList.length} personas</span>
          </div>
        </div>

        {/* Right: Rules & Action */}
        <div className="lg:col-span-5 glass-card rounded-3xl p-6 border border-white/10 space-y-6 flex flex-col justify-between">
          <div className="space-y-5">
            <h3 className="text-sm font-bold font-display text-white border-b border-white/5 pb-3">
              Configuración de Equipos
            </h3>

            {/* Teams Count */}
            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-2">
                Cantidad de Equipos ({teamCount})
              </label>
              <div className="flex items-center gap-2">
                {[2, 3, 4, 5, 6].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setTeamCount(num)}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-mono font-bold transition-all ${
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
                Nombres de los Equipos
              </label>
              <select
                value={namingStyle}
                onChange={(e) => setNamingStyle(parseInt(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs text-white focus:outline-none focus:border-purple-500"
              >
                <option value={0} className="bg-zinc-900">Colores & Mascotas (Titanes, Dragones...)</option>
                <option value={1} className="bg-zinc-900">Elementos (Relámpago, Tormenta, Fuego...)</option>
                <option value={2} className="bg-zinc-900">Letras Griegas (Alfa, Beta, Gamma...)</option>
              </select>
            </div>

            {/* Estimated sizes */}
            <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 text-xs text-zinc-400 font-mono space-y-1">
              <div className="flex justify-between">
                <span>Promedio por equipo:</span>
                <span className="text-white font-bold">
                  {participantsList.length > 0
                    ? `~${Math.round(participantsList.length / teamCount)} miembros`
                    : '0'}
                </span>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-300">
                {error}
              </div>
            )}
          </div>

          <button
            type="button"
            disabled={isGenerating}
            onClick={handleGenerate}
            className={`w-full py-4 text-base sm:text-lg btn-pro-primary rounded-2xl ${
              isGenerating ? '!bg-zinc-800 !text-zinc-500 !cursor-not-allowed !shadow-none !transform-none opacity-60' : ''
            }`}
          >
            <Shuffle className={`w-5 h-5 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>{isGenerating ? 'Distribuyendo participantes...' : '✨ ¡Armar Equipos Ahora!'}</span>
          </button>
        </div>
      </div>

      {/* Results Display */}
      {teams.length > 0 && (
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-400" />
              <h2 className="text-lg font-bold text-white font-display">
                Equipos Formados ({teams.length})
              </h2>
            </div>
            <button
              onClick={handleCopyAll}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-mono text-zinc-300 transition-colors flex items-center gap-1.5"
            >
              {copiedTeam === 999 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedTeam === 999 ? '¡Todos Copiados!' : 'Copiar Todos'}</span>
            </button>
          </div>

          {/* Teams Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teams.map((t, idx) => {
              const teamText = `${t.name}:\n` + t.members.map((m, i) => `${i + 1}. ${m}`).join('\n');
              return (
                <div
                  key={idx}
                  className="rounded-2xl bg-white/[0.03] border border-white/10 p-5 space-y-4 hover:border-purple-500/40 transition-colors flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-base font-bold font-display text-white">{t.name}</span>
                      <span className="px-2 py-0.5 rounded-full bg-white/5 text-[11px] font-mono text-purple-300 font-bold">
                        {t.members.length}
                      </span>
                    </div>

                    <ul className="space-y-1.5">
                      {t.members.map((m, mIdx) => (
                        <li
                          key={mIdx}
                          className="px-3 py-1.5 rounded-lg bg-white/5 text-xs text-zinc-300 font-mono flex items-center justify-between"
                        >
                          <span className="truncate">{m}</span>
                          {mIdx === 0 && (
                            <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider ml-2">
                              Capitán
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    onClick={() => handleCopyTeam(idx, teamText)}
                    className="w-full py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-[11px] font-mono text-zinc-400 hover:text-white transition-colors flex items-center justify-center gap-1.5"
                  >
                    {copiedTeam === idx ? (
                      <Check className="w-3 h-3 text-emerald-400" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                    <span>{copiedTeam === idx ? 'Copiado' : 'Copiar Equipo'}</span>
                  </button>
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
    </div>
  );
}
