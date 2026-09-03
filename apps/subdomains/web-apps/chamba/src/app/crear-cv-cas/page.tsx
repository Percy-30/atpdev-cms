import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, FileSpreadsheet, Sparkles } from 'lucide-react';
import { CvCasGenerator } from '@/components/CvCasGenerator';

export const metadata: Metadata = {
  title: 'Generador de CV Formato CAS Servir Perú 2026 | chamba pro',
  description: 'Genera gratis tu Ficha Resumen de Curriculum Vitae en formato estándar SERVIR para convocatorias del Estado (CAS 1057, 728 y 276).',
  keywords: [
    'generador cv cas servir',
    'ficha resumen hoja de vida cas peru',
    'formato cv estado peru 2026',
    'declaracion jurada hoja de vida cas',
    'modelo cv convocatorias cas'
  ],
};

export default function CrearCvCasPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs font-mono text-slate-400">
        <Link href="/" className="hover:text-emerald-400 transition-colors">Inicio</Link>
        <ChevronRight size={12} />
        <span className="text-slate-200 font-semibold">Generador de CV CAS</span>
      </nav>

      {/* Main Header */}
      <div className="space-y-3 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-semibold">
          <Sparkles size={14} />
          <span>Ficha Resumen de Hoja de Vida según Directivas SERVIR</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black font-display text-white tracking-tight">
          Generador de CV para Convocatorias del Estado (CAS)
        </h1>
        <p className="text-sm text-slate-400 max-w-2xl">
          Crea gratis tu Ficha Resumen estructurada sin errores de formato. Copia directamente la información lista para presentar por mesa de partes virtual o física.
        </p>
      </div>

      {/* Interactive Generator */}
      <CvCasGenerator />
    </div>
  );
}
