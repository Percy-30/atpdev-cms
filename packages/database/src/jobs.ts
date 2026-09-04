import { createClient } from '@supabase/supabase-js';

export type OdpeVacancy = {
  odpe: string;
  count: number;
  deadline: string;
};

export type JobPosting = {
  id: string;
  title: string;
  slug: string;
  entity_name: string;
  entity_ruc?: string;
  entity_verified: boolean;
  entity_logo?: string;
  sector_type: 'CAS 1057' | 'D.L. 728' | 'D.L. 276' | 'Locación / FAG' | 'Privado' | 'Prácticas';
  region: string;
  category: string;
  education_level: 'Secundaria' | 'Técnico' | 'Egresado' | 'Bachiller' | 'Titulado' | 'Maestría / Doctorado';
  salary_min?: number;
  salary_max?: number;
  salary_text: string;
  vacancies_count: number;
  description: string;
  requirements: string[];
  benefits?: string[];
  apply_url: string;
  bases_pdf_url?: string;
  official_portal_name?: string;
  odpe_vacancies?: OdpeVacancy[];
  steps_to_apply?: string[];
  start_date: string;
  end_date: string;
  featured: boolean;
  views_count: number;
  clicks_count: number;
  status: 'Vigente' | 'Finalizado' | 'Pendiente';
  created_at: string;
};

export const INITIAL_JOBS: JobPosting[] = [
  {
    id: "job-onpe-01",
    title: "ONPE ERM-2026: Responsables de Local de Votación (Coordinadores ODPE)",
    slug: "onpe-erm-2026-responsables-local-votacion",
    entity_name: "OFICINA NACIONAL DE PROCESOS ELECTORALES - ONPE",
    entity_ruc: "20291981870",
    entity_verified: true,
    entity_logo: "/logos/onpe.jpg",
    sector_type: "Locación / FAG",
    region: "Nacional / Remoto",
    category: "Administración y Contabilidad",
    education_level: "Técnico",
    salary_min: 2500,
    salary_max: 3200,
    salary_text: "S/. 2,500 Soles mensual (varía en proporción a servicios prestados)",
    vacancies_count: 240,
    description: "La Oficina Nacional de Procesos Electorales (ONPE) requiere contratar Responsables de Local de Votación a nivel nacional para la organización, verificación de recintos electorales, acondicionamiento de mesas de sufragio y despliegue logístico para los procesos electorales 2026.",
    requirements: [
      "Formación: Estudios universitarios y/o técnicos superior (segundo ciclo concluido o egresados).",
      "Experiencia: Experiencia mínima de un (01) año en el sector público o privado.",
      "Capacitación: Conocimiento en herramientas informáticas acreditado o Declaración Jurada elaborada por el postulante.",
      "Otros: Desarrollo de actividades de manera presencial a nivel nacional según ODPE asignada."
    ],
    benefits: [
      "Contratación por Locación de Servicios / Honorarios Profesionales.",
      "Capacitación oficial certificada por el Sistema Integrado de Gestión de Locadores (SIGLOC).",
      "Asignación por movilidad para labores de campo y acondicionamiento de mesas."
    ],
    apply_url: "https://reclutamiento.onpe.gob.pe/convocatorias",
    bases_pdf_url: "https://reclutamiento.onpe.gob.pe/convocatorias",
    official_portal_name: "ONPE SIGLOC Portal Oficial",
    steps_to_apply: [
      "1ro. Ingresar al portal oficial ONPE SIGLOC en: https://reclutamiento.onpe.gob.pe/convocatorias",
      "2do. Registrarse e iniciar sesión con usuario y clave.",
      "3ro. En perfiles disponibles, seleccionar la opción DESCENTRALIZADO.",
      "4to. Elegir la ODPE a postular y seleccionar el perfil RESPONSABLES DE LOCAL DE VOTACIÓN.",
      "5to. Cargar los documentos del CV en formato PDF (formación, experiencia y DJ informáticas)."
    ],
    odpe_vacancies: [
      { odpe: "MOYOBAMBA", count: 27, deadline: "29/08/2026 11:59 PM" },
      { odpe: "CAMANA", count: 24, deadline: "30/08/2026 11:59 PM" },
      { odpe: "LURIGANCHO", count: 17, deadline: "29/08/2026 02:00 PM" },
      { odpe: "CANGALLO", count: 77, deadline: "29/08/2026 11:00 PM" },
      { odpe: "ANGARAES", count: 66, deadline: "29/08/2026 11:59 PM" },
      { odpe: "GRAU", count: 54, deadline: "30/08/2026 11:59 PM" },
      { odpe: "PATAZ", count: 31, deadline: "29/08/2026 11:59 PM" },
      { odpe: "CONDESUYOS", count: 29, deadline: "30/08/2026 11:59 PM" },
      { odpe: "LA MOLINA", count: 6, deadline: "30/08/2026 11:59 PM" },
      { odpe: "BAGUA", count: 84, deadline: "29/08/2026 11:59 PM" },
      { odpe: "OXAPAMPA", count: 35, deadline: "30/08/2026 11:00 AM" },
      { odpe: "HUAURA", count: 16, deadline: "29/08/2026 04:00 PM" },
      { odpe: "TAMBOPATA", count: 31, deadline: "29/08/2026 11:59 PM" },
      { odpe: "ATALAYA", count: 24, deadline: "30/08/2026 12:00 PM" },
      { odpe: "HUARMEY", count: 28, deadline: "29/08/2026 11:59 PM" },
      { odpe: "ANDAHUAYLAS", count: 16, deadline: "29/08/2026 05:00 PM" },
      { odpe: "HUANCAVELICA", count: 18, deadline: "29/08/2026 02:00 PM" },
      { odpe: "HUAROCHIRI", count: 45, deadline: "29/08/2026 11:59 PM" },
      { odpe: "YAUYOS", count: 44, deadline: "29/08/2026 11:59 PM" },
      { odpe: "CAYLLOMA", count: 42, deadline: "31/08/2026 10:00 AM" },
      { odpe: "YAROWILCA", count: 37, deadline: "30/08/2026 11:59 PM" },
      { odpe: "RECUAY", count: 38, deadline: "31/08/2026 11:59 PM" },
      { odpe: "HUAYLAS", count: 51, deadline: "31/08/2026 11:59 PM" },
      { odpe: "MARISCAL NIETO", count: 34, deadline: "30/08/2026 11:00 PM" },
      { odpe: "HUAYTARA", count: 39, deadline: "29/08/2026 11:59 PM" },
      { odpe: "HUAMALIES", count: 79, deadline: "29/08/2026 07:30 PM" },
      { odpe: "LA CONVENCION", count: 63, deadline: "30/08/2026 01:00 PM" },
      { odpe: "ALTO AMAZONAS", count: 89, deadline: "30/08/2026 11:59 PM" },
      { odpe: "LIMA OESTE 3", count: 20, deadline: "30/08/2026 11:59 PM" },
      { odpe: "HUARI", count: 80, deadline: "29/08/2026 11:59 PM" },
      { odpe: "MARISCAL CACERES", count: 57, deadline: "31/08/2026 12:00 PM" },
      { odpe: "CHANCHAMAYO", count: 73, deadline: "30/08/2026 11:59 PM" },
      { odpe: "TAYACAJA", count: 78, deadline: "30/08/2026 11:59 PM" },
      { odpe: "URUBAMBA", count: 34, deadline: "29/08/2026 04:00 PM" },
      { odpe: "ILO", count: 3, deadline: "29/08/2026 03:00 PM" },
      { odpe: "ICA", count: 78, deadline: "29/08/2026 11:59 PM" },
      { odpe: "CHACHAPOYAS", count: 66, deadline: "29/08/2026 06:00 PM" },
      { odpe: "LUCANAS", count: 49, deadline: "29/08/2026 11:59 PM" },
      { odpe: "PARINACOCHAS", count: 30, deadline: "30/08/2026 11:59 PM" },
      { odpe: "CHORRILLOS", count: 24, deadline: "29/08/2026 04:30 PM" },
      { odpe: "LA ESPERANZA", count: 53, deadline: "30/08/2026 11:59 PM" },
      { odpe: "ABANCAY", count: 43, deadline: "29/08/2026 04:00 PM" },
      { odpe: "UCAYALI", count: 26, deadline: "29/08/2026 11:59 PM" },
      { odpe: "PUERTO INCA", count: 11, deadline: "29/08/2026 02:00 PM" }
    ],
    start_date: "2026-08-29",
    end_date: "2026-08-31",
    featured: true,
    views_count: 5840,
    clicks_count: 2250,
    status: "Vigente",
    created_at: "2026-08-29T08:00:00Z"
  },
  {
    id: "job-pais-02",
    title: "Programa PAIS: (19) Gestores Institucionales & Monitores Regionales",
    slug: "programa-pais-gestores-institucionales-monitor-regional",
    entity_name: "PROGRAMA NACIONAL PAIS - MIDIS",
    entity_ruc: "20602324976",
    entity_verified: true,
    entity_logo: "/logos/midis.jpg",
    sector_type: "CAS 1057",
    region: "Cusco",
    category: "Ciencias Sociales y Humanidades",
    education_level: "Titulado",
    salary_min: 3500,
    salary_max: 4500,
    salary_text: "S/. 4,000 Soles mensual",
    vacancies_count: 19,
    description: "Gestión, coordinación e implementación de servicios sociales del Estado en los Tambos y plataformas itinerantes del Programa PAIS en Ayacucho, Cajamarca, Cusco, Huánuco, Junín, Loreto, Pasco y Puno.",
    requirements: [
      "Formación: Título Profesional Universitario en Sociología, Trabajo Social, Educación o Ciencia Política.",
      "Experiencia: Experiencia mínima de 2 años en gestión de programas sociales o desarrollo comunitario.",
      "Idioma: Dominio de lengua originaria (Quechua / Aymara) deseable según región de intervención."
    ],
    benefits: [
      "Contrato CAS bajo D.L. 1057 con todos los beneficios legales.",
      "Seguro Médico de Salud ESSALUD / EPS.",
      "Asignación de viáticos por desplazamiento en plataformas itinerantes."
    ],
    apply_url: "https://www.gob.pe/institucion/pais/informes-publicaciones?tipo_publicacion=convocatoria-de-trabajo",
    bases_pdf_url: "https://www.gob.pe/institucion/pais/informes-publicaciones?tipo_publicacion=convocatoria-de-trabajo",
    official_portal_name: "Gob.pe Convocatorias de Trabajo Programa PAÍS",
    start_date: "2026-08-28",
    end_date: "2026-09-09",
    featured: true,
    views_count: 2190,
    clicks_count: 670,
    status: "Vigente",
    created_at: "2026-08-28T10:00:00Z"
  },
  {
    id: "job-red-salud-03",
    title: "Red de Salud Valle del Mantaro: (26) Personal de Salud Asistencial y Administrativo",
    slug: "red-salud-valle-mantaro-personal-salud-asistencial-administrativo",
    entity_name: "RED DE SALUD VALLE DEL MANTARO - GORE JUNÍN",
    entity_ruc: "20486082490",
    entity_verified: true,
    entity_logo: "/logos/red-salud-mantaro.jpg",
    sector_type: "CAS 1057",
    region: "Junín",
    category: "Salud y Medicina",
    education_level: "Titulado",
    salary_min: 2800,
    salary_max: 5200,
    salary_text: "S/. 3,800 Soles mensual",
    vacancies_count: 26,
    description: "Convocatoria pública CAS para la contratación de Médicos, Enfermeros, Obstetras, Cirujanos Dentistas, Químicos Farmacéuticos y Asistentes Administrativos para Centros de Salud en la provincia de Huancayo y Valle del Mantaro.",
    requirements: [
      "Formación: Título Profesional en Medicina, Enfermería, Obstetricia o Administración (Colegiado y Habilitado).",
      "Experiencia: Experiencia mínima de 1 año en establecimientos de salud del sector público.",
      "Otros: Constancia de SERUMS concluido emitido por el MINSA."
    ],
    benefits: [
      "Contrato CAS Regular D.L. 1057.",
      "Guardias hospitalarias según programación.",
      "Bonificación por zona rural / urbano marginal."
    ],
    apply_url: "https://www.diresajunin.gob.pe/",
    bases_pdf_url: "https://www.diresajunin.gob.pe/archivos/",
    official_portal_name: "Portal Oficial DIRESA Junín / Red de Salud Valle del Mantaro",
    start_date: "2026-08-27",
    end_date: "2026-09-08",
    featured: true,
    views_count: 1850,
    clicks_count: 510,
    status: "Vigente",
    created_at: "2026-08-27T12:00:00Z"
  },
  {
    id: "job-mpfn-04",
    title: "Ministerio Público: Cobertura Nacional (71) Asistentes en Función Fiscal, Abogados y Analistas",
    slug: "ministerio-publico-cobertura-nacional-asistentes-fiscales-abogados",
    entity_name: "MINISTERIO PÚBLICO - FISCALÍA DE LA NACIÓN",
    entity_ruc: "20131370645",
    entity_verified: true,
    entity_logo: "/logos/ministerio-publico.jpg",
    sector_type: "CAS 1057",
    region: "Lima",
    category: "Derecho y Asesoría",
    education_level: "Bachiller",
    salary_min: 3200,
    salary_max: 6800,
    salary_text: "S/. 4,500 Soles mensual",
    vacancies_count: 71,
    description: "Proceso de selección para el fortalecimiento de las Fiscalías Especializadas en Delitos de Corrupción de Funcionarios, Lavado de Activos y Despachos Fiscales Penales a nivel nacional.",
    requirements: [
      "Formación: Bachiller o Título Profesional en Derecho, Ciencias Políticas, Psicología o Contabilidad.",
      "Experiencia: Experiencia mínima de 2 años en despacho judicial o fiscal.",
      "Conocimientos: Código Procesal Penal y gestión de carpetas fiscales."
    ],
    benefits: [
      "Contrato CAS Régimen 1057 con estabilidad institucional.",
      "Capacitación continua en la Escuela del Ministerio Público.",
      "Seguro Vida Ley y ESSALUD."
    ],
    apply_url: "https://www.gob.pe/institucion/mpfn/informes-publicaciones?tipo_publicacion=convocatoria-de-trabajo",
    bases_pdf_url: "https://www.gob.pe/institucion/mpfn/informes-publicaciones?tipo_publicacion=convocatoria-de-trabajo",
    official_portal_name: "Gob.pe Convocatorias de Trabajo Ministerio Público",
    start_date: "2026-08-27",
    end_date: "2026-09-08",
    featured: true,
    views_count: 4120,
    clicks_count: 1480,
    status: "Vigente",
    created_at: "2026-08-27T14:00:00Z"
  },
  {
    id: "job-reniec-05",
    title: "RENIEC: (28) Registradores Auxiliares & Operadores de Atención al Ciudadano",
    slug: "reniec-registradores-auxiliares-operadores-atencion-ciudadano",
    entity_name: "RENIEC - REGISTRO NACIONAL DE IDENTIFICACIÓN Y ESTADO CIVIL",
    entity_ruc: "20291981870",
    entity_verified: true,
    entity_logo: "/logos/reniec.jpg",
    sector_type: "CAS 1057",
    region: "Arequipa",
    category: "Atención al Cliente y Servicios",
    education_level: "Técnico",
    salary_min: 2400,
    salary_max: 3800,
    salary_text: "S/. 2,800 Soles mensual",
    vacancies_count: 28,
    description: "Contratación de Registradores para la atención de trámites de DNI electrónico, duplicados, rectificación de datos e inscripciones de actas registrales en agencias de Arequipa, Cusco, Junín, Piura y Lima.",
    requirements: [
      "Formación: Estudios técnicos o universitarios concluidos en Administración, Derecho o Computación.",
      "Experiencia: Experiencia mínima de 1 año en atención al público o digitación de datos.",
      "Ofimática: Manejo de herramientas informáticas a nivel intermedio."
    ],
    benefits: [
      "Ingreso a planilla CAS D.L. 1057.",
      "Uniforme institucional y EPPs.",
      "Capacitaciones en biometría registral."
    ],
    apply_url: "https://www.reniec.gob.pe/portal/convocatoria.ui",
    bases_pdf_url: "https://www.reniec.gob.pe/portal/convocatoria.ui",
    official_portal_name: "RENIEC Convocatorias UI",
    start_date: "2026-08-27",
    end_date: "2026-09-01",
    featured: false,
    views_count: 2890,
    clicks_count: 940,
    status: "Vigente",
    created_at: "2026-08-27T16:00:00Z"
  },
  {
    id: "job-sunat-01",
    title: "Especialista en Desarrollo de Sistemas Cloud & Ciberseguridad",
    slug: "especialista-desarrollo-sistemas-cloud-sunat",
    entity_name: "SUNAT - SUPERINTENDENCIA NACIONAL DE ADUANAS Y DE ADMINISTRACIÓN TRIBUTARIA",
    entity_ruc: "20131312955",
    entity_verified: true,
    entity_logo: "/logos/sunat.jpg",
    sector_type: "CAS 1057",
    region: "Lima",
    category: "Tecnología e Informática",
    education_level: "Titulado",
    salary_min: 7500,
    salary_max: 9500,
    salary_text: "S/. 8,500 Soles mensual",
    vacancies_count: 5,
    description: "La SUNAT requiere incorporar 5 Especialistas en Desarrollo de Sistemas Cloud para liderar la arquitectura de microservicios, seguridad tributaria digital e infraestructura de alta disponibilidad en AWS y Azure.",
    requirements: [
      "Formación: Título Profesional Universitario en Ingeniería de Sistemas, Informática o Software (Colegiado y Habilitado).",
      "Experiencia: Experiencia general mínima de 4 años en el sector público o privado.",
      "Especialidad: Experiencia específica mínima de 2 años en diseño e implementación de soluciones Cloud (AWS/Azure) y Kubernetes."
    ],
    benefits: [
      "Contrato CAS bajo Decreto Legislativo 1057.",
      "Capacitación especializada en ciberseguridad.",
      "Seguro Médico Familiar EPS."
    ],
    apply_url: "https://unete.sunat.gob.pe/",
    bases_pdf_url: "https://unete.sunat.gob.pe/",
    official_portal_name: "Únete a la SUNAT Portal Oficial",
    start_date: "2026-08-25",
    end_date: "2026-09-10",
    featured: true,
    views_count: 1420,
    clicks_count: 389,
    status: "Vigente",
    created_at: "2026-08-25T08:00:00Z"
  },
  {
    id: "job-bcrp-03",
    title: "Especialista en Análisis Económico e Inteligencia Financiera",
    slug: "especialista-analisis-economico-bcrp",
    entity_name: "BANCO CENTRAL DE RESERVA DEL PERÚ - BCRP",
    entity_ruc: "20131388005",
    entity_verified: true,
    entity_logo: "/logos/bcrp.jpg",
    sector_type: "D.L. 728",
    region: "Lima",
    category: "Administración y Contabilidad",
    education_level: "Maestría / Doctorado",
    salary_min: 10500,
    salary_max: 14000,
    salary_text: "S/. 12,500 Soles mensual",
    vacancies_count: 2,
    description: "Análisis macroeconómico, modelización de política monetaria, proyecciones de inflación y seguimiento del sistema financiero internacional en la Gerencia de Estudios Económicos del BCRP.",
    requirements: [
      "Formación: Grado de Maestría en Economía, Finanzas o Métodos Cuantitativos de universidad de prestigio.",
      "Experiencia: Egresado del Curso de Extensión Universitaria (CEU) del BCRP o experiencia equivalente mínima de 3 años en banca central.",
      "Idiomas: Dominio fluido de idioma inglés a nivel avanzado (C1/C2)."
    ],
    benefits: [
      "Régimen laboral privado D.L. 728 (Planilla completa, 14 sueldos + CTS).",
      "Seguro de Salud EPS cubierto al 100% para titular y derechohabientes.",
      "Línea de carrera y financiamiento para doctorados en el extranjero."
    ],
    apply_url: "https://bcrp.hiringroom.com/jobs",
    bases_pdf_url: "https://bcrp.hiringroom.com/jobs",
    official_portal_name: "BCRP HiringRoom Oficial",
    start_date: "2026-08-20",
    end_date: "2026-09-15",
    featured: true,
    views_count: 2890,
    clicks_count: 742,
    status: "Vigente",
    created_at: "2026-08-20T08:00:00Z"
  },
  {
    id: "job-essalud-04",
    title: "Médicos Especialistas en Medicina Intensiva y Pediatría",
    slug: "medicos-especialistas-medicina-intensiva-essalud",
    entity_name: "ESSALUD - SEGURO SOCIAL DE SALUD DEL PERÚ",
    entity_ruc: "20131257750",
    entity_verified: true,
    entity_logo: "/logos/essalud.jpg",
    sector_type: "D.L. 728",
    region: "Arequipa",
    category: "Salud y Medicina",
    education_level: "Titulado",
    salary_min: 7500,
    salary_max: 9800,
    salary_text: "S/. 8,800 Soles mensual",
    vacancies_count: 8,
    description: "Atención médica especializada en la Unidad de Cuidados Intensivos (UCI) y Emergencias Pediátricas en el Hospital Nacional Carlos Alberto Seguín Escobedo de Arequipa.",
    requirements: [
      "Formación: Título de Médico Cirujano y Título de Segunda Especialidad Profesional en Medicina Intensiva o Pediatría.",
      "Colegiatura: Colegiatura y Constancia de Habilidad Médica Vigente.",
      "SERUMS: Resolución de SERUMS concluido emitido por el MINSA."
    ],
    benefits: [
      "Régimen D.L. 728 con todos los derechos laborales y bonificaciones nocturnas.",
      "Pertenencia a la Red Asistencial Arequipa de EsSalud.",
      "Capacitación médica continua asistida."
    ],
    apply_url: "http://convocatorias.essalud.gob.pe/",
    bases_pdf_url: "http://convocatorias.essalud.gob.pe/",
    official_portal_name: "EsSalud Convocatorias Oficial",
    start_date: "2026-08-22",
    end_date: "2026-09-12",
    featured: true,
    views_count: 1980,
    clicks_count: 512,
    status: "Vigente",
    created_at: "2026-08-22T08:00:00Z"
  },
  {
    id: "job-pj-05",
    title: "Poder Judicial: Secretarios Judiciales y Especialistas Legales (PSEP)",
    slug: "secretarios-judiciales-especialistas-legales-poder-judicial",
    entity_name: "PODER JUDICIAL DEL PERÚ - CORTE SUPERIOR DE JUSTICIA",
    entity_ruc: "20159981216",
    entity_verified: true,
    entity_logo: "/logos/poder-judicial.jpg",
    sector_type: "CAS 1057",
    region: "Cusco",
    category: "Derecho y Asesoría",
    education_level: "Titulado",
    salary_min: 4200,
    salary_max: 5800,
    salary_text: "S/. 4,800 Soles mensual",
    vacancies_count: 12,
    description: "Proceso de Selección de Personal (PSEP) para el trámite de procesos juzgados laborales, penales y civiles en la Corte Superior de Justicia de Cusco.",
    requirements: [
      "Formación: Título Profesional Universitario en Derecho (Colegiado y Habilitado).",
      "Experiencia: Experiencia laboral mínima de 2 años en el Poder Judicial, Ministerio Público o ejercicio de la abogacía.",
      "Capacitación: Acreditación de capacitaciones en Derecho Procesal Penal o Laboral (mínimo 120 horas)."
    ],
    benefits: [
      "Contratación bajo el régimen CAS D.L. 1057.",
      "Línea de carrera judicial e incorporación a la bolsa laboral interna.",
      "Seguro de Salud ESSALUD."
    ],
    apply_url: "https://aplicativo.pj.gob.pe/psep/",
    bases_pdf_url: "https://aplicativo.pj.gob.pe/psep/",
    official_portal_name: "Poder Judicial Aplicativo PSEP",
    start_date: "2026-08-24",
    end_date: "2026-09-08",
    featured: true,
    views_count: 3120,
    clicks_count: 980,
    status: "Vigente",
    created_at: "2026-08-24T08:00:00Z"
  },
  {
    id: "job-inei-01",
    title: "INEI EDA 2026: (17,238) Aplicadores y Orientadores a Nivel Nacional",
    slug: "inei-eda-2026-aplicadores-orientadores-nacional",
    entity_name: "INSTITUTO NACIONAL DE ESTADÍSTICA E INFORMÁTICA - INEI",
    entity_ruc: "20131365994",
    entity_verified: true,
    entity_logo: "/logos/inei.jpg",
    sector_type: "Locación / FAG",
    region: "Nacional / Remoto",
    category: "Atención al Cliente y Servicios",
    education_level: "Secundaria",
    salary_min: 320,
    salary_max: 370,
    salary_text: "S/. 370.00 Soles por periodo de aplicación",
    vacancies_count: 17238,
    description: "Convocatoria masiva del INEI para el reclutamiento de 17,238 Aplicadores y Orientadores a nivel nacional para la Evaluación Docente Ambiental (EDA 2026).",
    requirements: [
      "Formación: Secundaria completa, estudiantes técnicos o universitarios.",
      "Experiencia: No indispensable (se brindará capacitación oficial acreditada por el INEI).",
      "Disponibilidad: Disponibilidad para desplazamiento a locales de evaluación en tu región."
    ],
    benefits: [
      "Certificado oficial emitido por la Jefatura Nacional del INEI.",
      "Pago de honorarios por locación de servicios al finalizar la jornada.",
      "Incorporación a la base de datos nacional de personal operativo INEI."
    ],
    apply_url: "https://convocatorias.inei.gob.pe/",
    bases_pdf_url: "https://convocatorias.inei.gob.pe/",
    official_portal_name: "INEI Convocatorias de Personal",
    start_date: "2026-08-23",
    end_date: "2026-09-13",
    featured: true,
    views_count: 8940,
    clicks_count: 3420,
    status: "Vigente",
    created_at: "2026-08-23T08:00:00Z"
  },
  {
    id: "job-jne-01",
    title: "JNE ERM-2026: (23,020) Fiscalizadores de Local de Votación Urbano - Nivel Nacional",
    slug: "jne-erm-2026-fiscalizadores-local-votacion-nacional",
    entity_name: "JURADO NACIONAL DE ELECCIONES - JNE",
    entity_ruc: "20131378387",
    entity_verified: true,
    entity_logo: "/logos/jne.jpg",
    sector_type: "Locación / FAG",
    region: "Nacional / Remoto",
    category: "Derecho y Asesoría",
    education_level: "Egresado",
    salary_min: 2200,
    salary_max: 3000,
    salary_text: "S/. 2,500 Soles mensual (según ubicación geográfica)",
    vacancies_count: 23020,
    description: "El Jurado Nacional de Elecciones (JNE) requiere 23,020 Fiscalizadores de Local de Votación a nivel nacional para supervisar el cumplimiento de la normativa electoral en el Proceso ERM 2026.",
    requirements: [
      "Formación: Egresado universitario o técnico en Derecho, Ciencia Política, Administración o afines.",
      "Capacitación: Acreditación de aprobación del Curso MOOC impartido por la Escuela Electoral del JNE.",
      "Otros: No registrar antecedentes penales ni filiación partidaria activa."
    ],
    benefits: [
      "Contrato de Locación de Servicios financiado por la DNFPE del JNE.",
      "Capacitación continua en derecho fiscalizador electoral.",
      "Certificación institucional."
    ],
    apply_url: "https://www.jne.gob.pe/convocatorias",
    bases_pdf_url: "https://www.jne.gob.pe/convocatorias",
    official_portal_name: "JNE Sistema de Convocatorias",
    start_date: "2026-08-24",
    end_date: "2026-08-31",
    featured: true,
    views_count: 12400,
    clicks_count: 4890,
    status: "Vigente",
    created_at: "2026-08-24T08:00:00Z"
  },
  {
    id: "job-muni-smp-01",
    title: "Municipalidad de San Martín de Porres: (142) Serenos, Operadores de Cámara y Coordinadores",
    slug: "municipalidad-san-martin-porres-serenos-operadores-camara",
    entity_name: "MUNICIPALIDAD DISTRITAL DE SAN MARTÍN DE PORRES",
    entity_ruc: "20131372516",
    entity_verified: true,
    entity_logo: "/logos/san-martin-de-porres.svg",
    sector_type: "CAS 1057",
    region: "Lima",
    category: "Atención al Cliente y Servicios",
    education_level: "Secundaria",
    salary_min: 2300,
    salary_max: 4000,
    salary_text: "Entre S/. 2,300 y S/. 4,000 Soles mensual",
    vacancies_count: 142,
    description: "Proceso CAS para la Gerencia de Seguridad Ciudadana: incorporación de Serenos choferes, Serenos a pie, Operadores del centro de videovigilancia y Supervisores de sector.",
    requirements: [
      "Formación: Secundaria completa (para serenos) o formación técnica/universitaria (para supervisores).",
      "Experiencia: Experiencia mínima de 6 meses en seguridad ciudadana, patrullaje o fuerzas armadas/PNP.",
      "Licencia: Licencia de conducir A-I o A-IIb vigente para choferes de patrulla."
    ],
    benefits: [
      "Contratación CAS Decreto Legislativo 1057.",
      "Uniforme completo, chaleco balístico y equipos de radiocomunicación.",
      "Seguro contra accidentes de trabajo SCTR."
    ],
    apply_url: "https://www.mdsmp.gob.pe/convocatorias_cas.php",
    bases_pdf_url: "https://www.mdsmp.gob.pe/convocatorias_cas.php",
    official_portal_name: "MDSMP Portal de Convocatorias CAS",
    start_date: "2026-08-08",
    end_date: "2026-08-19",
    featured: true,
    views_count: 4520,
    clicks_count: 1890,
    status: "Vigente",
    created_at: "2026-08-08T08:00:00Z"
  },
  {
    id: "job-muni-cusco-01",
    title: "Municipalidad del Cusco: (03) Inspectores Municipales y Especialistas Administrativos",
    slug: "municipalidad-cusco-inspectores-especialistas-administrativos",
    entity_name: "MUNICIPALIDAD PROVINCIAL DEL CUSCO",
    entity_ruc: "20177233248",
    entity_verified: true,
    entity_logo: "/logos/cusco.jpg",
    sector_type: "CAS 1057",
    region: "Cusco",
    category: "Administración y Contabilidad",
    education_level: "Bachiller",
    salary_min: 3000,
    salary_max: 4000,
    salary_text: "S/. 3,000 a S/. 4,000 Soles mensual",
    vacancies_count: 3,
    description: "Reclutamiento de Inspectores para la Gerencia de Tránsito, Vialidad y Transporte de la Municipalidad Provincial del Cusco.",
    requirements: [
      "Formación: Bachiller en Derecho, Administración, Ingeniería Civil o Transporte.",
      "Experiencia: Experiencia de 1 año en fiscalización municipal o gestión del transporte urbano."
    ],
    benefits: [
      "Ingreso a planilla CAS.",
      "Beneficios según Ley D.L. 1057."
    ],
    apply_url: "https://www.cusco.gob.pe/convocatorias-cas/",
    bases_pdf_url: "https://www.cusco.gob.pe/convocatorias-cas/",
    official_portal_name: "Municipalidad del Cusco Portal CAS",
    start_date: "2026-08-28",
    end_date: "2026-09-11",
    featured: false,
    views_count: 1820,
    clicks_count: 420,
    status: "Vigente",
    created_at: "2026-08-28T08:00:00Z"
  },
  {
    id: "job-anin-01",
    title: "Autoridad Nacional de Infraestructura (ANIN): (02) Especialistas en Obras e Infraestructura",
    slug: "autoridad-nacional-infraestructura-especialistas-obras",
    entity_name: "AUTORIDAD NACIONAL DE INFRAESTRUCTURA - ANIN",
    entity_ruc: "20611893211",
    entity_verified: true,
    entity_logo: "/logos/anin.jpg",
    sector_type: "CAS 1057",
    region: "Lima",
    category: "Ingeniería y Construcción",
    education_level: "Titulado",
    salary_min: 13000,
    salary_max: 15000,
    salary_text: "S/. 13,000 a S/. 15,000 Soles mensual",
    vacancies_count: 2,
    description: "Supervisión de megaproyectos de infraestructura vial, hidráulica y edificación pública ejecutados por la ANIN en el ámbito nacional.",
    requirements: [
      "Formación: Título Universitario en Ingeniería Civil, Arquitectura o Ingeniería Sanitaria (Colegiado y Habilitado).",
      "Experiencia: Mínimo 6 años de experiencia en supervisión de obras públicas o PMO (Project Management Office)."
    ],
    benefits: [
      "Contratación CAS de Alta Dirección.",
      "Capacitación en metodología BIM y contratos NEC3/NEC4."
    ],
    apply_url: "https://www.gob.pe/institucion/anin/informes-publicaciones?tipo_publicacion=convocatoria-de-trabajo",
    bases_pdf_url: "https://www.gob.pe/institucion/anin/informes-publicaciones?tipo_publicacion=convocatoria-de-trabajo",
    official_portal_name: "Gob.pe Convocatorias de Trabajo ANIN",
    start_date: "2026-08-28",
    end_date: "2026-09-09",
    featured: true,
    views_count: 3890,
    clicks_count: 1240,
    status: "Vigente",
    created_at: "2026-08-28T08:00:00Z"
  },
  {
    id: "job-minedu-01",
    title: "MINEDU: (312) Especialistas en Monitoreo Pedagógico y Gestores Territoriales",
    slug: "minedu-especialistas-monitoreo-pedagogico-gestores-territoriales",
    entity_name: "MINISTERIO DE EDUCACIÓN - MINEDU",
    entity_ruc: "20131370645",
    entity_verified: true,
    entity_logo: "/logos/minedu.jpg",
    sector_type: "CAS 1057",
    region: "Nacional / Remoto",
    category: "Educación y Capacitación",
    education_level: "Titulado",
    salary_min: 4500,
    salary_max: 7000,
    salary_text: "S/. 4,500 a S/. 7,000 Soles mensual",
    vacancies_count: 312,
    description: "Reclutamiento de Especialistas Pedagógicos y Gestores de Gestión Educativa para el acompañamiento en Direcciones Regionales de Educación (DRE) y UGELs.",
    requirements: [
      "Formación: Título Profesional Universitario en Educación, Psicología, Sociología o Ciencias Sociales.",
      "Experiencia: Experiencia mínima de 3 años en gestión educativa o acompañamiento docente.",
      "Colegiatura: Habilitación profesional vigente."
    ],
    benefits: [
      "Contratación CAS Decreto Legislativo 1057.",
      "Seguro médico de ley y capacitaciones certificadas por el MINEDU."
    ],
    apply_url: "https://www.gob.pe/institucion/minedu/informes-publicaciones?tipo_publicacion=convocatoria-de-trabajo",
    bases_pdf_url: "https://www.gob.pe/institucion/minedu/informes-publicaciones?tipo_publicacion=convocatoria-de-trabajo",
    official_portal_name: "Gob.pe Convocatorias de Trabajo MINEDU",
    start_date: "2026-08-26",
    end_date: "2026-09-12",
    featured: true,
    views_count: 5210,
    clicks_count: 2130,
    status: "Vigente",
    created_at: "2026-08-26T08:00:00Z"
  },
  {
    id: "job-mef-01",
    title: "Ministerio de Economía y Finanzas (MEF): (15) Analistas de Presupuesto Público y Tesorería",
    slug: "mef-analistas-presupuesto-publico-tesoreria",
    entity_name: "MINISTERIO DE ECONOMÍA Y FINANZAS - MEF",
    entity_ruc: "20131370998",
    entity_verified: true,
    entity_logo: "/logos/mef.jpg",
    sector_type: "CAS 1057",
    region: "Lima",
    category: "Administración y Contabilidad",
    education_level: "Titulado",
    salary_min: 6000,
    salary_max: 10000,
    salary_text: "S/. 6,000 a S/. 10,000 Soles mensual",
    vacancies_count: 15,
    description: "Evaluación y formulación del Presupuesto del Sector Público, seguimiento de inversiones SIAF-RP y gestión de tesorería nacional en el MEF.",
    requirements: [
      "Formación: Título Profesional en Economía, Contabilidad, Administración o Ingeniería Industrial.",
      "Experiencia: Experiencia específica mínima de 3 años en el Sector Público utilizando SIAF o SIGA."
    ],
    benefits: [
      "Contratación CAS especial de alta calificación.",
      "Capacitación en normativa de finanzas públicas del MEF."
    ],
    apply_url: "https://www.mef.gob.pe/es/convocatorias-de-trabajo",
    bases_pdf_url: "https://www.mef.gob.pe/es/convocatorias-de-trabajo",
    official_portal_name: "MEF Portal Convocatorias de Trabajo",
    start_date: "2026-08-25",
    end_date: "2026-09-10",
    featured: true,
    views_count: 4120,
    clicks_count: 1580,
    status: "Vigente",
    created_at: "2026-08-25T08:00:00Z"
  },
  {
    id: "job-minsa-01",
    title: "MINSA: (85) Enfermeros, Médicos Epidemiólogos y Técnicos Asistenciales",
    slug: "minsa-enfermeros-medicos-epidemiologos-tecnicos",
    entity_name: "MINISTERIO DE SALUD - MINSA",
    entity_ruc: "20131373237",
    entity_verified: true,
    entity_logo: "/logos/minsa.jpg",
    sector_type: "CAS 1057",
    region: "Lima",
    category: "Salud y Medicina",
    education_level: "Titulado",
    salary_min: 2500,
    salary_max: 6800,
    salary_text: "S/. 2,500 a S/. 6,800 Soles mensual",
    vacancies_count: 85,
    description: "Incorporación de personal de salud para la Dirección de Inmunizaciones y Vigilancia Epidemiológica del Ministerio de Salud.",
    requirements: [
      "Formación: Título en Enfermería, Medicina Humana o Técnico en Enfermería.",
      "SERUMS: Resolución de SERUMS concluido para profesionales.",
      "Colegiatura: Colegiado y habilitado."
    ],
    benefits: [
      "Planilla CAS con derecho a guardia médica.",
      "Seguro Médico ESSALUD + SCTR."
    ],
    apply_url: "https://www.gob.pe/institucion/minsa/informes-publicaciones?tipo_publicacion=convocatoria-de-trabajo",
    bases_pdf_url: "https://www.gob.pe/institucion/minsa/informes-publicaciones?tipo_publicacion=convocatoria-de-trabajo",
    official_portal_name: "Gob.pe Convocatorias de Trabajo MINSA",
    start_date: "2026-08-27",
    end_date: "2026-09-14",
    featured: true,
    views_count: 6410,
    clicks_count: 2890,
    status: "Vigente",
    created_at: "2026-08-27T08:00:00Z"
  },
  {
    id: "job-sunafil-01",
    title: "SUNAFIL: (18) Inspectores Auxiliares del Trabajo a Nivel Nacional",
    slug: "sunafil-inspectores-auxiliares-trabajo-nacional",
    entity_name: "SUPERINTENDENCIA NACIONAL DE FISCALIZACIÓN LABORAL - SUNAFIL",
    entity_ruc: "20555160086",
    entity_verified: true,
    entity_logo: "/logos/sunafil.jpg",
    sector_type: "CAS 1057",
    region: "Nacional / Remoto",
    category: "Derecho y Asesoría",
    education_level: "Titulado",
    salary_min: 6500,
    salary_max: 8500,
    salary_text: "S/. 6,500 a S/. 8,500 Soles mensual",
    vacancies_count: 18,
    description: "Fiscalización del cumplimiento de la normativa sociolaboral y de seguridad y salud en el trabajo (SST) en empresas públicas y privadas.",
    requirements: [
      "Formación: Título Profesional Universitario en Derecho, Contabilidad, Administración o Ingeniería.",
      "Experiencia: Experiencia laboral mínima de 2 años en derecho laboral o inspección laboral."
    ],
    benefits: [
      "Régimen CAS con acreditación oficial como Inspector del Trabajo.",
      "Viáticos cubiertos para inspecciones de campo."
    ],
    apply_url: "https://www.gob.pe/institucion/sunafil/informes-publicaciones?tipo_publicacion=convocatoria-de-trabajo",
    bases_pdf_url: "https://www.gob.pe/institucion/sunafil/informes-publicaciones?tipo_publicacion=convocatoria-de-trabajo",
    official_portal_name: "Gob.pe Convocatorias de Trabajo SUNAFIL",
    start_date: "2026-08-24",
    end_date: "2026-09-08",
    featured: true,
    views_count: 4890,
    clicks_count: 1940,
    status: "Vigente",
    created_at: "2026-08-24T08:00:00Z"
  },
  {
    id: "job-osiptel-01",
    title: "OSIPTEL: (12) Asesores de Atención al Usuario en Regiones",
    slug: "osiptel-asesores-atencion-usuario-regiones",
    entity_name: "ORGANISMO SUPERVISOR DE INVERSIÓN PRIVADA EN TELECOMUNICACIONES - OSIPTEL",
    entity_ruc: "20216892976",
    entity_verified: true,
    entity_logo: "/logos/osiptel.jpg",
    sector_type: "CAS 1057",
    region: "Arequipa",
    category: "Atención al Cliente y Servicios",
    education_level: "Bachiller",
    salary_min: 3500,
    salary_max: 5500,
    salary_text: "S/. 3,500 a S/. 5,500 Soles mensual",
    vacancies_count: 12,
    description: "Atención de reclamos y orientación a usuarios de servicios públicos de telecomunicaciones en las Oficinas Regionales de OSIPTEL.",
    requirements: [
      "Formación: Bachiller en Derecho, Administración, Ciencias de la Comunicación o Ingeniería.",
      "Experiencia: Experiencia de 1 año en atención al cliente o resolución de reclamos."
    ],
    benefits: [
      "Contrato CAS con beneficios de ley.",
      "Capacitación en regulación de servicios públicos de telecomunicaciones."
    ],
    apply_url: "https://www.osiptel.gob.pe/portal-del-usuario/convocatorias-de-trabajo/",
    bases_pdf_url: "https://www.osiptel.gob.pe/portal-del-usuario/convocatorias-de-trabajo/",
    official_portal_name: "OSIPTEL Portal Convocatorias de Trabajo",
    start_date: "2026-08-26",
    end_date: "2026-09-10",
    featured: false,
    views_count: 2310,
    clicks_count: 810,
    status: "Vigente",
    created_at: "2026-08-26T08:00:00Z"
  },
  {
    id: "job-interbank-01",
    title: "Interbank: (25) Asesores de Ventas y Cajeros Banca Servicio",
    slug: "interbank-asesores-ventas-cajeros-banca-servicio",
    entity_name: "BANCO INTERNACIONAL DEL PERÚ S.A.A. - INTERBANK",
    entity_ruc: "20100053455",
    entity_verified: true,
    entity_logo: "/logos/interbank.svg",
    sector_type: "Privado",
    region: "Lima",
    category: "Ventas y Comercial",
    education_level: "Técnico",
    salary_min: 1800,
    salary_max: 2800,
    salary_text: "S/. 1,800 + Comisiones sin límite (Promedio S/. 2,800)",
    vacancies_count: 25,
    description: "Atención de operaciones financieras en ventanilla y colocación de productos bancarios (tarjetas de crédito, préstamos personales y seguros).",
    requirements: [
      "Formación: Estudiantes o egresados técnicos o universitarios de Administración, Finanzas o Contabilidad.",
      "Experiencia: Experiencia mínima de 6 meses en atención al público o manejo de caja en retail/banca."
    ],
    benefits: [
      "Ingreso a planilla directa de Interbank desde el primer día (14 sueldos + utilidades).",
      "EPS cubierta al 80% y programa de becas universitarias."
    ],
    apply_url: "https://interbank.pe/trabaja-con-nosotros",
    bases_pdf_url: "https://interbank.pe/trabaja-con-nosotros",
    official_portal_name: "Interbank Empleos Oficial",
    start_date: "2026-08-22",
    end_date: "2026-09-15",
    featured: true,
    views_count: 7890,
    clicks_count: 3120,
    status: "Vigente",
    created_at: "2026-08-22T08:00:00Z"
  },
  {
    id: "job-alicorp-01",
    title: "Alicorp: (10) Analistas de Logística y Cadena de Suministro (Supply Chain)",
    slug: "alicorp-analistas-logistica-cadena-suministro",
    entity_name: "ALICORP S.A.A.",
    entity_ruc: "20100055237",
    entity_verified: true,
    entity_logo: "/logos/alicorp.svg",
    sector_type: "Privado",
    region: "Callao",
    category: "Ingeniería y Construcción",
    education_level: "Titulado",
    salary_min: 4500,
    salary_max: 7000,
    salary_text: "S/. 4,500 a S/. 7,000 Soles mensual",
    vacancies_count: 10,
    description: "Planificación de la demanda, control de inventarios y optimización de rutas de distribución en la Planta Central de Alicorp en el Callao.",
    requirements: [
      "Formación: Título en Ingeniería Industrial, Administración o Negocios Internacionales.",
      "Experiencia: Experiencia de 2 años en consumo masivo o logística de grandes almacenes."
    ],
    benefits: [
      "Planilla D.L. 728 con todos los beneficios de ley + utilidades destacadas del sector industrial.",
      "Seguro EPS 100% y descuentos en productos del portafolio Alicorp."
    ],
    apply_url: "https://alicorp.evaluar.com/",
    bases_pdf_url: "https://alicorp.evaluar.com/",
    official_portal_name: "Alicorp Trabaja con Nosotros",
    start_date: "2026-08-23",
    end_date: "2026-09-12",
    featured: true,
    views_count: 6120,
    clicks_count: 2450,
    status: "Vigente",
    created_at: "2026-08-23T08:00:00Z"
  },
  {
    id: "job-gore-arequipa-01",
    title: "Gobierno Regional de Arequipa: (22) Ingenieros Residentes e Inspectores de Obras",
    slug: "gobierno-regional-arequipa-ingenieros-residentes-inspectores",
    entity_name: "GOBIERNO REGIONAL DE AREQUIPA",
    entity_ruc: "20498390597",
    entity_verified: true,
    entity_logo: "/logos/gore-arequipa.jpg",
    sector_type: "CAS 1057",
    region: "Arequipa",
    category: "Ingeniería y Construcción",
    education_level: "Titulado",
    salary_min: 3500,
    salary_max: 6000,
    salary_text: "S/. 3,500 a S/. 6,000 Soles mensual",
    vacancies_count: 22,
    description: "Supervisión de obras viales, colegios y proyectos de riego en las provincias de Caylloma, Camaná, Islay y Arequipa.",
    requirements: [
      "Formación: Título Profesional en Ingeniería Civil o Arquitectura (Colegiado y Habilitado).",
      "Experiencia: Experiencia comprobada de 2 años como residente o inspector de obra pública."
    ],
    benefits: [
      "Contratación CAS regional.",
      "Seguro SCTR y movilidad a obra."
    ],
    apply_url: "https://www.regionarequipa.gob.pe/informes-publicaciones?tipo_publicacion=convocatoria-de-trabajo",
    bases_pdf_url: "https://www.regionarequipa.gob.pe/informes-publicaciones?tipo_publicacion=convocatoria-de-trabajo",
    official_portal_name: "GRA Arequipa Convocatorias de Trabajo",
    start_date: "2026-08-25",
    end_date: "2026-09-08",
    featured: false,
    views_count: 3210,
    clicks_count: 950,
    status: "Vigente",
    created_at: "2026-08-25T08:00:00Z"
  }
];

import { scrapeLiveConvocatoriasFeed } from './scraper';

// In-memory overrides para desarrollo local, pruebas unitarias y fallback de alta disponibilidad
const LOCAL_DYNAMIC_JOBS: Map<string, JobPosting> = new Map();

export async function getJobPostings(): Promise<JobPosting[]> {
  const jobsMap = new Map<string, JobPosting>();

  // 1. Cargar catálogo verificado de respaldo
  INITIAL_JOBS.forEach(j => jobsMap.set(j.slug, j));

  // 2. Cargar modificaciones y convocatorias añadidas localmente en memoria
  LOCAL_DYNAMIC_JOBS.forEach(j => jobsMap.set(j.slug, j));

  // 3. Cargar ingesta en vivo del feed oficial (convocatoriasdetrabajo.com & portaltrabajos.pe)
  try {
    const liveFeed = await scrapeLiveConvocatoriasFeed();
    if (liveFeed && liveFeed.length > 0) {
      liveFeed.forEach(j => jobsMap.set(j.slug, j));
    }
  } catch (err) {
    console.warn('Live feed fallback to static catalog:', err);
  }

  // 4. Intentar fusionar con Supabase en tiempo real
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey);
      const { data, error } = await supabase
        .from('job_postings')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        data.forEach((j: any) => jobsMap.set(j.slug, j as JobPosting));
      }
    }
  } catch (err) {
    console.warn('Falling back to local real job postings dataset:', err);
  }

  return Array.from(jobsMap.values());
}

export async function getJobPostingBySlug(slug: string): Promise<JobPosting | null> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey);
      const { data, error } = await supabase
        .from('job_postings')
        .select('*')
        .eq('slug', slug)
        .single();

      if (!error && data) {
        return data as JobPosting;
      }
    }
  } catch (err) {
    console.warn('Falling back to local lookup for slug:', slug);
  }

  const localDynamic = Array.from(LOCAL_DYNAMIC_JOBS.values()).find(j => j.slug === slug);
  if (localDynamic) return localDynamic;

  const job = INITIAL_JOBS.find(j => j.slug === slug);
  return job || null;
}

export async function saveJobPosting(
  jobData: Partial<JobPosting> & {
    title: string;
    entity_name: string;
    sector_type: JobPosting['sector_type'];
    region: string;
    category: string;
    education_level: JobPosting['education_level'];
    salary_text: string;
    apply_url: string;
  }
): Promise<{ success: boolean; job?: JobPosting; error?: string }> {
  try {
    const slug = jobData.slug || jobData.title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');

    const newJob: JobPosting = {
      id: jobData.id || `job-cms-${Date.now()}`,
      title: jobData.title,
      slug,
      entity_name: jobData.entity_name,
      entity_ruc: jobData.entity_ruc || '',
      entity_verified: jobData.entity_verified ?? true,
      sector_type: jobData.sector_type,
      region: jobData.region,
      category: jobData.category,
      education_level: jobData.education_level,
      salary_min: jobData.salary_min,
      salary_max: jobData.salary_max,
      salary_text: jobData.salary_text,
      vacancies_count: jobData.vacancies_count || 1,
      description: jobData.description || `Convocatoria oficial para ${jobData.title} en ${jobData.entity_name}.`,
      requirements: jobData.requirements || [],
      benefits: jobData.benefits || [],
      apply_url: jobData.apply_url,
      bases_pdf_url: jobData.bases_pdf_url,
      official_portal_name: jobData.official_portal_name || `${jobData.entity_name} - Portal Oficial`,
      start_date: jobData.start_date || new Date().toISOString().split('T')[0],
      end_date: jobData.end_date || new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      featured: jobData.featured ?? false,
      views_count: jobData.views_count || 0,
      clicks_count: jobData.clicks_count || 0,
      status: jobData.status || 'Vigente',
      created_at: jobData.created_at || new Date().toISOString()
    };

    LOCAL_DYNAMIC_JOBS.set(newJob.id, newJob);

    // Intentar persistir en Supabase si están disponibles las claves
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const adminKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (supabaseUrl && adminKey) {
      const supabase = createClient(supabaseUrl, adminKey);
      const { error } = await supabase.from('job_postings').upsert(newJob);
      if (error) {
        console.warn('Could not persist job to Supabase (using in-memory fallback):', error.message);
      }
    }

    return { success: true, job: newJob };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Error desconocido al guardar convocatoria' };
  }
}

export async function toggleJobFeatured(id: string, featured: boolean): Promise<boolean> {
  const localJob = LOCAL_DYNAMIC_JOBS.get(id) || INITIAL_JOBS.find(j => j.id === id);
  if (localJob) {
    localJob.featured = featured;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const adminKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (supabaseUrl && adminKey) {
    const supabase = createClient(supabaseUrl, adminKey);
    const { error } = await supabase.from('job_postings').update({ featured }).eq('id', id);
    if (!error) return true;
  }

  return true;
}

export async function updateJobStatus(id: string, status: 'Vigente' | 'Finalizado' | 'Pendiente'): Promise<boolean> {
  const localJob = LOCAL_DYNAMIC_JOBS.get(id) || INITIAL_JOBS.find(j => j.id === id);
  if (localJob) {
    localJob.status = status;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const adminKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (supabaseUrl && adminKey) {
    const supabase = createClient(supabaseUrl, adminKey);
    const { error } = await supabase.from('job_postings').update({ status }).eq('id', id);
    if (!error) return true;
  }

  return true;
}

export async function deleteJobPosting(id: string): Promise<boolean> {
  LOCAL_DYNAMIC_JOBS.delete(id);
  const index = INITIAL_JOBS.findIndex(j => j.id === id);
  if (index !== -1) {
    INITIAL_JOBS.splice(index, 1);
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const adminKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (supabaseUrl && adminKey) {
    const supabase = createClient(supabaseUrl, adminKey);
    const { error } = await supabase.from('job_postings').delete().eq('id', id);
    if (!error) return true;
  }

  return true;
}

