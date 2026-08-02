"use server";

import { getLeads, getProjects } from "@atpdev/database";

export async function getDashboardDataAction() {
  const [leads, projects] = await Promise.all([
    getLeads(),
    getProjects()
  ]);
  
  return { leads, projectsCount: projects.length };
}
