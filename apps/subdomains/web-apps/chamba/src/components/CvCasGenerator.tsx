'use client';

import React, { useState } from 'react';
import { FileSpreadsheet, Copy, Check, Printer, Sparkles, User, GraduationCap, Briefcase, Plus, Trash2, Download, BookOpen } from 'lucide-react';

interface Course {
  id: string;
  title: string;
  inst: string;
  hours: string;
}

interface Experience {
  id: string;
  entity: string;
  role: string;
  period: string;
  type: 'General' | 'Específica';
}

export function CvCasGenerator() {
  const [personal, setPersonal] = useState({
    fullName: 'JUAN ALBERTO PÉREZ RODRÍGUEZ',
    dni: '45678912',
    ruc: '10456789123',
    phone: '987654321',
    email: 'juan.perez@email.com',
    address: 'Av. Javier Prado Este 1234, San Borja, Lima',
    colegiatoria: 'CIP N° 245890 (Habilitado)',
  });

  const [education, setEducation] = useState({
    degree: 'TITULADO Y COLEGIADO',
    carrera: 'Ingeniería de Sistemas e Informática',
    institution: 'Universidad Nacional Mayor de San Marcos',
    year: '2021',
  });

  const [courses, setCourses] = useState<Course[]>([
    { id: '1', title: 'Diplomado en Gestión Pública y Servicio Civil (SERVIR)', inst: 'ENAP - Escuela Nacional de Administración Pública', hours: '120 horas lectivas' },
    { id: '2', title: 'Curso de Especialización en Contrataciones del Estado y SEACE', inst: 'OSCE', hours: '90 horas lectivas' },
  ]);

  const [experiences, setExperiences] = useState<Experience[]>([
    { id: '1', entity: 'Ministerio de Educación (MINEDU)', role: 'Analista de Sistemas de Información', period: '01/2023 - 12/2025 (24 Meses)', type: 'Específica' },
    { id: '2', entity: 'Gobierno Regional de Lima', role: 'Especialista Soporte Técnico TI', period: '01/2021 - 12/2022 (24 Meses)', type: 'General' },
  ]);

  const [copied, setCopied] = useState(false);

  const addCourse = () => {
    setCourses([
      ...courses,
      {
        id: Date.now().toString(),
        title: 'Nuevo Curso o Especialización',
        inst: 'Institución / Universidad',
        hours: '80 horas lectivas',
      },
    ]);
  };

  const removeCourse = (id: string) => {
    setCourses(courses.filter((c) => c.id !== id));
  };

  const updateCourse = (id: string, field: keyof Course, value: string) => {
    setCourses(courses.map((c) => (c.id === id ? { ...c, [field]: value } : c)));
  };

  const addExperience = () => {
    setExperiences([
      ...experiences,
      {
        id: Date.now().toString(),
        entity: 'Nombre de Entidad o Empresa',
        role: 'Cargo Desempeñado',
        period: '01/2024 - 12/2024 (12 Meses)',
        type: 'Específica',
      },
    ]);
  };

  const removeExperience = (id: string) => {
    setExperiences(experiences.filter((e) => e.id !== id));
  };

  const updateExperience = (id: string, field: keyof Experience, value: string) => {
    setExperiences(experiences.map((e) => (e.id === id ? { ...e, [field]: value } : e)));
  };

  const generateFullText = () => {
    return `====================================================================
FICHA RESUMEN DE HOJA DE VIDA — CONVOCATORIA CAS / ESTADO PERÚ
====================================================================

I. DATOS PERSONALES
--------------------------------------------------------------------
- Nombres y Apellidos : ${personal.fullName}
- N° DNI             : ${personal.dni}
- N° RUC             : ${personal.ruc}
- Teléfono / Celular : ${personal.phone}
- Correo Electrónico : ${personal.email}
- Dirección Domicilio: ${personal.address}
- Colegiatura        : ${personal.colegiatoria}

II. FORMACIÓN ACADÉMICA
--------------------------------------------------------------------
- Condición Académica: ${education.degree}
- Especialidad       : ${education.carrera}
- Universidad/Inst.  : ${education.institution}
- Año de Egreso/Tit. : ${education.year}

III. CAPACITACIONES Y CURSOS DE ESPECIALIZACIÓN
--------------------------------------------------------------------
${courses.length > 0 ? courses.map((c, i) => `${i + 1}. ${c.title}\n   Institución: ${c.inst} | Duración: ${c.hours}`).join('\n') : 'Sin registros de capacitación.'}

IV. EXPERIENCIA LABORAL (General y Específica)
--------------------------------------------------------------------
${experiences.length > 0 ? experiences.map((e, i) => `${i + 1}. Entidad: ${e.entity}\n   Cargo: ${e.role}\n   Periodo: ${e.period} [Experiencia ${e.type}]`).join('\n') : 'Sin registros de experiencia.'}

====================================================================
DECLARACIÓN JURADA: Declaro bajo juramento que la información consignada
responde a la verdad según el Principio de Presunción de Veracidad (Ley N° 27444).
====================================================================`;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generateFullText());
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([generateFullText()], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `CV_RESUMEN_CAS_${personal.dni || 'POSTULANTE'}.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-8">
      {/* Action Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900 border border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
            <FileSpreadsheet size={22} />
          </div>
          <div>
            <h2 className="text-base font-bold font-display text-white">Generador de Ficha Resumen CAS (Formatos SERVIR)</h2>
            <p className="text-xs text-slate-400">Rellena tus datos y copia o descarga el formato estructurado aceptado por el Estado.</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold font-display text-xs transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] flex items-center gap-1.5 cursor-pointer"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
            <span>{copied ? '¡Copiado al Portapapeles!' : 'Copiar CV'}</span>
          </button>

          <button
            type="button"
            onClick={handleDownload}
            className="px-3.5 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500 text-cyan-300 hover:text-slate-950 font-bold font-display text-xs transition-all border border-cyan-500/40 flex items-center gap-1.5 cursor-pointer"
          >
            <Download size={15} />
            <span>Descargar .TXT</span>
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold font-mono text-xs transition-colors flex items-center gap-1.5 cursor-pointer border border-white/10"
          >
            <Printer size={15} />
            <span>Imprimir</span>
          </button>
        </div>
      </div>

      {/* Form Input Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* Left Inputs Form */}
        <div className="space-y-6">
          {/* Personal Info Block */}
          <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-4">
            <h3 className="text-sm font-bold font-display text-white flex items-center gap-2 border-b border-white/10 pb-3">
              <User size={16} className="text-emerald-400" />
              <span>1. Datos Personales del Postulante</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <label className="text-slate-400 font-mono">Nombres y Apellidos:</label>
                <input
                  type="text"
                  value={personal.fullName}
                  onChange={(e) => setPersonal({ ...personal, fullName: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-emerald-500/50"
                />
              </div>
              <div className="space-y-1">
                <label className="text-slate-400 font-mono">N° DNI / CE:</label>
                <input
                  type="text"
                  value={personal.dni}
                  onChange={(e) => setPersonal({ ...personal, dni: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-emerald-500/50"
                />
              </div>
              <div className="space-y-1">
                <label className="text-slate-400 font-mono">N° RUC (10):</label>
                <input
                  type="text"
                  value={personal.ruc}
                  onChange={(e) => setPersonal({ ...personal, ruc: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-emerald-500/50"
                />
              </div>
              <div className="space-y-1">
                <label className="text-slate-400 font-mono">Celular / Teléfono:</label>
                <input
                  type="text"
                  value={personal.phone}
                  onChange={(e) => setPersonal({ ...personal, phone: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-emerald-500/50"
                />
              </div>
              <div className="sm:col-span-2 space-y-1">
                <label className="text-slate-400 font-mono">Correo Electrónico:</label>
                <input
                  type="email"
                  value={personal.email}
                  onChange={(e) => setPersonal({ ...personal, email: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-emerald-500/50"
                />
              </div>
              <div className="sm:col-span-2 space-y-1">
                <label className="text-slate-400 font-mono">Colegiatura Profesional (Si aplica):</label>
                <input
                  type="text"
                  value={personal.colegiatoria}
                  onChange={(e) => setPersonal({ ...personal, colegiatoria: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-emerald-500/50"
                />
              </div>
            </div>
          </div>

          {/* Education Block */}
          <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-4">
            <h3 className="text-sm font-bold font-display text-white flex items-center gap-2 border-b border-white/10 pb-3">
              <GraduationCap size={16} className="text-emerald-400" />
              <span>2. Formación Académica</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <label className="text-slate-400 font-mono">Grado Académico:</label>
                <select
                  value={education.degree}
                  onChange={(e) => setEducation({ ...education, degree: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-white/10 text-emerald-400 font-bold focus:outline-none"
                >
                  <option value="SECUNDARIA COMPLETA">Secundaria Completa</option>
                  <option value="TÉCNICO TITULADO">Técnico Titulado</option>
                  <option value="EGRESADO">Egresado Universitario</option>
                  <option value="BACHILLER">Bachiller Universitario</option>
                  <option value="TITULADO Y COLEGIADO">Titulado y Colegiado Habilitado</option>
                  <option value="MAESTRÍA / DOCTORADO">Maestría / Doctorado</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-slate-400 font-mono">Especialidad / Carrera:</label>
                <input
                  type="text"
                  value={education.carrera}
                  onChange={(e) => setEducation({ ...education, carrera: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-emerald-500/50"
                />
              </div>
              <div className="sm:col-span-2 space-y-1">
                <label className="text-slate-400 font-mono">Universidad / Institución:</label>
                <input
                  type="text"
                  value={education.institution}
                  onChange={(e) => setEducation({ ...education, institution: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-950 border border-white/10 text-white focus:outline-none focus:border-emerald-500/50"
                />
              </div>
            </div>
          </div>

          {/* Dynamic Courses Block */}
          <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-sm font-bold font-display text-white flex items-center gap-2">
                <BookOpen size={16} className="text-amber-400" />
                <span>3. Cursos y Especializaciones ({courses.length})</span>
              </h3>
              <button
                type="button"
                onClick={addCourse}
                className="px-2.5 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500 text-amber-300 hover:text-slate-950 text-xs font-mono font-bold transition-all flex items-center gap-1 cursor-pointer border border-amber-500/40"
              >
                <Plus size={14} />
                <span>Agregar Curso</span>
              </button>
            </div>

            <div className="space-y-3">
              {courses.map((course, idx) => (
                <div key={course.id} className="p-3.5 rounded-2xl bg-slate-950/80 border border-white/10 space-y-2 text-xs relative group">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-amber-400 font-bold">Curso N° {idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeCourse(course.id)}
                      className="text-slate-500 hover:text-rose-400 p-1 transition-colors"
                      title="Eliminar curso"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <input
                    type="text"
                    value={course.title}
                    onChange={(e) => updateCourse(course.id, 'title', e.target.value)}
                    placeholder="Título del curso / especialización"
                    className="w-full p-2 rounded-xl bg-slate-900 border border-white/10 text-white focus:outline-none"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={course.inst}
                      onChange={(e) => updateCourse(course.id, 'inst', e.target.value)}
                      placeholder="Institución dictante"
                      className="p-2 rounded-xl bg-slate-900 border border-white/10 text-slate-300 focus:outline-none"
                    />
                    <input
                      type="text"
                      value={course.hours}
                      onChange={(e) => updateCourse(course.id, 'hours', e.target.value)}
                      placeholder="Ej: 120 horas"
                      className="p-2 rounded-xl bg-slate-900 border border-white/10 text-slate-300 focus:outline-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dynamic Experience Block */}
          <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-sm font-bold font-display text-white flex items-center gap-2">
                <Briefcase size={16} className="text-cyan-400" />
                <span>4. Experiencia Laboral ({experiences.length})</span>
              </h3>
              <button
                type="button"
                onClick={addExperience}
                className="px-2.5 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500 text-cyan-300 hover:text-slate-950 text-xs font-mono font-bold transition-all flex items-center gap-1 cursor-pointer border border-cyan-500/40"
              >
                <Plus size={14} />
                <span>Agregar Experiencia</span>
              </button>
            </div>

            <div className="space-y-3">
              {experiences.map((exp, idx) => (
                <div key={exp.id} className="p-3.5 rounded-2xl bg-slate-950/80 border border-white/10 space-y-2 text-xs relative">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-cyan-400 font-bold">Experiencia N° {idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => removeExperience(exp.id)}
                      className="text-slate-500 hover:text-rose-400 p-1 transition-colors"
                      title="Eliminar experiencia"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={exp.entity}
                      onChange={(e) => updateExperience(exp.id, 'entity', e.target.value)}
                      placeholder="Entidad pública / empresa"
                      className="p-2 rounded-xl bg-slate-900 border border-white/10 text-white focus:outline-none"
                    />
                    <input
                      type="text"
                      value={exp.role}
                      onChange={(e) => updateExperience(exp.id, 'role', e.target.value)}
                      placeholder="Cargo o Puesto"
                      className="p-2 rounded-xl bg-slate-900 border border-white/10 text-slate-300 focus:outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      value={exp.period}
                      onChange={(e) => updateExperience(exp.id, 'period', e.target.value)}
                      placeholder="Periodo (ej: 24 meses)"
                      className="p-2 rounded-xl bg-slate-900 border border-white/10 text-slate-300 focus:outline-none"
                    />
                    <select
                      value={exp.type}
                      onChange={(e) => updateExperience(exp.id, 'type', e.target.value as any)}
                      className="p-2 rounded-xl bg-slate-900 border border-white/10 text-cyan-300 font-bold focus:outline-none"
                    >
                      <option value="Específica">Exp. Específica</option>
                      <option value="General">Exp. General</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Right Live Structured Document Preview */}
        <div className="glass-card p-6 rounded-3xl border border-emerald-500/30 bg-slate-950 space-y-4 font-mono text-xs sticky top-24">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <span className="text-emerald-400 font-bold flex items-center gap-1.5">
              <Sparkles size={14} />
              <span>Vista Previa de la Ficha Resumen CAS</span>
            </span>
            <span className="text-[10px] text-slate-400">Formato SERVIR Estándar</span>
          </div>

          <pre className="p-4 rounded-2xl bg-[#070b12] border border-white/10 text-slate-300 overflow-x-auto whitespace-pre-wrap leading-relaxed font-mono text-[11px] max-h-[750px]">
            {generateFullText()}
          </pre>
        </div>

      </div>
    </div>
  );
}

