import type { Metadata, Viewport } from "next";

export const viewport: Viewport = {
  themeColor: "#0b0f19",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};
import { Space_Grotesk, Inter, IBM_Plex_Mono } from "next/font/google";
import Link from "next/link";
import Script from "next/script";
import { 
  Briefcase, ShieldCheck, Search, PlusCircle, Globe, Award, 
  Calculator, FileText, HelpCircle, Bot, FileSpreadsheet, Scale,
  Mail, ExternalLink, Lock, Building2, Compass
} from "lucide-react";
import { MobileNavMenu } from "@/components/MobileNavMenu";
import { CookieConsentBanner } from "@/components/CookieConsentBanner";
import { ChambaThemeListener } from "@/components/ChambaThemeListener";
import { ChambaGlowWrapper } from "@/components/ChambaGlowWrapper";
import { ChambaCustomCursor } from "@/components/ChambaCustomCursor";
import { ChambaThemeToggle } from "@/components/ChambaThemeToggle";
import { getSubdomainConfig } from "@atpdev/database";
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
  title: {
    default: "chamba pro — Buscador de Convocatorias de Trabajo, Empleos y Chamba en Perú 2026",
    template: "%s | chamba pro",
  },
  description:
    "Buscador oficial de convocatorias de trabajo, empleos y chamba en Perú 2026. Convocatorias vigentes en el Estado (CAS 1057, D.L. 728, 276) y sector privado con bases oficiales.",
  keywords: [
    "chamba",
    "chamba peru",
    "empleos",
    "empleos peru",
    "trabajo",
    "trabajo peru",
    "bolsa de trabajo",
    "convocatorias de trabajo",
    "convocatorias de trabajo 2026",
    "trabajo en el estado",
    "convocatorias cas 2026",
    "portal de empleo peru",
    "servir convocatorias",
    "sunat empleos",
    "minedu convocatorias",
    "essalud convocatorias",
    "empleos lima",
    "trabajo lima",
    "trabajo remoto peru",
    "ofertas laborales peru",
    "chamba pro"
  ],
  alternates: {
    canonical: "https://empleos.atpdev.dev",
    types: {
      "application/rss+xml": "https://empleos.atpdev.dev/rss.xml",
    },
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/icon.svg",
    apple: [
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
  },
  openGraph: {
    title: "chamba pro — Buscador de Convocatorias, Empleos y Trabajo en Perú",
    description: "Buscador de convocatorias CAS 1057, 728 y sector privado en Perú. Ofertas verificadas con postulación directa en portales oficiales del Estado.",
    url: "https://empleos.atpdev.dev",
    siteName: "chamba pro",
    locale: "es_PE",
    type: "website",
    images: [
      {
        url: "https://empleos.atpdev.dev/opengraph-image",
        width: 1200,
        height: 630,
        alt: "chamba pro — Convocatorias de Trabajo, Empleos y Chamba en Perú",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "chamba pro — Convocatorias de Trabajo y Empleos Perú 2026",
    description: "Encuentra chamba verificada y convocatorias CAS 1057, 728 y sector privado en Perú con enlace a bases oficiales.",
    images: ["https://empleos.atpdev.dev/opengraph-image"],
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
    other: {
      "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION || "",
      "google-adsense-account": "ca-pub-5414009811868137",
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const config = getSubdomainConfig("chamba");
  const theme = config.theme || ({} as any);
  const adsenseId = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID || "ca-pub-5414009811868137";
  const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const accentHex = theme.accent_color || theme.primary_color || "#10b981";
  const glowStyle = theme.glow_style || "spotlight-border";
  const neonThickness = theme.neon_thickness || "4px";
  const neonGlow = neonThickness === "2px" ? "10px" : neonThickness === "4px" ? "18px" : neonThickness === "6px" ? "26px" : "36px";
  const radiusScale = theme.radius_scale === 'none' ? '0px' : theme.radius_scale === 'small' ? '0.375rem' : theme.radius_scale === 'medium' ? '1rem' : '9999px';

  return (
    <html lang="es" className={`${theme.theme_mode === 'light' ? 'light' : 'dark'} ${spaceGrotesk.variable} ${inter.variable} ${ibmPlexMono.variable}`}>
      <head>
        {/* Core Web Vitals Resource Hints */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://pagead2.googlesyndication.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://pagead2.googlesyndication.com" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />

        {/* Dynamic Subdomain Theme Custom Properties */}
        <style dangerouslySetInnerHTML={{
          __html: `
            :root {
              --accent-emerald: ${accentHex};
              --accent-primary: ${accentHex};
              --primary: ${accentHex};
              --secondary: ${theme.secondary_color || '#0f172a'};
              --tertiary: ${theme.tertiary_color || '#1e293b'};
              --neutral: ${theme.neutral_color || '#64748b'};
              --neon-thickness: ${neonThickness};
              --neon-glow: ${neonGlow};
              --radius-scale: ${radiusScale};
              ${theme.font_headline ? `--font-space: "${theme.font_headline}", sans-serif; --font-heading: "${theme.font_headline}", sans-serif;` : ''}
              ${theme.font_body ? `--font-inter: "${theme.font_body}", sans-serif; --font-body: "${theme.font_body}", sans-serif;` : ''}
              ${theme.font_label ? `--font-mono: "${theme.font_label}", monospace; --font-label: "${theme.font_label}", monospace;` : ''}
            }
          `
        }} />
        {/* Dynamically Load Google Fonts if customized */}
        {(theme.font_headline || theme.font_body || theme.font_label) && (
          <link
            rel="stylesheet"
            href={`https://fonts.googleapis.com/css2?${[theme.font_headline, theme.font_body, theme.font_label].filter((f): f is string => Boolean(f)).map((f: string) => `family=${f.replace(/ /g, '+')}:wght@400;500;600;700;800;900`).join('&')}&display=swap`}
          />
        )}
        {/* Google Analytics 4 (GA4) */}
        {gaId && (
          <>
            <Script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}', {
                  page_path: window.location.pathname,
                });
              `}
            </Script>
          </>
        )}
        {/* Google AdSense Script Inyección Oficial */}
        {adsenseId && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseId}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
        {/* Google Sitelinks Searchbox & WebSite Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "chamba pro",
              alternateName: "Chamba Pro Perú",
              url: "https://empleos.atpdev.dev",
              description: "Buscador de convocatorias CAS 1057, D.L. 728, 276 y sector privado en Perú con enlace directo a fuentes oficiales.",
              inLanguage: "es-PE",
              potentialAction: {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate: "https://empleos.atpdev.dev/empleos?q={search_term_string}",
                },
                "query-input": "required name=search_term_string",
              },
            }),
          }}
        />
        {/* Organization Schema (E-E-A-T & Google Knowledge Graph) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "chamba pro",
              legalName: "ATP DEV",
              url: "https://empleos.atpdev.dev",
              logo: "https://empleos.atpdev.dev/icon.svg",
              sameAs: ["https://atpdev.dev"],
              contactPoint: {
                "@type": "ContactPoint",
                contactType: "customer support",
                email: "contacto@atpdev.dev",
                availableLanguage: ["Spanish"],
              },
            }),
          }}
        />
      </head>
      <body data-interaction={glowStyle} className="bg-[#070a12] print:bg-white text-slate-100 print:text-slate-900 antialiased selection:bg-emerald-400 selection:text-slate-950">
        <ChambaThemeListener />
        <ChambaCustomCursor />
        <ChambaGlowWrapper className="min-h-screen flex flex-col">
        {/* Top Announcement Bar */}
        {config.branding?.announcement_enabled && (
          <div 
            className="announcement-bar relative overflow-hidden text-white text-xs font-semibold py-2 px-4 text-center flex items-center justify-center gap-2.5 border-b print:hidden"
            style={{
              backgroundColor: `${accentHex}10`,
              borderColor: `${accentHex}30`
            }}
          >
            <div 
              className="absolute inset-0 pointer-events-none" 
              style={{ background: `radial-gradient(ellipse at center, ${accentHex}25, transparent 70%)` }}
            />
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ backgroundColor: accentHex }}></span>
              <span className="relative inline-flex rounded-full h-2 w-2" style={{ backgroundColor: accentHex }}></span>
            </span>
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider" style={{ color: accentHex }}>
              Servicio Verificado 2026:
            </span>
            <span className="text-slate-200 font-medium">
              {config.branding.announcement_text || "Postulación 100% directa a bases oficiales de SERVIR, Ministerios y Empresas líderes"}
            </span>
          </div>
        )}

        {/* Global Navigation Header with Ultra-Refined Glassmorphism */}
        <header className="sticky top-0 z-40 bg-[#070a12]/85 backdrop-blur-2xl border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3.5 group">
              <div className="relative">
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-500 to-amber-500 rounded-2xl blur-sm opacity-50 group-hover:opacity-100 transition duration-500 group-hover:duration-200" />
                <div className="relative w-11 h-11 rounded-xl bg-slate-950 border border-white/15 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
                  <Briefcase className="text-emerald-400 font-bold" size={22} />
                </div>
              </div>
              <div>
                <span className="font-display font-black text-2xl tracking-tight text-white flex items-center gap-1.5">
                  chamba <span className="text-emerald-400 font-mono text-xs px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/40 shadow-[0_0_10px_rgba(16,185,129,0.3)]">pro</span>
                </span>
                <span className="text-[10px] text-slate-400 font-mono block -mt-1 tracking-widest uppercase">
                  Perú • Convocatorias Oficiales
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 text-xs font-semibold text-slate-300">
              <Link href="/empleos" className="px-3 py-2 rounded-xl hover:text-white hover:bg-white/5 transition-all flex items-center gap-1.5 border border-transparent hover:border-white/10">
                <Search size={14} className="text-emerald-400" />
                <span>Buscador</span>
              </Link>
              <Link href="/organizaciones" className="px-3 py-2 rounded-xl hover:text-white hover:bg-white/5 transition-all flex items-center gap-1.5 border border-transparent hover:border-white/10">
                <Building2 size={14} className="text-emerald-400" />
                <span>Organizaciones</span>
              </Link>
              <Link href="/calculadora-sueldo" className="px-3 py-2 rounded-xl hover:text-white hover:bg-white/5 transition-all flex items-center gap-1.5 border border-transparent hover:border-white/10">
                <Calculator size={14} className="text-emerald-400" />
                <span>Calculadora Sueldo</span>
              </Link>
              <Link href="/comparador-regimenes" className="px-3 py-2 rounded-xl hover:text-white hover:bg-white/5 transition-all flex items-center gap-1.5 border border-transparent hover:border-white/10">
                <Scale size={14} className="text-emerald-400" />
                <span>Comparador CAS</span>
              </Link>
              <Link href="/simulador-entrevista-ia" className="px-3 py-2 rounded-xl hover:text-white hover:bg-white/5 transition-all flex items-center gap-1.5 border border-transparent hover:border-white/10">
                <Bot size={14} className="text-emerald-400" />
                <span>Entrevista IA</span>
              </Link>
              <Link href="/crear-cv-cas" className="px-3 py-2 rounded-xl hover:text-white hover:bg-white/5 transition-all flex items-center gap-1.5 border border-transparent hover:border-white/10">
                <FileSpreadsheet size={14} className="text-emerald-400" />
                <span>Generar CV</span>
              </Link>
              <Link href="/quienes-somos" className="px-3 py-2 rounded-xl hover:text-white hover:bg-white/5 transition-all flex items-center gap-1.5 border border-transparent hover:border-white/10">
                <ShieldCheck size={14} className="text-slate-400" />
                <span>Quiénes Somos</span>
              </Link>
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2 sm:gap-2.5">
              <ChambaThemeToggle />

              <Link
                href="/publicar-empleo"
                className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold text-slate-200 hover:text-emerald-400 transition-all shadow-sm"
              >
                <PlusCircle size={14} className="text-emerald-400" />
                <span>Publicar</span>
              </Link>

              <Link
                href="/empleos"
                className="btn-brand-gradient relative group overflow-hidden px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-black font-display transition-all flex items-center gap-2 shadow-lg"
              >
                <Compass size={16} className="text-white drop-shadow-sm shrink-0" />
                <span className="text-white drop-shadow-sm tracking-tight">Explorar Vacantes</span>
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
                <div className="flex flex-wrap gap-2 text-[11px] font-mono">
                  <Link href="/convocatorias/cas" className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 transition-colors">CAS 1057</Link>
                  <Link href="/convocatorias/728" className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 transition-colors">D.L. 728</Link>
                  <Link href="/convocatorias/privado" className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 transition-colors">Sector Privado</Link>
                  <Link href="/convocatorias/practicas" className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 transition-colors">Prácticas</Link>
                  <Link href="/convocatorias/locacion" className="px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 transition-colors">Locación</Link>
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
                  <li>
                    <Link href="/organizaciones" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                      <Building2 size={12} className="text-emerald-400" />
                      <span>Directorio de Entidades del Estado</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/publicar-empleo" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                      <PlusCircle size={12} className="text-emerald-400" />
                      <span>Publicar Convocatoria (RRHH)</span>
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Col 3: Legal & Cumplimiento Google AdSense */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-200 text-xs uppercase tracking-wider font-mono">
                  Marco Legal y Transparencia
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
                      <span>Contacto y Soporte</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/quienes-somos" className="hover:text-emerald-400 transition-colors flex items-center gap-1.5">
                      <ShieldCheck size={12} className="text-emerald-400" />
                      <span>Quiénes Somos y Manifiesto</span>
                    </Link>
                  </li>
                  <li>
                    <Link href="/empleos?regimen=CAS" className="hover:text-emerald-400 transition-colors">
                      Convocatorias del Estado (CAS)
                    </Link>
                  </li>
                </ul>
              </div>

            </div>

            {/* Regional Linking Hub for Programmatic SEO */}
            <div className="border-t border-slate-900/80 pt-6 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-bold text-slate-300 uppercase tracking-wider">
                  Chamba y Convocatorias por Región en Perú
                </span>
                <Link href="/empleos" className="text-[11px] text-emerald-400 hover:underline">
                  Ver todas las ofertas →
                </Link>
              </div>
              <div className="flex flex-wrap gap-x-3 gap-y-1.5 text-[11px] text-slate-400">
                <Link href="/empleos/en/lima" className="hover:text-emerald-400 transition-colors">Lima</Link>
                <span className="text-slate-700">•</span>
                <Link href="/empleos/en/arequipa" className="hover:text-emerald-400 transition-colors">Arequipa</Link>
                <span className="text-slate-700">•</span>
                <Link href="/empleos/en/callao" className="hover:text-emerald-400 transition-colors">Callao</Link>
                <span className="text-slate-700">•</span>
                <Link href="/empleos/en/cusco" className="hover:text-emerald-400 transition-colors">Cusco</Link>
                <span className="text-slate-700">•</span>
                <Link href="/empleos/en/la-libertad" className="hover:text-emerald-400 transition-colors">La Libertad (Trujillo)</Link>
                <span className="text-slate-700">•</span>
                <Link href="/empleos/en/piura" className="hover:text-emerald-400 transition-colors">Piura</Link>
                <span className="text-slate-700">•</span>
                <Link href="/empleos/en/lambayeque" className="hover:text-emerald-400 transition-colors">Lambayeque (Chiclayo)</Link>
                <span className="text-slate-700">•</span>
                <Link href="/empleos/en/junin" className="hover:text-emerald-400 transition-colors">Junín (Huancayo)</Link>
                <span className="text-slate-700">•</span>
                <Link href="/empleos/en/ancash" className="hover:text-emerald-400 transition-colors">Áncash (Chimbote/Huaraz)</Link>
                <span className="text-slate-700">•</span>
                <Link href="/empleos/en/ica" className="hover:text-emerald-400 transition-colors">Ica</Link>
                <span className="text-slate-700">•</span>
                <Link href="/empleos/en/cajamarca" className="hover:text-emerald-400 transition-colors">Cajamarca</Link>
                <span className="text-slate-700">•</span>
                <Link href="/empleos/en/puno" className="hover:text-emerald-400 transition-colors">Puno</Link>
                <span className="text-slate-700">•</span>
                <Link href="/empleos/en/san-martin" className="hover:text-emerald-400 transition-colors">San Martín (Tarapoto)</Link>
                <span className="text-slate-700">•</span>
                <Link href="/empleos/en/loreto" className="hover:text-emerald-400 transition-colors">Loreto (Iquitos)</Link>
                <span className="text-slate-700">•</span>
                <Link href="/empleos/en/huanuco" className="hover:text-emerald-400 transition-colors">Huánuco</Link>
                <span className="text-slate-700">•</span>
                <Link href="/empleos/en/ayacucho" className="hover:text-emerald-400 transition-colors">Ayacucho</Link>
                <span className="text-slate-700">•</span>
                <Link href="/empleos/en/tacna" className="hover:text-emerald-400 transition-colors">Tacna</Link>
                <span className="text-slate-700">•</span>
                <Link href="/empleos/en/moquegua" className="hover:text-emerald-400 transition-colors">Moquegua</Link>
                <span className="text-slate-700">•</span>
                <Link href="/empleos/en/tumbes" className="hover:text-emerald-400 transition-colors">Tumbes</Link>
                <span className="text-slate-700">•</span>
                <Link href="/empleos/en/ucayali" className="hover:text-emerald-400 transition-colors">Ucayali (Pucallpa)</Link>
                <span className="text-slate-700">•</span>
                <Link href="/empleos/en/pasco" className="hover:text-emerald-400 transition-colors">Pasco</Link>
                <span className="text-slate-700">•</span>
                <Link href="/empleos/en/amazonas" className="hover:text-emerald-400 transition-colors">Amazonas</Link>
                <span className="text-slate-700">•</span>
                <Link href="/empleos/en/apurimac" className="hover:text-emerald-400 transition-colors">Apurímac</Link>
                <span className="text-slate-700">•</span>
                <Link href="/empleos/en/huancavelica" className="hover:text-emerald-400 transition-colors">Huancavelica</Link>
                <span className="text-slate-700">•</span>
                <Link href="/empleos/en/madre-de-dios" className="hover:text-emerald-400 transition-colors">Madre de Dios</Link>
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
        </ChambaGlowWrapper>
      </body>
    </html>
  );
}
