'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import { Menu, X, Search, Award, Calculator, FileText, HelpCircle, ShieldCheck, PlusCircle, Briefcase, Bot, FileSpreadsheet, Scale, Lock, FileCheck2, Mail, Building2 } from 'lucide-react';
import { ChambaThemeToggle } from './ChambaThemeToggle';

export function MobileNavMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const drawerContent = isOpen && mounted ? createPortal(
    <div className="fixed inset-0 z-[9999] lg:hidden">
      {/* Drawer Overlay backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={() => setIsOpen(false)}
      />

      {/* Slide-over Drawer Panel */}
      <div
        className="fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] bg-[#070d14] border-l border-white/15 p-6 flex flex-col justify-between overflow-y-auto shadow-2xl transition-transform duration-300 ease-in-out"
      >
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold font-display">
                ch
              </div>
              <span className="font-display font-black text-lg text-white">chamba PRO</span>
            </div>
            <div className="flex items-center gap-2">
              <ChambaThemeToggle />
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Navigation Items List */}
          <nav className="space-y-2 font-mono text-sm">
            <Link
              href="/empleos"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 p-3 rounded-2xl bg-slate-900/60 border border-white/5 hover:border-emerald-500/30 text-slate-200 hover:text-emerald-400 transition-colors"
            >
              <Search size={18} className="text-emerald-400" />
              <span>Buscar Convocatorias</span>
            </Link>

            <Link
              href="/organizaciones"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 p-3 rounded-2xl bg-slate-900/60 border border-white/5 hover:border-emerald-500/30 text-slate-200 hover:text-emerald-400 transition-colors"
            >
              <Building2 size={18} className="text-emerald-400" />
              <span>Entidades del Estado</span>
            </Link>

            <Link
              href="/publicar-empleo"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 hover:border-emerald-500/40 text-emerald-300 hover:text-emerald-200 transition-colors"
            >
              <PlusCircle size={18} className="text-emerald-400" />
              <span>Publicar Convocatoria</span>
            </Link>

            <Link
              href="/empleos?regimen=CAS"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 p-3 rounded-2xl bg-slate-900/60 border border-white/5 hover:border-amber-500/30 text-slate-200 hover:text-amber-400 transition-colors"
            >
              <Award size={18} className="text-amber-400" />
              <span>Convocatorias CAS</span>
            </Link>

            <Link
              href="/calculadora-sueldo"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 p-3 rounded-2xl bg-slate-900/60 border border-white/5 hover:border-emerald-500/30 text-slate-200 hover:text-emerald-400 transition-colors"
            >
              <Calculator size={18} className="text-emerald-400" />
              <span>Calculadora de Sueldo</span>
            </Link>

            <Link
              href="/plantillas-anexos"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 p-3 rounded-2xl bg-slate-900/60 border border-white/5 hover:border-cyan-500/30 text-slate-200 hover:text-cyan-400 transition-colors"
            >
              <FileText size={18} className="text-cyan-400" />
              <span>Plantillas y Anexos</span>
            </Link>

            <Link
              href="/preguntas-entrevista-cas"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 p-3 rounded-2xl bg-slate-900/60 border border-white/5 hover:border-amber-500/30 text-slate-200 hover:text-amber-400 transition-colors"
            >
              <HelpCircle size={18} className="text-amber-400" />
              <span>Preguntas Entrevista CAS</span>
            </Link>

            <Link
              href="/simulador-entrevista-ia"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 p-3 rounded-2xl bg-slate-900/60 border border-white/5 hover:border-emerald-500/30 text-slate-200 hover:text-emerald-400 transition-colors"
            >
              <Bot size={18} className="text-emerald-400" />
              <span>Simulador Entrevista IA</span>
            </Link>

            <Link
              href="/crear-cv-cas"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 p-3 rounded-2xl bg-slate-900/60 border border-white/5 hover:border-emerald-500/30 text-slate-200 hover:text-emerald-400 transition-colors"
            >
              <FileSpreadsheet size={18} className="text-emerald-400" />
              <span>Generador CV CAS Servir</span>
            </Link>

            <Link
              href="/comparador-regimenes"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 p-3 rounded-2xl bg-slate-900/60 border border-white/5 hover:border-cyan-500/30 text-slate-200 hover:text-cyan-400 transition-colors"
            >
              <Scale size={18} className="text-cyan-400" />
              <span>Comparador de Regímenes</span>
            </Link>

            <Link
              href="/quienes-somos"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 p-3 rounded-2xl bg-slate-900/60 border border-white/5 hover:border-emerald-500/30 text-slate-200 hover:text-emerald-400 transition-colors"
            >
              <ShieldCheck size={18} className="text-emerald-400" />
              <span>Quiénes Somos</span>
            </Link>

            {/* Legal & Compliance Links */}
            <div className="pt-2 border-t border-white/5 space-y-1">
              <span className="text-[10px] uppercase tracking-wider text-slate-400 font-mono px-3">Transparencia y Marco Legal</span>
              <Link
                href="/politica-de-privacidad"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-900/50 text-slate-300 hover:text-white transition-colors text-xs"
              >
                <Lock size={15} className="text-slate-400" />
                <span>Política de Privacidad</span>
              </Link>

              <Link
                href="/terminos-y-condiciones"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-900/50 text-slate-300 hover:text-white transition-colors text-xs"
              >
                <FileCheck2 size={15} className="text-slate-400" />
                <span>Términos y Condiciones</span>
              </Link>

              <Link
                href="/contacto"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-900/50 text-slate-300 hover:text-emerald-400 transition-colors text-xs"
              >
                <Mail size={15} className="text-emerald-400" />
                <span>Contacto y Redacción</span>
              </Link>
            </div>
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-white/10 space-y-3">
          <Link
            href="/crear-cv-cas"
            onClick={() => setIsOpen(false)}
            className="w-full py-2.5 rounded-xl btn-brand-gradient text-white text-xs font-bold font-display flex items-center justify-center gap-2 shadow-lg transition-all"
          >
            <FileSpreadsheet size={16} className="text-white drop-shadow-sm" />
            <span className="text-white drop-shadow-sm">Generar CV Profesional (PDF/Word)</span>
          </Link>
        </div>
      </div>
    </div>,
    document.body
  ) : null;

  return (
    <div className="lg:hidden">
      {/* Toggle Hamburger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-xl bg-slate-900 border border-white/10 text-slate-200 hover:text-white transition-colors cursor-pointer"
        aria-label="Abrir menú"
      >
        {isOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {drawerContent}
    </div>
  );
}
