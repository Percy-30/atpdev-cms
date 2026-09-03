import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, HelpCircle, Sparkles, BookOpen, ShieldCheck } from 'lucide-react';
import { PreguntasCasSimulator } from '@/components/PreguntasCasSimulator';

export const metadata: Metadata = {
  title: 'Banco de Preguntas & Examen de Entrevista CAS Perú 2026 | chamba pro',
  description: 'Simulador gratuito de examen de conocimientos y entrevista de evaluación técnica para convocatorias CAS en el Estado (Ley 27444, Ley 30225 y Ética).',
  keywords: [
    'preguntas examen cas peru',
    'preguntas entrevista cas 2026',
    'examen de conocimientos cas minedu sunat',
    'ley 27444 preguntas examen',
    'ley de contrataciones del estado examen',
    'simulador evaluacion tecnica estado'
  ],
};

export default function PreguntasCasPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs font-mono text-slate-400">
        <Link href="/" className="hover:text-emerald-400 transition-colors">Inicio</Link>
        <ChevronRight size={12} />
        <span className="text-slate-200 font-semibold">Simulador de Preguntas CAS</span>
      </nav>

      {/* Main Header */}
      <div className="space-y-3 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-semibold">
          <Sparkles size={14} />
          <span>Balotario Oficial para Evaluación Técnica y Entrevista Personal</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black font-display text-white tracking-tight">
          Banco de Preguntas & Examen CAS Perú 2026
        </h1>
        <p className="text-sm text-slate-400 max-w-2xl">
          Ponte a prueba con preguntas reales tomadas en las evaluaciones de conocimientos de la SUNAT, MINEDU, Poder Judicial, EsSalud y ONPE con fundamentación legal actualizada.
        </p>
      </div>

      {/* Interactive Questions Simulator */}
      <PreguntasCasSimulator />
    </div>
  );
}
