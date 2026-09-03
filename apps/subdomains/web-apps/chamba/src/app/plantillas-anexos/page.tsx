'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronRight, FileText, Copy, Check, Download, Sparkles, ShieldCheck, FileCode, CheckCircle2 } from 'lucide-react';

const PLANTILLAS = [
  {
    id: 'dj-antecedentes',
    title: 'Declaración Jurada de No Registrar Antecedentes (Penales, Policiales y Judiciales)',
    category: 'Anexo Obligatorio CAS / 728',
    description: 'Formato estándar exigido por entidades públicas (SUNAT, MINEDU, Poder Judicial, ONPE, etc.) para constatar la inexistencia de antecedentes.',
    content: `DECLARACIÓN JURADA DE NO REGISTRAR ANTEECEDENTES
(Ley N° 29607 y D.S. N° 075-2008-PCM)

Yo, [NOMBRES Y APELLIDOS COMPLETOS], identificado(a) con DNI N° [NÚMERO DE DNI], con domicilio legal en [DIRECCIÓN COMPLETA], departamento de [DEPARTAMENTO], provincia de [PROVINCIA], distrito de [DISTRITO].

DECLARO BAJO JURAMENTO QUE:

1. No registro Antecedentes Penales, Policiales ni Judiciales a la fecha de suscripción del presente documento.
2. No me encuentro inhabilitado(a) administrativa ni judicialmente para ejercer la función pública ni para contratar con el Estado.
3. No he sido destituido(a) ni separado(a) de la Administración Pública por sanción disciplinaria.
4. Toda la información consignada en mi Hoja de Vida (CV) y los documentos adjuntos son verdaderos y concuerdan con la realidad.

Formulo la presente declaración jurada en virtud del Principio de Presunción de Veracidad establecido en el Artículo 51° del Texto Único Ordenado de la Ley N° 27444, Ley del Procedimiento Administrativo General, sujetándome a las sanciones legales en caso de falsedad.

Dado en la ciudad de [CIUDAD], a los [DÍA] días del mes de [MES] de 2026.


________________________________________
Firma del Postulante
DNI N°: [NÚMERO DE DNI]`,
  },
  {
    id: 'dj-redam',
    title: 'Declaración Jurada de No Estar Inscrito en el REDAM / REDERESI',
    category: 'Anexo Obligatorio Estado',
    description: 'Declaración jurada sobre el Registro de Deudores Alimentarios Morosos conforme a la Ley N° 28970.',
    content: `DECLARACIÓN JURADA DE NO ESTAR INSCRITO EN EL REDAM Y REDERESI
(Ley N° 28970 y Ley N° 29988)

Yo, [NOMBRES Y APELLIDOS COMPLETOS], identificado(a) con DNI N° [NÚMERO DE DNI], postulante al proceso de Selección CAS N° [CÓDIGO DE CONVOCATORIA], para el puesto de [NOMBRE DEL PUESTO].

DECLARO BAJO JURAMENTO:

1. No estar registrado(a) en el Registro de Deudores Alimentarios Morosos - REDAM del Poder Judicial.
2. No registrar condena por los delitos señalados en la Ley N° 29988 (Terrorismo, apología, delitos contra la libertad sexual).
3. No tener nepotismo ni parentesco hasta el cuarto grado de consanguinidad o segundo de afinidad con funcionarios que tengan facultad de nombrar o contratar en la entidad.

Lima, [DÍA] de [MES] de 2026.


________________________________________
Firma del Postulante
DNI N°: [NÚMERO DE DNI]`,
  },
  {
    id: 'ficha-datos',
    title: 'Ficha de Inscripción y Datos Personales del Postulante',
    category: 'Formato Estándar Ficha CAS',
    description: 'Estructura modelo para completar tus datos académicos, laborales y de contacto según el expediente de postulación.',
    content: `FICHA DE INSCRIPCIÓN Y DATOS PERSONALES DEL POSTULANTE

1. DATOS PERSONALES:
- Apellido Paterno: [APELLIDO PATERNO]
- Apellido Materno: [APELLIDO MATERNO]
- Nombres: [NOMBRES COMPLETOS]
- N° DNI / CE: [DNI]
- RUC Personas (10): [RUC 10]
- Fecha de Nacimiento: [DD/MM/AAAA]
- Teléfono Celular: [TELÉFONO]
- Correo Electrónico: [CORREO]
- Dirección: [DIRECCIÓN RESIDENCIAL]

2. FORMACIÓN ACADÉMICA:
- Grado Académico: [Titulado / Bachiller / Técnico]
- Profesión / Especialidad: [CARRERA O ESPECIALIDAD]
- Universidad / Instituto: [INSTITUCIÓN EDUCATIVA]
- N° Colegiatura (si aplica): [CÓDIGO COLEGIATURA]

3. EXPERIENCIA LABORAL GENERAL Y ESPECÍFICA:
- Tiempo Total de Experiencia General: [X AÑOS Y Y MESES]
- Tiempo Total de Experiencia en el Sector Público: [X AÑOS]
- Último Centro de Trabajo: [NOMBRE DE ENTIDAD O EMPRESA]
- Cargo Desempeñado: [CARGO]`,
  },
];

export default function PlantillasAnexosPage() {
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleDownload = (id: string, title: string, text: string) => {
    const element = document.createElement("a");
    const file = new Blob([text], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `${id.toUpperCase()}_OFICIAL_PERU.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs font-mono text-slate-400">
        <Link href="/" className="hover:text-emerald-400 transition-colors">Inicio</Link>
        <ChevronRight size={12} />
        <span className="text-slate-200 font-semibold">Centro de Plantillas & Anexos CAS</span>
      </nav>

      {/* Main Header */}
      <div className="space-y-3 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-mono font-semibold">
          <Sparkles size={14} />
          <span>Formatos Gratuitos Listos para Copiar y Descargar</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black font-display text-white tracking-tight">
          Centro de Plantillas y Anexos CAS para Convocatorias del Estado
        </h1>
        <p className="text-sm text-slate-400 max-w-2xl">
          Copia o descarga gratuitamente los formatos oficiales de Declaraciones Juradas, Fichas de Inscripción y Anexos requeridos obligatoriamente en las postulaciones de instituciones del Gobierno Peruano.
        </p>
      </div>

      {/* Templates List */}
      <div className="space-y-8">
        {PLANTILLAS.map((plantilla) => (
          <div key={plantilla.id} className="glass-card p-6 sm:p-8 rounded-3xl space-y-4 border border-white/15 bg-gradient-to-b from-slate-900 to-[#0b0f19]">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div>
                <span className="px-2.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 text-[11px] font-mono font-bold border border-emerald-500/30">
                  {plantilla.category}
                </span>
                <h2 className="text-xl font-bold font-display text-white mt-2">
                  {plantilla.title}
                </h2>
                <p className="text-xs text-slate-400 mt-1">{plantilla.description}</p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleDownload(plantilla.id, plantilla.title, plantilla.content)}
                  className="px-4 py-2.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500 text-cyan-300 hover:text-slate-950 font-mono text-xs font-bold transition-all border border-cyan-500/40 flex items-center gap-2 cursor-pointer"
                >
                  <Download size={16} />
                  <span>Descargar .TXT</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleCopy(plantilla.id, plantilla.content)}
                  className={`px-5 py-2.5 rounded-xl font-mono text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-lg ${
                    copiedId === plantilla.id
                      ? 'bg-emerald-500 text-slate-950 shadow-emerald-500/30'
                      : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  }`}
                >
                  {copiedId === plantilla.id ? (
                    <>
                      <Check size={16} />
                      <span>¡TEXTO COPIADO!</span>
                    </>
                  ) : (
                    <>
                      <Copy size={16} />
                      <span>Copiar Formato</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Formatted Code / Text Preview */}
            <div className="relative">
              <pre className="p-4 sm:p-6 rounded-2xl bg-slate-950/90 border border-white/10 text-xs font-mono text-slate-300 overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-80 overflow-y-auto">
                {plantilla.content}
              </pre>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
