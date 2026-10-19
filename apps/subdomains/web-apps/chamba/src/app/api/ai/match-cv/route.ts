import { NextResponse } from 'next/server';
import { getJobPostings, JobPosting } from '@atpdev/database';

export const dynamic = 'force-dynamic';

const EDUCATION_RANKS: Record<string, number> = {
  'Secundaria': 1,
  'Técnico': 2,
  'Egresado': 3,
  'Bachiller': 4,
  'Titulado': 5,
  'Maestría / Doctorado': 6,
  'Universitarios': 3,
  'Técnico / Universitario': 3
};

const CAREER_KEYWORDS: Record<string, string[]> = {
  'Derecho y Asesoría Legal': [
    'derecho', 'abogado', 'abogada', 'juridico', 'jurídico', 'legal', 'fiscal', 'leyes', 'procesal', 'jurisprudencia'
  ],
  'Sistemas, Informática y TI': [
    'sistemas', 'informatica', 'informática', 'computacion', 'computación', 'software', 'programador', 
    'desarrollador', 'frontend', 'backend', 'fullstack', 'redes', 'soporte tecnico', 'soporte técnico', 
    'base de datos', 'sql', 'python', 'javascript', 'java', 'seguridad informatica', 'ciberseguridad'
  ],
  'Contabilidad y Finanzas': [
    'contabilidad', 'contador', 'contadora', 'finanzas', 'tributacion', 'tributación', 'auditoria', 
    'auditoría', 'siaf', 'tesoreria', 'tesorería', 'presupuesto', 'costos', 'estados financieros'
  ],
  'Administración y Gestión Pública': [
    'administracion', 'administración', 'administrador', 'administradora', 'gestion publica', 'gestión pública', 
    'recursos humanos', 'rrhh', 'personal', 'logistica', 'logística', 'abastecimiento', 'contrataciones del estado', 
    'osce', 'seace'
  ],
  'Salud, Medicina y Enfermería': [
    'salud', 'medico', 'médico', 'medica', 'médica', 'enfermero', 'enfermera', 'enfermeria', 'enfermería', 
    'obstetra', 'farmacia', 'farmaceutico', 'laboratorio clinico', 'biologo', 'psicologia', 'psicólogo'
  ],
  'Educación y Docencia': [
    'educacion', 'educación', 'docente', 'profesor', 'profesora', 'pedagogia', 'pedagogía', 'primaria', 
    'secundaria', 'inicial', 'ensenanza', 'enseñanza'
  ],
  'Ingeniería Civil y Arquitectura': [
    'ingenieria civil', 'ingeniería civil', 'civil', 'arquitectura', 'arquitecto', 'obras', 'construccion', 
    'construcción', 'topografia', 'topografía', 'residente de obra', 'supervisor de obra', 'autocad', 'expediente tecnico'
  ],
  'Conducción y Transporte': [
    'conductor', 'conductora', 'chofer', 'manejo', 'licencia de conducir', 'a-ii', 'a-iii', 'a-i', 'transporte', 
    'traslado', 'vehiculo', 'vehículo', 'mantenimiento automotriz'
  ],
  'Seguridad y Vigilancia': [
    'seguridad', 'vigilante', 'vigilancia', 'resguardo', 'serenazgo', 'custodia', 'prevencion', 'prevención'
  ],
  'Secretariado y Asistencia de Oficina': [
    'secretaria', 'secretario', 'asistente administrativo', 'asistente de oficina', 'recepcionista', 
    'tramite documentario', 'trámite documentario', 'archivo', 'mesa de partes', 'redaccion', 'redacción'
  ],
  'Comunicaciones y Marketing': [
    'comunicacion', 'comunicación', 'periodismo', 'periodista', 'diseno grafico', 'diseño gráfico', 
    'relaciones publicas', 'marketing', 'redes sociales', 'audiovisual'
  ]
};

const REGIONS_LIST = [
  'Amazonas', 'Ancash', 'Apurímac', 'Arequipa', 'Ayacucho', 'Cajamarca', 'Callao',
  'Cusco', 'Huancavelica', 'Huánuco', 'Ica', 'Junín', 'La Libertad', 'Lambayeque',
  'Lima', 'Loreto', 'Madre de Dios', 'Moquegua', 'Pasco', 'Piura', 'Puno', 'San Martín',
  'Tacna', 'Tumbes', 'Ucayali', 'Nacional / Remoto'
];

interface MatchedRecommendation {
  job: JobPosting;
  score: number;
  matchReasons: string[];
  educationFit: 'Cumple' | 'Parcial' | 'No especificado';
  careerMatch: boolean;
  regionMatch: boolean;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { cvText, preferredRegion, preferredSector, minScore = 35 } = body;

    if (!cvText || typeof cvText !== 'string' || cvText.trim().length < 15) {
      return NextResponse.json({
        error: 'El contenido del CV es demasiado corto. Ingresa al menos 15 caracteres con tu experiencia y formación.'
      }, { status: 400 });
    }

    const normCv = cvText.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    // 1. Detectar Grado Académico
    let candidateDegree = 'Técnico';
    let candidateDegreeRank = 2;

    if (/maestr|magister|doctor|posgrado|postgrado|phd/.test(normCv)) {
      candidateDegree = 'Maestría / Doctorado';
      candidateDegreeRank = 6;
    } else if (/titulad|colegiad|licenciad|titulo profesional/.test(normCv)) {
      candidateDegree = 'Titulado';
      candidateDegreeRank = 5;
    } else if (/bachiller/.test(normCv)) {
      candidateDegree = 'Bachiller';
      candidateDegreeRank = 4;
    } else if (/egresad/.test(normCv)) {
      candidateDegree = 'Egresado';
      candidateDegreeRank = 3;
    } else if (/tecnic|instituto|carrera tecnica/.test(normCv)) {
      candidateDegree = 'Técnico';
      candidateDegreeRank = 2;
    } else if (/secundaria|estudios secundarios/.test(normCv)) {
      candidateDegree = 'Secundaria';
      candidateDegreeRank = 1;
    }

    // 2. Detectar Especialidad / Carrera
    let detectedCareer = 'Administración y Gestión';
    let maxCareerMatches = 0;
    const detectedKeywords: string[] = [];

    for (const [careerName, keywords] of Object.entries(CAREER_KEYWORDS)) {
      let matches = 0;
      for (const kw of keywords) {
        const cleanKw = kw.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        if (normCv.includes(cleanKw)) {
          matches++;
          if (!detectedKeywords.includes(kw) && detectedKeywords.length < 8) {
            detectedKeywords.push(kw);
          }
        }
      }
      if (matches > maxCareerMatches) {
        maxCareerMatches = matches;
        detectedCareer = careerName;
      }
    }

    // 3. Detectar Años de Experiencia
    let experienceYears = 1;
    const expMatch = normCv.match(/(\d{1,2})\s*(?:anos|ano|anios|anio)\s*(?:de\s*)?(?:experiencia|laboral)/i)
      || normCv.match(/(?:experiencia(?:\s+laboral)?(?:\s+de)?)\s*[:=]?\s*(\d{1,2})\s*anos/i);
    if (expMatch && expMatch[1]) {
      const parsed = parseInt(expMatch[1], 10);
      if (parsed > 0 && parsed <= 40) experienceYears = parsed;
    }

    // 4. Detectar Región en el CV (o usar la preferida)
    let candidateRegion = preferredRegion || 'Lima';
    for (const reg of REGIONS_LIST) {
      const cleanReg = reg.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      if (normCv.includes(cleanReg)) {
        candidateRegion = reg;
        break;
      }
    }

    // 5. Cargar todas las convocatorias activas
    const allJobs = await getJobPostings();
    const recommendations: MatchedRecommendation[] = [];

    for (const job of allJobs) {
      // Ignorar finalizadas para recomendación directa
      if (job.status === 'Finalizado') continue;

      let score = 0;
      const reasons: string[] = [];

      // A. Evaluación de Nivel Académico (hasta 30 pts)
      const requiredRank = EDUCATION_RANKS[job.education_level] || 3;
      let educationFit: 'Cumple' | 'Parcial' | 'No especificado' = 'Parcial';

      if (candidateDegreeRank >= requiredRank) {
        score += 30;
        educationFit = 'Cumple';
        reasons.push(`Tu nivel académico (${candidateDegree}) cumple o supera el requisito (${job.education_level})`);
      } else if (candidateDegreeRank === requiredRank - 1) {
        score += 15;
        educationFit = 'Parcial';
        reasons.push(`Nivel requerido cercano (${job.education_level})`);
      } else {
        score += 5;
      }

      // B. Evaluación de Carrera y Palabras Clave (hasta 45 pts)
      const jobText = `${job.title} ${job.category} ${job.description} ${(job.requirements || []).join(' ')} ${(job.plazas || []).map(p => p.title).join(' ')}`.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

      let careerMatched = false;
      const careerKeywords = CAREER_KEYWORDS[detectedCareer] || [];
      let kwHits = 0;

      for (const kw of careerKeywords) {
        const cleanKw = kw.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        if (jobText.includes(cleanKw)) {
          kwHits++;
        }
      }

      if (kwHits >= 2 || jobText.includes(detectedCareer.toLowerCase().split(' ')[0])) {
        score += 40;
        careerMatched = true;
        reasons.push(`Afinidad con tu especialidad en ${detectedCareer}`);
      } else if (kwHits === 1) {
        score += 25;
        careerMatched = true;
        reasons.push(`Coincidencia parcial con tus competencias de ${detectedCareer}`);
      } else {
        // Palabras detectadas sueltas del CV
        let looseHits = 0;
        for (const kw of detectedKeywords) {
          if (jobText.includes(kw.normalize('NFD').replace(/[\u0300-\u036f]/g, ''))) {
            looseHits++;
          }
        }
        if (looseHits > 0) {
          score += Math.min(20, looseHits * 8);
          reasons.push(`Coincidencia con habilidades clave de tu perfil`);
        }
      }

      // C. Evaluación de Ubicación / Región (hasta 15 pts)
      let regionMatched = false;
      const normJobRegion = (job.region || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      const normCandidateRegion = candidateRegion.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

      if (normJobRegion.includes('nacional') || normJobRegion.includes('remoto')) {
        score += 15;
        regionMatched = true;
        reasons.push(`Modalidad Nacional o Remota disponible`);
      } else if (normJobRegion.includes(normCandidateRegion) || normCandidateRegion.includes(normJobRegion)) {
        score += 15;
        regionMatched = true;
        reasons.push(`Convocatoria ubicada en tu región (${job.region})`);
      } else if (preferredRegion && normJobRegion.includes(preferredRegion.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, ''))) {
        score += 15;
        regionMatched = true;
        reasons.push(`Ubicada en tu región de preferencia`);
      } else {
        score += 3;
      }

      // D. Evaluación de Régimen preferido (hasta 10 pts)
      if (preferredSector && job.sector_type === preferredSector) {
        score += 10;
        reasons.push(`Coincide con tu régimen preferido (${job.sector_type})`);
      } else {
        score += 5;
      }

      // Limitar y redondear
      const finalScore = Math.min(98, Math.max(25, Math.round(score)));

      if (finalScore >= minScore) {
        recommendations.push({
          job,
          score: finalScore,
          matchReasons: reasons.slice(0, 3),
          educationFit,
          careerMatch: careerMatched,
          regionMatch: regionMatched
        });
      }
    }

    // Ordenar de mayor a menor compatibilidad
    recommendations.sort((a, b) => b.score - a.score);

    return NextResponse.json({
      success: true,
      totalMatched: recommendations.length,
      candidateProfile: {
        educationLevel: candidateDegree,
        detectedCareer,
        experienceYears,
        detectedRegion: candidateRegion,
        topKeywords: detectedKeywords
      },
      recommendations: recommendations.slice(0, 30)
    });
  } catch (err: any) {
    console.error('Error in /api/ai/match-cv:', err);
    return NextResponse.json(
      { error: err?.message || 'Error al procesar y recomendar convocatorias' },
      { status: 500 }
    );
  }
}
