'use client';

import { useState } from 'react';
import { JobPosting } from '@atpdev/database';
import { 
  Briefcase, Search, Star, ExternalLink, RefreshCw, Plus, 
  Trash2, CheckCircle2, AlertTriangle, ShieldCheck, DollarSign,
  Building2, MapPin, Sparkles, FileText, Check, LayoutGrid, Radio
} from 'lucide-react';
import { 
  toggleJobFeaturedAction, 
  updateJobStatusAction, 
  deleteJobAction, 
  triggerLiveScraperAction,
  saveJobAction 
} from './actions';

interface ChambaAdminClientProps {
  initialJobs: JobPosting[];
}

export default function ChambaAdminClient({ initialJobs }: ChambaAdminClientProps) {
  const [jobs, setJobs] = useState<JobPosting[]>(initialJobs);
  const [activeTab, setActiveTab] = useState<'list' | 'create' | 'scraper' | 'ads'>('list');
  const [search, setSearch] = useState('');
  const [selectedRegimen, setSelectedRegimen] = useState('all');
  const [isScraping, setIsScraping] = useState(false);
  const [scrapeResult, setScrapeResult] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);

  // New Job Form State
  const [newJob, setNewJob] = useState({
    title: '',
    entity_name: '',
    entity_ruc: '',
    sector_type: 'CAS 1057' as JobPosting['sector_type'],
    region: 'Lima',
    category: 'Administración y Gestión Pública',
    education_level: 'Bachiller' as JobPosting['education_level'],
    salary_text: 'S/. 3,500 Soles',
    salary_min: 3500,
    salary_max: 3500,
    vacancies_count: 1,
    description: '',
    apply_url: '',
    bases_pdf_url: '',
    end_date: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
    featured: false
  });

  // Filter Jobs
  const filteredJobs = jobs.filter(j => {
    const matchSearch = j.title.toLowerCase().includes(search.toLowerCase()) || 
                        j.entity_name.toLowerCase().includes(search.toLowerCase());
    const matchRegimen = selectedRegimen === 'all' || j.sector_type === selectedRegimen;
    return matchSearch && matchRegimen;
  });

  // Actions
  const handleToggleFeatured = async (id: string, current: boolean) => {
    const next = !current;
    setJobs(prev => prev.map(j => j.id === id ? { ...j, featured: next } : j));
    await toggleJobFeaturedAction(id, next);
  };

  const handleUpdateStatus = async (id: string, status: 'Vigente' | 'Finalizado' | 'Pendiente') => {
    setJobs(prev => prev.map(j => j.id === id ? { ...j, status } : j));
    await updateJobStatusAction(id, status);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta convocatoria?')) return;
    setJobs(prev => prev.filter(j => j.id !== id));
    await deleteJobAction(id);
  };

  const handleTriggerScraper = async () => {
    setIsScraping(true);
    setScrapeResult(null);
    try {
      const res = await triggerLiveScraperAction();
      setScrapeResult(`✅ Ingesta completada con éxito: ${res.count} convocatorias obtenidas.`);
    } catch (err: any) {
      setScrapeResult(`❌ Error en el scraper: ${err?.message || 'Error de conexión'}`);
    } finally {
      setIsScraping(false);
    }
  };

  const handleCreateJob = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJob.title || !newJob.entity_name || !newJob.apply_url) {
      alert('Por favor completa los campos obligatorios: Título, Entidad y Enlace Oficial.');
      return;
    }

    setIsSaving(true);
    setSaveMessage(null);

    const res = await saveJobAction({
      ...newJob,
      id: `job-cms-${Date.now()}`,
      created_at: new Date().toISOString()
    });

    setIsSaving(false);
    if (res.success) {
      setSaveMessage('¡Convocatoria publicada exitosamente en Chamba Pro!');
      setActiveTab('list');
      // Reset
      setNewJob({
        title: '',
        entity_name: '',
        entity_ruc: '',
        sector_type: 'CAS 1057',
        region: 'Lima',
        category: 'Administración y Gestión Pública',
        education_level: 'Bachiller',
        salary_text: 'S/. 3,500 Soles',
        salary_min: 3500,
        salary_max: 3500,
        vacancies_count: 1,
        description: '',
        apply_url: '',
        bases_pdf_url: '',
        end_date: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
        featured: false
      });
    } else {
      alert(res.error || 'Error al guardar');
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/20 shadow-xl">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-mono font-bold border border-emerald-500/20">
            <ShieldCheck size={13} />
            <span>CHAMBA PRO CMS — EMPLEOS.ATPDEV.DEV</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-3">
            Gestión de Convocatorias & Empleos Perú
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Monitoreo en tiempo real, ingestión con IA, control de anunciantes y derivación oficial sin intermediarios.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setActiveTab('create')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-emerald-500/20"
          >
            <Plus size={15} />
            <span>Publicar Convocatoria</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('list')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'list' 
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' 
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <LayoutGrid size={15} />
          <span>Convocatorias ({jobs.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('create')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'create' 
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' 
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Plus size={15} />
          <span>Crear Convocatoria</span>
        </button>

        <button
          onClick={() => setActiveTab('scraper')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'scraper' 
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' 
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <RefreshCw size={15} className={isScraping ? 'animate-spin' : ''} />
          <span>Motor Scraper SERVIR</span>
        </button>

        <button
          onClick={() => setActiveTab('ads')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === 'ads' 
              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' 
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <DollarSign size={15} />
          <span>Google Ads & ads.txt</span>
        </button>
      </div>

      {/* TAB 1: LIST */}
      {activeTab === 'list' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-between p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-3.5 top-3 text-slate-500" size={16} />
              <input
                type="text"
                placeholder="Buscar por entidad o título de puesto..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full bg-slate-950/80 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={selectedRegimen}
                onChange={e => setSelectedRegimen(e.target.value)}
                className="bg-slate-950/80 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="all">Todos los Regímenes</option>
                <option value="CAS 1057">CAS 1057</option>
                <option value="D.L. 728">D.L. 728</option>
                <option value="D.L. 276">D.L. 276</option>
                <option value="Locación / FAG">Locación / FAG</option>
                <option value="Privado">Sector Privado</option>
              </select>
            </div>
          </div>

          {/* Jobs Table */}
          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900/40 backdrop-blur-sm">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/70 text-slate-400 font-mono text-[11px] uppercase border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Puesto / Entidad</th>
                  <th className="py-3 px-4">Régimen</th>
                  <th className="py-3 px-4">Región / Sueldo</th>
                  <th className="py-3 px-4">Vigencia</th>
                  <th className="py-3 px-4">Estado</th>
                  <th className="py-3 px-4 text-center">Destacado</th>
                  <th className="py-3 px-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredJobs.slice(0, 30).map((job) => (
                  <tr key={job.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3.5 px-4 max-w-xs">
                      <div className="font-bold text-white truncate" title={job.title}>
                        {job.title}
                      </div>
                      <div className="text-[11px] text-slate-400 truncate flex items-center gap-1.5 mt-0.5">
                        <Building2 size={12} className="text-emerald-400 shrink-0" />
                        <span>{job.entity_name}</span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="inline-block px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/20 text-[10px] font-semibold">
                        {job.sector_type}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="text-slate-300 font-medium flex items-center gap-1">
                        <MapPin size={11} className="text-slate-500" />
                        <span>{job.region}</span>
                      </div>
                      <div className="text-[11px] text-emerald-400 font-mono font-bold mt-0.5">
                        {job.salary_text}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400">
                      {job.end_date}
                    </td>

                    <td className="py-3.5 px-4">
                      <select
                        value={job.status}
                        onChange={(e) => handleUpdateStatus(job.id, e.target.value as any)}
                        className={`text-[11px] font-bold px-2 py-1 rounded-md border bg-slate-950 focus:outline-none ${
                          job.status === 'Vigente'
                            ? 'text-emerald-400 border-emerald-500/30'
                            : 'text-rose-400 border-rose-500/30'
                        }`}
                      >
                        <option value="Vigente">Vigente</option>
                        <option value="Finalizado">Finalizado</option>
                        <option value="Pendiente">Pendiente</option>
                      </select>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => handleToggleFeatured(job.id, job.featured)}
                        className={`p-1.5 rounded-lg border transition-all ${
                          job.featured
                            ? 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                            : 'bg-slate-950 border-slate-800 text-slate-600 hover:text-slate-400'
                        }`}
                        title={job.featured ? 'Quitar de portada' : 'Destacar en portada'}
                      >
                        <Star size={14} className={job.featured ? 'fill-amber-400' : ''} />
                      </button>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <a
                          href={job.apply_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                          title="Ver en portal oficial"
                        >
                          <ExternalLink size={13} />
                        </a>
                        <button
                          onClick={() => handleDelete(job.id)}
                          className="p-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white transition-colors"
                          title="Eliminar convocatoria"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: CREATE JOB FORM */}
      {activeTab === 'create' && (
        <form onSubmit={handleCreateJob} className="p-6 sm:p-8 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <FileText className="text-emerald-400" size={18} />
              <span>Publicar Nueva Convocatoria Laboral</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Las ofertas se indexan automáticamente en Google for Jobs mediante JSON-LD Schema.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-semibold text-slate-300">Título del Puesto *</label>
              <input
                type="text"
                required
                placeholder="Ej. Especialista en Contrataciones del Estado (CAS)"
                value={newJob.title}
                onChange={e => setNewJob({ ...newJob, title: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Entidad Pública o Empresa *</label>
              <input
                type="text"
                required
                placeholder="Ej. MINISTERIO DE ECONOMÍA Y FINANZAS (MEF)"
                value={newJob.entity_name}
                onChange={e => setNewJob({ ...newJob, entity_name: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">RUC de la Entidad (Para insignia verificada)</label>
              <input
                type="text"
                placeholder="Ej. 20131370645"
                value={newJob.entity_ruc}
                onChange={e => setNewJob({ ...newJob, entity_ruc: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Régimen Laboral *</label>
              <select
                value={newJob.sector_type}
                onChange={e => setNewJob({ ...newJob, sector_type: e.target.value as any })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="CAS 1057">CAS 1057</option>
                <option value="D.L. 728">D.L. 728</option>
                <option value="D.L. 276">D.L. 276</option>
                <option value="Locación / FAG">Locación / FAG</option>
                <option value="Privado">Sector Privado</option>
                <option value="Prácticas">Prácticas Pre/Pro</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Región / Ubicación *</label>
              <input
                type="text"
                required
                placeholder="Ej. Lima / Remoto / Cusco"
                value={newJob.region}
                onChange={e => setNewJob({ ...newJob, region: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Nivel Educativo *</label>
              <select
                value={newJob.education_level}
                onChange={e => setNewJob({ ...newJob, education_level: e.target.value as any })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="Secundaria">Secundaria Completa</option>
                <option value="Técnico">Técnico Egresado / Titulado</option>
                <option value="Egresado">Egresado Universitario</option>
                <option value="Bachiller">Bachiller</option>
                <option value="Titulado">Titulado / Colegiado</option>
                <option value="Maestría / Doctorado">Maestría / Doctorado</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Remuneración en Soles *</label>
              <input
                type="text"
                required
                placeholder="Ej. S/. 4,500 Soles"
                value={newJob.salary_text}
                onChange={e => setNewJob({ ...newJob, salary_text: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Enlace Oficial de Postulación (SERVIR o Portal) *</label>
              <input
                type="url"
                required
                placeholder="https://convocatorias.entidad.gob.pe"
                value={newJob.apply_url}
                onChange={e => setNewJob({ ...newJob, apply_url: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Enlace Bases PDF Oficiales</label>
              <input
                type="url"
                placeholder="https://archivos.entidad.gob.pe/bases.pdf"
                value={newJob.bases_pdf_url}
                onChange={e => setNewJob({ ...newJob, bases_pdf_url: e.target.value })}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="featured-check"
              checked={newJob.featured}
              onChange={e => setNewJob({ ...newJob, featured: e.target.checked })}
              className="rounded bg-slate-950 border-slate-800 text-emerald-500 focus:ring-emerald-500"
            />
            <label htmlFor="featured-check" className="text-xs text-slate-300 cursor-pointer">
              Destacar en la portada principal de Chamba Pro
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setActiveTab('list')}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2"
            >
              {isSaving ? <RefreshCw className="animate-spin" size={14} /> : <Check size={14} />}
              <span>{isSaving ? 'Guardando...' : 'Publicar Ahora'}</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 3: LIVE SCRAPER ENGINE */}
      {activeTab === 'scraper' && (
        <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <RefreshCw className="text-emerald-400" size={18} />
              <span>Motor de Ingesta & Web Scraper Multi-Canal</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Extrae automáticamente convocatorias en tiempo real desde SERVIR (Talento Perú) y portales institucionales de Estado.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-[11px] font-mono text-slate-400">ESTADO DEL MOTOR</div>
              <div className="text-base font-bold text-emerald-400 flex items-center gap-2 mt-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Operativo & Resiliente
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-[11px] font-mono text-slate-400">CONVOCATORIAS DISPONIBLES</div>
              <div className="text-base font-bold text-white mt-1">
                {jobs.length} registros cargados
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
              <div className="text-[11px] font-mono text-slate-400">FRECUENCIA DE REVALIDACIÓN</div>
              <div className="text-base font-bold text-cyan-400 mt-1">
                Cada 30 minutos (Next.js ISR)
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-xs text-slate-300 space-y-2">
            <p className="font-bold text-emerald-400">⚡ Ejecución Manual</p>
            <p className="text-slate-400">
              Puedes forzar una sincronización inmediata para consultar las fuentes oficiales del Estado y actualizar las convocatorias del día.
            </p>
            <div className="pt-2">
              <button
                onClick={handleTriggerScraper}
                disabled={isScraping}
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2"
              >
                <RefreshCw size={14} className={isScraping ? 'animate-spin' : ''} />
                <span>{isScraping ? 'Consultando fuentes...' : 'Sincronizar Convocatorias Ahora'}</span>
              </button>
            </div>
            {scrapeResult && (
              <p className="mt-3 text-xs font-mono font-bold text-emerald-400 bg-emerald-950/40 p-2 rounded-lg border border-emerald-500/30">
                {scrapeResult}
              </p>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: GOOGLE ADSENSE & MONETIZATION */}
      {activeTab === 'ads' && (
        <div className="p-6 sm:p-8 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-6">
          <div className="border-b border-slate-800 pb-4">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <DollarSign className="text-emerald-400" size={18} />
              <span>Configuración de Google AdSense & Monetización</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Guía de cumplimiento con Google Publisher Policies y control de slots publicitarios.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 size={16} /> Estado del archivo ads.txt
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                El endpoint <code className="text-emerald-400 bg-slate-900 px-1.5 py-0.5 rounded">empleos.atpdev.dev/ads.txt</code> se encuentra activo y listo para ser rastreado por el robot de Google AdSense.
              </p>
              <div className="p-3 rounded-lg bg-slate-900 font-mono text-[11px] text-slate-400 border border-slate-800">
                google.com, pub-0000000000000000, DIRECT, f08c47fec0942fa0
              </div>
            </div>

            <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <span className="text-xs font-bold text-cyan-400 flex items-center gap-1.5">
                <ShieldCheck size={16} /> Optimización Core Web Vitals (CLS = 0)
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                Todos los slots de anuncios (`AdBannerSlot`) cuentan con dimensiones mínimas pre-reservadas (Leaderboard, Sidebar y In-Feed) para evitar saltos de pantalla que afecten el posicionamiento SEO.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
