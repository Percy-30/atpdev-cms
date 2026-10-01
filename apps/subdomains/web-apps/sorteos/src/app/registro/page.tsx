"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Gift, ArrowRight, Lock, Mail, User } from 'lucide-react';
import { PRICING_PLANS } from '@/lib/types';
import { api, setToken, getToken } from '@/lib/api';
import { useLanguage } from '@/context/LanguageContext';

function RegistroContent() {
  const router = useRouter();
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const initialPlan = searchParams.get('plan') || 'free';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedPlan, setSelectedPlan] = useState(initialPlan);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (getToken()) {
      router.push('/dashboard');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = await api<{ token: string }>('/api/v1/auth/register', {
        method: 'POST',
        body: { name, email, password, plan: selectedPlan },
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
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-500 to-purple-600 p-0.5 shadow-md">
              <div className="w-full h-full bg-white dark:bg-[#0b0f19] rounded-[10px] flex items-center justify-center">
                <Gift className="w-5 h-5 text-pink-600 dark:text-pink-400" />
              </div>
            </div>
            <span className="text-xl font-black font-display text-slate-900 dark:text-white">sorteos <span className="text-pink-600 dark:text-purple-400">pro</span></span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black font-display text-slate-900 dark:text-white">
            {t('auth_register_title')}
          </h1>
          <p className="text-xs text-slate-600 dark:text-zinc-400">
            {t('auth_register_subtitle')}
          </p>
        </div>

        <div className="bg-white dark:bg-[#0f172a] rounded-3xl p-7 border border-slate-200 dark:border-white/10 shadow-sm space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-slate-700 dark:text-zinc-300 mb-1.5">{t('auth_name_label')}</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-500" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t('auth_name_placeholder')}
                  className="w-full pl-9 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white text-xs font-mono focus:outline-none focus:border-pink-500 dark:focus:border-purple-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-700 dark:text-zinc-300 mb-1.5">{t('auth_email_label')}</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@empresa.com"
                  className="w-full pl-9 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white text-xs font-mono focus:outline-none focus:border-pink-500 dark:focus:border-purple-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-700 dark:text-zinc-300 mb-1.5">{t('auth_password_label')}</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t('auth_password_placeholder')}
                  className="w-full pl-9 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white text-xs font-mono focus:outline-none focus:border-pink-500 dark:focus:border-purple-500"
                />
              </div>
            </div>

            {/* Plan Selector */}
            <div>
              <label className="block text-xs font-mono text-slate-700 dark:text-zinc-300 mb-2">{t('auth_select_plan')}</label>
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                {PRICING_PLANS.slice(0, 4).map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setSelectedPlan(p.id)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedPlan === p.id
                        ? 'border-pink-500 dark:border-purple-500 bg-pink-50 dark:bg-purple-500/10 text-slate-900 dark:text-white font-bold ring-1 ring-pink-500 dark:ring-purple-500'
                        : 'border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/[0.02] text-slate-600 dark:text-zinc-400 hover:border-slate-300 dark:hover:border-white/10'
                    }`}
                  >
                    <div className="capitalize">{p.name}</div>
                    <div className="text-[10px] text-slate-500 dark:text-zinc-500 mt-0.5">
                      {p.priceMonthly === 0 ? 'Gratis' : `$${p.priceMonthly}/mes`}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2">
              {error && (
                <div className="mb-3 p-3 rounded-xl bg-rose-50 dark:bg-red-500/10 border border-rose-200 dark:border-red-500/20 text-rose-700 dark:text-red-300 text-xs font-mono">
                  {error}
                </div>
              )}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl btn-pro-primary text-xs font-bold font-display shadow-md hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{loading ? t('auth_register_loading') : t('auth_register_btn')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>

        <p className="text-center text-xs text-slate-600 dark:text-zinc-400">
          {t('auth_has_account')}{' '}
          <Link href="/login" className="text-pink-600 dark:text-purple-400 hover:underline font-bold font-mono">
            {t('auth_login_link')}
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
        <div className="min-h-[85vh] flex items-center justify-center text-slate-400 dark:text-zinc-500 font-mono text-xs">
          Cargando...
        </div>
      }
    >
      <RegistroContent />
    </React.Suspense>
  );
}
