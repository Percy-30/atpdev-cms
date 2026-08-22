"use client";

import { useState, cloneElement } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PlayCircle, X, Download, Eye, Globe, ExternalLink, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Project, AIModelData } from "@atpdev/database";
import { ICONS_MAP } from "@/components/AIModelsSection";

export default function Portfolio({
  projects,
  aiModels,
  ui,
  enableGlow = true,
  glowStyle = 'border'
}: {
  projects: Project[];
  aiModels: AIModelData[];
  ui: Record<string, string>;
  enableGlow?: boolean;
  glowStyle?: string;
}) {
  const glowClass = "interactive-card";
  const [filter, setFilter] = useState("all");
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [navigatingSlug, setNavigatingSlug] = useState<string | null>(null);

  // Build filter categories
  const uniqueCats = Array.from(new Set(projects.map(p => p.originalCategory || p.category)));
  const dynamicCategories = [
    { value: 'all', label: ui.filterAll },
    ...uniqueCats.map(cat => ({
      value: cat,
      label: projects.find(p => (p.originalCategory || p.category) === cat)?.category || cat
    }))
  ];

  const filteredProjects = projects.filter(
    (p) => filter === "all" || (p.originalCategory || p.category) === filter
  );

  return (
    <>
      <section id="portfolio" className="py-20 relative border-t border-[var(--glass-border)] transition-colors">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16 text-center">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4 transition-colors" style={{ color: 'var(--text-color)' }}>
              {ui.featuredProjects.split(" ")[0]} {ui.featuredProjects.split(" ").slice(1).length > 0 && (
                <span className="text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(to right, var(--primary), var(--tertiary))' }}>
                  {ui.featuredProjects.split(" ").slice(1).join(" ")}
                </span>
              )}
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">{ui.featuredDesc}</p>
          </div>

          <div className="flex flex-wrap gap-3 mb-12 justify-center">
            {dynamicCategories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setFilter(cat.value)}
                className={`px-6 py-2 rounded-full text-sm font-semibold transition-all shadow-sm ${
                  filter === cat.value
                    ? "border-transparent hover:shadow-[0_0_15px_var(--primary)]"
                    : "hover:brightness-110 hover:shadow-[0_0_15px_var(--primary)]"
                }`}
                style={{ 
                  backgroundColor: filter === cat.value ? 'var(--primary)' : 'var(--pill-bg)',
                  color: filter === cat.value ? 'white' : 'var(--text-color)',
                  border: filter === cat.value ? 'none' : '1px solid var(--glass-border)'
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <AnimatePresence>
              {filteredProjects.map((project) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  key={project.id}
                  className={`rounded-2xl overflow-hidden border transition-all group cursor-pointer flex flex-col shadow-[0_8px_32px_rgba(0,0,0,0.1)] hover:scale-[1.02] ${glowClass}`}
                  style={{ backgroundColor: 'var(--glass-bg)', borderColor: 'var(--glass-border)', backdropFilter: 'blur(20px)', '--glow-bg': 'var(--glass-bg)' } as React.CSSProperties}
                  onClick={() => setSelectedProject(project.id)}
                >
                  <div className="relative h-64 overflow-hidden flex items-center justify-center" style={{ backgroundColor: 'rgba(0,0,0,0.2)' }}>
                    {project.image ? (
                      <Image src={project.image} alt={project.title} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-100" />
                    ) : (
                      <div className="text-4xl font-black text-gray-700 uppercase tracking-widest">{project.title.substring(0,2)}</div>
                    )}
                    <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold border" style={{ color: 'var(--primary)', borderColor: 'var(--primary)' }}>
                      {project.status}
                    </div>
                  </div>
                  <div className="p-8 flex-1 flex flex-col">
                    <div className="text-xs font-bold mb-2 uppercase tracking-widest" style={{ color: 'var(--primary)' }}>{project.category}</div>
                    <h3 className="text-2xl font-bold mb-3 flex items-center justify-between" style={{ color: 'var(--text-color)' }}>
                      {project.title}
                      <div className="flex gap-1">
                        {aiModels.filter(model => model.is_visible && project.stack.some((t: string) => model.tags.includes(t.toLowerCase()))).slice(0, 3).map(model => (
                          <div key={model.id} className="w-6 h-6 rounded bg-[#262626] border border-gray-700 flex items-center justify-center" title={`Powered by ${model.name}`}>
                            {cloneElement(ICONS_MAP[model.icon_name] as React.ReactElement<any>, { size: 12, color: 'var(--primary)' })}
                          </div>
                        ))}
                      </div>
                    </h3>
                    <p className="text-gray-400 text-sm mb-6 line-clamp-2 flex-1">{project.description}</p>
                    <div className="flex items-center justify-between gap-2 mt-auto pt-4 border-t border-[var(--glass-border)]">
                      <div className="flex flex-wrap gap-1.5 overflow-hidden max-h-7">
                        {project.stack.slice(0, 3).map((tech: string) => (
                          <span key={tech} className="text-[11px] px-2.5 py-0.5 rounded-md border shadow-sm truncate" style={{ backgroundColor: 'var(--pill-bg)', borderColor: 'var(--glass-border)', color: 'var(--text-color)' }}>{tech}</span>
                        ))}
                        {project.stack.length > 3 && (
                          <span className="text-[11px] px-2 py-0.5 rounded-md border" style={{ backgroundColor: 'var(--pill-bg)', borderColor: 'var(--glass-border)', color: 'var(--text-color)' }}>+{project.stack.length - 3}</span>
                        )}
                      </div>
                      {project.slug && (
                        <Link 
                          href={`/apps/${project.slug}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            setNavigatingSlug(project.slug);
                          }}
                          className="inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 border border-blue-500/30 transition-all hover:scale-105 active:scale-95 flex-shrink-0"
                        >
                          {navigatingSlug === project.slug ? (
                            <>
                              <Loader2 size={13} className="animate-spin" />
                              <span>Cargando...</span>
                            </>
                          ) : (
                            <>
                              <Eye size={14} />
                              <span>Ver Página</span>
                            </>
                          )}
                        </Link>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* MODAL */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ y: 50, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 50, opacity: 0, scale: 0.95 }}
              className="w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] relative border"
              style={{ backgroundColor: 'var(--glass-bg)', borderColor: 'var(--glass-border)', backdropFilter: 'blur(30px)' }}
              onClick={(e) => e.stopPropagation()}
            >
              {(() => {
                const p = projects.find(x => x.id === selectedProject);
                if (!p) return null;
                return (
                  <div>
                    <div className="relative h-72 bg-black flex items-center justify-center">
                      {p.image ? (
                        <Image src={p.image} alt={p.title} fill sizes="100vw" className="object-cover opacity-70" />
                      ) : (
                        <div className="text-6xl font-black text-gray-800 uppercase tracking-widest">{p.title.substring(0,2)}</div>
                      )}
                      <button onClick={() => setSelectedProject(null)} className="absolute top-4 right-4 bg-black/50 hover:bg-black/80 text-white p-2 rounded-full transition-colors border border-gray-600" aria-label="Cerrar modal de proyecto">
                        <X size={20} />
                      </button>
                    </div>
                    <div className="p-8 md:p-10">
                      <div className="mb-6">
                        <div className="flex items-center gap-3 text-sm mb-4">
                          <span className="border px-3 py-1 rounded-full font-medium shadow-sm" style={{ color: 'var(--primary)', borderColor: 'var(--primary)', backgroundColor: 'var(--pill-bg)' }}>{p.category}</span>
                          <span className="text-green-500 border border-green-500/50 px-3 py-1 rounded-full font-medium shadow-sm" style={{ backgroundColor: 'var(--pill-bg)' }}>{p.metrics}</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: 'var(--text-color)' }}>{p.title}</h2>
                      </div>
                      <p className="text-lg mb-8 leading-relaxed" style={{ color: 'var(--text-color)', opacity: 0.8 }}>{p.description}</p>
                      <div className="mb-10">
                        <h4 className="text-sm uppercase tracking-widest font-bold mb-4" style={{ color: 'var(--text-color)', opacity: 0.6 }}>{ui.techStackTitle}</h4>
                        <div className="flex flex-wrap gap-3">
                          {p.stack.map((tech: string) => (
                            <span key={tech} className="border px-4 py-2 rounded-lg text-sm font-medium shadow-sm" style={{ backgroundColor: 'var(--pill-bg)', borderColor: 'var(--glass-border)', color: 'var(--text-color)' }}>{tech}</span>
                          ))}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-4 pt-6 border-t" style={{ borderColor: 'var(--glass-border)' }}>
                        {p.slug && (
                          <Link
                            href={`/apps/${p.slug}`}
                            onClick={() => setNavigatingSlug(p.slug)}
                            className="flex items-center justify-center gap-2.5 text-white px-7 py-3.5 rounded-2xl shadow-lg transition-all duration-300 font-bold hover:scale-[1.03] active:scale-95 group bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 shadow-blue-500/25 neon-border"
                          >
                            {navigatingSlug === p.slug ? (
                              <>
                                <Loader2 size={19} className="animate-spin" />
                                <span>Cargando página...</span>
                              </>
                            ) : (
                              <>
                                <Eye size={19} className="transition-transform duration-300 group-hover:scale-110" />
                                <span>Ver Artículo Completo</span>
                              </>
                            )}
                          </Link>
                        )}
                        {p.demolink && p.demolink.trim() !== '' && p.demolink !== '#' && !p.demolink.includes('/apps/') && !p.demolink.includes(p.slug) && (
                          <a 
                            href={p.demolink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            onClick={() => setNavigatingSlug(`web-${p.slug}`)}
                            className="flex items-center justify-center gap-2.5 text-white px-7 py-3.5 rounded-2xl shadow-lg transition-all duration-300 font-bold hover:scale-[1.03] active:scale-95 group bg-gradient-to-r from-teal-600 via-emerald-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 shadow-teal-500/25 neon-border"
                          >
                            {navigatingSlug === `web-${p.slug}` ? (
                              <>
                                <Loader2 size={19} className="animate-spin" />
                                <span>Abriendo Web App...</span>
                              </>
                            ) : (
                              <>
                                <Globe size={19} className="transition-transform duration-300 group-hover:scale-110" />
                                <span>Visitar Web App</span>
                              </>
                            )}
                          </a>
                        )}
                        {p.playstore && (
                          <a href={p.playstore} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 border px-8 py-3.5 rounded-xl transition-all duration-300 font-bold shadow-lg hover:scale-[1.03] hover:shadow-[0_10px_30px_rgba(0,0,0,0.15)] hover:bg-black/5 dark:hover:bg-white/10 group" style={{ backgroundColor: 'var(--pill-bg)', borderColor: 'var(--glass-border)', color: 'var(--text-color)' }}>
                            {p.playstore.toLowerCase().includes('.apk') || p.playstore.includes('/apks/') ? (
                              <><Download size={18} className="transition-transform duration-300 group-hover:scale-110 text-emerald-400" /> Descargar APK Directo</>
                            ) : (
                              <><svg viewBox="0 0 512 512" width="18" height="18" fill="currentColor" className="transition-transform duration-300 group-hover:scale-110"><path d="M325.3 234.3L104.6 13.5C72 6.6 44 26 44 60.5v391c0 34.5 28 53.9 60.6 47l220.7-220.8c5.4-5.4 5.4-14.2 0-19.6c0 0-42.3-42.2-42.3-42.2-5.4-5.4-14.2-5.4-19.6 0l41.9-41.6zm-177 17.7c-5.4-5.4-5.4-14.2 0-19.6l216-216c5.4-5.4 14.2-5.4 19.6 0l90 90c12.1 12.1 12.1 31.8 0 43.9L352 372.2c-5.4 5.4-14.2 5.4-19.6 0l-184-184zM476 220l-71-71-224 224 71 71c12.1 12.1 31.8 12.1 43.9 0l180.1-180.1c12.1-12.1 12.1-31.8 0-43.9z"/></svg> Play Store</>
                            )}
                          </a>
                        )}

                        {(p as any).appstore && (
                          <a href={(p as any).appstore} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 border px-8 py-3.5 rounded-xl transition-all duration-300 font-bold shadow-lg hover:scale-[1.03] hover:shadow-[0_10px_30px_rgba(0,0,0,0.15)] hover:bg-black/5 dark:hover:bg-white/10 group" style={{ backgroundColor: 'var(--pill-bg)', borderColor: 'var(--glass-border)', color: 'var(--text-color)' }}>
                            {(p as any).appstore.toLowerCase().includes('.ipa') || (p as any).appstore.includes('/ipas/') ? (
                              <><Download size={18} className="transition-transform duration-300 group-hover:scale-110 text-sky-400" /> Descargar IPA Directo (iOS)</>
                            ) : (
                              <><svg viewBox="0 0 384 512" width="18" height="18" fill="currentColor" className="transition-transform duration-300 group-hover:scale-110 mb-1"><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/></svg> App Store</>
                            )}
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
