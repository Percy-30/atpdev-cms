import { Project, Skill } from "@atpdev/database";

// --- TECH STACK AUTOCLASSIFICATION LOGIC ---
const TECH_DICTIONARY: Record<string, string> = {
  // Frontend
  "react": "Frontend & Web", "next.js": "Frontend & Web", "tailwind css": "Frontend & Web", "tailwind": "Frontend & Web", "css": "Frontend & Web", "html": "Frontend & Web", "javascript": "Frontend & Web", "typescript": "Frontend & Web", "vue": "Frontend & Web", "angular": "Frontend & Web",
  // Backend
  "node.js": "Backend & DB", "supabase": "Backend & DB", "sql": "Backend & DB", "oracle": "Backend & DB", "postgres": "Backend & DB", "plpgsql": "Backend & DB", "express": "Backend & DB", "mongodb": "Backend & DB",
  // Mobile
  "android": "Mobile", "kotlin": "Mobile", "java": "Mobile", "flutter": "Mobile", "ios": "Mobile", "swift": "Mobile", "react native": "Mobile",
  // IA
  "python": "IA & Core", "tensorflow": "IA & Core", "tensorflow lite": "IA & Core", "mediapipe": "IA & Core", "llm": "IA & Core", "ai": "IA & Core", "machine learning": "IA & Core", "openai": "IA & Core",
  // Infra
  "linux": "Infra & Redes", "linux kernel": "Infra & Redes", "git": "Infra & Redes", "vercel": "Infra & Redes", "ccnav7": "Infra & Redes", "docker": "Infra & Redes", "aws": "Infra & Redes"
};

export function getTechStackData(projects: Project[], initialSkills: Skill[]) {
  const projectTags = projects.flatMap(p => p.stack);

  // Top 6 tags for Hero
  const topTechStack = Array.from(
    projectTags.reduce((acc, curr) => {
      const key = curr.toUpperCase();
      acc.set(key, (acc.get(key) || 0) + 1);
      return acc;
    }, new Map<string, number>()).entries()
  )
  .sort((a, b) => b[1] - a[1])
  .slice(0, 6)
  .map(entry => entry[0]);

  const displayTechStack = topTechStack.length > 0 ? topTechStack : ["KOTLIN", "NEXT.JS", "TAILWIND", "SUPABASE", "PYTHON", "AI / LLMS"];

  // Augment initialSkills with projects stack
  const augmentedSkills = initialSkills.map(skill => {
    let newItems = new Set(skill.items);

    projectTags.forEach(tag => {
      const normalizedTag = tag.trim().toLowerCase();
      const mappedCategory = TECH_DICTIONARY[normalizedTag];
      
      // If the dictionary maps this tech to this skill category
      if (mappedCategory && skill.category.includes(mappedCategory)) {
        newItems.add(tag);
      }
    });

    return { ...skill, items: Array.from(newItems) };
  });

  return { displayTechStack, augmentedSkills };
}
