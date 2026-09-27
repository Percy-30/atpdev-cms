'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Briefcase, Search, BookOpen, ChevronDown, Calculator, 
  Scale, Bot, FileSpreadsheet, Building2, FileText, 
  ShieldCheck, PlusCircle, Compass, Sparkles, ArrowRight
} from 'lucide-react';
import { ChambaThemeToggle } from './ChambaThemeToggle';
import { MobileNavMenu } from './MobileNavMenu';

const HERRAMIENTAS = [
  {
    title: 'Generador de CV CAS',
    desc: 'Formatos oficiales SERVIR y Privado en PDF y Word (.DOC) editable.',
    href: '/crear-cv-cas',
    icon: FileSpreadsheet,
    color: 'from-blue-500 to-indigo-600',
    badge: 'Popular',
  },
  {
    title: 'Calculadora de Sueldo',
    desc: 'Calcula tu salario neto con descuentos de AFP, ONP y 5ta categoría.',
    href: '/calculadora-sueldo',
    icon: Calculator,
    color: 'from-emerald-500 to-teal-600',
    badge: 'Gratis',
  },
  {
    title: 'Comparador de Regímenes',
    desc: 'Diferencias clave de derechos y beneficios: CAS 1057, 728 y 276.',
    href: '/comparador-regimenes',
    icon: Scale,
    color: 'from-amber-500 to-orange-600',
  },
  {
    title: 'Simulador Entrevista IA',
    desc: 'Practica preguntas reales ante jurados evaluadores de SUNAT, MINEDU, etc.',
    href: '/simulador-entrevista-ia',
    icon: Bot,
    color: 'from-purple-500 to-pink-600',
    badge: 'IA 2026',
  },
  {
    title: 'Organizaciones del Estado',
    desc: 'Directorio de ministerios, gobiernos regionales, UGELs y municipios.',
    href: '/organizaciones',
    icon: Building2,
    color: 'from-cyan-500 to-blue-600',
  },
  {
    title: 'Plantillas y Anexos',
    desc: 'Descarga declaraciones juradas y formatos tipo de postulación oficial.',
    href: '/plantillas-anexos',
    icon: FileText,
    color: 'from-rose-500 to-red-600',
  },
];

export function HeaderNav() {
  const pathname = usePathname();
  const [toolsOpen, setToolsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setToolsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close dropdown on route change
  useEffect(() => {
    setToolsOpen(false);
  }, [pathname]);

  const isToolActive = HERRAMIENTAS.some(h => pathname === h.href);

  return (
    <header className="sticky top-0 z-40 bg-[#070a12]/90 backdrop-blur-2xl border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3.5 group shrink-0">
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-2xl blur-sm opacity-50 group-hover:opacity-100 transition duration-500" />
            <div className="relative w-11 h-11 rounded-xl bg-slate-950 border border-white/15 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <Briefcase className="text-emerald-400 font-bold" size={22} />
            </div>
          </div>
          <div>
            <span className="font-display font-black text-2xl tracking-tight text-white flex items-center gap-1.5">
              chamba <span className="text-emerald-400 font-mono text-xs px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.3)]">pro</span>
            </span>
            <span className="text-[10px] text-slate-400 font-mono block -mt-1 tracking-widest uppercase">
              Perú • Convocatorias Oficiales
            </span>
          </div>
        </Link>

        {/* Desktop Navigation - Clear, Large, Bold & Professional like iLovePDF */}
        <nav className="hidden lg:flex items-center gap-2 font-display text-sm font-bold text-slate-200">
          {/* Convocatorias */}
          <Link 
            href="/empleos" 
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 border ${
              pathname.startsWith('/empleos')
                ? 'bg-white/10 text-white border-white/20 shadow-sm'
                : 'border-transparent hover:text-white hover:bg-white/5 hover:border-white/10'
            }`}
          >
            <Search size={16} className="text-emerald-400" />
            <span>Convocatorias</span>
          </Link>

          {/* Guías CAS */}
          <Link 
            href="/guias" 
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 border ${
              pathname.startsWith('/guias')
                ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30 shadow-sm'
                : 'border-transparent text-slate-200 hover:text-emerald-300 hover:bg-white/5 hover:border-white/10'
            }`}
          >
            <BookOpen size={16} className="text-emerald-400" />
            <span>Guías CAS</span>
            <span className="px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 rounded text-[10px] font-mono font-bold uppercase tracking-wider">
              Nuevo
            </span>
          </Link>

          {/* Herramientas Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setToolsOpen(!toolsOpen)}
              className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 border cursor-pointer ${
                toolsOpen || isToolActive
                  ? 'bg-white/10 text-white border-white/20 shadow-sm'
                  : 'border-transparent hover:text-white hover:bg-white/5 hover:border-white/10'
              }`}
            >
              <Sparkles size={16} className="text-emerald-400" />
              <span>Herramientas</span>
              <ChevronDown 
                size={15} 
                className={`text-slate-400 transition-transform duration-200 ${toolsOpen ? 'rotate-180 text-emerald-400' : ''}`} 
              />
            </button>

            {/* Dropdown Mega Menu */}
            {toolsOpen && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[520px] p-3 rounded-3xl bg-slate-950/95 backdrop-blur-2xl border border-white/15 shadow-[0_20px_60px_rgba(0,0,0,0.8)] grid grid-cols-2 gap-2 animate-in fade-in zoom-in-95 duration-150">
                {HERRAMIENTAS.map((item) => {
                  const Icon = item.icon;
                  const active = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setToolsOpen(false)}
                      className={`p-3 rounded-2xl border transition-all flex items-start gap-3 group text-left ${
                        active 
                          ? 'bg-white/10 border-white/25 shadow-md' 
                          : 'bg-white/[0.02] border-white/5 hover:bg-white/[0.08] hover:border-white/15'
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white shadow-md shrink-0 group-hover:scale-105 transition-transform`}>
                        <Icon size={19} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="font-display font-bold text-xs text-white group-hover:text-emerald-400 transition-colors">
                            {item.title}
                          </span>
                          {item.badge && (
                            <span className="text-[9.5px] font-mono px-1.5 py-0.2 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5 leading-snug font-normal">
                          {item.desc}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quiénes Somos */}
          <Link 
            href="/quienes-somos" 
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 border ${
              pathname === '/quienes-somos'
                ? 'bg-white/10 text-white border-white/20 shadow-sm'
                : 'border-transparent text-slate-300 hover:text-white hover:bg-white/5 hover:border-white/10'
            }`}
          >
            <ShieldCheck size={16} className="text-slate-400" />
            <span>Quiénes Somos</span>
          </Link>
        </nav>

        {/* Actions Hub (Big, Clear Buttons like iLovePDF) */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          <ChambaThemeToggle />

          {/* Publicar Empleo */}
          <Link
            href="/publicar-empleo"
            className="hidden md:flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-bold font-display text-slate-200 hover:text-white transition-all shadow-sm cursor-pointer hover:scale-[1.02] active:scale-[0.98]"
          >
            <PlusCircle size={15} className="text-emerald-400" />
            <span>Publicar Empleo</span>
          </Link>

          {/* Explorar Vacantes - Big, Bold Primary Button */}
          <Link
            href="/empleos"
            className="btn-brand-gradient relative group overflow-hidden px-5 sm:px-6 py-2.5 sm:py-3 rounded-2xl text-xs sm:text-sm font-black font-display transition-all flex items-center gap-2.5 shadow-[0_8px_25px_rgba(16,185,129,0.35)] hover:shadow-[0_10px_30px_rgba(16,185,129,0.5)] cursor-pointer hover:scale-[1.03] active:scale-[0.98]"
          >
            <Compass size={18} className="text-slate-950 stroke-[2.5] shrink-0 group-hover:rotate-45 transition-transform duration-300" />
            <span className="text-slate-950 font-black tracking-tight">Explorar Vacantes</span>
            <ArrowRight size={15} className="text-slate-950 stroke-[2.5] group-hover:translate-x-1 transition-transform" />
          </Link>

          {/* Mobile Drawer */}
          <MobileNavMenu />
        </div>
      </div>
    </header>
  );
}
