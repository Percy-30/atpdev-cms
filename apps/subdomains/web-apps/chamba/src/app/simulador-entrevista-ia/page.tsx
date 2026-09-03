import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, Bot, Sparkles } from 'lucide-react';
import { AiInterviewSimulator } from '@/components/AiInterviewSimulator';

export const metadata: Metadata = {
  title: 'Simulador de Entrevista de Trabajo con IA en Vivo Perú 2026 | chamba pro',
  description: 'Entrena tu entrevista personal y evaluación técnica CAS con Inteligencia Artificial para SUNAT, MINEDU, BCRP, EsSalud y el Poder Judicial.',
  keywords: [
    'simulador entrevista cas ia',
    'entrevista personal cas preguntas y respuestas',
    'evaluacion tecnica sunat minedu',
    'entrevista de trabajo estado peru',
    'como pasar entrevista cas 2026'
  ],
};

export default function AiInterviewPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs font-mono text-slate-400">
        <Link href="/" className="hover:text-emerald-400 transition-colors">Inicio</Link>
        <ChevronRight size={12} />
        <span className="text-slate-200 font-semibold">Simulador de Entrevista IA</span>
      </nav>

      {/* Main Header */}
      <div className="space-y-3 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-semibold">
          <Sparkles size={14} />
          <span>Exclusivo Chamba Pro — IA Entrenada con Parámetros SERVIR & PCM</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black font-display text-white tracking-tight">
          Simulador de Entrevista de Trabajo con IA
        </h1>
        <p className="text-sm text-slate-400 max-w-2xl">
          Practica tus respuestas en tiempo real frente al Comité de Selección Virtual. Obtén un puntaje de 0 a 100% y recomendaciones de base legal para asegurar tu vacante CAS en el Estado.
        </p>
      </div>

      {/* Interactive AI Component */}
      <AiInterviewSimulator />
    </div>
  );
}
