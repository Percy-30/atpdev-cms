"use client";

import { useState } from "react";
import { FolderKanban, Plus, Trash2, Eye, EyeOff, Pencil } from "lucide-react";
import { Project } from "@atpdev/database";
import { createProject, updateStatus, deleteProject, updateProjectAction } from "./actions";

export default function ProjectsClient({ projects }: { projects: Project[] }) {
  const [editingId, setEditingId] = useState<number | null>(null);
  
  const editingProject = projects.find(p => p.id === editingId) || null;

  const handleSubmit = async (formData: FormData) => {
    if (editingId) {
      await updateProjectAction(editingId, formData);
      setEditingId(null);
    } else {
      await createProject(formData);
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
      {/* TABLA DE PROYECTOS */}
      <div className="xl:col-span-2 bg-[#12141a] border border-gray-800 rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-[#0b0c10] border-b border-gray-800">
              <tr>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-widest">Proyecto</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-widest">Estado</th>
                <th className="p-4 text-xs font-semibold text-gray-500 uppercase tracking-widest">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {projects.length === 0 ? (
                <tr>
                  <td colSpan={3} className="p-8 text-center text-gray-500">
                    No hay proyectos. Añade uno.
                  </td>
                </tr>
              ) : (
                projects.map(proj => (
                  <tr key={proj.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {proj.image ? (
                          <img src={proj.image} className="w-10 h-10 rounded-lg object-cover" alt={proj.title} />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0">
                            <FolderKanban size={18} />
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-white text-sm">{proj.title}</p>
                          <p className="text-xs text-blue-400 font-semibold">{proj.category}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`text-xs font-bold px-2.5 py-1.5 rounded-lg border ${
                        proj.status === 'Activo' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                        'bg-gray-500/10 text-gray-400 border-gray-500/20'
                      }`}>
                        {proj.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <form className="flex gap-2">
                        <input type="hidden" name="id" value={proj.id} />
                        
                        <button
                          type="button"
                          onClick={() => {
                            setEditingId(proj.id);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="p-2 bg-purple-500/10 hover:bg-purple-500/20 text-purple-400 rounded-lg transition-colors"
                          title="Editar proyecto"
                        >
                          <Pencil size={16} />
                        </button>

                        {proj.status === 'Activo' ? (
                          <button
                            formAction={async () => { await updateStatus(proj.id, 'Privado'); }}
                            className="p-2 bg-gray-500/10 hover:bg-gray-500/20 text-gray-400 rounded-lg transition-colors"
                            title="Ocultar del portal"
                          >
                            <EyeOff size={16} />
                          </button>
                        ) : (
                          <button
                            formAction={async () => { await updateStatus(proj.id, 'Activo'); }}
                            className="p-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 rounded-lg transition-colors"
                            title="Mostrar en el portal"
                          >
                            <Eye size={16} />
                          </button>
                        )}
                        <button
                          formAction={async () => { await deleteProject(proj.id); }}
                          onClick={(e) => {
                            if (!window.confirm(`¿Estás seguro de que quieres eliminar el proyecto "${proj.title}"? Esta acción no se puede deshacer.`)) {
                              e.preventDefault();
                            }
                          }}
                          className="p-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg transition-colors"
                          title="Eliminar permanentemente"
                        >
                          <Trash2 size={16} />
                        </button>
                      </form>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* FORMULARIO DE CREACIÓN/EDICIÓN */}
      <div className="bg-[#12141a] border border-gray-800 rounded-2xl p-6 h-fit sticky top-24">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          {editingId ? (
            <><Pencil size={20} className="text-purple-500" /> Editar Proyecto</>
          ) : (
            <><Plus size={20} className="text-blue-500" /> Nuevo Proyecto</>
          )}
        </h2>
        
        <form action={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Título</label>
            <input type="text" name="title" defaultValue={editingProject?.title || ""} required className="bg-[#0b0c10] border border-gray-800 text-white px-4 py-2.5 rounded-xl focus:outline-none focus:border-blue-500 transition-all text-sm" placeholder="Ej. Lector QR Pro" />
          </div>
          
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Categoría</label>
            <select name="category" defaultValue={editingProject?.category || "Android"} className="bg-[#0b0c10] border border-gray-800 text-white px-4 py-2.5 rounded-xl focus:outline-none focus:border-blue-500 transition-all text-sm">
              <option value="Android">Android Apps</option>
              <option value="Web">Web</option>
              <option value="IA">IA & Bots</option>
              <option value="Otro">Otro</option>
            </select>
          </div>
          
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Stack (separado por comas)</label>
            <input type="text" name="stack" defaultValue={editingProject?.stack.join(", ") || ""} required className="bg-[#0b0c10] border border-gray-800 text-white px-4 py-2.5 rounded-xl focus:outline-none focus:border-blue-500 transition-all text-sm" placeholder="Kotlin, Compose, Room" />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">URL (Demo/Play Store)</label>
            <input type="url" name="demolink" defaultValue={editingProject?.demolink || ""} required className="bg-[#0b0c10] border border-gray-800 text-white px-4 py-2.5 rounded-xl focus:outline-none focus:border-blue-500 transition-all text-sm" placeholder="https://..." />
          </div>
          
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Descripción</label>
            <textarea name="description" defaultValue={editingProject?.description || ""} required rows={3} className="bg-[#0b0c10] border border-gray-800 text-white px-4 py-2.5 rounded-xl focus:outline-none focus:border-blue-500 transition-all text-sm resize-none" placeholder="Breve descripción..."></textarea>
          </div>
          
          <input type="hidden" name="status" value={editingProject ? editingProject.status : "Activo"} />

          <div className="flex gap-2 mt-4">
            {editingId && (
              <button 
                type="button" 
                onClick={() => setEditingId(null)}
                className="w-1/3 bg-gray-800 hover:bg-gray-700 text-white font-bold px-4 py-3 rounded-xl transition-all"
              >
                Cancelar
              </button>
            )}
            <button 
              type="submit" 
              className={`${editingId ? 'w-2/3 bg-purple-600 hover:bg-purple-500 shadow-[0_0_15px_rgba(147,51,234,0.4)]' : 'w-full bg-blue-600 hover:bg-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.4)]'} text-white font-bold px-4 py-3 rounded-xl transition-all`}
            >
              {editingId ? "Guardar Cambios" : "Crear Proyecto"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
