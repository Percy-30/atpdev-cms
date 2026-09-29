"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Search, ArrowRight, CheckCircle2 } from 'lucide-react';

export const HomeHashVerifier: React.FC = () => {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = query.trim();
    if (!clean) {
      setError('Por favor, ingresa un código de certificado o hash SHA-256.');
      return;
    }
    setError('');
    router.push(`/certificados/${encodeURIComponent(clean)}`);
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm relative overflow-hidden space-y-4 text-center">
      <div className="space-y-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[11px] font-mono font-bold uppercase tracking-wider text-emerald-700 mb-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Auditoría Pública en Tiempo Real</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-extrabold font-display text-slate-900">
          Verificar Autenticidad de un Sorteo
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
          Ingresa el código oficial o hash SHA-256 para comprobar que los ganadores fueron elegidos con aleatoriedad pura.
        </p>
      </div>

      <form onSubmit={handleVerify} className="flex flex-col sm:flex-row gap-2.5 pt-2">
        <div className="relative flex-1">
          <label htmlFor="verify-query-input" className="sr-only">
            Código de certificado oficial o hash SHA-256
          </label>
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" aria-hidden="true" />
          <input
            id="verify-query-input"
            name="query"
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (error) setError('');
            }}
            placeholder="Ejemplo: CERT-SP-98A41E8D o hash SHA-256..."
            aria-label="Código de certificado oficial o hash SHA-256"
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-white border border-slate-200 text-slate-900 font-mono text-xs focus:outline-none focus:border-[#d91a7a] focus:ring-2 focus:ring-pink-50 transition-colors shadow-xs"
          />
        </div>
        <button
          type="submit"
          className="btn-pro-primary text-sm py-3 px-6 shrink-0 cursor-pointer"
        >
          <span>Verificar</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      {error && (
        <p className="text-xs text-red-500 font-mono text-center">{error}</p>
      )}

      <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] font-mono text-slate-500 pt-1">
        <span className="flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Web Crypto CSPRNG
        </span>
        <span className="flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Inmutable SHA-256
        </span>
        <span className="flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> 100% Auditable
        </span>
      </div>
    </div>
  );
};

export default HomeHashVerifier;
