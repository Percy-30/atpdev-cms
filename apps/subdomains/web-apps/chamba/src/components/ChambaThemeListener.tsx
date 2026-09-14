"use client";

import { useEffect } from "react";

export function ChambaThemeListener() {
  useEffect(() => {
    // Check saved mode from local storage on mount
    try {
      const savedMode = localStorage.getItem("chamba_theme_mode");
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

    const handleMessage = (e: MessageEvent) => {
      if (e.data && (e.data.type === "UPDATE_CHAMBA_THEME" || e.data.type === "UPDATE_THEME_PREVIEW")) {
        const payload = e.data.payload || {};
        
        const accent = payload.accent_color || payload.primary || payload.primary_color;
        const mode = payload.theme_mode || payload.mode;
        const fontH = payload.font_headline || payload.fontHeadline;
        const fontB = payload.font_body || payload.fontBody;
        const fontL = payload.font_label || payload.fontLabel;
        const radiusScale = payload.radius_scale || payload.radiusScale;
        const glow = payload.glow_style || payload.glowStyle;
        const neonThick = payload.neon_thickness || payload.neonThickness;
        const bgImage = payload.global_background_image || payload.globalBackgroundImage;

        if (accent) {
          document.documentElement.style.setProperty("--accent-emerald", accent, "important");
          document.documentElement.style.setProperty("--accent-primary", accent, "important");
          document.documentElement.style.setProperty("--primary", accent, "important");

          let dynamicStyle = document.getElementById("chamba-live-accent") as HTMLStyleElement;
          if (!dynamicStyle) {
            dynamicStyle = document.createElement("style");
            dynamicStyle.id = "chamba-live-accent";
            document.head.appendChild(dynamicStyle);
          }
          dynamicStyle.innerHTML = `
            :root {
              --accent-emerald: ${accent} !important;
              --accent-primary: ${accent} !important;
              --primary: ${accent} !important;
            }
          `;
        }

        if (payload.secondary || payload.secondary_color) {
          document.documentElement.style.setProperty("--secondary", payload.secondary || payload.secondary_color);
        }
        if (payload.tertiary || payload.tertiary_color) {
          document.documentElement.style.setProperty("--tertiary", payload.tertiary || payload.tertiary_color);
        }
        if (payload.neutral || payload.neutral_color) {
          document.documentElement.style.setProperty("--neutral", payload.neutral || payload.neutral_color);
        }

        if (mode) {
          try {
            localStorage.setItem("chamba_theme_mode", mode);
          } catch {}
          if (mode === "light") {
            document.documentElement.classList.add("light");
            document.documentElement.classList.remove("dark");
          } else {
            document.documentElement.classList.add("dark");
            document.documentElement.classList.remove("light");
          }
        }

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

        // Dynamically load Google Fonts if specified
        if (fontH || fontB || fontL) {
          const fonts = [fontH, fontB, fontL].filter(Boolean);
          const fontUrl = `https://fonts.googleapis.com/css2?${fonts.map(f => `family=${f.replace(/ /g, '+')}:wght@400;500;600;700;800;900`).join('&')}&display=swap`;
          
          let link = document.getElementById("chamba-preview-fonts") as HTMLLinkElement;
          if (!link) {
            link = document.createElement("link");
            link.id = "chamba-preview-fonts";
            link.rel = "stylesheet";
            document.head.appendChild(link);
          }
          link.href = fontUrl;
        }

        if (radiusScale) {
          const pxVal = radiusScale === 'none' ? '0px' : radiusScale === 'small' ? '0.375rem' : radiusScale === 'medium' ? '1rem' : '9999px';
          document.documentElement.style.setProperty("--radius-scale", pxVal);
        }

        if (glow) {
          document.body.setAttribute("data-interaction", glow);
        }

        if (neonThick) {
          document.documentElement.style.setProperty("--neon-thickness", neonThick);
          const glowPx = neonThick === "2px" ? "10px" : neonThick === "4px" ? "18px" : neonThick === "6px" ? "26px" : "36px";
          document.documentElement.style.setProperty("--neon-glow", glowPx);
        }

        if (bgImage !== undefined) {
          if (bgImage) {
            document.body.style.backgroundImage = `url("${bgImage}")`;
            document.body.style.backgroundSize = "cover";
            document.body.style.backgroundPosition = "center";
          } else {
            document.body.style.backgroundImage = "";
          }
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return null;
}
