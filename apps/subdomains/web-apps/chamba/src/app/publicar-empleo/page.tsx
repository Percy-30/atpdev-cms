import { Metadata } from 'next';
import Link from 'next/link';
import { 
  Building2, 
  Send, 
  ShieldCheck, 
  Clock, 
  Users, 
  HelpCircle, 
  CheckCircle2, 
  MessageSquare, 
  Mail, 
  FileCheck2, 
  Sparkles 
} from 'lucide-react';
import PublicarFormClient from './PublicarFormClient';
import { AdBannerSlot } from '@/components/AdBannerSlot';

export const metadata: Metadata = {
  title: 'Publicar Convocatoria u Oferta de Trabajo Oficial | chamba pro',
  description: 'Publica gratuitamente ofertas laborales y convocatorias CAS 1057, 728, 276 para instituciones del Estado y empresas privadas en Perú.',
  alternates: {
    canonical: 'https://empleos.atpdev.dev/publicar-empleo',
  },
  openGraph: {
    title: 'Publicar Convocatoria de Trabajo en Perú | chamba pro',
    description: 'Difusión oficial para entidades públicas, municipalidades, ministerios y empresas en chamba pro.',
    url: 'https://empleos.atpdev.dev/publicar-empleo',
    siteName: 'chamba pro',
    locale: 'es_PE',
    type: 'website',
  }
};

export default function PublicarEmpleoPage() {
  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100 pb-20 selection:bg-emerald-400 selection:text-slate-950">
      {/* Background ambient glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-emerald-500/10 blur-[130px] rounded-full" />
        <div className="absolute top-1/2 right-10 w-[500px] h-[300px] bg-teal-500/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 space-y-10">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <Link href="/" className="hover:text-emerald-400 transition-colors">Inicio</Link>
          <span>/</span>
          <span className="text-emerald-400">Publicar Oferta</span>
        </nav>

        {/* Hero Header */}
        <header className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900/90 via-slate-900/60 to-slate-950/90 border border-white/10 p-6 sm:p-10 shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-xl">
          <div className="space-y-4 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold tracking-wider uppercase">
              <Building2 size={14} className="animate-pulse" />
              <span>Para Oficinas de Recursos Humanos (OGRH) y Reclutadores</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black font-display tracking-tight text-white leading-tight">
              Publica Convocatorias y Ofertas Laborales en <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">chamba pro</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Difunde gratuitamente tus procesos de selección CAS 1057, D.L. 728, D.L. 276, Locación y convocatorias privadas. 
              Conectamos a tu institución con más de <strong>500,000 profesionales y técnicos calificados</strong> a nivel nacional con postulación 100% directa a tu portal.
            </p>
          </div>

          {/* Pillars Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-8 pt-8 border-t border-white/10">
            <div className="flex items-start gap-3 bg-slate-950/60 p-4 rounded-2xl border border-white/5">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <Clock size={18} />
              </div>
              <div>
                <h2 className="text-xs font-bold text-white font-display">Verificación en &lt; 2 Horas</h2>
                <p className="text-[11px] text-slate-400 mt-0.5">Revisión editorial y activación inmediata.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-slate-950/60 p-4 rounded-2xl border border-white/5">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <ShieldCheck size={18} />
              </div>
              <div>
                <h2 className="text-xs font-bold text-white font-display">Derivación 100% Oficial</h2>
                <p className="text-[11px] text-slate-400 mt-0.5">Postulación directa a tu mesa de partes o portal.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-slate-950/60 p-4 rounded-2xl border border-white/5">
              <div className="w-9 h-9 rounded-xl bg-teal-500/20 text-teal-400 flex items-center justify-center shrink-0">
                <Users size={18} />
              </div>
              <div>
                <h2 className="text-xs font-bold text-white font-display">Difusión Gratuita</h2>
                <p className="text-[11px] text-slate-400 mt-0.5">Cero costo para instituciones del Estado.</p>
              </div>
            </div>
          </div>
        </header>

        {/* Top Banner AdSlot */}
        <AdBannerSlot type="leaderboard" className="my-6" />

        {/* Formulario Principal */}
        <PublicarFormClient />

        {/* Mid Billboard AdSlot */}
        <AdBannerSlot type="billboard" className="my-8" />

        {/* Canal Alternativo de Envío Directo (Vía Rápida OGRH) */}
        <section className="rounded-3xl bg-gradient-to-r from-slate-900/90 via-emerald-950/30 to-slate-900/90 border border-emerald-500/20 p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-400">
              <Sparkles size={14} />
              <span>Vía Rápida para Oficinas de Personal</span>
            </div>
            <h2 className="text-lg font-bold font-display text-white">
              ¿Prefieres enviar las bases en formato PDF o ZIP directamente?
            </h2>
            <p className="text-xs text-slate-300 max-w-xl">
              Si tu entidad emite un concurso con múltiples especialidades o comunicados urgentes, puedes remitir el enlace o documento a nuestro equipo editorial para su procesamiento prioritario.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <a
              href="mailto:convocatorias@atpdev.dev?subject=Envio%20de%20Bases%20Oficiales%20-%20Convocatoria"
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs font-bold font-display transition-all border border-white/20 flex items-center gap-2"
            >
              <Mail size={14} />
              <span>convocatorias@atpdev.dev</span>
            </a>
          </div>
        </section>

        {/* Preguntas Frecuentes para Publicadores */}
        <section className="rounded-3xl bg-slate-900/40 border border-white/10 p-6 sm:p-8 space-y-5">
          <div className="flex items-center gap-2 text-white font-bold font-display text-base">
            <HelpCircle size={18} className="text-emerald-400" />
            <span>Preguntas Frecuentes sobre la Publicación</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300">
            <div className="bg-slate-950/60 p-4 rounded-2xl border border-white/5 space-y-1.5">
              <h3 className="font-bold text-white">¿Tiene costo publicar una convocatoria pública?</h3>
              <p className="text-slate-400">
                No. En estricto cumplimiento con la transparencia laboral y la normativa SERVIR, la publicación y difusión de convocatorias del sector público es 100% gratuita.
              </p>
            </div>

            <div className="bg-slate-950/60 p-4 rounded-2xl border border-white/5 space-y-1.5">
              <h3 className="font-bold text-white">¿Cómo postulan los candidatos?</h3>
              <p className="text-slate-400">
                Los postulantes son derivados mediante enlace oficial directo a la página web o mesa de partes virtual de su institución. chamba pro no cobra a los postulantes ni retiene expedientes.
              </p>
            </div>

            <div className="bg-slate-950/60 p-4 rounded-2xl border border-white/5 space-y-1.5">
              <h3 className="font-bold text-white">¿Qué documentos se deben adjuntar?</h3>
              <p className="text-slate-400">
                Se requiere el enlace oficial a las Bases del Concurso (PDF en portal institucional o Google Drive oficial), cronograma de etapas y formatos de anexos/declaraciones juradas.
              </p>
            </div>

            <div className="bg-slate-950/60 p-4 rounded-2xl border border-white/5 space-y-1.5">
              <h3 className="font-bold text-white">¿Cómo se actualizan los resultados o comunicados?</h3>
              <p className="text-slate-400">
                Nuestro crawler indexa periódicamente las secciones de comunicados, listas de aptos y actas finales en el portal oficial de cada entidad registrada.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
