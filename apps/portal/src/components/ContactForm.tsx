"use client";

import { Send, CheckCircle2, AlertCircle, Mail, Phone } from "lucide-react";
import { createLead } from "@/app/actions/contact";
import { SiteConfig } from "@atpdev/database";
import { SOCIAL_ICON_MAP } from "./SocialIcons";

// Map of social network keys to icon and label metadata
export const SOCIAL_PLATFORMS = [
  { key: "whatsapp", name: "WhatsApp", color: "hover:bg-emerald-600/20 hover:border-emerald-500/40 hover:text-emerald-400" },
  { key: "telegram", name: "Telegram", color: "hover:bg-sky-600/20 hover:border-sky-500/40 hover:text-sky-400" },
  { key: "github",   name: "GitHub",   color: "hover:bg-gray-700/40 hover:border-gray-500/40 hover:text-gray-200" },
  { key: "linkedin", name: "LinkedIn", color: "hover:bg-blue-600/20 hover:border-blue-500/40 hover:text-blue-400" },
  { key: "twitter",  name: "Twitter / X", color: "hover:bg-gray-700/40 hover:border-gray-500/40 hover:text-gray-200" },
  { key: "facebook", name: "Facebook", color: "hover:bg-blue-700/20 hover:border-blue-600/40 hover:text-blue-400" },
  { key: "instagram",name: "Instagram",color: "hover:bg-pink-600/20 hover:border-pink-500/40 hover:text-pink-400" },
  { key: "youtube",  name: "YouTube",  color: "hover:bg-red-600/20 hover:border-red-500/40 hover:text-red-400" },
  { key: "tiktok",   name: "TikTok",   color: "hover:bg-purple-600/20 hover:border-purple-500/40 hover:text-purple-400" },
  { key: "discord",  name: "Discord",  color: "hover:bg-indigo-600/20 hover:border-indigo-500/40 hover:text-indigo-400" },
];

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { translateClient } from "@/utils/translate";

export default function ContactForm({ config }: { config?: SiteConfig | null }) {
  const params = useParams();
  const lang = params?.lang as string || 'es';

  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  
  const [ui, setUi] = useState({
    title1: "¿Tienes un proyecto",
    title2: "en mente? Hablemos.",
    subtitle: "Ya sea para desarrollo de aplicaciones móviles, sistemas web, integraciones con IA o colaboración en docencia, estoy siempre abierto a discutir nuevas oportunidades de impacto.",
    emailLabel: "Email Directo",
    phoneLabel: "Celular / WhatsApp",
    socialLabel: "Redes Sociales Activas",
    formName: "Nombre Completo",
    formNamePlaceholder: "Ej. Juan Pérez",
    formEmail: "Correo Electrónico",
    formEmailPlaceholder: "juan@empresa.com",
    formMessage: "Mensaje",
    formMessagePlaceholder: "Cuéntame sobre tu idea o proyecto...",
    btnSending: "Enviando...",
    btnSent: "Mensaje Enviado",
    btnError: "Error. Intenta de nuevo",
    btnSend: "Enviar Mensaje"
  });

  useEffect(() => {
    if (lang !== 'es') {
      const loadTranslation = async () => {
        const keys = Object.keys(ui) as (keyof typeof ui)[];
        const newUi = { ...ui };
        await Promise.all(keys.map(async k => {
          newUi[k] = await translateClient(ui[k], lang);
        }));
        setUi(newUi);
      };
      loadTranslation();
    }
  }, [lang]);
  
  async function handleSubmit(formData: FormData) {
    setStatus("submitting");
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const message = formData.get("message") as string;
    
    if (!name || !email || !message) {
      setStatus("error");
      return;
    }
    
    const result = await createLead(name, email, message);
    if (result) {
      setStatus("success");
    } else {
      setStatus("error");
    }
  }

  // Filter enabled social platforms
  const activeSocials = SOCIAL_PLATFORMS.filter(platform => {
    if (!config) return false;
    const enabledKey = `${platform.key}_enabled` as keyof SiteConfig;
    const urlKey = `${platform.key}_url` as keyof SiteConfig;
    return !!config[enabledKey] && !!config[urlKey];
  });

  return (
    <section id="contact" className="py-24 relative overflow-hidden bg-[#08090a]">
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>
      
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Text */}
          <div>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6 leading-tight">
              {ui.title1} <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">{ui.title2}</span>
            </h2>
            <p className="text-gray-400 text-lg mb-10 max-w-md leading-relaxed">
              {ui.subtitle}
            </p>
            
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center border border-blue-500/20 shrink-0">
                  <Mail className="text-blue-400" size={24} />
                </div>
                <div>
                  <p className="text-gray-500 text-sm font-semibold uppercase tracking-wider">{ui.emailLabel}</p>
                  <a href={`mailto:${config?.email || 'achataipepercy@gmail.com'}`} className="text-white text-lg font-medium hover:text-blue-400 transition-colors">
                    {config?.email || 'achataipepercy@gmail.com'}
                  </a>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-500/20 shrink-0">
                  <Phone className="text-emerald-400" size={24} />
                </div>
                <div>
                  <p className="text-gray-500 text-sm font-semibold uppercase tracking-wider">{ui.phoneLabel}</p>
                  <a href={`https://wa.me/${(config?.phone || '+51987006572').replace(/\D/g,'')}`} target="_blank" rel="noreferrer" className="text-white text-lg font-medium hover:text-emerald-400 transition-colors">
                    {config?.phone || '+51 987 006 572'}
                  </a>
                </div>
              </div>
            </div>

            {/* Redes Sociales Dinámicas */}
            {activeSocials.length > 0 && (
              <div className="mt-12">
                <p className="text-gray-500 text-sm font-semibold uppercase tracking-wider mb-4">{ui.socialLabel}</p>
                <div className="flex flex-wrap gap-2">
                  {activeSocials.map(social => {
                    const urlKey = `${social.key}_url` as keyof SiteConfig;
                    const url = config?.[urlKey] as string;
                    return (
                      <a
                        key={social.key}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#12141a] border border-gray-800 text-gray-300 text-xs font-semibold transition-all ${social.color}`}
                      >
                        {(() => { const Icon = SOCIAL_ICON_MAP[social.key]; return Icon ? <Icon size={15} /> : null; })()}
                        <span>{social.name}</span>
                      </a>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Form */}
          <div className="bg-[#12141a] border border-gray-800 p-8 rounded-3xl shadow-2xl relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 rounded-3xl pointer-events-none"></div>
            
            {status === "success" ? (
              <div className="flex flex-col items-center justify-center text-center h-full py-12">
                <div className="w-20 h-20 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center mb-6 border border-emerald-500/20">
                  <CheckCircle2 size={40} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{ui.btnSent}</h3>
                <p className="text-gray-400 text-sm">Gracias por contactarme. Te responderé lo antes posible.</p>
                <button 
                  onClick={() => setStatus("idle")}
                  className="mt-8 text-blue-400 hover:text-blue-300 font-medium underline underline-offset-4 text-sm"
                >
                  Enviar otro mensaje
                </button>
              </div>
            ) : (
              <form action={handleSubmit} className="flex flex-col relative z-10">
              <div className="mb-6">
                <label className="block text-gray-400 text-sm font-medium mb-2">{ui.formName}</label>
                <input 
                  type="text" 
                  name="name"
                  required
                  placeholder={ui.formNamePlaceholder}
                  className="w-full bg-[#0a0b0e] border border-gray-800 focus:border-blue-500 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-400 text-sm font-medium mb-2">{ui.formEmail}</label>
                <input 
                  type="email" 
                  name="email"
                  required
                  placeholder={ui.formEmailPlaceholder}
                  className="w-full bg-[#0a0b0e] border border-gray-800 focus:border-blue-500 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
                />
              </div>
              <div className="mb-8">
                <label className="block text-gray-400 text-sm font-medium mb-2">{ui.formMessage}</label>
                <textarea 
                  rows={4}
                  name="message"
                  required
                  placeholder={ui.formMessagePlaceholder}
                  className="w-full bg-[#0a0b0e] border border-gray-800 focus:border-blue-500 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors resize-none"
                ></textarea>
              </div>
              <button 
                type="submit" 
                disabled={status === "submitting" || status === "success"}
                className={`w-full flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold transition-all shadow-lg ${
                  status === "success" 
                    ? "bg-emerald-600 text-white hover:bg-emerald-700"
                    : status === "error"
                    ? "bg-red-600 text-white hover:bg-red-700"
                    : "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-900/50 hover:shadow-blue-900/80"
                }`}
              >
                {status === "submitting" ? (
                  <>{ui.btnSending}</>
                ) : status === "success" ? (
                  <><CheckCircle2 size={20} /> {ui.btnSent}</>
                ) : status === "error" ? (
                  <><AlertCircle size={20} /> {ui.btnError}</>
                ) : (
                  <>{ui.btnSend} <Send size={18} /></>
                )}
              </button>                
                {status === "error" && (
                  <div className="mt-4 flex items-center gap-2 text-rose-400 text-sm font-medium bg-rose-500/10 p-3 rounded-lg border border-rose-500/20">
                    <AlertCircle size={16} /> Hubo un error al enviar el mensaje. Inténtalo de nuevo.
                  </div>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
