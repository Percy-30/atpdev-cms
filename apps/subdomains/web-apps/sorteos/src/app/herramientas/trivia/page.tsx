"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  Trophy, 
  RotateCcw, 
  Timer, 
  Sparkles, 
  ArrowRight,
  Download,
  Share2,
  QrCode,
  Code2,
  Copy,
  Plus,
  Trash2,
  Check,
  Play,
  FileSpreadsheet,
  Globe2,
  Palette,
  ShieldCheck,
  BarChart3,
  Store,
  Smartphone,
  ExternalLink,
  ChevronDown,
  Gift,
  Mail,
  User,
  Percent,
  Layers,
  Settings2
} from 'lucide-react';
import { ToolSwitcher } from '@/components/ToolSwitcher';
import ConfettiEffect from '@/components/ConfettiEffect';
import { 
  playCorrectChime, 
  playWrongBuzz, 
  playCelebrationSound, 
  playDrumRoll 
} from '@/lib/soundEffects';

interface Question {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
}

interface LeadEntry {
  id: string;
  name: string;
  email: string;
  score: number;
  total: number;
  percentage: number;
  approved: boolean;
  date: string;
}

const PRESET_TOPICS: { name: string; icon: string; questions: Question[] }[] = [
  {
    name: 'Marketing & Sorteos Pro',
    icon: '🚀',
    questions: [
      {
        id: 'mkt-1',
        question: '¿Cuál es el estándar criptográfico utilizado por Sorteos Pro para certificar ganadores inmutables?',
        options: ['MD5', 'SHA-256', 'Base64', 'CRC32'],
        correctIndex: 1,
        explanation: 'SHA-256 genera un hash criptográfico de 64 caracteres único e inalterable.'
      },
      {
        id: 'mkt-2',
        question: '¿Qué red social permite recolección de comentarios directa mediante la API oficial de Google?',
        options: ['YouTube', 'Twitch', 'Snapchat', 'Pinterest'],
        correctIndex: 0,
        explanation: 'YouTube utiliza la API oficial de Google Data v3 para indexar comentarios en vivo.'
      },
      {
        id: 'mkt-3',
        question: '¿Cuál es la mejor práctica recomendada al organizar un sorteo en Instagram o TikTok?',
        options: ['Elegir a dedo sin sorteo', 'Publicar las Bases Legales y Certificado verificable', 'Ocultar a los ganadores', 'Borrar comentarios manuales'],
        correctIndex: 1,
        explanation: 'La transparencia total genera confianza y fidelidad duradera con tu comunidad.'
      },
      {
        id: 'mkt-4',
        question: '¿Qué ventaja ofrece usar una Trivia interactiva antes de dar un cupón de descuento?',
        options: ['Mayor aburrimiento', 'Genera engagement activo, cualifica leads y aumenta la tasa de conversión', 'Pierde visitas', 'No sirve para nada'],
        correctIndex: 1,
        explanation: 'El juego interactivo gamifica la experiencia del cliente y dispara las ventas hasta un 300%.'
      }
    ]
  },
  {
    name: 'Cultura General & Países',
    icon: '🌍',
    questions: [
      {
        id: 'cult-1',
        question: '¿Cuál es la capital oficial de Australia?',
        options: ['Sídney', 'Melbourne', 'Canberra', 'Brisbane'],
        correctIndex: 2,
        explanation: 'Canberra fue elegida como capital en 1908 como compromiso entre Sídney y Melbourne.'
      },
      {
        id: 'cult-2',
        question: '¿Cuál es el río más largo del planeta Tierra?',
        options: ['Río Nilo', 'Río Amazonas', 'Río Yangtsé', 'Río Misisipi'],
        correctIndex: 1,
        explanation: 'El río Amazonas es el más caudaloso y más largo del mundo con más de 6,992 km.'
      },
      {
        id: 'cult-3',
        question: '¿En qué continente se encuentra el desierto del Sahara?',
        options: ['Asia', 'África', 'Oceanía', 'América'],
        correctIndex: 1,
        explanation: 'El Sahara abarca la mayor parte del norte de África con más de 9 millones de km².'
      },
      {
        id: 'cult-4',
        question: '¿Cuál es el océano más grande y profundo de la Tierra?',
        options: ['Atlántico', 'Índico', 'Ártico', 'Pacífico'],
        correctIndex: 3,
        explanation: 'El océano Pacífico cubre más de un tercio de la superficie terrestre.'
      }
    ]
  },
  {
    name: 'Cine & Películas',
    icon: '🍿',
    questions: [
      {
        id: 'cine-1',
        question: '¿Quién dirigió la clásica trilogía de películas de El Señor de los Anillos?',
        options: ['Steven Spielberg', 'Christopher Nolan', 'Peter Jackson', 'George Lucas'],
        correctIndex: 2,
        explanation: 'Peter Jackson dirigió las 3 películas rodadas en simultáneo en Nueva Zelanda.'
      },
      {
        id: 'cine-2',
        question: '¿En qué año se estrenó la primera película de Titanic protagonizada por DiCaprio?',
        options: ['1995', '1997', '1999', '2001'],
        correctIndex: 1,
        explanation: 'Titanic se estrenó en diciembre de 1997 y ganó 11 premios Óscar.'
      },
      {
        id: 'cine-3',
        question: '¿Cuál es la película más taquillera de todos los tiempos en la historia del cine?',
        options: ['Avatar', 'Avengers: Endgame', 'Titanic', 'Star Wars: El despertar de la fuerza'],
        correctIndex: 0,
        explanation: 'Avatar (2009) dirigida por James Cameron supera los $2,923 millones en taquilla.'
      },
      {
        id: 'cine-4',
        question: '¿Qué actor interpretó al famoso personaje de Forrest Gump?',
        options: ['Brad Pitt', 'Tom Hanks', 'Robin Williams', 'Johnny Depp'],
        correctIndex: 1,
        explanation: 'Tom Hanks ganó el premio Óscar a Mejor Actor en 1994 por su papel de Forrest Gump.'
      }
    ]
  }
];

export default function TriviaPage() {
  // Tabs: 'play' | 'builder' | 'leads' | 'embed'
  const [activeTab, setActiveTab] = useState<'play' | 'builder' | 'leads' | 'embed'>('play');

  // Configuración de la Trivia activa
  const [triviaTitle, setTriviaTitle] = useState('Trivia Oficial de Conocimiento & Premios');
  const [triviaDesc, setTriviaDesc] = useState('Pon a prueba tus conocimientos y obtén tu cupón de descuento o entra al sorteo del premio mayor.');
  const [quizType, setQuizType] = useState<'multiple' | 'boolean' | 'survey'>('multiple');
  const [timerSeconds, setTimerSeconds] = useState<number>(15);
  const [approvalThreshold, setApprovalThreshold] = useState<number>(75);
  const [rewardCode, setRewardCode] = useState('TRIVIA25OFF');

  // Lista de preguntas activas
  const [questions, setQuestions] = useState<Question[]>(PRESET_TOPICS[0].questions);

  // Estado del juego interactivo
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [isFinished, setIsFinished] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(15);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);

  // Formulario de Lead antes o después
  const [leadName, setLeadName] = useState('');
  const [leadEmail, setLeadEmail] = useState('');
  const [leadRegistered, setLeadRegistered] = useState(false);

  // Base de datos de Leads
  const [leads, setLeads] = useState<LeadEntry[]>([
    {
      id: 'lead-1',
      name: 'Camila Morales',
      email: 'camila.m@gmail.com',
      score: 4,
      total: 4,
      percentage: 100,
      approved: true,
      date: '11/10/2026, 15:42'
    },
    {
      id: 'lead-2',
      name: 'David Rivas',
      email: 'david.rivas@outlook.com',
      score: 3,
      total: 4,
      percentage: 75,
      approved: true,
      date: '11/10/2026, 16:10'
    },
    {
      id: 'lead-3',
      name: 'Sofía Herrera',
      email: 'sofia.herrera@yahoo.es',
      score: 2,
      total: 4,
      percentage: 50,
      approved: false,
      date: '11/10/2026, 16:24'
    }
  ]);

  // Editor: Nueva pregunta temporal
  const [newQTitle, setNewQTitle] = useState('');
  const [newQOpts, setNewQOpts] = useState(['', '', '', '']);
  const [newQCorrect, setNewQCorrect] = useState(0);

  // Acordeón FAQ
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  // Copia de embed o link
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedEmbed, setCopiedEmbed] = useState(false);

  // Timer del jugador
  useEffect(() => {
    if (activeTab !== 'play' || isFinished || isAnswered || timerSeconds === 0) return;
    if (timeLeft <= 0) {
      handleOptionSelect(-1); // Timeout
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isAnswered, isFinished, activeTab, timerSeconds]);

  const currentQ = questions[currentIdx] || questions[0];

  const handleOptionSelect = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);

    if (idx === currentQ.correctIndex) {
      setScore((prev) => prev + 1);
      playCorrectChime();
    } else {
      playWrongBuzz();
    }
  };

  const handleNextQuestion = () => {
    if (currentIdx + 1 < questions.length) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setTimeLeft(timerSeconds);
    } else {
      setIsFinished(true);
      const finalScore = selectedOption === currentQ.correctIndex ? score + 1 : score;
      const pct = Math.round((finalScore / questions.length) * 100);
      const isApproved = pct >= approvalThreshold;

      if (isApproved) {
        setShowConfetti(true);
        playCelebrationSound();
      }

      // Si había ingresado datos de lead, registrar automáticamente
      if (leadName.trim() || leadEmail.trim()) {
        const newLead: LeadEntry = {
          id: `lead-${Date.now()}`,
          name: leadName.trim() || 'Participante Anónimo',
          email: leadEmail.trim() || 'anonimo@sorteos.pro',
          score: finalScore,
          total: questions.length,
          percentage: pct,
          approved: isApproved,
          date: new Date().toLocaleString()
        };
        setLeads((prev) => [newLead, ...prev]);
        setLeadRegistered(true);
      }
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setScore(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setIsFinished(false);
    setTimeLeft(timerSeconds);
    setShowConfetti(false);
  };

  const loadPreset = (preset: typeof PRESET_TOPICS[0]) => {
    setQuestions(preset.questions);
    setTriviaTitle(`Trivia de ${preset.name}`);
    handleRestart();
  };

  const handleAddQuestion = () => {
    if (!newQTitle.trim()) return;
    const validOpts = newQOpts.map((o, idx) => o.trim() || `Opción ${idx + 1}`);
    const q: Question = {
      id: `custom-${Date.now()}`,
      question: newQTitle.trim(),
      options: validOpts,
      correctIndex: newQCorrect
    };
    setQuestions((prev) => [...prev, q]);
    setNewQTitle('');
    setNewQOpts(['', '', '', '']);
    setNewQCorrect(0);
  };

  const handleDeleteQuestion = (id: string) => {
    if (questions.length <= 1) return;
    setQuestions((prev) => prev.filter((q) => q.id !== id));
    handleRestart();
  };

  const exportLeadsCSV = () => {
    const headers = 'ID,Nombre,Email,Aciertos,Total,Porcentaje,Aprobado,Fecha\n';
    const rows = leads.map(
      (l) => `${l.id},"${l.name}","${l.email}",${l.score},${l.total},${l.percentage}%,${l.approved ? 'SI' : 'NO'},"${l.date}"`
    ).join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `leads_trivia_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/herramientas/trivia` : 'https://sorteos.pro/herramientas/trivia';
  const embedCode = `<iframe src="${shareUrl}" width="100%" height="700" frameborder="0" style="border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.15);" allow="autoplay"></iframe>`;

  const copyToClipboard = (text: string, type: 'link' | 'embed') => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      if (type === 'link') {
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 2000);
      } else {
        setCopiedEmbed(true);
        setTimeout(() => setCopiedEmbed(false), 2000);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#070a12] text-slate-900 dark:text-zinc-100 selection:bg-pink-500 selection:text-white">
      <ConfettiEffect active={showConfetti} />

      {/* Pill Switcher */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <ToolSwitcher />
      </div>

      {/* ─── HERO HEADER ─────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-12 pb-16 border-b border-slate-200/80 dark:border-white/10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-100 dark:bg-pink-950/60 border border-pink-200 dark:border-pink-800/40 text-pink-700 dark:text-pink-300 text-xs font-mono font-bold tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5 text-pink-500" />
            <span>Herramienta Oficial de Marketing & Gamificación</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black font-display tracking-tight text-slate-900 dark:text-white">
            Generador de Trivias Online
          </h1>

          <p className="text-lg sm:text-xl text-slate-600 dark:text-zinc-300 max-w-3xl mx-auto font-normal leading-relaxed">
            Crea quiz y cuestionarios interactivos de preguntas y respuestas para capturar leads, entregar cupones de descuento y realizar sorteos automáticos entre los participantes aprobados.
          </p>

          {/* Key Value Checks */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 pt-2 text-xs sm:text-sm font-semibold text-slate-700 dark:text-zinc-300">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Popup con Exit-Intent</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Diseño 100% personalizable</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Captura y exportación en .CSV</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Sorteo con Certificado SHA-256</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <button
              onClick={() => setActiveTab('builder')}
              className="btn-pro-primary px-7 py-3.5 rounded-full text-sm font-bold shadow-lg shadow-pink-500/20 hover:scale-102 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Settings2 className="w-4 h-4" />
              <span>Crear mi Trivia Gratis</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('play');
                handleRestart();
              }}
              className="px-6 py-3.5 rounded-full text-sm font-bold border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 text-slate-800 dark:text-white transition-all flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <Play className="w-4 h-4 text-pink-600 dark:text-pink-400" />
              <span>Probar Demo en Vivo</span>
            </button>
          </div>

          <div className="text-xs text-slate-500 dark:text-zinc-400 font-mono">
            Sin tarjeta de crédito • 100% Gratuito • Usado por +11,000 marcas y creadores
          </div>
        </div>
      </section>

      {/* ─── WORKSPACE / MAIN INTERACTIVE APPLICATION ───────────────────── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-1.5 bg-slate-200/80 dark:bg-white/5 rounded-2xl border border-slate-300/60 dark:border-white/10 mb-8">
          <div className="flex flex-wrap gap-1">
            <button
              onClick={() => setActiveTab('play')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'play'
                  ? 'bg-white dark:bg-[#0f172a] text-pink-600 dark:text-purple-400 shadow-md'
                  : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Play className="w-4 h-4" />
              <span>Jugar Trivia Demo</span>
            </button>

            <button
              onClick={() => setActiveTab('builder')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'builder'
                  ? 'bg-white dark:bg-[#0f172a] text-pink-600 dark:text-purple-400 shadow-md'
                  : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Settings2 className="w-4 h-4" />
              <span>Creador & Editor</span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-md bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-black">
                {questions.length}Q
              </span>
            </button>

            <button
              onClick={() => setActiveTab('leads')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'leads'
                  ? 'bg-white dark:bg-[#0f172a] text-pink-600 dark:text-purple-400 shadow-md'
                  : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Base de Datos ({leads.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('embed')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                activeTab === 'embed'
                  ? 'bg-white dark:bg-[#0f172a] text-pink-600 dark:text-purple-400 shadow-md'
                  : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Code2 className="w-4 h-4" />
              <span>Incrustar / Embed</span>
            </button>
          </div>

          {/* Quick presets */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-400 dark:text-zinc-500 font-mono hidden md:inline">Temas rápidos:</span>
            {PRESET_TOPICS.map((p) => (
              <button
                key={p.name}
                onClick={() => loadPreset(p)}
                className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white/70 dark:bg-white/5 hover:bg-pink-50 dark:hover:bg-pink-950/40 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-zinc-300 transition-colors cursor-pointer"
                title={`Cargar ${p.name}`}
              >
                <span>{p.icon} {p.name.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ─── TAB 1: JUGAR DEMO INTERACTIVO ─────────────────────────────── */}
        {activeTab === 'play' && (
          <div className="bg-white dark:bg-[#0f172a] rounded-3xl border border-slate-200 dark:border-white/10 p-6 sm:p-10 shadow-xl space-y-8">
            
            {!isFinished ? (
              <div className="space-y-6">
                {/* Bar info */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-white/5">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                      {triviaTitle}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-zinc-400">
                      Pregunta {currentIdx + 1} de {questions.length} • Aciertos: {score}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    {timerSeconds > 0 && (
                      <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-mono font-bold text-xs ${
                        timeLeft <= 5 
                          ? 'bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 animate-pulse' 
                          : 'bg-slate-100 dark:bg-white/5 text-pink-600 dark:text-pink-400'
                      }`}>
                        <Timer className="w-3.5 h-3.5" />
                        <span>{timeLeft}s</span>
                      </div>
                    )}
                    <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-lg bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300">
                      Meta: {approvalThreshold}%
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-white/5 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-pink-500 to-purple-600 transition-all duration-300"
                    style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
                  />
                </div>

                {/* Question Text */}
                <div className="py-2">
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white leading-snug">
                    {currentQ.question}
                  </h2>
                </div>

                {/* Options Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {currentQ.options.map((opt, idx) => {
                    const isSelected = selectedOption === idx;
                    const isCorrect = idx === currentQ.correctIndex;

                    let btnClasses = 'border-slate-200 dark:border-white/10 bg-slate-50/70 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-800 dark:text-zinc-200';
                    if (isAnswered) {
                      if (isCorrect) {
                        btnClasses = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 font-bold ring-2 ring-emerald-500/30';
                      } else if (isSelected) {
                        btnClasses = 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-200 font-bold ring-2 ring-rose-500/30';
                      } else {
                        btnClasses = 'opacity-40 border-transparent';
                      }
                    }

                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleOptionSelect(idx)}
                        disabled={isAnswered}
                        className={`p-4 rounded-2xl border text-left transition-all flex items-center justify-between gap-3 cursor-pointer ${btnClasses}`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-7 h-7 rounded-lg bg-white/80 dark:bg-white/10 flex items-center justify-center text-xs font-mono font-bold text-slate-600 dark:text-zinc-400 shrink-0">
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <span className="text-sm font-medium">{opt}</span>
                        </div>
                        {isAnswered && isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />}
                        {isAnswered && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-rose-500 shrink-0" />}
                      </button>
                    );
                  })}
                </div>

                {/* Explanation on Answered */}
                {isAnswered && currentQ.explanation && (
                  <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/30 text-xs sm:text-sm text-amber-800 dark:text-amber-200">
                    <span className="font-bold">Dato clave: </span>
                    <span>{currentQ.explanation}</span>
                  </div>
                )}

                {/* Next button */}
                {isAnswered && (
                  <div className="flex justify-end pt-2">
                    <button
                      type="button"
                      onClick={handleNextQuestion}
                      className="btn-pro-primary px-6 py-3 rounded-full text-sm font-bold flex items-center gap-2 cursor-pointer shadow-md shadow-pink-500/20 hover:scale-102 transition-transform"
                    >
                      <span>{currentIdx + 1 < questions.length ? 'Siguiente Pregunta' : 'Ver Resultados Finales'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Pantalla de Fin de Juego */
              <div className="text-center space-y-6 py-6 max-w-xl mx-auto">
                {(() => {
                  const finalScore = score;
                  const pct = Math.round((finalScore / questions.length) * 100);
                  const approved = pct >= approvalThreshold;

                  return (
                    <>
                      <div className={`w-20 h-20 rounded-3xl mx-auto flex items-center justify-center shadow-xl ${
                        approved 
                          ? 'bg-gradient-to-tr from-amber-400 to-pink-600 text-white' 
                          : 'bg-slate-100 dark:bg-white/10 text-slate-500 dark:text-zinc-400'
                      }`}>
                        {approved ? <Trophy className="w-10 h-10 animate-bounce" /> : <RotateCcw className="w-10 h-10" />}
                      </div>

                      <div className="space-y-2">
                        <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                          {approved ? '¡Felicidades, Aprobaste la Trivia!' : '¡Buen intento! Estuviste muy cerca'}
                        </h2>
                        <p className="text-sm text-slate-600 dark:text-zinc-400">
                          Respondiste correctamente <strong className="text-slate-900 dark:text-white">{finalScore}</strong> de <strong className="text-slate-900 dark:text-white">{questions.length}</strong> preguntas ({pct}% de aciertos).
                        </p>
                      </div>

                      {/* Reward Code or Pass */}
                      {approved ? (
                        <div className="p-5 rounded-2xl bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-pink-500/10 border border-pink-500/30 space-y-3">
                          <span className="text-xs font-mono font-bold uppercase tracking-wider text-pink-600 dark:text-purple-400">
                            Tu Cupón de Recompensa
                          </span>
                          <div className="flex items-center justify-center gap-2">
                            <span className="text-xl sm:text-2xl font-black font-mono tracking-widest text-slate-900 dark:text-white px-4 py-1.5 rounded-xl bg-white dark:bg-[#070a12] border border-pink-500/40">
                              {rewardCode}
                            </span>
                            <button
                              onClick={() => copyToClipboard(rewardCode, 'link')}
                              className="p-2.5 rounded-xl bg-pink-600 text-white hover:bg-pink-700 transition-colors cursor-pointer"
                              title="Copiar cupón"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                            Válido para compras en la tienda oficial o para entrar al sorteo final.
                          </p>
                        </div>
                      ) : (
                        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-500 dark:text-zinc-400">
                          Necesitabas un mínimo de <strong>{approvalThreshold}%</strong> para desbloquear el cupón de descuento. ¡Puedes reintentar cuando quieras!
                        </div>
                      )}

                      {/* Formulario de registro de Lead si no se registró */}
                      {!leadRegistered && (
                        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-left space-y-3">
                          <h4 className="text-xs font-mono uppercase font-bold text-slate-400 dark:text-zinc-500">
                            Registra tus datos para participar en el sorteo:
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            <input
                              type="text"
                              placeholder="Tu Nombre completo"
                              value={leadName}
                              onChange={(e) => setLeadName(e.target.value)}
                              className="px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#070a12] text-slate-900 dark:text-white"
                            />
                            <input
                              type="email"
                              placeholder="Tu correo electrónico"
                              value={leadEmail}
                              onChange={(e) => setLeadEmail(e.target.value)}
                              className="px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#070a12] text-slate-900 dark:text-white"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              if (!leadEmail.trim()) return;
                              const newLead: LeadEntry = {
                                id: `lead-${Date.now()}`,
                                name: leadName.trim() || 'Participante',
                                email: leadEmail.trim(),
                                score: finalScore,
                                total: questions.length,
                                percentage: pct,
                                approved,
                                date: new Date().toLocaleString()
                              };
                              setLeads((prev) => [newLead, ...prev]);
                              setLeadRegistered(true);
                            }}
                            className="w-full py-2.5 rounded-xl btn-pro-primary text-xs font-bold cursor-pointer"
                          >
                            Guardar mi Participación
                          </button>
                        </div>
                      )}

                      {leadRegistered && (
                        <div className="flex items-center justify-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                          <CheckCircle2 className="w-4 h-4" />
                          <span>¡Participación registrada en la base de datos con éxito!</span>
                        </div>
                      )}

                      {/* Action buttons */}
                      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                        <button
                          type="button"
                          onClick={handleRestart}
                          className="px-5 py-2.5 rounded-full text-xs sm:text-sm font-semibold border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 dark:text-zinc-300 transition-colors flex items-center gap-2 cursor-pointer"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>Volver a Intentar</span>
                        </button>

                        <Link
                          href="/sorteos/nuevo?mode=multi"
                          className="btn-pro-primary px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold flex items-center gap-2 shadow-md shadow-pink-500/20"
                        >
                          <Trophy className="w-4 h-4" />
                          <span>Pasar Aprobados a Sorteo Final</span>
                        </Link>
                      </div>
                    </>
                  );
                })()}
              </div>
            )}
          </div>
        )}

        {/* ─── TAB 2: CREADOR & EDITOR DE TRIVIA ──────────────────────────── */}
        {activeTab === 'builder' && (
          <div className="space-y-8">
            <div className="bg-white dark:bg-[#0f172a] rounded-3xl border border-slate-200 dark:border-white/10 p-6 sm:p-8 shadow-xl space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-white/5">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Configuración General de la Trivia
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-zinc-400">
                    Ajusta las reglas, temporizador y código de cupón de tu quiz.
                  </p>
                </div>
              </div>

              {/* Form Config */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold text-slate-600 dark:text-zinc-300">
                    Título de la Promoción
                  </label>
                  <input
                    type="text"
                    value={triviaTitle}
                    onChange={(e) => setTriviaTitle(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-sm font-semibold text-slate-900 dark:text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold text-slate-600 dark:text-zinc-300">
                    Código de Descuento / Premio al Ganar
                  </label>
                  <input
                    type="text"
                    value={rewardCode}
                    onChange={(e) => setRewardCode(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-sm font-mono font-bold text-pink-600 dark:text-purple-400"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold text-slate-600 dark:text-zinc-300">
                    Tiempo por Pregunta
                  </label>
                  <select
                    value={timerSeconds}
                    onChange={(e) => setTimerSeconds(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-sm font-semibold text-slate-900 dark:text-white"
                  >
                    <option value={10}>10 segundos (Rápido & Dinámico)</option>
                    <option value={15}>15 segundos (Recomendado)</option>
                    <option value={30}>30 segundos (Tranquilo)</option>
                    <option value={0}>Sin límite de tiempo</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold text-slate-600 dark:text-zinc-300">
                    Porcentaje de Aprobación Mínimo (%)
                  </label>
                  <select
                    value={approvalThreshold}
                    onChange={(e) => setApprovalThreshold(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 text-sm font-semibold text-slate-900 dark:text-white"
                  >
                    <option value={50}>50% de aciertos</option>
                    <option value={75}>75% de aciertos (Recomendado)</option>
                    <option value={100}>100% de aciertos (Perfect Score)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* List of Questions */}
            <div className="bg-white dark:bg-[#0f172a] rounded-3xl border border-slate-200 dark:border-white/10 p-6 sm:p-8 shadow-xl space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-white/5">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Preguntas de la Trivia ({questions.length})
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-zinc-400">
                    Administra las preguntas que se mostrarán en la prueba.
                  </p>
                </div>
              </div>

              {/* Questions Cards */}
              <div className="space-y-3">
                {questions.map((q, qIndex) => (
                  <div 
                    key={q.id}
                    className="p-4 rounded-2xl bg-slate-50/70 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-start justify-between gap-4"
                  >
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-lg bg-pink-100 dark:bg-pink-950 text-pink-600 dark:text-pink-400 flex items-center justify-center text-xs font-mono font-bold">
                          {qIndex + 1}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
                          {q.question}
                        </h4>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
                        {q.options.map((opt, oIdx) => (
                          <span
                            key={oIdx}
                            className={`px-2 py-1 rounded-md border truncate ${
                              oIdx === q.correctIndex 
                                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-700 dark:text-emerald-300 font-bold'
                                : 'bg-white dark:bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-zinc-400'
                            }`}
                          >
                            {String.fromCharCode(65 + oIdx)}. {opt}
                          </span>
                        ))}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDeleteQuestion(q.id)}
                      disabled={questions.length <= 1}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors disabled:opacity-30 cursor-pointer"
                      title="Eliminar pregunta"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>

              {/* Add Question Form */}
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-dashed border-slate-300 dark:border-white/20 space-y-4">
                <h4 className="text-xs font-mono font-bold uppercase text-slate-500 dark:text-zinc-400">
                  + Agregar Nueva Pregunta
                </h4>

                <input
                  type="text"
                  placeholder="Escribe el enunciado de la pregunta..."
                  value={newQTitle}
                  onChange={(e) => setNewQTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#070a12] text-sm text-slate-900 dark:text-white"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {newQOpts.map((opt, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="correctAnswer"
                        checked={newQCorrect === idx}
                        onChange={() => setNewQCorrect(idx)}
                        className="accent-pink-600 cursor-pointer"
                        title="Marcar como correcta"
                      />
                      <input
                        type="text"
                        placeholder={`Opción ${String.fromCharCode(65 + idx)}`}
                        value={opt}
                        onChange={(e) => {
                          const val = e.target.value;
                          setNewQOpts((prev) => {
                            const updated = [...prev];
                            updated[idx] = val;
                            return updated;
                          });
                        }}
                        className={`w-full px-3 py-2 rounded-xl border text-xs bg-white dark:bg-[#070a12] text-slate-900 dark:text-white ${
                          newQCorrect === idx ? 'border-pink-500 ring-1 ring-pink-500' : 'border-slate-200 dark:border-white/10'
                        }`}
                      />
                    </div>
                  ))}
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={handleAddQuestion}
                    className="btn-pro-primary px-5 py-2.5 rounded-full text-xs font-bold flex items-center gap-2 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Guardar Pregunta</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ─── TAB 3: BASE DE DATOS DE LEADS & PARTICIPANTES ──────────────── */}
        {activeTab === 'leads' && (
          <div className="bg-white dark:bg-[#0f172a] rounded-3xl border border-slate-200 dark:border-white/10 p-6 sm:p-8 shadow-xl space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-white/5">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  Participantes & Leads Capturados ({leads.length})
                </h3>
                <p className="text-xs text-slate-500 dark:text-zinc-400">
                  Datos de usuarios registrados en tiempo real listos para exportar.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={exportLeadsCSV}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-xs font-bold flex items-center gap-2 text-slate-800 dark:text-zinc-200 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-pink-600 dark:text-pink-400" />
                  <span>Exportar .CSV</span>
                </button>

                <Link
                  href="/sorteos/nuevo?mode=multi"
                  className="btn-pro-primary px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2"
                >
                  <Trophy className="w-3.5 h-3.5" />
                  <span>Sorteo entre Aprobados</span>
                </Link>
              </div>
            </div>

            {/* Leads Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-white/10 text-slate-400 dark:text-zinc-500 font-mono uppercase">
                    <th className="py-3 px-4">Participante</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Puntaje</th>
                    <th className="py-3 px-4">Porcentaje</th>
                    <th className="py-3 px-4">Estado</th>
                    <th className="py-3 px-4">Fecha</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-white/5">
                  {leads.map((l) => (
                    <tr key={l.id} className="hover:bg-slate-50/50 dark:hover:bg-white/5 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-900 dark:text-white flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-pink-100 dark:bg-purple-950 text-pink-600 dark:text-purple-300 flex items-center justify-center font-bold text-[10px]">
                          {l.name[0]}
                        </div>
                        <span>{l.name}</span>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-600 dark:text-zinc-400">{l.email}</td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-800 dark:text-zinc-200">{l.score} / {l.total}</td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-800 dark:text-zinc-200">{l.percentage}%</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-md font-mono text-[10px] font-bold uppercase ${
                          l.approved 
                            ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300'
                            : 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300'
                        }`}>
                          {l.approved ? 'Aprobado' : 'Reprobado'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-400 dark:text-zinc-500 font-mono text-[11px]">{l.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ─── TAB 4: COMPARTIR & EMBED WIDGET ────────────────────────────── */}
        {activeTab === 'embed' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-[#0f172a] rounded-3xl border border-slate-200 dark:border-white/10 p-6 sm:p-8 shadow-xl space-y-4">
              <div className="flex items-center gap-2.5">
                <Globe2 className="w-5 h-5 text-pink-600 dark:text-purple-400" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Enlace Directo para Redes Sociales
                </h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-zinc-400">
                Comparte este link en tu biografía de Instagram, TikTok, WhatsApp o campañas de email.
              </p>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                <input
                  type="text"
                  readOnly
                  value={shareUrl}
                  className="flex-1 bg-transparent text-xs font-mono text-slate-700 dark:text-zinc-300 px-2 outline-none truncate"
                />
                <button
                  type="button"
                  onClick={() => copyToClipboard(shareUrl, 'link')}
                  className="btn-pro-primary px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer"
                >
                  {copiedLink ? 'Copiado!' : 'Copiar'}
                </button>
              </div>
            </div>

            <div className="bg-white dark:bg-[#0f172a] rounded-3xl border border-slate-200 dark:border-white/10 p-6 sm:p-8 shadow-xl space-y-4">
              <div className="flex items-center gap-2.5">
                <Code2 className="w-5 h-5 text-pink-600 dark:text-purple-400" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Widget Iframe para tu Sitio Web
                </h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-zinc-400">
                Inserta este código en Shopify, WordPress, WooCommerce o Wix para mostrar la trivia embebida.
              </p>
              <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                <input
                  type="text"
                  readOnly
                  value={embedCode}
                  className="flex-1 bg-transparent text-xs font-mono text-slate-700 dark:text-zinc-300 px-2 outline-none truncate"
                />
                <button
                  type="button"
                  onClick={() => copyToClipboard(embedCode, 'embed')}
                  className="btn-pro-primary px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer"
                >
                  {copiedEmbed ? 'Copiado!' : 'Copiar'}
                </button>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ─── CASOS DE USO MÁS COMUNES (3 MODELOS) ───────────────────────── */}
      <section className="py-16 bg-slate-100/60 dark:bg-white/[0.02] border-y border-slate-200/80 dark:border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-display">
              Casos de uso más comunes
            </h2>
            <p className="text-slate-600 dark:text-zinc-400 max-w-2xl mx-auto text-base">
              Nuestra Trivia Online te ayuda a atraer visitantes, generar leads de alta calidad y fidelizar a tus clientes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Caso 1: Popup E-Commerce */}
            <div className="p-7 rounded-3xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 shadow-lg space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-pink-100 dark:bg-pink-950/60 text-pink-600 dark:text-pink-400 flex items-center justify-center shadow-xs">
                <Store className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Popup en tu Sitio Web
              </h3>
              <p className="text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
                Inserta la Trivia como widget o popup al intentar salir de tu e-commerce y entrega cupones de descuento para cerrar ventas que estaban a punto de perderse.
              </p>
              <ul className="space-y-1.5 text-xs text-slate-600 dark:text-zinc-300 font-medium">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Reduce el abandono de carrito</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Compatible con Shopify y WooCommerce</span>
                </li>
              </ul>
            </div>

            {/* Caso 2: Promoción en Vivo con QR */}
            <div className="p-7 rounded-3xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 shadow-lg space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center shadow-xs">
                <QrCode className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Promoción en Vivo con QR
              </h3>
              <p className="text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
                Ideal para stands en ferias comerciales, locales comerciales y eventos. Los participantes escanean el código QR con su smartphone y juegan al instante.
              </p>
              <ul className="space-y-1.5 text-xs text-slate-600 dark:text-zinc-300 font-medium">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Cero contacto y 100% móvil</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Captura nombres y números de WhatsApp</span>
                </li>
              </ul>
            </div>

            {/* Caso 3: Promoción Online Redes */}
            <div className="p-7 rounded-3xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 shadow-lg space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-teal-100 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center shadow-xs">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Promoción Online & Link en Bio
              </h3>
              <p className="text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
                Genera tráfico masivo compartiendo el enlace en stories de Instagram, videos de TikTok o campañas de email marketing para armar una base de datos propia.
              </p>
              <ul className="space-y-1.5 text-xs text-slate-600 dark:text-zinc-300 font-medium">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Viralidad y engagement orgánico</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Pase directo al bombo de sorteos</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CÓMO FUNCIONA (5 PASOS) ────────────────────────────────────── */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-display">
              ¿Cómo funciona?: 5 sencillos pasos
            </h2>
            <p className="text-slate-600 dark:text-zinc-400 text-base">
              Crea tu trivia o cuestionario en menos de 5 minutos y empieza a recolectar respuestas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[
              { num: '1', title: 'Escoge el tipo', desc: 'Opción múltiple, Sí/No o Cuestionario sin respuesta correcta.' },
              { num: '2', title: 'Crea preguntas', desc: 'Redacta enunciados, alternativas y marca la respuesta correcta.' },
              { num: '3', title: 'Configura reglas', desc: 'Define tiempo por pregunta, aprobación % y cupón de premio.' },
              { num: '4', title: 'Comparte el link', desc: 'Usa enlace directo, código QR o widget embebido en tu web.' },
              { num: '5', title: 'Exporta y sortea', desc: 'Descarga base de datos en CSV y sortea con hash SHA-256.' },
            ].map((st) => (
              <div 
                key={st.num}
                className="p-5 rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 shadow-sm space-y-2 text-center"
              >
                <div className="w-8 h-8 rounded-full bg-pink-100 dark:bg-pink-950 text-pink-600 dark:text-pink-400 font-mono font-black text-sm flex items-center justify-center mx-auto shadow-xs">
                  {st.num}
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  {st.title}
                </h4>
                <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
                  {st.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FUNCIONALIDADES PRINCIPALES (GRID 6) ────────────────────────── */}
      <section className="py-16 bg-slate-100/60 dark:bg-white/[0.02] border-t border-slate-200/80 dark:border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-display">
              Funcionalidades Principales
            </h2>
            <p className="text-slate-600 dark:text-zinc-400 text-base">
              Todo lo que necesitas para automatizar promociones y calificar a tus clientes.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Gift, title: 'Premios y Cupones', desc: 'Entrega códigos de descuento automáticos al superar el porcentaje mínimo de aprobación.' },
              { icon: Palette, title: 'Personalización de Marca', desc: 'Adapta colores, títulos y descripciones para que coincida 100% con tu identidad visual.' },
              { icon: Download, title: 'Exportación .CSV', desc: 'Descarga en 1 clic la base de datos completa con nombres, emails, aciertos y fechas para tu CRM.' },
              { icon: Code2, title: 'Widget Embed Universal', desc: 'Incrusta la trivia fácilmente copiando y pegando un fragmento de código HTML o iframe.' },
              { icon: BarChart3, title: 'Análisis y Métricas', desc: 'Visualiza la tasa de completitud, aciertos promedio y porcentaje de jugadores aprobados.' },
              { icon: ShieldCheck, title: 'Sistema Anti-Fraude', desc: 'Validación de sintaxis de correos electrónicos y bloqueo de participaciones duplicadas abusivas.' },
            ].map((feat, idx) => (
              <div 
                key={idx}
                className="p-6 rounded-3xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 shadow-sm space-y-3"
              >
                <div className="w-10 h-10 rounded-xl bg-pink-100 dark:bg-pink-950/60 text-pink-600 dark:text-pink-400 flex items-center justify-center">
                  <feat.icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {feat.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
                  {feat.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQ PREGUNTAS FRECUENTES ───────────────────────────────────── */}
      <section className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center space-y-3">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-display">
            Preguntas Frecuentes
          </h2>
          <p className="text-slate-600 dark:text-zinc-400 text-sm sm:text-base">
            Resolvemos tus dudas sobre el Generador de Trivias Online.
          </p>
        </div>

        <div className="space-y-3">
          {[
            {
              q: '¿Cuántas trivias puedo crear con Sorteos Pro?',
              a: 'Puedes crear un número ilimitado de trivias y cuestionarios personalizados. No hay límites en la cantidad de juegos ni en la cantidad de preguntas que desees configurar.'
            },
            {
              q: '¿Esta aplicación tiene costo?',
              a: 'El generador de trivias es 100% gratuito. Puedes configurarla, jugar las demos y exportar tus leads sin costo alguno. Funcionalidades avanzadas para empresas están disponibles en nuestros planes Pro.'
            },
            {
              q: '¿Cómo conecto los aprobados de la trivia con un sorteo oficial?',
              a: 'En la pestaña "Base de Datos", simplemente haz clic en "Sorteo entre Aprobados". El sistema filtrará automáticamente a los participantes que superaron el umbral y los cargará en la ruleta o en el bombo aleatorio con certificado SHA-256.'
            },
            {
              q: '¿Puedo insertar la trivia en mi tienda de Shopify o WordPress?',
              a: '¡Sí! En la pestaña "Incrustar / Embed" obtendrás un código HTML iframe listo para copiar y pegar en cualquier página de Shopify, WooCommerce, WordPress, Squarespace o Wix.'
            },
            {
              q: '¿Los participantes pueden ver sus aciertos y el cupón de descuento?',
              a: 'Sí. Al finalizar el cuestionario, la pantalla muestra de inmediato el desglose de preguntas correctas, su porcentaje obtenido y el código de descuento personalizado que configuraste.'
            }
          ].map((item, idx) => {
            const isOpen = faqOpen === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#0f172a] overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setFaqOpen(isOpen ? null : idx)}
                  className="w-full p-5 text-left font-bold text-sm sm:text-base text-slate-900 dark:text-white flex items-center justify-between gap-4 cursor-pointer"
                >
                  <span>{item.q}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180 text-pink-600' : ''}`} />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 dark:text-zinc-300 leading-relaxed border-t border-slate-100 dark:border-white/5 pt-3">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
