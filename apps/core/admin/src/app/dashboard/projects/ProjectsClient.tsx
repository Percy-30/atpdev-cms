"use client";

import { useState, useEffect, useRef } from "react";
import { FolderKanban, Plus, Trash2, Eye, EyeOff, Pencil, Loader2, Github, Lock, Globe, Search, Camera, ImageOff, Upload, ExternalLink } from "lucide-react";
import { Project, GithubRepoSummary } from "@atpdev/database";
import { createProject, updateStatus, deleteProject, updateProjectAction, autofillFromGithub, getGithubRepos, captureScreenshot, uploadImageFile } from "./actions";

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
  const [demolink, setDemolink] = useState("");
  const [imagePreview, setImagePreview] = useState(""); // screenshot capturado, viaja en input oculto "image"
  const [autofillState, setAutofillState] = useState<"idle" | "loading" | "error">("idle");
  const [autofillError, setAutofillError] = useState("");
  const [screenshotState, setScreenshotState] = useState<"idle" | "loading" | "error">("idle");
  const [screenshotError, setScreenshotError] = useState("");
  const [uploadState, setUploadState] = useState<"idle" | "loading" | "error">("idle");
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

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
    setDemolink(editingProject?.demolink && editingProject.demolink !== "#" ? editingProject.demolink : "");
    setImagePreview(editingProject?.image || "");
    setAutofillState("idle");
    setAutofillError("");
    setScreenshotState("idle");
    setScreenshotError("");
    setUploadState("idle");
    setUploadError("");
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
    const result = await autofillFromGithub(repoFullName);
    if ("error" in result) {
      setAutofillState("error");
      setAutofillError(result.error);
      return;
    }
    setTitle(result.data.title);
    setDescription(result.data.description);
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
    if (result.imageUrl) {
      setImagePreview(result.imageUrl);
    }
    setUploadState("idle");
    e.target.value = "";
  };

  const handleSubmit = async (formData: FormData) => {
    if (editingId) {
      await updateProjectAction(editingId, formData);
      setEditingId(null);
    } else {
      await createProject(formData);
      setTitle(""); setDescription(""); setStack(""); setSlug(""); setRepoInput("");
      setCategory("Android"); setDemolink(""); setImagePreview("");
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

            <button
              type="button"
              onClick={openPicker}
              className="w-full flex items-center justify-between gap-2 bg-\[\#1A1A1A\] border border-gray-800 text-left px-4 py-2.5 rounded-xl hover:border-blue-500/50 transition-all text-sm"
            >
              <span className={`flex items-center gap-2 truncate ${repoInput ? "text-white" : "text-gray-500"}`}>
                <Github size={15} className="shrink-0 text-gray-400" />
                {repoInput || "Seleccionar repositorio..."}
              </span>
              {autofillState === "loading" && <Loader2 size={14} className="animate-spin shrink-0 text-blue-400" />}
            </button>
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
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">URL (Demo/Play Store)</label>
            <input type="text" name="demolink" value={demolink} onChange={e => setDemolink(e.target.value)} className="bg-\[\#1A1A1A\] border border-gray-800 text-white px-4 py-2.5 rounded-xl focus:outline-none focus:border-blue-500 transition-all text-sm" placeholder="https://... (opcional, déjalo vacío si aún no tienes link)" />
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

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Descripción Corta</label>
            <textarea name="description" value={description} onChange={e => setDescription(e.target.value)} required rows={2} className="bg-\[\#1A1A1A\] border border-gray-800 text-white px-4 py-2.5 rounded-xl focus:outline-none focus:border-blue-500 transition-all text-sm resize-none" placeholder="Breve descripción..."></textarea>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Descripción Larga (SEO)</label>
            <textarea name="long_description" value={long_description} onChange={e => setLongDescription(e.target.value)} rows={4} className="bg-\[\#1A1A1A\] border border-gray-800 text-white px-4 py-2.5 rounded-xl focus:outline-none focus:border-blue-500 transition-all text-sm resize-none" placeholder="Descripción extendida para la página del proyecto (200-300 palabras)..."></textarea>
          </div>

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

          <input type="hidden" name="status" value={editingProject ? editingProject.status : "Activo"} />

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
              className={`${editingId ? 'w-2/3 bg-purple-600 hover:bg-purple-500 shadow-[0_0_15px_rgba(147,51,234,0.4)]' : 'w-full bg-blue-600 hover:bg-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.4)]'} text-white font-bold px-4 py-3 rounded-xl transition-all`}
            >
              {editingId ? "Guardar Cambios" : "Crear Proyecto"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}