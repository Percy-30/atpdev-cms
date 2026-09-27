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
    // Si empieza con cert o es un id, redirige a /certificados/[id]
    router.push(`/certificados/${encodeURIComponent(clean)}`);
  };

  return (
    <div className="w-full max-w-2xl mx-auto glass-card rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl relative overflow-hidden space-y-4 text-center">
      <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
      
      <div className="space-y-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full emerald-gradient-badge text-[11px] font-mono font-bold uppercase tracking-wider mb-1">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Auditoría Pública en Tiempo Real</span>
        </div>
        <h3 className="text-xl sm:text-2xl font-bold font-display text-white">
          Verificar Autenticidad de un Sorteo
        </h3>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto">
          Ingresa el código oficial o hash SHA-256 para comprobar que los ganadores fueron elegidos con aleatoriedad pura.
        </p>
      </div>

      <form onSubmit={handleVerify} className="flex flex-col sm:flex-row gap-2.5 pt-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (error) setError('');
            }}
            placeholder="Ejemplo: CERT-SP-98A41E8D o hash SHA-256..."
            className="w-full pl-10 pr-4 py-3.5 rounded-xl bg-black/40 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-violet-500 transition-colors"
          />
        </div>
        <button
          type="submit"
          className="btn-pro-gold text-sm py-3 px-6 shrink-0"
        >
          <span>Verificar</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      {error && (
        <p className="text-xs text-red-400 font-mono text-center">{error}</p>
      )}

      <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] font-mono text-zinc-500 pt-1">
        <span className="flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Web Crypto CSPRNG
        </span>
        <span className="flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Inmutable SHA-256
        </span>
        <span className="flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3 text-emerald-400" /> 100% Auditable
        </span>
      </div>
    </div>
  );
};

export default HomeHashVerifier;
