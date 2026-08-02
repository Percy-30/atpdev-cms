import { Project } from "../domain/projects/entities";

// Mock data (en el futuro consumirá packages/database)
const projectsMock: Project[] = [
  {
    id: 1,
    title: "ChannelsTV",
    description: "Aplicación de streaming y canales de TV con monetización AdSense y modelo Premium.",
    category: "Android",
    image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=800&auto=format&fit=crop",
    stack: ["Kotlin", "Android Studio", "Billing Library"],
    metrics: "+10k Descargas",
    status: "En producción",
    demoLink: "https://channelstv.atpdev.dev",
    playStore: "https://play.google.com/store"
  },
  {
    id: 2,
    title: "Lector QR Pro",
    description: "Escáner rápido de códigos QR y códigos de barras con historial y generación personalizada.",
    category: "Android",
    image: "https://images.unsplash.com/photo-1595054225547-063fbbe73289?q=80&w=800&auto=format&fit=crop",
    stack: ["Kotlin", "Hilt", "Room", "KSP"],
    metrics: "4.8 Estrellas",
    status: "En producción",
    demoLink: "https://lectorqr.atpdev.dev",
    playStore: "https://play.google.com/store"
  },
  {
    id: 3,
    title: "Almaniq Content Bot",
    description: "Pipeline automatizado que busca tendencias y publica videos diarios en TikTok y YouTube Shorts.",
    category: "IA",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=800&auto=format&fit=crop",
    stack: ["Node.js", "Telegram API", "Gemini AI", "FFmpeg"],
    metrics: "15+ Videos/día",
    status: "En producción",
    demoLink: "#"
  },
  {
    id: 4,
    title: "Portafolio ATP DEV",
    description: "Portal profesional con arquitectura de 3 capas, panel de administración y diseño enfocado a UX.",
    category: "Web",
    image: "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?q=80&w=800&auto=format&fit=crop",
    stack: ["Next.js", "Tailwind", "Supabase", "Turborepo"],
    metrics: "Lighthouse 100",
    status: "Beta",
    demoLink: "https://atpdev.dev"
  },
];

export async function getAllProjects(): Promise<Project[]> {
  // Simulando llamada asíncrona a la DB
  return new Promise((resolve) => setTimeout(() => resolve(projectsMock), 100));
}
