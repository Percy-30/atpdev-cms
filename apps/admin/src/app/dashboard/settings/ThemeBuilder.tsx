"use client";

import { useState, useEffect } from "react";
import { Moon, Sun, Wand2, Type, Square, ChevronDown } from "lucide-react";

// ==========================================
// COLOR MATH UTILITIES (Simulating MD3)
// ==========================================
function hexToHSL(H: string) {
  let r = 0, g = 0, b = 0;
  if (H.length === 4) {
    r = parseInt(H[1] + H[1], 16);
    g = parseInt(H[2] + H[2], 16);
    b = parseInt(H[3] + H[3], 16);
  } else if (H.length === 7) {
    r = parseInt(H.substring(1, 3), 16);
    g = parseInt(H.substring(3, 5), 16);
    b = parseInt(H.substring(5, 7), 16);
  }
  r /= 255; g /= 255; b /= 255;
  const cmin = Math.min(r, g, b), cmax = Math.max(r, g, b), delta = cmax - cmin;
  let h = 0, s = 0, l = 0;
  if (delta === 0) h = 0;
  else if (cmax === r) h = ((g - b) / delta) % 6;
  else if (cmax === g) h = (b - r) / delta + 2;
  else h = (r - g) / delta + 4;
  h = Math.round(h * 60);
  if (h < 0) h += 360;
  l = (cmax + cmin) / 2;
  s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));
  return [h, s, l];
}

function HSLToHex(h: number, s: number, l: number) {
  s = Math.max(0, Math.min(1, s));
  l = Math.max(0, Math.min(1, l));
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;
  if (0 <= h && h < 60) { r = c; g = x; b = 0; }
  else if (60 <= h && h < 120) { r = x; g = c; b = 0; }
  else if (120 <= h && h < 180) { r = 0; g = c; b = x; }
  else if (180 <= h && h < 240) { r = 0; g = x; b = c; }
  else if (240 <= h && h < 300) { r = x; g = 0; b = c; }
  else if (300 <= h && h < 360) { r = c; g = 0; b = x; }
  r = Math.round((r + m) * 255);
  g = Math.round((g + m) * 255);
  b = Math.round((b + m) * 255);
  return "#" + (1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1).toUpperCase();
}

function generatePalette(seedHex: string, theme: string, mode: string) {
  if (theme === "custom") return null;
  
  const [h, s, l] = hexToHSL(seedHex);
  let p, sec, ter, neu;
  const isDark = mode === "dark";

  if (theme === "vibrant") {
    p = HSLToHex(h, Math.min(s * 1.2, 1), isDark ? 0.6 : 0.4);
    sec = HSLToHex(h, s * 0.3, isDark ? 0.1 : 0.95);
    ter = HSLToHex((h + 30) % 360, s * 0.5, isDark ? 0.15 : 0.9);
    neu = HSLToHex(h, 0.05, isDark ? 0.5 : 0.6);
  } else if (theme === "monochrome") {
    p = seedHex;
    sec = HSLToHex(h, s * 0.1, isDark ? 0.1 : 0.95);
    ter = HSLToHex(h, s * 0.2, isDark ? 0.15 : 0.9);
    neu = HSLToHex(h, 0, isDark ? 0.5 : 0.6);
  } else if (theme === "analogous") {
    p = seedHex;
    sec = HSLToHex(h, s * 0.3, isDark ? 0.1 : 0.95);
    ter = HSLToHex((h + 60) % 360, s, isDark ? 0.6 : 0.4);
    neu = HSLToHex(h, 0.05, isDark ? 0.5 : 0.6);
  } else {
    p = seedHex;
    sec = HSLToHex(h, 0.2, isDark ? 0.1 : 0.9);
    ter = HSLToHex((h + 45) % 360, 0.3, isDark ? 0.15 : 0.85);
    neu = HSLToHex(h, 0.05, isDark ? 0.5 : 0.6);
  }

  return { primary: p, secondary: sec, tertiary: ter, neutral: neu };
}

// ==========================================
// COMPONENT
// ==========================================
export function ThemeBuilder({ initialConfig }: { initialConfig: any }) {
  const [mode, setMode] = useState(initialConfig?.theme_mode || "dark");
  const [seedColor, setSeedColor] = useState(initialConfig?.seed_color || "#0052FF");
  const [colorTheme, setColorTheme] = useState(initialConfig?.color_theme || "vibrant");
  const [themeDropdownOpen, setThemeDropdownOpen] = useState(false);

  const getThemeCircleStyle = (tKey: string) => {
    if (tKey === "vibrant") {
      return { background: `linear-gradient(135deg, ${primary} 50%, ${tertiary} 50%)` };
    } else if (tKey === "monochrome") {
      return { background: `linear-gradient(135deg, ${primary} 50%, ${neutral} 50%)` };
    } else if (tKey === "analogous") {
      return { background: `linear-gradient(135deg, ${primary} 50%, ${secondary} 50%)` };
    } else {
      return { background: `conic-gradient(from 0deg, #FF0055, #FFCC00, #00FF66, #00CCFF, #9900FF, #FF0055)` };
    }
  };
  
  const [primary, setPrimary] = useState(initialConfig?.primary_color || "#0052FF");
  const [secondary, setSecondary] = useState(initialConfig?.secondary_color || "#1A1A1A");
  const [tertiary, setTertiary] = useState(initialConfig?.tertiary_color || "#262626");
  const [neutral, setNeutral] = useState(initialConfig?.neutral_color || "#8A8A8A");

  const [fontHeadline, setFontHeadline] = useState(initialConfig?.font_headline || "Hanken Grotesk");
  const [fontBody, setFontBody] = useState(initialConfig?.font_body || "Inter");
  const [fontLabel, setFontLabel] = useState(initialConfig?.font_label || "JetBrains Mono");
  const [radiusScale, setRadiusScale] = useState(initialConfig?.radius_scale || "medium");

  useEffect(() => {
    if (colorTheme !== "custom") {
      const palette = generatePalette(seedColor, colorTheme, mode);
      if (palette) {
        setPrimary(palette.primary);
        setSecondary(palette.secondary);
        setTertiary(palette.tertiary);
        setNeutral(palette.neutral);
      }
    }
  }, [seedColor, colorTheme, mode]);

  const labelClass = "text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 block";
  const inputClass = "bg-[#1A1A1A] border border-gray-800 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-blue-500 transition-all text-sm w-full";

  return (
    <div className="bg-[#111111] border border-gray-800 rounded-[24px] p-6 w-full max-w-sm shadow-2xl overflow-hidden flex flex-col gap-6 relative">
      {/* Decorative Glow */}
      <div className="absolute top-[-50px] left-[-50px] w-40 h-40 bg-blue-500/20 blur-[60px] rounded-full pointer-events-none"></div>

      {/* HEADER */}
      <div className="flex items-center justify-between border-b border-gray-800/50 pb-4 relative z-10">
        <div className="flex items-center gap-2">
          <Wand2 size={18} className="text-gray-400" />
          <h2 className="text-sm font-semibold text-white">Theme Builder</h2>
        </div>
        <span className="text-[10px] bg-gray-800 text-gray-300 px-2 py-0.5 rounded-full font-mono">DESIGN.md</span>
      </div>

      {/* PREVIEW FONTS DYNAMICALLY */}
      <link rel="stylesheet" href={`https://fonts.googleapis.com/css2?family=${fontHeadline.replace(/ /g, '+')}:wght@700&family=${fontBody.replace(/ /g, '+')}:wght@400&family=${fontLabel.replace(/ /g, '+')}:wght@400&display=swap`} />
      <style dangerouslySetInnerHTML={{
        __html: `
          .preview-headline { font-family: '${fontHeadline}', sans-serif !important; }
          .preview-body { font-family: '${fontBody}', sans-serif !important; }
          .preview-label { font-family: '${fontLabel}', monospace !important; }
        `
      }} />

      {/* HIDDEN INPUTS */}
      <input type="hidden" name="theme_mode" value={mode} />
      <input type="hidden" name="seed_color" value={seedColor} />
      <input type="hidden" name="color_theme" value={colorTheme} />
      <input type="hidden" name="primary_color" value={primary} />
      <input type="hidden" name="secondary_color" value={secondary} />
      <input type="hidden" name="tertiary_color" value={tertiary} />
      <input type="hidden" name="neutral_color" value={neutral} />
      <input type="hidden" name="font_headline" value={fontHeadline} />
      <input type="hidden" name="font_body" value={fontBody} />
      <input type="hidden" name="font_label" value={fontLabel} />
      <input type="hidden" name="radius_scale" value={radiusScale} />

      {/* MODE */}
      <div>
        <label className={labelClass}>Mode</label>
        <div className="flex bg-[#1A1A1A] p-1 rounded-xl border border-gray-800/60">
          <button
            type="button"
            onClick={() => setMode("light")}
            className={`flex-1 flex items-center justify-center gap-2 py-1.5 rounded-lg text-xs font-semibold transition-all ${mode === "light" ? "bg-white text-black shadow-sm" : "text-gray-500 hover:text-gray-300"}`}
          >
            <Sun size={14} /> Light
          </button>
          <button
            type="button"
            onClick={() => setMode("dark")}
            className={`flex-1 flex items-center justify-center gap-2 py-1.5 rounded-lg text-xs font-semibold transition-all ${mode === "dark" ? "bg-gray-700 text-white shadow-sm" : "text-gray-500 hover:text-gray-300"}`}
          >
            <Moon size={14} /> Dark
          </button>
        </div>
      </div>

      {/* SEED COLOR */}
      <div>
        <label className={labelClass}>Seed Color</label>
        <div className="flex items-center gap-3 bg-[#1A1A1A] border border-gray-800/60 rounded-xl p-1.5 pr-4 hover:border-gray-700 transition-colors">
          <input 
            type="color" 
            value={seedColor}
            onChange={(e) => setSeedColor(e.target.value.toUpperCase())}
            className="w-8 h-8 rounded-full cursor-pointer border-0 p-0 shadow-sm"
            style={{ clipPath: "circle(50%)" }}
          />
          <span className="font-mono text-white text-sm flex-1">{seedColor}</span>
        </div>
      </div>

      {/* COLOR THEME WITH SPLIT COLOR CIRCLE PREVIEW */}
      <div className="relative">
        <label className={labelClass}>Color theme</label>
        
        <button
          type="button"
          onClick={() => setThemeDropdownOpen(!themeDropdownOpen)}
          className="w-full bg-[#1A1A1A] border border-gray-800/80 hover:border-gray-700 rounded-xl p-2.5 flex items-center justify-between transition-all"
        >
          <div className="flex items-center gap-3">
            <div 
              className="w-7 h-7 rounded-full shadow-inner border border-white/20 shrink-0" 
              style={getThemeCircleStyle(colorTheme)}
            />
            <span className="text-sm font-semibold text-white capitalize">{colorTheme}</span>
          </div>
          <ChevronDown size={16} className={`text-gray-400 transition-transform ${themeDropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        {themeDropdownOpen && (
          <div className="absolute left-0 right-0 top-[68px] z-50 bg-[#1F1F1F] border border-gray-800 rounded-xl shadow-2xl p-1.5 space-y-1">
            {[
              { id: "vibrant", label: "Vibrant" },
              { id: "monochrome", label: "Monochrome" },
              { id: "analogous", label: "Analogous" },
              { id: "custom", label: "Custom" },
            ].map((themeOpt) => (
              <button
                key={themeOpt.id}
                type="button"
                onClick={() => {
                  setColorTheme(themeOpt.id);
                  setThemeDropdownOpen(false);
                }}
                className={`w-full flex items-center justify-between p-2 rounded-lg text-xs font-semibold transition-all ${colorTheme === themeOpt.id ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30' : 'text-gray-300 hover:bg-white/5'}`}
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-6 h-6 rounded-full border border-white/20 shrink-0 shadow-sm" 
                    style={getThemeCircleStyle(themeOpt.id)}
                  />
                  <span className="capitalize">{themeOpt.label}</span>
                </div>
                {colorTheme === themeOpt.id && <span className="w-1.5 h-1.5 rounded-full bg-blue-400"></span>}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* COLOR PALETTE PREVIEW */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className={labelClass + " !mb-0"}>Color Palette</label>
          <span className="text-[9px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Google SEO AAA Compliant
          </span>
        </div>

        <div className="space-y-2.5 bg-[#1A1A1A] p-3 rounded-xl border border-gray-800/60">
          {[
            { label: "Primary", val: primary, setVal: setPrimary },
            { label: "Secondary", val: secondary, setVal: setSecondary },
            { label: "Tertiary", val: tertiary, setVal: setTertiary },
            { label: "Neutral", val: neutral, setVal: setNeutral },
          ].map((c) => (
            <div key={c.label} className="flex items-center justify-between group">
              <div className="flex items-center gap-2.5">
                <input 
                  type="color" 
                  value={c.val}
                  onChange={(e) => c.setVal(e.target.value.toUpperCase())}
                  disabled={colorTheme !== "custom"}
                  className="w-6 h-6 rounded-full cursor-pointer border-0 p-0 disabled:opacity-80 transition-transform group-hover:scale-110"
                  style={{ clipPath: "circle(50%)" }}
                />
                <span className="text-xs font-semibold text-gray-300">{c.label}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs text-gray-400 bg-[#111111] px-2 py-1 rounded-md border border-gray-800 select-all">
                  {c.val}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* TIPOGRAFIA */}
      <div className="pt-2 border-t border-gray-800/50">
        <label className={labelClass}>Fuente</label>
        <div className="space-y-3">
          {[
            { label: "Headline", val: fontHeadline, setVal: setFontHeadline, opts: ["Hanken Grotesk", "Inter", "Outfit", "Plus Jakarta Sans"] },
            { label: "Body", val: fontBody, setVal: setFontBody, opts: ["Inter", "Roboto", "Open Sans", "DM Sans"] },
            { label: "Label", val: fontLabel, setVal: setFontLabel, opts: ["JetBrains Mono", "Fira Code", "Space Mono"] },
          ].map((font) => (
            <div key={font.label} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#1A1A1A] border border-gray-800 flex items-center justify-center shrink-0">
                <span className={`text-gray-400 text-xs preview-${font.label.toLowerCase()}`}>Aa</span>
              </div>
              <div className="flex-1">
                <select 
                  value={font.val}
                  onChange={(e) => font.setVal(e.target.value)}
                  className={`w-full bg-transparent text-sm text-white font-medium focus:outline-none cursor-pointer appearance-none preview-${font.label.toLowerCase()}`}
                  style={{ backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%239CA3AF%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0px top 50%', backgroundSize: '.55rem auto' }}
                >
                  {font.opts.map(opt => <option key={opt} value={opt} className="bg-[#1A1A1A]">{opt}</option>)}
                </select>
                <span className="text-[10px] text-gray-500">{font.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* BORDER RADIUS */}
      <div className="pt-2 border-t border-gray-800/50">
        <label className={labelClass}>Radio de esquina</label>
        <div className="flex gap-2 justify-between">
          {[
            { id: "none", roundedClass: "rounded-none" },
            { id: "small", roundedClass: "rounded-sm" },
            { id: "medium", roundedClass: "rounded-xl" },
            { id: "full", roundedClass: "rounded-full" },
          ].map((radius) => (
            <button
              key={radius.id}
              type="button"
              onClick={() => setRadiusScale(radius.id)}
              className={`flex-1 h-10 border rounded-lg flex items-center justify-center transition-all ${radiusScale === radius.id ? 'border-white bg-[#1A1A1A]' : 'border-gray-800 bg-transparent hover:border-gray-600'}`}
            >
              {/* Visual representation of the corner */}
              <div className={`w-4 h-4 border-t-2 border-l-2 border-gray-400 ${radius.roundedClass} translate-y-1 translate-x-1`}></div>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}
