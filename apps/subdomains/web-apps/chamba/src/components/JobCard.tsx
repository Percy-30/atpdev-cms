import Link from "next/link";
import { JobPosting } from "@atpdev/database";
import { ShieldCheck, MapPin, Users, GraduationCap, ArrowRight } from "lucide-react";
import { EntityLogo } from "@/components/EntityLogo";
import { JobCountdownClock } from "@/components/JobCountdownClock";

interface JobCardProps {
  job: JobPosting;
}

export function JobCard({ job }: JobCardProps) {
  return (
    <div className="glass-card glass-card-hover p-6 rounded-3xl flex flex-col justify-between gap-5 relative group overflow-hidden border border-white/10 hover:border-emerald-500/50 transition-all bg-gradient-to-b from-slate-900/95 via-[#0c1424] to-[#070b14] shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:shadow-[0_20px_45px_-10px_rgba(16,185,129,0.25)]">
      {/* Top Ambient Glow Line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Top Banner & Entity Header */}
      <Link
        href={`/empleos/${job.slug}`}
        className="block group/entity"
        aria-label={`Convocatoria de empleo ${job.title} en ${job.entity_name}`}
        title={`Convocatoria de empleo ${job.title} en ${job.entity_name}`}
      >
        <div className="rounded-2xl p-3 bg-slate-950/70 border border-white/10 group-hover/entity:border-emerald-500/40 transition-all shadow-inner">
          <EntityLogo entityName={job.entity_name} logoUrl={job.entity_logo} size="banner" />
        </div>
        <div className="flex items-center justify-between gap-2 mt-2.5 px-0.5">
          <span className="block text-xs font-display font-bold text-slate-200 group-hover/entity:text-emerald-400 transition-colors truncate">
            {job.entity_name}
          </span>
          {job.entity_verified && (
            <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-1.5 py-0.5 rounded flex-shrink-0" title="RUC y entidad oficial verificada">
              <ShieldCheck size={11} />
              <span>Verificado</span>
            </span>
          )}
        </div>
      </Link>

      <div className="space-y-3.5">
        {/* Meta Bar */}
        <div className="flex items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5 text-slate-300 font-mono">
            <MapPin size={13} className="text-emerald-400 flex-shrink-0" />
            <span className="font-semibold text-slate-200 truncate">{job.region}</span>
          </div>

          {/* Regime Pill */}
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-mono font-black px-2.5 py-0.5 rounded-full border flex-shrink-0 shadow-sm ${
              job.sector_type === 'CAS 1057' 
                ? 'bg-amber-500/15 text-amber-300 border-amber-500/40 shadow-[0_0_10px_rgba(245,158,11,0.15)]' 
                : job.sector_type === 'D.L. 728' 
                ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.15)]' 
                : 'bg-cyan-500/15 text-cyan-300 border-cyan-500/40 shadow-[0_0_10px_rgba(6,182,212,0.15)]'
            }`}>
              {job.sector_type}
            </span>
          </div>
        </div>

        {/* Position Title Link */}
        <Link
          href={`/empleos/${job.slug}`}
          className="block group-hover:text-emerald-300 transition-colors"
          aria-label={`Ver convocatoria para ${job.title}`}
        >
          <h3 className="font-display font-bold text-base sm:text-lg text-white leading-snug line-clamp-2 group-hover:translate-x-0.5 transition-transform">
            {job.title}
          </h3>
        </Link>

        {/* Meta badges row */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-slate-300">
          <span className="px-3 py-1 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-emerald-400 font-extrabold shadow-[0_0_12px_rgba(16,185,129,0.1)]">
            {job.salary_text}
          </span>
          <span className="px-2.5 py-1 rounded-xl bg-slate-900/90 border border-white/10 text-slate-300 flex items-center gap-1.5">
            <Users size={13} className="text-slate-400" />
            <span>{job.vacancies_count} vacante{job.vacancies_count > 1 ? 's' : ''}</span>
          </span>
          {job.plazas && job.plazas.length > 1 && (
            <span className="px-2.5 py-1 rounded-xl bg-purple-500/15 border border-purple-500/30 text-purple-300 font-bold flex items-center gap-1">
              <span>{job.plazas.length} plazas</span>
            </span>
          )}
          <span className="px-2.5 py-1 rounded-xl bg-slate-900/90 border border-white/10 text-slate-300 flex items-center gap-1.5">
            <GraduationCap size={13} className="text-slate-400" />
            <span>{job.education_level}</span>
          </span>
        </div>
      </div>

      {/* Footer Row with countdown and single clear Details CTA */}
      <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3 text-xs">
        {/* Dynamic Countdown Clock (Green, Orange, Red, Blue) */}
        <JobCountdownClock endDate={job.end_date} size="sm" />

        {/* Ver Detalles CTA */}
        <Link
          href={`/empleos/${job.slug}`}
          className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500/15 via-teal-500/20 to-emerald-500/15 hover:from-emerald-400 hover:via-teal-400 hover:to-emerald-400 text-emerald-300 hover:text-slate-950 font-bold font-display transition-all duration-200 flex items-center justify-center gap-1.5 border border-emerald-500/30 hover:border-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.15)] hover:shadow-[0_0_20px_rgba(16,185,129,0.4)] group/btn cursor-pointer"
          aria-label={`Ver detalles, bases y requisitos de ${job.title}`}
        >
          <span>Ver Detalles</span>
          <ArrowRight size={13} className="group-hover/btn:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
