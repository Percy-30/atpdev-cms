export interface Project {
  id: number;
  title: string;
  description: string;
  category: string;
  image: string;
  stack: string[];
  metrics: string;
  status: string;
  demoLink: string;
  playStore?: string;
}
