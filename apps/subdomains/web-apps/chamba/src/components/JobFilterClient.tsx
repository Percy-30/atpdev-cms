"use client";

import { useState, useEffect, useRef, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Filter, Search, RotateCcw, Award, MapPin, GraduationCap, ArrowUpDown, CheckCircle2, X } from "lucide-react";

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

  const hasActiveFilters = Boolean(
    q || region || regimen || categoria || educacion || sueldo || sort !== "ending_soon" || !hideExpired
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <h3 className="font-display font-bold text-white flex items-center gap-2 text-base">
          <Filter size={18} className="text-emerald-400" />
          <span>Filtros de Búsqueda</span>
          {isPending && (
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping ml-1 inline-block" />
          )}
        </h3>
        {hasActiveFilters && (
          <button
            onClick={handleReset}
            className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-mono cursor-pointer transition-colors"
            title="Restablecer todos los filtros"
          >
            <RotateCcw size={12} />
            <span>Limpiar</span>
          </button>
        )}
      </div>

      {/* Instant Feedback Banner */}
      <div className="flex items-center justify-between px-3 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-[11px] font-mono text-emerald-300">
        <span className="flex items-center gap-1.5">
          <CheckCircle2 size={13} className="text-emerald-400" />
          <span>{isPending ? "Actualizando resultados..." : "Filtrado automático activo"}</span>
        </span>
        {isPending && <span className="animate-spin text-xs">⏳</span>}
      </div>

      {/* Text Query Filter (Debounced) */}
      <div className="space-y-1.5">
        <label className="text-xs font-mono font-semibold text-slate-300">Palabra Clave</label>
        <div className="flex items-center gap-2 px-3 py-2 bg-slate-900 rounded-xl border border-white/10 text-white focus-within:border-emerald-500/50 transition-colors">
          <Search size={16} className="text-slate-400" />
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
              className="text-slate-400 hover:text-white"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Ordenar Convocatorias (Instant Auto-Apply) */}
      <div className="space-y-1.5">
        <label className="text-xs font-mono font-semibold text-slate-300 flex items-center gap-1">
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
          className="w-full p-2.5 bg-slate-900 text-xs text-slate-200 rounded-xl border border-white/10 focus:outline-none focus:border-emerald-500/50 cursor-pointer transition-colors"
        >
          <option value="ending_soon">🕒 Próximas a cerrar (Urgentes)</option>
          <option value="recent">🚀 Más recientes (Nuevas)</option>
          <option value="salary_desc">💰 Mayor salario (Sueldo alto)</option>
          <option value="vacancies_desc">👥 Convocatorias masivas (Más vacantes)</option>
        </select>
      </div>

      {/* Toggle Ocultar Convocatorias Finalizadas (Instant Auto-Apply) */}
      <div className="bg-slate-900/80 p-3 rounded-xl border border-white/10 flex items-center justify-between gap-3">
        <div className="space-y-0.5">
          <label htmlFor="hide-expired-chk" className="text-xs font-display font-bold text-slate-200 cursor-pointer block">
            Ocultar Vencidas
          </label>
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
          className="w-4 h-4 rounded border-gray-700 bg-slate-800 text-emerald-500 focus:ring-emerald-500/20 cursor-pointer"
        />
      </div>

      {/* Régimen Laboral Filter (Instant Auto-Apply) */}
      <div className="space-y-1.5">
        <label className="text-xs font-mono font-semibold text-slate-300 flex items-center gap-1">
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
          className="w-full p-2.5 bg-slate-900 text-xs text-slate-200 rounded-xl border border-white/10 focus:outline-none focus:border-amber-500/50 cursor-pointer transition-colors"
        >
          <option value="">Todos los Regímenes</option>
          <option value="CAS 1057">CAS (D.L. 1057)</option>
          <option value="D.L. 728">D.L. 728 (Planilla Privada/Pública)</option>
          <option value="D.L. 276">D.L. 276 (Carrera Administrativa)</option>
          <option value="Locación / FAG">Locación / FAG</option>
          <option value="Privado">Sector Privado</option>
          <option value="Prácticas">Prácticas Pre/Profesionales</option>
        </select>
      </div>

      {/* Región Filter (Instant Auto-Apply) */}
      <div className="space-y-1.5">
        <label className="text-xs font-mono font-semibold text-slate-300 flex items-center gap-1">
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
          className="w-full p-2.5 bg-slate-900 text-xs text-slate-200 rounded-xl border border-white/10 focus:outline-none focus:border-purple-500/50 cursor-pointer transition-colors"
        >
          <option value="">Todas las Regiones (25 Departamentos)</option>
          <option value="Amazonas">Amazonas</option>
          <option value="Áncash">Áncash</option>
          <option value="Apurímac">Apurímac</option>
          <option value="Arequipa">Arequipa</option>
          <option value="Ayacucho">Ayacucho</option>
          <option value="Cajamarca">Cajamarca</option>
          <option value="Callao">Callao</option>
          <option value="Cusco">Cusco</option>
          <option value="Huancavelica">Huancavelica</option>
          <option value="Huánuco">Huánuco</option>
          <option value="Ica">Ica</option>
          <option value="Junín">Junín</option>
          <option value="La Libertad">La Libertad</option>
          <option value="Lambayeque">Lambayeque</option>
          <option value="Lima">Lima & Callao</option>
          <option value="Loreto">Loreto</option>
          <option value="Madre de Dios">Madre de Dios</option>
          <option value="Moquegua">Moquegua</option>
          <option value="Pasco">Pasco</option>
          <option value="Piura">Piura</option>
          <option value="Puno">Puno</option>
          <option value="San Martín">San Martín</option>
          <option value="Tacna">Tacna</option>
          <option value="Tumbes">Tumbes</option>
          <option value="Ucayali">Ucayali</option>
          <option value="Nacional / Remoto">Nacional / Remoto</option>
        </select>
      </div>

      {/* Nivel Educativo Filter (Instant Auto-Apply) */}
      <div className="space-y-1.5">
        <label className="text-xs font-mono font-semibold text-slate-300 flex items-center gap-1">
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
          className="w-full p-2.5 bg-slate-900 text-xs text-slate-200 rounded-xl border border-white/10 focus:outline-none focus:border-cyan-500/50 cursor-pointer transition-colors"
        >
          <option value="">Todos los Niveles</option>
          <option value="Secundaria">Secundaria</option>
          <option value="Técnico">Técnico</option>
          <option value="Egresado">Egresado</option>
          <option value="Bachiller">Bachiller</option>
          <option value="Titulado">Titulado</option>
          <option value="Maestría / Doctorado">Maestría / Doctorado</option>
        </select>
      </div>

      {/* Rango de Sueldo Filter (Instant Auto-Apply) */}
      <div className="space-y-1.5">
        <label className="text-xs font-mono font-semibold text-slate-300 flex items-center gap-1">
          <span className="text-emerald-400 font-bold">S/</span>
          <span>Rango de Remuneración</span>
        </label>
        <select
          value={sueldo}
          onChange={(e) => {
            const val = e.target.value;
            setSueldo(val);
            applyFilters({ sueldo: val });
          }}
          className="w-full p-2.5 bg-slate-900 text-xs text-slate-200 rounded-xl border border-white/10 focus:outline-none focus:border-emerald-500/50 cursor-pointer transition-colors"
        >
          <option value="">Todas las Remuneraciones</option>
          <option value="1000-3000">S/ 1,025 — S/ 3,000 (Técnicos & Asistentes)</option>
          <option value="3000-6000">S/ 3,000 — S/ 6,000 (Especialistas & Analistas)</option>
          <option value="6000-15000">S/ 6,000+ (Jefaturas, FAG y Consultores)</option>
        </select>
      </div>

      {/* Action Footer: Reset or status */}
      {hasActiveFilters && (
        <button
          onClick={handleReset}
          className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold font-display text-xs transition-all border border-white/10 cursor-pointer flex items-center justify-center gap-2"
        >
          <RotateCcw size={13} />
          <span>Restablecer Filtros</span>
        </button>
      )}
    </div>
  );
}
