"use client";

import Link from "next/link";
import { Terminal, X, Menu } from "lucide-react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { translateClient } from "@/utils/translate";

export default function Navbar() {
  const params = useParams();
  const lang = params?.lang as string || 'es';

  const [isOpen, setIsOpen] = useState(false);

  const [tProyectos, setTProyectos] = useState("Proyectos");
  const [tSobreMi, setTSobreMi] = useState("Sobre Mí");
  const [tContacto, setTContacto] = useState("Contacto");
  const [tExperiencia, setTExperiencia] = useState("Experiencia");

  useEffect(() => {
    if (lang !== 'es') {
      translateClient("Proyectos", lang).then(setTProyectos);
      translateClient("Sobre Mí", lang).then(setTSobreMi);
      translateClient("Contacto", lang).then(setTContacto);
      translateClient("Experiencia", lang).then(setTExperiencia);
    }
  }, [lang]);

  const linkPrefix = lang === 'es' ? '' : `/${lang}`;

  const links = [
    { href: `${linkPrefix}/#portfolio`, label: tProyectos },
    { href: `${linkPrefix}/#about`,     label: tSobreMi },
    { href: `${linkPrefix}/#experience`, label: tExperiencia },
    { href: `${linkPrefix}/#contact`,   label: tContacto },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between bg-gray-900/80 backdrop-blur-md border-b border-gray-800">
        <Link href={`${linkPrefix}/`} className="flex items-center gap-2 text-white font-bold text-xl hover:opacity-80 transition-opacity">
          <Terminal className="text-blue-500" size={24} />
          <span>ATP DEV</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {links.slice(0, 3).map(l => (
            <Link key={l.href} href={l.href} className="text-gray-300 hover:text-white text-sm font-medium transition-colors hover:border-b-2 border-blue-500 pb-1">
              {l.label}
            </Link>
          ))}
          <Link href={`${linkPrefix}/#contact`} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full text-sm font-medium transition-all shadow-md shadow-blue-900/50">
            {tContacto}
          </Link>
        </div>

        {/* Mobile hamburger button */}
        <button
          className="md:hidden text-gray-300 hover:text-white p-2 rounded-lg hover:bg-gray-800 transition-colors"
          onClick={() => setIsOpen(o => !o)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile dropdown overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-40 md:hidden" onClick={() => setIsOpen(false)}>
          <div
            className="absolute top-[73px] left-0 right-0 bg-gray-900/98 backdrop-blur-xl border-b border-gray-800 px-6 py-6 flex flex-col gap-1 shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            {links.map(l => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setIsOpen(false)}
                className="text-gray-200 hover:text-white hover:bg-blue-600/20 border border-transparent hover:border-blue-500/30 px-4 py-3 rounded-xl text-base font-medium transition-all"
              >
                {l.label}
              </Link>
            ))}
            <div className="mt-4 pt-4 border-t border-gray-800">
              <Link
                href={`${linkPrefix}/#contact`}
                onClick={() => setIsOpen(false)}
                className="w-full flex items-center justify-center bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl text-base font-bold transition-all shadow-lg shadow-blue-900/40"
              >
                {tContacto}
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
