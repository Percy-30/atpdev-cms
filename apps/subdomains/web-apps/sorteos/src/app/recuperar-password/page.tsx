"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Gift, ArrowLeft, Mail, CheckCircle2, ArrowRight } from 'lucide-react';

export default function RecuperarPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="w-full max-w-md space-y-8">
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
            Recuperar Contraseña
          </h1>
          <p className="text-xs text-zinc-400">
            Ingresa tu email registrado para recibir el enlace de restablecimiento
          </p>
        </div>

        <div className="glass-card rounded-3xl p-7 border border-white/10 space-y-6">
          {submitted ? (
            <div className="text-center space-y-4 py-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white">¡Enlace Enviado!</h3>
              <p className="text-xs text-zinc-400">
                Hemos enviado las instrucciones para restablecer tu contraseña a <strong className="text-white font-mono">{email}</strong>.
              </p>
              <div className="pt-2">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 text-xs font-mono text-purple-400 hover:text-purple-300 font-bold"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Volver al inicio de sesión</span>
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
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

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold font-display text-xs shadow-xl shadow-purple-600/30 hover:opacity-95 transition-all flex items-center justify-center gap-2"
              >
                <span>{loading ? 'Enviando...' : 'Enviar Enlace de Recuperación'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center pt-2">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 text-xs font-mono text-zinc-400 hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Cancelar y regresar</span>
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
