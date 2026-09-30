"use client";

import { useEffect } from "react";

export function SorteosThemeListener() {
  useEffect(() => {
    // 1. Initial local theme mode check
    try {
      const savedMode = localStorage.getItem("sorteos_theme");
      if (savedMode === "light") {
        document.documentElement.classList.add("light");
        document.documentElement.classList.remove("dark");
      } else if (savedMode === "dark") {
        document.documentElement.classList.add("dark");
        document.documentElement.classList.remove("light");
      }
    } catch {
      // ignore
    }

    // 2. Real-time postMessage listener from admin.atpdev.dev or localhost admin
    const handleMessage = (e: MessageEvent) => {
      if (!e.data) return;
      if (e.data.type === "UPDATE_SORTEOS_THEME" || e.data.type === "UPDATE_THEME_PREVIEW") {
        const payload = e.data.payload || {};

        const accent = payload.accent_color || payload.primary || payload.primary_color;
        const mode = payload.theme_mode || payload.mode;
        const fontH = payload.font_headline || payload.fontHeadline;
        const fontB = payload.font_body || payload.fontBody;
        const fontL = payload.font_label || payload.fontLabel;
        const radiusScale = payload.radius_scale || payload.radiusScale;
        const radiusStyle = payload.radius_style;

        // Apply dynamic accent color
        if (accent) {
          document.documentElement.style.setProperty("--accent-primary", accent, "important");
          document.documentElement.style.setProperty("--primary", accent, "important");

          let dynamicStyle = document.getElementById("sorteos-live-accent") as HTMLStyleElement;
          if (!dynamicStyle) {
            dynamicStyle = document.createElement("style");
            dynamicStyle.id = "sorteos-live-accent";
            document.head.appendChild(dynamicStyle);
          }
          dynamicStyle.innerHTML = `
            :root {
              --accent-primary: ${accent} !important;
              --primary: ${accent} !important;
            }
          `;
        }

        // Apply dark / light mode
        if (mode) {
          try {
            localStorage.setItem("sorteos_theme", mode);
          } catch {}
          if (mode === "light") {
            document.documentElement.classList.add("light");
            document.documentElement.classList.remove("dark");
          } else {
            document.documentElement.classList.add("dark");
            document.documentElement.classList.remove("light");
          }
        }

        // Apply fonts
        if (fontH) {
          document.documentElement.style.setProperty("--font-space", `"${fontH}", sans-serif`);
          document.documentElement.style.setProperty("--font-heading", `"${fontH}", sans-serif`);
        }
        if (fontB) {
          document.documentElement.style.setProperty("--font-inter", `"${fontB}", sans-serif`);
          document.documentElement.style.setProperty("--font-body", `"${fontB}", sans-serif`);
        }
        if (fontL) {
          document.documentElement.style.setProperty("--font-mono", `"${fontL}", monospace`);
          document.documentElement.style.setProperty("--font-label", `"${fontL}", monospace`);
        }

        // Apply radius
        if (radiusScale) {
          const pxVal = radiusScale === 'none' ? '0px' : radiusScale === 'small' ? '0.375rem' : radiusScale === 'medium' ? '1rem' : '9999px';
          document.documentElement.style.setProperty("--radius-scale", pxVal);
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return null;
}
