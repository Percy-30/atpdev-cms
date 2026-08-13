"use client";

import { Home, User, Briefcase, Code, Mail, Menu, X, Globe, Users, MessageCircle } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { name: "Inicio", href: "#hero", icon: Home },
    { name: "Sobre Mí", href: "#about", icon: User },
    { name: "Portafolio", href: "#portfolio", icon: Code },
    { name: "Experiencia", href: "#experience", icon: Briefcase },
    { name: "Contacto", href: "#contact", icon: Mail },
  ];

  const handleNavClick = () => setIsOpen(false);

  return (
    <>
      {/* Mobile Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 right-4 z-50 p-2 bg-blue-600 text-white rounded-full shadow-lg"
        aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar Fijo */}
      <aside 
        className={`fixed inset-y-0 left-0 z-40 w-72 bg-[#040b14] text-white transition-transform duration-300 ease-in-out flex flex-col
          ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        {/* Perfil */}
        <div className="flex flex-col items-center justify-center p-8 mt-4">
          <div className="w-32 h-32 rounded-full bg-gray-700 border-4 border-gray-600 mb-4 overflow-hidden">
            {/* Foto de perfil placeholder */}
            <Image 
              src="https://avatars.githubusercontent.com/u/1234567?v=4" 
              alt="ATP DEV" 
              width={128}
              height={128}
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="text-2xl font-bold mb-2">ATP DEV</h1>
          <p className="text-gray-400 text-sm mb-6 text-center">Software Developer & App Creator</p>
          
          {/* Social Links */}
          <div className="flex space-x-3">
            <a href="#" className="p-2 bg-[#212431] rounded-full hover:bg-blue-500 transition-colors" aria-label="Sitio web">
              <Globe size={18} />
            </a>
            <a href="#" className="p-2 bg-[#212431] rounded-full hover:bg-blue-500 transition-colors" aria-label="Comunidad">
              <Users size={18} />
            </a>
            <a href="#" className="p-2 bg-[#212431] rounded-full hover:bg-blue-500 transition-colors" aria-label="Contacto">
              <MessageCircle size={18} />
            </a>
          </div>
        </div>

        {/* Navegación */}
        <nav className="flex-1 px-6 py-4 overflow-y-auto mt-4">
          <ul className="space-y-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.name}>
                  <Link 
                    href={item.href}
                    onClick={handleNavClick}
                    className="flex items-center space-x-3 text-gray-400 hover:text-white hover:bg-gray-800/50 p-3 rounded-lg transition-all group"
                  >
                    <Icon size={20} className="group-hover:text-blue-400" />
                    <span>{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer del Sidebar */}
        <div className="p-6 text-center text-sm text-gray-500 border-t border-gray-800">
          <p>&copy; {new Date().getFullYear()} <strong>ATP DEV</strong></p>
          <p className="mt-1">Diseñado para alto impacto.</p>
        </div>
      </aside>
      
      {/* Overlay para móvil */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
