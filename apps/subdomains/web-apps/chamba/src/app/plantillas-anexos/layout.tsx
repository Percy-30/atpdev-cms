import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Formatos y Anexos SERVIR CAS Editables 2026 | chamba pro',
  description: 'Descarga gratis plantillas y formatos oficiales de Declaraciones Juradas, Anexo 1, 2, 3 y 4 para convocatorias CAS del Estado Peruano.',
  alternates: {
    canonical: 'https://empleos.atpdev.dev/plantillas-anexos',
  },
  openGraph: {
    title: 'Formatos y Anexos SERVIR CAS Editables 2026 | chamba pro',
    description: 'Descarga gratis plantillas oficiales de Declaraciones Juradas para convocatorias CAS del Estado Peruano.',
    url: 'https://empleos.atpdev.dev/plantillas-anexos',
    type: 'website',
  },
};

export default function PlantillasAnexosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
