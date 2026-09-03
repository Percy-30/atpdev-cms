"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Building2, Briefcase, Award, TrendingUp } from "lucide-react";

interface JobSearchHeroProps {
  totalJobs: number;
  totalVacancies: number;
}

export function JobSearchHero({ totalJobs, totalVacancies }: JobSearchHeroProps) {
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (region) params.set("region", region);
    router.push(`/empleos?${params.toString()}`);
  };

  return (
    <div className="relative pt-12 pb-16 px-4 sm:px-6 lg:px-8 border-b border-white/10 overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-[#0b0f19]">
      {/* Glow Ambient Lights */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-emerald-500/10 blur-[120px] pointer-events-none rounded-full" />
      <div className="absolute top-1/3 right-10 w-[300px] h-[200px] bg-amber-500/10 blur-[100px] pointer-events-none rounded-full" />

      <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
        {/* Domain, Verified Pill Badge & Live Status Indicator */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>Plataforma Oficial Agregadora — chamba.atpdev.dev</span>
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-semibold">
            <span>✨ Sincronizado Automáticamente — Convocatorias Reales & Verificadas</span>
          </div>
        </div>

        {/* Main Headline */}
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black font-display tracking-tight text-white leading-tight">
            Encuentra tu próxima <span className="title-neon-glow underline decoration-emerald-500/50">chamba</span> verificada en Perú
          </h1>
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Consolidamos las mejores ofertas laborales del sector público (CAS, 728, 276) y empresas privadas líderes. Redirección directa y transparente a la fuente oficial.
          </p>
        </div>

        {/* Live Search Engine Bar */}
        <form onSubmit={handleSearch} className="glass-card p-3 rounded-2xl border border-white/15 shadow-2xl space-y-3 sm:space-y-0 sm:flex items-center gap-3">
          <div className="flex-1 flex items-center gap-3 px-3 py-2 bg-slate-900/80 rounded-xl border border-white/10 text-white">
            <Search size={20} className="text-slate-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="Puesto, institución o palabra clave (ej. Sistemas, SUNAT, Contador)..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-transparent text-sm sm:text-base text-white placeholder-slate-400 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 px-3 py-2 bg-slate-900/80 rounded-xl border border-white/10 text-white sm:w-48">
            <MapPin size={18} className="text-slate-400 flex-shrink-0" />
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="w-full bg-transparent text-sm text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="" className="bg-slate-900 text-slate-200">Todas las Regiones (25 Departamentos)</option>
              <option value="Amazonas" className="bg-slate-900 text-slate-200">Amazonas</option>
              <option value="Áncash" className="bg-slate-900 text-slate-200">Áncash</option>
              <option value="Apurímac" className="bg-slate-900 text-slate-200">Apurímac</option>
              <option value="Arequipa" className="bg-slate-900 text-slate-200">Arequipa</option>
              <option value="Ayacucho" className="bg-slate-900 text-slate-200">Ayacucho</option>
              <option value="Cajamarca" className="bg-slate-900 text-slate-200">Cajamarca</option>
              <option value="Callao" className="bg-slate-900 text-slate-200">Callao</option>
              <option value="Cusco" className="bg-slate-900 text-slate-200">Cusco</option>
              <option value="Huancavelica" className="bg-slate-900 text-slate-200">Huancavelica</option>
              <option value="Huánuco" className="bg-slate-900 text-slate-200">Huánuco</option>
              <option value="Ica" className="bg-slate-900 text-slate-200">Ica</option>
              <option value="Junín" className="bg-slate-900 text-slate-200">Junín</option>
              <option value="La Libertad" className="bg-slate-900 text-slate-200">La Libertad</option>
              <option value="Lambayeque" className="bg-slate-900 text-slate-200">Lambayeque</option>
              <option value="Lima" className="bg-slate-900 text-slate-200">Lima & Callao</option>
              <option value="Loreto" className="bg-slate-900 text-slate-200">Loreto</option>
              <option value="Madre de Dios" className="bg-slate-900 text-slate-200">Madre de Dios</option>
              <option value="Moquegua" className="bg-slate-900 text-slate-200">Moquegua</option>
              <option value="Pasco" className="bg-slate-900 text-slate-200">Pasco</option>
              <option value="Piura" className="bg-slate-900 text-slate-200">Piura</option>
              <option value="Puno" className="bg-slate-900 text-slate-200">Puno</option>
              <option value="San Martín" className="bg-slate-900 text-slate-200">San Martín</option>
              <option value="Tacna" className="bg-slate-900 text-slate-200">Tacna</option>
              <option value="Tumbes" className="bg-slate-900 text-slate-200">Tumbes</option>
              <option value="Ucayali" className="bg-slate-900 text-slate-200">Ucayali</option>
              <option value="Nacional / Remoto" className="bg-slate-900 text-slate-200">Nacional / Remoto</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold font-display text-sm transition-all shadow-[0_0_20px_rgba(16,185,129,0.4)] flex items-center justify-center gap-2 cursor-pointer flex-shrink-0"
          >
            <Search size={18} />
            <span>Buscar Ofertas</span>
          </button>
        </form>

        {/* Trending Search Tags Row */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-mono text-slate-400">
          <span className="flex items-center gap-1 text-amber-400 font-bold">
            <TrendingUp size={14} />
            <span>Tendencias:</span>
          </span>
          {[
            { tag: 'SUNAT 2026', q: 'SUNAT' },
            { tag: 'ONPE ERM', q: 'ONPE' },
            { tag: 'CAS 1057', q: 'CAS' },
            { tag: 'Bachilleres', q: 'Bachiller' },
            { tag: 'Prácticas BCRP', q: 'BCRP' },
            { tag: 'Sueldos S/ 5,000+', q: '5000' },
          ].map((item) => (
            <button
              key={item.tag}
              type="button"
              onClick={() => router.push(`/empleos?q=${encodeURIComponent(item.q)}`)}
              className="px-2.5 py-1 rounded-lg bg-slate-900/80 border border-white/10 hover:border-emerald-500/40 text-slate-300 hover:text-emerald-400 transition-colors cursor-pointer"
            >
              #{item.tag}
            </button>
          ))}
        </div>

        {/* IBM Plex Mono Live Statistics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-white/5">
          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-bold font-mono text-emerald-400 flex items-center justify-center gap-1">
              <span>{totalJobs}</span>
            </div>
            <p className="text-xs text-slate-400 font-mono uppercase tracking-wider">Ofertas Activas</p>
          </div>
          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-bold font-mono text-amber-400 flex items-center justify-center gap-1">
              <span>{totalVacancies}</span>
            </div>
            <p className="text-xs text-slate-400 font-mono uppercase tracking-wider">Vacantes Totales</p>
          </div>
          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-bold font-mono text-cyan-400 flex items-center justify-center gap-1">
              <span>100%</span>
            </div>
            <p className="text-xs text-slate-400 font-mono uppercase tracking-wider">RUCs Verificados</p>
          </div>
          <div className="space-y-1">
            <div className="text-2xl sm:text-3xl font-bold font-mono text-purple-400 flex items-center justify-center gap-1">
              <span>0 S/</span>
            </div>
            <p className="text-xs text-slate-400 font-mono uppercase tracking-wider">Costo Postulante</p>
          </div>
        </div>
      </div>
    </div>
  );
}
