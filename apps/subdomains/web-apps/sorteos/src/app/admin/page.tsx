"use client";

import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Users, 
  TrendingUp, 
  DollarSign, 
  ToggleLeft, 
  ToggleRight, 
  Check, 
  X, 
  AlertTriangle, 
  Search, 
  Sliders, 
  Database, 
  Activity
} from 'lucide-react';

interface ManagedUser {
  id: string;
  name: string;
  email: string;
  plan: 'free' | 'pro' | 'business' | 'enterprise';
  status: 'active' | 'suspended';
  giveawaysCount: number;
  commentsConsumed: number;
  joinedAt: string;
}

interface FeatureFlag {
  id: string;
  name: string;
  description: string;
  enabledInFree: boolean;
  enabledInPro: boolean;
  enabledInBusiness: boolean;
}

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'metrics' | 'users' | 'featureFlags'>('metrics');
  const [searchQuery, setSearchQuery] = useState('');

  // RF-033: Métricas de negocio globales
  const metrics = {
    mrr: 14850,
    activeSubscribers: 624,
    churnRate: '2.1%',
    totalGiveawaysThisMonth: 3840,
    apiResponseTime: '185ms',
    errorRate: '0.04%',
  };

  // RF-031 & RF-032: Gestión de usuarios y cambio manual de planes
  const [users, setUsers] = useState<ManagedUser[]>([
    {
      id: 'usr-1',
      name: 'Agencia Digital Lima',
      email: 'contacto@agenciadigital.pe',
      plan: 'business',
      status: 'active',
      giveawaysCount: 42,
      commentsConsumed: 12400,
      joinedAt: '2026-08-10'
    },
    {
      id: 'usr-2',
      name: 'Valeria Gómez',
      email: 'valeria.g@gmail.com',
      plan: 'pro',
      status: 'active',
      giveawaysCount: 8,
      commentsConsumed: 2150,
      joinedAt: '2026-09-01'
    },
    {
      id: 'usr-3',
      name: 'Spam Bot Network',
      email: 'spambot99@disposable.com',
      plan: 'free',
      status: 'suspended',
      giveawaysCount: 1,
      commentsConsumed: 50,
      joinedAt: '2026-09-18'
    },
    {
      id: 'usr-4',
      name: 'Retail Corporativo Perú',
      email: 'marketing@retailcorp.pe',
      plan: 'enterprise',
      status: 'active',
      giveawaysCount: 156,
      commentsConsumed: 89400,
      joinedAt: '2026-06-15'
    }
  ]);

  // RF-034: Feature flags por plan
  const [featureFlags, setFeatureFlags] = useState<FeatureFlag[]>([
    {
      id: 'ff-multi-post',
      name: 'Multi-post Ingestion',
      description: 'Combinar comentarios de varios posts o reels en un único sorteo.',
      enabledInFree: false,
      enabledInPro: false,
      enabledInBusiness: true
    },
    {
      id: 'ff-custom-branding',
      name: 'White-label Certificates',
      description: 'Certificados sin marca de agua y con logo propio de la empresa.',
      enabledInFree: false,
      enabledInPro: true,
      enabledInBusiness: true
    },
    {
      id: 'ff-scheduled-draws',
      name: 'Sorteos Programados (Cron)',
      description: 'Ejecución automática en fecha y hora específica sin intervención manual.',
      enabledInFree: false,
      enabledInPro: false,
      enabledInBusiness: true
    },
    {
      id: 'ff-advanced-filters',
      name: 'Filtros Avanzados (@menciones y hashtags)',
      description: 'Excluir comentarios que no cumplan criterios de texto.',
      enabledInFree: false,
      enabledInPro: true,
      enabledInBusiness: true
    }
  ]);

  const toggleUserStatus = (userId: string) => {
    setUsers(users.map((u) => {
      if (u.id === userId) {
        return { ...u, status: u.status === 'active' ? 'suspended' : 'active' };
      }
      return u;
    }));
  };

  const changeUserPlan = (userId: string, newPlan: 'free' | 'pro' | 'business' | 'enterprise') => {
    setUsers(users.map((u) => {
      if (u.id === userId) {
        return { ...u, plan: newPlan };
      }
      return u;
    }));
  };

  const toggleFeature = (flagId: string, plan: 'enabledInFree' | 'enabledInPro' | 'enabledInBusiness') => {
    setFeatureFlags(featureFlags.map((ff) => {
      if (ff.id === flagId) {
        return { ...ff, [plan]: !ff[plan] };
      }
      return ff;
    }));
  };

  const filteredUsers = users.filter((u) => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/5 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-mono font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Super-Admin Console (RF-031 a RF-034)</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black font-display text-white mt-2">
            Panel Operativo de Sorteos Pro
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Control de usuarios, asignación manual de suscripciones, observabilidad de métricas y feature flags.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-white/5 border border-white/10 text-xs font-mono">
          <button
            onClick={() => setActiveTab('metrics')}
            className={`px-3.5 py-2 rounded-xl transition-all ${
              activeTab === 'metrics'
                ? 'bg-purple-600 text-white font-bold shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Métricas (RF-033)
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`px-3.5 py-2 rounded-xl transition-all ${
              activeTab === 'users'
                ? 'bg-purple-600 text-white font-bold shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Usuarios (RF-031/032)
          </button>
          <button
            onClick={() => setActiveTab('featureFlags')}
            className={`px-3.5 py-2 rounded-xl transition-all ${
              activeTab === 'featureFlags'
                ? 'bg-purple-600 text-white font-bold shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Feature Flags (RF-034)
          </button>
        </div>
      </div>

      {/* TAB 1: METRICS & OBSERVABILITY (RF-033) */}
      {activeTab === 'metrics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-1">
              <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                <span>Ingreso Recurrente Mensual (MRR)</span>
                <DollarSign className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-black font-display text-emerald-400 font-mono-num" suppressHydrationWarning>
                ${metrics.mrr.toLocaleString('en-US')}
              </div>
              <div className="text-[11px] text-zinc-500 font-mono">+18.4% vs mes anterior</div>
            </div>

            <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-1">
              <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                <span>Suscriptores de Pago</span>
                <Users className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-black font-display text-white font-mono-num">
                {metrics.activeSubscribers}
              </div>
              <div className="text-[11px] text-zinc-500 font-mono">Churn mensual: {metrics.churnRate}</div>
            </div>

            <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-1">
              <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                <span>Sorteos Realizados (Mes)</span>
                <TrendingUp className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-black font-display text-white font-mono-num">
                {metrics.totalGiveawaysThisMonth}
              </div>
              <div className="text-[11px] text-zinc-500 font-mono">p95 latencia: {metrics.apiResponseTime}</div>
            </div>

            <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-1">
              <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
                <span>Salud del Sistema & APIs</span>
                <Activity className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl sm:text-3xl font-black font-display text-white font-mono-num">
                99.96%
              </div>
              <div className="text-[11px] text-emerald-400 font-mono">Tasa de error API: {metrics.errorRate}</div>
            </div>
          </div>

          <div className="glass-card rounded-3xl p-6 border border-white/10 space-y-4">
            <h3 className="text-base font-bold font-display text-white">
              Latencia de Integración por Proveedor Social (Grafana Loki & Prometheus)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                <span className="text-pink-400 font-bold">Instagram Graph API</span>
                <div className="text-lg text-white font-bold">142 ms</div>
                <div className="text-zinc-500">Rate Limit consumido: 22%</div>
              </div>
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                <span className="text-blue-400 font-bold">Facebook Graph API</span>
                <div className="text-lg text-white font-bold">168 ms</div>
                <div className="text-zinc-500">Rate Limit consumido: 18%</div>
              </div>
              <div className="p-4 rounded-xl bg-white/[0.02] border border-white/5 space-y-1">
                <span className="text-red-400 font-bold">YouTube Data API v3</span>
                <div className="text-lg text-white font-bold">210 ms</div>
                <div className="text-zinc-500">Quota consumida: 31%</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: USER MANAGEMENT (RF-031 & RF-032) */}
      {activeTab === 'users' && (
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-base sm:text-lg font-bold font-display text-white">
                Gestión de Cuentas y Planes de Usuario
              </h2>
              <p className="text-xs text-zinc-400">
                Suspender/reactivar accesos (RF-031) o modificar planes manualmente (RF-032).
              </p>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                placeholder="Buscar por nombre o email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white placeholder:text-zinc-500 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-white/10 text-zinc-500 uppercase tracking-wider">
                  <th className="py-3 px-3">Usuario</th>
                  <th className="py-3 px-3">Plan Actual (RF-032)</th>
                  <th className="py-3 px-3">Estado (RF-031)</th>
                  <th className="py-3 px-3">Consumo</th>
                  <th className="py-3 px-3">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-white/[0.02]">
                    <td className="py-3.5 px-3">
                      <div className="font-bold text-white font-sans text-sm">{user.name}</div>
                      <div className="text-zinc-500">{user.email}</div>
                    </td>
                    <td className="py-3.5 px-3">
                      <select
                        value={user.plan}
                        onChange={(e) => changeUserPlan(user.id, e.target.value as any)}
                        className="px-2.5 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white font-bold text-xs capitalize focus:outline-none focus:border-purple-500"
                      >
                        <option value="free" className="bg-zinc-900">Free</option>
                        <option value="pro" className="bg-zinc-900">Pro Creador</option>
                        <option value="business" className="bg-zinc-900">Business</option>
                        <option value="enterprise" className="bg-zinc-900">Enterprise</option>
                      </select>
                    </td>
                    <td className="py-3.5 px-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          user.status === 'active'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : 'bg-red-500/10 text-red-400 border border-red-500/20'
                        }`}
                      >
                        {user.status === 'active' ? 'Activo' : 'Suspendido'}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-zinc-400">
                      <div suppressHydrationWarning>{user.commentsConsumed.toLocaleString('en-US')} comentarios</div>
                      <div className="text-[10px] text-zinc-500">{user.giveawaysCount} sorteos</div>
                    </td>
                    <td className="py-3.5 px-3">
                      <button
                        onClick={() => toggleUserStatus(user.id)}
                        className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-colors ${
                          user.status === 'active'
                            ? 'bg-red-500/10 hover:bg-red-500/20 text-red-400'
                            : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400'
                        }`}
                      >
                        {user.status === 'active' ? 'Suspender' : 'Reactivar'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: FEATURE FLAGS (RF-034) */}
      {activeTab === 'featureFlags' && (
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 space-y-6">
          <div>
            <h2 className="text-base sm:text-lg font-bold font-display text-white">
              Feature Flags por Plan (RF-034)
            </h2>
            <p className="text-xs text-zinc-400">
              Habilita o deshabilita funcionalidades de producto por nivel de suscripción en tiempo real sin desplegar código.
            </p>
          </div>

          <div className="space-y-4">
            {featureFlags.map((ff) => (
              <div
                key={ff.id}
                className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 space-y-3"
              >
                <div>
                  <h3 className="text-sm font-bold text-white">{ff.name}</h3>
                  <p className="text-xs text-zinc-400">{ff.description}</p>
                </div>

                <div className="flex items-center gap-6 pt-2 border-t border-white/5 text-xs font-mono">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={ff.enabledInFree}
                      onChange={() => toggleFeature(ff.id, 'enabledInFree')}
                      className="rounded text-purple-600 bg-zinc-900 border-zinc-700"
                    />
                    <span className="text-zinc-300">Plan Free</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={ff.enabledInPro}
                      onChange={() => toggleFeature(ff.id, 'enabledInPro')}
                      className="rounded text-purple-600 bg-zinc-900 border-zinc-700"
                    />
                    <span className="text-zinc-300">Plan Pro</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={ff.enabledInBusiness}
                      onChange={() => toggleFeature(ff.id, 'enabledInBusiness')}
                      className="rounded text-purple-600 bg-zinc-900 border-zinc-700"
                    />
                    <span className="text-zinc-300">Plan Business</span>
                  </label>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
