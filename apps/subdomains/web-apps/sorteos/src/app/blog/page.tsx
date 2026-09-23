"use client";

import React from 'react';
import Link from 'next/link';
import { BookOpen, Calendar, Clock, ArrowRight, Sparkles, ShieldCheck, TrendingUp } from 'lucide-react';

const ARTICLES = [
  {
    id: 'guia-sorteo-instagram-2026',
    title: 'Cómo hacer un sorteo en Instagram legal, transparente y sin penalizaciones',
    slug: 'guia-sorteo-instagram-2026',
    excerpt: 'Conoce los requisitos de las Normas de Promoción de Meta, qué condiciones son obligatorias incluir en el texto del post y cómo certificar a tus ganadores sin riesgos.',
    category: 'Instagram & Meta',
    readTime: '6 min lectura',
    date: '18 Sep 2026',
    featured: true
  },
  {
    id: 'evitar-sospechas-sorteo-arreglado',
    title: '5 claves para evitar que sospechen que tu sorteo está "arreglado"',
    slug: 'evitar-sospechas-sorteo-arreglado',
    excerpt: 'La desconfianza en redes sociales es alta. Descubre cómo usar certificados públicos con firma digital SHA-256 para blindar tu credibilidad y proteger tu marca.',
    category: 'Transparencia',
    readTime: '4 min lectura',
    date: '12 Sep 2026',
    featured: false
  },
  {
    id: 'csprng-aleatoriedad-explicada',
    title: '¿Por qué Math.random() no es seguro para sorteos y qué es CSPRNG?',
    slug: 'csprng-aleatoriedad-explicada',
    excerpt: 'Explicamos la diferencia técnica entre los generadores pseudo-aleatorios y los generadores criptográficamente seguros respaldados por la entropía del sistema operativo.',
    category: 'Tecnología & Criptografía',
    readTime: '5 min lectura',
    date: '05 Sep 2026',
    featured: false
  },
  {
    id: 'estrategias-sorteos-virales-reels',
    title: 'Estrategias virales: Cómo multiplicar por 10 los comentarios de tu sorteo',
    slug: 'estrategias-sorteos-virales-reels',
    excerpt: 'Mecánicas comprobadas que aumentan la interacción orgánica sin caer en spam ni provocar bloqueos por parte del algoritmo de Instagram o TikTok.',
    category: 'Growth & Marketing',
    readTime: '7 min lectura',
    date: '28 Ago 2026',
    featured: false
  }
];

export default function BlogPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      {/* Header */}
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full gold-gradient-badge text-xs font-mono font-bold uppercase tracking-wider">
          <BookOpen className="w-3.5 h-3.5" />
          <span>Blog & Recursos</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black font-display text-white tracking-tight">
          Guías y Mejores Prácticas para Sorteos
        </h1>
        <p className="text-sm sm:text-base text-zinc-400">
          Aprende a crear promociones efectivas, legales y transparentes que hagan crecer tu comunidad de forma orgánica.
        </p>
      </div>

      {/* Featured Article */}
      {ARTICLES.filter((a) => a.featured).map((post) => (
        <div
          key={post.id}
          className="glass-card rounded-3xl p-8 sm:p-12 border border-purple-500/40 relative overflow-hidden bg-gradient-to-r from-purple-950/20 via-white/[0.02] to-transparent space-y-6"
        >
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-xs font-mono font-bold">
              ⭐ Destacado
            </span>
            <span className="px-3 py-1 rounded-full bg-white/5 text-zinc-400 text-xs font-mono">
              {post.category}
            </span>
            <div className="flex items-center gap-3 text-xs font-mono text-zinc-500">
              <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {post.date}</span>
              <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {post.readTime}</span>
            </div>
          </div>

          <div className="space-y-3 max-w-2xl">
            <h2 className="text-2xl sm:text-3xl font-black font-display text-white hover:text-purple-300 transition-colors cursor-pointer">
              {post.title}
            </h2>
            <p className="text-sm sm:text-base text-zinc-300 leading-relaxed">
              {post.excerpt}
            </p>
          </div>

          <div className="pt-2">
            <Link
              href={`/sorteos/nuevo`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold font-display text-xs shadow-lg shadow-purple-600/30 transition-all"
            >
              <span>Aplicar en un Sorteo</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      ))}

      {/* Article List */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {ARTICLES.filter((a) => !a.featured).map((post) => (
          <div
            key={post.id}
            className="glass-card rounded-3xl p-6 border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-zinc-500">
                <span className="text-purple-400 font-bold">{post.category}</span>
                <span>{post.readTime}</span>
              </div>

              <h3 className="text-lg font-bold font-display text-white leading-snug">
                {post.title}
              </h3>

              <p className="text-xs text-zinc-400 leading-relaxed">
                {post.excerpt}
              </p>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-white/5 text-xs font-mono">
              <span className="text-zinc-500">{post.date}</span>
              <Link
                href="/sorteos/nuevo"
                className="text-purple-400 hover:text-purple-300 font-bold flex items-center gap-1 transition-colors"
              >
                <span>Leer más</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Newsletter / CTA banner */}
      <div className="glass-card rounded-3xl p-8 sm:p-10 border border-white/10 text-center space-y-4 max-w-3xl mx-auto">
        <Sparkles className="w-8 h-8 text-amber-400 mx-auto" />
        <h2 className="text-2xl font-black font-display text-white">
          ¿Listo para crear tu próximo sorteo con certificado?
        </h2>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-lg mx-auto">
          Prueba nuestras herramientas gratuitas o inicia tu primer sorteo en Instagram o Facebook en menos de 2 minutos.
        </p>
        <div className="pt-2">
          <Link
            href="/sorteos/nuevo"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 text-white font-bold font-display text-sm shadow-xl shadow-purple-600/30 hover:scale-105 transition-all"
          >
            <span>Crear Sorteo Ahora</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
