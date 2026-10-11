"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { 
  Gift, Sparkles, ChevronDown, ListOrdered, Disc, 
  Dices, CircleDollarSign, Hash, Users2, Menu, X, ShieldCheck,
  LayoutDashboard, LogOut, LogIn, User, CreditCard, Check
} from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { LanguageSelector } from './LanguageSelector';
import { useLanguage } from '@/context/LanguageContext';
import { api, getToken, removeToken } from '@/lib/api';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: string;
  plan?: string;
  avatarUrl?: string;
}

export const Navbar: React.FC = () => {
  const [toolsOpen, setToolsOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  const loadUser = async () => {
    const token = getToken();
    const logged = Boolean(token);
    setIsLoggedIn(logged);
    if (logged) {
      try {
        const res = await api<{ user: UserProfile }>('/api/v1/auth/me');
        if (res?.user) {
          setUserProfile(res.user);
        }
      } catch {
        // fallback silencioso
      }
    } else {
      setUserProfile(null);
    }
  };

  useEffect(() => {
    loadUser();
    const handleAuthEvent = () => loadUser();
    window.addEventListener('storage', handleAuthEvent);
    window.addEventListener('auth-changed', handleAuthEvent);

    return () => {
      window.removeEventListener('storage', handleAuthEvent);
      window.removeEventListener('auth-changed', handleAuthEvent);
    };
  }, []);

  // Cerrar dropdown al hacer click afuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    removeToken();
    setIsLoggedIn(false);
    setUserProfile(null);
    setUserDropdownOpen(false);
    window.location.href = '/login';
  };

  // Obtener iniciales para el avatar
  const getInitials = (name?: string, email?: string) => {
    if (name) {
      const parts = name.trim().split(' ');
      if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
      return name.slice(0, 2).toUpperCase();
    }
    if (email) return email.slice(0, 2).toUpperCase();
    return 'US';
  };

  const standaloneTools = [
    { name: t('tool_names'), href: '/herramientas/lista', icon: ListOrdered, desc: t('tool_names_desc') },
    { name: t('tool_roulette'), href: '/herramientas/ruleta', icon: Disc, desc: t('tool_roulette_desc') },
    { name: t('tool_dice'), href: '/herramientas/dados', icon: Dices, desc: t('tool_dice_desc') },
    { name: t('tool_coin'), href: '/herramientas/moneda', icon: CircleDollarSign, desc: t('tool_coin_desc') },
    { name: t('tool_numbers'), href: '/herramientas/numeros', icon: Hash, desc: t('tool_numbers_desc') },
    { name: t('tool_teams'), href: '/herramientas/equipos', icon: Users2, desc: t('tool_teams_desc') },
    { name: t('tool_secret_santa'), href: '/herramientas/amigo-invisible', icon: Gift, desc: t('tool_secret_santa_desc') },
  ];

  const planLabel = (userProfile?.plan || 'pro').toUpperCase();

  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#070a12]/90 backdrop-blur-md border-b border-slate-200/80 dark:border-white/10 shadow-xs transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18">
          
          {/* Logo Brand */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-pink-600 to-rose-500 p-0.5 shadow-md shadow-pink-500/20 group-hover:scale-105 transition-transform flex items-center justify-center text-white">
              <Gift className="w-5 h-5" />
            </div>
            <span className="text-xl font-black font-display tracking-tight text-slate-900 dark:text-white">
              sorteos <span className="text-pink-600 dark:text-purple-400">pro</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            
            {/* Apps Mega-Dropdown */}
            <div className="relative">
              <button
                onClick={() => setToolsOpen(!toolsOpen)}
                onBlur={() => setTimeout(() => setToolsOpen(false), 200)}
                className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-slate-700 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100/70 dark:hover:bg-white/5 transition-colors cursor-pointer"
              >
                <span>{t('nav_apps')}</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${toolsOpen ? 'rotate-180 text-pink-600' : 'text-slate-400'}`} />
              </button>

              {/* Tools Dropdown Menu */}
              {toolsOpen && (
                <div className="absolute top-full left-0 mt-2 w-80 bg-white dark:bg-[#0f172a] rounded-2xl shadow-xl border border-slate-200 dark:border-white/10 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="grid grid-cols-1 gap-1">
                    {standaloneTools.map((tool) => (
                      <Link
                        key={tool.href}
                        href={tool.href}
                        onClick={() => setToolsOpen(false)}
                        className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group"
                      >
                        <div className="p-2 rounded-lg bg-pink-50 dark:bg-purple-500/10 text-pink-600 dark:text-purple-400 group-hover:scale-110 transition-transform">
                          <tool.icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-xs font-bold text-slate-800 dark:text-white flex items-center gap-1.5">
                            {tool.name}
                          </div>
                          <div className="text-[11px] text-slate-500 dark:text-zinc-400 line-clamp-1">
                            {tool.desc}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Link 
              href="/sorteos/nuevo" 
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-slate-700 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100/70 dark:hover:bg-white/5 transition-colors"
            >
              <Sparkles className="w-4 h-4 text-pink-600 dark:text-pink-400" />
              <span>{t('nav_social_draws')}</span>
              <span className="ml-1 text-[10px] font-mono font-bold bg-pink-100 dark:bg-pink-950/60 text-pink-600 dark:text-pink-400 px-1.5 py-0.5 rounded-full">
                {t('nav_new_badge')}
              </span>
            </Link>

            <Link 
              href="/verificar" 
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-slate-700 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100/70 dark:hover:bg-white/5 transition-colors"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>{t('nav_verify_cert')}</span>
            </Link>

            <Link 
              href="/planes" 
              className="px-3 py-2 text-sm font-semibold text-slate-700 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100/70 dark:hover:bg-white/5 transition-colors"
            >
              {t('nav_pricing')}
            </Link>

            <Link 
              href="/blog" 
              className="px-3 py-2 text-sm font-semibold text-slate-700 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100/70 dark:hover:bg-white/5 transition-colors"
            >
              {t('nav_help')}
            </Link>
          </nav>

          {/* Right Actions */}
          <div className="hidden lg:flex items-center gap-2.5">
            {/* Theme Toggle Button */}
            <ThemeToggle />

            {/* Language Selector Dropdown */}
            <LanguageSelector />

            {isLoggedIn ? (
              <div className="relative" ref={dropdownRef}>
                {/* User Profile Chip Button */}
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 p-1.5 pr-3 rounded-2xl border border-slate-200 dark:border-white/10 bg-slate-50/80 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 transition-all cursor-pointer shadow-xs group"
                >
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center text-white text-xs font-black shadow-xs shrink-0">
                    {getInitials(userProfile?.name, userProfile?.email)}
                  </div>
                  <div className="text-left hidden xl:block">
                    <div className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1 max-w-[130px]">
                      {userProfile?.name || 'Mi Cuenta'}
                    </div>
                    <div className="text-[10px] font-mono text-slate-500 dark:text-zinc-400 line-clamp-1 max-w-[130px]">
                      {userProfile?.email || 'Sesión Activa'}
                    </div>
                  </div>
                  <span className="px-1.5 py-0.5 rounded-md bg-pink-100 dark:bg-purple-500/20 text-pink-700 dark:text-purple-300 text-[9px] font-mono font-black">
                    {planLabel}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 text-slate-400 dark:text-zinc-500 transition-transform duration-200 ${userDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* User Dropdown Menu */}
                {userDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-72 bg-white dark:bg-[#0f172a] rounded-2xl shadow-xl border border-slate-200 dark:border-white/10 p-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150 space-y-2">
                    {/* User Info Header */}
                    <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 space-y-1">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center text-white text-xs font-black shadow-sm">
                          {getInitials(userProfile?.name, userProfile?.email)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                            {userProfile?.name || 'Usuario'}
                          </p>
                          <p className="text-[11px] font-mono text-slate-500 dark:text-zinc-400 truncate">
                            {userProfile?.email || 'usuario@sorteos.pro'}
                          </p>
                        </div>
                      </div>
                      <div className="pt-1.5 flex items-center justify-between text-[10px] font-mono border-t border-slate-200/50 dark:border-white/5">
                        <span className="text-slate-500 dark:text-zinc-400">Plan:</span>
                        <span className="font-bold text-pink-600 dark:text-purple-400 uppercase">
                          Plan {userProfile?.plan || 'pro'}
                        </span>
                      </div>
                    </div>

                    {/* Navigation Items */}
                    <div className="space-y-0.5">
                      <Link
                        href="/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-zinc-200 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4 text-pink-600 dark:text-purple-400" />
                        <span>{t('nav_dashboard')}</span>
                      </Link>

                      <Link
                        href="/sorteos/nuevo"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-zinc-200 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                      >
                        <Sparkles className="w-4 h-4 text-pink-600 dark:text-purple-400" />
                        <span>Crear Sorteo</span>
                      </Link>

                      <Link
                        href="/planes"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-zinc-200 hover:bg-slate-100 dark:hover:bg-white/5 transition-colors"
                      >
                        <CreditCard className="w-4 h-4 text-slate-400 dark:text-zinc-500" />
                        <span>Planes y Facturación</span>
                      </Link>
                    </div>

                    {/* Logout Button */}
                    <div className="pt-1 border-t border-slate-100 dark:border-white/5">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors cursor-pointer text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>{t('nav_logout')}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="btn-pro-primary text-xs sm:text-sm font-bold px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl flex items-center gap-2 shadow-sm transition-all"
              >
                <LogIn className="w-4 h-4" />
                <span>{t('nav_login') || 'Ingresar'}</span>
              </Link>
            )}
          </div>

          {/* Mobile hamburger button */}
          <div className="lg:hidden flex items-center gap-2">
            <LanguageSelector />
            <ThemeToggle />
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white focus:outline-none cursor-pointer"
              aria-label="Abrir menú"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-[#0b0f19] border-t border-slate-200 dark:border-white/10 px-4 pt-3 pb-6 space-y-4 shadow-lg animate-in slide-in-from-top-2 duration-200">
          {/* User Card on Mobile */}
          {isLoggedIn && userProfile && (
            <div className="p-3 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-pink-500 to-purple-600 flex items-center justify-center text-white text-xs font-black shadow-xs shrink-0">
                  {getInitials(userProfile.name, userProfile.email)}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate">{userProfile.name}</p>
                  <p className="text-[10px] font-mono text-slate-500 dark:text-zinc-400 truncate">{userProfile.email}</p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-md bg-pink-100 dark:bg-purple-500/20 text-pink-700 dark:text-purple-300 text-[10px] font-mono font-bold uppercase shrink-0">
                {userProfile.plan || 'pro'}
              </span>
            </div>
          )}

          <div className="space-y-1">
            <p className="px-3 text-[11px] font-mono uppercase tracking-wider text-pink-600 dark:text-pink-400 font-bold">{t('nav_apps')}</p>
            <div className="grid grid-cols-2 gap-2 pt-1">
              {standaloneTools.map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2.5 rounded-xl bg-slate-50 dark:bg-white/5 text-xs font-semibold text-slate-700 dark:text-zinc-200 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
                >
                  {tool.name}
                </Link>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200 dark:border-white/10 flex flex-col gap-2">
            <Link
              href="/sorteos/nuevo"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-sm font-semibold text-slate-800 dark:text-white hover:text-pink-600 dark:hover:text-pink-400"
            >
              <Sparkles className="w-4 h-4 text-pink-600 dark:text-pink-400" />
              <span>{t('nav_social_draws')}</span>
            </Link>
            <Link
              href="/planes"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-sm font-semibold text-slate-700 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white"
            >
              {t('nav_pricing')}
            </Link>
            <Link
              href="/blog"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 text-sm font-semibold text-slate-700 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white"
            >
              {t('nav_help')}
            </Link>

            {isLoggedIn ? (
              <div className="flex flex-col gap-2 pt-2 border-t border-slate-200 dark:border-white/10">
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-pro-primary text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 text-white"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>{t('nav_dashboard')}</span>
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{t('nav_logout')}</span>
                </button>
              </div>
            ) : (
              <div className="pt-2 border-t border-slate-200 dark:border-white/10">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-pro-primary w-full text-center py-2.5 rounded-xl font-bold text-xs text-white shadow-md flex items-center justify-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  <span>{t('nav_login') || 'Ingresar'}</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
