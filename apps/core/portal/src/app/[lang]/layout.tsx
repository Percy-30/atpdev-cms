import type { Metadata } from "next";
import Script from "next/script";
import CookieBanner from "@/components/CookieBanner";
import AnalyticsTracker from "@/components/AnalyticsTracker";
import { getSiteConfig, translateText } from "@atpdev/database";
import { Providers } from "@/components/providers";
import "../globals.css";

const BASE_URL = "https://www.atpdev.dev";
const OG_IMAGE = `${BASE_URL}/og-image.png`;

const supportedLocales = ['es', 'en', 'ru', 'hi', 'zh', 'fr', 'de', 'pt', 'ja'];

function localeToOgLocale(lang: string) {
  const map: Record<string, string> = {
    es: "es_PE", en: "en_US", ru: "ru_RU", hi: "hi_IN",
    zh: "zh_CN", fr: "fr_FR", de: "de_DE", pt: "pt_PT", ja: "ja_JP",
  };
  return map[lang] ?? "es_PE";
}

export async function generateMetadata(
  { params }: { params: Promise<{ lang: string }> }
): Promise<Metadata> {
  const { lang = 'es' } = await params;
  const config = await getSiteConfig();

  const titleBase = "Percy Acha Taipe | ATP Dev – Android & Fullstack Developer";
  const descBase = config?.bio_short ?? "Ingeniero de Sistemas. Android, Next.js, Supabase e IA. Apps en Google Play. Disponible para proyectos freelance.";
  
  const title = lang === 'es' ? titleBase : await translateText(titleBase, lang);
  const description = lang === 'es' ? descBase : await translateText(descBase, lang);

  const path = lang === 'es' ? '' : `/${lang}`;
  
  return {
    metadataBase: new URL(BASE_URL),
    title: {
      default: title,
      template: "%s | ATP Dev",
    },
    description,
    keywords: [
      "Percy Acha Taipe", "ATP Dev", "Android Developer", "Fullstack Developer",
      "Next.js", "Kotlin", "Supabase", "Inteligencia Artificial", "Portafolio", "Freelance Perú",
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
      canonical: `${BASE_URL}${path}`,
      languages: Object.fromEntries(
        supportedLocales.map(l => [l, `${BASE_URL}${l === 'es' ? '' : '/' + l}`])
      ),
    },
    openGraph: {
      type: "website",
      locale: localeToOgLocale(lang),
      url: `${BASE_URL}${path}`,
      siteName: "ATP Dev – Portafolio",
      title,
      description,
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
      title,
      description,
      images: [OG_IMAGE],
    },
  };
}

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
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}>) {
  const { lang = 'es' } = await params;
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
    <html lang={lang} className="scroll-smooth" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href={googleFontsUrl} rel="stylesheet" />
        <style dangerouslySetInnerHTML={{
          __html: `
            :root {
              --background: #f2f2f2;
              --foreground: #1a1a1a;
              --primary: ${primary};
              --secondary: ${secondary};
              --tertiary: ${tertiary};
              --neutral: ${neutral};
              --radius-scale: ${radiusValue};
              --font-heading: '${fontHeadline}', sans-serif;
              --font-body: '${fontBody}', sans-serif;
              --font-label: '${fontLabel}', monospace;
              
              /* Liquid Glass Light */
              --bg1: color-mix(in srgb, ${primary} 15%, #ffffff);
              --bg2: color-mix(in srgb, ${secondary} 15%, #f8f9fa);
              --bg3: color-mix(in srgb, ${tertiary} 15%, #ffffff);
              --glass-bg: rgba(255, 255, 255, 0.4);
              --glass-border: rgba(255, 255, 255, 0.6);
              --pill-bg: rgba(255, 255, 255, 0.55);
              --text-color: #1a1a1a;
            }
            [data-theme="dark"] {
              --background: #0A0A0A;
              --foreground: #EDEDED;
              
              /* Liquid Glass Dark (Color-mixed with black for depth) */
              --bg1: color-mix(in srgb, ${primary} 12%, #000000);
              --bg2: color-mix(in srgb, ${secondary} 12%, #020202);
              --bg3: color-mix(in srgb, ${tertiary} 12%, #000000);
              --glass-bg: rgba(20, 20, 30, 0.45);
              --glass-border: rgba(255, 255, 255, 0.15);
              --pill-bg: rgba(255, 255, 255, 0.18);
              --text-color: #ffffff;
            }
          `
        }} />
      </head>
      <body className={`font-sans antialiased min-h-screen`} suppressHydrationWarning>
        <Providers>
          <AnalyticsTracker />
          {children}
          <CookieBanner />
        </Providers>
        {/* JSON-LD Schema (Pro SEO) */}
        <Script
          id="json-ld-schema"
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
                "jobTitle": await translateText("Fullstack & Android Developer", lang),
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
                "description": await translateText("Portafolio Profesional de Percy Acha Taipe, Ingeniero de Sistemas y Desarrollador.", lang)
              }
            ])
          }}
        />
      </body>
    </html>
  );
}
