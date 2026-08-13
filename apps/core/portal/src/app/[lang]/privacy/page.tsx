import Link from "next/link";
import { cookies } from "next/headers";
import { translateText } from "@atpdev/database";
import { ShieldCheck, ArrowLeft } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de Privacidad | ATP Dev",
  description: "Política de privacidad y protección de datos de los servicios y aplicaciones de ATP Dev.",
};

export default async function PrivacyPolicy({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang = 'es' } = await params;

  const t = async (text: string) => {
    if (lang === "es") return text;
    return await translateText(text, lang);
  };

  const texts = {
    back: await t("Volver al inicio"),
    title: await t("Política de Privacidad"),
    updated: await t("Última actualización: Agosto 2026"),
    h1: await t("1. Información que recopilamos"),
    p1: await t("Al utilizar este sitio web o contactarnos a través de nuestros formularios, podemos recopilar la siguiente información:"),
    li1_1: await t("Nombre completo"),
    li1_2: await t("Dirección de correo electrónico"),
    li1_3: await t("Información sobre tu proyecto o mensaje"),
    li1_4: await t("Datos de uso anónimos a través de herramientas de analítica web (Google Analytics)."),
    h2: await t("2. Uso de la información"),
    p2: await t("La información recopilada se utiliza exclusivamente para:"),
    li2_1: await t("Responder a tus consultas de desarrollo de software, colaboraciones o propuestas."),
    li2_2: await t("Mejorar la experiencia de usuario en nuestro sitio web."),
    li2_3: await t("Cumplir con las políticas de Google AdSense en nuestros subdominios."),
    h3: await t("3. Terceros y Google AdSense"),
    p3: await t("En algunos de nuestros subdominios utilizamos Google AdSense para mostrar anuncios. Google utiliza cookies (como la cookie de DoubleClick) para publicar anuncios basados en tus visitas anteriores a este y otros sitios web. Puedes inhabilitar el uso de cookies para publicidad basada en intereses visitando la Configuración de anuncios de Google."),
    h4: await t("4. Seguridad de tus datos"),
    p4: await t("Implementamos medidas de seguridad para proteger tu información personal. Tus datos de contacto no serán vendidos, intercambiados ni transferidos a terceros sin tu consentimiento, excepto cuando sea necesario para cumplir con la ley."),
    h5: await t("5. Contacto"),
    p5: await t("Si tienes alguna pregunta sobre esta Política de Privacidad, puedes contactarnos en:"),
  };

  const linkPath = lang === "es" ? "/" : `/${lang}`;

  return (
    <div className="min-h-screen bg-[#0b0c10] text-gray-300 py-16 px-6 font-sans relative overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/10 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-3xl mx-auto relative z-10 bg-[#12141a] p-8 md:p-12 rounded-3xl border border-gray-800 shadow-2xl">
        <Link href={linkPath} className="inline-flex items-center gap-2 text-blue-500 hover:text-blue-400 mb-8 font-semibold transition-colors">
          <ArrowLeft size={18} /> {texts.back}
        </Link>
        
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-blue-500/10 text-blue-500 rounded-xl border border-blue-500/20">
            <ShieldCheck size={28} />
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-white">{texts.title}</h1>
        </div>
        
        <p className="text-sm font-semibold text-gray-500 mb-12 uppercase tracking-widest">{texts.updated}</p>
        
        <div className="space-y-10 leading-relaxed text-gray-400">
          
          <section>
            <h2 className="text-xl font-bold text-white mb-4 border-b border-gray-800 pb-2">{texts.h1}</h2>
            <p className="mb-4">{texts.p1}</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>{texts.li1_1}</li>
              <li>{texts.li1_2}</li>
              <li>{texts.li1_3}</li>
              <li>{texts.li1_4}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-4 border-b border-gray-800 pb-2">{texts.h2}</h2>
            <p className="mb-4">{texts.p2}</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>{texts.li2_1}</li>
              <li>{texts.li2_2}</li>
              <li>{texts.li2_3}</li>
            </ul>
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
            <p>{texts.p5} <a href="mailto:achataipepercy@gmail.com" className="text-blue-400 hover:underline font-semibold">achataipepercy@gmail.com</a></p>
          </section>

        </div>
      </div>
    </div>
  );
}
