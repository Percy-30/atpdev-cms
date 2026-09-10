import Link from "next/link";
import { JobPosting } from "@atpdev/database";
import { ShieldCheck, MapPin, ExternalLink, Users, GraduationCap, ArrowRight } from "lucide-react";
import { EntityLogo } from "@/components/EntityLogo";
import { JobCountdownClock } from "@/components/JobCountdownClock";

interface JobCardProps {
  job: JobPosting;
}

export function JobCard({ job }: JobCardProps) {

  return (
    <div className="glass-card glass-card-hover p-5 rounded-3xl flex flex-col justify-between gap-4 relative group overflow-hidden border border-white/10 hover:border-emerald-500/40 transition-all bg-gradient-to-b from-slate-900/90 via-slate-900 to-[#070d14]">
      
      {/* Top Banner Cover Logo */}
      <Link
        href={`/empleos/${job.slug}`}
        className="block group"
        aria-label={`Convocatoria de empleo ${job.title} en ${job.entity_name}`}
        title={`Convocatoria de empleo ${job.title} en ${job.entity_name}`}
      >
        <EntityLogo entityName={job.entity_name} logoUrl={job.entity_logo} size="banner" />
        <span className="block text-center text-xs font-display font-bold text-slate-200 group-hover:text-emerald-400 transition-colors mt-2 truncate px-1">
          {job.entity_name}
        </span>
      </Link>

      <div className="space-y-3">
        {/* Meta Bar */}
        <div className="flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5 text-slate-300 font-mono">
            <MapPin size={13} className="text-emerald-400" />
            <span className="font-semibold text-slate-200">{job.region}</span>
          </div>

          {/* Regime Pill */}
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-mono font-extrabold px-2.5 py-0.5 rounded-full border flex-shrink-0 ${
              job.sector_type === 'CAS 1057' 
                ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' 
                : job.sector_type === 'D.L. 728' 
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
            }`}>
              {job.sector_type}
            </span>
          </div>
        </div>

        {/* Position Title Link */}
        <Link
          href={`/empleos/${job.slug}`}
          className="block group-hover:text-emerald-400 transition-colors"
          aria-label={`Ver convocatoria para ${job.title}`}
        >
          <h3 className="font-display font-bold text-base text-white leading-snug line-clamp-2">
            {job.title}
          </h3>
        </Link>

        {/* Meta badges row */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-300">
          <span className="px-2.5 py-1 rounded-lg bg-slate-900/80 border border-white/10 text-emerald-400 font-bold">
            {job.salary_text}
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-slate-900/80 border border-white/10 text-slate-300 flex items-center gap-1">
            <Users size={13} className="text-slate-400" />
            <span>{job.vacancies_count} vacante{job.vacancies_count > 1 ? 's' : ''}</span>
          </span>
          <span className="px-2.5 py-1 rounded-lg bg-slate-900/80 border border-white/10 text-slate-300 flex items-center gap-1">
            <GraduationCap size={13} className="text-slate-400" />
            <span>{job.education_level}</span>
          </span>
        </div>
      </div>

      {/* Footer Row with countdown and two clear CTAs */}
      <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
        {/* Dynamic Countdown Clock (Green, Orange, Red, Blue) */}
        <JobCountdownClock endDate={job.end_date} size="sm" />

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Link
            href={`/empleos/${job.slug}`}
            className="flex-1 sm:flex-initial px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold font-display transition-all flex items-center justify-center gap-1.5 border border-white/10"
            aria-label={`Ver detalles y requisitos de ${job.title}`}
          >
            <span>Ver detalles</span>
            <ArrowRight size={13} />
          </Link>
          {(() => {
            const isCompetitor = (url?: string) => (
              !url ||
              url.includes('convocatoriasdetrabajo.com') ||
              url.includes('portaltrabajos.pe') ||
              url.includes('blogspot.com')
            );

            let targetApplyUrl = `/empleos/${job.slug}`;
            if (!isCompetitor(job.apply_url)) {
              targetApplyUrl = job.apply_url!;
            } else if (!isCompetitor(job.bases_pdf_url)) {
              targetApplyUrl = job.bases_pdf_url!;
            } else if (!isCompetitor(job.resultados_url)) {
              targetApplyUrl = job.resultados_url!;
            }
            const isExternal = targetApplyUrl.startsWith('http');

            return isExternal ? (
              <a
                href={targetApplyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500 border border-emerald-500/40 text-emerald-400 hover:text-slate-950 font-semibold font-display transition-all flex items-center justify-center gap-1.5 group/btn"
                aria-label={`Postular directamente en la web oficial de ${job.entity_name}`}
              >
                <span>Oficial</span>
                <ExternalLink size={13} className="group-hover/btn:translate-x-0.5 transition-transform" />
              </a>
            ) : (
              <Link
                href={targetApplyUrl}
                className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500 border border-emerald-500/40 text-emerald-400 hover:text-slate-950 font-semibold font-display transition-all flex items-center justify-center gap-1.5 group/btn"
                aria-label={`Ver convocatoria oficial de ${job.entity_name}`}
              >
                <span>Bases</span>
                <ArrowRight size={13} className="group-hover/btn:translate-x-0.5 transition-transform" />
              </Link>
            );
          })()}
        </div>
      </div>
    </div>
  );
}
