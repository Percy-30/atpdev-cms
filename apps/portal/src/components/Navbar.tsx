"use client";

import Link from "next/link";
import { Terminal } from "lucide-react";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { translateClient } from "@/utils/translate";

export default function Navbar() {
  const params = useParams();
  const lang = params?.lang as string || 'es';

  const [tProyectos, setTProyectos] = useState("Proyectos");
  const [tSobreMi, setTSobreMi] = useState("Sobre Mí");
  const [tContacto, setTContacto] = useState("Contacto");

  useEffect(() => {
    if (lang !== 'es') {
      translateClient("Proyectos", lang).then(setTProyectos);
      translateClient("Sobre Mí", lang).then(setTSobreMi);
      translateClient("Contacto", lang).then(setTContacto);
    }
  }, [lang]);

  const linkPrefix = lang === 'es' ? '' : `/${lang}`;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between bg-gray-900/80 backdrop-blur-md border-b border-gray-800">
      <Link href={`${linkPrefix}/`} className="flex items-center gap-2 text-white font-bold text-xl hover:opacity-80 transition-opacity">
        <Terminal className="text-blue-500" size={24} />
        <span>ATP DEV</span>
      </Link>

      <div className="hidden md:flex items-center gap-8">
        <Link href={`${linkPrefix}/#portfolio`} className="text-gray-300 hover:text-white text-sm font-medium transition-colors hover:border-b-2 border-blue-500 pb-1">
          {tProyectos}
        </Link>
        <Link href={`${linkPrefix}/#about`} className="text-gray-300 hover:text-white text-sm font-medium transition-colors hover:border-b-2 border-blue-500 pb-1">
          {tSobreMi}
        </Link>
        <Link href={`${linkPrefix}/#contact`} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full text-sm font-medium transition-all shadow-md shadow-blue-900/50">
          {tContacto}
        </Link>
      </div>

      {/* Mobile Menu Button - Minimalist for now */}
      <button className="md:hidden text-gray-300 hover:text-white p-2">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>
      </button>
    </nav>
  );
}
