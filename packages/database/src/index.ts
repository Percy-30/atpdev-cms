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
  primary_color: string;
  secondary_color: string;
  hero_title: string;
  hero_subtitle: string;
  hero_typewriter: string[];
  created_at?: string;
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

// Funciones de Lectura (Para el Frontend)
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
