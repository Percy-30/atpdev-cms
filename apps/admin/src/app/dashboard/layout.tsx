"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { 
  LayoutDashboard, 
  Users, 
  FolderKanban, 
  Settings, 
  LogOut, 
  BrainCircuit, 
  BarChart3, 
  Search, 
  Bell,
  Code2,
  X,
  Menu,
  User2
} from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notifOpen, setNotifOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/login");
  };

  // Close dropdowns on click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Auto-focus search input
  useEffect(() => {
    if (searchOpen && searchRef.current) searchRef.current.focus();
  }, [searchOpen]);

  // Keyboard shortcut Ctrl+K for search
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(prev => !prev);
      }
      if (e.key === "Escape") {
        setSearchOpen(false);
        setNotifOpen(false);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  const navItems = [
    { label: "Overview",   icon: <LayoutDashboard size={18} />, href: "/dashboard" },
    { label: "Projects",   icon: <FolderKanban size={18} />,    href: "/dashboard/projects" },
    { label: "AI Models",  icon: <BrainCircuit size={18} />,    href: "/dashboard/ai-models" },
    { label: "Leads (CRM)",icon: <Users size={18} />,           href: "/dashboard/leads" },
    { label: "Analytics",  icon: <BarChart3 size={18} />,       href: "/dashboard/analytics" },
    { label: "Perfil Pro.",icon: <User2 size={18} />,           href: "/dashboard/profile" },
    { label: "Settings",   icon: <Settings size={18} />,        href: "/dashboard/settings" },
  ];

  // Filter nav items by search
  const filteredNav = searchQuery
    ? navItems.filter(item => item.label.toLowerCase().includes(searchQuery.toLowerCase()))
    : [];

  const handleSearchNavigate = (href: string) => {
    router.push(href);
    setSearchOpen(false);
    setSearchQuery("");
  };

  const notifications = [
    { id: 1, text: "Nuevo lead recibido desde el portal", time: "Hace 2 min", read: false },
    { id: 2, text: "Proyecto 'Lector QR' actualizado", time: "Hace 1 hora", read: false },
    { id: 3, text: "Build exitoso en Vercel", time: "Hace 3 horas", read: true },
    { id: 4, text: "Backup de base de datos completado", time: "Ayer", read: true },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="h-screen bg-\[\#1A1A1A\] text-gray-200 flex font-sans overflow-hidden">
      
      {/* SEARCH OVERLAY (Command Palette Style) */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-[15vh]" onClick={() => setSearchOpen(false)}>
          <div className="w-full max-w-lg bg-\[\#262626\] border border-gray-700 rounded-2xl shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-800">
              <Search size={18} className="text-gray-400" />
              <input 
                ref={searchRef}
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent text-white text-sm outline-none placeholder-gray-500"
                placeholder="Buscar páginas, acciones..."
              />
              <kbd className="text-[10px] font-bold text-gray-500 bg-gray-800 px-2 py-0.5 rounded border border-gray-700">ESC</kbd>
            </div>
            <div className="max-h-64 overflow-y-auto">
              {searchQuery === "" ? (
                <div className="p-4">
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Navegación Rápida</p>
                  {navItems.map(item => (
                    <button 
                      key={item.href}
                      onClick={() => handleSearchNavigate(item.href)}
                      className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-gray-300 hover:bg-blue-600/10 hover:text-blue-400 transition-colors font-medium"
                    >
                      {item.icon} {item.label}
                    </button>
                  ))}
                </div>
              ) : filteredNav.length > 0 ? (
                <div className="p-4">
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Resultados</p>
                  {filteredNav.map(item => (
                    <button 
                      key={item.href}
                      onClick={() => handleSearchNavigate(item.href)}
                      className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-gray-300 hover:bg-blue-600/10 hover:text-blue-400 transition-colors font-medium"
                    >
                      {item.icon} {item.label}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center">
                  <p className="text-sm text-gray-500">No se encontraron resultados para &quot;{searchQuery}&quot;</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SIDEBAR */}
      <aside className={`w-64 bg-\[\#262626\] border-r border-gray-800 flex-col h-full shrink-0 relative ${mobileMenuOpen ? 'flex fixed z-40 top-0 left-0' : 'hidden md:flex'}`}>
        
        {/* Top Header Logo */}
        <div className="h-16 px-6 border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-white rounded-md flex items-center justify-center">
              <Code2 size={16} className="text-black" />
            </div>
            <span className="font-bold text-white text-sm tracking-wide">ATP DEV</span>
          </div>
          {/* Mobile close */}
          <button className="md:hidden text-gray-400 hover:text-white" onClick={() => setMobileMenuOpen(false)}>
            <X size={20} />
          </button>
        </div>

        {/* User Profile Info */}
        <div className="p-6 pb-2">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-blue-600 border border-gray-700 overflow-hidden shrink-0">
              <img src="/avatar.png" alt="Avatar" className="w-full h-full object-cover" />
            </div>
            <div>
              <p className="font-bold text-white text-sm">Percy (ATP DEV)</p>
              <p className="text-xs text-gray-500 font-medium">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all font-semibold text-sm ${
                  isActive
                    ? "bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.3)]"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Widgets */}
        <div className="p-6">
          <div className="bg-\[\#1A1A1A\] border border-gray-800 rounded-xl p-4 mb-4">
            <p className="text-[10px] font-bold text-gray-500 mb-2 uppercase tracking-widest">Quota Usage</p>
            <div className="w-full h-1.5 bg-gray-800 rounded-full mb-2 overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full w-[65%]"></div>
            </div>
            <p className="text-[10px] text-gray-400">65% of monthly tokens used.</p>
          </div>

          <div className="flex items-center justify-between px-2 mb-2">
            <div className="flex gap-3 text-[10px] text-gray-500 font-semibold">
              <a href="https://github.com/percydev" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GitHub</a>
              <a href="https://linkedin.com/in/percy-acha" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">LinkedIn</a>
              <a href="https://x.com/atpdev" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Twitter</a>
            </div>
          </div>
          
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2 mt-4 w-full text-left rounded-xl transition-all font-medium text-xs text-gray-400 hover:text-rose-400 hover:bg-rose-500/10"
          >
            <LogOut size={16} />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setMobileMenuOpen(false)}></div>
      )}

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* TOP BAR */}
        <header className="h-16 bg-\[\#1A1A1A\] border-b border-gray-800 flex items-center justify-between px-6 shrink-0 z-10">
          <div className="flex items-center gap-4">
            {/* Mobile hamburger */}
            <button className="md:hidden text-gray-400 hover:text-white" onClick={() => setMobileMenuOpen(true)}>
              <Menu size={20} />
            </button>
            {/* Search trigger */}
            <button 
              onClick={() => setSearchOpen(true)}
              className="hidden md:flex items-center gap-3 bg-\[\#262626\] border border-gray-800 rounded-lg px-4 py-2 text-sm text-gray-500 hover:border-gray-600 transition-colors w-64"
            >
              <Search size={14} />
              <span>Buscar...</span>
              <kbd className="ml-auto text-[10px] font-bold text-gray-600 bg-gray-800 px-1.5 py-0.5 rounded border border-gray-700">⌘K</kbd>
            </button>
          </div>

          <div className="flex items-center gap-5">
            {/* Mobile search */}
            <button className="md:hidden text-gray-400 hover:text-white transition-colors" onClick={() => setSearchOpen(true)}>
              <Search size={18} />
            </button>
            
            {/* Notifications */}
            <div className="relative" ref={notifRef}>
              <button 
                className="text-gray-400 hover:text-white transition-colors relative"
                onClick={() => setNotifOpen(!notifOpen)}
              >
                <Bell size={18} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 bg-blue-500 rounded-full border-2 border-[#0b0c10] text-[9px] font-bold text-white flex items-center justify-center px-0.5">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {notifOpen && (
                <div className="absolute right-0 top-12 w-80 bg-\[\#262626\] border border-gray-800 rounded-2xl shadow-2xl overflow-hidden z-50">
                  <div className="px-5 py-4 border-b border-gray-800 flex justify-between items-center">
                    <h3 className="text-sm font-bold text-white">Notificaciones</h3>
                    <span className="text-[10px] font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full">{unreadCount} nuevas</span>
                  </div>
                  <div className="max-h-72 overflow-y-auto">
                    {notifications.map(n => (
                      <div 
                        key={n.id} 
                        className={`px-5 py-3.5 border-b border-gray-800/50 hover:bg-white/5 transition-colors cursor-pointer ${!n.read ? 'bg-blue-500/5' : ''}`}
                      >
                        <div className="flex items-start gap-3">
                          {!n.read && <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 shrink-0"></div>}
                          <div className={!n.read ? '' : 'pl-5'}>
                            <p className="text-sm text-gray-300">{n.text}</p>
                            <p className="text-[10px] text-gray-500 mt-1">{n.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Link href="/dashboard/leads" onClick={() => setNotifOpen(false)} className="block px-5 py-3 text-center text-xs font-bold text-blue-400 hover:bg-white/5 transition-colors border-t border-gray-800">
                    Ver todas las notificaciones →
                  </Link>
                </div>
              )}
            </div>

            {/* Avatar */}
            <Link href="/dashboard/settings">
              <div className="w-8 h-8 rounded-full bg-blue-600 border-2 border-blue-600 overflow-hidden cursor-pointer shadow-[0_0_10px_rgba(37,99,235,0.4)] hover:shadow-[0_0_20px_rgba(37,99,235,0.6)] transition-shadow">
                <img src="/avatar.png" alt="Avatar" className="w-full h-full object-cover" />
              </div>
            </Link>
          </div>
        </header>

        {/* SCROLLABLE PAGE CONTENT */}
        <main className="flex-1 overflow-y-auto bg-\[\#1A1A1A\] p-6 md:p-8">
          <div className="max-w-[1400px] mx-auto">
            {children}
          </div>
        </main>

      </div>
    </div>
  );
}
