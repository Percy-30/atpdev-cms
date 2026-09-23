"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Gift, Sparkles, ChevronDown, ListOrdered, Disc, 
  Dices, CircleDollarSign, Hash, Users2, ArrowRight, Menu, X, ShieldCheck
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const [toolsOpen, setToolsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const standaloneTools = [
    { name: 'Lista de Nombres', href: '/herramientas/lista', icon: ListOrdered, desc: 'Sorteo aleatorio de participantes' },
    { name: 'Ruleta Aleatoria', href: '/herramientas/ruleta', icon: Disc, desc: 'Gira la ruleta interactiva' },
    { name: 'Tirar Dados', href: '/herramientas/dados', icon: Dices, desc: 'Dados 3D de 1 a 6 unidades' },
    { name: 'Lanzar Moneda', href: '/herramientas/moneda', icon: CircleDollarSign, desc: 'Cara o cruz verificable' },
    { name: 'Generador de Números', href: '/herramientas/numeros', icon: Hash, desc: 'Rifas, bingos y números al azar' },
    { name: 'Generador de Equipos', href: '/herramientas/equipos', icon: Users2, desc: 'Reparto balanceado en grupos' },
  ];

  return (
    <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#070a12]/80 border-b border-white/10 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo Brand */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-600 via-pink-500 to-amber-400 p-0.5 shadow-lg shadow-violet-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#0b0f19] rounded-[10px] flex items-center justify-center">
                <Gift className="w-5 h-5 text-pink-400 group-hover:text-amber-300 transition-colors" />
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black font-display tracking-tight text-white">sorteos</span>
                <span className="text-xs font-mono font-black uppercase px-1.5 py-0.5 rounded bg-gradient-to-r from-violet-500 to-pink-500 text-white shadow-sm">pro</span>
              </div>
              <span className="text-[10px] font-mono text-zinc-400 -mt-1 hidden sm:block">Plataforma SaaS de Sorteos Verificables</span>
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
                className="flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium text-zinc-300 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
              >
                <span>Herramientas Gratis</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${toolsOpen ? 'rotate-180 text-violet-400' : ''}`} />
              </button>

              {toolsOpen && (
                <div className="absolute top-full left-0 w-80 pt-2 z-50">
                  <div className="glass-card rounded-2xl p-2.5 shadow-2xl border border-white/10 grid gap-1">
                    {standaloneTools.map((tool) => {
                      const Icon = tool.icon;
                      return (
                        <Link
                          key={tool.href}
                          href={tool.href}
                          onClick={() => setToolsOpen(false)}
                          className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-white/5 transition-colors group/item"
                        >
                          <div className="p-2 rounded-lg bg-violet-500/10 text-violet-400 group-hover/item:bg-violet-500 group-hover/item:text-white transition-all">
                            <Icon className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-white group-hover/item:text-violet-300 transition-colors">{tool.name}</p>
                            <p className="text-xs text-zinc-400 leading-snug">{tool.desc}</p>
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
              className="px-3.5 py-2 text-sm font-medium text-zinc-300 hover:text-white rounded-lg hover:bg-white/5 transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Sorteos en Redes</span>
            </Link>

            <Link 
              href="/planes" 
              className="px-3.5 py-2 text-sm font-medium text-zinc-300 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
            >
              Planes y Precios
            </Link>

            <Link 
              href="/dashboard" 
              className="px-3 py-2 text-sm font-medium text-zinc-300 hover:text-white rounded-lg hover:bg-white/5 transition-colors flex items-center gap-1.5"
            >
              <span>Mi Panel</span>
            </Link>

            <Link 
              href="/admin" 
              className="px-2.5 py-1 text-[11px] font-mono font-bold text-red-400 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-lg transition-colors"
            >
              Super-Admin
            </Link>
          </nav>

          {/* Right Actions */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              href="/login"
              className="px-3.5 py-2 text-xs font-mono font-bold text-zinc-300 hover:text-white transition-colors"
            >
              Iniciar Sesión
            </Link>

            <Link
              href="/sorteos/nuevo"
              className="relative group overflow-hidden rounded-xl p-px font-semibold text-sm shadow-lg shadow-violet-500/25 transition-all hover:scale-[1.02]"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-violet-600 via-pink-500 to-amber-400 animate-pulse"></span>
              <span className="relative flex items-center gap-2 px-4 py-2 rounded-[11px] bg-[#0b0f19] text-white group-hover:bg-opacity-80 transition-all font-display">
                <span>Crear Sorteo</span>
                <ArrowRight className="w-4 h-4 text-pink-400 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </Link>
          </div>

          {/* Mobile hamburger button */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-zinc-400 hover:text-white focus:outline-none"
            aria-label="Abrir menú"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden glass-card border-t border-white/10 px-4 pt-3 pb-6 space-y-4">
          <div className="space-y-1">
            <p className="px-3 text-[11px] font-mono uppercase tracking-wider text-violet-400 font-bold">Herramientas Gratis</p>
            <div className="grid grid-cols-2 gap-2 pt-1">
              {standaloneTools.map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2.5 rounded-xl bg-white/5 text-xs font-semibold text-zinc-200 hover:text-white hover:bg-white/10 transition-colors"
                >
                  {tool.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-white/10 flex flex-col gap-2">
            <Link
              href="/sorteos/nuevo"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-white hover:text-pink-400"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Sorteos en Redes Sociales</span>
            </Link>
            <Link
              href="/planes"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-sm font-semibold text-zinc-300 hover:text-white"
            >
              Planes y Precios
            </Link>
            <Link
              href="/blog"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-sm font-semibold text-zinc-300 hover:text-white"
            >
              Guías y Normativa Legal
            </Link>

            <Link
              href="/sorteos/nuevo"
              onClick={() => setMobileMenuOpen(false)}
              className="mt-2 text-center py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-pink-600 text-white font-bold text-sm shadow-md"
            >
              Crear Sorteo Ahora
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
