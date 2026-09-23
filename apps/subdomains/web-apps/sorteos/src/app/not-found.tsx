import Link from 'next/link';
import { Gift, Home, Disc, Dices, ArrowLeft, Search, Sparkles } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-xl w-full text-center space-y-8 glass-card p-8 sm:p-12 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
        {/* Glow ambient */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

        {/* Emblem & 404 Badge */}
        <div className="space-y-3">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Gift size={32} />
          </div>
          <span className="inline-block px-3 py-1 rounded-full bg-purple-500/10 text-purple-300 text-xs font-mono font-bold border border-purple-500/20">
            ERROR 404 • PÁGINA O SORTEO NO ENCONTRADO
          </span>
          <h1 className="text-2xl sm:text-3xl font-black font-display text-white">
            El sorteo o enlace que buscas no existe
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-md mx-auto">
            El sorteo puede haber sido eliminado, la URL es incorrecta o el certificado ya no está disponible.
          </p>
        </div>

        {/* Quick Navigation CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/sorteos/nuevo"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 text-white font-bold text-xs font-display transition-all shadow-lg shadow-purple-600/20 hover:opacity-95 flex items-center justify-center gap-2"
          >
            <Sparkles size={15} />
            <span>Crear un Sorteo</span>
          </Link>
          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-200 font-semibold text-xs transition-colors flex items-center justify-center gap-2"
          >
            <Home size={15} />
            <span>Ir al Inicio</span>
          </Link>
        </div>

        {/* Standalone Tools Shortcuts */}
        <div className="pt-6 border-t border-white/10 space-y-3 text-xs">
          <span className="text-[11px] font-mono text-zinc-500 uppercase tracking-wider block">
            Herramientas Gratuitas Populares
          </span>
          <div className="flex flex-wrap justify-center gap-2">
            <Link
              href="/herramientas/ruleta"
              className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-purple-500/40 text-zinc-300 text-[11px] transition-colors flex items-center gap-1.5"
            >
              <Disc size={13} className="text-purple-400" />
              <span>Ruleta Aleatoria</span>
            </Link>
            <Link
              href="/herramientas/dados"
              className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-purple-500/40 text-zinc-300 text-[11px] transition-colors flex items-center gap-1.5"
            >
              <Dices size={13} className="text-amber-400" />
              <span>Tirar Dados 3D</span>
            </Link>
            <Link
              href="/herramientas/lista"
              className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-purple-500/40 text-zinc-300 text-[11px] transition-colors"
            >
              <span>Sorteo por Lista</span>
            </Link>
            <Link
              href="/herramientas/moneda"
              className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 hover:border-purple-500/40 text-zinc-300 text-[11px] transition-colors"
            >
              <span>Cara o Cruz</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
