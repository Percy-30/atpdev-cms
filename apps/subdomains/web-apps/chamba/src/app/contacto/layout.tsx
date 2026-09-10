import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contacto y Atención al Usuario | chamba pro',
  description: 'Canal de atención al postulante, verificación de convocatorias, reporte de fraudes y consultas de soporte editorial de Chamba Pro.',
  alternates: {
    canonical: 'https://empleos.atpdev.dev/contacto',
  },
  openGraph: {
    title: 'Contacto y Atención al Usuario | chamba pro',
    description: 'Canal de atención al postulante, verificación de convocatorias y reporte de fraudes de Chamba Pro.',
    url: 'https://empleos.atpdev.dev/contacto',
    type: 'website',
  },
};

export default function ContactoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
