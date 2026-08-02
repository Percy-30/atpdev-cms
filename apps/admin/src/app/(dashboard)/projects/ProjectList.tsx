"use client";

import { useState, useRef } from "react";
import { Project } from "@atpdev/database";
import { Trash2, Smartphone, EyeOff, Eye, Search, AlertTriangle, Edit2, X } from "lucide-react";
import { deleteProjectAction, toggleProjectVisibility, editProjectAction } from "./actions";

export default function ProjectList({ initialProjects }: { initialProjects: Project[] }) {
  const [filter, setFilter] = useState("Todos");
  const [sortBy, setSortBy] = useState("newest");
  const [projectToDelete, setProjectToDelete] = useState<number | null>(null);
  const [projectToEdit, setProjectToEdit] = useState<Project | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isToggling, setIsToggling] = useState<number | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  // Extract dynamic categories
  const categories = ["Todos", ...Array.from(new Set(initialProjects.map(p => p.category)))];

  // Apply filters and sorting
  let displayedProjects = initialProjects.filter(p => filter === "Todos" || p.category === filter);
  
  if (sortBy === "newest") {
    displayedProjects.sort((a, b) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime());
  } else if (sortBy === "oldest") {
    displayedProjects.sort((a, b) => new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime());
  } else if (sortBy === "az") {
    displayedProjects.sort((a, b) => a.title.localeCompare(b.title));
  }

  const handleDelete = async () => {
    if (!projectToDelete) return;
    setIsDeleting(true);
    await deleteProjectAction(projectToDelete);
    setIsDeleting(false);
    setProjectToDelete(null);
  };

  const handleToggleVisibility = async (id: number, currentStatus: string) => {
    setIsToggling(id);
    await toggleProjectVisibility(id, currentStatus);
    setIsToggling(null);
  };

  return (
    <>
      <div className="lg:col-span-2 space-y-4">
        {/* Toolbar */}
        <div className="bg-[#121212] p-4 rounded-xl border border-gray-800/60 flex flex-col md:flex-row items-center justify-between gap-4">
          <h2 className="text-white font-bold whitespace-nowrap">Proyectos Actuales ({initialProjects.length})</h2>
          
          <div className="flex items-center gap-3 w-full md:w-auto">
            <select 
              value={filter} 
              onChange={(e) => setFilter(e.target.value)}
              className="bg-[#0a0a0a] border border-gray-800 text-gray-300 px-3 py-1.5 rounded-lg text-xs focus:border-blue-500 focus:outline-none"
            >
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>

            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-[#0a0a0a] border border-gray-800 text-gray-300 px-3 py-1.5 rounded-lg text-xs focus:border-blue-500 focus:outline-none"
            >
              <option value="newest">Más Recientes</option>
              <option value="oldest">Más Antiguos</option>
              <option value="az">Alfabético (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {displayedProjects.map((p) => {
            const isPrivate = p.status === "Privado";
            return (
              <div key={p.id} className={`p-5 rounded-xl border shadow-sm relative group transition-colors
                ${isPrivate ? 'bg-[#0a0a0a] border-gray-800/40 opacity-75' : 'bg-[#121212] border-gray-800/60 hover:border-gray-600'}`}>
                
                <div className="flex justify-between items-start mb-3">
                  <div className="flex gap-3 items-center">
                    <div className="w-10 h-10 rounded-lg bg-gray-900 border border-gray-700 overflow-hidden flex items-center justify-center">
                      {p.image ? (
                        <img src={p.image} alt={p.title} className={`w-full h-full object-cover ${isPrivate ? 'grayscale' : ''}`} />
                      ) : (
                        <span className="text-gray-500 font-bold text-xs uppercase">{p.title.substring(0, 2)}</span>
                      )}
                    </div>
                    <div>
                      <h3 className="text-white font-bold leading-tight flex items-center gap-2">
                        {p.title}
                        {isPrivate && <span className="text-[9px] bg-red-500/10 text-red-400 px-1.5 rounded border border-red-500/20">OCULTO</span>}
                      </h3>
                      <span className="text-xs text-blue-400 font-semibold">{p.category}</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-1">
                    <button 
                      type="button"
                      onClick={() => handleToggleVisibility(p.id, p.status)}
                      disabled={isToggling === p.id}
                      title={isPrivate ? "Mostrar en Portafolio" : "Ocultar del Portafolio"}
                      className={`p-2 rounded-lg transition-colors border ${isPrivate ? 'text-green-500 bg-green-500/10 border-green-500/20 hover:bg-green-500/20' : 'text-gray-400 bg-[#0a0a0a] border-gray-800 hover:text-white'}`}
                    >
                      {isPrivate ? <Eye size={14} /> : <EyeOff size={14} />}
                    </button>
                    
                    <button 
                      type="button" 
                      onClick={() => setProjectToEdit(p)}
                      title="Editar Proyecto"
                      className="text-gray-400 hover:text-blue-500 bg-[#0a0a0a] hover:bg-blue-500/10 p-2 rounded-lg transition-colors border border-gray-800 hover:border-blue-500/50"
                    >
                      <Edit2 size={14} />
                    </button>

                    <button 
                      type="button" 
                      onClick={() => setProjectToDelete(p.id)}
                      title="Eliminar Proyecto"
                      className="text-gray-500 hover:text-red-500 bg-[#0a0a0a] hover:bg-red-500/10 p-2 rounded-lg transition-colors border border-gray-800 hover:border-red-500/50"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-gray-400 line-clamp-2 mb-3">{p.description}</p>
                
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {p.stack.slice(0, 3).map((s, i) => (
                    <span key={i} className="text-[10px] bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full border border-gray-700">{s}</span>
                  ))}
                  {p.stack.length > 3 && <span className="text-[10px] bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full border border-gray-700">+{p.stack.length - 3}</span>}
                </div>

                <div className="flex items-center justify-between text-[10px] pt-3 border-t border-gray-800/50">
                  <span className="text-gray-500 font-bold px-2 py-1 bg-[#0a0a0a] rounded border border-gray-800 uppercase">{p.status}</span>
                  {p.playstore && (
                    <a href={p.playstore} target="_blank" className="flex items-center gap-1 text-green-400 hover:text-green-300 transition-colors">
                      <Smartphone size={12} /> Play Store
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {initialProjects.length === 0 && (
          <div className="p-10 border border-dashed border-gray-700 rounded-xl text-center">
            <Search className="mx-auto text-gray-600 mb-3" size={32} />
            <h3 className="text-white font-bold">No tienes proyectos</h3>
            <p className="text-sm text-gray-500 mt-1">Usa el formulario de la izquierda para agregar tu primer proyecto.</p>
          </div>
        )}
      </div>

      {/* Custom Delete Modal */}
      {projectToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#121212] border border-red-500/30 p-6 rounded-2xl shadow-2xl max-w-sm w-full animate-in fade-in zoom-in duration-200">
            <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-4 mx-auto border border-red-500/20">
              <AlertTriangle className="text-red-500" size={24} />
            </div>
            <h3 className="text-xl font-bold text-white text-center mb-2">¿Eliminar Proyecto?</h3>
            <p className="text-gray-400 text-sm text-center mb-6">
              Esta acción es irreversible. Se borrará permanentemente de la base de datos. Si solo quieres ocultarlo, usa el botón "Ocultar" en su lugar.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setProjectToDelete(null)}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 bg-transparent border border-gray-700 text-gray-300 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button 
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg font-medium transition-colors shadow-lg shadow-red-900/20 disabled:opacity-50 flex justify-center items-center"
              >
                {isDeleting ? "Borrando..." : "Sí, eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Edit Modal */}
      {projectToEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#121212] border border-gray-800 p-6 rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto relative animate-in fade-in zoom-in duration-200">
            <button onClick={() => setProjectToEdit(null)} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors">
              <X size={20} />
            </button>
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Edit2 size={18} className="text-blue-500" />
              Editar Proyecto
            </h2>
            
            <form 
              ref={formRef}
              action={async (formData) => {
                await editProjectAction(formData);
                setProjectToEdit(null);
              }} 
              className="space-y-4"
            >
              <input type="hidden" name="id" value={projectToEdit.id} />
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">Título del Proyecto</label>
                <input name="title" defaultValue={projectToEdit.title} type="text" required className="w-full bg-[#0a0a0a] border border-gray-800 text-white px-3 py-2 rounded-lg text-sm focus:border-blue-500 focus:outline-none" />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1">Categoría</label>
                  <select name="category" defaultValue={projectToEdit.category} className="w-full bg-[#0a0a0a] border border-gray-800 text-white px-3 py-2 rounded-lg text-sm focus:border-blue-500 focus:outline-none">
                    <option value="Android Apps">Android</option>
                    <option value="Web Apps">Web</option>
                    <option value="IA & Bots">IA & Bots</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 mb-1">Estado</label>
                  <select name="status" defaultValue={projectToEdit.status} className="w-full bg-[#0a0a0a] border border-gray-800 text-white px-3 py-2 rounded-lg text-sm focus:border-blue-500 focus:outline-none">
                    <option value="En Producción">Producción</option>
                    <option value="Desarrollo">Desarrollo</option>
                    <option value="Privado">Privado</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">Métrica Destacada</label>
                <input name="metrics" defaultValue={projectToEdit.metrics} type="text" required className="w-full bg-[#0a0a0a] border border-gray-800 text-white px-3 py-2 rounded-lg text-sm focus:border-blue-500 focus:outline-none" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">Stack (Separado por comas)</label>
                <input name="stack" defaultValue={projectToEdit.stack.join(", ")} type="text" required className="w-full bg-[#0a0a0a] border border-gray-800 text-white px-3 py-2 rounded-lg text-sm focus:border-blue-500 focus:outline-none" />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">Descripción corta</label>
                <textarea name="description" defaultValue={projectToEdit.description} required className="w-full bg-[#0a0a0a] border border-gray-800 text-white px-3 py-2 rounded-lg text-sm focus:border-blue-500 focus:outline-none h-20 resize-none"></textarea>
              </div>

              <div className="pt-2 border-t border-gray-800">
                <input type="hidden" name="existingImage" value={projectToEdit.image || ""} />
                
                <label className="block text-xs font-semibold text-gray-400 mb-1 flex items-center justify-between">
                  <span>Actualizar Imagen (Opcional)</span>
                  {projectToEdit.image && <span className="text-green-500 text-[10px]">Tiene imagen actual</span>}
                </label>
                <input name="image" type="file" accept="image/*" className="w-full bg-[#0a0a0a] border border-gray-800 text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600/10 file:text-blue-500 hover:file:bg-blue-600/20 px-3 py-2 rounded-lg text-sm focus:border-blue-500 focus:outline-none mb-3 transition-colors cursor-pointer" />
                
                <label className="block text-xs font-semibold text-gray-400 mb-1">Enlace a Play Store (Opcional)</label>
                <input name="playStore" defaultValue={projectToEdit.playstore || ""} type="text" className="w-full bg-[#0a0a0a] border border-gray-800 text-white px-3 py-2 rounded-lg text-sm focus:border-blue-500 focus:outline-none" />
                
                <label className="block text-xs font-semibold text-gray-400 mb-1 mt-3">Demo Link (Opcional)</label>
                <input name="demoLink" defaultValue={projectToEdit.demolink || ""} type="text" className="w-full bg-[#0a0a0a] border border-gray-800 text-white px-3 py-2 rounded-lg text-sm focus:border-blue-500 focus:outline-none" />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button type="button" onClick={() => setProjectToEdit(null)} className="px-4 py-2 bg-transparent text-gray-400 hover:text-white rounded-lg text-sm font-medium transition-colors border border-gray-700">
                  Cancelar
                </button>
                <button type="submit" className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold text-sm shadow-lg shadow-blue-900/20 transition-all">
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
