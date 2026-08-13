"use client";

import { useFormStatus } from "react-dom";
import { Save, Loader2, CheckCircle2 } from "lucide-react";
import { useEffect, useState, useRef } from "react";

export function SubmitButton() {
  const { pending } = useFormStatus();
  const [justSaved, setJustSaved] = useState(false);
  const wasPending = useRef(pending);

  useEffect(() => {
    if (wasPending.current && !pending) {
      setJustSaved(true);
      const timer = setTimeout(() => setJustSaved(false), 3000);
      return () => clearTimeout(timer);
    }
    wasPending.current = pending;
  }, [pending]);

  return (
    <button 
      type="submit" 
      disabled={pending}
      className={`flex items-center gap-2 font-bold px-8 py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)] text-sm 
        ${justSaved ? 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.4)]' : 'bg-blue-600 text-white hover:bg-blue-500 hover:shadow-[0_0_30px_rgba(37,99,235,0.6)]'}
        ${pending ? 'opacity-70 cursor-not-allowed' : ''}
      `}
    >
      {pending ? (
        <><Loader2 size={18} className="animate-spin" /> Guardando Cambios...</>
      ) : justSaved ? (
        <><CheckCircle2 size={18} /> ¡Cambios Guardados!</>
      ) : (
        <><Save size={18} /> Guardar Todos los Cambios</>
      )}
    </button>
  );
}
