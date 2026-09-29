import React from 'react';
import Link from 'next/link';
import { Gift, ShieldCheck, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200 bg-white text-slate-600 text-sm relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-pink-600 to-rose-500 p-0.5 shadow-xs flex items-center justify-center text-white">
                <Gift className="w-4 h-4" />
              </div>
              <span className="text-xl font-extrabold font-display text-slate-900">sorteos <span className="text-pink-600">pro</span></span>
            </Link>

            <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
              Plataforma multi-tenant de sorteos verificables para Instagram, Facebook, YouTube y herramientas standalone. Certificación con semillas criptográficas inmutables y cumplimiento de normativas de plataformas sociales y RGPD.
            </p>

            <div className="flex items-center gap-2 text-xs text-emerald-700 font-medium bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1 w-fit">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Algoritmo Aleatorio Verificable CSPRNG</span>
            </div>
          </div>

          {/* Col 1: Herramientas Gratuitas */}
          <div className="space-y-3">
            <p className="text-xs font-mono uppercase tracking-wider text-slate-900 font-bold">Herramientas Gratis</p>
            <ul className="space-y-2 text-xs text-slate-600">
              <li><Link href="/herramientas/lista" className="hover:text-pink-600 transition-colors">Sorteo por Nombres</Link></li>
              <li><Link href="/herramientas/ruleta" className="hover:text-pink-600 transition-colors">Ruleta Aleatoria</Link></li>
              <li><Link href="/herramientas/dados" className="hover:text-pink-600 transition-colors">Tirar Dados 3D</Link></li>
              <li><Link href="/herramientas/moneda" className="hover:text-pink-600 transition-colors">Lanzar Moneda</Link></li>
              <li><Link href="/herramientas/numeros" className="hover:text-pink-600 transition-colors">Generador de Números</Link></li>
              <li><Link href="/herramientas/equipos" className="hover:text-pink-600 transition-colors">Reparto de Equipos</Link></li>
              <li><Link href="/herramientas/amigo-invisible" className="hover:text-pink-600 transition-colors">Amigo Invisible</Link></li>
            </ul>
          </div>

          {/* Col 2: Sorteos Redes */}
          <div className="space-y-3">
            <p className="text-xs font-mono uppercase tracking-wider text-slate-900 font-bold">Sorteos Sociales</p>
            <ul className="space-y-2 text-xs text-slate-600">
              <li><Link href="/sorteos/nuevo?platform=instagram" className="hover:text-pink-600 transition-colors">Sorteo Instagram</Link></li>
              <li><Link href="/sorteos/nuevo?platform=facebook" className="hover:text-blue-600 transition-colors">Sorteo Facebook</Link></li>
              <li><Link href="/sorteos/nuevo?platform=youtube" className="hover:text-red-600 transition-colors">Sorteo YouTube</Link></li>
              <li><Link href="/planes" className="hover:text-pink-600 transition-colors">Planes y Precios</Link></li>
              <li><Link href="/blog" className="hover:text-pink-600 transition-colors">Guías Legales</Link></li>
            </ul>
          </div>

          {/* Col 3: Legal & Seguridad */}
          <div className="space-y-3">
            <p className="text-xs font-mono uppercase tracking-wider text-slate-900 font-bold">Legal & Seguridad</p>
            <ul className="space-y-2 text-xs text-slate-600">
              <li><Link href="/terminos-y-condiciones" className="hover:text-slate-900 transition-colors">Términos del Servicio</Link></li>
              <li><Link href="/politica-de-privacidad" className="hover:text-slate-900 transition-colors">Política de Privacidad</Link></li>
              <li><Link href="/certificados/CERT-SP-98A41E8D" className="text-emerald-600 hover:text-emerald-700 transition-colors">Verificar Certificado</Link></li>
              <li><Link href="/admin" className="text-slate-400 hover:text-slate-600 transition-colors">Consola Admin</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Sorteos Pro. Todos los derechos reservados.</p>
          <div className="flex items-center gap-2">
            <span>Desarrollado con</span>
            <Heart className="w-3.5 h-3.5 text-pink-500 fill-pink-500" />
            <span>por</span>
            <span className="text-slate-800 font-bold">ATP Dev</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
