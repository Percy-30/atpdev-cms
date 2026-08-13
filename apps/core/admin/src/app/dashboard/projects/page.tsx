import { getProjects } from "@atpdev/database";
import ProjectsClient from "./ProjectsClient";

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-white mb-2">CMS: Proyectos</h1>
          <p className="text-gray-400">Administra los proyectos que se muestran en tu portal principal.</p>
        </div>
      </div>

      <ProjectsClient projects={projects} />
    </div>
  );
}
