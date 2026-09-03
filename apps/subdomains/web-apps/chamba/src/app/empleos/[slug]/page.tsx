import { getJobPostingBySlug, getJobPostings } from "@atpdev/database";
import { notFound } from "next/navigation";
import Link from "next/link";
import Script from "next/script";
import { 
  ShieldCheck, MapPin, Building2, ExternalLink, Clock, FileText, CheckCircle2, 
  ArrowLeft, Share2, Sparkles, Send, Check, AlertCircle, ChevronRight, Layers, Users, Calendar
} from "lucide-react";
import { CvMatcherTool } from "@/components/CvMatcherTool";
import { EntityLogo } from "@/components/EntityLogo";
import { JobCard } from "@/components/JobCard";
import { AdBannerSlot } from "@/components/AdBannerSlot";

export const dynamicParams = true;
export const revalidate = 60;

export async function generateStaticParams() {
  const jobs = await getJobPostings();
  return jobs.map((j) => ({ slug: j.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const job = await getJobPostingBySlug(slug);
  if (!job) return {};

  return {
    title: `${job.title} — ${job.entity_name} | chamba pro`,
    description: job.description,
    openGraph: {
      title: `${job.title} - ${job.entity_name}`,
      description: job.description,
      type: "article",
    },
  };
}

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const job = await getJobPostingBySlug(slug);
  const allJobs = await getJobPostings();

  if (!job) {
    notFound();
  }

  // Related jobs
  const relatedJobs = allJobs
    .filter(j => j.id !== job.id && (j.category === job.category || j.sector_type === job.sector_type))
    .slice(0, 3);

  // Google for Jobs JSON-LD Schema
  const jsonLd = {
    "@context": "https://schema.org/",
    "@type": "JobPosting",
    title: job.title,
    description: job.description,
    identifier: {
      "@type": "PropertyValue",
      name: job.entity_name,
      value: job.id,
    },
    datePosted: job.start_date,
    validThrough: job.end_date,
    employmentType: job.sector_type === "CAS 1057" ? "CONTRACT" : "FULL_TIME",
    hiringOrganization: {
      "@type": "Organization",
      name: job.entity_name,
      sameAs: job.apply_url,
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressLocality: job.region,
        addressCountry: "PE",
      },
    },
    baseSalary: job.salary_min ? {
      "@type": "MonetaryAmount",
      currency: "PEN",
      value: {
        "@type": "QuantitativeValue",
        minValue: job.salary_min,
        maxValue: job.salary_max || job.salary_min,
        unitText: "MONTH",
      },
    } : undefined,
  };

  return (
    <>
      {/* Google for Jobs JSON-LD Injection */}
      <Script
        id="job-posting-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Breadcrumb Bar */}
        <nav className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <Link href="/" className="hover:text-emerald-400 transition-colors">Inicio</Link>
          <ChevronRight size={12} />
          <Link href="/empleos" className="hover:text-emerald-400 transition-colors">Convocatorias</Link>
          <ChevronRight size={12} />
          <span className="text-slate-200 truncate max-w-[250px] sm:max-w-[400px]">{job.title}</span>
        </nav>

        {/* Main Convocatoria Header Card */}
        <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/15 space-y-6 relative overflow-hidden bg-gradient-to-b from-slate-900 via-slate-900 to-[#0b0f19]">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <EntityLogo entityName={job.entity_name} logoUrl={job.entity_logo} size="lg" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-slate-300">{job.entity_name}</span>
                  {job.entity_verified && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[10px] font-bold">
                      <ShieldCheck size={12} />
                      <span>RUC Verificado</span>
                    </span>
                  )}
                </div>
                <h1 className="text-2xl sm:text-3xl font-black font-display text-white mt-1 leading-snug">
                  {job.title}
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-mono font-bold animate-pulse">
                ● CONVOCATORIA VIGENTE
              </span>
              <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-mono font-bold">
                {job.sector_type}
              </span>
            </div>
          </div>

          {/* Institutional Metadata Grid (As seen in PortalTrabajos reference!) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 p-4 rounded-2xl bg-slate-950/70 border border-white/10 text-xs">
            <div className="space-y-1">
              <span className="text-slate-400 font-mono block text-[10px] uppercase">Institución</span>
              <span className="text-slate-100 font-bold block truncate">{job.entity_name}</span>
            </div>
            <div className="space-y-1">
              <span className="text-slate-400 font-mono block text-[10px] uppercase">Vacantes</span>
              <span className="text-amber-400 font-bold block">{job.vacancies_count} Vacantes</span>
            </div>
            <div className="space-y-1">
              <span className="text-slate-400 font-mono block text-[10px] uppercase">Ubicación</span>
              <span className="text-slate-100 font-bold block">{job.region}</span>
            </div>
            <div className="space-y-1">
              <span className="text-slate-400 font-mono block text-[10px] uppercase">Publicado</span>
              <span className="text-slate-300 font-bold block font-mono">{job.start_date}</span>
            </div>
            <div className="space-y-1">
              <span className="text-slate-400 font-mono block text-[10px] uppercase">Vigente Hasta</span>
              <span className="text-cyan-400 font-bold block font-mono">{job.end_date}</span>
            </div>
            <div className="space-y-1">
              <span className="text-slate-400 font-mono block text-[10px] uppercase">Salario / Remuneración</span>
              <span className="text-emerald-400 font-extrabold block">{job.salary_text}</span>
            </div>
          </div>

          {/* Social Share & Direct Apply Quick Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
              <span>Compartir:</span>
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(`${job.title} - ${job.entity_name} en Chamba Pro: https://chamba.atpdev.dev/empleos/${job.slug}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 transition-colors"
              >
                WhatsApp
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://chamba.atpdev.dev/empleos/${job.slug}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 transition-colors"
              >
                Facebook
              </a>
            </div>

            <a
              href={job.apply_url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold font-display text-sm transition-all shadow-[0_0_20px_rgba(16,185,129,0.4)] flex items-center gap-2 cursor-pointer"
            >
              <span>Ver Oferta Oficial y Postular</span>
              <ExternalLink size={16} />
            </a>
          </div>
        </div>

        {/* Content Section Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Main Details Body */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Technical Job Profile Table */}
            <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-6">
              <h2 className="text-xl font-bold font-display text-white flex items-center gap-2 border-b border-white/10 pb-4">
                <FileText className="text-emerald-400" size={22} />
                <span>Ficha Técnica del Puesto</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/10 space-y-1">
                  <span className="text-xs text-slate-400 font-mono block">PUESTO:</span>
                  <span className="font-bold text-white block">{job.title}</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/10 space-y-1">
                  <span className="text-xs text-slate-400 font-mono block">TIPO DE CONTRATO / RÉGIMEN:</span>
                  <span className="font-bold text-amber-400 block">{job.sector_type}</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/10 space-y-1">
                  <span className="text-xs text-slate-400 font-mono block">NIVEL EDUCATIVO REQUERIDO:</span>
                  <span className="font-bold text-cyan-400 block">{job.education_level}</span>
                </div>
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/10 space-y-1">
                  <span className="text-xs text-slate-400 font-mono block">MODALIDAD DE TRABAJO:</span>
                  <span className="font-bold text-emerald-400 block">Presencial / Descentralizado</span>
                </div>
              </div>
            </div>

            {/* Requisitos Desglosados */}
            <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-6">
              <h2 className="text-xl font-bold font-display text-white flex items-center gap-2 border-b border-white/10 pb-4">
                <CheckCircle2 className="text-emerald-400" size={22} />
                <span>Requisitos de Postulación</span>
              </h2>

              <div className="space-y-4">
                {job.requirements.map((req, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-900/60 border border-white/5 text-sm text-slate-200">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 mt-2 flex-shrink-0 shadow-[0_0_8px_#10b981]" />
                    <span className="leading-relaxed">{req}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ODPE / Desglose de Plazas Descentralizadas (Si aplica) */}
            {job.odpe_vacancies && job.odpe_vacancies.length > 0 && (
              <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-6 border border-cyan-500/30">
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <h2 className="text-xl font-bold font-display text-white flex items-center gap-2">
                    <MapPin className="text-cyan-400" size={22} />
                    <span>Desglose de Vacantes por ODPE / Provincia</span>
                  </h2>
                  <span className="text-xs font-mono text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/30">
                    {job.odpe_vacancies.length} Sedes Descentralizadas
                  </span>
                </div>

                <p className="text-xs text-slate-300">
                  Selecciona la ODPE o sede de tu preferencia para conocer el número de vacantes requeridas y la fecha límite de postulación específica:
                </p>

                <div className="max-h-80 overflow-y-auto pr-2 grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
                  {job.odpe_vacancies.map((odpe, idx) => (
                    <div key={idx} className="p-3.5 rounded-2xl bg-slate-950/80 border border-white/10 flex items-center justify-between gap-2 hover:border-cyan-500/40 transition-colors">
                      <div>
                        <strong className="text-white block text-sm">{odpe.odpe}</strong>
                        <span className="text-[11px] text-slate-400">Plazo: {odpe.deadline}</span>
                      </div>
                      <span className="px-2.5 py-1 rounded-xl bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30 flex-shrink-0">
                        {odpe.count} plazas
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Guía Paso a Paso & Detalles de Postulación */}
            <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-6 border border-emerald-500/30">
              <h2 className="text-xl font-bold font-display text-white flex items-center gap-2 border-b border-white/10 pb-4">
                <Sparkles className="text-amber-400" size={22} />
                <span>¿Cómo Postular? Pasos e Instructivo Oficial</span>
              </h2>

              <div className="space-y-4 text-sm text-slate-200">
                <p className="text-xs text-slate-300 leading-relaxed">
                  Para postular correctamente a esta convocatoria, debes realizar tu registro en el sistema oficial de la institución antes de la fecha límite:
                </p>

                {job.steps_to_apply && job.steps_to_apply.length > 0 ? (
                  <div className="space-y-3 font-mono text-xs">
                    {job.steps_to_apply.map((step, idx) => (
                      <div key={idx} className="p-3.5 rounded-2xl bg-slate-900/80 border border-white/10 text-emerald-300">
                        {step}
                      </div>
                    ))}
                  </div>
                ) : (
                  <ol className="space-y-3 text-xs font-mono">
                    <li className="p-3 rounded-xl bg-slate-900/80 border border-white/10">1ro. Ingresar al enlace oficial de postulación.</li>
                    <li className="p-3 rounded-xl bg-slate-900/80 border border-white/10">2do. Registrarse e iniciar sesión con tu documento de identidad (DNI).</li>
                    <li className="p-3 rounded-xl bg-slate-900/80 border border-white/10">3ro. Adjuntar tu currículum vitae documentado en formato PDF.</li>
                  </ol>
                )}

                {/* Primary Redirection Box */}
                <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-950/80 to-slate-900 border border-emerald-500/40 text-center space-y-4 mt-6">
                  <h3 className="font-display font-bold text-lg text-white">
                    Postula en la Plataforma Oficial de {job.entity_name}
                  </h3>
                  <p className="text-xs text-slate-300 max-w-md mx-auto">
                    Haz clic en el siguiente botón para acceder directamente al sistema de postulación oficial ({job.official_portal_name || "Portal Oficial"}):
                  </p>
                  
                  <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <a
                      href={job.apply_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black font-display text-sm transition-all shadow-[0_0_20px_rgba(16,185,129,0.4)] flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>[ POSTULAR AHORA EN ENLACE OFICIAL ]</span>
                      <ExternalLink size={16} />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* AI CV Matcher Tool */}
            <CvMatcherTool requirements={job.requirements} />
          </div>

          {/* Sidebar Area */}
          <div className="space-y-6">
            
            {/* Bases PDF Download & Viewer Card */}
            <div className="glass-card p-6 rounded-3xl space-y-4 border border-amber-500/30">
              <div className="flex items-center gap-3 text-amber-400 font-display font-bold">
                <FileText size={20} />
                <span>Bases Oficiales (PDF & Google Drive)</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Visualiza o descarga el documento oficial de bases del concurso, cronograma y anexos emitidos por {job.entity_name}.
              </p>
              
              <div className="space-y-2 pt-1">
                <a
                  href={`https://docs.google.com/viewer?url=${encodeURIComponent(job.bases_pdf_url || job.apply_url)}&embedded=true`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold font-display text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/20"
                >
                  <span>👁️ Ver Bases PDF en Vivo (Google Drive Viewer)</span>
                </a>

                <a
                  href={job.bases_pdf_url || job.apply_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500 border border-amber-500/40 text-amber-400 hover:text-slate-950 font-bold font-display text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Descargar Archivo Directo (PDF)</span>
                  <ExternalLink size={14} />
                </a>
              </div>
            </div>

            {/* Institutional Guarantee Box */}
            <div className="glass-card p-6 rounded-3xl space-y-3 border border-emerald-500/20">
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono font-semibold">
                <ShieldCheck size={16} />
                <span>Garantía de Transparencia</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                chamba pro es una plataforma agregadora verificada. No solicitamos dinero, cobros ni datos personales. Todo trámite de postulación es 100% gratuito y directo en la web oficial del Estado.
              </p>
            </div>

            {/* Sidebar Ad / Sponsor Slot */}
            <AdBannerSlot type="sidebar" />

          </div>
        </div>

        {/* Bottom Horizontal Ad Slot */}
        <AdBannerSlot type="billboard" />

        {/* Other Related Convocatorias Grid */}
        {relatedJobs.length > 0 && (
          <div className="space-y-6 pt-8 border-t border-white/10">
            <h2 className="text-2xl font-bold font-display text-white">
              Otras convocatorias que te pueden interesar
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedJobs.map((rJob) => (
                <JobCard key={rJob.id} job={rJob} />
              ))}
            </div>
          </div>
        )}

      </div>
    </>
  );
}
