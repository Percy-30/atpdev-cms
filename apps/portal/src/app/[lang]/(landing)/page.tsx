// SERVER COMPONENT – fetches all data at build/request time, fully visible to Google
import { getProjects, getSiteConfig, getSkills, getExperiences, Project, SiteConfig, Skill, Experience } from "@atpdev/database";
import HomeClient from "./HomeClient";

export default async function Page({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = (await params);

  const [projects, config, skills, experiences] = await Promise.all([
    getProjects(),
    getSiteConfig(),
    getSkills(),
    getExperiences(),
  ]);

  const publicProjects = projects.filter((p: Project) => p.status !== 'Privado');

  return (
    <HomeClient
      lang={lang}
      initialProjects={publicProjects}
      initialConfig={config}
      initialSkills={skills}
      initialExperiences={experiences}
    />
  );
}
