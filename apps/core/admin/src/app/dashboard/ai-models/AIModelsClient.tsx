"use client";

import { useState } from "react";
import {
  BrainCircuit, ExternalLink, Zap, Code2, Smartphone,
  Globe, CheckCircle2, Clock, XCircle, ChevronDown, ChevronUp,
  Bot, Cpu, Database, FlaskConical, Plus, Eye, EyeOff, Pencil, Trash2,
  Code, Terminal, Cloud, Layout, Image as ImageIcon, Video, Music,
  MessageSquare, Sparkles, FileText, Settings, Shield, Server, Layers,
  Monitor, PenTool, GitBranch, Fingerprint, Lock,
  HardDrive, Network, Workflow, Box, Cuboid, Radio
} from "lucide-react";

import { AIModelData, ModelStatus } from "@atpdev/database";
import { createModelAction, updateModelAction, deleteModelAction, toggleVisibilityAction, reorderAIModelsAction } from "./actions";

type AIModel = AIModelData & {
  status: ModelStatus;
  usage: number;
  usedIn: string[];
  icon: React.ReactNode;
};

const COLOR_MAP: Record<string, { bg: string, text: string, border: string, bar: string, glow: string }> = {
  blue:    { bg: "bg-blue-500/10",    text: "text-blue-400",    border: "border-blue-500/20",    bar: "bg-blue-500",    glow: "bg-blue-500" },
  emerald: { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20", bar: "bg-emerald-500", glow: "bg-emerald-500" },
  purple:  { bg: "bg-purple-500/10",  text: "text-purple-400",  border: "border-purple-500/20",  bar: "bg-purple-500",  glow: "bg-purple-500" },
  amber:   { bg: "bg-amber-500/10",   text: "text-amber-400",   border: "border-amber-500/20",   bar: "bg-amber-500",   glow: "bg-amber-500" },
  rose:    { bg: "bg-rose-500/10",    text: "text-rose-400",    border: "border-rose-500/20",    bar: "bg-rose-500",    glow: "bg-rose-500" },
  cyan:    { bg: "bg-cyan-500/10",    text: "text-cyan-400",    border: "border-cyan-500/20",    bar: "bg-cyan-500",    glow: "bg-cyan-500" },
};

const ICONS_MAP: Record<string, React.ReactNode> = {
  "BrainCircuit": <BrainCircuit size={22} />,
  "Cpu": <Cpu size={22} />,
  "FlaskConical": <FlaskConical size={22} />,
  "Bot": <Bot size={22} />,
  "Database": <Database size={22} />,
  "Zap": <Zap size={22} />,
  "Code": <Code size={22} />,
  "Terminal": <Terminal size={22} />,
  "Globe": <Globe size={22} />,
  "Cloud": <Cloud size={22} />,
  "Layout": <Layout size={22} />,
  "Image": <ImageIcon size={22} />,
  "Video": <Video size={22} />,
  "Music": <Music size={22} />,
  "MessageSquare": <MessageSquare size={22} />,
  "Sparkles": <Sparkles size={22} />,
  "FileText": <FileText size={22} />,
  "Settings": <Settings size={22} />,
  "Shield": <Shield size={22} />,
  "Server": <Server size={22} />,
  "Layers": <Layers size={22} />,
  "Smartphone": <Smartphone size={22} />,
  "Monitor": <Monitor size={22} />,
  "PenTool": <PenTool size={22} />,
  "GitBranch": <GitBranch size={22} />,
  "Fingerprint": <Fingerprint size={22} />,
  "Lock": <Lock size={22} />,
  "HardDrive": <HardDrive size={22} />,
  "Network": <Network size={22} />,
  "Workflow": <Workflow size={22} />,
  "Box": <Box size={22} />,
  "Cuboid": <Cuboid size={22} />,
  "Radio": <Radio size={22} />,
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

export default function AIModelsClient({ projects, initialAiModels }: { projects: any[], initialAiModels: AIModelData[] }) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<ModelStatus | "Todos">("Todos");
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [id, setId] = useState("");
  const [name, setName] = useState("");
  const [provider, setProvider] = useState("");
  const [description, setDescription] = useState("");
  const [docs, setDocs] = useState("");
  const [color, setColor] = useState("blue");
  const [iconName, setIconName] = useState("Cpu");
  const [capabilities, setCapabilities] = useState("");
  const [tags, setTags] = useState("");

  const handleOpenModal = (model?: AIModelData) => {
    if (model) {
      setEditingId(model.id);
      setId(model.id);
      setName(model.name);
      setProvider(model.provider);
      setDescription(model.description);
      setDocs(model.docs);
      setColor(model.color);
      setIconName(model.icon_name || "Cpu");
      setCapabilities(model.capabilities.join(", "));
      setTags(model.tags.join(", "));
    } else {
      setEditingId(null);
      setId("");
      setName("");
      setProvider("");
      setDescription("");
      setDocs("");
      setColor("blue");
      setIconName("Cpu");
      setCapabilities("");
      setTags("");
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const moveModel = async (id: string, direction: 'up' | 'down') => {
    const currentIndex = initialAiModels.findIndex(m => m.id === id);
    if (currentIndex === -1) return;
    if (direction === 'up' && currentIndex === 0) return;
    if (direction === 'down' && currentIndex === initialAiModels.length - 1) return;

    const newModels = [...initialAiModels];
    const swapIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    [newModels[currentIndex], newModels[swapIndex]] = [newModels[swapIndex], newModels[currentIndex]];

    const newOrderIds = newModels.map(m => m.id);
    await reorderAIModelsAction(newOrderIds);
  };

  const MODELS: AIModel[] = initialAiModels.map(model => {
    const usedInProjects = projects.filter(p => 
      p.status !== 'Privado' && 
      p.stack.some((t: string) => model.tags.includes(t.toLowerCase()))
    );
    
    const usedIn = usedInProjects.map(p => p.title);
    const status: ModelStatus = usedIn.length > 0 ? "Activo" : (model.id === "pgvector" ? "Standby" : "Inactivo");
    const usage = usedIn.length > 0 ? Math.min(100, 50 + (usedIn.length * 15)) : 0;
    
    return {
      ...model,
      usedIn,
      status,
      usage,
      icon: ICONS_MAP[model.icon_name || "Cpu"],
    };
  });

  const activeCount  = MODELS.filter(m => m.status === "Activo").length;
  const standbyCount = MODELS.filter(m => m.status === "Standby").length;
  const avgUsage     = activeCount > 0 ? Math.round(MODELS.filter(m => m.status === "Activo").reduce((s, m) => s + m.usage, 0) / activeCount) : 0;

  const filtered = filterStatus === "Todos" ? MODELS : MODELS.filter(m => m.status === filterStatus);

  return (
    <div>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white mb-2 flex items-center gap-3">
            <BrainCircuit className="text-purple-500" size={30} /> AI Models
          </h1>
          <p className="text-gray-400">Modelos e integraciones de IA activas en tu ecosistema de proyectos.</p>
        </div>

        <div className="flex flex-col items-end gap-4">
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl font-bold transition-all text-sm"
          >
            <Plus size={18} /> Nuevo Modelo
          </button>

          <div className="flex gap-2">
            {(["Todos", "Activo", "Standby", "Inactivo"] as const).map(f => (
              <button
                key={f}
                onClick={() => setFilterStatus(f)}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                  filterStatus === f
                    ? "bg-purple-600 text-white"
                    : "bg-[#262626] border border-gray-800 text-gray-400 hover:text-white"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: "Modelos Activos",  value: `${activeCount} / ${MODELS.length}`, color: "text-emerald-400", bg: "bg-emerald-500/10" },
          { label: "En Standby",       value: standbyCount,                          color: "text-amber-400",   bg: "bg-amber-500/10"   },
          { label: "Uso Promedio",     value: `${avgUsage}%`,                        color: "text-purple-400",    bg: "bg-purple-500/10"    },
        ].map((s, i) => (
          <div key={i} className="bg-[#262626] border border-gray-800 rounded-2xl p-4 text-center">
            <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-500 mt-1 font-medium">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        {filtered.map((model) => {
          const c   = COLOR_MAP[model.color] || COLOR_MAP.blue;
          const isOpen = expanded === model.name;

          return (
            <div
              key={model.name}
              className="bg-[#262626] border border-gray-800 rounded-2xl overflow-hidden hover:border-gray-600 transition-all group"
            >
              <div
                className="flex items-center gap-4 p-5 cursor-pointer"
                onClick={() => setExpanded(isOpen ? null : model.name)}
              >
                <div className={`p-2.5 rounded-xl shrink-0 ${c.bg} border ${c.border} ${c.text}`}>
                  {model.icon}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-bold text-white text-sm">{model.name}</h3>
                    <StatusBadge status={model.status} />
                    {!model.is_visible && (
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded border border-red-500/20 text-red-400 bg-red-500/10">OCULTO</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">{model.provider}</p>
                </div>

                <div className="hidden sm:block w-32 shrink-0">
                  <div className="flex justify-between mb-1">
                    <span className="text-[10px] text-gray-500 font-medium">Uso</span>
                    <span className={`text-[10px] font-bold ${c.text}`}>{model.usage}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-800 rounded-full overflow-hidden">
                    <div className={`h-full ${c.bar} rounded-full`} style={{ width: `${model.usage}%` }} />
                  </div>
                </div>

                <div className="hidden md:flex gap-1.5 shrink-0 flex-wrap max-w-[180px]">
                  {model.usedIn.map(p => (
                    <span key={p} className="inline-flex items-center gap-1 text-[9px] font-bold px-2 py-0.5 rounded-md bg-gray-800 border border-gray-700 text-gray-400">
                      <Code2 size={12} /> {p}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <button 
                    onClick={(e) => { e.stopPropagation(); toggleVisibilityAction(model.id, !model.is_visible); }}
                    className="p-1.5 text-gray-500 hover:text-white hover:bg-gray-700 rounded-md transition-all"
                    title={model.is_visible ? "Ocultar" : "Mostrar"}
                  >
                    {model.is_visible ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>
                  {filterStatus === "Todos" && (
                    <div className="flex flex-col mx-1">
                      <button
                        onClick={(e) => { e.stopPropagation(); moveModel(model.id, 'up'); }}
                        className="p-0.5 text-gray-500 hover:text-white transition-colors disabled:opacity-30 disabled:hover:text-gray-500"
                        disabled={initialAiModels.findIndex(m => m.id === model.id) === 0}
                      >
                        <ChevronUp size={14} />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); moveModel(model.id, 'down'); }}
                        className="p-0.5 text-gray-500 hover:text-white transition-colors disabled:opacity-30 disabled:hover:text-gray-500"
                        disabled={initialAiModels.findIndex(m => m.id === model.id) === initialAiModels.length - 1}
                      >
                        <ChevronDown size={14} />
                      </button>
                    </div>
                  )}
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleOpenModal(model); }}
                    className="p-1.5 text-gray-500 hover:text-purple-400 hover:bg-purple-500/10 rounded-md transition-all"
                  >
                    <Pencil size={16} />
                  </button>
                  <button 
                    onClick={(e) => { e.stopPropagation(); if(confirm("¿Eliminar este modelo?")) deleteModelAction(model.id); }}
                    className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-md transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                  <div className={`shrink-0 ${c.text} transition-transform ${isOpen ? "rotate-180" : ""}`}>
                    <ChevronDown size={18} />
                  </div>
                </div>
              </div>

              {isOpen && (
                <div className={`border-t border-gray-800 bg-[#1A1A1A] p-5`}>
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
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Tags de Auto-Detección</h4>
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {model.tags.map(tag => (
                          <span key={tag} className={`text-[11px] font-mono px-2 py-0.5 rounded bg-gray-800 text-gray-400 border border-gray-700`}>
                            {tag}
                          </span>
                        ))}
                      </div>
                      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Integrado en</h4>
                      <div className="space-y-2">
                        {model.usedIn.length > 0 ? model.usedIn.map(p => (
                          <div key={p} className="flex items-center gap-2 text-sm text-gray-300">
                            <span className={`${c.text}`}><Code2 size={12} /></span> {p}
                          </div>
                        )) : <p className="text-sm text-gray-600">Ningún proyecto público utiliza este modelo aún.</p>}
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

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-black text-white mb-6">
              {editingId ? "Editar Modelo" : "Nuevo Modelo de IA"}
            </h2>
            <form
              action={editingId ? updateModelAction.bind(null, editingId) : createModelAction}
              onSubmit={() => handleCloseModal()}
              className="space-y-4"
            >
              {!editingId && (
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1">ID Único (ej. chatgpt)</label>
                  <input type="text" name="id" required value={id} onChange={e => setId(e.target.value)} className="w-full bg-[#262626] border border-gray-700 rounded-lg p-2.5 text-white text-sm" />
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1">Nombre</label>
                  <input type="text" name="name" required value={name} onChange={e => setName(e.target.value)} className="w-full bg-[#262626] border border-gray-700 rounded-lg p-2.5 text-white text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1">Proveedor (Meta, Google, etc)</label>
                  <input type="text" name="provider" required value={provider} onChange={e => setProvider(e.target.value)} className="w-full bg-[#262626] border border-gray-700 rounded-lg p-2.5 text-white text-sm" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1">Descripción</label>
                <textarea name="description" required rows={3} value={description} onChange={e => setDescription(e.target.value)} className="w-full bg-[#262626] border border-gray-700 rounded-lg p-2.5 text-white text-sm resize-none"></textarea>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 mb-1">Documentación Oficial (URL)</label>
                <input type="url" name="docs" required value={docs} onChange={e => setDocs(e.target.value)} className="w-full bg-[#262626] border border-gray-700 rounded-lg p-2.5 text-white text-sm" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1">Capacidades (Separadas por coma)</label>
                  <input type="text" name="capabilities" required value={capabilities} onChange={e => setCapabilities(e.target.value)} className="w-full bg-[#262626] border border-gray-700 rounded-lg p-2.5 text-white text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-1">Tags para Auto-Detección (coma)</label>
                  <input type="text" name="tags" required value={tags} onChange={e => setTags(e.target.value)} className="w-full bg-[#262626] border border-gray-700 rounded-lg p-2.5 text-white text-sm" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-3">Color Tema</label>
                  <input type="hidden" name="color" value={color} />
                  <div className="flex flex-wrap gap-3">
                    {[
                      { id: "blue", label: "Azul" },
                      { id: "emerald", label: "Esmeralda" },
                      { id: "purple", label: "Púrpura" },
                      { id: "amber", label: "Ambar" },
                      { id: "rose", label: "Rosa" },
                      { id: "cyan", label: "Cyan" },
                    ].map(c => {
                      const colorStyles = COLOR_MAP[c.id] || COLOR_MAP.blue;
                      const isSelected = color === c.id;
                      return (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => setColor(c.id)}
                          className={`w-10 h-10 rounded-xl border flex items-center justify-center transition-all ${
                            isSelected ? `${colorStyles.border} ${colorStyles.bg} ring-2 ring-purple-500` : "border-gray-700 bg-[#262626] hover:bg-gray-700"
                          }`}
                          title={c.label}
                        >
                          <div className={`w-4 h-4 rounded-full ${colorStyles.glow}`} />
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-3">Icono (Lucide)</label>
                  <input type="hidden" name="icon_name" value={iconName} />
                  <div className="flex flex-wrap gap-2">
                    {Object.keys(ICONS_MAP).map(k => {
                      const isSelected = iconName === k;
                      return (
                        <button
                          key={k}
                          type="button"
                          onClick={() => setIconName(k)}
                          className={`p-2.5 rounded-xl border transition-all ${
                            isSelected 
                            ? "bg-purple-500/10 border-purple-500/30 text-purple-400 ring-1 ring-purple-500" 
                            : "border-gray-700 bg-[#262626] text-gray-400 hover:bg-gray-700 hover:text-white"
                          }`}
                          title={k}
                        >
                          {ICONS_MAP[k]}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-800">
                <button type="button" onClick={handleCloseModal} className="px-5 py-2.5 rounded-lg text-sm font-bold text-gray-400 hover:text-white transition-colors">
                  Cancelar
                </button>
                <button type="submit" className="px-5 py-2.5 rounded-lg text-sm font-bold bg-purple-600 hover:bg-purple-700 text-white transition-colors">
                  {editingId ? "Guardar Cambios" : "Crear Modelo"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
