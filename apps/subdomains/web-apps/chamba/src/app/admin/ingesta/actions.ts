'use server';

import { saveJobPosting, JobPosting } from '@atpdev/database';
import { revalidatePath } from 'next/cache';

export async function publishIngestaJobAction(formData: any): Promise<{ success: boolean; slug?: string; error?: string }> {
  try {
    const res = await saveJobPosting(formData);
    if (res.success && res.job) {
      revalidatePath('/empleos');
      revalidatePath(`/empleos/${res.job.slug}`);
      return { success: true, slug: res.job.slug };
    }
    return { success: false, error: res.error || 'No se pudo guardar la convocatoria' };
  } catch (err: any) {
    console.error('Error en publishIngestaJobAction:', err);
    return { success: false, error: err?.message || 'Error del servidor al publicar la convocatoria' };
  }
}
