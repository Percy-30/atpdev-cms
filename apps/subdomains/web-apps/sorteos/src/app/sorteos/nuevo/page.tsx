"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Sparkles, 
  ShieldCheck, 
  Check, 
  AlertCircle, 
  ArrowRight, 
  ArrowLeft, 
  Users, 
  Settings2, 
  Trophy,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { InstagramIcon, FacebookIcon, YoutubeIcon } from '@/components/SocialIcons';
import { SocialNetwork, GiveawayRules, Participant, Giveaway } from '@/lib/types';
import { filterParticipants, executeVerifiableDraw } from '@/lib/randomEngine';
import ConfettiEffect from '@/components/ConfettiEffect';

// Participantes simulados realistas para pruebas inmediatas
const MOCK_COMMENTS_SAMPLE: { [key in SocialNetwork]: Participant[] } = {
  instagram: [
    { id: 'ig-1', username: 'valeria.gomez', commentText: '¡Me encanta este giveaway! Participando con @carlos_m y @sofia.r #sorteopro', isEligible: true },
    { id: 'ig-2', username: 'diego_martinez99', commentText: 'Quiero ganar para regalarle a @mariana.paz #sorteopro', isEligible: true },
    { id: 'ig-3', username: 'camila_rodriguez', commentText: 'Participo!! @lucia.v y @andres_b #sorteopro', isEligible: true },
    { id: 'ig-4', username: 'valeria.gomez', commentText: 'Comento de nuevo para tener doble chance @patricia_l', isEligible: true },
    { id: 'ig-5', username: 'lucas_fernandez', commentText: 'Genial concurso @marcos.tech #sorteopro', isEligible: true },
    { id: 'ig-6', username: 'bot_spammer_3000', commentText: 'Follow me for free crypto!', isEligible: true },
    { id: 'ig-7', username: 'elena_castillo', commentText: 'Ojalá me toque a mí @pedro_ramirez @carla_m #sorteopro', isEligible: true },
    { id: 'ig-8', username: 'juan_perez_pro', commentText: 'Mucha suerte a todos @mateo.dev #sorteopro', isEligible: true },
    { id: 'ig-9', username: 'daniela_sanchez', commentText: '¡Listo! Cumplí todos los pasos con @flor_k #sorteopro', isEligible: true },
    { id: 'ig-10', username: 'roberto_navarro', commentText: 'Increíble premio @laura_v #sorteopro', isEligible: true },
    { id: 'ig-11', username: 'sol_alvarez', commentText: 'Participando con toda la fe @franco_d #sorteopro', isEligible: true },
    { id: 'ig-12', username: 'tomas_herrera', commentText: 'Ojalá gane @monica_s #sorteopro', isEligible: true },
  ],
  facebook: [
    { id: 'fb-1', username: 'Maria Elena Torres', commentText: 'Compartido y participando! Suerte a todos #sorteopro', isEligible: true },
    { id: 'fb-2', username: 'Jorge Luis Morales', commentText: 'Excelente oportunidad, participo con @Claudia Morán #sorteopro', isEligible: true },
    { id: 'fb-3', username: 'Ana Belen Quispe', commentText: 'Ojalá gane este maravilloso premio!', isEligible: true },
    { id: 'fb-4', username: 'Gonzalo Chavez', commentText: 'Listo los pasos! @Javier Silva #sorteopro', isEligible: true },
    { id: 'fb-5', username: 'Patricia Mendez', commentText: 'Participando por mi cumpleaños #sorteopro', isEligible: true },
  ],
  youtube: [
    { id: 'yt-1', username: 'CodeMasterX', commentText: 'Excelente video bro, participo en el sorteo! #sorteopro', isEligible: true },
    { id: 'yt-2', username: 'GamerGirl99', commentText: 'Dejé mi like y suscripción activa! Gran canal', isEligible: true },
    { id: 'yt-3', username: 'TechExplorer', commentText: 'Participando desde México con ganas de ganar el gadget! #sorteopro', isEligible: true },
    { id: 'yt-4', username: 'LuciaCraft', commentText: 'Comentario de la suerte #sorteopro', isEligible: true },
  ],
  tiktok: [],
  x: [],
  standalone: []
};

export default function NuevoSorteoPage() {
  const router = useRouter();

  // Wizard Steps: 1: Red y URL, 2: Comentarios importados, 3: Reglas y Filtros, 4: Sorteo & Resultados
  const [step, setStep] = useState<number>(1);
  const [network, setNetwork] = useState<SocialNetwork>('instagram');
  const [postUrl, setPostUrl] = useState<string>('https://www.instagram.com/p/DBa_9XYZ123/');
  const [giveawayTitle, setGiveawayTitle] = useState<string>('Sorteo Oficial de Aniversario');
  const [isLoadingComments, setIsLoadingComments] = useState<boolean>(false);
  const [rawComments, setRawComments] = useState<Participant[]>(MOCK_COMMENTS_SAMPLE.instagram);

  // Reglas
  const [rules, setRules] = useState<GiveawayRules>({
    excludeDuplicates: true,
    minMentions: 1,
    requiredHashtag: '#sorteopro',
    blockedUsers: ['bot_spammer_3000'],
    winnersCount: 1,
    substitutesCount: 2
  });

  const [filteredEligible, setFilteredEligible] = useState<Participant[]>([]);
  const [filteredExcluded, setFilteredExcluded] = useState<Participant[]>([]);

  // Sorteo en ejecución
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [finishedGiveaway, setFinishedGiveaway] = useState<Giveaway | null>(null);

  // Paso 1 -> Paso 2: Importar comentarios
  const handleImportComments = () => {
    setIsLoadingComments(true);
    setTimeout(() => {
      // Cargar comentarios basados en la red social
      const sample = MOCK_COMMENTS_SAMPLE[network] || MOCK_COMMENTS_SAMPLE.instagram;
      setRawComments(sample);
      setIsLoadingComments(false);
      setStep(2);
    }, 800);
  };

  // Paso 2 -> Paso 3: Aplicar reglas de filtrado
  const handleApplyRules = () => {
    const { eligible, excluded } = filterParticipants(rawComments, rules);
    setFilteredEligible(eligible);
    setFilteredExcluded(excluded);
    setStep(3);
  };

  // Paso 3 -> Paso 4: Ejecutar Sorteo Verificable con CSPRNG
  const handleExecuteDraw = async () => {
    setIsDrawing(true);
    setShowConfetti(false);

    setTimeout(async () => {
      try {
        const drawResult = await executeVerifiableDraw(
          filteredEligible,
          rules.winnersCount,
          rules.substitutesCount
        );

        const giveawayId = `sorteo-${Date.now().toString(36)}`;
        const certificateId = `cert-${drawResult.verificationHash.slice(0, 10).toUpperCase()}`;

        const createdGiveaway: Giveaway = {
          id: giveawayId,
          title: giveawayTitle,
          network,
          postUrl,
          authorUsername: 'empresa_oficial',
          totalCommentsCount: rawComments.length,
          rules,
          winners: drawResult.winners,
          substitutes: drawResult.substitutes,
          status: 'finished',
          createdAt: drawResult.timestamp,
          certificateId,
          verificationHash: drawResult.verificationHash
        };

        // Guardar en localStorage para que /sorteo/[id] y /certificados/[id] puedan accederlo
        if (typeof window !== 'undefined') {
          const stored = JSON.parse(localStorage.getItem('sorteos_pro_db') || '{}');
          stored[giveawayId] = createdGiveaway;
          stored[certificateId] = createdGiveaway;
          localStorage.setItem('sorteos_pro_db', JSON.stringify(stored));
        }

        setFinishedGiveaway(createdGiveaway);
        setShowConfetti(true);
        setStep(4);
      } catch (err: any) {
        alert(err.message || 'Error al ejecutar el sorteo');
      } finally {
        setIsDrawing(false);
      }
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {showConfetti && <ConfettiEffect />}

      {/* Header & Steps Breadcrumb */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full gold-gradient-badge text-xs font-mono font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Asistente de Sorteo Multi-Red</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black font-display text-white tracking-tight">
          Crear Nuevo Sorteo Social
        </h1>
        <p className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto">
          Extrae comentarios de Instagram, Facebook o YouTube, aplica filtros de exclusión y sortea ganadores transparentes con certificación SHA-256.
        </p>

        {/* Step Indicator */}
        <div className="flex items-center justify-center gap-3 pt-4">
          {[
            { num: 1, label: 'Red & Enlace' },
            { num: 2, label: 'Comentarios' },
            { num: 3, label: 'Filtros y Reglas' },
            { num: 4, label: 'Ganadores' }
          ].map((st, idx) => (
            <React.Fragment key={st.num}>
              <div className="flex items-center gap-2">
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-mono font-bold transition-all ${
                    step === st.num
                      ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/40 ring-2 ring-purple-400'
                      : step > st.num
                      ? 'bg-emerald-500 text-black'
                      : 'bg-white/5 text-zinc-500 border border-white/10'
                  }`}
                >
                  {step > st.num ? <Check className="w-4 h-4" /> : st.num}
                </div>
                <span
                  className={`text-xs font-mono hidden sm:inline ${
                    step === st.num ? 'text-white font-bold' : 'text-zinc-500'
                  }`}
                >
                  {st.label}
                </span>
              </div>
              {idx < 3 && <div className="w-6 h-px bg-white/10" />}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* STEP 1: Select Network & Post URL */}
      {step === 1 && (
        <div className="glass-card rounded-3xl p-6 sm:p-10 border border-white/10 space-y-8">
          <div className="space-y-4">
            <h2 className="text-lg font-bold font-display text-white">
              1. Selecciona la Red Social del Sorteo
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <button
                type="button"
                onClick={() => {
                  setNetwork('instagram');
                  setPostUrl('https://www.instagram.com/p/DBa_9XYZ123/');
                }}
                className={`p-5 rounded-2xl border text-left transition-all flex flex-col justify-between space-y-3 ${
                  network === 'instagram'
                    ? 'border-pink-500 bg-pink-500/10 shadow-lg shadow-pink-500/20 ring-1 ring-pink-500'
                    : 'border-white/10 bg-white/5 hover:border-white/20'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-yellow-500 via-pink-600 to-purple-600 flex items-center justify-center text-white">
                  <InstagramIcon className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-white text-sm">Instagram</div>
                  <div className="text-xs text-zinc-400">Post, Reels, Carousels</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setNetwork('facebook');
                  setPostUrl('https://www.facebook.com/watch/?v=987654321');
                }}
                className={`p-5 rounded-2xl border text-left transition-all flex flex-col justify-between space-y-3 ${
                  network === 'facebook'
                    ? 'border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/20 ring-1 ring-blue-500'
                    : 'border-white/10 bg-white/5 hover:border-white/20'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white">
                  <FacebookIcon className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-white text-sm">Facebook</div>
                  <div className="text-xs text-zinc-400">Páginas y publicaciones</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setNetwork('youtube');
                  setPostUrl('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
                }}
                className={`p-5 rounded-2xl border text-left transition-all flex flex-col justify-between space-y-3 ${
                  network === 'youtube'
                    ? 'border-red-500 bg-red-500/10 shadow-lg shadow-red-500/20 ring-1 ring-red-500'
                    : 'border-white/10 bg-white/5 hover:border-white/20'
                }`}
              >
                <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center text-white">
                  <YoutubeIcon className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-bold text-white text-sm">YouTube</div>
                  <div className="text-xs text-zinc-400">Videos y Shorts</div>
                </div>
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-2">
                Título o Nombre de la Campaña:
              </label>
              <input
                type="text"
                value={giveawayTitle}
                onChange={(e) => setGiveawayTitle(e.target.value)}
                placeholder="Ej: Gran Sorteo Fin de Año 2026"
                className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white font-medium focus:outline-none focus:border-purple-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-2">
                URL de la Publicación o Video:
              </label>
              <input
                type="url"
                value={postUrl}
                onChange={(e) => setPostUrl(e.target.value)}
                placeholder="https://www.instagram.com/p/..."
                className="w-full px-4 py-3.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-sm focus:outline-none focus:border-purple-500 transition-colors"
              />
              <p className="text-xs text-zinc-500 mt-2 font-mono">
                💡 Asegúrate de que la publicación sea pública y esté activa.
              </p>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="button"
              disabled={isLoadingComments || !postUrl}
              onClick={handleImportComments}
              className={`btn-pro-primary text-sm sm:text-base py-3.5 px-8 rounded-2xl ${
                isLoadingComments || !postUrl ? 'opacity-50 cursor-not-allowed !transform-none' : ''
              }`}
            >
              <RefreshCw className={`w-4 h-4 ${isLoadingComments ? 'animate-spin' : ''}`} />
              <span>{isLoadingComments ? 'Extrayendo comentarios...' : 'Continuar a Comentarios'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Preview Extracted Comments */}
      {step === 2 && (
        <div className="glass-card rounded-3xl p-6 sm:p-10 border border-white/10 space-y-8">
          <div className="flex items-center justify-between flex-wrap gap-4 border-b border-white/5 pb-4">
            <div>
              <h2 className="text-lg font-bold font-display text-white">
                2. Comentarios Extraídos ({rawComments.length})
              </h2>
              <p className="text-xs text-zinc-400 mt-1">
                Post analizado: <span className="text-purple-300 font-mono">{postUrl}</span>
              </p>
            </div>
            <div className="px-3.5 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-xs flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" />
              <span>Sincronización Exitosa</span>
            </div>
          </div>

          {/* Comments List Preview */}
          <div className="space-y-2.5 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
            {rawComments.map((c) => (
              <div
                key={c.id}
                className="p-3.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-start justify-between gap-3 text-xs"
              >
                <div className="space-y-1">
                  <div className="font-bold text-white flex items-center gap-1.5 font-mono">
                    <span className="text-purple-400">@{c.username}</span>
                  </div>
                  <p className="text-zinc-300">{c.commentText}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-white/5">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="btn-pro-secondary text-xs py-2.5 px-5 rounded-xl flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Atrás</span>
            </button>

            <button
              type="button"
              onClick={handleApplyRules}
              className="btn-pro-primary text-sm sm:text-base py-3.5 px-8 rounded-2xl flex items-center gap-2"
            >
              <span>Configurar Reglas y Filtros</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Configure Rules & Filtering Engine */}
      {step === 3 && (
        <div className="glass-card rounded-3xl p-6 sm:p-10 border border-white/10 space-y-8">
          <div className="border-b border-white/5 pb-4">
            <h2 className="text-lg font-bold font-display text-white">
              3. Reglas de Exclusión y Ganadores
            </h2>
            <p className="text-xs text-zinc-400 mt-1">
              Filtros según especificaciones RF-015 y RF-021 para asegurar transparencia estricta.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Reglas de Filtrado */}
            <div className="space-y-4">
              <h3 className="text-xs font-mono uppercase tracking-wider text-purple-400 font-bold">
                Filtros de Participación
              </h3>

              <label className="flex items-start gap-3 p-3.5 rounded-xl bg-white/[0.02] border border-white/5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rules.excludeDuplicates}
                  onChange={(e) => setRules({ ...rules, excludeDuplicates: e.target.checked })}
                  className="mt-0.5 w-4 h-4 rounded text-purple-600 bg-zinc-900 border-zinc-700 focus:ring-purple-500"
                />
                <div>
                  <div className="text-xs font-bold text-white">Excluir comentarios duplicados</div>
                  <div className="text-[11px] text-zinc-400">
                    Solo se cuenta un comentario por usuario (1 oportunidad por persona).
                  </div>
                </div>
              </label>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1.5">
                  Menciones mínimas por comentario (@amigo):
                </label>
                <input
                  type="number"
                  min={0}
                  max={10}
                  value={rules.minMentions}
                  onChange={(e) => setRules({ ...rules, minMentions: parseInt(e.target.value) || 0 })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1.5">
                  Hashtag obligatorio en el comentario:
                </label>
                <input
                  type="text"
                  value={rules.requiredHashtag}
                  onChange={(e) => setRules({ ...rules, requiredHashtag: e.target.value })}
                  placeholder="Ej: #sorteopro"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            {/* Ganadores & Suplentes */}
            <div className="space-y-4">
              <h3 className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold">
                Asignación de Premios
              </h3>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1.5">
                  Cantidad de Ganadores Principales:
                </label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={rules.winnersCount}
                  onChange={(e) => setRules({ ...rules, winnersCount: Math.max(1, parseInt(e.target.value) || 1) })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1.5">
                  Cantidad de Suplentes de Respaldo:
                </label>
                <input
                  type="number"
                  min={0}
                  max={10}
                  value={rules.substitutesCount}
                  onChange={(e) => setRules({ ...rules, substitutesCount: parseInt(e.target.value) || 0 })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-purple-500"
                />
              </div>

              {/* Status Preview */}
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-zinc-400">Total comentarios:</span>
                  <span className="text-white font-bold">{rawComments.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-emerald-400">Elegibles calculados:</span>
                  <span className="text-emerald-400 font-bold">{filteredEligible.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-red-400">Descartados por reglas:</span>
                  <span className="text-red-400 font-bold">{filteredExcluded.length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t border-white/5">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="btn-pro-secondary text-xs py-2.5 px-5 rounded-xl flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Atrás</span>
            </button>

            <button
              type="button"
              disabled={isDrawing || filteredEligible.length === 0}
              onClick={handleExecuteDraw}
              className={`btn-pro-gold text-base py-4 px-10 rounded-2xl flex items-center gap-2 ${
                isDrawing || filteredEligible.length === 0 ? 'opacity-60 cursor-not-allowed !transform-none' : ''
              }`}
            >
              <RefreshCw className={`w-5 h-5 ${isDrawing ? 'animate-spin' : ''}`} />
              <span>{isDrawing ? 'Sorteando con CSPRNG...' : '🎲 ¡Realizar Sorteo Oficial!'}</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: Draw Finished & Verifiable Certificate */}
      {step === 4 && finishedGiveaway && (
        <div className="glass-card rounded-3xl p-6 sm:p-10 border border-white/10 space-y-8 text-center">
          <div className="space-y-3">
            <div className="w-16 h-16 rounded-3xl gold-gradient-badge mx-auto flex items-center justify-center shadow-xl shadow-amber-500/20">
              <Trophy className="w-8 h-8 text-amber-950" />
            </div>
            <h2 className="text-2xl sm:text-4xl font-black font-display text-white">
              ¡Sorteo Realizado con Éxito!
            </h2>
            <p className="text-sm text-zinc-400 max-w-lg mx-auto">
              Se han seleccionado {finishedGiveaway.winners.length} ganador(es) y {finishedGiveaway.substitutes?.length || 0} suplente(s) con semilla criptográfica Web Crypto.
            </p>
          </div>

          {/* Winners Card */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto text-left">
            <div className="p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-3">
              <div className="text-xs font-mono uppercase tracking-wider text-amber-400 font-bold flex items-center gap-1.5">
                <Trophy className="w-4 h-4" />
                <span>Ganador(es) Oficial(es)</span>
              </div>
              <div className="space-y-2">
                {finishedGiveaway.winners.map((w) => (
                  <div key={w.id} className="p-3 rounded-xl bg-black/40 border border-amber-500/20">
                    <div className="text-sm font-bold text-amber-300 font-mono">@{w.participant.username}</div>
                    <div className="text-xs text-zinc-400 truncate mt-0.5">&ldquo;{w.participant.commentText}&rdquo;</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-3">
              <div className="text-xs font-mono uppercase tracking-wider text-zinc-400 font-bold flex items-center gap-1.5">
                <Users className="w-4 h-4" />
                <span>Suplentes de Reserva</span>
              </div>
              <div className="space-y-2">
                {finishedGiveaway.substitutes?.map((s) => (
                  <div key={s.id} className="p-3 rounded-xl bg-black/40 border border-white/5">
                    <div className="text-sm font-bold text-zinc-300 font-mono">Suplente #{s.position}: @{s.participant.username}</div>
                    <div className="text-xs text-zinc-500 truncate mt-0.5">&ldquo;{s.participant.commentText}&rdquo;</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Audit Verification */}
          <div className="p-4 rounded-2xl bg-black/40 border border-white/10 max-w-xl mx-auto text-xs font-mono text-zinc-400 space-y-1">
            <div className="flex items-center justify-center gap-1.5 text-emerald-400 font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>Certificado de Autenticidad Criptográfica</span>
            </div>
            <div className="break-all text-[11px] text-zinc-500">{finishedGiveaway.verificationHash}</div>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={() => router.push(`/sorteo/${finishedGiveaway.id}`)}
              className="btn-pro-primary py-4 px-8 text-sm flex items-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Ver Página Pública del Sorteo</span>
            </button>

            <button
              onClick={() => router.push(`/certificados/${finishedGiveaway.certificateId}`)}
              className="btn-pro-secondary py-4 px-8 text-sm flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Ver Certificado Oficial</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
