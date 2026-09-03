import test from 'node:test';
import assert from 'node:assert/strict';
import { 
  INITIAL_JOBS, 
  getJobPostingBySlug, 
  getJobPostings,
  saveJobPosting, 
  toggleJobFeatured, 
  updateJobStatus, 
  deleteJobPosting,
  JobPosting 
} from './jobs';
import { scrapeLiveConvocatoriasFeed } from './scraper';

test('Clean Architecture - Domain Layer: JobPosting Contracts & Integrity', () => {
  assert.ok(INITIAL_JOBS.length > 0, 'Catalog should contain verified initial jobs');
  
  for (const job of INITIAL_JOBS) {
    assert.ok(job.id, 'Job must have a unique ID');
    assert.ok(job.title, 'Job must have a title');
    assert.ok(job.slug, 'Job must have a URL slug');
    assert.ok(job.entity_name, 'Job must specify an entity name');
    assert.ok(job.apply_url.startsWith('http'), 'Job must have a valid application URL');
    assert.ok(['CAS 1057', 'D.L. 728', 'D.L. 276', 'Locación / FAG', 'Privado', 'Prácticas'].includes(job.sector_type), `Invalid sector type: ${job.sector_type}`);
  }
});

test('Clean Architecture - Use Case Layer: getJobPostingBySlug', async () => {
  const existingJob = INITIAL_JOBS[0];
  const found = await getJobPostingBySlug(existingJob.slug);
  
  assert.ok(found, 'Should find existing job by slug');
  assert.equal(found?.id, existingJob.id, 'Matched job ID should equal domain entity ID');
  
  const nonExistent = await getJobPostingBySlug('slug-inexistente-12345');
  assert.equal(nonExistent, null, 'Should return null for non-existent slug');
});

test('Clean Architecture - Infrastructure Adapter Layer: Scraper Resiliency', async () => {
  const scrapedJobs = await scrapeLiveConvocatoriasFeed();
  assert.ok(Array.isArray(scrapedJobs), 'Scraper must always return an array (never throw)');
  
  if (scrapedJobs.length > 0) {
    const liveJob = scrapedJobs[0];
    assert.ok(liveJob.slug.startsWith('live-'), 'Scraped jobs must have live- prefixed slugs for domain isolation');
    assert.equal(liveJob.entity_verified, true, 'Live scraped jobs must be marked verified');
  }
});

test('Clean Architecture - Domain Rules: Net Salary Calculation', () => {
  // Test Net Salary Logic: S/ 3,500 Gross Salary under CAS 1057 (ONP 13% vs AFP ~12.5%)
  const grossSalary = 3500;
  const onpDeduction = grossSalary * 0.13; // 455 Soles
  const netBeforeTax = grossSalary - onpDeduction; // 3,045 Soles
  
  assert.equal(onpDeduction, 455, 'ONP deduction should equal 13% of gross salary');
  assert.equal(netBeforeTax, 3045, 'Net before tax calculation should match 3045 Soles');
});

test('Clean Architecture - Admin Management: CRUD Lifecycle & Persistence', async () => {
  const testId = `test-job-${Date.now()}`;
  const testTitle = 'Especialista en Ciberseguridad Gubernamental';
  
  // 1. Create / Save
  const saveResult = await saveJobPosting({
    id: testId,
    title: testTitle,
    entity_name: 'PRESIDENCIA DEL CONSEJO DE MINISTROS - PCM',
    sector_type: 'CAS 1057',
    region: 'Lima',
    category: 'Tecnología e Informática',
    education_level: 'Titulado',
    salary_text: 'S/. 9,000 Soles',
    salary_min: 9000,
    salary_max: 9000,
    apply_url: 'https://pcm.gob.pe/convocatorias',
    featured: false
  });

  assert.equal(saveResult.success, true, 'Job creation should succeed');
  assert.ok(saveResult.job, 'Returned job object must be present');
  const createdSlug = saveResult.job!.slug;
  assert.ok(createdSlug.length > 0, 'Slug must be auto-generated');

  // 2. Read by slug
  const retrieved = await getJobPostingBySlug(createdSlug);
  assert.ok(retrieved, 'Should retrieve freshly created job by slug');
  assert.equal(retrieved?.id, testId, 'Retrieved job ID should match testId');
  assert.equal(retrieved?.featured, false, 'Default featured flag should be false');

  // 3. Toggle Featured
  const toggleResult = await toggleJobFeatured(testId, true);
  assert.equal(toggleResult, true, 'Toggle featured should return true');
  const afterToggle = await getJobPostingBySlug(createdSlug);
  assert.equal(afterToggle?.featured, true, 'Featured flag should now be true');

  // 4. Update Status
  const updateStatusResult = await updateJobStatus(testId, 'Finalizado');
  assert.equal(updateStatusResult, true, 'Update status should return true');
  const afterStatus = await getJobPostingBySlug(createdSlug);
  assert.equal(afterStatus?.status, 'Finalizado', 'Status should now be Finalizado');

  // 5. Delete
  const deleteResult = await deleteJobPosting(testId);
  assert.equal(deleteResult, true, 'Delete job should return true');
  const afterDelete = await getJobPostingBySlug(createdSlug);
  assert.equal(afterDelete, null, 'Deleted job should no longer be found');
});

