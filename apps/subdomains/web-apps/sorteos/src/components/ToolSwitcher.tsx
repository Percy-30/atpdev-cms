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

const TOOLS = [
  { name: 'Nombres', href: '/herramientas/lista', icon: ListOrdered },
  { name: 'Ruleta', href: '/herramientas/ruleta', icon: Disc },
  { name: 'Dados 3D', href: '/herramientas/dados', icon: Dices },
  { name: 'Moneda', href: '/herramientas/moneda', icon: CircleDollarSign },
  { name: 'Números', href: '/herramientas/numeros', icon: Hash },
  { name: 'Equipos', href: '/herramientas/equipos', icon: Users2 },
  { name: 'Amigo Invisible', href: '/herramientas/amigo-invisible', icon: Gift },
];

export const ToolSwitcher: React.FC = () => {
  const pathname = usePathname();

  return (
    <div className="w-full overflow-x-auto scrollbar-none py-2 px-2 sm:px-4">
      <div className="flex min-w-full justify-start md:justify-center p-1">
        <nav 
          aria-label="Herramientas de sorteo"
          className="inline-flex items-center gap-1 sm:gap-1.5 p-1 sm:p-1.5 rounded-2xl bg-white dark:bg-[#0f172a] border border-slate-200 dark:border-white/10 shadow-xs shrink-0"
        >
          {TOOLS.map((t) => {
            const Icon = t.icon;
            const isActive = pathname === t.href;
            return (
              <Link
                key={t.href}
                href={t.href}
                className={`tool-switcher-pill shrink-0 ${isActive ? 'active' : ''}`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-pink-600 dark:text-white' : 'text-slate-400 dark:text-zinc-500'}`} />
                <span>{t.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default ToolSwitcher;
