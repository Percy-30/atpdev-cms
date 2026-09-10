import { CvData, CvTemplateMeta } from './types';
import { SAMPLE_AVATAR_BASE64 } from './sampleAvatarBase64';

export const SAMPLE_CV_DATA: CvData = {
  personal: {
    fullName: 'JUAN ALBERTO PÉREZ RODRÍGUEZ',
    headline: 'Ingeniero de Sistemas | Especialista en Transformación Digital y Gestión Pública',
    dni: '45678912',
    ruc: '10456789123',
    phone: '+51 987 654 321',
    email: 'juan.perez.rodriguez@email.com',
    address: 'Av. Javier Prado Este 2450, San Borja',
    city: 'Lima, Perú',
    colegiatoria: 'CIP N° 245890 (Colegiado y Habilitado)',
    linkedin: 'linkedin.com/in/juanperez-ti',
    website: 'github.com/juanperez-dev',
    photoUrl: SAMPLE_AVATAR_BASE64,
  },
  profileSummary:
    'Ingeniero de Sistemas colegiado con más de 7 años de experiencia liderando proyectos de modernización tecnológica e interoperabilidad en el sector público y privado. Especializado en gestión de contrataciones del Estado (Ley N° 30225), administración de plataformas SEACE/SIAF, desarrollo de sistemas cloud y optimización de procesos bajo directivas de SERVIR y la Secretaría de Gobierno y Transformación Digital (SGTD). Capacidad demostrada para dirigir equipos multidisciplinarios orientados a resultados y servicio al ciudadano.',
  education: [
    {
      id: 'edu-1',
      degree: 'TITULADO Y COLEGIADO',
      carrera: 'Ingeniería de Sistemas e Informática',
      institution: 'Universidad Nacional Mayor de San Marcos (UNMSM)',
      year: '2018 - 2022',
      status: 'Titulado con Tesis Sobresaliente',
    },
    {
      id: 'edu-2',
      degree: 'MAESTRÍA',
      carrera: 'Gestión Pública y Políticas de Estado',
      institution: 'Escuela Nacional de Administración Pública (ENAP - SERVIR)',
      year: '2023 - 2024',
      status: 'Egresado',
    },
  ],
  experiences: [
    {
      id: 'exp-1',
      entity: 'Ministerio de Educación (MINEDU)',
      role: 'Coordinador de Infraestructura y Sistemas de Información (CAS)',
      period: '01/2023 - 12/2025 (24 Meses)',
      months: 24,
      type: 'Específica',
      functions: [
        'Liderazgo en la modernización del sistema nacional de monitoreo educativo atendiendo a más de 12,000 instituciones educativas.',
        'Elaboración técnica de Términos de Referencia (TDR) y requerimientos de contrataciones de TI bajo la Ley N° 30225.',
        'Reducción del tiempo de respuesta en mesa de partes digital en un 42% mediante arquitectura de servicios cloud.',
      ],
    },
    {
      id: 'exp-2',
      entity: 'Presidencia del Consejo de Ministros (PCM)',
      role: 'Especialista de Sistemas de Interoperabilidad (CAS)',
      period: '03/2021 - 12/2022 (22 Meses)',
      months: 22,
      type: 'Específica',
      functions: [
        'Integración de servicios web REST/SOAP en la Plataforma de Interoperabilidad del Estado (PIDE) con RENIEC, SUNAT y Banco de la Nación.',
        'Supervisión y cumplimiento del Modelo de Gestión Documental (MGD) y firma digital certificada con RENIEC.',
      ],
    },
    {
      id: 'exp-3',
      entity: 'Tech Solutions Perú S.A.C.',
      role: 'Analista Desarrollador Full-Stack & Base de Datos',
      period: '01/2019 - 02/2021 (26 Meses)',
      months: 26,
      type: 'General',
      functions: [
        'Desarrollo de módulos ERP para facturación electrónica homologada ante SUNAT.',
        'Optimización y administración de bases de datos PostgreSQL y SQL Server de alta concurrencia.',
      ],
    },
  ],
  courses: [
    {
      id: 'cur-1',
      title: 'Diplomado de Especialización en Contrataciones del Estado y SEACE',
      inst: 'Organismo Supervisor de las Contrataciones del Estado (OSCE)',
      hours: '160 horas lectivas',
      year: '2024',
    },
    {
      id: 'cur-2',
      title: 'Programa de Gestión Pública por Resultados y Presupuesto por Resultados (PpR)',
      inst: 'Escuela Nacional de Administración Pública (ENAP - SERVIR)',
      hours: '120 horas lectivas',
      year: '2023',
    },
    {
      id: 'cur-3',
      title: 'Implementación de Sistemas de Gestión de Seguridad de la Información (ISO/IEC 27001)',
      inst: 'AENOR Perú',
      hours: '90 horas lectivas',
      year: '2023',
    },
    {
      id: 'cur-4',
      title: 'Curso de Especialización en Gobierno Digital e Interoperabilidad PIDE',
      inst: 'Secretaría de Gobierno y Transformación Digital (PCM)',
      hours: '80 horas lectivas',
      year: '2022',
    },
  ],
  skills: [
    'Gestión Pública (SERVIR)',
    'Contrataciones del Estado (OSCE / SEACE)',
    'Interoperabilidad PIDE',
    'Firma Digital & Cero Papel',
    'SIAF / SIGA / SINAD',
    'PostgreSQL / SQL Server',
    'Next.js / TypeScript / Python',
    'Gestión de Proyectos (Scrum / Agile)',
  ],
  languages: [
    { id: 'lang-1', name: 'Español', level: 'Nativo' },
    { id: 'lang-2', name: 'Inglés', level: 'Avanzado' },
    { id: 'lang-3', name: 'Quechua', level: 'Básico' },
  ],
  swornStatementAccepted: true,
};

export const TEMPLATES_META: CvTemplateMeta[] = [
  {
    id: 'servir-cas',
    name: 'Oficial SERVIR / CAS',
    subtitle: 'Ficha Resumen Hoja de Vida Estándar',
    recommendedFor: 'Convocatorias del Estado (CAS 1057, 728, 276)',
    tag: 'Recomendado Estado',
    accentColor: '#10b981',
  },
  {
    id: 'modern-executive',
    name: 'Moderno Ejecutivo',
    subtitle: 'Diseño en 2 columnas con barra lateral y foto',
    recommendedFor: 'Sector Privado, Consultorías y Empresas',
    tag: 'Sector Privado',
    accentColor: '#3b82f6',
  },
  {
    id: 'minimal-ats',
    name: 'Minimalista ATS-Friendly',
    subtitle: 'Estilo Harvard de alta legibilidad para robots ATS',
    recommendedFor: 'Procesos de selección corporativos y multinacionales',
    tag: 'ATS Friendly',
    accentColor: '#475569',
  },
  {
    id: 'tech-creative',
    name: 'Tech & Contemporáneo',
    subtitle: 'Diseño limpio con insignias y stack tecnológico',
    recommendedFor: 'Tecnología, Startups, Digital e Innovación',
    tag: 'Tecnología & Digital',
    accentColor: '#059669',
  },
];
