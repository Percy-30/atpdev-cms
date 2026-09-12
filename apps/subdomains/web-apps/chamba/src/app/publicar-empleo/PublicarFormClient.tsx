'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Building2, 
  Briefcase, 
  FileText, 
  Mail, 
  Phone, 
  MapPin, 
  DollarSign, 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  Send, 
  Sparkles, 
  ExternalLink,
  ShieldCheck,
  HelpCircle,
  Clock
} from 'lucide-react';

const REGIONES_PERU = [
  'Nacional / Remoto',
  'Amazonas',
  'Áncash',
  'Apurímac',
  'Arequipa',
  'Ayacucho',
  'Cajamarca',
  'Callao',
  'Cusco',
  'Huancavelica',
  'Huánuco',
  'Ica',
  'Junín',
  'La Libertad',
  'Lambayeque',
  'Lima',
  'Loreto',
  'Madre de Dios',
  'Moquegua',
  'Pasco',
  'Piura',
  'Puno',
  'San Martín',
  'Tacna',
  'Tumbes',
  'Ucayali'
];

const CATEGORIAS_EMPLEO = [
  'Administración y Gestión Pública',
  'Tecnología e Informática',
  'Salud y Medicina',
  'Educación y Docencia',
  'Derecho y Asesoría Legal',
  'Contabilidad y Finanzas',
  'Ingeniería y Construcción',
  'Atención al Ciudadano y Operativo',
  'Logística y Contrataciones del Estado',
  'Seguridad y Vigilancia',
  'Servicios Generales y Mantenimiento',
  'Otro'
];

const REGIMENES = [
  'CAS 1057',
  'D.L. 728',
  'D.L. 276',
  'Locación / FAG',
  'Prácticas',
  'Privado'
];

export default function PublicarFormClient() {
  const [formData, setFormData] = useState({
    entity_name: '',
    entity_ruc: '',
    sector_type: 'CAS 1057',
    is_public_entity: true,
    title: '',
    vacancies_count: 1,
    salary_text: '',
    education_level: 'Titulado',
    region: 'Lima',
    category: 'Administración y Gestión Pública',
    bases_pdf_url: '',
    apply_url: '',
    start_date: new Date().toISOString().split('T')[0],
    end_date: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
    requirements: '',
    description: '',
    contact_email: '',
    contact_phone: ''
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{ jobId: string; slug: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setLoading(true);

    try {
      // Validaciones en cliente
      if (!formData.entity_name.trim()) {
        throw new Error('Debe indicar el nombre oficial de la entidad o empresa.');
      }
      if (!formData.title.trim()) {
        throw new Error('Debe indicar el título del puesto o código de convocatoria.');
      }
      if (!formData.apply_url.trim()) {
        throw new Error('Debe indicar el enlace al portal institucional de postulación.');
      }
      if (formData.entity_ruc.trim()) {
        const cleanRuc = formData.entity_ruc.replace(/\D/g, '');
        if (cleanRuc.length !== 11) {
          throw new Error('El RUC debe tener exactamente 11 dígitos numéricos.');
        }
      }

      const res = await fetch('/api/jobs/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Error al procesar el registro de la convocatoria.');
      }

      setSuccessData({
        jobId: data.jobId,
        slug: data.slug
      });
    } catch (err: any) {
      setErrorMsg(err.message || 'Ocurrió un error inesperado. Por favor verifique los datos.');
    } finally {
      setLoading(false);
    }
  };

  if (successData) {
    return (
      <div className="rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 border border-emerald-500/40 p-8 sm:p-12 text-center space-y-6 shadow-[0_20px_50px_rgba(16,185,129,0.15)]">
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/40 shadow-[0_0_30px_rgba(16,185,129,0.3)]">
          <CheckCircle2 size={36} />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black font-display text-white">
            ¡Convocatoria Registrada Exitosamente!
          </h2>
          <p className="text-sm text-slate-300 max-w-md mx-auto">
            La convocatoria para <strong className="text-emerald-400">{formData.title}</strong> ha sido recibida y registrada en el sistema de <strong className="text-white">chamba pro</strong>.
          </p>
        </div>

        <div className="bg-slate-950/80 rounded-2xl p-4 border border-white/10 max-w-md mx-auto text-left space-y-2 text-xs font-mono">
          <div className="flex justify-between text-slate-400">
            <span>ID de Registro:</span>
            <span className="text-white font-bold">{successData.jobId}</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Entidad:</span>
            <span className="text-white truncate max-w-[200px]">{formData.entity_name}</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Régimen:</span>
            <span className="text-emerald-400">{formData.sector_type}</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Vacantes:</span>
            <span className="text-white">{formData.vacancies_count}</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Link
            href={`/empleos/${successData.slug}`}
            className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-black font-display transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] flex items-center gap-2"
          >
            <span>Ver Convocatoria en Vivo</span>
            <ExternalLink size={14} />
          </Link>

          <button
            onClick={() => {
              setSuccessData(null);
              setFormData({
                entity_name: '',
                entity_ruc: '',
                sector_type: 'CAS 1057',
                is_public_entity: true,
                title: '',
                vacancies_count: 1,
                salary_text: '',
                education_level: 'Titulado',
                region: 'Lima',
                category: 'Administración y Gestión Pública',
                bases_pdf_url: '',
                apply_url: '',
                start_date: new Date().toISOString().split('T')[0],
                end_date: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
                requirements: '',
                description: '',
                contact_email: '',
                contact_phone: ''
              });
            }}
            className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold font-display transition-all border border-white/10"
          >
            Publicar Otra Oferta
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Alerta de Error */}
      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-3 animate-shake">
          <AlertCircle size={18} className="shrink-0 text-rose-400" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Sección 1: Datos de la Entidad o Empresa */}
      <div className="rounded-3xl bg-slate-900/60 border border-white/10 p-6 sm:p-8 space-y-5">
        <div className="flex items-center gap-2.5 text-white font-bold font-display text-base border-b border-white/10 pb-3">
          <Building2 size={18} className="text-emerald-400" />
          <span>1. Información de la Entidad o Empresa</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1.5">
              Nombre Oficial de la Institución / Empresa <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              name="entity_name"
              required
              value={formData.entity_name}
              onChange={handleChange}
              placeholder="Ej: MUNICIPALIDAD DISTRITAL DE MIRAFLORES o MINISTERIO DE ENERGÍA"
              className="w-full px-4 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1.5">
              RUC de la Entidad (11 dígitos)
            </label>
            <input
              type="text"
              name="entity_ruc"
              maxLength={11}
              value={formData.entity_ruc}
              onChange={handleChange}
              placeholder="Ej: 20131312955"
              className="w-full px-4 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1.5">
              Régimen de Contratación <span className="text-rose-400">*</span>
            </label>
            <select
              name="sector_type"
              value={formData.sector_type}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500 font-display"
            >
              {REGIMENES.map(r => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1.5">
              Ubicación / Región <span className="text-rose-400">*</span>
            </label>
            <select
              name="region"
              value={formData.region}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500 font-display"
            >
              {REGIONES_PERU.map(reg => (
                <option key={reg} value={reg}>{reg}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Sección 2: Datos de la Convocatoria / Puesto */}
      <div className="rounded-3xl bg-slate-900/60 border border-white/10 p-6 sm:p-8 space-y-5">
        <div className="flex items-center gap-2.5 text-white font-bold font-display text-base border-b border-white/10 pb-3">
          <Briefcase size={18} className="text-emerald-400" />
          <span>2. Datos de la Convocatoria y Perfil del Puesto</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-xs font-mono text-slate-300 mb-1.5">
              Título del Puesto / Código de Proceso <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              name="title"
              required
              value={formData.title}
              onChange={handleChange}
              placeholder="Ej: CAS N° 045-2026: Especialista en Contrataciones del Estado"
              className="w-full px-4 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1.5">
              Número de Vacantes <span className="text-rose-400">*</span>
            </label>
            <input
              type="number"
              name="vacancies_count"
              min={1}
              required
              value={formData.vacancies_count}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1.5">
              Remuneración (Soles) <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              name="salary_text"
              required
              value={formData.salary_text}
              onChange={handleChange}
              placeholder="Ej: S/ 4,500.00 soles mensual"
              className="w-full px-4 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1.5">
              Área / Especialidad
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
            >
              {CATEGORIAS_EMPLEO.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1.5">
              Nivel Educativo Requerido
            </label>
            <select
              name="education_level"
              value={formData.education_level}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="Secundaria">Secundaria Completa</option>
              <option value="Técnico">Técnico Superior</option>
              <option value="Egresado">Egresado Universitario / Técnico</option>
              <option value="Bachiller">Bachiller</option>
              <option value="Titulado">Titulado Universitario</option>
              <option value="Maestría / Doctorado">Maestría / Doctorado</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1.5">
              Fecha de Inicio de Postulación
            </label>
            <input
              type="date"
              name="start_date"
              value={formData.start_date}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1.5">
              Fecha Límite de Postulación <span className="text-rose-400">*</span>
            </label>
            <input
              type="date"
              name="end_date"
              required
              value={formData.end_date}
              onChange={handleChange}
              className="w-full px-4 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-mono text-slate-300 mb-1.5">
              Requisitos Principales (uno por línea)
            </label>
            <textarea
              name="requirements"
              rows={3}
              value={formData.requirements}
              onChange={handleChange}
              placeholder="Ej:&#10;- Título universitario en Contabilidad o Administración.&#10;- Experiencia general mínima de 3 años en el sector público.&#10;- Certificación OSCE vigente."
              className="w-full px-4 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 leading-relaxed font-mono"
            />
          </div>
        </div>
      </div>

      {/* Sección 3: Enlaces Oficiales y Bases */}
      <div className="rounded-3xl bg-slate-900/60 border border-white/10 p-6 sm:p-8 space-y-5">
        <div className="flex items-center gap-2.5 text-white font-bold font-display text-base border-b border-white/10 pb-3">
          <FileText size={18} className="text-emerald-400" />
          <span>3. Documentación Oficial y Enlaces de Postulación</span>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1.5">
              Portal Oficial de Postulación / Mesa de Partes Virtual <span className="text-rose-400">*</span>
            </label>
            <input
              type="url"
              name="apply_url"
              required
              value={formData.apply_url}
              onChange={handleChange}
              placeholder="https://convocatorias.entidad.gob.pe o portal institucional"
              className="w-full px-4 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 font-mono"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              URL exacta a donde los postulantes accederán para cargar sus anexos o registrarse.
            </p>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1.5">
              Enlace Directo a las Bases Oficiales (PDF o Google Drive)
            </label>
            <input
              type="url"
              name="bases_pdf_url"
              value={formData.bases_pdf_url}
              onChange={handleChange}
              placeholder="https://drive.google.com/... o https://cdn.entidad.gob.pe/bases.pdf"
              className="w-full px-4 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 font-mono"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Permite a los postulantes descargar las bases y anexos con 1 solo clic desde chamba pro.
            </p>
          </div>
        </div>
      </div>

      {/* Sección 4: Contacto de Recursos Humanos */}
      <div className="rounded-3xl bg-slate-900/60 border border-white/10 p-6 sm:p-8 space-y-5">
        <div className="flex items-center gap-2.5 text-white font-bold font-display text-base border-b border-white/10 pb-3">
          <Mail size={18} className="text-emerald-400" />
          <span>4. Contacto de la Oficina de Recursos Humanos (OGRH)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1.5">
              Correo Institucional de Contacto
            </label>
            <input
              type="email"
              name="contact_email"
              value={formData.contact_email}
              onChange={handleChange}
              placeholder="convocatorias@entidad.gob.pe"
              className="w-full px-4 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1.5">
              Teléfono / Central Telefónica
            </label>
            <input
              type="tel"
              name="contact_phone"
              value={formData.contact_phone}
              onChange={handleChange}
              placeholder="(01) 513-9000 anexo 214"
              className="w-full px-4 py-2.5 bg-slate-950 border border-white/10 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 font-mono"
            />
          </div>
        </div>
      </div>

      {/* Botón de Envío */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <p className="text-xs text-slate-400 flex items-center gap-1.5">
          <ShieldCheck size={16} className="text-emerald-400 shrink-0" />
          <span>Servicio gratuito para entidades públicas. Verificación oficial en &lt; 2 horas.</span>
        </p>

        <button
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black font-display text-sm transition-all shadow-[0_0_25px_rgba(16,185,129,0.35)] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
              <span>Registrando Convocatoria...</span>
            </>
          ) : (
            <>
              <Send size={16} />
              <span>Publicar Convocatoria Oficial</span>
            </>
          )}
        </button>
      </div>
    </form>
  );
}
