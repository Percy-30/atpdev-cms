"use client";

import { useEffect } from "react";

// Development safeguard: Suppress false-positive React 19 inline script warnings
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  const origError = console.error;
  console.error = (...args: unknown[]) => {
    if (
      typeof args[0] === "string" &&
      (args[0].includes("Encountered a script tag while rendering React component") ||
        args[0].includes("Scripts inside React components are never executed"))
    ) {
      return;
    }
    origError.apply(console, args);
  };
}

export function SorteosThemeListener() {
  useEffect(() => {
    const applyPayload = (payload: any, broadcast = false) => {
      if (!payload || typeof payload !== "object") return;

      const accent = payload.accent_color || payload.primary || payload.primary_color;
      const mode = payload.theme_mode || payload.mode;
      const fontH = payload.font_headline || payload.fontHeadline;
      const fontB = payload.font_body || payload.fontBody;
      const fontL = payload.font_label || payload.fontLabel;
      const radiusScale = payload.radius_scale || payload.radiusScale;
      const neonThick = payload.neon_thickness || payload.neonThickness;
      const bgImage = payload.global_background_image !== undefined 
        ? payload.global_background_image 
        : payload.globalBackgroundImage;

      // 1. Dynamic accent color with high-contrast safety
      if (accent) {
        let isLight = false;
        let isVeryDark = false;
        try {
          const c = accent.replace("#", "");
          const r = parseInt(c.substring(0, 2), 16) || 0;
          const g = parseInt(c.substring(2, 4), 16) || 0;
          const b = parseInt(c.substring(4, 6), 16) || 0;
          const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
          isLight = lum > 0.65;
          isVeryDark = lum < 0.15;
        } catch {}

        const btnTextColor = isLight ? "#09090b" : "#ffffff";
        const textAccent = (mode !== "light" && isVeryDark) ? "#ffffff" : accent;

        document.documentElement.style.setProperty("--accent-primary", accent, "important");
        document.documentElement.style.setProperty("--primary", accent, "important");
        document.documentElement.style.setProperty("--primary-contrast", btnTextColor, "important");
        document.documentElement.style.setProperty("--accent-purple", accent, "important");
        document.documentElement.style.setProperty("--accent-pink", payload.secondary_color || accent, "important");

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
            --primary-contrast: ${btnTextColor} !important;
            --accent-purple: ${accent} !important;
            --accent-pink: ${payload.secondary_color || accent} !important;
          }
          .bg-pink-600,
          .bg-pink-500,
          .bg-\\[\\#d91a7a\\],
          .btn-pro-primary,
          button.bg-\\[\\#d91a7a\\],
          a.btn-pro-primary {
            background-color: ${accent} !important;
            color: ${btnTextColor} !important;
            border-color: ${accent} !important;
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
            background-color: ${accent} !important;
            color: ${btnTextColor} !important;
            filter: brightness(0.9) !important;
          }
          .text-pink-600,
          .text-pink-500,
          .text-pink-400,
          .text-\\[\\#d91a7a\\] {
            color: ${textAccent} !important;
          }
          .border-pink-600,
          .border-pink-500,
          .border-\\[\\#d91a7a\\] {
            border-color: ${accent} !important;
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

      // 2. Interaction lab effects
      const glow = payload.glow_style || payload.glowStyle;
      if (glow !== undefined) {
        document.body.setAttribute("data-interaction", glow);
      }

      const cursor = payload.cursor_effect || payload.cursorEffect;
      if (cursor !== undefined) {
        document.body.setAttribute("data-cursor", cursor);
      }

      // 3. Dark / Light mode
      if (mode === "light" || mode === "dark") {
        try {
          localStorage.setItem("sorteos_theme", mode);
          localStorage.setItem("sorteos_server_theme", mode);
        } catch {}

        if (mode === "light") {
          document.documentElement.classList.add("light");
          document.documentElement.classList.remove("dark");
          document.body?.classList.add("light");
          document.body?.classList.remove("dark");
        } else {
          document.documentElement.classList.add("dark");
          document.documentElement.classList.remove("light");
          document.body?.classList.add("dark");
          document.body?.classList.remove("light");
        }

        window.dispatchEvent(new CustomEvent("sorteos_theme_mode_change", { detail: mode }));
      }

      // 4. Background image / gradient
      if (bgImage !== undefined) {
        let bgStyle = document.getElementById("sorteos-live-bg") as HTMLStyleElement;
        if (!bgStyle) {
          bgStyle = document.createElement("style");
          bgStyle.id = "sorteos-live-bg";
          document.head.appendChild(bgStyle);
        }

        if (bgImage) {
          document.body.setAttribute("data-has-custom-bg", "true");
          document.body.style.backgroundImage = `url("${bgImage}")`;
          document.body.style.backgroundSize = "cover";
          document.body.style.backgroundPosition = "center";
          document.body.style.backgroundAttachment = "fixed";
          document.body.style.backgroundRepeat = "no-repeat";

          bgStyle.innerHTML = `
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
          `;
        } else {
          document.body.setAttribute("data-has-custom-bg", "false");
          document.body.style.backgroundImage = "";
          bgStyle.innerHTML = "";
        }
      }

      // 5. Fonts
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

      if (fontH || fontB || fontL) {
        const fonts = [fontH, fontB, fontL].filter(Boolean);
        const fontUrl = `https://fonts.googleapis.com/css2?${fonts.map((f: string) => `family=${f.replace(/ /g, '+')}:wght@400;500;600;700;800;900`).join('&')}&display=swap`;
        
        let link = document.getElementById("sorteos-preview-fonts") as HTMLLinkElement;
        if (!link) {
          link = document.createElement("link");
          link.id = "sorteos-preview-fonts";
          link.rel = "stylesheet";
          document.head.appendChild(link);
        }
        link.href = fontUrl;
      }

      // 6. Radius
      if (radiusScale) {
        const pxVal = radiusScale === 'none' ? '0px' : radiusScale === 'small' ? '0.75rem' : radiusScale === 'medium' ? '1rem' : '1.5rem';
        document.documentElement.style.setProperty("--radius-scale", pxVal);
      }

      // 7. Neon thickness
      if (neonThick) {
        document.documentElement.style.setProperty("--neon-thickness", neonThick, "important");
        const glowPx = neonThick === "2px" ? "10px" : neonThick === "4px" ? "18px" : neonThick === "6px" ? "26px" : "36px";
        document.documentElement.style.setProperty("--neon-glow", glowPx, "important");
      }

      // Broadcast to other tabs if requested
      if (broadcast && typeof window !== "undefined" && "BroadcastChannel" in window) {
        try {
          const bc = new BroadcastChannel("sorteos_theme_channel");
          bc.postMessage({ type: "UPDATE_SORTEOS_THEME", payload });
          bc.close();
        } catch {}
      }
    };

    // Initial check from server configuration
    try {
      const serverTheme = document.documentElement.getAttribute("data-server-theme") as 'light' | 'dark' | null;
      const isDocDark = document.documentElement.classList.contains("dark");
      const saved = localStorage.getItem("sorteos_theme") as 'light' | 'dark' | null;
      const currentMode = saved || serverTheme || (isDocDark ? "dark" : "light");

      if (currentMode === "light") {
        document.documentElement.classList.add("light");
        document.documentElement.classList.remove("dark");
        document.body?.classList.add("light");
        document.body?.classList.remove("dark");
      } else {
        document.documentElement.classList.add("dark");
        document.documentElement.classList.remove("light");
        document.body?.classList.add("dark");
        document.body?.classList.remove("light");
      }
    } catch {}

    // Check theme from API to ensure fresh sync
    const checkApiTheme = async () => {
      try {
        const res = await fetch("/api/theme", { cache: "no-store" });
        if (!res.ok) return;
        const data = await res.json();
        if (data.success && data.theme) {
          applyPayload(data.theme, false);
        }
      } catch {}
    };
    checkApiTheme();

    // Listen to postMessage from admin iframe
    const handleMessage = (e: MessageEvent) => {
      if (!e.data) return;
      if (e.data.type === "UPDATE_SORTEOS_THEME" || e.data.type === "UPDATE_THEME_PREVIEW") {
        applyPayload(e.data.payload || {}, true);
      }
    };
    window.addEventListener("message", handleMessage);

    // Listen to BroadcastChannel from other tabs
    let bc: BroadcastChannel | null = null;
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      try {
        bc = new BroadcastChannel("sorteos_theme_channel");
        bc.onmessage = (event) => {
          if (event.data && (event.data.type === "UPDATE_SORTEOS_THEME" || event.data.type === "UPDATE_THEME_PREVIEW")) {
            applyPayload(event.data.payload || {}, false);
          }
        };
      } catch {}
    }

    // Refresh on focus or visibility change
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        checkApiTheme();
      }
    };
    window.addEventListener("focus", checkApiTheme);
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      window.removeEventListener("message", handleMessage);
      window.removeEventListener("focus", checkApiTheme);
      document.removeEventListener("visibilitychange", handleVisibility);
      if (bc) {
        bc.close();
      }
    };
  }, []);

  return null;
}
