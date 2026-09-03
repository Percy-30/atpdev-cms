'use client';

import React, { useState } from 'react';
import { Calculator, ShieldCheck, DollarSign, Award, Info, ChevronRight, CheckCircle2, AlertTriangle, Sparkles } from 'lucide-react';

export function CalculadoraSueldo() {
  const [sueldoBruto, setSueldoBruto] = useState<number>(4500);
  const [regimen, setRegimen] = useState<'CAS' | '728' | '276' | 'Locacion'>('CAS');
  const [pension, setPension] = useState<'AFP' | 'ONP' | 'Ninguno'>('AFP');
  const [afpType, setAfpType] = useState<'Integra' | 'Prima' | 'Profuturo' | 'Habitat'>('Integra');

  // Constantes Tributarias Perú 2026
  const UIT = 5150; // UIT proyectada 2026
  const DEDUCCION_7_UIT = 7 * UIT; // S/ 36,050

  // 1. Descuento de Pensiones
  let pctPension = 0;
  if (pension === 'ONP') {
    pctPension = 0.13; // 13%
  } else if (pension === 'AFP') {
    // Promedio AFP (Aporte 10% + Seguro 1.84% + Comisión ~1.0%)
    if (afpType === 'Habitat') pctPension = 0.1284;
    else if (afpType === 'Prima') pctPension = 0.1285;
    else if (afpType === 'Integra') pctPension = 0.1280;
    else pctPension = 0.1290; // Profuturo
  }

  const descuentoPension = regimen === 'Locacion' ? 0 : sueldoBruto * pctPension;

  // 2. Impuesto a la Renta de 5ta Categoría (Planilla / CAS / 728) o 4ta (Locación)
  let impuestoRentaMensual = 0;

  if (regimen === 'Locacion') {
    // 4ta Categoría: Retención del 8% si supera S/ 1,500
    if (sueldoBruto > 1500) {
      impuestoRentaMensual = sueldoBruto * 0.08;
    }
  } else {
    // 5ta Categoría
    const mesesAnual = regimen === '728' ? 14 : 12; // 728 incluye 2 gratificaciones completas
    const ingresoAnualBruto = sueldoBruto * mesesAnual;
    const baseImponible = Math.max(0, ingresoAnualBruto - DEDUCCION_7_UIT);

    let impuestoAnual = 0;
    if (baseImponible > 0) {
      const tramo1 = Math.min(baseImponible, 5 * UIT); // Hasta 5 UIT (8%)
      impuestoAnual += tramo1 * 0.08;

      if (baseImponible > 5 * UIT) {
        const tramo2 = Math.min(baseImponible - 5 * UIT, 15 * UIT); // De 5 a 20 UIT (14%)
        impuestoAnual += tramo2 * 0.14;
      }
      if (baseImponible > 20 * UIT) {
        const tramo3 = Math.min(baseImponible - 20 * UIT, 15 * UIT); // De 20 a 35 UIT (17%)
        impuestoAnual += tramo3 * 0.17;
      }
    }
    impuestoRentaMensual = impuestoAnual / mesesAnual;
  }

  // 3. Sueldo Neto Líquido
  const sueldoNeto = Math.max(0, sueldoBruto - descuentoPension - impuestoRentaMensual);

  // 4. Estimación de Beneficios Anuales según Régimen
  let gratificacionJulio = 0;
  let gratificacionDiciembre = 0;
  let ctsAnual = 0;
  let vacacionesDias = 30;

  if (regimen === 'CAS') {
    gratificacionJulio = 300; // Aguinaldo Fiesticostas CAS
    gratificacionDiciembre = 300; // Aguinaldo Navidad CAS
    ctsAnual = 0; // CAS no contempla CTS
    vacacionesDias = 30;
  } else if (regimen === '728') {
    gratificacionJulio = sueldoBruto * 1.09; // Sueldo + 9% Bonificación EsSalud
    gratificacionDiciembre = sueldoBruto * 1.09;
    ctsAnual = sueldoBruto * 1.1666; // 1 sueldo anual aprox de CTS + 1/6 grata
    vacacionesDias = 30;
  } else if (regimen === '276') {
    gratificacionJulio = 300;
    gratificacionDiciembre = 300;
    ctsAnual = 50 * 30; // Montos fijos según ley 276
    vacacionesDias = 30;
  }

  return (
    <div className="glass-card p-6 sm:p-8 rounded-3xl border border-emerald-500/30 space-y-8 bg-gradient-to-b from-slate-900 via-slate-900 to-[#0b0f19]">
      <div className="flex items-center justify-between border-b border-white/10 pb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
            <Calculator size={26} />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black font-display text-white">
              Calculadora de Sueldo Neto & Beneficios 2026
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              Simulador exacto según legislación laboral peruana (CAS 1057, D.L. 728, D.L. 276 y Locación)
            </p>
          </div>
        </div>
        <span className="hidden sm:inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold">
          <Sparkles size={14} />
          <span>UIT 2026: S/ {UIT.toLocaleString()}</span>
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Inputs Section */}
        <div className="lg:col-span-6 space-y-6">
          {/* Sueldo Bruto Input */}
          <div className="space-y-2">
            <label className="text-xs font-mono font-bold text-slate-300 uppercase flex items-center justify-between">
              <span>Sueldo Bruto Mensual (Soles PEN)</span>
              <span className="text-emerald-400 font-extrabold text-sm">S/ {sueldoBruto.toLocaleString()}</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold font-mono text-lg">S/</span>
              <input
                type="number"
                value={sueldoBruto}
                onChange={(e) => setSueldoBruto(Math.max(0, Number(e.target.value)))}
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-slate-950/80 border border-white/15 text-white font-mono font-bold text-xl focus:outline-none focus:border-emerald-500 transition-colors shadow-inner"
                placeholder="4500"
              />
            </div>
            <div className="flex gap-2 pt-1">
              {[2000, 3500, 5000, 7500, 10000].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setSueldoBruto(val)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-bold transition-all ${
                    sueldoBruto === val
                      ? 'bg-emerald-500 text-slate-950 shadow-[0_0_10px_rgba(16,185,129,0.4)]'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  S/ {val >= 1000 ? `${val / 1000}k` : val}
                </button>
              ))}
            </div>
          </div>

          {/* Selector de Régimen Laboral */}
          <div className="space-y-2">
            <label className="text-xs font-mono font-bold text-slate-300 uppercase">
              Régimen Laboral
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { key: 'CAS', label: 'CAS 1057', badge: 'Estado' },
                { key: '728', label: 'D.L. 728', badge: 'Planilla' },
                { key: '276', label: 'D.L. 276', badge: 'Público' },
                { key: 'Locacion', label: 'Locación (RHO)', badge: 'Honorarios' },
              ].map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setRegimen(item.key as any)}
                  className={`p-3 rounded-2xl border text-left transition-all relative overflow-hidden ${
                    regimen === item.key
                      ? 'bg-emerald-500/20 border-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                      : 'bg-slate-950/60 border-white/10 text-slate-400 hover:border-white/20'
                  }`}
                >
                  <span className="block font-bold text-xs font-display text-white">{item.label}</span>
                  <span className="text-[10px] font-mono text-emerald-400 block mt-0.5">{item.badge}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Sistema de Pensiones (AFP / ONP) */}
          {regimen !== 'Locacion' && (
            <div className="space-y-3 p-4 rounded-2xl bg-slate-950/60 border border-white/10">
              <label className="text-xs font-mono font-bold text-slate-300 uppercase block">
                Sistema de Pensiones
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['AFP', 'ONP', 'Ninguno'].map((sys) => (
                  <button
                    key={sys}
                    type="button"
                    onClick={() => setPension(sys as any)}
                    className={`py-2.5 rounded-xl font-mono text-xs font-bold transition-all ${
                      pension === sys
                        ? 'bg-emerald-500 text-slate-950 shadow-md'
                        : 'bg-slate-900 text-slate-400 border border-white/10 hover:text-white'
                    }`}
                  >
                    {sys} {sys === 'ONP' ? '(13%)' : sys === 'AFP' ? '(~12.8%)' : ''}
                  </button>
                ))}
              </div>

              {pension === 'AFP' && (
                <div className="pt-2">
                  <span className="text-[11px] font-mono text-slate-400 block mb-1.5">Selecciona tu Administradora AFP:</span>
                  <div className="grid grid-cols-4 gap-2 text-xs font-mono font-bold">
                    {(['Integra', 'Prima', 'Profuturo', 'Habitat'] as const).map((afp) => (
                      <button
                        key={afp}
                        type="button"
                        onClick={() => setAfpType(afp)}
                        className={`py-1.5 rounded-lg border transition-all ${
                          afpType === afp
                            ? 'bg-amber-500/20 border-amber-500 text-amber-300'
                            : 'bg-slate-900 border-white/5 text-slate-400 hover:border-white/20'
                        }`}
                      >
                        {afp}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Calculation Output Card */}
        <div className="lg:col-span-6 space-y-6">
          {/* Main Net Result Box */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-emerald-950 via-slate-950 to-slate-900 border border-emerald-500/40 shadow-2xl relative overflow-hidden space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider font-bold">
                ESTIMACIÓN DE SUELDO NETO LÍQUIDO
              </span>
              <span className="px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold border border-emerald-500/30">
                MENSUAL AL BANCO
              </span>
            </div>

            <div>
              <div className="text-4xl sm:text-5xl font-black font-display text-white tracking-tight">
                S/ {Math.round(sueldoNeto).toLocaleString()}
                <span className="text-sm font-mono text-slate-400 font-normal ml-2">/ mes</span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Dinero efectivo aproximado que recibirás en tu cuenta bancaria a fin de mes.
              </p>
            </div>

            {/* Deductions Breakdown */}
            <div className="space-y-2 pt-2 border-t border-white/10 text-xs font-mono">
              <div className="flex items-center justify-between text-slate-300">
                <span>(+) Sueldo Bruto Contratado:</span>
                <span className="font-bold text-white">S/ {sueldoBruto.toLocaleString()}</span>
              </div>
              {regimen !== 'Locacion' && (
                <div className="flex items-center justify-between text-amber-400">
                  <span>(-) Fondo de Pensiones ({pension} {(pctPension * 100).toFixed(1)}%):</span>
                  <span className="font-bold">- S/ {Math.round(descuentoPension).toLocaleString()}</span>
                </div>
              )}
              <div className="flex items-center justify-between text-cyan-400">
                <span>
                  (-) Impuesto Renta ({regimen === 'Locacion' ? '4ta Cat. 8%' : '5ta Cat. Progresivo'}):
                </span>
                <span className="font-bold">- S/ {Math.round(impuestoRentaMensual).toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Annual Labor Benefits Breakdown */}
          <div className="p-6 rounded-3xl bg-slate-950/80 border border-white/10 space-y-4">
            <h3 className="text-sm font-bold font-display text-white flex items-center gap-2 border-b border-white/10 pb-3">
              <Award className="text-amber-400" size={18} />
              <span>Beneficios Anuales según Régimen {regimen}</span>
            </h3>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-2xl bg-slate-900/80 border border-white/5 space-y-1">
                <span className="text-[10px] text-slate-400 font-mono block">AGUINALDO / GRATIFICACIÓN</span>
                <span className="font-bold text-emerald-400 text-sm block">
                  {gratificacionJulio > 0 ? `S/ ${Math.round(gratificacionJulio).toLocaleString()} (x2 año)` : 'No Aplica'}
                </span>
                <span className="text-[10px] text-slate-500 block">Julio y Diciembre</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-900/80 border border-white/5 space-y-1">
                <span className="text-[10px] text-slate-400 font-mono block">CTS (COMPENSACIÓN TIEMPO)</span>
                <span className="font-bold text-cyan-400 text-sm block">
                  {ctsAnual > 0 ? `S/ ${Math.round(ctsAnual).toLocaleString()} / año` : 'No Aplica en CAS'}
                </span>
                <span className="text-[10px] text-slate-500 block">Mayo y Noviembre</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-900/80 border border-white/5 space-y-1">
                <span className="text-[10px] text-slate-400 font-mono block">VACACIONES PAGADAS</span>
                <span className="font-bold text-amber-400 text-sm block">{vacacionesDias} Días Calendario</span>
                <span className="text-[10px] text-slate-500 block">Por cada año de servicio</span>
              </div>

              <div className="p-3 rounded-2xl bg-slate-900/80 border border-white/5 space-y-1">
                <span className="text-[10px] text-slate-400 font-mono block">COBERTURA SALUD</span>
                <span className="font-bold text-white text-sm block">EsSalud 9%</span>
                <span className="text-[10px] text-slate-500 block">Aporte a cargo del empleador</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
