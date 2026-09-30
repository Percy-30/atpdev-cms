"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Disc, 
  ListOrdered, 
  Dices, 
  CircleDollarSign, 
  Hash, 
  Users2,
  Gift
} from 'lucide-react';

import { useLanguage } from '@/context/LanguageContext';
import { TranslationKey } from '@/lib/translations';

interface ToolItem {
  key: TranslationKey;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const TOOLS: ToolItem[] = [
  { key: 'tool_names', href: '/herramientas/lista', icon: ListOrdered },
  { key: 'tool_roulette', href: '/herramientas/ruleta', icon: Disc },
  { key: 'tool_dice', href: '/herramientas/dados', icon: Dices },
  { key: 'tool_coin', href: '/herramientas/moneda', icon: CircleDollarSign },
  { key: 'tool_numbers', href: '/herramientas/numeros', icon: Hash },
  { key: 'tool_teams', href: '/herramientas/equipos', icon: Users2 },
  { key: 'tool_secret_santa', href: '/herramientas/amigo-invisible', icon: Gift },
];

export const ToolSwitcher: React.FC = () => {
  const pathname = usePathname();
  const { t } = useLanguage();

  return (
    <div className="w-full overflow-x-auto scrollbar-none py-2 px-2 sm:px-4">
      <div className="flex min-w-full justify-start md:justify-center p-1">
        <nav 
          aria-label="Herramientas de sorteo"
          className="inline-flex items-center gap-1 sm:gap-1.5 p-1 sm:p-1.5 rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 shadow-xs shrink-0"
        >
          {TOOLS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`tool-switcher-pill shrink-0 ${isActive ? 'active' : ''}`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-pink-600 dark:text-white' : 'text-slate-400 dark:text-zinc-500'}`} />
                <span>{t(item.key)}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default ToolSwitcher;
