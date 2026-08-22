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
  uploadProjectApk,
  uploadProjectIpa,
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

export async function autofillProjectWithAI(repoFullName: string, domainType: "subruta" | "subdominio" | "externa" = "subruta"): Promise<AutofillResult> {
  if (!repoFullName.trim()) return { error: "Escribe el repo primero (usuario/repo)" };
  
  // 1. Obtener la data base de GitHub (lenguajes, desc)
  const data = await fetchGithubAutofillData(repoFullName.trim());
  if (!data) {
    return {
      error: "No se pudo leer ese repo. Verifica el nombre y tu GITHUB_TOKEN.",
    };
  }

  // 2. Intentar obtener el README.md para más contexto
  let readme = "";
  try {
    const readmeRes = await fetch(`https://raw.githubusercontent.com/${repoFullName}/main/README.md`);
    if (readmeRes.ok) {
      readme = await readmeRes.text();
    } else {
      const readmeMaster = await fetch(`https://raw.githubusercontent.com/${repoFullName}/master/README.md`);
      if (readmeMaster.ok) readme = await readmeMaster.text();
    }
  } catch (e) {
    console.warn("No se pudo obtener el README", e);
  }

  // 3. Llamar a Gemini para mejorar la data y generar la long_description
  if (!process.env.GEMINI_API_KEY) {
    console.warn("No hay GEMINI_API_KEY, devolviendo data normal.");
    return { data: { ...data, long_description: "" } as any };
  }

  try {
    const { GoogleGenerativeAI } = await import("@google/generative-ai");
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" }); // Usamos el modelo rápido

    const prompt = `
      Eres un experto en SEO, redactor técnico y desarrollador de software. Analiza este proyecto de GitHub y extrae/mejora la información para publicarlo en un portafolio profesional.
      
      DATOS OBTENIDOS DE GITHUB:
      Título original: ${data.title}
      Descripción original: ${data.description}
      Lenguajes detectados: ${data.stack.join(", ")}
      Categoría sugerida: ${data.category}
      
      README DEL PROYECTO:
      ${readme.substring(0, 4000)}
      
      REGLAS CRÍTICAS DE ESTRUCTURA Y SEO (IMPORTANTE PARA EVITAR PATRONES REPETITIVOS):
      1. El tipo de enlace solicitado es "${domainType}". 
         - Si es "externa", el proyecto NO tendrá página interna. Mantén "long_description" u "blocks" vacío o básico.
         - Si es "subruta" o "subdominio", DEBES generar una página SEO completa estructurada en bloques.
      2. DEBES variar el contenido dependiendo de la categoría (${data.category}).
      3. SEO E INTENCIÓN DE BÚSQUEDA: Dedica al menos un bloque (h2 y p) a responder exactamente lo que un usuario buscaría en Google. Por ejemplo, si es una app de escaneo, incluye un bloque tipo "La mejor solución para escanear múltiples códigos a la vez" o "Por qué elegir este aplicativo". En ese párrafo, destaca claramente cómo la app resuelve ese problema o necesidad específica del mercado (Beneficios Clave).
      4. No devuelvas un solo bloque de texto. Devuelve un Array de "blocks". Cada bloque puede ser de tipo "h2", "p", o "image".
         - Para tipo "image", incluye "alt" y un "url" vacío o con placeholder, y describe en "context" qué tipo de captura se necesita ahí (ej: "Sube aquí una captura de pantalla principal").

      Instrucciones:
      Devuelve ÚNICAMENTE un objeto JSON válido con esta estructura exacta:
      {
        "title": "Un título comercial, limpio y atractivo (no más de 4 palabras)",
        "description": "Una descripción corta de máximo 100 caracteres, punchy.",
        "blocks": [
          { "type": "h2", "content": "El Reto Técnico" },
          { "type": "p", "content": "Párrafo sobre el desarrollo..." },
          { "type": "image", "alt": "Arquitectura general", "url": "", "context": "Sube un diagrama de arquitectura aquí" }
        ],
        "stack": ["tecnologia1", "tecnologia2"],
        "category": "Selecciona la categoría más precisa entre: Medicina, Juegos, Musica, MedioAmbiente, Herramientas, IA, Finanzas, Productividad, Social, Android, iOS, Web"
      }
    `;

    const response = await model.generateContent(prompt);
    let text = response.response.text().trim();
    // Limpiar si Gemini devuelve ```json ... ```
    if (text.startsWith("\`\`\`json")) text = text.replace(/^\`\`\`json/, "");
    if (text.startsWith("\`\`\`")) text = text.replace(/^\`\`\`/, "");
    if (text.endsWith("\`\`\`")) text = text.replace(/\`\`\`$/, "");
    text = text.trim();

    const aiData = JSON.parse(text || "{}");
    
    // Convertir blocks a long_description markdown si se desea, o pasar blocks al cliente
    // El cliente esperará blocks si enviamos blocks, pero GithubAutofillData no tiene blocks.
    // Lo podemos mandar serializado en long_description
    const blocksJSON = JSON.stringify(aiData.blocks || []);

    // Merge de la data original con la IA
    return {
      data: {
        ...data,
        title: aiData.title || data.title,
        description: aiData.description || data.description,
        long_description: blocksJSON, // enviamos el JSON de bloques dentro de long_description para no cambiar los tipos de DB
        stack: Array.isArray(aiData.stack) ? aiData.stack : data.stack,
        category: aiData.category || data.category,
      },
    };
  } catch (error) {
    console.error("Error en Gemini AI autofill:", error);
    // Si falla la IA, devolvemos la data base
    return { data: { ...data, long_description: "" } as any };
  }
}

export async function suggestGradientColorsWithAI(title: string, description: string) {
  if (!process.env.GEMINI_API_KEY) {
    return { error: "No hay GEMINI_API_KEY configurada." };
  }

  try {
    const { GoogleGenerativeAI } = await import("@google/generative-ai");
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-3.5-flash" });

    const prompt = `
      Eres un experto en diseño web y teoría del color.
      Genera una paleta de 4 colores hexadecimales armónicos y estéticamente agradables para usar en un gradiente fluido de fondo, basándote en el contexto de este proyecto:

      TÍTULO: "${title}"
      DESCRIPCIÓN: "${description}"

      Instrucciones:
      Devuelve ÚNICAMENTE un objeto JSON con la propiedad "colors" que contenga un array de 4 strings hexadecimales (ej: ["#123456", "#654321", ...]).
      Asegúrate de que los colores combinen bien para un fondo oscuro moderno (estilo SaaS "Glassmorphism").
    `;

    const response = await model.generateContent(prompt);
    let text = response.response.text().trim();
    if (text.startsWith("\`\`\`json")) text = text.replace(/^\`\`\`json/, "");
    if (text.startsWith("\`\`\`")) text = text.replace(/^\`\`\`/, "");
    if (text.endsWith("\`\`\`")) text = text.replace(/\`\`\`$/, "");
    
    const parsed = JSON.parse(text.trim());
    if (parsed.colors && Array.isArray(parsed.colors)) {
      return { colors: parsed.colors };
    } else {
      throw new Error("Formato JSON incorrecto");
    }
  } catch (error) {
    console.error("Error en suggestGradientColorsWithAI:", error);
    return { error: "Error al generar sugerencia de colores." };
  }
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

const MAX_APK_BYTES = 100 * 1024 * 1024; // 100MB

export async function uploadApkFile(formData: FormData): Promise<{ error?: string; apkUrl?: string }> {
  const file = formData.get("file") as File | null;
  if (!file || file.size === 0) {
    return { error: "Selecciona un archivo APK primero." };
  }
  if (!file.name.toLowerCase().endsWith(".apk")) {
    return { error: "El archivo debe tener la extensión .apk" };
  }
  if (file.size > MAX_APK_BYTES) {
    return { error: "El APK pesa más de 100MB, usa un archivo más liviano." };
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const apkUrl = await uploadProjectApk(buffer, file.name);
  if (!apkUrl) {
    return { error: "No se pudo subir el APK a Supabase Storage." };
  }
  return { apkUrl };
}

const MAX_IPA_BYTES = 100 * 1024 * 1024; // 100MB

export async function uploadIpaFile(formData: FormData): Promise<{ error?: string; ipaUrl?: string }> {
  const file = formData.get("file") as File | null;
  if (!file || file.size === 0) {
    return { error: "Selecciona un archivo IPA (iOS) primero." };
  }
  if (!file.name.toLowerCase().endsWith(".ipa") && !file.name.toLowerCase().endsWith(".zip")) {
    return { error: "El archivo de iOS debe tener extensión .ipa o .zip" };
  }
  if (file.size > MAX_IPA_BYTES) {
    return { error: "El archivo IPA pesa más de 100MB, usa un paquete más liviano." };
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const ipaUrl = await uploadProjectIpa(buffer, file.name);
  if (!ipaUrl) {
    return { error: "No se pudo subir el archivo IPA a Supabase Storage." };
  }
  return { ipaUrl };
}


export async function createProject(formData: FormData) {
  const title = formData.get("title") as string;
  const category = formData.get("category") as string;
  const description = formData.get("description") as string;
  const demolink = normalizeUrl(formData.get("demolink") as string || "");
  const playstore = normalizeUrl(formData.get("playstore") as string || "");
  const appstore = normalizeUrl(formData.get("appstore") as string || "");
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

  const long_description = formData.get("long_description") as string;
  const is_featured = formData.get("is_featured") === "true";
  const theme_config = formData.get("theme_config") as string || null;
  const legal_config = formData.get("legal_config") as string || null;

  const result = await dbCreateProject({
    title,
    slug,
    category,
    description,
    long_description,
    is_featured,
    demolink: demolink === "#" ? "" : demolink,
    playstore: playstore === "#" ? undefined : playstore,
    appstore: appstore === "#" ? undefined : appstore,
    stack,
    status,
    image,
    metrics,
    github_repo: githubRepo || undefined,
    theme_config: theme_config || undefined,
    legal_config: legal_config || undefined,
  });

  if (result.success) {
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
    return { success: true };
  } else {
    return { success: false, error: result.error };
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
  const playstore = normalizeUrl(formData.get("playstore") as string || "");
  const appstore = normalizeUrl(formData.get("appstore") as string || "");
  const stack = (formData.get("stack") as string).split(',').map(s => s.trim());
  const status = formData.get("status") as string;
  const githubRepo = (formData.get("github_repo") as string || "").trim();
  const manualSlug = (formData.get("slug") as string || "").trim();
  const capturedImage = (formData.get("image") as string || "").trim();

  const long_description = formData.get("long_description") as string;
  const is_featured = formData.get("is_featured") === "true";
  const theme_config = formData.get("theme_config") as string || null;
  const legal_config = formData.get("legal_config") as string || null;

  const { updateProject: dbUpdateProject } = await import("@atpdev/database");

  const result = await dbUpdateProject(id, {
    title,
    ...(manualSlug ? { slug: slugify(manualSlug) } : {}),
    category,
    description,
    long_description,
    is_featured,
    demolink: demolink === "#" ? "" : demolink,
    playstore: playstore === "#" ? undefined : playstore,
    appstore: appstore === "#" ? undefined : appstore,
    stack,
    status,
    github_repo: githubRepo || undefined,
    theme_config: theme_config || undefined,
    legal_config: legal_config || undefined,
    ...(capturedImage ? { image: capturedImage } : {}),
  });

  if (result.success && githubRepo) {
    await syncProjectGithubData(id, githubRepo, { overwriteImage: !capturedImage });
  }

  if (result.success) {
    revalidatePath("/dashboard/projects");
    revalidatePath("/dashboard");
    revalidatePath("/", "layout");
    return { success: true };
  } else {
    return { success: false, error: result.error };
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