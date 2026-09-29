import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { Space_Grotesk, Inter, IBM_Plex_Mono } from "next/font/google";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#ffffff",
  colorScheme: "light",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('sorteos_theme');
                  if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                    document.documentElement.classList.remove('light');
                  } else {
                    document.documentElement.classList.add('light');
                    document.documentElement.classList.remove('dark');
                  }
                } catch(e) {}
              })();
            `
          }}
        />
        <Script
          id="google-adsense"
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5414009811868137"
          strategy="afterInteractive"
          crossOrigin="anonymous"
        />
      </head>
      <body
        className={`${spaceGrotesk.variable} ${inter.variable} ${ibmPlexMono.variable} min-h-screen flex flex-col bg-[#f8fafc] text-slate-900 dark:bg-[#070a12] dark:text-zinc-100 antialiased selection:bg-pink-500 selection:text-white transition-colors duration-200`}
      >
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
