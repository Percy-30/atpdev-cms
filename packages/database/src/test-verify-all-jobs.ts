import { getJobPostings, getJobPostingBySlug } from './jobs';

async function verifyJobs() {
  console.log('🔍 Iniciando verificación exhaustiva de convocatorias...');
  const jobs = await getJobPostings();
  console.log(`Total convocatorias detectadas: ${jobs.length}`);

  let errors = 0;
  let pdfButtons = 0;
  let portalButtons = 0;
  let structuredPlazasCount = 0;
  let fallbackPlazasCount = 0;

  // Test directo del caso solicitado por el usuario: INEI Operadores Tecnológicos
  console.log('\n🎯 Verificando caso solicitado: INEI Operadores Tecnológicos...');
  const ineiOp = await getJobPostingBySlug('inei-eda-2026-operadores-tecnologicos');
  if (!ineiOp) {
    console.error('❌ ERROR: inei-eda-2026-operadores-tecnologicos no encontrado!');
    errors++;
  } else {
    console.log('✔ [OK] inei-eda-2026-operadores-tecnologicos resuelto con éxito:');
    console.log(`   Título: ${ineiOp.title}`);
    console.log(`   Postular (apply_url): ${ineiOp.apply_url}`);
    console.log(`   Bases (bases_pdf_url): ${ineiOp.bases_pdf_url}`);
    console.log(`   Guía (guia_postulante_url): ${ineiOp.guia_postulante_url}`);
    console.log(`   Anexos (anexos_url): ${ineiOp.anexos_url}`);
    console.log(`   Sedes / ODPE: ${ineiOp.odpe_vacancies?.length || 0} sedes`);
  }

  // Test directo del caso solicitado por el usuario: ALICORP
  console.log('\n🎯 Verificando caso solicitado: ALICORP Logística...');
  const alicorpJob = await getJobPostingBySlug('alicorp-analistas-logistica-cadena-suministro');
  if (!alicorpJob) {
    console.error('❌ ERROR: alicorp-analistas-logistica-cadena-suministro no encontrado!');
    errors++;
  } else {
    console.log('✔ [OK] alicorp-analistas-logistica-cadena-suministro resuelto con éxito:');
    console.log(`   Título: ${alicorpJob.title}`);
    console.log(`   Empresa: ${alicorpJob.entity_name}`);
    console.log(`   Postular (apply_url): ${alicorpJob.apply_url}`);
    console.log(`   Bases (bases_pdf_url): ${alicorpJob.bases_pdf_url}`);
    console.log(`   Portal Oficial: ${alicorpJob.official_portal_name}`);
    
    if (alicorpJob.apply_url.includes('computrabajo') || alicorpJob.apply_url.includes('convocatoriasdetrabajo')) {
      console.error('❌ ERROR: apply_url de Alicorp sigue conteniendo competidor/computrabajo!');
      errors++;
    }
  }
  const sampleIndices = [
    0, 1, 2, 3, 4, 5, 10, 15, 20, 25, 30, 35, 40, 50, 60, 70, 80, 90, 100, 110, 120, 140, 200, 250, 300, 350, 400
  ].filter(idx => idx < jobs.length);

  const testJobs = sampleIndices.map(idx => jobs[idx]);

  console.log(`\nProbando ${testJobs.length} convocatorias diversas en vivo:\n`);

  for (const job of testJobs) {
    // 1. Verificar resolución por slug o slug corto
    const resolved = await getJobPostingBySlug(job.slug);
    if (!resolved) {
      console.error(`❌ ERROR: No se pudo resolver por slug: ${job.slug}`);
      errors++;
      continue;
    }

    // 2. Verificar datos mínimos para renderizar la página
    if (!resolved.title || !resolved.entity_name || !resolved.sector_type) {
      console.error(`❌ ERROR: Campos obligatorios faltantes en ${job.slug}`);
      errors++;
      continue;
    }

    // 3. Evaluar lógica del botón de bases del sidebar
    const pdfTargetUrl = (resolved.plazas && resolved.plazas[0]?.bases_url) || resolved.bases_pdf_url || resolved.apply_url;
    if (!pdfTargetUrl) {
      console.error(`❌ ERROR: Sin URL de bases ni postulación: ${job.slug}`);
      errors++;
      continue;
    }

    const isDoc = (
      pdfTargetUrl.includes('.pdf') ||
      pdfTargetUrl.includes('drive.google.com') ||
      pdfTargetUrl.includes('docs.google.com') ||
      pdfTargetUrl.includes('archivos.mpfn.gob.pe') ||
      pdfTargetUrl.includes('/anexo-archivo/') ||
      pdfTargetUrl.includes('Descargar_Tdr') ||
      pdfTargetUrl.includes('.docx') ||
      pdfTargetUrl.includes('.xlsx')
    );

    if (isDoc) {
      pdfButtons++;
    } else {
      portalButtons++;
    }

    // 4. Evaluar lógica del componente PlazasList
    const effectivePlazas = (resolved.plazas && resolved.plazas.length > 0)
      ? resolved.plazas
      : [
          {
            cas_code: resolved.title.match(/CAS\s*N[ºo°]?\s*\d+/i)?.[0] || 'CAS Nº 01',
            title: resolved.title,
            education: resolved.requirements?.find(r => /formaci[oó]n|t[ií]tulo|bachiller|egresad|estudios|secundaria|t[eé]cnico/i.test(r)) || `Nivel: ${resolved.education_level}`,
            experience: resolved.requirements?.find(r => /experiencia/i.test(r)) || 'Experiencia laboral acreditada',
            salary: resolved.salary_text,
            bases_url: resolved.bases_pdf_url || resolved.apply_url
          }
        ];

    if (resolved.plazas && resolved.plazas.length > 0) {
      structuredPlazasCount++;
    } else {
      fallbackPlazasCount++;
    }

    // 5. Verificar que cada plaza tenga su enlace y título válido
    for (const plaza of effectivePlazas) {
      if (!plaza.title || !plaza.bases_url) {
        console.error(`❌ ERROR: Plaza inválida en ${job.slug}:`, plaza);
        errors++;
      }
    }

    console.log(`✔ [OK] [${isDoc ? 'PDF/Doc' : 'Portal Oficial'}] [${effectivePlazas.length} plazas] ${resolved.title.slice(0, 50)}...`);
  }

  console.log('\n--- RESUMEN DE LA VERIFICACIÓN ---');
  console.log(`Convocatorias probadas: ${testJobs.length}`);
  console.log(`Errores encontrados: ${errors}`);
  console.log(`Botones PDF/Documento Directo: ${pdfButtons}`);
  console.log(`Botones Enlace a Portal Oficial: ${portalButtons}`);
  console.log(`Convocatorias con plazas estructuradas individuales: ${structuredPlazasCount}`);
  console.log(`Convocatorias con plaza sintetizada fallback: ${fallbackPlazasCount}`);

  if (errors > 0) {
    throw new Error(`Se encontraron ${errors} errores en las convocatorias.`);
  } else {
    console.log('🎉 VERIFICACIÓN 100% EXITOSA SIN ERRORES');
  }
}

verifyJobs().catch((err) => {
  console.error(err);
  process.exit(1);
});
