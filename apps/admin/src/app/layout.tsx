import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ATP DEV | Admin CMS",
  description: "Premium Headless CMS Panel",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <body className={`${inter.className} bg-[#0a0a0a] text-gray-200 antialiased h-screen overflow-hidden`}>
        {children}
      </body>
    </html>
  );
}
