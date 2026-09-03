'use client';

import React, { useState } from 'react';
import { Scale, CheckCircle2, XCircle, AlertCircle, HelpCircle, ShieldCheck } from 'lucide-react';

interface RegimenFeature {
  feature: string;
  cas: string;
  dl728: string;
  dl276: string;
  rho: string;
  ley30057: string;
}

const COMPARISON: RegimenFeature[] = [
  {
    feature: 'Gratificación / Aguinaldo',
    cas: 'S/ 300 (Fiestas Patrias y Navidad)',
    dl728: '1 Sueldo completo en Julio + 1 Sueldo completo en Diciembre',
    dl276: 'S/ 300 (según presupuesto anual)',
    rho: '❌ Sin derecho a Gratificación',
    ley30057: '1 Sueldo completo en Julio + 1 Sueldo en Diciembre'
  },
  {
    feature: 'CTS (Compensación)',
    cas: '❌ No otorga CTS',
    dl728: '✅ 1 Sueldo por año (depositado en Mayo y Noviembre)',
    dl276: '✅ 50% de la remuneración por año de servicio',
    rho: '❌ Sin derecho a CTS',
    ley30057: '✅ 1 Sueldo completo por año de servicio'
  },
  {
    feature: 'Vacaciones Pagadas',
    cas: '✅ 30 días de descanso remunerado',
    dl728: '✅ 30 días de descanso remunerado',
    dl276: '✅ 30 días de descanso remunerado',
    rho: '❌ Sin descanso vacacional pagado',
    ley30057: '✅ 30 días de descanso remunerado'
  },
  {
    feature: 'Seguro Social (EsSalud 9%)',
    cas: '✅ Cubierto por la entidad (EsSalud)',
    dl728: '✅ Cubierto 100% por el empleador',
    dl276: '✅ Cubierto por la entidad',
    rho: '❌ El locador debe pagar su seguro independiente (SIS/EPS)',
    ley30057: '✅ Cubierto por la entidad'
  },
  {
    feature: 'Licencia por Maternidad / Paternidad',
    cas: '✅ 98 días maternidad / 10 días paternidad',
    dl728: '✅ 98 días maternidad / 10 días paternidad',
    dl276: '✅ 98 días maternidad / 10 días paternidad',
    rho: '❌ Sin derecho a licencias con goce de haber',
    ley30057: '✅ 98 días maternidad / 10 días paternidad'
  },
  {
    feature: 'Indemnización por Despido',
    cas: 'Máximo 3 sueldos por despido injustificado',
    dl728: '1.5 Sueldos por año trabajado (máx 12 sueldos)',
    dl276: 'Sujeto a proceso administrativo disciplinario',
    rho: '❌ Resolución contractual sin indemnización laboral',
    ley30057: '1.5 Sueldos por año trabajado'
  },
  {
    feature: 'Tipo de Contrato / Estabilidad',
    cas: 'CAS Indeterminado (Ley 31131) o Determinado por necesidad',
    dl728: 'Plazo Indeterminado o Sujeto a Modalidad',
    dl276: 'Nombrado en Carrera Administrativa',
    rho: 'Servicios de naturaleza civil (sin subordinación)',
    ley30057: 'Carrera del Servicio Civil / Directivo Público'
  }
];

export function ComparadorRegimenes() {
  const [selectedRegimen, setSelectedRegimen] = useState<string>('todos');

  return (
    <div className="space-y-6">
      {/* Header Filter Pill Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-slate-900 border border-white/10">
        <span className="text-xs font-mono text-slate-300 font-bold flex items-center gap-2">
          <Scale size={18} className="text-emerald-400" />
          <span>Matriz Comparativa de Derechos Laborales en Perú 2026</span>
        </span>
      </div>

      {/* Responsive Comparison Table */}
      <div className="glass-card rounded-3xl border border-white/15 overflow-hidden shadow-2xl bg-gradient-to-b from-slate-900 via-slate-900 to-[#070b12]">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="bg-slate-950/90 border-b border-white/15 text-slate-200 uppercase tracking-wider">
                <th className="p-4 font-extrabold w-1/4">Derecho / Beneficio</th>
                <th className="p-4 font-extrabold text-amber-400 bg-amber-500/10">CAS 1057</th>
                <th className="p-4 font-extrabold text-emerald-400 bg-emerald-500/10">D.L. 728</th>
                <th className="p-4 font-extrabold text-cyan-400 bg-cyan-500/10">D.L. 276</th>
                <th className="p-4 font-extrabold text-rose-400 bg-rose-500/10">Locación (RHO)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10 text-slate-300">
              {COMPARISON.map((row, idx) => (
                <tr key={idx} className="hover:bg-white/5 transition-colors">
                  <td className="p-4 font-bold text-white bg-slate-900/60 font-display text-sm">
                    {row.feature}
                  </td>
                  <td className="p-4 bg-amber-500/5 leading-relaxed border-l border-white/5">
                    {row.cas}
                  </td>
                  <td className="p-4 bg-emerald-500/5 leading-relaxed border-l border-white/5 font-semibold text-emerald-200">
                    {row.dl728}
                  </td>
                  <td className="p-4 bg-cyan-500/5 leading-relaxed border-l border-white/5">
                    {row.dl276}
                  </td>
                  <td className="p-4 bg-rose-500/5 leading-relaxed border-l border-white/5 text-rose-300">
                    {row.rho}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
