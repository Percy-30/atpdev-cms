'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, ChevronRight } from 'lucide-react';

const REGIONES = [
  { name: 'Lima', slug: 'lima', label: 'Lima & Callao', count: '120+ Vacantes' },
  { name: 'Arequipa', slug: 'arequipa', label: 'Arequipa', count: '35+ Vacantes' },
  { name: 'Cusco', slug: 'cusco', label: 'Cusco', count: '28+ Vacantes' },
  { name: 'La Libertad', slug: 'la-libertad', label: 'La Libertad (Trujillo)', count: '24+ Vacantes' },
  { name: 'Piura', slug: 'piura', label: 'Piura', count: '22+ Vacantes' },
  { name: 'Junín', slug: 'junin', label: 'Junín (Huancayo)', count: '19+ Vacantes' },
  { name: 'Puno', slug: 'puno', label: 'Puno', count: '16+ Vacantes' },
  { name: 'Lambayeque', slug: 'lambayeque', label: 'Lambayeque (Chiclayo)', count: '15+ Vacantes' },
  { name: 'San Martín', slug: 'san-martin', label: 'San Martín (Tarapoto)', count: '14+ Vacantes' },
  { name: 'Nacional / Remoto', slug: 'remoto', label: 'Teletrabajo / Nacional', count: '45+ Vacantes' },
];

export function RegionesGrid() {
  return (
    <div className="space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-center">
            <MapPin size={17} className="text-emerald-600 dark:text-emerald-400" />
          </div>
          <span>Convocatorias por Región del País</span>
        </h2>
        <Link
          href="/empleos"
          className="text-xs text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 hover:underline flex items-center gap-1 self-start sm:self-auto font-semibold"
        >
          <span>Ver las 25 Regiones Oficiales</span>
          <ChevronRight size={14} />
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {REGIONES.map((reg) => (
          <Link
            key={reg.name}
            href={`/empleos/en/${reg.slug}`}
            className="p-3.5 sm:p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all group shadow-xs"
          >
            <div className="flex items-center justify-between gap-1">
              <span className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                {reg.label}
              </span>
              <ChevronRight size={14} className="text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
            </div>
            <span className="inline-block text-[11px] font-medium text-slate-500 dark:text-slate-400 mt-2 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800/90 border border-slate-200/80 dark:border-slate-700">
              {reg.count}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
