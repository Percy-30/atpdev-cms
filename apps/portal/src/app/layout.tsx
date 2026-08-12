import type { Metadata } from "next";
import CookieBanner from "@/components/CookieBanner";
import AnalyticsTracker from "@/components/AnalyticsTracker";
import { getSiteConfig } from "@atpdev/database";
import "./globals.css";

const BASE_URL = "https://www.atpdev.dev";
const OG_IMAGE = `${BASE_URL}/og-image.png`;

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "Percy Acha Taipe | ATP Dev – Android & Fullstack Developer",
    template: "%s | ATP Dev",
  },
  description:
    "Percy Acha Taipe (ATP Dev) – Ingeniero de Sistemas. Android, Next.js, Supabase e IA. Apps en Google Play. Disponible para proyectos freelance.",
  keywords: [
    "Percy Acha Taipe",
    "ATP Dev",
    "Android Developer",
    "Fullstack Developer",
    "Next.js",
    "Kotlin",
    "Supabase",
    "Inteligencia Artificial",
    "Portafolio",
    "Freelance Perú",
  ],
  authors: [{ name: "Percy Acha Taipe", url: BASE_URL }],
  creator: "Percy Acha Taipe",
  publisher: "ATP Dev",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "xLX9HT_roi66Iips-tYL5paIvBDDP_EftOni_R9KyYw",
  },
  alternates: {
    canonical: BASE_URL,
  },
  openGraph: {
    type: "website",
    locale: "es_PE",
    url: BASE_URL,
    siteName: "ATP Dev – Portafolio",
    title: "Percy Acha Taipe | ATP Dev – Android & Fullstack Developer",
    description:
      "Ingeniero de Sistemas especializado en Android, Next.js, Supabase e IA. Creador de apps en Google Play con más de 10,000 instalaciones. Disponible para proyectos freelance.",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "ATP Dev – Portafolio Profesional de Percy Acha Taipe",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@atpdev",
    creator: "@atpdev",
    title: "Percy Acha Taipe | ATP Dev – Android & Fullstack Developer",
    description:
      "Ingeniero de Sistemas especializado en Android, Next.js, Supabase e IA. Disponible para proyectos freelance.",
    images: [OG_IMAGE],
  },
};

// Map radius string to CSS scale value
function getRadiusValue(scale: string) {
  switch (scale) {
    case "none": return "0rem";
    case "small": return "0.25rem";
    case "medium": return "0.75rem";
    case "full": return "9999px";
    default: return "0.75rem";
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const config = await getSiteConfig();

  // Valores por defecto
  const fontHeadline = config?.font_headline || "Hanken Grotesk";
  const fontBody = config?.font_body || "Inter";
  const fontLabel = config?.font_label || "JetBrains Mono";
  
  const primary = config?.primary_color || "#0052FF";
  const secondary = config?.secondary_color || "#1A1A1A";
  const tertiary = config?.tertiary_color || "#262626";
  const neutral = config?.neutral_color || "#8A8A8A";
  
  const isDark = (config?.theme_mode || "dark") === "dark";
  const background = isDark ? "#0A0A0A" : "#F9FAFB";
  const foreground = isDark ? "#EDEDED" : "#111827";

  const radiusValue = getRadiusValue(config?.radius_scale || "medium");

  // Crear URL de Google Fonts dinámicamente
  const fonts = Array.from(new Set([fontHeadline, fontBody, fontLabel]));
  const googleFontsUrl = `https://fonts.googleapis.com/css2?${fonts.map(f => `family=${f.replace(/ /g, '+')}:wght@400;500;600;700;800`).join('&')}&display=swap`;

  return (
    <html lang="es" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href={googleFontsUrl} rel="stylesheet" />
        <style dangerouslySetInnerHTML={{
          __html: `
            :root {
              --background: ${background};
              --foreground: ${foreground};
              --primary: ${primary};
              --secondary: ${secondary};
              --tertiary: ${tertiary};
              --neutral: ${neutral};
              --radius-scale: ${radiusValue};
              --font-heading: '${fontHeadline}', sans-serif;
              --font-body: '${fontBody}', sans-serif;
              --font-label: '${fontLabel}', monospace;
            }
          `
        }} />
      </head>
      <body className={`font-sans antialiased min-h-screen`}>
        <AnalyticsTracker />
        {children}
        <CookieBanner />
        {/* JSON-LD Schema (Pro SEO) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "Person",
                "name": config?.full_name || "Percy Acha Taipe",
                "alternateName": "ATP Dev",
                "url": BASE_URL,
                "image": config?.avatar_url || OG_IMAGE,
                "jobTitle": "Fullstack & Android Developer",
                "sameAs": [
                  config?.github_url,
                  config?.linkedin_url
                ].filter(Boolean)
              },
              {
                "@context": "https://schema.org",
                "@type": "WebSite",
                "name": "ATP Dev",
                "url": BASE_URL,
                "description": "Portafolio Profesional de Percy Acha Taipe, Ingeniero de Sistemas y Desarrollador."
              }
            ])
          }}
        />
      </body>
    </html>
  );
}
