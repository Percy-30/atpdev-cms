import React from 'react';
import Link from 'next/link';
import { 
  Sparkles, Gift, ShieldCheck, CheckCircle2, ArrowRight, 
  ListOrdered, Disc, Dices, CircleDollarSign, 
  Hash, Users2, Lock, Award, Flame, Zap, Check, HelpCircle
} from 'lucide-react';
import { InstagramIcon, FacebookIcon, YoutubeIcon } from '@/components/SocialIcons';
import { PRICING_PLANS } from '@/lib/types';

export default function HomePage() {
  const standaloneTools = [
    {
      title: 'Sorteo por Lista de Nombres',
      desc: 'Pega una lista de participantes, elimina duplicados automáticamente y elige ganadores y suplentes al instante.',
      href: '/herramientas/lista',
      icon: ListOrdered,
      color: 'from-violet-500 to-purple-600',
      badge: 'Más Popular'
    },
    {
      title: 'Ruleta Aleatoria Digital',
      desc: 'Personaliza los gajos, colores y nombres. Gira la ruleta interactiva con física realista y sonido de celebración.',
      href: '/herramientas/ruleta',
      icon: Disc,
      color: 'from-pink-500 to-rose-600',
      badge: 'Interactivo'
    },
    {
      title: 'Tirar Dados 3D',
      desc: 'Lanza entre 1 y 6 dados simultáneos para juegos de mesa, decisiones rápidas o dinámicas grupales con suma total.',
      href: '/herramientas/dados',
      icon: Dices,
      color: 'from-amber-500 to-orange-600',
      badge: 'Instantáneo'
    },
    {
      title: 'Lanzar Moneda Cara o Cruz',
      desc: 'Simulación de lanzamiento de moneda con giro 3D fluido y contador de rachas y probabilidades estadísticas.',
      href: '/herramientas/moneda',
      icon: CircleDollarSign,
      color: 'from-emerald-500 to-teal-600',
      badge: 'Criptográfico'
    },
    {
      title: 'Generador de Números',
      desc: 'Elige números aleatorios entre un mínimo y un máximo. Ideal para rifas, loterías, bingos y números de la suerte.',
      href: '/herramientas/numeros',
      icon: Hash,
      color: 'from-cyan-500 to-blue-600',
      badge: 'Rifas & Bingos'
    },
    {
      title: 'Generador de Equipos',
      desc: 'Divide una lista de personas o jugadores en N equipos equilibrados de manera equitativa y sin favoritismos.',
      href: '/herramientas/equipos',
      icon: Users2,
      color: 'from-indigo-500 to-violet-600',
      badge: 'Equilibrado'
    },
  ];

  return (
    <div className="space-y-24 pb-20 overflow-hidden">
      
      {/* ─── HERO SECTION ─────────────────────────────────────────────── */}
      <section className="relative pt-12 sm:pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center space-y-8">
        
        {/* Glowing Top Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full purple-gradient-badge text-xs font-mono font-semibold uppercase tracking-wider animate-pulse">
          <Sparkles className="w-3.5 h-3.5 text-pink-400" />
          <span>Plataforma SaaS de Sorteos Verificables</span>
        </div>

        {/* Main Headline */}
        <div className="space-y-4 max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black font-display tracking-tight text-white leading-[1.1]">
            Crea Sorteos en Redes Sociales <br />
            <span className="title-neon-glow">100% Transparentes y Verificables</span>
          </h1>
          <p className="text-base sm:text-xl text-zinc-300 max-w-2xl mx-auto leading-relaxed">
            Importa comentarios de <span className="text-pink-400 font-semibold">Instagram</span>, <span className="text-blue-400 font-semibold">Facebook</span> y <span className="text-red-400 font-semibold">YouTube</span> en segundos. Aplica filtros anti-fraude y genera un certificado con validez criptográfica SHA-256.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link
            href="/sorteos/nuevo"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-violet-600 via-pink-500 to-amber-400 text-white font-bold font-display text-base shadow-xl shadow-violet-500/25 hover:scale-105 transition-all flex items-center justify-center gap-2"
          >
            <Gift className="w-5 h-5 text-amber-200" />
            <span>Crear Sorteo de Redes Sociales</span>
            <ArrowRight className="w-4 h-4 text-pink-200" />
          </Link>

          <Link
            href="/herramientas/ruleta"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl glass-card text-white font-bold font-display text-base hover:bg-white/10 transition-all border border-white/15 flex items-center justify-center gap-2"
          >
            <Disc className="w-5 h-5 text-pink-400" />
            <span>Probar Ruleta Interactiva Gratis</span>
          </Link>
        </div>

        {/* Social Platforms Pills */}
        <div className="pt-6 flex flex-wrap items-center justify-center gap-3 text-xs font-mono text-zinc-400">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/5">
            <InstagramIcon className="w-4 h-4 text-pink-400" /> Instagram Posts & Reels
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/5">
            <FacebookIcon className="w-4 h-4 text-blue-400" /> Páginas de Facebook
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/5">
            <YoutubeIcon className="w-4 h-4 text-red-400" /> Videos de YouTube
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
            <ShieldCheck className="w-4 h-4" /> Certificado Criptográfico SHA-256
          </span>
        </div>
      </section>

      {/* ─── LIVE STATS BAR ────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-card rounded-3xl p-6 sm:p-8 grid grid-cols-2 lg:grid-cols-4 gap-6 text-center border border-white/10 shadow-2xl">
          <div className="space-y-1">
            <p className="text-3xl sm:text-4xl font-black font-display text-white title-neon-glow">+150,000</p>
            <p className="text-xs font-mono text-zinc-400 uppercase tracking-wider">Sorteos Realizados</p>
          </div>
          <div className="space-y-1">
            <p className="text-3xl sm:text-4xl font-black font-display text-white gold-neon-glow">+4.8M</p>
            <p className="text-xs font-mono text-zinc-400 uppercase tracking-wider">Comentarios Procesados</p>
          </div>
          <div className="space-y-1">
            <p className="text-3xl sm:text-4xl font-black font-display text-emerald-400">100%</p>
            <p className="text-xs font-mono text-zinc-400 uppercase tracking-wider">Aleatorio y Auditable</p>
          </div>
          <div className="space-y-1">
            <p className="text-3xl sm:text-4xl font-black font-display text-cyan-400">&lt; 3 min</p>
            <p className="text-xs font-mono text-zinc-400 uppercase tracking-wider">Tiempo de Creación</p>
          </div>
        </div>
      </section>

      {/* ─── STANDALONE TOOLS GRID (LEAD MAGNET / OE-002) ───────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-mono font-bold text-pink-400 uppercase tracking-wider flex items-center justify-center gap-1.5">
            <Zap className="w-4 h-4" />
            <span>Herramientas Gratuitas Standalone</span>
          </span>
          <h2 className="text-3xl sm:text-4xl font-black font-display text-white tracking-tight">
            Sorteos Rápidos sin Registro
          </h2>
          <p className="text-sm text-zinc-400">
            Utiliza nuestras herramientas interactivas al instante: pega listas, gira la ruleta, tira dados o divide grupos de forma 100% gratuita.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {standaloneTools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link
                key={tool.href}
                href={tool.href}
                className="glass-card glass-card-hover rounded-3xl p-6 sm:p-7 flex flex-col justify-between gap-6 border border-white/10 group relative overflow-hidden"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${tool.color} flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-mono text-violet-300 font-bold px-2.5 py-1 rounded-full bg-violet-500/10 border border-violet-500/20">
                      {tool.badge}
                    </span>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-xl font-bold font-display text-white group-hover:text-pink-300 transition-colors">
                      {tool.title}
                    </h3>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      {tool.desc}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-xs font-bold font-mono text-pink-400 group-hover:text-pink-300 transition-colors pt-2">
                  <span>Probar herramienta gratis</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ─── HOW IT WORKS SECTION ──────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
            Mecánica en 3 Pasos
          </span>
          <h2 className="text-3xl sm:text-4xl font-black font-display text-white tracking-tight">
            ¿Cómo Funciona Sorteos Pro?
          </h2>
          <p className="text-sm text-zinc-400">
            Diseñado para cumplir las directrices de Meta y YouTube y certificar ante tus seguidores que no hay trampa ni manipulación.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass-card rounded-3xl p-8 space-y-4 text-center border border-white/10 relative">
            <div className="w-12 h-12 rounded-2xl bg-violet-500/20 text-violet-400 font-mono font-black text-xl flex items-center justify-center mx-auto">
              1
            </div>
            <h3 className="text-xl font-bold text-white font-display">Pega el Enlace del Post</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Introduce el enlace de tu publicación o reel de Instagram, post de Facebook o video de YouTube. Nuestro motor importa los comentarios en segundo plano.
            </p>
          </div>

          <div className="glass-card rounded-3xl p-8 space-y-4 text-center border border-white/10 relative">
            <div className="w-12 h-12 rounded-2xl bg-pink-500/20 text-pink-400 font-mono font-black text-xl flex items-center justify-center mx-auto">
              2
            </div>
            <h3 className="text-xl font-bold text-white font-display">Configura tus Reglas</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Excluye duplicados (1 persona = 1 voto), exige número mínimo de amigos etiquetados, hashtags específicos y define ganadores y suplentes.
            </p>
          </div>

          <div className="glass-card rounded-3xl p-8 space-y-4 text-center border border-white/10 relative">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 font-mono font-black text-xl flex items-center justify-center mx-auto">
              3
            </div>
            <h3 className="text-xl font-bold text-white font-display">Descarga tu Certificado</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              El sistema ejecuta el sorteo con un algoritmo criptográfico CSPRNG y crea una landing pública con hash anti-fraude y certificado descargable.
            </p>
          </div>
        </div>
      </section>

      {/* ─── PRICING TABLE SECTION ─────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-mono font-bold text-violet-400 uppercase tracking-wider">
            Planes Transparentes
          </span>
          <h2 className="text-3xl sm:text-4xl font-black font-display text-white tracking-tight">
            Escala tus Sorteos según tu Audiencia
          </h2>
          <p className="text-sm text-zinc-400">
            Empieza gratis con herramientas standalone o desbloquea filtros avanzados y mayor volumen de comentarios para tus campañas de marca.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PRICING_PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`rounded-3xl p-7 flex flex-col justify-between gap-6 border transition-all ${
                plan.isPopular
                  ? 'glass-card border-pink-500/50 shadow-2xl shadow-pink-500/10 scale-105 relative'
                  : 'glass-card border-white/10'
              }`}
            >
              {plan.isPopular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-gradient-to-r from-pink-500 to-violet-600 text-[10px] font-mono font-black uppercase tracking-wider text-white shadow-md">
                  Más Recomendado
                </div>
              )}

              <div className="space-y-4">
                <div className="space-y-1">
                  <h3 className="text-xl font-bold font-display text-white">{plan.name}</h3>
                  <p className="text-xs text-zinc-400 min-h-[32px]">{plan.tagline}</p>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-black font-display text-white">
                    {plan.priceMonthly === 0 ? '0€' : `${plan.priceMonthly}€`}
                  </span>
                  {plan.priceMonthly > 0 && (
                    <span className="text-xs text-zinc-400 font-mono">/mes</span>
                  )}
                </div>

                <div className="pt-2 border-t border-white/10 space-y-2.5 text-xs text-zinc-300">
                  {plan.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Link
                href={plan.id === 'free' ? '/sorteos/nuevo' : '/planes'}
                className={`w-full py-3 rounded-xl font-bold text-xs text-center transition-all ${
                  plan.isPopular
                    ? 'bg-gradient-to-r from-violet-600 to-pink-600 text-white shadow-lg hover:brightness-110'
                    : 'bg-white/10 text-white hover:bg-white/15'
                }`}
              >
                {plan.ctaLabel}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ─── FAQ SECTION ───────────────────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-mono font-bold text-zinc-400 uppercase tracking-wider flex items-center justify-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-amber-400" />
            <span>Dudas Frecuentes</span>
          </span>
          <h2 className="text-2xl sm:text-3xl font-black font-display text-white">Preguntas Frecuentes</h2>
        </div>

        <div className="space-y-4">
          <div className="glass-card rounded-2xl p-5 space-y-2 border border-white/10">
            <h3 className="text-base font-bold text-white font-display">¿Cómo garantiza Sorteos Pro que el resultado no está manipulado?</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Utilizamos un generador de números aleatorios criptográficamente seguro (Web Crypto API CSPRNG). Al finalizar cada sorteo se calcula un hash inmutable SHA-256 que vincula la lista completa de comentarios y la fecha/hora exacta en un certificado público que cualquiera puede auditar.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-5 space-y-2 border border-white/10">
            <h3 className="text-base font-bold text-white font-display">¿Cumple con las políticas oficiales de Instagram y Facebook?</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Sí. La plataforma utiliza las APIs oficiales de Meta Graph y YouTube Data API. No solicitamos contraseñas de tus cuentas sociales ni realizamos scraping no autorizado.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-5 space-y-2 border border-white/10">
            <h3 className="text-base font-bold text-white font-display">¿Puedo usar las herramientas sin registrarme?</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              ¡Por supuesto! Todas las herramientas standalone (Sorteo por lista, Ruleta aleatoria, Tirada de dados, Lanzar moneda, Generador de números y Equipos) son 100% gratuitas y de acceso libre directo en tu navegador.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
