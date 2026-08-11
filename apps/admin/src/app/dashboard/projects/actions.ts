"use server";

import { revalidatePath } from "next/cache";
import {
  createProject as dbCreateProject,
  updateProjectStatus as dbUpdateProjectStatus,
  deleteProject as dbDeleteProject,
  getProjects as dbGetProjects,
  syncProjectGithubData,
  fetchGithubAutofillData,
  listGithubRepos,
  fetchScreenshotFromUrl,
  uploadProjectImage,
  slugify,
  type GithubAutofillData,
  type GithubRepoSummary,
} from "@atpdev/database";

type AutofillResult = { error: string } | { data: GithubAutofillData };

export async function autofillFromGithub(repoFullName: string): Promise<AutofillResult> {
  if (!repoFullName.trim()) return { error: "Escribe el repo primero (usuario/repo)" };
  const data = await fetchGithubAutofillData(repoFullName.trim());
  if (!data) {
    return {
      error:
        "No se pudo leer ese repo. Verifica el nombre (usuario/repo) y que GITHUB_TOKEN tenga permiso 'repo' si es privado.",
    };
  }
  return { data };
}

type ReposResult = { error: string } | { repos: GithubRepoSummary[] };

export async function getGithubRepos(): Promise<ReposResult> {
  const repos = await listGithubRepos();
  if (!repos) {
    return {
      error:
        "No se pudo listar tus repos. Revisa que GITHUB_TOKEN esté en tu .env.local con permiso 'repo'.",
    };
  }
  return { repos };
}

// Si el campo viene vacío, guardamos "#" (sin link, sin botón roto en el portal).
// Si escribiste el dominio sin protocolo (ej. "codehistory.atpdev.dev"), le agregamos https:// solo.
function normalizeUrl(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return "#";
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return `https://${trimmed}`;
}

type ScreenshotResult = { error: string } | { imageUrl: string };

// Toma una captura real del sitio en vivo (no del repo). Se usa desde el botón
// "📸 Capturar del sitio" en el formulario, con lo que el usuario ya escribió en URL.
export async function captureScreenshot(siteUrl: string): Promise<ScreenshotResult> {
  const url = normalizeUrl(siteUrl);
  if (url === "#") {
    return { error: "Primero escribe la URL del sitio (Demo/Play Store) para poder capturarla." };
  }
  const outcome = await fetchScreenshotFromUrl(url);
  if ("error" in outcome) {
    return { error: outcome.error };
  }
  return { imageUrl: outcome.url };
}

const MAX_IMAGE_BYTES = 5 * 1024 * 1024; // 5MB

// Recibe el archivo que el usuario seleccionó en el <input type="file"> del CMS
// y lo sube a Supabase Storage. Respaldo manual cuando no hay screenshot/GitHub.
export async function uploadImageFile(formData: FormData): Promise<ScreenshotResult> {
  const file = formData.get("file") as File | null;
  if (!file || file.size === 0) {
    return { error: "Selecciona una imagen primero." };
  }
  if (!file.type.startsWith("image/")) {
    return { error: "El archivo debe ser una imagen (PNG, JPG, WEBP...)." };
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return { error: "La imagen pesa más de 5MB, usa una más liviana." };
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const imageUrl = await uploadProjectImage(buffer, file.name, file.type);
  if (!imageUrl) {
    // Fallback inteligente: si Supabase Storage no está disponible o el bucket no es público,
    // convertimos la imagen a base64 Data URL para que se guarde y previsualice sin problemas.
    const base64 = buffer.toString("base64");
    const dataUrl = `data:${file.type};base64,${base64}`;
    return { imageUrl: dataUrl };
  }
  return { imageUrl };
}

export async function createProject(formData: FormData) {
  const title = formData.get("title") as string;
  const category = formData.get("category") as string;
  const description = formData.get("description") as string;
  const demolink = normalizeUrl(formData.get("demolink") as string || "");
  const stack = (formData.get("stack") as string).split(',').map(s => s.trim());
  const status = formData.get("status") as string;
  const githubRepo = (formData.get("github_repo") as string || "").trim();

  // Si el usuario escribió un slug manual lo respetamos; si no, se autogenera del título.
  const manualSlug = (formData.get("slug") as string || "").trim();
  const slug = manualSlug ? slugify(manualSlug) : slugify(title);

  // Si ya capturaste un screenshot real del sitio (botón 📸), lo respetamos.
  // Si no, usamos un placeholder hasta que sincronices con GitHub o captures uno.
  const capturedImage = (formData.get("image") as string || "").trim();
  const image = capturedImage || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=2000";
  const metrics = "N/A"; // Default metric

  const success = await dbCreateProject({
    title,
    slug,
    category,
    description,
    demolink,
    stack,
    status,
    image,
    metrics,
    github_repo: githubRepo || undefined,
  });

  if (success) {
    // Si se indicó un repo de GitHub, traemos stars/lenguaje/descripción en segundo plano.
    // Si ya capturaste un screenshot real del sitio, le decimos a la sync que NO pise esa imagen.
    if (githubRepo) {
      const projects = await dbGetProjects();
      const created = projects.find(p => p.slug === slug);
      if (created) await syncProjectGithubData(created.id, githubRepo, { overwriteImage: !capturedImage });
    }
    revalidatePath("/dashboard/projects");
    revalidatePath("/dashboard");
    revalidatePath("/", "layout"); // Revalidate main portal too!
  }
}

export async function syncGithub(id: number, repoFullName: string) {
  const success = await syncProjectGithubData(id, repoFullName);
  if (success) {
    revalidatePath("/dashboard/projects");
    revalidatePath("/", "layout");
  }
  return success;
}

export async function updateProjectAction(id: number, formData: FormData) {
  const title = formData.get("title") as string;
  const category = formData.get("category") as string;
  const description = formData.get("description") as string;
  const demolink = normalizeUrl(formData.get("demolink") as string || "");
  const stack = (formData.get("stack") as string).split(',').map(s => s.trim());
  const status = formData.get("status") as string;
  const githubRepo = (formData.get("github_repo") as string || "").trim();
  const manualSlug = (formData.get("slug") as string || "").trim();
  const capturedImage = (formData.get("image") as string || "").trim();

  const { updateProject: dbUpdateProject } = await import("@atpdev/database");

  const success = await dbUpdateProject(id, {
    title,
    ...(manualSlug ? { slug: slugify(manualSlug) } : {}),
    category,
    description,
    demolink,
    stack,
    status,
    github_repo: githubRepo || undefined,
    ...(capturedImage ? { image: capturedImage } : {}),
  });

  if (success && githubRepo) {
    await syncProjectGithubData(id, githubRepo, { overwriteImage: !capturedImage });
  }

  if (success) {
    revalidatePath("/dashboard/projects");
    revalidatePath("/dashboard");
    revalidatePath("/", "layout");
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