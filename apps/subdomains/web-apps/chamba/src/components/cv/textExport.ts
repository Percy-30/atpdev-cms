import { CvData } from './types';

/**
 * Genera la Ficha Resumen oficial en texto plano para copiar a mesas de partes
 */
export function generatePlainResumeText(data: CvData): string {
  const { personal, profileSummary, education, courses, experiences, skills, languages } = data;

  const expEspecifica = experiences.filter((e) => e.type === 'Específica');
  const expGeneral = experiences.filter((e) => e.type === 'General');

  return `====================================================================
FICHA RESUMEN DE HOJA DE VIDA — CONVOCATORIAS LABORALES PERÚ 2026
(Directiva SERVIR / Convocatorias CAS 1057, 728, 276 y Privado)
====================================================================

I. DATOS PERSONALES DEL POSTULANTE
--------------------------------------------------------------------
- Nombres y Apellidos : ${personal.fullName}
- N° DNI / C.E.      : ${personal.dni}
- N° RUC             : ${personal.ruc}
- Teléfono / Celular : ${personal.phone}
- Correo Electrónico : ${personal.email}
- Dirección Domicilio: ${personal.address}
- Ciudad / Ubicación : ${personal.city}
- Colegiatura        : ${personal.colegiatoria || 'No requerida / No aplica'}
- LinkedIn           : ${personal.linkedin || '—'}
- Portafolio / Web   : ${personal.website || '—'}

II. PERFIL PROFESIONAL
--------------------------------------------------------------------
${profileSummary}

III. FORMACIÓN ACADÉMICA
--------------------------------------------------------------------
${
  education.length > 0
    ? education
        .map(
          (edu, i) =>
            `${i + 1}. [${edu.degree}] ${edu.carrera}\n   Institución: ${edu.institution} | Año/Periodo: ${edu.year}${edu.status ? ` | Condición: ${edu.status}` : ''}`
        )
        .join('\n')
    : 'Sin registros de formación académica.'
}

IV. CAPACITACIONES, DIPLOMADOS Y CURSOS DE ESPECIALIZACIÓN
--------------------------------------------------------------------
${
  courses.length > 0
    ? courses
        .map(
          (c, i) =>
            `${i + 1}. ${c.title}\n   Institución: ${c.inst} | Horas Lectivas: ${c.hours}${c.year ? ` | Año: ${c.year}` : ''}`
        )
        .join('\n')
    : 'Sin cursos de especialización consignados.'
}

V. EXPERIENCIA LABORAL
--------------------------------------------------------------------
* Resumen de Cómputo: ${expEspecifica.length} Registros de Experiencia Específica | ${expGeneral.length} Registros de Experiencia General

${
  experiences.length > 0
    ? experiences
        .map((e, i) => {
          const fns = e.functions && e.functions.length > 0
            ? '\n   Funciones principales:\n' + e.functions.map((f) => `     - ${f}`).join('\n')
            : '';
          return `${i + 1}. Entidad/Empresa: ${e.entity}\n   Cargo: ${e.role}\n   Periodo: ${e.period} [Experiencia ${e.type}]${fns}`;
        })
        .join('\n\n')
    : 'Sin registros de experiencia laboral.'
}

VI. COMPETENCIAS & IDIOMAS
--------------------------------------------------------------------
- Habilidades Clave : ${skills.length > 0 ? skills.join(', ') : '—'}
- Idiomas           : ${languages.length > 0 ? languages.map((l) => `${l.name} (${l.level})`).join(', ') : '—'}

====================================================================
DECLARACIÓN JURADA (TUO DE LA LEY N° 27444)
--------------------------------------------------------------------
Declaro bajo juramento que toda la información consignada responde
estrictamente a la verdad, acogiéndome al Principio de Presunción de
Veracidad estipulado en la Ley del Procedimiento Administrativo General.
====================================================================
Generado en: chamba pro (https://empleos.atpdev.dev/crear-cv-cas)
`;
}
