// Dynamic imports for fs and path are used inside server-guarded functions to support Next.js client bundling.

export interface SubdomainTheme {
  accent_color: string; // Hex color: e.g. '#10b981'
  accent_name: 'emerald' | 'cyan' | 'indigo' | 'purple' | 'amber' | 'blue' | 'custom';
  theme_mode: 'dark' | 'light' | 'system';
  radius_style: 'rounded-none' | 'rounded-xl' | 'rounded-2xl' | 'rounded-3xl';
  radius_scale?: 'none' | 'small' | 'medium' | 'full';
  seed_color?: string;
  color_theme?: 'vibrant' | 'monochrome' | 'analogous' | 'custom' | string;
  primary_color?: string;
  secondary_color?: string;
  tertiary_color?: string;
  neutral_color?: string;
  font_headline?: string;
  font_body?: string;
  font_label?: string;
  glow_style?: string;
  neon_thickness?: '2px' | '4px' | '6px' | '8px' | string;
  cursor_effect?: string;
  global_background_image?: string;
}

export interface SubdomainBranding {
  site_title: string;
  site_tagline: string;
  hero_badge: string;
  hero_title_prefix: string;
  hero_title_highlight: string;
  hero_description: string;
  logo_url: string;
  favicon_url: string;
  announcement_text?: string;
  announcement_enabled?: boolean;
}

export interface SubdomainSEO {
  meta_title: string;
  meta_description: string;
  keywords: string[];
  canonical_url: string;
}

export interface SubdomainModules {
  scraper_enabled: boolean;
  public_submissions_enabled: boolean;
  adsense_enabled: boolean;
  salary_calculator_enabled: boolean;
  regimes_comparator_enabled: boolean;
  ai_simulator_enabled: boolean;
  cv_generator_enabled: boolean;
  whatsapp_channel_enabled?: boolean;
  telegram_channel_enabled?: boolean;
}

export interface SubdomainContact {
  email: string;
  whatsapp: string;
  whatsapp_channel_url?: string;
  telegram_channel_url?: string;
  support_url?: string;
}

export interface SubdomainConfig {
  id: string; // e.g. 'chamba'
  name: string; // e.g. 'Chamba Pro'
  slug: string; // e.g. 'chamba'
  subdomain: string; // e.g. 'empleos' (empleos.atpdev.dev)
  full_domain: string; // e.g. 'empleos.atpdev.dev'
  devPort: number; // e.g. 3005
  category: string; // e.g. 'Convocatorias & Empleos Perú'
  status: 'active' | 'maintenance' | 'beta';
  theme: SubdomainTheme;
  branding: SubdomainBranding;
  seo: SubdomainSEO;
  modules: SubdomainModules;
  contact: SubdomainContact;
  updated_at?: string;
}

export const ACCENT_COLOR_MAP: Record<SubdomainTheme['accent_name'], { hex: string; name: string; glow: string }> = {
  emerald: { hex: '#10b981', name: 'Verde Esmeralda (Oficial)', glow: 'rgba(16, 185, 129, 0.25)' },
  cyan:    { hex: '#06b6d4', name: 'Azul Cyan Eléctrico',      glow: 'rgba(6, 182, 212, 0.25)' },
  indigo:  { hex: '#6366f1', name: 'Índigo Corporativo',        glow: 'rgba(99, 102, 241, 0.25)' },
  purple:  { hex: '#a855f7', name: 'Púrpura Neón',             glow: 'rgba(168, 85, 247, 0.25)' },
  amber:   { hex: '#f59e0b', name: 'Ámbar / Dorado Sunat',      glow: 'rgba(245, 158, 11, 0.25)' },
  blue:    { hex: '#3b82f6', name: 'Azul Estatal Clásico',      glow: 'rgba(59, 130, 246, 0.25)' },
  custom:  { hex: '#10b981', name: 'Personalizado / IA',       glow: 'rgba(16, 185, 129, 0.25)' }
};

export const DEFAULT_CHAMBA_CONFIG: SubdomainConfig = {
  id: 'chamba',
  name: 'Chamba Pro',
  slug: 'chamba',
  subdomain: 'empleos',
  full_domain: 'empleos.atpdev.dev',
  devPort: 3005,
  category: 'Convocatorias & Empleos Perú',
  status: 'active',
  theme: {
    accent_color: '#10b981',
    accent_name: 'emerald',
    theme_mode: 'dark',
    radius_style: 'rounded-2xl',
    radius_scale: 'medium',
    seed_color: '#10b981',
    color_theme: 'vibrant',
    primary_color: '#10b981',
    secondary_color: '#0f172a',
    tertiary_color: '#1e293b',
    neutral_color: '#64748b',
    font_headline: 'Space Grotesk',
    font_body: 'Inter',
    font_label: 'IBM Plex Mono',
    glow_style: 'spotlight-border',
    neon_thickness: '4px',
    cursor_effect: 'cursor-ia',
    global_background_image: ''
  },
  branding: {
    site_title: 'chamba pro',
    site_tagline: 'Agregador de Convocatorias y Empleos Perú',
    hero_badge: 'Buscador Oficial de Empleos Perú 2026',
    hero_title_prefix: 'Encuentra tu próximo empleo en el Estado con',
    hero_title_highlight: 'Chamba Pro',
    hero_description: 'Monitoreo diario de convocatorias CAS 1057, D.L. 728, 276 y sector privado. Postulación directa en portales oficiales sin intermediarios.',
    logo_url: '/icon.svg',
    favicon_url: '/icon.svg',
    announcement_text: '🚀 Actualizado en tiempo real con convocatorias vigentes de SERVIR y entidades públicas.',
    announcement_enabled: true
  },
  seo: {
    meta_title: 'chamba pro — Buscador de Empleos y Convocatorias de Trabajo Perú',
    meta_description: 'El buscador de convocatorias CAS 1057, D.L. 728, 276 y sector privado en Perú. Revisa bases oficiales, requisitos, salarios y postula directamente.',
    keywords: [
      'convocatorias de trabajo',
      'empleos peru',
      'trabajo en el estado',
      'convocatorias cas 2026',
      'servir convocatorias'
    ],
    canonical_url: 'https://empleos.atpdev.dev'
  },
  modules: {
    scraper_enabled: true,
    public_submissions_enabled: true,
    adsense_enabled: true,
    salary_calculator_enabled: true,
    regimes_comparator_enabled: true,
    ai_simulator_enabled: true,
    cv_generator_enabled: true,
    whatsapp_channel_enabled: true,
    telegram_channel_enabled: true
  },
  contact: {
    email: 'contacto@atpdev.dev',
    whatsapp: '+51987654321',
    whatsapp_channel_url: 'https://whatsapp.com/channel/0029Vaexample',
    telegram_channel_url: 'https://t.me/chambapro_peru',
    support_url: 'https://empleos.atpdev.dev/contacto'
  },
  updated_at: new Date().toISOString()
};

function getSafeNodeModules() {
  try {
    if (typeof window !== 'undefined' || typeof process === 'undefined' || !process.versions?.node) {
      return { fs: null, path: null };
    }
    const nodeReq = eval('require');
    return {
      fs: nodeReq('fs'),
      path: nodeReq('path')
    };
  } catch {
    return { fs: null, path: null };
  }
}

function getConfigFilePath(): string | null {
  try {
    const { fs: fsMod, path: pathMod } = getSafeNodeModules();
    if (!fsMod || !pathMod) return null;

    const cwd = process.cwd();
    const possiblePaths = [
      'D:\\PROYECTOS\\atpdev-web\\packages\\database\\src\\subdomain_configs.json',
      'd:/PROYECTOS/atpdev-web/packages/database/src/subdomain_configs.json',
      pathMod.resolve(cwd, 'packages/database/src/subdomain_configs.json'),
      pathMod.resolve(cwd, '../packages/database/src/subdomain_configs.json'),
      pathMod.resolve(cwd, '../../packages/database/src/subdomain_configs.json'),
      pathMod.resolve(cwd, '../../../packages/database/src/subdomain_configs.json'),
      pathMod.resolve(cwd, '../../../../packages/database/src/subdomain_configs.json')
    ];

    for (const p of possiblePaths) {
      if (fsMod.existsSync(p)) return p;
    }
    for (const p of possiblePaths) {
      if (fsMod.existsSync(pathMod.dirname(p))) return p;
    }
    return possiblePaths[0];
  } catch {
    return null;
  }
}

let inMemoryConfigs: Record<string, SubdomainConfig> = {
  chamba: { ...DEFAULT_CHAMBA_CONFIG }
};

export function listSubdomains(): SubdomainConfig[] {
  try {
    const { fs: fsMod } = getSafeNodeModules();
    if (!fsMod) return Object.values(inMemoryConfigs);
    const filePath = getConfigFilePath();
    if (filePath && fsMod.existsSync(filePath)) {
      const data = JSON.parse(fsMod.readFileSync(filePath, 'utf-8'));
      if (typeof data === 'object' && data !== null) {
        inMemoryConfigs = { ...inMemoryConfigs, ...data };
      }
    }
  } catch (err) {
    // Silently fallback to in-memory config in restricted environments
  }
  return Object.values(inMemoryConfigs);
}

export function getSubdomainConfig(id: string): SubdomainConfig {
  try {
    const { fs: fsMod } = getSafeNodeModules();
    if (!fsMod) return inMemoryConfigs[id] || { ...DEFAULT_CHAMBA_CONFIG };
    const filePath = getConfigFilePath();
    if (filePath && fsMod.existsSync(filePath)) {
      const data = JSON.parse(fsMod.readFileSync(filePath, 'utf-8'));
      if (data && data[id]) {
        return { ...DEFAULT_CHAMBA_CONFIG, ...data[id] };
      }
    }
  } catch (err) {
    // Silently fallback to in-memory config
  }
  return inMemoryConfigs[id] || { ...DEFAULT_CHAMBA_CONFIG };
}

export function saveSubdomainConfig(id: string, updates: Partial<SubdomainConfig>): { success: boolean; config: SubdomainConfig } {
  try {
    const current = getSubdomainConfig(id);
    const updated: SubdomainConfig = {
      ...current,
      ...updates,
      theme: { ...current.theme, ...(updates.theme || {}) },
      branding: { ...current.branding, ...(updates.branding || {}) },
      seo: { ...current.seo, ...(updates.seo || {}) },
      modules: { ...current.modules, ...(updates.modules || {}) },
      contact: { ...current.contact, ...(updates.contact || {}) },
      updated_at: new Date().toISOString()
    };

    inMemoryConfigs[id] = updated;

    const { fs: fsMod, path: pathMod } = getSafeNodeModules();
    if (fsMod && pathMod) {
      const filePath = getConfigFilePath();
      if (filePath) {
        const dir = pathMod.dirname(filePath);
        if (!fsMod.existsSync(dir)) {
          fsMod.mkdirSync(dir, { recursive: true });
        }

        let all: Record<string, SubdomainConfig> = {};
        if (fsMod.existsSync(filePath)) {
          try {
            all = JSON.parse(fsMod.readFileSync(filePath, 'utf-8')) || {};
          } catch {}
        }
        all[id] = updated;

        fsMod.writeFileSync(filePath, JSON.stringify(all, null, 2), 'utf-8');
      }
    }
    return { success: true, config: updated };
  } catch (err) {
    console.error(`Error saving config for subdomain ${id}:`, err);
    return { success: false, config: inMemoryConfigs[id] || DEFAULT_CHAMBA_CONFIG };
  }
}
