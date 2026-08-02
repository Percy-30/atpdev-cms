"use client";

import { LogOut } from "lucide-react";
import { logoutAction } from "../login/actions";

export default function LogoutButton() {
  return (
    <form action={logoutAction}>
      <button type="submit" title="Cerrar Sesión" className="text-red-500 hover:text-red-400 transition-colors bg-red-500/10 hover:bg-red-500/20 p-2 rounded-lg flex items-center gap-2">
        <LogOut size={18} />
      </button>
    </form>
  );
}
