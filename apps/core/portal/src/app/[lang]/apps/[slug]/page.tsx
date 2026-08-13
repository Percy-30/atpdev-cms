import { getProjects, translateText } from "@atpdev/database";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Code, Play } from "lucide-react";
import type { Metadata } from "next";

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

  return {
    title,
    description,
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  const projects = await getProjects();
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
    technologies: await t("Tecnologías Utilizadas"),
  };

  const translatedTitle = await t(project.title);
  const translatedDesc = await t(project.long_description || project.description);
  const translatedCat = await t(project.category);

  return (
    <div className="min-h-screen bg-[#0b0c10] text-gray-300 py-16 px-6 font-sans relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none"></div>
      
      <div className="max-w-4xl mx-auto relative z-10 pt-8">
        <Link href={`/${lang === 'es' ? '' : lang}/#portfolio`} className="inline-flex items-center gap-2 text-blue-500 hover:text-blue-400 mb-8 font-semibold transition-colors">
          <ArrowLeft size={18} /> {texts.back}
        </Link>
        
        <h1 className="text-4xl md:text-6xl font-black text-white mb-4">{translatedTitle}</h1>
        <p className="text-xl text-blue-400 font-semibold mb-8">{translatedCat}</p>
        
        <div className="relative w-full aspect-video rounded-3xl overflow-hidden shadow-2xl border border-gray-800 mb-12">
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
          <div className="md:col-span-2 space-y-6 text-lg leading-relaxed text-gray-400">
            {translatedDesc.split('\n').map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>

          <div className="space-y-8">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-4 border-b border-gray-800 pb-2">
                {texts.technologies}
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.stack.map(tech => (
                  <span key={tech} className="px-3 py-1 bg-gray-800/50 text-gray-300 rounded-lg text-sm border border-gray-700">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {project.demolink && project.demolink !== '#' && (
                <a href={project.demolink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full px-6 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all hover:scale-[1.02]">
                  <ExternalLink size={20} /> {texts.demo}
                </a>
              )}
              {project.github_repo && (
                <a href={project.github_repo} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full px-6 py-4 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-bold transition-all border border-gray-700">
                  <Code size={20} /> {texts.source}
                </a>
              )}
              {project.playstore && (
                <a href={project.playstore} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full px-6 py-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold transition-all hover:scale-[1.02]">
                  <Play size={20} /> {texts.playstore}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
