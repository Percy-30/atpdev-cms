"use client";

import { Lock, ArrowRight, ShieldCheck, User } from "lucide-react";
import { useFormState, useFormStatus } from "react-dom";
import { loginAction } from "./actions";
import { useState } from "react";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button 
      type="submit" 
      disabled={pending}
      className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-lg transition-colors disabled:opacity-70 mt-6 shadow-lg shadow-blue-900/20"
    >
      {pending ? "Verificando..." : "Acceder al Panel"}
      {!pending && <ArrowRight size={18} />}
    </button>
  );
}

export default function LoginPage() {
  const [error, setError] = useState("");

  async function clientAction(formData: FormData) {
    const res = await loginAction(formData);
    if (res?.error) {
      setError(res.error);
    }
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#050505] relative overflow-hidden">
      {/* Background Blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="w-full max-w-md p-8 bg-[#121212]/80 backdrop-blur-xl border border-gray-800 rounded-2xl shadow-2xl z-10 mx-4">
        
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(37,99,235,0.15)]">
            <ShieldCheck className="text-blue-500" size={32} />
          </div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">ATP DEV</h1>
          <p className="text-gray-400 text-sm mt-1">Ingresa tu credencial para acceder al CMS.</p>
        </div>

        <form action={clientAction}>
          <div className="space-y-4 relative">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Usuario</label>
              <div className="relative flex items-center">
                <User className="absolute left-3 text-gray-500" size={18} />
                <input 
                  type="text" 
                  name="username"
                  required
                  className="w-full bg-[#0a0a0a] border border-gray-800 text-white pl-10 pr-4 py-3 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all placeholder:text-gray-700" 
                  placeholder="admin" 
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Contraseña Maestra</label>
              <div className="relative flex items-center">
                <Lock className="absolute left-3 text-gray-500" size={18} />
                <input 
                  type="password" 
                  name="password"
                  required
                  className="w-full bg-[#0a0a0a] border border-gray-800 text-white pl-10 pr-4 py-3 rounded-lg focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all placeholder:text-gray-700" 
                  placeholder="••••••••••••" 
                />
              </div>
            </div>

            {error && (
              <p className="text-red-400 text-xs mt-2 font-medium bg-red-500/10 py-1.5 px-3 rounded border border-red-500/20">
                {error}
              </p>
            )}
          </div>
          
          <SubmitButton />
        </form>

      </div>
    </div>
  );
}
