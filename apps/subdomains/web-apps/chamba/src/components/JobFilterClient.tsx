"use client";

import { useState, useEffect, useRef, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Filter, Search, RotateCcw, Award, MapPin, GraduationCap, ArrowUpDown, CheckCircle2, X, SlidersHorizontal, ChevronDown } from "lucide-react";

interface JobFilterClientProps {
  initialQ: string;
  initialRegion: string;
  initialRegimen: string;
  initialCategoria: string;
  initialEducacion: string;
  initialSueldo?: string;
  initialSort?: string;
  initialHideExpired?: boolean;
}

export function JobFilterClient({
  initialQ,
  initialRegion,
  initialRegimen,
  initialCategoria,
  initialEducacion,
  initialSueldo = "",
  initialSort = "ending_soon",
  initialHideExpired = true,
}: JobFilterClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [q, setQ] = useState(initialQ);
  const [region, setRegion] = useState(initialRegion);
  const [regimen, setRegimen] = useState(initialRegimen);
  const [categoria, setCategoria] = useState(initialCategoria);
  const [educacion, setEducacion] = useState(initialEducacion);
  const [sueldo, setSueldo] = useState(initialSueldo);
  const [sort, setSort] = useState(initialSort);
  const [hideExpired, setHideExpired] = useState(initialHideExpired);

  // Synchronize state if props change from URL navigation
  useEffect(() => {
    setQ(initialQ);
    setRegion(initialRegion);
    setRegimen(initialRegimen);
    setCategoria(initialCategoria);
    setEducacion(initialEducacion);
    setSueldo(initialSueldo);
    setSort(initialSort);
    setHideExpired(initialHideExpired);
  }, [initialQ, initialRegion, initialRegimen, initialCategoria, initialEducacion, initialSueldo, initialSort, initialHideExpired]);

  const applyFilters = (customParams?: Record<string, string>) => {
    const params = new URLSearchParams();
    const currentQ = customParams?.q !== undefined ? customParams.q : q;
    const currentRegion = customParams?.region !== undefined ? customParams.region : region;
    const currentRegimen = customParams?.regimen !== undefined ? customParams.regimen : regimen;
    const currentCategoria = customParams?.categoria !== undefined ? customParams.categoria : categoria;
    const currentEducacion = customParams?.educacion !== undefined ? customParams.educacion : educacion;
    const currentSueldo = customParams?.sueldo !== undefined ? customParams.sueldo : sueldo;
    const currentSort = customParams?.sort !== undefined ? customParams.sort : sort;
    const currentHide = customParams?.hide_expired !== undefined ? customParams.hide_expired : String(hideExpired);

    if (currentQ.trim()) params.set("q", currentQ.trim());
    if (currentRegion) params.set("region", currentRegion);
    if (currentRegimen) params.set("regimen", currentRegimen);
    if (currentCategoria) params.set("categoria", currentCategoria);
    if (currentEducacion) params.set("educacion", currentEducacion);
    if (currentSueldo) params.set("sueldo", currentSueldo);
    if (currentSort && currentSort !== "ending_soon") params.set("sort", currentSort);
    if (currentHide === "false") params.set("hide_expired", "false");

    startTransition(() => {
      router.push(`/empleos?${params.toString()}`);
    });
  };

  // Debounced live search for keyword input
  const isInitialMount = useRef(true);
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    const timer = setTimeout(() => {
      if (q !== initialQ) {
        applyFilters({ q });
      }
    }, 450);
    return () => clearTimeout(timer);
  }, [q]);

  const handleReset = () => {
    setQ("");
    setRegion("");
    setRegimen("");
    setCategoria("");
    setEducacion("");
    setSueldo("");
    setSort("ending_soon");
    setHideExpired(true);
    startTransition(() => {
      router.push("/empleos");
    });
  };

  const [isMobileExpanded, setIsMobileExpanded] = useState(false);
  const hasAdvancedFilters = Boolean(region || educacion || sueldo || sort !== "ending_soon" || !hideExpired);

  const hasActiveFilters = Boolean(
    q || region || regimen || categoria || educacion || sueldo || sort !== "ending_soon" || !hideExpired
  );

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <h3 className="font-display font-bold text-white flex items-center gap-2 text-base">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <Filter size={16} />
          </div>
          <span>Filtros de Búsqueda</span>
          {isPending && (
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping ml-1 inline-block" />
          )}
        </h3>
        {hasActiveFilters && (
          <button
            onClick={handleReset}
            className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-mono cursor-pointer transition-colors px-2 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 hover:border-amber-500/40"
            title="Restablecer todos los filtros"
          >
            <RotateCcw size={12} />
            <span>Limpiar</span>
          </button>
        )}
      </div>

      {/* Quick Pills for 1-Click Filtering */}
      <div className="space-y-1.5">
        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-semibold block">Filtros Rápidos</span>
        <div className="flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => {
              const next = regimen === "CAS 1057" ? "" : "CAS 1057";
              setRegimen(next);
              applyFilters({ regimen: next });
            }}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
              regimen === "CAS 1057"
                ? "bg-amber-500/25 text-amber-300 border border-amber-500/50 shadow-[0_0_12px_rgba(245,158,11,0.25)]"
                : "bg-slate-900/80 text-slate-400 border border-white/10 hover:border-white/20 hover:text-white"
            }`}
          >
            CAS
          </button>
          <button
            type="button"
            onClick={() => {
              const next = regimen === "D.L. 728" ? "" : "D.L. 728";
              setRegimen(next);
              applyFilters({ regimen: next });
            }}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
              regimen === "D.L. 728"
                ? "bg-emerald-500/25 text-emerald-300 border border-emerald-500/50 shadow-[0_0_12px_rgba(16,185,129,0.25)]"
                : "bg-slate-900/80 text-slate-400 border border-white/10 hover:border-white/20 hover:text-white"
            }`}
          >
            728
          </button>
          <button
            type="button"
            onClick={() => {
              const next = region === "Lima" ? "" : "Lima";
              setRegion(next);
              applyFilters({ region: next });
            }}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
              region === "Lima"
                ? "bg-purple-500/25 text-purple-300 border border-purple-500/50 shadow-[0_0_12px_rgba(168,85,247,0.25)]"
                : "bg-slate-900/80 text-slate-400 border border-white/10 hover:border-white/20 hover:text-white"
            }`}
          >
            Lima
          </button>
          <button
            type="button"
            onClick={() => {
              const next = sueldo === "3000-6000" ? "" : "3000-6000";
              setSueldo(next);
              applyFilters({ sueldo: next });
            }}
            className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
              sueldo === "3000-6000"
                ? "bg-cyan-500/25 text-cyan-300 border border-cyan-500/50 shadow-[0_0_12px_rgba(6,182,212,0.25)]"
                : "bg-slate-900/80 text-slate-400 border border-white/10 hover:border-white/20 hover:text-white"
            }`}
          >
            S/. 3K+
          </button>
        </div>
      </div>

      {/* Instant Feedback Banner */}
      <div className="flex items-center justify-between px-3.5 py-2 bg-gradient-to-r from-emerald-500/10 via-emerald-500/5 to-transparent border border-emerald-500/25 rounded-xl text-[11px] font-mono text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.08)]">
        <span className="flex items-center gap-2">
          <CheckCircle2 size={13} className="text-emerald-400 shrink-0" />
          <span>{isPending ? "Actualizando resultados..." : "Filtro dinámico activo"}</span>
        </span>
        {isPending && <span className="animate-spin text-xs">⏳</span>}
      </div>

      {/* Text Query Filter (Debounced) */}
      <div className="space-y-1.5">
        <label className="text-xs font-mono font-semibold text-slate-300 flex items-center justify-between">
          <span>Palabra Clave</span>
          {q && <span className="text-[10px] text-emerald-400 font-mono">Buscando</span>}
        </label>
        <div className="flex items-center gap-2.5 px-3.5 py-2.5 bg-slate-950/80 rounded-xl border border-white/10 text-white focus-within:border-emerald-500/50 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all">
          <Search size={16} className="text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Ej. SUNAT, Sistemas, Salud..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                applyFilters({ q });
              }
            }}
            className="w-full bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none"
          />
          {q && (
            <button
              onClick={() => {
                setQ("");
                applyFilters({ q: "" });
              }}
              className="text-slate-400 hover:text-white p-0.5"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Mobile Accordion Toggle for Advanced Filters */}
      <div className="lg:hidden">
        <button
          type="button"
          onClick={() => setIsMobileExpanded(!isMobileExpanded)}
          className={`w-full py-2.5 px-3.5 rounded-xl border text-xs font-mono font-semibold flex items-center justify-between transition-all cursor-pointer ${
            hasAdvancedFilters || isMobileExpanded
              ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.15)]"
              : "bg-slate-950/80 border-white/10 text-slate-300 hover:text-white hover:border-white/20"
          }`}
        >
          <span className="flex items-center gap-2">
            <SlidersHorizontal size={14} className="text-emerald-400 shrink-0" />
            <span>Filtros avanzados (Región, Sueldo, Nivel)</span>
          </span>
          <span className="flex items-center gap-1.5 font-mono text-[10px]">
            {hasAdvancedFilters && (
              <span className="px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-bold">
                Activos
              </span>
            )}
            <ChevronDown size={15} className={`transition-transform duration-200 ${isMobileExpanded ? "rotate-180" : ""}`} />
          </span>
        </button>
      </div>

      {/* Advanced Dropdowns (Always open on desktop lg:block, collapsible on mobile) */}
      <div className={`space-y-5 ${isMobileExpanded ? "block" : "hidden lg:block"}`}>
        {/* Ordenar Convocatorias (Instant Auto-Apply) */}
        <div className="space-y-1.5">
          <label className="text-xs font-mono font-semibold text-slate-300 flex items-center gap-1.5">
            <ArrowUpDown size={14} className="text-emerald-400" />
            <span>Ordenar Resultados</span>
          </label>
          <select
            value={sort}
            onChange={(e) => {
              const val = e.target.value;
              setSort(val);
              applyFilters({ sort: val });
            }}
            className="w-full p-2.5 bg-slate-950/80 text-xs text-slate-200 rounded-xl border border-white/10 focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 cursor-pointer transition-all"
          >
            <option value="ending_soon" className="bg-slate-900 text-white">🕒 Próximas a cerrar (Urgentes)</option>
            <option value="recent" className="bg-slate-900 text-white">🚀 Más recientes (Nuevas)</option>
            <option value="salary_desc" className="bg-slate-900 text-white">💰 Mayor salario (Sueldo alto)</option>
            <option value="vacancies_desc" className="bg-slate-900 text-white">👥 Convocatorias masivas (Más vacantes)</option>
          </select>
        </div>

        {/* Toggle Ocultar Convocatorias Finalizadas (Instant Auto-Apply) */}
        <label 
          htmlFor="hide-expired-chk"
          className="bg-slate-950/80 p-3 rounded-xl border border-white/10 flex items-center justify-between gap-3 cursor-pointer hover:border-white/20 transition-all"
        >
          <div className="space-y-0.5 select-none">
            <span className="text-xs font-display font-bold text-slate-200 block">
              Ocultar Vencidas
            </span>
            <span className="text-[10px] text-slate-400 block font-mono">
              {hideExpired ? "Solo ofertas activas" : "Mostrando activas y concluidas"}
            </span>
          </div>
          <input
            id="hide-expired-chk"
            type="checkbox"
            checked={hideExpired}
            onChange={(e) => {
              const checked = e.target.checked;
              setHideExpired(checked);
              applyFilters({ hide_expired: checked ? "true" : "false" });
            }}
            className="w-4 h-4 rounded border-gray-700 bg-slate-800 text-emerald-500 focus:ring-emerald-500/20 cursor-pointer accent-emerald-500"
          />
        </label>

        {/* Régimen Laboral Filter (Instant Auto-Apply) */}
        <div className="space-y-1.5">
          <label className="text-xs font-mono font-semibold text-slate-300 flex items-center gap-1.5">
            <Award size={14} className="text-amber-400" />
            <span>Régimen Laboral</span>
          </label>
          <select
            value={regimen}
            onChange={(e) => {
              const val = e.target.value;
              setRegimen(val);
              applyFilters({ regimen: val });
            }}
            className="w-full p-2.5 bg-slate-950/80 text-xs text-slate-200 rounded-xl border border-white/10 focus:outline-none focus:border-amber-500/50 focus:ring-2 focus:ring-amber-500/20 cursor-pointer transition-all"
          >
            <option value="" className="bg-slate-900 text-white">Todos los Regímenes</option>
            <option value="CAS 1057" className="bg-slate-900 text-white">CAS (D.L. 1057)</option>
            <option value="D.L. 728" className="bg-slate-900 text-white">D.L. 728 (Planilla Privada/Pública)</option>
            <option value="D.L. 276" className="bg-slate-900 text-white">D.L. 276 (Carrera Administrativa)</option>
            <option value="Locación / FAG" className="bg-slate-900 text-white">Locación / FAG</option>
            <option value="Privado" className="bg-slate-900 text-white">Sector Privado</option>
            <option value="Prácticas" className="bg-slate-900 text-white">Prácticas Pre/Profesionales</option>
          </select>
        </div>

        {/* Región Filter (Instant Auto-Apply) */}
        <div className="space-y-1.5">
          <label className="text-xs font-mono font-semibold text-slate-300 flex items-center gap-1.5">
            <MapPin size={14} className="text-purple-400" />
            <span>Región / Departamento</span>
          </label>
          <select
            value={region}
            onChange={(e) => {
              const val = e.target.value;
              setRegion(val);
              applyFilters({ region: val });
            }}
            className="w-full p-2.5 bg-slate-950/80 text-xs text-slate-200 rounded-xl border border-white/10 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 cursor-pointer transition-all"
          >
            <option value="" className="bg-slate-900 text-white">Todas las Regiones (25 Departamentos)</option>
            <option value="Amazonas" className="bg-slate-900 text-white">Amazonas</option>
            <option value="Áncash" className="bg-slate-900 text-white">Áncash</option>
            <option value="Apurímac" className="bg-slate-900 text-white">Apurímac</option>
            <option value="Arequipa" className="bg-slate-900 text-white">Arequipa</option>
            <option value="Ayacucho" className="bg-slate-900 text-white">Ayacucho</option>
            <option value="Cajamarca" className="bg-slate-900 text-white">Cajamarca</option>
            <option value="Callao" className="bg-slate-900 text-white">Callao</option>
            <option value="Cusco" className="bg-slate-900 text-white">Cusco</option>
            <option value="Huancavelica" className="bg-slate-900 text-white">Huancavelica</option>
            <option value="Huánuco" className="bg-slate-900 text-white">Huánuco</option>
            <option value="Ica" className="bg-slate-900 text-white">Ica</option>
            <option value="Junín" className="bg-slate-900 text-white">Junín</option>
            <option value="La Libertad" className="bg-slate-900 text-white">La Libertad</option>
            <option value="Lambayeque" className="bg-slate-900 text-white">Lambayeque</option>
            <option value="Lima" className="bg-slate-900 text-white">Lima & Callao</option>
            <option value="Loreto" className="bg-slate-900 text-white">Loreto</option>
            <option value="Madre de Dios" className="bg-slate-900 text-white">Madre de Dios</option>
            <option value="Moquegua" className="bg-slate-900 text-white">Moquegua</option>
            <option value="Pasco" className="bg-slate-900 text-white">Pasco</option>
            <option value="Piura" className="bg-slate-900 text-white">Piura</option>
            <option value="Puno" className="bg-slate-900 text-white">Puno</option>
            <option value="San Martín" className="bg-slate-900 text-white">San Martín</option>
            <option value="Tacna" className="bg-slate-900 text-white">Tacna</option>
            <option value="Tumbes" className="bg-slate-900 text-white">Tumbes</option>
            <option value="Ucayali" className="bg-slate-900 text-white">Ucayali</option>
            <option value="Nacional / Remoto" className="bg-slate-900 text-white">Nacional / Remoto</option>
          </select>
        </div>

        {/* Nivel Educativo Filter (Instant Auto-Apply) */}
        <div className="space-y-1.5">
          <label className="text-xs font-mono font-semibold text-slate-300 flex items-center gap-1.5">
            <GraduationCap size={14} className="text-cyan-400" />
            <span>Nivel Educativo</span>
          </label>
          <select
            value={educacion}
            onChange={(e) => {
              const val = e.target.value;
              setEducacion(val);
              applyFilters({ educacion: val });
            }}
            className="w-full p-2.5 bg-slate-950/80 text-xs text-slate-200 rounded-xl border border-white/10 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 cursor-pointer transition-all"
          >
            <option value="" className="bg-slate-900 text-white">Todos los Niveles</option>
            <option value="Secundaria" className="bg-slate-900 text-white">Secundaria</option>
            <option value="Técnico" className="bg-slate-900 text-white">Técnico</option>
            <option value="Egresado" className="bg-slate-900 text-white">Egresado</option>
            <option value="Bachiller" className="bg-slate-900 text-white">Bachiller</option>
            <option value="Titulado" className="bg-slate-900 text-white">Titulado</option>
            <option value="Maestría / Doctorado" className="bg-slate-900 text-white">Maestría / Doctorado</option>
          </select>
        </div>

        {/* Rango de Sueldo Filter (Instant Auto-Apply) */}
        <div className="space-y-1.5">
          <label className="text-xs font-mono font-semibold text-slate-300 flex items-center gap-1.5">
            <span className="text-emerald-400 font-bold font-mono">S/</span>
            <span>Rango de Remuneración</span>
          </label>
          <select
            value={sueldo}
            onChange={(e) => {
              const val = e.target.value;
              setSueldo(val);
              applyFilters({ sueldo: val });
            }}
            className="w-full p-2.5 bg-slate-950/80 text-xs text-slate-200 rounded-xl border border-white/10 focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 cursor-pointer transition-all"
          >
            <option value="" className="bg-slate-900 text-white">Todas las Remuneraciones</option>
            <option value="1000-3000" className="bg-slate-900 text-white">S/ 1,025 — S/ 3,000 (Técnicos & Asistentes)</option>
            <option value="3000-6000" className="bg-slate-900 text-white">S/ 3,000 — S/ 6,000 (Especialistas & Analistas)</option>
            <option value="6000-15000" className="bg-slate-900 text-white">S/ 6,000+ (Jefaturas, FAG y Consultores)</option>
          </select>
        </div>
      </div>

      {/* Action Footer: Reset */}
      {hasActiveFilters && (
        <button
          onClick={handleReset}
          className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white font-semibold font-display text-xs transition-all border border-white/15 hover:border-amber-500/30 cursor-pointer flex items-center justify-center gap-2 shadow-sm"
        >
          <RotateCcw size={13} className="text-amber-400" />
          <span>Restablecer Filtros</span>
        </button>
      )}
    </div>
  );
}
