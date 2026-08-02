"use client";

import { useState } from "react";
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

export default function ContactForm({ config }: { config?: SiteConfig | null }) {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  
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
    <section id="contacto" className="py-24 relative overflow-hidden bg-[#08090a]">
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>
      
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Left Text */}
          <div>
            <h2 className="text-3xl md:text-5xl font-black text-white mb-6">
              ¿Tienes un proyecto <br /> en mente? <span className="text-blue-500">Hablemos.</span>
            </h2>
            <p className="text-gray-400 text-lg mb-8 leading-relaxed">
              Ya sea para desarrollo de aplicaciones móviles, sistemas web, integraciones con IA o colaboración en docencia, estoy siempre abierto a discutir nuevas oportunidades de impacto.
            </p>
            
            <div className="space-y-5 mb-8">
              {/* Direct Email */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#12141a] border border-gray-800 flex items-center justify-center text-blue-400 shrink-0">
                  <Mail size={20} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold">Email Directo</p>
                  <a href={`mailto:${config?.email || 'achataipepercy@gmail.com'}`} className="text-white font-medium hover:text-blue-400 transition-colors">
                    {config?.email || "achataipepercy@gmail.com"}
                  </a>
                </div>
              </div>

              {/* Direct Phone / WhatsApp */}
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#12141a] border border-gray-800 flex items-center justify-center text-emerald-400 shrink-0">
                  <Phone size={20} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold">Celular / WhatsApp</p>
                  <p className="text-white font-medium">{config?.phone || "+51 987 006 572"}</p>
                </div>
              </div>
            </div>

            {/* Active Social Networks Badges */}
            {activeSocials.length > 0 && (
              <div>
                <p className="text-xs text-gray-500 uppercase tracking-widest font-semibold mb-3">Redes Sociales Activas</p>
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
                <h3 className="text-2xl font-bold text-white mb-2">¡Mensaje Enviado!</h3>
                <p className="text-gray-400 text-sm">Gracias por contactarme. Te responderé lo antes posible.</p>
                <button 
                  onClick={() => setStatus("idle")}
                  className="mt-8 text-blue-400 hover:text-blue-300 font-medium underline underline-offset-4 text-sm"
                >
                  Enviar otro mensaje
                </button>
              </div>
            ) : (
              <form action={handleSubmit} className="flex flex-col gap-5 relative z-10">
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="name" className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Nombre Completo</label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    required 
                    placeholder="Ej. Juan Pérez"
                    className="bg-[#0b0c10] border border-gray-800 text-white px-4 py-3.5 rounded-xl focus:outline-none focus:border-blue-500 text-sm transition-all"
                  />
                </div>
                
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="email" className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Correo Electrónico</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    required 
                    placeholder="juan@empresa.com"
                    className="bg-[#0b0c10] border border-gray-800 text-white px-4 py-3.5 rounded-xl focus:outline-none focus:border-blue-500 text-sm transition-all"
                  />
                </div>
                
                <div className="flex flex-col gap-1.5">
                  <label htmlFor="message" className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Mensaje</label>
                  <textarea 
                    id="message" 
                    name="message" 
                    rows={4}
                    required 
                    placeholder="Cuéntame sobre tu idea o proyecto..."
                    className="bg-[#0b0c10] border border-gray-800 text-white px-4 py-3.5 rounded-xl focus:outline-none focus:border-blue-500 text-sm transition-all resize-none"
                  ></textarea>
                </div>
                
                {status === "error" && (
                  <div className="flex items-center gap-2 text-rose-400 text-sm font-medium bg-rose-500/10 p-3 rounded-lg border border-rose-500/20">
                    <AlertCircle size={16} /> Hubo un error al enviar el mensaje. Inténtalo de nuevo.
                  </div>
                )}
                
                <button 
                  type="submit" 
                  disabled={status === "submitting"}
                  className="mt-2 w-full bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-3.5 rounded-xl transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] text-sm"
                >
                  {status === "submitting" ? (
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    <>Enviar Mensaje <Send size={16} /></>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
