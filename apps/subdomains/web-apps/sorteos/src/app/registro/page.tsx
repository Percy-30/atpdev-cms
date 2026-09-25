"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Gift, ArrowRight, Lock, Mail, User, ShieldCheck } from 'lucide-react';
import { PRICING_PLANS } from '@/lib/types';
import { api, setToken } from '@/lib/api';

function RegistroContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialPlan = searchParams.get('plan') || 'free';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedPlan, setSelectedPlan] = useState(initialPlan);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = await api<{ token: string }>('/api/v1/auth/register', {
        method: 'POST',
        body: { name, email, password },
        auth: false,
      });
      setToken(data.token);
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al registrar');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="w-full max-w-lg space-y-8">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-pink-500 p-0.5 shadow-lg shadow-purple-500/20">
              <div className="w-full h-full bg-[#0b0f19] rounded-[10px] flex items-center justify-center">
                <Gift className="w-5 h-5 text-pink-400" />
              </div>
            </div>
            <span className="text-xl font-black font-display text-white">sorteos <span className="text-purple-400">pro</span></span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black font-display text-white">
            Crear Cuenta en Sorteos Pro
          </h1>
          <p className="text-xs text-zinc-400">
            Empieza a realizar sorteos transparentes y verificables en minutos
          </p>
        </div>

        <div className="glass-card rounded-3xl p-7 border border-white/10 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1.5">Nombre Completo o Empresa:</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Tu nombre o marca"
                  className="w-full pl-9 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1.5">Correo Electrónico:</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@empresa.com"
                  className="w-full pl-9 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1.5">Contraseña:</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 8 caracteres"
                  className="w-full pl-9 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-xs font-mono focus:outline-none focus:border-purple-500"
                />
              </div>
            </div>

            {/* Plan Selector */}
            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-2">Selecciona tu Plan Inicial:</label>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                {PRICING_PLANS.slice(0, 4).map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSelectedPlan(p.id)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      selectedPlan === p.id
                        ? 'border-purple-500 bg-purple-500/10 text-white font-bold ring-1 ring-purple-500'
                        : 'border-white/5 bg-white/[0.02] text-zinc-400 hover:border-white/10'
                    }`}
                  >
                    <div className="capitalize">{p.name}</div>
                    <div className="text-[10px] text-zinc-500 mt-0.5">
                      {p.priceMonthly === 0 ? 'Gratis' : `$${p.priceMonthly}/mes`}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2">
              {error && (
                <div className="mb-3 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs font-mono">
                  {error}
                </div>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 text-white font-bold font-display text-xs shadow-xl shadow-purple-600/30 hover:opacity-95 transition-all flex items-center justify-center gap-2"
              >
                <span>{loading ? 'Creando cuenta...' : 'Comenzar Ahora'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>

        <p className="text-center text-xs text-zinc-400">
          ¿Ya tienes cuenta?{' '}
          <Link href="/login" className="text-purple-400 hover:text-purple-300 font-bold font-mono">
            Inicia sesión aquí
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function RegistroPage() {
  return (
    <React.Suspense
      fallback={
        <div className="min-h-[85vh] flex items-center justify-center text-zinc-500 font-mono text-xs">
          Cargando registro...
        </div>
      }
    >
      <RegistroContent />
    </React.Suspense>
  );
}
