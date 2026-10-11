"use client";

import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export const ThemeToggle: React.FC<{ className?: string }> = ({ className = '' }) => {
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('dark');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check initial preference from localStorage or document class
    const serverTheme = document.documentElement.getAttribute('data-server-theme') as 'light' | 'dark' | null;
    const isDocDark = document.documentElement.classList.contains('dark');
    const saved = localStorage.getItem('sorteos_theme') as 'light' | 'dark' | null;
    const initial = saved === 'light' || saved === 'dark' ? saved : (serverTheme || (isDocDark ? 'dark' : 'light'));
    setThemeMode(initial);
    applyTheme(initial);

    // Listen to theme changes from other tabs or iframe
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'sorteos_theme' && (e.newValue === 'light' || e.newValue === 'dark')) {
        setThemeMode(e.newValue);
        applyTheme(e.newValue);
      }
    };

    // Listen to custom event from SorteosThemeListener
    const handleCustomChange = (e: Event) => {
      const customEvent = e as CustomEvent<'light' | 'dark'>;
      if (customEvent.detail === 'light' || customEvent.detail === 'dark') {
        setThemeMode(customEvent.detail);
        applyTheme(customEvent.detail);
      }
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener('sorteos_theme_mode_change', handleCustomChange);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('sorteos_theme_mode_change', handleCustomChange);
    };
  }, []);

  const applyTheme = (mode: 'light' | 'dark') => {
    if (mode === 'light') {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
      document.body?.classList.add('light');
      document.body?.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
      document.body?.classList.add('dark');
      document.body?.classList.remove('light');
    }
  };

  const toggleTheme = () => {
    const next = themeMode === 'dark' ? 'light' : 'dark';
    setThemeMode(next);
    applyTheme(next);
    try {
      localStorage.setItem('sorteos_theme', next);
      localStorage.setItem('sorteos_server_theme', next);
    } catch {}

    // Dispatch custom event for listener & other components
    window.dispatchEvent(new CustomEvent('sorteos_theme_mode_change', { detail: next }));

    // Notify other tabs via BroadcastChannel
    try {
      const bc = new BroadcastChannel('sorteos_theme_channel');
      bc.postMessage({ type: 'UPDATE_SORTEOS_THEME', payload: { theme_mode: next } });
      bc.close();
    } catch {}

    // Notify parent admin frame if loaded inside Theme Studio
    if (typeof window !== 'undefined' && window.parent && window.parent !== window) {
      window.parent.postMessage({ type: 'SORTEOS_THEME_MODE_CHANGED', mode: next }, '*');
    }
  };

  if (!mounted) {
    return (
      <div className={`w-9 h-9 rounded-xl bg-slate-100 dark:bg-white/5 animate-pulse ${className}`} />
    );
  }

  const isLight = themeMode === 'light';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      title={isLight ? 'Cambiar a Modo Oscuro' : 'Cambiar a Modo Claro'}
      aria-label={isLight ? 'Cambiar a Modo Oscuro' : 'Cambiar a Modo Claro'}
      className={`relative group p-2 rounded-xl border transition-all duration-300 flex items-center justify-center cursor-pointer shadow-xs active:scale-95 ${
        isLight
          ? 'bg-slate-100 hover:bg-slate-200 border-slate-300 text-amber-600 hover:text-amber-700 shadow-slate-200/50'
          : 'bg-white/5 hover:bg-white/10 border-white/10 text-pink-400 hover:text-pink-300 hover:border-pink-500/30 shadow-black/40'
      } ${className}`}
    >
      <div className="relative w-4 h-4 flex items-center justify-center">
        {isLight ? (
          <Sun size={16} className="transition-transform duration-300 rotate-0 scale-100 animate-in fade-in zoom-in" />
        ) : (
          <Moon size={16} className="transition-transform duration-300 -rotate-12 scale-100 animate-in fade-in zoom-in" />
        )}
      </div>
      <span className="sr-only">
        {isLight ? 'Modo Oscuro' : 'Modo Claro'}
      </span>
    </button>
  );
};

export default ThemeToggle;
