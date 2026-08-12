import Link from "next/link";
import { cookies } from "next/headers";
import { translateText } from "@atpdev/database";
import { Scale, ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Términos de Servicio | ATP Dev",
  description: "Términos de servicio y condiciones de uso aplicables a todos los sitios web y subdominios de ATP Dev.",
};

export default async function TermsOfService() {
  const cookieStore = await cookies();
  const lang = cookieStore.get("NEXT_LOCALE")?.value || "es";

  const t = async (text: string) => {
    if (lang === "es") return text;
    return await translateText(text, lang);
  };

  const texts = {
    back: await t("Volver al inicio"),
    title: await t("Términos de Servicio"),
    updated: await t("Última actualización: Agosto 2026"),
    h1: await t("1. Aceptación de los Términos"),
    p1: await t("Al acceder y utilizar el sitio web atpdev.dev y sus subdominios asociados, aceptas estar sujeto a estos Términos de Servicio. Si no estás de acuerdo con alguna parte de los términos, no podrás acceder a nuestros servicios."),
    h2: await t("2. Propiedad Intelectual"),
    p2: await t("Todo el contenido, diseños, logotipos, código fuente y aplicaciones mostradas en este sitio web (salvo que se indique que son Open Source o pertenezcan a terceros) son propiedad exclusiva de Percy Acha Taipe (ATP Dev). No se permite la reproducción total o parcial sin autorización expresa."),
    h3: await t("3. Servicios de Desarrollo y Consultoría"),
    p3: await t("Las solicitudes de contacto para servicios de desarrollo de software, integraciones o consultoría están sujetas a evaluación. El envío de una solicitud a través del formulario de contacto no garantiza la prestación del servicio. Todos los acuerdos comerciales finales se formalizarán por separado."),
    h4: await t("4. Subdominios y Aplicaciones de Terceros"),
    p4: await t("Este sitio enlaza a proyectos y herramientas alojadas en subdominios (ej. papascan.atpdev.dev). El uso de esas herramientas específicas puede estar sujeto a sus propios términos de uso, especialmente aquellas que ofrecen funcionalidades Premium o que muestran anuncios a través de Google AdSense."),
    h5: await t("5. Limitación de Responsabilidad"),
    p5: await t("ATP Dev no será responsable de ningún daño directo, indirecto, incidental, especial o consecuente que resulte del uso o la incapacidad de usar nuestros servicios web o el software aquí promocionado."),
  };

  const linkPath = lang === "es" ? "/" : `/${lang}`;

  return (
    <div className="min-h-screen bg-[#0b0c10] text-gray-300 py-16 px-6 font-sans relative overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-600/10 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-3xl mx-auto relative z-10 bg-[#12141a] p-8 md:p-12 rounded-3xl border border-gray-800 shadow-2xl">
        <Link href={linkPath} className="inline-flex items-center gap-2 text-blue-500 hover:text-blue-400 mb-8 font-semibold transition-colors">
          <ArrowLeft size={18} /> {texts.back}
        </Link>
        
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl border border-emerald-500/20">
            <Scale size={28} />
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white">{texts.title}</h1>
        </div>
        
        <p className="text-sm font-semibold text-gray-500 mb-12 uppercase tracking-widest">{texts.updated}</p>
        
        <div className="space-y-10 leading-relaxed text-gray-400">
          
          <section>
            <h2 className="text-xl font-bold text-white mb-4 border-b border-gray-800 pb-2">{texts.h1}</h2>
            <p className="mb-4">{texts.p1}</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4 border-b border-gray-800 pb-2">{texts.h2}</h2>
            <p className="mb-4">{texts.p2}</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4 border-b border-gray-800 pb-2">{texts.h3}</h2>
            <p>{texts.p3}</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4 border-b border-gray-800 pb-2">{texts.h4}</h2>
            <p>{texts.p4}</p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4 border-b border-gray-800 pb-2">{texts.h5}</h2>
            <p>{texts.p5}</p>
          </section>

        </div>
      </div>
    </div>
  );
}
