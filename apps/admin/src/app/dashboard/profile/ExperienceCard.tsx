"use client";

import { useState, useTransition } from "react";
import { Eye, EyeOff, Trash2, Pencil, X, Check, Loader2 } from "lucide-react";
import { Experience } from "@atpdev/database";

const COLOR_TEXT: Record<string, string> = {
  blue: "text-blue-400", purple: "text-purple-400", emerald: "text-emerald-400",
  amber: "text-amber-400", rose: "text-rose-400", green: "text-green-400",
};

const inputClass  = "bg-[#0b0c10] border border-gray-800 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-blue-500 transition-all text-sm w-full";
const selectClass = "bg-[#0b0c10] border border-gray-800 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-blue-500 transition-all text-sm w-full";

type Props = {
  exp: Experience;
  iconOptions: { key: string; label: string }[];
  colorOptions: { key: string; label: string }[];
  editAction:   (fd: FormData) => Promise<void>;
  removeAction: (id: number)  => Promise<void>;
  toggleAction: (id: number, current: boolean) => Promise<void>;
};

export default function ExperienceCard({ exp, iconOptions, colorOptions, editAction, removeAction, toggleAction }: Props) {
  const [editing, setEditing] = useState(false);
  const [isPending, startTransition] = useTransition();
  const colorText = COLOR_TEXT[exp.color_key] || "text-blue-400";

  const handleDelete = () => {
    if (!confirm(`¿Eliminar "${exp.role}"?`)) return;
    startTransition(() => removeAction(exp.id));
  };

  const handleToggle = () => {
    startTransition(() => toggleAction(exp.id, exp.is_active));
  };

  const handleSave = (fd: FormData) => {
    startTransition(async () => {
      await editAction(fd);
      setEditing(false);
    });
  };

  return (
    <div className={`bg-[#12141a] border rounded-2xl overflow-hidden transition-all ${exp.is_active ? "border-gray-800" : "border-gray-800/30 opacity-50"}`}>
      
      {/* ── Header siempre visible ── */}
      <div className="flex items-start gap-3 p-4">
        <div className="flex-1 min-w-0">
          <p className={`text-[10px] font-bold uppercase tracking-widest ${colorText} mb-0.5`}>{exp.date_range}</p>
          <h3 className="text-white font-bold text-sm truncate">{exp.role}</h3>
          <p className={`text-xs ${colorText} font-medium`}>{exp.company}</p>
          {!editing && <p className="text-xs text-gray-500 mt-1 line-clamp-2">{exp.description}</p>}
        </div>

        {/* Botones de acción */}
        <div className="flex gap-1.5 shrink-0">
          {isPending ? (
            <Loader2 size={16} className="animate-spin text-gray-400 mt-2" />
          ) : (
            <>
              <button
                onClick={() => setEditing(!editing)}
                title={editing ? "Cancelar edición" : "Editar"}
                className={`p-1.5 rounded-lg transition-colors ${editing ? "bg-blue-600 text-white" : "bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white"}`}
              >
                {editing ? <X size={14} /> : <Pencil size={14} />}
              </button>
              <button
                onClick={handleToggle}
                title={exp.is_active ? "Ocultar del portal" : "Mostrar en portal"}
                className="p-1.5 bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white rounded-lg transition-colors"
              >
                {exp.is_active ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
              <button
                onClick={handleDelete}
                title="Eliminar"
                className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg transition-colors"
              >
                <Trash2 size={14} />
              </button>
            </>
          )}
        </div>
      </div>

      {/* ── Formulario de edición inline ── */}
      {editing && (
        <form
          action={handleSave}
          className="border-t border-gray-800 bg-[#0b0c10] p-4 space-y-3"
        >
          <input type="hidden" name="id" value={exp.id} />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Cargo / Rol</label>
              <input type="text" name="role" defaultValue={exp.role} required className={inputClass} />
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Empresa</label>
              <input type="text" name="company" defaultValue={exp.company} required className={inputClass} />
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Período</label>
              <input type="text" name="date_range" defaultValue={exp.date_range} required className={inputClass} />
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Orden</label>
              <input type="number" name="sort_order" defaultValue={exp.sort_order} className={inputClass} />
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Ícono</label>
              <select name="icon_key" defaultValue={exp.icon_key} className={selectClass}>
                {iconOptions.map(o => <option key={o.key} value={o.key}>{o.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Color</label>
              <select name="color_key" defaultValue={exp.color_key} className={selectClass}>
                {colorOptions.map(o => <option key={o.key} value={o.key}>{o.label}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Descripción</label>
            <textarea name="description" defaultValue={exp.description} rows={3} required className={inputClass + " resize-none"} />
          </div>

          <div className="flex gap-2">
            <button type="submit" className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 rounded-lg text-sm transition-all">
              <Check size={14} /> Guardar cambios
            </button>
            <button type="button" onClick={() => setEditing(false)} className="px-4 bg-gray-800 hover:bg-gray-700 text-gray-400 rounded-lg text-sm transition-colors">
              Cancelar
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
