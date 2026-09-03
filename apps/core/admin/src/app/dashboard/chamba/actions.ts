'use server';

import { 
  getJobPostings, 
  saveJobPosting, 
  toggleJobFeatured, 
  updateJobStatus, 
  deleteJobPosting,
  JobPosting
} from '@atpdev/database';
import { scrapeLiveConvocatoriasFeed } from '@atpdev/database/src/scraper';
import { revalidatePath } from 'next/cache';

export async function fetchAdminJobsAction(): Promise<JobPosting[]> {
  try {
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
    const ok = await updateJobStatus(id, status);
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
    const jobs = await scrapeLiveConvocatoriasFeed();
    revalidatePath('/dashboard/chamba');
    return { count: jobs.length };
  } catch (err: any) {
    return { count: 0, error: err?.message || 'Error al ejecutar scraper' };
  }
}
