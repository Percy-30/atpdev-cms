import type { Metadata } from "next";
import Link from "next/link";
import { getJobPostings, getSubdomainConfig } from "@atpdev/database";
import { JobSearchHero } from "@/components/JobSearchHero";
import { JobCard } from "@/components/JobCard";
import { RegionesGrid } from "@/components/RegionesGrid";
import WhatsAppSubscribeWidget from "@/components/WhatsAppSubscribeWidget";
import { AdBannerSlot } from "@/components/AdBannerSlot";
import { AdLateralRail } from "@/components/AdLateralRail";
import { ShieldCheck, Sparkles, Building2, MapPin, ArrowRight, CheckCircle2, Calculator, HelpCircle, FileText, Bot, FileSpreadsheet, Scale, ChevronDown } from "lucide-react";

export const metadata: Metadata = {
  title: {
    absolute: "chamba pro — Buscador de Convocatorias de Trabajo, Empleos y Chamba en Perú 2026",
  },
  description: "Buscador líder de convocatorias de trabajo y chamba verificada en Perú: CAS 1057, D.L. 728, 276 y sector privado. Consulta bases oficiales, requisitos y salarios vigentes.",
  alternates: {
    canonical: "https://empleos.atpdev.dev",
  },
};

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [jobs, config] = await Promise.all([
    getJobPostings(),
    getSubdomainConfig("chamba")
  ]);
  const todayIso = new Date().toISOString().split("T")[0];

  // Solo convocatorias vigentes (aprobadas y no vencidas) en la portada
  const activeJobs = jobs.filter(j => j.status === 'Vigente' && (!j.end_date || j.end_date >= todayIso));

  // Priorizar convocatorias recién aprobadas / creadas en el CMS y convocatorias destacadas
  const sortedActive = [...activeJobs].sort((a, b) => {
    const isCmsA = a.id?.startsWith('job-cms-') || a.id?.startsWith('job-admin-');
    const isCmsB = b.id?.startsWith('job-cms-') || b.id?.startsWith('job-admin-');
    if (isCmsA && !isCmsB) return -1;
    if (!isCmsA && isCmsB) return 1;
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    const dateA = a.created_at || a.start_date || '';
    const dateB = b.created_at || b.start_date || '';
    return dateB.localeCompare(dateA);
  });

  const featuredJobs = sortedActive.slice(0, 12);

  const totalVacancies = activeJobs.reduce((acc, curr) => acc + curr.vacancies_count, 0);

  return (
    <div className="space-y-16 pb-20 relative">
      {/* Lateral Skyscraper Ads (Visible on widescreen displays >= 1540px without affecting reading flow) */}
      <AdLateralRail />

      {/* Hero Section */}
      <JobSearchHero 
        totalJobs={activeJobs.length} 
        totalVacancies={totalVacancies} 
        branding={config.branding}
        accentColor={config.theme?.accent_color}
      />

      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Quick Filter Categories */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-4">
            <div className="space-y-1">
              <span className="text-[11px] font-mono font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles size={13} />
                <span>Clasificación Oficial de Convocatorias</span>
              </span>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-black font-display text-white tracking-tight">
                Explorar por Régimen Laboral y Sector
              </h2>
            </div>
            <Link 
              href="/empleos" 
              className="text-xs sm:text-sm text-emerald-400 hover:text-emerald-300 hover:underline flex items-center gap-1.5 font-mono font-semibold self-start sm:self-auto"
            >
              <span>Ver todas las vacantes</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Link
              href="/convocatorias/cas"
              className="glass-card glass-card-hover p-4 sm:p-6 rounded-3xl flex flex-col justify-between gap-4 group border-amber-500/20 hover:border-amber-500/50 shadow-lg hover:shadow-[0_12px_30px_-10px_rgba(245,158,11,0.25)] relative overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center font-black font-mono text-xs sm:text-sm shadow-[0_0_15px_rgba(245,158,11,0.2)] group-hover:scale-110 transition-transform">
                  CAS
                </div>
                <span className="text-[9px] sm:text-[10px] font-mono text-amber-400 font-bold px-2 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20">
                  Sector Público
                </span>
              </div>
              <div>
                <h3 className="font-display font-bold text-sm sm:text-base text-slate-100 group-hover:text-amber-300 transition-colors">
                  D.L. 1057 (CAS)
                </h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">Convocatorias del Estado y Gobiernos Regionales</p>
              </div>
            </Link>

            <Link
              href="/convocatorias/728"
              className="glass-card glass-card-hover p-4 sm:p-6 rounded-3xl flex flex-col justify-between gap-4 group border-emerald-500/20 hover:border-emerald-500/50 shadow-lg hover:shadow-[0_12px_30px_-10px_rgba(16,185,129,0.25)] relative overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center font-black font-mono text-xs sm:text-sm shadow-[0_0_15px_rgba(16,185,129,0.2)] group-hover:scale-110 transition-transform">
                  728
                </div>
                <span className="text-[9px] sm:text-[10px] font-mono text-emerald-400 font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                  Planilla
                </span>
              </div>
              <div>
                <h3 className="font-display font-bold text-sm sm:text-base text-slate-100 group-hover:text-emerald-300 transition-colors">
                  D.L. 728 (Planilla)
                </h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">Estabilidad laboral y beneficios completos de ley</p>
              </div>
            </Link>

            <Link
              href="/convocatorias/privado"
              className="glass-card glass-card-hover p-4 sm:p-6 rounded-3xl flex flex-col justify-between gap-4 group border-cyan-500/20 hover:border-cyan-500/50 shadow-lg hover:shadow-[0_12px_30px_-10px_rgba(6,182,212,0.25)] relative overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center font-black font-mono text-xs sm:text-sm shadow-[0_0_15px_rgba(6,182,212,0.2)] group-hover:scale-110 transition-transform">
                  PRIV
                </div>
                <span className="text-[9px] sm:text-[10px] font-mono text-cyan-400 font-bold px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20">
                  Corporativo
                </span>
              </div>
              <div>
                <h3 className="font-display font-bold text-sm sm:text-base text-slate-100 group-hover:text-cyan-300 transition-colors">
                  Sector Privado
                </h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">Banca, telecomunicaciones e industrias verificadas</p>
              </div>
            </Link>

            <Link
              href="/empleos/en/lima"
              className="glass-card glass-card-hover p-4 sm:p-6 rounded-3xl flex flex-col justify-between gap-4 group border-purple-500/20 hover:border-purple-500/50 shadow-lg hover:shadow-[0_12px_30px_-10px_rgba(168,85,247,0.25)] relative overflow-hidden"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-400 flex items-center justify-center shadow-[0_0_15px_rgba(168,85,247,0.2)] group-hover:scale-110 transition-transform">
                  <MapPin size={20} />
                </div>
                <span className="text-[9px] sm:text-[10px] font-mono text-purple-400 font-bold px-2 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/20">
                  Sede Central
                </span>
              </div>
              <div>
                <h3 className="font-display font-bold text-sm sm:text-base text-slate-100 group-hover:text-purple-300 transition-colors">
                  Lima & Callao
                </h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">Mayor concentración de vacantes ministeriales</p>
              </div>
            </Link>
          </div>
        </section>

        {/* Featured Job Listings Grid */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-5">
            <div className="space-y-2.5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold tracking-wide shadow-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                </span>
                <span>Actualizado hoy • Convocatorias 100% verificadas</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black font-display tracking-tight text-white flex flex-wrap items-center gap-2">
                <span>Vacantes Destacadas</span>
                <span className="text-emerald-400 font-extrabold">y Convocatorias Vigentes</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                Todas las oportunidades laborales son validadas con RUC activo y derivación directa a los portales oficiales de SERVIR, Gob.pe y empresas verificadas del Perú.
              </p>
            </div>
            <Link
              href="/empleos"
              className="group inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white/5 hover:bg-emerald-500/15 border border-white/10 hover:border-emerald-500/40 text-slate-100 hover:text-emerald-300 text-xs font-bold font-display shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] self-start sm:self-auto shrink-0"
            >
              <span>Explorar todas las vacantes</span>
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 font-mono text-[11px] font-bold">
                {jobs.length}
              </span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform text-slate-400 group-hover:text-emerald-400" />
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

        {/* WhatsApp & Telegram Subscriptions Banner */}
        <section>
          <WhatsAppSubscribeWidget 
            whatsappEnabled={config.modules?.whatsapp_channel_enabled ?? true}
            telegramEnabled={config.modules?.telegram_channel_enabled ?? true}
            whatsappUrl={config.contact?.whatsapp_channel_url || (config.contact?.whatsapp ? `https://wa.me/${config.contact.whatsapp.replace(/[^0-9]/g, '')}` : undefined)}
            telegramUrl={config.contact?.telegram_channel_url || 'https://t.me/chambapro_peru'}
          />
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

        {/* Semantic FAQ Section for SEO & AdSense Content Quality */}
        <section className="space-y-6">
          <div className="border-b border-white/10 pb-4">
            <span className="text-[11px] font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <HelpCircle size={13} />
              <span>Preguntas Frecuentes de Postulantes</span>
            </span>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black font-display text-white tracking-tight mt-1">
              Todo lo que necesitas saber sobre convocatorias y chamba en Perú
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Respuestas oficiales sobre el proceso de postulación, regímenes laborales del Estado y uso de nuestras herramientas gratuitas.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/10 space-y-2">
              <h3 className="font-display font-bold text-sm sm:text-base text-white flex items-start gap-2">
                <CheckCircle2 size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                <span>¿Dónde encontrar convocatorias de trabajo y chamba formal en el Estado?</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pl-6">
                En chamba pro reunimos diariamente las convocatorias públicas vigentes reguladas por la Autoridad Nacional del Servicio Civil (SERVIR), Ministerios, Municipalidades y Gobiernos Regionales, así como vacantes de empresas privadas verificadas, con enlaces directos a las bases oficiales en PDF.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/10 space-y-2">
              <h3 className="font-display font-bold text-sm sm:text-base text-white flex items-start gap-2">
                <CheckCircle2 size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                <span>¿Cuál es la diferencia entre un contrato CAS 1057 y D.L. 728?</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pl-6">
                El régimen CAS (D.L. 1057) es el contrato más extendido en el Estado con aguinaldos fijos en julio/diciembre. El régimen 728 es el de la actividad privada con gratificaciones completas (1 sueldo en julio y diciembre) y depósito de CTS. Puedes compararlos al detalle en nuestro <Link href="/comparador-regimenes" className="text-emerald-400 hover:underline">Comparador de Regímenes Laborales</Link>.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/10 space-y-2">
              <h3 className="font-display font-bold text-sm sm:text-base text-white flex items-start gap-2">
                <CheckCircle2 size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                <span>¿Es gratuito postular a los empleos mostrados en chamba pro?</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pl-6">
                Sí, el acceso y la postulación son 100% gratuitos y sin cobros sorpresa. Chamba Pro no cobra por consultar bases oficiales ni exige registros obligatorios; te conectamos directamente al portal institucional de la entidad (SUNAT, MINEDU, Poder Judicial, etc.).
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-900/80 border border-white/10 space-y-2">
              <h3 className="font-display font-bold text-sm sm:text-base text-white flex items-start gap-2">
                <CheckCircle2 size={18} className="text-emerald-400 shrink-0 mt-0.5" />
                <span>¿Cómo preparar mi CV y declaraciones juradas para convocatorias públicas?</span>
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pl-6">
                Para postular al Estado debes presentar tu Ficha Resumen de Hoja de Vida y Anexos según el formato exigido en las bases. Puedes generar tu documento en minutos con nuestro <Link href="/crear-cv-cas" className="text-emerald-400 hover:underline">Generador de CV Formato CAS</Link> y descargar declaraciones juradas en <Link href="/plantillas-anexos" className="text-emerald-400 hover:underline">Plantillas de Anexos</Link>.
              </p>
            </div>
          </div>
        </section>

      </div>

      {/* Structured Data: ItemList Schema & FAQPage Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            itemListElement: featuredJobs.map((job, index) => ({
              "@type": "ListItem",
              position: index + 1,
              name: `${job.title} — ${job.entity_name}`,
              url: `https://empleos.atpdev.dev/empleos/${job.slug}`,
            })),
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "¿Dónde encontrar convocatorias de trabajo y chamba formal en el Estado?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "En chamba pro reunimos diariamente las convocatorias públicas vigentes reguladas por la Autoridad Nacional del Servicio Civil (SERVIR), Ministerios, Municipalidades y Gobiernos Regionales, con enlaces directos a las bases oficiales.",
                },
              },
              {
                "@type": "Question",
                name: "¿Cuál es la diferencia entre un contrato CAS 1057 y D.L. 728?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "El régimen CAS (D.L. 1057) otorga aguinaldos y seguro social en el sector público, mientras que el D.L. 728 concede gratificaciones legales completas y depósito semestral de CTS según el régimen laboral de la actividad privada.",
                },
              },
              {
                "@type": "Question",
                name: "¿Es gratuito postular a los empleos mostrados en chamba pro?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Sí, el acceso y la postulación son 100% gratuitos. Chamba Pro no solicita registros obligatorios ni cobra tarifas; cada convocatoria te redirige al portal oficial de la entidad convocante.",
                },
              },
              {
                "@type": "Question",
                name: "¿Cómo preparar mi CV y declaraciones juradas para convocatorias públicas?",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Puedes utilizar de manera gratuita nuestro Generador de CV formato SERVIR y la sección de Plantillas de Anexos para descargar formatos editables de declaraciones juradas exigidas por las entidades del Estado.",
                },
              },
            ],
          }),
        }}
      />
    </div>
  );
}
