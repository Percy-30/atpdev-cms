'use client';

import React from 'react';
import { CvData } from '../types';

interface TemplateProps {
  data: CvData;
}

export function TemplateServirCas({ data }: TemplateProps) {
  const { personal, education, courses, experiences, swornStatementAccepted } = data;

  // Compute accumulated experience
  const expEspecifica = experiences.filter((e) => e.type === 'Específica');
  const expGeneral = experiences.filter((e) => e.type === 'General');

  return (
    <div className="bg-white text-slate-900 font-sans text-[11px] leading-tight p-8 sm:p-12 max-w-[820px] mx-auto shadow-sm border border-slate-200 print:border-none print:shadow-none print:p-0 print:m-0 print:max-w-none print:w-full">
      {/* Header Institucional SERVIR */}
      <div className="text-center border-b-2 border-slate-900 pb-3 mb-4 space-y-1">
        <div className="text-[10px] font-bold uppercase tracking-widest text-slate-700">
          REPÚBLICA DEL PERÚ — SISTEMA ADMINISTRATIVO DE GESTIÓN DE RECURSOS HUMANOS
        </div>
        <h1 className="text-base font-black uppercase text-slate-950 tracking-tight font-serif">
          ANEXO: FICHA RESUMEN DE HOJA DE VIDA DEL POSTULANTE
        </h1>
        <p className="text-[10px] text-slate-600 font-serif italic">
          Convocatorias para Contratación Administrativa de Servicios (Decreto Legislativo N° 1057 / Leyes N° 31131, 276 y 728)
        </p>
      </div>

      {/* I. DATOS PERSONALES */}
      <section className="mb-4 cv-avoid-break">
        <div className="bg-slate-800 text-white px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider mb-1.5 flex justify-between items-center">
          <span>I. DATOS PERSONALES DEL POSTULANTE</span>
          <span className="text-[9px] font-mono text-slate-300">SECCIÓN OFICIAL</span>
        </div>
        <div className="flex gap-2.5 items-stretch">
          <table className="flex-1 border-collapse border border-slate-400 text-[10.5px]">
            <tbody>
              <tr className="border-b border-slate-300">
                <td className="bg-slate-100 font-bold p-1.5 w-1/4 border-r border-slate-300">Nombres y Apellidos:</td>
                <td className="p-1.5 font-semibold text-slate-950 uppercase" colSpan={3}>
                  {personal.fullName || '—'}
                </td>
              </tr>
              <tr className="border-b border-slate-300">
                <td className="bg-slate-100 font-bold p-1.5 border-r border-slate-300">N° DNI / C.E.:</td>
                <td className="p-1.5 font-mono border-r border-slate-300 w-1/4">{personal.dni || '—'}</td>
                <td className="bg-slate-100 font-bold p-1.5 border-r border-slate-300 w-1/4">N° RUC:</td>
                <td className="p-1.5 font-mono w-1/4">{personal.ruc || '—'}</td>
              </tr>
              <tr className="border-b border-slate-300">
                <td className="bg-slate-100 font-bold p-1.5 border-r border-slate-300">Teléfono / Celular:</td>
                <td className="p-1.5 border-r border-slate-300">{personal.phone || '—'}</td>
                <td className="bg-slate-100 font-bold p-1.5 border-r border-slate-300">Correo Electrónico:</td>
                <td className="p-1.5 font-mono text-[10px] break-all">{personal.email || '—'}</td>
              </tr>
              <tr className="border-b border-slate-300">
                <td className="bg-slate-100 font-bold p-1.5 border-r border-slate-300">Dirección Domiciliaria:</td>
                <td className="p-1.5 border-r border-slate-300" colSpan={2}>
                  {personal.address || '—'}
                </td>
                <td className="p-1.5 text-slate-700">{personal.city || '—'}</td>
              </tr>
              <tr>
                <td className="bg-slate-100 font-bold p-1.5 border-r border-slate-300">Colegiatura Profesional:</td>
                <td className="p-1.5" colSpan={3}>
                  {personal.colegiatoria || 'No aplica / No requerida para el cargo'}
                </td>
              </tr>
            </tbody>
          </table>

          {personal.photoUrl ? (
            <div className="w-24 shrink-0 flex flex-col items-center justify-center p-1.5 bg-slate-50 border border-slate-400 rounded">
              <img
                src={personal.photoUrl}
                alt={personal.fullName || 'Foto Carné'}
                className="w-20 h-26 object-cover border border-slate-300 shadow-sm rounded-xs"
                style={{ width: '82px', height: '102px' }}
              />
              <span className="text-[7.5px] font-mono text-slate-700 uppercase mt-1 text-center font-bold tracking-wider">
                FOTO CARNÉ
              </span>
            </div>
          ) : (
            <div className="w-24 shrink-0 flex flex-col items-center justify-center p-1.5 bg-slate-50/70 border border-dashed border-slate-300 rounded text-center">
              <div 
                className="border border-dashed border-slate-300 bg-white flex flex-col items-center justify-center text-[7px] text-slate-400 text-center leading-tight p-1 font-mono uppercase"
                style={{ width: '80px', height: '100px' }}
              >
                <span>Espacio Foto</span>
                <span className="font-bold text-[7.5px] text-slate-500">Carné</span>
                <span className="text-[6.5px] text-slate-400 mt-1">(Opcional)</span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* II. FORMACIÓN ACADÉMICA */}
      <section className="mb-4 cv-avoid-break">
        <div className="bg-slate-800 text-white px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider mb-1.5">
          II. FORMACIÓN ACADÉMICA (Acreditada según bases)
        </div>
        <table className="w-full border-collapse border border-slate-400 text-[10.5px]">
          <thead>
            <tr className="bg-slate-200 text-slate-900 border-b border-slate-400 font-bold text-center">
              <th className="p-1.5 border-r border-slate-300 w-1/4">Grado / Nivel Académico</th>
              <th className="p-1.5 border-r border-slate-300 w-1/3">Carrera / Especialidad</th>
              <th className="p-1.5 border-r border-slate-300 w-1/4">Institución Universitaria / Técnico</th>
              <th className="p-1.5 w-1/6">Año / Periodo</th>
            </tr>
          </thead>
          <tbody>
            {education.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-2 text-center text-slate-500 italic">
                  Sin registros de formación académica ingresados.
                </td>
              </tr>
            ) : (
              education.map((edu, idx) => (
                <tr key={edu.id || idx} className="border-b border-slate-300">
                  <td className="p-1.5 font-semibold border-r border-slate-300">{edu.degree}</td>
                  <td className="p-1.5 border-r border-slate-300">{edu.carrera}</td>
                  <td className="p-1.5 border-r border-slate-300">{edu.institution}</td>
                  <td className="p-1.5 text-center font-mono">{edu.year}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>

      {/* III. CAPACITACIONES Y ESPECIALIZACIÓN */}
      <section className="mb-4 cv-avoid-break">
        <div className="bg-slate-800 text-white px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider mb-1.5 flex justify-between items-center">
          <span>III. CAPACITACIONES, DIPLOMADOS Y CURSOS DE ESPECIALIZACIÓN</span>
          <span className="text-[9px] font-normal text-slate-300">Cómputo de horas lectivas mínimas</span>
        </div>
        <table className="w-full border-collapse border border-slate-400 text-[10.5px]">
          <thead>
            <tr className="bg-slate-200 text-slate-900 border-b border-slate-400 font-bold text-center">
              <th className="p-1.5 border-r border-slate-300 w-8">N°</th>
              <th className="p-1.5 border-r border-slate-300 text-left">Denominación del Curso / Diplomado</th>
              <th className="p-1.5 border-r border-slate-300 w-1/3 text-left">Institución Dictante</th>
              <th className="p-1.5 border-r border-slate-300 w-24">Horas Lectivas</th>
              <th className="p-1.5 w-16">Año</th>
            </tr>
          </thead>
          <tbody>
            {courses.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-2 text-center text-slate-500 italic">
                  Sin cursos de especialización consignados.
                </td>
              </tr>
            ) : (
              courses.map((course, idx) => (
                <tr key={course.id || idx} className="border-b border-slate-300">
                  <td className="p-1.5 text-center font-mono border-r border-slate-300">{idx + 1}</td>
                  <td className="p-1.5 font-semibold text-slate-900 border-r border-slate-300">{course.title}</td>
                  <td className="p-1.5 text-slate-800 border-r border-slate-300">{course.inst}</td>
                  <td className="p-1.5 text-center font-bold text-slate-950 border-r border-slate-300 bg-slate-50">
                    {course.hours}
                  </td>
                  <td className="p-1.5 text-center font-mono">{course.year || '—'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>

      {/* IV. EXPERIENCIA LABORAL */}
      <section className="mb-4 cv-avoid-break">
        <div className="bg-slate-800 text-white px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider mb-1.5 flex justify-between items-center">
          <span>IV. EXPERIENCIA LABORAL (General y Específica)</span>
          <span className="text-[9px] font-mono text-slate-300">
            Total Específica: {expEspecifica.length} reg. | Total General: {expGeneral.length} reg.
          </span>
        </div>
        <table className="w-full border-collapse border border-slate-400 text-[10px]">
          <thead>
            <tr className="bg-slate-200 text-slate-900 border-b border-slate-400 font-bold text-center">
              <th className="p-1.5 border-r border-slate-300 w-8">N°</th>
              <th className="p-1.5 border-r border-slate-300 text-left w-1/4">Entidad Pública / Empresa</th>
              <th className="p-1.5 border-r border-slate-300 text-left w-1/4">Cargo Desempeñado</th>
              <th className="p-1.5 border-r border-slate-300 w-28">Periodo / Tiempo</th>
              <th className="p-1.5 border-r border-slate-300 w-24">Tipo Exp.</th>
              <th className="p-1.5 text-left">Principales Funciones / Logros</th>
            </tr>
          </thead>
          <tbody>
            {experiences.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-2 text-center text-slate-500 italic">
                  Sin registros de experiencia laboral.
                </td>
              </tr>
            ) : (
              experiences.map((exp, idx) => (
                <tr key={exp.id || idx} className="border-b border-slate-300 align-top">
                  <td className="p-1.5 text-center font-mono border-r border-slate-300">{idx + 1}</td>
                  <td className="p-1.5 font-bold text-slate-900 border-r border-slate-300">{exp.entity}</td>
                  <td className="p-1.5 font-medium border-r border-slate-300">{exp.role}</td>
                  <td className="p-1.5 text-center font-mono border-r border-slate-300 text-[9.5px]">
                    {exp.period}
                  </td>
                  <td className="p-1.5 text-center border-r border-slate-300">
                    <span
                      className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-bold ${
                        exp.type === 'Específica'
                          ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                          : 'bg-slate-100 text-slate-800 border border-slate-300'
                      }`}
                    >
                      {exp.type}
                    </span>
                  </td>
                  <td className="p-1.5 text-slate-700">
                    {exp.functions && exp.functions.length > 0 ? (
                      <ul className="list-disc list-inside space-y-0.5 text-[9.5px]">
                        {exp.functions.map((fn, fIdx) => (
                          <li key={fIdx} className="leading-tight">{fn}</li>
                        ))}
                      </ul>
                    ) : (
                      'Funciones inherentes al cargo desempeñado.'
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>

      {/* V. DECLARACIÓN JURADA Y FIRMA */}
      <section className="border border-slate-400 p-3 bg-slate-50 cv-avoid-break mt-4 text-[9.5px] leading-normal text-slate-800">
        <div className="font-bold uppercase text-slate-950 mb-1 text-[10px] text-center border-b border-slate-300 pb-1">
          DECLARACIÓN JURADA DE VERACIDAD DE LA INFORMACIÓN (TUO LEY N° 27444)
        </div>
        <p className="text-justify mb-4">
          Declaro bajo juramento que toda la información consignada en la presente Ficha Resumen de Hoja de Vida
          responde a la verdad y se encuentra debidamente sustentada con documentos originales y/o copias fedateadas que
          obran en mi poder, sujetándome al Principio de Presunción de Veracidad (Art. IV del Título Preliminar del TUO
          de la Ley N° 27444). Autorizo a la Entidad a efectuar las verificaciones y fiscalizaciones posteriores que
          estime pertinentes.
        </p>

        {/* Cajas de Firma y Huella */}
        <div className="flex justify-around items-end pt-8 pb-2">
          {/* Firma */}
          <div className="text-center w-64 border-t border-slate-900 pt-1.5">
            <div className="font-bold uppercase text-[10px] text-slate-950">{personal.fullName || 'FIRMA DEL POSTULANTE'}</div>
            <div className="text-slate-600 font-mono text-[9px]">DNI / C.E. N° {personal.dni || '________________'}</div>
            <div className="text-[8px] text-slate-500 italic mt-0.5">Firma del Postulante</div>
          </div>

          {/* Huella Digital */}
          <div className="flex flex-col items-center">
            <div className="w-20 h-24 border-2 border-dashed border-slate-400 rounded flex items-center justify-center bg-white text-slate-400 text-[8px] text-center p-1 font-mono">
              HUELLA DACTILAR ÍNDICE DERECHO
            </div>
            <span className="text-[8px] text-slate-500 mt-1">Huella dactilar</span>
          </div>
        </div>
      </section>
    </div>
  );
}
