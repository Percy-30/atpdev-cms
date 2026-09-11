'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, ChevronRight, Sparkles } from 'lucide-react';

const REGIONES = [
  { name: 'Lima', label: 'Lima & Callao', count: '120+ Vacantes', color: 'from-amber-500/20 to-emerald-500/20', border: 'border-amber-500/30' },
  { name: 'Arequipa', label: 'Arequipa', count: '35+ Vacantes', color: 'from-emerald-500/20 to-teal-500/20', border: 'border-emerald-500/30' },
  { name: 'Cusco', label: 'Cusco', count: '28+ Vacantes', color: 'from-cyan-500/20 to-blue-500/20', border: 'border-cyan-500/30' },
  { name: 'La Libertad', label: 'La Libertad (Trujillo)', count: '24+ Vacantes', color: 'from-purple-500/20 to-pink-500/20', border: 'border-purple-500/30' },
  { name: 'Piura', label: 'Piura', count: '22+ Vacantes', color: 'from-amber-500/20 to-orange-500/20', border: 'border-amber-500/30' },
  { name: 'Junín', label: 'Junín (Huancayo)', count: '19+ Vacantes', color: 'from-teal-500/20 to-emerald-500/20', border: 'border-teal-500/30' },
  { name: 'Puno', label: 'Puno', count: '16+ Vacantes', color: 'from-blue-500/20 to-cyan-500/20', border: 'border-blue-500/30' },
  { name: 'Lambayeque', label: 'Lambayeque (Chiclayo)', count: '15+ Vacantes', color: 'from-pink-500/20 to-rose-500/20', border: 'border-pink-500/30' },
  { name: 'San Martín', label: 'San Martín (Tarapoto)', count: '14+ Vacantes', color: 'from-emerald-500/20 to-lime-500/20', border: 'border-emerald-500/30' },
  { name: 'Nacional / Remoto', label: 'Teletrabajo / Nacional', count: '45+ Vacantes', color: 'from-emerald-500/30 to-amber-500/30', border: 'border-emerald-500/40' },
];

export function RegionesGrid() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
        <h2 className="text-xl sm:text-2xl font-black font-display text-white flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center">
            <MapPin size={18} className="text-emerald-400" />
          </div>
          <span>Explorar Convocatorias por Región del Perú</span>
        </h2>
        <Link
          href="/empleos"
          className="text-xs font-mono text-emerald-400 hover:text-emerald-300 hover:underline flex items-center gap-1.5 self-start sm:self-auto font-bold"
        >
          <span>Ver las 25 Regiones Oficiales</span>
          <ChevronRight size={14} />
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {REGIONES.map((reg) => (
          <Link
            key={reg.name}
            href={`/empleos?region=${encodeURIComponent(reg.name)}`}
            className={`p-4 rounded-2xl bg-gradient-to-br ${reg.color} border ${reg.border} hover:scale-[1.04] transition-all duration-300 group relative overflow-hidden backdrop-blur-md shadow-lg hover:shadow-[0_10px_25px_rgba(0,0,0,0.5)]`}
          >
            <div className="flex items-center justify-between gap-1">
              <span className="text-xs font-mono text-slate-200 font-bold block truncate group-hover:text-white transition-colors">{reg.label}</span>
              <ChevronRight size={14} className="text-slate-400 group-hover:text-emerald-300 group-hover:translate-x-1 transition-all flex-shrink-0" />
            </div>
            <span className="inline-block text-[11px] font-mono text-emerald-300 font-extrabold mt-2 px-2 py-0.5 rounded-md bg-black/40 border border-white/5">
              {reg.count}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
