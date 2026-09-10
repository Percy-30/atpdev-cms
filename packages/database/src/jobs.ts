import { createClient } from '@supabase/supabase-js';

export type OdpeVacancy = {
  odpe: string;
  count: number;
  deadline: string;
};

export type JobPlaza = {
  cas_code?: string;
  title: string;
  education?: string;
  experience?: string;
  salary?: string;
  bases_url?: string;
};

export type EducationLevel = 
  | 'Secundaria' 
  | 'Técnico' 
  | 'Egresado' 
  | 'Bachiller' 
  | 'Titulado' 
  | 'Maestría / Doctorado'
  | 'Universitarios'
  | 'Técnico / Universitario'
  | 'Secundaria, Técnicos, Universitarios'
  | (string & {});

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
  education_level: EducationLevel;
  salary_min?: number;
  salary_max?: number;
  salary_text: string;
  vacancies_count: number;
  description: string;
  requirements: string[];
  benefits?: string[];
  apply_url: string;
  bases_pdf_url?: string;
  cuadro_plazas_url?: string;
  cronograma_url?: string;
  anexos_url?: string;
  guia_postulante_url?: string;
  resultados_url?: string;
  fuente_url?: string;
  official_portal_name?: string;
  odpe_vacancies?: OdpeVacancy[];
  plazas?: JobPlaza[];
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
    bases_pdf_url: "https://drive.google.com/file/d/1Jvtj7QBNaiPxcRQ5Dyywp5TmbPwcRn_Z/view?usp=drive_link",
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
    entity_name: "PROGRAMA NACIONAL PLATAFORMAS DE ACCIÓN PARA LA INCLUSIÓN SOCIAL - PAÍS",
    entity_ruc: "20602324976",
    entity_verified: true,
    entity_logo: "/logos/programa-pais.jpg",
    sector_type: "CAS 1057",
    region: "Ayacucho, Cajamarca, Cusco, Huánuco, Junín, Loreto, Pasco, Puno",
    category: "Ciencias Sociales y Humanidades",
    education_level: "Universitarios",
    salary_min: 3000,
    salary_max: 6000,
    salary_text: "Entre S/. 3,000.00 y 6,000.00 Soles",
    vacancies_count: 19,
    description: "Gestión, coordinación e implementación de servicios sociales del Estado en los Tambos y plataformas itinerantes del Programa PAIS en Ayacucho, Cajamarca, Cusco, Huánuco, Junín, Loreto, Pasco y Puno.",
    requirements: [
      "Formación: Título o Bachiller Profesional Universitario según cada código CAS.",
      "Experiencia: Experiencia mínima de 2 a 4 años en gestión pública, programas sociales o desarrollo comunitario.",
      "Idioma: Dominio de lengua originaria (Quechua / Aymara) deseable según región de intervención."
    ],
    benefits: [
      "Contrato CAS bajo D.L. 1057 con todos los beneficios legales.",
      "Seguro Médico de Salud ESSALUD / EPS.",
      "Asignación de viáticos por desplazamiento en plataformas itinerantes."
    ],
    apply_url: "http://convocatorias.pais.gob.pe/convocatorias/externo/portal/ConvocatoriasPortal.aspx",
    bases_pdf_url: "https://drive.google.com/file/d/1oh6J5FzNKlGf7aPM8I-zP9uusBVyYvBN/view?usp=drive_link",
    official_portal_name: "Convocatorias Programa PAÍS Portal Oficial",
    start_date: "2026-08-28",
    end_date: "2026-09-09",
    featured: true,
    views_count: 2190,
    clicks_count: 670,
    status: "Vigente",
    created_at: "2026-08-28T10:00:00Z",
    plazas: [
      {
            "cas_code": "CAS Nº 065",
            "title": "(1) GESTOR/A INSTITUCIONAL AYACUCHO - AUCARA",
            "education": "bachiller universitario en Ciencias Sociales, administrativas, económicas, agrarias, forestales, Educación, Comunicaciones, salud, Psicología, Ecología, veterinaria, Zootecnia, Industrias Alimentarias o Ingeniería Agropecuaria o afines por la formación.",
            "experience": "(02) años de Experiencia General en el sector público o privado.",
            "salary": "S/. 3000",
            "bases_url": "https://drive.google.com/file/d/1oh6J5FzNKlGf7aPM8I-zP9uusBVyYvBN/view?usp=drive_link"
      },
      {
            "cas_code": "CAS Nº 066",
            "title": "(1) GESTOR/A INSTITUCIONAL AYACUCHO - PARARCA",
            "education": "bachiller universitario en Ciencias Sociales, administrativas, económicas, agrarias, forestales, Educación, Comunicaciones, salud, Psicología, Ecología, veterinaria, Zootecnia, Industrias Alimentarias o Ingeniería Agropecuaria o afines por la formación.",
            "experience": "(02) años de Experiencia General en el sector público o privado.",
            "salary": "S/. 3000",
            "bases_url": "https://drive.google.com/file/d/1waXbCeY7qQ9LEH92u9bEonGMDAFAn88y/view?usp=drive_link"
      },
      {
            "cas_code": "CAS Nº 067",
            "title": "(1) GESTOR/A INSTITUCIONAL AYACUCHO - MARCABAMBA",
            "education": "bachiller universitario en Ciencias Sociales, administrativas, económicas, agrarias, forestales, Educación, Comunicaciones, salud, Psicología, Ecología, veterinaria, Zootecnia, Industrias Alimentarias o Ingeniería Agropecuaria o afines por la formación.",
            "experience": "(02) años de Experiencia General en el sector público o privado.",
            "salary": "S/. 3000",
            "bases_url": "https://drive.google.com/file/d/1QFgVfJ0nbAEns88J-pcI77SD7ywmnEVC/view?usp=drive_link"
      },
      {
            "cas_code": "CAS Nº 068",
            "title": "(1) GESTOR/A INSTITUCIONAL AYACUCHO - SAMUGARI",
            "education": "bachiller universitario en Ciencias Sociales, administrativas, económicas, agrarias, forestales, Educación, Comunicaciones, salud, Psicología, Ecología, veterinaria, Zootecnia, Industrias Alimentarias o Ingeniería Agropecuaria o afines por la formación.",
            "experience": "(02) años de Experiencia General en el sector público o privado.",
            "salary": "S/. 3000",
            "bases_url": "https://drive.google.com/file/d/1pjG-gssr2uuF4fbjqqQUiJ41kBg_Aoao/view?usp=drive_link"
      },
      {
            "cas_code": "CAS Nº 069",
            "title": "(1) MONITOR/ REGIONAL DE PLATAFORMAS CAJAMARCA - CAJAMARCA",
            "education": "título profesional universitario en Antropología, Sociología, Economía, Agronomía, Zootecnia, Ingeniería Agropecuaria, ciencias de la salud o afines por la formación.",
            "experience": "(04) años de Experiencia General en el sector público o privado.",
            "salary": "S/. 6000",
            "bases_url": "https://drive.google.com/file/d/1A0-2IJTr2t4kKTGuwzAOFaufaxVgaysc/view?usp=drive_link"
      },
      {
            "cas_code": "CAS Nº 070",
            "title": "(1) GESTOR/A INSTITUCIONAL CUSCO - HUANOQUITE",
            "education": "bachiller universitario en Ciencias Sociales, administrativas, económicas, agrarias, forestales, Educación, Comunicaciones, salud, Psicología, Ecología, veterinaria, Zootecnia, Industrias Alimentarias o Ingeniería Agropecuaria o afines por la formación.",
            "experience": "(02) años de Experiencia General en el sector público o privado.",
            "salary": "S/. 3000",
            "bases_url": "https://drive.google.com/file/d/174xv7Dc_qyhLvmCGFjCe0GH8kmrEipOt/view?usp=drive_link"
      },
      {
            "cas_code": "CAS Nº 071",
            "title": "(1) GESTOR/A INSTITUCIONAL CUSCO - OMACHA",
            "education": "bachiller universitario en Ciencias Sociales, administrativas, económicas, agrarias, forestales, Educación, Comunicaciones, salud, Psicología, Ecología, veterinaria, Zootecnia, Industrias Alimentarias o Ingeniería Agropecuaria o afines por la formación.",
            "experience": "(02) años de Experiencia General en el sector público o privado.",
            "salary": "S/. 3000",
            "bases_url": "https://drive.google.com/file/d/1s1mTn9RzwEugDlzHm6RTqrP36d_ljmgW/view?usp=drive_link"
      },
      {
            "cas_code": "CAS Nº 072",
            "title": "(1) GESTOR/A INSTITUCIONAL CUSCO - PAUCARTAMBO",
            "education": "bachiller universitario en Ciencias Sociales, administrativas, económicas, agrarias, forestales, Educación, Comunicaciones, salud, Psicología, Ecología, veterinaria, Zootecnia, Industrias Alimentarias o Ingeniería Agropecuaria o afines por la formación.",
            "experience": "(02) años de Experiencia General en el sector público o privado.",
            "salary": "S/. 3000",
            "bases_url": "https://drive.google.com/file/d/1x5zYqihq8myz9swH6rVOn0PZ2IE2R_t3/view?usp=drive_link"
      },
      {
            "cas_code": "CAS Nº 073",
            "title": "(1) GESTOR/A INSTITUCIONAL CUSCO - QUELLOUNO",
            "education": "bachiller universitario en Ciencias Sociales, administrativas, económicas, agrarias, forestales, Educación, Comunicaciones, salud, Psicología, Ecología, veterinaria, Zootecnia, Industrias Alimentarias o Ingeniería Agropecuaria o afines por la formación.",
            "experience": "(02) años de Experiencia General en el sector público o privado.",
            "salary": "S/. 3000",
            "bases_url": "https://drive.google.com/file/d/15js57iWEa75h5X-qcCTd4HTnl4hsUnkk/view?usp=drive_link"
      },
      {
            "cas_code": "CAS Nº 074",
            "title": "(1) GESTOR/A INSTITUCIONAL HUÁNUCO - CHAGLLA",
            "education": "bachiller universitario en Ciencias Sociales, administrativas, económicas, agrarias, forestales, Educación, Comunicaciones, salud, Psicología, Ecología, veterinaria, Zootecnia, Industrias Alimentarias o Ingeniería Agropecuaria o afines por la formación.",
            "experience": "(02) años de Experiencia General en el sector público o privado.",
            "salary": "S/. 3000",
            "bases_url": "https://drive.google.com/file/d/1wHl3HtyIZFeVblp5Z0y4iIAApANtPe3z/view?usp=drive_link"
      },
      {
            "cas_code": "CAS Nº 075",
            "title": "(1) GESTOR/A INSTITUCIONAL HUÁNUCO - MONZON",
            "education": "bachiller universitario en Ciencias Sociales, administrativas, económicas, agrarias, forestales, Educación, Comunicaciones, salud, Psicología, Ecología, veterinaria, Zootecnia, Industrias Alimentarias o Ingeniería Agropecuaria o afines por la formación.",
            "experience": "(02) años de Experiencia General en el sector público o privado.",
            "salary": "S/. 3000",
            "bases_url": "https://drive.google.com/file/d/1TBJAWwORr3L2Lg1w5xydoVOb28G8rfWF/view?usp=drive_link"
      },
      {
            "cas_code": "CAS Nº 076",
            "title": "(1) GESTOR/A INSTITUCIONAL HUÁNUCO - CAYNA",
            "education": "bachiller universitario en Ciencias Sociales, administrativas, económicas, agrarias, forestales, Educación, Comunicaciones, salud, Psicología, Ecología, veterinaria, Zootecnia, Industrias Alimentarias o Ingeniería Agropecuaria o afines por la formación.",
            "experience": "(02) años de Experiencia General en el sector público o privado.",
            "salary": "S/. 3000",
            "bases_url": "https://drive.google.com/file/d/1yfb-P-xrflwocmbi29kZX2Z7TGWRj5tr/view?usp=drive_link"
      },
      {
            "cas_code": "CAS Nº 077",
            "title": "(1) GESTOR/A INSTITUCIONAL JUNÍN - PANGOA",
            "education": "bachiller universitario en Ciencias Sociales, administrativas, económicas, agrarias, forestales, Educación, Comunicaciones, salud, Psicología, Ecología, veterinaria, Zootecnia, Industrias Alimentarias o Ingeniería Agropecuaria o afines por la formación.",
            "experience": "(02) años de Experiencia General en el sector público o privado.",
            "salary": "S/. 3000",
            "bases_url": "https://drive.google.com/file/d/1sAJLb8RcHn_LLJoszTfUNwGpv_mifIW_/view?usp=drive_link"
      },
      {
            "cas_code": "CAS Nº 078",
            "title": "(1) GESTOR/A INSTITUCIONAL JUNÍN - SANTO DOMINGO DE\n          ACOBAMBA",
            "education": "bachiller universitario en Ciencias Sociales, administrativas, económicas, agrarias, forestales, Educación, Comunicaciones, salud, Psicología, Ecología, veterinaria, Zootecnia, Industrias Alimentarias o Ingeniería Agropecuaria o afines por la formación.",
            "experience": "(02) años de Experiencia General en el sector público o privado.",
            "salary": "S/. 3000",
            "bases_url": "https://drive.google.com/file/d/1yRc_XfVfm-YZhbKjkDeDG0qCTmoVQ_aq/view?usp=drive_link"
      },
      {
            "cas_code": "CAS Nº 079",
            "title": "(1) GESTOR/A INSTITUCIONAL LORETO - PEBAS",
            "education": "bachiller universitario en Ciencias Sociales, administrativas, económicas, agrarias, forestales, Educación, Comunicaciones, salud, Psicología, Ecología, veterinaria, Zootecnia, Industrias Alimentarias o Ingeniería Agropecuaria o afines por la formación.",
            "experience": "(02) años de Experiencia General en el sector público o privado.",
            "salary": "S/. 3000",
            "bases_url": "https://drive.google.com/file/d/1nP9yYgZsmojfchXuXkEerj6u_px_Gs2s/view?usp=drive_link"
      },
      {
            "cas_code": "CAS Nº 080",
            "title": "(1) GESTOR/A INSTITUCIONAL PASCO - YANAHUANCA",
            "education": "bachiller universitario en Ciencias Sociales, administrativas, económicas, agrarias, forestales, Educación, Comunicaciones, salud, Psicología, Ecología, veterinaria, Zootecnia, Industrias Alimentarias o Ingeniería Agropecuaria o afines por la formación.",
            "experience": "(02) años de Experiencia General en el sector público o privado.",
            "salary": "S/. 3000",
            "bases_url": "https://drive.google.com/file/d/1ORFPff99b4ENWYtpkepe850WGKOiutG9/view?usp=drive_link"
      },
      {
            "cas_code": "CAS Nº 081",
            "title": "(1) GESTOR/A INSTITUCIONAL PUNO - AYAVIRI",
            "education": "bachiller universitario en Ciencias Sociales, administrativas, económicas, agrarias, forestales, Educación, Comunicaciones, salud, Psicología, Ecología, veterinaria, Zootecnia, Industrias Alimentarias o Ingeniería Agropecuaria o afines por la formación.",
            "experience": "(02) años de Experiencia General en el sector público o privado.",
            "salary": "S/. 3000",
            "bases_url": "https://drive.google.com/file/d/1pKM0LGxF2_IdWkV_UgGhXPIVC338pyoS/view?usp=drive_link"
      },
      {
            "cas_code": "CAS Nº 082",
            "title": "(1) GESTOR/A INSTITUCIONAL PUNO - OCUVIRI",
            "education": "bachiller universitario en Ciencias Sociales, administrativas, económicas, agrarias, forestales, Educación, Comunicaciones, salud, Psicología, Ecología, veterinaria, Zootecnia, Industrias Alimentarias o Ingeniería Agropecuaria o afines por la formación.",
            "experience": "(02) años de Experiencia General en el sector público o privado.",
            "salary": "S/. 3000",
            "bases_url": "https://drive.google.com/file/d/1FxSzPkpMdpbx_rYDO9ygNkfcAhleksn_/view?usp=drive_link"
      },
      {
            "cas_code": "CAS Nº 083",
            "title": "(1) GESTOR/A INSTITUCIONAL PUNO - PUTINA",
            "education": "bachiller universitario en Ciencias Sociales, administrativas, económicas, agrarias, forestales, Educación, Comunicaciones, salud, Psicología, Ecología, veterinaria, Zootecnia, Industrias Alimentarias o Ingeniería Agropecuaria o afines por la formación.",
            "experience": "(02) años de Experiencia General en el sector público o privado.",
            "salary": "S/. 3000",
            "bases_url": "https://drive.google.com/file/d/1m4FU_-vo8YgMkFuqJ8wu8NelKh-ayjiU/view?usp=drive_link"
      }
]
  },
  {
    id: "job-juntos-01",
    title: "Programa Juntos: (04) Gestores Locales, Comunicadores",
    slug: "programa-juntos-gestores-locales-comunicadores",
    entity_name: "PROGRAMA NACIONAL DE APOYO DIRECTO A LOS MAS POBRES - JUNTOS",
    entity_ruc: "20100000000",
    entity_verified: true,
    entity_logo: "/logos/programa-juntos.jpg",
    sector_type: "CAS 1057",
    region: "Lima, Piura",
    category: "Administración y Contabilidad",
    education_level: "Técnico / Universitario",
    salary_min: 2500,
    salary_max: 6000,
    salary_text: "Entre S/. 2,500.00 y 6,000.00 Soles",
    vacancies_count: 4,
    description: "Convocatoria oficial PROGRAMA NACIONAL DE APOYO DIRECTO A LOS MAS POBRES (JUNTOS): Gestores Locales de Desarrollo Social y Especialistas en Comunicación para Piura y Lima.",
    requirements: [
      "Cumplir con el perfil de formación académica especificado para cada código CAS (técnico, bachiller o titulado).",
      "Acreditar experiencia general y específica según el puesto convocado (2 a 5 años).",
      "Presentar la documentación requerida en las bases oficiales del concurso."
    ],
    benefits: [
      "Contrato laboral bajo régimen CAS 1057 con todos los beneficios de ley.",
      "Aportes al seguro de salud ESSALUD y régimen previsional (ONP/AFP)."
    ],
    apply_url: "https://www.gob.pe/institucion/juntos/informes-publicaciones?tipo_publicacion=convocatoria-de-trabajo",
    bases_pdf_url: "https://drive.google.com/file/d/1cemIyOm3MeY9CPcvJ92v5pELZCksXDUK/view?usp=drive_link",
    official_portal_name: "Portal de Convocatorias Programa JUNTOS",
    start_date: "2026-08-28",
    end_date: "2026-09-08",
    featured: true,
    views_count: 5820,
    clicks_count: 2080,
    status: "Vigente",
    created_at: "2026-08-28T12:00:00Z",
    plazas: [
      {
        cas_code: "CAS Nº 157",
        title: "(1) GESTOR LOCAL DE DESARROLLO SOCIAL PIURA - FRIAS",
        education: "título técnico superior o egresado universitario, o bachiller o título universitario en todas las carreras.",
        experience: "(03) años en el sector público y/o privado.",
        salary: "S/. 3000",
        bases_url: "https://drive.google.com/file/d/1cemIyOm3MeY9CPcvJ92v5pELZCksXDUK/view?usp=drive_link"
      },
      {
        cas_code: "CAS Nº 158",
        title: "(1) GESTOR LOCAL - ZONA ALEJADA PIURA - EL CARMEN DE LA FRONTERA",
        education: "título técnico superior o egresado universitario, o bachiller o título universitario en todas las carreras.",
        experience: "(02) años en el sector público y/o privado.",
        salary: "S/. 3000",
        bases_url: "https://drive.google.com/file/d/1zVxymaUCX6FCyCSp9m-iPaTxeW1Il3bP/view?usp=drive_link"
      },
      {
        cas_code: "CAS Nº 159",
        title: "(1) COMUNICADOR/A PIURA - PIURA",
        education: "bachiller universitario en Ciencias de la Comunicación, Comunicación Social, Periodismo, o afines por la formación.",
        experience: "(03) años en el sector público y/o privado.",
        salary: "S/. 2500",
        bases_url: "https://drive.google.com/file/d/1toZXTsUZzDBInRwPF2-AwmLg-oGbl9GP/view?usp=drive_link"
      },
      {
        cas_code: "CAS Nº 160",
        title: "(1) ESPECIALISTA EN COMUNICACIÓN LIMA - MIRAFLORES",
        education: "título profesional universitario en Ciencias de la Comunicación o Publicidad o Periodismo o Relaciones Públicas o afines por la formación.",
        experience: "(05) años en el sector público y/o privado.",
        salary: "S/. 6000",
        bases_url: "https://drive.google.com/file/d/1zbwGCzgZ-znf9jPJWvqABswlHStH3Bea/view?usp=drive_link"
      }
    ]
  },
  {
    id: "job-juntos-02",
    title: "Programa Juntos: (34) Gestores Locales, Asistente, Comunicador, Administrador, Otros",
    slug: "programa-juntos-gestores-locales-asistente",
    entity_name: "PROGRAMA NACIONAL DE APOYO DIRECTO A LOS MAS POBRES - JUNTOS",
    entity_ruc: "20100000000",
    entity_verified: true,
    entity_logo: "/logos/programa-juntos.jpg",
    sector_type: "CAS 1057",
    region: "Nacional (Cajamarca, Lima, Piura, Ayacucho, otros)",
    category: "Administración y Contabilidad",
    education_level: "Técnico / Universitario",
    salary_min: 2000,
    salary_max: 6000,
    salary_text: "Entre S/. 2,000.00 y 6,000.00 Soles",
    vacancies_count: 34,
    description: "Convocatoria nacional Programa JUNTOS: (34) vacantes para gestores locales, asistentes administrativos, comunicadores y coordinadores con bases oficiales en PDF.",
    requirements: [
      "Cumplir con el perfil de formación académica especificado para cada código CAS.",
      "Acreditar experiencia laboral general y específica según las bases oficiales del concurso.",
      "Presentar anexos y formatos oficiales requeridos en el portal institucional."
    ],
    benefits: [
      "Contrato laboral bajo régimen CAS 1057 con todos los beneficios de ley.",
      "Aportes al seguro de salud ESSALUD y régimen previsional (ONP/AFP)."
    ],
    apply_url: "https://www.gob.pe/institucion/juntos/informes-publicaciones?tipo_publicacion=convocatoria-de-trabajo",
    bases_pdf_url: "https://drive.google.com/file/d/1NQ-rjwgfNJcJD1MZeQ33iKg9PziapuV3/view?usp=drive_link",
    official_portal_name: "Portal de Convocatorias Programa JUNTOS",
    start_date: "2026-08-25",
    end_date: "2026-09-08",
    featured: true,
    views_count: 4890,
    clicks_count: 1780,
    status: "Vigente",
    created_at: "2026-08-25T12:00:00Z",
    plazas: [
      {
            "cas_code": "CAS Nº 123",
            "title": "(1) GESTOR LOCAL PARA LA UNIDAD TERRITORIAL CAJAMARCA -\n          CAJAMARCA",
            "education": "título técnico superior o egresado universitario, o bachiller o título universitario en todas las carreras.",
            "experience": "de (02) años en el sector público y/o privado.",
            "salary": "S/. 2000",
            "bases_url": "https://drive.google.com/file/d/1NQ-rjwgfNJcJD1MZeQ33iKg9PziapuV3/view?usp=drive_link"
      },
      {
            "cas_code": "CAS Nº 124",
            "title": "(1) GESTOR LOCAL - ZONA ALEJADA PARA LA UNIDAD TERRITORIAL\n          CAJAMARCA - JAEN",
            "education": "título técnico superior o egresado universitario, o bachiller o título universitario en todas las carreras.",
            "experience": "de (02) años en el sector público y/o privado.",
            "salary": "S/. 3000",
            "bases_url": "https://drive.google.com/file/d/1t96SWSrwzGKaVzUDDbcK08peR3zLpGhb/view?usp=drive_link"
      },
      {
            "cas_code": "CAS Nº 127",
            "title": "(1) GESTOR LOCAL PARA LA UNIDAD TERRITORIAL LIMA - LIMA",
            "education": "título técnico superior o egresado universitario, o bachiller o título universitario en todas las carreras.",
            "experience": "de (02) años en el sector público y/o privado.",
            "salary": "S/. 2000",
            "bases_url": "https://drive.google.com/file/d/1Er8ekPhCv49MHrArcdJQO68V2cZNPEXR/view?usp=drive_link"
      },
      {
            "cas_code": "CAS Nº 128",
            "title": "(1) GESTOR LOCAL PARA LA UNIDAD TERRITORIAL LIMA - LIMA",
            "education": "título técnico superior o egresado universitario, o bachiller o título universitario en todas las carreras.",
            "experience": "de (02) años en el sector público y/o privado.",
            "salary": "S/. 2000",
            "bases_url": "https://drive.google.com/file/d/1qX-h6jXBjSbhvxr3YdfSmZvkuUdVC3v9/view?usp=drive_link"
      },
      {
            "cas_code": "CAS Nº 129",
            "title": "(1) GESTOR LOCAL PARA LA UNIDAD TERRITORIAL LIMA - LIMA",
            "education": "título técnico superior o egresado universitario, o bachiller o título universitario en todas las carreras.",
            "experience": "de (02) años en el sector público y/o privado.",
            "salary": "S/. 2000",
            "bases_url": "https://drive.google.com/file/d/1cugPbaWM5dz-U6CfrSAdtCo1A0uxrbFj/view?usp=drive_link"
      },
      {
            "cas_code": "CAS Nº 130",
            "title": "(2) GESTOR LOCAL PARA LA UNIDAD TERRITORIAL LIMA - LIMA",
            "education": "título técnico superior o egresado universitario, o bachiller o título universitario en todas las carreras.",
            "experience": "de (02) años en el sector público y/o privado.",
            "salary": "S/. 2000",
            "bases_url": "https://drive.google.com/file/d/1ukDuegN36Iw82Vr0f3BJoojNY1pwXL53/view?usp=drive_link"
      },
      {
            "cas_code": "CAS Nº 131",
            "title": "(1) ASISTENTE DE ARCHIVO PARA LA UNIDAD TERRITORIAL LIMA -\n          LIMA",
            "education": "Egresado técnico básico y/o egresado técnico superior en las carreras de Administración, Secretariado, Archivística, Computación, Gestión Documental, Historia, Bibliotecología o afines por la formación. O egresado universitario en las",
            "experience": "de (01) año en el sector público y/o privado.",
            "salary": "S/. 1700",
            "bases_url": "https://drive.google.com/file/d/1dany0SdsKRSKP1p_DZviJJalWJ_nIlzF/view?usp=drive_link"
      },
      {
            "cas_code": "CAS Nº 132",
            "title": "(1) GESTOR LOCAL PARA LA UNIDAD TERRITORIAL HUANCAVELICA -\n          LIRCAY",
            "education": "título técnico superior o egresado universitario, o bachiller o título universitario en todas las carreras.",
            "experience": "de (02) años en el sector público y/o privado.",
            "salary": "S/. 2000",
            "bases_url": "https://drive.google.com/file/d/1hrRzH-Y8NUIGSIENqL8o7MCsu6Nw0UMQ/view?usp=drive_link"
      },
      {
            "cas_code": "CAS Nº 133",
            "title": "(2) GESTOR LOCAL PARA LA UNIDAD TERRITORIAL HUANCAVELICA -\n          CHURCAMPA",
            "education": "título técnico superior o egresado universitario, o bachiller o título universitario en todas las carreras.",
            "experience": "de (02) años en el sector público y/o privado.",
            "salary": "S/. 2000",
            "bases_url": "https://drive.google.com/file/d/1Y5uF5H2CNV-I8rHIHzsD0SItV4bhalM9/view?usp=drive_link"
      },
      {
            "cas_code": "CAS Nº 134",
            "title": "(1) GESTOR LOCAL PARA LA UNIDAD TERRITORIAL HUANCAVELICA -\n          HUANCAVELICA",
            "education": "título técnico superior o egresado universitario, o bachiller o título universitario en todas las carreras.",
            "experience": "de (02) años en el sector público y/o privado.",
            "salary": "S/. 2000",
            "bases_url": "https://drive.google.com/file/d/1djgqg1vaqeUaHBQazNYZhe53ww_D4a4p/view?usp=drive_link"
      },
      {
            "cas_code": "CAS Nº 135",
            "title": "(1) GESTOR LOCAL PARA LA UNIDAD TERRITORIAL HUANCAVELICA -\n          HUANCAVELICA",
            "education": "título técnico superior o egresado universitario, o bachiller o título universitario en todas las carreras.",
            "experience": "de (02) años en el sector público y/o privado.",
            "salary": "S/. 2000",
            "bases_url": "https://drive.google.com/file/d/1wFiKIiIWpSSlXLS90ySYXoyIytPh8XKT/view?usp=drive_link"
      },
      {
            "cas_code": "CAS Nº 137",
            "title": "(1) TÉCNICO DE ORIENTACIÓN Y ATENCIÓN AL USUARIO&nbsp;\n          PARA LA UNIDAD TERRITORIAL AMAZONAS CONDORCANQUI - NIEVA",
            "education": "Titulado Técnico Superior en Administración, Secretariado Ejecutivo o Computación e Informática, Egresado universitario en Administración, Derecho o Ciencias de la Comunicación.",
            "experience": "de (02) años en el sector público y/o privado.",
            "salary": "S/. 1700",
            "bases_url": "https://drive.google.com/file/d/1XjdcWFHACBW-u5XgsMDC3Q3YAgoyFOdh/view?usp=drive_link"
      },
      {
            "cas_code": "CAS Nº 138",
            "title": "(2) GESTORES LOCALES PARA LA UNIDAD TERRITORIAL AMAZONAS\n          BAGUA&nbsp;",
            "education": "título técnico superior o egresado universitario, o bachiller o título universitario en todas las carreras.",
            "experience": "de (02) años en el sector público y/o privado.",
            "salary": "S/. 2000",
            "bases_url": "https://drive.google.com/file/d/1a1zMgXXVHVgPmMJ3JpZsgRp1Y7ugLk9E/view?usp=drive_link"
      },
      {
            "cas_code": "CAS Nº 139",
            "title": "(1) GESTOR LOCAL PARA LA UNIDAD TERRITORIAL APURÍMAC\n          APURÍMAC - CHINCHEROS",
            "education": "título técnico superior o egresado universitario, o bachiller o título universitario en todas las carreras.",
            "experience": "de (02) años en el sector público y/o privado.",
            "salary": "S/. 2000",
            "bases_url": "https://drive.google.com/file/d/1ql8nSjSLtamAVUE0Dau0xwokgup-_0Hm/view?usp=drive_link"
      },
      {
            "cas_code": "CAS Nº 140",
            "title": "(1) GESTOR LOCAL PARA LA UNIDAD TERRITORIAL APURÍMAC -\n          CHALHUANCA",
            "education": "título técnico superior o egresado universitario, o bachiller o título universitario en todas las carreras.",
            "experience": "de (02) años en el sector público y/o privado.",
            "salary": "S/. 2000",
            "bases_url": "https://drive.google.com/file/d/1gaStkAaVctAQegRnmbqOFdPRumUFePWg/view?usp=drive_link"
      },
      {
            "cas_code": "CAS Nº 141",
            "title": "(1) GESTOR LOCAL PARA LA UNIDAD TERRITORIAL CUSCO -\n          KIMBIRI",
            "education": "título técnico superior o egresado universitario, o bachiller o título universitario en todas las carreras.",
            "experience": "de (02) años en el sector público y/o privado.",
            "salary": "S/. 2000",
            "bases_url": "https://drive.google.com/file/d/1c-N1NpvaIgkh7knb5K2zO-fl4MNfHyc3/view?usp=drive_link"
      },
      {
            "cas_code": "CAS Nº 142",
            "title": "(1) COMUNICADOR PARA LA UNIDAD TERRITORIAL CUSCO - CUSCO",
            "education": "Bachiller universitario en Ciencias de la Comunicación, Comunicación Social, Periodismo, o afines por la formación.",
            "experience": "Experiencia General de tres (03) años en el Sector Público y/o Privado.",
            "salary": "S/. 2500",
            "bases_url": "https://drive.google.com/file/d/1h4WuXwCtmEYM_Y27NQ8CCVyZkO5_QCAr/view?usp=drive_link"
      },
      {
            "cas_code": "CAS Nº 143",
            "title": "(1) GESTOR LOCAL PARA LA UNIDAD TERRITORIAL ÁNCASH -\n          POMABAMBA",
            "education": "título técnico superior o egresado universitario, o bachiller o título universitario en todas las carreras.",
            "experience": "de (02) años en el sector público y/o privado.",
            "salary": "S/. 2000",
            "bases_url": "https://drive.google.com/file/d/1d3WnDchNJFvrgyibBoT0r6U3a94JXTbR/view?usp=drive_link"
      },
      {
            "cas_code": "CAS Nº 144",
            "title": "(1) GESTOR DE DESARROLLO SOCIAL PARA LA UNIDAD TERRITORIAL\n          AYACUCHO - HUANTA",
            "education": "Título técnico superior o egresado universitario, o bachiller o título universitario en todas las carreras.",
            "experience": "de (03) años en el sector público y/o privado.",
            "salary": "S/. 3000",
            "bases_url": "https://drive.google.com/file/d/1s_NP3Hew23zZU8KQbWUfZqO2h_2nIYYQ/view?usp=drive_link"
      },
      {
            "cas_code": "CAS Nº 145",
            "title": "(1) GESTOR LOCAL PARA LA UNIDAD TERRITORIAL LORETO -\n          REQUENA",
            "education": "título técnico superior o egresado universitario, o bachiller o título universitario en todas las carreras.",
            "experience": "de (02) años en el sector público y/o privado.",
            "salary": "S/. 2000",
            "bases_url": "https://drive.google.com/file/d/1CEK9FZJLq0WYq1YXNqrQ9J7OUIesDSyK/view?usp=drive_link"
      },
      {
            "cas_code": "CAS Nº 146",
            "title": "(1) ADMINISTRADOR PARA LA UNIDAD TERRITORIAL LORETO -\n          IQUITOS",
            "education": "Título universitario en Ciencias Administrativas o Ciencias Económicas o Ciencias Contables o Ingeniería Industrial o afines por la formación.",
            "experience": "de (05) años en el sector público y/o privado.",
            "salary": "S/. 4000",
            "bases_url": "https://drive.google.com/file/d/1xwYS_LxnKBVsPAuvkMZEpRukVDVPgOIA/view?usp=drive_link"
      },
      {
            "cas_code": "CAS Nº 147",
            "title": "(1) GESTOR LOCAL PARA LA UNIDAD TERRITORIAL LORETO\n          YURIMAGUAS LORETO - YURIMAGUAS",
            "education": "título técnico superior o egresado universitario, o bachiller o título universitario en todas las carreras.",
            "experience": "de (02) años en el sector público y/o privado.",
            "salary": "S/. 2000",
            "bases_url": "https://drive.google.com/file/d/1lBbHQZTtnTqfauB2x9Km8Lxt1GLRsrOi/view?usp=drive_link"
      },
      {
            "cas_code": "CAS Nº 148",
            "title": "(1) ADMINISTRADOR PARA LA UNIDAD TERRITORIAL MADRE DE DIOS\n          MADRE DE DIOS - TAMBOPATA",
            "education": "Título universitario en Ciencias Administrativas o Ciencias Económicas o Ciencias Contables o Ingeniería Industrial o afines por la formación.",
            "experience": "de (05) años en el sector público y/o privado.",
            "salary": "S/. 4000",
            "bases_url": "https://drive.google.com/file/d/1sWEfwwu-BkwhARdeKBcYeddLWC3XrX0g/view?usp=drive_link"
      },
      {
            "cas_code": "CAS Nº 149",
            "title": "(1) COORDINADOR/A TÉCNICO ZONAL PARA LA UNIDAD TERRITORIAL\n          TACNA TACNA - TACNA",
            "education": "Título profesional universitario en Ciencias Sociales, Ciencias Económicas y Administrativas, Ciencias de la Salud, Educación, Ciencias Agropecuarias, Ingeniería e Informática o afines por la formación.",
            "experience": "de (06) años en el sector público y/o privado.",
            "salary": "S/. 3500",
            "bases_url": "https://drive.google.com/file/d/1Mfbsemb2NqjO5AiSJPdyAvjSZZcVdSNx/view?usp=drive_link"
      },
      {
            "cas_code": "CAS Nº 150",
            "title": "(1) GESTOR LOCAL PARA LA UNIDAD TERRITORIAL HUÁNUCO\n          HUÁNUCO - LLATA",
            "education": "título técnico superior o egresado universitario, o bachiller o título universitario en todas las carreras.",
            "experience": "de (02) años en el sector público y/o privado.",
            "salary": "S/. 2000",
            "bases_url": "https://drive.google.com/file/d/1I3_Xygl3pIF-W3jqxJv6n8vlt3TcMPxw/view?usp=drive_link"
      },
      {
            "cas_code": "CAS Nº 151",
            "title": "(1) GESTOR LOCAL PARA LA UNIDAD TERRITORIAL HUÁNUCO\n          HUÁNUCO - RUPA-RUPA",
            "education": "título técnico superior o egresado universitario, o bachiller o título universitario en todas las carreras.",
            "experience": "de (02) años en el sector público y/o privado.",
            "salary": "S/. 2000",
            "bases_url": "https://drive.google.com/file/d/1xpIMXfOxttIbGrm9-7pTFPp41gHlJHt3/view?usp=drive_link"
      },
      {
            "cas_code": "CAS Nº 152",
            "title": "(1) GESTOR LOCAL - ZONA ALEJADA PARA LA UNIDAD TERRITORIAL\n          SAN MARTÍN SAN MARTÍN - HUICUNGO",
            "education": "título técnico superior o egresado universitario, o bachiller o título universitario en todas las carreras.",
            "experience": "de (02) años en el sector público y/o privado.",
            "salary": "S/. 3000",
            "bases_url": "https://drive.google.com/file/d/1vcgOrKskYd-Pn0plMZtqSHaQmH4faHzl/view?usp=drive_link"
      },
      {
            "cas_code": "CAS Nº 153",
            "title": "(1) GESTOR LOCAL PARA LA UNIDAD TERRITORIAL SAN MARTÍN SAN\n          MARTÍN - RIOJA",
            "education": "título técnico superior o egresado universitario, o bachiller o título universitario en todas las carreras.",
            "experience": "de (02) años en el sector público y/o privado.",
            "salary": "S/. 2000",
            "bases_url": "https://drive.google.com/file/d/1mqT3qJZPxxqrKlUaASMvtspYXlHVWN-U/view?usp=drive_link"
      },
      {
            "cas_code": "CAS Nº 154",
            "title": "(1) GESTOR LOCAL PARA LA UNIDAD TERRITORIAL SAN MARTÍN SAN\n          MARTÍN - TOCACHE",
            "education": "título técnico superior o egresado universitario, o bachiller o título universitario en todas las carreras.",
            "experience": "de (02) años en el sector público y/o privado.",
            "salary": "S/. 2000",
            "bases_url": "https://drive.google.com/file/d/1_QU6ARv61upHtsBkECG1nwER_ALcCgGS/view?usp=drive_link"
      },
      {
            "cas_code": "CAS Nº 155",
            "title": "(1) ESPECIALISTA LIMA - MIRAFLORES",
            "education": "Título universitario en Ingeniería de Sistemas, Informática, de Software, de Computación e Informática.",
            "experience": "de (03) años en el sector público y/o privado.",
            "salary": "S/. 7000",
            "bases_url": "https://drive.google.com/file/d/1s14hSAXxA6wAehujJxmby8C3M0nk-j5f/view?usp=drive_link"
      },
      {
            "cas_code": "CAS Nº 156",
            "title": "(1) RESPONSABLE EN EJECUCIÓN CONTRACTUAL LIMA - MIRAFLORES",
            "education": "Título universitario en Derecho.",
            "experience": "de (07) años en el sector público y/o privado.",
            "salary": "S/. 9000",
            "bases_url": "https://drive.google.com/file/d/134MLmR3Ap4i1IVIv5enz_2qlKm_32MUl/view?usp=drive_link"
      }
]
  },
    {
    id: "job-red-salud-03",
    title: "Red de Salud Valle del Mantaro 2026: (26) Personal de la Salud, Asistencial y Administrativo",
    slug: "red-salud-valle-mantaro-personal-salud-asistencial-administrativo",
    entity_name: "RED DE SALUD VALLE DEL MANTARO - GORE JUNÍN",
    entity_ruc: "20486082490",
    entity_verified: true,
    entity_logo: "/logos/red-salud-mantaro.jpg",
    sector_type: "D.L. 276",
    region: "Junín (Huancayo, Concepción)",
    category: "Salud y Medicina",
    education_level: "Secundaria, Técnicos, Universitarios",
    salary_min: 1444,
    salary_max: 6624,
    salary_text: "Entre S/. 1,444.00 y 6,624.00 Soles",
    vacancies_count: 26,
    description: "Convocatoria pública D.L. 276 para contratación indeterminada de personal de salud asistencial y administrativo en centros de salud de Huancayo y Concepción.",
    requirements: [
      "Formación académica acreditada según cada código de plaza (médicos, enfermeros, obstetras, técnicos y auxiliares).",
      "Experiencia laboral de 1 a 3 años según corresponda en establecimientos del sector público o privado.",
      "Presentación de documentos en Mesa de Partes RSVM (Av. Giráldez N.º 886 - Huancayo) el 08 de Setiembre de 2026."
    ],
    benefits: [
      "Nombramiento y contratación bajo régimen D.L. 276 a plazo indeterminado.",
      "Beneficios de ley, seguro social de salud ESSALUD y régimen de pensiones."
    ],
    apply_url: "https://www.rsvm.gob.pe/intranet/convocatoriadet/685.pdf",
    bases_pdf_url: "https://www.rsvm.gob.pe/intranet/convocatoriadet/685.pdf",
    official_portal_name: "Red de Salud Valle del Mantaro - Portal Oficial",
    start_date: "2026-08-27",
    end_date: "2026-09-08",
    featured: true,
    views_count: 3850,
    clicks_count: 1420,
    status: "Vigente",
    created_at: "2026-08-27T12:00:00Z",
    plazas: [
      {
            "cas_code": "276 Nº 02",
            "title": "(1) ABOGADO JUNÍN - HUANCAYO",
            "education": "titulado en la carrera universitaria de Abogado",
            "experience": "03 años de experiencia",
            "salary": "S/. 1444",
            "bases_url": "https://www.rsvm.gob.pe/intranet/convocatoriadet/685.pdf"
      },
      {
            "cas_code": "276 Nº 02",
            "title": "(1) AUXILIAR ASISTENCIAL JUNÍN - CONCEPCION",
            "education": "secundaria completa",
            "experience": "01 año de experiencia",
            "salary": "S/. 2697",
            "bases_url": "https://www.rsvm.gob.pe/intranet/convocatoriadet/685.pdf"
      },
      {
            "cas_code": "276 Nº 02",
            "title": "(1) AUXILIAR ASISTENCIAL JUNÍN - CONCEPCION",
            "education": "secundaria completa",
            "experience": "01 año de experiencia",
            "salary": "S/. 2697",
            "bases_url": "https://www.rsvm.gob.pe/intranet/convocatoriadet/685.pdf"
      },
      {
            "cas_code": "276 Nº 02",
            "title": "(1) ENFERMERA/O JUNÍN - CHILCA",
            "education": "titulado en la carrera de Enfermería, colegiado, habilitado y resoluciòn de termino de serums",
            "experience": "01 año de experiencia",
            "salary": "S/. 5300",
            "bases_url": "https://www.rsvm.gob.pe/intranet/convocatoriadet/685.pdf"
      },
      {
            "cas_code": "276 Nº 02",
            "title": "(1) ENFERMERA/O JUNÍN - CHILCA",
            "education": "titulado en la carrera de Enfermería, colegiado, habilitado y resoluciòn de termino de serums",
            "experience": "01 año de experiencia",
            "salary": "S/. 5300",
            "bases_url": "https://www.rsvm.gob.pe/intranet/convocatoriadet/685.pdf"
      },
      {
            "cas_code": "276 Nº 02",
            "title": "(1) ENFERMERA/O JUNÍN - CONCEPCION",
            "education": "titulado en la carrera de Enfermería, colegiado, habilitado y resoluciòn de termino de serums",
            "experience": "01 año de experiencia",
            "salary": "S/. 5300",
            "bases_url": "https://www.rsvm.gob.pe/intranet/convocatoriadet/685.pdf"
      },
      {
            "cas_code": "276 Nº 02",
            "title": "(1) ENFERMERA/O JUNÍN - EL TAMBO",
            "education": "titulado en la carrera de Enfermería, colegiado, habilitado y resoluciòn de termino de serums",
            "experience": "01 año de experiencia",
            "salary": "S/. 5300",
            "bases_url": "https://www.rsvm.gob.pe/intranet/convocatoriadet/685.pdf"
      },
      {
            "cas_code": "276 Nº 02",
            "title": "(1) ENFERMERA/O JUNÍN - ORCOTUNA",
            "education": "titulado en la carrera de Enfermería, colegiado, habilitado y resoluciòn de termino de serums",
            "experience": "01 año de experiencia",
            "salary": "S/. 5300",
            "bases_url": "https://www.rsvm.gob.pe/intranet/convocatoriadet/685.pdf"
      },
      {
            "cas_code": "276 Nº 02",
            "title": "(1) ENFERMERA/O JUNÍN - ORCOTUNA",
            "education": "titulado en la carrera de Enfermería, colegiado, habilitado y resoluciòn de termino de serums",
            "experience": "01 año de experiencia",
            "salary": "S/. 5300",
            "bases_url": "https://www.rsvm.gob.pe/intranet/convocatoriadet/685.pdf"
      },
      {
            "cas_code": "276 Nº 02",
            "title": "(1) ESPECIALISTA ADMINISTRATIVO I JUNÍN - HUANCAYO",
            "education": "titulado en las carreras universitarias de Ciencias Administrativas, economicas, contables o carreras afines al organo y cargo. - Colegiado y habilitado",
            "experience": "03 años de experiencia",
            "salary": "S/. 1444",
            "bases_url": "https://www.rsvm.gob.pe/intranet/convocatoriadet/685.pdf"
      },
      {
            "cas_code": "276 Nº 02",
            "title": "(1) MÉDICO JUNÍN - CONCEPCION",
            "education": "titulado en la carrera de Medicina Humana, colegiado, habilitado y resoluciòn de termino de serums",
            "experience": "01 año de experiencia",
            "salary": "S/. 6624",
            "bases_url": "https://www.rsvm.gob.pe/intranet/convocatoriadet/685.pdf"
      },
      {
            "cas_code": "276 Nº 02",
            "title": "(1) MÉDICO JUNÍN - EL TAMBO",
            "education": "titulado en la carrera de Medicina Humana, colegiado, habilitado y resoluciòn de termino de serums",
            "experience": "01 año de experiencia",
            "salary": "S/. 6624",
            "bases_url": "https://www.rsvm.gob.pe/intranet/convocatoriadet/685.pdf"
      },
      {
            "cas_code": "276 Nº 02",
            "title": "(1) MÉDICO JUNÍN - EL TAMBO",
            "education": "titulado en la carrera de Medicina Humana, colegiado, habilitado y resoluciòn de termino de serums",
            "experience": "01 año de experiencia",
            "salary": "S/. 6624",
            "bases_url": "https://www.rsvm.gob.pe/intranet/convocatoriadet/685.pdf"
      },
      {
            "cas_code": "276 Nº 02",
            "title": "(1) ODONTOLOGO JUNÍN - HUANCAYO",
            "education": "titulado en la carrera de odontologia o estomatologia, colegiado, habilitado y resoluciòn de termino de serums",
            "experience": "01 año de experiencia",
            "salary": "S/. 5300",
            "bases_url": "https://www.rsvm.gob.pe/intranet/convocatoriadet/685.pdf"
      },
      {
            "cas_code": "276 Nº 02",
            "title": "(1) ODONTOLOGO JUNÍN - SICAYA",
            "education": "titulado en la carrera de odontologia o estomatologia, colegiado, habilitado y resoluciòn de termino de serums",
            "experience": "01 año de experiencia",
            "salary": "S/. 5300",
            "bases_url": "https://www.rsvm.gob.pe/intranet/convocatoriadet/685.pdf"
      },
      {
            "cas_code": "276 Nº 02",
            "title": "(1) QUIMICO FARMACEÚTICO JUNÍN - CHILCA",
            "education": "titulado en la carrera universitaria de Farmacia y bioquimica, colegiado, habilitado y resoluciòn de termino de serums",
            "experience": "01 año de experiencia",
            "salary": "S/. 5300",
            "bases_url": "https://www.rsvm.gob.pe/intranet/convocatoriadet/685.pdf"
      },
      {
            "cas_code": "276 Nº 02",
            "title": "(1) TÉCNICO ASISTENCIAL JUNÍN - HUANCAYO",
            "education": "titulado en carreras tècnicas en salud",
            "experience": "01 año de experiencia",
            "salary": "S/. 2775",
            "bases_url": "https://www.rsvm.gob.pe/intranet/convocatoriadet/685.pdf"
      },
      {
            "cas_code": "276 Nº 02",
            "title": "(1) TÉCNICO EN ENFERMERÍA I JUNÍN - CHILCA",
            "education": "titulado en la carrera técnica de Enfermería",
            "experience": "01 año de experiencia",
            "salary": "S/. 2775",
            "bases_url": "https://www.rsvm.gob.pe/intranet/convocatoriadet/685.pdf"
      },
      {
            "cas_code": "276 Nº 02",
            "title": "(1) TÉCNICO EN ENFERMERÍA I JUNÍN - EL TAMBO",
            "education": "titulado en la carrera técnica de Enfermería",
            "experience": "01 año de experiencia",
            "salary": "S/. 2775",
            "bases_url": "https://www.rsvm.gob.pe/intranet/convocatoriadet/685.pdf"
      },
      {
            "cas_code": "276 Nº 02",
            "title": "(1) TÉCNICO EN ENFERMERÍA I JUNÍN - HUANCAYO",
            "education": "titulado en la carreras tècnica de Enfermería",
            "experience": "01 año de experiencia",
            "salary": "S/. 2775",
            "bases_url": "https://www.rsvm.gob.pe/intranet/convocatoriadet/685.pdf"
      },
      {
            "cas_code": "276 Nº 02",
            "title": "(1) TÉCNICO EN ENFERMERÍA I JUNÍN - HUANCAYO",
            "education": "titulado en la carrera técnica de Enfermería",
            "experience": "01 año de experiencia",
            "salary": "S/. 2775",
            "bases_url": "https://www.rsvm.gob.pe/intranet/convocatoriadet/685.pdf"
      },
      {
            "cas_code": "276 Nº 02",
            "title": "(1) TÉCNICO EN SALUD PÚBLICA JUNÍN - HUANCAYO",
            "education": "titulao en carreras técnicas en Salud Pública o afines, o estudios universitarios en carreras de ciencias de la salud, no menor a seis semestres académicos",
            "experience": "01 año de experiencia",
            "salary": "S/. 2775",
            "bases_url": "https://www.rsvm.gob.pe/intranet/convocatoriadet/685.pdf"
      },
      {
            "cas_code": "276 Nº 02",
            "title": "(1) TECNÓLOGO MÉDICO JUNÍN - SAPALLANGA",
            "education": "titulado en la carrera de tecnología medica en laboratoria clínico y anatomía patológica, colegiado, habilitado y resoluciòn de termino de serums",
            "experience": "01 año de experiencia",
            "salary": "S/. 5300",
            "bases_url": "https://www.rsvm.gob.pe/intranet/convocatoriadet/685.pdf"
      },
      {
            "cas_code": "276 Nº 02",
            "title": "(1) TRABAJADORA SOCIAL JUNÍN - HUAYUCACHI",
            "education": "titulado en la carrera de Trabajo Social, colegiado, habilitado y resoluciòn de termino de serums",
            "experience": "01 año de experiencia",
            "salary": "S/. 5300",
            "bases_url": "https://www.rsvm.gob.pe/intranet/convocatoriadet/685.pdf"
      },
      {
            "cas_code": "276 Nº 02",
            "title": "(1) TRABAJADORA SOCIAL JUNÍN - NUEVE DE JULIO",
            "education": "titulado en la carrera de Trabajo Social, colegiado, habilitado y resoluciòn de termino de serums",
            "experience": "01 año de experiencia",
            "salary": "S/. 5300",
            "bases_url": "https://www.rsvm.gob.pe/intranet/convocatoriadet/685.pdf"
      },
      {
            "cas_code": "276 Nº 02",
            "title": "(1) TRABAJADORA SOCIAL JUNÍN - ORCOTUNA",
            "education": "titulado en la carrera de Trabajo Social, colegiado, habilitado y resoluciòn de termino de serums",
            "experience": "01 año de experiencia",
            "salary": "S/. 5300 « 1 2 3 4 5 6 » DETALLES DE POSTULACIÓN PUBLICACIÓN DE LA CONVOCATORIA: Publicación oficial de la convocatoria, en la opción trabaja con nosotros, en el portal web institucional: Red de Salud Valle del Mantaro",
            "bases_url": "https://www.rsvm.gob.pe/intranet/convocatoriadet/685.pdf"
      }
]
  },
  {
    id: "job-sat-sullana-01",
    title: "SAT Sullana: (12) Orientadores, Cajeros, Auxiliares Administrativos, Especialistas",
    slug: "sat-sullana-orientadores-cajeros-auxiliares-especialistas",
    entity_name: "SERVICIO DE ADMINISTRACIÓN TRIBUTARIA DE SULLANA - SAT SULLANA",
    entity_ruc: "20484196144",
    entity_verified: true,
    entity_logo: "/logos/orgs/th-imagen-SERVICIO-DE-ADMINISTRACION-TRIBUTARIA-DE-SULLANA.jpg",
    sector_type: "CAS 1057",
    region: "Piura",
    category: "Administración y Gestión",
    education_level: "Técnico",
    salary_min: 1500,
    salary_max: 3000,
    salary_text: "Entre S/. 1,500 y S/. 3,000 Soles",
    vacancies_count: 12,
    description: "Convocatoria CAS Nº 003-2026 para la contratación de personal en el Servicio de Administración Tributaria de Sullana (SAT Sullana).",
    requirements: [
      "Formación: Secundaria completa, técnicos o bachilleres según el puesto convocado.",
      "Experiencia: Experiencia general y específica de 1 a 2 años en sector público o privado.",
      "Conocimientos en recaudación tributaria, atención al contribuyente o caja."
    ],
    benefits: [
      "Contrato CAS Régimen 1057 con todos los beneficios de ley.",
      "Seguro social de salud ESSALUD y aportes de ley."
    ],
    apply_url: "https://cdn.www.gob.pe/uploads/document/file/10555860/8551023-perfiles-anexo-a-cas-003-2026-sat-sullana.pdf?v=1788386759",
    bases_pdf_url: "https://cdn.www.gob.pe/uploads/document/file/10555860/8551023-perfiles-anexo-a-cas-003-2026-sat-sullana.pdf?v=1788386759",
    official_portal_name: "Gob.pe / SAT Sullana",
    start_date: "2026-08-28",
    end_date: "2026-09-09",
    featured: true,
    views_count: 2800,
    clicks_count: 940,
    status: "Vigente",
    created_at: "2026-08-28T10:00:00Z",
    plazas: [
      {
            "cas_code": "CAS Nº 3",
            "title": "(3) ORIENTADOR/A REGISTRADOR/A PIURA - SULLANA",
            "education": "bachiller y/o título profesional",
            "experience": "(02) años de experiencia laboral en el sector público o privado. - (01) año en puesto o cargos en el sector público o privado. - Especialización: Administración, Economía, Contabilidad, Derecho o afines por la formación",
            "salary": "S/. 1800",
            "bases_url": "https://cdn.www.gob.pe/uploads/document/file/10555860/8551023-perfiles-anexo-a-cas-003-2026-sat-sullana.pdf?v=1788386759"
      },
      {
            "cas_code": "CAS Nº 3",
            "title": "(2) CAJERO/A PIURA - SULLANA",
            "education": "técnica básica",
            "experience": "(01) año de experiencia laboral en el sector público o privado. - (06) meses en puesto o cargos en el sector público o privado. - Especialización: Administración, Economía, Contabilidad o afines por la formación",
            "salary": "S/. 2000",
            "bases_url": "https://cdn.www.gob.pe/uploads/document/file/10555860/8551023-perfiles-anexo-a-cas-003-2026-sat-sullana.pdf?v=1788386759"
      },
      {
            "cas_code": "CAS Nº 3",
            "title": "(1) ESPECIALISTA EN GESTIÓN DEL TALENTO HUMANO PIURA -\n          SULLANA",
            "education": "bachiller y/o título profesional",
            "experience": "(02) años de experiencia laboral en el sector público o privado (01) año en puesto o cargos en el sector público o privado. - Especialización: Derecho, Psicología, Ingeniería Industrial, Administración, Economía o afines por la formación",
            "salary": "S/. 4500",
            "bases_url": "https://cdn.www.gob.pe/uploads/document/file/10555860/8551023-perfiles-anexo-a-cas-003-2026-sat-sullana.pdf?v=1788386759"
      },
      {
            "cas_code": "CAS Nº 3",
            "title": "(1) ESPECIALISTA DE TESORERÍA PIURA - SULLANA",
            "education": "bachiller y/o título profesional",
            "experience": "(02) años de experiencia laboral en el sector público o privado (01) año en puesto o cargos en el sector público o privado. - Especialización: Economía, Contabilidad, Derecho o afines por la formación",
            "salary": "S/. 4500",
            "bases_url": "https://cdn.www.gob.pe/uploads/document/file/10555860/8551023-perfiles-anexo-a-cas-003-2026-sat-sullana.pdf?v=1788386759"
      },
      {
            "cas_code": "CAS Nº 3",
            "title": "(1) AUXILIAR ADMINISTRATIVO PIURA - SULLANA",
            "education": "Secundaria Completa",
            "experience": "(01) años de experiencia laboral en el sector público o privado",
            "salary": "S/. 1500",
            "bases_url": "https://cdn.www.gob.pe/uploads/document/file/10555860/8551023-perfiles-anexo-a-cas-003-2026-sat-sullana.pdf?v=1788386759"
      },
      {
            "cas_code": "CAS Nº 3",
            "title": "(1) AUXILIAR ADMINISTRATIVO PIURA - SULLANA",
            "education": "Estudiante en las carreras de administración, economía, contabilidad, derecho o afines por la formación",
            "experience": "(01) año de experiencia laboral en el sector público o privado",
            "salary": "S/. 2000",
            "bases_url": "https://cdn.www.gob.pe/uploads/document/file/10555860/8551023-perfiles-anexo-a-cas-003-2026-sat-sullana.pdf?v=1788386759"
      },
      {
            "cas_code": "CAS Nº 3",
            "title": "(1) ESPECIALISTA DE PRESUPUESTO PIURA - SULLANA",
            "education": "bachiller y/o título",
            "experience": "(02) años de experiencia laboral en el sector público o privado. - (01) año en puesto o cargos en el sector público o privado. - Especialización: Administración, Economía, Contabilidad o afines por la formación",
            "salary": "S/. 4500",
            "bases_url": "https://cdn.www.gob.pe/uploads/document/file/10555860/8551023-perfiles-anexo-a-cas-003-2026-sat-sullana.pdf?v=1788386759"
      },
      {
            "cas_code": "CAS Nº 3",
            "title": "(1) ESPECIALISTA DE CONTABILIDAD PIURA - SULLANA",
            "education": "bachiller y/o título profesional",
            "experience": "(02) años de experiencia laboral en el sector público o privado (01) año en puesto o cargos en el sector público o privado. - Especialización: carrera de Contabilidad",
            "salary": "S/. 4500",
            "bases_url": "https://cdn.www.gob.pe/uploads/document/file/10555860/8551023-perfiles-anexo-a-cas-003-2026-sat-sullana.pdf?v=1788386759"
      },
      {
            "cas_code": "CAS Nº 3",
            "title": "(1) RESPONSABLE DE ARCHIVO PIURA - SULLANA",
            "education": "bachiller y/o título profesional",
            "experience": "(02) años de experiencia laboral en el sector público o privado. - (01) año en puesto o cargos en el sector público o privado. - Especialización: Administración, Economía, Contabilidad, Derecho o afines por la formación",
            "salary": "S/. 3000 « 1 2 » DETALLES DE POSTULACIÓN PUBLICACIÓN DE LA CONVOCATORIA: Publicación oficial de la convocatoria, en la opción trabaja con nosotros, en el portal web institucional: SAT Sullana",
            "bases_url": "https://cdn.www.gob.pe/uploads/document/file/10555860/8551023-perfiles-anexo-a-cas-003-2026-sat-sullana.pdf?v=1788386759"
      }
]
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
    region: "Lima, Cobertura Nacional",
    category: "Derecho y Asesoría",
    education_level: "Bachiller",
    salary_min: 2364,
    salary_max: 8864,
    salary_text: "Entre S/. 2,364.19 y 8,864.19 Soles",
    vacancies_count: 71,
    description: "Proceso de selección oficial del Ministerio Público - Fiscalía de la Nación para cubrir 71 plazas en despachos fiscales y unidades especializadas a nivel nacional.",
    requirements: [
      "Formación: Bachiller o Título Profesional en Derecho, Ciencias Políticas, Psicología o Contabilidad según la plaza.",
      "Experiencia: Experiencia mínima general y específica acreditada de acuerdo al perfil del cargo.",
      "Conocimientos: Código Procesal Penal, gestión de carpetas fiscales y ofimática."
    ],
    benefits: [
      "Contrato CAS Régimen 1057 con estabilidad institucional.",
      "Capacitación continua en la Escuela del Ministerio Público.",
      "Seguro Vida Ley y ESSALUD."
    ],
    apply_url: "https://archivos.mpfn.gob.pe/convoca/anexo-archivo/i/29159",
    bases_pdf_url: "https://archivos.mpfn.gob.pe/convoca/anexo-archivo/i/29159",
    cuadro_plazas_url: "https://archivos.mpfn.gob.pe/convoca/anexo-archivo/i/29160",
    cronograma_url: "https://archivos.mpfn.gob.pe/convoca/anexo-archivo/i/29157",
    anexos_url: "https://archivos.mpfn.gob.pe/convoca/anexo-archivo/i/29161",
    official_portal_name: "Ministerio Público - Sistema de Convocatorias CAS",
    start_date: "2026-08-27",
    end_date: "2026-09-08",
    featured: true,
    views_count: 4120,
    clicks_count: 1480,
    status: "Vigente",
    created_at: "2026-08-27T14:00:00Z",
    plazas: [
      {
            "cas_code": "CAS Nº 103",
            "title": "(7) ASISTENTE EN FUNCIÓN FISCAL LIMA - LIMA",
            "education": "bachiller universitario en Derecho",
            "experience": "General",
            "salary": "S/. 3564.19",
            "bases_url": "https://archivos.mpfn.gob.pe/convoca/anexo-archivo/i/29159"
      },
      {
            "cas_code": "CAS Nº 103",
            "title": "(5) ASISTENTE EN FUNCIÓN FISCAL LIMA - LIMA",
            "education": "grado de bachiller universitario en Derecho",
            "experience": "02 años de experiencia laboral general",
            "salary": "S/. 3564.19",
            "bases_url": "https://archivos.mpfn.gob.pe/convoca/anexo-archivo/i/29159"
      },
      {
            "cas_code": "CAS Nº 103",
            "title": "(3) ASISTENTE ADMINISTRATIVO LIMA - LIMA",
            "education": "estudiante universitario a partir del 4° año (8 ciclo) en las carreras de Derecho",
            "experience": "1 año de experiencia laboral general",
            "salary": "S/. 4100",
            "bases_url": "https://archivos.mpfn.gob.pe/convoca/anexo-archivo/i/29159"
      },
      {
            "cas_code": "CAS Nº 103",
            "title": "(2) ASISTENTE ADMINISTRATIVO LIMA - LIMA",
            "education": "estudiante universitario a partir del 4° año (8 ciclo) en las carreras de Derecho",
            "experience": "1 año de experiencia laboral general",
            "salary": "S/. 3164.19",
            "bases_url": "https://archivos.mpfn.gob.pe/convoca/anexo-archivo/i/29159"
      },
      {
            "cas_code": "CAS Nº 103",
            "title": "(2) ASISTENTE ADMINISTRATIVO LIMA - LIMA",
            "education": "estudiante universitario a partir del 4° año (8 ciclo) en las carreras de Derecho",
            "experience": "1 año de experiencia laboral general",
            "salary": "S/. 3164.19",
            "bases_url": "https://archivos.mpfn.gob.pe/convoca/anexo-archivo/i/29159"
      },
      {
            "cas_code": "CAS Nº 103",
            "title": "(2) ASISTENTE EN FUNCIÓN FISCAL LIMA - LIMA",
            "education": "bachiller universitario en las carreras de Derecho",
            "experience": "2 años de experiencia laboral general",
            "salary": "S/. 3564.19",
            "bases_url": "https://archivos.mpfn.gob.pe/convoca/anexo-archivo/i/29159"
      },
      {
            "cas_code": "CAS Nº 103",
            "title": "(2) PERITO",
            "education": "titulado universitario en las carreras de Contabilidad. - Colegiatura y habilitación vigente",
            "experience": "6 años de experiencia laboral general",
            "salary": "S/. 8250",
            "bases_url": "https://archivos.mpfn.gob.pe/convoca/anexo-archivo/i/29159"
      },
      {
            "cas_code": "CAS Nº 103",
            "title": "(2) PROFESOR LIMA - LIMA",
            "education": "titulado universitario en las carreras de Educación Inicial. - Titulado pedagogico en las carreras de Educación Inicial",
            "experience": "2 años de experiencia laboral general",
            "salary": "S/. 3400.6",
            "bases_url": "https://archivos.mpfn.gob.pe/convoca/anexo-archivo/i/29159"
      },
      {
            "cas_code": "CAS Nº 103",
            "title": "(1) ABOGADO LIMA - LIMA",
            "education": "titulado universitario en las carreras de Derecho. - Colegiatura y habilitación vigente",
            "experience": "2 años de experiencia laboral general",
            "salary": "S/. 6364.19",
            "bases_url": "https://archivos.mpfn.gob.pe/convoca/anexo-archivo/i/29159"
      },
      {
            "cas_code": "CAS Nº 103",
            "title": "(1) ABOGADO LIMA - LIMA",
            "education": "titulado universitario en las carreras de Derecho. - Colegiatura y habilitación vigente",
            "experience": "4 años de experiencia laboral general",
            "salary": "S/. 6100",
            "bases_url": "https://archivos.mpfn.gob.pe/convoca/anexo-archivo/i/29159"
      },
      {
            "cas_code": "CAS Nº 103",
            "title": "(1) ABOGADO LIMA - LIMA",
            "education": "titulado universitario en la carrera de Derecho",
            "experience": "General",
            "salary": "S/. 6364.19",
            "bases_url": "https://archivos.mpfn.gob.pe/convoca/anexo-archivo/i/29159"
      },
      {
            "cas_code": "CAS Nº 103",
            "title": "(1) ANALISTA LIMA - LIMA",
            "education": "titulado universitario en las carreras de Ingeniería Electrónica o Ingeniería de Sistemas o Informática",
            "experience": "3 años experiencia laboral general",
            "salary": "S/. 6250",
            "bases_url": "https://archivos.mpfn.gob.pe/convoca/anexo-archivo/i/29159"
      },
      {
            "cas_code": "CAS Nº 103",
            "title": "(1) ANALISTA LIMA - LIMA",
            "education": "titulado universitario en las carreras de Estadística, ingeniería, Economía, matemática, ciencia de datos o ciencia de la Computación egresado maestría en las carreras de Informática, ciencia de datos, Estadística, analítica de datos, Economía, minería de datos,matemática o inteligencia artificial",
            "experience": "8 años experiencia laboral general",
            "salary": "S/. 8364.19",
            "bases_url": "https://archivos.mpfn.gob.pe/convoca/anexo-archivo/i/29159"
      },
      {
            "cas_code": "CAS Nº 103",
            "title": "(1) ANALISTA LIMA - LIMA",
            "education": "titulado universitario en las carreras de Administración o Derecho",
            "experience": "2 años experiencia laboral general",
            "salary": "S/. 4364.19",
            "bases_url": "https://archivos.mpfn.gob.pe/convoca/anexo-archivo/i/29159"
      },
      {
            "cas_code": "CAS Nº 103",
            "title": "(1) ANALISTA LIMA - LIMA",
            "education": "titulado universitario en las carreras de Derecho",
            "experience": "General",
            "salary": "S/. 4364.19",
            "bases_url": "https://archivos.mpfn.gob.pe/convoca/anexo-archivo/i/29159"
      },
      {
            "cas_code": "CAS Nº 103",
            "title": "(1) ANALISTA LIMA - LIMA",
            "education": "titulado universitario en las carreras de lingüística o Física o Ingeniería Electrónica o Ingeniería de Telecomunicaciones",
            "experience": "2 años de experiencia laboral general",
            "salary": "S/. 4364.19",
            "bases_url": "https://archivos.mpfn.gob.pe/convoca/anexo-archivo/i/29159"
      },
      {
            "cas_code": "CAS Nº 103",
            "title": "(1) ANALISTA LIMA - LIMA",
            "education": "titulado universitario en las carreras de Ciencias de la Comunicación",
            "experience": "2 años experiencia laboral general",
            "salary": "S/. 4364.19",
            "bases_url": "https://archivos.mpfn.gob.pe/convoca/anexo-archivo/i/29159"
      },
      {
            "cas_code": "CAS Nº 103",
            "title": "(1) ASISTENTE ADMINISTRATIVO LIMA - LIMA",
            "education": "estudiante universitario a partir del 4° año (8 ciclo) en las carreras de linguistica o literatura",
            "experience": "1 año de experiencia laboral general",
            "salary": "S/. 3164.19",
            "bases_url": "https://archivos.mpfn.gob.pe/convoca/anexo-archivo/i/29159"
      },
      {
            "cas_code": "CAS Nº 103",
            "title": "(1) ASISTENTE ADMINISTRATIVO LIMA - LIMA",
            "education": "estudiante universitario a partir del 4° año (8 ciclo) en las carreras de Derecho",
            "experience": "1 año de experiencia laboral general",
            "salary": "S/. 3164.19",
            "bases_url": "https://archivos.mpfn.gob.pe/convoca/anexo-archivo/i/29159"
      },
      {
            "cas_code": "CAS Nº 103",
            "title": "(1) ASISTENTE ADMINISTRATIVO LIMA - LIMA",
            "education": "estudiante universitario a partir del 4° año (8 ciclo) en las carreras de Derecho",
            "experience": "1 año de experiencia laboral general",
            "salary": "S/. 3164.19",
            "bases_url": "https://archivos.mpfn.gob.pe/convoca/anexo-archivo/i/29159"
      },
      {
            "cas_code": "CAS Nº 103",
            "title": "(1) ASISTENTE ADMINISTRATIVO LIMA - LIMA",
            "education": "estudiante universitario a partir del 4° año (8 ciclo) en las carreras de de Derecho o Administración de Empresas o Contabilidad o Economía",
            "experience": "01 año de experiencia laboral general",
            "salary": "S/. 3164.19",
            "bases_url": "https://archivos.mpfn.gob.pe/convoca/anexo-archivo/i/29159"
      },
      {
            "cas_code": "CAS Nº 103",
            "title": "(1) ASISTENTE ADMINISTRATIVO (CONDUCTOR) LIMA - LIMA",
            "education": "secundaria completa",
            "experience": "2 años de experiencia laboral general",
            "salary": "S/. 2364.19",
            "bases_url": "https://archivos.mpfn.gob.pe/convoca/anexo-archivo/i/29159"
      },
      {
            "cas_code": "CAS Nº 103",
            "title": "(1) ASISTENTE ADMINISTRATIVO (NOTIFICADOR) LIMA - LIMA",
            "education": "secundaria completa",
            "experience": "1 año de experiencia laboral general",
            "salary": "S/. 2364.19",
            "bases_url": "https://archivos.mpfn.gob.pe/convoca/anexo-archivo/i/29159"
      },
      {
            "cas_code": "CAS Nº 103",
            "title": "(1) ASISTENTE EN FUNCIÓN FISCAL LIMA - LIMA",
            "education": "grado de bachiller universitario en Derecho",
            "experience": "02 años de experiencia laboral general",
            "salary": "S/. 3564.19",
            "bases_url": "https://archivos.mpfn.gob.pe/convoca/anexo-archivo/i/29159"
      },
      {
            "cas_code": "CAS Nº 103",
            "title": "(1) ASISTENTE EN FUNCIÓN FISCAL LIMA - LIMA",
            "education": "grado de bachiller universitario en Derecho",
            "experience": "02 años de experiencia laboral general",
            "salary": "S/. 3564.19",
            "bases_url": "https://archivos.mpfn.gob.pe/convoca/anexo-archivo/i/29159"
      },
      {
            "cas_code": "CAS Nº 103",
            "title": "(1) ASISTENTE EN FUNCIÓN FISCAL LIMA - LIMA",
            "education": "grado de bachiller universitario en Derecho",
            "experience": "02 años de experiencia laboral general",
            "salary": "S/. 3564.19",
            "bases_url": "https://archivos.mpfn.gob.pe/convoca/anexo-archivo/i/29159"
      },
      {
            "cas_code": "CAS Nº 103",
            "title": "(1) ASISTENTE EN FUNCIÓN FISCAL LIMA - LIMA",
            "education": "grado de bachiller universitario en Derecho",
            "experience": "02 años de experiencia laboral general",
            "salary": "S/. 4871",
            "bases_url": "https://archivos.mpfn.gob.pe/convoca/anexo-archivo/i/29159"
      },
      {
            "cas_code": "CAS Nº 103",
            "title": "(1) ASISTENTE EN FUNCIÓN FISCAL LIMA - LIMA",
            "education": "constancia de bachiller universitario en Derecho",
            "experience": "General",
            "salary": "S/. 3564.19",
            "bases_url": "https://archivos.mpfn.gob.pe/convoca/anexo-archivo/i/29159"
      },
      {
            "cas_code": "CAS Nº 103",
            "title": "(1) ASISTENTE EN FUNCIÓN FISCAL LIMA - LIMA",
            "education": "bachiller universitario en Derecho",
            "experience": "General",
            "salary": "S/. 3564.19",
            "bases_url": "https://archivos.mpfn.gob.pe/convoca/anexo-archivo/i/29159"
      },
      {
            "cas_code": "CAS Nº 103",
            "title": "(1) ASISTENTE EN FUNCIÓN FISCAL LIMA - LIMA",
            "education": "bachiller universitario en Derecho",
            "experience": "General",
            "salary": "S/. 3564.19",
            "bases_url": "https://archivos.mpfn.gob.pe/convoca/anexo-archivo/i/29159"
      },
      {
            "cas_code": "CAS Nº 103",
            "title": "(1) ASISTENTE EN FUNCIÓN FISCAL LIMA - LIMA",
            "education": "bachiller universitario en las carreras de Derecho",
            "experience": "2 años experiencia laboral general",
            "salary": "S/. 3564.19",
            "bases_url": "https://archivos.mpfn.gob.pe/convoca/anexo-archivo/i/29159"
      },
      {
            "cas_code": "CAS Nº 103",
            "title": "(1) ASISTENTE EN FUNCIÓN FISCAL LIMA - LIMA",
            "education": "bachiller universitario en las carreras de Derecho",
            "experience": "2 años de experiencia laboral general",
            "salary": "S/. 3164.19",
            "bases_url": "https://archivos.mpfn.gob.pe/convoca/anexo-archivo/i/29159"
      },
      {
            "cas_code": "CAS Nº 103",
            "title": "(1) ASISTENTE EN FUNCIÓN FISCAL LIMA - LIMA",
            "education": "grado de bachiller universitario en Derecho",
            "experience": "02 años de experiencia laboral general",
            "salary": "S/. 3564.19",
            "bases_url": "https://archivos.mpfn.gob.pe/convoca/anexo-archivo/i/29159"
      },
      {
            "cas_code": "CAS Nº 103",
            "title": "(1) ASISTENTE!ADMINISTRATIVO LIMA - LIMA",
            "education": "estudiante universitario a partir del 4to año (8vo ciclo) en la carrera profesional de Ingeniería de Sistemas o Ingeniería Informática",
            "experience": "General",
            "salary": "S/. 3164.19",
            "bases_url": "https://archivos.mpfn.gob.pe/convoca/anexo-archivo/i/29159"
      },
      {
            "cas_code": "CAS Nº 103",
            "title": "(1) AUXILIAR ADMINISTRATIVO LIMA - LIMA",
            "education": "secundaria completa",
            "experience": "General",
            "salary": "S/. 2801.19",
            "bases_url": "https://archivos.mpfn.gob.pe/convoca/anexo-archivo/i/29159"
      },
      {
            "cas_code": "CAS Nº 103",
            "title": "(1) ESPECIALISTA ADMINISTRATIVO II LIMA - LIMA",
            "education": "grado de bachiller universitario en las carreras de Ingeniería de Sistemas o Ingeniería de Software o Ingeniería Informática o ingeniería de Computación",
            "experience": "02 años de experiencia laboral general",
            "salary": "S/. 5364.19",
            "bases_url": "https://archivos.mpfn.gob.pe/convoca/anexo-archivo/i/29159"
      },
      {
            "cas_code": "CAS Nº 103",
            "title": "(1) ESPECIALISTA ADMINISTRATIVO LIMA - LIMA",
            "education": "título profesional universitario de Abogado. - Colegiatura y habilitación profesional vigente",
            "experience": "02 años de experiencia laboral general",
            "salary": "S/. 5364.19",
            "bases_url": "https://archivos.mpfn.gob.pe/convoca/anexo-archivo/i/29159"
      },
      {
            "cas_code": "CAS Nº 103",
            "title": "(1) ESPECIALISTA ADMINISTRATIVO LIMA - LIMA",
            "education": "título profesional universitario de Abogado",
            "experience": "04 años de experiencia laboral general",
            "salary": "S/. 6100",
            "bases_url": "https://archivos.mpfn.gob.pe/convoca/anexo-archivo/i/29159"
      },
      {
            "cas_code": "CAS Nº 103",
            "title": "(1) ESPECIALISTA ADMINISTRATIVO LIMA - LIMA",
            "education": "título profesional universitario de Arquitectura o Ingeniería Civil",
            "experience": "04 años de experiencia laboral general",
            "salary": "S/. 6100",
            "bases_url": "https://archivos.mpfn.gob.pe/convoca/anexo-archivo/i/29159"
      },
      {
            "cas_code": "CAS Nº 103",
            "title": "(1) ESPECIALISTA ADMINISTRATIVO LIMA - LIMA",
            "education": "titulado universitario en las carreras de Administración, Ingeniería Industrial, Contabilidad, Economía o Derecho",
            "experience": "4 años experiencia laboral general",
            "salary": "S/. 6100",
            "bases_url": "https://archivos.mpfn.gob.pe/convoca/anexo-archivo/i/29159"
      },
      {
            "cas_code": "CAS Nº 103",
            "title": "(1) ESPECIALISTA ADMINISTRATIVO LIMA - LIMA",
            "education": "bachiller universitario en la carrera de Ingeniería Estadística o Ingeniería de Sistemas o Ingeniería Informática o Ingeniería Industrial o Economía",
            "experience": "General",
            "salary": "S/. 3564.19",
            "bases_url": "https://archivos.mpfn.gob.pe/convoca/anexo-archivo/i/29159"
      },
      {
            "cas_code": "CAS Nº 103",
            "title": "(1) INGENIERO CIVIL ESPECIALISTA EN ESTRUCTURAS LIMA -\n          LIMA",
            "education": "título profesional universitario en la carrera de Ingeniería Civil. - Colegiatura y habilitación profesional vigente",
            "experience": "06 años experiencia laboral general",
            "salary": "S/. 8864.19",
            "bases_url": "https://archivos.mpfn.gob.pe/convoca/anexo-archivo/i/29159"
      },
      {
            "cas_code": "CAS Nº 103",
            "title": "(1) MÉDICO OCUPACIONAL LIMA - LIMA",
            "education": "título profesional universitario de médico cirujano. - Colegiatura y habilitación vigente. - Egresado de maestría en las carreras de salud ocupacional y ambiental o maestría en salud ocupacional o maestría en Medicina ocupacional y del ambiente o afines. - Contar con resolución emitida por el ministerio de salud, que acredite haber realizado serums",
            "experience": "06 años de experiencia laboral general",
            "salary": "S/. 8364.19",
            "bases_url": "https://archivos.mpfn.gob.pe/convoca/anexo-archivo/i/29159"
      },
      {
            "cas_code": "CAS Nº 103",
            "title": "(1) OPERADOR ADMINISTRATIVO LIMA - LIMA",
            "education": "estudiante universitario a partir del 4° año (8° ciclo) en la carrera profesional de Ingeniería de Sistemas o Ingeniería Informática. - Estudios técnicos concluidos (03 años) en la carrera de Computación e Informática",
            "experience": "General",
            "salary": "S/. 2564.19",
            "bases_url": "https://archivos.mpfn.gob.pe/convoca/anexo-archivo/i/29159"
      },
      {
            "cas_code": "CAS Nº 103",
            "title": "(1) OPERADOR ADMINISTRATIVO LIMA - LIMA",
            "education": "estudiante universitario a partir del 3° año (6 ciclo) en las carreras de Ingeniería de Sistemas o Ingeniería Informática o Ingeniería de Sistemas e Informática o Administración; o técnico concluido (3) años en las carreras de Computación e Informática o Secretariado o Administración",
            "experience": "01 año de experiencia laboral general",
            "salary": "S/. 3364.19",
            "bases_url": "https://archivos.mpfn.gob.pe/convoca/anexo-archivo/i/29159"
      },
      {
            "cas_code": "CAS Nº 103",
            "title": "(1) OPERADOR ADMINISTRATIVO LIMA - LIMA",
            "education": "estudiante universitario a partir del 3° año (6 ciclo) en las carreras de Ingeniería de Sistemas o Ingeniería Informática o Ingeniería de Sistemas e Informática. - Técnico concluido (3) años en las carreras de redes o Comunicaciones o en Computación e Informática",
            "experience": "1 año de experiencia laboral general",
            "salary": "S/. 2564.19",
            "bases_url": "https://archivos.mpfn.gob.pe/convoca/anexo-archivo/i/29159"
      },
      {
            "cas_code": "CAS Nº 103",
            "title": "(1) PERITO CONTABLE LIMA - LIMA",
            "education": "titulado universitario en las carreras de Contabilidad. - Colegiatura y habilitación vigente",
            "experience": "4 años de experiencia laboral general",
            "salary": "S/. 6300",
            "bases_url": "https://archivos.mpfn.gob.pe/convoca/anexo-archivo/i/29159"
      },
      {
            "cas_code": "CAS Nº 103",
            "title": "(1) PERITO LIMA - LIMA",
            "education": "título profesional universitario en la carrera de Ingeniería Electrónica o Ingeniería de Sistemas o Ingeniería Informática",
            "experience": "General",
            "salary": "S/. 8250",
            "bases_url": "https://archivos.mpfn.gob.pe/convoca/anexo-archivo/i/29159"
      },
      {
            "cas_code": "CAS Nº 103",
            "title": "(1) PERITO LIMA - LIMA",
            "education": "título profesional universitario de Ingeniería Civil. - Colegiatura y habilitación vigente",
            "experience": "06 años experiencia laboral general",
            "salary": "S/. 8250",
            "bases_url": "https://archivos.mpfn.gob.pe/convoca/anexo-archivo/i/29159"
      },
      {
            "cas_code": "CAS Nº 103",
            "title": "(1) PERITO LIMA - LIMA",
            "education": "título profesional universitario de Contabilidad. - Colegiatura y habilitación profesional vigente",
            "experience": "04 años de experiencia laboral general",
            "salary": "S/. 6364.19",
            "bases_url": "https://archivos.mpfn.gob.pe/convoca/anexo-archivo/i/29159"
      },
      {
            "cas_code": "CAS Nº 103",
            "title": "(1) PERITO LIMA - LIMA",
            "education": "titulado universitario en las carreras de Ingeniería Geográfica",
            "experience": "4 años experiencia laboral general",
            "salary": "S/. 6300",
            "bases_url": "https://archivos.mpfn.gob.pe/convoca/anexo-archivo/i/29159"
      },
      {
            "cas_code": "CAS Nº 103",
            "title": "(1) PERITO LIMA - LIMA",
            "education": "titulado universitario en las carreras de Ingeniería Electrónica o Ingeniería de Sistemas o Ingeniería Informática",
            "experience": "2 años experiencia laboral general",
            "salary": "S/. 6300",
            "bases_url": "https://archivos.mpfn.gob.pe/convoca/anexo-archivo/i/29159"
      },
      {
            "cas_code": "CAS Nº 103",
            "title": "(1) PERITO LIMA - LIMA",
            "education": "titulado universitario en las carreras de Economía o Ingeniería Económica. - Colegiatura y habilitación vigente",
            "experience": "6 años de experiencia laboral general",
            "salary": "S/. 7864.19",
            "bases_url": "https://archivos.mpfn.gob.pe/convoca/anexo-archivo/i/29159"
      },
      {
            "cas_code": "CAS Nº 103",
            "title": "(1) PERITO LIMA - LIMA",
            "education": "titulado universitario en las carreras de Contabilidad",
            "experience": "4 años experiencia laboral general",
            "salary": "S/. 6300 « 1 2 3 4 5 6 » DETALLES DE POSTULACIÓN PUBLICACIÓN DE LA CONVOCATORIA: Publicación oficial de la convocatoria, en la opción trabaja con nosotros, en el portal web institucional: Ministerio Publico",
            "bases_url": "https://archivos.mpfn.gob.pe/convoca/anexo-archivo/i/29159"
      }
]
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
    apply_url: "https://www.gob.pe/institucion/reniec/informes-publicaciones?tipo_publicacion=convocatoria-de-trabajo",
    bases_pdf_url: "https://www.gob.pe/institucion/reniec/informes-publicaciones?tipo_publicacion=convocatoria-de-trabajo",
    official_portal_name: "Gob.pe Convocatorias RENIEC",
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
    apply_url: "https://uneteservicios.inei.gob.pe/public/cnv-curriculum/login/101",
    bases_pdf_url: "https://uneteservicios.inei.gob.pe/public/detalle/101",
    anexos_url: "https://drive.google.com/file/d/1S-dhcwGMv0L31C2nqsrTNEWNl82lS0CY/view?usp=drive_link",
    guia_postulante_url: "https://drive.google.com/file/d/1cCKfj7YAgRru9GvUZK2k2rx_2lTj7_T_/view?usp=drive_link",
    fuente_url: "https://www.portaltrabajos.pe/2026/08/inei-eda-2026-operadores-tecnologicos.html",
    official_portal_name: "INEI Únete Servicios - Portal Oficial",
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
    apply_url: "https://www.gob.pe/institucion/jne/informes-publicaciones?tipo_publicacion=convocatoria-de-trabajo",
    bases_pdf_url: "https://www.gob.pe/institucion/jne/informes-publicaciones?tipo_publicacion=convocatoria-de-trabajo",
    official_portal_name: "Gob.pe Convocatorias JNE",
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
    apply_url: "https://webapp.mdsmp.gob.pe/convocatorias/convocatoriacas",
    bases_pdf_url: "https://webapp.mdsmp.gob.pe/convocatoriabackend/public/convocatoria/CAS%20N%C2%B007-2025.pdf",
    official_portal_name: "MDSMP Convocatorias CAS",
    anexos_url: "https://webapp.mdsmp.gob.pe/convocatoriabackend/public/ficha_convocatoria_cas.pdf",
    resultados_url: "https://webapp.mdsmp.gob.pe/convocatorias/convocatoriacas",
    fuente_url: "https://www.portaltrabajos.pe/2025/04/municipalidad-de-san-martin-de-porres-convocatoria-2025-serenos-operadores.html",
    plazas: [
      {
        cas_code: "CAS Nº 007-1",
        title: "(50) SERENOS A PIE - SEGURIDAD CIUDADANA",
        education: "Secundaria completa debidamente acreditada.",
        experience: "Experiencia mínima de seis (06) meses en labores de serenazgo, seguridad o vigilancia en sector público o privado.",
        salary: "S/. 2,300 Soles",
        bases_url: "https://webapp.mdsmp.gob.pe/convocatoriabackend/public/convocatoria/CAS%20N%C2%B007-2025.pdf"
      },
      {
        cas_code: "CAS Nº 007-2",
        title: "(40) SERENOS CHOFERES DE PATRULLA Y MOTORIZADOS",
        education: "Secundaria completa. Licencia de conducir A-I o A-IIb vigente.",
        experience: "Experiencia mínima de 1 año como conductor o chofer de patrulla.",
        salary: "S/. 2,600 Soles",
        bases_url: "https://webapp.mdsmp.gob.pe/convocatoriabackend/public/convocatoria/CAS%20N%C2%B007-2025.pdf"
      },
      {
        cas_code: "CAS Nº 007-3",
        title: "(30) OPERADORES DE CÁMARA Y VIDEOVIGILANCIA",
        education: "Técnico en computación, informática, telecomunicaciones o afines (egresado o titulado).",
        experience: "Experiencia de 1 año en monitoreo de centrales de cámaras o videovigilancia.",
        salary: "S/. 2,800 Soles",
        bases_url: "https://webapp.mdsmp.gob.pe/convocatoriabackend/public/convocatoria/CAS%20N%C2%B007-2025.pdf"
      },
      {
        cas_code: "CAS Nº 007-4",
        title: "(15) SUPERVISORES DE SEGURIDAD CIUDADANA",
        education: "Estudios universitarios o técnicos concluidos en Administración, Derecho o afines.",
        experience: "Experiencia de 2 años en supervisión operativa de personal de seguridad.",
        salary: "S/. 3,500 Soles",
        bases_url: "https://webapp.mdsmp.gob.pe/convocatoriabackend/public/convocatoria/CAS%20N%C2%B007-2025.pdf"
      },
      {
        cas_code: "CAS Nº 007-5",
        title: "(7) COORDINADORES DE OPERACIONES Y GESTIÓN DE RIESGO",
        education: "Bachiller o Titulado universitario en Ingeniería, Administración o Derecho.",
        experience: "Experiencia general de 3 años y 1 año en coordinación de seguridad ciudadana.",
        salary: "S/. 4,000 Soles",
        bases_url: "https://webapp.mdsmp.gob.pe/convocatoriabackend/public/convocatoria/CAS%20N%C2%B007-2025.pdf"
      }
    ],
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
    apply_url: "https://www.gob.pe/institucion/mef/informes-publicaciones?tipo_publicacion=convocatoria-de-trabajo",
    bases_pdf_url: "https://www.gob.pe/institucion/mef/informes-publicaciones?tipo_publicacion=convocatoria-de-trabajo",
    official_portal_name: "Gob.pe Convocatorias de Trabajo MEF",
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
    apply_url: "https://www.gob.pe/institucion/osiptel/informes-publicaciones?tipo_publicacion=convocatoria-de-trabajo",
    bases_pdf_url: "https://www.gob.pe/institucion/osiptel/informes-publicaciones?tipo_publicacion=convocatoria-de-trabajo",
    official_portal_name: "Gob.pe Convocatorias de Trabajo OSIPTEL",
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
    apply_url: "https://pe.computrabajo.com/empresas/ofertas-de-trabajo-de-alicorp-53909CA8F142D305",
    bases_pdf_url: "https://pe.computrabajo.com/empresas/ofertas-de-trabajo-de-alicorp-53909CA8F142D305",
    official_portal_name: "Alicorp Ofertas de Empleo",
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
    apply_url: "https://www.gob.pe/institucion/regionarequipa/informes-publicaciones?tipo_publicacion=convocatoria-de-trabajo",
    bases_pdf_url: "https://www.gob.pe/institucion/regionarequipa/informes-publicaciones?tipo_publicacion=convocatoria-de-trabajo",
    official_portal_name: "Gobierno Regional de Arequipa Convocatorias",
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
import { PORTAL_JOBS_DATA } from './portalJobsData';

// In-memory overrides para desarrollo local, pruebas unitarias y fallback de alta disponibilidad
const LOCAL_DYNAMIC_JOBS: Map<string, JobPosting> = new Map();

export async function getJobPostings(): Promise<JobPosting[]> {
  const jobsMap = new Map<string, JobPosting>();

  // 1. Cargar catálogo verificado de respaldo y convocatorias prioritarias (Juntos, PAIS, ONPE, SUNAT...)
  INITIAL_JOBS.forEach(j => jobsMap.set(j.slug, j));

  // 2. Cargar convocatorias ricas en plazas oficiales de PortalTrabajos (100 convocatorias con 692 plazas!)
  PORTAL_JOBS_DATA.forEach(j => {
    if (!jobsMap.has(j.slug)) {
      jobsMap.set(j.slug, j);
    }
  });

  // 3. Cargar modificaciones y convocatorias añadidas localmente en memoria
  LOCAL_DYNAMIC_JOBS.forEach(j => jobsMap.set(j.slug, j));

  // 4. Cargar ingesta en vivo del feed oficial
  try {
    const liveFeed = await scrapeLiveConvocatoriasFeed();
    if (liveFeed && liveFeed.length > 0) {
      liveFeed.forEach(j => {
        if (!jobsMap.has(j.slug)) {
          jobsMap.set(j.slug, j);
        }
      });
    }
  } catch (err) {
    console.warn('Live feed fallback to static catalog:', err);
  }

  // 5. Intentar fusionar con Supabase en tiempo real
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
  const normSlug = slug.toLowerCase().trim();

  // 1. Búsqueda rápida directa en memoria
  const localDynamic = Array.from(LOCAL_DYNAMIC_JOBS.values()).find(j => j && j.slug === normSlug);
  if (localDynamic) return localDynamic;

  const portalJob = PORTAL_JOBS_DATA.find(j => j && j.slug === normSlug);
  if (portalJob) return portalJob;

  const initialJob = INITIAL_JOBS.find(j => j && j.slug === normSlug);
  if (initialJob) return initialJob;

  // 2. Búsqueda completa en catálogo unificado (incluyendo feed live)
  const allJobs = await getJobPostings();
  const found = allJobs.find(j => j && j.slug === normSlug);
  if (found) return found;

  // 3. Fallback inteligente por coincidencia parcial de slug o URL de fuente original
  const fuzzy = allJobs.find(j => j && j.slug && (j.slug.includes(normSlug) || normSlug.includes(j.slug)));
  if (fuzzy) return fuzzy;

  const byFuente = allJobs.find(j => j && j.fuente_url && j.fuente_url.toLowerCase().includes(normSlug));
  if (byFuente) return byFuente;

  // 4. Fallback semántico por tokens y palabras clave (p.ej. slugs cortos de PortalTrabajos)
  const searchWords = normSlug.split('-').filter(w => w.length >= 4 && !/^\d+$/.test(w));
  if (searchWords.length > 0) {
    let bestMatch: JobPosting | null = null;
    let maxMatches = 0;
    for (const j of allJobs) {
      if (!j || !j.slug) continue;
      const jWords = new Set(j.slug.split('-'));
      const matches = searchWords.filter(w => jWords.has(w)).length;
      if (matches >= Math.min(2, searchWords.length) && matches > maxMatches) {
        maxMatches = matches;
        bestMatch = j;
      }
    }
    if (bestMatch) return bestMatch;
  }

  return null;
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

