import Link from "next/link";
import { JobPosting } from "@atpdev/database";
import { ShieldCheck, MapPin, ExternalLink, Clock, Users, GraduationCap, ArrowRight } from "lucide-react";
import { EntityLogo } from "@/components/EntityLogo";

interface JobCardProps {
  job: JobPosting;
}

export function JobCard({ job }: JobCardProps) {
  // Days remaining calculation
  const endDate = new Date(job.end_date);
  const now = new Date();
  const diffDays = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 3600 * 24));
  const isEndingSoon = diffDays <= 3 && diffDays >= 0;

  return (
    <div className="glass-card glass-card-hover p-5 rounded-3xl flex flex-col justify-between gap-4 relative group overflow-hidden border border-white/10 hover:border-emerald-500/40 transition-all bg-gradient-to-b from-slate-900/90 via-slate-900 to-[#070d14]">
      
      {/* Top Banner Cover Logo */}
      <Link href={`/empleos/${job.slug}`} className="block group">
        <EntityLogo entityName={job.entity_name} logoUrl={job.entity_logo} size="banner" />
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
            {diffDays <= 2 && diffDays >= 0 && (
              <span className="px-2 py-0.5 rounded-md bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[9px] font-mono font-extrabold animate-pulse">
                🔥 ¡VENCE PRONTO!
              </span>
            )}
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
        <Link href={`/empleos/${job.slug}`} className="block group-hover:text-emerald-400 transition-colors">
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

      {/* Footer Row with two clear CTAs */}
      <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
        {/* Deadline Status */}
        <div className="flex items-center gap-1.5 font-mono">
          <Clock size={14} className={isEndingSoon ? "text-amber-400 animate-pulse" : "text-slate-400"} />
          <span className={isEndingSoon ? "text-amber-400 font-bold" : "text-slate-400"}>
            {diffDays > 0 ? `Cierra en ${diffDays} día${diffDays > 1 ? 's' : ''}` : 'Vence Hoy'}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Link
            href={`/empleos/${job.slug}`}
            className="flex-1 sm:flex-initial px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold font-display transition-all flex items-center justify-center gap-1.5 border border-white/10"
          >
            <span>Ver detalles</span>
            <ArrowRight size={13} />
          </Link>
          <a
            href={job.apply_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500 border border-emerald-500/40 text-emerald-400 hover:text-slate-950 font-semibold font-display transition-all flex items-center justify-center gap-1.5 group/btn"
          >
            <span>Oficial</span>
            <ExternalLink size={13} className="group-hover/btn:translate-x-0.5 transition-transform" />
          </a>
        </div>
      </div>
    </div>
  );
}
