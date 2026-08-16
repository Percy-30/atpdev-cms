"use client";

import { useState, useEffect, useRef } from "react";
import { FolderKanban, Plus, Trash2, Eye, EyeOff, Pencil, Loader2, Github, Lock, Globe, Search, Camera, ImageOff, Upload, ExternalLink, Palette } from "lucide-react";
import { Project, GithubRepoSummary } from "@atpdev/database";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { createProject, updateStatus, deleteProject, updateProjectAction, autofillProjectWithAI, getGithubRepos, captureScreenshot, uploadImageFile, suggestGradientColorsWithAI } from "./actions";

export default function ProjectsClient({ projects }: { projects: Project[] }) {
  const [editingId, setEditingId] = useState<number | null>(null);

  const editingProject = projects.find(p => p.id === editingId) || null;

  // Campos controlados para poder llenarlos con "Autocompletar desde GitHub"
  const [repoInput, setRepoInput] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [long_description, setLongDescription] = useState("");
  const [is_featured, setIsFeatured] = useState(false);
  const [stack, setStack] = useState("");
  const [category, setCategory] = useState("Android");
  const [slug, setSlug] = useState("");
  const [domainType, setDomainType] = useState<"subruta" | "subdominio" | "externa">("subruta");
  const [demolink, setDemolink] = useState("");
  const [playstore, setPlaystore] = useState("");
  const [appstore, setAppstore] = useState("");
  const [imagePreview, setImagePreview] = useState(""); // screenshot capturado, viaja en input oculto "image"
  
  // Estado para el editor de bloques (Pseudo-Block Editor)
  type UIBlock = { id: string; type: "h2" | "p" | "image"; content: string; alt?: string; url?: string; context?: string };
  const [blocks, setBlocks] = useState<UIBlock[]>([]);
  const [showPreview, setShowPreview] = useState(false);

  const [showGradientBuilderModal, setShowGradientBuilderModal] = useState(false);

  const [autofillState, setAutofillState] = useState<"idle" | "loading" | "error">("idle");
  const [autofillError, setAutofillError] = useState("");
  const [screenshotState, setScreenshotState] = useState<"idle" | "loading" | "error">("idle");
  const [screenshotError, setScreenshotError] = useState("");
  const [uploadState, setUploadState] = useState<"idle" | "loading" | "error">("idle");
  const [uploadError, setUploadError] = useState("");
  const [submitState, setSubmitState] = useState<"idle" | "loading" | "error">("idle");
  const [submitError, setSubmitError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  
  // Editor Markdown Enriquecido
  const inlineFileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [inlineUploadState, setInlineUploadState] = useState<"idle" | "loading" | "error">("idle");
  const [inlineUploadError, setInlineUploadError] = useState("");

  // Selector de repos tipo "Import Project" de Vercel
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerLoading, setPickerLoading] = useState(false);
  const [pickerError, setPickerError] = useState("");
  const [repos, setRepos] = useState<GithubRepoSummary[] | null>(null);
  const [repoSearch, setRepoSearch] = useState("");
  const pickerRef = useRef<HTMLDivElement>(null);

  // Sincroniza el formulario cuando empiezas a editar un proyecto existente
  useEffect(() => {
    setRepoInput(editingProject?.github_repo || "");
    setTitle(editingProject?.title || "");
    setDescription(editingProject?.description || "");
    setLongDescription(editingProject?.long_description || "");
    setIsFeatured(editingProject?.is_featured || false);
    setStack(editingProject?.stack.join(", ") || "");
    setCategory(editingProject?.category || "Android");
    setSlug(editingProject?.slug || "");
    
    const rawLongDesc = editingProject?.long_description || "";
    try {
      if (rawLongDesc.startsWith("[")) {
        setBlocks(JSON.parse(rawLongDesc).map((b: any, i: number) => ({ ...b, id: b.id || String(i) })));
      } else if (rawLongDesc) {
        setBlocks([{ id: "0", type: "p", content: rawLongDesc }]);
      } else {
        setBlocks([]);
      }
    } catch {
      setBlocks([{ id: "0", type: "p", content: rawLongDesc }]);
    }
    
    const demo = editingProject?.demolink && editingProject.demolink !== "#" ? editingProject.demolink : "";
    setDemolink(demo);
    setPlaystore(editingProject?.playstore || "");
    setAppstore((editingProject as any)?.appstore || "");
    setDomainType(!demo ? "subruta" : demo.includes("play.google.com") ? "externa" : "subdominio");
    
    setUploadState("idle");
    setImagePreview(editingProject?.image || "");
    setAutofillState("idle");
    setAutofillError("");
    setScreenshotState("idle");
    setScreenshotError("");
    setUploadState("idle");
    setUploadError("");
    setSubmitState("idle");
    setSubmitError("");
    setInlineUploadState("idle");
    setInlineUploadError("");
  }, [editingId]);

  // Cierra el dropdown si haces clic afuera
  useEffect(() => {
    if (!pickerOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        setPickerOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [pickerOpen]);

  // Escuchar mensajes del Iframe de Gradient Builder
  useEffect(() => {
    const handleMessage = async (e: MessageEvent) => {
      if (e.data?.type === 'GRADIENT_GENERATED' && e.data?.payload) {
        setImagePreview(e.data.payload);
        setShowGradientBuilderModal(false);
      }
      
      if (e.data?.type === 'REQUEST_AI_COLORS') {
        const result = await suggestGradientColorsWithAI(title, description);
        if (result && 'colors' in result && result.colors && iframeRef.current?.contentWindow) {
          iframeRef.current.contentWindow.postMessage({ type: 'APPLY_AI_COLORS', payload: result.colors }, '*');
        } else if (iframeRef.current?.contentWindow) {
          iframeRef.current.contentWindow.postMessage({ type: 'APPLY_AI_COLORS_ERROR' }, '*');
        }
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [title, description]);

  const openPicker = async () => {
    setPickerOpen(true);
    if (repos) return; // ya cargados, no volvemos a pedir la lista
    setPickerLoading(true);
    setPickerError("");
    const result = await getGithubRepos();
    setPickerLoading(false);
    if ("error" in result) {
      setPickerError(result.error);
      return;
    }
    setRepos(result.repos);
  };

  const runAutofill = async (repoFullName: string) => {
    setAutofillState("loading");
    setAutofillError("");
    const result = await autofillProjectWithAI(repoFullName, domainType);
    if ("error" in result) {
      setAutofillState("error");
      setAutofillError(result.error);
      return;
    }
    setTitle(result.data.title);
    setDescription(result.data.description);
    
    const rawDesc = result.data.long_description || "";
    try {
      if (rawDesc.startsWith("[")) {
        setBlocks(JSON.parse(rawDesc).map((b: any, i: number) => ({ ...b, id: b.id || String(i) })));
        setLongDescription(""); 
      } else {
        setBlocks([{ id: "0", type: "p", content: rawDesc }]);
      }
    } catch {
      setBlocks([{ id: "0", type: "p", content: rawDesc }]);
    }

    setStack(result.data.stack.join(", "));
    setCategory(result.data.category);
    setSlug(prev => prev || result.data.title.toLowerCase().replace(/\s+/g, "-"));
    setAutofillState("idle");
  };

  const handleSelectRepo = (repoFullName: string) => {
    setRepoInput(repoFullName);
    setPickerOpen(false);
    setRepoSearch("");
    runAutofill(repoFullName); // autocompleta apenas eliges, sin clic extra
  };

  const filteredRepos = (repos || []).filter(r =>
    r.full_name.toLowerCase().includes(repoSearch.toLowerCase())
  );

  const handleCaptureScreenshot = async () => {
    setScreenshotState("loading");
    setScreenshotError("");
    const result = await captureScreenshot(demolink);
    if ("error" in result) {
      setScreenshotState("error");
      setScreenshotError(result.error);
      return;
    }
    setImagePreview(result.imageUrl);
    setScreenshotState("idle");
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Previsualización instantánea en el cliente usando FileReader
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setImagePreview(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);

    setUploadState("loading");
    setUploadError("");
    const fd = new FormData();
    fd.set("file", file);
    const result = await uploadImageFile(fd);
    if ("error" in result) {
      setUploadState("error");
      setUploadError(result.error);
      e.target.value = "";
      return;
    }
    if ("imageUrl" in result && result.imageUrl) {
      setImagePreview(result.imageUrl);
    }
    setUploadState("idle");
    e.target.value = "";
  };

  const handleInlineImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setInlineUploadState("loading");
    setInlineUploadError("");
    
    const fd = new FormData();
    fd.set("file", file);
    const result = await uploadImageFile(fd);
    
    if ("error" in result) {
      setInlineUploadState("error");
      setInlineUploadError(result.error);
    } else if ("imageUrl" in result && result.imageUrl) {
      // Inyectar en el textarea
      const textarea = textareaRef.current;
      const markdownImage = `\n![Imagen insertada](${result.imageUrl})\n`;
      
      if (textarea) {
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const currentText = long_description;
        const newText = currentText.substring(0, start) + markdownImage + currentText.substring(end);
        setLongDescription(newText);
        
        // Volver a poner el foco y el cursor
        setTimeout(() => {
          textarea.focus();
          textarea.setSelectionRange(start + markdownImage.length, start + markdownImage.length);
        }, 10);
      } else {
        setLongDescription(prev => prev + markdownImage);
      }
      setInlineUploadState("idle");
    }
    e.target.value = "";
  };

  const compileBlocksToMarkdown = () => {
    return blocks.map(b => {
      if (b.type === "h2") return `## ${b.content}`;
      if (b.type === "p") return b.content;
      if (b.type === "image") {
        if (!b.url) return ""; // Avoid empty src attribute error in ReactMarkdown
        return `![${b.alt || "Imagen insertada"}](${b.url})`;
      }
      return b.content;
    }).filter(Boolean).join("\n\n");
  };

  const handleSubmit = async (formData: FormData) => {
    setSubmitState("loading");
    setSubmitError("");
    
    // Si es subruta, forzamos que demolink sea "#" internamente
    if (domainType === "subruta") {
      formData.set("demolink", "#");
    }
    // Convertir los bloques visuales a un solo string Markdown antes de guardar
    if (domainType !== "externa") {
      formData.set("long_description", compileBlocksToMarkdown());
    }

    let result;
    if (editingId) {
      result = await updateProjectAction(editingId, formData);
    } else {
      result = await createProject(formData);
    }

    if (result && "error" in result && result.error) {
      setSubmitState("error");
      setSubmitError(result.error);
    } else {
      setSubmitState("idle");
      if (!editingId) {
        setTitle(""); setDescription(""); setStack(""); setSlug(""); setRepoInput("");
        setCategory("Android"); setDemolink(""); setImagePreview(""); setLongDescription("");
      }
      setEditingId(null);
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
      {/* TABLA DE PROYECTOS */}
      <div className="xl:col-span-2 bg-\[\#262626\] border border-gray-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-\[\#1A1A1A\] border-b border-gray-800">
              <tr>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-widest">Proyecto</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-widest">Estado</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-widest">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {projects.length === 0 ? (
                <tr>
                  <td colSpan={3} className="p-8 text-center text-gray-500">
                    No hay proyectos. Añade uno.
                  </td>
                </tr>
              ) : (
                projects.map(proj => (
                  <tr key={proj.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {proj.image ? (
                          <img src={proj.image} className="w-10 h-10 rounded-lg object-cover" alt={proj.title} />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0">
                            <FolderKanban size={18} />
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-white text-sm">{proj.title}</p>
                          <p className="text-xs text-blue-400 font-semibold">{proj.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`text-xs font-bold px-2.5 py-1.5 rounded-lg border ${proj.status === 'Activo' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                          'bg-gray-500/10 text-gray-400 border-gray-500/20'
                        }`}>
                        {proj.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <form className="flex gap-2">
                        <input type="hidden" name="id" value={proj.id} />

                        <button
                          type="button"
                          onClick={() => {
                            setEditingId(proj.id);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="p-2 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 rounded-lg transition-colors"
                          title="Editar proyecto"
                        >
                          <Pencil size={16} />
                        </button>
                        
                        {proj.slug && (
                          <a
                            href={`https://www.atpdev.dev/apps/${proj.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-lg transition-colors inline-flex"
                            title="Ver página pública del proyecto"
                          >
                            <ExternalLink size={16} />
                          </a>
                        )}

                        {proj.status === 'Activo' ? (
                          <button
                            formAction={async () => { await updateStatus(proj.id, 'Privado'); }}
                            className="p-2 bg-gray-500/10 hover:bg-gray-500/20 text-gray-400 rounded-lg transition-colors"
                            title="Ocultar del portal"
                          >
                            <EyeOff size={16} />
                          </button>
                        ) : (
                          <button
                            formAction={async () => { await updateStatus(proj.id, 'Activo'); }}
                            className="p-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg transition-colors"
                            title="Mostrar en el portal"
                          >
                            <Eye size={16} />
                          </button>
                        )}
                        <button
                          formAction={async () => { await deleteProject(proj.id); }}
                          onClick={(e) => {
                            if (!window.confirm(`¿Estás seguro de que quieres eliminar el proyecto "${proj.title}"? Esta acción no se puede deshacer.`)) {
                              e.preventDefault();
                            }
                          }}
                          className="p-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg transition-colors"
                          title="Eliminar permanentemente"
                        >
                          <Trash2 size={16} />
                        </button>
                      </form>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* FORMULARIO DE CREACIÓN/EDICIÓN */}
      <div className="bg-\[\#262626\] border border-gray-800 rounded-2xl p-6 h-fit sticky top-24">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          {editingId ? (
            <><Pencil size={20} className="text-purple-500" /> Editar Proyecto</>
          ) : (
            <><Plus size={20} className="text-blue-500" /> Nuevo Proyecto</>
          )}
        </h2>

        <form action={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5" ref={pickerRef} style={{ position: "relative" }}>
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Repo de GitHub</label>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={openPicker}
                className="flex-1 flex items-center justify-between gap-2 bg-\[\#1A1A1A\] border border-gray-800 text-left px-4 py-2.5 rounded-xl hover:border-blue-500/50 transition-all text-sm"
              >
                <span className={`flex items-center gap-2 truncate ${repoInput ? "text-white" : "text-gray-500"}`}>
                  <Github size={15} className="shrink-0 text-gray-400" />
                  {repoInput || "Seleccionar repositorio..."}
                </span>
                {autofillState === "loading" && <span className="flex items-center gap-1 text-[11px] text-blue-400 font-medium"><Loader2 size={12} className="animate-spin" /> Analizando...</span>}
              </button>
              
              {repoInput && (
                <button
                  type="button"
                  onClick={() => runAutofill(repoInput)}
                  disabled={autofillState === "loading"}
                  title="Completar con IA"
                  className="bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/30 text-blue-400 px-3 py-2.5 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center shrink-0 shadow-lg"
                >
                  ✨ IA
                </button>
              )}
            </div>
            {/* input real que viaja con el <form>, oculto porque el botón de arriba lo controla */}
            <input type="hidden" name="github_repo" value={repoInput} />

            {pickerOpen && (
              <div className="absolute left-0 right-0 top-[calc(100%+4px)] z-20 bg-\[\#262626\] border border-gray-800 rounded-xl shadow-2xl overflow-hidden">
                <div className="p-2 border-b border-gray-800 flex items-center gap-2">
                  <Search size={14} className="text-gray-500 shrink-0" />
                  <input
                    autoFocus
                    type="text"
                    value={repoSearch}
                    onChange={e => setRepoSearch(e.target.value)}
                    placeholder="Buscar repo..."
                    className="flex-1 bg-transparent text-white text-sm focus:outline-none placeholder:text-gray-600"
                  />
                </div>

                <div className="max-h-64 overflow-y-auto">
                  {pickerLoading && (
                    <div className="flex items-center justify-center gap-2 text-gray-500 text-xs py-6">
                      <Loader2 size={14} className="animate-spin" /> Cargando tus repos de GitHub...
                    </div>
                  )}

                  {pickerError && (
                    <p className="text-[11px] text-red-400 px-4 py-3">{pickerError}</p>
                  )}

                  {!pickerLoading && !pickerError && filteredRepos.length === 0 && (
                    <p className="text-xs text-gray-500 px-4 py-4 text-center">Sin resultados.</p>
                  )}

                  {!pickerLoading && filteredRepos.map(repo => (
                    <button
                      key={repo.full_name}
                      type="button"
                      onClick={() => handleSelectRepo(repo.full_name)}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 hover:bg-white/5 text-left transition-colors"
                    >
                      {repo.private ? (
                        <Lock size={13} className="shrink-0 text-amber-400" />
                      ) : (
                        <Globe size={13} className="shrink-0 text-emerald-400" />
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-white truncate">{repo.full_name}</p>
                        {repo.description && (
                          <p className="text-[11px] text-gray-500 truncate">{repo.description}</p>
                        )}
                      </div>
                      {repo.language && (
                        <span className="shrink-0 text-[10px] text-gray-500 bg-gray-800 px-1.5 py-0.5 rounded">
                          {repo.language}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {autofillState === "error" && <p className="text-[11px] text-red-400">{autofillError}</p>}
            {editingProject?.github_synced_at && (
              <p className="text-[11px] text-gray-500">
                {editingProject.github_is_private ? "🔒 Privado" : "🌐 Público"} · ⭐ {editingProject.github_stars ?? 0} · {editingProject.github_language ?? "N/D"} · sincronizado {new Date(editingProject.github_synced_at).toLocaleDateString()}
                {editingProject.github_is_private && (
                  <> — sube la imagen manualmente, GitHub no genera preview de repos privados.</>
                )}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Título</label>
            <input type="text" name="title" value={title} onChange={e => setTitle(e.target.value)} required className="bg-\[\#1A1A1A\] border border-gray-800 text-white px-4 py-2.5 rounded-xl focus:outline-none focus:border-blue-500 transition-all text-sm" placeholder="Ej. Lector QR Pro" />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Slug (URL: atpdev.dev/app/...)</label>
            <input type="text" name="slug" value={slug} onChange={e => setSlug(e.target.value)} className="bg-\[\#1A1A1A\] border border-gray-800 text-white px-4 py-2.5 rounded-xl focus:outline-none focus:border-blue-500 transition-all text-sm" placeholder="Se autogenera del título si lo dejas vacío" />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Categoría</label>
            <select name="category" value={category} onChange={e => setCategory(e.target.value)} className="bg-\[\#1A1A1A\] border border-gray-800 text-white px-4 py-2.5 rounded-xl focus:outline-none focus:border-blue-500 transition-all text-sm">
              <option value="Android">Android Apps</option>
              <option value="iOS">iOS</option>
              <option value="Web">Web</option>
              <option value="IA">IA & Bots</option>
              <option value="Otro">Otro</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Stack (separado por comas)</label>
            <input type="text" name="stack" value={stack} onChange={e => setStack(e.target.value)} required className="bg-\[\#1A1A1A\] border border-gray-800 text-white px-4 py-2.5 rounded-xl focus:outline-none focus:border-blue-500 transition-all text-sm" placeholder="Kotlin, Compose, Room" />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Arquitectura de Despliegue</label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => { setDomainType("subruta"); setDemolink(""); }}
                className={`flex-1 py-2 px-3 text-xs font-semibold rounded-xl border transition-all ${
                  domainType === "subruta" ? "bg-blue-600/10 border-blue-500/50 text-blue-400" : "bg-\[\#1A1A1A\] border-gray-800 text-gray-400 hover:border-gray-700"
                }`}
              >
                Página SEO (Subruta)
              </button>
              <button
                type="button"
                onClick={() => setDomainType("subdominio")}
                className={`flex-1 py-2 px-3 text-xs font-semibold rounded-xl border transition-all ${
                  domainType === "subdominio" ? "bg-emerald-600/10 border-emerald-500/50 text-emerald-400" : "bg-\[\#1A1A1A\] border-gray-800 text-gray-400 hover:border-gray-700"
                }`}
              >
                Ambos (Página SEO + Link)
              </button>
              <button
                type="button"
                onClick={() => { setDomainType("externa"); setLongDescription(""); }}
                className={`flex-1 py-2 px-3 text-xs font-semibold rounded-xl border transition-all ${
                  domainType === "externa" ? "bg-amber-600/10 border-amber-500/50 text-amber-400" : "bg-\[\#1A1A1A\] border-gray-800 text-gray-400 hover:border-gray-700"
                }`}
              >
                Solo Tarjeta (Externa)
              </button>
            </div>
          </div>

          {domainType !== "subruta" && (
            <div className="flex flex-col gap-1.5 animate-in fade-in slide-in-from-top-2 duration-300">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                URL Demo Web ({domainType === "subdominio" ? "Ej: almaniq.atpdev.dev" : "Ej: https://..."})
              </label>
              <input type="text" name="demolink" value={demolink} onChange={e => setDemolink(e.target.value)} required className="bg-[#1A1A1A] border border-gray-800 text-white px-4 py-2.5 rounded-xl focus:outline-none focus:border-blue-500 transition-all text-sm focus:ring-2 focus:ring-blue-500/20" placeholder="https://..." />
            </div>
          )}
          {/* Si es subruta, la URL queda vacía y no molesta en la UI, el backend lo maneja. */}

          {/* Enlaces de Tiendas (Opcionales) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex-1 flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                Play Store / APK Link (Opcional)
              </label>
              <input type="text" name="playstore" value={playstore} onChange={e => setPlaystore(e.target.value)} className="bg-[#1A1A1A] border border-gray-800 text-white px-4 py-2.5 rounded-xl focus:outline-none focus:border-emerald-500 transition-all text-sm focus:ring-2 focus:ring-emerald-500/20" placeholder="https://play.google.com/..." />
            </div>
            <div className="flex-1 flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                App Store Link (Opcional)
              </label>
              <input type="text" name="appstore" value={appstore} onChange={e => setAppstore(e.target.value)} className="bg-[#1A1A1A] border border-gray-800 text-white px-4 py-2.5 rounded-xl focus:outline-none focus:border-blue-500 transition-all text-sm focus:ring-2 focus:ring-blue-500/20" placeholder="https://apps.apple.com/..." />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Imagen del proyecto</label>
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 shrink-0 rounded-lg bg-\[\#1A1A1A\] border border-gray-800 overflow-hidden flex items-center justify-center">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Si la URL falla al cargar (ej. URL rota vieja de DB), oculta la imagen rota
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <ImageOff size={18} className="text-gray-600" />
                )}
              </div>
              <div className="flex flex-col gap-1.5 flex-1">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleCaptureScreenshot}
                    disabled={screenshotState === "loading" || !demolink.trim()}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-semibold transition-all"
                    title="Toma una captura real del sitio en la URL de arriba, como hace Vercel"
                  >
                    {screenshotState === "loading" ? <Loader2 size={14} className="animate-spin" /> : <Camera size={14} />}
                    Capturar del sitio
                  </button>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadState === "loading"}
                    className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/30 hover:bg-blue-500/20 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-semibold transition-all"
                    title="Sube una imagen o logo desde tu computadora"
                  >
                    {uploadState === "loading" ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
                    Subir imagen
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
              </div>
            </div>
            {screenshotState === "error" && <p className="text-[11px] text-red-400">{screenshotError}</p>}
            {uploadState === "error" && <p className="text-[11px] text-red-400">{uploadError}</p>}
            {!demolink.trim() && (
              <p className="text-[11px] text-gray-600">Para "Capturar del sitio" escribe la URL de arriba primero (debe estar desplegada). "Subir imagen" funciona siempre, incluso sin URL.</p>
            )}
            <input type="hidden" name="image" value={imagePreview} />
          </div>

          {/* BOTÓN GRADIENT BUILDER */}
          <div className="flex justify-center -mt-2 mb-2 relative z-10">
            <button
              type="button"
              onClick={() => setShowGradientBuilderModal(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-500/10 to-blue-500/10 hover:from-purple-500/20 hover:to-blue-500/20 border border-purple-500/30 text-purple-300 px-6 py-2 rounded-full font-bold text-[11px] uppercase tracking-widest shadow-[0_0_15px_rgba(168,85,247,0.1)] hover:shadow-[0_0_20px_rgba(168,85,247,0.25)] transition-all"
            >
              <Palette size={14} />
              Diseñar Portada con Gradiente
            </button>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Descripción Corta</label>
            <textarea name="description" value={description} onChange={e => setDescription(e.target.value)} required rows={2} className="bg-\[\#1A1A1A\] border border-gray-800 text-white px-4 py-2.5 rounded-xl focus:outline-none focus:border-blue-500 transition-all text-sm resize-none" placeholder="Breve descripción..."></textarea>
          </div>

          {domainType !== "externa" && (
            <div className="flex flex-col gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="flex items-center justify-between border-b border-gray-800 pb-2">
                <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Maqueta del Artículo (Bloques AI)</label>
                <button
                  type="button"
                  onClick={() => setShowPreview(!showPreview)}
                  className="flex items-center gap-1.5 text-[11px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2.5 py-1 rounded-lg hover:bg-blue-500/20 transition-all"
                >
                  {showPreview ? "Cerrar Vista Previa" : "Ver Vista Previa"}
                </button>
              </div>

              {showPreview ? (
                <div className="bg-[#111] border border-gray-800 p-6 rounded-xl prose prose-invert max-w-none text-sm min-h-[300px]">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {compileBlocksToMarkdown() || "*El artículo está vacío...*"}
                  </ReactMarkdown>
                </div>
              ) : (
                <div className="flex flex-col gap-4 min-h-[300px]">
                  {blocks.length === 0 && (
                    <div className="text-sm text-gray-500 italic p-4 text-center border border-dashed border-gray-800 rounded-xl">
                      Usa el botón ✨ IA para generar los bloques del artículo.
                    </div>
                  )}
                  {blocks.map((b, i) => (
                    <div key={b.id} className="relative group border-l-2 border-transparent focus-within:border-blue-500 pl-3 -ml-3 transition-colors">
                      {b.type === "h2" && (
                        <input 
                          type="text" 
                          value={b.content} 
                          onChange={(e) => {
                            const newBlocks = [...blocks];
                            newBlocks[i].content = e.target.value;
                            setBlocks(newBlocks);
                          }}
                          className="w-full bg-transparent text-xl font-bold text-white focus:outline-none placeholder-gray-600"
                          placeholder="Subtítulo..."
                        />
                      )}
                      {b.type === "p" && (
                        <textarea
                          value={b.content}
                          onChange={(e) => {
                            const newBlocks = [...blocks];
                            newBlocks[i].content = e.target.value;
                            setBlocks(newBlocks);
                            // Auto-resize
                            e.target.style.height = 'inherit';
                            e.target.style.height = `${e.target.scrollHeight}px`;
                          }}
                          className="w-full bg-transparent text-sm text-gray-300 focus:outline-none resize-none overflow-hidden placeholder-gray-600"
                          placeholder="Escribe un párrafo..."
                          rows={3}
                        />
                      )}
                      {b.type === "image" && (
                        <div className="bg-[#1A1A1A] border border-gray-800 rounded-xl p-4 flex flex-col items-center justify-center gap-2">
                          {b.url ? (
                            <div className="relative group/img">
                              <img src={b.url} alt={b.alt} className="max-h-48 rounded-lg object-contain" />
                              <button 
                                type="button" 
                                onClick={() => {
                                  const newBlocks = [...blocks];
                                  newBlocks[i].url = "";
                                  setBlocks(newBlocks);
                                }}
                                className="absolute top-2 right-2 bg-black/60 backdrop-blur text-white p-1.5 rounded-lg opacity-0 group-hover/img:opacity-100 transition-opacity"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          ) : (
                            <>
                              <Camera size={24} className="text-gray-600" />
                              <p className="text-xs text-gray-400 font-medium text-center">
                                {b.context || "Sube una imagen para este bloque"}
                              </p>
                              <div className="relative">
                                <input 
                                  type="file" 
                                  accept="image/*"
                                  onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if(!file) return;
                                    setInlineUploadState("loading");
                                    const fd = new FormData(); fd.set("file", file);
                                    const res = await uploadImageFile(fd);
                                    if("imageUrl" in res && res.imageUrl) {
                                      const newBlocks = [...blocks];
                                      newBlocks[i].url = res.imageUrl;
                                      setBlocks(newBlocks);
                                    }
                                    setInlineUploadState("idle");
                                  }}
                                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                />
                                <button type="button" className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-4 py-1.5 rounded-lg text-xs font-semibold hover:bg-emerald-500/20 transition-all pointer-events-none flex items-center gap-2">
                                  {inlineUploadState === "loading" ? <Loader2 size={12} className="animate-spin" /> : <Upload size={12} />}
                                  {inlineUploadState === "loading" ? "Subiendo..." : "Subir Foto"}
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <label className="flex items-center gap-2 cursor-pointer mt-2">
            <input 
              type="checkbox" 
              name="is_featured" 
              checked={is_featured} 
              onChange={e => setIsFeatured(e.target.checked)} 
              value="true"
              className="w-4 h-4 rounded border-gray-800 bg-[#1A1A1A] text-blue-500 focus:ring-blue-500/50" 
            />
            <span className="text-sm font-semibold text-gray-300">Destacar proyecto (Mostrar primero en inicio)</span>
          </label>

          <input type="hidden" name="status" value={editingProject ? editingProject.status : "Borrador"} />

          {submitError && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-4 text-sm text-red-400 mt-2">
              <span className="font-bold block mb-1">Error al guardar:</span>
              {submitError}
            </div>
          )}

          <div className="flex gap-2 mt-4">
            {editingId && (
              <button
                type="button"
                onClick={() => setEditingId(null)}
                className="w-1/3 bg-gray-800 hover:bg-gray-700 text-white font-bold px-4 py-3 rounded-xl transition-all"
              >
                Cancelar
              </button>
            )}
            <button
              type="submit"
              disabled={submitState === "loading"}
              className={`${editingId ? 'w-2/3 bg-purple-600 hover:bg-purple-500 shadow-[0_0_15px_rgba(147,51,234,0.4)]' : 'w-full bg-blue-600 hover:bg-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.4)]'} text-white font-bold px-4 py-3 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2`}
            >
              {submitState === "loading" && <Loader2 size={16} className="animate-spin" />}
              {editingId ? "Guardar Cambios" : "Crear Proyecto"}
            </button>
          </div>
        </form>
      </div>

      {/* GRADIENT BUILDER MODAL */}
      {showGradientBuilderModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 md:p-10 animate-in fade-in duration-200">
          <div className="relative w-full max-w-6xl h-full max-h-[800px] bg-[#17181c] rounded-2xl overflow-hidden border border-gray-800 shadow-2xl flex flex-col">
            <div className="flex justify-between items-center p-4 border-b border-gray-800 bg-[#1c1d22]">
              <div className="flex items-center gap-2 text-white font-bold">
                <Palette size={18} className="text-purple-400" />
                Diseñador de Portadas
              </div>
              <button 
                type="button" 
                onClick={() => setShowGradientBuilderModal(false)}
                className="text-gray-400 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                Cerrar
              </button>
            </div>
            <iframe 
              ref={iframeRef}
              src="/gradient-builder.html" 
              className="flex-1 w-full h-full border-none"
              title="Gradient Builder"
            />
          </div>
        </div>
      )}
    </div>
  );
}