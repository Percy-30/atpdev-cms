export type ExperienceType = 'General' | 'Específica';

export type AcademicDegree = 
  | 'SECUNDARIA COMPLETA'
  | 'TÉCNICO EGRESADO'
  | 'TÉCNICO TITULADO'
  | 'EGRESADO UNIVERSITARIO'
  | 'BACHILLER'
  | 'TITULADO Y COLEGIADO'
  | 'MAESTRÍA'
  | 'DOCTORADO';

export interface EducationItem {
  id: string;
  degree: AcademicDegree | string;
  carrera: string;
  institution: string;
  year: string;
  status?: string;
}

export interface ExperienceItem {
  id: string;
  entity: string;
  role: string;
  period: string; // e.g., "01/2023 - 12/2024 (24 Meses)"
  months?: number;
  type: ExperienceType;
  functions?: string[];
}

export interface CourseItem {
  id: string;
  title: string;
  inst: string;
  hours: string; // e.g., "120 horas lectivas"
  year?: string;
}

export interface LanguageItem {
  id: string;
  name: string;
  level: 'Básico' | 'Intermedio' | 'Avanzado' | 'Nativo' | 'Bilingüe';
}

export interface PersonalInfo {
  fullName: string;
  headline: string; // e.g. "Ingeniero de Sistemas / Especialista en Contrataciones del Estado"
  dni: string;
  ruc: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  colegiatoria: string; // e.g. "CIP N° 245890 (Habilitado)"
  linkedin: string;
  website: string;
  photoUrl: string; // Data URL base64 or empty
}

export interface CvData {
  personal: PersonalInfo;
  profileSummary: string;
  education: EducationItem[];
  courses: CourseItem[];
  experiences: ExperienceItem[];
  skills: string[];
  languages: LanguageItem[];
  swornStatementAccepted: boolean;
}

export type CvTemplateId = 'servir-cas' | 'modern-executive' | 'minimal-ats' | 'tech-creative';

export interface CvTemplateMeta {
  id: CvTemplateId;
  name: string;
  subtitle: string;
  recommendedFor: string;
  tag: string;
  accentColor: string;
}
