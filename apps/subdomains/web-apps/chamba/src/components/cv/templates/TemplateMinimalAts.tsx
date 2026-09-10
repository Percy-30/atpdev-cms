'use client';

import React from 'react';
import { CvData } from '../types';

interface TemplateProps {
  data: CvData;
}

export function TemplateMinimalAts({ data }: TemplateProps) {
  const { personal, profileSummary, education, courses, experiences, skills, languages } = data;

  const contactPieces = [
    personal.city,
    personal.phone,
    personal.email,
    personal.dni ? `DNI: ${personal.dni}` : null,
    personal.ruc ? `RUC: ${personal.ruc}` : null,
    personal.linkedin,
    personal.website,
  ].filter(Boolean);

  return (
    <div className="bg-white text-slate-900 font-serif text-[11px] leading-normal p-8 sm:p-12 max-w-[820px] mx-auto shadow-sm border border-slate-200 print:border-none print:shadow-none print:p-10 print:sm:p-12 print:m-0 print:max-w-none print:w-full print:bg-white space-y-4">
      {/* Encabezado Clásico Estilo Harvard (con soporte opcional de Foto) */}
      <div role="banner" className="cv-header border-b border-slate-900 pb-3 cv-avoid-break">
        <div className={`flex items-center gap-4 ${personal.photoUrl ? 'justify-between text-left' : 'justify-center text-center'}`}>
          <div className="space-y-1 flex-1">
            <h2 className="text-2xl font-bold uppercase tracking-wide text-slate-950 font-serif">
              {personal.fullName || 'NOMBRES Y APELLIDOS'}
            </h2>
            {personal.headline && (
              <p className="text-xs font-sans font-semibold text-slate-700 uppercase tracking-wider">
                {personal.headline}
              </p>
            )}
            <div className={`text-[10px] font-sans text-slate-600 flex flex-wrap gap-x-2.5 gap-y-1 pt-1 ${personal.photoUrl ? 'justify-start' : 'justify-center'}`}>
              {contactPieces.map((piece, idx) => (
                <React.Fragment key={idx}>
                  <span>{piece}</span>
                  {idx < contactPieces.length - 1 && <span className="text-slate-400">•</span>}
                </React.Fragment>
              ))}
            </div>
            {personal.colegiatoria && (
              <div className="text-[9.5px] font-sans text-slate-700 italic">
                {personal.colegiatoria}
              </div>
            )}
          </div>

          {personal.photoUrl && (
            <div className="shrink-0">
              <img
                src={personal.photoUrl}
                alt={personal.fullName || 'Foto'}
                className="w-18 h-22 object-cover rounded border border-slate-300 shadow-sm"
                style={{ width: '72px', height: '88px' }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Resumen Profesional */}
      {profileSummary && (
        <section className="space-y-1 cv-avoid-break">
          <h2 className="text-[11px] font-sans font-bold uppercase tracking-wider text-slate-950 border-b border-slate-300 pb-0.5">
            Resumen Profesional
          </h2>
          <p className="text-[10.5px] text-slate-800 text-justify leading-relaxed">
            {profileSummary}
          </p>
        </section>
      )}

      {/* Experiencia Laboral */}
      <section className="space-y-2 cv-avoid-break">
        <h2 className="text-[11px] font-sans font-bold uppercase tracking-wider text-slate-950 border-b border-slate-300 pb-0.5">
          Experiencia Laboral
        </h2>
        <div className="space-y-3">
          {experiences.map((exp, idx) => (
            <div key={exp.id || idx} className="space-y-0.5 cv-avoid-break">
              <div className="flex justify-between items-baseline font-sans">
                <span className="font-bold text-slate-950 text-[11px]">
                  {exp.role || (exp.entity ? '' : '(Nuevo empleo en edición)')}{' '}
                  {exp.entity && <span className="font-semibold text-slate-800">— {exp.entity}</span>}
                </span>
                <span className="text-[10px] font-mono text-slate-600 shrink-0">
                  {exp.period}
                </span>
              </div>
              {exp.type && (
                <div className="text-[9px] font-sans font-medium text-slate-500 uppercase">
                  Modalidad: Experiencia {exp.type}
                </div>
              )}
              {exp.functions && exp.functions.filter((fn) => fn.trim().length > 0).length > 0 && (
                <ul className="list-disc list-outside ml-4 space-y-0.5 text-[10px] text-slate-800 pt-0.5">
                  {exp.functions
                    .filter((fn) => fn.trim().length > 0)
                    .map((fn, fIdx) => (
                      <li key={fIdx} className="leading-snug">{fn}</li>
                    ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Educación */}
      <section className="space-y-1.5 cv-avoid-break">
        <h2 className="text-[11px] font-sans font-bold uppercase tracking-wider text-slate-950 border-b border-slate-300 pb-0.5">
          Educación y Formación Académica
        </h2>
        <div className="space-y-2">
          {education.map((edu, idx) => (
            <div key={edu.id || idx} className="flex justify-between items-baseline font-sans cv-avoid-break">
              <div>
                <span className="font-bold text-slate-950 text-[10.5px]">
                  {edu.carrera ? `${edu.degree}: ${edu.carrera}` : edu.degree || '(Nuevo grado en edición)'}
                </span>
                {(edu.institution || edu.status) && (
                  <span className="block text-[10px] text-slate-700">
                    {edu.institution} {edu.status && `(${edu.status})`}
                  </span>
                )}
              </div>
              {edu.year && (
                <span className="text-[10px] font-mono text-slate-600 shrink-0">
                  {edu.year}
                </span>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Capacitaciones y Cursos */}
      {courses && courses.length > 0 && (
        <section className="space-y-1.5 cv-avoid-break">
          <h2 className="text-[11px] font-sans font-bold uppercase tracking-wider text-slate-950 border-b border-slate-300 pb-0.5">
            Capacitaciones y Cursos de Especialización
          </h2>
          <div className="space-y-1">
            {courses.map((course, idx) => (
              <div key={course.id || idx} className="flex justify-between items-baseline text-[10px] font-sans cv-avoid-break">
                <div>
                  <span className="font-semibold text-slate-900">{course.title || '(Nuevo curso en edición)'}</span>
                  {course.inst && <span className="text-slate-600"> — {course.inst}</span>}
                </div>
                <div className="text-right shrink-0 font-mono text-slate-700 text-[9.5px]">
                  <span>{course.hours}</span>
                  {course.year && <span> ({course.year})</span>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Competencias y Habilidades */}
      <section className="space-y-1 font-sans text-[10px] cv-avoid-break">
        <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-950 border-b border-slate-300 pb-0.5">
          Competencias e Idiomas
        </h2>
        {skills && skills.length > 0 && (
          <div className="flex gap-2">
            <span className="font-bold text-slate-900 shrink-0">Competencias Clave:</span>
            <span className="text-slate-700">{skills.join(', ')}.</span>
          </div>
        )}
        {languages && languages.length > 0 && (
          <div className="flex gap-2">
            <span className="font-bold text-slate-900 shrink-0">Idiomas:</span>
            <span className="text-slate-700">
              {languages.map((l) => `${l.name} (${l.level})`).join(', ')}.
            </span>
          </div>
        )}
      </section>
    </div>
  );
}
