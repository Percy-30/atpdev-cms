import { createClient } from '@supabase/supabase-js';

// Usamos el JWT payload decoding para recuperar el Project ID y las llaves correctas.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://yeeupdgjfrkkaurytyrs.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_XtR6TNbQPLwkwCeUOYWKEQ_g-8IStIc';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Definición de Tipos
export type Project = {
  id: number;
  title: string;
  category: string;
  metrics: string;
  description: string;
  stack: string[];
  image: string;
  demolink: string;
  playstore?: string;
  status: string;
  created_at?: string;
};

export type SiteConfig = {
  id: number;
  // Hero
  hero_title: string;
  hero_subtitle: string;
  hero_typewriter: string[];
  // Colores
  primary_color: string;
  secondary_color: string;
  // Perfil
  full_name: string;
  bio_short: string;
  bio_long: string;
  avatar_url: string;
  // Contacto
  email: string;
  phone: string;
  location: string;
  // Redes Sociales
  github_url: string;
  github_enabled: boolean;
  linkedin_url: string;
  linkedin_enabled: boolean;
  twitter_url: string;
  twitter_enabled: boolean;
  facebook_url: string;
  facebook_enabled: boolean;
  instagram_url: string;
  instagram_enabled: boolean;
  youtube_url: string;
  youtube_enabled: boolean;
  tiktok_url: string;
  tiktok_enabled: boolean;
  whatsapp_url: string;
  whatsapp_enabled: boolean;
  telegram_url: string;
  telegram_enabled: boolean;
  discord_url: string;
  discord_enabled: boolean;
  // Links especiales
  cv_url: string;
  credly_url: string;
  // Integraciones
  ga4_id: string;
  adsense_id: string;
  // Timestamp
  updated_at?: string;
};

export type ProfileData = {
  id: number;
  name: string;
  birth_date: string;
  phone: string;
  city: string;
  age: number;
  degree: string;
  email: string;
  freelance_status: string;
  bio_short: string;
  bio_long: string;
  stats_clients: number;
  stats_projects: number;
  stats_hours: number;
  stats_students: number;
  created_at?: string;
};

export type Lead = {
  id: number;
  name: string;
  company: string;
  email: string;
  message: string;
  status: string; // 'NUEVO', 'CONTACTADO', 'PENDIENTE', 'PERDIDO'
  created_at?: string;
};

export type Experience = {
  id: number;
  role: string;
  company: string;
  date_range: string;
  description: string;
  icon_key: string; // 'briefcase' | 'book' | 'laptop' | 'activity' | 'star'
  color_key: string; // 'blue' | 'purple' | 'emerald' | 'amber' | 'rose'
  sort_order: number;
  is_active: boolean;
  created_at?: string;
};

export type Skill = {
  id: number;
  category: string;
  icon_key: string;
  color_key: string;
  items: string[];
  sort_order: number;
  is_active: boolean;
  created_at?: string;
};

// =====================================================
// Funciones de Lectura (Para el Frontend)
// =====================================================
export async function getProjects(): Promise<Project[]> {
  const { data, error } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
  if (error) {
    console.error('Error fetching projects:', error);
    return [];
  }
  return data as Project[];
}

export async function getSiteConfig(): Promise<SiteConfig | null> {
  const { data, error } = await supabase.from('site_config').select('*').limit(1).single();
  if (error) {
    console.error('Error fetching site_config:', error);
    return null;
  }
  return data as SiteConfig;
}

export async function getProfileData(): Promise<ProfileData | null> {
  const { data, error } = await supabase.from('profile_data').select('*').limit(1).single();
  if (error) {
    console.error('Error fetching profile_data:', error);
    return null;
  }
  return data as ProfileData;
}

export async function getExperiences(): Promise<Experience[]> {
  const { data, error } = await supabase
    .from('experiences')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });
  if (error) {
    console.error('Error fetching experiences:', error);
    return [];
  }
  return data as Experience[];
}

export async function getSkills(): Promise<Skill[]> {
  const { data, error } = await supabase
    .from('skills')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true });
  if (error) {
    console.error('Error fetching skills:', error);
    return [];
  }
  return data as Skill[];
}

export async function getLeads(): Promise<Lead[]> {
  const { data, error } = await adminSupabase.from('leads').select('*').order('created_at', { ascending: false });
  if (error) {
    console.error('Error fetching leads:', error);
    return [];
  }
  return data as Lead[];
}

// Funciones de Escritura (Para el Admin Panel - Requiere permisos altos)
const adminKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const adminSupabase = createClient(supabaseUrl, adminKey || 'dummy');

export async function updateSiteConfig(newConfig: Partial<SiteConfig>): Promise<boolean> {
  const { error } = await adminSupabase
    .from('site_config')
    .update(newConfig)
    .eq('id', 1);
  
  if (error) {
    console.error('Error updating site_config:', error);
    return false;
  }
  return true;
}

export async function createProject(project: Omit<Project, 'id' | 'created_at'>): Promise<boolean> {
  const { error } = await adminSupabase.from('projects').insert([project]);
  if (error) {
    console.error('Error creating project:', error);
    return false;
  }
  return true;
}

export async function deleteProject(id: number): Promise<boolean> {
  const { error } = await adminSupabase.from('projects').delete().eq('id', id);
  if (error) {
    console.error('Error deleting project:', error);
    return false;
  }
  return true;
}

export async function updateProjectStatus(id: number, status: string): Promise<boolean> {
  const { error } = await adminSupabase.from('projects').update({ status }).eq('id', id);
  if (error) {
    console.error('Error updating project status:', error);
    return false;
  }
  return true;
}

export async function updateProject(id: number, project: Partial<Omit<Project, 'id' | 'created_at'>>): Promise<boolean> {
  const { error } = await adminSupabase.from('projects').update(project).eq('id', id);
  if (error) {
    console.error('Error updating project:', error);
    return false;
  }
  return true;
}

export async function uploadImage(file: File): Promise<string | null> {
  if (!file || file.size === 0) return null;
  
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
  
  const { data, error } = await adminSupabase.storage
    .from('portfolio-images')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) {
    console.error('Error uploading image:', error);
    return null;
  }

  const { data: publicUrlData } = adminSupabase.storage
    .from('portfolio-images')
    .getPublicUrl(fileName);

  return publicUrlData.publicUrl;
}

export async function createLead(lead: Omit<Lead, 'id' | 'created_at' | 'status'>): Promise<boolean> {
  // We use adminSupabase so we can insert without complex RLS, or we can use regular supabase if we enable RLS inserts for public.
  // Since this comes from the public portal, using adminSupabase in a server action is safe and easier.
  const { error } = await adminSupabase.from('leads').insert([{
    ...lead,
    status: 'NUEVO'
  }]);
  
  if (error) {
    console.error('Error creating lead:', error);
    return false;
  }
  return true;
}

export async function updateLeadStatus(id: number, status: string): Promise<boolean> {
  const { error } = await adminSupabase.from('leads').update({ status }).eq('id', id);
  if (error) {
    console.error('Error updating lead status:', error);
    return false;
  }
  return true;
}

// =====================================================
// Funciones Admin: Experiencias
// =====================================================
export async function getAllExperiences(): Promise<Experience[]> {
  const { data, error } = await adminSupabase
    .from('experiences')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error) {
    console.error('Error fetching all experiences:', error);
    return [];
  }
  return data as Experience[];
}

export async function createExperience(exp: Omit<Experience, 'id' | 'created_at'>): Promise<boolean> {
  const { error } = await adminSupabase.from('experiences').insert([exp]);
  if (error) { console.error('Error creating experience:', error); return false; }
  return true;
}

export async function updateExperience(id: number, exp: Partial<Omit<Experience, 'id' | 'created_at'>>): Promise<boolean> {
  const { error } = await adminSupabase.from('experiences').update(exp).eq('id', id);
  if (error) { console.error('Error updating experience:', error); return false; }
  return true;
}

export async function deleteExperience(id: number): Promise<boolean> {
  const { error } = await adminSupabase.from('experiences').delete().eq('id', id);
  if (error) { console.error('Error deleting experience:', error); return false; }
  return true;
}

// =====================================================
// Funciones Admin: Skills
// =====================================================
export async function getAllSkills(): Promise<Skill[]> {
  const { data, error } = await adminSupabase
    .from('skills')
    .select('*')
    .order('sort_order', { ascending: true });
  if (error) {
    console.error('Error fetching all skills:', error);
    return [];
  }
  return data as Skill[];
}

export async function createSkill(skill: Omit<Skill, 'id' | 'created_at'>): Promise<boolean> {
  const { error } = await adminSupabase.from('skills').insert([skill]);
  if (error) { console.error('Error creating skill:', error); return false; }
  return true;
}

export async function updateSkill(id: number, skill: Partial<Omit<Skill, 'id' | 'created_at'>>): Promise<boolean> {
  const { error } = await adminSupabase.from('skills').update(skill).eq('id', id);
  if (error) { console.error('Error updating skill:', error); return false; }
  return true;
}

export async function deleteSkill(id: number): Promise<boolean> {
  const { error } = await adminSupabase.from('skills').delete().eq('id', id);
  if (error) { console.error('Error deleting skill:', error); return false; }
  return true;
}

// ==========================================
// INFINITE I18N: TRANSLATION CACHE ENGINE
// ==========================================

import { translate as googleTranslate } from '@vitalets/google-translate-api';

/**
 * Traduce un texto dinámicamente y lo cachea en Supabase.
 * Si el idioma destino es "es" (español), devuelve el original sin traducir.
 * @param sourceText El texto original en español
 * @param targetLang Código del idioma (ej: "en", "ru", "hi")
 */
export async function translateText(sourceText: string, targetLang: string): Promise<string> {
  if (!sourceText) return sourceText;
  if (targetLang === 'es') return sourceText;

  // 1. Buscar en la base de datos de caché
  const { data: cached } = await supabase
    .from('translation_cache')
    .select('translated_text')
    .eq('source_text', sourceText)
    .eq('target_lang', targetLang)
    .single();

  if (cached && cached.translated_text) {
    return cached.translated_text; // Caché hit (0ms extra)
  }

  // 2. Si no está en caché, usamos la API gratuita de Google Translate
  try {
    const { text } = await googleTranslate(sourceText, { to: targetLang });
    
    // 3. Guardar asíncronamente en Supabase (fire and forget)
    // Se usa el service_role internamente (idealmente) o el token anon (que habilitamos con RLS)
    supabase.from('translation_cache').insert([
      { source_text: sourceText, target_lang: targetLang, translated_text: text }
    ]).then(({ error }) => {
      if (error && error.code !== '23505') { // Ignorar error de unique constraint (race condition)
        console.error('Error caching translation:', error);
      }
    });

    return text;
  } catch (error) {
    console.error('Translation API error:', error);
    // Fallback: devolver el texto original si falla la traducción
    return sourceText;
  }
}
