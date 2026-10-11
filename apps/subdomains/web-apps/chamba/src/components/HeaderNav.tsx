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
    color: 'from-blue-600 to-indigo-700',
    badge: 'Oficial',
  },
  {
    title: 'Calculadora de Sueldo',
    desc: 'Calcula tu salario neto con descuentos de AFP, ONP y 5ta categoría.',
    href: '/calculadora-sueldo',
    icon: Calculator,
    color: 'from-emerald-600 to-teal-700',
    badge: 'Gratis',
  },
  {
    title: 'Comparador de Regímenes',
    desc: 'Diferencias clave de derechos y beneficios: CAS 1057, 728 y 276.',
    href: '/comparador-regimenes',
    icon: Scale,
    color: 'from-amber-600 to-orange-700',
  },
  {
    title: 'Simulador de Entrevista Laboral',
    desc: 'Practica preguntas frecuentes y balotarios ante comités de evaluación.',
    href: '/simulador-entrevista-ia',
    icon: Bot,
    color: 'from-indigo-600 to-slate-800',
    badge: 'Práctica',
  },
  {
    title: 'Organizaciones del Estado',
    desc: 'Directorio de ministerios, gobiernos regionales, UGELs y municipios.',
    href: '/organizaciones',
    icon: Building2,
    color: 'from-slate-700 to-slate-900',
  },
  {
    title: 'Plantillas y Anexos',
    desc: 'Descarga declaraciones juradas y formatos tipo de postulación oficial.',
    href: '/plantillas-anexos',
    icon: FileText,
    color: 'from-teal-600 to-cyan-700',
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
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#070a12]/90 backdrop-blur-2xl border-b border-slate-200 dark:border-white/10 shadow-sm dark:shadow-[0_4px_30px_rgba(0,0,0,0.5)] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 dark:bg-emerald-600 text-white flex items-center justify-center shadow-xs">
            <Briefcase size={20} className="text-white" />
          </div>
          <div>
            <span className="font-display font-extrabold text-xl sm:text-2xl tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
              chamba<span className="text-emerald-600 dark:text-emerald-400">pro</span>
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                PE
              </span>
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block -mt-0.5 font-medium tracking-wide">
              Convocatorias Oficiales del Perú
            </span>
          </div>
        </Link>

        {/* Desktop Navigation - Clear, Large, Bold & Professional like iLovePDF */}
        <nav className="hidden lg:flex items-center gap-1.5 font-display text-sm font-bold">
          {/* Convocatorias */}
          <Link 
            href="/empleos" 
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 border ${
              pathname.startsWith('/empleos')
                ? 'bg-slate-100 dark:bg-white/10 text-emerald-700 dark:text-white border-slate-200 dark:border-white/20 shadow-sm'
                : 'border-transparent text-slate-600 dark:text-slate-200 hover:text-emerald-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 hover:border-slate-200 dark:hover:border-white/10'
            }`}
          >
            <Search size={16} className="text-emerald-600 dark:text-emerald-400" />
            <span>Convocatorias</span>
          </Link>

          {/* Guías CAS */}
          <Link 
            href="/guias" 
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 border ${
              pathname.startsWith('/guias')
                ? 'bg-emerald-50 dark:bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-500/30 shadow-sm'
                : 'border-transparent text-slate-600 dark:text-slate-200 hover:text-emerald-700 dark:hover:text-emerald-300 hover:bg-slate-100 dark:hover:bg-white/5 hover:border-slate-200 dark:hover:border-white/10'
            }`}
          >
            <BookOpen size={16} className="text-emerald-600 dark:text-emerald-400" />
            <span>Guías CAS</span>
            <span className="px-1.5 py-0.2 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-500/30 rounded text-[10px] font-mono font-bold uppercase tracking-wider">
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
                  ? 'bg-slate-100 dark:bg-white/10 text-emerald-700 dark:text-white border-slate-200 dark:border-white/20 shadow-sm'
                  : 'border-transparent text-slate-600 dark:text-slate-200 hover:text-emerald-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/5 hover:border-slate-200 dark:hover:border-white/10'
              }`}
            >
              <Sparkles size={16} className="text-emerald-600 dark:text-emerald-400" />
              <span>Herramientas</span>
              <ChevronDown 
                size={15} 
                className={`text-slate-400 transition-transform duration-200 ${toolsOpen ? 'rotate-180 text-emerald-600 dark:text-emerald-400' : ''}`} 
              />
            </button>

            {/* Dropdown Mega Menu */}
            {toolsOpen && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[520px] p-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl grid grid-cols-2 gap-2 animate-in fade-in zoom-in-95 duration-150">
                {HERRAMIENTAS.map((item) => {
                  const Icon = item.icon;
                  const active = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setToolsOpen(false)}
                      className={`p-3 rounded-xl border transition-all flex items-start gap-3 group text-left ${
                        active 
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/80 shadow-xs' 
                          : 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-slate-200 dark:hover:border-slate-700'
                      }`}
                    >
                      <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center text-white shadow-xs shrink-0`}>
                        <Icon size={18} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="font-display font-bold text-xs text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                            {item.title}
                          </span>
                          {item.badge && (
                            <span className="text-[9.5px] font-medium px-1.5 py-0.2 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5 leading-snug font-normal">
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
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white border-slate-200 dark:border-slate-700 shadow-xs'
                : 'border-transparent text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 hover:border-slate-200 dark:hover:border-slate-700'
            }`}
          >
            <ShieldCheck size={16} className="text-slate-500 dark:text-slate-400" />
            <span>Quiénes Somos</span>
          </Link>
        </nav>

        {/* Actions Hub */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          <ChambaThemeToggle />

          {/* Publicar Empleo */}
          <Link
            href="/publicar-empleo"
            className="hidden md:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors shadow-xs cursor-pointer"
          >
            <PlusCircle size={15} className="text-emerald-600 dark:text-emerald-400" />
            <span>Publicar Convocatoria</span>
          </Link>

          {/* Explorar Convocatorias - Primary Button */}
          <Link
            href="/empleos"
            className="px-4 sm:px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm transition-colors flex items-center gap-2 shadow-xs cursor-pointer"
          >
            <Compass size={17} className="text-white" />
            <span>Explorar Convocatorias</span>
            <ArrowRight size={14} className="text-white" />
          </Link>

          {/* Mobile Drawer */}
          <MobileNavMenu />
        </div>
      </div>
    </header>
  );
}
