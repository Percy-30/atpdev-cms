"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Gift, 
  Users, 
  Sparkles, 
  Trophy, 
  AlertTriangle, 
  CheckCircle2, 
  RefreshCw, 
  ExternalLink, 
  Copy, 
  Plus, 
  Share2, 
  Settings, 
  ShieldCheck, 
  Check, 
  RotateCcw,
  Zap,
  Lock
} from 'lucide-react';
import { InstagramIcon, FacebookIcon, YoutubeIcon } from '@/components/SocialIcons';
import { Giveaway } from '@/lib/types';
import { api, setToken, getToken } from '@/lib/api';

interface SocialAccount {
  id: string;
  network: 'instagram' | 'facebook' | 'youtube';
  name: string;
  handle: string;
  status: 'connected' | 'expired' | 'revoked';
  expiresInDays: number;
}

export default function DashboardPage() {
  const [giveaways, setGiveaways] = useState<Giveaway[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [usage, setUsage] = useState({ used: 0, limit: 2500, percent: 0, warn80: false });
  const [planName, setPlanName] = useState('Pro Creador');

  const commentLimit = usage.limit;
  const commentsUsed = usage.used;
  const usagePercent = usage.percent;

  // RF-005 a RF-009: Cuentas sociales conectadas
  const [socialAccounts, setSocialAccounts] = useState<SocialAccount[]>([
    {
      id: 'acc-1',
      network: 'instagram',
      name: 'ATP Dev Oficial',
      handle: '@atpdev_oficial',
      status: 'connected',
      expiresInDays: 48
    },
    {
      id: 'acc-2',
      network: 'facebook',
      name: 'Comunidad ATP Dev',
      handle: 'facebook.com/atpdev.pe',
      status: 'connected',
      expiresInDays: 52
    },
    {
      id: 'acc-3',
      network: 'youtube',
      name: 'ATP Dev Tech Lab',
      handle: '@ATPDevTech',
      status: 'connected',
      expiresInDays: 14
    }
  ]);

  // Cargar sorteos + cuentas + cuota desde la API real (fallback a demo local)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const oauthToken = params.get('token');
      if (oauthToken) {
        setToken(oauthToken);
        window.history.replaceState({}, '', window.location.pathname);
      }
      const payment = params.get('payment');
      const plan = params.get('plan');
      const sessionId = params.get('session_id');
      if (payment === 'success' && plan) {
        api('/api/v1/billing/confirm', {
          method: 'POST',
          body: { planId: plan, sessionId },
        }).catch(() => undefined);
      }
    }
    let cancelled = false;
    (async () => {
      try {
        const [gRes, sRes, uRes, meRes] = await Promise.all([
          api<{ data: Giveaway[] }>('/api/v1/giveaways').catch(() => null),
          api<{ data: SocialAccount[] }>('/api/v1/social-accounts').catch(() => null),
          api<{ used: number; limit: number; percent: number; warn80: boolean }>('/api/v1/billing/usage').catch(() => null),
          api<{ user: { plan: string } }>('/api/v1/me').catch(() => null),
        ]);
        if (cancelled) return;
        if (gRes && Array.isArray(gRes.data)) {
          setGiveaways(gRes.data as Giveaway[]);
        }
        if (sRes && Array.isArray(sRes.data)) {
          setSocialAccounts(
            (sRes.data as unknown as Array<Record<string, string>>).map((a) => ({
              id: String(a.id),
              network: (a.platform || a.network || 'instagram') as SocialAccount['network'],
              name: String(a.name || ''),
              handle: String(a.handle || ''),
              status: (a.status === 'connected' ? 'connected' : a.status === 'expired' ? 'expired' : 'revoked') as SocialAccount['status'],
              expiresInDays: Math.max(0, Math.round((Date.parse(String(a.expiresAt || Date.now())) - Date.now()) / 86400000)),
            }))
          );
        }
        if (uRes) setUsage({ used: uRes.used, limit: uRes.limit, percent: uRes.percent, warn80: uRes.warn80 });
        if (meRes?.user?.plan) {
          const labels: Record<string, string> = { free: 'Free', pro: 'Pro Creador', business: 'Business', enterprise: 'Enterprise' };
          setPlanName(labels[meRes.user.plan] || meRes.user.plan);
        }
      } catch {
        // fallback silencioso a datos demo locales
      }
      // Merge con sorteos locales (herramienta standalone guarda en localStorage)
      if (typeof window !== 'undefined' && !cancelled) {
        try {
          const stored = JSON.parse(localStorage.getItem('sorteos_pro_db') || '{}');
          const local: Giveaway[] = Object.values(stored);
          if (local.length > 0) {
            setGiveaways((prev) => {
              const ids = new Set(prev.map((p) => p.id));
              return [...prev, ...local.filter((l) => !ids.has(l.id))];
            });
          }
        } catch {
          // noop
        }
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCopyLink = (id: string) => {
    if (typeof window !== 'undefined') {
      const url = `${window.location.origin}/sorteo/${id}`;
      navigator.clipboard.writeText(url);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  // RF-018: Duplicar sorteo como plantilla (vía API + fallback local)
  const handleDuplicate = async (g: Giveaway) => {
    try {
      const data = await api<{ giveaway: Giveaway }>(`/api/v1/giveaways/${g.id}/duplicate`, { method: 'POST' });
      setGiveaways([data.giveaway, ...giveaways]);
    } catch {
      const duplicated: Giveaway = {
        ...g,
        id: `sorteo-${Date.now().toString(36)}`,
        title: `${g.title} (Copia)`,
        status: 'draft',
        createdAt: new Date().toISOString(),
        winners: [],
        substitutes: [],
        verificationHash: undefined,
        certificateId: undefined
      };
      if (typeof window !== 'undefined') {
        const stored = JSON.parse(localStorage.getItem('sorteos_pro_db') || '{}');
        stored[duplicated.id] = duplicated;
        localStorage.setItem('sorteos_pro_db', JSON.stringify(stored));
      }
      setGiveaways([duplicated, ...giveaways]);
    }
  };

  // RF-008: Desconectar/reconectar cuenta social (vía API + fallback local)
  const handleToggleAccount = async (id: string) => {
    const acc = socialAccounts.find((a) => a.id === id);
    const nextStatus = acc?.status === 'connected' ? 'revoked' : 'connected';
    setSocialAccounts(socialAccounts.map((a) => (a.id === id ? { ...a, status: nextStatus as typeof a.status } : a)));
    try {
      if (nextStatus === 'revoked') {
        await api(`/api/v1/social-accounts/${id}`, { method: 'DELETE' });
      } else {
        await api(`/api/v1/social-accounts/${id}/refresh`, { method: 'POST' });
      }
    } catch {
      // fallback local ya aplicado
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Top Welcome Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono uppercase tracking-wider text-purple-400 font-bold">
              Panel de Creador
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-mono font-bold">
              Plan {planName}
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black font-display text-white mt-1">
            Hola, Creador Pro 👋
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Gestiona tus sorteos sociales activos, cuentas conectadas y límites de comentarios.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/sorteos/nuevo"
            className="px-5 py-3 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 text-white font-bold font-display text-xs shadow-xl shadow-purple-600/25 hover:opacity-95 transition-all flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Crear Nuevo Sorteo</span>
          </Link>
        </div>
      </div>

      {/* RF-029 & RF-030: Usage & Alert Banner */}
      <div className="glass-card rounded-3xl p-6 sm:p-7 border border-white/10 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Consumo Mensual de Comentarios</h3>
              <p className="text-xs text-zinc-400">
                Has procesado <strong className="text-white font-mono">{commentsUsed}</strong> de <strong className="text-zinc-300 font-mono">{commentLimit}</strong> comentarios este mes.
              </p>
            </div>
          </div>

          <Link
            href="/planes"
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-mono text-purple-300 border border-purple-500/20 transition-colors"
          >
            Ampliar Límite (Upgrade)
          </Link>
        </div>

        {/* Progress Bar */}
        <div className="space-y-1.5">
          <div className="w-full h-2.5 rounded-full bg-white/5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                usagePercent >= 80
                  ? 'bg-gradient-to-r from-amber-500 to-pink-500'
                  : 'bg-gradient-to-r from-purple-600 to-pink-500'
              }`}
              style={{ width: `${Math.min(100, usagePercent)}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] font-mono text-zinc-500">
            <span>0</span>
            <span className={usagePercent >= 80 ? 'text-amber-400 font-bold' : ''}>
              {usagePercent}% consumido
            </span>
            <span>{commentLimit} comentarios</span>
          </div>
        </div>

        {/* RF-030: Alerta automática si > 80% */}
        {usagePercent >= 80 && (
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong>Aviso de cuota (RF-030):</strong> Has superado el 80% de tu límite mensual. Te recomendamos subir al Plan Business para evitar interrupciones en tus próximos sorteos.
            </span>
          </div>
        )}
      </div>

      {/* RF-005 a RF-009: Connected Social Accounts */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-2 border-b border-white/5 pb-4">
          <div>
            <h2 className="text-base sm:text-lg font-bold font-display text-white">
              Cuentas Sociales Conectadas (OAuth Oficial)
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Conexión directa mediante Graph API de Meta y Google API sin compartir contraseñas.
            </p>
          </div>
          <span className="text-xs font-mono text-emerald-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            <span>OAuth 2.0 Activo</span>
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {socialAccounts.map((acc) => {
            const isConnected = acc.status === 'connected';
            return (
              <div
                key={acc.id}
                className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {acc.network === 'instagram' && <InstagramIcon className="w-5 h-5 text-pink-400" />}
                      {acc.network === 'facebook' && <FacebookIcon className="w-5 h-5 text-blue-400" />}
                      {acc.network === 'youtube' && <YoutubeIcon className="w-5 h-5 text-red-400" />}
                      <span className="font-bold text-white text-xs capitalize">{acc.network}</span>
                    </div>

                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                        isConnected
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-red-500/10 text-red-400 border border-red-500/20'
                      }`}
                    >
                      {isConnected ? 'Conectada' : 'Revocada'}
                    </span>
                  </div>

                  <div>
                    <div className="text-xs font-bold text-white">{acc.name}</div>
                    <div className="text-[11px] font-mono text-zinc-400">{acc.handle}</div>
                  </div>
                </div>

                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] font-mono">
                  <span className="text-zinc-500">
                    {isConnected ? `Token: ${acc.expiresInDays}d` : 'Inactiva'}
                  </span>
                  <button
                    onClick={() => handleToggleAccount(acc.id)}
                    className="text-xs text-purple-400 hover:text-purple-300 transition-colors font-bold"
                  >
                    {isConnected ? 'Desconectar' : 'Reconectar'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* RF-010 to RF-019: Giveaways List (Mis Sorteos) */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-2 border-b border-white/5 pb-4">
          <div className="flex items-center gap-2">
            <Gift className="w-5 h-5 text-pink-400" />
            <h2 className="text-base sm:text-lg font-bold font-display text-white">
              Historial de Sorteos ({giveaways.length})
            </h2>
          </div>
          <span className="text-xs font-mono text-zinc-500">
            Últimos registros auditados
          </span>
        </div>

        {giveaways.length === 0 ? (
          <div className="text-center py-12 space-y-3">
            <p className="text-sm text-zinc-400">Aún no has creado ningún sorteo.</p>
            <Link
              href="/sorteos/nuevo"
              className="inline-flex items-center gap-2 text-xs font-bold text-purple-400 hover:text-purple-300"
            >
              <span>Crear mi primer sorteo</span>
              <Sparkles className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {giveaways.map((g) => (
              <div
                key={g.id}
                className="p-4 sm:p-5 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all flex flex-col md:flex-row md:items-center md:justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono text-zinc-300 uppercase">
                      {g.network || g.platform || 'Social'}
                    </span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                        g.status === 'completed' || g.status === 'finished'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : 'bg-zinc-500/10 text-zinc-400 border border-zinc-500/20'
                      }`}
                    >
                      {g.status === 'completed' || g.status === 'finished' ? 'Finalizado' : 'Borrador'}
                    </span>
                    <span className="text-[11px] font-mono text-zinc-500" suppressHydrationWarning>
                      {new Date(g.createdAt).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white font-display">
                    {g.title}
                  </h3>

                  <div className="flex items-center gap-4 text-xs font-mono text-zinc-400">
                    <span>💬 {g.totalCommentsCount || 0} comentarios</span>
                    <span>🏆 {g.winners?.length || 0} ganador(es)</span>
                    {g.substitutes && g.substitutes.length > 0 && (
                      <span>👥 {g.substitutes.length} suplente(s)</span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 flex-wrap pt-2 md:pt-0">
                  <button
                    onClick={() => handleCopyLink(g.id)}
                    className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-mono text-zinc-300 border border-white/5 transition-colors flex items-center gap-1.5"
                    title="Copiar enlace público"
                  >
                    {copiedId === g.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Share2 className="w-3.5 h-3.5" />
                    )}
                    <span>{copiedId === g.id ? 'Copiado' : 'Compartir'}</span>
                  </button>

                  <button
                    onClick={() => handleDuplicate(g)}
                    className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-mono text-zinc-300 border border-white/5 transition-colors flex items-center gap-1.5"
                    title="Duplicar como plantilla (RF-018)"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Duplicar</span>
                  </button>

                  <Link
                    href={`/sorteo/${g.id}`}
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold font-display text-xs transition-colors flex items-center gap-1.5"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Ver Resultado</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
