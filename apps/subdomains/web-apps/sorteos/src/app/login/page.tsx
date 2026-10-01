"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Gift, ArrowRight, Lock, Mail } from 'lucide-react';
import { FacebookIcon } from '@/components/SocialIcons';
import { api, setToken, getToken } from '@/lib/api';
import { useLanguage } from '@/context/LanguageContext';

export default function LoginPage() {
  const router = useRouter();
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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
      const data = await api<{ token: string }>('/api/v1/auth/login', {
        method: 'POST',
        body: { email, password },
        auth: false,
      });
      setToken(data.token);
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión');
      setLoading(false);
    }
  };

  const handleOAuth = async (provider: 'google' | 'facebook') => {
    try {
      const data = await api<{ authorizeUrl: string }>(`/api/v1/auth/oauth/${provider}`, { auth: false });
      window.location.href = data.authorizeUrl;
    } catch {
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="w-full max-w-md space-y-8">
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
            {t('auth_login_title')}
          </h1>
          <p className="text-xs text-slate-600 dark:text-zinc-400">
            {t('auth_login_subtitle')}
          </p>
        </div>

        <div className="bg-white dark:bg-[#0f172a] rounded-3xl p-7 border border-slate-200 dark:border-white/10 shadow-sm space-y-6">
          {/* OAuth Buttons */}
          <div className="space-y-3">
            <button
              type="button"
              onClick={() => handleOAuth('google')}
              className="w-full py-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 dark:bg-white/5 dark:hover:bg-white/10 dark:border-white/10 text-xs font-mono text-slate-700 dark:text-zinc-200 transition-colors flex items-center justify-center gap-2 font-bold cursor-pointer shadow-xs"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.04h3.88c2.27-2.09 3.665-5.17 3.665-9.14z"/>
                <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.04c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.13C3.27 21.37 7.34 24 12 24z"/>
                <path fill="#FBBC05" d="M5.28 14.28c-.25-.72-.38-1.49-.38-2.28s.13-1.56.38-2.28V6.59H1.26C.46 8.19 0 10.04 0 12s.46 3.81 1.26 5.41l4.02-3.13z"/>
                <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.27 2.63 1.26 6.59l4.02 3.13c.95-2.83 3.6-4.97 6.72-4.97z"/>
              </svg>
              <span>{t('auth_google_continue')}</span>
            </button>

            <button
              type="button"
              onClick={() => handleOAuth('facebook')}
              className="w-full py-3 rounded-xl bg-blue-50 hover:bg-blue-100 border border-blue-200 dark:bg-blue-600/10 dark:hover:bg-blue-600/20 dark:border-blue-500/20 text-xs font-mono text-blue-700 dark:text-blue-300 transition-colors flex items-center justify-center gap-2 font-bold cursor-pointer shadow-xs"
            >
              <FacebookIcon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>{t('auth_facebook_continue')}</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-slate-200 dark:bg-white/10" />
            <span className="text-[11px] font-mono text-slate-400 dark:text-zinc-500 uppercase">{t('auth_or_email')}</span>
            <div className="flex-1 h-px bg-slate-200 dark:bg-white/10" />
          </div>

          {/* Email / Password Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
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
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-mono text-slate-700 dark:text-zinc-300">{t('auth_password_label')}</label>
                <Link
                  href="/recuperar-password"
                  className="text-[11px] font-mono text-pink-600 dark:text-purple-400 hover:underline transition-colors"
                >
                  {t('auth_forgot_password')}
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-zinc-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-300 dark:border-white/10 text-slate-900 dark:text-white text-xs font-mono focus:outline-none focus:border-pink-500 dark:focus:border-purple-500"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-red-500/10 border border-rose-200 dark:border-red-500/20 text-rose-700 dark:text-red-300 text-xs font-mono">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl btn-pro-primary text-xs font-bold font-display shadow-md hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{loading ? t('auth_login_loading') : t('auth_login_btn')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-slate-600 dark:text-zinc-400">
          {t('auth_no_account')}{' '}
          <Link href="/registro" className="text-pink-600 dark:text-purple-400 hover:underline font-bold font-mono">
            {t('auth_register_link')}
          </Link>
        </p>
      </div>
    </div>
  );
}
