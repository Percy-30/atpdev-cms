import { getProjects, createProject, uploadImage } from "@atpdev/database";
import { revalidatePath } from "next/cache";
import { Plus, Code2, Link as LinkIcon, ExternalLink, BrainCircuit, ImagePlus } from "lucide-react";
import ProjectList from "./ProjectList";

export default async function ProjectsPage() {
  const projects = await getProjects();

  // Server Actions
  async function handleCreate(formData: FormData) {
    "use server";
    const title = formData.get("title") as string;
    const category = formData.get("category") as string;
    const metrics = formData.get("metrics") as string;
    const description = formData.get("description") as string;
    const stackStr = formData.get("stack") as string;
    const stack = stackStr.split(",").map(s => s.trim()).filter(Boolean);
    
    // Subida de imagen
    const imageFile = formData.get("image") as File;
    let imageUrl = "";
    if (imageFile && imageFile.size > 0) {
      const uploadedUrl = await uploadImage(imageFile);
      if (uploadedUrl) imageUrl = uploadedUrl;
    }

    const demolink = formData.get("demoLink") as string;
    const playstore = formData.get("playStore") as string;
    const status = formData.get("status") as string;

    await createProject({
      title,
      category,
      metrics,
      description,
      stack,
      image: imageUrl,
      demolink: demolink || "#",
      playstore: playstore || undefined,
      status
    });

    revalidatePath("/projects");
    revalidatePath("/", "layout");
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white mb-1 flex items-center gap-3">
            <Code2 className="text-blue-500" />
            Gestor de Proyectos
          </h1>
          <p className="text-gray-400 text-sm">Administra tu portafolio público. Todo cambio se refleja inmediatamente.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Formulario de Creación */}
        <div className="lg:col-span-1 bg-[#121212] p-6 rounded-xl border border-gray-800/60 shadow-xl h-fit">
          <h2 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <Plus size={18} className="text-blue-500" />
            Nuevo Proyecto
          </h2>
          <form action={handleCreate} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1">Título del Proyecto</label>
              <input name="title" type="text" required className="w-full bg-[#0a0a0a] border border-gray-800 text-white px-3 py-2 rounded-lg text-sm focus:border-blue-500 focus:outline-none" placeholder="Ej: Lector QR Pro" />
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">Categoría</label>
                <select name="category" className="w-full bg-[#0a0a0a] border border-gray-800 text-white px-3 py-2 rounded-lg text-sm focus:border-blue-500 focus:outline-none">
                  <option value="Android Apps">Android</option>
                  <option value="Web Apps">Web</option>
                  <option value="IA & Bots">IA & Bots</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 mb-1">Estado</label>
                <select name="status" className="w-full bg-[#0a0a0a] border border-gray-800 text-white px-3 py-2 rounded-lg text-sm focus:border-blue-500 focus:outline-none">
                  <option value="En Producción">Producción</option>
                  <option value="Desarrollo">Desarrollo</option>
                  <option value="Privado">Privado</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1">Métrica Destacada</label>
              <input name="metrics" type="text" required className="w-full bg-[#0a0a0a] border border-gray-800 text-white px-3 py-2 rounded-lg text-sm focus:border-blue-500 focus:outline-none" placeholder="Ej: +50k Descargas" />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1">Stack (Separado por comas)</label>
              <input name="stack" type="text" required className="w-full bg-[#0a0a0a] border border-gray-800 text-white px-3 py-2 rounded-lg text-sm focus:border-blue-500 focus:outline-none" placeholder="Kotlin, Compose, Room" />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 mb-1">Descripción corta</label>
              <textarea name="description" required className="w-full bg-[#0a0a0a] border border-gray-800 text-white px-3 py-2 rounded-lg text-sm focus:border-blue-500 focus:outline-none h-20 resize-none" placeholder="Describe tu proyecto..."></textarea>
            </div>

            <div className="pt-2 border-t border-gray-800">
              <label className="block text-xs font-semibold text-gray-400 mb-1 flex items-center gap-1"><ImagePlus size={12}/> Imagen del Proyecto (Opcional)</label>
              <input name="image" type="file" accept="image/*" className="w-full bg-[#0a0a0a] border border-gray-800 text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600/10 file:text-blue-500 hover:file:bg-blue-600/20 px-3 py-2 rounded-lg text-sm focus:border-blue-500 focus:outline-none mb-3 transition-colors cursor-pointer" />
              
              <label className="block text-xs font-semibold text-gray-400 mb-1">Enlace a Play Store (Opcional)</label>
              <input name="playStore" type="text" className="w-full bg-[#0a0a0a] border border-gray-800 text-white px-3 py-2 rounded-lg text-sm focus:border-blue-500 focus:outline-none" placeholder="https://play.google.com/..." />
            </div>

            <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-2.5 rounded-lg mt-4 transition-colors">
              Publicar Proyecto
            </button>
          </form>
        </div>

        <ProjectList initialProjects={projects} />

      </div>
    </div>
  );
}
