"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
  ChevronDown,
  Gift,
  Star,
  UploadCloud,
  Eye,
  X,
  MessageSquare,
  AlertCircle,
  ShoppingBag,
  ExternalLink,
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

const PRESET_TOPICS: { 
  id: string;
  name: string; 
  subtitle: string;
  badge: string;
  icon: string; 
  questions: Question[];
  rewardCode: string;
}[] = [
  {
    id: 'paises',
    name: 'Países & Cultura General',
    subtitle: 'Prueba de geografía, capitales y curiosidades del mundo.',
    badge: 'Popular',
    icon: '🌍',
    rewardCode: 'MUNDO2026',
    questions: [
      {
        id: 'cult-1',
        question: '¿Cuál es la capital oficial de Australia?',
        options: ['Sídney', 'Melbourne', 'Canberra', 'Brisbane'],
        correctIndex: 2,
        explanation: 'Canberra fue elegida como capital en 1908 como solución de compromiso entre Sídney y Melbourne.'
      },
      {
        id: 'cult-2',
        question: '¿Cuál es el río más caudaloso y largo del planeta Tierra?',
        options: ['Río Nilo', 'Río Amazonas', 'Río Yangtsé', 'Río Misisipi'],
        correctIndex: 1,
        explanation: 'El río Amazonas supera los 6,992 km y vierte más de 200,000 m³ de agua dulce por segundo al Atlántico.'
      },
      {
        id: 'cult-3',
        question: '¿En qué continente se encuentra el desierto del Sahara?',
        options: ['Asia', 'África', 'Oceanía', 'América del Norte'],
        correctIndex: 1,
        explanation: 'El Sahara abarca más de 9 millones de km² a lo largo del norte de África.'
      },
      {
        id: 'cult-4',
        question: '¿Qué país europeo tiene una singular silueta geográfica en forma de bota?',
        options: ['España', 'Grecia', 'Italia', 'Portugal'],
        correctIndex: 2,
        explanation: 'La península itálica es famosa en el mundo entero por su silueta inconfundible de bota de cuero.'
      }
    ]
  },
  {
    id: 'peliculas',
    name: 'Películas & Cine de los 90s',
    subtitle: 'Revive los mayores clásicos del cine taquillero y gana.',
    badge: 'Cinefilos',
    icon: '🍿',
    rewardCode: 'CINEMAX90',
    questions: [
      {
        id: 'cine-1',
        question: '¿Quién dirigió la histórica película Titanic (1997)?',
        options: ['Steven Spielberg', 'Christopher Nolan', 'James Cameron', 'George Lucas'],
        correctIndex: 2,
        explanation: 'James Cameron dirigió la cinta que empató el récord histórico de 11 premios Óscar.'
      },
      {
        id: 'cine-2',
        question: '¿En qué año se estrenó Jurassic Park por primera vez en cines?',
        options: ['1991', '1993', '1995', '1998'],
        correctIndex: 1,
        explanation: 'Jurassic Park de Steven Spielberg revolucionó los efectos digitales en 1993.'
      },
      {
        id: 'cine-3',
        question: '¿Cuál es el nombre del protagonista de la película The Matrix (1999)?',
        options: ['Neo (Thomas Anderson)', 'Morpheus', 'John Wick', 'Cypher'],
        correctIndex: 0,
        explanation: 'Keanu Reeves inmortalizó el papel de Thomas Anderson (Neo) en Matrix.'
      },
      {
        id: 'cine-4',
        question: '¿Qué actor interpretó al inolvidable Forrest Gump?',
        options: ['Brad Pitt', 'Tom Hanks', 'Robin Williams', 'Al Pacino'],
        correctIndex: 1,
        explanation: 'Tom Hanks ganó el premio Óscar a Mejor Actor en 1994 por este papel icónico.'
      }
    ]
  },
  {
    id: 'mkt',
    name: 'Marketing & Tu Marca',
    subtitle: 'Evalúa cuánto conocen tus seguidores sobre tus productos y valores.',
    badge: 'E-Commerce',
    icon: '🚀',
    rewardCode: 'TRIVIA25OFF',
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
        question: '¿Qué ventaja directa ofrece insertar una Trivia interactiva con cupón de salida (Exit-Intent)?',
        options: ['Mayor aburrimiento', 'Reduce el rebote, cualifica clientes y dispara las compras hasta un 300%', 'Pierde clientes', 'Ninguna ventaja'],
        correctIndex: 1,
        explanation: 'Gamificar la experiencia del cliente transforma visitas dudosas en compradores fidelizados.'
      },
      {
        id: 'mkt-3',
        question: '¿Qué red social permite recolección de comentarios directa mediante la API oficial de Google Data?',
        options: ['YouTube', 'Twitch', 'Snapchat', 'Pinterest'],
        correctIndex: 0,
        explanation: 'YouTube utiliza la API oficial de Google Data v3 para indexar comentarios en vivo sin límites.'
      },
      {
        id: 'mkt-4',
        question: '¿Cuál es la mejor práctica al realizar un sorteo en Instagram o TikTok para generar confianza?',
        options: ['Elegir a dedo sin sorteo', 'Publicar Bases Legales y Certificado de Validez Verificable', 'Ocultar a los ganadores', 'Borrar comentarios'],
        correctIndex: 1,
        explanation: 'La transparencia total y la trazabilidad criptográfica fidelizan a tu comunidad de por vida.'
      }
    ]
  },
  {
    id: 'halloween',
    name: 'Halloween & Misterio',
    subtitle: 'Trivia temática de terror, mitos y celebraciones.',
    badge: 'Temática',
    icon: '🎃',
    rewardCode: 'SPOOKY50',
    questions: [
      {
        id: 'hal-1',
        question: '¿De qué verdura se hacían originalmente las linternas de Jack-o\'-lantern en Irlanda?',
        options: ['Calabazas', 'Nabos', 'Zanahorias', 'Patatas'],
        correctIndex: 1,
        explanation: 'En Irlanda y Escocia tradicionalmente se tallaban nabos antes de adoptar las calabazas en América.'
      },
      {
        id: 'hal-2',
        question: '¿En qué país histórico se sitúa la región de Transilvania, hogar literario de Drácula?',
        options: ['Hungría', 'Rumanía', 'Polonia', 'Bulgaria'],
        correctIndex: 1,
        explanation: 'Transilvania es una región histórica situada en el corazón de Rumanía.'
      },
      {
        id: 'hal-3',
        question: '¿Cuál es la frase tradicional que dicen los niños al pedir dulces en Halloween?',
        options: ['Dulce o Truco (Trick or Treat)', 'Dame caramelos', 'Abracadabra', 'Premio o castigo'],
        correctIndex: 0,
        explanation: '"Trick or treat" es la tradición anglosajona extendida a todo el mundo moderno.'
      }
    ]
  },
  {
    id: 'survey',
    name: 'Encuesta de Satisfacción (Feedback)',
    subtitle: 'Preguntas sin respuesta incorrecta para recoger la opinión de tus clientes.',
    badge: 'Cuestionario',
    icon: '⭐',
    rewardCode: 'GRACIAS15',
    questions: [
      {
        id: 'surv-1',
        question: '¿Cómo calificarías la experiencia general de navegación en nuestra tienda?',
        options: ['Excelente y muy fluida', 'Buena, encontré lo que buscaba', 'Regular, faltan opciones', 'Difícil de navegar'],
        correctIndex: 0,
        explanation: '¡Gracias por tu valoración! Todas las opiniones nos ayudan a mejorar continuamente.'
      },
      {
        id: 'surv-2',
        question: '¿Qué tipo de promociones prefieres recibir en tus compras frecuentes?',
        options: ['Cupones directos de 20-30% de descuento', 'Envío gratis en todos los pedidos', 'Regalos sorpresa con cada compra', 'Sorteos mensuales de productos premium'],
        correctIndex: 0,
        explanation: 'Tu preferencia ha quedado registrada para personalizar tus futuros beneficios.'
      },
      {
        id: 'surv-3',
        question: '¿Nos recomendarías con un amigo o familiar?',
        options: ['Definitivamente sí (10/10)', 'Muy probablemente', 'Tal vez en el futuro', 'No estoy seguro'],
        correctIndex: 0,
        explanation: '¡Agradecemos inmensamente tu tiempo y lealtad con nuestra marca!'
      }
    ]
  }
];

const INITIAL_LEADS: LeadEntry[] = [
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
  },
  {
    id: 'lead-4',
    name: 'Mateo Fernández',
    email: 'mateo.fernandez@gmail.com',
    score: 4,
    total: 4,
    percentage: 100,
    approved: true,
    date: '11/10/2026, 17:05'
  }
];

// Dominios temporales o desechables para validación Anti-Fraude
const DISPOSABLE_EMAIL_DOMAINS = [
  'tempmail.com', '10minutemail.com', 'mailinator.com', 'guerrillamail.com',
  'sharklasers.com', 'throwawaymail.com', 'yopmail.com', 'getairmail.com'
];

export default function TriviaPage() {
  const router = useRouter();

  // Tabs: 'play' | 'builder' | 'leads' | 'embed'
  const [activeTab, setActiveTab] = useState<'play' | 'builder' | 'leads' | 'embed'>('play');

  // Configuración de la Trivia activa
  const [activePresetId, setActivePresetId] = useState<string>('paises');
  const [triviaTitle, setTriviaTitle] = useState('Trivia de Países & Cultura General');
  const [triviaDesc, setTriviaDesc] = useState('Pon a prueba tus conocimientos, desbloquea tu cupón de descuento y entra al sorteo oficial.');
  const [timerSeconds, setTimerSeconds] = useState<number>(15);
  const [approvalThreshold, setApprovalThreshold] = useState<number>(75);
  const [rewardCode, setRewardCode] = useState('MUNDO2026');

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
  const [emailError, setEmailError] = useState<string | null>(null);

  // Base de datos de Leads sincronizada con localStorage
  const [leads, setLeads] = useState<LeadEntry[]>(INITIAL_LEADS);

  // Editor: Nueva pregunta temporal
  const [newQTitle, setNewQTitle] = useState('');
  const [newQOpts, setNewQOpts] = useState(['', '', '', '']);
  const [newQCorrect, setNewQCorrect] = useState(0);

  // CSV Import Modal & Textarea
  const [showCsvModal, setShowCsvModal] = useState(false);
  const [csvRawText, setCsvRawText] = useState('');

  // Modales adicionales de AppSorteos
  const [showHowItWorksModal, setShowHowItWorksModal] = useState(false);
  const [showExitIntentDemo, setShowExitIntentDemo] = useState(false);

  // Acordeón FAQ
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  // Copia de embed o link
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedEmbed, setCopiedEmbed] = useState(false);

  const gameSectionRef = useRef<HTMLDivElement>(null);
  const csvFileInputRef = useRef<HTMLInputElement>(null);

  // Cargar leads guardados en localStorage
  useEffect(() => {
    try {
      const cached = localStorage.getItem('sorteos_trivia_leads');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setLeads(parsed);
        }
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Timer del jugador interactivo
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

    const isSurveyMode = activePresetId === 'survey';
    if (isSurveyMode || idx === currentQ.correctIndex) {
      setScore((prev) => prev + 1);
      playCorrectChime();
    } else {
      playWrongBuzz();
    }
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError('Ingresa un correo electrónico con formato válido.');
      return false;
    }
    const domain = email.split('@')[1]?.toLowerCase();
    if (domain && DISPOSABLE_EMAIL_DOMAINS.includes(domain)) {
      setEmailError('Sistema Anti-Fraude: No se admiten correos desechables o temporales.');
      return false;
    }
    setEmailError(null);
    return true;
  };

  const handleNextQuestion = () => {
    if (currentIdx + 1 < questions.length) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setTimeLeft(timerSeconds);
    } else {
      setIsFinished(true);
      const isSurveyMode = activePresetId === 'survey';
      const finalScore = isSurveyMode ? questions.length : (selectedOption === currentQ.correctIndex ? score + 1 : score);
      const pct = Math.round((finalScore / questions.length) * 100);
      const isApproved = pct >= approvalThreshold;

      if (isApproved) {
        setShowConfetti(true);
        playCelebrationSound();
      }

      // Si había ingresado datos de lead con email válido, guardar automáticamente
      if (leadEmail.trim() && validateEmail(leadEmail.trim())) {
        const newLead: LeadEntry = {
          id: `lead-${Date.now()}`,
          name: leadName.trim() || 'Participante Anónimo',
          email: leadEmail.trim(),
          score: finalScore,
          total: questions.length,
          percentage: pct,
          approved: isApproved,
          date: new Date().toLocaleString()
        };
        const updated = [newLead, ...leads];
        setLeads(updated);
        try {
          localStorage.setItem('sorteos_trivia_leads', JSON.stringify(updated));
        } catch (e) {}
        setLeadRegistered(true);
      }
    }
  };

  const handleRegisterLeadManual = () => {
    if (!leadEmail.trim() || !validateEmail(leadEmail.trim())) return;
    const finalScore = score;
    const pct = Math.round((finalScore / questions.length) * 100);
    const approved = pct >= approvalThreshold;

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
    const updated = [newLead, ...leads];
    setLeads(updated);
    try {
      localStorage.setItem('sorteos_trivia_leads', JSON.stringify(updated));
    } catch (e) {}
    setLeadRegistered(true);
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setScore(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setIsFinished(false);
    setTimeLeft(timerSeconds);
    setShowConfetti(false);
    setLeadRegistered(false);
    setEmailError(null);
  };

  const loadPreset = (preset: typeof PRESET_TOPICS[0]) => {
    setActivePresetId(preset.id);
    setQuestions(preset.questions);
    setTriviaTitle(`Trivia de ${preset.name}`);
    setRewardCode(preset.rewardCode);
    handleRestart();
    setActiveTab('play');
    if (gameSectionRef.current) {
      gameSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleAddQuestion = () => {
    if (!newQTitle.trim()) return;
    const validOpts = newQOpts.map((o, idx) => o.trim() || `Opción ${String.fromCharCode(65 + idx)}`);
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

  // Importar CSV
  const handleProcessCsv = (csvText: string) => {
    if (!csvText.trim()) return;
    const lines = csvText.split('\n').map((l) => l.trim()).filter((l) => l.length > 0);
    const imported: Question[] = [];

    lines.forEach((line, idx) => {
      // Ignorar cabecera si contiene "Pregunta"
      if (idx === 0 && line.toLowerCase().includes('pregunta')) return;
      const parts = line.split(',').map((p) => p.replace(/^["']|["']$/g, '').trim());
      if (parts.length >= 3) {
        const questionText = parts[0];
        const correctVal = parts[parts.length - 1];
        let correctIdx = parseInt(correctVal, 10);
        if (isNaN(correctIdx) || correctIdx < 0) correctIdx = 0;

        const options = parts.slice(1, parts.length - 1);
        if (options.length >= 2) {
          imported.push({
            id: `csv-${Date.now()}-${idx}`,
            question: questionText,
            options,
            correctIndex: Math.min(correctIdx, options.length - 1)
          });
        }
      }
    });

    if (imported.length > 0) {
      setQuestions(imported);
      setTriviaTitle(`Trivia Personalizada (${imported.length} preguntas)`);
      handleRestart();
      setShowCsvModal(false);
      setCsvRawText('');
      alert(`¡Se importaron ${imported.length} preguntas exitosamente!`);
    } else {
      alert('No se detectó un formato CSV válido. Debe ser: Pregunta,Opción 1,Opción 2,Opción 3,ÍndiceCorrecto (ej: 0)');
    }
  };

  const handleCsvFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        handleProcessCsv(text);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Exportar Leads CSV
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

  // Pasar a Sorteo con datos reales
  const transferApprovedToDraw = (targetRoute: '/herramientas/lista' | '/herramientas/ruleta') => {
    const approvedLeads = leads.filter((l) => l.approved);
    const names = approvedLeads.length > 0 
      ? approvedLeads.map((l) => l.name) 
      : leads.map((l) => l.name);

    if (names.length === 0) {
      alert('No hay participantes registrados para sortear.');
      return;
    }

    try {
      localStorage.setItem('sorteo_imported_names', JSON.stringify(names));
    } catch (e) {
      console.error(e);
    }

    router.push(`${targetRoute}?source=trivia`);
  };

  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/herramientas/trivia` : 'https://sorteos.pro/herramientas/trivia';
  const embedCode = `<iframe src="${shareUrl}" width="100%" height="720" frameborder="0" style="border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.15);" allow="autoplay"></iframe>`;

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
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#070a12] text-slate-900 dark:text-zinc-100 selection:bg-pink-500 selection:text-white pb-20">
      <ConfettiEffect active={showConfetti} />

      {/* Pill Switcher */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <ToolSwitcher />
      </div>

      {/* ─── HERO HEADER ESTILO APPSORTEOS ───────────────────────────────── */}
      <section className="relative overflow-hidden pt-12 pb-16 border-b border-slate-200/80 dark:border-white/10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-pink-100 dark:bg-pink-950/60 border border-pink-200 dark:border-pink-800/40 text-pink-700 dark:text-pink-300 text-xs font-mono font-bold tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5 text-pink-500" />
            <span>Herramienta Oficial de Promoción & Captura de Leads</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black font-display tracking-tight text-slate-900 dark:text-white">
            Crea una Trivia Online
          </h1>

          <p className="text-lg sm:text-xl text-slate-600 dark:text-zinc-300 max-w-3xl mx-auto font-normal leading-relaxed">
            Crea una Trivia o Quiz interactivo para generar clientes potenciales, promocionar tus productos y entretener a tu audiencia de forma 100% automatizada.
          </p>

          {/* Key Value Checks de AppSorteos */}
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 pt-2 text-xs sm:text-sm font-semibold text-slate-700 dark:text-zinc-300">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Popup al intentar salir</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Diseño completamente personalizable</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Captura y exporta los participantes .CSV</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              <span>Certificado SHA-256 Verificable</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
            <button
              onClick={() => {
                setActiveTab('builder');
                if (gameSectionRef.current) {
                  gameSectionRef.current.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="btn-pro-primary px-8 py-3.5 rounded-full text-sm font-bold shadow-lg shadow-pink-500/20 hover:scale-102 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Settings2 className="w-4 h-4" />
              <span>Pruébalo Gratis</span>
            </button>
            <button
              onClick={() => setShowHowItWorksModal(true)}
              className="px-7 py-3.5 rounded-full text-sm font-bold border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 hover:bg-slate-50 dark:hover:bg-white/10 text-slate-800 dark:text-white transition-all flex items-center gap-2 cursor-pointer shadow-xs"
            >
              <Play className="w-4 h-4 text-pink-600 dark:text-pink-400" />
              <span>Mira cómo funciona</span>
            </button>
            <button
              onClick={() => setShowExitIntentDemo(true)}
              className="px-6 py-3.5 rounded-full text-xs font-bold border border-dashed border-pink-300 dark:border-pink-800/50 bg-pink-50/60 dark:bg-pink-950/20 text-pink-700 dark:text-pink-300 hover:bg-pink-100 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Simular Exit-Intent Popup</span>
            </button>
          </div>

          <div className="space-y-2 pt-2">
            <div className="text-xs text-slate-500 dark:text-zinc-400 font-mono">
              No se requiere tarjeta de crédito • 100% Gratuito
            </div>
            <div className="flex items-center justify-center gap-2 text-xs font-semibold text-slate-600 dark:text-zinc-400">
              <div className="flex items-center text-amber-400">
                <Star className="w-4 h-4 fill-amber-400" />
                <Star className="w-4 h-4 fill-amber-400" />
                <Star className="w-4 h-4 fill-amber-400" />
                <Star className="w-4 h-4 fill-amber-400" />
                <Star className="w-4 h-4 fill-amber-400" />
              </div>
              <span>Usado por 11,362 usuarios de 87 países</span>
            </div>
          </div>
        </div>
      </section>

      {/* ─── SOCIAL PROOF / ESTÁS EN BUENAS MANOS (BRANDS & INFLUENCERS) ─── */}
      <section className="py-12 bg-white dark:bg-[#0c101d] border-b border-slate-200/80 dark:border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-2">
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              Estás en buenas manos
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 max-w-2xl mx-auto">
              Con la confianza de +11,362 marcas e influencers internacionales que utilizan Sorteos Pro para sus sorteos, quiz y promociones interactivas.
            </p>
          </div>

          {/* Marcas reconocidas */}
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 opacity-75 grayscale hover:grayscale-0 transition-all">
            <div className="font-black text-xl tracking-tighter text-slate-700 dark:text-zinc-300">rtve</div>
            <div className="font-extrabold text-xl tracking-tight text-slate-700 dark:text-zinc-300">Tupperware</div>
            <div className="font-black text-2xl tracking-wide text-blue-600 dark:text-blue-400">pepsi</div>
            <div className="font-serif font-bold text-lg tracking-widest text-slate-800 dark:text-zinc-200">MARRIOTT</div>
            <div className="font-bold text-xl tracking-tight text-orange-600 dark:text-orange-400">HubSpot</div>
            <div className="font-black text-xl italic tracking-tighter text-red-600 dark:text-red-400">Levi&apos;s</div>
          </div>

          {/* Grid de Influencers Reales con seguidores */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 pt-4">
            {[
              { name: 'Andrea Valdiri', count: '9.1M', role: 'Creadora' },
              { name: 'Cinthia Fernández', count: '5.8M', role: 'Influencer' },
              { name: 'Kimberly Reyes', count: '4.1M', role: 'Actriz' },
              { name: 'Chris Leao', count: '2.1M', role: 'DJ & Creador' },
              { name: 'Ana Karina Soto', count: '1.8M', role: 'Presentadora' },
              { name: 'Stephanie Demner', count: '1.4M', role: 'Modelo' },
              { name: 'Irina Manea', count: '1.1M', role: 'Lifestyle' },
              { name: 'Dr. Carla Barber', count: '1.0M', role: 'Médica & Brand' },
            ].map((inf, idx) => (
              <div 
                key={idx}
                className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/5 text-center space-y-1 hover:border-pink-500/30 transition-all"
              >
                <div className="w-10 h-10 rounded-full mx-auto bg-gradient-to-tr from-amber-400 via-pink-500 to-purple-600 text-white font-bold flex items-center justify-center text-xs shadow-xs">
                  {inf.name[0]}
                </div>
                <div className="text-[11px] font-bold text-slate-900 dark:text-white truncate">
                  {inf.name}
                </div>
                <div className="text-[10px] font-mono font-bold text-pink-600 dark:text-pink-400">
                  {inf.count}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIOS REALES (3 CARDS DE APPSORTEOS) ─────────────────── */}
      <section className="py-12 bg-slate-50/50 dark:bg-white/[0.01] border-b border-slate-200/80 dark:border-white/10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: '"Fácil, Divertido, Efectivo"',
                quote: 'Integramos la trivia en nuestro e-commerce y multiplicamos el porcentaje de captura de correos un 280%. El pase directo a sorteo es una maravilla.',
                author: 'Marketing Maven',
                handle: '@MarketingMaven1'
              },
              {
                title: '"Muy simple de utilizar"',
                quote: 'En menos de 10 minutos armamos un cuestionario con preguntas de nuestra marca. La exportación a CSV nos ahorra horas de trabajo manual.',
                author: 'Vidnoz Digital',
                handle: '@vidnoz_official'
              },
              {
                title: '"Aumenté mis ventas, gran diseño"',
                quote: 'Entregar cupones de descuento automáticos a los aprobados disparó la tasa de conversión durante la campaña de Black Friday.',
                author: 'Timmothy Kelley',
                handle: '@timm_othy9'
              }
            ].map((rev, idx) => (
              <div 
                key={idx}
                className="p-6 rounded-3xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 shadow-sm space-y-3"
              >
                <div className="flex items-center text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                </div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  {rev.title}
                </h4>
                <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                  {rev.quote}
                </p>
                <div className="pt-2 border-t border-slate-100 dark:border-white/5 flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-pink-100 dark:bg-pink-950 text-pink-600 dark:text-pink-300 flex items-center justify-center font-bold text-xs">
                    {rev.author[0]}
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">{rev.author}</div>
                    <div className="text-[10px] text-slate-400 font-mono">{rev.handle}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CREA TU PRIMERA TRIVIA (2 MODELOS PRINCIPALES DE APPSORTEOS) ── */}
      <section className="py-14 bg-white dark:bg-[#070a12] border-b border-slate-200/80 dark:border-white/10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white font-display">
              Crea tu primera Trivia
            </h2>
            <p className="text-sm text-slate-600 dark:text-zinc-400 max-w-2xl mx-auto">
              Nuestra app para crear preguntas y respuestas es una herramienta online y gratuita, disponible en todos nuestros planes de suscripción.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Card 1: Conocimiento */}
            <div className="p-7 rounded-3xl bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 space-y-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-pink-100 dark:bg-pink-950/60 text-pink-600 dark:text-pink-400 flex items-center justify-center">
                <HelpCircle className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                ¿Cuánto saben tus clientes sobre tu marca?
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
                Tanto las preguntas de opción múltiple como las de opciones opuestas son útiles para evaluar el conocimiento que tiene tu audiencia sobre tu negocio, tus productos o servicios o alguna temática en particular.
              </p>
              <button
                type="button"
                onClick={() => loadPreset(PRESET_TOPICS[2])}
                className="btn-pro-primary px-5 py-2.5 rounded-full text-xs font-bold inline-flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Ver Demo en Vivo</span>
              </button>
            </div>

            {/* Card 2: Cuestionario / Encuesta */}
            <div className="p-7 rounded-3xl bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 space-y-4 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                ¡Pídeles opinión y mejora tu oferta!
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
                Saber qué quieren y necesitan tus clientes es esencial para hacer crecer tu marca. Con un cuestionario, investiga qué prefieren y obtén ideas valiosas para armar una estrategia acertada y vender más.
              </p>
              <button
                type="button"
                onClick={() => loadPreset(PRESET_TOPICS[4])}
                className="btn-pro-primary px-5 py-2.5 rounded-full text-xs font-bold inline-flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Ver Cuestionario Demo</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ─── PRUEBA EN VIVO NUESTRAS TRIVIAS (5 PRESETS CAROUSEL) ────────── */}
      <section className="py-12 bg-slate-100/60 dark:bg-white/[0.02] border-b border-slate-200/80 dark:border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Prueba en vivo nuestras Trivias
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400">
              Selecciona cualquiera de las 5 trivias interactivas y pruébala de inmediato en el motor de juego:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
            {PRESET_TOPICS.map((p) => {
              const isSelected = activePresetId === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => loadPreset(p)}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between space-y-3 ${
                    isSelected
                      ? 'border-pink-500 bg-pink-50/80 dark:bg-pink-950/40 ring-2 ring-pink-500/20 shadow-md'
                      : 'border-slate-200 dark:border-white/10 bg-white dark:bg-[#0f172a] hover:border-pink-300 dark:hover:border-white/20'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl">{p.icon}</span>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-zinc-300">
                        {p.badge}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                      {p.name}
                    </h4>
                    <p className="text-[11px] text-slate-500 dark:text-zinc-400 line-clamp-2">
                      {p.subtitle}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-[11px] font-bold text-pink-600 dark:text-pink-400">
                    <span>{p.questions.length} preguntas</span>
                    <Play className="w-3 h-3" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── WORKSPACE / MAIN INTERACTIVE APPLICATION ───────────────────── */}
      <div ref={gameSectionRef} />
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

          {/* Quick preset trigger */}
          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={() => setShowExitIntentDemo(true)}
              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-pink-100 dark:bg-pink-950/60 text-pink-700 dark:text-pink-300 hover:bg-pink-200 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Probar Popup Web</span>
            </button>
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
                    const isSurvey = activePresetId === 'survey';

                    let btnClasses = 'border-slate-200 dark:border-white/10 bg-slate-50/70 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-800 dark:text-zinc-200';
                    if (isAnswered) {
                      if (isSurvey && isSelected) {
                        btnClasses = 'border-pink-500 bg-pink-50 dark:bg-pink-950/40 text-pink-800 dark:text-pink-200 font-bold ring-2 ring-pink-500/30';
                      } else if (isCorrect) {
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
                        {isAnswered && (isCorrect || isSurvey) && isSelected && (
                          <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                        )}
                        {isAnswered && isSelected && !isCorrect && !isSurvey && (
                          <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
                        )}
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
                  const finalScore = activePresetId === 'survey' ? questions.length : score;
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

                      {/* Reward Code */}
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
                            Válido para compras en la tienda oficial o para ingresar al sorteo del premio mayor.
                          </p>
                        </div>
                      ) : (
                        <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-xs text-slate-500 dark:text-zinc-400">
                          Necesitabas un mínimo de <strong>{approvalThreshold}%</strong> para desbloquear el cupón de descuento. ¡Puedes reintentar cuando quieras!
                        </div>
                      )}

                      {/* Formulario de registro de Lead con Anti-Fraude */}
                      {!leadRegistered ? (
                        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-left space-y-3">
                          <div className="flex items-center justify-between">
                            <h4 className="text-xs font-mono uppercase font-bold text-slate-500 dark:text-zinc-400">
                              Registra tus datos para participar en el sorteo:
                            </h4>
                            <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                              <ShieldCheck className="w-3 h-3" />
                              Anti-Fraude Activo
                            </span>
                          </div>

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
                              placeholder="Tu correo electrónico real"
                              value={leadEmail}
                              onChange={(e) => {
                                setLeadEmail(e.target.value);
                                if (emailError) setEmailError(null);
                              }}
                              className="px-3.5 py-2 text-xs rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-[#070a12] text-slate-900 dark:text-white"
                            />
                          </div>

                          {emailError && (
                            <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/40 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
                              <AlertCircle className="w-4 h-4 shrink-0" />
                              <span>{emailError}</span>
                            </div>
                          )}

                          <button
                            type="button"
                            onClick={handleRegisterLeadManual}
                            className="w-full py-2.5 rounded-xl btn-pro-primary text-xs font-bold cursor-pointer"
                          >
                            Guardar mi Participación
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-500/30 text-xs font-bold text-emerald-700 dark:text-emerald-300">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
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
                          <span>Volver a Jugar</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => transferApprovedToDraw('/herramientas/lista')}
                          className="btn-pro-primary px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold flex items-center gap-2 shadow-md shadow-pink-500/20 cursor-pointer"
                        >
                          <Trophy className="w-4 h-4" />
                          <span>Sortear en Lista de Nombres</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => transferApprovedToDraw('/herramientas/ruleta')}
                          className="px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 text-slate-800 dark:text-white flex items-center gap-2 cursor-pointer"
                        >
                          <span>Girar en Ruleta</span>
                        </button>
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
                    Ajusta las reglas, temporizador y código de cupón de tu quiz interactivo.
                  </p>
                </div>
              </div>

              {/* Form Config */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono font-bold text-slate-600 dark:text-zinc-300">
                    Título de la Trivia
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
                    Código de Descuento al Ganar
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
              <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-white/5">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Preguntas de la Trivia ({questions.length})
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-zinc-400">
                    Administra las preguntas o impórtalas masivamente desde un archivo CSV.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowCsvModal(true)}
                    className="px-4 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 text-xs font-bold flex items-center gap-2 text-slate-800 dark:text-zinc-200 cursor-pointer"
                  >
                    <UploadCloud className="w-3.5 h-3.5 text-pink-600" />
                    <span>Importar desde .CSV</span>
                  </button>
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
                  + Agregar Nueva Pregunta Manual
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
                  Base de datos de participantes sincronizada en tiempo real y protegida con validación Anti-Fraude.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={exportLeadsCSV}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 text-xs font-bold flex items-center gap-2 text-slate-800 dark:text-zinc-200 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-pink-600 dark:text-pink-400" />
                  <span>Exportar .CSV</span>
                </button>

                <button
                  type="button"
                  onClick={() => transferApprovedToDraw('/herramientas/lista')}
                  className="btn-pro-primary px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer"
                >
                  <Trophy className="w-3.5 h-3.5" />
                  <span>Sortear Aprobados en Lista</span>
                </button>

                <button
                  type="button"
                  onClick={() => transferApprovedToDraw('/herramientas/ruleta')}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 text-xs font-bold flex items-center gap-2 text-slate-800 dark:text-white cursor-pointer"
                >
                  <span>Girar Ruleta</span>
                </button>
              </div>
            </div>

            {/* Leads Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-white/10 text-slate-400 dark:text-zinc-500 font-mono uppercase">
                    <th className="py-3 px-4">Participante</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Aciertos</th>
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
                  Enlace Directo para Redes Sociales & Bio
                </h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-zinc-400">
                Comparte este link en tu biografía de Instagram, TikTok, historias o campañas de email marketing.
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

              {/* QR Preview */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center gap-4">
                <div className="w-16 h-16 rounded-xl bg-white p-1 shadow-xs flex items-center justify-center shrink-0">
                  <QrCode className="w-12 h-12 text-slate-900" />
                </div>
                <div className="text-xs space-y-1">
                  <div className="font-bold text-slate-900 dark:text-white">Código QR para Stands y Tienda Física</div>
                  <div className="text-slate-500 dark:text-zinc-400">Tus clientes escanean con su teléfono y juegan al instante.</div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-[#0f172a] rounded-3xl border border-slate-200 dark:border-white/10 p-6 sm:p-8 shadow-xl space-y-4">
              <div className="flex items-center gap-2.5">
                <Code2 className="w-5 h-5 text-pink-600 dark:text-purple-400" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Widget Iframe para tu Sitio Web o E-Commerce
                </h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-zinc-400">
                Inserta este código en Shopify, WordPress, WooCommerce, Squarespace o Wix para embeber la trivia.
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

      {/* ─── E-COMMERCE PLATFORMS COMPATIBILITY ─────────────────────────── */}
      <section className="py-12 bg-white dark:bg-[#0c101d] border-y border-slate-200/80 dark:border-white/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-center">
          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              Añade una Trivia en tu sitio web o e-commerce
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 max-w-2xl mx-auto">
              Impulsa tus ventas con una trivia que capta los datos de tus visitantes y les ofrece descuentos irresistibles antes de que abandonen tu tienda.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
            {['Shopify', 'WooCommerce', 'WordPress', 'Squarespace', 'Magento', 'BigCommerce', 'Wix'].map((platform) => (
              <div
                key={platform}
                className="px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 font-bold text-xs sm:text-sm text-slate-700 dark:text-zinc-300 shadow-xs flex items-center gap-2"
              >
                <ShoppingBag className="w-4 h-4 text-pink-600 dark:text-purple-400" />
                <span>{platform}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CASOS DE USO MÁS COMUNES (3 MODELOS DE APPSORTEOS) ─────────── */}
      <section className="py-16 bg-slate-100/60 dark:bg-white/[0.02]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-display">
              Casos de uso más comunes
            </h2>
            <p className="text-slate-600 dark:text-zinc-400 max-w-2xl mx-auto text-base">
              Nuestra Trivia Online te ayudará a atraer visitantes a tu stand y a capturar leads y potenciales clientes.
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
                Inserta la Trivia en tu sitio web y otorga descuentos y premios para incentivar las ventas y recuperar carritos abandonados.
              </p>
              <ul className="space-y-1.5 text-xs text-slate-600 dark:text-zinc-300 font-medium">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Incrementa tus ventas</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Popup al intentar salir</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Exporta datos en .CSV</span>
                </li>
              </ul>
              <button
                type="button"
                onClick={() => setShowExitIntentDemo(true)}
                className="w-full mt-2 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 text-xs font-bold text-slate-800 dark:text-white cursor-pointer"
              >
                Ver Demo Popup
              </button>
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
                ¿Quieres que tus clientes jueguen en tu tienda física o evento? Con un código QR impreso podrán escanear con su móvil y participar por premios.
              </p>
              <ul className="space-y-1.5 text-xs text-slate-600 dark:text-zinc-300 font-medium">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Atrae clientes a tu local físico</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Fomenta compras con descuentos</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Experiencia interactiva memorable</span>
                </li>
              </ul>
              <button
                type="button"
                onClick={() => setActiveTab('embed')}
                className="w-full mt-2 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 text-xs font-bold text-slate-800 dark:text-white cursor-pointer"
              >
                Ver Código QR
              </button>
            </div>

            {/* Caso 3: Promoción Online Redes */}
            <div className="p-7 rounded-3xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 shadow-lg space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-teal-100 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center shadow-xs">
                <Smartphone className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Promoción Online & Bio Link
              </h3>
              <p className="text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
                Captura leads compartiendo el link de tu Trivia Online en redes sociales, historias de Instagram, TikTok o por correo electrónico.
              </p>
              <ul className="space-y-1.5 text-xs text-slate-600 dark:text-zinc-300 font-medium">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Porcentaje de aprobación editable</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Incrementa presencia y tráfico</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Base de datos propia cualificada</span>
                </li>
              </ul>
              <button
                type="button"
                onClick={() => copyToClipboard(shareUrl, 'link')}
                className="w-full mt-2 py-2.5 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 hover:bg-slate-100 text-xs font-bold text-slate-800 dark:text-white cursor-pointer"
              >
                Copiar Enlace
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CÓMO FUNCIONA (5 PASOS DE APPSORTEOS) ───────────────────────── */}
      <section className="py-16 bg-white dark:bg-[#0c101d] border-y border-slate-200/80 dark:border-white/10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-display">
              ¿Cómo funciona?: 5 sencillos pasos para crear tu Trivia Online
            </h2>
            <p className="text-slate-600 dark:text-zinc-400 text-base">
              Configura y lanza tu promoción interactiva en menos de 5 minutos:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {[
              { num: '1', title: 'Escoge el tipo de Quiz', desc: 'Preguntas de opción múltiple, Sí/No o Cuestionarios sin respuesta correcta.' },
              { num: '2', title: 'Crea las preguntas', desc: 'Escribe alternativas y marca la correcta o impórtalas con archivo .CSV.' },
              { num: '3', title: 'Configura las reglas', desc: 'Personaliza colores, logo, tiempo de respuesta y porcentaje de aprobación.' },
              { num: '4', title: 'Guarda y comparte', desc: 'Envía un link, incrústala en tu tienda web o comparte un código QR.' },
              { num: '5', title: 'Exporta y sortea', desc: 'Descarga participantes en CSV y pasa a los aprobados al sorteo oficial SHA-256.' },
            ].map((st) => (
              <div 
                key={st.num}
                className="p-5 rounded-2xl bg-slate-50 dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 shadow-sm space-y-2 text-center"
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

          <div className="text-center pt-2">
            <button
              onClick={() => setShowHowItWorksModal(true)}
              className="btn-pro-primary px-7 py-3 rounded-full text-xs sm:text-sm font-bold inline-flex items-center gap-2 cursor-pointer shadow-md shadow-pink-500/20"
            >
              <Play className="w-4 h-4" />
              <span>Ver Guía Visual &quot;Cómo Funciona&quot;</span>
            </button>
          </div>
        </div>
      </section>

      {/* ─── FUNCIONALIDADES PRINCIPALES (GRID 6 DE APPSORTEOS) ─────────── */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white font-display">
              Funcionalidades Principales
            </h2>
            <p className="text-slate-600 dark:text-zinc-400 text-base">
              Descubre todo lo que puedes hacer con nuestra Trivia Online
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { 
                icon: Gift, 
                title: 'Elige el tipo de trivia y configúrala', 
                desc: 'Escoge entre opción múltiple, Sí/No o Cuestionario sin respuesta correcta, y establece el tiempo y umbral de aprobación.' 
              },
              { 
                icon: Palette, 
                title: 'Personaliza el diseño', 
                desc: 'Elige el color de tu marca, introduce tu logo y personaliza cada pantalla de la trivia a tu identidad visual.' 
              },
              { 
                icon: Download, 
                title: 'Captura y exporta los participantes .CSV', 
                desc: 'Exporta en 1 clic un archivo .CSV con nombres, correos, puntajes y marcas temporales para sincronizar con tu CRM.' 
              },
              { 
                icon: Code2, 
                title: 'Inserta la trivia en tu sitio', 
                desc: 'Inserta fácilmente la trivia en Shopify, WooCommerce o WordPress copiando y pegando un fragmento de código iframe.' 
              },
              { 
                icon: BarChart3, 
                title: 'Análisis de datos en tiempo real', 
                desc: 'Observa las estadísticas, el número de participantes, aciertos promedio y cupones entregados en tiempo real.' 
              },
              { 
                icon: ShieldCheck, 
                title: 'Sistema Anti-Fraude', 
                desc: 'Evita que direcciones de correo electrónico falsas o inválidas se unan a tu lista, garantizando la máxima calidad de leads.' 
              },
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

      {/* ─── DEEP DIVE SECTIONS (DETALLES EXPLICATIVOS DE APPSORTEOS) ────── */}
      <section className="py-16 bg-slate-100/60 dark:bg-white/[0.02] border-t border-slate-200/80 dark:border-white/10 space-y-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          {/* Deep dive 1 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <span className="text-xs font-mono font-bold uppercase text-pink-600 dark:text-pink-400">
                Velocidad & Conversión
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                Diseña trivias para tu sitio web en menos de 10 minutos
              </h3>
              <p className="text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
                Ten tu trivia funcionando en tu sitio web en tiempo récord. Ahorra tiempo y permite a tus clientes participar de una promoción divertida, que aumentará el tiempo de sesión y hará que vuelvan una y otra vez.
              </p>
            </div>
            <div className="p-6 rounded-3xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 shadow-lg space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-white/5">
                <Store className="w-4 h-4 text-pink-600" />
                <span>Simulación de Widget en Tienda Online</span>
              </div>
              <div className="p-4 rounded-2xl bg-pink-50 dark:bg-pink-950/30 border border-pink-500/20 text-xs space-y-2">
                <div className="font-bold text-pink-900 dark:text-pink-200">¡Espera! Responde 3 preguntas y llévate 25% OFF</div>
                <div className="text-slate-500 dark:text-zinc-400">Configurado para activarse cuando el visitante mueve el cursor hacia la barra de navegación para cerrar la pestaña.</div>
              </div>
            </div>
          </div>

          {/* Deep dive 2 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="p-6 rounded-3xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 shadow-lg space-y-3 order-2 md:order-1">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900 dark:text-white pb-2 border-b border-slate-100 dark:border-white/5">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>Filtro Anti-Fraude de Leads</span>
              </div>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-200">
                  <span>correo.real@gmail.com</span>
                  <span className="font-bold">Aprobado ✓</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-xl bg-rose-50 dark:bg-rose-950/30 text-rose-800 dark:text-rose-200">
                  <span>bot123@tempmail.com</span>
                  <span className="font-bold">Bloqueado ✕</span>
                </div>
              </div>
            </div>
            <div className="space-y-4 order-1 md:order-2">
              <span className="text-xs font-mono font-bold uppercase text-purple-600 dark:text-purple-400">
                Calidad de Datos
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                Crea listas de emails con los usuarios que participan
              </h3>
              <p className="text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
                La forma más fácil y entretenida de que los usuarios te brinden sus datos es utilizando nuestra trivia embebida. Es un ganar-ganar: ellos juegan por un premio o cupón y tú recopilas sus datos para todas tus campañas de marketing.
              </p>
            </div>
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
              a: 'Sorteos Pro te ofrece un número ilimitado de trivias y cuestionarios para generar sin costo alguno.'
            },
            {
              q: '¿Cómo recojo los emails de los participantes?',
              a: 'Al responder las preguntas o ver el resultado, el formulario interactivo solicita nombre y correo electrónico con validación Anti-Fraude. Todos los registros se guardan en la base de datos descargable en CSV.'
            },
            {
              q: '¿Se puede incrustar en cualquier sitio web?',
              a: '¡Sí! Puedes incrustar la trivia copiando y pegando el código iframe universal en cualquier plataforma: Shopify, WooCommerce, WordPress, Squarespace, Magento o Wix.'
            },
            {
              q: '¿Cómo conecto los aprobados con un sorteo oficial?',
              a: 'En la pestaña "Base de Datos", simplemente haz clic en "Sortear Aprobados en Lista" o "Girar Ruleta". El sistema transfiere los nombres de inmediato y genera un Certificado Criptográfico SHA-256.'
            },
            {
              q: '¿Puedo importar mis propias preguntas desde Excel o CSV?',
              a: 'Sí. En la pestaña "Creador & Editor" haz clic en "Importar desde .CSV". Puedes subir tu archivo o pegar el texto directamente con formato: Pregunta,Opción A,Opción B,Opción C,ÍndiceCorrecto.'
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

      {/* ─── MODAL 1: CSV QUESTION IMPORTER ─────────────────────────────── */}
      {showCsvModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0f172a] rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 border border-slate-200 dark:border-white/10 shadow-2xl relative">
            <button
              onClick={() => setShowCsvModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Importar Preguntas desde .CSV
              </h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400">
                Sube tu archivo .CSV o pega las líneas directamente a continuación:
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-[11px] font-mono text-slate-600 dark:text-zinc-300">
              Formato: Pregunta,Opción 1,Opción 2,Opción 3,Opción 4,ÍndiceCorrecto(0-3)
            </div>

            <textarea
              rows={5}
              placeholder={`¿Cuál es la capital de Italia?,Roma,Milán,Nápoles,0\n¿Cuántos días tiene un año bisiesto?,364,365,366,2`}
              value={csvRawText}
              onChange={(e) => setCsvRawText(e.target.value)}
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-[#070a12] text-xs font-mono text-slate-900 dark:text-white"
            />

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div>
                <input
                  type="file"
                  ref={csvFileInputRef}
                  accept=".csv,.txt"
                  onChange={handleCsvFileUpload}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => csvFileInputRef.current?.click()}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-white/10 text-xs font-bold text-slate-700 dark:text-zinc-300 hover:bg-slate-50 cursor-pointer"
                >
                  Subir Archivo .CSV
                </button>
              </div>

              <button
                type="button"
                onClick={() => handleProcessCsv(csvRawText)}
                className="btn-pro-primary px-5 py-2 rounded-xl text-xs font-bold cursor-pointer"
              >
                Procesar e Importar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── MODAL 2: MIRA CÓMO FUNCIONA TOUR ───────────────────────────── */}
      {showHowItWorksModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0f172a] rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 border border-slate-200 dark:border-white/10 shadow-2xl relative">
            <button
              onClick={() => setShowHowItWorksModal(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className="text-[10px] font-mono font-bold uppercase text-pink-600 dark:text-pink-400">
                Guía Paso a Paso
              </span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Cómo Funciona el Generador de Trivias
              </h3>
            </div>

            <div className="space-y-3.5 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-1">
                <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-pink-100 dark:bg-pink-950 text-pink-600 text-center font-mono">1</span>
                  <span>Crea o importa tus preguntas</span>
                </div>
                <p className="text-slate-500 dark:text-zinc-400 pl-7">
                  Puedes escribir preguntas y opciones múltiples personalizadas o elegir entre los 5 temas interactivos precargados.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-1">
                <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-pink-100 dark:bg-pink-950 text-pink-600 text-center font-mono">2</span>
                  <span>Configura el cupón y umbral de aprobación</span>
                </div>
                <p className="text-slate-500 dark:text-zinc-400 pl-7">
                  Establece un código de descuento (ej: TRIVIA25OFF) para incentivar a quienes superen el 75% de respuestas correctas.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-1">
                <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-pink-100 dark:bg-pink-950 text-pink-600 text-center font-mono">3</span>
                  <span>Comparte e incrusta</span>
                </div>
                <p className="text-slate-500 dark:text-zinc-400 pl-7">
                  Usa el iframe universal en Shopify, genera códigos QR para eventos o comparte en historias de Instagram.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-1">
                <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-pink-100 dark:bg-pink-950 text-pink-600 text-center font-mono">4</span>
                  <span>Sortea automáticamente entre los aprobados</span>
                </div>
                <p className="text-slate-500 dark:text-zinc-400 pl-7">
                  Los participantes con aciertos válidos se pasan directamente a la Ruleta o Bombo de Nombres con Certificado SHA-256.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setShowHowItWorksModal(false);
                setActiveTab('play');
              }}
              className="w-full py-3 rounded-full btn-pro-primary text-xs font-bold cursor-pointer"
            >
              ¡Comenzar ahora!
            </button>
          </div>
        </div>
      )}

      {/* ─── MODAL 3: EXIT-INTENT SIMULATOR POPUP ────────────────────────── */}
      {showExitIntentDemo && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0f172a] rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-5 border border-pink-500/40 shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setShowExitIntentDemo(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-2">
              <span className="text-[10px] font-mono font-bold uppercase px-3 py-1 rounded-full bg-pink-100 dark:bg-pink-950 text-pink-600 dark:text-pink-300">
                ¡Espera un momento antes de irte!
              </span>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                ¿Cuánto sabes sobre nuestra marca?
              </h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400">
                Responde 3 preguntas rápidas y desbloquea un cupón exclusivo de <strong>25% de descuento</strong> en tu compra de hoy.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 space-y-3">
              <div className="text-xs font-bold text-slate-800 dark:text-white">
                Pregunta rápida: ¿Cuál es nuestra garantía oficial?
              </div>
              <div className="space-y-1.5 text-xs">
                {['Sin garantía', 'Garantía 100% de Satisfacción o Devolución', 'Solo 3 días'].map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      alert('¡Respuesta correcta! Tu cupón es: TRIVIA25OFF');
                      setShowExitIntentDemo(false);
                    }}
                    className="w-full text-left p-2.5 rounded-xl border border-slate-200 dark:border-white/10 hover:border-pink-500 hover:bg-pink-50 dark:hover:bg-pink-950/30 text-slate-700 dark:text-zinc-300 font-medium transition-all"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <div className="text-center text-[10px] text-slate-400">
              Así se muestra el popup en tiempo real en tu tienda Shopify o WooCommerce.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
