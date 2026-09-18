import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Building2, Search, Briefcase, Users, ShieldCheck, ExternalLink, Sparkles, Filter, CheckCircle2, ChevronRight } from 'lucide-react';
import { getOrganizations, OrganizationItem, OrganizationCategory } from '@atpdev/database';
import OrganizationsClient from './OrganizationsClient';
import { AdBannerSlot } from '@/components/AdBannerSlot';

export const revalidate = 1800; // 30 minutos

export const metadata: Metadata = {
  title: 'Directorio de Entidades Públicas y Organizaciones del Estado | chamba pro',
  description: 'Explora más de 120 instituciones públicas, ministerios, municipalidades y organismos autónomos de Perú con convocatorias CAS, 728 y prácticas vigentes.',
  alternates: {
    canonical: 'https://empleos.atpdev.dev/organizaciones',
  },
  openGraph: {
    title: 'Directorio de Organizaciones y Entidades del Estado Perú | chamba pro',
    description: 'Encuentra convocatorias vigentes en INEI, SUNAT, MINEDU, ESSALUD, Poder Judicial, ONPE y más de 120 entidades públicas verificadas.',
    url: 'https://empleos.atpdev.dev/organizaciones',
    siteName: 'chamba pro',
    locale: 'es_PE',
    type: 'website',
  }
};

export default async function OrganizacionesPage() {
  const organizations = await getOrganizations();
  const totalJobs = organizations.reduce((acc, o) => acc + o.jobCount, 0);
  const totalVacancies = organizations.reduce((acc, o) => acc + o.vacanciesCount, 0);

  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100 pb-20 selection:bg-emerald-400 selection:text-slate-950">
      {/* Background ambient glow */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-500/10 blur-[130px] rounded-full" />
        <div className="absolute top-1/3 right-10 w-[500px] h-[300px] bg-teal-500/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 space-y-10">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <Link href="/" className="hover:text-emerald-400 transition-colors">Inicio</Link>
          <span>/</span>
          <span className="text-emerald-400">Organizaciones</span>
        </nav>

        {/* Hero Banner */}
        <header className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900/90 via-slate-900/60 to-slate-950/90 border border-white/10 p-6 sm:p-10 lg:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-xl">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold tracking-wider uppercase">
              <Building2 size={14} className="animate-pulse" />
              <span>Directorio Oficial de Empleadores Públicos • Perú 2026</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-display tracking-tight text-white leading-tight">
              Instituciones y Organizaciones con <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">Convocatorias Vigentes</span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Explora las convocatorias activas de los principales ministerios, organismos constitucionales autónomos,
              cortes de justicia, municipalidades y empresas estatales. Postulación 100% directa y verificada en sus portales oficiales.
            </p>

            {/* Quick Action: Publicar Convocatoria */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link
                href="/publicar-empleo"
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-xs font-bold text-white transition-all flex items-center gap-2"
              >
                <span>¿Eres de Recursos Humanos? Publica tu convocatoria</span>
                <ChevronRight size={14} className="text-emerald-400" />
              </Link>
            </div>
          </div>

          {/* Key Metrics Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4 mt-8 pt-8 border-t border-white/10">
            <div className="bg-slate-950/60 rounded-2xl p-4 border border-white/10">
              <div className="flex items-center gap-2 text-slate-400 text-xs font-mono">
                <Building2 size={14} className="text-emerald-400" />
                <span>Entidades Registradas</span>
              </div>
              <div className="text-2xl sm:text-3xl font-black font-display text-white mt-1">
                {organizations.length}
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">En todo el territorio nacional</p>
            </div>

            <div className="bg-slate-950/60 rounded-2xl p-4 border border-white/10">
              <div className="flex items-center gap-2 text-slate-400 text-xs font-mono">
                <Briefcase size={14} className="text-emerald-400" />
                <span>Procesos Activos</span>
              </div>
              <div className="text-2xl sm:text-3xl font-black font-display text-emerald-400 mt-1">
                {totalJobs}
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">Convocatorias CAS, 728 y 276</p>
            </div>

            <div className="col-span-2 sm:col-span-1 bg-slate-950/60 rounded-2xl p-4 border border-white/10">
              <div className="flex items-center gap-2 text-slate-400 text-xs font-mono">
                <Users size={14} className="text-teal-400" />
                <span>Total Vacantes</span>
              </div>
              <div className="text-2xl sm:text-3xl font-black font-display text-teal-300 mt-1">
                {totalVacancies.toLocaleString('es-PE')}
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">Puestos y plazas disponibles</p>
            </div>
          </div>
        </header>

        {/* Top Banner AdSlot */}
        <AdBannerSlot type="leaderboard" className="my-6" />

        {/* Interactive Client Search & Filter Component */}
        <OrganizationsClient initialOrganizations={organizations} />

        {/* Mid-page Billboard AdSlot */}
        <AdBannerSlot type="billboard" className="my-8" />

        {/* Informational Guidance Section (E-E-A-T) */}
        <section className="mt-16 rounded-3xl bg-slate-900/50 border border-white/10 p-6 sm:p-10 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <ShieldCheck size={22} />
            </div>
            <div>
              <h2 className="text-xl font-bold font-display text-white">
                Guía de Postulación en Entidades del Estado Peruano
              </h2>
              <p className="text-xs text-slate-400">Recomendaciones oficiales para postulaciones exitosas</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-300">
            <div className="bg-slate-950/60 p-5 rounded-2xl border border-white/5 space-y-2">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-400" />
                <span>1. Revisa las Bases y el Cronograma</span>
              </h3>
              <p>
                Cada entidad pública emite un cronograma estricto. La fecha de registro de hoja de vida y carga de anexos suele durar únicamente 1 o 2 días hábiles según la normativa SERVIR.
              </p>
            </div>

            <div className="bg-slate-950/60 p-5 rounded-2xl border border-white/5 space-y-2">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-400" />
                <span>2. Anexos y Declaraciones Juradas</span>
              </h3>
              <p>
                Descarga los formatos oficiales de la convocatoria respectiva (Anexos de no tener impedimentos para contratar con el Estado, Ley 27588, REDAM y antecedentes). Fírmalos con huella dactilar si lo exigen.
              </p>
            </div>

            <div className="bg-slate-950/60 p-5 rounded-2xl border border-white/5 space-y-2">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-400" />
                <span>3. Postulación 100% Gratuita</span>
              </h3>
              <p>
                Todas las convocatorias del Estado peruano son completamente gratuitas. chamba pro jamás cobrará por acceder a las bases ni por postular a una plaza oficial del sector público.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
