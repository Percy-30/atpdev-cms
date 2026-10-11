import Link from 'next/link';
import { Search, ArrowLeft, Briefcase, Calculator, ShieldCheck, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-xl w-full text-center space-y-8 bg-white dark:bg-slate-900 p-8 sm:p-12 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        {/* Emblem & 404 Badge */}
        <div className="space-y-3">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/40 flex items-center justify-center text-emerald-700 dark:text-emerald-400">
            <Search size={32} />
          </div>
          <span className="inline-block px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-400 text-xs font-mono font-bold border border-amber-200 dark:border-amber-800/40">
            ERROR 404 • PÁGINA NO ENCONTRADA
          </span>
          <h1 className="text-2xl sm:text-3xl font-black font-display text-slate-900 dark:text-white">
            Convocatoria no disponible o plazo finalizado
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed max-w-md mx-auto">
            La oferta laboral que buscas puede haber alcanzado su fecha límite de postulación, fue actualizada por la entidad o la URL ingresada es incorrecta.
          </p>
        </div>

        {/* Quick Navigation CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/empleos"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white dark:text-slate-950 font-bold text-xs font-display transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            <Briefcase size={15} />
            <span>Ver Convocatorias Vigentes</span>
          </Link>
          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Home size={15} />
            <span>Ir al Inicio</span>
          </Link>
        </div>

        {/* Popular Tools Shortcuts */}
        <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-3 text-xs">
          <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider block font-semibold">
            Herramientas Recomendadas
          </span>
          <div className="flex flex-wrap justify-center gap-2">
            <Link
              href="/calculadora-sueldo"
              className="px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 text-slate-700 dark:text-slate-300 text-[11px] transition-colors"
            >
              Calculadora Sueldo CAS
            </Link>
            <Link
              href="/crear-cv-cas"
              className="px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 text-slate-700 dark:text-slate-300 text-[11px] transition-colors"
            >
              Generador CV SERVIR
            </Link>
            <Link
              href="/simulador-entrevista-ia"
              className="px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 text-slate-700 dark:text-slate-300 text-[11px] transition-colors"
            >
              Simulador de Entrevistas
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
