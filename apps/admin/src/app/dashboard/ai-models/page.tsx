"use client";

import { useState } from "react";
import {
  BrainCircuit, ExternalLink, Zap, Code2, Smartphone,
  Globe, CheckCircle2, Clock, XCircle, ChevronDown, ChevronUp,
  Bot, Cpu, Database, FlaskConical
} from "lucide-react";

type ModelStatus = "Activo" | "Standby" | "Inactivo";

type AIModel = {
  name: string;
  provider: string;
  status: ModelStatus;
  usage: number;        // percentage 0-100
  description: string;
  usedIn: string[];     // project names where it's used
  docs: string;
  color: "blue" | "emerald" | "purple" | "amber" | "rose" | "cyan";
  icon: React.ReactNode;
  capabilities: string[];
};

const COLOR_MAP = {
  blue:    { bg: "bg-blue-500/10",    text: "text-blue-400",    border: "border-blue-500/20",    bar: "bg-blue-500",    glow: "bg-blue-500" },
  emerald: { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20", bar: "bg-emerald-500", glow: "bg-emerald-500" },
  purple:  { bg: "bg-purple-500/10",  text: "text-purple-400",  border: "border-purple-500/20",  bar: "bg-purple-500",  glow: "bg-purple-500" },
  amber:   { bg: "bg-amber-500/10",   text: "text-amber-400",   border: "border-amber-500/20",   bar: "bg-amber-500",   glow: "bg-amber-500" },
  rose:    { bg: "bg-rose-500/10",    text: "text-rose-400",    border: "border-rose-500/20",    bar: "bg-rose-500",    glow: "bg-rose-500" },
  cyan:    { bg: "bg-cyan-500/10",    text: "text-cyan-400",    border: "border-cyan-500/20",    bar: "bg-cyan-500",    glow: "bg-cyan-500" },
};

const MODELS: AIModel[] = [
  {
    name: "TensorFlow Lite",
    provider: "Google",
    status: "Activo",
    usage: 85,
    description: "Motor principal de inferencia on-device para detección de enfermedades en cultivos de papa. Corre 100% en el dispositivo Android sin necesidad de conexión a internet.",
    usedIn: ["Papa Scan"],
    docs: "https://www.tensorflow.org/lite",
    color: "amber",
    icon: <Cpu size={22} />,
    capabilities: ["Clasificación de imágenes", "On-device inference", "Modelo .tflite", "Sin latencia de red"],
  },
  {
    name: "MediaPipe",
    provider: "Google",
    status: "Activo",
    usage: 70,
    description: "Framework de ML para procesamiento en tiempo real de gestos y visión computacional directamente en el dispositivo móvil.",
    usedIn: ["Papa Scan", "ChannelsTV"],
    docs: "https://mediapipe.dev",
    color: "blue",
    icon: <FlaskConical size={22} />,
    capabilities: ["Detección de objetos", "Landmarks", "Tiempo real", "Android/iOS"],
  },
  {
    name: "Meta AI (Llama)",
    provider: "Meta",
    status: "Activo",
    usage: 90,
    description: "Motor de generación de guiones para el pipeline de contenido Almaniq. Genera textos optimizados para TikTok, Facebook y YouTube desde tendencias curadas.",
    usedIn: ["Almaniq Content Pipeline"],
    docs: "https://ai.meta.com",
    color: "purple",
    icon: <Bot size={22} />,
    capabilities: ["Generación de texto", "Scripts para video", "Multiplatforma", "Automatización"],
  },
  {
    name: "Google Gemini API",
    provider: "Google DeepMind",
    status: "Activo",
    usage: 65,
    description: "Utilizado para análisis de código, generación de documentación y como asistente de desarrollo en proyectos Next.js y Android.",
    usedIn: ["Almaniq Content Pipeline", "ATP DEV Portal"],
    docs: "https://ai.google.dev",
    color: "emerald",
    icon: <BrainCircuit size={22} />,
    capabilities: ["Chat contextual", "Análisis de código", "Documentación", "Razonamiento"],
  },
  {
    name: "Supabase pgvector",
    provider: "Supabase / PostgreSQL",
    status: "Standby",
    usage: 20,
    description: "Extensión de búsqueda vectorial para futuros casos de uso RAG (Retrieval-Augmented Generation) sobre la base de datos de proyectos.",
    usedIn: ["En desarrollo"],
    docs: "https://supabase.com/docs/guides/ai",
    color: "cyan",
    icon: <Database size={22} />,
    capabilities: ["Búsqueda semántica", "Embeddings", "RAG", "SQL + Vector"],
  },
  {
    name: "OpenAI Whisper",
    provider: "OpenAI",
    status: "Inactivo",
    usage: 0,
    description: "Evaluado para transcripción automática de videos de YouTube Shorts generados por Almaniq. En pausa hasta integrar el pipeline de subtítulos.",
    usedIn: ["Pendiente"],
    docs: "https://openai.com/research/whisper",
    color: "rose",
    icon: <Zap size={22} />,
    capabilities: ["Speech-to-text", "Múltiples idiomas", "Subtítulos automáticos", "API REST"],
  },
];

const PROJECT_ICONS: Record<string, React.ReactNode> = {
  "Papa Scan":                <Smartphone size={12} />,
  "ChannelsTV":               <Globe size={12} />,
  "Almaniq Content Pipeline": <Bot size={12} />,
  "ATP DEV Portal":           <Code2 size={12} />,
  "En desarrollo":            <Clock size={12} />,
  "Pendiente":                <Clock size={12} />,
};

function StatusBadge({ status }: { status: ModelStatus }) {
  const map = {
    "Activo":   { cls: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20", dot: "bg-emerald-400", icon: <CheckCircle2 size={10} /> },
    "Standby":  { cls: "bg-amber-500/10 text-amber-400 border-amber-500/20",       dot: "bg-amber-400",   icon: <Clock size={10} /> },
    "Inactivo": { cls: "bg-gray-500/10 text-gray-500 border-gray-500/20",           dot: "bg-gray-500",    icon: <XCircle size={10} /> },
  };
  const s = map[status];
  return (
    <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full border ${s.cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot} ${status === "Activo" ? "animate-pulse" : ""}`} />
      {status}
    </span>
  );
}

export default function AIModelsPage() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<ModelStatus | "Todos">("Todos");

  const activeCount  = MODELS.filter(m => m.status === "Activo").length;
  const standbyCount = MODELS.filter(m => m.status === "Standby").length;
  const avgUsage     = Math.round(MODELS.filter(m => m.status === "Activo").reduce((s, m) => s + m.usage, 0) / activeCount);

  const filtered = filterStatus === "Todos" ? MODELS : MODELS.filter(m => m.status === filterStatus);

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white mb-2 flex items-center gap-3">
            <BrainCircuit className="text-purple-500" size={30} /> AI Models
          </h1>
          <p className="text-gray-400">Modelos e integraciones de IA activas en tu ecosistema de proyectos.</p>
        </div>

        {/* Filter */}
        <div className="flex gap-2">
          {(["Todos", "Activo", "Standby", "Inactivo"] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilterStatus(f)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                filterStatus === f
                  ? "bg-blue-600 text-white"
                  : "bg-\[\#262626\] border border-gray-800 text-gray-400 hover:text-white"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: "Modelos Activos",  value: `${activeCount} / ${MODELS.length}`, color: "text-emerald-400", bg: "bg-emerald-500/10" },
          { label: "En Standby",       value: standbyCount,                          color: "text-amber-400",   bg: "bg-amber-500/10"   },
          { label: "Uso Promedio",     value: `${avgUsage}%`,                        color: "text-blue-400",    bg: "bg-blue-500/10"    },
        ].map((s, i) => (
          <div key={i} className="bg-\[\#262626\] border border-gray-800 rounded-2xl p-4 text-center">
            <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-500 mt-1 font-medium">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Models Grid */}
      <div className="space-y-4">
        {filtered.map((model) => {
          const c   = COLOR_MAP[model.color];
          const isOpen = expanded === model.name;

          return (
            <div
              key={model.name}
              className="bg-\[\#262626\] border border-gray-800 rounded-2xl overflow-hidden hover:border-gray-600 transition-all group"
            >
              {/* Main row */}
              <div
                className="flex items-center gap-4 p-5 cursor-pointer"
                onClick={() => setExpanded(isOpen ? null : model.name)}
              >
                {/* Icon */}
                <div className={`p-2.5 rounded-xl shrink-0 ${c.bg} border ${c.border} ${c.text}`}>
                  {model.icon}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-bold text-white text-sm">{model.name}</h3>
                    <StatusBadge status={model.status} />
                  </div>
                  <p className="text-xs text-gray-500">{model.provider}</p>
                </div>

                {/* Usage bar */}
                <div className="hidden sm:block w-32 shrink-0">
                  <div className="flex justify-between mb-1">
                    <span className="text-[10px] text-gray-500 font-medium">Uso</span>
                    <span className={`text-[10px] font-bold ${c.text}`}>{model.usage}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                    <div className={`h-full ${c.bar} rounded-full`} style={{ width: `${model.usage}%` }} />
                  </div>
                </div>

                {/* Projects used in */}
                <div className="hidden md:flex gap-1.5 shrink-0 flex-wrap max-w-[180px]">
                  {model.usedIn.map(p => (
                    <span key={p} className="inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-md bg-gray-800 border border-gray-700 text-gray-400">
                      {PROJECT_ICONS[p]} {p}
                    </span>
                  ))}
                </div>

                {/* Expand toggle */}
                <div className={`shrink-0 ${c.text} transition-transform ${isOpen ? "rotate-180" : ""}`}>
                  <ChevronDown size={18} />
                </div>
              </div>

              {/* Expanded detail */}
              {isOpen && (
                <div className={`border-t border-gray-800 bg-\[\#1A1A1A\] p-5`}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Descripción</h4>
                      <p className="text-sm text-gray-300 leading-relaxed">{model.description}</p>

                      <div className="mt-4">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Capacidades</h4>
                        <div className="flex flex-wrap gap-1.5">
                          {model.capabilities.map(cap => (
                            <span key={cap} className={`text-[11px] font-medium px-2.5 py-1 rounded-lg ${c.bg} ${c.text} border ${c.border}`}>
                              {cap}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Integrado en</h4>
                      <div className="space-y-2">
                        {model.usedIn.map(p => (
                          <div key={p} className="flex items-center gap-2 text-sm text-gray-300">
                            <span className={`${c.text}`}>{PROJECT_ICONS[p]}</span> {p}
                          </div>
                        ))}
                      </div>

                      <a
                        href={model.docs}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`mt-5 inline-flex items-center gap-2 text-xs font-bold ${c.text} hover:underline`}
                      >
                        Ver documentación oficial <ExternalLink size={12} />
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
