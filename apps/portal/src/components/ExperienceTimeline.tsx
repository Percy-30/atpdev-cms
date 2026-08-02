"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Briefcase, BookOpen, Laptop, Activity, Star, Loader2 } from "lucide-react";
import { getExperiences, Experience } from "@atpdev/database";

// Mapeo de icon_key → icono Lucide
const ICON_MAP: Record<string, React.ReactNode> = {
  briefcase: <Briefcase size={20} />,
  book:      <BookOpen size={20} />,
  laptop:    <Laptop size={20} />,
  activity:  <Activity size={20} />,
  star:      <Star size={20} />,
};

// Mapeo de color_key → clases Tailwind
const COLOR_MAP: Record<string, { text: string; border: string; bg: string; dot: string }> = {
  blue:   { text: "text-blue-400",   border: "border-blue-500",   bg: "bg-blue-500/20",   dot: "border-blue-500"   },
  purple: { text: "text-purple-400", border: "border-purple-500", bg: "bg-purple-500/20", dot: "border-purple-500" },
  emerald:{ text: "text-emerald-400",border: "border-emerald-500",bg: "bg-emerald-500/20",dot: "border-emerald-500"},
  amber:  { text: "text-amber-400",  border: "border-amber-500",  bg: "bg-amber-500/20",  dot: "border-amber-500"  },
  rose:   { text: "text-rose-400",   border: "border-rose-500",   bg: "bg-rose-500/20",   dot: "border-rose-500"   },
};

import { useParams } from "next/navigation";
import { translateClient } from "@/utils/translate";

export default function ExperienceTimeline() {
  const params = useParams();
  const lang = params?.lang as string || 'es';

  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [loading, setLoading] = useState(true);

  const [ui, setUi] = useState({
    title1: "Trayectoria",
    title2: " Profesional",
    subtitle: "Mi camino combinando el desarrollo de software y la docencia.",
    loadingText: "Cargando experiencia..."
  });

  useEffect(() => {
    const loadData = async () => {
      let data = await getExperiences();
      
      if (lang !== 'es') {
        data = await Promise.all(data.map(async e => ({
          ...e,
          role: await translateClient(e.role, lang),
          company: await translateClient(e.company, lang),
          period: await translateClient(e.period, lang),
          description: await translateClient(e.description, lang)
        })));

        const keys = Object.keys(ui) as (keyof typeof ui)[];
        const newUi = { ...ui };
        await Promise.all(keys.map(async k => {
          newUi[k] = await translateClient(ui[k], lang);
        }));
        setUi(newUi);
      }
      setExperiences(data);
      setLoading(false);
    };
    loadData();
  }, [lang]);

  return (
    <section id="experiencia" className="py-24 relative">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
            {ui.title1} <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">{ui.title2}</span>
          </h2>
          <p className="text-gray-400 text-lg">
            {ui.subtitle}
          </p>
        </motion.div>

        {loading ? (
          <div className="flex items-center justify-center h-40 gap-2 text-gray-500">
            <Loader2 size={20} className="animate-spin" />
            <span className="text-sm">{ui.loadingText}</span>
          </div>
        ) : (
          <div className="relative">
            {/* Línea central */}
            <div className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 h-full w-px bg-gradient-to-b from-blue-500/50 via-purple-500/50 to-transparent"></div>

            <div className="space-y-12">
              {experiences.map((exp, index) => {
                const colors = COLOR_MAP[exp.color_key] || COLOR_MAP.blue;
                const icon   = ICON_MAP[exp.icon_key]  || <Briefcase size={20} />;

                return (
                  <motion.div
                    key={exp.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className={`relative flex flex-col md:flex-row items-start ${index % 2 === 0 ? "md:flex-row-reverse" : ""}`}
                  >
                    {/* Timeline Dot */}
                    <div className={`absolute left-[-8px] md:left-1/2 transform md:-translate-x-1/2 mt-1.5 md:mt-0 w-4 h-4 rounded-full bg-[#0b0c10] border-2 ${colors.dot} z-10 shadow-[0_0_10px_rgba(59,130,246,0.5)]`}></div>

                    {/* Content */}
                    <div className={`ml-8 md:ml-0 md:w-1/2 ${index % 2 === 0 ? "md:pl-12" : "md:pr-12 text-left md:text-right"}`}>
                      <div className="bg-[#12141a] p-6 rounded-2xl border border-gray-800 hover:border-gray-600 transition-colors group relative overflow-hidden">
                        {/* Sutil gradiente en hover */}
                        <div className={`absolute top-0 ${index % 2 === 0 ? 'left-0' : 'right-0'} w-32 h-32 ${colors.bg} blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}></div>

                        <div className={`flex items-center gap-3 mb-2 ${index % 2 !== 0 && "md:justify-end"}`}>
                          <div className={`p-2 rounded-lg bg-black/50 border ${colors.border} ${colors.text} ${index % 2 !== 0 && "md:order-last"}`}>
                            {icon}
                          </div>
                          <span className="text-sm font-bold text-gray-400 bg-gray-900/50 px-3 py-1 rounded-full border border-gray-800">
                            {exp.date_range}
                          </span>
                        </div>

                        <h3 className="text-xl font-bold text-white mb-1">{exp.role}</h3>
                        <h4 className={`text-md font-semibold ${colors.text} mb-3`}>{exp.company}</h4>
                        <p className="text-gray-400 text-sm leading-relaxed">{exp.description}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
