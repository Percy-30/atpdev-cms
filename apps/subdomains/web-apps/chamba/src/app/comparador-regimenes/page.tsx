import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, Scale, Sparkles } from 'lucide-react';
import { ComparadorRegimenes } from '@/components/ComparadorRegimenes';

export const metadata: Metadata = {
  title: 'Comparador de Regímenes Laborales Perú (CAS vs 728 vs 276 vs Locación) | chamba pro',
  description: 'Compara tus derechos laborales, gratificaciones, CTS, vacaciones y estabilidad entre los regímenes CAS 1057, Decreto Legislativo 728, D.L. 276 y Locación de Servicios (RHO).',
  keywords: [
    'diferencia cas 1057 y 728',
    'comparador regimenes laborales peru',
    'beneficios cas 1057 gratificacion cts',
    'regimen 728 vs cas peru 2026',
    'derechos locacion de servicios rho'
  ],
};

export default function ComparadorPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs font-mono text-slate-400">
        <Link href="/" className="hover:text-emerald-400 transition-colors">Inicio</Link>
        <ChevronRight size={12} />
        <span className="text-slate-200 font-semibold">Comparador de Regímenes</span>
      </nav>

      {/* Main Header */}
      <div className="space-y-3 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-semibold">
          <Sparkles size={14} />
          <span>Matriz Oficial de Derechos Laborales en el Sector Público & Privado</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black font-display text-white tracking-tight">
          Comparador de Regímenes Laborales en Perú
        </h1>
        <p className="text-sm text-slate-400 max-w-2xl">
          Conoce exactamente tus derechos a gratificación, CTS, vacaciones, salud e indemnización antes de postular o firmar tu contrato laboral en el Estado o sector privado.
        </p>
      </div>

      {/* Interactive Matrix */}
      <ComparadorRegimenes />
    </div>
  );
}
