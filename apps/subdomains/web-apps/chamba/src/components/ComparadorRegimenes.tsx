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
      {/* Header Pill Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
        <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
          <Scale size={18} className="text-emerald-600 dark:text-emerald-400" />
          <span>Matriz Comparativa Oficial de Regímenes Laborales en Perú</span>
        </span>
        <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
          Marco Normativo Laboral Vigente
        </span>
      </div>

      {/* Responsive Comparison Table */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm bg-white dark:bg-slate-900">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 uppercase tracking-wider">
                <th className="p-4 font-bold w-1/4">Derecho / Beneficio</th>
                <th className="p-4 font-bold text-amber-800 dark:text-amber-300 bg-amber-50/70 dark:bg-amber-950/40">CAS 1057</th>
                <th className="p-4 font-bold text-emerald-800 dark:text-emerald-300 bg-emerald-50/70 dark:bg-emerald-950/40">D.L. 728</th>
                <th className="p-4 font-bold text-sky-800 dark:text-sky-300 bg-sky-50/70 dark:bg-sky-950/40">D.L. 276</th>
                <th className="p-4 font-bold text-rose-800 dark:text-rose-300 bg-rose-50/70 dark:bg-rose-950/40">Locación (RHO)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {COMPARISON.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="p-4 font-bold text-slate-900 dark:text-white bg-slate-50/60 dark:bg-slate-900/60 font-display text-sm">
                    {row.feature}
                  </td>
                  <td className="p-4 bg-amber-50/20 dark:bg-amber-950/10 leading-relaxed border-l border-slate-200 dark:border-slate-800">
                    {row.cas}
                  </td>
                  <td className="p-4 bg-emerald-50/20 dark:bg-emerald-950/10 leading-relaxed border-l border-slate-200 dark:border-slate-800 font-medium text-emerald-900 dark:text-emerald-200">
                    {row.dl728}
                  </td>
                  <td className="p-4 bg-sky-50/20 dark:bg-sky-950/10 leading-relaxed border-l border-slate-200 dark:border-slate-800">
                    {row.dl276}
                  </td>
                  <td className="p-4 bg-rose-50/20 dark:bg-rose-950/10 leading-relaxed border-l border-slate-200 dark:border-slate-800 text-rose-800 dark:text-rose-300">
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
