// Trigger dual deployment sync for Vercel admin & portal
import { getProjects, translateText, getSiteConfig } from "@atpdev/database";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Code, Download } from "lucide-react";

import type { Metadata } from "next";
import Script from "next/script";
import { GlowWrapper } from "@/components/GlowWrapper";

import { AdSenseBanner } from "@/components/AdSenseBanner";

export async function generateStaticParams() {
  const projects = await getProjects();
  const langs = ['es', 'en', 'ru', 'hi', 'zh', 'fr', 'de', 'pt', 'ja'];
  
  // Create combinations for all languages and all slugs
  const params: { lang: string; slug: string }[] = [];
  projects.forEach((p) => {
    if (p.slug) {
      langs.forEach((lang) => {
        params.push({ lang, slug: p.slug });
      });
    }
  });
  return params;
}

export async function generateMetadata(
  { params }: { params: Promise<{ lang: string; slug: string }> }
): Promise<Metadata> {
  const { lang, slug } = await params;
  const projects = await getProjects();
  const project = projects.find(p => p.slug === slug);

  if (!project) return {};

  const title = lang === 'es' ? project.title : await translateText(project.title, lang);
  const description = lang === 'es' 
    ? (project.long_description || project.description) 
    : await translateText(project.long_description || project.description, lang);

  const BASE_URL = "https://www.atpdev.dev";
  const supportedLocales = ['es', 'en', 'ru', 'hi', 'zh', 'fr', 'de', 'pt', 'ja'];
  const path = `/apps/${slug}`;
  const ogImage = project.image || `${BASE_URL}/og-image.png`;

  const isPrivate = project.status === 'Privado';

  return {
    title,
    description,
    ...(isPrivate ? { robots: { index: false, follow: false } } : {}),
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
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  
  const [projects, config] = await Promise.all([
    getProjects(),
    getSiteConfig()
  ]);

  const project = projects.find(p => p.slug === slug);

  if (!project) {
    notFound();
  }

  const t = async (text: string) => {
    if (lang === "es") return text;
    return await translateText(text, lang);
  };

  const texts = {
    back: await t("Volver al inicio"),
    demo: await t("Ver Demo"),
    source: await t("Código Fuente"),
    playstore: await t("Ver en Play Store"),
    downloadApk: await t("Descargar APK Directo"),
    appstore: await t("Ver en App Store"),
    downloadIpa: await t("Descargar IPA Directo (iOS)"),
    technologies: await t("Tecnologías Utilizadas"),
  };

  const translatedTitle = await t(project.title);
  const translatedDesc = await t(project.long_description || project.description);
  const translatedCat = await t(project.category);

  const enableGlow = config?.enable_glow_effect !== false;

  let localTheme = null;
  if (project.theme_config) {
    try {
      localTheme = JSON.parse(project.theme_config);
    } catch (e) {
      console.error("Error parsing project theme config", e);
    }
  }

  const osList: string[] = [];
  if (project.playstore) osList.push("Android");
  if ((project as any).appstore) osList.push("iOS");
  if (project.demolink) osList.push("Web");
  const operatingSystems = osList.length > 0 ? osList.join(", ") : "Android, iOS, Web";

  return (
    <main className="main">
      <GlowWrapper enabled={enableGlow} className="w-full text-[var(--text-color)] transition-colors duration-500 min-h-screen py-16 px-6 relative overflow-hidden">
      {localTheme && (
        <style dangerouslySetInnerHTML={{
          __html: `
            :root {
              --primary: ${localTheme.primary_color || 'var(--primary)'};
              --background: ${localTheme.theme_mode === 'light' ? '#ffffff' : '#0b0c10'};
              --text-color: ${localTheme.theme_mode === 'light' ? '#000000' : '#ffffff'};
              --font-headline: '${localTheme.font_headline || 'var(--font-headline)'}', sans-serif;
              --font-body: '${localTheme.font_body || 'var(--font-body)'}', sans-serif;
            }
            .glass-panel {
              ${localTheme.theme_mode === 'light' ? 'background: rgba(255, 255, 255, 0.8); border-color: rgba(0, 0, 0, 0.1); color: #000;' : ''}
              ${localTheme.radius_scale === 'full' ? 'border-radius: 2rem;' : localTheme.radius_scale === 'small' ? 'border-radius: 0.5rem;' : localTheme.radius_scale === 'none' ? 'border-radius: 0;' : ''}
            }
            ${localTheme.glow_style && localTheme.glow_style.includes('cursor-') ? `
              body {
                cursor: ${localTheme.glow_style.includes('cursor-ia') ? 'url(/cursors/ia-cursor.svg), auto' : 'auto'};
              }
            ` : ''}
          `
        }} />
      )}
      {/* JSON-LD Schema (Pro SEO) for Project */}
      <Script
        id={`json-ld-app-${project.id}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "SoftwareApplication",
                "name": translatedTitle,
                "description": translatedDesc,
                "applicationCategory": translatedCat,
                "image": project.image || "https://www.atpdev.dev/og-image.png",
                "operatingSystem": operatingSystems,
                "url": `https://www.atpdev.dev/${lang === 'es' ? '' : lang + '/'}apps/${project.slug}`,
                "offers": {
                  "@type": "Offer",
                  "price": "0",
                  "priceCurrency": "USD"
                },
                "author": {
                  "@type": "Person",
                  "name": "Percy Acha Taipe"
                }
              },
              {
                "@type": "BreadcrumbList",
                "itemListElement": [
                  {
                    "@type": "ListItem",
                    "position": 1,
                    "name": lang === 'es' ? "Inicio" : "Home",
                    "item": `https://www.atpdev.dev/${lang === 'es' ? '' : lang}`
                  },
                  {
                    "@type": "ListItem",
                    "position": 2,
                    "name": "Apps",
                    "item": `https://www.atpdev.dev/${lang === 'es' ? '' : lang + '/'}#portfolio`
                  },
                  {
                    "@type": "ListItem",
                    "position": 3,
                    "name": translatedTitle
                  }
                ]
              }
            ]
          })
        }}
      />
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none"></div>
      
      <div className="max-w-4xl mx-auto relative z-10 pt-8">
        <Link href={`/${lang === 'es' ? '' : lang}/#portfolio`} className="inline-flex items-center gap-2 text-blue-500 hover:text-blue-400 mb-8 font-semibold transition-colors magnetic-element">
          <ArrowLeft size={18} /> {texts.back}
        </Link>
        
        <h1 className="text-4xl md:text-6xl font-black mb-4 title-gradient">{translatedTitle}</h1>
        <p className="text-xl text-[var(--primary)] font-semibold mb-8">{translatedCat}</p>
        
        <div className="relative w-full aspect-video rounded-3xl overflow-hidden shadow-2xl glass-panel neon-border mb-12">
          <Image 
            src={project.image} 
            alt={project.title} 
            fill 
            sizes="100vw"
            className="object-cover"
            priority
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="md:col-span-2 space-y-6 text-lg leading-relaxed text-[var(--text-color)] opacity-90 glass-panel p-8 rounded-3xl">
            {translatedDesc.split('\n').map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}

            {/* In-article Google AdSense Slot */}
            {config?.adsense_id && (
              <AdSenseBanner adsenseId={config.adsense_id} />
            )}
          </div>

          <div className="space-y-8 glass-panel p-8 rounded-3xl h-fit">
            <div>
              <h2 className="text-sm font-bold uppercase tracking-widest mb-4 border-b border-[var(--glass-border)] pb-2">
                {texts.technologies}
              </h2>
              <div className="flex flex-wrap gap-2">
                {project.stack.map(tech => (
                  <span key={tech} className="px-3 py-1 bg-[var(--pill-bg)] rounded-lg text-sm border border-[var(--glass-border)] font-medium">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {project.demolink && project.demolink !== '#' && (
                <a href={project.demolink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl font-bold transition-all magnetic-element hover:scale-[1.02] neon-border shadow-lg shadow-blue-500/20">
                  <ExternalLink size={20} /> {lang === 'es' ? '🌐 Visitar Web App / Subdominio en Vivo' : '🌐 Visit Live Web App / Subdomain'}
                </a>
              )}
              {project.github_repo && (
                <a href={project.github_repo} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full px-6 py-4 bg-[var(--glass-bg)] hover:bg-[var(--glass-border)] text-[var(--text-color)] rounded-xl font-bold transition-all border border-[var(--glass-border)] magnetic-element hover:scale-[1.02] neon-border">
                  <Code size={20} /> {texts.source}
                </a>
              )}
              {project.playstore && (
                <a href={project.playstore} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full px-6 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-all magnetic-element hover:scale-[1.02] neon-border shadow-lg shadow-emerald-600/20">
                  {project.playstore.toLowerCase().includes('.apk') || project.playstore.includes('/apks/') ? (
                    <><Download size={20} /> {texts.downloadApk}</>
                  ) : (
                    <><svg viewBox="0 0 512 512" width="20" height="20" fill="currentColor" className="mb-0.5"><path d="M325.3 234.3L104.6 13.5C72 6.6 44 26 44 60.5v391c0 34.5 28 53.9 60.6 47l220.7-220.8c5.4-5.4 5.4-14.2 0-19.6c0 0-42.3-42.2-42.3-42.2c-5.4-5.4-14.2-5.4-19.6 0l41.9-41.6zm-177 17.7c-5.4-5.4-5.4-14.2 0-19.6l216-216c5.4-5.4 14.2-5.4 19.6 0l90 90c12.1 12.1 12.1 31.8 0 43.9L352 372.2c-5.4 5.4-14.2 5.4-19.6 0l-184-184zM476 220l-71-71-224 224 71 71c12.1 12.1 31.8 12.1 43.9 0l180.1-180.1c12.1-12.1 12.1-31.8 0-43.9z"/></svg> {texts.playstore}</>
                  )}
                </a>
              )}
              {(project as any).appstore && (
                <a href={(project as any).appstore} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full px-6 py-4 bg-gray-100 hover:bg-white text-black rounded-xl font-bold transition-all magnetic-element hover:scale-[1.02] neon-border shadow-lg shadow-white/10">
                  {(project as any).appstore.toLowerCase().includes('.ipa') || (project as any).appstore.includes('/ipas/') ? (
                    <><Download size={20} className="text-sky-600" /> {texts.downloadIpa}</>
                  ) : (
                    <><svg viewBox="0 0 384 512" width="20" height="20" fill="currentColor" className="mb-0.5"><path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"/></svg> {texts.appstore}</>
                  )}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </GlowWrapper>
    </main>
  );
}
