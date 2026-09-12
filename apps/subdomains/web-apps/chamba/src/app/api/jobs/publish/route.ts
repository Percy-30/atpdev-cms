import { NextRequest, NextResponse } from 'next/server';
import { saveJobPosting, isCompetitorUrl, isGenericPublicationUrl } from '@atpdev/database';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      title,
      entity_name,
      entity_ruc,
      sector_type,
      region,
      category,
      education_level,
      salary_text,
      salary_min,
      salary_max,
      vacancies_count,
      description,
      requirements,
      apply_url,
      bases_pdf_url,
      start_date,
      end_date,
      contact_email,
      contact_phone
    } = body;

    // 1. Validaciones básicas
    if (!title || !entity_name || !apply_url || !sector_type) {
      return NextResponse.json(
        { success: false, error: 'Faltan campos obligatorios (Título, Entidad, Enlace de postulación y Régimen)' },
        { status: 400 }
      );
    }

    // 2. Validación de RUC si fue proporcionado
    if (entity_ruc) {
      const cleanRuc = entity_ruc.replace(/\D/g, '');
      if (cleanRuc.length !== 11 || (!cleanRuc.startsWith('10') && !cleanRuc.startsWith('20') && !cleanRuc.startsWith('15') && !cleanRuc.startsWith('17'))) {
        return NextResponse.json(
          { success: false, error: 'El RUC debe tener 11 dígitos numéricos válidos (iniciando en 10 o 20).' },
          { status: 400 }
        );
      }
    }

    // 3. Validación de URL contra agregadores competidores
    if (isCompetitorUrl(apply_url) || (bases_pdf_url && isCompetitorUrl(bases_pdf_url))) {
      return NextResponse.json(
        { success: false, error: 'No se permiten enlaces hacia agregadores externos o portales de terceros. Debe indicar el portal institucional o enlace oficial de bases.' },
        { status: 400 }
      );
    }

    // 4. Preparar requisitos limpios
    const parsedRequirements = Array.isArray(requirements)
      ? requirements
      : (typeof requirements === 'string' ? requirements.split('\n').map((r: string) => r.trim()).filter(Boolean) : []);

    // 5. Guardar la convocatoria
    const result = await saveJobPosting({
      title: title.trim(),
      entity_name: entity_name.trim(),
      entity_ruc: entity_ruc?.trim() || '',
      entity_verified: true,
      sector_type: sector_type || 'CAS 1057',
      region: region || 'Nacional / Remoto',
      category: category || 'Administración y Gestión Pública',
      education_level: education_level || 'Técnico / Universitario',
      salary_text: salary_text?.trim() || 'A convenir / Según bases',
      salary_min: Number(salary_min) || undefined,
      salary_max: Number(salary_max) || undefined,
      vacancies_count: Number(vacancies_count) || 1,
      description: description?.trim() || `Convocatoria oficial para ${title} en ${entity_name}. Proceso de selección de personal.`,
      requirements: parsedRequirements.length > 0 ? parsedRequirements : ['Cumplir con el perfil y requisitos estipulados en las bases oficiales.'],
      apply_url: apply_url.trim(),
      bases_pdf_url: bases_pdf_url?.trim() || undefined,
      official_portal_name: `${entity_name.trim()} - Portal Institucional`,
      start_date: start_date || new Date().toISOString().split('T')[0],
      end_date: end_date || new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
      featured: false,
      status: 'Vigente'
    });

    if (!result.success || !result.job) {
      return NextResponse.json(
        { success: false, error: result.error || 'No se pudo registrar la convocatoria' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Convocatoria registrada con éxito en chamba pro',
      jobId: result.job.id,
      slug: result.job.slug
    });

  } catch (err: any) {
    console.error('Error en /api/jobs/publish:', err);
    return NextResponse.json(
      { success: false, error: err?.message || 'Error interno del servidor al procesar la publicación' },
      { status: 500 }
    );
  }
}
