"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle, ShieldCheck, Download, Zap, Lock } from "lucide-react";

interface FaqItem {
  question: string;
  answer: string;
  icon?: React.ReactNode;
}

interface FaqAccordionProps {
  items?: FaqItem[];
  lang?: string;
  hideHeader?: boolean;
}

export function FaqAccordion({ items, lang = "es", hideHeader = false }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const defaultFaqs: FaqItem[] = [
    {
      question: lang === "es" ? "¿Cómo instalar la aplicación APK en dispositivos Android?" : "How to install the APK application on Android devices?",
      answer: lang === "es" 
        ? "Haz clic en el botón 'Descargar APK Directo' o 'Ver en Google Play'. Si descargas el archivo APK directo, abre el archivo descargado en tu teléfono y concede permiso para 'Instalar aplicaciones de fuentes desconocidas'. La instalación es 100% segura y libre de virus."
        : "Click on the 'Download APK Direct' or 'View on Google Play' button. If downloading the direct APK file, open it on your phone and grant permission to 'Install apps from unknown sources'. The installation is 100% safe and virus-free.",
      icon: <Download size={18} className="text-emerald-400" />
    },
    {
      question: lang === "es" ? "¿Cómo instalar el archivo IPA en iPhone / iPad (iOS)?" : "How to install the IPA file on iPhone / iPad (iOS)?",
      answer: lang === "es"
        ? "Para instalar el ejecutable IPA nativo en iOS sin pasar por la App Store, puedes utilizar herramientas oficiales de instalación como AltStore, Sideloadly o Xcode. También dispones del enlace a la App Store cuando esté publicada oficialmente."
        : "To install the native IPA executable on iOS without the App Store, you can use standard tools like AltStore, Sideloadly, or Xcode. An official App Store link is also provided when published.",
      icon: <ShieldCheck size={18} className="text-sky-400" />
    },
    {
      question: lang === "es" ? "¿La aplicación funciona 100% sin conexión a Internet (Offline)?" : "Does the app work 100% offline without an internet connection?",
      answer: lang === "es"
        ? "Sí, toda la base de datos de diagnósticos (10,000+ códigos) y el motor de búsqueda Room FTS4 están empaquetados localmente dentro del ejecutable. Funciona en hospitales, aviones y zonas sin cobertura."
        : "Yes, the full diagnostic database (10,000+ codes) and Room FTS4 search engine are locally bundled inside the binary. Works in hospitals, planes, and zero-coverage areas.",
      icon: <Zap size={18} className="text-yellow-400" />
    },
    {
      question: lang === "es" ? "¿Mis datos médicos o de búsqueda son privados y seguros?" : "Are my medical or search data private and secure?",
      answer: lang === "es"
        ? "Absolutamente. La aplicación no requiere registro ni almacena datos personales en servidores externos. Cumple estrictamente con la privacidad del personal médico y la normativa de protección de datos."
        : "Absolutely. The application requires no registration and stores zero personal data on external servers. Fully compliant with medical privacy standards.",
      icon: <Lock size={18} className="text-purple-400" />
    }
  ];

  const faqList = items && items.length > 0 ? items : defaultFaqs;

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <div className="mt-8 pt-6 border-t border-[var(--glass-border)]">
      {!hideHeader && (
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
            <HelpCircle size={22} />
          </div>
          <div>
            <h3 className="text-xl font-extrabold text-[var(--text-color)]">
              {lang === "es" ? "Preguntas Frecuentes & Soporte" : "Frequently Asked Questions & Support"}
            </h3>
            <p className="text-xs text-[var(--text-color)] opacity-70">
              {lang === "es" ? "Guía de instalación y especificaciones técnicas" : "Installation guide and technical specifications"}
            </p>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {faqList.map((item, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                isOpen
                  ? "bg-[var(--glass-bg)] border-emerald-500/40 shadow-lg"
                  : "bg-[var(--pill-bg)] border-[var(--glass-border)] hover:border-emerald-500/30"
              }`}
            >
              <button
                onClick={() => toggle(idx)}
                className="w-full p-4 px-5 flex items-center justify-between gap-4 text-left transition-colors"
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span className="font-bold text-sm text-[var(--text-color)]">{item.question}</span>
                </div>
                <ChevronDown
                  size={18}
                  className={`text-[var(--text-color)] opacity-60 transition-transform duration-300 flex-shrink-0 ${
                    isOpen ? "rotate-180 text-emerald-400 opacity-100" : ""
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-5 pb-5 text-sm text-[var(--text-color)] opacity-90 leading-relaxed border-t border-[var(--glass-border)] pt-3 animate-in fade-in duration-200">
                  {item.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
