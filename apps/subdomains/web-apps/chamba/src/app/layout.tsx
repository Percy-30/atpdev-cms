import type { Metadata } from "next";
import { Space_Grotesk, Inter, IBM_Plex_Mono } from "next/font/google";
import Link from "next/link";
import { Briefcase, ShieldCheck, Search, PlusCircle, Globe, Award, Calculator, FileText, HelpCircle, Bot, FileSpreadsheet, Scale } from "lucide-react";
import { MobileNavMenu } from "@/components/MobileNavMenu";
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
  title: "chamba — Agregador de Convocatorias de Trabajo & Empleos Perú Nivel Dios",
  description: "Buscador profesional de convocatorias de trabajo CAS 1057, 728, 276 y Sector Privado en Perú. Ofertas 100% verificadas con derivación directa a la fuente oficial.",
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
    "perutrabajos",
    "convocatorias de trabajo",
    "portal trabajo peru",
    "empleos portal trabajo",
    "chamba sunat",
    "chamba minedu",
    "chamba bcrp",
    "chamba essalud",
    "chamba poder judicial",
    "ofertas laborales peru",
    "chamba pro"
  ],
  alternates: {
    canonical: "https://chamba.atpdev.dev",
  },
  openGraph: {
    title: "chamba — Agregador de Convocatorias y Empleos Perú",
    description: "Buscador profesional de convocatorias de trabajo CAS 1057, 728, 276 y Sector Privado en Perú. Con derivación 100% oficial.",
    url: "https://chamba.atpdev.dev",
    siteName: "chamba pro",
    locale: "es_PE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "chamba — Buscador de Ofertas Laborales en Perú",
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${spaceGrotesk.variable} ${inter.variable} ${ibmPlexMono.variable}`}>
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
                <Briefcase size={22} className="text-slate-950 font-bold" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-display text-2xl font-black tracking-tight text-white group-hover:text-emerald-400 transition-colors">
                    chamba
                  </span>
                  <span className="text-[10px] uppercase font-mono font-bold tracking-widest px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                    PRO
                  </span>
                </div>
                <span className="text-[11px] text-slate-400 font-mono">chamba.atpdev.dev</span>
              </div>
            </Link>

            {/* Nav Links */}
            <nav className="hidden xl:flex items-center gap-6 text-sm font-medium text-slate-300">
              <Link href="/empleos" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                <Search size={16} />
                <span>Buscar Ofertas</span>
              </Link>
              <Link href="/empleos?regimen=CAS" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                <Award size={16} />
                <span>Convocatorias CAS</span>
              </Link>
              <Link href="/calculadora-sueldo" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                <Calculator size={16} className="text-emerald-400" />
                <span>Calculadora Sueldo</span>
              </Link>
              <Link href="/plantillas-anexos" className="hover:text-cyan-400 transition-colors flex items-center gap-1.5">
                <FileText size={16} className="text-cyan-400" />
                <span>Plantillas & Anexos</span>
              </Link>
              <Link href="/preguntas-entrevista-cas" className="hover:text-amber-400 transition-colors flex items-center gap-1.5">
                <HelpCircle size={16} className="text-amber-400" />
                <span>Examen CAS</span>
              </Link>
              <Link href="/simulador-entrevista-ia" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                <Bot size={16} className="text-emerald-400" />
                <span>Entrevista IA</span>
              </Link>
              <Link href="/crear-cv-cas" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                <FileSpreadsheet size={16} className="text-emerald-400" />
                <span>Generar CV</span>
              </Link>
              <Link href="/quienes-somos" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                <ShieldCheck size={16} />
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

        {/* Global Footer */}
        <footer className="bg-slate-950 border-t border-white/10 py-12 px-4 sm:px-6 lg:px-8 mt-20 text-slate-400 text-sm">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold font-display">
                ch
              </div>
              <div>
                <p className="text-slate-200 font-semibold font-display">chamba pro — chamba.atpdev.dev</p>
                <p className="text-xs text-slate-500">Agregador Informativo Transparente de Empleos y Convocatorias en Perú</p>
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-6 text-xs text-slate-400">
              <span>CAS 1057</span>
              <span>•</span>
              <span>D.L. 728</span>
              <span>•</span>
              <span>D.L. 276</span>
              <span>•</span>
              <span>Ley N° 29733 Cumplida</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
