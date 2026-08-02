"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PlayCircle, ExternalLink, Code2, Server, Smartphone, Cpu, Download, X } from "lucide-react";
import { getProjects, getSiteConfig, Project, SiteConfig } from "@atpdev/database";
import Typewriter from "@/components/Typewriter";
import AboutSection from "@/components/AboutSection";
import ExperienceTimeline from "@/components/ExperienceTimeline";
import ContactForm from "@/components/ContactForm";

import { useParams } from "next/navigation";
import { translateClient } from "@/utils/translate";

const categories = ["Todos", "Android", "Web", "IA"];

export default function Home() {
  const params = useParams();
  const lang = params?.lang as string || 'es';

  const [filter, setFilter] = useState("Todos");
  const [selectedProject, setSelectedProject] = useState<number | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [config, setConfig] = useState<SiteConfig | null>(null);

  // UI Strings
  const [ui, setUi] = useState({
    heroDesc: "Construyendo experiencias de software escalables y de alto rendimiento. Especializado en arquitecturas limpias, interfaces modernas y soluciones integradas con Inteligencia Artificial.",
    btnProjects: "Ver Proyectos →",
    btnAbout: "Sobre Mí (Detalles)",
    btnPdf: "Descargar PDF",
    techStack: "TECH STACK",
    featuredProjects: "Proyectos Destacados",
    featuredDesc: "Explora algunas de las aplicaciones y sistemas que he diseñado desde cero, enfocados en monetización y utilidad real.",
    techStackTitle: "Stack Tecnológico",
    btnDemo: "Ver Demo",
    btnPlayStore: "Ver en Play Store",
    footerBio: "Ingeniero de Sistemas y desarrollador Fullstack. Transformando ideas en productos digitales de alto rendimiento.",
    footerLinks: "Enlaces Rápidos",
    footerLegal: "Legal",
    allRights: "Todos los derechos reservados."
  });

  useEffect(() => {
    const loadData = async () => {
      // 1. Fetch & Translate Projects
      let projData = await getProjects();
      projData = projData.filter(p => p.status !== 'Privado');
      
      if (lang !== 'es') {
        projData = await Promise.all(projData.map(async p => ({
          ...p,
          title: await translateClient(p.title, lang),
          description: await translateClient(p.description, lang),
          category: await translateClient(p.category, lang),
          metrics: await translateClient(p.metrics, lang),
          status: await translateClient(p.status, lang),
        })));
      }
      setProjects(projData);

      // 2. Fetch & Translate Config
      let confData = await getSiteConfig();
      if (lang !== 'es' && confData) {
        const tw = confData.hero_typewriter || [];
        confData = {
          ...confData,
          hero_title: await translateClient(confData.hero_title, lang),
          hero_subtitle: await translateClient(confData.hero_subtitle, lang),
          bio_short: await translateClient(confData.bio_short, lang),
          hero_typewriter: await Promise.all(tw.map(w => translateClient(w, lang)))
        };
      }
      setConfig(confData);

      // 3. Translate Static UI Strings
      if (lang !== 'es') {
        setUi(prev => ({ ...prev, heroDesc: "Translating..." })); // Optimistic loading
        const keys = Object.keys(ui) as (keyof typeof ui)[];
        const newUi = { ...ui };
        await Promise.all(keys.map(async (k) => {
          newUi[k] = await translateClient(ui[k], lang);
        }));
        setUi(newUi);
      }
    };
    
    loadData();
  }, [lang]);

  // Extraer categorías únicas de los proyectos activos
  const dynamicCategories = ["Todos", ...Array.from(new Set(projects.map(p => p.category)))];

  const filteredProjects = projects.filter(
    (p) => filter === "Todos" || p.category === filter
  );

  return (
    <div className="w-full bg-[#0b0c10] text-gray-200">
      
      {/* HERO SECTION (CENTRALIZADO) */}
      <section id="hero" className="relative min-h-[90vh] flex flex-col items-center justify-center px-4 md:px-16 text-center overflow-hidden">
        {/* Glow de fondo */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 blur-[120px] rounded-full z-0"></div>
        
        <div className="relative z-10 max-w-4xl mx-auto flex flex-col items-center">
          
          <div className="mb-6 px-4 py-1.5 border border-blue-500/30 bg-blue-500/10 rounded-full text-xs font-semibold text-blue-400 tracking-widest flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            AVAILABLE FOR HIRE
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-2 tracking-tight">
            {config?.hero_title || "Percy Acha"}
          </h1>
          <h2 className="text-2xl md:text-3xl font-semibold mb-6 tracking-widest uppercase" style={{ color: config?.primary_color || '#3b82f6' }}>
            {config?.hero_subtitle || "@ATPDEV"}
          </h2>
          <h3 className="text-2xl md:text-4xl font-extrabold mb-4 tracking-tight leading-tight">
            <span className="text-gray-500 font-light">—</span> <br className="hidden md:block"/>
            <span className="inline-block w-full text-center">
              {config?.hero_typewriter && config.hero_typewriter.length > 0 ? (
                <Typewriter words={config.hero_typewriter} />
              ) : (
                <Typewriter words={["Android Developer", "Web Engineer", "AI Integrator", "Freelancer"]} />
              )}
            </span>
          </h3>
          
          <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto font-light leading-relaxed mt-4">
            {ui.heroDesc}
          </p>
          
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-16">
            <a href="#portfolio" className="w-full sm:w-auto text-white px-8 py-3.5 rounded-lg font-medium transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)] flex items-center justify-center gap-2 hover:opacity-90" style={{ backgroundColor: config?.primary_color || '#2563eb' }}>
              {ui.btnProjects}
            </a>
            <a href="#about" className="w-full sm:w-auto bg-[#1a1c23] hover:bg-[#252833] border border-gray-700 text-white px-8 py-3.5 rounded-lg font-medium transition-all flex items-center justify-center gap-2">
              {ui.btnAbout}
            </a>
            <a href="/cv.html" target="_blank" className="text-gray-400 hover:text-white underline text-sm ml-0 sm:ml-4 flex items-center gap-1 transition-colors">
              <Download size={14} /> {ui.btnPdf}
            </a>
          </div>
          
          {/* Tech Stack Chips Centrados */}
          <div className="text-center">
            <p className="text-xs uppercase tracking-[0.2em] text-gray-500 font-bold mb-4">{ui.techStack}</p>
            <div className="flex flex-wrap justify-center gap-3">
              {["KOTLIN", "NEXT.JS", "TAILWIND", "SUPABASE", "PYTHON", "AI / LLMS"].map(tech => (
                <span key={tech} className="px-4 py-2 border border-gray-800 bg-[#12141a] rounded-full text-xs font-semibold text-gray-300">
                  {tech}
                </span>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* SECCIÓN SOBRE MÍ */}
      <AboutSection />

      {/* SECCIÓN EXPERIENCIA */}
      <ExperienceTimeline />

      {/* PROYECTOS DESTACADOS */}
      <section id="portfolio" className="py-20 relative bg-[#0b0c10] border-t border-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16 text-center">
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
              {ui.featuredProjects}
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              {ui.featuredDesc}
            </p>
          </div>

          {/* Filtros Dinámicos */}
          <div className="flex flex-wrap gap-3 mb-12 justify-center">
            {dynamicCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-6 py-2 rounded-full text-sm font-semibold transition-all
                  ${filter === cat 
                    ? "bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.5)] border-transparent" 
                    : "bg-[#12141a] text-gray-400 hover:text-white border border-gray-800 hover:border-gray-600"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Grid de Proyectos */}
          <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            <AnimatePresence>
              {filteredProjects.map((project) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  key={project.id}
                  className="bg-[#12141a] rounded-2xl overflow-hidden border border-gray-800 hover:border-blue-500/50 hover:shadow-[0_0_30px_rgba(37,99,235,0.1)] transition-all group cursor-pointer flex flex-col"
                  onClick={() => setSelectedProject(project.id)}
                >
                  <div className="relative h-64 overflow-hidden bg-black/50 flex items-center justify-center">
                    {project.image ? (
                      <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-100" />
                    ) : (
                      <div className="text-4xl font-black text-gray-700 uppercase tracking-widest">{project.title.substring(0,2)}</div>
                    )}
                    <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-blue-400 border border-blue-500/30">
                      {project.status}
                    </div>
                  </div>
                  <div className="p-8 flex-1 flex flex-col">
                    <div className="text-xs font-bold text-blue-500 mb-2 uppercase tracking-widest">{project.category}</div>
                    <h3 className="text-2xl font-bold text-white mb-3">{project.title}</h3>
                    <p className="text-gray-400 text-sm mb-6 line-clamp-2 flex-1">{project.description}</p>
                    
                    <div className="flex flex-wrap gap-2 mt-auto">
                      {project.stack.map(tech => (
                        <span key={tech} className="bg-gray-800 text-gray-300 text-xs px-2.5 py-1 rounded-md border border-gray-700">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>
      </section>

      {/* MODAL DE PROYECTO */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div 
              initial={{ y: 50, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 50, opacity: 0, scale: 0.95 }}
              className="bg-[#12141a] border border-gray-800 w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              {(() => {
                const p = projects.find(x => x.id === selectedProject);
                if (!p) return null;
                return (
                  <div>
                    <div className="relative h-72 bg-black flex items-center justify-center">
                      {p.image ? (
                        <img src={p.image} alt={p.title} className="w-full h-full object-cover opacity-70" />
                      ) : (
                        <div className="text-6xl font-black text-gray-800 uppercase tracking-widest">{p.title.substring(0,2)}</div>
                      )}
                      <button 
                        onClick={() => setSelectedProject(null)}
                        className="absolute top-4 right-4 bg-black/50 hover:bg-black/80 text-white p-2 rounded-full transition-colors border border-gray-600"
                      >
                        <X size={20} />
                      </button>
                    </div>
                    <div className="p-8 md:p-10">
                      <div className="mb-6">
                        <div className="flex items-center gap-3 text-sm mb-4">
                          <span className="bg-blue-900/50 text-blue-400 border border-blue-800 px-3 py-1 rounded-full font-medium">{p.category}</span>
                          <span className="bg-green-900/50 text-green-400 border border-green-800 px-3 py-1 rounded-full font-medium">
                            {p.metrics}
                          </span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">{p.title}</h2>
                      </div>
                      
                      <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                        {p.description}
                      </p>

                      <div className="mb-10">
                        <h4 className="text-sm text-gray-500 uppercase tracking-widest font-bold mb-4">{ui.techStackTitle}</h4>
                        <div className="flex flex-wrap gap-3">
                          {p.stack.map(tech => (
                            <span key={tech} className="bg-gray-800 border border-gray-700 text-gray-200 px-4 py-2 rounded-lg text-sm font-medium">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-4 pt-6 border-t border-gray-800">
                        {p.demolink !== "#" && (
                        <a href={p.demolink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-8 py-3.5 rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.4)] transition-all font-medium">
                          <PlayCircle size={20} /> {ui.btnDemo}
                        </a>
                      )}
                      
                      {p.playstore && (
                        <a href={p.playstore} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-[#212431] border border-gray-700 text-white px-8 py-3.5 rounded-xl hover:bg-[#2a2d3d] transition-colors font-medium">
                            <PlayCircle size={18} /> {ui.btnPlayStore}
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })()}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FORMULARIO DE CONTACTO */}
      <ContactForm config={config} />

      {/* FOOTER EXTENDIDO */}
      <footer className="bg-[#050608] border-t border-gray-900 pt-16 pb-8">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
          <div>
            <h3 className="text-2xl font-black text-white mb-4">ATP DEV</h3>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              {ui.footerBio}
            </p>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4 uppercase tracking-widest text-xs">{ui.footerLinks}</h4>
            <ul className="space-y-3">
              <li><a href="#about" className="text-gray-400 hover:text-blue-400 text-sm transition-colors">Sobre Mí</a></li>
              <li><a href="#experiencia" className="text-gray-400 hover:text-blue-400 text-sm transition-colors">Experiencia</a></li>
              <li><a href="#portfolio" className="text-gray-400 hover:text-blue-400 text-sm transition-colors">Proyectos</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4 uppercase tracking-widest text-xs">{ui.footerLegal}</h4>
            <ul className="space-y-3">
              <li><a href="/privacy" className="text-gray-400 hover:text-blue-400 text-sm transition-colors">Política de Privacidad</a></li>
              <li><a href="/terms" className="text-gray-400 hover:text-blue-400 text-sm transition-colors">Términos de Servicio</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-6xl mx-auto px-6 border-t border-gray-900 pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-gray-600 text-sm mb-4 md:mb-0">
            &copy; {new Date().getFullYear()} {config?.full_name || "Percy Acha Taipe"} (ATP Dev). {ui.allRights}
          </p>
          <div className="flex flex-wrap gap-4 text-sm font-semibold">
            {[
              { key: 'whatsapp', name: 'WhatsApp' },
              { key: 'telegram', name: 'Telegram' },
              { key: 'github', name: 'GitHub' },
              { key: 'linkedin', name: 'LinkedIn' },
              { key: 'twitter', name: 'Twitter' },
              { key: 'facebook', name: 'Facebook' },
              { key: 'instagram', name: 'Instagram' },
              { key: 'youtube', name: 'YouTube' },
              { key: 'tiktok', name: 'TikTok' },
              { key: 'discord', name: 'Discord' },
            ].map(social => {
              if (!config) return null;
              const enabledKey = `${social.key}_enabled` as keyof typeof config;
              const urlKey = `${social.key}_url` as keyof typeof config;
              if (!config[enabledKey] || !config[urlKey]) return null;
              return (
                <a
                  key={social.key}
                  href={config[urlKey] as string}
                  target="_blank"
                  rel="noreferrer"
                  className="text-gray-500 hover:text-blue-400 transition-colors"
                >
                  {social.name}
                </a>
              );
            })}
          </div>
        </div>
      </footer>
    </div>
  );
}
