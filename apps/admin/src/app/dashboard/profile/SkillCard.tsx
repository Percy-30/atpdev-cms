"use client";

import { useState, useTransition } from "react";
import { Eye, EyeOff, Trash2, Pencil, X, Check, Loader2 } from "lucide-react";
import { Skill } from "@atpdev/database";

const COLOR_TEXT: Record<string, string> = {
  blue: "text-blue-400", purple: "text-purple-400", emerald: "text-emerald-400",
  amber: "text-amber-400", rose: "text-rose-400", green: "text-green-400",
};

const inputClass  = "bg-[#0b0c10] border border-gray-800 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-blue-500 transition-all text-sm w-full";
const selectClass = "bg-[#0b0c10] border border-gray-800 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-blue-500 transition-all text-sm w-full";

type Props = {
  skill: Skill;
  iconOptions: { key: string; label: string }[];
  colorOptions: { key: string; label: string }[];
  editAction:   (fd: FormData) => Promise<void>;
  removeAction: (id: number)  => Promise<void>;
  toggleAction: (id: number, current: boolean) => Promise<void>;
};

export default function SkillCard({ skill, iconOptions, colorOptions, editAction, removeAction, toggleAction }: Props) {
  const [editing, setEditing] = useState(false);
  const [isPending, startTransition] = useTransition();
  const colorText = COLOR_TEXT[skill.color_key] || "text-blue-400";

  const handleDelete = () => {
    if (!confirm(`¿Eliminar la categoría "${skill.category}"?`)) return;
    startTransition(() => removeAction(skill.id));
  };

  const handleToggle = () => {
    startTransition(() => toggleAction(skill.id, skill.is_active));
  };

  const handleSave = (fd: FormData) => {
    startTransition(async () => {
      await editAction(fd);
      setEditing(false);
    });
  };

  return (
    <div className={`bg-[#12141a] border rounded-2xl overflow-hidden transition-all ${skill.is_active ? "border-gray-800" : "border-gray-800/30 opacity-50"}`}>

      {/* ── Header siempre visible ── */}
      <div className="flex items-start gap-3 p-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h3 className={`font-bold text-sm ${colorText}`}>{skill.category}</h3>
            {!skill.is_active && (
              <span className="text-[9px] font-bold uppercase tracking-widest bg-gray-700 text-gray-400 px-1.5 py-0.5 rounded">Oculto</span>
            )}
          </div>
          {!editing && (
            <div className="flex flex-wrap gap-1.5">
              {skill.items.map((item, i) => (
                <span key={i} className="text-[11px] px-2 py-0.5 rounded-md bg-gray-800 text-gray-300 border border-gray-700">{item}</span>
              ))}
            </div>
          )}
        </div>

        {/* Botones de acción */}
        <div className="flex gap-1.5 shrink-0">
          {isPending ? (
            <Loader2 size={16} className="animate-spin text-gray-400 mt-1" />
          ) : (
            <>
              <button
                onClick={() => setEditing(!editing)}
                title={editing ? "Cancelar edición" : "Editar"}
                className={`p-1.5 rounded-lg transition-colors ${editing ? "bg-purple-600 text-white" : "bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white"}`}
              >
                {editing ? <X size={14} /> : <Pencil size={14} />}
              </button>
              <button
                onClick={handleToggle}
                title={skill.is_active ? "Ocultar del portal" : "Mostrar en portal"}
                className="p-1.5 bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white rounded-lg transition-colors"
              >
                {skill.is_active ? <EyeOff size={14} /> : <Eye size={14} />}
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
          <input type="hidden" name="id" value={skill.id} />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Categoría</label>
              <input type="text" name="category" defaultValue={skill.category} required className={inputClass} />
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Orden</label>
              <input type="number" name="sort_order" defaultValue={skill.sort_order} className={inputClass} />
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Ícono</label>
              <select name="icon_key" defaultValue={skill.icon_key} className={selectClass}>
                {iconOptions.map(o => <option key={o.key} value={o.key}>{o.label}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">Color</label>
              <select name="color_key" defaultValue={skill.color_key} className={selectClass}>
                {colorOptions.map(o => <option key={o.key} value={o.key}>{o.label}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1">
              Tecnologías <span className="text-gray-600 normal-case">(separadas por coma)</span>
            </label>
            <input
              type="text"
              name="items"
              defaultValue={skill.items.join(", ")}
              required
              placeholder="Next.js, React, TypeScript"
              className={inputClass}
            />
          </div>

          <div className="flex gap-2">
            <button type="submit" className="flex-1 flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-500 text-white font-bold py-2 rounded-lg text-sm transition-all">
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
