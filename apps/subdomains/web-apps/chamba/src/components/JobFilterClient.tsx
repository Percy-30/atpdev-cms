"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Filter, Search, RotateCcw, Building2, MapPin, Award, GraduationCap, ArrowUpDown, EyeOff } from "lucide-react";

interface JobFilterClientProps {
  initialQ: string;
  initialRegion: string;
  initialRegimen: string;
  initialCategoria: string;
  initialEducacion: string;
  initialSort?: string;
  initialHideExpired?: boolean;
}

export function JobFilterClient({
  initialQ,
  initialRegion,
  initialRegimen,
  initialCategoria,
  initialEducacion,
  initialSort = "ending_soon",
  initialHideExpired = true,
}: JobFilterClientProps) {
  const router = useRouter();
  const [q, setQ] = useState(initialQ);
  const [region, setRegion] = useState(initialRegion);
  const [regimen, setRegimen] = useState(initialRegimen);
  const [categoria, setCategoria] = useState(initialCategoria);
  const [educacion, setEducacion] = useState(initialEducacion);
  const [sort, setSort] = useState(initialSort);
  const [hideExpired, setHideExpired] = useState(initialHideExpired);

  const applyFilters = (customParams?: Record<string, string>) => {
    const params = new URLSearchParams();
    const currentQ = customParams?.q !== undefined ? customParams.q : q;
    const currentRegion = customParams?.region !== undefined ? customParams.region : region;
    const currentRegimen = customParams?.regimen !== undefined ? customParams.regimen : regimen;
    const currentCategoria = customParams?.categoria !== undefined ? customParams.categoria : categoria;
    const currentEducacion = customParams?.educacion !== undefined ? customParams.educacion : educacion;
    const currentSort = customParams?.sort !== undefined ? customParams.sort : sort;
    const currentHide = customParams?.hide_expired !== undefined ? customParams.hide_expired : String(hideExpired);

    if (currentQ.trim()) params.set("q", currentQ.trim());
    if (currentRegion) params.set("region", currentRegion);
    if (currentRegimen) params.set("regimen", currentRegimen);
    if (currentCategoria) params.set("categoria", currentCategoria);
    if (currentEducacion) params.set("educacion", currentEducacion);
    if (currentSort && currentSort !== "ending_soon") params.set("sort", currentSort);
    if (currentHide === "false") params.set("hide_expired", "false");

    router.push(`/empleos?${params.toString()}`);
  };

  const handleReset = () => {
    setQ("");
    setRegion("");
    setRegimen("");
    setCategoria("");
    setEducacion("");
    setSort("ending_soon");
    setHideExpired(true);
    router.push("/empleos");
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <h3 className="font-display font-bold text-white flex items-center gap-2 text-base">
          <Filter size={18} className="text-emerald-400" />
          <span>Filtros de Búsqueda</span>
        </h3>
        {(q || region || regimen || categoria || educacion) && (
          <button
            onClick={handleReset}
            className="text-xs text-amber-400 hover:underline flex items-center gap-1 font-mono cursor-pointer"
          >
            <RotateCcw size={12} />
            <span>Limpiar</span>
          </button>
        )}
      </div>

      {/* Text Query Filter */}
      <div className="space-y-1.5">
        <label className="text-xs font-mono font-semibold text-slate-300">Palabra Clave</label>
        <div className="flex items-center gap-2 px-3 py-2 bg-slate-900 rounded-xl border border-white/10 text-white">
          <Search size={16} className="text-slate-400" />
          <input
            type="text"
            placeholder="Ej. SUNAT, Sistemas..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && applyFilters()}
            className="w-full bg-transparent text-xs text-white placeholder-slate-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Ordenar Convocatorias (Urgentes / Recientes / Salario / Vacantes) */}
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
          className="w-full p-2.5 bg-slate-900 text-xs text-slate-200 rounded-xl border border-white/10 focus:outline-none cursor-pointer"
        >
          <option value="ending_soon">🕒 Próximas a cerrar (Urgentes)</option>
          <option value="recent">🚀 Más recientes (Nuevas)</option>
          <option value="salary_desc">💰 Mayor salario (Sueldo alto)</option>
          <option value="vacancies_desc">👥 Convocatorias masivas (Más vacantes)</option>
        </select>
      </div>

      {/* Toggle Ocultar Convocatorias Finalizadas */}
      <div className="bg-slate-900/80 p-3 rounded-xl border border-white/10 flex items-center justify-between gap-3">
        <div className="space-y-0.5">
          <label htmlFor="hide-expired-chk" className="text-xs font-display font-bold text-slate-200 cursor-pointer block">
            Ocultar Vencidas
          </label>
          <span className="text-[10px] text-slate-400 block font-mono">
            {hideExpired ? "Solo ofertas activas" : "Mostrando activas y finalizadas"}
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

      {/* Régimen Laboral Filter */}
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
            const params = new URLSearchParams();
            if (q.trim()) params.set("q", q.trim());
            if (region) params.set("region", region);
            if (val) params.set("regimen", val);
            if (categoria) params.set("categoria", categoria);
            if (educacion) params.set("educacion", educacion);
            router.push(`/empleos?${params.toString()}`);
          }}
          className="w-full p-2.5 bg-slate-900 text-xs text-slate-200 rounded-xl border border-white/10 focus:outline-none cursor-pointer"
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

      {/* Región Filter */}
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
            const params = new URLSearchParams();
            if (q.trim()) params.set("q", q.trim());
            if (val) params.set("region", val);
            if (regimen) params.set("regimen", regimen);
            if (categoria) params.set("categoria", categoria);
            if (educacion) params.set("educacion", educacion);
            router.push(`/empleos?${params.toString()}`);
          }}
          className="w-full p-2.5 bg-slate-900 text-xs text-slate-200 rounded-xl border border-white/10 focus:outline-none cursor-pointer"
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

      {/* Nivel Educativo Filter */}
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
            const params = new URLSearchParams();
            if (q.trim()) params.set("q", q.trim());
            if (region) params.set("region", region);
            if (regimen) params.set("regimen", regimen);
            if (categoria) params.set("categoria", categoria);
            if (val) params.set("educacion", val);
            router.push(`/empleos?${params.toString()}`);
          }}
          className="w-full p-2.5 bg-slate-900 text-xs text-slate-200 rounded-xl border border-white/10 focus:outline-none cursor-pointer"
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

      {/* Rango de Sueldo Filter */}
      <div className="space-y-1.5">
        <label className="text-xs font-mono font-semibold text-slate-300 flex items-center gap-1">
          <span className="text-emerald-400 font-bold">S/</span>
          <span>Rango de Remuneración</span>
        </label>
        <select
          onChange={(e) => {
            const val = e.target.value;
            const params = new URLSearchParams();
            if (q.trim()) params.set("q", q.trim());
            if (region) params.set("region", region);
            if (regimen) params.set("regimen", regimen);
            if (categoria) params.set("categoria", categoria);
            if (educacion) params.set("educacion", educacion);
            if (val) params.set("sueldo", val);
            router.push(`/empleos?${params.toString()}`);
          }}
          className="w-full p-2.5 bg-slate-900 text-xs text-slate-200 rounded-xl border border-white/10 focus:outline-none cursor-pointer"
        >
          <option value="">Todas las Remuneraciones</option>
          <option value="1000-3000">S/ 1,025 — S/ 3,000 (Técnicos & Asistentes)</option>
          <option value="3000-6000">S/ 3,000 — S/ 6,000 (Especialistas & Analistas)</option>
          <option value="6000-15000">S/ 6,000+ (Jefaturas, FAG y Consultores)</option>
        </select>
      </div>

      {/* Apply Trigger Button */}
      <button
        onClick={() => applyFilters()}
        className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold font-display text-xs transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] cursor-pointer"
      >
        Aplicar Filtros
      </button>
    </div>
  );
}
