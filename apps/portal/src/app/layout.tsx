import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import CookieBanner from "@/components/CookieBanner";
import "./globals.css";

const outfit = Outfit({ subsets: ["latin"] });

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className={`${outfit.className} bg-[#0b0c10] text-gray-200 antialiased min-h-screen`}>
        {children}
        <CookieBanner />
      </body>
    </html>
  );
}
