"use server";

import { revalidatePath } from "next/cache";
import { createProject as dbCreateProject, updateProjectStatus as dbUpdateProjectStatus, deleteProject as dbDeleteProject } from "@atpdev/database";

export async function createProject(formData: FormData) {
  const title = formData.get("title") as string;
  const category = formData.get("category") as string;
  const description = formData.get("description") as string;
  const demolink = formData.get("demolink") as string;
  const stack = (formData.get("stack") as string).split(',').map(s => s.trim());
  const status = formData.get("status") as string;

  // We can use default images for now or wait for image upload implementation
  const image = "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=2000";
  const metrics = "N/A"; // Default metric

  const success = await dbCreateProject({
    title,
    category,
    description,
    demolink,
    stack,
    status,
    image,
    metrics
  });

  if (success) {
    revalidatePath("/dashboard/projects");
    revalidatePath("/dashboard");
    revalidatePath("/", "layout"); // Revalidate main portal too!
  }
}

export async function updateStatus(id: number, status: string) {
  const success = await dbUpdateProjectStatus(id, status);
  if (success) {
    revalidatePath("/dashboard/projects");
    revalidatePath("/dashboard");
    revalidatePath("/", "layout"); 
  }
  return success;
}

export async function deleteProject(id: number) {
  const success = await dbDeleteProject(id);
  if (success) {
    revalidatePath("/dashboard/projects");
    revalidatePath("/dashboard");
    revalidatePath("/", "layout"); 
  }
  return success;
}
