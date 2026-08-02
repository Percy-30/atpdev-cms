import type { Metadata } from "next";
import { Outfit } from "next/font/google";

const outfit = Outfit({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ATP DEV | Portafolio Profesional",
  description: "Portafolio de ATP, desarrollador de software y creador de aplicaciones.",
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
      </body>
    </html>
  );
}
