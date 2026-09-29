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
    <div className="w-full flex items-center justify-center overflow-x-auto py-1 px-2 scrollbar-none">
      <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
        {TOOLS.map((t) => {
          const Icon = t.icon;
          const isActive = pathname === t.href;
          return (
            <Link
              key={t.href}
              href={t.href}
              className={`tool-switcher-pill ${isActive ? 'active' : ''}`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-pink-600' : 'text-slate-400'}`} />
              <span>{t.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default ToolSwitcher;
