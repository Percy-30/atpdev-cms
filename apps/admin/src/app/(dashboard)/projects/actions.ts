"use server";

import { deleteProject, updateProjectStatus, updateProject, uploadImage } from "@atpdev/database";
import { revalidatePath } from "next/cache";

export async function deleteProjectAction(id: number) {
  await deleteProject(id);
  revalidatePath("/projects");
  revalidatePath("/", "layout");
}

export async function toggleProjectVisibility(id: number, currentStatus: string) {
  const newStatus = currentStatus === "Privado" ? "En Producción" : "Privado";
  await updateProjectStatus(id, newStatus);
  revalidatePath("/projects");
  revalidatePath("/", "layout");
}

export async function editProjectAction(formData: FormData) {
  const id = Number(formData.get("id"));
  if (!id) return;
  
  const title = formData.get("title") as string;
  const category = formData.get("category") as string;
  const metrics = formData.get("metrics") as string;
  const description = formData.get("description") as string;
  const stackStr = formData.get("stack") as string;
  const stack = stackStr.split(",").map(s => s.trim()).filter(Boolean);
  
  const imageFile = formData.get("image") as File;
  const existingImage = formData.get("existingImage") as string;
  
  let imageUrl = existingImage || "";
  
  if (imageFile && imageFile.size > 0) {
    const uploadedUrl = await uploadImage(imageFile);
    if (uploadedUrl) imageUrl = uploadedUrl;
  }

  const demolink = formData.get("demoLink") as string || "#";
  const playstore = formData.get("playStore") as string;
  const status = formData.get("status") as string;

  const projectData = {
    title,
    category,
    metrics,
    description,
    stack,
    image: imageUrl,
    demolink,
    playstore: playstore || undefined,
    status
  };

  await updateProject(id, projectData);
  revalidatePath("/projects");
  revalidatePath("/", "layout");
}
