import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, Calculator, ShieldCheck, Sparkles, HelpCircle } from 'lucide-react';
import { CalculadoraSueldo } from '@/components/CalculadoraSueldo';

export const metadata: Metadata = {
  title: 'Calculadora de Sueldo Neto CAS 1057 & 728 Perú 2026 | chamba pro',
  description: 'Calcula gratis tu sueldo líquido neto, descuentos de AFP/ONP e impuesto a la renta para convocatorias laborales en el Estado y Sector Privado en Perú.',
  keywords: [
    'calculadora sueldo cas 1057',
    'cuanto gana cas 1057 neto',
    'calculadora afp onp peru',
    'calculadora sueldo liquido peru',
    'descuentos cas peru',
    'aguinaldo cas 2026',
    'sueldo neto 728 peru'
  ],
};

export default function CalculadoraSueldoPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs font-mono text-slate-400">
        <Link href="/" className="hover:text-emerald-400 transition-colors">Inicio</Link>
        <ChevronRight size={12} />
        <span className="text-slate-200 font-semibold">Calculadora de Sueldo CAS & 728</span>
      </nav>

      {/* Main Hero Header */}
      <div className="space-y-3 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-semibold">
          <Sparkles size={14} />
          <span>Herramienta Oficial Gratuita — Legislación Laboral Peruana 2026</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black font-display text-white tracking-tight">
          Calculadora de Sueldo Neto & Descuentos de Ley
        </h1>
        <p className="text-sm text-slate-400 max-w-2xl">
          Simula en tiempo real tu remuneración mensual líquida al banco, retenciones de AFP/ONP, Impuesto a la Renta de 5ta Categoría y desglose de aguinaldos o CTS según tu régimen laboral.
        </p>
      </div>

      {/* Calculator Interactive Component */}
      <CalculadoraSueldo />

      {/* Informative FAQ / Educational Section */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-6 border border-white/10">
        <h2 className="text-xl font-bold font-display text-white flex items-center gap-2 border-b border-white/10 pb-4">
          <HelpCircle className="text-emerald-400" size={22} />
          <span>Preguntas Frecuentes sobre Regímenes y Remuneraciones en el Estado</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-300">
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/10 space-y-2">
            <h3 className="font-bold text-white text-sm font-display">¿Qué descuentos se aplican al contrato CAS 1057?</h3>
            <p className="leading-relaxed">
              Los trabajadores CAS aportan obligatoriamente al sistema de pensiones (ONP 13% o AFP ~12.8%). Asimismo, si la remuneración anual brutas excede las 7 UIT (S/ 36,050), se descuenta Impuesto a la Renta de 5ta Categoría.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/10 space-y-2">
            <h3 className="font-bold text-white text-sm font-display">¿A cuántos aguinaldos tiene derecho un servidor CAS?</h3>
            <p className="leading-relaxed">
              Por Ley N° 31639, los servidores bajo régimen CAS reciben dos aguinaldos al año (Fiestas Patrias en Julio y Navidad en Diciembre) fija por Ley de Presupuesto (S/ 300 cada uno).
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/10 space-y-2">
            <h3 className="font-bold text-white text-sm font-display">¿Diferencia entre CAS (1057) y Planilla D.L. 728?</h3>
            <p className="leading-relaxed">
              El régimen D.L. 728 incluye gratificaciones equivalentes a 1 sueldo completo en Julio y Diciembre (+9% EsSalud) más depósito de CTS (1.16 sueldos por año), mientras que el CAS otorga aguinaldos fijos y no incluye CTS.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/60 border border-white/10 space-y-2">
            <h3 className="font-bold text-white text-sm font-display">¿Locación de Servicios (RHO) descuenta AFP?</h3>
            <p className="leading-relaxed">
              No. El contrato por Locación de Servicios es de naturaleza civil y no incluye aportes a fondos de pensión obligatorios ni vacaciones. Solo aplica la retención del 8% por Renta de 4ta Categoría si el recibo supera S/ 1,500.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
