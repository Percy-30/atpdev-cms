import Link from "next/link";
import { cookies } from "next/headers";
import { translateText, getSiteConfig } from "@atpdev/database";
import { ShieldCheck, ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import { GlowWrapper } from "@/components/GlowWrapper";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const title = lang === 'es' ? "Política de Privacidad | ATP Dev" : await translateText("Política de Privacidad | ATP Dev", lang);
  const description = lang === 'es' ? "Política de privacidad y protección de datos de los servicios y aplicaciones de ATP Dev." : await translateText("Política de privacidad y protección de datos de los servicios y aplicaciones de ATP Dev.", lang);
  
  const BASE_URL = "https://www.atpdev.dev";
  const path = "/privacy";
  const supportedLocales = ['es', 'en', 'ru', 'hi', 'zh', 'fr', 'de', 'pt', 'ja'];
  
  return {
    title,
    description,
    alternates: {
      canonical: `${BASE_URL}${lang === 'es' ? '' : '/' + lang}${path}`,
      languages: {
        "x-default": `${BASE_URL}${path}`,
        ...Object.fromEntries(
          supportedLocales.map(l => [l, `${BASE_URL}${l === 'es' ? '' : '/' + l}${path}`])
        )
      },
    },
    openGraph: {
      title,
      description,
      url: `${BASE_URL}${lang === 'es' ? '' : '/' + lang}${path}`,
    },
  };
}

export default async function PrivacyPolicy({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang = 'es' } = await params;
  const config = await getSiteConfig();

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
  const enableGlow = config?.enable_glow_effect !== false;

  return (
    <main className="main">
    <GlowWrapper enabled={enableGlow} className="w-full text-[var(--text-color)] transition-colors duration-500 min-h-screen py-16 px-6 relative overflow-hidden">
      {/* Glow Effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[var(--primary)] opacity-10 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-[var(--tertiary)] opacity-10 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-3xl mx-auto relative z-10 glass-panel neon-border p-8 md:p-12 rounded-3xl shadow-2xl">
        <Link href={linkPath} className="inline-flex items-center gap-2 text-[var(--primary)] hover:opacity-80 mb-8 font-semibold transition-colors magnetic-element">
          <ArrowLeft size={18} /> {texts.back}
        </Link>
        
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-[var(--primary)]/10 text-[var(--primary)] rounded-xl border border-[var(--primary)]/20">
            <ShieldCheck size={28} />
          </div>
          <h1 className="text-3xl md:text-5xl font-black title-gradient">{texts.title}</h1>
        </div>
        
        <p className="text-sm font-semibold opacity-60 mb-12 uppercase tracking-widest">{texts.updated}</p>
        
        <div className="space-y-10 leading-relaxed opacity-90">
          
          <section>
            <h2 className="text-xl font-bold mb-4 border-b border-[var(--glass-border)] pb-2">{texts.h1}</h2>
            <p className="mb-4">{texts.p1}</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>{texts.li1_1}</li>
              <li>{texts.li1_2}</li>
              <li>{texts.li1_3}</li>
              <li>{texts.li1_4}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4 border-b border-[var(--glass-border)] pb-2">{texts.h2}</h2>
            <p className="mb-4">{texts.p2}</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>{texts.li2_1}</li>
              <li>{texts.li2_2}</li>
              <li>{texts.li2_3}</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4 border-b border-[var(--glass-border)] pb-2">{texts.h3}</h2>
            <p>{texts.p3}</p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4 border-b border-[var(--glass-border)] pb-2">{texts.h4}</h2>
            <p>{texts.p4}</p>
          </section>

          <section>
            <h2 className="text-xl font-bold mb-4 border-b border-[var(--glass-border)] pb-2">{texts.h5}</h2>
            <p>{texts.p5} <a href={`mailto:${config?.email || 'hello@atpdev.dev'}`} className="text-[var(--primary)] hover:underline font-semibold magnetic-element inline-block px-2">{config?.email || 'hello@atpdev.dev'}</a></p>
          </section>

        </div>
      </div>
    </GlowWrapper>
    </main>
  );
}
