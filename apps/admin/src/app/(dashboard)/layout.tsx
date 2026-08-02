import Link from "next/link";
import { 
  LayoutDashboard, 
  Code2, 
  BrainCircuit, 
  LineChart, 
  Settings, 
  Search, 
  Bell, 
  UserCircle2 
} from "lucide-react";
import LogoutButton from "./LogoutButton";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen overflow-hidden w-full">
        
        {/* Sidebar */}
        <aside className="w-[260px] bg-[#121212] border-r border-gray-800 flex flex-col hidden md:flex shrink-0">
          {/* Logo / Title area */}
          <div className="h-16 flex items-center px-6 gap-3">
            <div className="w-5 h-5 bg-blue-500 rounded-sm"></div>
            <span className="font-bold text-white text-sm tracking-widest">ATP DEV</span>
          </div>

          {/* User Profile Area */}
          <div className="px-4 py-3 mx-4 my-2 mb-6 flex items-center gap-3">
            <img src="https://ui-avatars.com/api/?name=Percy+Acha&background=0D8ABC&color=fff" alt="Profile" className="w-10 h-10 rounded-md object-cover border border-gray-700" />
            <div className="flex flex-col">
              <span className="text-white text-sm font-semibold">Percy (ATP DEV)</span>
              <span className="text-gray-500 text-xs">Admin Panel</span>
            </div>
          </div>
          
          <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
            <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-blue-600 text-white shadow-[0_4px_20px_rgba(37,99,235,0.3)] transition-all">
              <LayoutDashboard size={18} />
              <span className="font-medium text-sm">Overview</span>
            </Link>
            
            <Link href="/projects" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors border border-transparent hover:border-gray-800 border-dashed mt-1">
              <Code2 size={18} />
              <span className="font-medium text-sm">Projects</span>
            </Link>
            
            <Link href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors mt-1">
              <BrainCircuit size={18} />
              <span className="font-medium text-sm">AI Models</span>
            </Link>

            <Link href="#" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors mt-1">
              <LineChart size={18} />
              <span className="font-medium text-sm">Analytics</span>
            </Link>
            
            <Link href="/theme" className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors mt-1">
              <Settings size={18} />
              <span className="font-medium text-sm">Settings</span>
            </Link>
          </nav>
          
          {/* Quota Usage */}
          <div className="p-5 mt-auto border-t border-gray-800/50">
            <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Quota Usage</div>
            <div className="w-full bg-gray-800 rounded-full h-1.5 mb-2 overflow-hidden">
              <div className="bg-gray-400 h-1.5 rounded-full" style={{ width: '65%' }}></div>
            </div>
            <div className="text-[10px] text-gray-500">65% of monthly tokens used.</div>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col h-screen overflow-hidden bg-[#0a0a0a]">
          {/* Top Navbar */}
          <header className="h-16 flex items-center justify-between md:justify-end px-8 shrink-0">
             <div className="md:hidden font-bold text-white flex items-center gap-2">
               <div className="w-5 h-5 bg-blue-500 rounded-sm"></div>
               ATP DEV
             </div>
             <div className="flex items-center gap-6">
                <button className="text-gray-400 hover:text-white transition-colors"><Search size={18} /></button>
                <button className="text-gray-400 hover:text-white transition-colors relative">
                  <Bell size={18} />
                  <span className="absolute -top-1 -right-1 w-2 h-2 bg-blue-500 rounded-full border border-[#0a0a0a]"></span>
                </button>
                <LogoutButton />
             </div>
          </header>
          
          <div className="flex-1 overflow-y-auto px-8 pb-8">
            {children}
            
            {/* Footer Links */}
            <div className="flex justify-end gap-4 mt-12 pt-6 border-t border-gray-800/50 pb-4">
              <a href="#" className="text-xs text-gray-500 hover:text-gray-300">GitHub</a>
              <a href="#" className="text-xs text-gray-500 hover:text-gray-300 underline">LinkedIn</a>
              <a href="#" className="text-xs text-gray-500 hover:text-gray-300">Twitter</a>
              <a href="#" className="text-xs text-gray-500 hover:text-gray-300">Email</a>
            </div>
          </div>
        </main>
        
    </div>
  );
}
