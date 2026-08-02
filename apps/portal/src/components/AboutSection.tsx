"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Code2, Smartphone, Database, BrainCircuit, GraduationCap, Award, Server, ExternalLink, Loader2 } from "lucide-react";
import { getSkills, getSiteConfig, Skill } from "@atpdev/database";

// Mapeo de icon_key → componente Lucide
const ICON_MAP: Record<string, React.ReactNode> = {
  code2:      <Code2 size={16} />,
  smartphone: <Smartphone size={16} />,
  database:   <Database size={16} />,
  brain:      <BrainCircuit size={16} />,
  server:     <Server size={16} />,
};

// Mapeo de color_key → clases Tailwind
const COLOR_MAP: Record<string, { text: string; bg: string; border: string }> = {
  blue:   { text: "text-blue-400",   bg: "bg-blue-400/10",   border: "border-blue-500/20"   },
  green:  { text: "text-green-400",  bg: "bg-green-400/10",  border: "border-green-500/20"  },
  purple: { text: "text-purple-400", bg: "bg-purple-400/10", border: "border-purple-500/20" },
  rose:   { text: "text-rose-400",   bg: "bg-rose-400/10",   border: "border-rose-500/20"   },
  amber:  { text: "text-amber-400",  bg: "bg-amber-400/10",  border: "border-amber-500/20"  },
};

import { useParams } from "next/navigation";
import { translateClient } from "@/utils/translate";

export default function AboutSection() {
  const params = useParams();
  const lang = params?.lang as string || 'es';

  const [skills, setSkills] = useState<Skill[]>([]);
  const [credlyUrl, setCredlyUrl] = useState<string>("");
  const [loading, setLoading] = useState(true);

  const [ui, setUi] = useState({
    title1: "Sobre ",
    title2: "Mí",
    subtitle: "Ingeniero de Sistemas apasionado por la docencia y el desarrollo de software de alto impacto.",
    card1Title: "Percy Acha Taipe",
    card1Desc: "Bachiller en Ingeniería de Sistemas por la Universidad Nacional José María Arguedas (UNAJMA). Combino mi experiencia técnica en desarrollo Fullstack y Mobile con mi vocación por la enseñanza.",
    card2Title: "Formación Académica",
    card2Desc: "Ingeniería de Sistemas (UNAJMA)\nPosgrado en progreso (Maestría en IA, UNIR)",
    card3Title: "Especialización Continua",
    card3Desc: "CCNAv7, Oracle SQL, Power BI, IA, Desarrollo del Kernel Linux (LFD103)."
  });

  useEffect(() => {
    const loadData = async () => {
      let [skillsData, configData] = await Promise.all([getSkills(), getSiteConfig()]);
      
      if (lang !== 'es') {
        skillsData = await Promise.all(skillsData.map(async s => ({
          ...s,
          category: await translateClient(s.category, lang),
          items: await Promise.all(s.items.map(i => translateClient(i, lang)))
        })));
      }
      setSkills(skillsData);
      setCredlyUrl(configData?.credly_url || "https://www.credly.com/badges/8172ffd1-f729-41da-8221-60d98e4fe488");
      
      if (lang !== 'es') {
        const keys = Object.keys(ui) as (keyof typeof ui)[];
        const newUi = { ...ui };
        await Promise.all(keys.map(async k => {
          newUi[k] = await translateClient(ui[k], lang);
        }));
        setUi(newUi);
      }
      setLoading(false);
    };
    loadData();
  }, [lang]);

  return (
    <section id="about" className="py-24 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-[1000px] pointer-events-none opacity-20">
        <div className="absolute top-[20%] left-[-10%] w-[300px] h-[300px] bg-blue-600 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[10%] right-[-10%] w-[300px] h-[300px] bg-purple-600 rounded-full blur-[120px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
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
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            {ui.subtitle}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Bio Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-5 bg-[#12141a]/80 backdrop-blur-xl border border-gray-800 rounded-3xl p-8 flex flex-col justify-center"
          >
            <h3 className="text-2xl font-bold text-white mb-6">{ui.card1Title}</h3>
            <p className="text-gray-300 leading-relaxed mb-6">
              {ui.card1Desc}
            </p>

            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0 border border-blue-500/20">
                  <GraduationCap className="text-blue-400" size={20} />
                </div>
                <div>
                  <h4 className="text-white font-semibold">{ui.card2Title}</h4>
                  <p className="text-sm text-gray-400 whitespace-pre-line">{ui.card2Desc}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center shrink-0 border border-purple-500/20">
                  <Award className="text-purple-400" size={20} />
                </div>
                <div>
                  <h4 className="text-white font-semibold">{ui.card3Title}</h4>
                  <p className="text-sm text-gray-400 mt-1">
                    {credlyUrl ? (
                      <a href={credlyUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 underline underline-offset-2">
                        CCNAv7 <ExternalLink size={12} />
                      </a>
                    ) : "CCNAv7"}
                    {", "}Oracle SQL, Power BI, IA, Desarrollo del Kernel Linux (LFD103).
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Skills Bento Grid — dinámico desde Supabase */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 content-start"
          >
            {loading ? (
              <div className="sm:col-span-2 flex items-center justify-center h-40 gap-2 text-gray-500">
                <Loader2 size={20} className="animate-spin" />
                <span className="text-sm">Cargando habilidades...</span>
              </div>
            ) : (
              skills.map((skill) => {
                const colors = COLOR_MAP[skill.color_key] || COLOR_MAP.blue;
                const icon   = ICON_MAP[skill.icon_key]  || <Code2 size={16} />;
                return (
                  <div
                    key={skill.id}
                    className={`${colors.bg} ${colors.border} border rounded-2xl p-6 transition-all hover:scale-[1.02] hover:shadow-lg`}
                  >
                    <div className="flex items-center gap-3 mb-4">
                      <div className={`${colors.text} p-2 bg-white/5 rounded-lg border ${colors.border}`}>
                        {icon}
                      </div>
                      <h4 className={`${colors.text} font-bold`}>{skill.category}</h4>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {skill.items.map((item, i) => (
                        <span
                          key={i}
                          className="text-xs font-medium px-2.5 py-1 rounded-md bg-black/40 text-gray-200 border border-white/5"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
