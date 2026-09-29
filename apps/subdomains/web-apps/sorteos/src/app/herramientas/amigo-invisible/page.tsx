"use client";

import React, { useState, useEffect } from 'react';
import { 
  Gift, Sparkles, Plus, Trash2, Eye, EyeOff, 
  Copy, Check, Share2, Shuffle, CheckCircle2, Calendar, 
  DollarSign, Volume2, VolumeX, Maximize2, Minimize2, Tv 
} from 'lucide-react';
import { ConfettiEffect } from '@/components/ConfettiEffect';
import { ToolSwitcher } from '@/components/ToolSwitcher';
import { Countdown3DOverlay } from '@/components/Countdown3DOverlay';
import { LiveStreamStage } from '@/components/LiveStreamStage';
import { shuffleArray, generateSha256Hash } from '@/lib/randomEngine';
import { 
  playCardFlip, playWinnerFanfare, isAudioMuted, toggleAudioMute 
} from '@/lib/soundEffects';

interface Match {
  giver: string;
  receiver: string;
  revealed: boolean;
}

export default function AmigoInvisiblePage() {
  const [participants, setParticipants] = useState<string[]>([
    'Carlos Gómez',
    'Lucía Fernández',
    'Andrés Mendoza',
    'Valeria Silva',
    'Mateo Torres'
  ]);
  const [newPerson, setNewPerson] = useState<string>('');
  const [budget, setBudget] = useState<string>('$20.00');
  const [deadline, setDeadline] = useState<string>('24 de Diciembre');
  const [matches, setMatches] = useState<Match[]>([]);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [showCountdown, setShowCountdown] = useState<boolean>(false);
  const [auditHash, setAuditHash] = useState<string>('');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [muted, setMuted] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [showLiveStream, setShowLiveStream] = useState<boolean>(false);

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

  const handleAddPerson = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = newPerson.trim();
    if (!clean) return;
    if (participants.some((p) => p.toLowerCase() === clean.toLowerCase())) {
      alert('Esta persona ya está en la lista');
      return;
    }
    setParticipants([...participants, clean]);
    setNewPerson('');
  };

  const handleRemovePerson = (idx: number) => {
    if (participants.length <= 3) {
      alert('Se requieren al menos 3 personas para el amigo invisible.');
      return;
    }
    setParticipants(participants.filter((_, i) => i !== idx));
  };

  const handleStartDraw = () => {
    if (participants.length < 3 || isDrawing) return;
    setShowCountdown(true);
  };

  const executeMatches = async () => {
    setShowCountdown(false);
    setIsDrawing(true);

    const givers = [...participants];
    let receivers: string[] = [];
    let valid = false;
    let attempts = 0;

    while (!valid && attempts < 100) {
      attempts++;
      receivers = shuffleArray(givers);
      valid = givers.every((giver, i) => giver !== receivers[i]);
    }

    if (!valid) {
      receivers = [...givers.slice(1), givers[0]];
    }

    const newMatches: Match[] = givers.map((giver, i) => ({
      giver,
      receiver: receivers[i],
      revealed: false
    }));

    const timestamp = new Date().toISOString();
    const hash = await generateSha256Hash(
      `amigo-invisible-${timestamp}-${newMatches.map((m) => `${m.giver}->${m.receiver}`).join('|')}`
    );

    setMatches(newMatches);
    setAuditHash(hash);
    setIsDrawing(false);
    playWinnerFanfare();
  };

  const toggleReveal = (idx: number) => {
    playCardFlip();
    setMatches((prev) =>
      prev.map((m, i) => (i === idx ? { ...m, revealed: !m.revealed } : m))
    );
  };

  const copySecretMessage = (m: Match, idx: number) => {
    const text = `🤫 ¡Hola ${m.giver}! En el Sorteo de Amigo Invisible te ha tocado regalarle a:\n\n🎁 ${m.receiver}\n\n💰 Presupuesto: ${budget || 'Libre'}\n📅 Fecha de entrega: ${deadline || 'Por acordar'}\n\n🔒 Sorteo privado y certificado por Sorteos Pro`;
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 2500);
  };

  const shareViaWhatsApp = (m: Match) => {
    const text = `🤫 ¡Hola ${m.giver}! En el Amigo Invisible te tocó regalarle a: 🎁 *${m.receiver}*.\n💰 Presupuesto: ${budget}\n📅 Fecha: ${deadline}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <ToolSwitcher />
      <ConfettiEffect active={matches.length > 0 && !isDrawing} />

      {/* 3D Countdown Modal */}
      <Countdown3DOverlay
        active={showCountdown}
        seconds={3}
        title="Generando Parejas Secretas 3D"
        onComplete={executeMatches}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-center sm:text-left space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full purple-gradient-badge text-xs font-mono font-bold uppercase tracking-wider">
            <Gift className="w-3.5 h-3.5 text-pink-400" />
            <span>Intercambio de Regalos Secreto</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-black font-display text-white tracking-tight">
            Sorteo de Amigo Invisible
          </h1>
          <p className="text-sm sm:text-base text-zinc-400 max-w-xl">
            Organiza el intercambio de regalos perfecto. Emparejamiento aleatorio seguro y privado con revelación oculta.
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
          {matches.length > 0 && (
            <button
              type="button"
              onClick={() => setShowLiveStream(true)}
              className="btn-pro-secondary py-2.5 px-4 rounded-xl text-xs flex items-center gap-1.5"
            >
              <Tv className="w-4 h-4 text-purple-400" />
              <span>Modo En Vivo</span>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form: Participants & Rules */}
        <div className="lg:col-span-6 space-y-6">
          <div className="glass-card rounded-3xl p-6 sm:p-8 space-y-5 border border-white/10">
            <h2 className="text-lg font-bold font-display text-white">Participantes ({participants.length})</h2>

            {/* Add person form */}
            <form onSubmit={handleAddPerson} className="flex gap-2">
              <label htmlFor="person-name-input" className="sr-only">
                Nombre de la persona
              </label>
              <input
                id="person-name-input"
                name="personName"
                type="text"
                value={newPerson}
                onChange={(e) => setNewPerson(e.target.value)}
                placeholder="Nombre de la persona..."
                aria-label="Nombre del participante para el amigo invisible"
                className="flex-1 rounded-xl bg-black/40 border border-white/10 px-3.5 py-2.5 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:border-violet-500"
              />
              <button
                type="submit"
                disabled={!newPerson.trim()}
                aria-label="Agregar participante a la lista"
                className="p-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white font-bold transition-colors"
              >
                <Plus className="w-5 h-5" aria-hidden="true" />
              </button>
            </form>

            {/* Participants pills */}
            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
              {participants.map((person, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/5 text-sm text-zinc-200"
                >
                  <span className="font-medium truncate pr-2">👤 {person}</span>
                  <button
                    type="button"
                    onClick={() => handleRemovePerson(idx)}
                    aria-label={`Eliminar a ${person}`}
                    className="text-zinc-500 hover:text-red-400 transition-colors p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Extra details: Budget and Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-white/10">
              <div className="space-y-1">
                <label htmlFor="budget-input" className="text-xs font-mono text-zinc-400 flex items-center gap-1">
                  <DollarSign className="w-3.5 h-3.5 text-amber-400" /> Presupuesto:
                </label>
                <input
                  id="budget-input"
                  type="text"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  placeholder="Ej: $20.00"
                  className="w-full rounded-xl bg-black/40 border border-white/10 px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-violet-500"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="deadline-input" className="text-xs font-mono text-zinc-400 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-pink-400" /> Fecha de entrega:
                </label>
                <input
                  id="deadline-input"
                  type="text"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  placeholder="Ej: 24 Diciembre"
                  className="w-full rounded-xl bg-black/40 border border-white/10 px-3 py-2 text-sm text-white font-mono focus:outline-none focus:border-violet-500"
                />
              </div>
            </div>

            {/* Draw Button */}
            <div className="pt-2">
              <button
                type="button"
                disabled={participants.length < 3 || isDrawing}
                onClick={handleStartDraw}
                className="btn-pro-primary w-full text-base py-3.5 rounded-2xl flex items-center justify-center gap-2"
              >
                <Shuffle className="w-5 h-5" />
                <span>{matches.length > 0 ? '¡Volver a Emparejar con Conteo!' : '¡Sortear Amigo Invisible!'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Form: Secret Match Cards */}
        <div className="lg:col-span-6 space-y-4">
          {matches.length > 0 ? (
            <div className="glass-card rounded-3xl p-6 sm:p-8 space-y-5 border border-amber-500/30">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold font-display text-white flex items-center gap-2">
                    <Gift className="w-5 h-5 text-amber-400" />
                    <span>Resultados Secretos</span>
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Pasa el dispositivo o comparte el mensaje en privado a cada uno.
                  </p>
                </div>
              </div>

              {/* Match list with 3D Flip style */}
              <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
                {matches.map((m, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3 transition-all hover:border-amber-400/30"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white text-base">
                        🎁 {m.giver}
                      </span>
                      <button
                        type="button"
                        onClick={() => toggleReveal(idx)}
                        className="text-xs font-mono text-purple-300 hover:text-white flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 transition-colors"
                      >
                        {m.revealed ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        <span>{m.revealed ? 'Ocultar' : 'Revelar Secreto'}</span>
                      </button>
                    </div>

                    {/* Secret Box with 3D reveal effect */}
                    <div
                      className={`p-3.5 rounded-xl border text-center transition-all duration-300 select-none ${
                        m.revealed
                          ? 'bg-gradient-to-r from-amber-500/20 via-pink-500/20 to-violet-500/20 border-amber-400/50 text-amber-300 font-bold shadow-lg shadow-amber-500/10 scale-[1.01]'
                          : 'bg-black/40 border-white/5 text-zinc-500 font-mono text-xs'
                      }`}
                    >
                      {m.revealed ? (
                        <div className="space-y-0.5 animate-in zoom-in-95 duration-200">
                          <span className="text-[10px] uppercase tracking-wider text-zinc-400 block font-normal">
                            Le regala en secreto a:
                          </span>
                          <span className="text-2xl font-black text-white title-neon-glow">{m.receiver}</span>
                        </div>
                      ) : (
                        <span>🔒 Toca &quot;Revelar Secreto&quot; para ver</span>
                      )}
                    </div>

                    {/* Actions: Copy or WhatsApp */}
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => copySecretMessage(m, idx)}
                        className="flex-1 py-2 px-3 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-medium text-zinc-300 flex items-center justify-center gap-1.5 transition-colors border border-white/5"
                      >
                        {copiedIndex === idx ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                            <span className="text-emerald-400 font-bold">¡Copiado!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copiar Mensaje Privado</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => shareViaWhatsApp(m)}
                        className="py-2 px-3 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 text-xs font-medium flex items-center justify-center gap-1 transition-colors border border-emerald-500/30"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                        <span>WhatsApp</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Audit Hash */}
              {auditHash && (
                <div className="text-[10px] font-mono text-zinc-500 flex items-center gap-1.5 pt-2 border-t border-white/10">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Audit Hash: {auditHash.slice(0, 24)}...</span>
                </div>
              )}
            </div>
          ) : (
            <div className="glass-card rounded-3xl p-12 text-center space-y-3 border border-white/5 text-zinc-500 flex flex-col items-center justify-center min-h-[380px]">
              <Gift className="w-12 h-12 opacity-30 text-pink-400" />
              <p className="text-base font-bold text-white">Listo para el intercambio</p>
              <p className="text-xs text-zinc-400 max-w-sm">
                Agrega al menos 3 personas a la lista y presiona &quot;Sortear Amigo Invisible&quot; para generar las parejas en secreto.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Live Stream Stage */}
      {matches.length > 0 && (
        <LiveStreamStage
          isOpen={showLiveStream}
          onClose={() => setShowLiveStream(false)}
          title="Amigo Invisible - Sorteo Secreto"
          winner={`¡Emparejamiento de ${matches.length} participantes realizado!`}
          auditHash={auditHash}
          platform="Amigo Secreto"
          onReroll={handleStartDraw}
        />
      )}
    </div>
  );
}
