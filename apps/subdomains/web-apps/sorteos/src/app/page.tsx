import React from 'react';
import Link from 'next/link';
import { 
  Sparkles, Gift, ShieldCheck, ArrowRight, 
  ListOrdered, Disc, Dices, CircleDollarSign, 
  Hash, Users2, Zap, Check, HelpCircle
} from 'lucide-react';
import { InstagramIcon, FacebookIcon, YoutubeIcon } from '@/components/SocialIcons';
import { HomeHashVerifier } from '@/components/HomeHashVerifier';
import { PRICING_PLANS } from '@/lib/types';

export default function HomePage() {
  const standaloneTools = [
    {
      title: 'Sorteo por Nombres al Azar',
      desc: 'Pega una lista de participantes, elimina duplicados automáticamente y elige ganadores y suplentes con certificación inmutable.',
      href: '/herramientas/lista',
      icon: ListOrdered,
      color: 'from-amber-400 to-amber-600',
      badge: 'Más Usado',
      action: 'Abrir Lista'
    },
    {
      title: 'Ruleta Aleatoria Digital',
      desc: 'Personaliza los gajos, premios o nombres y gira la ruleta interactiva con física realista y algoritmo CSPRNG.',
      href: '/herramientas/ruleta',
      icon: Disc,
      color: 'from-pink-500 to-rose-600',
      badge: 'Interactivo',
      action: 'Girar Ruleta'
    },
    {
      title: 'Tirar Dados 3D',
      desc: 'Lanza entre 1 y 6 dados simultáneos con física visual y cálculo automático de la suma total para juegos o decisiones.',
      href: '/herramientas/dados',
      icon: Dices,
      color: 'from-amber-500 to-orange-600',
      badge: 'Instantáneo',
      action: 'Lanzar Dados'
    },
    {
      title: 'Lanzar Moneda (Cara o Cruz)',
      desc: 'Simulación de volado de moneda con giro 3D de alta precisión y estadísticas criptográficas sin sesgos.',
      href: '/herramientas/moneda',
      icon: CircleDollarSign,
      color: 'from-emerald-500 to-teal-600',
      badge: 'Criptográfico',
      action: 'Lanzar Moneda'
    },
    {
      title: 'Generador de Números',
      desc: 'Elige números aleatorios entre un mínimo y un máximo sin repetición para rifas, loterías y bingos.',
      href: '/herramientas/numeros',
      icon: Hash,
      color: 'from-cyan-500 to-blue-600',
      badge: 'Rifas & Bingos',
      action: 'Generar Números'
    },
    {
      title: 'Generador de Equipos',
      desc: 'Divide una lista de personas o jugadores en N equipos equilibrados de manera equitativa y sin favoritismos.',
      href: '/herramientas/equipos',
      icon: Users2,
      color: 'from-indigo-500 to-violet-600',
      badge: 'Balanceado',
      action: 'Armar Equipos'
    },
    {
      title: 'Amigo Invisible Secreto',
      desc: 'Organiza intercambios de regalos. Emparejamiento aleatorio seguro con tarjetas secretas y enlaces para WhatsApp.',
      href: '/herramientas/amigo-invisible',
      icon: Gift,
      color: 'from-rose-500 to-pink-600',
      badge: 'Nuevo & Secreto',
      action: 'Crear Amigo Invisible'
    },
  ];

  return (
    <div className="space-y-20 pb-24 overflow-hidden">
      
      {/* ─── HERO SECTION CENTRADO ───────────────────────────────────────── */}
      <section className="relative pt-10 sm:pt-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto text-center space-y-7">
        
        {/* Glowing Top Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-pink-50 dark:bg-pink-500/10 border border-pink-200 dark:border-pink-500/20 text-xs font-semibold uppercase tracking-wider text-pink-700 dark:text-pink-300 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-pink-600 dark:text-pink-400" />
          <span>Plataforma de Sorteos Verificables</span>
        </div>

        {/* Main Headline */}
        <div className="space-y-4 max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold font-display tracking-tight text-slate-900 dark:text-white leading-[1.1]">
            Crea Sorteos en Redes Sociales <br />
            <span className="title-neon-glow">100% Transparentes y Verificables</span>
          </h1>
          <p className="text-base sm:text-xl text-slate-600 dark:text-zinc-400 max-w-2xl mx-auto leading-relaxed">
            Importa comentarios de <span className="text-pink-600 dark:text-pink-400 font-semibold">Instagram</span>, <span className="text-blue-600 dark:text-blue-400 font-semibold">Facebook</span> y <span className="text-red-600 dark:text-red-400 font-semibold">YouTube</span>. Aplica filtros anti-fraude y genera un certificado con validez criptográfica SHA-256.
          </p>
        </div>

        {/* Big Pro CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <Link
            href="/sorteos/nuevo"
            className="btn-pro-primary w-full sm:w-auto text-base sm:text-lg py-4 px-8 cursor-pointer"
          >
            <Gift className="w-5 h-5" />
            <span>Crear Sorteo de Redes Sociales</span>
            <ArrowRight className="w-5 h-5" />
          </Link>

          <Link
            href="/herramientas/lista"
            className="btn-pro-secondary w-full sm:w-auto text-base sm:text-lg py-4 px-8 cursor-pointer"
          >
            <ListOrdered className="w-5 h-5 text-pink-600 dark:text-pink-400" />
            <span>Sorteo de Nombres Gratis</span>
          </Link>
        </div>

        {/* Quick Access Tools Pills */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
          <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider mr-2">Herramientas instantáneas:</span>
          {standaloneTools.map((t) => {
            const Icon = t.icon;
            return (
              <Link
                key={t.href}
                href={t.href}
                className="tool-switcher-pill hover:scale-105 active:scale-95"
              >
                <Icon className="w-3.5 h-3.5 text-pink-600 dark:text-pink-400" />
                <span>{t.title.split(' ')[0]} {t.title.split(' ')[1] || ''}</span>
              </Link>
            );
          })}
        </div>

        {/* Trust Pills */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-3 text-xs text-slate-600 dark:text-zinc-300 font-medium">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 shadow-xs">
            <InstagramIcon className="w-4 h-4 text-pink-600" /> Instagram Posts & Reels
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 shadow-xs">
            <FacebookIcon className="w-4 h-4 text-blue-600" /> Páginas de Facebook
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 shadow-xs">
            <YoutubeIcon className="w-4 h-4 text-red-600" /> Videos de YouTube
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-800 dark:text-emerald-300 shadow-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Certificado SHA-256
          </span>
        </div>
      </section>

      {/* ─── LIVE STATS BAR ────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-[#0f172a] rounded-3xl p-6 sm:p-8 grid grid-cols-2 lg:grid-cols-4 gap-6 text-center border border-slate-200 dark:border-white/10 shadow-sm">
          <div className="space-y-1">
            <p className="text-3xl sm:text-4xl font-extrabold font-display text-slate-900 dark:text-white">+150,000</p>
            <p className="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">Sorteos Realizados</p>
          </div>
          <div className="space-y-1">
            <p className="text-3xl sm:text-4xl font-extrabold font-display text-[#d91a7a]">+4.8M</p>
            <p className="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">Comentarios Procesados</p>
          </div>
          <div className="space-y-1">
            <p className="text-3xl sm:text-4xl font-extrabold font-display text-emerald-600 dark:text-emerald-400">100%</p>
            <p className="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">Aleatorio y Auditable</p>
          </div>
          <div className="space-y-1">
            <p className="text-3xl sm:text-4xl font-extrabold font-display text-cyan-600 dark:text-cyan-400">&lt; 3 min</p>
            <p className="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">Tiempo de Creación</p>
          </div>
        </div>
      </section>

      {/* ─── PUBLIC HASH VERIFIER WIDGET ───────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <HomeHashVerifier />
      </section>

      {/* ─── STANDALONE TOOLS GRID ─────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-xs font-bold text-pink-600 dark:text-pink-400 uppercase tracking-wider flex items-center justify-center gap-1.5">
            <Zap className="w-4 h-4" />
            <span>Herramientas Gratuitas Standalone</span>
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-slate-900 dark:text-white tracking-tight">
            Sorteos Rápidos sin Registro
          </h2>
          <p className="text-sm text-slate-600 dark:text-zinc-400">
            Utiliza nuestras herramientas interactivas al instante: pega listas, gira la ruleta, tira dados o divide grupos de forma 100% gratuita.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {standaloneTools.map((tool) => {
            const Icon = tool.icon;
            return (
              <div
                key={tool.href}
                className="bg-white dark:bg-[#0f172a] rounded-3xl p-6 sm:p-7 flex flex-col justify-between gap-6 border border-slate-200 dark:border-white/10 shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-white/20 transition-all group relative overflow-hidden"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${tool.color} flex items-center justify-center text-white shadow-sm group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-600 dark:text-zinc-300 px-2.5 py-1 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10">
                      {tool.badge}
                    </span>
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white group-hover:text-pink-600 dark:group-hover:text-purple-400 transition-colors">
                      {tool.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
                      {tool.desc}
                    </p>
                  </div>
                </div>

                <Link
                  href={tool.href}
                  className="w-full py-3 rounded-xl bg-slate-50 dark:bg-white/5 hover:bg-[#d91a7a] dark:hover:bg-purple-600 hover:text-white border border-slate-200 dark:border-white/10 hover:border-transparent text-slate-800 dark:text-zinc-200 font-bold font-display text-xs text-center flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer"
                >
                  <span>{tool.action}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── HOW IT WORKS SECTION ──────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
            Mecánica en 3 Pasos
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-slate-900 dark:text-white tracking-tight">
            ¿Cómo Funciona Sorteos Pro?
          </h2>
          <p className="text-sm text-slate-600 dark:text-zinc-400">
            Diseñado para cumplir las directrices de Meta y YouTube y certificar ante tus seguidores que no hay trampa ni manipulación.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-[#0f172a] rounded-3xl p-8 space-y-4 text-center border border-slate-200 dark:border-white/10 shadow-sm relative">
            <div className="w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 font-bold text-xl flex items-center justify-center mx-auto">
              1
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white font-display">Pega el Enlace del Post</h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
              Introduce el enlace de tu publicación o reel de Instagram, post de Facebook o video de YouTube. Nuestro motor importa los comentarios en segundo plano.
            </p>
          </div>

          <div className="bg-white dark:bg-[#0f172a] rounded-3xl p-8 space-y-4 text-center border border-slate-200 dark:border-white/10 shadow-sm relative">
            <div className="w-12 h-12 rounded-2xl bg-pink-100 dark:bg-pink-500/20 text-pink-700 dark:text-pink-300 font-bold text-xl flex items-center justify-center mx-auto">
              2
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white font-display">Configura tus Reglas</h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
              Excluye duplicados (1 persona = 1 voto), exige número mínimo de amigos etiquetados, hashtags específicos y define ganadores y suplentes.
            </p>
          </div>

          <div className="bg-white dark:bg-[#0f172a] rounded-3xl p-8 space-y-4 text-center border border-slate-200 dark:border-white/10 shadow-sm relative">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 font-bold text-xl flex items-center justify-center mx-auto">
              3
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white font-display">Descarga tu Certificado</h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed">
              El sistema ejecuta el sorteo con un algoritmo criptográfico CSPRNG y crea una landing pública con hash anti-fraude y certificado descargable.
            </p>
          </div>
        </div>
      </section>

      {/* ─── PRICING TABLE SECTION ─────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-xs font-bold text-pink-600 dark:text-purple-400 uppercase tracking-wider">
            Planes Transparentes
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-slate-900 dark:text-white tracking-tight">
            Escala tus Sorteos según tu Audiencia
          </h2>
          <p className="text-sm text-slate-600 dark:text-zinc-400">
            Empieza gratis con herramientas standalone o desbloquea filtros avanzados y mayor volumen de comentarios para tus campañas de marca.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {PRICING_PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`rounded-3xl p-7 flex flex-col justify-between gap-6 border transition-all ${
                plan.isPopular
                  ? 'bg-white dark:bg-[#0f172a] border-[#d91a7a] dark:border-purple-500 shadow-xl shadow-pink-500/10 scale-105 relative'
                  : 'bg-white dark:bg-[#0f172a] border-slate-200 dark:border-white/10 shadow-sm'
              }`}
            >
              {plan.isPopular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-[#d91a7a] text-[10px] font-bold uppercase tracking-wider text-white shadow-sm">
                  Más Recomendado
                </div>
              )}

              <div className="space-y-4">
                <div className="space-y-1">
                  <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white">{plan.name}</h3>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 min-h-[32px]">{plan.tagline}</p>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold font-display text-slate-900 dark:text-white">
                    {plan.priceMonthly === 0 ? '0€' : `${plan.priceMonthly}€`}
                  </span>
                  {plan.priceMonthly > 0 && (
                    <span className="text-xs text-slate-500 dark:text-zinc-400 font-medium">/mes</span>
                  )}
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-white/5 space-y-2.5 text-xs text-slate-600 dark:text-zinc-300">
                  {plan.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-pink-600 dark:text-purple-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Link
                href={plan.id === 'free' ? '/sorteos/nuevo' : '/planes'}
                className={`w-full py-3.5 rounded-xl font-bold font-display text-xs text-center transition-all cursor-pointer ${
                  plan.isPopular
                    ? 'btn-pro-primary py-3.5 w-full text-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-white/10 dark:hover:bg-white/20 dark:text-white border border-slate-200 dark:border-white/10'
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
          <span className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center justify-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-amber-500" />
            <span>Dudas Frecuentes</span>
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-slate-900 dark:text-white">Preguntas Frecuentes</h2>
        </div>

        <div className="space-y-4">
          <div className="bg-white dark:bg-[#0f172a] rounded-2xl p-5 space-y-2 border border-slate-200 dark:border-white/10 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-display">¿Cómo garantiza Sorteos Pro que el resultado no está manipulado?</h3>
            <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
              Utilizamos un generador de números aleatorios criptográficamente seguro (Web Crypto API CSPRNG). Al finalizar cada sorteo se calcula un hash inmutable SHA-256 que vincula la lista completa de comentarios y la fecha/hora exacta en un certificado público que cualquiera puede auditar.
            </p>
          </div>

          <div className="bg-white dark:bg-[#0f172a] rounded-2xl p-5 space-y-2 border border-slate-200 dark:border-white/10 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-display">¿Cumple con las políticas oficiales de Instagram y Facebook?</h3>
            <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
              Sí. La plataforma utiliza las APIs oficiales de Meta Graph y YouTube Data API. No solicitamos contraseñas de tus cuentas sociales ni realizamos scraping no autorizado.
            </p>
          </div>

          <div className="bg-white dark:bg-[#0f172a] rounded-2xl p-5 space-y-2 border border-slate-200 dark:border-white/10 shadow-sm">
            <h3 className="text-base font-bold text-slate-900 dark:text-white font-display">¿Puedo usar las herramientas sin registrarme?</h3>
            <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
              ¡Por supuesto! Todas las herramientas standalone (Sorteo por lista, Ruleta aleatoria, Tirada de dados, Lanzar moneda, Generador de números y Equipos) son 100% gratuitas y de acceso libre directo en tu navegador.
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
