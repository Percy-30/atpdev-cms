"use client";

import { Trash2 } from "lucide-react";
import { useFormStatus } from "react-dom";

export function DeleteButton() {
  const { pending } = useFormStatus();

  return (
    <button 
      type="submit" 
      disabled={pending}
      onClick={(e) => {
        if (!confirm('¿Estás seguro de que deseas eliminar este proyecto? Esta acción no se puede deshacer.')) {
          e.preventDefault();
        }
      }}
      className="text-gray-500 hover:text-red-500 bg-[#0a0a0a] hover:bg-red-500/10 p-2 rounded-lg transition-colors border border-gray-800 hover:border-red-500/50 disabled:opacity-50"
    >
      <Trash2 size={14} />
    </button>
  );
}
