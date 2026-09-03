-- Migration 018: Tablas, Políticas de Seguridad (RLS) e Índices para Chamba Pro
create table if not exists job_postings (
  id text primary key,
  title text not null,
  slug text unique not null,
  entity_name text not null,
  entity_ruc text,
  entity_verified boolean default true,
  sector_type text not null,
  region text not null,
  category text not null,
  education_level text not null,
  salary_min numeric,
  salary_max numeric,
  salary_text text not null,
  vacancies_count integer default 1,
  description text not null,
  requirements text[] default '{}',
  benefits text[] default '{}',
  apply_url text not null,
  bases_pdf_url text,
  official_portal_name text,
  start_date text not null,
  end_date text not null,
  featured boolean default false,
  views_count integer default 0,
  clicks_count integer default 0,
  status text default 'Vigente',
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Índices de alto rendimiento para búsqueda, filtros y SEO
create index if not exists idx_job_postings_slug on job_postings(slug);
create index if not exists idx_job_postings_status on job_postings(status);
create index if not exists idx_job_postings_sector_type on job_postings(sector_type);
create index if not exists idx_job_postings_region on job_postings(region);
create index if not exists idx_job_postings_featured on job_postings(featured);
create index if not exists idx_job_postings_created_at on job_postings(created_at desc);

-- Habilitar Row Level Security (RLS)
alter table job_postings enable row level security;

-- Política de lectura pública: cualquier visitante puede consultar las convocatorias
drop policy if exists "Public jobs are viewable by everyone" on job_postings;
create policy "Public jobs are viewable by everyone"
  on job_postings
  for select
  using (true);

-- Política de escritura administrativa: solo service_role o usuarios autenticados autorizados
drop policy if exists "Service role has full access to jobs" on job_postings;
create policy "Service role has full access to jobs"
  on job_postings
  for all
  using (auth.role() = 'service_role' or auth.role() = 'authenticated')
  with check (auth.role() = 'service_role' or auth.role() = 'authenticated');
