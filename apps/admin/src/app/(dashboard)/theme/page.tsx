import { getSiteConfig, updateSiteConfig } from "@atpdev/database";
import { revalidatePath } from "next/cache";
import { Palette, Save, Type, CheckCircle } from "lucide-react";

export default async function ThemeConfigPage() {
  const config = await getSiteConfig();

  // Server Action
  async function saveTheme(formData: FormData) {
    "use server";
    
    const primary_color = formData.get("primary_color") as string;
    const hero_title = formData.get("hero_title") as string;
    const hero_subtitle = formData.get("hero_subtitle") as string;
    
    // Parse typewriter string back to array
    const typewriterRaw = formData.get("hero_typewriter") as string;
    const hero_typewriter = typewriterRaw.split(",").map(s => s.trim()).filter(s => s !== "");

    await updateSiteConfig({
      primary_color,
      hero_title,
      hero_subtitle,
      hero_typewriter
    });

    revalidatePath("/theme");
    revalidatePath("/", "layout"); // Revalidate the portal pages if they were in the same app (since they are separate apps, we might need a webhook, but for dev it will refetch).
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-white mb-2 flex items-center gap-3">
          <Palette className="text-blue-500" />
          Apariencia Web (Theme Builder)
        </h1>
        <p className="text-gray-400">Personaliza los colores globales y el texto principal (Hero) de tu portafolio público.</p>
      </div>

      <form action={saveTheme} className="space-y-8">
        {/* Sección de Colores */}
        <div className="bg-[#12141a] p-6 md:p-8 rounded-2xl border border-gray-800 shadow-xl">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center text-sm">1</span>
            Identidad Visual
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Color Principal (Botones, Acentos)</label>
              <div className="flex items-center gap-4">
                <input 
                  type="color" 
                  name="primary_color" 
                  defaultValue={config?.primary_color || "#3b82f6"} 
                  className="w-14 h-14 rounded-lg cursor-pointer bg-transparent border-0 p-0"
                />
                <div className="flex-1">
                  <input 
                    type="text" 
                    defaultValue={config?.primary_color || "#3b82f6"} 
                    className="w-full bg-[#08090a] border border-gray-700 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-blue-500 transition-colors uppercase font-mono text-sm"
                    disabled
                  />
                  <p className="text-xs text-gray-500 mt-2">Haz clic en el cuadro de color para elegir uno nuevo (Ej: Azul, Verde, Morado).</p>
                </div>
              </div>
            </div>
            
            <div className="bg-[#0b0c10] border border-gray-800 rounded-xl p-5 flex items-center justify-center relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 opacity-20 blur-3xl rounded-full" style={{ backgroundColor: config?.primary_color }}></div>
               <div className="relative z-10 text-center">
                 <p className="text-sm text-gray-400 mb-3">Previsualización de Botón</p>
                 <button type="button" className="px-6 py-2.5 rounded-lg text-white font-medium shadow-lg" style={{ backgroundColor: config?.primary_color }}>
                   Ver Proyectos
                 </button>
               </div>
            </div>
          </div>
        </div>

        {/* Sección de Textos Hero */}
        <div className="bg-[#12141a] p-6 md:p-8 rounded-2xl border border-gray-800 shadow-xl">
          <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-400 flex items-center justify-center text-sm">2</span>
            Textos Principales (Hero)
          </h2>
          
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Nombre Principal (Título Gigante)</label>
              <div className="relative">
                <Type className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input 
                  type="text" 
                  name="hero_title"
                  defaultValue={config?.hero_title || "Percy Acha"} 
                  className="w-full bg-[#08090a] border border-gray-700 text-white pl-12 pr-4 py-3 rounded-lg focus:outline-none focus:border-blue-500 transition-colors font-bold text-lg"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Subtítulo de Marca (Ej: @ATPDEV)</label>
              <input 
                type="text" 
                name="hero_subtitle"
                defaultValue={config?.hero_subtitle || "@ATPDEV"} 
                className="w-full bg-[#08090a] border border-gray-700 text-blue-400 px-4 py-3 rounded-lg focus:outline-none focus:border-blue-500 transition-colors uppercase font-medium tracking-widest"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-300 mb-2">Roles Animados (Separados por coma)</label>
              <textarea 
                name="hero_typewriter"
                defaultValue={config?.hero_typewriter?.join(", ") || "Software Developer, Mobile Expert"} 
                className="w-full bg-[#08090a] border border-gray-700 text-gray-300 px-4 py-3 rounded-lg focus:outline-none focus:border-blue-500 transition-colors h-24 resize-none"
                required
              ></textarea>
              <p className="text-xs text-gray-500 mt-2">Esta es la máquina de escribir que cambia automáticamente de texto debajo de tu nombre.</p>
            </div>
          </div>
        </div>

        {/* Botón Guardar */}
        <div className="flex justify-end">
          <button type="submit" className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)]">
            <Save size={20} />
            Guardar Cambios
          </button>
        </div>
      </form>
    </div>
  );
}
