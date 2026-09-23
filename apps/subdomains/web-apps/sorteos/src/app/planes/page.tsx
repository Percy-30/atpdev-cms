"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Check, Sparkles, Zap, ShieldCheck, HelpCircle, ArrowRight } from 'lucide-react';
import { PRICING_PLANS } from '@/lib/types';

export default function PlanesPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('annual');

  const faqs = [
    {
      q: '¿Qué pasa si mi post supera el límite de comentarios de mi plan?',
      a: 'La plataforma te avisará antes de procesar el sorteo y podrás hacer un upgrade instantáneo o comprar un pase de sorteo único para ese post específico.'
    },
    {
      q: '¿Los sorteos con las herramientas básicas (Ruleta, Dados, Moneda, etc.) tienen límite?',
      a: 'No, todas las herramientas standalone son 100% gratuitas e ilimitadas para siempre, sin necesidad de registro ni tarjeta de crédito.'
    },
    {
      q: '¿Cómo garantizan que el sorteo no sea manipulado?',
      a: 'Utilizamos Web Crypto CSPRNG para la generación de números aleatorios criptográficamente seguros y sellamos cada resultado con un hash SHA-256 inmutable que cualquiera puede verificar públicamente.'
    },
    {
      q: '¿Puedo cancelar mi suscripción en cualquier momento?',
      a: 'Sí, puedes cancelar tu plan en cualquier momento desde tu panel con un solo clic, sin preguntas ni penalizaciones.'
    },
    {
      q: '¿Cumple Sorteos Pro con las políticas de promociones de Instagram y Meta?',
      a: 'Sí, Sorteos Pro opera de acuerdo a las directrices de promociones de Meta y las Políticas de la Comunidad de YouTube, sin requerir acceso indebido a contraseñas.'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full gold-gradient-badge text-xs font-mono font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Precios Transparentes</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black font-display text-white tracking-tight">
          Elige el plan ideal para tus sorteos
        </h1>
        <p className="text-sm sm:text-base text-zinc-400">
          Desde sorteos gratuitos para pequeñas cuentas hasta infraestructura masiva para marcas globales y agencias.
        </p>

        {/* Billing Switch */}
        <div className="pt-4 flex items-center justify-center gap-3">
          <span className={`text-xs font-mono ${billingCycle === 'monthly' ? 'text-white font-bold' : 'text-zinc-500'}`}>
            Facturación Mensual
          </span>
          <button
            type="button"
            onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
            className="w-14 h-8 rounded-full bg-white/10 p-1 relative transition-colors focus:outline-none"
          >
            <div
              className={`w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 shadow-md transition-transform duration-300 ${
                billingCycle === 'annual' ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
          <div className="flex items-center gap-1.5">
            <span className={`text-xs font-mono ${billingCycle === 'annual' ? 'text-white font-bold' : 'text-zinc-500'}`}>
              Facturación Anual
            </span>
            <span className="px-2 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/20 text-[10px] font-mono font-bold text-amber-300">
              Ahorra 20%
            </span>
          </div>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
        {PRICING_PLANS.map((plan) => {
          const price = billingCycle === 'annual' ? (plan.priceAnnual / 12).toFixed(2) : plan.priceMonthly.toFixed(2);
          return (
            <div
              key={plan.id}
              className={`rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all relative ${
                plan.isPopular
                  ? 'glass-card border-2 border-purple-500/80 shadow-2xl shadow-purple-500/20 ring-1 ring-purple-500/50'
                  : 'glass-card border border-white/10 hover:border-white/20'
              }`}
            >
              {plan.isPopular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-[10px] font-mono font-bold uppercase tracking-wider text-white shadow-md">
                  Más Popular
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-bold font-display text-white">{plan.name}</h3>
                  <p className="text-xs text-zinc-400 mt-1 min-h-[32px]">{plan.tagline}</p>
                </div>

                <div className="py-2 border-y border-white/5">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl sm:text-4xl font-black font-display text-white font-mono-num">
                      ${price}
                    </span>
                    <span className="text-xs font-mono text-zinc-500">/mes</span>
                  </div>
                  {billingCycle === 'annual' && plan.priceAnnual > 0 && (
                    <div className="text-[11px] font-mono text-zinc-500 mt-0.5">
                      Cobrado anualmente (${plan.priceAnnual}/año)
                    </div>
                  )}
                  {plan.priceMonthly === 0 && (
                    <div className="text-[11px] font-mono text-emerald-400 mt-0.5">
                      Gratis de por vida
                    </div>
                  )}
                </div>

                <div className="space-y-2.5 pt-2">
                  <span className="text-[11px] font-mono uppercase text-zinc-500 font-bold tracking-wider">
                    Incluye:
                  </span>
                  <ul className="space-y-2">
                    {plan.features.map((feature, fIdx) => (
                      <li key={fIdx} className="text-xs text-zinc-300 flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-6">
                <Link
                  href={plan.priceMonthly === 0 ? '/sorteos/nuevo' : `/sorteos/nuevo?plan=${plan.id}`}
                  className={`w-full py-3.5 rounded-xl font-bold font-display text-xs text-center transition-all flex items-center justify-center gap-2 ${
                    plan.isPopular
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-600/30 hover:opacity-95'
                      : 'bg-white/5 hover:bg-white/10 text-white border border-white/10'
                  }`}
                >
                  <span>{plan.ctaLabel}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Feature Comparison Highlights */}
      <div className="glass-card rounded-3xl p-8 sm:p-12 border border-white/10 space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-black font-display text-white">
            Diseñado para máxima confianza y viralidad
          </h2>
          <p className="text-xs sm:text-sm text-zinc-400">
            Todas las cuentas disfrutan de nuestra arquitectura de seguridad criptográfica y soporte para redes sociales líderes.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
            <ShieldCheck className="w-6 h-6 text-emerald-400" />
            <h3 className="font-bold text-white text-sm">Cero Manipulación</h3>
            <p className="text-xs text-zinc-400">
              Generador respaldado por CSPRNG y algoritmo Fisher-Yates. Cada resultado genera un certificado inmutable con hash SHA-256.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
            <Zap className="w-6 h-6 text-amber-400" />
            <h3 className="font-bold text-white text-sm">Velocidad en Segundos</h3>
            <p className="text-xs text-zinc-400">
              Procesa miles de comentarios al instante con sincronización optimizada para publicaciones y reels con alto tráfico.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
            <Sparkles className="w-6 h-6 text-purple-400" />
            <h3 className="font-bold text-white text-sm">Landings Públicas</h3>
            <p className="text-xs text-zinc-400">
              Páginas con URL única para que tus seguidores puedan revisar quiénes ganaron, cuántos comentarios hubo y la fecha exacta del sorteo.
            </p>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-mono text-purple-400 font-bold uppercase">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Preguntas Frecuentes</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-display text-white">
            ¿Tienes alguna duda sobre los planes?
          </h2>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="glass-card rounded-2xl p-5 border border-white/10 space-y-2">
              <h3 className="text-sm font-bold text-white">{faq.q}</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
