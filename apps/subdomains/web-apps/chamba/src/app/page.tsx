import Link from "next/link";
import { getJobPostings } from "@atpdev/database";
import { JobSearchHero } from "@/components/JobSearchHero";
import { JobCard } from "@/components/JobCard";
import { RegionesGrid } from "@/components/RegionesGrid";
import WhatsAppSubscribeWidget from "@/components/WhatsAppSubscribeWidget";
import { AdBannerSlot } from "@/components/AdBannerSlot";
import { ShieldCheck, Sparkles, Building2, MapPin, ArrowRight, CheckCircle2, Calculator, HelpCircle, FileText, Bot, FileSpreadsheet, Scale } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const jobs = await getJobPostings();
  const featuredJobs = jobs.filter(j => j.featured || j.status === 'Vigente').slice(0, 12);

  const totalVacancies = jobs.reduce((acc, curr) => acc + curr.vacancies_count, 0);

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <JobSearchHero totalJobs={jobs.length} totalVacancies={totalVacancies} />

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Quick Filter Categories */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl sm:text-2xl font-bold font-display text-white flex items-center gap-2.5">
              <Sparkles className="text-amber-400" size={22} />
              <span>Explorar por Régimen Laboral & Sector</span>
            </h2>
            <Link href="/empleos" className="text-xs sm:text-sm text-emerald-400 hover:underline flex items-center gap-1 font-mono">
              <span>Ver todas las vacantes</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Link
              href="/empleos?regimen=CAS"
              className="glass-card glass-card-hover p-5 rounded-2xl flex flex-col justify-between gap-3 group border-amber-500/20"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold">
                CAS
              </div>
              <div>
                <h3 className="font-display font-bold text-slate-100 group-hover:text-amber-400 transition-colors">
                  D.L. 1057 (CAS)
                </h3>
                <p className="text-xs text-slate-400 mt-1">Convocatorias del Sector Público</p>
              </div>
            </Link>

            <Link
              href="/empleos?regimen=728"
              className="glass-card glass-card-hover p-5 rounded-2xl flex flex-col justify-between gap-3 group border-emerald-500/20"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold">
                728
              </div>
              <div>
                <h3 className="font-display font-bold text-slate-100 group-hover:text-emerald-400 transition-colors">
                  D.L. 728 (Planilla)
                </h3>
                <p className="text-xs text-slate-400 mt-1">Estabilidad laboral privada y pública</p>
              </div>
            </Link>

            <Link
              href="/empleos?regimen=Privado"
              className="glass-card glass-card-hover p-5 rounded-2xl flex flex-col justify-between gap-3 group border-cyan-500/20"
            >
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center font-bold">
                PRIV
              </div>
              <div>
                <h3 className="font-display font-bold text-slate-100 group-hover:text-cyan-400 transition-colors">
                  Sector Privado
                </h3>
                <p className="text-xs text-slate-400 mt-1">Empresas e industrias verificadas</p>
              </div>
            </Link>

            <Link
              href="/empleos?region=Lima"
              className="glass-card glass-card-hover p-5 rounded-2xl flex flex-col justify-between gap-3 group border-purple-500/20"
            >
              <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
                <MapPin size={20} />
              </div>
              <div>
                <h3 className="font-display font-bold text-slate-100 group-hover:text-purple-400 transition-colors">
                  Lima & Callao
                </h3>
                <p className="text-xs text-slate-400 mt-1">Sede central de convocatorias</p>
              </div>
            </Link>
          </div>
        </section>

        {/* Google Ad / Sponsor Slot 1: Top Leaderboard */}
        <AdBannerSlot type="leaderboard" />

        {/* Featured Job Listings Grid */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold font-display text-white flex items-center gap-2.5">
                <ShieldCheck className="text-emerald-400" size={24} />
                <span>Vacantes Destacadas & Convocatorias Vigentes</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1">
                Todas las ofertas son verificadas periódicamente con derivación directa al portal institucional oficial.
              </p>
            </div>
            <Link
              href="/empleos"
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/5 border border-white/10 hover:border-emerald-500/40 text-slate-200 transition-all font-mono self-start sm:self-auto"
            >
              Ver {jobs.length} ofertas disponibles →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredJobs.slice(0, 3).map(job => (
              <JobCard key={job.id} job={job} />
            ))}

            {/* In-Feed Native Ad Slot */}
            <div className="col-span-full">
              <AdBannerSlot type="in-feed" />
            </div>

            {featuredJobs.slice(3).map(job => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        </section>

        {/* Regional Department Grid Section */}
        <section>
          <RegionesGrid />
        </section>

        {/* WhatsApp Subscriptions Banner */}
        <section>
          <WhatsAppSubscribeWidget />
        </section>

        {/* High Utility Tools Banner (Calculadora, Examen CAS, Entrevista IA, Generador CV, Comparador, Plantillas) */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            href="/calculadora-sueldo"
            className="glass-card glass-card-hover p-6 rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-900 space-y-4 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <Calculator size={24} />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-white group-hover:text-emerald-400 transition-colors">
                Calculadora de Sueldo Neto
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Simula tu líquido al banco y retenciones de AFP/ONP en CAS 1057 y 728.
              </p>
            </div>
            <div className="text-xs font-mono text-emerald-400 font-bold flex items-center gap-1">
              <span>Probar Calculadora</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            href="/preguntas-entrevista-cas"
            className="glass-card glass-card-hover p-6 rounded-3xl border border-amber-500/30 bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-900 space-y-4 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              <HelpCircle size={24} />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-white group-hover:text-amber-400 transition-colors">
                Examen & Preguntas CAS
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Balotario interactivo con base legal de Ley 27444 y Contrataciones del Estado.
              </p>
            </div>
            <div className="text-xs font-mono text-amber-400 font-bold flex items-center gap-1">
              <span>Resolver Examen</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            href="/simulador-entrevista-ia"
            className="glass-card glass-card-hover p-6 rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-900 space-y-4 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <Bot size={24} />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-white group-hover:text-emerald-400 transition-colors">
                Simulador Entrevista IA
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Entrena tus respuestas en vivo frente al Comité de Selección con Inteligencia Artificial.
              </p>
            </div>
            <div className="text-xs font-mono text-emerald-400 font-bold flex items-center gap-1">
              <span>Entrenar con IA</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            href="/crear-cv-cas"
            className="glass-card glass-card-hover p-6 rounded-3xl border border-emerald-500/30 bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-900 space-y-4 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <FileSpreadsheet size={24} />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-white group-hover:text-emerald-400 transition-colors">
                Generador CV CAS Servir
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Genera tu Ficha Resumen de Hoja de Vida según el formato oficial exigido por SERVIR.
              </p>
            </div>
            <div className="text-xs font-mono text-emerald-400 font-bold flex items-center gap-1">
              <span>Generar mi CV</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            href="/comparador-regimenes"
            className="glass-card glass-card-hover p-6 rounded-3xl border border-cyan-500/30 bg-gradient-to-br from-cyan-950/40 via-slate-900 to-slate-900 space-y-4 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
              <Scale size={24} />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-white group-hover:text-cyan-400 transition-colors">
                Comparador de Regímenes
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Compara lado a lado derechos de CTS, Gratificación y Vacaciones entre CAS, 728 y 276.
              </p>
            </div>
            <div className="text-xs font-mono text-cyan-400 font-bold flex items-center gap-1">
              <span>Ver Matriz Comparativa</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            href="/plantillas-anexos"
            className="glass-card glass-card-hover p-6 rounded-3xl border border-cyan-500/30 bg-gradient-to-br from-cyan-950/40 via-slate-900 to-slate-900 space-y-4 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
              <FileText size={24} />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-white group-hover:text-cyan-400 transition-colors">
                Plantillas & Anexos CAS
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Formatos editables y listos para copiar de Declaraciones Juradas del Estado.
              </p>
            </div>
            <div className="text-xs font-mono text-cyan-400 font-bold flex items-center gap-1">
              <span>Copiar Plantillas</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </section>

        {/* Why Chamba Pro Differentiator Banner */}
        <section className="glass-card p-8 sm:p-10 rounded-3xl border border-emerald-500/30 relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900 to-emerald-950/40">
          <div className="max-w-3xl space-y-6 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-semibold">
              <CheckCircle2 size={14} />
              <span>Transparencia & Cero Fricción</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black font-display text-white">
              ¿Por qué chamba pro es superior a los directorios tradicionales?
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-slate-300 pt-2">
              <div className="flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 mt-2 flex-shrink-0"></span>
                <span><strong>Sin cobros ni registros obligatorios:</strong> Acceso libre e inmediato a la información oficial de la vacante.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 mt-2 flex-shrink-0"></span>
                <span><strong>Derivación 100% Oficial:</strong> El botón "Ver oferta oficial" te lleva directamente a la web de la entidad o empresa.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 mt-2 flex-shrink-0"></span>
                <span><strong>Verificación RUC:</strong> Filtramos ofertas sospechosas para proteger a los postulantes de fraudes.</span>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 mt-2 flex-shrink-0"></span>
                <span><strong>Optimizado para Google for Jobs:</strong> Estructurado técnico con schema.org JobPosting oficial.</span>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
