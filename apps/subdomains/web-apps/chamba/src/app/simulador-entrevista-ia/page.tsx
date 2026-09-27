import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, Bot, Sparkles } from 'lucide-react';
import { AiInterviewSimulator } from '@/components/AiInterviewSimulator';
import { AdBannerSlot } from '@/components/AdBannerSlot';
import { SITE_URL } from '@/lib/siteConfig';

export const metadata: Metadata = {
  title: 'Simulador de Entrevista de Trabajo con IA Perú 2026',
  description: 'Entrena tu entrevista personal y evaluación técnica CAS con Inteligencia Artificial para SUNAT, MINEDU, BCRP, EsSalud y el Poder Judicial.',
  alternates: {
    canonical: `${SITE_URL}/simulador-entrevista-ia`,
  },
  openGraph: {
    title: 'Simulador de Entrevista de Trabajo con IA Perú 2026 | chamba pro',
    description: 'Entrena tu entrevista personal y evaluación técnica CAS con Inteligencia Artificial.',
    url: `${SITE_URL}/simulador-entrevista-ia`,
    type: 'website',
  },
  keywords: [
    'simulador entrevista cas ia',
    'entrevista personal cas preguntas y respuestas',
    'evaluacion tecnica sunat minedu',
    'entrevista de trabajo estado peru',
    'como pasar entrevista cas 2026'
  ],
};

const appSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Simulador de Entrevista Laboral con IA para el Estado Peruano",
  "operatingSystem": "All",
  "applicationCategory": "EducationalApplication",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "PEN"
  }
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "¿Cómo evalúa el simulador de entrevista con IA de Chamba Pro?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "El simulador evalúa competencias blandas, coherencia comunicativa, ética pública y dominio técnico según los estándares de evaluación de SERVIR y el marco de contrataciones del Estado Peruano."
      }
    },
    {
      "@type": "Question",
      "name": "¿Qué tipo de preguntas formula el Comité de Selección en una entrevista CAS?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Las entrevistas CAS abordan preguntas situacionales (resolución de conflictos y trabajo bajo presión), motivación para ingresar al servicio civil, conocimiento de la Ley 27444 y funciones específicas del puesto."
      }
    }
  ]
};

export default function AiInterviewPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(appSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <Link href="/" className="hover:text-emerald-400 transition-colors">Inicio</Link>
          <ChevronRight size={12} />
          <span className="text-slate-200 font-semibold">Simulador de Entrevista IA</span>
        </nav>

      {/* Main Header (Centered & Professional) */}
      <div className="space-y-3 text-center max-w-3xl mx-auto pt-2 pb-2">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold shadow-sm">
          <Sparkles size={14} />
          <span>Exclusivo Chamba Pro — IA Entrenada con Parámetros SERVIR & PCM</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black font-display text-white tracking-tight">
          Simulador de Entrevista de Trabajo con IA
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Practica tus respuestas en tiempo real ante el Comité Virtual y obtén retroalimentación técnica inmediata para asegurar tu vacante en el Estado.
        </p>
      </div>

      {/* Top Banner AdSlot */}
      <AdBannerSlot type="leaderboard" className="my-4" />

      {/* Interactive AI Component */}
      <AiInterviewSimulator />

      {/* Bottom Billboard AdSlot */}
      <AdBannerSlot type="billboard" className="mt-8" />
    </div>
    </>
  );
}
