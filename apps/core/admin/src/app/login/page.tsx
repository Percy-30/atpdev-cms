import { login } from './actions'
import { LockKeyhole } from 'lucide-react'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#050608] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#12141a] border border-gray-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-blue-600/20 blur-[80px] pointer-events-none"></div>
        
        <div className="relative z-10">
          <div className="w-16 h-16 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6 text-blue-500">
            <LockKeyhole size={32} />
          </div>
          
          <h1 className="text-3xl font-black text-center text-white mb-2">ATP Admin</h1>
          <p className="text-gray-400 text-center text-sm mb-8">
            Ingresa tus credenciales para acceder al panel de control.
          </p>

          <form className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-sm font-semibold text-gray-400 uppercase tracking-widest">
                Email
              </label>
              <input 
                id="email" 
                name="email" 
                type="email" 
                required 
                className="bg-[#0b0c10] border border-gray-800 text-white px-5 py-4 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                placeholder="admin@atpdev.dev"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label htmlFor="password" className="text-sm font-semibold text-gray-400 uppercase tracking-widest">
                Contraseña
              </label>
              <input 
                id="password" 
                name="password" 
                type="password" 
                required 
                className="bg-[#0b0c10] border border-gray-800 text-white px-5 py-4 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                placeholder="••••••••"
              />
            </div>
            
            <button 
              formAction={login}
              className="mt-4 w-full bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)]"
            >
              Iniciar Sesión
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
