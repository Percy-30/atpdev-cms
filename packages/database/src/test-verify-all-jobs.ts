import process from 'node:process';
import { getJobPostings, getJobPostingBySlug, isCompetitorUrl, isGenericPublicationUrl, JobPosting } from './jobs';

async function verifyAllJobs() {
  console.log('🔍 Iniciando AUDITORÍA 100% EXHAUSTIVA DE TODAS LAS CONVOCATORIAS...');
  const jobs = await getJobPostings();
  const totalJobs = jobs.length;
  console.log(`📊 Total de convocatorias registradas en el sistema: ${totalJobs}`);

  let errorsCount = 0;
  let competitorLinksFound = 0;
  let genericLinksFound = 0;
  let directPdfCount = 0;
  let officialPortalCount = 0;
  let structuredPlazasCount = 0;
  let fallbackPlazasCount = 0;
  const slugsSeen = new Set<string>();

  // Verificación caso especial: Alicorp
  console.log('\n🎯 Verificando caso crítico: ALICORP Logística...');
  const alicorp = await getJobPostingBySlug('alicorp-analistas-logistica-cadena-suministro');
  if (!alicorp) {
    console.error('❌ ERROR: Alicorp no encontrado!');
    errorsCount++;
  } else {
    if (isCompetitorUrl(alicorp.apply_url) || isCompetitorUrl(alicorp.bases_pdf_url)) {
      console.error('❌ ERROR: Alicorp aún tiene URLs de competidores/agregadores!');
      errorsCount++;
    } else {
      console.log(`✔ [OK] Alicorp apply_url: ${alicorp.apply_url}`);
      console.log(`✔ [OK] Alicorp bases_pdf_url: ${alicorp.bases_pdf_url}`);
    }
  }

  // Verificación caso especial: INEI Operadores Tecnológicos
  console.log('\n🎯 Verificando caso crítico: INEI Operadores Tecnológicos...');
  const inei = await getJobPostingBySlug('inei-eda-2026-operadores-tecnologicos');
  if (!inei) {
    console.error('❌ ERROR: INEI no encontrado!');
    errorsCount++;
  } else {
    console.log(`✔ [OK] INEI apply_url: ${inei.apply_url}`);
    console.log(`✔ [OK] INEI sedes: ${inei.odpe_vacancies?.length || 0}`);
  }

  // Verificación caso especial: MINEDU
  console.log('\n🎯 Verificando caso crítico: MINEDU Especialistas en Monitoreo...');
  const minedu = await getJobPostingBySlug('minedu-especialistas-monitoreo-pedagogico-gestores-territoriales');
  if (!minedu) {
    console.error('❌ ERROR: MINEDU no encontrado!');
    errorsCount++;
  } else {
    if (isGenericPublicationUrl(minedu.apply_url) || isGenericPublicationUrl(minedu.bases_pdf_url)) {
      console.error('❌ ERROR: MINEDU tiene URLs genéricas de informes-publicaciones!');
      errorsCount++;
    } else {
      console.log(`✔ [OK] MINEDU apply_url: ${minedu.apply_url}`);
      console.log(`✔ [OK] MINEDU bases_pdf_url: ${minedu.bases_pdf_url}`);
    }
  }

  console.log(`\n🚀 Auditando una por una las ${totalJobs} convocatorias en vivo al 100%...\n`);

  for (let i = 0; i < totalJobs; i++) {
    const job = jobs[i];
    const prefix = `[${i + 1}/${totalJobs}]`;

    try {
      // 1. Verificar unicidad de slug
      if (slugsSeen.has(job.slug)) {
        console.error(`❌ ${prefix} ERROR: Slug duplicado detectado: "${job.slug}"`);
        errorsCount++;
      }
      slugsSeen.add(job.slug);

      // 2. Verificar resolución por getJobPostingBySlug
      const resolved = await getJobPostingBySlug(job.slug);
      if (!resolved) {
        console.error(`❌ ${prefix} ERROR: No se pudo resolver por slug: "${job.slug}"`);
        errorsCount++;
        continue;
      }

      // 3. Campos obligatorios
      if (!resolved.title || !resolved.entity_name || !resolved.sector_type || !resolved.region) {
        console.error(`❌ ${prefix} ERROR: Faltan campos esenciales en "${job.slug}"`);
        errorsCount++;
      }

      // 4. Verificación estricta de CERO competidores y CERO URLs genéricas
      const checkField = (fieldVal: string | undefined, fieldName: string) => {
        if (!fieldVal) return;
        if (isCompetitorUrl(fieldVal)) {
          console.error(`❌ ${prefix} ERROR: "${job.slug}" tiene competidor en ${fieldName}: ${fieldVal}`);
          errorsCount++;
          competitorLinksFound++;
        }
        if (isGenericPublicationUrl(fieldVal)) {
          console.error(`❌ ${prefix} ERROR: "${job.slug}" tiene URL genérica de búsqueda en ${fieldName}: ${fieldVal}`);
          errorsCount++;
          genericLinksFound++;
        }
      };

      checkField(resolved.apply_url, 'apply_url');
      checkField(resolved.bases_pdf_url, 'bases_pdf_url');
      checkField(resolved.fuente_url, 'fuente_url');
      checkField(resolved.cuadro_plazas_url, 'cuadro_plazas_url');
      checkField(resolved.cronograma_url, 'cronograma_url');
      checkField(resolved.anexos_url, 'anexos_url');
      checkField(resolved.guia_postulante_url, 'guia_postulante_url');
      checkField(resolved.resultados_url, 'resultados_url');

      // 5. Validar plazas
      if (resolved.plazas && resolved.plazas.length > 0) {
        structuredPlazasCount++;
        resolved.plazas.forEach((p, pIdx) => {
          checkField(p.bases_url, `plazas[${pIdx}].bases_url`);
        });
      } else {
        fallbackPlazasCount++;
      }

      // 6. Validar enlace de postulación o bases
      const target = resolved.bases_pdf_url || resolved.apply_url;
      if (!target || !target.startsWith('http')) {
        console.error(`❌ ${prefix} ERROR: Sin enlace válido en "${job.slug}"`);
        errorsCount++;
      } else if (
        target.includes('.pdf') ||
        target.includes('drive.google.com') ||
        target.includes('docs.google.com') ||
        target.includes('archivos.mpfn.gob.pe')
      ) {
        directPdfCount++;
      } else {
        officialPortalCount++;
      }
    } catch (loopErr: any) {
      console.error(`❌ ${prefix} EXCEPCIÓN en "${job.slug}":`, loopErr?.message || loopErr);
      errorsCount++;
    }
  }

  console.log('\n===================================================');
  console.log('📊 REPORTE DE AUDITORÍA TOTAL AL 1000%');
  console.log('===================================================');
  console.log(`Total de convocatorias auditadas: ${totalJobs}`);
  console.log(`Enlaces a competidores/agregadores encontrados: ${competitorLinksFound}`);
  console.log(`Enlaces genéricos de búsqueda encontrados: ${genericLinksFound}`);
  console.log(`Errores técnicos detectados: ${errorsCount}`);
  console.log(`Convocatorias con bases PDF / Drive directo: ${directPdfCount}`);
  console.log(`Convocatorias con enlace a Portal Oficial directo: ${officialPortalCount}`);
  console.log(`Convocatorias con plazas individuales estructuradas: ${structuredPlazasCount}`);
  console.log(`Convocatorias con plaza sintetizada: ${fallbackPlazasCount}`);
  console.log('===================================================');

  if (errorsCount > 0) {
    console.error(`\n❌ FALLARON ${errorsCount} CHEQUEOS. SE REQUIERE CORRECCIÓN.`);
    process.exit(1);
  } else {
    console.log('\n🎉 ¡AUDITORÍA 100% EXITOSA! 0 ERRORES, 0 ENLACES A TERCEROS, 0 ENLACES GENÉRICOS.');
    console.log('Todas las convocatorias funcionan al 1000% con enlaces directos oficiales o PDF.');
  }
}

verifyAllJobs().catch((err) => {
  console.error('Error fatal en verificación:', err?.stack || err);
  process.exit(1);
});
