import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, FileSpreadsheet, Sparkles, ShieldCheck, Printer, CheckCircle2 } from 'lucide-react';
import { CvCasGenerator } from '@/components/CvCasGenerator';

export const metadata: Metadata = {
  title: 'Generador de CV Profesional Perú 2026 — Formatos SERVIR CAS y Sector Privado | chamba pro',
  description: 'Crea, edita y descarga gratis tu Curriculum Vitae profesional en PDF. Formatos oficiales SERVIR (Ficha Resumen CAS 1057, 728, 276) y plantillas modernas para el sector privado.',
  keywords: [
    'generador cv cas servir',
    'crear cv peru pdf gratis',
    'ficha resumen hoja de vida cas peru',
    'formato cv estado peru 2026',
    'declaracion jurada hoja de vida cas',
    'modelo cv convocatorias cas',
    'plantillas cv profesional peru',
    'cv ats friendly peru'
  ],
};

export default function CrearCvCasPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumbs (Print hidden) */}
      <nav className="flex items-center gap-2 text-xs font-mono text-slate-400 print:hidden">
        <Link href="/" className="hover:text-emerald-400 transition-colors">Inicio</Link>
        <ChevronRight size={12} />
        <span className="text-slate-200 font-semibold">Generador de CV Profesional</span>
      </nav>

      {/* Main Header (Print hidden) */}
      <div className="space-y-3 text-center sm:text-left print:hidden">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-semibold">
          <Sparkles size={14} />
          <span>Formatos Oficiales SERVIR (Estado) & Diseños Ejecutivos para Sector Privado</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-display text-white tracking-tight">
          Generador de CV Profesional e Imprimible en PDF
        </h1>
        <p className="text-sm sm:text-base text-slate-400 max-w-3xl leading-relaxed">
          Diseña tu hoja de vida en minutos con calidad 100% profesional. Selecciona la plantilla que mejor se adapte a tu postulación (Estado CAS o Sector Privado), edita tus datos en tiempo real y guárdalo directamente en <strong className="text-emerald-400 font-medium">formato PDF listo para imprimir en hoja A4</strong> sin marcas de agua.
        </p>

        {/* Feature badges */}
        <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-slate-300 font-mono">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <CheckCircle2 size={15} />
            <span>Formato A4 exacto</span>
          </span>
          <span className="text-slate-600">•</span>
          <span className="flex items-center gap-1.5 text-emerald-400">
            <CheckCircle2 size={15} />
            <span>Auto-guardado en tu navegador</span>
          </span>
          <span className="text-slate-600">•</span>
          <span className="flex items-center gap-1.5 text-emerald-400">
            <CheckCircle2 size={15} />
            <span>Exportación PDF sin registro</span>
          </span>
          <span className="text-slate-600">•</span>
          <span className="flex items-center gap-1.5 text-emerald-400">
            <CheckCircle2 size={15} />
            <span>Ficha Resumen SERVIR (Ley 27444)</span>
          </span>
        </div>
      </div>

      {/* Interactive Generator */}
      <CvCasGenerator />
    </div>
  );
}
