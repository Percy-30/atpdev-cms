import { getProjects } from '@atpdev/database';
import { Project } from "./entities";

export const fetchAllProjectsUseCase = async (): Promise<Project[]> => {
  const dbProjects = await getProjects();
  return dbProjects.map(p => ({
    ...p,
    demoLink: p.demolink,
    playStore: p.playstore
  }));
};

export async function fetchProjectsByCategoryUseCase(category: string): Promise<Project[]> {
  const allProjects = await fetchAllProjectsUseCase();
  if (category === "Todos") return allProjects;
  return allProjects.filter((p: any) => p.category === category);
}
