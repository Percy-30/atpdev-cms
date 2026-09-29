"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Gift, Sparkles, ChevronDown, ListOrdered, Disc, 
  Dices, CircleDollarSign, Hash, Users2, ArrowRight, Menu, X, ShieldCheck
} from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

export const Navbar: React.FC = () => {
  const [toolsOpen, setToolsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const standaloneTools = [
    { name: 'Sorteo por Nombres', href: '/herramientas/lista', icon: ListOrdered, desc: 'Escoge ganadores al azar de una lista' },
    { name: 'Ruleta Aleatoria', href: '/herramientas/ruleta', icon: Disc, desc: 'Gira la ruleta interactiva digital' },
    { name: 'Tirar Dados 3D', href: '/herramientas/dados', icon: Dices, desc: 'Dados 3D de 1 a 6 unidades' },
    { name: 'Lanzar Moneda', href: '/herramientas/moneda', icon: CircleDollarSign, desc: 'Cara o cruz 3D verificable' },
    { name: 'Generador de Números', href: '/herramientas/numeros', icon: Hash, desc: 'Rifas, bingos y números al azar' },
    { name: 'Generador de Equipos', href: '/herramientas/equipos', icon: Users2, desc: 'Reparto balanceado en grupos' },
    { name: 'Amigo Invisible', href: '/herramientas/amigo-invisible', icon: Gift, desc: 'Intercambio de regalos secreto' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#070a12]/90 backdrop-blur-md border-b border-slate-200/80 dark:border-white/10 shadow-xs transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          
          {/* Logo Brand */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-pink-600 to-rose-500 p-0.5 shadow-md shadow-pink-500/20 group-hover:scale-105 transition-transform flex items-center justify-center text-white">
              <Gift className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold font-display tracking-tight text-slate-900 dark:text-white">sorteos</span>
                <span className="text-xs font-mono font-bold uppercase px-1.5 py-0.5 rounded bg-pink-100 dark:bg-pink-950/60 text-pink-700 dark:text-pink-300 border border-pink-200 dark:border-pink-800/60">pro</span>
              </div>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {/* Tools Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setToolsOpen(true)}
              onMouseLeave={() => setToolsOpen(false)}
            >
              <button 
                onClick={() => setToolsOpen(!toolsOpen)}
                className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-semibold text-slate-700 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100/70 dark:hover:bg-white/5 transition-colors"
              >
                <span>Aplicaciones</span>
                <ChevronDown className={`w-4 h-4 text-slate-400 dark:text-zinc-500 transition-transform duration-200 ${toolsOpen ? 'rotate-180 text-pink-600 dark:text-pink-400' : ''}`} />
              </button>

              {toolsOpen && (
                <div className="absolute top-full left-0 w-80 pt-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="bg-white dark:bg-[#0f172a] rounded-2xl p-2.5 shadow-xl border border-slate-200/80 dark:border-white/10 grid gap-1">
                    {standaloneTools.map((tool) => {
                      const Icon = tool.icon;
                      return (
                        <Link
                          key={tool.href}
                          href={tool.href}
                          onClick={() => setToolsOpen(false)}
                          className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group/item"
                        >
                          <div className="p-2 rounded-lg bg-pink-50 dark:bg-pink-950/50 text-pink-600 dark:text-pink-400 group-hover/item:bg-pink-600 group-hover/item:text-white transition-all">
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-800 dark:text-zinc-100 group-hover/item:text-pink-600 dark:group-hover/item:text-pink-400 transition-colors">{tool.name}</p>
                            <p className="text-xs text-slate-500 dark:text-zinc-400 leading-snug">{tool.desc}</p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <Link 
              href="/sorteos/nuevo"
              className="px-3.5 py-2 text-sm font-semibold text-slate-700 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100/70 dark:hover:bg-white/5 transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4 text-pink-600 dark:text-pink-400" />
              <span>Sorteos Redes</span>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 px-1.5 py-0.2 rounded border border-purple-200 dark:border-purple-800/50">NEW</span>
            </Link>

            <Link 
              href="/certificados/CERT-SP-98A41E8D" 
              className="px-3.5 py-2 text-sm font-semibold text-slate-700 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100/70 dark:hover:bg-white/5 transition-colors flex items-center gap-1.5"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Verificar Certificado</span>
            </Link>

            <Link 
              href="/planes" 
              className="px-3.5 py-2 text-sm font-semibold text-slate-700 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100/70 dark:hover:bg-white/5 transition-colors"
            >
              Precios
            </Link>

            <Link 
              href="/blog" 
              className="px-3 py-2 text-sm font-semibold text-slate-700 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100/70 dark:hover:bg-white/5 transition-colors"
            >
              Ayuda
            </Link>
          </nav>

          {/* Right Actions */}
          <div className="hidden sm:flex items-center gap-2.5">
            {/* Theme Toggle Button */}
            <ThemeToggle />

            {/* Language dropdown button */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1 px-2.5 py-2 text-xs font-bold text-slate-700 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100/70 dark:hover:bg-white/5 transition-colors"
              >
                <span>ES</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 dark:text-zinc-500" />
              </button>
              {langOpen && (
                <div className="absolute right-0 top-full mt-1 bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 rounded-xl shadow-lg p-1 z-50 text-xs font-semibold w-24">
                  <button onClick={() => setLangOpen(false)} className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-pink-50 dark:hover:bg-pink-950/40 text-pink-600 dark:text-pink-400">Español</button>
                  <button onClick={() => setLangOpen(false)} className="w-full text-left px-3 py-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-white/5 text-slate-700 dark:text-zinc-300">English</button>
                </div>
              )}
            </div>

            <Link
              href="/login"
              className="px-3.5 py-2 text-sm font-semibold text-slate-700 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white transition-colors rounded-lg hover:bg-slate-100/70 dark:hover:bg-white/5"
            >
              Ingresar
            </Link>

            <Link
              href="/sorteos/nuevo"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#d91a7a] hover:bg-[#c2186b] text-white font-bold font-display text-sm shadow-sm hover:shadow-md hover:shadow-pink-500/20 active:scale-95 transition-all"
            >
              <span>Crear cuenta</span>
            </Link>
          </div>

          {/* Mobile hamburger button */}
          <div className="lg:hidden flex items-center gap-2">
            <ThemeToggle />
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white focus:outline-none"
              aria-label="Abrir menú"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-[#0b0f19] border-t border-slate-200 dark:border-white/10 px-4 pt-3 pb-6 space-y-4 shadow-lg">
          <div className="space-y-1">
            <p className="px-3 text-[11px] font-mono uppercase tracking-wider text-pink-600 dark:text-pink-400 font-bold">Aplicaciones</p>
            <div className="grid grid-cols-2 gap-2 pt-1">
              {standaloneTools.map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 text-xs font-semibold text-slate-700 dark:text-zinc-200 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
                >
                  {tool.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200 dark:border-white/10 flex flex-col gap-2">
            <Link
              href="/sorteos/nuevo"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-slate-800 dark:text-white hover:text-pink-600 dark:hover:text-pink-400"
            >
              <Sparkles className="w-4 h-4 text-pink-600 dark:text-pink-400" />
              <span>Sorteos en Redes Sociales</span>
            </Link>
            <Link
              href="/planes"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-sm font-semibold text-slate-700 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white"
            >
              Precios
            </Link>
            <Link
              href="/blog"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-sm font-semibold text-slate-700 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white"
            >
              Ayuda y Guías
            </Link>

            <Link
              href="/sorteos/nuevo"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-2 text-center py-2.5 rounded-xl bg-[#d91a7a] text-white font-bold text-sm shadow-md"
            >
              Crear cuenta gratis
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
