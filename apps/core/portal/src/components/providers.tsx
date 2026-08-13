"use client";

import { ThemeProvider } from "@teispace/next-themes";
import { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="data-theme" defaultTheme="system" enableSystem={true}>
      {children}
    </ThemeProvider>
  );
}
