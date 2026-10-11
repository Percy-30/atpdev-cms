import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Space_Grotesk, Inter, IBM_Plex_Mono } from "next/font/google";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { LanguageProvider } from "@/context/LanguageContext";
import { SorteosThemeListener } from "@/components/SorteosThemeListener";
import { SorteosGlowWrapper } from "@/components/SorteosGlowWrapper";
import { SorteosCustomCursor } from "@/components/SorteosCustomCursor";
import { getSubdomainConfig } from "@atpdev/database";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#070a12",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

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
  metadataBase: new URL('https://sorteos.atpdev.pe'),
  title: {
    default: "Sorteos Pro — Plataforma SaaS de Sorteos Verificables en Redes Sociales",
    template: "%s | Sorteos Pro",
  },
  description:
    "Crea sorteos transparentes y certificados en Instagram, Facebook y YouTube en menos de 3 minutos. Herramientas gratis de ruleta, lista de nombres, dados y monedas con hash criptográfico anti-fraude.",
  keywords: [
    "sorteos instagram",
    "hacer sorteo instagram gratis",
    "sorteos facebook",
    "ruleta aleatoria",
    "sorteo de nombres",
    "generador de ganadores",
    "sorteos youtube comentarios",
    "sorteo certificado",
    "sorteos online"
  ],
  other: {
    "google-adsense-account": "ca-pub-5414009811868137",
  },
  icons: {
    icon: "/icon.svg",
  },
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const config = getSubdomainConfig("sorteos");
  const theme = config.theme || ({} as any);
  const accentHex = theme.accent_color || theme.primary_color || "#8b5cf6";
  const neonThickness = theme.neon_thickness || "4px";
  const neonGlow = neonThickness === "2px" ? "10px" : neonThickness === "4px" ? "18px" : neonThickness === "6px" ? "26px" : "36px";
  const radiusScale = theme.radius_scale === 'none' ? '0px' : theme.radius_scale === 'small' ? '0.75rem' : theme.radius_scale === 'medium' ? '1rem' : '1.5rem';
  const defaultMode = theme.theme_mode === 'light' ? 'light' : 'dark';
  const bgImage = theme.global_background_image || '';

  let isLightAccent = false;
  try {
    const c = accentHex.replace('#', '');
    const r = parseInt(c.substring(0, 2), 16) || 0;
    const g = parseInt(c.substring(2, 4), 16) || 0;
    const b = parseInt(c.substring(4, 6), 16) || 0;
    const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    isLightAccent = lum > 0.65;
  } catch {}
  const btnTextColor = isLightAccent ? '#09090b' : '#ffffff';

  return (
    <html
      lang="es"
      className={`${defaultMode} ${spaceGrotesk.variable} ${inter.variable} ${ibmPlexMono.variable}`}
      data-server-theme={defaultMode}
      suppressHydrationWarning
    >
      <head>
        {/* Dynamic Subdomain Theme Custom Properties (SSR Hydration) */}
        <style id="sorteos-ssr-theme" dangerouslySetInnerHTML={{
          __html: `
            :root {
              --primary: ${accentHex} !important;
              --accent-primary: ${accentHex} !important;
              --primary-contrast: ${btnTextColor} !important;
              --accent-purple: ${accentHex} !important;
              --accent-pink: ${theme.secondary_color || '#ec4899'} !important;
              --secondary: ${theme.secondary_color || '#ec4899'};
              --tertiary: ${theme.tertiary_color || '#f59e0b'};
              --neutral: ${theme.neutral_color || '#070a12'};
              --neon-thickness: ${neonThickness} !important;
              --neon-glow: ${neonGlow} !important;
              --radius-scale: ${radiusScale};
              ${theme.font_headline ? `--font-space: "${theme.font_headline}", sans-serif; --font-heading: "${theme.font_headline}", sans-serif;` : ''}
              ${theme.font_body ? `--font-inter: "${theme.font_body}", sans-serif; --font-body: "${theme.font_body}", sans-serif;` : ''}
              ${theme.font_label ? `--font-mono: "${theme.font_label}", monospace; --font-label: "${theme.font_label}", monospace;` : ''}
            }
            .bg-pink-600,
            .bg-pink-500,
            .bg-\\[\\#d91a7a\\],
            .btn-pro-primary,
            button.bg-\\[\\#d91a7a\\],
            a.btn-pro-primary {
              background-color: ${accentHex} !important;
              border-color: ${accentHex} !important;
              color: ${btnTextColor} !important;
            }
            .btn-pro-primary *,
            .bg-\\[\\#d91a7a\\] *,
            .bg-pink-600 *,
            .bg-pink-500 * {
              color: ${btnTextColor} !important;
              stroke: ${btnTextColor} !important;
            }
            .hover\\:bg-\\[\\#c2186b\\]:hover,
            .hover\\:bg-\\[\\#d91a7a\\]:hover,
            .hover\\:bg-pink-600:hover,
            .hover\\:bg-pink-700:hover {
              background-color: ${accentHex} !important;
              filter: brightness(0.9) !important;
            }
            .text-pink-600,
            .text-pink-500,
            .text-pink-400,
            .text-\\[\\#d91a7a\\] {
              color: ${accentHex} !important;
            }
            .border-pink-600,
            .border-pink-500,
            .border-\\[\\#d91a7a\\] {
              border-color: ${accentHex} !important;
            }
            ${bgImage ? `
            body,
            .dark body,
            body[data-has-custom-bg="true"],
            .dark body[data-has-custom-bg="true"] {
              background-image: url("${bgImage}") !important;
              background-size: cover !important;
              background-position: center !important;
              background-attachment: fixed !important;
              background-repeat: no-repeat !important;
            }
            ` : ''}
          `
        }} />
        {/* Dynamically Load Google Fonts if customized */}
        {(theme.font_headline || theme.font_body || theme.font_label) && (
          <link
            id="sorteos-ssr-fonts"
            rel="stylesheet"
            href={`https://fonts.googleapis.com/css2?${[theme.font_headline, theme.font_body, theme.font_label].filter((f: any): f is string => Boolean(f)).map((f: string) => `family=${f.replace(/ /g, '+')}:wght@400;500;600;700;800;900`).join('&')}&display=swap`}
          />
        )}
      </head>
      <body
        suppressHydrationWarning
        data-interaction={theme.glow_style || "spotlight-border"}
        data-cursor={theme.cursor_effect || "cursor-default"}
        data-has-custom-bg={bgImage ? "true" : "false"}
        style={bgImage ? {
          backgroundImage: `url("${bgImage}")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          backgroundRepeat: 'no-repeat'
        } : undefined}
        className="min-h-screen flex flex-col bg-[#f8fafc] text-slate-900 dark:bg-[#070a12] dark:text-zinc-100 antialiased selection:bg-pink-500 selection:text-white transition-colors duration-200"
      >
        <Script
          id="theme-lang-init"
          src="/theme-init.js"
          strategy="beforeInteractive"
        />
        <Script
          id="google-adsense"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5414009811868137"
          strategy="afterInteractive"
          crossOrigin="anonymous"
        />
        <SorteosThemeListener />
        <SorteosCustomCursor />
        <LanguageProvider>
          {/* Top Announcement Bar if configured */}
          {config.branding?.announcement_enabled && (
            <div 
              className="announcement-bar relative overflow-hidden text-xs font-semibold py-2 px-4 text-center flex items-center justify-center gap-2.5 border-b print:hidden transition-colors"
              style={{
                backgroundColor: `color-mix(in srgb, ${accentHex} 12%, transparent)`,
                borderColor: `color-mix(in srgb, ${accentHex} 30%, transparent)`,
                color: `var(--text-main, #ffffff)`
              }}
            >
              <span>{config.branding.announcement_text || '🎉 Sorteos ilimitados con Ruleta, Dados, Moneda, Equipos y Números 100% gratis.'}</span>
            </div>
          )}
          <Navbar />
          <SorteosGlowWrapper className="flex-1 flex flex-col">
            <main className="flex-1">
              {children}
            </main>
          </SorteosGlowWrapper>
          <Footer />
        </LanguageProvider>
      </body>
    </html>
  );
}
