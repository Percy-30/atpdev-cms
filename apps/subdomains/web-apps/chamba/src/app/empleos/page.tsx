import type { Metadata } from "next";
import { getJobPostings } from "@atpdev/database";
import { JobCard } from "@/components/JobCard";
import { JobFilterClient } from "@/components/JobFilterClient";
import WhatsAppSubscribeWidget from "@/components/WhatsAppSubscribeWidget";
import { AdBannerSlot } from "@/components/AdBannerSlot";
import { Search, Filter, Briefcase } from "lucide-react";

export const revalidate = 0;

export const metadata: Metadata = {
  title: "Buscador de Convocatorias de Trabajo Perú 2026 | chamba pro",
  description: "Encuentra convocatorias de trabajo vigentes en Perú: CAS, 728, 276 y locación de servicios en ministerios, municipalidades y entidades públicas.",
  alternates: {
    canonical: "https://empleos.atpdev.dev/empleos",
  },
  openGraph: {
    title: "Buscador de Convocatorias de Trabajo Perú 2026 | chamba pro",
    description: "Encuentra convocatorias de trabajo vigentes en Perú: CAS, 728, 276 y locación de servicios en el Estado.",
    url: "https://empleos.atpdev.dev/empleos",
    type: "website",
  },
};

export default async function EmpleosPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const params = await searchParams;
  const q = params.q || "";
  const region = params.region || "";
  const regimen = params.regimen || "";
  const categoria = params.categoria || "";
  const educacion = params.educacion || "";
  const sort = params.sort || "ending_soon";
  const hideExpired = params.hide_expired !== "false"; // Por defecto true para no mostrar ofertas vencidas

  const allJobs = await getJobPostings();
  const todayIso = new Date().toISOString().split("T")[0];

  // 1. Lógica de Filtrado
  const filteredJobs = allJobs.filter((job) => {
    // Si hideExpired está activo, ocultamos las convocatorias cerradas
    if (hideExpired && job.end_date && job.end_date < todayIso) {
      return false;
    }
    if (q) {
      const matchTitle = job.title.toLowerCase().includes(q.toLowerCase());
      const matchEntity = job.entity_name.toLowerCase().includes(q.toLowerCase());
      const matchDesc = job.description.toLowerCase().includes(q.toLowerCase());
      if (!matchTitle && !matchEntity && !matchDesc) return false;
    }
    if (region) {
      const rLow = region.toLowerCase();
      const jobRLow = job.region.toLowerCase();
      const isMatch = jobRLow.includes(rLow) || rLow.includes(jobRLow) || jobRLow.includes("nacional");
      if (!isMatch) return false;
    }
    if (regimen) {
      const regLow = regimen.toLowerCase();
      const jobRegLow = job.sector_type.toLowerCase();
      const isMatch = jobRegLow.includes(regLow) || regLow.includes(jobRegLow);
      if (!isMatch) return false;
    }
    if (categoria && job.category.toLowerCase() !== categoria.toLowerCase()) return false;
    if (educacion && job.education_level.toLowerCase() !== educacion.toLowerCase()) return false;
    return true;
  });

  // 2. Lógica de Ordenamiento Inteligente
  filteredJobs.sort((a, b) => {
    if (sort === "ending_soon") {
      // Las que vencen más pronto primero
      const aExpired = a.end_date < todayIso;
      const bExpired = b.end_date < todayIso;
      if (aExpired && !bExpired) return 1;
      if (!aExpired && bExpired) return -1;
      return (a.end_date || "9999").localeCompare(b.end_date || "9999");
    }
    if (sort === "recent") {
      const dateA = a.created_at || a.start_date || "";
      const dateB = b.created_at || b.start_date || "";
      return dateB.localeCompare(dateA);
    }
    if (sort === "vacancies_desc") {
      return (b.vacancies_count || 1) - (a.vacancies_count || 1);
    }
    if (sort === "salary_desc") {
      const parseSalary = (s: string) => {
        const num = s.replace(/[,.]/g, "").match(/\d+/g);
        return num ? Math.max(...num.map(Number)) : 0;
      };
      return (b.salary_max || parseSalary(b.salary_text)) - (a.salary_max || parseSalary(a.salary_text));
    }
    return 0;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Title Header */}
      <div className="space-y-2 border-b border-white/10 pb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-semibold">
          <Briefcase size={14} />
          <span>Búsqueda Inteligente • Actualización Oficial 2026</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black font-display text-white">
          Buscador de Ofertas y Convocatorias en Perú
        </h1>
        <p className="text-sm text-slate-400 max-w-2xl">
          Filtra por institución, régimen laboral (CAS 1057, 728, 276), región, nivel educativo y rango salarial.
        </p>
      </div>

      {/* Top Billboard Ad Slot */}
      <AdBannerSlot type="leaderboard" />

      {/* Main Grid: Filters Sidebar + Job Listings */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Interactive Filter Sidebar */}
        <div className="lg:col-span-1 space-y-6 sticky top-24">
          <div className="glass-card p-6 rounded-3xl space-y-6">
            <JobFilterClient
              initialQ={q}
              initialRegion={region}
              initialRegimen={regimen}
              initialCategoria={categoria}
              initialEducacion={educacion}
              initialSort={sort}
              initialHideExpired={hideExpired}
            />
          </div>

          <AdBannerSlot type="sidebar" />
        </div>

        {/* Results Container */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between font-mono text-xs text-slate-400 bg-slate-900/60 p-4 rounded-2xl border border-white/10">
            <span>Mostrando <strong className="text-emerald-400">{filteredJobs.length}</strong> de {allJobs.length} convocatorias</span>
            {filteredJobs.length === 0 && <span className="text-amber-400">Sin resultados exactos</span>}
          </div>

          {filteredJobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          ) : (
            <div className="glass-card p-12 rounded-3xl text-center space-y-4 border border-dashed border-white/20">
              <Search size={40} className="text-slate-500 mx-auto" />
              <h3 className="text-xl font-bold font-display text-white">No se encontraron convocatorias</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Intenta ajustar los criterios de búsqueda o limpiar los filtros seleccionados para ver más resultados.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* WhatsApp / Telegram Subscription Widget */}
      <WhatsAppSubscribeWidget />
    </div>
  );
}
