'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Building2, Briefcase, Users, Filter, ArrowRight, Sparkles, MapPin } from 'lucide-react';
import type { OrganizationItem, OrganizationCategory } from '@atpdev/database';

const CATEGORIES: OrganizationCategory[] = [
  'Todos',
  'Organismos Autónomos',
  'Ministerios',
  'Poder Judicial y Fiscalía',
  'Salud y Seguridad Social',
  'Reguladores y Fiscalización',
  'Gobiernos Regionales',
  'Municipalidades',
  'Universidades',
  'Empresas',
  'Otros'
];

interface Props {
  initialOrganizations: OrganizationItem[];
}

export default function OrganizationsClient({ initialOrganizations }: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<OrganizationCategory>('Todos');
  const [sortBy, setSortBy] = useState<'jobs' | 'vacancies' | 'name'>('jobs');
  const [displayCount, setDisplayCount] = useState(24);

  // Filtrado reactivo en tiempo real
  const filteredOrganizations = useMemo(() => {
    return initialOrganizations.filter(org => {
      // Filtro por categoría
      if (selectedCategory !== 'Todos' && org.category !== selectedCategory) {
        return false;
      }

      // Filtro por término de búsqueda
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase().trim();
        const matchesShort = org.shortName?.toLowerCase().includes(query);
        const matchesName = org.name?.toLowerCase().includes(query);
        const matchesRegions = org.regions?.some(r => r.toLowerCase().includes(query));
        const matchesCategory = org.category?.toLowerCase().includes(query);
        if (!matchesShort && !matchesName && !matchesRegions && !matchesCategory) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'jobs') return b.jobCount - a.jobCount;
      if (sortBy === 'vacancies') return b.vacanciesCount - a.vacanciesCount;
      if (sortBy === 'name') return (a.shortName || a.name).localeCompare(b.shortName || b.name);
      return 0;
    });
  }, [initialOrganizations, selectedCategory, searchTerm, sortBy]);

  const visibleOrgs = filteredOrganizations.slice(0, displayCount);

  return (
    <div className="space-y-8">
      {/* Controles: Buscador + Pestañas de Categoría */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Buscador de Entidad */}
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              value={searchTerm}
              onChange={e => {
                setSearchTerm(e.target.value);
                setDisplayCount(24);
              }}
              placeholder="Buscar por sigla, nombre de entidad o departamento (ej: SUNAT, MINEDU, Arequipa, Salud)..."
              className="w-full pl-11 pr-4 py-3.5 bg-slate-900/80 border border-white/10 rounded-2xl text-sm text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all shadow-inner"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white font-mono bg-white/5 px-2 py-1 rounded-md"
              >
                Limpiar
              </button>
            )}
          </div>

          {/* Selector de Orden */}
          <div className="flex items-center gap-2">
            <label className="text-xs font-mono text-slate-400 whitespace-nowrap">Ordenar:</label>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="bg-slate-900 border border-white/10 rounded-xl px-3 py-3 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 font-display font-bold"
            >
              <option value="jobs">Más Convocatorias</option>
              <option value="vacancies">Más Vacantes</option>
              <option value="name">Alfabético (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Pestañas de Categorías con Scroll Horizontal Fluido */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-white/10">
          {CATEGORIES.map(cat => {
            const isSelected = selectedCategory === cat;
            const count = cat === 'Todos'
              ? initialOrganizations.length
              : initialOrganizations.filter(o => o.category === cat).length;

            return (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setDisplayCount(24);
                }}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold font-display whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-500 text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.35)]'
                    : 'bg-slate-900/60 hover:bg-slate-800 text-slate-300 border border-white/5 hover:border-white/15'
                }`}
              >
                <span>{cat}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${isSelected ? 'bg-slate-950/20 text-slate-950' : 'bg-white/10 text-slate-400'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Resultados Informativos */}
      <div className="flex items-center justify-between text-xs text-slate-400 font-mono px-1">
        <span>
          Mostrando <strong className="text-white">{filteredOrganizations.length}</strong> entidades del Estado
          {selectedCategory !== 'Todos' && ` en ${selectedCategory}`}
          {searchTerm && ` para "${searchTerm}"`}
        </span>
      </div>

      {/* Grid de Organizaciones */}
      {filteredOrganizations.length === 0 ? (
        <div className="text-center py-20 rounded-3xl bg-slate-900/30 border border-white/5 space-y-4">
          <Building2 size={40} className="mx-auto text-slate-500" />
          <h3 className="text-lg font-bold text-white">No se encontraron entidades</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            No encontramos instituciones que coincidan con &quot;{searchTerm}&quot;. Intenta con otra palabra clave o revisa la categoría seleccionada.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('Todos');
            }}
            className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs"
          >
            Ver todas las entidades
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {visibleOrgs.map((org, idx) => {
            const queryTarget = org.shortName || org.name;
            const searchUrl = `/empleos?q=${encodeURIComponent(queryTarget)}`;

            return (
              <div
                key={`${org.id}-${idx}`}
                className="group relative rounded-2xl bg-gradient-to-b from-slate-900/80 to-slate-950/90 border border-white/10 p-5 hover:border-emerald-500/40 hover:shadow-[0_10px_30px_rgba(16,185,129,0.1)] transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-3.5">
                  {/* Fila Superior: Logo + Categoría */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="w-12 h-12 rounded-xl bg-slate-950 border border-white/10 flex items-center justify-center p-1.5 overflow-hidden shrink-0 shadow-md">
                      {org.logo ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={org.logo}
                          alt={org.shortName}
                          className="w-full h-full object-contain"
                          onError={(e) => {
                            // Fallback a iniciales si el logo no carga
                            (e.target as HTMLElement).style.display = 'none';
                            const parent = (e.target as HTMLElement).parentElement;
                            if (parent) {
                              parent.innerHTML = `<span class="text-xs font-black font-display text-emerald-400">${(org.shortName || org.name).slice(0, 3)}</span>`;
                            }
                          }}
                        />
                      ) : (
                        <span className="text-xs font-black font-display text-emerald-400">
                          {(org.shortName || org.name).slice(0, 3)}
                        </span>
                      )}
                    </div>

                    <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-slate-800/80 text-slate-300 border border-white/5 line-clamp-1">
                      {org.category}
                    </span>
                  </div>

                  {/* Título y Nombre Oficial */}
                  <div>
                    <h2 className="text-base font-bold font-display text-white group-hover:text-emerald-300 transition-colors flex items-center gap-1.5">
                      <span>{org.shortName}</span>
                      {org.featured && (
                        <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" title="Entidad destacada" />
                      )}
                    </h2>
                    <p className="text-xs text-slate-400 line-clamp-2 mt-0.5" title={org.name}>
                      {org.name}
                    </p>
                  </div>

                  {/* Sectores y Regiones */}
                  <div className="flex flex-wrap gap-1.5 text-[10px] font-mono">
                    {org.sectors.slice(0, 2).map((s) => (
                      <span key={s} className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                        {s}
                      </span>
                    ))}
                    {org.regions && org.regions.length > 0 && (
                      <span className="px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 flex items-center gap-1">
                        <MapPin size={10} />
                        <span>{org.regions.slice(0, 2).join(', ')}{org.regions.length > 2 ? ` +${org.regions.length - 2}` : ''}</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Pie de Tarjeta: Métricas + Botón de Ver Convocatorias */}
                <div className="pt-4 mt-4 border-t border-white/5 flex items-center justify-between gap-2">
                  <div className="text-xs">
                    <span className="text-emerald-400 font-bold font-display text-sm">
                      {org.jobCount}
                    </span>
                    <span className="text-slate-400 text-[11px] ml-1">
                      {org.jobCount === 1 ? 'proceso' : 'procesos'}
                    </span>
                    <span className="text-slate-500 mx-1.5">•</span>
                    <span className="text-slate-300 font-mono text-[11px]">
                      {org.vacanciesCount} {org.vacanciesCount === 1 ? 'plaza' : 'plazas'}
                    </span>
                  </div>

                  <Link
                    href={searchUrl}
                    className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-emerald-500 hover:text-slate-950 text-slate-300 text-xs font-bold font-display transition-all flex items-center gap-1.5 border border-white/10 hover:border-emerald-400"
                  >
                    <span>Ver</span>
                    <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Botón Cargar Más Entidades */}
      {filteredOrganizations.length > displayCount && (
        <div className="text-center pt-6">
          <button
            onClick={() => setDisplayCount(prev => prev + 24)}
            className="px-6 py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-white/10 text-slate-200 text-xs font-bold font-display transition-all shadow-lg hover:border-emerald-500/40 cursor-pointer"
          >
            Cargar más entidades ({filteredOrganizations.length - displayCount} restantes)
          </button>
        </div>
      )}
    </div>
  );
}
