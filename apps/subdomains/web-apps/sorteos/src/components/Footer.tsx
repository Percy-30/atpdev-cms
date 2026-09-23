import React from 'react';
import Link from 'next/link';
import { Gift, ShieldCheck, Heart, Sparkles, ExternalLink, Lock } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-white/10 bg-[#070a12] text-zinc-400 text-sm relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-violet-950/15 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 relative z-10 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 to-pink-500 p-0.5 shadow-md shadow-violet-500/20">
                <div className="w-full h-full bg-[#0b0f19] rounded-[10px] flex items-center justify-center">
                  <Gift className="w-4 h-4 text-pink-400" />
                </div>
              </div>
              <span className="text-xl font-black font-display text-white">sorteos <span className="text-violet-400">pro</span></span>
            </Link>

            <p className="text-xs text-zinc-400 leading-relaxed max-w-sm">
              Plataforma SaaS multi-tenant de sorteos verificables para Instagram, Facebook, YouTube y herramientas standalone. Certificación con semillas criptográficas inmutables y cumplimiento de normativas de plataformas sociales y RGPD.
            </p>

            <div className="flex items-center gap-2 text-xs text-emerald-400 font-mono bg-emerald-500/10 border border-emerald-500/20 rounded-full px-3 py-1 w-fit">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Algoritmo Aleatorio Verificable CSPRNG</span>
            </div>
          </div>

          {/* Col 1: Herramientas Gratuitas */}
          <div className="space-y-3">
            <p className="text-xs font-mono uppercase tracking-wider text-white font-bold">Herramientas Gratis</p>
            <ul className="space-y-2 text-xs">
              <li><Link href="/herramientas/lista" className="hover:text-violet-300 transition-colors">Sorteo por Lista</Link></li>
              <li><Link href="/herramientas/ruleta" className="hover:text-violet-300 transition-colors">Ruleta Aleatoria</Link></li>
              <li><Link href="/herramientas/dados" className="hover:text-violet-300 transition-colors">Tirar Dados 3D</Link></li>
              <li><Link href="/herramientas/moneda" className="hover:text-violet-300 transition-colors">Lanzar Moneda</Link></li>
              <li><Link href="/herramientas/numeros" className="hover:text-violet-300 transition-colors">Generador de Números</Link></li>
              <li><Link href="/herramientas/equipos" className="hover:text-violet-300 transition-colors">Reparto de Equipos</Link></li>
            </ul>
          </div>

          {/* Col 2: Sorteos Redes */}
          <div className="space-y-3">
            <p className="text-xs font-mono uppercase tracking-wider text-white font-bold">Sorteos Sociales</p>
            <ul className="space-y-2 text-xs">
              <li><Link href="/sorteos/nuevo?platform=instagram" className="hover:text-pink-400 transition-colors">Sorteo Instagram</Link></li>
              <li><Link href="/sorteos/nuevo?platform=facebook" className="hover:text-blue-400 transition-colors">Sorteo Facebook</Link></li>
              <li><Link href="/sorteos/nuevo?platform=youtube" className="hover:text-red-400 transition-colors">Sorteo YouTube</Link></li>
              <li><Link href="/planes" className="hover:text-violet-300 transition-colors">Planes y Precios</Link></li>
              <li><Link href="/blog" className="hover:text-violet-300 transition-colors">Guías Legales</Link></li>
            </ul>
          </div>

          {/* Col 3: Legal & Seguridad */}
          <div className="space-y-3">
            <p className="text-xs font-mono uppercase tracking-wider text-white font-bold">Legal & Seguridad</p>
            <ul className="space-y-2 text-xs">
              <li><Link href="/terminos-y-condiciones" className="hover:text-zinc-200 transition-colors">Términos del Servicio</Link></li>
              <li><Link href="/politica-de-privacidad" className="hover:text-zinc-200 transition-colors">Política de Privacidad</Link></li>
              <li><span className="text-zinc-500">Aviso Legal de Sorteos</span></li>
              <li><span className="text-zinc-500">Cifrado AES-256 en Reposo</span></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500 font-mono">
          <p>© {new Date().getFullYear()} Sorteos Pro. Todos los derechos reservados.</p>
          <div className="flex items-center gap-2">
            <span>Desarrollado con</span>
            <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500" />
            <span>por</span>
            <span className="text-zinc-300 font-bold">ATP Dev</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
