'use server';

import { 
  getJobPostings, 
  saveJobPosting, 
  toggleJobFeatured, 
  updateJobStatus, 
  deleteJobPosting,
  invalidateJobsCache,
  JobPosting
} from '@atpdev/database';
import { scrapeLiveConvocatoriasFeed } from '@atpdev/database/src/scraper';
import { revalidatePath } from 'next/cache';

export async function fetchAdminJobsAction(): Promise<JobPosting[]> {
  try {
    invalidateJobsCache();
    return await getJobPostings();
  } catch (err) {
    console.error('Error fetching admin jobs:', err);
    return [];
  }
}

export async function saveJobAction(jobData: any): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await saveJobPosting(jobData);
    if (res.success) {
      revalidatePath('/dashboard/chamba');
      return { success: true };
    }
    return { success: false, error: res.error };
  } catch (err: any) {
    return { success: false, error: err?.message || 'Error al guardar la convocatoria' };
  }
}

export async function toggleJobFeaturedAction(id: string, featured: boolean): Promise<boolean> {
  try {
    const ok = await toggleJobFeatured(id, featured);
    revalidatePath('/dashboard/chamba');
    return ok;
  } catch (err) {
    return false;
  }
}

export async function updateJobStatusAction(id: string, status: 'Vigente' | 'Finalizado' | 'Pendiente'): Promise<boolean> {
  try {
    const ok = await updateJobStatus(id, status, { entity_verified: status === 'Vigente' });
    revalidatePath('/dashboard/chamba');
    return ok;
  } catch (err) {
    return false;
  }
}

export async function approveJobRequestAction(id: string, logoUrl?: string): Promise<boolean> {
  try {
    const ok = await updateJobStatus(id, 'Vigente', { 
      entity_verified: true,
      ...(logoUrl ? { entity_logo: logoUrl } : {})
    });
    revalidatePath('/dashboard/chamba');
    return ok;
  } catch (err) {
    return false;
  }
}

export async function updateJobLogoAction(id: string, logoUrl: string): Promise<boolean> {
  try {
    const ok = await updateJobStatus(id, 'Pendiente', { entity_logo: logoUrl });
    revalidatePath('/dashboard/chamba');
    return ok;
  } catch (err) {
    return false;
  }
}

export async function deleteJobAction(id: string): Promise<boolean> {
  try {
    const ok = await deleteJobPosting(id);
    revalidatePath('/dashboard/chamba');
    return ok;
  } catch (err) {
    return false;
  }
}

export async function triggerLiveScraperAction(): Promise<{ count: number; error?: string }> {
  try {
    invalidateJobsCache();
    const { scrapeConvocatoriasDeTrabajo } = await import('@atpdev/database/src/scraper');
    const [liveJobs, cdJobs] = await Promise.all([
      scrapeLiveConvocatoriasFeed().catch(() => []),
      scrapeConvocatoriasDeTrabajo().catch(() => [])
    ]);
    const totalCount = (liveJobs?.length || 0) + (cdJobs?.length || 0);
    revalidatePath('/dashboard/chamba');
    return { count: totalCount };
  } catch (err: any) {
    return { count: 0, error: err?.message || 'Error al ejecutar scraper' };
  }
}

export async function fetchChambaConfigAction(): Promise<any> {
  const { getSubdomainConfig } = await import('@atpdev/database');
  return getSubdomainConfig('chamba');
}

export async function updateChambaConfigAction(updates: any): Promise<{ success: boolean; config: any }> {
  const { saveSubdomainConfig } = await import('@atpdev/database');
  const res = saveSubdomainConfig('chamba', updates);
  revalidatePath('/dashboard/chamba');
  return res;
}
