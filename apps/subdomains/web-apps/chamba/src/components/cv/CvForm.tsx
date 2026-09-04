'use client';

import React, { useState } from 'react';
import { 
  User, GraduationCap, Briefcase, BookOpen, Sparkles, Plus, Trash2, 
  Upload, X, Languages, ShieldCheck, ChevronDown, ChevronUp 
} from 'lucide-react';
import { CvData, EducationItem, ExperienceItem, CourseItem, LanguageItem } from './types';

interface Props {
  data: CvData;
  onChange: (updated: CvData) => void;
}

export function CvForm({ data, onChange }: Props) {
  const [activeSection, setActiveSection] = useState<'personal' | 'profile' | 'education' | 'experience' | 'courses' | 'skills'>('personal');
  const [newSkillInput, setNewSkillInput] = useState('');

  // Helpers to update state immutably
  const updatePersonal = (field: keyof CvData['personal'], value: string) => {
    onChange({
      ...data,
      personal: {
        ...data.personal,
        [field]: value,
      },
    });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona un archivo de imagen válido (JPG, PNG o WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_DIM = 600;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_DIM) {
            height = Math.round((height * MAX_DIM) / width);
            width = MAX_DIM;
          }
        } else {
          if (height > MAX_DIM) {
            width = Math.round((width * MAX_DIM) / height);
            height = MAX_DIM;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
          updatePersonal('photoUrl', compressedDataUrl);
        } else {
          updatePersonal('photoUrl', event.target?.result as string);
        }
      };
      img.onerror = () => {
        updatePersonal('photoUrl', event.target?.result as string);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const removePhoto = () => {
    updatePersonal('photoUrl', '');
  };

  // Education Helpers
  const addEducation = () => {
    const newEdu: EducationItem = {
      id: Date.now().toString(),
      degree: 'BACHILLER',
      carrera: 'Nueva Carrera / Especialidad',
      institution: 'Universidad / Instituto',
      year: '2020 - 2024',
      status: 'Completo',
    };
    onChange({ ...data, education: [...data.education, newEdu] });
  };

  const updateEducation = (id: string, field: keyof EducationItem, val: string) => {
    onChange({
      ...data,
      education: data.education.map((e) => (e.id === id ? { ...e, [field]: val } : e)),
    });
  };

  const removeEducation = (id: string) => {
    onChange({ ...data, education: data.education.filter((e) => e.id !== id) });
  };

  // Experience Helpers
  const addExperience = () => {
    const newExp: ExperienceItem = {
      id: Date.now().toString(),
      entity: 'Nueva Entidad Pública o Empresa',
      role: 'Cargo o Especialidad',
      period: '01/2024 - 12/2024 (12 Meses)',
      type: 'Específica',
      functions: ['Elaboración y ejecución de actividades asignadas al puesto.'],
    };
    onChange({ ...data, experiences: [...data.experiences, newExp] });
  };

  const updateExperience = (id: string, field: keyof ExperienceItem, val: any) => {
    onChange({
      ...data,
      experiences: data.experiences.map((e) => (e.id === id ? { ...e, [field]: val } : e)),
    });
  };

  const removeExperience = (id: string) => {
    onChange({ ...data, experiences: data.experiences.filter((e) => e.id !== id) });
  };

  const addFunctionToExperience = (expId: string) => {
    onChange({
      ...data,
      experiences: data.experiences.map((exp) => {
        if (exp.id === expId) {
          return {
            ...exp,
            functions: [...(exp.functions || []), 'Nueva función o logro destacado en el puesto.'],
          };
        }
        return exp;
      }),
    });
  };

  const updateFunctionInExperience = (expId: string, fIdx: number, val: string) => {
    onChange({
      ...data,
      experiences: data.experiences.map((exp) => {
        if (exp.id === expId) {
          const newFns = [...(exp.functions || [])];
          newFns[fIdx] = val;
          return { ...exp, functions: newFns };
        }
        return exp;
      }),
    });
  };

  const removeFunctionFromExperience = (expId: string, fIdx: number) => {
    onChange({
      ...data,
      experiences: data.experiences.map((exp) => {
        if (exp.id === expId) {
          return {
            ...exp,
            functions: (exp.functions || []).filter((_, idx) => idx !== fIdx),
          };
        }
        return exp;
      }),
    });
  };

  // Courses Helpers
  const addCourse = () => {
    const newCourse: CourseItem = {
      id: Date.now().toString(),
      title: 'Nuevo Curso o Diplomado de Especialización',
      inst: 'Institución / Universidad',
      hours: '90 horas lectivas',
      year: new Date().getFullYear().toString(),
    };
    onChange({ ...data, courses: [...data.courses, newCourse] });
  };

  const updateCourse = (id: string, field: keyof CourseItem, val: string) => {
    onChange({
      ...data,
      courses: data.courses.map((c) => (c.id === id ? { ...c, [field]: val } : c)),
    });
  };

  const removeCourse = (id: string) => {
    onChange({ ...data, courses: data.courses.filter((c) => c.id !== id) });
  };

  // Skills Helpers
  const handleAddSkill = () => {
    const trimmed = newSkillInput.trim();
    if (trimmed && !data.skills.includes(trimmed)) {
      onChange({ ...data, skills: [...data.skills, trimmed] });
      setNewSkillInput('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    onChange({ ...data, skills: data.skills.filter((s) => s !== skillToRemove) });
  };

  // Languages Helpers
  const addLanguage = () => {
    const newLang: LanguageItem = {
      id: Date.now().toString(),
      name: 'Inglés',
      level: 'Intermedio',
    };
    onChange({ ...data, languages: [...data.languages, newLang] });
  };

  const updateLanguage = (id: string, field: keyof LanguageItem, val: any) => {
    onChange({
      ...data,
      languages: data.languages.map((l) => (l.id === id ? { ...l, [field]: val } : l)),
    });
  };

  const removeLanguage = (id: string) => {
    onChange({ ...data, languages: data.languages.filter((l) => l.id !== id) });
  };

  return (
    <div className="space-y-4">
      {/* Navigation tabs */}
      <div className="flex flex-wrap gap-1.5 p-1.5 bg-slate-900/90 rounded-2xl border border-white/10 text-xs">
        <button
          type="button"
          onClick={() => setActiveSection('personal')}
          className={`px-3 py-2 rounded-xl font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
            activeSection === 'personal'
              ? 'bg-emerald-500 text-slate-950 font-bold shadow-md'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <User size={14} />
          <span>1. Personal</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSection('profile')}
          className={`px-3 py-2 rounded-xl font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
            activeSection === 'profile'
              ? 'bg-emerald-500 text-slate-950 font-bold shadow-md'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Sparkles size={14} />
          <span>2. Perfil</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSection('education')}
          className={`px-3 py-2 rounded-xl font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
            activeSection === 'education'
              ? 'bg-emerald-500 text-slate-950 font-bold shadow-md'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <GraduationCap size={14} />
          <span>3. Educación ({data.education.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSection('experience')}
          className={`px-3 py-2 rounded-xl font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
            activeSection === 'experience'
              ? 'bg-emerald-500 text-slate-950 font-bold shadow-md'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Briefcase size={14} />
          <span>4. Experiencia ({data.experiences.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSection('courses')}
          className={`px-3 py-2 rounded-xl font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
            activeSection === 'courses'
              ? 'bg-emerald-500 text-slate-950 font-bold shadow-md'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <BookOpen size={14} />
          <span>5. Cursos ({data.courses.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveSection('skills')}
          className={`px-3 py-2 rounded-xl font-medium transition-all flex items-center gap-1.5 cursor-pointer ${
            activeSection === 'skills'
              ? 'bg-emerald-500 text-slate-950 font-bold shadow-md'
              : 'text-slate-300 hover:text-white hover:bg-slate-800'
          }`}
        >
          <Languages size={14} />
          <span>6. Skills ({data.skills.length})</span>
        </button>
      </div>

      {/* SECCIÓN 1: DATOS PERSONALES */}
      {activeSection === 'personal' && (
        <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="text-sm font-bold font-display text-white flex items-center gap-2">
              <User size={16} className="text-emerald-400" />
              <span>Datos Personales & Identificación</span>
            </h3>
            <span className="text-[11px] font-mono text-slate-400">Paso 1 de 6</span>
          </div>

          {/* Foto de perfil opcional */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-white/10 flex items-center gap-4">
            <div className="relative">
              {data.personal.photoUrl ? (
                <div className="relative group">
                  <img
                    src={data.personal.photoUrl}
                    alt="Foto de perfil"
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={removePhoto}
                    className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white rounded-full p-1 shadow hover:bg-rose-600 transition-colors"
                    title="Eliminar foto"
                  >
                    <X size={12} />
                  </button>
                </div>
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-center text-slate-500">
                  <User size={24} />
                </div>
              )}
            </div>

            <div className="space-y-1 flex-1">
              <label className="text-xs font-bold text-slate-200 block">
                Foto de Perfil (Opcional)
              </label>
              <p className="text-[11px] text-slate-400">
                Visible en las 4 plantillas (en CAS / Estado como Foto Carné oficial, en Ejecutiva, ATS y Tech). Formatos JPG, PNG o WebP.
              </p>
              <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-semibold cursor-pointer border border-white/10 transition-colors">
                <Upload size={13} />
                <span>{data.personal.photoUrl ? 'Cambiar Foto' : 'Subir Foto'}</span>
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="sm:col-span-2 space-y-1">
              <label className="text-slate-400 font-mono">Nombres y Apellidos Completos:</label>
              <input
                type="text"
                value={data.personal.fullName}
                onChange={(e) => updatePersonal('fullName', e.target.value)}
                placeholder="JUAN ALBERTO PÉREZ RODRÍGUEZ"
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-emerald-500/50"
              />
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label className="text-slate-400 font-mono">Título Profesional / Headline:</label>
              <input
                type="text"
                value={data.personal.headline}
                onChange={(e) => updatePersonal('headline', e.target.value)}
                placeholder="Ingeniero de Sistemas | Especialista en Contrataciones del Estado"
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-emerald-500/50"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-400 font-mono">N° DNI / C.E.:</label>
              <input
                type="text"
                value={data.personal.dni}
                onChange={(e) => updatePersonal('dni', e.target.value)}
                placeholder="45678912"
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-white/10 text-white font-mono focus:outline-none focus:border-emerald-500/50"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-400 font-mono">N° RUC (10):</label>
              <input
                type="text"
                value={data.personal.ruc}
                onChange={(e) => updatePersonal('ruc', e.target.value)}
                placeholder="10456789123"
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-white/10 text-white font-mono focus:outline-none focus:border-emerald-500/50"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-400 font-mono">Celular / Teléfono:</label>
              <input
                type="text"
                value={data.personal.phone}
                onChange={(e) => updatePersonal('phone', e.target.value)}
                placeholder="+51 987 654 321"
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-emerald-500/50"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-400 font-mono">Correo Electrónico:</label>
              <input
                type="email"
                value={data.personal.email}
                onChange={(e) => updatePersonal('email', e.target.value)}
                placeholder="juan.perez@email.com"
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-emerald-500/50"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-400 font-mono">Dirección Domiciliaria:</label>
              <input
                type="text"
                value={data.personal.address}
                onChange={(e) => updatePersonal('address', e.target.value)}
                placeholder="Av. Javier Prado Este 2450"
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-emerald-500/50"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-400 font-mono">Ciudad y País:</label>
              <input
                type="text"
                value={data.personal.city}
                onChange={(e) => updatePersonal('city', e.target.value)}
                placeholder="Lima, Perú"
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-emerald-500/50"
              />
            </div>

            <div className="sm:col-span-2 space-y-1">
              <label className="text-slate-400 font-mono">Colegiatura Profesional (Si aplica):</label>
              <input
                type="text"
                value={data.personal.colegiatoria}
                onChange={(e) => updatePersonal('colegiatoria', e.target.value)}
                placeholder="CIP N° 245890 (Colegiado y Habilitado)"
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-emerald-500/50"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-400 font-mono">Perfil LinkedIn (Opcional):</label>
              <input
                type="text"
                value={data.personal.linkedin}
                onChange={(e) => updatePersonal('linkedin', e.target.value)}
                placeholder="linkedin.com/in/juanperez"
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-emerald-500/50"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-400 font-mono">Portafolio / Web (Opcional):</label>
              <input
                type="text"
                value={data.personal.website}
                onChange={(e) => updatePersonal('website', e.target.value)}
                placeholder="github.com/juanperez"
                className="w-full p-2.5 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-emerald-500/50"
              />
            </div>
          </div>
        </div>
      )}

      {/* SECCIÓN 2: PERFIL PROFESIONAL */}
      {activeSection === 'profile' && (
        <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="text-sm font-bold font-display text-white flex items-center gap-2">
              <Sparkles size={16} className="text-emerald-400" />
              <span>Resumen Profesional / Perfil Ejecutivo</span>
            </h3>
            <span className="text-[11px] font-mono text-slate-400">Paso 2 de 6</span>
          </div>

          <div className="space-y-2 text-xs">
            <p className="text-slate-400">
              Escribe un resumen conciso de 3 a 5 líneas destacando tus años de trayectoria, especialidades principales, logros y vocación de servicio.
            </p>
            <textarea
              rows={6}
              value={data.profileSummary}
              onChange={(e) => onChange({ ...data, profileSummary: e.target.value })}
              placeholder="Ingeniero de Sistemas colegiado con más de 7 años de experiencia liderando proyectos..."
              className="w-full p-3 rounded-2xl bg-slate-950 border border-white/10 text-white leading-relaxed focus:outline-none focus:border-emerald-500/50"
            />
            <div className="flex justify-between text-[11px] text-slate-500 font-mono">
              <span>Consejo: Menciona normativas (Ley 30225, SERVIR) o tecnologías clave.</span>
              <span>{data.profileSummary.length} caracteres</span>
            </div>
          </div>
        </div>
      )}

      {/* SECCIÓN 3: FORMACIÓN ACADÉMICA */}
      {activeSection === 'education' && (
        <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="text-sm font-bold font-display text-white flex items-center gap-2">
              <GraduationCap size={16} className="text-emerald-400" />
              <span>Formación Académica ({data.education.length})</span>
            </h3>
            <button
              type="button"
              onClick={addEducation}
              className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-slate-950 text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer border border-emerald-500/40"
            >
              <Plus size={14} />
              <span>Agregar Grado</span>
            </button>
          </div>

          <div className="space-y-3">
            {data.education.map((edu, idx) => (
              <div key={edu.id} className="p-4 rounded-2xl bg-slate-950/80 border border-white/10 space-y-3 text-xs relative">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-emerald-400 font-bold">Grado Académico N° {idx + 1}</span>
                  <button
                    type="button"
                    onClick={() => removeEducation(edu.id)}
                    className="text-slate-500 hover:text-rose-400 p-1 transition-colors"
                    title="Eliminar este grado"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div className="space-y-1">
                    <label className="text-slate-400 font-mono text-[11px]">Nivel o Condición Académica:</label>
                    <select
                      value={edu.degree}
                      onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-slate-900 border border-white/10 text-emerald-400 font-bold focus:outline-none"
                    >
                      <option value="SECUNDARIA COMPLETA">Secundaria Completa</option>
                      <option value="TÉCNICO EGRESADO">Técnico Egresado</option>
                      <option value="TÉCNICO TITULADO">Técnico Titulado</option>
                      <option value="EGRESADO UNIVERSITARIO">Egresado Universitario</option>
                      <option value="BACHILLER">Bachiller Universitario</option>
                      <option value="TITULADO Y COLEGIADO">Titulado y Colegiado Habilitado</option>
                      <option value="MAESTRÍA">Maestría</option>
                      <option value="DOCTORADO">Doctorado</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-400 font-mono text-[11px]">Carrera o Especialidad:</label>
                    <input
                      type="text"
                      value={edu.carrera}
                      onChange={(e) => updateEducation(edu.id, 'carrera', e.target.value)}
                      placeholder="Ingeniería de Sistemas e Informática"
                      className="w-full p-2.5 rounded-xl bg-slate-900 border border-white/10 text-white focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-400 font-mono text-[11px]">Universidad o Instituto:</label>
                    <input
                      type="text"
                      value={edu.institution}
                      onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                      placeholder="Universidad Nacional Mayor de San Marcos"
                      className="w-full p-2.5 rounded-xl bg-slate-900 border border-white/10 text-white focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-400 font-mono text-[11px]">Año / Periodo (Egreso o Título):</label>
                    <input
                      type="text"
                      value={edu.year}
                      onChange={(e) => updateEducation(edu.id, 'year', e.target.value)}
                      placeholder="2018 - 2022"
                      className="w-full p-2.5 rounded-xl bg-slate-900 border border-white/10 text-white font-mono focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECCIÓN 4: EXPERIENCIA LABORAL */}
      {activeSection === 'experience' && (
        <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="text-sm font-bold font-display text-white flex items-center gap-2">
              <Briefcase size={16} className="text-emerald-400" />
              <span>Experiencia Laboral ({data.experiences.length})</span>
            </h3>
            <button
              type="button"
              onClick={addExperience}
              className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-slate-950 text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer border border-emerald-500/40"
            >
              <Plus size={14} />
              <span>Agregar Experiencia</span>
            </button>
          </div>

          <div className="space-y-4">
            {data.experiences.map((exp, idx) => (
              <div key={exp.id} className="p-4 rounded-2xl bg-slate-950/80 border border-white/10 space-y-3 text-xs relative">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-emerald-400 font-bold">Experiencia N° {idx + 1}</span>
                  <button
                    type="button"
                    onClick={() => removeExperience(exp.id)}
                    className="text-slate-500 hover:text-rose-400 p-1 transition-colors"
                    title="Eliminar este empleo"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div className="space-y-1">
                    <label className="text-slate-400 font-mono text-[11px]">Entidad Pública / Empresa:</label>
                    <input
                      type="text"
                      value={exp.entity}
                      onChange={(e) => updateExperience(exp.id, 'entity', e.target.value)}
                      placeholder="Ministerio de Educación / Empresa"
                      className="w-full p-2.5 rounded-xl bg-slate-900 border border-white/10 text-white focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-400 font-mono text-[11px]">Cargo Desempeñado:</label>
                    <input
                      type="text"
                      value={exp.role}
                      onChange={(e) => updateExperience(exp.id, 'role', e.target.value)}
                      placeholder="Coordinador de Sistemas / Analista"
                      className="w-full p-2.5 rounded-xl bg-slate-900 border border-white/10 text-white focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-400 font-mono text-[11px]">Periodo / Tiempo:</label>
                    <input
                      type="text"
                      value={exp.period}
                      onChange={(e) => updateExperience(exp.id, 'period', e.target.value)}
                      placeholder="01/2023 - 12/2024 (24 Meses)"
                      className="w-full p-2.5 rounded-xl bg-slate-900 border border-white/10 text-white font-mono focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-400 font-mono text-[11px]">Clasificación de Experiencia (CAS):</label>
                    <select
                      value={exp.type}
                      onChange={(e) => updateExperience(exp.id, 'type', e.target.value)}
                      className="w-full p-2.5 rounded-xl bg-slate-900 border border-white/10 text-emerald-400 font-bold focus:outline-none"
                    >
                      <option value="Específica">Experiencia Específica (Relacionada directamente al puesto)</option>
                      <option value="General">Experiencia General (Trayectoria laboral acumulada)</option>
                    </select>
                  </div>
                </div>

                {/* Funciones y logros */}
                <div className="space-y-2 pt-2 border-t border-white/5">
                  <div className="flex items-center justify-between">
                    <label className="text-slate-400 font-mono text-[11px]">
                      Funciones y Logros Destacados ({exp.functions?.length || 0}):
                    </label>
                    <button
                      type="button"
                      onClick={() => addFunctionToExperience(exp.id)}
                      className="text-emerald-400 hover:text-emerald-300 font-mono text-[11px] flex items-center gap-1 cursor-pointer"
                    >
                      <Plus size={12} />
                      <span>Agregar Viñeta</span>
                    </button>
                  </div>

                  <div className="space-y-1.5">
                    {(exp.functions || []).map((fn, fIdx) => (
                      <div key={fIdx} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={fn}
                          onChange={(e) => updateFunctionInExperience(exp.id, fIdx, e.target.value)}
                          placeholder="Descripción de la función realizada..."
                          className="flex-1 p-2 rounded-xl bg-slate-900 border border-white/10 text-slate-200 text-xs focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => removeFunctionFromExperience(exp.id, fIdx)}
                          className="text-slate-500 hover:text-rose-400 p-1"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECCIÓN 5: CURSOS Y CAPACITACIONES */}
      {activeSection === 'courses' && (
        <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="text-sm font-bold font-display text-white flex items-center gap-2">
              <BookOpen size={16} className="text-emerald-400" />
              <span>Capacitaciones & Horas Lectivas ({data.courses.length})</span>
            </h3>
            <button
              type="button"
              onClick={addCourse}
              className="px-3 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-slate-950 text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer border border-emerald-500/40"
            >
              <Plus size={14} />
              <span>Agregar Curso</span>
            </button>
          </div>

          <p className="text-xs text-slate-400">
            En las convocatorias del Estado (CAS), SERVIR y las entidades exigen un mínimo de horas lectivas acreditadas (ej: 80, 90 o 120 hrs).
          </p>

          <div className="space-y-3">
            {data.courses.map((c, idx) => (
              <div key={c.id} className="p-4 rounded-2xl bg-slate-950/80 border border-white/10 space-y-2.5 text-xs relative">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-emerald-400 font-bold">Curso N° {idx + 1}</span>
                  <button
                    type="button"
                    onClick={() => removeCourse(c.id)}
                    className="text-slate-500 hover:text-rose-400 p-1 transition-colors"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 font-mono text-[11px]">Denominación del Curso / Diplomado:</label>
                  <input
                    type="text"
                    value={c.title}
                    onChange={(e) => updateCourse(c.id, 'title', e.target.value)}
                    placeholder="Diplomado en Gestión Pública y SEACE"
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-white/10 text-white focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="sm:col-span-2 space-y-1">
                    <label className="text-slate-400 font-mono text-[11px]">Institución Emisora:</label>
                    <input
                      type="text"
                      value={c.inst}
                      onChange={(e) => updateCourse(c.id, 'inst', e.target.value)}
                      placeholder="OSCE / ENAP - SERVIR / Universidad"
                      className="w-full p-2.5 rounded-xl bg-slate-900 border border-white/10 text-white focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-400 font-mono text-[11px]">Horas Lectivas:</label>
                    <input
                      type="text"
                      value={c.hours}
                      onChange={(e) => updateCourse(c.id, 'hours', e.target.value)}
                      placeholder="120 horas lectivas"
                      className="w-full p-2.5 rounded-xl bg-slate-900 border border-white/10 text-emerald-400 font-bold font-mono focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECCIÓN 6: HABILIDADES & IDIOMAS */}
      {activeSection === 'skills' && (
        <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-6">
          {/* Competencias Clave */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-sm font-bold font-display text-white flex items-center gap-2">
                <Sparkles size={16} className="text-emerald-400" />
                <span>Competencias & Habilidades Clave ({data.skills.length})</span>
              </h3>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newSkillInput}
                onChange={(e) => setNewSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSkill();
                  }
                }}
                placeholder="Escribe una habilidad (ej: SIAF, SEACE, Liderazgo) y pulsa Enter..."
                className="flex-1 p-2.5 rounded-xl bg-slate-950 border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-500/50"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs cursor-pointer transition-colors"
              >
                Añadir
              </button>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {data.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-xl bg-slate-900 border border-white/15 text-slate-200 text-xs flex items-center gap-1.5"
                >
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="text-slate-400 hover:text-rose-400 transition-colors"
                  >
                    <X size={13} />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Idiomas */}
          <div className="space-y-3 pt-4 border-t border-white/10">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold font-display text-white flex items-center gap-2">
                <Languages size={16} className="text-emerald-400" />
                <span>Idiomas ({data.languages.length})</span>
              </h3>
              <button
                type="button"
                onClick={addLanguage}
                className="px-3 py-1 rounded-xl bg-emerald-500/20 hover:bg-emerald-500 text-emerald-300 hover:text-slate-950 text-xs font-mono font-bold transition-all flex items-center gap-1.5 cursor-pointer border border-emerald-500/40"
              >
                <Plus size={13} />
                <span>Agregar Idioma</span>
              </button>
            </div>

            <div className="space-y-2">
              {data.languages.map((l) => (
                <div key={l.id} className="p-3 rounded-xl bg-slate-950/80 border border-white/10 flex items-center gap-2 text-xs">
                  <input
                    type="text"
                    value={l.name}
                    onChange={(e) => updateLanguage(l.id, 'name', e.target.value)}
                    placeholder="Nombre del idioma"
                    className="flex-1 p-2 rounded-lg bg-slate-900 border border-white/10 text-white focus:outline-none"
                  />
                  <select
                    value={l.level}
                    onChange={(e) => updateLanguage(l.id, 'level', e.target.value)}
                    className="p-2 rounded-lg bg-slate-900 border border-white/10 text-emerald-400 font-bold focus:outline-none"
                  >
                    <option value="Básico">Básico</option>
                    <option value="Intermedio">Intermedio</option>
                    <option value="Avanzado">Avanzado</option>
                    <option value="Nativo">Nativo</option>
                    <option value="Bilingüe">Bilingüe</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => removeLanguage(l.id)}
                    className="text-slate-500 hover:text-rose-400 p-1.5"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
