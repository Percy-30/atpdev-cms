import type { Metadata } from "next";
import { Space_Grotesk, Inter, IBM_Plex_Mono } from "next/font/google";
import Link from "next/link";
import Script from "next/script";
import { 
  Briefcase, ShieldCheck, Search, PlusCircle, Globe, Award, 
  Calculator, FileText, HelpCircle, Bot, FileSpreadsheet, Scale,
  Mail, ExternalLink, Lock
} from "lucide-react";
import { MobileNavMenu } from "@/components/MobileNavMenu";
import { CookieConsentBanner } from "@/components/CookieConsentBanner";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  weight: ["400", "600"],
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://empleos.atpdev.dev"),
  title: "chamba pro — Agregador de Convocatorias de Trabajo & Empleos Perú 2026",
  description: "Buscador profesional de convocatorias de trabajo CAS 1057, 728, 276 y Sector Privado en Perú. Ofertas 100% verificadas con derivación directa a la fuente oficial del Estado.",
  keywords: [
    "chamba peru",
    "busco chamba",
    "convocatorias de trabajo peru",
    "convocatorias cas 2026",
    "convocatorias cas 1057",
    "trabajo peru 2026",
    "chamba cas",
    "chamba lima",
    "empleos peru",
    "portal trabajo peru",
    "chamba sunat",
    "chamba minedu",
    "chamba bcrp",
    "chamba essalud",
    "chamba poder judicial",
    "ofertas laborales peru",
    "chamba pro"
  ],
  alternates: {
    canonical: "https://empleos.atpdev.dev",
  },
  openGraph: {
    title: "chamba pro — Agregador de Convocatorias y Empleos Perú",
    description: "Buscador profesional de convocatorias de trabajo CAS 1057, 728, 276 y Sector Privado en Perú. Con derivación 100% oficial y transparencia.",
    url: "https://empleos.atpdev.dev",
    siteName: "chamba pro",
    locale: "es_PE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "chamba pro — Buscador de Ofertas Laborales en Perú",
    description: "Convocatorias CAS, 728 y Privado verificadas. Redirección oficial y transparente.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

  return (
    <html lang="es" className={`${spaceGrotesk.variable} ${inter.variable} ${ibmPlexMono.variable}`}>
      <head>
        {/* Google AdSense Script Inyección Oficial */}
        {adsenseId && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseId}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
      </head>
      <body className="bg-[#0b0f19] text-slate-100 antialiased selection:bg-emerald-500 selection:text-black">
        {/* Top Announcement Bar */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 text-white text-xs font-semibold py-1.5 px-4 text-center flex items-center justify-center gap-2 border-b border-emerald-500/30">
          <ShieldCheck size={15} className="animate-pulse text-amber-300" />
          <span>Agregador Oficial Verificado — Redirección 100% Directa a Fuentes de Gobierno & Empresas RUC Verificadas</span>
        </div>

        {/* Global Navigation Header */}
        <header className="sticky top-0 z-40 bg-[#0b0f19]/80 backdrop-blur-xl border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-emerald-500 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)] group-hover:scale-105 transition-transform">
                <Briefcase className="text-slate-950 font-bold" size={22} />
              </div>
              <div>
                <span className="font-display font-black text-xl tracking-tight text-white flex items-center gap-1.5">
                  chamba <span className="text-emerald-400 font-mono text-sm px-1.5 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/30">pro</span>
                </span>
                <span className="text-[10px] text-slate-400 font-mono block -mt-1 tracking-wider uppercase">
                  Perú • Convocatorias Oficiales
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-slate-300">
              <Link href="/empleos" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                <Search size={15} className="text-emerald-400" />
                <span>Buscador</span>
              </Link>
              <Link href="/calculadora-sueldo" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                <Calculator size={15} className="text-emerald-400" />
                <span>Calculadora Sueldo</span>
              </Link>
              <Link href="/comparador-regimenes" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                <Scale size={15} className="text-emerald-400" />
                <span>Comparador CAS</span>
              </Link>
              <Link href="/simulador-entrevista-ia" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                <Bot size={15} className="text-emerald-400" />
                <span>Entrevista IA</span>
              </Link>
              <Link href="/crear-cv-cas" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                <FileSpreadsheet size={15} className="text-emerald-400" />
                <span>Generar CV</span>
              </Link>
              <Link href="/quienes-somos" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                <ShieldCheck size={15} />
                <span>Quiénes Somos</span>
              </Link>
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <Link
                href="/admin/ingesta"
                className="hidden sm:flex px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 transition-all items-center gap-1.5"
              >
                <PlusCircle size={15} />
                <span>Ingesta IA</span>
              </Link>
              <Link
                href="/empleos"
                className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] flex items-center gap-2 font-display"
              >
                <span>Explorar Vacantes</span>
              </Link>

              {/* Mobile Drawer Button */}
              <MobileNavMenu />
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="min-h-[calc(100vh-180px)]">{children}</main>

        {/* Global Footer (Google AdSense & E-E-A-T Compliant) */}
        <footer className="bg-slate-950 border-t border-white/10 py-16 px-4 sm:px-6 lg:px-8 mt-20 text-slate-400 text-xs">
          <div className="max-w-7xl mx-auto space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              
              {/* Col 1: Brand & Transparencia */}
              <div className="space-y-4 md:col-span-2">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold font-display">
                    ch
                  </div>
                  <div>
                    <p className="text-slate-100 font-bold text-sm font-display">chamba pro — empleos.atpdev.dev</p>
                    <p className="text-[11px] text-slate-400">Plataforma Agregadora de Empleos y Convocatorias en Perú</p>
                  </div>
                </div>
                <p className="text-slate-400 text-xs leading-relaxed max-w-md">
                  Chamba Pro es una iniciativa tecnológica independiente desarrollada por <strong>ATP DEV</strong>. Nuestro objetivo es acercar las convocatorias de trabajo transparentes a todo el Perú, combatiendo fraudes y redirigiendo 100% a las fuentes oficiales de SERVIR y empresas verificadas.
                </p>
                <div className="flex flex-wrap gap-2 text-[11px] font-mono text-emerald-400">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">CAS 1057</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">D.L. 728</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">D.L. 276</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20">Locación / FAG</span>
                </div>
              </div>

              {/* Col 2: Herramientas Gratuitas */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-200 text-xs uppercase tracking-wider font-mono">
                  Herramientas Gratuitas
                </h4>
                <ul className="space-y-2 text-slate-400">
                  <li>
                    <Link href="/calculadora-sueldo" className="hover:text-emerald-400 transition-colors">
                      Calculadora de Sueldo Neto CAS
                    </Link>
                  </li>
                  <li>
                    <Link href="/crear-cv-cas" className="hover:text-emerald-400 transition-colors">
                      Creador de CV para el Estado
                    </Link>
                  </li>
                  <li>
                    <Link href="/simulador-entrevista-ia" className="hover:text-emerald-400 transition-colors">
                      Simulador de Entrevista con IA
                    </Link>
                  </li>
                  <li>
                    <Link href="/comparador-regimenes" className="hover:text-emerald-400 transition-colors">
                      Comparador CAS vs 728 vs 276
                    </Link>
                  </li>
                  <li>
                    <Link href="/plantillas-anexos" className="hover:text-emerald-400 transition-colors">
                      Descarga de Anexos SERVIR
                    </Link>
                  </li>
                  <li>
                    <Link href="/preguntas-entrevista-cas" className="hover:text-emerald-400 transition-colors">
                      Preguntas de Examen CAS
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Col 3: Legal & Cumplimiento Google AdSense */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-200 text-xs uppercase tracking-wider font-mono">
                  Legal & Transparencia
                </h4>
                <ul className="space-y-2 text-slate-400">
                  <li>
                    <Link href="/politica-de-privacidad" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                      <Lock size={12} className="text-emerald-400" />
                      <span>Política de Privacidad</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/terminos-y-condiciones" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                      <Scale size={12} className="text-emerald-400" />
                      <span>Términos y Condiciones</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/contacto" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                      <Mail size={12} className="text-emerald-400" />
                      <span>Contacto & Soporte</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/quienes-somos" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                      <ShieldCheck size={12} className="text-emerald-400" />
                      <span>Quiénes Somos & Manifiesto</span>
                    </Link>
                  </li>
                  <li>
                    <a href="/ads.txt" target="_blank" className="hover:text-emerald-400 transition-colors font-mono">
                      Archivo ads.txt
                    </a>
                  </li>
                </ul>
              </div>

            </div>

            {/* Bottom Bar: Disclaimer Legal No Gubernamental */}
            <div className="border-t border-slate-900 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-slate-500 text-center md:text-left">
              <p>
                © {new Date().getFullYear()} <strong>chamba pro</strong> — Desarrollado por <a href="https://atpdev.dev" target="_blank" className="text-slate-400 hover:text-emerald-400 font-semibold">ATP DEV</a>. Todos los derechos reservados.
              </p>
              <p className="max-w-xl text-[10px] leading-relaxed">
                <strong>Aviso Legal:</strong> Chamba Pro es un agregador privado e independiente de ofertas de empleo. No somos una entidad gubernamental ni representamos a SERVIR. Toda postulación se realiza de forma gratuita y directa en los portales oficiales de cada institución. Cumplimiento de la Ley N° 29733.
              </p>
            </div>
          </div>
        </footer>

        {/* Global Regulatory Cookie Consent Banner */}
        <CookieConsentBanner />
      </body>
    </html>
  );
}
