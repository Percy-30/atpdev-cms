import Link from 'next/link';
import { ShieldCheck, Scale, AlertTriangle, CheckCircle2, ArrowLeft, ExternalLink, HelpCircle } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Términos y Condiciones de Uso — Chamba Pro',
  description: 'Términos y condiciones de uso de la plataforma Chamba Pro. Descargo de responsabilidad, naturaleza informativa no gubernamental y política de uso gratuito sin cobros.',
  alternates: {
    canonical: 'https://empleos.atpdev.dev/terminos-y-condiciones',
  },
};

export default function TerminosCondicionesPage() {
  return (
    <div className="min-h-screen bg-[#070d14] text-slate-100 font-sans py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Navigation Breadcrumb */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-mono text-emerald-400 hover:text-emerald-300 transition-colors"
        >
          <ArrowLeft size={14} />
          <span>Volver al inicio de Chamba Pro</span>
        </Link>

        {/* Header Hero */}
        <div className="space-y-4 border-b border-white/10 pb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-semibold">
            <Scale size={14} />
            <span>Condiciones de Servicio & Descargo Legal</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black font-display text-white tracking-tight">
            Términos y Condiciones de Uso
          </h1>
          <p className="text-sm text-slate-400 leading-relaxed max-w-2xl">
            Bienvenido a <strong>Chamba Pro</strong>. Al acceder, navegar y utilizar los servicios provistos en este sitio web (incluidos <code>empleos.atpdev.dev</code> y <code>chamba.atpdev.dev</code>), aceptas los siguientes términos de forma íntegra y sin reservas.
          </p>
        </div>

        {/* Content Sections */}
        <div className="space-y-8 text-sm text-slate-300 leading-relaxed">
          
          {/* Section 1: Descargo de no afiliación oficial */}
          <section className="glass-card p-6 sm:p-8 rounded-3xl space-y-4 border border-amber-500/30 bg-gradient-to-br from-amber-950/20 to-slate-900">
            <h2 className="text-lg font-bold text-amber-400 flex items-center gap-2 font-display">
              <AlertTriangle size={20} />
              <span>1. Descargo Expreso de No Afiliación Gubernamental (Disclaimer)</span>
            </h2>
            <p>
              <strong>Chamba Pro es una iniciativa privada, independiente y estrictamente informativa.</strong> Este sitio web NO es un portal oficial del Estado Peruano, no representa a la Autoridad Nacional del Servicio Civil (SERVIR), ni a ningún ministerio, entidad pública o empresa privada.
            </p>
            <p>
              Toda la información sobre convocatorias CAS (D.L. 1057), régimen 728, 276 o locación de servicios es recopilada de fuentes de acceso público oficial del Estado (portales de transparencia, diarios oficiales y páginas de convocatorias). La decisión final, evaluación y selección de personal corresponde con exclusividad a las entidades convocantes.
            </p>
          </section>

          {/* Section 2: Gratuidad total y prevención de fraudes */}
          <section className="glass-card p-6 sm:p-8 rounded-3xl space-y-4 border border-white/10">
            <h2 className="text-lg font-bold text-white flex items-center gap-2 font-display">
              <ShieldCheck className="text-emerald-400" size={18} />
              <span>2. Política de Gratuidad Total y Alerta Anti-Estafas</span>
            </h2>
            <p>
              El uso de Chamba Pro, la consulta de puestos laborales, la descarga de bases oficiales y el uso de nuestras herramientas (Calculadora de Sueldo, Generador de CV, Simulador IA) es <strong>100% gratuito</strong>.
            </p>
            <p>
              <strong>Advertencia al postulante:</strong> Ninguna institución pública del Estado Peruano cobra dinero por postular a un puesto de trabajo ni por "apartar una plaza". Si alguien te solicita pagos para tramitar tu postulación, estás frente a un intento de estafa. Chamba Pro promueve activamente la meritocracia y la transparencia en el empleo.
            </p>
          </section>

          {/* Section 3: Uso de Herramientas Interactivas */}
          <section className="glass-card p-6 sm:p-8 rounded-3xl space-y-4 border border-white/10">
            <h2 className="text-lg font-bold text-white flex items-center gap-2 font-display">
              <CheckCircle2 className="text-emerald-400" size={18} />
              <span>3. Uso de Herramientas y Simuladores</span>
            </h2>
            <p>
              Las herramientas interactivas disponibles en el sitio:
            </p>
            <ul className="space-y-2 list-disc list-inside text-slate-300">
              <li>
                <strong>Calculadora de Sueldo Neto CAS:</strong> Proporciona estimaciones ilustrativas basadas en las tasas vigentes de retención de ONP (13%), AFP (fondo + comisión aproximada) e impuesto a la renta de 4ta/5ta categoría. No sustituye a una liquidación de nómina emitida por la Oficina de Recursos Humanos de tu empleador.
              </li>
              <li>
                <strong>Generador de CV y Simulador IA:</strong> Son herramientas formativas de preparación personal. El usuario es el único responsable de la veracidad de la información consignada en su Hoja de Vida al postular ante la entidad.
              </li>
            </ul>
          </section>

          {/* Section 4: Publicidad y Enlaces Externos */}
          <section className="glass-card p-6 sm:p-8 rounded-3xl space-y-4 border border-white/10">
            <h2 className="text-lg font-bold text-white flex items-center gap-2 font-display">
              <ExternalLink className="text-emerald-400" size={18} />
              <span>4. Red de Publicidad (Google AdSense) y Enlaces a Terceros</span>
            </h2>
            <p>
              Para financiar los costos de infraestructura, servidores y desarrollo, el sitio puede exhibir publicidad programática suministrada por Google AdSense y redes asociadas, debidamente identificadas como espacios patrocinados.
            </p>
            <p>
              Chamba Pro no ejerce control editorial sobre los productos o servicios ofrecidos por anunciantes terceros ni sobre los portales externos a los que se redirige al postulante.
            </p>
          </section>

          {/* Section 5: Modificaciones del Servicio */}
          <section className="glass-card p-6 sm:p-8 rounded-3xl space-y-4 border border-white/10">
            <h2 className="text-lg font-bold text-white flex items-center gap-2 font-display">
              <HelpCircle className="text-emerald-400" size={18} />
              <span>5. Contacto y Reclamaciones</span>
            </h2>
            <p>
              Nos reservamos el derecho de modificar o actualizar estos términos en cualquier momento. Si tienes dudas o deseas reportar una convocatoria desactualizada o fraudulenta, contáctanos a través de nuestro{' '}
              <Link href="/contacto" className="text-emerald-400 font-bold hover:underline">
                Canal de Contacto y Soporte
              </Link>.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
